# TLC-CLI 

A high-performance, concurrent CLI tool for downloading NYC Taxi & Limousine Commission (TLC) Trip Record data.

## Features

- **High Performance**: Built with Rust and `tokio` for efficient asynchronous I/O.
- **Concurrent Downloads**: Downloads multiple files in parallel to maximize bandwidth usage.
- **Smart Skipping**: Skips files that already exist locally.
- **Progress Tracking**: Rich visual feedback with progress bars for individual files and overall status.
- **Cross-Platform**: Works on Linux, macOS, and Windows.

## Installation

Ensure you have Rust installed. Then build the project:

```bash
cd workspaces/rust
cargo build --release
```

The binary will be available at `target/release/tlc-cli`.

## Usage

### Interactive Mode (Wizard)

If you prefer a guided experience, simply run the tool without arguments or use the `wizard` command:

```bash
tlc-cli
# or
tlc-cli wizard
```

You will be prompted to select the data type, date mode (single month or range), and output directory using a colorful interactive interface.

### Download Data (CLI Mode)

Download specific datasets by type and date range directly from the command line.

```bash
tlc-cli download --type <TYPE> --start <YYYY-MM> --end <YYYY-MM> --output <DIR>
```

**Arguments:**

- `--type`: Data type (e.g., `yellow`, `green`, `fhv`, `fhvhv`).
- `--start`: Start date in `YYYY-MM` format.
- `--end`: End date in `YYYY-MM` format.
- `--output`: Output directory (default: `./data`).
- `--concurrency`: Number of concurrent downloads (default: 5).

**Example:**

Download Yellow Taxi data for the first quarter of 2023:

```bash
cargo run -- download --type yellow --start 2023-01 --end 2023-03 --output ./nyc_data
```

### Help

View all available commands and options:

```bash
tlc-cli --help
```

## Project Structure

- `src/main.rs`: Entry point.
- `src/cli.rs`: Command-line argument definitions.
- `src/download.rs`: Core download logic.
- `src/utils.rs`: Utility functions.
