import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ApprovedFact } from '@/components/exhibition/FactNote';
import { roomReturn } from '@/components/exhibition/helpers';
import { EGYPT } from '@/app/exhibitions/egypt/egypt';
import { GLYPHS } from '@/app/exhibitions/egypt/rooms';
import HieroglyphName from '@/app/exhibitions/egypt/hieroglyph-name/page';
import { CHART, MAX_LETTERS, NAME_NOTES, SIGNS, spell } from '@/app/exhibitions/egypt/hieroglyph-name/alphabet';
import WeighingOfTheHeart from '@/app/exhibitions/egypt/weighing-of-the-heart/page';
import { DEEDS, JUDGEMENT_NOTES, MISTAKES_ALLOWED, tilt, verdict } from '@/app/exhibitions/egypt/weighing-of-the-heart/judgement';
import TombExplorer from '@/app/exhibitions/egypt/tomb/page';
import { TOMB_NOTES, WALLS, nearDetail } from '@/app/exhibitions/egypt/tomb/scenes';
import Mummification from '@/app/exhibitions/egypt/mummification/page';
import { ANUBIS_POSTER, JARS, STEPS, WRAP_AMULETS } from '@/app/exhibitions/egypt/mummification/steps';
import RosettaStone from '@/app/exhibitions/egypt/rosetta-stone/page';
import { CLEOPATRA, PTOLEMY, ROSETTA_NOTES, SCRIPTS, sharedSigns } from '@/app/exhibitions/egypt/rosetta-stone/rosetta';
import AmuletMaker from '@/app/exhibitions/egypt/amulet/page';
import { AMULET_NOTES, MAX_SYMBOLS, SYMBOLS, toggleSymbol } from '@/app/exhibitions/egypt/amulet/amulets';

/*
 * Ancient Egypt's six rooms: the name cartouche, the weighing of the heart,
 * the tomb explorer, mummification, the Rosetta Stone decoder and the amulet
 * maker. Every fact from outside the posters is a museum note with a source
 * from the museums the owner trusts; the one poster line quoted is word for
 * word. Each room opens from the display case's Interactives, goes back
 * there, works by keyboard, and stands still under reduced motion.
 */

const ROOT = join(__dirname, '..', '..');
const ROOMS = [
  '/exhibitions/egypt/hieroglyph-name',
  '/exhibitions/egypt/rosetta-stone',
  '/exhibitions/egypt/tomb',
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
  ...WALLS.map((w) => w.note),
  ...Object.values(TOMB_NOTES),
  ...STEPS.flatMap((s) => s.notes),
  ...WRAP_AMULETS.map((a) => a.note),
  ...SCRIPTS.map((s) => s.note),
  ...Object.values(ROSETTA_NOTES),
  ...SYMBOLS.map((s) => s.meaning),
  ...Object.values(AMULET_NOTES),
];
const TRUSTED = /^https:\/\/(www\.britishmuseum\.org|www\.metmuseum\.org|www\.ees\.ac\.uk|www\.penn\.museum|www\.gutenberg\.org)\//;

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

describe('the words and the pictures', () => {
  it('sets every outside fact as a sourced museum note, never as poster copy', () => {
    expect(NOTES.length).toBeGreaterThan(30);
    for (const n of NOTES) {
      expect(n.sources.length).toBeGreaterThan(0);
      for (const s of n.sources) expect(s.href).toMatch(TRUSTED);
      expect(posterText).not.toContain(n.text);
    }
    // The Gutenberg text is only ever cited beside the British Museum's own record of the papyrus.
    expect(JUDGEMENT_NOTES.ani.sources.map((s) => s.href)).toEqual(expect.arrayContaining([expect.stringContaining('britishmuseum.org/collection/object/Y_EA10470')]));
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

describe('the display case’s interactives', () => {
  it('lists the six rooms, each with a screenshot of the room, its alt text, and a page', () => {
    expect(EGYPT.interactives!.map((r) => r.href)).toEqual(ROOMS);
    for (const r of EGYPT.interactives!) {
      expect(r.emblem).toBeUndefined();
      expect(existsSync(join(ROOT, 'public', r.image!.src))).toBe(true);
      expect(r.image!.alt).toContain(`${r.title.replace(/^The /, '')} room: `);
      expect(existsSync(join(ROOT, 'app', r.href.replace(/^\//, ''), 'page.tsx'))).toBe(true);
      expect(existsSync(join(ROOT, 'app', r.href.replace(/^\//, ''), 'layout.tsx'))).toBe(true);
    }
  });

  it('takes each room back to the case’s Interactives', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/tomb');
    render(<TombExplorer />);
    const back = screen.getByRole('link', { name: 'Display Case' });
    expect(back).toHaveAttribute('href', roomReturn(EGYPT).href);
    expect(back.getAttribute('href')).toBe('/exhibitions/egypt/artifacts/case?view=interactives');
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
    for (const letter of CHART) expect(SIGNS[letter].length).toBeGreaterThan(0);
  });

  it('draws the name in a cartouche, across or down, and prints it', async () => {
    const print = jest.fn();
    window.print = print;
    render(<HieroglyphName />);
    expect(screen.getByRole('img', { name: /empty cartouche/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Print my cartouche' })).toBeDisabled();
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'Maya' } });
    expect(screen.getByRole('img', { name: /Maya in hieroglyphs.*read left to right: M, A, Y, A/ })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('4 signs: M, A, Y, A');
    fireEvent.click(screen.getByRole('button', { name: 'Down' }));
    expect(screen.getByRole('img', { name: /read top to bottom/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Print my cartouche' }));
    expect(document.querySelector('.egr-print-root')).toHaveTextContent('Maya in hieroglyphs');
    await waitFor(() => expect(print).toHaveBeenCalled());
    act(() => {
      window.dispatchEvent(new Event('afterprint'));
    });
    expect(document.querySelector('.egr-print-root')).toBeNull();
  });
});

describe('The Weighing of the Heart', () => {
  it('quotes Ani’s words from the papyrus, and sorts every deed one way or the other', () => {
    expect(DEEDS).toHaveLength(9);
    for (const d of DEEDS) {
      expect(d.quote).toMatch(d.kind === 'never' ? /^I have (not|made no one)/ : /^I have given/);
    }
  });

  it('starts heavy, lightens with each right answer, and balances only within the mistakes allowed', () => {
    expect(tilt(0, 0)).toBeGreaterThan(10);
    expect(tilt(4, 0)).toBeLessThan(tilt(3, 0));
    expect(tilt(3, 1)).toBeGreaterThan(tilt(4, 0));
    expect(verdict(9, 0)).toBe('balanced');
    expect(verdict(9 - MISTAKES_ALLOWED, MISTAKES_ALLOWED)).toBe('balanced');
    expect(verdict(5, 4)).toBe('heavy');
    expect(verdict(3, 1)).toBe('weighing');
    expect(tilt(9, 0)).toBe(0);
  });

  const play = (right: boolean) => {
    fireEvent.click(screen.getByRole('button', { name: 'Begin the weighing' }));
    for (const d of DEEDS) {
      const want = right ? d.kind : d.kind === 'never' ? 'did' : 'never';
      fireEvent.click(screen.getByRole('button', { name: want === 'never' ? 'Ani never did this' : 'Ani did this' }));
      expect(screen.getByText(`“${d.quote}”`)).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /Next deed|See the scales/ }));
    }
  };

  it('balances the heart against the feather when Ani’s words are sorted right', () => {
    render(<WeighingOfTheHeart />);
    play(true);
    expect(screen.getByRole('heading', { name: 'The scales balance' })).toBeInTheDocument();
    expect(screen.getByText(/Thoth writes down the result, and Ani goes on to meet Osiris/)).toBeInTheDocument();
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuetext', '9 of 9 sorted, 9 right');
  });

  it('ends a heavy heart with Ammit waiting and an invitation to try again: nothing is eaten', () => {
    render(<WeighingOfTheHeart />);
    play(false);
    expect(screen.getByRole('heading', { name: 'The heart is too heavy' })).toBeInTheDocument();
    const panel = screen.getByRole('heading', { name: 'The heart is too heavy' }).closest('section')!;
    expect(panel).toHaveTextContent(/Ammit leans in, waiting/);
    expect(panel).toHaveTextContent(/try again/);
    expect(panel.textContent).not.toMatch(/\b(eat|eats|eaten|devour|devours|devoured)\b/i);
    fireEvent.click(screen.getByRole('button', { name: 'Weigh again' }));
    expect(screen.getByRole('heading', { name: 'Deed 1 of 9' })).toBeInTheDocument();
  });
});

describe('Tomb Explorer', () => {
  it('hides one detail in each wall for the torch to find', () => {
    for (const w of WALLS) {
      expect(nearDetail(w, w.find.x, w.find.y)).toBe(true);
      expect(nearDetail(w, w.find.x > 0.5 ? 0.05 : 0.95, w.find.y)).toBe(false);
    }
  });

  it('moves the torch with the arrow keys, finds the detail, and lights the whole wall on request', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/tomb');
    render(<TombExplorer />);
    const wall = screen.getByRole('group', { name: /Menna and Family Hunting in the Marshes/ });
    expect(screen.getByText(/Search with the torch for/)).toBeInTheDocument();
    // From the middle (0.5, 0.5) to the crocodile (0.45, 0.88): down eight steps, left one.
    for (let i = 0; i < 8; i++) fireEvent.keyDown(wall, { key: 'ArrowDown' });
    fireEvent.keyDown(wall, { key: 'ArrowLeft' });
    expect(screen.getByText('You found the crocodile!')).toBeInTheDocument();
    expect(screen.getByText(WALLS[0].note.text)).toBeInTheDocument();
    // The next wall, by its tab and the arrow key.
    const tab = screen.getByRole('tab', { name: /The marshes/ });
    fireEvent.keyDown(tab, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'The fields' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Light the whole wall' }));
    expect(screen.getByRole('button', { name: 'Light the whole wall' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(WALLS[1].note.text)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: WALLS[1].title })).toHaveAttribute('href', WALLS[1].credit.href);
  });
});

describe('Mummification, step by step', () => {
  it('names the four Sons of Horus and their organs as the British Museum does', () => {
    expect(JARS.map((j) => `${j.god}:${j.organ}`)).toEqual(['Imset:liver', 'Hapi:lungs', 'Duamutef:stomach', 'Qebehsenuef:intestines']);
    const jarsNote = STEPS.find((s) => s.id === 'organs')!.notes.map((n) => n.text).join(' ');
    for (const j of JARS) expect(jarsNote).toContain(j.god);
    // Gentle: the brain is never mentioned.
    expect(JSON.stringify(STEPS)).not.toMatch(/brain|hook/i);
    expect(STEPS.find((s) => s.id === 'natron')!.notes[0].text).toMatch(/40 days/);
    expect(STEPS.find((s) => s.id === 'why')!.notes[1].text).toMatch(/70 days/);
  });

  it('matches organs to jars, counts the natron days at once under reduced motion, and wraps with amulets', () => {
    reducedMotion(true);
    window.history.replaceState(null, '', '/exhibitions/egypt/mummification#organs');
    render(<Mummification />);
    expect(screen.getByRole('tab', { name: /Canopic jars/ })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Liver' }));
    fireEvent.click(screen.getByRole('button', { name: 'Hapi, the baboon-headed jar' }));
    expect(screen.getByRole('status')).toHaveTextContent('Not that jar');
    fireEvent.click(screen.getByRole('button', { name: 'Imset, the human-headed jar' }));
    expect(screen.getByRole('status')).toHaveTextContent('human-headed Imset protects the liver');
    for (const [organ, god] of [['Stomach', 'Duamutef'], ['Lungs', 'Hapi'], ['Intestines', 'Qebehsenuef']]) {
      fireEvent.click(screen.getByRole('button', { name: organ }));
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${god},`) }));
    }
    expect(screen.getByText('All four organs are safe in their jars.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Next step/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Start the 40 days' }));
    expect(screen.getByRole('status')).toHaveTextContent('Forty days have passed.');

    fireEvent.keyDown(screen.getByRole('tab', { name: /Natron/ }), { key: 'End' });
    fireEvent.keyDown(screen.getByRole('tab', { name: /Day 70/ }), { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: /Wrapping/ })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('button', { name: /Wedjat eye/ }));
    expect(screen.getByText(WRAP_AMULETS[0].note.text)).toBeInTheDocument();
    for (let i = 0; i < 4; i++) fireEvent.click(screen.getByRole('button', { name: /Wrap a layer of linen/ }));
    expect(screen.getByRole('button', { name: /Wrap a layer of linen \(4\/4\)/ })).toBeDisabled();
    expect(screen.getByRole('img', { name: /wrapped in 4 of 4 layers/ })).toBeInTheDocument();
  });
});

describe('The Rosetta Stone Decoder', () => {
  it('sets the stone’s three scripts top to bottom, and Ptolemy and Cleopatra sharing four signs', () => {
    expect(SCRIPTS.map((s) => `${s.place}:${s.name}`)).toEqual(['Top:Hieroglyphic', 'Middle:Demotic', 'Bottom:Greek']);
    expect(PTOLEMY.map((s) => s.sound).join('')).toBe('PTOLMIS');
    expect(CLEOPATRA.slice(0, 9).map((s) => s.sound).join('')).toBe('KLEOPATRA');
    expect(sharedSigns()).toEqual([1, 3, 4, 9]);
    // The lion: the same sign in both names, the l.
    expect(PTOLEMY.find((s) => s.sound === 'L')!.code).toBe(CLEOPATRA[1].code);
  });

  it('shows the three scripts side by side, then cracks Ptolemy sign by sign', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/rosetta-stone');
    render(<RosettaStone />);
    const columns = screen.getByRole('list', { name: 'The three scripts, side by side' });
    expect(within(columns).getAllByRole('img')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'CC BY-SA 4.0' })).toHaveAttribute('href', 'https://creativecommons.org/licenses/by-sa/4.0/');
    fireEvent.click(screen.getByRole('button', { name: /Crack a name/ }));
    expect(window.location.hash).toBe('#ptolemy');
    fireEvent.click(screen.getByRole('button', { name: 'Sign 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'S' }));
    expect(screen.getByRole('status')).toHaveTextContent('Not S');
    PTOLEMY.forEach((s, i) => {
      fireEvent.click(screen.getByRole('button', { name: `Sign ${i + 1}` }));
      fireEvent.click(screen.getByRole('button', { name: s.sound }));
    });
    expect(screen.getByRole('heading', { name: 'P-T-O-L-M-I-S: Ptolemy!' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Now try Cleopatra/ }));
    for (const i of sharedSigns()) fireEvent.click(screen.getByRole('button', { name: `Sign ${i + 1}` }));
    expect(screen.getByText(ROSETTA_NOTES.cleopatra.text)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Show the new sounds' }));
    expect(screen.getByRole('heading', { name: 'K-L-E-O-P-A-T-R-A' })).toBeInTheDocument();
  });
});

describe('Design an Amulet', () => {
  it('carves up to three symbols, each with its meaning and source', () => {
    expect(toggleSymbol(['ankh'], 'ankh')).toEqual([]);
    expect(toggleSymbol(['ankh', 'djed', 'lotus'], 'heart')).toEqual(['ankh', 'djed', 'lotus']);
    expect(MAX_SYMBOLS).toBe(3);
    render(<AmuletMaker />);
    fireEvent.click(screen.getByRole('button', { name: /Wedjat eye/ }));
    fireEvent.click(screen.getByRole('button', { name: /Scarab beetle/ }));
    fireEvent.click(screen.getByRole('button', { name: /Lotus flower/ }));
    expect(screen.getByRole('status')).toHaveTextContent('room for 3 symbols');
    expect(screen.getByRole('button', { name: /Lotus flower/ })).toHaveAttribute('aria-pressed', 'false');
    for (const id of ['ankh', 'wedjat', 'scarab'] as const) expect(screen.getByText(SYMBOLS.find((s) => s.id === id)!.meaning.text)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: /Carve a name/ }), { target: { value: 'Ra' } });
    expect(screen.getByRole('img', { name: /a scarab of blue-green faience, carved with the ankh and the wedjat eye and the scarab beetle, and the name Ra/ })).toBeInTheDocument();
  });
});
