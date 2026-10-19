import type { ClipboardData } from './types';

export function readElement(target: Element, asHtml: boolean): ClipboardData {
  if (asHtml) {
    return { 'text/html': target.innerHTML, 'text/plain': target.textContent };
  }
  return target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement
    ? target.value
    : target.textContent;
}
