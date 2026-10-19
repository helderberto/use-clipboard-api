# Changelog

## [1.0.0] - 2026-10-19

### Breaking

- `useClipboardApi` returns `{ copiedValue, copy, error, isSupported }` instead of a tuple.
- `error` is the `Error` the browser threw instead of a string.
- The peer range is now `react >=18.0.0`.
- Deep imports into `dist/` no longer resolve. Import from the package root.

See the [migration guide](docs/migration.md).

### Added

- `timeout` option that resets `copiedValue` after a delay.
- `isSupported` flag. It is `false` on the server and in browsers without the Clipboard API.
- Named export `useClipboardApi`, next to the default export.
- Exported types `UseClipboardApiOptions` and `UseClipboardApiResult`.
- ESM and CommonJS builds with an `exports` map, `sideEffects: false` and dual type declarations.

### Changed

- `copy` keeps the same identity across renders.
- `copy` ignores results that arrive after unmount or after a newer copy.

### Removed

- The `console.error` call on failed copies.
- The example app in `examples/app`.

### Fixed

- CommonJS consumers can `require` the package. The previous build shipped ESM under `main`.
- Non-`Error` rejections are wrapped in an `Error`.

[1.0.0]: https://github.com/helderberto/use-clipboard-api/releases/tag/v1.0.0
