import { cloneElement, isValidElement } from 'react';
import type { HTMLAttributes, MouseEvent } from 'react';
import type { CopyComponentProps } from './types';
import { useClipboardApi } from './useClipboardApi';

export function Copy({
  data,
  timeout,
  asChild,
  children,
  onClick,
  ...buttonProps
}: CopyComponentProps) {
  const { getCopyProps } = useClipboardApi({ timeout });
  const { type, onClick: copy, ...copyProps } = getCopyProps(data);

  if (asChild) {
    if (!isValidElement<HTMLAttributes<HTMLElement>>(children)) {
      throw new Error('Copy with asChild expects one element child.');
    }
    // asChild needs the child itself, so cloning is the point here.
    // eslint-disable-next-line @eslint-react/no-clone-element
    return cloneElement(children, {
      ...buttonProps,
      ...children.props,
      ...copyProps,
      onClick: (event: MouseEvent<HTMLElement>) => {
        children.props.onClick?.(event);
        copy();
      },
    });
  }

  return (
    <button
      {...buttonProps}
      {...copyProps}
      type={type}
      onClick={(event) => {
        onClick?.(event);
        copy();
      }}
    >
      {typeof children === 'function'
        ? children({ copied: copyProps['data-copied'] === '' })
        : children}
    </button>
  );
}
