# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Cross-agent instructions live in [AGENTS.md](./AGENTS.md), with scoped `AGENTS.md` files under most `src/*` folders and `test/`. Read the nearest scoped file before editing.

## Project

`petkit-device-cards` is a Home Assistant custom dashboard card (built with Lit) that renders a summary view of a single PetKit device. The card takes a `device_id`, auto-groups the device's entities into Controls / Sensors / Configuration / Diagnostic sections, surfaces problem entities visually, and supports tap/hold/double-tap actions. Bundles to a single JS module loaded by HACS.

## Package Manager

Yarn. Do not use `npm`.

## Commands

- `yarn build` — Parcel build to `dist/petkit-device-cards.js`
- `yarn watch` — Parcel watch mode
- `yarn format` — Prettier with `@trivago/prettier-plugin-sort-imports` + `prettier-plugin-organize-imports`
- `yarn test` — Mocha + ts-node test run
- `yarn test:coverage` — NYC coverage
- `yarn test:watch` — Mocha watch mode
- `yarn update` — `npm-check-updates -u` then `yarn install`

### Running a single test

```bash
TS_NODE_PROJECT='./tsconfig.test.json' npx mocha test/path/to/specific.spec.ts
```

### Diagnosing `yarn test` `ERR_MODULE_NOT_FOUND`

Path aliases (`@cards/*`, `@hass/*`, etc.) are wired through `tsconfig-paths/register` in `.mocharc.json`. A "Cannot find package '@cards/...'" error from ts-node almost always means a **TypeScript compilation error** somewhere in the imported graph, not a real resolution problem. Run:

```bash
npx tsc -p tsconfig.test.json --noEmit
```

Fix the type errors before touching path config or test setup.

## Architecture

### Entry point

`src/index.ts` registers two custom elements with the browser — `petkit-device` (the card) and `petkit-device-editor` (the visual config editor) — and pushes the card type into `window.customCards` so Home Assistant's dashboard picker discovers it. It also kicks off `resolvePoatCardHelpers(globalThis.loadCardHelpers)` at module load so HA's `loadCardHelpers` promise is resolved exactly once per bundle.

### Layered structure

The bundle is organized by responsibility, not by feature. UI lives in `src/cards/` and `src/html/`; everything else feeds data into it.

- **`src/cards/`** — Lit components. `card.ts` is the top-level card; `editor.ts` is the visual config editor; `components/` contains sub-components used by the card; `mixins/` holds reusable Lit class mixins.
- **`src/delegates/`** — Business logic kept independent of Lit. `retrievers/` reaches into HASS state/registries to fetch entities for a device; `utils/` holds pure transforms (filtering, grouping, sorting). Tests should be able to exercise this folder without rendering.
- **`src/html/`** — Small pure functions returning Lit templates (`section`, `state-content`, `percent`, `pet`). Composed by `cards/` — do not put business logic here.
- **`src/theme/`** — Styles and color/threshold helpers (`styles.ts`).
- **`src/hass/`** — Vendored Home Assistant frontend code (types, common helpers, components, data, panels, ws). Treat as upstream-mirrored; document any local divergence.
- **`src/helpers/`** — Project-internal helpers (e.g. `card-helpers.ts` wraps HA's `loadCardHelpers`).
- **`src/types/`** — TypeScript contracts for user config (`config.ts`) and Lovelace shapes (`lovelace.ts`). These represent the public card API; keep them stable.

### Data flow

1. Home Assistant instantiates `<petkit-device>` with a config object containing `device_id` (and optional `title`, `preview_count`, `features`, `*_action`).
2. On each `hass` update, delegates in `src/delegates/retrievers/` resolve the device's entities from the entity/device registries.
3. Delegates in `src/delegates/utils/` partition entities into Controls / Sensors / Configuration / Diagnostic, detect "problem"-class entities, and produce a render-ready data shape.
4. `cards/card.ts` renders sections via `html/` templates and `theme/styles.ts`; problem detection toggles a red border. Tap/hold/double-tap on entity rows fires the action defined in config (default: `more-info`).

### TypeScript path aliases (`tsconfig.json`)

`@cards/*`, `@type/*`, `@hass/*`, `@theme/*`, `@html/*`, `@delegates/*`, `@helpers/*`, `@/*` → `src/*` subfolders. Tests inherit these via `tsconfig.test.json` + `tsconfig-paths/register`.

### TypeScript strictness

`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `verbatimModuleSyntax`, and `experimentalDecorators` (for Lit) are all on. Indexed reads return `T | undefined` — handle accordingly.

### Build

Parcel 2 with `source: src/index.ts` → `module: dist/petkit-device-cards.js`, bundled with `includeNodeModules: true` so the file is drop-in for HA. `@parcel/transformer-inline-string` is available for inlining text assets.

### Test setup

Mocha + ts-node + `tsconfig-paths/register` + `mocha.setup.ts` (JSDOM bootstrap). Chai + Sinon for assertions/spies; `@open-wc/testing` and `@testing-library/dom` for component-level work; `proxyquire` for module-level mocking. Coverage via NYC (Istanbul) with `@istanbuljs/nyc-config-typescript`.
