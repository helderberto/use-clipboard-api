export type CopiedValue = string | null;

export type CopyFn = (text: string) => Promise<boolean>;

export interface UseClipboardApiOptions {
  timeout?: number;
}

export interface UseClipboardApiResult {
  copiedValue: CopiedValue;
  copy: CopyFn;
  error: Error | null;
  isSupported: boolean;
}
