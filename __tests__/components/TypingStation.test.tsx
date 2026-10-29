import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import TypingStation from '@/app/exhibitions/writing-revolution/typing-station/page';
import { inkWords } from '@/app/exhibitions/writing-revolution/typing-station/ClassBoard';
import { BELL_BEFORE, LINE_WIDTH, newPage, pageText, strikeOvers, typeKey, type Page } from '@/app/exhibitions/writing-revolution/typing-station/typewriterPage';
import { STATION_TEXT, rowCheck } from '@/app/exhibitions/writing-revolution/typing-station/stationText';
import { WRITING_REVOLUTION } from '@/app/exhibitions/writing-revolution/writingRevolution';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * The typing station: the typewriter's page (no erasing, strike-overs, the
 * bell and the margin), the top row's check, the poster's words, and the
 * room's four tabs and sound switch, and the class board (posting from
 * either machine, one sitting by default, saving with a class code).
 */

const type = (page: Page, keys: string[]) => keys.reduce((p, k) => typeKey(p, k).page, page);

describe('the typewriter’s page', () => {
  it('strikes, spaces and returns the carriage', () => {
    const p = type(newPage(), [...'Hi there', 'Enter', ...'ok']);
    expect(pageText(p)).toBe('Hi there\nok');
    expect(p.line).toBe(1);
    expect(p.col).toBe(2);
  });

  it('never erases: Back space moves back, and the next key strikes over', () => {
    const p = type(newPage(), ['a', 'Backspace', 'e']);
    expect(p.lines[0][0]).toBe('ae');
    expect(strikeOvers(p)).toBe(1);
    expect(typeKey(newPage(), 'Backspace').page.col).toBe(0);
  });

  it('rings the bell near the margin, then piles every key on the last cell', () => {
    let p = newPage();
    const effects: string[] = [];
    for (let i = 0; i < LINE_WIDTH - BELL_BEFORE; i++) {
      const r = typeKey(p, 'x');
      p = r.page;
      effects.push(...r.effects);
    }
    expect(effects.filter((e) => e === 'bell')).toHaveLength(1);
    p = type(p, Array(BELL_BEFORE + 3).fill('y'));
    expect(p.col).toBe(LINE_WIDTH);
    expect(p.lines[0][LINE_WIDTH - 1]).toBe('yyyy');
    expect(typeKey(p, 'z').effects).toEqual(['locked']);
  });

  it('ignores keys that print nothing', () => {
    expect(typeKey(newPage(), 'Shift').effects).toEqual([]);
  });
});

describe('the top row', () => {
  it('checks the letters only, row by row', () => {
    expect(rowCheck('typewriter', 'top')).toMatchObject({ ok: true, letters: 'typewriter' });
    expect(rowCheck('Hello', 'top')).toMatchObject({ ok: false, off: ['h', 'l'] });
    expect(rowCheck('', 'top').ok).toBe(false);
    expect(rowCheck('zxc', 'bottom').ok).toBe(true);
  });
});

describe('the poster’s words', () => {
  it('quotes the line to type and the top row’s sentence from poster 2, and names the machines as the record does', () => {
    const copy = WRITING_REVOLUTION.posters[1].items.map((i) => (i as { text?: string }).text ?? '').join(' ');
    expect(STATION_TEXT.line).toBe('The keyboard beneath your fingers holds a 150-year-old secret.');
    expect(copy).toContain(STATION_TEXT.line);
    expect(copy).toContain(STATION_TEXT.topRowSentence);
    expect(STATION_TEXT.topRowSentence).toContain('"typewriter" remains one of the longest words you can type using only the top row');
    expect(STATION_TEXT.typewriterName).toBe('Portable Smith-Corona Galaxie typewriter');
    expect(STATION_TEXT.imacName).toBe('Apple iMac G3');
  });
});

describe('the room', () => {
  beforeEach(() => window.history.replaceState(null, '', '/'));

  it('keeps sound off until typing starts, and the switch turns it off again', () => {
    render(<TypingStation />);
    const sound = screen.getByRole('button', { name: 'Sound off' });
    expect(sound).toHaveAttribute('aria-pressed', 'false');

    const field = screen.getByRole('textbox', { name: /Portable Smith-Corona Galaxie typewriter: type here/ });
    for (const k of 'Hi') fireEvent.keyDown(field, { key: k });
    expect(document.getElementById('wrt-page-text')).toHaveTextContent('Hi');
    expect(screen.getByRole('button', { name: 'Sound on' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Sound on' }));
    expect(screen.getByRole('button', { name: 'Sound off' })).toHaveAttribute('aria-pressed', 'false');
    fireEvent.keyDown(field, { key: 'x' });
    expect(screen.getByRole('button', { name: 'Sound off' })).toBeInTheDocument();
  });

  it('types on a phone’s keyboard through the hidden field, Back space included', () => {
    render(<TypingStation />);
    const field = screen.getByRole('textbox', { name: /type here/ }) as HTMLTextAreaElement;
    fireEvent.input(field, { target: { value: '  ab' } });
    fireEvent.input(field, { target: { value: ' ' } });
    fireEvent.input(field, { target: { value: '  c' } });
    expect(document.getElementById('wrt-page-text')).toHaveTextContent('ac');
    expect(field.value).toBe('  ');
  });

  it('cuts, pastes and undoes on the iMac', () => {
    render(<TypingStation />);
    fireEvent.click(screen.getByRole('tab', { name: 'iMac' }));
    expect(window.location.hash).toBe('#imac');
    const page = screen.getByRole('textbox', { name: 'Apple iMac G3: the page' }) as HTMLTextAreaElement;
    fireEvent.change(page, { target: { value: 'one two' } });
    page.setSelectionRange(0, 4);
    fireEvent.click(screen.getByRole('button', { name: 'Cut' }));
    expect(page.value).toBe('two');
    page.setSelectionRange(3, 3);
    fireEvent.click(screen.getByRole('button', { name: 'Paste' }));
    expect(page.value).toBe('twoone ');
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(page.value).toBe('two');

    fireEvent.change(screen.getByRole('combobox', { name: 'Font' }), { target: { value: 'Courier' } });
    expect(page.style.fontFamily).toContain('Courier Prime');
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    expect(page.style.fontWeight).toBe('700');
  });

  it('checks a word on the top row, and on the bottom row', () => {
    render(<TypingStation />);
    const tabs = screen.getByRole('tablist');
    fireEvent.keyDown(within(tabs).getByRole('tab', { name: 'Typewriter' }), { key: 'End' });
    expect(within(tabs).getByRole('tab', { name: 'Class Board' })).toHaveFocus();
    fireEvent.keyDown(within(tabs).getByRole('tab', { name: 'Class Board' }), { key: 'ArrowLeft' });
    expect(within(tabs).getByRole('tab', { name: 'Top row' })).toHaveFocus();

    const word = screen.getByRole('textbox', { name: 'Your word' });
    fireEvent.change(word, { target: { value: 'typewriter' } });
    expect(screen.getByText('Every letter is on the top row: 10 letters.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Keep it' }));
    expect(screen.getByText('Your words')).toBeInTheDocument();

    fireEvent.change(word, { target: { value: 'hello' } });
    expect(screen.getByText('Not on the top row: H, L.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Keep it' })).toBeDisabled();

    fireEvent.click(screen.getByRole('radio', { name: 'Bottom row' }));
    fireEvent.click(screen.getByRole('button', { name: 'Z' }));
    expect(screen.getByText('Every letter is on the bottom row: 1 letter.')).toBeInTheDocument();
  });
});

describe('wiring', () => {
  it('sets the room on the landing page, the map and the projector', () => {
    const href = '/exhibitions/writing-revolution/typing-station';
    expect(WRITING_REVOLUTION.interactives?.map((c) => c.href)).toEqual([href]);
    expect(WRITING_REVOLUTION.projector.links.map((l) => l.href)).toEqual([href]);
    expect(getRoomByPath(href)?.id).toBe('wr-typing');
    expect(getLevelConfig(href).title).toBe('The Writing Revolution');
  });
});

describe('the class board', () => {
  type Call = { url: string; method: string; body?: string; headers: Record<string, string> };
  let calls: Call[];
  let available: boolean;

  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    window.localStorage.clear();
    calls = [];
    available = false;
    global.fetch = jest.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      const call = { url: String(url), method: init?.method ?? 'GET', body: init?.body as string | undefined, headers: (init?.headers ?? {}) as Record<string, string> };
      calls.push(call);
      const json = (body: unknown, status = 200) => ({ ok: status < 400, status, json: async () => body }) as Response;
      if (call.url === '/api/class-board' && call.method === 'GET') return json({ available });
      if (call.url === '/api/class-board' && call.method === 'POST') {
        const sent = JSON.parse(call.body!).messages as { text: string; machine: string }[];
        return json({ code: 'K7M3QX9P', teacherKey: 'teacher-key-123456789', messages: sent.map((m, i) => ({ ...m, id: `s${i}`, at: 0 })), skipped: 0 }, 201);
      }
      if (call.url === '/api/class-board/K7M3QX9P/messages') return json({ message: { ...JSON.parse(call.body!), id: 'n1', at: 0 } }, 201);
      if (call.url.startsWith('/api/class-board/K7M3QX9P/messages/')) return json({ deleted: true });
      return json({ error: 'not-found' }, 404);
    }) as jest.Mock;
  });

  const typeOn = (keys: string) => {
    const field = screen.getByRole('textbox', { name: /type here/ });
    for (const k of keys) fireEvent.keyDown(field, { key: k });
  };

  it('posts the typewriter’s sheet to the board as a typed card, and a fresh sheet goes in', () => {
    render(<TypingStation />);
    typeOn('Hello class');
    fireEvent.click(screen.getByRole('button', { name: 'Post to the board' }));
    expect(screen.getByRole('tab', { name: 'Class Board' })).toHaveAttribute('aria-selected', 'true');
    const board = screen.getByRole('tabpanel', { name: 'Class Board' });
    expect(within(board).getByText('Typed on the Typewriter.')).toBeInTheDocument();
    expect(within(board).getByRole('listitem')).toHaveTextContent('Hello class');
    expect(document.getElementById('wrt-page-text')).toHaveTextContent('The sheet is blank.');
    expect(within(board).getByText('Posted to the board.')).toHaveAttribute('role', 'status');
    // One sitting: nothing was sent anywhere but the check that saving is available.
    expect(calls.filter((c) => c.method !== 'GET')).toEqual([]);
  });

  it('turns away a link, and says why where it was typed', () => {
    render(<TypingStation />);
    fireEvent.click(screen.getByRole('tab', { name: 'iMac' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Apple iMac G3: the page' }), { target: { value: 'see www.example.com' } });
    fireEvent.click(within(screen.getByRole('tabpanel', { name: 'iMac' })).getByRole('button', { name: 'Post to the board' }));
    expect(screen.getByRole('tab', { name: 'iMac' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText('No links on the board, please.').length).toBeGreaterThan(0);
  });

  it('asks before a refresh clears an unsaved board', () => {
    render(<TypingStation />);
    typeOn('Hi');
    const before = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(before);
    expect(before.defaultPrevented).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Post to the board' }));
    const after = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(after);
    expect(after.defaultPrevented).toBe(true);
  });

  it('says saving is unavailable without the store, and the board still works', async () => {
    render(<TypingStation />);
    fireEvent.click(screen.getByRole('tab', { name: 'Class Board' }));
    expect(await screen.findByText(/Saving with a class code isn’t available here\./)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save with a class code' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Print the board' })).toBeDisabled();
  });

  it('saves with a class code, shows the teacher key once, and posts to the saved board', async () => {
    available = true;
    render(<TypingStation />);
    typeOn('First');
    fireEvent.click(screen.getByRole('button', { name: 'Post to the board' }));
    const save = screen.getByRole('button', { name: 'Save with a class code' });
    await waitFor(() => expect(save).toBeEnabled());
    await act(async () => {
      fireEvent.click(save);
    });
    expect(screen.getByRole('heading', { name: 'Saved: copy your teacher key' })).toBeInTheDocument();
    expect(screen.getByText('teacher-key-123456789')).toBeInTheDocument();
    expect(window.localStorage.getItem('mm-class-board-teacher:K7M3QX9P')).toBe('teacher-key-123456789');
    expect(screen.getByLabelText('Class code K 7 M 3 Q X 9 P')).toHaveTextContent('K7M3-QX9P');
    expect(screen.getByText(/deleted automatically 30 days after its last new message/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByText('teacher-key-123456789')).toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: 'Typewriter' }));
    typeOn('Second');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Post to the board' }));
    });
    const posted = calls.find((c) => c.url === '/api/class-board/K7M3QX9P/messages')!;
    expect(JSON.parse(posted.body!)).toMatchObject({ text: 'Second', machine: 'typewriter' });
    const board = screen.getByRole('tabpanel', { name: 'Class Board' });
    expect(within(board).getAllByRole('listitem')).toHaveLength(2);

    // The teacher key deletes a message.
    await act(async () => {
      fireEvent.click(within(board).getByRole('button', { name: 'Delete the message “Second”' }));
    });
    const del = calls.find((c) => c.method === 'DELETE')!;
    expect(del.headers['x-teacher-key']).toBe('teacher-key-123456789');
    expect(within(board).getAllByRole('listitem')).toHaveLength(1);
  });
});

/*
 * Found in the room's QA pass: what a child couldn't see (the bell, the
 * margin, an iMac button that seemed to do nothing), a typed card breaking
 * its words across lines, and a wrong teacher key that couldn't be
 * corrected.
 */
describe('fixes from the QA pass', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    window.localStorage.clear();
  });

  const flag = () => document.querySelector('.wrt-flag');

  it('shows the bell and the margin on the sheet, and counts no space past the margin', () => {
    jest.useFakeTimers();
    try {
      render(<TypingStation />);
      const field = screen.getByRole('textbox', { name: /type here/ });
      for (let i = 0; i < LINE_WIDTH - BELL_BEFORE; i++) fireEvent.keyDown(field, { key: 'a' });
      expect(flag()).toHaveTextContent(`Ding: ${BELL_BEFORE} spaces left on the line.`);
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      expect(flag()).toBeNull();
      for (let i = 0; i < BELL_BEFORE + 3; i++) fireEvent.keyDown(field, { key: 'b' });
      expect(flag()).toHaveTextContent('End of the line. Return the carriage.');
      // The margin's note stays until the carriage goes back.
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(flag()).toHaveTextContent('End of the line.');
      expect(document.querySelector('.wrt-count')).toHaveTextContent(`Line 1, space ${LINE_WIDTH}`);
      fireEvent.click(screen.getByRole('button', { name: 'Carriage return' }));
      expect(flag()).toBeNull();
      expect(document.querySelector('.wrt-count')).toHaveTextContent('Line 2, space 1');
    } finally {
      jest.useRealTimers();
    }
  });

  it('says on the iMac’s status bar what a toolbar button did, or why it did nothing', () => {
    render(<TypingStation />);
    fireEvent.click(screen.getByRole('tab', { name: 'iMac' }));
    const bar = document.querySelector('.wri-status')!;
    expect(bar).toHaveTextContent('0 words · Times 14');
    fireEvent.click(screen.getByRole('button', { name: 'Paste' }));
    expect(bar).toHaveTextContent('Nothing to paste yet: cut or copy first.');
    expect(bar).toHaveClass('is-saying');
  });

  it('keeps each typed word whole on its card', () => {
    expect(inkWords('ab cd\ne')).toEqual([
      [
        { ch: 'a', k: 0 },
        { ch: 'b', k: 1 },
      ],
      ' ',
      [
        { ch: 'c', k: 3 },
        { ch: 'd', k: 4 },
      ],
      '\n',
      [{ ch: 'e', k: 6 }],
    ]);
    render(<TypingStation />);
    const field = screen.getByRole('textbox', { name: /type here/ });
    for (const k of 'The keyboard beneath your fingers') fireEvent.keyDown(field, { key: k });
    fireEvent.click(screen.getByRole('button', { name: 'Post to the board' }));
    const words = [...document.querySelectorAll('.wrb-card .wrb-word')].map((w) => w.textContent);
    expect(words).toEqual(['The', 'keyboard', 'beneath', 'your', 'fingers']);
  });

  it('forgets a teacher key the board turns down, and offers to try another', async () => {
    const calls: { url: string; method: string; key?: string }[] = [];
    global.fetch = jest.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      const key = (init?.headers as Record<string, string> | undefined)?.['x-teacher-key'];
      calls.push({ url: String(url), method: init?.method ?? 'GET', key });
      const json = (body: unknown, status = 200) => ({ ok: status < 400, status, json: async () => body }) as Response;
      if (String(url) === '/api/class-board') return json({ available: true });
      if (String(url) === '/api/class-board/K7M3QX9P' && !init?.method) return json({ messages: [{ id: 'm1', text: 'Hello', machine: 'typewriter', at: 0 }] });
      if (init?.method === 'DELETE') return key === 'right-key' ? json({ deleted: true }) : json({ error: 'forbidden' }, 403);
      return json({ error: 'not-found' }, 404);
    }) as jest.Mock;
    window.history.replaceState(null, '', '/?board=K7M3QX9P#board');
    render(<TypingStation />);
    const board = screen.getByRole('tabpanel', { name: 'Class Board' });
    await waitFor(() => expect(within(board).getAllByRole('listitem')).toHaveLength(1));

    const tryKey = async (key: string) => {
      fireEvent.click(within(board).getByRole('button', { name: 'Teacher key' }));
      fireEvent.change(within(board).getByLabelText('Teacher key'), { target: { value: key } });
      fireEvent.click(within(board).getByRole('button', { name: 'Use key' }));
      await act(async () => {
        fireEvent.click(within(board).getByRole('button', { name: 'Delete the message “Hello”' }));
      });
    };
    await tryKey('wrong-key');
    expect(within(board).getByText(/That teacher key isn’t this board’s\./)).toBeInTheDocument();
    expect(window.localStorage.getItem('mm-class-board-teacher:K7M3QX9P')).toBeNull();
    expect(within(board).queryByRole('button', { name: /Delete the message/ })).toBeNull();

    // "Teacher key" is offered again, and the right one deletes the message.
    await tryKey('right-key');
    expect(within(board).queryAllByRole('listitem')).toHaveLength(0);
    expect(calls.filter((c) => c.method === 'DELETE').map((c) => c.key)).toEqual(['wrong-key', 'right-key']);
  });

  it('names the open saved board in the address, and takes it out when the board is left or deleted', async () => {
    global.fetch = jest.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      const json = (body: unknown, status = 200) => ({ ok: status < 400, status, json: async () => body }) as Response;
      if (String(url) === '/api/class-board' && !init?.method) return json({ available: true });
      if (String(url) === '/api/class-board') return json({ code: 'K7M3QX9P', teacherKey: 'k', messages: [], skipped: 0 }, 201);
      if (init?.method === 'DELETE') return json({ deleted: true });
      return json({ messages: [] });
    }) as jest.Mock;
    render(<TypingStation />);
    fireEvent.click(screen.getByRole('tab', { name: 'Class Board' }));
    const save = screen.getByRole('button', { name: 'Save with a class code' });
    await waitFor(() => expect(save).toBeEnabled());
    await act(async () => {
      fireEvent.click(save);
    });
    // A refresh comes back to the saved board, not to an empty one.
    expect(window.location.search).toBe('?board=K7M3QX9P');
    expect(window.location.hash).toBe('#board');
    fireEvent.click(screen.getByRole('button', { name: 'New board' }));
    expect(window.location.search).toBe('');
    expect(window.location.hash).toBe('#board');
  });

  it('undoes a font, a size and each style on the iMac, a step at a time, as well as the words', () => {
    render(<TypingStation />);
    fireEvent.click(screen.getByRole('tab', { name: 'iMac' }));
    const page = screen.getByRole('textbox', { name: 'Apple iMac G3: the page' }) as HTMLTextAreaElement;
    fireEvent.change(page, { target: { value: 'Hi' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Font' }), { target: { value: 'Courier' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Size' }), { target: { value: '24' } });
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    fireEvent.click(screen.getByRole('button', { name: 'Underline' }));
    const undo = screen.getByRole('button', { name: 'Undo' });
    fireEvent.click(undo);
    expect(page.style.textDecoration).toBe('none');
    expect(page.style.fontWeight).toBe('700');
    fireEvent.click(undo);
    expect(page.style.fontWeight).toBe('400');
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(undo);
    expect(page.style.fontSize).toBe('14px');
    fireEvent.click(undo);
    expect(page.style.fontFamily).toContain('Times');
    expect(page.value).toBe('Hi');
    fireEvent.click(undo);
    expect(page.value).toBe('');
  });

  it('has a Return key to tap, for a phone where the lever runs off the screen', () => {
    render(<TypingStation />);
    const field = screen.getByRole('textbox', { name: /type here/ });
    fireEvent.keyDown(field, { key: 'a' });
    fireEvent.click(screen.getByRole('button', { name: 'Return' }));
    expect(document.querySelector('.wrt-count')).toHaveTextContent('Line 2, space 1');
    const css = readFileSync(join(process.cwd(), 'app/exhibitions/writing-revolution/typing-station/typing.css'), 'utf8');
    expect(css).toMatch(/\.wrt \.wrt-key-return \{ display: none; \}/);
    expect(css).toMatch(/@media \(max-width: 760px\)[\s\S]*\.wrt \.wrt-key-return \{ display: block;/);
  });

  it('keeps the machines clear of the frame line, and pins the board’s cards to cork', () => {
    const css = readFileSync(join(process.cwd(), 'app/exhibitions/writing-revolution/typing-station/typing.css'), 'utf8');
    expect(css).toMatch(/--W: min\(780px, 94vw, calc\(\(100dvh - 330px\) \* 1\.36\)\)/);
    expect(css).toMatch(/\.wrs-panel-typewriter, \.wrs-panel-imac \{ padding-bottom: 30px; \}/);
    expect(css).toMatch(/\.wrb-sheet \{\s*background-color: #c79762;/);
    // Printed, the board is plain white again.
    expect(css).toMatch(/\.wrb-sheet \{ overflow: visible; border: 0; background: none; box-shadow: none;/);
  });

  it('draws the return lever on the carriage, and labels the kept words on any ground', () => {
    const css = readFileSync(join(process.cwd(), 'app/exhibitions/writing-revolution/typing-station/typing.css'), 'utf8');
    // The lever rides with the carriage: placed by the same --col the carriage moves by.
    expect(css).toMatch(/\.wrt \.wrt-lever \{[^}]*transform: translateX\(calc\(-7ch - var\(--col\) \* 1ch - 100%\)\)/);
    // "Your words" carries its own dark ground, so it reads on the charcoal and the cyan alike.
    expect(css).toMatch(/\.wrq-kept \.wrq-label \{[^}]*background: var\(--wr-ink\); color: #fff;/);
  });
});
