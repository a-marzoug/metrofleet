.PHONY: rust-build rust-run rust-test

rust-build:
	cd workspaces/rust && cargo build

rust-run:
	cd workspaces/rust && cargo run -- --help

rust-test:
	cd workspaces/rust && cargo test
