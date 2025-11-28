mod cli;
mod download;
mod utils;
mod wizard;

use clap::Parser;
use cli::{Cli, Commands};
use anyhow::Result;

use tokio_util::sync::CancellationToken;

#[tokio::main]
async fn main() -> Result<()> {
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
                wizard::run_interactive_download()?
            } else {
                args.clone()
            };
            download::run(&final_args, token).await?;
        }
        Some(Commands::Audit(args)) => {
            println!("Audit command not yet implemented: {:?}", args);
        }
        Some(Commands::Wizard) => {
            let args = wizard::run_interactive_download()?;
            download::run(&args, token).await?;
        }
        None => {
             // Default to wizard if no command provided, or show help?
             // For now let's show help to be standard, but user asked for "tlc-cli download" without flags to trigger wizard.
             // The clap parser handles "tlc-cli" (no args) -> None.
             // "tlc-cli download" (no flags) -> Some(Download(args)) with Nones.
             println!("Please provide a subcommand. Use --help for more information.");
        }
    }

    Ok(())
}
