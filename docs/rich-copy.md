# Rich copy

`copy` accepts a MIME record as well as a string. Use it to copy HTML, markdown or images in one write.

```ts
copy({ 'text/html': '<b>hi</b>', 'text/plain': '**hi**' });
```

Each entry is a `string`, a `Blob` or a `Promise` of either. The hook wraps the record in a `ClipboardItem` and calls `navigator.clipboard.write`.

## Copied value

`copiedValue` holds the `text/plain` entry when it is a string. Otherwise it is `null`, even on success. Check the boolean that `copy` resolves to instead.

## Markdown

Copy the HTML for rich editors and the source for plain ones. The library ships no converter, so pick your own.

```ts
import { marked } from 'marked';

copy({ 'text/html': marked.parse(markdown), 'text/plain': markdown });
```

`marked.parse` is sync by default. Keep it that way. See [Safari](#safari).

## Safari

Safari rejects the write with `NotAllowedError` when an `await` runs between the click and the write. Pass a `Promise` entry instead of awaiting it first. `ClipboardItem` resolves it inside the user gesture.

```ts
// Fails in Safari
const html = await fetchHtml();
copy({ 'text/html': html });

// Works
copy({ 'text/html': fetchHtml() });
```

## Browsers without `ClipboardItem`

Firefox before 127 and old Safari lack `ClipboardItem`. There the hook writes the `text/plain` entry with `writeText`. Content is kept. Formatting is lost.

Without a string `text/plain` entry, `copy` resolves `false` and `error.message` is `Rich clipboard not supported.` Always include `text/plain`.
