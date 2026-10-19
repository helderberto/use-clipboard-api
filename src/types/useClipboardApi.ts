export type CopiedValue = string | null;

export type ClipboardEntry = string | Blob | Promise<string | Blob>;

export type ClipboardData = string | Record<string, ClipboardEntry>;

export type CopyFn = (data: ClipboardData) => Promise<boolean>;

export interface CopyFromOptions {
  format?: 'html';
}

export type CopyFromFn = (
  ref: { readonly current: Element | null },
  options?: CopyFromOptions,
) => Promise<boolean>;

export interface CopyProps {
  type: 'button';
  onClick: () => void;
  'data-copied'?: '';
}

export type GetCopyProps = (data: ClipboardData) => CopyProps;

export interface UseClipboardApiOptions {
  timeout?: number;
}

export interface UseClipboardApiResult {
  copiedValue: CopiedValue;
  copy: CopyFn;
  copyFrom: CopyFromFn;
  error: Error | null;
  getCopyProps: GetCopyProps;
  isSupported: boolean;
}
