use clap::{Parser, Subcommand, Args};

#[derive(Parser)]
#[command(name = "tlc-cli")]
#[command(about = "NYC TLC Data Downloader CLI", long_about = None)]
pub struct Cli {
    #[command(subcommand)]
    pub command: Option<Commands>,
}

#[derive(Subcommand)]
pub enum Commands {
    /// Download TLC data
    Download(DownloadArgs),
    /// Audit local data against server
    Audit(AuditArgs),
    /// Interactive wizard mode
    Wizard,
}

#[derive(Args, Debug, Clone)]
pub struct DownloadArgs {
    /// Data type to download (yellow, green, fhv, fhvhv)
    #[arg(short, long)]
    pub r#type: Option<String>,

    /// Start date (YYYY-MM)
    #[arg(long)]
    pub start: Option<String>,

    /// End date (YYYY-MM)
    #[arg(long)]
    pub end: Option<String>,

    /// Output directory
    #[arg(short, long, default_value = "./data")]
    pub output: String,

    /// Concurrency limit
    #[arg(short, long, default_value_t = 5)]
    pub concurrency: usize,
}

#[derive(Args, Debug)]
pub struct AuditArgs {
    /// Data type to audit
    #[arg(short, long)]
    pub r#type: String,

    /// Output directory to check
    #[arg(short, long, default_value = "./data")]
    pub output: String,
}
