import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import VictorianChristmasCard from '@/app/exhibitions/victorian/christmas-card/page';
import { messageSize } from '@/app/exhibitions/victorian/christmas-card/CardArt';
import VictorianInventions from '@/app/exhibitions/victorian/inventions/page';
import VictorianChristmasParlour from '@/app/exhibitions/victorian/christmas-parlour/page';
import { CARD_NOTES, CARD_TEXT, GREETINGS } from '@/app/exhibitions/victorian/christmas-card/cardText';
import { NOTES, PHOTOS, POSITIVE, POSTER, PROCESS_CLUES, RAIL_STEPS, READ_WORDS, SEND_WORDS, STATIONS, TRAIN_PUZZLES, WIRE_STEPS, blurFor, verdictFor } from '@/app/exhibitions/victorian/inventions/inventionsText';
import { GHOST_NOTES, STARTERS, insertAt, planLine } from '@/app/exhibitions/victorian/christmas-parlour/ghostText';
import fs from 'fs';
import path from 'path';
import { DIAL, DIAL_LETTERS, DIAL_ROWS, clockTime, hands, needleAngles, onDial, spell } from '@/app/exhibitions/victorian/inventions/workshop';
import { PARLOUR_NOTES, PARLOUR_TEXT, PARTS } from '@/app/exhibitions/victorian/christmas-parlour/parlourText';
import { VICTORIAN } from '@/app/exhibitions/victorian/victorian';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';
import sitemap from '@/app/sitemap';

/*
 * Victorian Britain's three rooms: the Christmas card maker, the inventions
 * workshop and Dickens' Christmas parlour. Every line about the period is
 * the posters' own, word for word; the notes from outside them (the V&A,
 * the Science Museum Group) are carved out by name and set with their
 * sources. Each room works by keyboard, and stands still under reduced
 * motion.
 */

/** The posters' words, as read: "*…*" marks italics; quotes and cites both. */
const posterText = VICTORIAN.posters
  .flatMap((p) => p.items)
  .flatMap((it) => ['text' in it && it.text ? it.text : '', 'cite' in it && it.cite ? it.cite : ''])
  .join('\n')
  .replace(/\*/g, '');
const plain = (s: string) => s.replace(/\*/g, '');

const ROOMS = ['/exhibitions/victorian/christmas-card', '/exhibitions/victorian/inventions', '/exhibitions/victorian/christmas-parlour'];

function reducedMotion(on: boolean) {
  (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
    matches: on && query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

afterEach(() => {
  reducedMotion(false);
  jest.useRealTimers();
});

/** Jumps the railway bench's card to one of its steps, by its numbered dot. */
function goRailStep(id: (typeof RAIL_STEPS)[number]['id']) {
  const i = RAIL_STEPS.findIndex((s) => s.id === id);
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`^Step ${i + 1}: `) }));
}

describe('the words', () => {
  it('quotes the posters word for word, and adds no facts but the sourced notes', () => {
    const quoted = [CARD_TEXT.poster, POSTER.innovations, POSTER.growth, PARLOUR_TEXT.quote, PARLOUR_TEXT.cite, ...PARLOUR_TEXT.closing, ...PARTS.map((p) => p.poster)];
    for (const q of quoted) expect(posterText).toContain(plain(q));
    // The inventions are the three the poster names.
    expect(POSTER.innovations).toContain('railways, the telegraph, and photography');
    const notes = [...Object.values(CARD_NOTES), ...Object.values(NOTES), ...Object.values(PARLOUR_NOTES), ...Object.values(GHOST_NOTES)];
    for (const n of notes) {
      expect(posterText).not.toContain(n.text);
      expect(n.sources.length).toBeGreaterThan(0);
      for (const s of n.sources)
        expect(s.href).toMatch(
          /^https:\/\/(www\.vam\.ac\.uk|collections\.vam\.ac\.uk|collection\.sciencemuseumgroup\.org\.uk|www\.sciencemuseum\.org\.uk|blog\.sciencemuseum\.org\.uk|journal\.sciencemuseum\.ac\.uk|www\.rmg\.co\.uk|www\.getty\.edu|www\.loc\.gov|www\.djo\.org\.uk|dickensmuseum\.com)\//,
        );
    }
  });
});

describe('the Christmas card maker', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/victorian/christmas-card'));

  it('designs the front: picture, border, paper and greeting, the first card’s greeting noted from the V&A', () => {
    render(<VictorianChristmasCard />);
    expect(screen.getByRole('tab', { name: 'The front' })).toHaveAttribute('aria-selected', 'true');
    const front = () => screen.getByRole('img', { name: /The card’s front/ });
    expect(front()).toHaveAccessibleName(expect.stringContaining(GREETINGS[0].text));
    expect(screen.getByText(CARD_NOTES.greeting.text)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Snowy church' }));
    fireEvent.click(screen.getByRole('button', { name: 'Lace' }));
    fireEvent.click(screen.getByRole('button', { name: /Midnight/ }));
    expect(front()).toHaveAccessibleName(expect.stringMatching(/village church in the snow.*lace border on midnight paper/));
    fireEvent.click(screen.getByRole('button', { name: 'Your own' }));
    expect(screen.queryByText(CARD_NOTES.greeting.text)).toBeNull();
    fireEvent.change(screen.getByRole('textbox', { name: 'Your own greeting' }), { target: { value: 'Joy to All' } });
    expect(front()).toHaveTextContent('Joy to All');
  });

  it('writes inside, and prints the card laid out to fold in four', async () => {
    const print = jest.fn();
    window.print = print;
    render(<VictorianChristmasCard />);
    const front = screen.getByRole('tab', { name: 'The front' });
    fireEvent.keyDown(front, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'The inside' })).toHaveFocus();
    expect(window.location.hash).toBe('#inside');
    fireEvent.change(screen.getByRole('textbox', { name: 'To' }), { target: { value: 'Grandma' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Your message' }), { target: { value: 'With love this Christmas.' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'From' }), { target: { value: 'Sam' } });
    expect(screen.getByRole('img', { name: /The inside of the card, to Grandma/ })).toHaveTextContent('With love this Christmas.');
    fireEvent.click(screen.getByRole('button', { name: /Ready to print/ }));
    const panel = screen.getByRole('tabpanel', { name: 'Print it' });
    expect(within(panel).getByText(CARD_TEXT.poster)).toBeInTheDocument();
    expect(within(panel).getByText(CARD_NOTES.first.text)).toBeInTheDocument();
    expect(within(panel).getByRole('link', { name: /The first Christmas card/ })).toHaveAttribute('href', 'https://www.vam.ac.uk/articles/the-first-christmas-card');
    fireEvent.click(within(panel).getByRole('button', { name: 'Print the card' }));
    const sheet = document.querySelector('.vcc-print-sheet')!;
    expect(sheet.children).toHaveLength(4);
    // The inside is turned upside down at the top, to read the right way once folded.
    expect(sheet.children[0]).toHaveClass('vcc-print-turned');
    expect(sheet.children[0]).toHaveTextContent('Grandma');
    expect(sheet.children[3]).toHaveTextContent('A merry Christmas');
    // The dialog opens once the card's pictures are in (jsdom never loads them, so after the wait's cap).
    await waitFor(() => expect(print).toHaveBeenCalled(), { timeout: 4000 });
  });
});

describe('the inventions workshop', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/victorian/inventions'));

  it('sets the five-needle dial’s 20 letters where their two needles cross', () => {
    expect(DIAL).toHaveLength(20);
    expect(new Set(DIAL_LETTERS).size).toBe(20);
    for (const l of DIAL) {
      const a = needleAngles(l.letter);
      expect(a.filter((x) => x !== 0)).toHaveLength(2);
      // Each needle's line, through its centre at (n, 0), passes through the letter.
      for (const n of [l.i, l.j]) {
        const deg = a[n - 1];
        const rad = (deg * Math.PI) / 180;
        const along = { x: Math.sin(rad), y: -Math.cos(rad) };
        const cross = (l.x - n) * along.y - l.y * along.x;
        expect(Math.abs(cross)).toBeLessThan(1e-9);
      }
    }
    expect(needleAngles(null)).toEqual([0, 0, 0, 0, 0]);
    expect(needleAngles('Q')).toEqual([0, 0, 0, 0, 0]);
    expect(spell('Mince pie!')).toEqual({ letters: ['M', 'I', 'N', 'E', 'P', 'I', 'E'], skipped: ['C'] });
    for (const w of READ_WORDS) for (const c of w) expect(onDial(c)).toBe(true);
  });

  it('keeps the town clocks by the 1841 timetable’s minutes', () => {
    expect(STATIONS.map((s) => [s.name, s.behind])).toEqual([
      ['London', 0],
      ['Reading', 4],
      ['Steventon', 5.5],
      ['Chippenham', 8],
      ['Bath', 11],
      ['Bristol', 11],
      ['Bridgewater', 14],
    ]);
    expect(clockTime(720 - 11)).toBe('11:49');
    expect(clockTime(720 - 5.5)).toBe('11:54½');
    expect(hands(720).minute).toBeGreaterThan(hands(720 - 11).minute);
  });

  it('steams west and compares the clocks, then sends the time down the line', () => {
    render(<VictorianInventions />);
    expect(screen.getByRole('tab', { name: 'The railway' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(NOTES.sunTime.text)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Steam on to the next station/ }));
    expect(screen.getByText('When it is noon in London, it is 11:56 in Reading.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Bristol' }));
    expect(screen.getByText('When it is noon in London, it is 11:49 in Bristol.')).toBeInTheDocument();
    goRailStep('send');
    expect(screen.getByText(NOTES.railwayTime.text)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Send the time down the line' }));
    expect(screen.getByText(NOTES.timeSignals.text)).toBeInTheDocument();
    expect(screen.getByText(/Bristol keeps railway time now/)).toBeInTheDocument();
  });

  it('points the needles to a letter, sends a word, and reads one', () => {
    jest.useFakeTimers();
    window.history.replaceState(null, '', '/exhibitions/victorian/inventions#telegraph');
    render(<VictorianInventions />);
    expect(screen.getByRole('tab', { name: 'The telegraph' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Send a word' }));
    fireEvent.click(screen.getByRole('button', { name: 'H' }));
    expect(screen.getByRole('status')).toHaveTextContent('H: needles 1 and 2, above.');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your word' }), { target: { value: 'Coal' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send it' }));
    expect(screen.getByRole('status')).toHaveTextContent('Sending OAL. C is not on the dial');
    for (let i = 0; i < 3; i++) {
      act(() => {
        jest.advanceTimersByTime(1400);
      });
    }
    expect(screen.getByRole('status')).toHaveTextContent('Sent.');
    fireEvent.click(screen.getByRole('button', { name: 'Read the needles' }));
    const word = READ_WORDS[0];
    fireEvent.click(screen.getByRole('button', { name: word[0] === 'A' ? 'B' : 'A' }));
    expect(screen.getByRole('status')).toHaveTextContent('Not');
    for (const c of word) fireEvent.click(screen.getByRole('button', { name: c }));
    expect(screen.getByRole('status')).toHaveTextContent(`You read the word: ${word}.`);
    expect(screen.getByRole('link', { name: /Cooke and Wheatstone 5-needle telegraph/ })).toBeInTheDocument();
  });

  it('makes a negative and prints from it, as many prints as you like', () => {
    jest.useFakeTimers();
    window.history.replaceState(null, '', '/exhibitions/victorian/inventions#photography');
    render(<VictorianInventions />);
    expect(screen.getByRole('button', { name: 'Print from it' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Uncover the lens' }));
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(screen.getByRole('status')).toHaveTextContent('A negative');
    expect(screen.getByText(NOTES.negative.text)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Print from it' }));
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Print another' }));
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    expect(screen.getByText('2 prints from the one negative.')).toBeInTheDocument();
    expect(screen.getByText(NOTES.positives.text)).toBeInTheDocument();
  });

  it('under reduced motion, makes each sheet at once', () => {
    jest.useFakeTimers();
    reducedMotion(true);
    window.history.replaceState(null, '', '/exhibitions/victorian/inventions#photography');
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Uncover the lens' }));
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByRole('button', { name: 'Print from it' })).toBeEnabled();
  });
});

describe('Dickens’ Christmas parlour', () => {
  it('opens each part of a Victorian Christmas on the poster’s line, and with all six, the poster’s last word', () => {
    render(<VictorianChristmasParlour />);
    expect(screen.getByText(PARLOUR_TEXT.quote)).toBeInTheDocument();
    // In the room, or from the list
    fireEvent.click(screen.getByRole('button', { name: 'The Christmas tree, in the room' }));
    expect(screen.getByRole('heading', { name: 'The Christmas tree' })).toBeInTheDocument();
    expect(screen.getByText(PARLOUR_NOTES.tree.text)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('The candles on the tree are lit. 1 of 6 open.');
    const list = screen.getByRole('list', { name: 'Open each part' });
    fireEvent.click(within(list).getByRole('button', { name: /The Christmas cards/ }));
    expect(screen.getByRole('link', { name: 'Make your own Victorian Christmas card' })).toHaveAttribute('href', '/exhibitions/victorian/christmas-card');
    expect(screen.queryByText(PARLOUR_TEXT.closing[0])).toBeNull();
    for (const p of PARTS) fireEvent.click(within(list).getByRole('button', { name: new RegExp(p.name) }));
    expect(screen.getByText(plain(PARTS.find((p) => p.id === 'hearth')!.poster))).toBeInTheDocument();
    for (const c of PARLOUR_TEXT.closing) expect(screen.getByText(c)).toBeInTheDocument();
    for (const p of PARTS) expect(screen.getByRole('button', { name: `${p.name}, in the room` })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Start again' }));
    expect(screen.getByRole('status')).toHaveTextContent('The parlour is dark again.');
  });
});

describe('wiring', () => {
  it('sets the three rooms on the landing page, the projector, the map and the sitemap, drawn, with no photographs', () => {
    expect(VICTORIAN.interactives?.map((c) => [c.href, c.label, c.title])).toEqual([
      ['/exhibitions/victorian/christmas-card', 'Interactive', 'Christmas Card Maker'],
      ['/exhibitions/victorian/inventions', 'Interactive', 'Inventions Workshop'],
      ['/exhibitions/victorian/christmas-parlour', 'Interactive', 'Dickens’ Christmas Parlour'],
    ]);
    for (const c of VICTORIAN.interactives!) expect(c.image?.src).toMatch(/^\/exhibitions\/victorian\/rooms\/[a-z-]+\.webp$/);
    expect(VICTORIAN.projector.links.map((l) => l.href)).toEqual(ROOMS);
    const urls = sitemap().map((e) => e.url);
    for (const r of ROOMS) {
      expect(getRoomByPath(r)?.parent).toBe('victorian');
      expect(getLevelConfig(r).title).toBe('Victorian Britain');
      expect(urls).toContainEqual(expect.stringMatching(new RegExp(`${r}$`)));
    }
  });
});

describe('fine tuning (regressions from trying the rooms)', () => {
  beforeEach(() => window.history.replaceState(null, '', '/'));

  it('sets a long message smaller inside the card, so "To" and "from" stay on it', () => {
    expect(messageSize('With love.')).toBe(19);
    expect(messageSize('x'.repeat(320))).toBeLessThan(messageSize('x'.repeat(200)));
    expect(messageSize('a\nb\nc\nd\ne\nf')).toBeLessThan(messageSize('abcdef'));
    window.history.replaceState(null, '', '/exhibitions/victorian/christmas-card#inside');
    render(<VictorianChristmasCard />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Your message' }), { target: { value: 'long message '.repeat(24) } });
    const inside = screen.getByRole('img', { name: /The inside of the card/ });
    expect(parseFloat((inside.querySelector('.vcc-inside-message') as HTMLElement).style.fontSize)).toBeLessThan(15);
  });

  it('prints the inside’s blank page on the card’s own paper, not white', () => {
    window.print = jest.fn();
    render(<VictorianChristmasCard />);
    fireEvent.click(screen.getByRole('button', { name: /Midnight/ }));
    fireEvent.click(screen.getByRole('tab', { name: 'Print it' }));
    fireEvent.click(screen.getByRole('button', { name: 'Print the card' }));
    const blank = document.querySelector('.vcc-print-blank') as HTMLElement;
    expect(blank.style.background).not.toBe('');
    expect(blank.style.background).not.toMatch(/^(white|#fff|rgb\(255, 255, 255\))/);
  });

  it('says on the card which letters of a word the dial has not got', () => {
    window.history.replaceState(null, '', '/exhibitions/victorian/inventions#telegraph');
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Send a word' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your word' }), { target: { value: 'Coal' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send it' }));
    expect(screen.getByText('C is not on the dial, so it is left out.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.queryByText(/not on the dial, so/)).toBeNull();
  });

  it('puts the town clocks back to their own time, to compare them again', () => {
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Bristol' }));
    goRailStep('send');
    fireEvent.click(screen.getByRole('button', { name: 'Send the time down the line' }));
    expect(screen.getByText(/Bristol keeps railway time now/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Put the town clocks back to their own time' }));
    expect(screen.getByText('When it is noon in London, it is 11:49 in Bristol.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send the time down the line' })).toBeInTheDocument();
  });

  it('scrolls the parlour’s card down to the poster’s last word when the sixth part opens', () => {
    const tall = jest.spyOn(Element.prototype, 'scrollHeight', 'get').mockReturnValue(900);
    const scrollTo = jest.fn();
    const was = Element.prototype.scrollTo;
    Element.prototype.scrollTo = scrollTo;
    try {
      render(<VictorianChristmasParlour />);
      const list = screen.getByRole('list', { name: 'Open each part' });
      for (const p of PARTS.slice(0, 5)) fireEvent.click(within(list).getByRole('button', { name: new RegExp(p.name) }));
      expect(scrollTo).not.toHaveBeenCalled();
      fireEvent.click(within(list).getByRole('button', { name: new RegExp(PARTS[5].name) }));
      expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 900 }));
    } finally {
      tall.mockRestore();
      Element.prototype.scrollTo = was;
    }
  });
});

describe('the workshop, tuned for children and phones', () => {
  beforeEach(() => window.history.replaceState(null, '', '/'));

  it('offers words to tap and send, every letter of them on the dial', () => {
    for (const w of SEND_WORDS) expect(spell(w).skipped).toEqual([]);
    jest.useFakeTimers();
    window.history.replaceState(null, '', '/exhibitions/victorian/inventions#telegraph');
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Send a word' }));
    const words = screen.getByRole('group', { name: 'Words the dial can spell' });
    fireEvent.click(within(words).getByRole('button', { name: SEND_WORDS[0] }));
    expect(screen.getByRole('status')).toHaveTextContent(`Sending ${SEND_WORDS[0]}.`);
    expect(screen.getByRole('textbox', { name: 'Your word' })).toHaveValue(SEND_WORDS[0]);
    // While it is spelled out, no other word can be sent over it
    expect(within(words).getByRole('button', { name: SEND_WORDS[1] })).toBeDisabled();
    expect(screen.queryByText(/not on the dial, so/)).toBeNull();
  });

  it('sets the two railway-time notes, from one page, under one source once the time is sent', () => {
    expect(NOTES.timeSignals.sources).toEqual(NOTES.railwayTime.sources);
    render(<VictorianInventions />);
    goRailStep('send');
    fireEvent.click(screen.getByRole('button', { name: 'Send the time down the line' }));
    expect(screen.getByText(NOTES.railwayTime.text)).toBeInTheDocument();
    expect(screen.getByText(NOTES.timeSignals.text)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: NOTES.timeSignals.sources[0].label })).toHaveLength(1);
  });

  it('runs the line down the screen on a phone, the train moving station to station', () => {
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: query.includes('max-width: 760px'),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    render(<VictorianInventions />);
    const line = screen.getByRole('img', { name: /The line west from London/ });
    expect(line).toHaveClass('vbi-rail-down');
    const train = line.querySelector('.vbi-train') as SVGGElement;
    const before = train.style.transform;
    fireEvent.click(screen.getByRole('button', { name: /Steam on to the next station/ }));
    expect(train.style.transform).not.toBe(before);
    expect(screen.getByRole('img', { name: /The train is at Reading/ })).toBe(line);
  });
});

/*
 * The owner's B10 round: railway time told step by step with a task at
 * each; the telegraph explained part by part before its dial, a right
 * reading green and a wrong one red; photography rebuilt in four hands-on
 * parts with real Victorian photographs, its sheet printing; a Christmas
 * ghost story to write and print in the parlour; and printing that waits
 * for its pictures and leaves other rooms' prints alone.
 */
describe('railway time, step by step', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/victorian/inventions'));

  it('tells local time and railway time in five steps, each with a task', () => {
    expect(RAIL_STEPS.map((s) => s.id)).toEqual(['sun', 'catch', 'set', 'send', 'law']);
    for (const s of RAIL_STEPS) expect(s.task.length).toBeGreaterThan(10);
    render(<VictorianInventions />);
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: RAIL_STEPS[0].title })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next step/ }));
    expect(screen.getByRole('heading', { name: RAIL_STEPS[1].title })).toBeInTheDocument();
    goRailStep('law');
    expect(screen.getByText(NOTES.legalTime.text)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Royal Museums Greenwich/ })).toHaveAttribute('href', 'https://www.rmg.co.uk/stories/time/greenwich-mean-time-gmt');
  });

  it('asks whether you catch your train: a wrong answer turns red, the right one green, and the railway clock is shown', () => {
    // The puzzles' sums are the timetable's minutes.
    for (const p of TRAIN_PUZZLES) {
      const town = STATIONS.find((s) => s.name === p.town)!;
      const london = p.clock + town.behind;
      const right = p.choices[p.answer];
      expect(london > p.train ? /gone|left/.test(right) : right.includes(`${p.train - london} minutes`)).toBe(true);
    }
    render(<VictorianInventions />);
    goRailStep('catch');
    const p = TRAIN_PUZZLES[0];
    expect(screen.getByRole('img', { name: /The station clock reads a time to work out/ })).toBeInTheDocument();
    const wrong = screen.getByRole('button', { name: p.choices[1 - p.answer] });
    fireEvent.click(wrong);
    expect(wrong).toHaveAttribute('data-verdict', 'wrong');
    expect(screen.getByText('Not quite: try again.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: p.choices[p.answer] }));
    expect(screen.getByRole('button', { name: p.choices[p.answer] })).toHaveAttribute('data-verdict', 'right');
    expect(screen.getByText('Right!').closest('[data-verdict]')).toHaveAttribute('data-verdict', 'right');
    expect(screen.getByRole('img', { name: /The station clock reads 12:03, London time; Bath’s own clock reads 11:52/ })).toBeInTheDocument();
    expect(screen.getByText(NOTES.missTrain.text)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Another puzzle' }));
    expect(screen.getByText(/You are in/)).toHaveTextContent(TRAIN_PUZZLES[1].town);
  });

  it('sets a town clock to railway time by hand, a minute at a time, even pressed quickly', () => {
    render(<VictorianInventions />);
    goRailStep('set');
    // Bath, 11 minutes behind, unless the train is already at a town.
    expect(screen.getByText(/Bath’s clock:/)).toHaveTextContent('11:49');
    const forward = screen.getByRole('button', { name: 'Forward one minute' });
    act(() => {
      for (let i = 0; i < 11; i++) forward.click();
    });
    expect(screen.getByText('Bath keeps railway time!')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Bath’s clock now keeps railway time');
    expect(screen.getByRole('button', { name: /Step 3: .*\(done\)/ })).toBeInTheDocument();
    expect(screen.getByText(NOTES.clearingHouse.text)).toBeInTheDocument();
    // Steventon is 5½ minutes behind: the last half minute clicks into place.
    fireEvent.click(screen.getByRole('button', { name: 'Steventon' }));
    for (let i = 0; i < 5; i++) fireEvent.click(screen.getByRole('button', { name: 'Forward one minute' }));
    expect(screen.getByText('Steventon keeps railway time!')).toBeInTheDocument();
  });
});

describe('the telegraph, explained before its dial', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/victorian/inventions#telegraph'));

  it('opens on how it works: battery, wire, coil, needle and Morse, the key setting the current running', () => {
    expect(WIRE_STEPS.map((s) => s.id)).toEqual(['battery', 'wire', 'coil', 'needle', 'morse']);
    render(<VictorianInventions />);
    expect(screen.getByRole('button', { name: 'How it works' })).toHaveAttribute('aria-pressed', 'true');
    const circuit = screen.getByRole('img', { name: /A telegraph circuit/ });
    expect(circuit).toHaveAttribute('data-step', 'battery');
    const key = screen.getByRole('button', { name: 'Press the key' });
    fireEvent.pointerDown(key);
    expect(circuit).toHaveAttribute('data-live', 'true');
    expect(screen.getByRole('img', { name: /the current flows and the needle swings/ })).toBe(circuit);
    fireEvent.pointerUp(key);
    expect(circuit).not.toHaveAttribute('data-live');
    // By keyboard too: Space held down is the key held down.
    fireEvent.keyDown(key, { key: ' ' });
    expect(circuit).toHaveAttribute('data-live', 'true');
    fireEvent.keyUp(key, { key: ' ' });
    expect(circuit).not.toHaveAttribute('data-live');
    for (const [id, note] of [['wire', NOTES.wire], ['coil', NOTES.oersted], ['needle', NOTES.needles], ['morse', NOTES.morse]] as const) {
      fireEvent.click(screen.getByRole('button', { name: /Next step/ }));
      expect(circuit).toHaveAttribute('data-step', id);
      expect(screen.getByText(note.text)).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole('button', { name: /Now try the five-needle telegraph/ }));
    expect(screen.getByRole('button', { name: 'Send a word' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(NOTES.dialLetters.text)).toBeInTheDocument();
  });

  it('taps Morse on the key: a quick tap a dot, a long press a dash, and a pause makes the letter', () => {
    jest.useFakeTimers();
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: /^Step 5: / }));
    const key = screen.getByRole('button', { name: 'Press the key' });
    const tap = (ms: number) => {
      fireEvent.pointerDown(key);
      act(() => {
        jest.advanceTimersByTime(ms);
      });
      fireEvent.pointerUp(key);
    };
    tap(80);
    tap(600);
    expect(document.querySelector('.vbi-morse-marks')).toHaveTextContent('•—');
    act(() => {
      jest.advanceTimersByTime(1200);
    });
    expect(screen.getByRole('status')).toHaveTextContent('.- is A.');
    expect(screen.getByText('Spells:', { exact: false })).toHaveTextContent('Spells: A');
  });

  it('turns a right reading green with stars and a wrong one red', () => {
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Read the needles' }));
    const word = READ_WORDS[0];
    const wrong = word[0] === 'A' ? 'B' : 'A';
    fireEvent.click(screen.getByRole('button', { name: wrong }));
    expect(screen.getByRole('button', { name: wrong })).toHaveAttribute('data-verdict', 'wrong');
    expect(screen.getByText(`Not ${wrong}: try again.`).closest('[data-verdict]')).toHaveAttribute('data-verdict', 'wrong');
    fireEvent.click(screen.getByRole('button', { name: word[0] }));
    expect(screen.getByRole('button', { name: word[0] })).toHaveAttribute('data-verdict', 'right');
    expect(screen.getByRole('button', { name: wrong })).not.toHaveAttribute('data-verdict');
    expect(screen.getByText(`Right! ${word[0]}.`).closest('[data-verdict]')).toHaveAttribute('data-verdict', 'right');
    expect(document.querySelector('.vbr-celebrate')).not.toBeNull();
    for (const c of word.slice(1)) fireEvent.click(screen.getByRole('button', { name: c }));
    expect(screen.getByText(`Well read! The word is ${word}.`)).toBeInTheDocument();
  });

  it('shows the 1837 dial’s own 20 letters, C, J, Q, U, X and Z left off, in its diamond', () => {
    expect(DIAL_LETTERS.split('').sort().join('')).toBe('ABDEFGHIKLMNOPRSTVWY');
    for (const c of 'CJQUXZ') expect(onDial(c)).toBe(false);
    // The diamond: one letter at each point, widening to four either side of the needles.
    expect(DIAL_ROWS.map((r) => r.length)).toEqual([1, 2, 3, 4, 4, 3, 2, 1]);
    expect(NOTES.dialLetters.text).toContain('C, J, Q, U, X and Z');
    expect(NOTES.dialLetters.sources[0].href).toBe('https://journal.sciencemuseum.ac.uk/article/cooke-and-wheatstones/');
  });
});

describe('photography, in four hands-on parts with real Victorian photographs', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/victorian/inventions#photography'));

  it('uses real Victorian photographs, open access, each credited and linked, and in the public folder', () => {
    for (const p of Object.values(PHOTOS)) {
      expect(p.href).toMatch(/^https:\/\/www\.metmuseum\.org\/art\/collection\/search\/\d+$/);
      expect(p.maker && p.date && p.medium && p.title && p.alt).toBeTruthy();
      expect(fs.existsSync(path.join(process.cwd(), 'public', p.src))).toBe(true);
    }
    expect(fs.existsSync(path.join(process.cwd(), 'public', POSITIVE.src))).toBe(true);
    expect(PHOTOS.negative.medium).toBe('Paper negative');
    expect(PHOTOS.daguerreotype.medium).toMatch(/^Daguerreotype/);
    expect(PHOTOS.cameron.medium).toMatch(/glass negative/);
  });

  it('makes Talbot’s negative and prints from it, crediting the photograph and saying the print is the room’s own', () => {
    jest.useFakeTimers();
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Uncover the lens' }));
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByRole('img', { name: /Talbot’s negative/ })).toBeInTheDocument();
    expect(screen.getByText(NOTES.calotype.text)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Print from it' }));
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    expect(screen.getByRole('img', { name: /The print:/ })).toBeInTheDocument();
    expect(screen.getByText(NOTES.sunPrint.text)).toBeInTheDocument();
    expect(screen.getByText(/Made for this room from Talbot’s negative/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'The Metropolitan Museum of Art, public domain' })).toHaveAttribute('href', PHOTOS.negative.href);
  });

  it('sits for a daguerreotype: hold still for the exposure and it comes out sharp; let go and it blurs', () => {
    expect(blurFor(0, false)).toBe(0);
    expect(blurFor(2000, true)).toBe(blurFor(2000, false) / 2);
    expect(blurFor(60000, false)).toBe(12);
    expect(verdictFor(0).tone).toBe('right');
    expect(verdictFor(2).tone).toBe('near');
    expect(verdictFor(8).tone).toBe('wrong');
    jest.useFakeTimers();
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: '2. Hold still!' }));
    const hold = screen.getByRole('button', { name: 'Hold still' });
    fireEvent.pointerDown(hold);
    act(() => {
      jest.advanceTimersByTime(8100);
    });
    fireEvent.pointerUp(hold);
    expect(screen.getByText(verdictFor(0).words).closest('[data-verdict]')).toHaveAttribute('data-verdict', 'right');
    expect(screen.getByText(NOTES.prunes.text)).toBeInTheDocument();
    // Again, letting go for three seconds of it.
    const again = screen.getByRole('button', { name: 'Sit again' });
    fireEvent.pointerDown(again);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    fireEvent.pointerUp(again);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.pointerDown(again);
    act(() => {
      jest.advanceTimersByTime(3200);
    });
    expect(screen.getByText(verdictFor(blurFor(3000, false)).words).closest('[data-verdict]')).toHaveAttribute('data-verdict', 'wrong');
    expect(screen.getByRole('img', { name: /blurred/ })).toBeInTheDocument();
    expect(screen.getByText(NOTES.clamp.text)).toBeInTheDocument();
  });

  it('matches daguerreotype, calotype and wet collodion to real photographs: wrong red, right green', () => {
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: '3. Three ways' }));
    const first = PROCESS_CLUES[0];
    const other = PROCESS_CLUES[1];
    const wrong = screen.getByRole('button', { name: new RegExp(PHOTOS[other.photo].title) });
    fireEvent.click(wrong);
    expect(wrong).toHaveAttribute('data-verdict', 'wrong');
    for (const c of PROCESS_CLUES) {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(PHOTOS[c.photo].title) }));
      expect(screen.getByRole('button', { name: new RegExp(`${PHOTOS[c.photo].title}.*: ${c.process.replace(/[()]/g, '.')}`) })).toHaveAttribute('data-verdict', 'right');
      expect(screen.getByText(NOTES[c.note].text)).toBeInTheDocument();
      if (c !== PROCESS_CLUES[PROCESS_CLUES.length - 1]) fireEvent.click(screen.getByRole('button', { name: /Next clue/ }));
    }
    expect(screen.getByText(/^All three matched:/)).toBeInTheDocument();
    expect(screen.getByText(NOTES.cameron.text)).toBeInTheDocument();
    expect(first.photo).toBe('daguerreotype');
  });

  it('prints a sheet of the photographs and what you made, with their credits, once its pictures are in', async () => {
    const print = jest.fn();
    window.print = print;
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: '4. Print a sheet' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'Ada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Print my sheet' }));
    const sheet = document.querySelector('body > .vbr-print-root') as HTMLElement;
    expect(sheet).not.toBeNull();
    expect(sheet).toHaveTextContent('By Ada');
    const srcs = [...sheet.querySelectorAll('img')].map((i) => i.getAttribute('src'));
    expect(srcs).toEqual(expect.arrayContaining([PHOTOS.negative.src, POSITIVE.src, PHOTOS.daguerreotype.src, PHOTOS.openDoor.src, PHOTOS.cameron.src]));
    for (const p of Object.values(PHOTOS)) expect(sheet).toHaveTextContent(p.maker);
    expect(sheet).toHaveTextContent('The Metropolitan Museum of Art, public domain');
    await waitFor(() => expect(print).toHaveBeenCalled(), { timeout: 4000 });
    act(() => {
      window.dispatchEvent(new Event('afterprint'));
    });
    expect(document.querySelector('body > .vbr-print-root')).toBeNull();
  });
});

describe('a Christmas ghost story, written in the parlour and printed', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/victorian/christmas-parlour#ghost-story'));

  it('opens on its own tab, says why (the Victorians’ ghost stories at Christmas), and plans the story', () => {
    render(<VictorianChristmasParlour />);
    expect(screen.getByRole('tab', { name: 'Write a ghost story' })).toHaveAttribute('aria-selected', 'true');
    for (const n of Object.values(GHOST_NOTES)) expect(screen.getByText(n.text)).toBeInTheDocument();
    expect(GHOST_NOTES.carol.text).toContain('A Ghost Story of Christmas');
    fireEvent.click(screen.getByRole('button', { name: 'a ghostly dog' }));
    fireEvent.click(screen.getByRole('button', { name: 'a frozen pond' }));
    expect(screen.getAllByText(planLine('a ghostly dog', 'a frozen pond', null)).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('tab', { name: 'The parlour' }));
    expect(window.location.hash).toBe('#parlour');
    // The story waits on its tab while the parlour is open.
    fireEvent.click(screen.getByRole('tab', { name: 'Write a ghost story' }));
    expect(screen.getByRole('button', { name: 'a ghostly dog' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('starts from an opening, takes spooky words where the cursor is, and prints the story on its own page', async () => {
    expect(insertAt('The door opened.', 4, 'creaking')).toEqual({ story: 'The creaking door opened.', caret: 12 });
    expect(insertAt('Snow', 4, 'fell').story).toBe('Snow fell');
    expect(insertAt('', 0, 'Midnight').story).toBe('Midnight');
    const print = jest.fn();
    window.print = print;
    render(<VictorianChristmasParlour />);
    expect(screen.getByRole('button', { name: 'Print my ghost story' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: STARTERS[2] }));
    const box = screen.getByRole('textbox', { name: 'Your story' }) as HTMLTextAreaElement;
    expect(box.value).toBe(STARTERS[2]);
    fireEvent.click(screen.getByRole('button', { name: 'shivered' }));
    expect(box.value).toBe(`${STARTERS[2]} shivered`);
    fireEvent.change(screen.getByRole('textbox', { name: 'Title' }), { target: { value: 'The Clock' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'Sam' } });
    const preview = screen.getByRole('region', { name: 'Your ghost story, as it will print' });
    expect(preview).toHaveTextContent('The Clock');
    expect(preview).toHaveTextContent('by Sam');
    fireEvent.click(screen.getByRole('button', { name: 'Print my ghost story' }));
    const page = document.querySelector('body > .vbr-print-root') as HTMLElement;
    expect(page).toHaveTextContent('A Ghost Story of Christmas');
    expect(page).toHaveTextContent(STARTERS[2]);
    await waitFor(() => expect(print).toHaveBeenCalled());
  });

  it('opens the ghost story from A Christmas Carol in the parlour', () => {
    window.history.replaceState(null, '', '/exhibitions/victorian/christmas-parlour');
    render(<VictorianChristmasParlour />);
    const list = screen.getByRole('list', { name: 'Open each part' });
    fireEvent.click(within(list).getByRole('button', { name: /A Christmas Carol/ }));
    fireEvent.click(screen.getByRole('button', { name: /Write your own Christmas ghost story/ }));
    expect(screen.getByRole('tab', { name: 'Write a ghost story' })).toHaveAttribute('aria-selected', 'true');
  });
});

describe('printing from the Victorian rooms', () => {
  const css = (f: string) => fs.readFileSync(path.join(process.cwd(), 'app/exhibitions/victorian', f), 'utf8');

  it('hides the rest of the page only while that room’s own sheet is on it, so a stylesheet left from another room cannot blank a print', () => {
    expect(css('christmas-card/card.css')).toContain('body:has(> .vcc-print-root) > :not(.vcc-print-root)');
    expect(css('christmas-card/card.css')).not.toMatch(/^\s*body > :not\(\.vcc-print-root\)/m);
    expect(css('rooms.css')).toContain('body:has(> .vbr-print-root) > :not(.vbr-print-root)');
  });

  it('sets the workshop’s and the parlour’s cards wider, their words larger, for a class at the projector', () => {
    const rooms = css('rooms.css');
    expect(rooms).toMatch(/\.vb-inventions, \.vb-parlour \{ --vbr-card-w: min\(540px/);
    expect(rooms).toMatch(/\.vb-inventions \.vbr-intro, \.vb-parlour \.vbr-intro \{ font-size: 1\.25rem/);
    expect(rooms).toMatch(/orientation: portrait/);
  });
});
