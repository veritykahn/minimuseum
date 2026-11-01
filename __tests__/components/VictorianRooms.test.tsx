import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import VictorianChristmasCard from '@/app/exhibitions/victorian/christmas-card/page';
import { messageSize } from '@/app/exhibitions/victorian/christmas-card/CardArt';
import VictorianChristmasParlour from '@/app/exhibitions/victorian/christmas-parlour/page';
import { CARD_NOTES, CARD_TEXT, GREETINGS } from '@/app/exhibitions/victorian/christmas-card/cardText';
import { NOTES, POSTER } from '@/app/exhibitions/victorian/inventions/inventionsText';
import { GHOST_NOTES, STARTERS, insertAt, planLine } from '@/app/exhibitions/victorian/christmas-parlour/ghostText';
import fs from 'fs';
import path from 'path';
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
    const notes = [...Object.values(CARD_NOTES), ...Object.values(NOTES), ...Object.values(PARLOUR_NOTES), ...Object.values(GHOST_NOTES)];
    for (const n of notes) {
      expect(posterText).not.toContain(n.text);
      expect(n.sources.length).toBeGreaterThan(0);
      for (const s of n.sources)
        expect(s.href).toMatch(
          /^https:\/\/(www\.vam\.ac\.uk|collections\.vam\.ac\.uk|collection\.sciencemuseumgroup\.org\.uk|www\.sciencemuseum\.org\.uk|blog\.sciencemuseum\.org\.uk|journal\.sciencemuseum\.ac\.uk|www\.rmg\.co\.uk|www\.getty\.edu|www\.loc\.gov|www\.bt\.com|web\.archive\.org\/web\/\d+\/https:\/\/www\.bristol\.gov\.uk|www\.djo\.org\.uk|dickensmuseum\.com)\//,
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
    // Its source is in the room's Sources drawer, not under the note.
    expect(within(panel).queryByRole('link', { name: /The first Christmas card/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Sources' }));
    const drawer = within(screen.getByRole('dialog', { name: 'Sources' }));
    expect(drawer.getByRole('link', { name: /The first Christmas card/ })).toHaveAttribute('href', 'https://www.vam.ac.uk/articles/the-first-christmas-card');
    fireEvent.click(drawer.getByRole('button', { name: 'Close sources' }));
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

/*
 * The owner's B10 round: railway time told step by step with a task at
 * each; the telegraph explained part by part before its dial, a right
 * reading green and a wrong one red; photography rebuilt in four hands-on
 * parts with real Victorian photographs, its sheet printing; a Christmas
 * ghost story to write and print in the parlour; and printing that waits
 * for its pictures and leaves other rooms' prints alone.
 */
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
