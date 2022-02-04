import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useClipboardApi from '../useClipboardApi';

Object.assign(window.navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

describe('useClipboardApi', () => {
  it('should return value and copy method', () => {
    const { result } = renderHook(() => useClipboardApi());
    const [value, copy] = result.current;

    expect(value).toBe(null);
    expect(typeof copy).toBe('function');
  });

  it('should trigger copy', async () => {
    const { result } = renderHook(() => useClipboardApi());
    const [, copy] = result.current;

    await waitFor(() => {
      copy('Example text.');
    });

    expect(window.navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
