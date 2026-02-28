# lbreede.github.io

## Sync identicon wasm artifacts

Rebuild and copy the latest `identicon` Rust-WASM package into this repo:

```bash
./scripts/sync-identicon.sh
```

If your `identicon` repo is in a different path:

```bash
IDENTICON_REPO=/absolute/path/to/identicon ./scripts/sync-identicon.sh
```
