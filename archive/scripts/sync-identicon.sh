#!/usr/bin/env bash
set -euo pipefail

IDENTICON_REPO="${IDENTICON_REPO:-$HOME/Work/identicon}"
TARGET_DIR="vendor/identicon"

if ! command -v wasm-pack >/dev/null 2>&1; then
  echo "error: wasm-pack is required but not installed" >&2
  exit 1
fi

if [ ! -d "$IDENTICON_REPO" ]; then
  echo "error: identicon repo not found at: $IDENTICON_REPO" >&2
  echo "hint: set IDENTICON_REPO=/path/to/identicon" >&2
  exit 1
fi

if [ ! -f "$IDENTICON_REPO/Cargo.toml" ]; then
  echo "error: not a Rust project (missing Cargo.toml): $IDENTICON_REPO" >&2
  exit 1
fi

echo "Building identicon wasm in $IDENTICON_REPO"
(
  cd "$IDENTICON_REPO"
  wasm-pack build --target web --release
)

PKG_DIR="$IDENTICON_REPO/pkg"
if [ ! -d "$PKG_DIR" ]; then
  echo "error: build output missing: $PKG_DIR" >&2
  exit 1
fi

echo "Syncing artifacts to $TARGET_DIR"
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"
cp -R "$PKG_DIR"/* "$TARGET_DIR"/

echo "Done. Updated $TARGET_DIR"
