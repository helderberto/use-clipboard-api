import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type {
  ClipboardData,
  CopiedValue,
  CopyFn,
  GetCopyProps,
  UseClipboardApiOptions,
  UseClipboardApiResult,
} from './types';

const isClipboardSupported = () =>
  typeof navigator !== 'undefined' && !!navigator.clipboard;

const subscribe = () => () => {};

const isError = (err: unknown): err is Error =>
  err instanceof Error ||
  (typeof DOMException !== 'undefined' && err instanceof DOMException);

export const toError = (err: unknown) =>
  isError(err) ? err : new Error(String(err));

const toPlainText = (data: ClipboardData) => {
  const text = typeof data === 'string' ? data : data['text/plain'];
  return typeof text === 'string' ? text : null;
};

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
    async (data) => {
      const copyId = ++latestCopyRef.current;
      const isLatest = () =>
        isMountedRef.current && copyId === latestCopyRef.current;
      clearTimeout(timerRef.current);

      try {
        if (!isClipboardSupported()) {
          throw new Error('Clipboard not supported.');
        }
        const text = toPlainText(data);
        if (typeof data !== 'string' && typeof ClipboardItem !== 'undefined') {
          await navigator.clipboard.write([new ClipboardItem(data)]);
        } else if (text !== null) {
          await navigator.clipboard.writeText(text);
        } else {
          throw new Error('Rich clipboard not supported.');
        }
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

  const getCopyProps: GetCopyProps = useCallback(
    (data) => {
      const text = toPlainText(data);
      return {
        type: 'button',
        onClick: () => {
          void copy(data);
        },
        ...(text !== null && text === copiedValue ? { 'data-copied': '' } : {}),
      };
    },
    [copy, copiedValue],
  );

  return { copiedValue, copy, error, getCopyProps, isSupported };
}

export default useClipboardApi;
