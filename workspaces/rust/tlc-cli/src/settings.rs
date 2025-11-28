use config::{Config, ConfigError, Environment, File};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[allow(dead_code)]
pub struct Settings {
    pub output: String,
    pub concurrency: usize,
}

impl Settings {
    pub fn new() -> Result<Self, ConfigError> {
        let s = Config::builder()
            .set_default("output", "./data")?
            .set_default("concurrency", 5)?
            .add_source(File::with_name("tlc-cli").required(false))
            .add_source(Environment::with_prefix("TLC"))
            .build()?;

        s.try_deserialize()
    }
}
