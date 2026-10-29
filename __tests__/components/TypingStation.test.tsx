import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import TypingStation from '@/app/exhibitions/writing-revolution/typing-station/page';
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
