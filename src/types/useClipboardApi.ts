export type CopiedValue = string | null;

export type ClipboardEntry = string | Blob | Promise<string | Blob>;

export type ClipboardData = string | Record<string, ClipboardEntry>;

export type CopyFn = (data: ClipboardData) => Promise<boolean>;

export interface UseClipboardApiOptions {
  timeout?: number;
}

export interface UseClipboardApiResult {
  copiedValue: CopiedValue;
  copy: CopyFn;
  error: Error | null;
  isSupported: boolean;
}
