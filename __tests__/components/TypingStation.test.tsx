import { fireEvent, render, screen, within } from '@testing-library/react';
import TypingStation from '@/app/exhibitions/writing-revolution/typing-station/page';
import { BELL_BEFORE, LINE_WIDTH, newPage, pageText, strikeOvers, typeKey, type Page } from '@/app/exhibitions/writing-revolution/typing-station/typewriterPage';
import { STATION_TEXT, rowCheck } from '@/app/exhibitions/writing-revolution/typing-station/stationText';
import { WRITING_REVOLUTION } from '@/app/exhibitions/writing-revolution/writingRevolution';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * The typing station: the typewriter's page (no erasing, strike-overs, the
 * bell and the margin), the top row's check, the poster's words, and the
 * room's three tabs and sound switch.
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
