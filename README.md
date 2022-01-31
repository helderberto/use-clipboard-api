<div align="center">
  <h1>use-clipboard</h1>

  <p><strong>use-clipboard is a React Hook</strong> that consumes Web Clipboard API.</p>

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

To start using the `use-clipboard` in your project, first install in your project:

`yarn add use-clipboard` or `npm install use-clipboard`

<details open>
<summary><strong>Copy to clipboard with useClipboard:</strong></summary>

```jsx
import useClipboard from 'use-clipboard';

function App() {
  const [value, copy] = useClipboard();

  return <button onClick={() => copy('Text to be copied.')}>Copy me!</button>;
}

export default App;
```

</details>

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Bugs and Sugestions

Report bugs or do suggestions using the [issues](https://github.com/helderburato/use-clipboard/issues).

## License

[MIT License](LICENSE) © [helderburato](https://helderburato.com)

<!-- prettier-ignore-start -->
[version-badge]: https://img.shields.io/npm/v/use-clipboard.svg?style=flat-square
[package]: https://www.npmjs.com/package/use-clipboard
[downloads-badge]: https://img.shields.io/npm/dm/use-clipboard.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/use-clipboard
[license-badge]: https://img.shields.io/npm/l/use-clipboard.svg?style=flat-square
[license]: https://github.com/helderburato/use-clipboard/blob/master/LICENSE
[build]: https://github.com/helderburato/use-clipboard/actions
[build-badge]: https://github.com/helderburato/use-clipboard/actions/workflows/ci.yml/badge.svg
<!-- prettier-ignore-end -->
