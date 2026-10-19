import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { MouseEvent } from 'react';
import type {
  ClipboardData,
  ClipboardProviderProps,
  UseClipboardApiResult,
} from './types';
import { toError, useClipboardApi } from './useClipboardApi';

const COPY_SELECTOR = '[data-copy], [data-copy-target]';
const PROVIDER_SELECTOR = '[data-clipboard-provider]';

const ClipboardContext = createContext<UseClipboardApiResult | null>(null);

function readData(element: Element): ClipboardData {
  const text = element.getAttribute('data-copy');
  if (text !== null) return text;

  const selector = element.getAttribute('data-copy-target');
  const target = selector && document.querySelector(selector);
  if (!target) throw new Error(`Copy target not found: ${selector}`);

  if (element.getAttribute('data-copy-format') === 'html') {
    return { 'text/html': target.innerHTML, 'text/plain': target.textContent };
  }
  return target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement
    ? target.value
    : target.textContent;
}

export function ClipboardProvider({
  children,
  timeout,
}: ClipboardProviderProps) {
  const clipboard = useClipboardApi({ timeout });
  const { copiedValue, copy } = clipboard;
  const [targetError, setTargetError] = useState<Error | null>(null);
  const latestRef = useRef<Element>(null);
  const copiedRef = useRef<Element>(null);

  useEffect(() => {
    if (copiedValue === null) copiedRef.current?.removeAttribute('data-copied');
  }, [copiedValue]);

  const handleClick = async (event: MouseEvent<HTMLDivElement>) => {
    // Click targets are always elements.
    const element = (event.target as Element).closest(COPY_SELECTOR);
    if (
      !element ||
      element.closest(PROVIDER_SELECTOR) !== event.currentTarget
    ) {
      return;
    }

    latestRef.current = element;
    let data: ClipboardData;
    try {
      data = readData(element);
    } catch (err) {
      setTargetError(toError(err));
      return;
    }
    setTargetError(null);

    if ((await copy(data)) && latestRef.current === element) {
      copiedRef.current?.removeAttribute('data-copied');
      element.setAttribute('data-copied', '');
      copiedRef.current = element;
    }
  };

  const value = useMemo(
    () => ({ ...clipboard, error: targetError ?? clipboard.error }),
    [clipboard, targetError],
  );

  return (
    <ClipboardContext.Provider value={value}>
      <div
        data-clipboard-provider=""
        style={{ display: 'contents' }}
        onClick={handleClick}
      >
        {children}
      </div>
    </ClipboardContext.Provider>
  );
}

export function useClipboardContext(): UseClipboardApiResult {
  const context = useContext(ClipboardContext);
  if (!context) {
    throw new Error(
      'useClipboardContext must be used within a ClipboardProvider.',
    );
  }
  return context;
}
