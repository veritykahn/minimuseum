import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { FALLEN, type Fallen } from '@/app/exhibitions/great-war/memorial/fallen';
import { SOLDIERS } from '@/app/exhibitions/great-war/memorial/soldiers';
import {
  announcement,
  buildIndex,
  createPicker,
  formatDate,
  normalize,
  restingLines,
  search,
} from '@/app/exhibitions/great-war/memorial/remember';
import { PRINT, gridSize, printCss, sheetSlots } from '@/app/exhibitions/great-war/memorial/printLayout';
import { latinFontFaces } from '@/app/exhibitions/great-war/memorial/exportCard';
import RememberSoldier from '@/app/exhibitions/great-war/memorial/RememberSoldier';
import MemorialCard from '@/app/exhibitions/great-war/memorial/MemorialCard';

jest.mock('@lottiefiles/dotlottie-react', () => ({
  DotLottieReact: () => <canvas data-testid="live-flame" />,
}));
jest.mock('html-to-image', () => ({ toPng: jest.fn(async () => 'data:image/png;base64,AAAA') }));

/*
 * "Remember a soldier": the pool, the draw (no repeats until all have come),
 * the search, the card's words, and the printed sheet's measurements.
 */

/** A seeded random for repeatable shuffles. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

function makePool(n: number): Fallen[] {
  const states = ['Ohio', 'New Jersey', 'Texas', 'Iowa', 'New York'];
  return Array.from({ length: n }, (_, i) => ({
    id: `s${i}`,
    name: `Soldier Number${i} Smith`,
    rank: 'Private',
    enteredServiceFrom: states[i % states.length],
    dateOfDeath: '1918-10-01',
    status: 'Killed in Action',
    resting: { kind: 'grave', cemetery: 'Meuse-Argonne American Cemetery', plot: 'A', row: '1', grave: String(i) },
    source: 'ABMC',
  }));
}

describe('the pool of the fallen', () => {
  it('holds only the researched soldiers with an ABMC record, with unique ids', () => {
    expect(FALLEN.map((f) => f.id)).toEqual(['freddie-stowers', 'eben-m-stout', 'john-b-healey', 'matej-kocak', 'wayne-miner']);
    expect(new Set(FALLEN.map((f) => f.id)).size).toBe(FALLEN.length);
    for (const f of FALLEN) {
      expect(f.source).toBe('ABMC');
      expect(f.dateOfDeath).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('agrees with the researched cards on name, plot and cemetery', () => {
    const byName = Object.fromEntries(SOLDIERS.map((s) => [s.name, s]));
    for (const f of FALLEN) {
      const s = byName[f.name];
      expect(s).toBeDefined();
      if (f.resting.kind === 'grave') {
        expect(s.burial?.place).toContain(f.resting.cemetery.replace(' American Cemetery', ''));
        expect(s.burial?.plot).toBe(`Plot ${f.resting.plot}, Row ${f.resting.row}, Grave ${f.resting.grave}`);
      } else {
        expect(s.memorial).toContain('Tablets of the Missing');
        expect(s.memorial).toContain(f.resting.cemetery);
      }
    }
  });
});

describe('drawing a soldier', () => {
  it('never repeats anyone until the whole pool has been drawn', () => {
    for (const size of [1, 2, 5, 37, 1000]) {
      const p = createPicker(size, seeded(size));
      for (let round = 0; round < 3; round++) {
        const seen = new Set<number>();
        for (let i = 0; i < size; i++) seen.add(p.next());
        expect(seen.size).toBe(size);
        expect(Math.min(...seen)).toBe(0);
        expect(Math.max(...seen)).toBe(size - 1);
      }
    }
  });

  it('does not give the same soldier twice in a row when a new round starts', () => {
    const p = createPicker(4, seeded(7));
    let last = -1;
    for (let i = 0; i < 400; i++) {
      const n = p.next();
      expect(n).not.toBe(last);
      last = n;
    }
  });

  it('counts down what is left, and handles an empty pool', () => {
    const p = createPicker(3);
    p.next();
    expect(p.remaining()).toBe(2);
    expect(createPicker(0).next()).toBe(-1);
  });

  it('copes with a pool of thousands quickly', () => {
    const p = createPicker(20000, seeded(1));
    const t = Date.now();
    const seen = new Set<number>();
    for (let i = 0; i < 20000; i++) seen.add(p.next());
    expect(seen.size).toBe(20000);
    expect(Date.now() - t).toBeLessThan(1000);
  });
});

describe('searching', () => {
  const index = buildIndex(FALLEN);
  const names = (q: string) => search(index, q).map((i) => FALLEN[i].name);

  it('finds by name, any part, ignoring case and punctuation', () => {
    expect(names('stowers')).toEqual(['Freddie Stowers']);
    expect(names('Eben M')).toEqual(['Eben M. Stout']);
    expect(names('KOCAK')).toEqual(['Matej Kocak']);
    expect(names('zzz')).toEqual([]);
    expect(names('   ')).toEqual([]);
  });

  it('finds by state, written out or as a postal code', () => {
    expect(names('Missouri')).toEqual(['Wayne Miner']);
    expect(names('new jersey')).toEqual(['Eben M. Stout']);
    expect(names('NJ')).toEqual(['Eben M. Stout']);
    expect(names('sc')).toEqual(['Freddie Stowers']);
  });

  it('puts names that begin with the query first and stops at the limit', () => {
    const pool = makePool(5000);
    const big = buildIndex(pool);
    const hits = search(big, 'ohio', 12);
    expect(hits).toHaveLength(12);
    expect(hits.every((i) => pool[i].enteredServiceFrom === 'Ohio')).toBe(true);
    expect(search(big, 'number4999').map((i) => pool[i].id)).toEqual(['s4999']);
  });

  it('strips accents', () => {
    expect(normalize('  Mátéj  Kočák ')).toBe('matej kocak');
  });
});

describe('the words on the card', () => {
  it('writes dates the American way', () => {
    expect(formatDate('1918-11-11')).toBe('November 11, 1918');
    expect(formatDate('1918-09-28')).toBe('September 28, 1918');
    expect(formatDate('autumn 1918')).toBe('autumn 1918');
  });

  it('says where he rests, or where he is named among the missing', () => {
    expect(restingLines({ kind: 'grave', cemetery: 'St. Mihiel American Cemetery', plot: 'B', row: '14', grave: '17' })).toEqual({
      lead: 'Rests in',
      place: 'St. Mihiel American Cemetery',
      plot: 'Plot B · Row 14 · Grave 17',
    });
    expect(restingLines({ kind: 'missing', cemetery: 'Aisne-Marne American Cemetery' })).toEqual({
      lead: 'Named on the Tablets of the Missing',
      place: 'Aisne-Marne American Cemetery',
    });
  });

  it('shows the record as real text, with the ABMC line and the museum', () => {
    const miner = FALLEN.find((f) => f.id === 'wayne-miner')!;
    render(<MemorialCard fallen={miner} />);
    const card = screen.getByRole('article', { name: 'Wayne Miner' });
    expect(within(card).getByRole('heading', { name: 'Wayne Miner' })).toBeInTheDocument();
    expect(card).toHaveTextContent('In Memory');
    expect(card).toHaveTextContent('Private');
    expect(card).toHaveTextContent('Company A, 366th Infantry Regiment, 92nd Division');
    expect(card).toHaveTextContent('From Missouri');
    expect(card).toHaveTextContent('Killed in Action');
    expect(card).toHaveTextContent('November 11, 1918');
    expect(card).toHaveTextContent('St. Mihiel American Cemetery');
    expect(card).toHaveTextContent('Plot B · Row 14 · Grave 17');
    expect(card).toHaveTextContent('From the records of the American Battle Monuments Commission');
    expect(card).toHaveTextContent('The Mini Museum · The Great War');
    // The candle and the silhouette are decoration, and a print card has only the still flame.
    expect(card.querySelector('.gwm-mc-scene')).toHaveAttribute('aria-hidden', 'true');
    expect(card.querySelector('.gwm-mc-candle-still')).toHaveAttribute('src', '/exhibitions/great-war/candle-still.svg');
    expect(screen.queryByTestId('live-flame')).not.toBeInTheDocument();
  });

  it('announces the soldier in words', () => {
    expect(announcement(FALLEN[0])).toBe('Remembering Corporal Freddie Stowers, of South Carolina. Killed in Action, September 28, 1918.');
  });
});

describe('the printed sheet', () => {
  it('uses the installation’s measurements, filling Letter less its margins exactly', () => {
    expect(PRINT.card).toEqual({ width: 3.65, height: 4.9 });
    expect(PRINT.gap).toBe(0.2);
    expect(PRINT.margin).toBe(0.5);
    const grid = gridSize();
    expect(grid).toEqual({ width: 7.5, height: 10 });
    expect(grid.width + 2 * PRINT.margin).toBe(PRINT.page.width);
    expect(grid.height + 2 * PRINT.margin).toBe(PRINT.page.height);
  });

  it('places four cards two by two, 0.2" apart, 0.5" from the edges', () => {
    expect(sheetSlots(4)).toEqual([
      { x: 0.5, y: 0.5, width: 3.65, height: 4.9 },
      { x: 4.35, y: 0.5, width: 3.65, height: 4.9 },
      { x: 0.5, y: 5.6, width: 3.65, height: 4.9 },
      { x: 4.35, y: 5.6, width: 3.65, height: 4.9 },
    ]);
    const last = sheetSlots(4)[3];
    expect(Math.round((last.x + last.width + PRINT.margin) * 1000) / 1000).toBe(8.5);
    expect(Math.round((last.y + last.height + PRINT.margin) * 1000) / 1000).toBe(11);
    expect(sheetSlots(1)).toHaveLength(1);
    expect(sheetSlots(9)).toHaveLength(4);
  });

  it('writes those measurements into the print stylesheet, with backgrounds printed', () => {
    const css = printCss();
    expect(css).toContain('@page { size: 8.5in 11in; margin: 0.5in; }');
    expect(css).toContain('grid-template-columns: repeat(2, 3.65in)');
    expect(css).toContain('grid-auto-rows: 4.9in');
    expect(css).toContain('gap: 0.2in');
    expect(css).toContain('width: 7.5in');
    expect(css).toContain('height: 10in');
    expect(css).toContain('print-color-adjust: exact');
    expect(css).toMatch(/\.gwm-print-sheet \.gwm-mc \{ width: 3\.65in; height: 4\.9in;/);
  });
});

describe('saving the image', () => {
  it('keeps only the latin faces of the Google Fonts stylesheet', () => {
    const css = `/* latin-ext */\n@font-face { font-family: 'Outfit'; src: url(a.woff2); }\n/* latin */\n@font-face { font-family: 'Outfit'; src: url(b.woff2); }`;
    expect(latinFontFaces(css)).toEqual(["@font-face { font-family: 'Outfit'; src: url(b.woff2); }"]);
    expect(latinFontFaces('@font-face { src: url(c.ttf); }')).toEqual(['@font-face { src: url(c.ttf); }']);
  });
});

describe('the Remember a soldier section', () => {
  let printSpy: jest.SpyInstance;
  beforeEach(() => {
    printSpy = jest.spyOn(window, 'print').mockImplementation(() => {});
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });
  afterEach(() => jest.restoreAllMocks());

  async function ready() {
    render(<RememberSoldier />);
    const button = screen.getByRole('button', { name: 'Remember a soldier' });
    await waitFor(() => expect(button).toBeEnabled());
    return button;
  }

  it('draws every soldier once before any comes again, and announces each', async () => {
    const button = await ready();
    expect(screen.getByRole('article', { name: 'A blank memorial card' })).toBeInTheDocument();
    const seen: string[] = [];
    for (let i = 0; i < FALLEN.length; i++) {
      fireEvent.click(button);
      const name = screen.getByRole('heading', { level: 3 }).textContent!;
      seen.push(name);
      expect(screen.getByRole('status')).toHaveTextContent(`Remembering`);
      expect(screen.getByRole('status')).toHaveTextContent(name);
    }
    expect(new Set(seen).size).toBe(FALLEN.length);
    // The candle plays on screen when motion is welcome.
    expect(screen.getByTestId('live-flame')).toBeInTheDocument();
  });

  it('holds the candle still when the visitor asks for less motion', async () => {
    const mm = window.matchMedia as jest.Mock;
    const original = mm.getMockImplementation();
    mm.mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    const button = await ready();
    fireEvent.click(button);
    expect(screen.queryByTestId('live-flame')).not.toBeInTheDocument();
    expect(document.querySelector('.gwm-remember-card .gwm-mc-candle-still')).toBeInTheDocument();
    mm.mockImplementation(original);
  });

  it('finds a soldier from the search box with the keyboard', async () => {
    await ready();
    const box = screen.getByRole('combobox', { name: /find a soldier by name or state/i });
    fireEvent.change(box, { target: { value: 'missouri' } });
    const list = await screen.findByRole('listbox');
    expect(within(list).getAllByRole('option')).toHaveLength(1);
    expect(box).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(box, { key: 'ArrowDown' });
    expect(box).toHaveAttribute('aria-activedescendant', within(list).getByRole('option').id);
    fireEvent.keyDown(box, { key: 'Enter' });
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Wayne Miner');
    expect(screen.getByRole('status')).toHaveTextContent('Remembering Private Wayne Miner, of Missouri.');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('says so when no one matches', async () => {
    await ready();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'nobody here' } });
    expect(await screen.findByText('No soldier found by that name or state.')).toBeInTheDocument();
  });

  it('prints one card, or four different soldiers, on a sheet of their own', async () => {
    const button = await ready();
    fireEvent.click(button);
    fireEvent.click(screen.getByRole('button', { name: 'Print this card' }));
    await waitFor(() => expect(printSpy).toHaveBeenCalledTimes(1));
    let sheet = document.querySelector('.gwm-print-sheet')!;
    expect(sheet.querySelectorAll('.gwm-mc')).toHaveLength(1);
    expect(document.querySelector('.gwm-print-root style')!.textContent).toContain('@page');
    act(() => {
      window.dispatchEvent(new Event('afterprint'));
    });
    expect(document.querySelector('.gwm-print-sheet')).toBeNull();

    const shown = screen.getByRole('heading', { level: 3 }).textContent;
    fireEvent.click(screen.getByRole('button', { name: 'Print four' }));
    await waitFor(() => expect(printSpy).toHaveBeenCalledTimes(2));
    sheet = document.querySelector('.gwm-print-sheet')!;
    const printed = Array.from(sheet.querySelectorAll('h3')).map((h) => h.textContent);
    expect(printed).toHaveLength(4);
    expect(new Set(printed).size).toBe(4);
    expect(printed[0]).toBe(shown);
    // Printed cards hold the still flame, never the playing one.
    expect(sheet.querySelector('[data-testid="live-flame"]')).toBeNull();
    expect(sheet.querySelectorAll('.gwm-mc-candle-still')).toHaveLength(4);
  });
});
