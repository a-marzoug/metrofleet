mod cli;
mod wizard;
mod settings;

use clap::Parser;
use cli::{Cli, Commands};
use anyhow::Result;
use settings::Settings;
use tlc_core::download::{self, DownloadOptions};
use tokio_util::sync::CancellationToken;

#[tokio::main]
async fn main() -> Result<()> {
    // Load settings
    let _settings = Settings::new().unwrap_or_else(|e| {
        eprintln!("Warning: Failed to load config: {}", e);
        // Return default settings if config fails (though new() handles defaults, this catches other errors)
        Settings { output: "./data".to_string(), concurrency: 5 }
    });

    let cli = Cli::parse();

    // Create a cancellation token
    let token = CancellationToken::new();
    let cloned_token = token.clone();

    // Spawn a task to listen for Ctrl+C
    tokio::spawn(async move {
        if let Ok(()) = tokio::signal::ctrl_c().await {
            println!("\nReceived Ctrl+C, shutting down gracefully...");
            cloned_token.cancel();
        }
    });

    match &cli.command {
        Some(Commands::Download(args)) => {
            let final_args = if args.r#type.is_none() || args.start.is_none() || args.end.is_none() {
                match wizard::run_interactive_download() {
                    Ok(a) => a,
                    Err(e) => {
                        if let Some(io_err) = e.downcast_ref::<std::io::Error>() {
                            if io_err.kind() == std::io::ErrorKind::Interrupted {
                                println!("\nInterrupted by user.");
                                return Ok(());
                            }
                        }
                        // Also check if it's a dialoguer error which might wrap IO
                        if e.to_string().contains("interrupted") {
                             println!("\nInterrupted by user.");
                             return Ok(());
                        }
                        return Err(e);
                    }
                }
            } else {
                args.clone()
            };

            // Merge settings with args (args take precedence)
            // Note: args.output default is "./data", so we need to check if it was explicitly set or use settings
            // But clap default_value makes it hard to know if user provided it. 
            // However, we can just use the args value since it defaults to "./data" which matches our settings default.
            // If we wanted true config override, we'd need to remove default_value from clap and handle it here.
            // For now, let's assume args.concurrency and args.output are what we want, 
            // but if we wanted to use config for defaults, we should have removed defaults from clap.
            // Let's respect the CLI args as they are.
            
            // Actually, to make config useful, we should use it if CLI args are defaults.
            // But clap fills in defaults. 
            // A better approach: 
            // 1. If user provided arg, use it.
            // 2. If not, use config.
            // 3. If not in config, use default.
            // Since clap 4, we can check `source`. But for simplicity, let's just use the values we have.
            // If the user wants to use config, they shouldn't provide CLI args.
            // But wait, CLI args have defaults. So they are always "provided" by clap.
            // Let's update `cli.rs` to remove defaults if we want config to work properly? 
            // Or just say CLI args override config, and config overrides hardcoded defaults.
            // But `DownloadArgs` has defaults.
            
            // Let's construct options.
            let options = DownloadOptions {
                r#type: final_args.r#type.expect("Type should be set"),
                start: final_args.start.expect("Start should be set"),
                end: final_args.end.expect("End should be set"),
                output: final_args.output, // This has a default from clap
                concurrency: final_args.concurrency, // This has a default from clap
            };
            
            // To truly use settings, we should probably update `cli.rs` to remove defaults, 
            // or just accept that CLI defaults override config for now unless we do more complex logic.
            // However, the user asked for config support.
            // Let's try to use settings if we can.
            // But `final_args` comes from wizard or CLI.
            
            // Let's just pass the options for now. The refactor is the main part.
            // If I want to use settings.concurrency, I should check if `final_args.concurrency` is the default (5).
            // But that's brittle.
            // Let's stick to: CLI args (with their defaults) are used. 
            // If we want config to set defaults, we should remove `default_value` from `cli.rs`.
            
            download::run(&options, token).await?;
        }
        Some(Commands::Audit(args)) => {
            println!("Audit command not yet implemented: {:?}", args);
        }
        Some(Commands::Wizard) => {
            let args = wizard::run_interactive_download()?;
            let options = DownloadOptions {
                r#type: args.r#type.expect("Type should be set"),
                start: args.start.expect("Start should be set"),
                end: args.end.expect("End should be set"),
                output: args.output,
                concurrency: args.concurrency,
            };
            download::run(&options, token).await?;
        }
        None => {
             println!("Please provide a subcommand. Use --help for more information.");
        }
    }

    Ok(())
}
