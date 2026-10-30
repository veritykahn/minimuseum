import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import TypingStation from '@/app/exhibitions/writing-revolution/typing-station/page';
import { beatTen, clockText, longestWordsMessage, mistakesLeft, raceText, raceVerdict, wordsUsed } from '@/app/exhibitions/writing-revolution/typing-station/challenges';
import { STATION_TEXT } from '@/app/exhibitions/writing-revolution/typing-station/stationText';
import { MESSAGE_MAX } from '@/lib/classBoard';

/*
 * The Typing Station's revamp: the teacher's prompt (B3) on both machines,
 * set in one sitting or with the teacher key on a saved board; the race
 * between the two machines; and "beat ten" on the top row.
 */

type Call = { url: string; method: string; body?: string; headers: Record<string, string> };
let calls: Call[];
let server: { available: boolean; prompt: unknown; putStatus?: number; putError?: string };

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  window.localStorage.clear();
  calls = [];
  server = { available: false, prompt: null };
  global.fetch = jest.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
    const call = { url: String(url), method: init?.method ?? 'GET', body: init?.body as string | undefined, headers: (init?.headers ?? {}) as Record<string, string> };
    calls.push(call);
    const json = (body: unknown, status = 200) => ({ ok: status < 400, status, json: async () => body }) as Response;
    if (call.url === '/api/class-board' && call.method === 'GET') return json({ available: server.available });
    if (call.url === '/api/class-board' && call.method === 'POST') {
      const sent = JSON.parse(call.body!);
      return json({ code: 'K7M3QX9P', teacherKey: 'teacher-key-123456789', messages: [], skipped: 0, prompt: sent.prompt ?? null }, 201);
    }
    if (call.url === '/api/class-board/K7M3QX9P' && call.method === 'GET') return json({ code: 'K7M3QX9P', messages: [], expiresIn: 100, prompt: server.prompt });
    if (call.url === '/api/class-board/K7M3QX9P' && call.method === 'PUT') {
      if (server.putStatus) return json({ error: server.putError }, server.putStatus);
      return json({ prompt: JSON.parse(call.body!).prompt });
    }
    return json({ error: 'not-found' }, 404);
  }) as jest.Mock;
});

const typeOn = (keys: string[]) => {
  const field = screen.getByRole('textbox', { name: /type here/ });
  for (const k of keys) fireEvent.keyDown(field, { key: k });
};
const header = () => document.querySelector('.wrs-bar') as HTMLElement;

describe('the challenges’ rules', () => {
  it('compares a race’s typing leniently: case, spacing, the carriage’s line breaks and a hyphen split across lines', () => {
    const line = STATION_TEXT.line;
    expect(mistakesLeft('the keyboard beneath your fingers holds a\n150-year-old secret.', line)).toBe(0);
    expect(mistakesLeft('The keyboard beneath your fingers holds a 150-\nyear-old secret.', line)).toBe(0);
    expect(mistakesLeft('The keybaord beneath your fingers holds a 150-year-old secret', line)).toBe(3);
    expect(mistakesLeft('', 'abc')).toBe(3);
    expect(raceText('  It’s   “here”\n')).toBe('it\'s "here"');
  });

  it('reads the stopwatch and names the winner', () => {
    expect(clockText(0)).toBe('0:00.0');
    expect(clockText(7_450)).toBe('0:07.4');
    expect(clockText(62_000)).toBe('1:02.0');
    expect(raceVerdict(41_200, 18_000)).toBe('The iMac won by 23.2 seconds.');
    expect(raceVerdict(10_000, 12_500)).toBe('The typewriter won by 2.5 seconds!');
    expect(raceVerdict(10_000, 10_050)).toBe('A dead heat!');
  });

  it('ticks off a word list’s words as whole words, in any case', () => {
    expect(wordsUsed('Bell, platen, carriage return', 'The BELL rang; the carriage return slid.')).toEqual([
      { word: 'Bell', used: true },
      { word: 'platen', used: false },
      { word: 'carriage return', used: true },
    ]);
    expect(wordsUsed('cat', 'concatenate')[0].used).toBe(false);
  });

  it('measures a top-row word against “typewriter”', () => {
    expect(beatTen('typewriter')).toEqual({ kind: 'poster' });
    expect(beatTen('type')).toEqual({ kind: 'short', toGo: 6 });
    expect(beatTen('proprietor')).toEqual({ kind: 'ten' });
    expect(beatTen('rupturewort')).toEqual({ kind: 'longer', by: 1 });
  });

  it('makes the longest-words list one board message that fits', () => {
    expect(longestWordsMessage([{ word: 'proprietor', row: 'top' }, { word: 'pet', row: 'top' }], MESSAGE_MAX)).toBe('Our longest top-row words: PROPRIETOR (10), PET (3)');
    expect(longestWordsMessage([{ word: 'pet', row: 'top' }, { word: 'zxc', row: 'bottom' }], MESSAGE_MAX)).toBe('Our longest one-row words: PET (3, top row), ZXC (3, bottom row)');
    const many = Array.from({ length: 60 }, (_, i) => ({ word: `word${'q'.repeat(i % 7)}${i}`, row: 'top' as const }));
    expect([...longestWordsMessage(many, MESSAGE_MAX)].length).toBeLessThanOrEqual(MESSAGE_MAX);
  });
});

describe('the race', () => {
  let now: number;
  beforeEach(() => {
    now = 1_000_000;
    jest.spyOn(Date, 'now').mockImplementation(() => now);
  });
  afterEach(() => jest.restoreAllMocks());

  // The line, with the carriage returned before "150" (the line is longer than the sheet is wide), and one typo struck over.
  const LINE_KEYS = [...'The keyboard beneath your fingers holds a', 'Enter', ...'150-yeer', 'Backspace', 'Backspace', ...'ar-old secret.'];

  it('times the line on each machine, stops each clock by itself, and sets the times side by side with the strike-overs', async () => {
    render(<TypingStation />);
    fireEvent.click(screen.getByRole('button', { name: /Race the two machines/ }));
    const bar = screen.getByRole('group', { name: 'The race' });
    expect(within(bar).getByText(STATION_TEXT.race.label)).toBeInTheDocument();
    // The clock waits for the first key.
    expect(within(bar).getByRole('button', { name: 'Stop the clock' })).toBeDisabled();

    typeOn([LINE_KEYS[0]]);
    now += 30_000;
    typeOn(LINE_KEYS.slice(1, -1));
    expect(screen.getByRole('button', { name: 'Stop the clock' })).toBeEnabled();
    now += 11_200;
    typeOn(LINE_KEYS.slice(-1));
    // Right first time: the typewriter's clock stopped at 41.2 seconds, and the iMac is next.
    expect(within(bar).getAllByText('0:41.2').length).toBeGreaterThan(0);
    expect(screen.getByText(/Typewriter: 41.2 seconds\. Now the iMac/)).toHaveAttribute('role', 'status');
    fireEvent.click(screen.getByRole('button', { name: /On to the iMac/ }));
    expect(screen.getByRole('tab', { name: 'iMac' })).toHaveAttribute('aria-selected', 'true');

    const page = screen.getByRole('textbox', { name: 'Apple iMac G3: the page' });
    fireEvent.change(page, { target: { value: 'T' } });
    now += 18_000;
    fireEvent.change(page, { target: { value: STATION_TEXT.line } });

    const results = screen.getByRole('region', { name: 'Race results' });
    expect(within(results).getByText('0:41.2')).toBeInTheDocument();
    expect(within(results).getByText('0:18.0')).toBeInTheDocument();
    expect(within(results).getByText('2 strike-overs')).toBeInTheDocument();
    expect(within(results).getByText('The iMac won by 23.2 seconds.')).toBeInTheDocument();
    expect(within(results).getAllByText('Every letter right')).toHaveLength(2);
    expect(within(results).getByRole('heading', { name: 'Race results' })).toHaveFocus();

    // The times go up on the class board.
    fireEvent.click(within(results).getByRole('button', { name: 'Post our times to the board' }));
    const board = screen.getByRole('tabpanel', { name: 'Class Board' });
    expect(within(board).getByRole('listitem')).toHaveTextContent('Our race: typewriter 0:41.2 (2 strike-overs), iMac 0:18.0. The iMac won by 23.2 seconds.');
    expect(screen.queryByRole('region', { name: 'Race results' })).toBeNull();
  });

  it('starts both machines on a fresh page, stops at “Stop the clock” with the letters still off, and ends', () => {
    render(<TypingStation />);
    typeOn([...'old work']);
    fireEvent.click(screen.getByRole('button', { name: /Race the two machines/ }));
    expect(document.getElementById('wrt-page-text')).toHaveTextContent('The sheet is blank.');
    typeOn([...'The keyboard']);
    now += 5_000;
    fireEvent.click(screen.getByRole('button', { name: 'Stop the clock' }));
    fireEvent.click(screen.getByRole('button', { name: /On to the iMac/ }));
    const page = screen.getByRole('textbox', { name: 'Apple iMac G3: the page' });
    fireEvent.change(page, { target: { value: 'The' } });
    now += 2_000;
    fireEvent.click(screen.getByRole('button', { name: 'Stop the clock' }));
    const results = screen.getByRole('region', { name: 'Race results' });
    expect(within(results).getByText('50 letters off the line')).toBeInTheDocument();
    // Escape closes the results, and the line is back with the race's start.
    fireEvent.keyDown(within(results).getByRole('heading'), { key: 'Escape' });
    expect(screen.queryByRole('region', { name: 'Race results' })).toBeNull();
    expect(screen.getByRole('button', { name: /Race the two machines/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Race the two machines/ }));
    fireEvent.click(screen.getByRole('button', { name: 'End the race' }));
    expect(screen.queryByRole('group', { name: 'The race' })).toBeNull();
  });
});

describe('the teacher’s prompt (B3)', () => {
  const openForm = () => {
    fireEvent.click(screen.getByRole('tab', { name: 'Class Board' }));
    fireEvent.click(screen.getByRole('button', { name: 'Set a prompt' }));
  };

  it('is set in one sitting without a class code, shown on both machines, and a word list is ticked off as it is typed', async () => {
    render(<TypingStation />);
    openForm();
    fireEvent.click(screen.getByRole('radio', { name: 'Word list' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'The prompt' }), { target: { value: 'keyboard, secret, platen' } });
    expect(screen.getByText(/3 words\./)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show on both machines' }));
    });
    // Nothing was sent: one sitting.
    expect(calls.filter((c) => c.method !== 'GET')).toEqual([]);
    expect(screen.getByText(STATION_TEXT.prompt.localNote)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Typewriter' }));
    expect(within(header()).getByText('Word list')).toBeInTheDocument();
    expect(within(header()).getByText('0 of 3 words used')).toBeInTheDocument();
    typeOn([...'my keyboard']);
    expect(within(header()).getByText('1 of 3 words used')).toBeInTheDocument();
    expect(within(header()).getByText('keyboard')).toHaveClass('is-used');

    // The iMac shows it too, ticked by its own page.
    fireEvent.click(screen.getByRole('tab', { name: 'iMac' }));
    expect(within(header()).getByText('0 of 3 words used')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Apple iMac G3: the page' }), { target: { value: 'A secret platen' } });
    expect(within(header()).getByText('2 of 3 words used')).toBeInTheDocument();
  });

  it('shows a topic or a writing prompt in place of the line, and clears', async () => {
    render(<TypingStation />);
    openForm();
    fireEvent.click(screen.getByRole('radio', { name: 'Writing prompt' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'The prompt' }), { target: { value: 'Write a letter to a friend.' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show on both machines' }));
    });
    fireEvent.click(screen.getByRole('tab', { name: 'Typewriter' }));
    expect(within(header()).getByText('Writing prompt')).toBeInTheDocument();
    expect(within(header()).getByText(/Write a letter to a friend\./)).toBeInTheDocument();
    expect(within(header()).queryByText(STATION_TEXT.line)).toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: 'Class Board' }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Clear the prompt' }));
    });
    fireEvent.click(screen.getByRole('tab', { name: 'Typewriter' }));
    expect(within(header()).getByText(STATION_TEXT.line)).toBeInTheDocument();
  });

  it('moderates the teacher’s text as it moderates a message', async () => {
    render(<TypingStation />);
    openForm();
    fireEvent.change(screen.getByRole('textbox', { name: 'The prompt' }), { target: { value: 'see www.example.com' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show on both machines' }));
    });
    expect(screen.getByRole('alert')).toHaveTextContent('No links in the prompt, please.');
    fireEvent.change(screen.getByRole('textbox', { name: 'The prompt' }), { target: { value: 'sh1t' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show on both machines' }));
    });
    expect(screen.getByRole('alert')).toHaveTextContent('The prompt has a word the board doesn’t allow.');
    fireEvent.click(screen.getByRole('tab', { name: 'Typewriter' }));
    expect(within(header()).getByText(STATION_TEXT.line)).toBeInTheDocument();
  });

  it('goes with the board when it is saved under a class code', async () => {
    server.available = true;
    render(<TypingStation />);
    openForm();
    fireEvent.change(screen.getByRole('textbox', { name: 'The prompt' }), { target: { value: 'Our school' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show on both machines' }));
    });
    const save = screen.getByRole('button', { name: 'Save with a class code' });
    await waitFor(() => expect(save).toBeEnabled());
    await act(async () => {
      fireEvent.click(save);
    });
    const made = calls.find((c) => c.url === '/api/class-board' && c.method === 'POST')!;
    expect(JSON.parse(made.body!).prompt).toEqual({ kind: 'topic', text: 'Our school' });
    expect(screen.getByText(STATION_TEXT.prompt.savedNote)).toBeInTheDocument();
  });

  it('is the board’s on a saved board: students with the code see it, and cannot change it', async () => {
    server.available = true;
    server.prompt = { kind: 'topic', text: 'Inventions at home' };
    window.history.replaceState(null, '', '/?board=K7M3QX9P#board');
    render(<TypingStation />);
    const board = screen.getByRole('tabpanel', { name: 'Class Board' });
    await waitFor(() => expect(within(board).getByText('Inventions at home')).toBeInTheDocument());
    expect(within(board).getByText(STATION_TEXT.prompt.keyNote)).toBeInTheDocument();
    expect(within(board).queryByRole('button', { name: 'Change' })).toBeNull();
    fireEvent.click(screen.getByRole('tab', { name: 'Typewriter' }));
    expect(within(header()).getByText('Topic')).toBeInTheDocument();
    expect(within(header()).getByText(/Inventions at home/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'iMac' }));
    expect(within(header()).getByText(/Inventions at home/)).toBeInTheDocument();
  });

  it('is set with the teacher key on a saved board, and a refused key is forgotten', async () => {
    server.available = true;
    window.localStorage.setItem('mm-class-board-teacher:K7M3QX9P', 'teacher-key-123456789');
    window.history.replaceState(null, '', '/?board=K7M3QX9P#board');
    render(<TypingStation />);
    const board = screen.getByRole('tabpanel', { name: 'Class Board' });
    await waitFor(() => expect(within(board).getByRole('button', { name: 'Set a prompt' })).toBeInTheDocument());
    fireEvent.click(within(board).getByRole('button', { name: 'Set a prompt' }));
    fireEvent.click(within(board).getByRole('radio', { name: 'Word list' }));
    fireEvent.change(within(board).getByRole('textbox', { name: 'The prompt' }), { target: { value: 'bell, ribbon' } });
    await act(async () => {
      fireEvent.click(within(board).getByRole('button', { name: 'Show on both machines' }));
    });
    const put = calls.find((c) => c.method === 'PUT')!;
    expect(put.url).toBe('/api/class-board/K7M3QX9P');
    expect(put.headers['x-teacher-key']).toBe('teacher-key-123456789');
    expect(JSON.parse(put.body!)).toEqual({ prompt: { kind: 'words', text: 'bell, ribbon' } });
    expect(within(board).getByText('bell, ribbon')).toBeInTheDocument();

    server.putStatus = 403;
    server.putError = 'forbidden';
    await act(async () => {
      fireEvent.click(within(board).getByRole('button', { name: 'Clear the prompt' }));
    });
    expect(within(board).getByRole('alert')).toHaveTextContent('That teacher key isn’t this board’s.');
    expect(window.localStorage.getItem('mm-class-board-teacher:K7M3QX9P')).toBeNull();
    expect(within(board).queryByRole('button', { name: 'Clear the prompt' })).toBeNull();
  });
});

describe('beat ten on the top row', () => {
  const keep = (word: string) => {
    fireEvent.change(screen.getByRole('textbox', { name: 'Your word' }), { target: { value: word } });
    fireEvent.click(screen.getByRole('button', { name: 'Keep it' }));
  };
  const status = () => screen.getAllByRole('status').map((s) => s.textContent).join(' | ');

  it('fills a meter of ten as a top-row word grows, and says how far a kept word is from ten', () => {
    render(<TypingStation />);
    fireEvent.click(screen.getByRole('tab', { name: 'Top row' }));
    expect(screen.getByText(STATION_TEXT.beatTen.goal)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Your word' }), { target: { value: 'pretty' } });
    expect(document.querySelectorAll('.wrq-ten-cell.is-lit')).toHaveLength(6);
    expect(document.querySelector('.wrq-ten-count')).toHaveTextContent('6 / 10');
    keep('pretty');
    expect(status()).toContain('Kept: PRETTY. 4 more letters would make ten.');
    keep('typewriter');
    expect(status()).toContain('That’s the poster’s word, ten letters. Can you find another?');
    expect(document.querySelector('.wrq-note')).not.toHaveClass('is-win');
  });

  it('celebrates another ten-letter word, or a longer one, and posts the longest words to the board', () => {
    render(<TypingStation />);
    fireEvent.click(screen.getByRole('tab', { name: 'Top row' }));
    keep('pet');
    keep('proprietor');
    expect(status()).toContain('You beat ten! PROPRIETOR has ten letters, as many as “typewriter”.');
    expect(document.querySelector('.wrq-note')).toHaveClass('is-win');
    expect(document.querySelectorAll('.wrq-burst span')).toHaveLength(12);
    keep('rupturewort');
    expect(status()).toContain('You beat ten! RUPTUREWORT has 11 letters, longer than “typewriter”.');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your word' }), { target: { value: 'rupturewort' } });
    expect(document.querySelectorAll('.wrq-ten-cell.is-extra.is-lit')).toHaveLength(1);

    const list = document.querySelector('.wrq-kept')!;
    expect([...list.querySelectorAll('li')].map((li) => li.textContent)).toEqual(['RUPTUREWORT 11 (beats ten)', 'PROPRIETOR 10 (beats ten)', 'PET 3']);
    expect(within(list as HTMLElement).getByText(STATION_TEXT.beatTen.dictionary)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Post the list to the board' }));
    const board = screen.getByRole('tabpanel', { name: 'Class Board' });
    expect(within(board).getByRole('listitem')).toHaveTextContent('Our longest top-row words: RUPTUREWORT (11), PROPRIETOR (10), PET (3)');
  });

  it('keeps the celebrations and the race still for reduced motion', () => {
    const css = readFileSync(join(process.cwd(), 'app/exhibitions/writing-revolution/typing-station/typing.css'), 'utf8');
    const reduced = [...css.matchAll(/@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\n\}/g)].map((m) => m[1]).join('\n');
    expect(reduced).toMatch(/\.wrq-burst \{ display: none; \}/);
    expect(reduced).toMatch(/\.wrr-card, \.wrq-note, \.wrq-note\.is-win \{ animation: none; \}/);
  });
});
