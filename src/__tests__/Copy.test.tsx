import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import { Copy } from '..';

const writeText = vi.fn<(text: string) => Promise<void>>();

let user: UserEvent;

async function click(element: Element) {
  await act(async () => {
    await user.click(element);
  });
}

beforeEach(() => {
  // setup() swaps in its own clipboard stub, so it runs before ours.
  user = userEvent.setup({ delay: null });
  writeText.mockReset().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', { clipboard: { writeText } });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Copy', () => {
  describe('rendering', () => {
    it('renders a button that does not submit forms', () => {
      render(<Copy data="hello">Copy</Copy>);

      expect(screen.getByRole('button', { name: 'Copy' })).toHaveProperty(
        'type',
        'button',
      );
    });

    it('passes button props through', () => {
      render(
        <Copy data="hello" className="copy" aria-label="Copy command">
          Copy
        </Copy>,
      );

      expect(
        screen.getByRole('button', { name: 'Copy command' }).className,
      ).toBe('copy');
    });
  });

  describe('interactions', () => {
    it('copies on click and marks the button', async () => {
      render(<Copy data="hello">Copy</Copy>);
      const button = screen.getByRole('button');

      await click(button);

      expect(writeText).toHaveBeenCalledWith('hello');
      expect(button.hasAttribute('data-copied')).toBe(true);
    });

    it('renders children from the copied state', async () => {
      render(
        <Copy data="hello">
          {({ copied }) => (copied ? 'Copied!' : 'Copy')}
        </Copy>,
      );

      await click(screen.getByRole('button', { name: 'Copy' }));

      expect(screen.getByRole('button').textContent).toBe('Copied!');
    });

    it('runs its onClick and still copies', async () => {
      const onClick = vi.fn();
      render(
        <Copy data="hello" onClick={onClick}>
          Copy
        </Copy>,
      );

      await click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledOnce();
      expect(writeText).toHaveBeenCalledWith('hello');
    });
  });

  describe('asChild', () => {
    it('puts the copy behavior on the child element', async () => {
      render(
        <Copy data="hello" asChild>
          <a href="#copy">Copy link</a>
        </Copy>,
      );
      const link = screen.getByRole('link', { name: 'Copy link' });

      await click(link);

      expect(screen.queryByRole('button')).toBeNull();
      expect(link.hasAttribute('type')).toBe(false);
      expect(writeText).toHaveBeenCalledWith('hello');
      expect(link.hasAttribute('data-copied')).toBe(true);
    });

    it('runs the child onClick and still copies', async () => {
      const onClick = vi.fn();
      render(
        <Copy data="hello" asChild>
          <button onClick={onClick}>Copy</button>
        </Copy>,
      );

      await click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledOnce();
      expect(writeText).toHaveBeenCalledWith('hello');
    });

    it('keeps child props over Copy props', () => {
      render(
        <Copy data="hello" className="outer" title="Copy" asChild>
          <button className="inner">Copy</button>
        </Copy>,
      );
      const button = screen.getByRole('button');

      expect(button.className).toBe('inner');
      expect(button.title).toBe('Copy');
    });

    it('throws without a single element child', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() =>
        render(
          <Copy data="hello" asChild>
            Copy
          </Copy>,
        ),
      ).toThrow('Copy with asChild expects one element child.');
    });
  });
});
