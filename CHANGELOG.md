# Changelog

## [1.2.2](https://github.com/helderberto/use-clipboard-api/compare/v1.2.1...v1.2.2) (2026-10-19)

## [1.2.1](https://github.com/helderberto/use-clipboard-api/compare/v1.2.0...v1.2.1) (2026-10-19)

# [1.2.0](https://github.com/helderberto/use-clipboard-api/compare/v1.1.0...v1.2.0) (2026-10-19)


### Features

* add ClipboardProvider with data-copy attributes ([dbd1904](https://github.com/helderberto/use-clipboard-api/commit/dbd19040b51c9c90d502a6373939168ea246631f)), closes [#849](https://github.com/helderberto/use-clipboard-api/issues/849)

# [1.1.0](https://github.com/helderberto/use-clipboard-api/compare/v1.0.0...v1.1.0) (2026-10-19)


### Features

* copy rich content via ClipboardItem ([c078a4f](https://github.com/helderberto/use-clipboard-api/commit/c078a4fd490a6f0bb9baae21564ea08c98bb1225)), closes [#848](https://github.com/helderberto/use-clipboard-api/issues/848)

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
