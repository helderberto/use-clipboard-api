# Changelog

## [2.0.0](https://github.com/helderberto/use-clipboard-api/compare/v1.5.1...v2.0.0) (2026-10-19)

### ⚠ BREAKING CHANGES

* import the hook by name: import { useClipboardApi }.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>

### Features

* remove the default export ([d716cd9](https://github.com/helderberto/use-clipboard-api/commit/d716cd90ac9efd15836ad094d8ad4c826cb607ee))

### Documentation

* add v1 to v2 migration ([5b1629a](https://github.com/helderberto/use-clipboard-api/commit/5b1629aa7f216891a35848082d5170aea61f0ec3))

## [1.5.1](https://github.com/helderberto/use-clipboard-api/compare/v1.5.0...v1.5.1) (2026-10-19)

### Code Refactoring

* replace export * with named exports ([e0b3962](https://github.com/helderberto/use-clipboard-api/commit/e0b3962a4e1d5f86b4321de03458f735d92435ec))

## [1.5.0](https://github.com/helderberto/use-clipboard-api/compare/v1.4.1...v1.5.0) (2026-10-19)

### Features

* add Copy component with asChild ([1205e52](https://github.com/helderberto/use-clipboard-api/commit/1205e52e30bd52fddf16f451c3cb07b0244b4358)), closes [#862](https://github.com/helderberto/use-clipboard-api/issues/862)

### Documentation

* document Copy component ([27081e4](https://github.com/helderberto/use-clipboard-api/commit/27081e469a1d3b2f62aa37c3585dde95b768a5f2))

## [1.4.1](https://github.com/helderberto/use-clipboard-api/compare/v1.4.0...v1.4.1) (2026-10-19)

### Documentation

* note the conventionalcommits preset pin ([4852f95](https://github.com/helderberto/use-clipboard-api/commit/4852f95c0818163dbfea7c43f525eac267b19e35))

### Build System

* list docs, build, refactor and style in the changelog ([a3dea16](https://github.com/helderberto/use-clipboard-api/commit/a3dea16a2c1c83d821cd8162fd4d6d6782a14866))

# [1.4.0](https://github.com/helderberto/use-clipboard-api/compare/v1.3.0...v1.4.0) (2026-10-19)


### Features

* add copyFrom to copy an element by ref ([0e08f83](https://github.com/helderberto/use-clipboard-api/commit/0e08f8335f5624f1492ce3b3a8f1e3884b40e57d)), closes [#859](https://github.com/helderberto/use-clipboard-api/issues/859)

# [1.3.0](https://github.com/helderberto/use-clipboard-api/compare/v1.2.2...v1.3.0) (2026-10-19)


### Features

* add getCopyProps prop getter ([7bb0d73](https://github.com/helderberto/use-clipboard-api/commit/7bb0d73d9f3a295877de4cbc063629bc134dd912)), closes [#857](https://github.com/helderberto/use-clipboard-api/issues/857)

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
