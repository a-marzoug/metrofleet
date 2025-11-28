use thiserror::Error;

#[derive(Error, Debug)]
pub enum TlcError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    #[error("Network error: {0}")]
    Network(#[from] reqwest::Error),
    #[error("Middleware error: {0}")]
    Middleware(#[from] reqwest_middleware::Error),
    #[error("Invalid date format: {0}")]
    InvalidDate(String),
    #[error("Invalid month: {0}")]
    InvalidMonth(i32),
    #[error("Missing required argument: {0}")]
    MissingArgument(String),
    #[error("Download failed: {0}")]
    DownloadFailed(String),
    #[error("Cancelled")]
    Cancelled,
    #[error("Other: {0}")]
    Other(#[from] anyhow::Error),
}
