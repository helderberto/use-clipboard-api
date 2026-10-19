import type { ReactNode } from 'react';
import type { UseClipboardApiOptions } from './useClipboardApi';

export interface ClipboardProviderProps extends UseClipboardApiOptions {
  children?: ReactNode;
}
