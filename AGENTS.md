# AGENTS.md

React hook and provider for copying with the Clipboard API: `useClipboardApi`, `ClipboardProvider`.

## Layout

- Source: `src/*.{ts,tsx}`. Public API only through `src/index.ts`
- Types: `src/types/<name>.ts`, re-exported from `src/types/index.ts`
- Tests: `src/__tests__/<name>.test.{ts,tsx}`
- React 18 is the floor. No React 19 only APIs (`use`, `<Context value>`)
- `userEvent.setup()` replaces `navigator.clipboard`. Call it before stubbing
- Build: tsup to `dist/` (ESM `.mjs`, CJS `.js`, `.d.mts` + `.d.ts`)

## Code

- TDD: failing test first, even for bug fixes
- Vitest + `@testing-library/react`, jsdom environment. `renderHook` for hooks, `render` + `userEvent` for components
- `build.test.ts` runs tsup in the node environment (`// @vitest-environment node`)
- Stub browser globals with `vi.stubGlobal`. Restore with `vi.unstubAllGlobals()` in `afterEach`
- Coverage stays at 100%. Vitest thresholds enforce it
- Named exports only. No `export *`, no `export default`
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
- Blocked: TypeScript 7 (typescript-eslint needs <6.1). jsdom 30 and lint-staged 17 (need Node 22.22+). tsdown (npm 10 arborist crash). `conventional-changelog-conventionalcommits` 10 (needs writer 9, semantic-release ships 8)
- Node 22.12+ locally and in CI

## Verify

`npm run test:ci`, `npm run lint`, `npm run typecheck`, `npm run build`

Packaging changes: also run `npm run check:package` (publint + attw)

## Git

- Atomic Conventional Commits. commitlint enforces them. Footer lines stay under 100 characters
- semantic-release publishes from `main` and owns `version` and `CHANGELOG.md`. Never edit them by hand
- npm publishes through trusted publishing (GitHub OIDC). No `NPM_TOKEN` secret
- `docs`, `refactor`, `perf`, `style`, `build` cut a patch release. `chore`, `ci`, `test` don't
- Run `git pull --rebase origin main` before pushing

## Docs

- README stays lean: why, install, quick start, API, requirements. Depth goes in `docs/*.md`
- Long examples go in `<details>`
- Prose: lead with the point, paragraphs under 240 characters, no em dashes, no filler
