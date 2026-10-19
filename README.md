<div align="center">
  <h1>use-clipboard-api</h1>

  <p><strong>React hook and provider for copying text and rich content with the Clipboard API.</strong></p>

<!-- prettier-ignore-start -->
[![build][build-badge]][build]
[![version][version-badge]][package]
[![MIT License][license-badge]][license]
[![downloads][downloads-badge]][npmtrends]
<!-- prettier-ignore-end -->

</div>

---

## Why

`navigator.clipboard` is async and can fail. This hook tracks the copied text and the error for you, for plain text and rich content like markdown rendered as HTML.

It also resets a "Copied!" label after a timeout, and it ignores results that arrive after unmount or after a newer copy.

## Install

```bash
npm install use-clipboard-api
```

Requires React 18 or later.

## Quick start

```tsx
import { useClipboardApi } from 'use-clipboard-api';

function CopyButton({ text }: { text: string }) {
  const { copiedValue, copy, isSupported } = useClipboardApi({ timeout: 2000 });

  if (!isSupported) return null;

  return (
    <button onClick={() => copy(text)}>
      {copiedValue ? 'Copied!' : 'Copy'}
    </button>
  );
}
```

## Which API to use

| You want to                                 | Use                                                                                      |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Copy a string on click                      | `copy('text')`                                                                           |
| Turn any button into a copy button          | `<button {...getCopyProps('text')}>`                                                     |
| Use a component instead of a hook           | `<Copy data="text">Copy</Copy>`                                                          |
| Copy what an input or element shows         | `copyFrom(ref)`                                                                          |
| Keep formatting, like markdown as HTML      | `copy({ 'text/html': html, 'text/plain': text })` or `copyFrom(ref, { format: 'html' })` |
| Copy from markdown or CMS HTML, no handlers | `<ClipboardProvider>` + `data-copy` attributes                                           |

## API

### `useClipboardApi(options?)`

| Option    | Type     | Description                                                                   |
| --------- | -------- | ----------------------------------------------------------------------------- |
| `timeout` | `number` | Milliseconds until `copiedValue` resets to `null`. Omit it to keep the value. |

| Returns        | Type                                        | Description                                                                                                  |
| -------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `copiedValue`  | `string \| null`                            | Last copied text, or the `text/plain` entry of a record. `null` before a copy, after a failure or a timeout. |
| `copy`         | `(data: ClipboardData) => Promise<boolean>` | Writes a string or a MIME record. Resolves `true` on success. Stable across renders.                         |
| `copyFrom`     | `(ref, options?) => Promise<boolean>`       | Copies an element: `value` for inputs and textareas, else its text. `{ format: 'html' }` copies rich text.   |
| `error`        | `Error \| null`                             | Last failure, as thrown by the browser (e.g. `NotAllowedError`).                                             |
| `getCopyProps` | `(data: ClipboardData) => CopyProps`        | Props for a copy button: `type`, `onClick` and `data-copied` while `data` is the copied value.               |
| `isSupported`  | `boolean`                                   | `false` on the server and in browsers without the Clipboard API.                                             |

Pass a ref to `copyFrom` to copy what an element shows.

```tsx
const { copyFrom } = useClipboardApi();
const codeRef = useRef<HTMLPreElement>(null);

<>
  <pre ref={codeRef}>npm i use-clipboard-api</pre>
  <button onClick={() => copyFrom(codeRef)}>Copy</button>
  <button onClick={() => copyFrom(codeRef, { format: 'html' })}>
    Copy as rich text
  </button>
</>;
```

Spread `getCopyProps` on a button to skip the wiring. Style the copied state with `[data-copied]`.

```tsx
const { getCopyProps } = useClipboardApi({ timeout: 2000 });

<button {...getCopyProps('npm i use-clipboard-api')}>Copy</button>;
```

### `<Copy>`

A copy button as a component. Pass a function as children to change the label after a copy.

```tsx
import { Copy } from 'use-clipboard-api';

<Copy data="npm i use-clipboard-api" timeout={2000}>
  {({ copied }) => (copied ? 'Copied!' : 'Copy')}
</Copy>;
```

Add `asChild` to put the copy behavior on your own element instead of a `<button>`.

```tsx
<Copy data="npm i use-clipboard-api" asChild>
  <MyButton>Copy</MyButton>
</Copy>
```

| Prop       | Type                                     | Description                                               |
| ---------- | ---------------------------------------- | --------------------------------------------------------- |
| `data`     | `ClipboardData`                          | Text or MIME record to copy.                              |
| `timeout`  | `number`                                 | Same as `useClipboardApi`.                                |
| `asChild`  | `boolean`                                | Renders the single child element instead of a `<button>`. |
| `children` | `ReactNode \| ({ copied }) => ReactNode` | The label, or a function of the copied state.             |

Other props go to the `<button>`. With `asChild`, they merge into the child, and the child's own props win.

### `<ClipboardProvider>`

Copies from markup with `data-*` attributes, no handlers needed. It works with HTML React does not render, like markdown or CMS content.

```tsx
import { ClipboardProvider } from 'use-clipboard-api';

<ClipboardProvider timeout={2000}>
  <button data-copy="npm i use-clipboard-api">Copy</button>
  <pre id="snippet">npm run build</pre>
  <button data-copy-target="#snippet">Copy snippet</button>
</ClipboardProvider>;
```

| Attribute                 | Description                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `data-copy`               | Copies the attribute value.                                                            |
| `data-copy-target`        | Copies the `value` of an input or textarea, or the text of other elements.             |
| `data-copy-format="html"` | With `data-copy-target`, copies the target as rich text.                               |
| `data-copied`             | Set on the clicked element after a copy. Removed on timeout, failure or the next copy. |

`useClipboardContext()` returns the provider's `useClipboardApi` result. See the [provider guide](docs/provider.md).

### Types

All types are exported:

- Data: `ClipboardData`, `ClipboardEntry`, `CopiedValue`
- Hook: `UseClipboardApiOptions`, `UseClipboardApiResult`, `CopyFn`, `CopyFromFn`, `CopyFromOptions`, `GetCopyProps`, `CopyProps`
- Components: `ClipboardProviderProps`, `CopyComponentProps`, `CopyState`

```ts
import type { ClipboardData } from 'use-clipboard-api';
```

## Requirements

Browsers only allow clipboard writes when both are true:

- The page runs in a secure context: HTTPS or `localhost`.
- The document has focus. Call `copy` from a user action, like a click.

Otherwise `copy` resolves `false` and `error.name` is `NotAllowedError`.

`ClipboardProvider` works in React Server Components layouts, like the Next.js App Router. The bundle starts with `'use client'`.

## Examples

`copiedValue` and `error` update on the next render. Use the boolean that `copy` resolves to when you need the result right away.

<details>
<summary>Copy from an input with a ref</summary>

```tsx
import { useRef } from 'react';
import { useClipboardApi } from 'use-clipboard-api';

function CopyInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { copiedValue, copyFrom, error } = useClipboardApi({ timeout: 2000 });

  return (
    <div>
      <input ref={inputRef} placeholder="Type something to copy" />
      <button onClick={() => copyFrom(inputRef)}>Copy</button>
      {copiedValue && <p>Copied: {copiedValue}</p>}
      {error && <p role="alert">{error.message}</p>}
    </div>
  );
}
```

</details>

<details>
<summary>Copy from controlled state</summary>

```tsx
import { useState } from 'react';
import { useClipboardApi } from 'use-clipboard-api';

function CopyField() {
  const [value, setValue] = useState('');
  const { copiedValue, copy } = useClipboardApi({ timeout: 2000 });

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={() => copy(value)}>
        {copiedValue ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}
```

</details>

<details>
<summary>Handle failures</summary>

```tsx
import { useClipboardApi } from 'use-clipboard-api';

function ShareLink({ url }: { url: string }) {
  const { copy, error } = useClipboardApi();

  const handleClick = async () => {
    const copied = await copy(url);
    if (!copied) {
      window.prompt('Copy this link:', url);
    }
  };

  return (
    <>
      <button onClick={handleClick}>Copy link</button>
      {error?.name === 'NotAllowedError' && (
        <p>Allow clipboard access and try again.</p>
      )}
    </>
  );
}
```

</details>

<details>
<summary>Copy markdown as rich text</summary>

Pass a MIME record. Pasting into Google Docs or Gmail keeps the formatting. Plain editors get the markdown. Bring your own converter, like [marked](https://github.com/markedjs/marked).

```tsx
import { marked } from 'marked';
import { useClipboardApi } from 'use-clipboard-api';

function CopyMarkdown({ markdown }: { markdown: string }) {
  const { copy } = useClipboardApi();

  return (
    <button
      onClick={() =>
        copy({ 'text/html': marked.parse(markdown), 'text/plain': markdown })
      }
    >
      Copy
    </button>
  );
}
```

See [rich copy](docs/rich-copy.md) for Safari and browser fallbacks.

</details>

## Migrating from v1 to v2

Version 2 drops the default export. Import the hook by name.

```diff
- import useClipboardApi from 'use-clipboard-api';
+ import { useClipboardApi } from 'use-clipboard-api';
```

Nothing else changed.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for setup, scripts and the commit format.

## Bugs and suggestions

Open an [issue](https://github.com/helderberto/use-clipboard-api/issues).

## License

[MIT License](LICENSE) © [helderberto](https://helderberto.com)

<!-- prettier-ignore-start -->
[version-badge]: https://img.shields.io/npm/v/use-clipboard-api.svg?style=flat-square
[package]: https://www.npmjs.com/package/use-clipboard-api
[downloads-badge]: https://img.shields.io/npm/dm/use-clipboard-api.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/use-clipboard-api
[license-badge]: https://img.shields.io/npm/l/use-clipboard-api.svg?style=flat-square
[license]: https://github.com/helderberto/use-clipboard-api/blob/main/LICENSE
[build]: https://github.com/helderberto/use-clipboard-api/actions
[build-badge]: https://github.com/helderberto/use-clipboard-api/actions/workflows/ci.yml/badge.svg
<!-- prettier-ignore-end -->
