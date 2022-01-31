import { useState } from 'react';

import type { CopiedValue, CopyFn } from './types';

export default function useClipboard(): [CopiedValue, CopyFn] {
  const [copiedValue, setCopiedValue] = useState<CopiedValue>(null);

  const copy: CopyFn = async (value) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported.');
      return false;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      return true;
    } catch (err) {
      console.error('Failed to Copy', err);
      setCopiedValue(null);
      return false;
    }
  };

  return [copiedValue, copy];
}
