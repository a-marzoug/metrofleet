use crate::cli::DownloadArgs;
use crate::utils::{generate_date_range, generate_url};
use anyhow::{Context, Result};
use indicatif::{MultiProgress, ProgressBar, ProgressStyle};
use reqwest::Client;
use std::path::Path;
use std::sync::Arc;
use tokio::fs::{self, File};
use tokio::io::AsyncWriteExt;
use tokio::sync::Semaphore;

use tokio_util::sync::CancellationToken;

pub async fn run(args: &DownloadArgs, token: CancellationToken) -> Result<()> {
    let r#type = args.r#type.as_ref().ok_or_else(|| anyhow::anyhow!("Type is required"))?;
    let start = args.start.as_ref().ok_or_else(|| anyhow::anyhow!("Start date is required"))?;
    let end = args.end.as_ref().ok_or_else(|| anyhow::anyhow!("End date is required"))?;

    let dates = generate_date_range(start, end)?;
    let total_files = dates.len();
    
    println!("Found {} files to process for type '{}'", total_files, r#type);
    
    fs::create_dir_all(&args.output).await.context("Failed to create output directory")?;

    let client = Client::new();
    let semaphore = Arc::new(Semaphore::new(args.concurrency));
    let m = MultiProgress::new();
    let overall_pb = m.add(ProgressBar::new(total_files as u64));
    overall_pb.set_style(ProgressStyle::default_bar()
        .template("{spinner:.green} [{elapsed_precise}] [{bar:40.cyan/blue}] {pos}/{len} ({eta}) {msg}")?
        .progress_chars("#>-"));
    overall_pb.set_message("Overall Progress");

    let mut handles = Vec::new();

    for (year, month) in dates {
        let url = generate_url(r#type, year, month);
        let filename = format!("{}_tripdata_{}-{:02}.parquet", r#type, year, month);
        let output_path = Path::new(&args.output).join(&filename);
        
        let permit = semaphore.clone().acquire_owned().await?;
        let client = client.clone();
        let pb = m.add(ProgressBar::new(0));
        pb.set_style(ProgressStyle::default_bar()
            .template("{spinner:.green} {msg} [{bar:20}] {bytes}/{total_bytes} ({bytes_per_sec})")?
            .progress_chars("#>-"));
        pb.set_message(format!("{}...", filename));

        let overall_pb = overall_pb.clone();

        let token = token.clone();
        let handle = tokio::spawn(async move {
            let _permit = permit; // Hold permit until end of scope
            
            // Check for cancellation before starting
            if token.is_cancelled() {
                return Ok::<(), anyhow::Error>(());
            }
            
            if output_path.exists() {
                pb.finish_with_message(format!("{} (Skipped)", filename));
                overall_pb.inc(1);
                return Ok::<(), anyhow::Error>(());
            }

            let response = tokio::select! {
                res = client.get(&url).send() => res?,
                _ = token.cancelled() => {
                    return Ok(());
                }
            };
            
            if !response.status().is_success() {
                pb.finish_with_message(format!("{} (Failed: {})", filename, response.status()));
                overall_pb.inc(1);
                return Err(anyhow::anyhow!("Failed to download {}: {}", url, response.status()));
            }

            let total_size = response.content_length().unwrap_or(0);
            pb.set_length(total_size);

            let mut file = File::create(&output_path).await?;
            let mut stream = response.bytes_stream();

            while let Some(chunk) = futures::StreamExt::next(&mut stream).await {
                let chunk = chunk?;
                
                tokio::select! {
                     _ = file.write_all(&chunk) => {},
                     _ = token.cancelled() => {
                         // Clean up partial file if cancelled
                         drop(file);
                         let _ = fs::remove_file(&output_path).await;
                         return Ok(());
                     }
                }
                pb.inc(chunk.len() as u64);
            }

            pb.finish_with_message(format!("{} (Done)", filename));
            overall_pb.inc(1);
            Ok(())
        });
        handles.push(handle);
    }

    for handle in handles {
        if let Err(e) = handle.await? {
             eprintln!("Download error: {}", e);
        }
    }

    overall_pb.finish_with_message("All downloads complete");
    Ok(())
}
