<div align="center">
  <h1>📋 use-clipboard-api</h1>

  <p><strong>useClipboardApi() is a React Hook</strong> that consumes Web Clipboard API.</p>

<!-- prettier-ignore-start -->
[![build][build-badge]][build]
[![version][version-badge]][package]
[![MIT License][license-badge]][license]
[![downloads][downloads-badge]][npmtrends]
<!-- prettier-ignore-end -->

</div>

---

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Motivation](#motivation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Bugs and Sugestions](#bugs-and-sugestions)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Motivation

- Easy way to use [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) into your React project;

## Usage

To start using the `use-clipboard-api` in your project, first install in your project:

`yarn add use-clipboard-api` or `npm install use-clipboard-api`

<details open>
<summary><strong>Copy to clipboard:</strong></summary>

```jsx
import useClipboardApi from 'use-clipboard-api';

const ClipboardExample = () => {
  const inputRef = useRef(null);
  const [copiedValue, copy, error] = useClipboardApi();

  const handleCopy = async () => {
    if (inputRef.current) {
      const valueToCopy = inputRef.current.value;
      const success = await copy(valueToCopy);

      if (success) {
        console.log('Text copied:', copiedValue);
      } else {
        console.error('Copy failed:', error);
      }
    }
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Type something to copy" />
      <button onClick={handleCopy}>Copy to Clipboard</button>
      {copiedValue && <p>Copied: {copiedValue}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};
```

</details>

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Bugs and Sugestions

Report bugs or do suggestions using the [issues](https://github.com/helderberto/use-clipboard-api/issues).

## License

[MIT License](LICENSE) © [helderburato](https://helderberto.com)

<!-- prettier-ignore-start -->
[version-badge]: https://img.shields.io/npm/v/use-clipboard-api.svg?style=flat-square
[package]: https://www.npmjs.com/package/use-clipboard-api
[downloads-badge]: https://img.shields.io/npm/dm/use-clipboard-api.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/use-clipboard-api
[license-badge]: https://img.shields.io/npm/l/use-clipboard-api.svg?style=flat-square
[license]: https://github.com/helderberto/use-clipboard-api/blob/master/LICENSE
[build]: https://github.com/helderberto/use-clipboard-api/actions
[build-badge]: https://github.com/helderberto/use-clipboard-api/actions/workflows/ci.yml/badge.svg
<!-- prettier-ignore-end -->
