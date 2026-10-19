# AGENTS.md

React hook for copying text with the Clipboard API: `useClipboardApi`.

## Layout

- Source: `src/*.ts`. Public API only through `src/index.ts`
- Tests: `src/__tests__/<name>.test.ts`
- Build: tsup to `dist/` (ESM `.mjs`, CJS `.js`, `.d.mts` + `.d.ts`)

## Code

- TDD: failing test first, even for bug fixes
- Vitest + `@testing-library/react` `renderHook`, jsdom environment
- Stub browser globals with `vi.stubGlobal`. Restore with `vi.unstubAllGlobals()` in `afterEach`
- Coverage stays at 100%. Vitest thresholds enforce it
- Minimum code. No speculative options or abstractions
- No comments, except a short non-obvious "why"
- `strict` TypeScript. Tests are type-checked too

## Lint

- ESLint 10 flat config in `eslint.config.mjs`
- `typescript-eslint`, `@eslint-react/eslint-plugin`, `eslint-plugin-react-hooks` on `src`
- `@vitest/eslint-plugin` recommended on `src/__tests__`
- `eslint-plugin-react` is out: no ESLint 10 support

## Dependencies

- Exact pins only. `.npmrc` sets `save-exact` and `save-prefix=""`. Never hand-write `^` or `~`
- Run `npm audit fix` after bumps
- Blocked: TypeScript 7 (typescript-eslint needs <6.1). jsdom 30 and lint-staged 17 (need Node 22.22+). tsdown (npm 10 arborist crash)
- Node 22.12+ locally and in CI

## Verify

`npm run test:ci`, `npm run lint`, `npm run typecheck`, `npm run build`

Packaging changes: also run `npm run check:package` (publint + attw)

## Git

- Atomic Conventional Commits. commitlint enforces them. Footer lines stay under 100 characters
- Release by hand: bump `version` in `package.json` and add a `CHANGELOG.md` entry ([Keep a Changelog](https://keepachangelog.com))

## Docs

- README stays lean: why, install, quick start, API, requirements. Depth goes in `docs/*.md`
- Long examples go in `<details>`
- Prose: lead with the point, paragraphs under 240 characters, no em dashes, no filler
