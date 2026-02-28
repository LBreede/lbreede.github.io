# lbreede.github.io

Personal website with a Windows 95-inspired desktop UI.

## Current architecture

- Static site: `index.html`, `styles.css`, `script.js`.
- Desktop icons are data-driven via `ICONS` in `script.js` and rendered into `#desktop`.
- Icon positions are draggable and persisted in browser `localStorage` under key `folderPositions`.
- A reset button clears persisted layout (`#reset-layout`).
- External links use `target="_blank"` + `rel="noopener noreferrer"`.
- Identicon app is embedded as a desktop icon + window (`#identicon-window`) and rendered via Rust/WASM.
- WASM artifacts are vendored in `vendor/identicon/` (source lives in a separate Rust project).

## Development workflow

- Use feature branches for all work.
- Keep commits small and focused (UI, behavior, docs/scripts).
- Test locally with a static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` and hard-refresh.

## Sync identicon WASM artifacts

Rebuild and copy the latest `identicon` Rust-WASM package into this repo:

```bash
./scripts/sync-identicon.sh
```

If your `identicon` repo is in a different path:

```bash
IDENTICON_REPO=/absolute/path/to/identicon ./scripts/sync-identicon.sh
```

## TODOs

- App registry:
  - Move desktop icon config and app-window behavior into a unified registry.
  - Make adding a new project mostly config-only.
- General code cleanup:
  - Split `script.js` into focused modules (desktop drag/persist, app windows, identicon integration).
  - Reduce duplicated UI state handling and improve naming consistency.
- Icon templating:
  - Add lightweight templating/helper functions for creating new icons and windows.
  - Consider JSON-driven icon definitions for future growth.
- UX improvements:
  - Add z-order/focus management for multiple windows.
  - Add keyboard accessibility and better mobile behavior.
- Tooling:
  - Add lint/format scripts and a small local smoke test checklist.
