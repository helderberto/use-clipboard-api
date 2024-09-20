import { useState } from 'react';
import type { CopiedValue, CopyFn } from './types';

interface ClipboardService {
  writeText: (text: string) => Promise<void>;
}

class DefaultClipboardService implements ClipboardService {
  async writeText(text: string): Promise<void> {
    if (!navigator.clipboard) {
      throw new Error('Clipboard not supported.');
    }
    await navigator.clipboard.writeText(text);
  }
}

class ClipboardApi {
  private service: ClipboardService;

  constructor(service: ClipboardService) {
    this.service = service;
  }

  async copy(value: string): Promise<void> {
    await this.service.writeText(value);
  }
}

export default function useClipboardApi(): [
  CopiedValue,
  CopyFn,
  string | null,
] {
  const [copiedValue, setCopiedValue] = useState<CopiedValue>(null);
  const [error, setError] = useState<string | null>(null);
  const clipboardApi = new ClipboardApi(new DefaultClipboardService());

  const copy: CopyFn = async (value) => {
    try {
      await clipboardApi.copy(value);
      setCopiedValue(value);
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to Copy', err);
      setError(err.message);
      setCopiedValue(null);
      return false;
    }
  };

  return [copiedValue, copy, error];
}
