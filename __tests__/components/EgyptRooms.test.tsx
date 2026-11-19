import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ApprovedFact } from '@/components/exhibition/FactNote';
import { EGYPT } from '@/app/exhibitions/egypt/egypt';
import { GLYPHS, SIGN_NAMES } from '@/app/exhibitions/egypt/rooms';
import { readTomb } from '@/app/exhibitions/egypt/tombState';
import HieroglyphName from '@/app/exhibitions/egypt/hieroglyph-name/page';
import { CHART, MAX_LETTERS, NAME_NOTES, ROYAL_EXAMPLE, SIGNS, consonantsOnly, spell } from '@/app/exhibitions/egypt/hieroglyph-name/alphabet';
import { CARTOUCHE_KEY, readCartouche } from '@/app/exhibitions/egypt/hieroglyph-name/savedCartouche';
import WeighingOfTheHeart from '@/app/exhibitions/egypt/weighing-of-the-heart/page';
import { FIGURES, JUDGEMENT_NOTES, PAPYRI } from '@/app/exhibitions/egypt/weighing-of-the-heart/judgement';
import TombExplorer from '@/app/exhibitions/egypt/tomb/page';
import DarkIntro from '@/app/exhibitions/egypt/DarkIntro';
import { TOMB_NOTES, WALLS, cropAround, detailAt, renderedBox, toPicture, toScreen, tombSources } from '@/app/exhibitions/egypt/tomb/scenes';
import Mummification from '@/app/exhibitions/egypt/mummification/page';
import { ANUBIS_POSTER, HEART_NOTE, STEPS, WRAP_AMULETS } from '@/app/exhibitions/egypt/mummification/steps';
import RosettaStone from '@/app/exhibitions/egypt/rosetta-stone/page';
import { CLEOPATRA, CLEOPATRA_GREEK, NAME_SIGNS, PTOLEMY, PTOLEMY_GREEK, PTOLEMY_ORDER, ROSETTA_NOTES, ROSETTA_SOURCES, SCRIPTS, SHARED_IN_NAME, SKIPPED, STONE_CARTOUCHES, onCartouche, sharedSigns } from '@/app/exhibitions/egypt/rosetta-stone/rosetta';
import AmuletMaker from '@/app/exhibitions/egypt/amulet/page';
import { AMULET_NOTES, SYMBOLS } from '@/app/exhibitions/egypt/amulet/amulets';
import MyTomb from '@/app/exhibitions/egypt/my-tomb/page';

/*
 * Ancient Egypt’s seven rooms: the tomb explorer,
 * the name cartouche, the weighing of the heart, mummification, the Rosetta
 * Stone decoder, the amulet maker and the tomb builder (the four craft rooms
 * are played through in EgyptCraftRooms.test.tsx). Every fact from outside the posters is
 * a museum note with a source the owner trusts, cited in the room's one
 * Sources drawer and never inline; the one poster line quoted is word for
 * word. Each room opens from the display case's Interactives and from the
 * tomb, goes back to the exhibition (or the Studio, when the Studio opened it), works by keyboard,
 * stands still under reduced motion, and opens on its dark intro (DarkIntro), which Skip passes.
 */

const ROOT = join(__dirname, '..', '..');
/** The journey's order: the visitor's own tomb first, then each room that fills it. */
const ROOMS = [
  '/exhibitions/egypt/my-tomb',
  '/exhibitions/egypt/tomb',
  '/exhibitions/egypt/hieroglyph-name',
  '/exhibitions/egypt/rosetta-stone',
  '/exhibitions/egypt/amulet',
  '/exhibitions/egypt/mummification',
  '/exhibitions/egypt/weighing-of-the-heart',
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
  ...WALLS.map((w) => w.big),
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

/** Past a room's dark intro (DarkIntro), as a visitor pressing Skip. */
function skipIntro() {
  fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
  expect(screen.queryByRole('dialog')).toBeNull();
}
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
  it('lists the seven rooms, the visitor’s own tomb first, each with a screenshot of the room (or, until it has one, an emblem), its alt text, and a page', () => {
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

  it('takes each room back to the Ancient Egypt exhibition, never back into the tomb', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/hieroglyph-name');
    const { unmount } = render(<HieroglyphName />);
    expect(screen.getByRole('link', { name: 'Ancient Egypt' })).toHaveAttribute('href', '/exhibitions/egypt');
    unmount();
    // The old ?from=tomb mark no longer sends the visitor back to the tomb.
    window.history.replaceState(null, '', '/exhibitions/egypt/rosetta-stone?from=tomb');
    render(<RosettaStone />);
    expect(screen.getByRole('link', { name: 'Ancient Egypt' })).toHaveAttribute('href', '/exhibitions/egypt');
    expect(screen.queryByRole('link', { name: 'Tomb' })).toBeNull();
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

describe('The dark intro', () => {
  it('shows the title, then each line in turn, then Begin; Skip and Escape go straight in', () => {
    jest.useFakeTimers();
    const done = jest.fn();
    const { unmount } = render(<DarkIntro title="Tomb Explorer" lines={['One.', 'Two.']} voice="tomb-intro" onDone={done} />);
    const line = (t: string) => screen.getByText(t);
    expect(line('One.')).toHaveAttribute('aria-hidden', 'true');
    act(() => {
      jest.advanceTimersByTime(2100);
    });
    expect(line('One.')).not.toHaveAttribute('aria-hidden');
    expect(line('Two.')).toHaveAttribute('aria-hidden', 'true');
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(line('Two.')).not.toHaveAttribute('aria-hidden');
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));
    expect(done).toHaveBeenCalledTimes(1);
    unmount();
    render(<DarkIntro title="Tomb Explorer" lines={['One.']} onDone={done} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(done).toHaveBeenCalledTimes(2);
  });

  it('shows every line at once under reduced motion', () => {
    reducedMotion(true);
    render(<DarkIntro title="Rosetta" lines={['One.', 'Two.']} onDone={() => undefined} />);
    expect(screen.getByText('Two.')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByRole('button', { name: 'Begin' })).toHaveFocus();
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

  it('opens dark: the intro, then the first wall, black, until the torch is turned on', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/tomb');
    render(<TombExplorer />);
    const intro = screen.getByRole('dialog', { name: 'Tomb Explorer' });
    expect(intro).toHaveTextContent('It is dark in the tomb.');
    skipIntro();
    // No burial chamber, no count of rooms, no doors out to the other rooms.
    expect(screen.queryByText(/rooms finished/)).toBeNull();
    expect(screen.queryByRole('link', { name: /Go in/ })).toBeNull();
    expect(screen.queryByRole('tab', { name: /chamber/i })).toBeNull();
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(WALLS.map((w) => w.name));
    const wall = screen.getByRole('group', { name: /Menna and Family Hunting in the Marshes/ });
    expect(wall).toHaveClass('is-off');
    expect(screen.getByRole('switch', { name: /Torch/ })).toHaveAttribute('aria-checked', 'false');
    // With the torch off, nothing can be found: down to the crocodile, and nothing.
    for (let i = 0; i < 8; i++) fireEvent.keyDown(wall, { key: 'ArrowDown' });
    fireEvent.keyDown(wall, { key: 'ArrowLeft' });
    expect(readTomb().found['menna-marshes']).toBeUndefined();
    expect(screen.queryByRole('dialog')).toBeNull();
    // The big button in the dark turns it on; the switch shows it, and turns it off again.
    fireEvent.click(screen.getByRole('button', { name: 'Turn on your torch' }));
    expect(screen.getByRole('switch', { name: /Torch/ })).toHaveAttribute('aria-checked', 'true');
    expect(wall).toHaveClass('is-on');
    expect(screen.queryByRole('button', { name: 'Turn on your torch' })).toBeNull();
    fireEvent.click(screen.getByRole('switch', { name: /Torch/ }));
    expect(screen.getByRole('switch', { name: /Torch/ })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('status')).toHaveTextContent('Your torch is off');
  });

  it('finds each wall’s details by torchlight, shows each piece up close, then lights the whole wall with its big fact', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/tomb#menna-marshes');
    render(<TombExplorer />);
    skipIntro();
    expect(screen.getByRole('tab', { name: /The marshes/ })).toHaveAttribute('aria-selected', 'true');
    const wall = screen.getByRole('group', { name: /Menna and Family Hunting in the Marshes/ });
    expect(screen.getByText('the crocodile')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('switch', { name: /Torch/ }));
    // From the middle (0.5, 0.5) to the crocodile (0.45, 0.885): down eight steps, left one.
    for (let i = 0; i < 8; i++) fireEvent.keyDown(wall, { key: 'ArrowDown' });
    fireEvent.keyDown(wall, { key: 'ArrowLeft' });
    expect(screen.getByRole('status')).toHaveTextContent('You found the crocodile!');
    // The find opens in its own card, with that piece of the painting; the wall's bar counts it.
    const card = screen.getByRole('dialog', { name: 'The crocodile' });
    const crop = within(card).getByRole('img', { name: 'Close-up of the crocodile, from the painting' });
    expect(crop.style.backgroundImage).toContain(WALLS[0].src);
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
    expect(wall).not.toHaveClass('is-lit');
    // The cat (995, 272): up twelve, right two; then the fish was already found.
    for (let i = 0; i < 12; i++) fireEvent.keyDown(wall, { key: 'ArrowUp' });
    fireEvent.keyDown(wall, { key: 'ArrowRight' });
    fireEvent.keyDown(wall, { key: 'ArrowRight' });
    expect(readTomb().found['menna-marshes']).toEqual(expect.arrayContaining(['crocodile', 'cat', 'fish']));
    const last = screen.getByRole('dialog', { name: 'The little cat' });
    expect(last).toHaveTextContent('That’s everything on this wall!');
    // Closing the last card lights the whole wall, and the bar gives its one big fact.
    fireEvent.click(within(last).getByRole('button', { name: 'Light up the wall' }));
    expect(wall).toHaveClass('is-lit');
    expect(screen.getByText(WALLS[0].big.text)).toBeInTheDocument();
    expect(screen.getByText('Wall complete')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /The marshes/ })).toHaveTextContent('✓');
    // A lit wall can be painted in the visitor's own burial tomb.
    fireEvent.click(screen.getByRole('button', { name: 'Paint this wall in your tomb' }));
    expect(readTomb().kept?.walls).toBe('the painting of the marshes');
    expect(readTomb().painting).toBe('menna-marshes');
    expect(screen.getByRole('link', { name: /Go to your tomb/ })).toHaveAttribute('href', '/exhibitions/egypt/my-tomb');
    // Search again hides the finds, for the next visitor.
    fireEvent.click(screen.getByRole('button', { name: 'Search again' }));
    expect(readTomb().found['menna-marshes']).toBeUndefined();
    expect(wall).not.toHaveClass('is-lit');
    // On to the next wall.
    fireEvent.click(screen.getByRole('button', { name: /Next wall/ }));
    expect(screen.getByRole('tab', { name: WALLS[1].name })).toHaveAttribute('aria-selected', 'true');
    expect(window.location.hash).toBe(`#${WALLS[1].id}`);
  });

  it('gives every wall one big fact from its own records, and crops each find inside its painting', () => {
    for (const w of WALLS) {
      expect(w.big.sources.length).toBeGreaterThan(0);
      for (const d of w.details) {
        const c = cropAround(d, w.width, w.height);
        expect(c.left).toBeGreaterThanOrEqual(0);
        expect(c.top).toBeGreaterThanOrEqual(0);
        expect(c.left + c.width).toBeLessThanOrEqual(w.width + 0.001);
        expect(c.top + c.height).toBeLessThanOrEqual(w.height + 0.001);
        // The detail itself is in its crop.
        expect(d.x).toBeGreaterThan(c.left);
        expect(d.x).toBeLessThan(c.left + c.width);
        expect(d.y).toBeGreaterThan(c.top);
        expect(d.y).toBeLessThan(c.top + c.height);
      }
    }
  });

  it('still works with storage blocked: the wall fills up while the page is open', () => {
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const get = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    window.history.replaceState(null, '', '/exhibitions/egypt/tomb');
    render(<TombExplorer />);
    skipIntro();
    fireEvent.click(screen.getByRole('button', { name: 'Turn on your torch' }));
    const wall = screen.getByRole('group', { name: /Menna and Family Hunting in the Marshes/ });
    for (let i = 0; i < 8; i++) fireEvent.keyDown(wall, { key: 'ArrowDown' });
    fireEvent.keyDown(wall, { key: 'ArrowLeft' });
    expect(screen.getByRole('dialog', { name: 'The crocodile' })).toBeInTheDocument();
    spy.mockRestore();
    get.mockRestore();
  });

  it('cites every wall’s picture with its licence in the Sources drawer', () => {
    const groups = tombSources();
    expect(groups.map((g) => g.title)).not.toContain('The burial chamber');
    for (const w of WALLS) {
      const g = groups.find((x) => x.title === w.title)!;
      expect(g.items[0]).toMatchObject({ href: w.credit.href, licence: w.credit.text });
    }
  });
});

describe('The Rosetta Stone Decoder', () => {
  it('sets the stone’s three scripts top to bottom, and the code: Ptolemy’s signs in the Greek’s order, skipping vowels', () => {
    expect(SCRIPTS.map((s) => `${s.place}:${s.name}`)).toEqual(['Top:Hieroglyphic', 'Middle:Demotic', 'Bottom:Greek']);
    expect(PTOLEMY.map((s) => s.sound).join('')).toBe('PTOLMIS');
    expect(PTOLEMY_GREEK.map((g) => g.letter).join('')).toBe('ΠΤΟΛΕΜΑΙΟΣ');
    // Each sign says the sound of its Greek letter, in order; E, A and the second O have no sign.
    PTOLEMY.forEach((s, i) => expect(PTOLEMY_GREEK[PTOLEMY_ORDER[i]].sound).toBe(s.sound));
    expect([...PTOLEMY_ORDER].sort((a, b) => a - b)).toEqual(PTOLEMY_ORDER);
    expect(SKIPPED.map((i) => PTOLEMY_GREEK[i].sound)).toEqual(['E', 'A', 'O']);
    expect(CLEOPATRA.slice(0, NAME_SIGNS).map((s) => s.sound).join('')).toBe(CLEOPATRA_GREEK.join(''));
    expect(sharedSigns()).toEqual([1, 3, 4, 9]);
    expect(SHARED_IN_NAME.map((i) => CLEOPATRA[i].sound)).toEqual(['L', 'O', 'P']);
    expect(PTOLEMY.find((s) => s.sound === 'L')!.code).toBe(CLEOPATRA[1].code);
    // The twist: Cleopatra's t is the hand, not the bread loaf.
    expect(CLEOPATRA[6]).toEqual({ code: 'D46', sound: 'T' });
    expect(PTOLEMY[1]).toEqual({ code: 'X1', sound: 'T' });
    expect(ROSETTA_NOTES.notOnStone.text).toMatch(/not on the Rosetta Stone/);
    // The two ovals are found where they are, and nowhere else.
    for (const c of STONE_CARTOUCHES) expect(onCartouche(c.x, c.y)).toBe(true);
    expect(onCartouche(100, 100)).toBe(false);
    expect(onCartouche(589, 360)).toBe(false);
  });

  it('keeps the museum number out of the room, and in the Sources drawer', () => {
    expect(JSON.stringify(ROSETTA_NOTES)).not.toMatch(/EA ?24/);
    expect(JSON.stringify(ROSETTA_SOURCES)).toMatch(/EA24/);
  });

  it('opens dark, sets the mission, and cracks Ptolemy’s name, then checks it with Cleopatra’s', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/rosetta-stone');
    render(<RosettaStone />);
    const intro = screen.getByRole('dialog', { name: 'The Rosetta Stone Decoder' });
    expect(intro).toHaveTextContent(/Your mission/);
    expect(intro).not.toHaveTextContent(/EA ?24/);
    skipIntro();
    // The mission, from the start.
    expect(screen.getByRole('region', { name: 'Your mission' })).toHaveTextContent('Read the king’s name in hieroglyphs');
    const next = () => screen.getByRole('button', { name: /^Next/ });
    expect(next()).toBeDisabled();

    // 1: tap the band you can read.
    fireEvent.click(screen.getByRole('button', { name: /middle band/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Nobody could read it in 1799');
    expect(next()).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /bottom band/ }));
    expect(screen.getByText(ROSETTA_NOTES.greek.text)).toBeInTheDocument();
    fireEvent.click(next());
    expect(window.location.hash).toBe('#find');

    // 2: find an oval in the top band.
    fireEvent.click(screen.getByRole('button', { name: /An oval on the stone \(2 of 2\)/ }));
    expect(screen.getByRole('status')).toHaveTextContent('You found a cartouche!');
    expect(screen.getByRole('list', { name: 'The king’s name so far: ? ? ? ? ? ? ?' })).toBeInTheDocument();
    fireEvent.click(next());

    // 3: the code. Two rules first; then each sign onto its Greek letter, in order.
    expect(screen.getByRole('list', { name: 'The code’s two rules' })).toHaveTextContent(/same order.*left out/);
    fireEvent.click(screen.getByRole('button', { name: 'Letter 2, Τ, says T' }));
    expect(screen.getByRole('status')).toHaveTextContent('Not T');
    PTOLEMY.forEach((s, i) => {
      if (i === 4) {
        // The owl-less M: dropped on the E first, which the scribes left out.
        fireEvent.click(screen.getByRole('button', { name: 'Letter 5, Ε, says E' }));
        expect(screen.getByRole('status')).toHaveTextContent('The scribes left this vowel out!');
      }
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`^Letter ${PTOLEMY_ORDER[i] + 1},`) }));
      expect(screen.getByRole('button', { name: `Sign ${i + 1}: ${s.sound}` })).toBeInTheDocument();
    });
    expect(screen.getByRole('status')).toHaveTextContent('the king’s name is Ptolemy!');
    expect(screen.getByRole('list', { name: 'The king’s name so far: P T O L M I S' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Your mission' })).toHaveTextContent('Cracked: Ptolemy!');
    fireEvent.click(next());

    // 4: Cleopatra's cartouche under Ptolemy's; the signs she shares light up in both.
    const known = screen.getByRole('list', { name: /Ptolemy’s cartouche, for comparing/ });
    expect(within(known).getAllByRole('listitem')).toHaveLength(PTOLEMY.length);
    expect(next()).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Sign 1' }));
    expect(screen.getByRole('status')).toHaveTextContent('That sign is new');
    fireEvent.click(screen.getByRole('button', { name: 'Sign 10: part of the ending' }));
    expect(screen.getByRole('status')).toHaveTextContent('the bread, T, from Ptolemy’s name');
    for (const i of SHARED_IN_NAME) fireEvent.click(screen.getByRole('button', { name: `Sign ${i + 1}` }));
    expect(within(known).getByRole('listitem', { name: 'L, also in Cleopatra’s name' })).toBeInTheDocument();
    expect(within(known).getAllByRole('listitem', { name: /also in Cleopatra’s name/ })).toHaveLength(3);
    expect(screen.getByRole('status')).toHaveTextContent('Your code works!');
    // Her whole name can be read now, the hand included.
    expect(screen.getByRole('button', { name: 'Sign 7: T' })).toBeInTheDocument();
    expect(screen.getByText(ROSETTA_NOTES.cleopatra.text)).toBeInTheDocument();
    fireEvent.click(next());

    // 5: cracked, and the real code-breakers in three short stops.
    expect(screen.getByText('You cracked it: Ptolemy!')).toBeInTheDocument();
    expect(within(screen.getByRole('list', { name: 'The real code-breakers' })).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText(ROSETTA_NOTES.youngShort.text)).toBeInTheDocument();
    expect(readTomb().done.rosetta).toBe(true);
    expect(screen.getByRole('link', { name: /Back to Ancient Egypt/ })).toHaveAttribute('href', '/exhibitions/egypt');
  });

  it('opens an old tab’s address at the step it is now', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/rosetta-stone#cleopatra');
    render(<RosettaStone />);
    skipIntro();
    expect(screen.getByRole('heading', { name: /Check it with a queen/ })).toBeInTheDocument();
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

  it('explains a cartouche first, with a real royal name, then makes typing the name the obvious first step', () => {
    expect(ROYAL_EXAMPLE.map((s) => s.letters).join('')).toBe('PTOLMIS');
    window.history.replaceState(null, '', '/exhibitions/egypt/hieroglyph-name');
    render(<HieroglyphName />);
    expect(screen.getByRole('dialog', { name: 'Your Name in Hieroglyphs' })).toHaveTextContent('called a cartouche');
    skipIntro();
    expect(screen.getByRole('heading', { name: 'What is a cartouche?' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'King Ptolemy’s name in hieroglyphs, inside a cartouche' })).toBeInTheDocument();
    expect(screen.getByText(/an oval drawn all the way round the name/)).toBeInTheDocument();
    expect(screen.getByText(/it marks the end of the name/)).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Now write your name/ }));
    expect(screen.getByRole('textbox', { name: 'Your name' })).toHaveFocus();
  });

  it('draws the name in a cartouche, shows what each sign is, compares the scribe’s way, prints it and saves it for the tomb', async () => {
    const print = jest.fn();
    window.print = print;
    window.history.replaceState(null, '', '/exhibitions/egypt/hieroglyph-name');
    render(<HieroglyphName />);
    skipIntro();
    fireEvent.click(screen.getByRole('button', { name: /Now write your name/ }));
    expect(screen.getByRole('img', { name: /empty cartouche/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Print my cartouche' })).toBeDisabled();
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'Maya' } });
    expect(screen.getByRole('img', { name: /Maya in hieroglyphs.*read left to right: M, A, Y, A/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Consonants only: M, Y' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'M: an owl' }));
    expect(document.querySelector('.egn-what')).toHaveTextContent('M is an owl.');
    fireEvent.click(screen.getByRole('button', { name: 'Down' }));
    expect(screen.getByRole('img', { name: /read top to bottom/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Save it for my tomb' }));
    expect(screen.getByRole('button', { name: 'Saved for my tomb ✓' })).toBeDisabled();
    // Saved for Build Your Own Tomb: the name and exactly the signs the cartouche draws.
    expect(JSON.parse(window.localStorage.getItem(CARTOUCHE_KEY)!)).toEqual({ name: 'Maya', signs: spell('Maya') });
    expect(readCartouche()).toEqual({ name: 'Maya', signs: spell('Maya') });
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
