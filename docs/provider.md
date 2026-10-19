# ClipboardProvider

`ClipboardProvider` turns `data-*` attributes into copy buttons. One click handler covers everything inside it, including HTML React does not render.

## Attributes

```tsx
<ClipboardProvider timeout={2000}>
  <button data-copy="hello">Copy text</button>
  <button data-copy-target="#field">Copy input</button>
  <button data-copy-target="#post" data-copy-format="html">
    Copy as rich text
  </button>
</ClipboardProvider>
```

- `data-copy` copies its own value.
- `data-copy-target` takes a CSS selector. Inputs and textareas copy their `value`. Other elements copy their text.
- `data-copy-format="html"` copies the target's HTML and text. Rich editors keep the formatting. See [rich copy](rich-copy.md).

Clicks on children count. A `<span>` inside a `data-copy` button still copies.

## Styling

The clicked element gets `data-copied` after a successful copy. It moves to the next copied element and is removed on timeout or failure.

```css
[data-copied]::after {
  content: ' Copied!';
}
```

## State

`useClipboardContext()` returns `copiedValue`, `copy`, `error` and `isSupported` from the provider. It throws outside a provider.

```tsx
function CopyStatus() {
  const { error } = useClipboardContext();
  return error ? <p role="alert">{error.message}</p> : null;
}
```

A selector that matches nothing sets `error` to `Copy target not found: <selector>`.

## Markdown code blocks

Render markdown inside the provider and add a button per code block. Each block gets an id for its button to target.

```tsx
let id = 0;
const html = marked.parse(markdown).replaceAll('<pre>', () => {
  id += 1;
  return `<button data-copy-target="#code-${id}">Copy</button><pre id="code-${id}">`;
});

<ClipboardProvider timeout={2000}>
  <article dangerouslySetInnerHTML={{ __html: html }} />
</ClipboardProvider>;
```

Sanitize untrusted markdown before rendering it.

## Scope

The provider renders a `<div style="display: contents">`, so it does not affect layout. Nested providers work: only the nearest one handles a click.
