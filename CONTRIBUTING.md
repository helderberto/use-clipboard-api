# Contributing

## Setup

You need Node 22.12 or later.

```bash
git clone https://github.com/helderberto/use-clipboard-api.git
cd use-clipboard-api
npm install
```

`npm install` also installs the Git hooks.

## Scripts

| Script                  | What it does                        |
| ----------------------- | ----------------------------------- |
| `npm test`              | Run the tests once                  |
| `npm run test:watch`    | Run the tests in watch mode         |
| `npm run test:ci`       | Run the tests with 100% coverage    |
| `npm run lint`          | Lint with ESLint                    |
| `npm run typecheck`     | Type-check source and tests         |
| `npm run build`         | Build ESM and CommonJS into `dist/` |
| `npm run check:package` | Check the packed package for issues |

## Workflow

1. Fork the repo and create a branch: `git checkout -b my-change`
2. Write a failing test first, then make it pass.
3. Run `npm run test:ci`, `npm run lint`, `npm run typecheck` and `npm run build`.
4. Commit with [Conventional Commits](https://www.conventionalcommits.org): `git commit -m 'fix: handle empty text'`
5. Push the branch and open a pull request.

You can delete your branch after the pull request is merged.

## Git hooks

- **pre-commit** runs ESLint and Prettier on staged files.
- **commit-msg** checks the message format with commitlint.
