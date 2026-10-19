import { act, renderHook } from '@testing-library/react';
import { createElement, StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import useClipboardApiDefault, { useClipboardApi } from '..';

const writeText = vi.fn<(text: string) => Promise<void>>();
const write = vi.fn<(items: ClipboardItem[]) => Promise<void>>();

class FakeClipboardItem {
  constructor(readonly items: Record<string, unknown>) {}
}

function deferred() {
  let resolve!: () => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

beforeEach(() => {
  writeText.mockReset().mockResolvedValue(undefined);
  write.mockReset().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', { clipboard: { writeText, write } });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('useClipboardApi', () => {
  it('exports the hook as default and named export', () => {
    expect(useClipboardApiDefault).toBe(useClipboardApi);
  });

  it('returns the initial state', () => {
    const { result } = renderHook(() => useClipboardApi());

    expect(result.current).toEqual({
      copiedValue: null,
      copy: expect.any(Function),
      copyFrom: expect.any(Function),
      error: null,
      getCopyProps: expect.any(Function),
      isSupported: true,
    });
  });

  it('copies text and stores the copied value', async () => {
    const { result } = renderHook(() => useClipboardApi());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.copy('Hello');
    });

    expect(success).toBe(true);
    expect(writeText).toHaveBeenCalledWith('Hello');
    expect(result.current.copiedValue).toBe('Hello');
    expect(result.current.error).toBeNull();
  });

  it('keeps the original error when copying fails', async () => {
    const notAllowed = new DOMException(
      'Document is not focused.',
      'NotAllowedError',
    );
    writeText.mockRejectedValueOnce(notAllowed);
    const { result } = renderHook(() => useClipboardApi());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.copy('Hello');
    });

    expect(success).toBe(false);
    expect(result.current.copiedValue).toBeNull();
    expect(result.current.error).toBe(notAllowed);
    expect(result.current.error?.name).toBe('NotAllowedError');
  });

  it('wraps non-Error rejections in an Error', async () => {
    writeText.mockRejectedValueOnce('denied');
    const { result } = renderHook(() => useClipboardApi());

    await act(async () => {
      await result.current.copy('Hello');
    });

    expect(result.current.error).toEqual(new Error('denied'));
  });

  it('clears the previous error after a successful copy', async () => {
    writeText.mockRejectedValueOnce(new Error('Copy failed'));
    const { result } = renderHook(() => useClipboardApi());

    await act(async () => {
      await result.current.copy('first');
    });
    await act(async () => {
      await result.current.copy('second');
    });

    expect(result.current.error).toBeNull();
    expect(result.current.copiedValue).toBe('second');
  });

  it('fails when the clipboard is not supported', async () => {
    vi.stubGlobal('navigator', {});
    const { result } = renderHook(() => useClipboardApi());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.copy('Hello');
    });

    expect(result.current.isSupported).toBe(false);
    expect(success).toBe(false);
    expect(writeText).not.toHaveBeenCalled();
    expect(result.current.error).toEqual(new Error('Clipboard not supported.'));
  });

  it('does not throw when navigator is undefined', async () => {
    vi.stubGlobal('navigator', undefined);
    const { result } = renderHook(() => useClipboardApi());

    await act(async () => {
      await result.current.copy('Hello');
    });

    expect(result.current.isSupported).toBe(false);
    expect(result.current.error).toEqual(new Error('Clipboard not supported.'));
  });

  it('reports isSupported as false during server rendering', () => {
    function Probe() {
      return String(useClipboardApi().isSupported);
    }

    expect(renderToString(createElement(Probe))).toBe('false');
  });

  it('updates state under Strict Mode', async () => {
    const { result } = renderHook(() => useClipboardApi(), {
      wrapper: StrictMode,
    });

    await act(async () => {
      await result.current.copy('Hello');
    });

    expect(result.current.copiedValue).toBe('Hello');
  });

  it('keeps copy stable across renders', () => {
    const { result, rerender } = renderHook(() => useClipboardApi());
    const { copy } = result.current;

    rerender();

    expect(result.current.copy).toBe(copy);
  });

  it('resets the copied value after the timeout', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useClipboardApi({ timeout: 1000 }));

    await act(async () => {
      await result.current.copy('Hello');
    });
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(result.current.copiedValue).toBe('Hello');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.copiedValue).toBeNull();
  });

  it('restarts the timeout on a new copy', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useClipboardApi({ timeout: 1000 }));

    await act(async () => {
      await result.current.copy('first');
    });
    act(() => {
      vi.advanceTimersByTime(600);
    });
    await act(async () => {
      await result.current.copy('second');
    });
    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(result.current.copiedValue).toBe('second');
  });

  it('keeps the copied value when no timeout is set', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useClipboardApi());

    await act(async () => {
      await result.current.copy('Hello');
    });
    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(result.current.copiedValue).toBe('Hello');
  });

  it('clears the pending timeout on unmount', async () => {
    vi.useFakeTimers();
    const { result, unmount } = renderHook(() =>
      useClipboardApi({ timeout: 1000 }),
    );

    await act(async () => {
      await result.current.copy('Hello');
    });
    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not update state when a copy resolves after unmount', async () => {
    vi.useFakeTimers();
    const pending = deferred();
    writeText.mockReturnValueOnce(pending.promise);
    const { result, unmount } = renderHook(() =>
      useClipboardApi({ timeout: 1000 }),
    );

    const copied = result.current.copy('Hello');
    unmount();
    pending.resolve();

    await expect(copied).resolves.toBe(true);
    expect(result.current.copiedValue).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('ignores a stale success that resolves after a newer copy', async () => {
    const slow = deferred();
    writeText.mockReturnValueOnce(slow.promise);
    const { result } = renderHook(() => useClipboardApi());

    await act(async () => {
      const first = result.current.copy('first');
      await result.current.copy('second');
      slow.resolve();
      await first;
    });

    expect(result.current.copiedValue).toBe('second');
  });

  it('ignores a stale failure that rejects after a newer copy', async () => {
    const slow = deferred();
    writeText.mockReturnValueOnce(slow.promise);
    const { result } = renderHook(() => useClipboardApi());

    await act(async () => {
      const first = result.current.copy('first');
      await result.current.copy('second');
      slow.reject(new Error('late failure'));
      await first;
    });

    expect(result.current.error).toBeNull();
    expect(result.current.copiedValue).toBe('second');
  });

  describe('rich content', () => {
    beforeEach(() => {
      vi.stubGlobal('ClipboardItem', FakeClipboardItem);
    });

    it('writes a MIME record as a ClipboardItem', async () => {
      const record = { 'text/html': '<b>hi</b>', 'text/plain': '**hi**' };
      const { result } = renderHook(() => useClipboardApi());

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.copy(record);
      });

      expect(success).toBe(true);
      expect(write).toHaveBeenCalledWith([new FakeClipboardItem(record)]);
      expect(writeText).not.toHaveBeenCalled();
      expect(result.current.copiedValue).toBe('**hi**');
      expect(result.current.error).toBeNull();
    });

    it('passes Promise entries to the ClipboardItem', async () => {
      const html = Promise.resolve('<b>hi</b>');
      const { result } = renderHook(() => useClipboardApi());

      await act(async () => {
        await result.current.copy({ 'text/html': html });
      });

      expect(write).toHaveBeenCalledWith([
        new FakeClipboardItem({ 'text/html': html }),
      ]);
    });

    it('sets copiedValue to null without a string text/plain entry', async () => {
      const { result } = renderHook(() => useClipboardApi());

      await act(async () => {
        await result.current.copy({
          'text/plain': new Blob(['hi'], { type: 'text/plain' }),
        });
      });

      expect(write).toHaveBeenCalled();
      expect(result.current.copiedValue).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('falls back to text/plain when ClipboardItem is missing', async () => {
      vi.stubGlobal('ClipboardItem', undefined);
      const { result } = renderHook(() => useClipboardApi());

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.copy({
          'text/html': '<b>hi</b>',
          'text/plain': '**hi**',
        });
      });

      expect(success).toBe(true);
      expect(write).not.toHaveBeenCalled();
      expect(writeText).toHaveBeenCalledWith('**hi**');
      expect(result.current.copiedValue).toBe('**hi**');
    });

    it('fails without ClipboardItem and a string text/plain entry', async () => {
      vi.stubGlobal('ClipboardItem', undefined);
      const { result } = renderHook(() => useClipboardApi());

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.copy({ 'text/html': '<b>hi</b>' });
      });

      expect(success).toBe(false);
      expect(writeText).not.toHaveBeenCalled();
      expect(result.current.copiedValue).toBeNull();
      expect(result.current.error).toEqual(
        new Error('Rich clipboard not supported.'),
      );
    });
  });

  describe('copyFrom', () => {
    function element(html: string) {
      const template = document.createElement('template');
      template.innerHTML = html;
      return template.content.firstElementChild;
    }

    it('copies the value of an input', async () => {
      const ref = { current: element('<input value="from input">') };
      const { result } = renderHook(() => useClipboardApi());

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.copyFrom(ref);
      });

      expect(success).toBe(true);
      expect(writeText).toHaveBeenCalledWith('from input');
      expect(result.current.copiedValue).toBe('from input');
    });

    it('copies the value of a textarea', async () => {
      const ref = { current: element('<textarea>from textarea</textarea>') };
      const { result } = renderHook(() => useClipboardApi());

      await act(async () => {
        await result.current.copyFrom(ref);
      });

      expect(writeText).toHaveBeenCalledWith('from textarea');
    });

    it('copies the text content of other elements', async () => {
      const ref = { current: element('<pre><b>npm</b> i</pre>') };
      const { result } = renderHook(() => useClipboardApi());

      await act(async () => {
        await result.current.copyFrom(ref);
      });

      expect(writeText).toHaveBeenCalledWith('npm i');
    });

    it('copies HTML and text with format html', async () => {
      vi.stubGlobal('ClipboardItem', FakeClipboardItem);
      const ref = { current: element('<article><b>hi</b> there</article>') };
      const { result } = renderHook(() => useClipboardApi());

      await act(async () => {
        await result.current.copyFrom(ref, { format: 'html' });
      });

      expect(write).toHaveBeenCalledWith([
        new FakeClipboardItem({
          'text/html': '<b>hi</b> there',
          'text/plain': 'hi there',
        }),
      ]);
      expect(result.current.copiedValue).toBe('hi there');
    });

    it('fails when the ref is empty', async () => {
      const { result } = renderHook(() => useClipboardApi());

      let success: boolean | undefined;
      await act(async () => {
        success = await result.current.copyFrom({ current: null });
      });

      expect(success).toBe(false);
      expect(writeText).not.toHaveBeenCalled();
      expect(result.current.error).toEqual(new Error('Copy target not found.'));
    });

    it('keeps copyFrom stable across renders', () => {
      const { result, rerender } = renderHook(() => useClipboardApi());
      const { copyFrom } = result.current;

      rerender();

      expect(result.current.copyFrom).toBe(copyFrom);
    });
  });
});
