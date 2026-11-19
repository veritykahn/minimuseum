import { act, fireEvent, render, screen, within } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import VictorianInventions from '@/app/exhibitions/victorian/inventions/page';
import { MORSE, MORSE_LEARN, MORSE_MESSAGES, MORSE_WORDS, NOTES, TELEGRAM, TELEGRAM_DRAFTS } from '@/app/exhibitions/victorian/inventions/inventionsText';
import { DOT_MS } from '@/app/exhibitions/victorian/inventions/morseKit';
import { coinsFor, missingIdeas, purseFor, wordsFor } from '@/app/exhibitions/victorian/inventions/office';
import { MORSE_FACTS } from '@/app/exhibitions/victorian/inventions/sources';
import { morseTimeline, oldMoney, telegramCost, telegramWords } from '@/app/exhibitions/victorian/inventions/workshop';
import { resetMuseumSoundForTests } from '@/lib/museumSound';

/*
 * The Morse code bench (its own tab: learn a few letters, tap them on the
 * key, decode a message), the telegraph office's money (a purse, a price,
 * words crossed out until it fits, the clerk at the key), and every
 * bench's picture reaching the foot of the page.
 */

const DIR = path.join(process.cwd(), 'app/exhibitions/victorian/inventions');
const at = (hash = '') => window.history.replaceState(null, '', `/exhibitions/victorian/inventions${hash}`);
/** Text on the card itself (the status line, for screen readers, may say the same). */
const SHOWN = { ignore: '[role=status], script, style' };
const LETTERS = Object.keys(MORSE).filter((k) => /^[A-Z]$/.test(k));

beforeEach(() => {
  try {
    window.sessionStorage.clear();
  } catch {}
  resetMuseumSoundForTests();
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

/** Taps a letter's code on the key: a quick press for a dot, a long one for a dash. */
function tapOut(key: HTMLElement, code: string) {
  for (const m of code) {
    fireEvent.pointerDown(key);
    act(() => {
      jest.advanceTimersByTime(m === '.' ? 80 : DOT_MS + 200);
    });
    fireEvent.pointerUp(key);
  }
}

describe('the Morse code bench', () => {
  beforeEach(() => at('#morse'));

  it('is its own tab in the workshop, with its sources', () => {
    render(<VictorianInventions />);
    expect(screen.getByRole('tab', { name: 'Morse code' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('group', { name: 'Morse code, in three parts' })).toBeInTheDocument();
    expect(MORSE_FACTS).toEqual([NOTES.morse, NOTES.morseBritain]);
    // Every letter used to learn, send and decode is in the chart.
    for (const w of [...MORSE_WORDS, ...MORSE_MESSAGES]) for (const c of w.replace(/ /g, '')) expect(MORSE_LEARN).toContain(c);
  });

  it('learns a letter: its card shows its code, a quick tap is a dot and a longer press a dash, and a wrong tap says what it was', () => {
    jest.useFakeTimers();
    render(<VictorianInventions />);
    const key = screen.getByRole('button', { name: 'The Morse key: tap for a dot, hold for a dash' });
    // Before a card: what to do.
    tapOut(key, '.');
    expect(screen.getByText('First tap a letter card, then copy its code on the key.', SHOWN)).toBeInTheDocument();
    const a = screen.getByRole('button', { name: 'A: dot dash' });
    fireEvent.click(a);
    expect(a).toHaveAttribute('aria-pressed', 'true');
    // Two dots is I, not A.
    tapOut(key, '..');
    expect(screen.getByText('You tapped dot dot: that’s I. A is dot dash. Try A again.', SHOWN)).toBeInTheDocument();
    tapOut(key, '.-');
    expect(screen.getByText(/^dot dash: that’s A!/, SHOWN)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A: dot dash (learned)' })).toHaveAttribute('data-learned', 'true');
    expect(screen.getByText(/1 of 8 letters learned/)).toBeInTheDocument();
  });

  it('copies all eight with the Dot and Dash buttons too (or Space on the key), then goes on to send a word', () => {
    jest.useFakeTimers();
    render(<VictorianInventions />);
    for (const l of MORSE_LEARN) {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${l}: `) }));
      for (const m of MORSE[l]) fireEvent.click(screen.getByRole('button', { name: m === '.' ? 'Dot' : 'Dash' }));
    }
    expect(screen.getByText(/You know all eight letters/, SHOWN)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^Send a word/ }));
    expect(screen.getByRole('button', { name: '2. Send' })).toHaveAttribute('aria-pressed', 'true');
    // Space on the key: held long, a dash.
    const key = screen.getByRole('button', { name: 'The Morse key: tap for a dot, hold for a dash' });
    const word = MORSE_WORDS[0];
    for (const c of word)
      for (const m of MORSE[c]) {
        fireEvent.keyDown(key, { key: ' ' });
        act(() => {
          jest.advanceTimersByTime(m === '.' ? 60 : DOT_MS + 200);
        });
        fireEvent.keyUp(key, { key: ' ' });
      }
    expect(screen.getByText(`You sent ${word}!`, SHOWN)).toBeInTheDocument();
    expect(document.querySelectorAll('.vbi-morse-word .vbi-morse-slot[data-done]')).toHaveLength(word.length);
  });

  it('decodes a message chosen at random: the marks come in on the tape, and each letter is pressed in turn', () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0);
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: '3. Decode' }));
    const picks = screen.getByRole('group', { name: 'The letters' });
    expect(within(picks).getByRole('button', { name: /^E: / })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Play the message' }));
    const msg = MORSE_MESSAGES[0];
    act(() => {
      jest.advanceTimersByTime(250 + morseTimeline(msg, MORSE, 150).reduce((s, p) => s + p.ms, 0) + 100);
    });
    const letters = msg.replace(/ /g, '');
    expect(document.querySelectorAll('.vbi-morse-message .vbi-morse-slot-c[data-shown]')).toHaveLength(letters.length);
    const wrong = MORSE_LEARN.find((l) => l !== letters[0])!;
    fireEvent.click(within(picks).getByRole('button', { name: new RegExp(`^${wrong}: `) }));
    expect(document.querySelector('.vbi-morse-message [data-miss]')).not.toBeNull();
    for (const c of letters) fireEvent.click(within(picks).getByRole('button', { name: new RegExp(`^${c}: `) }));
    expect(screen.getByText(`Well decoded! “${msg}”`, SHOWN)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Another message' }));
    expect(screen.getByRole('button', { name: 'Play the message' })).toBeEnabled();
  });

  it('is silent until the museum’s sound is turned on, and then the key sounds while it is down', () => {
    jest.useFakeTimers();
    const started = jest.fn();
    const made = jest.fn();
    class FakeAudio {
      destination = {};
      constructor() {
        made();
      }
      createGain() {
        return { gain: { value: 0 }, connect: jest.fn() };
      }
      createOscillator() {
        return { frequency: { value: 0 }, connect: jest.fn(), start: started, stop: jest.fn() };
      }
    }
    const was = (window as unknown as { AudioContext?: unknown }).AudioContext;
    (window as unknown as { AudioContext?: unknown }).AudioContext = FakeAudio;
    try {
      render(<VictorianInventions />);
      const key = screen.getByRole('button', { name: 'The Morse key: tap for a dot, hold for a dash' });
      const sound = screen.getByRole('button', { name: /Sound off/ });
      expect(sound).toHaveAttribute('aria-pressed', 'false');
      tapOut(key, '.');
      expect(made).not.toHaveBeenCalled();
      fireEvent.click(sound);
      expect(screen.getByRole('button', { name: /Sound on/ })).toHaveAttribute('aria-pressed', 'true');
      tapOut(key, '.');
      expect(started).toHaveBeenCalled();
    } finally {
      (window as unknown as { AudioContext?: unknown }).AudioContext = was;
    }
  });
});

describe('the telegraph office’s money', () => {
  beforeEach(() => at('#telegraph'));

  it('fills a purse, counts what it pays for and the coins it holds', () => {
    expect(purseFor(0)).toBe(12);
    expect(purseFor(0.99)).toBe(16);
    expect(TELEGRAM.purses.map(oldMoney)).toEqual(['6d', '7d', '8d']);
    expect(wordsFor(12)).toBe(12);
    expect(wordsFor(14)).toBe(14);
    expect(wordsFor(11)).toBe(0);
    for (const h of TELEGRAM.purses) expect(telegramCost(wordsFor(h))).toBe(h);
    expect(coinsFor(15)).toEqual(['6d', '1d', '½d']);
    // Every letter to start from costs more than any purse holds, so there is something to cut.
    for (const d of TELEGRAM_DRAFTS) expect(telegramCost(telegramWords(d.text).length)).toBeGreaterThan(Math.max(...TELEGRAM.purses));
    for (const d of TELEGRAM_DRAFTS) for (const c of d.text.replace(/ /g, '')) expect(LETTERS).toContain(c);
    // What each letter must still say is in it, and fits in the smallest purse with room to spare.
    for (const d of TELEGRAM_DRAFTS) {
      for (const k of d.keep) for (const w of k.words) expect(telegramWords(d.text)).toContain(w);
      expect(d.keep.length).toBeLessThan(wordsFor(Math.min(...TELEGRAM.purses)));
    }
    const ada = TELEGRAM_DRAFTS[0];
    expect(missingIdeas(telegramWords(ada.text), ada.keep)).toEqual([]);
    expect(missingIdeas(['ARRIVED', 'BATH', 'ADA'], ada.keep).map((k) => k.words)).toEqual([['COAT']]);
    expect(missingIdeas(['SAFELY', 'BATH', 'COAT', 'ADA'], ada.keep)).toEqual([]);
  });

  it('writes a telegram, is told at the counter there is not enough money, crosses words out until it fits, and the clerk sends it', () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0);
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Send a telegram' }));
    expect(screen.getByRole('list', { name: 'In your purse: 6d' })).toBeInTheDocument();
    // An empty form first.
    fireEvent.click(screen.getByRole('button', { name: 'Hand it over the counter' }));
    expect(screen.getByText('“Your form is empty! Write your telegram first, please.”', SHOWN)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ada’s letter' }));
    const n = telegramWords(TELEGRAM_DRAFTS[0].text).length;
    const cost = oldMoney(telegramCost(n));
    expect(screen.getByText(`Costs ${cost}: not enough!`)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Hand it over the counter' }));
    expect(screen.getByText(`“That will be ${cost}, please.” You only have 6d. Tap words on the form to cross ${n - 12} out: 6d pays for 12 words.`, SHOWN)).toBeInTheDocument();
    // Not on to the clerk until it is paid for.
    fireEvent.click(screen.getByRole('button', { name: /^Step 2: / }));
    expect(screen.getByText('“Hand your form over the counter first, please.”', SHOWN)).toBeInTheDocument();
    const form = screen.getByRole('list', { name: /Your telegram, word by word/ });
    const tokens = within(form).getAllByRole('button');
    expect(tokens).toHaveLength(n);
    // Cross out every word but the first twelve; one put back and crossed again.
    for (const t of tokens.slice(12)) fireEvent.click(t);
    fireEvent.click(tokens[20]);
    expect(tokens[20]).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(tokens[20]);
    expect(tokens[20]).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Costs 6d: enough!')).toBeInTheDocument();
    // Cut from the end, it no longer says what to send, or who it is from: the clerk reads it back and asks.
    fireEvent.click(screen.getByRole('button', { name: 'Hand it over the counter' }));
    expect(screen.getByText('The clerk reads it back. “Will your mother know what to send?” Tap a crossed-out word to put it back, and cut another instead.', SHOWN)).toBeInTheDocument();
    const words = telegramWords(TELEGRAM_DRAFTS[0].text);
    const coat = tokens[words.indexOf('COAT')];
    expect(coat).toHaveAttribute('data-needed', 'true');
    fireEvent.click(coat);
    fireEvent.click(tokens[words.indexOf('ADA')]);
    fireEvent.click(tokens[0]);
    fireEvent.click(tokens[1]);
    expect(screen.getByText('Costs 6d: enough!')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Hand it over the counter' }));
    // The clerk, not the visitor, works the key.
    expect(screen.getByText(/You don’t work the key: the clerk does\./)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /The Morse key/ })).toBeNull();
    act(() => {
      jest.advanceTimersByTime(400 + 1);
    });
    expect(document.querySelector('.vbi-clerk')).toHaveAttribute('data-on', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Skip to the end' }));
    expect(screen.getByText('Sent! A messenger will carry it to the door.', SHOWN)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^Step 3: / }));
    expect(screen.getByRole('button', { name: 'Print my telegram' })).toBeInTheDocument();
  });

  it('gives change from a bigger purse', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.99);
    media(() => true);
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Send a telegram' }));
    expect(screen.getByRole('list', { name: 'In your purse: 8d' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Your telegram' }), { target: { value: 'home at noon' } });
    fireEvent.click(screen.getByRole('button', { name: 'Hand it over the counter' }));
    expect(screen.getByText('“6d. Thank you!” Your change: 2d.', SHOWN)).toBeInTheDocument();
  });
});

describe('every bench’s picture reaches the foot of the page', () => {
  it('has no table-top strip across the foot, and the room is at least a screen tall', () => {
    const css = fs.readFileSync(path.join(DIR, 'inventions.css'), 'utf8');
    const page = fs.readFileSync(path.join(DIR, 'page.tsx'), 'utf8');
    expect(page).not.toMatch(/vbi-bench-top/);
    expect(css).not.toMatch(/\.vbi-bench-top/);
    expect(css).toMatch(/\.vb-room\.vb-inventions \{[^}]*min-height: 100dvh/);
    for (const hash of ['#railway', '#telegraph', '#morse', '#photography']) {
      at(hash);
      const { unmount } = render(<VictorianInventions />);
      expect(document.querySelector('.vbi-bench-top')).toBeNull();
      unmount();
    }
  });
});

function media(query: (q: string) => boolean) {
  (window.matchMedia as jest.Mock).mockImplementation((q: string) => ({
    matches: query(q),
    media: q,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}
