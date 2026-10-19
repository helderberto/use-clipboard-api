<div align="center">
  <h1>use-clipboard-api</h1>

  <p><strong>React hook for copying text with the Clipboard API.</strong></p>

<!-- prettier-ignore-start -->
[![build][build-badge]][build]
[![version][version-badge]][package]
[![MIT License][license-badge]][license]
[![downloads][downloads-badge]][npmtrends]
<!-- prettier-ignore-end -->

</div>

---

## Why

`navigator.clipboard.writeText` is async and can fail. This hook tracks the copied text and the error for you.

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

## API

### `useClipboardApi(options?)`

The hook is also the default export.

| Option    | Type     | Description                                                                   |
| --------- | -------- | ----------------------------------------------------------------------------- |
| `timeout` | `number` | Milliseconds until `copiedValue` resets to `null`. Omit it to keep the value. |

| Returns       | Type                                 | Description                                                           |
| ------------- | ------------------------------------ | --------------------------------------------------------------------- |
| `copiedValue` | `string \| null`                     | Last copied text. `null` before a copy, after a failure or a timeout. |
| `copy`        | `(text: string) => Promise<boolean>` | Writes `text`. Resolves `true` on success. Stable across renders.     |
| `error`       | `Error \| null`                      | Last failure, as thrown by the browser (e.g. `NotAllowedError`).      |
| `isSupported` | `boolean`                            | `false` on the server and in browsers without the Clipboard API.      |

## Requirements

Browsers only allow clipboard writes when both are true:

- The page runs in a secure context: HTTPS or `localhost`.
- The document has focus. Call `copy` from a user action, like a click.

Otherwise `copy` resolves `false` and `error.name` is `NotAllowedError`.

## Examples

`copiedValue` and `error` update on the next render. Use the boolean that `copy` resolves to when you need the result right away.

<details>
<summary>Copy from an input with a ref</summary>

```tsx
import { useRef } from 'react';
import { useClipboardApi } from 'use-clipboard-api';

function CopyInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { copiedValue, copy, error } = useClipboardApi({ timeout: 2000 });

  return (
    <div>
      <input ref={inputRef} placeholder="Type something to copy" />
      <button onClick={() => copy(inputRef.current?.value ?? '')}>Copy</button>
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

## Migrating from 0.x

Version 1 returns an object instead of a tuple. See the [migration guide](docs/migration.md).

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
