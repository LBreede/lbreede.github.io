# Project Notes For Agents

## Overview

- This repo is a static personal site with a Windows 95 desktop aesthetic.
- Core files:
  - `index.html`: desktop container, identicon window markup, footer/nav.
  - `styles.css`: desktop/icon/window styling.
  - `script.js`: icon rendering, drag/persist behavior, identicon WASM integration.
- Secondary content:
  - `readme/` contains generated profile/readme artifacts and Python builders.
  - `vendor/identicon/` contains generated WASM artifacts copied from an external Rust repo.

## Current behavior

- Desktop icons are rendered from `ICONS` in `script.js`.
- Dragging:
  - Pointer events.
  - Drag threshold prevents accidental drag on click.
  - Native link/image drag is disabled to preserve custom dragging.
- Persistence:
  - Positions stored in `localStorage` key `folderPositions`.
  - Corrupt JSON is handled by clearing the stored value.
- Reset:
  - `#reset-layout` clears stored positions and reloads the page.
- Identicon app:
  - Opened via icon action (`data-app-action="open-identicon"`).
  - Loads `./vendor/identicon/identicon.js` dynamically.
  - Uses `identicon_size()` and `render_identicon()` to paint canvas.

## Important maintenance constraints

- Keep icon additions data-driven via the `ICONS` array.
- Do not hardcode many icon blocks into `index.html`.
- Keep `vendor/identicon` committed so site deploys standalone (e.g. GitHub Pages).
- Use `scripts/sync-identicon.sh` to refresh WASM artifacts after Rust-side changes.

## Branch and release workflow

- Work on feature branches.
- Merge latest `main` early if both desktop behavior and app integrations changed.
- If GitHub reports conflicts in `index.html`, `script.js`, `styles.css`, prefer:
  - The refactored desktop architecture from the maintainability branch.
  - Then layer feature-specific app integrations on top.

## TODOs

- App registry:
  - Introduce a unified registry for icons + app windows + actions.
  - Remove one-off app wiring from `setupIdenticonWidget`.
- General code cleanup:
  - Split `script.js` into smaller modules.
  - Isolate desktop drag/persist logic from app logic.
- Icon/window templating:
  - Add reusable helpers/templates for icon and window markup generation.
  - Make adding a project a config-only operation.
- Accessibility and UX:
  - Keyboard navigation for icons.
  - Focus/stack management for multiple windows.
  - Better responsive behavior for smaller screens.
- Tooling:
  - Add linting and formatting scripts.
  - Add a lightweight smoke-test checklist for PRs.
