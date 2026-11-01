import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ApprovedFact } from '@/components/exhibition/FactNote';
import { roomReturn } from '@/components/exhibition/helpers';
import { EGYPT } from '@/app/exhibitions/egypt/egypt';
import { GLYPHS, SIGN_NAMES } from '@/app/exhibitions/egypt/rooms';
import { TOMB_KEY, readTomb } from '@/app/exhibitions/egypt/tombState';
import HieroglyphName from '@/app/exhibitions/egypt/hieroglyph-name/page';
import { CHART, MAX_LETTERS, NAME_NOTES, SIGNS, consonantsOnly, spell } from '@/app/exhibitions/egypt/hieroglyph-name/alphabet';
import WeighingOfTheHeart from '@/app/exhibitions/egypt/weighing-of-the-heart/page';
import { CHAPTERS, DEEDS, FIGURES, JUDGEMENT_NOTES, PAPYRI, WEIGHING_SOURCES, wouldTip } from '@/app/exhibitions/egypt/weighing-of-the-heart/judgement';
import TombExplorer from '@/app/exhibitions/egypt/tomb/page';
import { TOMB_NOTES, WALLS, detailAt, renderedBox, toPicture, toScreen, tombSources } from '@/app/exhibitions/egypt/tomb/scenes';
import { CHAMBER, THINGS } from '@/app/exhibitions/egypt/tomb/things';
import Mummification from '@/app/exhibitions/egypt/mummification/page';
import { ANUBIS_POSTER, CHECK, HEART_NOTE, JARS, STEPS, WRAP_AMULETS } from '@/app/exhibitions/egypt/mummification/steps';
import RosettaStone from '@/app/exhibitions/egypt/rosetta-stone/page';
import { CLEOPATRA, DEDUCE, DISTRACTORS, PTOLEMY, PTOLEMY_SOUNDS, ROSETTA_NOTES, SCRIPTS, sharedSigns, shuffledSounds } from '@/app/exhibitions/egypt/rosetta-stone/rosetta';
import AmuletMaker from '@/app/exhibitions/egypt/amulet/page';
import { AMULET_NOTES, MAX_SYMBOLS, NEEDS, SYMBOLS, toggleSymbol } from '@/app/exhibitions/egypt/amulet/amulets';

/*
 * Ancient Egypt's six rooms, with the tomb as the way in: the tomb explorer,
 * the name cartouche, the weighing of the heart, mummification, the Rosetta
 * Stone decoder and the amulet maker. Every fact from outside the posters is
 * a museum note with a source the owner trusts, cited in the room's one
 * Sources drawer and never inline; the one poster line quoted is word for
 * word. Each room opens from the display case's Interactives and from the
 * tomb, goes back the way it came, works by keyboard, stands still under
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
];

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
    for (const r of EGYPT.interactives!) expect(r.image!.src).toBe(`/exhibitions/egypt/rooms/${r.href.split('/').pop()}.webp`);
  });
});

describe('the display case’s interactives, and the way back', () => {
  it('lists the six rooms, the tomb first, each with a screenshot of the room, its alt text, and a page', () => {
    expect(EGYPT.interactives!.map((r) => r.href)).toEqual(ROOMS);
    for (const r of EGYPT.interactives!) {
      expect(r.emblem).toBeUndefined();
      expect(existsSync(join(ROOT, 'public', r.image!.src))).toBe(true);
      expect(r.image!.alt).toContain(`${r.title.replace(/^The /, '')} room: `);
      expect(existsSync(join(ROOT, 'app', r.href.replace(/^\//, ''), 'page.tsx'))).toBe(true);
      expect(existsSync(join(ROOT, 'app', r.href.replace(/^\//, ''), 'layout.tsx'))).toBe(true);
    }
  });

  it('takes each room back to the case’s Interactives, or to the tomb when the tomb opened it', async () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/amulet');
    const { unmount } = render(<AmuletMaker />);
    const back = screen.getByRole('link', { name: 'Display Case' });
    expect(back).toHaveAttribute('href', roomReturn(EGYPT).href);
    expect(back.getAttribute('href')).toBe('/exhibitions/egypt/artifacts/case?view=interactives');
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
    for (const Room of [TombExplorer, HieroglyphName, WeighingOfTheHeart, Mummification, RosettaStone, AmuletMaker]) {
      window.history.replaceState(null, '', '/exhibitions/egypt/x');
      const { container, unmount } = render(<Room />);
      expect(container.querySelector('.eg-room-stage')!.textContent).not.toMatch(/\bSources?: /);
      expect(container.querySelector('.egr-fact-source')).toBeNull();
      const button = screen.getByRole('button', { name: 'Sources' });
      fireEvent.click(button);
      expect(within(screen.getByRole('dialog', { name: 'Sources' })).getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(1);
      unmount();
    }
  });

  it('keeps the Rosetta Stone photograph’s licence credit complete in the drawer', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/rosetta-stone');
    render(<RosettaStone />);
    fireEvent.click(screen.getByRole('button', { name: 'Sources' }));
    const drawer = screen.getByRole('dialog', { name: 'Sources' });
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
    expect(screen.getByText(WALLS[0].details[0].tells.text)).toBeInTheDocument();
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
    fireEvent.click(screen.getByRole('button', { name: 'Light the whole wall' }));
    expect(screen.getByRole('button', { name: 'Light the whole wall' })).toHaveAttribute('aria-pressed', 'true');
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

describe('Mummification, step by step', () => {
  it('names the four Sons of Horus and their organs as the British Museum does, and says what happened to the brain', () => {
    expect(JARS.map((j) => `${j.god}:${j.organ}`)).toEqual(['Imset:liver', 'Hapi:lungs', 'Duamutef:stomach', 'Qebehsenuef:intestines']);
    const jarsNote = STEPS.find((s) => s.id === 'organs')!.notes.map((n) => n.text).join(' ');
    for (const j of JARS) expect(jarsNote).toContain(j.god);
    expect(STEPS.map((s) => s.id)).toEqual(['why', 'wash', 'brain', 'organs', 'natron', 'oils', 'wrap', 'coffin']);
    expect(STEPS.find((s) => s.id === 'brain')!.notes[0].text).toMatch(/through the nose, and it was not kept/);
    expect(HEART_NOTE.text).toMatch(/heart was left inside/);
    expect(STEPS.find((s) => s.id === 'natron')!.notes[0].text).toMatch(/40 days/);
    expect(STEPS.find((s) => s.id === 'why')!.notes[1].text).toMatch(/70 days/);
    expect(CHECK).toHaveLength(3);
  });

  it('is played start to finish: wash, brain, jars and the heart, natron, oils, wrapping with chosen amulets, the coffin, three questions', () => {
    reducedMotion(true);
    window.localStorage.setItem(TOMB_KEY, JSON.stringify({ done: {}, found: {}, amulet: { shape: 'scarab', material: 'gold', symbols: ['ankh', 'lotus'], owner: '' } }));
    window.history.replaceState(null, '', '/exhibitions/egypt/mummification');
    render(<Mummification />);
    const next = () => fireEvent.click(screen.getByRole('button', { name: /Next step/ }));
    next();
    for (let i = 0; i < 6; i++) fireEvent.click(screen.getByRole('button', { name: /Pour water/ }));
    expect(screen.getByRole('status')).toHaveTextContent('The body is washed clean.');
    next();
    fireEvent.click(screen.getByRole('button', { name: 'Draw out the brain' }));
    expect(screen.getByText('Gone: the brain was not kept.')).toBeInTheDocument();
    next();
    expect(screen.getByRole('tab', { name: /Canopic jars/ })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Liver' }));
    fireEvent.click(screen.getByRole('button', { name: /^Hapi, the baboon-headed jar/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Not that jar. The liver was looked after by the god with a human’s head.');
    fireEvent.click(screen.getByRole('button', { name: /^Imset, the human-headed jar/ }));
    expect(screen.getByRole('status')).toHaveTextContent('human-headed Imset protects the liver');
    for (const [organ, god] of [['Stomach', 'Duamutef'], ['Lungs', 'Hapi'], ['Intestines', 'Qebehsenuef']]) {
      fireEvent.click(screen.getByRole('button', { name: organ }));
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${god},`) }));
    }
    fireEvent.click(screen.getByRole('button', { name: 'The heart' }));
    expect(screen.getByText(HEART_NOTE.text)).toBeInTheDocument();
    next();
    expect(screen.getByRole('button', { name: 'Start the 40 days' })).toBeDisabled();
    for (let i = 0; i < 6; i++) fireEvent.click(screen.getByRole('button', { name: /Pack a bag of natron/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Start the 40 days' }));
    expect(screen.getByRole('status')).toHaveTextContent('Forty days have passed.');
    next();
    for (let i = 0; i < 3; i++) fireEvent.click(screen.getByRole('button', { name: /Rub in oil/ }));
    next();
    fireEvent.click(screen.getByRole('button', { name: /Your amulet/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Your amulet is tucked into the wrappings.');
    fireEvent.click(screen.getByRole('button', { name: /Wedjat eye/ }));
    expect(screen.getByText(WRAP_AMULETS[0].note.text)).toBeInTheDocument();
    for (let i = 0; i < 4; i++) fireEvent.click(screen.getByRole('button', { name: /Wrap a layer of linen/ }));
    expect(screen.getByRole('img', { name: /wrapped in 4 of 4 layers/ })).toBeInTheDocument();
    next();
    fireEvent.click(screen.getByRole('button', { name: 'Lay the mummy in its coffin' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close the lid' }));
    expect(readTomb().done.mummification).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: '7 days' }));
    expect(screen.getByText('Not quite. Have another go.')).toBeInTheDocument();
    for (const c of CHECK) fireEvent.click(within(screen.getByRole('group', { name: c.q })).getByRole('button', { name: c.answer }));
    expect(screen.getByRole('link', { name: /Into the Hall of Judgement/ })).toHaveAttribute('href', '/exhibitions/egypt/weighing-of-the-heart?from=tomb');
    expect(screen.getByRole('link', { name: /Back into the tomb/ })).toHaveAttribute('href', '/exhibitions/egypt/tomb');
  });
});

describe('The Weighing of the Heart', () => {
  it('introduces both papyri, each by its own museum number, and never mixes them up', () => {
    expect(PAPYRI.ani.text).toMatch(/Papyrus of Ani \(British Museum EA 10470\)/);
    expect(PAPYRI.ani.text).not.toMatch(/Hunefer|9901/);
    expect(PAPYRI.hunefer.text).toMatch(/Hunefer \(British Museum EA 9901\)/);
    expect(PAPYRI.hunefer.text).not.toMatch(/\bAni\b|10470/);
    expect(PAPYRI.ani.sources.map((s) => s.href)).toContain('https://www.britishmuseum.org/collection/object/Y_EA10470-3');
    expect(PAPYRI.hunefer.sources.map((s) => s.href)).toContain('https://www.britishmuseum.org/collection/object/Y_EA9901-3');
    expect(FIGURES.ammit.fact.text).toMatch(/head of a crocodile, the front of a lion and the back of a hippopotamus/);
    expect(WEIGHING_SOURCES.map((g) => g.title)).toEqual(expect.arrayContaining(['Two papyri', 'The hall']));
  });

  it('quotes Ani’s words from the papyrus, and knows which deeds would tip the scales', () => {
    for (const d of DEEDS) {
      expect(d.quote).toMatch(d.kind === 'never' ? /^I have (not|made no one)/ : /^I have given/);
      expect(wouldTip(d)).toBe(d.kind === 'never');
    }
  });

  it('starts level, moves as the story is told, and ends balanced and kind', () => {
    jest.useFakeTimers();
    window.history.replaceState(null, '', '/exhibitions/egypt/weighing-of-the-heart');
    const { container } = render(<WeighingOfTheHeart />);
    const tilt = () => container.querySelector('.egw-svg')!.getAttribute('data-tilt');
    const next = () => fireEvent.click(within(container.querySelector('.egr-step-nav')!).getByRole('button', { name: /Next|Finish/ }));
    expect(tilt()).toBe('0');
    expect(screen.getByRole('heading', { name: 'Two papyri, one story' })).toBeInTheDocument();
    next();
    fireEvent.click(screen.getByRole('button', { name: 'Ammit' }));
    expect(screen.getByText(FIGURES.ammit.fact.text)).toBeInTheDocument();
    next();
    // The heart goes in: Next waits for a guess.
    expect(within(container.querySelector('.egr-step-nav')!).getByRole('button', { name: /Next/ })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Tip out of balance' }));
    expect(screen.getByText('Good guess, but look: they stay level.')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(tilt()).toBe('0');
    next();
    for (const [i, d] of DEEDS.entries()) {
      if (i === 0) {
        fireEvent.click(screen.getByRole('button', { name: '“I have …”' }));
        expect(container.querySelector('.egw-hint')).toHaveTextContent('Think again: is this something kind, or something unkind?');
      }
      fireEvent.click(screen.getByRole('button', { name: d.kind === 'never' ? '“I have not …”' : '“I have …”' }));
      expect(screen.getByText(`“${d.quote}”`)).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: d.kind === 'never' ? 'Tip out of balance' : 'Stay level' }));
      expect(screen.getByText(/You guessed it!/)).toBeInTheDocument();
      if (d.kind === 'never') expect(Number(tilt())).toBeGreaterThan(0);
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(tilt()).toBe('0');
      if (i < DEEDS.length - 1) fireEvent.click(screen.getByRole('button', { name: /Next deed/ }));
    }
    next();
    expect(screen.getByRole('heading', { name: 'The scales balance' })).toBeInTheDocument();
    expect(screen.getByText(JUDGEMENT_NOTES.verdict.text)).toBeInTheDocument();
    expect(readTomb().done.weighing).toBe(true);
    next();
    expect(screen.getByRole('heading', { name: 'Weigh your own choices' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'I shared' }));
    expect(screen.getByRole('list', { name: 'Your good choices' })).toHaveTextContent('I shared');
    expect(screen.getByRole('link', { name: /Back into the tomb/ })).toHaveAttribute('href', '/exhibitions/egypt/tomb');
    // Kind throughout: nothing is eaten, nobody is punished, nothing is scored.
    expect(container.textContent).not.toMatch(/\b(eat|eats|eaten|devour|devours|devoured|punish|wrong answer|score|fail)\b/i);
    expect(CHAPTERS).toHaveLength(6);
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
    fireEvent.click(screen.getByRole('button', { name: 'Sign 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'K' }));
    expect(screen.getByRole('status')).toHaveTextContent('there is no K in Ptolemy’s name');
    PTOLEMY.forEach((s, i) => {
      fireEvent.click(screen.getByRole('button', { name: `Sign ${i + 1}` }));
      fireEvent.click(screen.getByRole('button', { name: s.sound }));
    });
    expect(screen.getByRole('heading', { name: 'P-T-O-L-M-I-S: Ptolemy!' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Now try Cleopatra/ }));
    for (const i of sharedSigns()) fireEvent.click(screen.getByRole('button', { name: `Sign ${i + 1}` }));
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

describe('Design an Amulet', () => {
  it('asks who it is for and what it should protect, suggests symbols, carves up to three, and places it in the tomb', () => {
    expect(toggleSymbol(['ankh'], 'ankh')).toEqual([]);
    expect(toggleSymbol(['ankh', 'djed', 'lotus'], 'heart')).toEqual(['ankh', 'djed', 'lotus']);
    expect(MAX_SYMBOLS).toBe(3);
    for (const n of NEEDS) for (const id of n.suggests) expect(SYMBOLS.some((s) => s.id === id)).toBe(true);
    window.history.replaceState(null, '', '/exhibitions/egypt/amulet');
    render(<AmuletMaker />);
    fireEvent.click(screen.getByRole('button', { name: 'A friend' }));
    fireEvent.click(screen.getByRole('button', { name: 'The afterlife' }));
    expect(screen.getByText(/An Egyptian might choose/)).toHaveTextContent('Heart, Djed pillar, Scarab beetle');
    expect(screen.getByRole('button', { name: 'Heart (suggested)' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Wedjat eye/ }));
    fireEvent.click(screen.getByRole('button', { name: /Scarab beetle/ }));
    fireEvent.click(screen.getByRole('button', { name: /Lotus flower/ }));
    expect(screen.getByRole('status')).toHaveTextContent('room for 3 symbols');
    expect(screen.getByRole('button', { name: /Lotus flower/ })).toHaveAttribute('aria-pressed', 'false');
    for (const id of ['ankh', 'wedjat', 'scarab'] as const) expect(screen.getByText(SYMBOLS.find((s) => s.id === id)!.meaning.text)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: /Carve a name/ }), { target: { value: 'Ra' } });
    expect(screen.getByRole('img', { name: /a scarab of blue-green faience, carved with the ankh and the wedjat eye and the scarab beetle, and the name Ra/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Place it in the tomb' }));
    expect(readTomb().amulet).toEqual({ shape: 'scarab', material: 'faience', symbols: ['ankh', 'wedjat', 'scarab'], owner: 'Ra' });
    expect(screen.getByRole('button', { name: 'In the tomb’s niche ✓' })).toBeDisabled();
  });
});
