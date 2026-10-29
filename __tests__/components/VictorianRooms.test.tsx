import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import VictorianChristmasCard from '@/app/exhibitions/victorian/christmas-card/page';
import VictorianInventions from '@/app/exhibitions/victorian/inventions/page';
import VictorianChristmasParlour from '@/app/exhibitions/victorian/christmas-parlour/page';
import { CARD_NOTES, CARD_TEXT, GREETINGS } from '@/app/exhibitions/victorian/christmas-card/cardText';
import { NOTES, POSTER, READ_WORDS, STATIONS } from '@/app/exhibitions/victorian/inventions/inventionsText';
import { DIAL, DIAL_LETTERS, clockTime, hands, needleAngles, onDial, spell } from '@/app/exhibitions/victorian/inventions/workshop';
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

describe('the words', () => {
  it('quotes the posters word for word, and adds no facts but the sourced notes', () => {
    const quoted = [CARD_TEXT.poster, POSTER.innovations, POSTER.growth, PARLOUR_TEXT.quote, PARLOUR_TEXT.cite, ...PARLOUR_TEXT.closing, ...PARTS.map((p) => p.poster)];
    for (const q of quoted) expect(posterText).toContain(plain(q));
    // The inventions are the three the poster names.
    expect(POSTER.innovations).toContain('railways, the telegraph, and photography');
    const notes = [...Object.values(CARD_NOTES), ...Object.values(NOTES), ...Object.values(PARLOUR_NOTES)];
    for (const n of notes) {
      expect(posterText).not.toContain(n.text);
      expect(n.sources.length).toBeGreaterThan(0);
      for (const s of n.sources) expect(s.href).toMatch(/^https:\/\/(www\.vam\.ac\.uk|collections\.vam\.ac\.uk|collection\.sciencemuseumgroup\.org\.uk|www\.sciencemuseum\.org\.uk|blog\.sciencemuseum\.org\.uk)\//);
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
    fireEvent.click(screen.getByRole('button', { name: 'Snowy village' }));
    fireEvent.click(screen.getByRole('button', { name: 'Lace' }));
    fireEvent.click(screen.getByRole('button', { name: /Midnight/ }));
    expect(front()).toHaveAccessibleName(expect.stringMatching(/village in the snow.*lace border on midnight paper/));
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
    await waitFor(() => expect(print).toHaveBeenCalled());
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
    fireEvent.click(screen.getByRole('button', { name: /Steam on to the next station/ }));
    expect(screen.getByText('When it is noon in London, it is 11:56 in Reading.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Bristol' }));
    expect(screen.getByText('When it is noon in London, it is 11:49 in Bristol.')).toBeInTheDocument();
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
    for (const c of VICTORIAN.interactives!) expect(c.image?.src).toMatch(/^\/exhibitions\/victorian\/room-.*\.svg$/);
    expect(VICTORIAN.projector.links.map((l) => l.href)).toEqual(ROOMS);
    const urls = sitemap().map((e) => e.url);
    for (const r of ROOMS) {
      expect(getRoomByPath(r)?.parent).toBe('victorian');
      expect(getLevelConfig(r).title).toBe('Victorian Britain');
      expect(urls).toContainEqual(expect.stringMatching(new RegExp(`${r}$`)));
    }
  });
});
