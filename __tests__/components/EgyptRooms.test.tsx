import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ApprovedFact } from '@/components/exhibition/FactNote';
import { EGYPT } from '@/app/exhibitions/egypt/egypt';
import { GLYPHS, SIGN_NAMES } from '@/app/exhibitions/egypt/rooms';
import { TOMB_KEY, readTomb } from '@/app/exhibitions/egypt/tombState';
import HieroglyphName from '@/app/exhibitions/egypt/hieroglyph-name/page';
import { CHART, MAX_LETTERS, NAME_NOTES, SIGNS, consonantsOnly, spell } from '@/app/exhibitions/egypt/hieroglyph-name/alphabet';
import WeighingOfTheHeart from '@/app/exhibitions/egypt/weighing-of-the-heart/page';
import { FIGURES, JUDGEMENT_NOTES, PAPYRI } from '@/app/exhibitions/egypt/weighing-of-the-heart/judgement';
import TombExplorer from '@/app/exhibitions/egypt/tomb/page';
import { TOMB_NOTES, WALLS, detailAt, renderedBox, toPicture, toScreen, tombSources } from '@/app/exhibitions/egypt/tomb/scenes';
import { CHAMBER, THINGS } from '@/app/exhibitions/egypt/tomb/things';
import Mummification from '@/app/exhibitions/egypt/mummification/page';
import { ANUBIS_POSTER, HEART_NOTE, STEPS, WRAP_AMULETS } from '@/app/exhibitions/egypt/mummification/steps';
import RosettaStone from '@/app/exhibitions/egypt/rosetta-stone/page';
import { CLEOPATRA, DEDUCE, DISTRACTORS, PTOLEMY, PTOLEMY_GREEK, PTOLEMY_SOUNDS, ROSETTA_NOTES, SCRIPTS, sharedSigns, shuffledSounds } from '@/app/exhibitions/egypt/rosetta-stone/rosetta';
import AmuletMaker from '@/app/exhibitions/egypt/amulet/page';
import { AMULET_NOTES, SYMBOLS } from '@/app/exhibitions/egypt/amulet/amulets';
import MyTomb from '@/app/exhibitions/egypt/my-tomb/page';

/*
 * Ancient Egypt's seven rooms, with the tomb as the way in: the tomb explorer,
 * the name cartouche, the weighing of the heart, mummification, the Rosetta
 * Stone decoder, the amulet maker and the tomb builder (the four craft rooms
 * are played through in EgyptCraftRooms.test.tsx). Every fact from outside the posters is
 * a museum note with a source the owner trusts, cited in the room's one
 * Sources drawer and never inline; the one poster line quoted is word for
 * word. Each room opens from the display case's Interactives and from the
 * tomb, goes back to the exhibition (or the way it came), works by keyboard, stands still under
 * reduced motion, and leaves what it made in the tomb.
 */

const ROOT = join(__dirname, '..', '..');
const ROOMS = [
  '/exhibitions/egypt/tomb',
  '/exhibitions/egypt/hieroglyph-name',
  '/exhibitions/egypt/rosetta-stone',
  '/exhibitions/egypt/mummification',
  '/exhibitions/egypt/weighing-of-the-heart',
  '/exhibitions/egypt/amulet',
  '/exhibitions/egypt/my-tomb',
];
/** Rooms not yet photographed for their card: an emblem stands in for the screenshot. */
const NO_SCREENSHOT_YET = ['/exhibitions/egypt/my-tomb'];

const posterText = EGYPT.posters
  .flatMap((p) => p.items)
  .map((it) => ('text' in it && it.text ? it.text : ''))
  .join('\n');

/** Every museum note the rooms set. */
const NOTES: ApprovedFact[] = [
  ...Object.values(NAME_NOTES),
  ...Object.values(JUDGEMENT_NOTES),
  ...Object.values(PAPYRI),
  ...Object.values(FIGURES).map((f) => f.fact),
  ...WALLS.map((w) => w.note),
  ...WALLS.flatMap((w) => w.details.map((d) => d.tells)),
  ...Object.values(TOMB_NOTES),
  ...STEPS.flatMap((s) => s.notes),
  HEART_NOTE,
  ...WRAP_AMULETS.map((a) => a.note),
  ...SCRIPTS.map((s) => s.note),
  ...Object.values(ROSETTA_NOTES),
  ...SYMBOLS.map((s) => s.meaning),
  ...Object.values(AMULET_NOTES),
];
const TRUSTED = /^https:\/\/(www\.britishmuseum\.org|www\.metmuseum\.org|www\.ees\.ac\.uk|www\.penn\.museum|www\.gutenberg\.org|www\.ucl\.ac\.uk|www\.unicode\.org)\//;

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

beforeEach(() => {
  window.localStorage.clear();
});
afterEach(() => {
  reducedMotion(false);
  jest.useRealTimers();
});

describe('the words and the pictures', () => {
  it('sets every outside fact as a sourced museum note, never as poster copy', () => {
    expect(NOTES.length).toBeGreaterThan(50);
    for (const n of NOTES) {
      expect(n.sources.length).toBeGreaterThan(0);
      for (const s of n.sources) expect(s.href).toMatch(TRUSTED);
      expect(posterText).not.toContain(n.text);
    }
    // The Gutenberg text is only ever cited beside the British Museum's own record of the papyrus.
    expect(JUDGEMENT_NOTES.ani.sources.map((s) => s.href)).toEqual(expect.arrayContaining([expect.stringContaining('britishmuseum.org/collection/object/Y_EA10470')]));
  });

  it('marks every new line for the owner’s review in its data file', () => {
    const files = ['tomb/scenes.ts', 'weighing-of-the-heart/judgement.ts', 'mummification/steps.ts', 'rosetta-stone/rosetta.ts', 'hieroglyph-name/alphabet.ts', 'amulet/amulets.ts', 'rooms.ts', 'egypt.ts'];
    for (const f of files) expect(readFileSync(join(ROOT, 'app/exhibitions/egypt', f), 'utf8')).toMatch(/REVIEW:/);
  });

  it('quotes the poster’s line on Anubis word for word', () => {
    expect(posterText).toContain(ANUBIS_POSTER);
    expect(ANUBIS_POSTER).toMatch(/^Anubis was the god of mummification/);
  });

  it('says plainly that the name chart is a modern sound-alike', () => {
    expect(NAME_NOTES.modern.text).toMatch(/modern sound-alike, not how the ancient Egyptians wrote names/);
    expect(NAME_NOTES.modern.text).toMatch(/no vowels/);
  });

  it('keeps every picture and the hieroglyph face in the exhibition’s own folder, and credits each picture', () => {
    for (const w of WALLS) {
      expect(existsSync(join(ROOT, 'public', w.src))).toBe(true);
      expect(w.credit.href).toMatch(/^https:\/\/www\.metmuseum\.org\/art\/collection\/search\/\d+$/);
      expect(w.credit.text).toMatch(/Public domain/);
      expect(w.note.sources[0].href).toBe(w.credit.href);
    }
    for (const s of SCRIPTS) expect(existsSync(join(ROOT, 'public', s.src))).toBe(true);
    expect(existsSync(join(ROOT, 'public/exhibitions/egypt/fonts/NotoSansEgyptianHieroglyphs-subset.woff2'))).toBe(true);
    expect(readFileSync(join(ROOT, 'public/exhibitions/egypt/fonts/OFL.txt'), 'utf8')).toMatch(/SIL Open Font License/);
  });

  it('uses no Leonardo.Ai pictures and no photographs of the installation', () => {
    const egypt = JSON.stringify(EGYPT.interactives);
    expect(egypt).not.toMatch(/Leonardo/i);
    // Each card's picture is a screenshot of the room on the site, not a photograph.
    for (const r of EGYPT.interactives!) {
      if (NO_SCREENSHOT_YET.includes(r.href)) expect(r.image).toBeUndefined();
      else expect(r.image!.src).toBe(`/exhibitions/egypt/rooms/${r.href.split('/').pop()}.webp`);
    }
  });
});

describe('the display case’s interactives, and the way back', () => {
  it('lists the seven rooms, the tomb first, each with a screenshot of the room (or, until it has one, an emblem), its alt text, and a page', () => {
    expect(EGYPT.interactives!.map((r) => r.href)).toEqual(ROOMS);
    for (const r of EGYPT.interactives!) {
      if (NO_SCREENSHOT_YET.includes(r.href)) {
        expect(r.emblem).toBeTruthy();
      } else {
        expect(r.emblem).toBeUndefined();
        expect(existsSync(join(ROOT, 'public', r.image!.src))).toBe(true);
        expect(r.image!.alt).toContain(`${r.title.replace(/^The /, '')} room: `);
      }
      expect(existsSync(join(ROOT, 'app', r.href.replace(/^\//, ''), 'page.tsx'))).toBe(true);
      expect(existsSync(join(ROOT, 'app', r.href.replace(/^\//, ''), 'layout.tsx'))).toBe(true);
    }
  });

  it('takes each room back to the Ancient Egypt exhibition, or to the tomb when the tomb opened it', async () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/amulet');
    const { unmount } = render(<AmuletMaker />);
    const back = screen.getByRole('link', { name: 'Ancient Egypt' });
    expect(back.getAttribute('href')).toBe('/exhibitions/egypt');
    unmount();
    window.history.replaceState(null, '', '/exhibitions/egypt/amulet?from=tomb');
    render(<AmuletMaker />);
    expect(await screen.findByRole('link', { name: 'Tomb' })).toHaveAttribute('href', '/exhibitions/egypt/tomb');
  });

  it('keeps the Studio’s way back for a room the Studio opened', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/hieroglyph-name?from=studio');
    render(<HieroglyphName />);
    expect(screen.getByRole('link', { name: 'Studio' })).toBeInTheDocument();
  });

  it('cites nothing inline: each room has one Sources drawer, grouped by step', () => {
    for (const Room of [TombExplorer, HieroglyphName, WeighingOfTheHeart, Mummification, RosettaStone, AmuletMaker, MyTomb]) {
      window.history.replaceState(null, '', '/exhibitions/egypt/x');
      const { container, unmount } = render(<Room />);
      expect(container.querySelector('.eg-room-stage')!.textContent).not.toMatch(/\bSources?: /);
      expect(container.querySelector('.egr-fact-source')).toBeNull();
      const button = screen.getByRole('button', { name: 'Sources and credits' });
      fireEvent.click(button);
      expect(within(screen.getByRole('dialog', { name: 'Sources and credits' })).getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(1);
      unmount();
    }
  });

  it('keeps the Rosetta Stone photograph’s licence credit complete in the drawer', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/rosetta-stone');
    render(<RosettaStone />);
    fireEvent.click(screen.getByRole('button', { name: 'Sources and credits' }));
    const drawer = screen.getByRole('dialog', { name: 'Sources and credits' });
    expect(drawer).toHaveTextContent(/Hans Hillewaert/);
    expect(drawer).toHaveTextContent(/CC BY-SA 4\.0/);
    expect(drawer).toHaveTextContent(/cropped/);
    expect(within(drawer).getByRole('link', { name: /Hans Hillewaert/ })).toHaveAttribute('href', 'https://commons.wikimedia.org/wiki/File:Rosetta_Stone.JPG');
  });
});

describe('Tomb Explorer', () => {
  it('maps the torch through the picture’s rendered box, letterboxed or not', () => {
    // A 1800 × 991 picture drawn "contain" in a 1000 × 1000 box: 1000 × 550.6, centred.
    const box = renderedBox({ left: 0, top: 0, width: 1000, height: 1000 }, 1800, 991);
    expect(box.width).toBeCloseTo(1000);
    expect(box.top).toBeCloseTo((1000 - 550.556) / 2, 1);
    const croc = WALLS[0].details[0];
    const at = toScreen(croc.x, croc.y, box, 1800, 991);
    const back = toPicture(at.x, at.y, box, 1800, 991);
    expect(back.x).toBeCloseTo(croc.x);
    expect(back.y).toBeCloseTo(croc.y);
    expect(detailAt(WALLS[0].details, back.x, back.y)?.id).toBe('crocodile');
    // The far left edge of the wall, where the crocodile was once "found", finds nothing.
    const edge = toPicture(box.left + 4, at.y, box, 1800, 991);
    expect(detailAt(WALLS[0].details, edge.x, edge.y)).toBeUndefined();
  });

  it('hides three details in each wall, each inside its painting and apart from the others', () => {
    for (const w of WALLS) {
      expect(w.details).toHaveLength(3);
      for (const d of w.details) {
        expect(d.x - d.r).toBeGreaterThanOrEqual(0);
        expect(d.x + d.r).toBeLessThanOrEqual(w.width);
        expect(d.y).toBeGreaterThan(0);
        expect(d.y).toBeLessThan(w.height);
        expect(detailAt(w.details, d.x, d.y)).toBe(d);
        expect(d.tells.sources.length).toBeGreaterThan(0);
      }
    }
    // The crocodile is in the water under Menna's boats: the bottom of the painting, near the middle.
    const croc = WALLS[0].details.find((d) => d.id === 'crocodile')!;
    expect(croc.y / WALLS[0].height).toBeGreaterThan(0.8);
    expect(croc.x / WALLS[0].width).toBeGreaterThan(0.35);
    expect(croc.x / WALLS[0].width).toBeLessThan(0.55);
  });

  it('opens on the burial chamber, where the torch finds the doors to every room', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/tomb');
    render(<TombExplorer />);
    expect(THINGS.map((t) => t.room).sort()).toEqual(['amulet', 'mummification', 'name', 'rosetta', 'walls', 'weighing']);
    const stage = screen.getByRole('group', { name: /The burial chamber/ });
    expect(screen.getAllByText('Something is hidden in the dark…')).toHaveLength(THINGS.length);
    // The torch starts in the middle (800, 450) of the 1600 × 900 chamber; the scales are at (800, 470).
    fireEvent.keyDown(stage, { key: 'ArrowRight' });
    fireEvent.keyDown(stage, { key: 'ArrowLeft' });
    expect(screen.getByRole('status')).toHaveTextContent('You found the scales in the Hall of Judgement.');
    expect(screen.getByRole('link', { name: /Go in/ })).toHaveAttribute('href', '/exhibitions/egypt/weighing-of-the-heart?from=tomb');
    expect(readTomb().found.chamber).toEqual(['scales']);
    fireEvent.click(screen.getByRole('button', { name: 'Light the whole chamber' }));
    expect(screen.queryByText('Something is hidden in the dark…')).toBeNull();
    expect(readTomb().found.chamber).toHaveLength(THINGS.length);
    expect(CHAMBER.width / CHAMBER.height).toBeCloseTo(16 / 9);
  });

  it('shows what the other rooms left behind', () => {
    window.localStorage.setItem(TOMB_KEY, JSON.stringify({ done: { mummification: true, amulet: true }, found: { chamber: ['table', 'niche'] }, amulet: { shape: 'oval', material: 'gold', symbols: ['ankh'], owner: '' }, cartouche: 'Maya' }));
    window.history.replaceState(null, '', '/exhibitions/egypt/tomb');
    render(<TombExplorer />);
    expect(screen.getByText('The mummy you prepared lies wrapped on the table, its four jars filled.')).toBeInTheDocument();
    expect(screen.getByText('Your amulet rests in the niche.')).toBeInTheDocument();
    expect(screen.getByText(/2 of 6 rooms finished/)).toBeInTheDocument();
    expect(document.querySelector('.egt-chamber')!.innerHTML).toContain(GLYPHS.S34);
  });

  it('finds each wall’s details by keyboard, and completes the wall', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/tomb#menna-marshes');
    render(<TombExplorer />);
    expect(screen.getByRole('tab', { name: /The marshes/ })).toHaveAttribute('aria-selected', 'true');
    const wall = screen.getByRole('group', { name: /Menna and Family Hunting in the Marshes/ });
    expect(screen.getByText('the crocodile')).toBeInTheDocument();
    // From the middle (0.5, 0.5) to the crocodile (0.45, 0.885): down eight steps, left one.
    for (let i = 0; i < 8; i++) fireEvent.keyDown(wall, { key: 'ArrowDown' });
    fireEvent.keyDown(wall, { key: 'ArrowLeft' });
    expect(screen.getByRole('status')).toHaveTextContent('You found the crocodile!');
    // The find opens in its own card; the wall's bar counts it.
    const card = screen.getByRole('dialog', { name: 'The crocodile' });
    expect(within(card).getByText(WALLS[0].details[0].tells.text)).toBeInTheDocument();
    expect(card).toHaveTextContent('Found! · 2 of 3');
    expect(screen.getByText('2 of 3 found')).toBeInTheDocument();
    fireEvent.click(within(card).getByRole('button', { name: 'Keep searching' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    // A found clue opens its card again.
    fireEvent.click(screen.getByRole('button', { name: /Found: the crocodile/ }));
    expect(screen.getByRole('dialog', { name: 'The crocodile' })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    // Each found detail is ringed where it is (the fish was passed on the way down).
    expect(document.querySelector('[data-ring="crocodile"]')).toHaveStyle({ left: '45%' });
    expect(screen.queryByText('Wall complete!')).toBeNull();
    // The cat (995, 272): up twelve, right two; then the fish (940, 650): down seven.
    for (let i = 0; i < 12; i++) fireEvent.keyDown(wall, { key: 'ArrowUp' });
    fireEvent.keyDown(wall, { key: 'ArrowRight' });
    fireEvent.keyDown(wall, { key: 'ArrowRight' });
    for (let i = 0; i < 7; i++) fireEvent.keyDown(wall, { key: 'ArrowDown' });
    expect(readTomb().found['menna-marshes']).toEqual(expect.arrayContaining(['crocodile', 'cat', 'fish']));
    expect(screen.getByText('Wall complete!')).toBeInTheDocument();
    expect(screen.getByText(WALLS[0].note.text)).toBeInTheDocument();
    expect(screen.getByText('3 of 3 found')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Light the whole wall' }));
    expect(screen.getByRole('button', { name: 'Light the whole wall' })).toHaveAttribute('aria-pressed', 'true');
    // From the card, on to the next wall.
    fireEvent.click(screen.getByRole('button', { name: /On to the next wall/ }));
    expect(screen.getByRole('tab', { name: WALLS[1].name })).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: /Next wall/ })).toBeInTheDocument();
  });

  it('still works with storage blocked: the tomb fills up while the page is open', () => {
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const get = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    window.history.replaceState(null, '', '/exhibitions/egypt/tomb');
    render(<TombExplorer />);
    fireEvent.click(screen.getByRole('button', { name: 'Light the whole chamber' }));
    expect(screen.queryByText('Something is hidden in the dark…')).toBeNull();
    spy.mockRestore();
    get.mockRestore();
  });

  it('cites every wall’s picture with its licence in the Sources drawer', () => {
    const groups = tombSources([]);
    for (const w of WALLS) {
      const g = groups.find((x) => x.title === w.title)!;
      expect(g.items[0]).toMatchObject({ href: w.credit.href, licence: w.credit.text });
    }
  });
});

describe('The Rosetta Stone Decoder', () => {
  it('sets the stone’s three scripts top to bottom, and Ptolemy and Cleopatra sharing four signs', () => {
    expect(SCRIPTS.map((s) => `${s.place}:${s.name}`)).toEqual(['Top:Hieroglyphic', 'Middle:Demotic', 'Bottom:Greek']);
    expect(PTOLEMY.map((s) => s.sound).join('')).toBe('PTOLMIS');
    expect(CLEOPATRA.slice(0, 9).map((s) => s.sound).join('')).toBe('KLEOPATRA');
    expect(sharedSigns()).toEqual([1, 3, 4, 9]);
    expect(PTOLEMY.find((s) => s.sound === 'L')!.code).toBe(CLEOPATRA[1].code);
    // Every new sign is reasoned once, and the twist: Cleopatra's t is the hand, not the bread loaf.
    expect(DEDUCE.map((d) => d.sign).sort()).toEqual([0, 2, 5, 6, 7, 8]);
    expect(CLEOPATRA[6]).toEqual({ code: 'D46', sound: 'T' });
    expect(PTOLEMY[1]).toEqual({ code: 'X1', sound: 'T' });
    expect(ROSETTA_NOTES.notOnStone.text).toMatch(/not on the Rosetta Stone/);
  });

  it('offers Ptolemy’s sounds among others, shuffled', () => {
    const order = shuffledSounds(() => 0.3);
    expect(order.sort()).toEqual([...PTOLEMY_SOUNDS, ...DISTRACTORS].sort());
    expect(shuffledSounds(() => 0.3)).not.toEqual([...PTOLEMY_SOUNDS, ...DISTRACTORS]);
    for (const d of DISTRACTORS) expect(PTOLEMY_SOUNDS).not.toContain(d);
  });

  it('cracks Ptolemy sign by sign, then Cleopatra by Champollion’s method', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/rosetta-stone');
    render(<RosettaStone />);
    const columns = screen.getByRole('list', { name: 'The three scripts, side by side' });
    expect(within(columns).getAllByRole('img')).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: /Crack a name/ }));
    expect(window.location.hash).toBe('#ptolemy');
    // The Greek spelling is beside the cartouche: the clue.
    expect(PTOLEMY_GREEK.map((g) => g.letter).join('')).toBe('ΠΤΟΛΕΜΑΙΟΣ');
    expect(screen.getByRole('list', { name: /^ΠΤΟΛΕΜΑΙΟΣ: P, T, O, L, E, M, A, I, O, S$/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Sign 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'K' }));
    expect(screen.getByRole('status')).toHaveTextContent('there is no K in Ptolemy’s name');
    PTOLEMY.forEach((s, i) => {
      fireEvent.click(screen.getByRole('button', { name: `Sign ${i + 1}` }));
      fireEvent.click(screen.getByRole('button', { name: s.sound }));
    });
    expect(screen.getByRole('heading', { name: 'P-T-O-L-M-I-S: Ptolemy!' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Now try Cleopatra/ }));
    // Ptolemy's cartouche stands above Cleopatra's, to compare; each shared sign found lights up in both.
    const known = screen.getByRole('list', { name: /Ptolemy’s cartouche, for comparing/ });
    expect(within(known).getAllByRole('listitem')).toHaveLength(PTOLEMY.length);
    fireEvent.click(screen.getByRole('button', { name: 'Sign 1' }));
    expect(screen.getByRole('status')).toHaveTextContent('That sign is new');
    expect(within(known).queryAllByRole('listitem', { name: /also in Cleopatra’s name/ })).toHaveLength(0);
    for (const i of sharedSigns()) fireEvent.click(screen.getByRole('button', { name: `Sign ${i + 1}` }));
    expect(within(known).getByRole('listitem', { name: 'L, also in Cleopatra’s name' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('That was Champollion’s trick');
    expect(within(known).getAllByRole('listitem', { name: /also in Cleopatra’s name/ })).toHaveLength(4);
    expect(screen.getByRole('heading', { name: 'Work out the new signs' })).toBeInTheDocument();
    expect(screen.getByText(ROSETTA_NOTES.cleopatra.text)).toBeInTheDocument();
    for (const d of DEDUCE) {
      if (d.sign === 2) {
        fireEvent.click(screen.getByRole('button', { name: 'R' }));
        expect(screen.getByText(/Not R\. Look at the Greek spelling again/)).toBeInTheDocument();
      }
      fireEvent.click(screen.getByRole('button', { name: CLEOPATRA[d.sign].sound }));
    }
    expect(screen.getByText(ROSETTA_NOTES.hand.text)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'K-L-E-O-P-A-T-R-A' })).toBeInTheDocument();
    // One mark beneath for every sign: eleven.
    expect(document.querySelectorAll('.egs-read span')).toHaveLength(CLEOPATRA.length);
    fireEvent.click(screen.getByRole('button', { name: /The breakthrough/ }));
    expect(readTomb().done.rosetta).toBe(true);
  });
});

describe('Your Name in Hieroglyphs', () => {
  it('spells by the chart: ch and sh take their own signs, accents fall away, and it stops at the limit', () => {
    expect(CHART).toHaveLength(28);
    expect(spell('Sasha').map((s) => s.letters)).toEqual(['S', 'A', 'SH', 'A']);
    expect(spell('Chloé').map((s) => s.letters)).toEqual(['CH', 'L', 'O', 'E']);
    expect(spell('Max').at(-1)!.glyphs).toBe(GLYPHS.V31 + GLYPHS.S29);
    expect(spell('m').map((s) => s.glyphs)).toEqual([GLYPHS.G17]);
    expect(spell('Mary-Jane 2nd').map((s) => s.letters).join('')).toBe('MARYJANEND');
    expect(spell('abcdefghijklmnopqrstuvwxyz')).toHaveLength(MAX_LETTERS);
    for (const letter of CHART) {
      expect(SIGNS[letter].length).toBeGreaterThan(0);
      for (const c of SIGNS[letter]) expect(SIGN_NAMES[c]).toBeTruthy();
    }
    // E is the two reeds, as the Egypt Exploration Society's chart draws it.
    expect(SIGNS.E).toEqual(['M17A']);
    expect(consonantsOnly(spell('Maya')).map((s) => s.letters)).toEqual(['M', 'Y']);
    expect(consonantsOnly(spell('Io')).map((s) => s.letters)).toEqual(['I']);
  });

  it('draws the name in a cartouche, shows what each sign is, compares the scribe’s way, prints it and carves it in the tomb', async () => {
    const print = jest.fn();
    window.print = print;
    window.history.replaceState(null, '', '/exhibitions/egypt/hieroglyph-name');
    render(<HieroglyphName />);
    expect(screen.getByRole('img', { name: /empty cartouche/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Print my cartouche' })).toBeDisabled();
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'Maya' } });
    expect(screen.getByRole('img', { name: /Maya in hieroglyphs.*read left to right: M, A, Y, A/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Consonants only: M, Y' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'M: an owl' }));
    expect(document.querySelector('.egn-what')).toHaveTextContent('M is an owl.');
    fireEvent.click(screen.getByRole('button', { name: 'Down' }));
    expect(screen.getByRole('img', { name: /read top to bottom/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Carve it in the tomb' }));
    expect(readTomb().cartouche).toBe('Maya');
    expect(readTomb().done.name).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Print my cartouche' }));
    expect(document.querySelector('.egr-print-root')).toHaveTextContent('Maya in hieroglyphs');
    // The printed sheet still cites its sources on the paper.
    expect(document.querySelector('.egr-print-root')).toHaveTextContent(/Sources: Egypt Exploration Society/);
    await waitFor(() => expect(print).toHaveBeenCalled());
    act(() => {
      window.dispatchEvent(new Event('afterprint'));
    });
    expect(document.querySelector('.egr-print-root')).toBeNull();
  });
});
