use crate::cli::DownloadArgs;
use anyhow::Result;
use dialoguer::console::Term;
use dialoguer::{theme::ColorfulTheme, Input, Select};

pub fn run_interactive_download() -> Result<DownloadArgs> {
    let theme = ColorfulTheme::default();
    let term = Term::stdout();

    term.clear_screen()?;
    println!("🚖 Welcome to TLC-cli Interactive Mode 🚖");
    println!("-------------------------------------------");
    println!("Use arrow keys to navigate. Press 'Esc' or Ctrl+C to quit.");

    let types = vec!["yellow", "green", "fhv", "fhvhv"];
    let type_selection = Select::with_theme(&theme)
        .with_prompt("Select Data Category")
        .default(0)
        .items(&types)
        .interact_opt()?
        .ok_or_else(|| anyhow::anyhow!("Interrupted by user"))?;

    let selected_type = types[type_selection].to_string();

    let modes = vec!["Single Month", "Date Range"];
    let mode_selection = Select::with_theme(&theme)
        .with_prompt("Select Mode")
        .default(0)
        .items(&modes)
        .interact_opt()?
        .ok_or_else(|| anyhow::anyhow!("Interrupted by user"))?;

    let start_date: String;
    let end_date: String;

    let validate_date = |input: &String| -> Result<(), String> {
        if tlc_core::utils::parse_date(input).is_ok() {
            Ok(())
        } else {
            Err("Invalid date format. Please use YYYY-MM (e.g., 2023-01)".to_string())
        }
    };

    if mode_selection == 0 {
        // Single Month
        let date: String = Input::with_theme(&theme)
            .with_prompt("Enter Date (YYYY-MM)")
            .validate_with(validate_date)
            .interact_text()?;
        start_date = date.clone();
        end_date = date;
    } else {
        // Date Range
        start_date = Input::with_theme(&theme)
            .with_prompt("Start Date (YYYY-MM)")
            .validate_with(validate_date)
            .interact_text()?;

        end_date = Input::with_theme(&theme)
            .with_prompt("End Date (YYYY-MM)")
            .validate_with(validate_date)
            .interact_text()?;
    }

    let output: String = Input::with_theme(&theme)
        .with_prompt("Output Directory")
        .default("./data".to_string())
        .interact_text()?;

    Ok(DownloadArgs {
        r#type: Some(selected_type),
        start: Some(start_date),
        end: Some(end_date),
        output,
        concurrency: 5,
    })
}
