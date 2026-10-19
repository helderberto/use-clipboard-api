import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { ClipboardData, UseClipboardApiOptions } from './useClipboardApi';

export interface CopyState {
  copied: boolean;
}

export interface CopyComponentProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'>,
    UseClipboardApiOptions {
  data: ClipboardData;
  asChild?: boolean;
  children?: ReactNode | ((state: CopyState) => ReactNode);
}
