import { waitFor, act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import useClipboardApi from '../useClipboardApi';

// Mock implementation for the clipboard API
const mockWriteText = vi.fn();

Object.assign(window.navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('useClipboardApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state and copy function', () => {
    const { result } = renderHook(() => useClipboardApi());
    const [value, copy, error] = result.current;

    expect(value).toBe(null);
    expect(typeof copy).toBe('function');
    expect(error).toBe(null);
  });

  it('should copy text successfully', async () => {
    const { result } = renderHook(() => useClipboardApi());
    const [, copy] = result.current;

    mockWriteText.mockImplementationOnce(() => Promise.resolve());

    await act(async () => {
      const success = await copy('Hello, world!');

      expect(success).toBe(true);
    });

    await waitFor(() => {
      const updatedResult = result.current;
      expect(updatedResult[0]).toBe('Hello, world!');
      expect(updatedResult[2]).toBe(null);
    });

    expect(mockWriteText).toHaveBeenCalledWith('Hello, world!');
  });

  it('should handle errors when copying fails', async () => {
    const { result } = renderHook(() => useClipboardApi());
    const [, copy] = result.current;

    mockWriteText.mockImplementationOnce(() => {
      return Promise.reject(new Error('Copy failed'));
    });

    await act(async () => {
      const success = await copy('This will fail');

      expect(success).toBe(false);
    });

    await waitFor(() => {
      const updatedResult = result.current;
      expect(updatedResult[0]).toBe(null);
      expect(updatedResult[2]).toBe('Copy failed');
    });
  });

  it('should throw error if clipboard is not supported', async () => {
    delete window.navigator.clipboard;

    const { result } = renderHook(() => useClipboardApi());
    const [, copy] = result.current;

    await act(async () => {
      const success = await copy('Test');

      expect(success).toBe(false);
    });

    await waitFor(() => {
      const updatedResult = result.current;
      expect(updatedResult[0]).toBe(null);
      expect(updatedResult[2]).toBe('Clipboard not supported.');
    });
  });
});
