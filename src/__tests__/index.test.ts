import type {
  ClipboardData,
  ClipboardEntry,
  ClipboardProviderProps,
  CopiedValue,
  CopyComponentProps,
  CopyFn,
  CopyFromFn,
  CopyFromOptions,
  CopyProps,
  CopyState,
  GetCopyProps,
  UseClipboardApiOptions,
  UseClipboardApiResult,
} from '..';
import * as api from '..';

describe('public API', () => {
  it('exports only the documented values and types', () => {
    expect(Object.keys(api).sort()).toEqual([
      'ClipboardProvider',
      'Copy',
      'default',
      'useClipboardApi',
      'useClipboardContext',
    ]);
    expectTypeOf<ClipboardData>().not.toBeNever();
    expectTypeOf<ClipboardEntry>().not.toBeNever();
    expectTypeOf<ClipboardProviderProps>().not.toBeNever();
    expectTypeOf<CopiedValue>().not.toBeNever();
    expectTypeOf<CopyComponentProps>().not.toBeNever();
    expectTypeOf<CopyFn>().not.toBeNever();
    expectTypeOf<CopyFromFn>().not.toBeNever();
    expectTypeOf<CopyFromOptions>().not.toBeNever();
    expectTypeOf<CopyProps>().not.toBeNever();
    expectTypeOf<CopyState>().not.toBeNever();
    expectTypeOf<GetCopyProps>().not.toBeNever();
    expectTypeOf<UseClipboardApiOptions>().not.toBeNever();
    expectTypeOf<UseClipboardApiResult>().not.toBeNever();
  });
});
