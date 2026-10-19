import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type {
  CopiedValue,
  CopyFn,
  UseClipboardApiOptions,
  UseClipboardApiResult,
} from './types';

const isClipboardSupported = () =>
  typeof navigator !== 'undefined' && !!navigator.clipboard;

const subscribe = () => () => {};

const isError = (err: unknown): err is Error =>
  err instanceof Error ||
  (typeof DOMException !== 'undefined' && err instanceof DOMException);

const toError = (err: unknown) => (isError(err) ? err : new Error(String(err)));

export function useClipboardApi({
  timeout,
}: UseClipboardApiOptions = {}): UseClipboardApiResult {
  const [copiedValue, setCopiedValue] = useState<CopiedValue>(null);
  const [error, setError] = useState<Error | null>(null);
  const isSupported = useSyncExternalStore(
    subscribe,
    isClipboardSupported,
    () => false,
  );
  const isMountedRef = useRef(false);
  const latestCopyRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearTimeout(timerRef.current);
    };
  }, []);

  const copy: CopyFn = useCallback(
    async (text) => {
      const copyId = ++latestCopyRef.current;
      const isLatest = () =>
        isMountedRef.current && copyId === latestCopyRef.current;
      clearTimeout(timerRef.current);

      try {
        if (!isClipboardSupported()) {
          throw new Error('Clipboard not supported.');
        }
        await navigator.clipboard.writeText(text);
        if (isLatest()) {
          setCopiedValue(text);
          setError(null);
          if (timeout) {
            timerRef.current = setTimeout(() => setCopiedValue(null), timeout);
          }
        }
        return true;
      } catch (err) {
        if (isLatest()) {
          setCopiedValue(null);
          setError(toError(err));
        }
        return false;
      }
    },
    [timeout],
  );

  return { copiedValue, copy, error, isSupported };
}

export default useClipboardApi;
