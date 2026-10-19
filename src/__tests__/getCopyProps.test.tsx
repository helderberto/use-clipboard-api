import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import { useClipboardApi } from '..';
import type { ClipboardData } from '..';

const writeText = vi.fn<(text: string) => Promise<void>>();
const write = vi.fn<(items: ClipboardItem[]) => Promise<void>>();

class FakeClipboardItem {
  constructor(readonly items: Record<string, unknown>) {}
}

function CopyButtons({ items }: { items: Record<string, ClipboardData> }) {
  const { getCopyProps } = useClipboardApi();
  return Object.entries(items).map(([label, data]) => (
    <button key={label} {...getCopyProps(data)}>
      {label}
    </button>
  ));
}

let user: UserEvent;

async function click(name: string) {
  await act(async () => {
    await user.click(screen.getByRole('button', { name }));
  });
}

beforeEach(() => {
  // setup() swaps in its own clipboard stub, so it runs before ours.
  user = userEvent.setup({ delay: null });
  writeText.mockReset().mockResolvedValue(undefined);
  write.mockReset().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', { clipboard: { writeText, write } });
  vi.stubGlobal('ClipboardItem', FakeClipboardItem);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getCopyProps', () => {
  it('returns button props without data-copied before a copy', () => {
    const { result } = renderHook(() => useClipboardApi());

    expect(result.current.getCopyProps('hello')).toEqual({
      type: 'button',
      onClick: expect.any(Function),
    });
  });

  it('copies on click and marks the button', async () => {
    render(<CopyButtons items={{ Copy: 'hello' }} />);

    await click('Copy');

    expect(writeText).toHaveBeenCalledWith('hello');
    expect(
      screen.getByRole('button', { name: 'Copy' }).hasAttribute('data-copied'),
    ).toBe(true);
  });

  it('marks only the button whose text was copied', async () => {
    render(<CopyButtons items={{ First: 'first', Second: 'second' }} />);

    await click('First');
    await click('Second');

    expect(
      screen.getByRole('button', { name: 'First' }).hasAttribute('data-copied'),
    ).toBe(false);
    expect(
      screen
        .getByRole('button', { name: 'Second' })
        .hasAttribute('data-copied'),
    ).toBe(true);
  });

  it('marks a record by its text/plain entry', async () => {
    render(
      <CopyButtons
        items={{ Rich: { 'text/html': '<b>hi</b>', 'text/plain': 'hi' } }}
      />,
    );

    await click('Rich');

    expect(write).toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: 'Rich' }).hasAttribute('data-copied'),
    ).toBe(true);
  });

  it('never marks a record without a string text/plain entry', async () => {
    render(<CopyButtons items={{ Html: { 'text/html': '<b>hi</b>' } }} />);

    await click('Html');

    expect(write).toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: 'Html' }).hasAttribute('data-copied'),
    ).toBe(false);
  });

  it('does not submit a surrounding form', async () => {
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
    document.addEventListener('submit', onSubmit);
    render(
      <form>
        <CopyButtons items={{ Copy: 'hello' }} />
      </form>,
    );

    await click('Copy');
    document.removeEventListener('submit', onSubmit);

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
