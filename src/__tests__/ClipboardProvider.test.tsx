import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { ClipboardProvider, useClipboardContext } from '..';
import type { ClipboardProviderProps } from '..';

const writeText = vi.fn<(text: string) => Promise<void>>();
const write = vi.fn<(items: ClipboardItem[]) => Promise<void>>();

class FakeClipboardItem {
  constructor(readonly items: Record<string, unknown>) {}
}

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

function Probe() {
  const { copiedValue, error } = useClipboardContext();
  return (
    <output>
      {copiedValue ?? 'none'}|{error?.message ?? 'ok'}
    </output>
  );
}

function renderProvider(
  children: ReactNode,
  props: Omit<ClipboardProviderProps, 'children'> = {},
) {
  render(<ClipboardProvider {...props}>{children}</ClipboardProvider>);
  const click = (element: Element) =>
    act(async () => {
      await user.click(element);
    });
  return { click };
}

let user: UserEvent;

beforeEach(() => {
  // setup() swaps in its own clipboard stub, so it runs before ours.
  user = userEvent.setup({ delay: null });
  writeText.mockReset().mockResolvedValue(undefined);
  write.mockReset().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', { clipboard: { writeText, write } });
  vi.stubGlobal('ClipboardItem', FakeClipboardItem);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('ClipboardProvider', () => {
  it('copies the data-copy value and marks the element', async () => {
    const { click } = renderProvider(
      <>
        <button data-copy="hello">Copy</button>
        <Probe />
      </>,
    );
    const button = screen.getByRole('button');

    await click(button);

    expect(writeText).toHaveBeenCalledWith('hello');
    expect(button.hasAttribute('data-copied')).toBe(true);
    expect(screen.getByRole('status').textContent).toBe('hello|ok');
  });

  it('handles clicks on elements nested inside a copy element', async () => {
    const { click } = renderProvider(
      <>
        <button data-copy="hello">
          <span>Copy</span>
        </button>
      </>,
    );

    await click(screen.getByText('Copy'));

    expect(writeText).toHaveBeenCalledWith('hello');
    expect(screen.getByRole('button').hasAttribute('data-copied')).toBe(true);
  });

  it('ignores clicks outside copy elements', async () => {
    const { click } = renderProvider(
      <>
        <button>Other</button>
      </>,
    );

    await click(screen.getByRole('button'));

    expect(writeText).not.toHaveBeenCalled();
  });

  it('copies the value of an input target', async () => {
    const { click } = renderProvider(
      <>
        <input id="field" defaultValue="from input" />
        <button data-copy-target="#field">Copy</button>
      </>,
    );

    await click(screen.getByRole('button'));

    expect(writeText).toHaveBeenCalledWith('from input');
  });

  it('copies the value of a textarea target', async () => {
    const { click } = renderProvider(
      <>
        <textarea id="area" defaultValue="from textarea" />
        <button data-copy-target="#area">Copy</button>
      </>,
    );

    await click(screen.getByRole('button'));

    expect(writeText).toHaveBeenCalledWith('from textarea');
  });

  it('copies the text content of an element target', async () => {
    const { click } = renderProvider(
      <>
        <pre id="snippet">npm i use-clipboard-api</pre>
        <button data-copy-target="#snippet">Copy</button>
      </>,
    );

    await click(screen.getByRole('button'));

    expect(writeText).toHaveBeenCalledWith('npm i use-clipboard-api');
  });

  it('copies a target from HTML the provider does not render', async () => {
    const { click } = renderProvider(
      <>
        <div
          // Simulates markup React does not render, like CMS HTML.
          // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml
          dangerouslySetInnerHTML={{
            __html:
              '<pre id="raw">raw code</pre><button data-copy-target="#raw">Copy</button>',
          }}
        />
      </>,
    );

    await click(screen.getByRole('button'));

    expect(writeText).toHaveBeenCalledWith('raw code');
  });

  it('copies a target as rich text with data-copy-format="html"', async () => {
    const { click } = renderProvider(
      <>
        <article id="post">
          <b>hi</b> there
        </article>
        <button data-copy-target="#post" data-copy-format="html">
          Copy
        </button>
        <Probe />
      </>,
    );

    await click(screen.getByRole('button'));

    expect(write).toHaveBeenCalledWith([
      new FakeClipboardItem({
        'text/html': '<b>hi</b> there',
        'text/plain': 'hi there',
      }),
    ]);
    expect(screen.getByRole('status').textContent).toBe('hi there|ok');
  });

  it('sets an error when the target is missing', async () => {
    const { click } = renderProvider(
      <>
        <button data-copy-target="#missing">Copy</button>
        <Probe />
      </>,
    );

    await click(screen.getByRole('button'));

    expect(writeText).not.toHaveBeenCalled();
    expect(screen.getByRole('status').textContent).toBe(
      'none|Copy target not found: #missing',
    );
  });

  it('sets an error when the target selector is empty', async () => {
    const { click } = renderProvider(
      <>
        <button data-copy-target="">Copy</button>
        <Probe />
      </>,
    );

    await click(screen.getByRole('button'));

    expect(writeText).not.toHaveBeenCalled();
    expect(screen.getByRole('status').textContent).toBe(
      'none|Copy target not found: ',
    );
  });

  it('keeps the error when the target selector is invalid', async () => {
    const { click } = renderProvider(
      <>
        <button data-copy-target="[">Copy</button>
        <Probe />
      </>,
    );

    await click(screen.getByRole('button'));

    expect(writeText).not.toHaveBeenCalled();
    expect(screen.getByRole('status').textContent).toMatch(/^none\|.*\[/);
  });

  it('clears the target error on the next copy', async () => {
    const { click } = renderProvider(
      <>
        <button data-copy-target="#missing">Broken</button>
        <button data-copy="hello">Copy</button>
        <Probe />
      </>,
    );

    await click(screen.getByText('Broken'));
    await click(screen.getByText('Copy'));

    expect(screen.getByRole('status').textContent).toBe('hello|ok');
  });

  it('moves data-copied to the latest copied element', async () => {
    const { click } = renderProvider(
      <>
        <button data-copy="same">First</button>
        <button data-copy="same">Second</button>
      </>,
    );
    const first = screen.getByText('First');
    const second = screen.getByText('Second');

    await click(first);
    await click(second);

    expect(first.hasAttribute('data-copied')).toBe(false);
    expect(second.hasAttribute('data-copied')).toBe(true);
  });

  it('removes data-copied after a failed copy', async () => {
    const { click } = renderProvider(
      <>
        <button data-copy="ok">First</button>
        <button data-copy="fail">Second</button>
      </>,
    );
    const first = screen.getByText('First');
    const second = screen.getByText('Second');

    await click(first);
    writeText.mockRejectedValueOnce(new Error('denied'));
    await click(second);

    expect(first.hasAttribute('data-copied')).toBe(false);
    expect(second.hasAttribute('data-copied')).toBe(false);
  });

  it('removes data-copied after the timeout', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { click } = renderProvider(
      <>
        <button data-copy="hello">Copy</button>
      </>,
      { timeout: 1000 },
    );
    const button = screen.getByRole('button');

    await click(button);
    expect(button.hasAttribute('data-copied')).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(button.hasAttribute('data-copied')).toBe(false);
  });

  it('does not mark an element whose copy resolves after a newer click', async () => {
    const slow = deferred();
    writeText.mockReturnValueOnce(slow.promise);
    const { click } = renderProvider(
      <>
        <button data-copy="first">First</button>
        <button data-copy="second">Second</button>
      </>,
    );
    const first = screen.getByText('First');

    await click(first);
    await click(screen.getByText('Second'));
    await act(async () => {
      slow.resolve();
    });

    expect(first.hasAttribute('data-copied')).toBe(false);
    expect(screen.getByText('Second').hasAttribute('data-copied')).toBe(true);
  });

  it('copies once with nested providers', async () => {
    const { click } = renderProvider(
      <>
        <ClipboardProvider>
          <button data-copy="hello">Copy</button>
        </ClipboardProvider>
      </>,
    );

    await click(screen.getByRole('button'));

    expect(writeText).toHaveBeenCalledTimes(1);
  });
});

describe('useClipboardContext', () => {
  it('throws outside a ClipboardProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Probe />)).toThrow(
      'useClipboardContext must be used within a ClipboardProvider.',
    );
  });
});
