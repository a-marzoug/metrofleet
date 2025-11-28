use crate::utils::{generate_date_range, generate_url};
use crate::error::TlcError;
use indicatif::{MultiProgress, ProgressBar, ProgressStyle};
use reqwest::Client;
use std::path::Path;
use std::sync::Arc;
use tokio::fs::{self, File};
use tokio::io::AsyncWriteExt;
use tokio::sync::Semaphore;
use tokio_util::sync::CancellationToken;
use futures::StreamExt;
use reqwest_middleware::ClientBuilder;
use reqwest_retry::{RetryTransientMiddleware, policies::ExponentialBackoff};

pub struct DownloadOptions {
    pub r#type: String,
    pub start: String,
    pub end: String,
    pub output: String,
    pub concurrency: usize,
}

pub async fn run(options: &DownloadOptions, token: CancellationToken) -> Result<(), TlcError> {
    let dates = generate_date_range(&options.start, &options.end)?;
    let total_files = dates.len();
    
    println!("Found {} files to process for type '{}'", total_files, options.r#type);
    
    fs::create_dir_all(&options.output).await.map_err(TlcError::Io)?;

    // Configure client with retry logic and HTTP/2
    let retry_policy = ExponentialBackoff::builder().build_with_max_retries(3);
    let client = Client::builder()
        .http2_prior_knowledge() // Try HTTP/2
        .pool_idle_timeout(std::time::Duration::from_secs(30))
        .pool_max_idle_per_host(options.concurrency)
        .build()
        .map_err(TlcError::Network)?;

    let client = ClientBuilder::new(client)
        .with(RetryTransientMiddleware::new_with_policy(retry_policy))
        .build();

    let semaphore = Arc::new(Semaphore::new(options.concurrency));
    // Generate all URLs and filenames first
    let mut tasks = Vec::new();
    for (year, month) in &dates {
        let url = generate_url(&options.r#type, *year, *month);
        let filename = format!("{}_tripdata_{}-{:02}.parquet", options.r#type, year, month);
        tasks.push((url, filename, *year, *month));
    }

    // Fetch total size for progress bar
    println!("Fetching file sizes...");
    let mut total_size = 0;
    let mut sizes = Vec::new();
    
    // We can reuse the client for HEAD requests
    // Use a separate semaphore for HEAD requests to be fast? Or same concurrency?
    // HEAD is cheap, let's use higher concurrency or just same.
    let head_semaphore = Arc::new(Semaphore::new(20)); 
    let mut head_handles = Vec::new();

    for (url, _, _, _) in &tasks {
        let client = client.clone();
        let url = url.clone();
        let permit = head_semaphore.clone().acquire_owned().await.map_err(|e| TlcError::Other(anyhow::anyhow!(e)))?;
        
        head_handles.push(tokio::spawn(async move {
            let _permit = permit;
            let res = client.head(&url).send().await;
            match res {
                Ok(resp) => {
                    if resp.status().is_success() {
                        resp.content_length().unwrap_or(0)
                    } else {
                        0
                    }
                },
                Err(_) => 0,
            }
        }));
    }

    for handle in head_handles {
        let size = handle.await.unwrap_or(0);
        sizes.push(size);
        total_size += size;
    }

    let m = MultiProgress::new();
    let overall_pb = m.add(ProgressBar::new(total_size));
    overall_pb.set_style(ProgressStyle::default_bar()
        .template("{spinner:.green} [{elapsed_precise}] [{bar:40.cyan/blue}] {bytes}/{total_bytes} ({eta}) {msg}")
        .unwrap()
        .progress_chars("#>-"));
    overall_pb.set_message("Overall Progress");

    let mut handles = Vec::new();

    // Zip tasks with sizes
    for ((url, filename, _year, _month), size) in tasks.into_iter().zip(sizes) {
        let output_path = Path::new(&options.output).join(&filename);
        
        let permit = semaphore.clone().acquire_owned().await.map_err(|e| TlcError::Other(anyhow::anyhow!(e)))?;
        let client = client.clone();
        let pb = m.add(ProgressBar::new(size));
        pb.set_style(ProgressStyle::default_bar()
            .template("{spinner:.green} {msg} [{bar:20}] {bytes}/{total_bytes} ({bytes_per_sec})")
            .unwrap()
            .progress_chars("#>-"));
        pb.set_message(format!("{}...", filename));

        let overall_pb = overall_pb.clone();
        let token = token.clone();

        let handle = tokio::spawn(async move {
            let _permit = permit; // Hold permit until end of scope
            
            if token.is_cancelled() {
                return Ok::<(), TlcError>(());
            }
            
            if output_path.exists() {
                pb.finish_with_message(format!("{} (Skipped)", filename));
                overall_pb.inc(size); // Increment by full size if skipped
                return Ok(());
            }

            let response = tokio::select! {
                res = client.get(&url).send() => res.map_err(TlcError::Middleware)?,
                _ = token.cancelled() => {
                    return Ok(());
                }
            };
            
            if !response.status().is_success() {
                pb.finish_with_message(format!("{} (Failed: {})", filename, response.status()));
                // Don't increment overall_pb for failed? Or increment by size?
                // If we don't increment, it won't reach 100%. Let's increment.
                overall_pb.inc(size);
                return Err(TlcError::DownloadFailed(format!("{} (Status: {})", url, response.status())));
            }

            // Update size if it was 0 (unknown)
            let content_len = response.content_length().unwrap_or(0);
            if size == 0 && content_len > 0 {
                pb.set_length(content_len);
                overall_pb.inc_length(content_len);
            }

            let mut file = File::create(&output_path).await.map_err(TlcError::Io)?;
            let mut stream = response.bytes_stream();

            while let Some(chunk) = stream.next().await {
                let chunk = chunk.map_err(TlcError::Network)?;
                let len = chunk.len() as u64;
                
                tokio::select! {
                     res = file.write_all(&chunk) => {
                        res.map_err(TlcError::Io)?;
                     },
                     _ = token.cancelled() => {
                         drop(file);
                         let _ = fs::remove_file(&output_path).await;
                         return Ok(());
                     }
                }
                pb.inc(len);
                overall_pb.inc(len);
            }


            // Basic validation: check if file size matches content length (if known)
            if total_size > 0 {
                 let metadata = file.metadata().await.map_err(TlcError::Io)?;
                 if metadata.len() != total_size {
                     drop(file);
                     let _ = fs::remove_file(&output_path).await;
                     return Err(TlcError::DownloadFailed(format!("File size mismatch for {}", filename)));
                 }
            }

            pb.finish_with_message(format!("{} (Done)", filename));
            // overall_pb.inc(1); // Already incremented in loop
            Ok(())
        });
        handles.push(handle);
    }

    for handle in handles {
        match handle.await {
            Ok(Ok(())) => {},
            Ok(Err(e)) => eprintln!("Download error: {}", e),
            Err(e) => eprintln!("Task join error: {}", e),
        }
    }

    overall_pb.finish_with_message("All downloads complete");
    Ok(())
}
