# Migrating from 0.x to 1.0

Version 1 returns an object, keeps errors as `Error` objects and needs React 18.

## Destructure an object

The hook returns named fields instead of a tuple.

```diff
- const [copiedValue, copy, error] = useClipboardApi();
+ const { copiedValue, copy, error } = useClipboardApi();
```

The default import still works. A named import is also available.

```diff
- import useClipboardApi from 'use-clipboard-api';
+ import { useClipboardApi } from 'use-clipboard-api';
```

## Read `error.message`

`error` is now the `Error` the browser threw, not a string. Use `error.name` to tell failures apart.

```diff
- {error && <p>{error}</p>}
+ {error && <p>{error.message}</p>}
```

## Log failures yourself

The hook no longer calls `console.error`. Log in your handler if you need it.

```tsx
const copied = await copy(text);
if (!copied) console.error('Copy failed');
```

## Upgrade to React 18

The peer range is now `react >=18.0.0`. Stay on 0.x for React 16 or 17.

## Import from the package root

The package now ships ESM and CommonJS through an `exports` map. Deep imports like `use-clipboard-api/dist/useClipboardApi` no longer resolve.

## New in 1.0

<details>
<summary>Reset the copied value after a timeout</summary>

```tsx
const { copiedValue, copy } = useClipboardApi({ timeout: 2000 });
```

`copiedValue` returns to `null` 2 seconds after each copy.

</details>

<details>
<summary>Hide the button when the clipboard is unavailable</summary>

```tsx
const { copy, isSupported } = useClipboardApi();

if (!isSupported) return null;
```

`isSupported` is `false` on the server, so hydration stays consistent.

</details>
