import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import Mummification from '@/app/exhibitions/egypt/mummification/page';
import { ANUBIS_POSTER, CHECK, HEART_NOTE, JARS, JARS_ANSWER, MUMMY_INTRO, STEPS, WRAP_AMULETS } from '@/app/exhibitions/egypt/mummification/steps';
import WeighingOfTheHeart from '@/app/exhibitions/egypt/weighing-of-the-heart/page';
import { ANI_INTRO, CHAPTERS, DEEDS, FIGURES, JUDGEMENT_NOTES, PAPYRI, RULE, SORT_HINT, WEIGHING_INTRO, WEIGHING_SOURCES, wouldTip } from '@/app/exhibitions/egypt/weighing-of-the-heart/judgement';
import AmuletMaker from '@/app/exhibitions/egypt/amulet/page';
import { AMULET_INTRO, MAX_SYMBOLS, NEEDS, SYMBOLS, toggleSymbol } from '@/app/exhibitions/egypt/amulet/amulets';
import { AMULET_KEY, readAmulet } from '@/app/exhibitions/egypt/amulet/savedAmulet';
import MyTomb from '@/app/exhibitions/egypt/my-tomb/page';
import { GOODS, MAX_GOODS, MY_TOMB_INTRO } from '@/app/exhibitions/egypt/my-tomb/myTomb';
import { CARTOUCHE_KEY, readCartouche } from '@/app/exhibitions/egypt/my-tomb/savedCartouche';
import { GLYPHS } from '@/app/exhibitions/egypt/rooms';
import { WALLS } from '@/app/exhibitions/egypt/tomb/scenes';
import { TOMB_KEY, TOMB_PLACES, readTomb } from '@/app/exhibitions/egypt/tombState';

/*
 * The four Egypt rooms where the visitor makes and does things: Mummification
 * (every step by hand), the Weighing of the Heart (meet Ani, learn the rule,
 * sort his words, then predict), Design an Amulet (carve it at a workbench,
 * and keep it), and Build Your Own Tomb (a lit chamber of the visitor's own,
 * with their cartouche and amulet). Each opens with the dark read-aloud
 * intro, works by tap and keyboard as well as by drag, takes nobody back
 * "into the tomb" and leaves nothing in the tomb's own state.
 */

const ROOT = join(__dirname, '..', '..');

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

/** Through the dark intro: its lines are all there, and Begin opens the room. */
function begin(lines: readonly string[]) {
  const intro = screen.getByRole('dialog', { name: /./ });
  for (const l of lines) expect(within(intro).getByText(l)).toBeInTheDocument();
  fireEvent.click(within(intro).getByRole('button', { name: 'Begin' }));
  expect(screen.queryByText(lines[0])).toBeNull();
}

const tap = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));

beforeEach(() => {
  window.localStorage.clear();
  reducedMotion(true);
});
afterEach(() => {
  reducedMotion(false);
  jest.useRealTimers();
});

describe('the craft rooms, together', () => {
  it('marks their new words for review, and none of them takes the visitor back into the tomb or writes to it', () => {
    for (const f of ['my-tomb/myTomb.ts', 'weighing-of-the-heart/judgement.ts', 'mummification/steps.ts', 'amulet/amulets.ts']) {
      expect(readFileSync(join(ROOT, 'app/exhibitions/egypt', f), 'utf8')).toMatch(/REVIEW:/);
    }
    for (const f of ['my-tomb/page.tsx', 'weighing-of-the-heart/page.tsx', 'mummification/page.tsx', 'amulet/page.tsx']) {
      const src = readFileSync(join(ROOT, 'app/exhibitions/egypt', f), 'utf8');
      expect(src).not.toMatch(/TombDoor|tombState|markDone/);
    }
    expect(MUMMY_INTRO).toContain(ANUBIS_POSTER);
    for (const lines of [MUMMY_INTRO, WEIGHING_INTRO, AMULET_INTRO, MY_TOMB_INTRO]) {
      expect(lines.length).toBeGreaterThanOrEqual(3);
      expect(lines.length).toBeLessThanOrEqual(5);
    }
  });
});

describe('Mummification, every step by hand', () => {
  it('teaches the four Sons of Horus before the organs go in, with the room sources’ spellings', () => {
    expect(JARS.map((j) => `${j.god}:${j.organ}`)).toEqual(['Imset:liver', 'Hapi:lungs', 'Duamutef:stomach', 'Qebehsenuef:intestines']);
    expect(STEPS.map((s) => s.id)).toEqual(['wash', 'brain', 'gods', 'organs', 'natron', 'oils', 'wrap', 'coffin']);
    for (const j of JARS) expect(JARS_ANSWER.text).toContain(j.god);
    expect(HEART_NOTE.text).toMatch(/heart was left inside/);
    expect(STEPS.find((s) => s.id === 'brain')!.notes[0].text).toMatch(/nose/);
    expect(STEPS.find((s) => s.id === 'natron')!.notes.map((n) => n.text).join(' ')).toMatch(/40 days/);
    expect(STEPS.flatMap((s) => s.notes).map((n) => n.text).join(' ')).toMatch(/70 days/);
    expect(CHECK).toHaveLength(3);
  });

  it('is played start to finish by tap: wash, hook, meet the gods, fill the jars, natron and the forty days, oils, linen with your own amulet, the coffin, three questions', () => {
    window.localStorage.setItem(AMULET_KEY, JSON.stringify({ shape: 'scarab', material: 'gold', symbols: ['ankh', 'lotus'], name: 'Maya', nameGlyphs: '' }));
    window.history.replaceState(null, '', '/exhibitions/egypt/mummification');
    render(<Mummification />);
    begin(MUMMY_INTRO);
    const next = () => tap(/Next step/);
    const at = (n: number) => expect(screen.getByRole('button', { name: new RegExp(`^Step ${n}: `) })).toHaveAttribute('aria-current', 'step');

    // 1. Wash
    at(1);
    for (let i = 0; i < 8; i++) {
      const pour = screen.queryByRole('button', { name: /Or tap: pour water/ });
      if (pour) fireEvent.click(pour);
    }
    expect(screen.getByRole('status')).toHaveTextContent('The body is washed clean.');
    next();
    // 2. The brain: in, then out through the nose
    tap('Or tap: push the hook in');
    tap('Or tap: pull the brain out');
    expect(screen.getByRole('status')).toHaveTextContent('out through the nose');
    next();
    // 3. Meet the four gods first
    at(3);
    for (const [i, j] of JARS.entries()) {
      tap(`Meet the god on jar ${i + 1}`);
      expect(screen.getByRole('status')).toHaveTextContent(`${j.god}, with a ${j.head}’s head, guards the ${j.organ}.`);
    }
    next();
    // 4. The organs into their jars: a wrong jar gets a kind hint
    at(4);
    tap('Liver');
    tap(/^Hapi, the baboon-headed jar/);
    expect(screen.getByRole('status')).toHaveTextContent('Not that jar. Look for the god with a human’s head: he guards the liver.');
    tap(/^Imset, the human-headed jar/);
    for (const o of ['stomach', 'lungs', 'intestines']) {
      const j = JARS.find((x) => x.organ === o)!;
      tap(o[0].toUpperCase() + o.slice(1));
      tap(new RegExp(`^${j.god}, the`));
    }
    expect(screen.getByRole('status')).toHaveTextContent('All four jars are full.');
    tap('The heart');
    expect(screen.getByRole('status')).toHaveTextContent('the heart stays inside the body');
    next();
    // 5. Natron, and the forty days (all at once under reduced motion)
    for (let i = 0; i < 6; i++) fireEvent.click(screen.getByRole('button', { name: /Bags of natron/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Forty days have passed. The body is dry.');
    next();
    // 6. Oils and resin
    for (let i = 0; i < 3; i++) tap('Or tap: rub in oil and resin');
    expect(screen.getByRole('status')).toHaveTextContent('coated in oils and resin');
    next();
    // 7. Linen, layer by layer, with the visitor's own amulet tucked in
    tap('Or tap: wrap a layer of linen (0/4)');
    tap('Or tap: wrap a layer of linen (1/4)');
    expect(within(screen.getByRole('group', { name: 'Amulets to tuck in' })).getAllByRole('button')[0]).toHaveAccessibleName(/Your amulet/);
    tap(/Your amulet/);
    expect(screen.getByRole('status')).toHaveTextContent('Your amulet is tucked into the wrappings.');
    tap('Or tap: wrap a layer of linen (2/4)');
    tap('Or tap: wrap a layer of linen (3/4)');
    expect(screen.getByRole('status')).toHaveTextContent('The last layer of linen is on.');
    next();
    // 8. The coffin and its lid, then three questions
    tap('Or tap: lay the mummy in its coffin');
    tap('Or tap: close the lid');
    fireEvent.click(screen.getByRole('button', { name: '7 days' }));
    expect(screen.getByText('Not quite. Have another go.')).toBeInTheDocument();
    for (const c of CHECK) fireEvent.click(within(screen.getByRole('group', { name: c.q })).getByRole('button', { name: c.answer }));
    expect(screen.getByRole('link', { name: /Into the Hall of Judgement/ })).toHaveAttribute('href', '/exhibitions/egypt/weighing-of-the-heart');
    expect(screen.getByRole('link', { name: /Build your own tomb/ })).toHaveAttribute('href', '/exhibitions/egypt/my-tomb');
    expect(screen.queryByRole('link', { name: /Back into the tomb/ })).toBeNull();
    expect(window.localStorage.getItem(TOMB_KEY)).toBeNull();
    expect(WRAP_AMULETS.length).toBeGreaterThan(0);
  });

  it('opens an old step’s address at the step it is now part of', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/mummification#oils');
    render(<Mummification />);
    expect(screen.getByRole('button', { name: /^Step 6: / })).toHaveAttribute('aria-current', 'step');
  });
});

describe('The Weighing of the Heart', () => {
  it('keeps both papyri apart, says who Ani was, and teaches the rule from its sources', () => {
    expect(PAPYRI.ani.text).toMatch(/Papyrus of Ani \(British Museum EA 10470\)/);
    expect(PAPYRI.hunefer.text).not.toMatch(/\bAni\b|10470/);
    expect(ANI_INTRO.text).toMatch(/scribe/);
    expect(ANI_INTRO.text).toMatch(/British Museum/);
    expect(ANI_INTRO.sources.map((s) => s.href)).toEqual(expect.arrayContaining([expect.stringContaining('britishmuseum.org/collection/object/Y_EA10470')]));
    expect(RULE.text).toMatch(/feather of Maat/);
    expect(FIGURES.ammit.fact.text).toMatch(/head of a crocodile, the front of a lion and the back of a hippopotamus/);
    expect(FIGURES.thoth.fact.text).toMatch(/Ibis-headed Thoth/);
    expect(WEIGHING_SOURCES.map((g) => g.title)).toEqual(expect.arrayContaining(['Meet Ani', 'The rule', 'Two papyri', 'The hall']));
    for (const d of DEEDS) expect(wouldTip(d)).toBe(d.kind === 'never');
    expect(CHAPTERS.map((c) => c.id)).toEqual(['ani', 'hall', 'rule', 'words', 'weigh', 'verdict', 'you']);
  });

  it('unrolls Ani’s papyrus, meets the hall, tries the rule, sorts his words, then predicts, kindly throughout', () => {
    jest.useFakeTimers();
    window.history.replaceState(null, '', '/exhibitions/egypt/weighing-of-the-heart');
    const { container } = render(<WeighingOfTheHeart />);
    begin(WEIGHING_INTRO);
    const tilt = () => Number(container.querySelector('.egw-svg')!.getAttribute('data-tilt'));
    const nav = () => within(container.querySelector('.egw-nav') as HTMLElement);
    const next = () => fireEvent.click(nav().getByRole('button', { name: /Next/ }));

    // Meet Ani: the papyrus unrolls (Next waits for it)
    expect(nav().getByRole('button', { name: /Next/ })).toBeDisabled();
    tap('Unroll the papyrus');
    expect(screen.getByText(ANI_INTRO.text)).toBeInTheDocument();
    next();
    // The hall: tap the figures to meet them
    tap('Meet Ammit');
    expect(screen.getByText(FIGURES.ammit.fact.text)).toBeInTheDocument();
    tap('Meet Thoth');
    expect(screen.getByText(FIGURES.thoth.fact.text)).toBeInTheDocument();
    next();
    // The rule: a wrong on the heart's side tips the scales; taking it off levels them
    expect(screen.getByText(RULE.text)).toBeInTheDocument();
    expect(tilt()).toBe(0);
    tap('A wrong');
    tap(/The heart’s pan of the scales/);
    expect(tilt()).toBeGreaterThan(0);
    expect(container.querySelector('.egw-reading')).toHaveTextContent('Out of balance');
    tap('Take the wrong off');
    expect(tilt()).toBe(0);
    expect(container.querySelector('.egw-reading')).toHaveTextContent('Level');
    next();
    // Ani's words: sort each card, with an answer at once
    expect(nav().getByRole('button', { name: /Next/ })).toBeDisabled();
    const first = DEEDS[0];
    tap(first.label);
    tap(new RegExp(`The “${first.kind === 'never' ? 'I have …' : 'I have not …'}” scroll`));
    expect(screen.getByRole('status')).toHaveTextContent(SORT_HINT);
    for (const d of DEEDS) {
      tap(d.label);
      tap(new RegExp(`The “${d.kind === 'never' ? 'I have not …' : 'I have …'}” scroll`));
      expect(screen.getByRole('status')).toHaveTextContent(d.quote);
    }
    expect(screen.getByText('All sorted. Ani has spoken to the judges.')).toBeInTheDocument();
    next();
    // The weighing: lay the heart on the scales, then predict
    tap('Ani’s heart');
    tap(/The empty pan of the scales/);
    tap('Tip out of balance');
    expect(screen.getByText('Good guess, but look: they stay level.')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(tilt()).toBe(0);
    expect(screen.getByText(JUDGEMENT_NOTES.level.text)).toBeInTheDocument();
    next();
    expect(screen.getByRole('heading', { name: 'The scales balance' })).toBeInTheDocument();
    expect(screen.getByText(JUDGEMENT_NOTES.verdict.text)).toBeInTheDocument();
    next();
    tap('I shared');
    expect(screen.getByText('Every one of those counts.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Build your own tomb' })).toHaveAttribute('href', '/exhibitions/egypt/my-tomb');
    expect(screen.queryByRole('link', { name: /Back into the tomb/ })).toBeNull();
    expect(container.textContent).not.toMatch(/\b(eat|eats|eaten|devour|devours|devoured|punish|wrong answer|score|fail)\b/i);
    expect(readTomb().done.weighing).toBeFalsy();
  });
});

describe('Design an Amulet, at the workbench', () => {
  it('asks the name of the person it is for, carves by tap, keeps to three symbols, and saves the finished amulet', () => {
    expect(toggleSymbol(['ankh'], 'ankh')).toEqual([]);
    expect(toggleSymbol(['ankh', 'djed', 'lotus'], 'heart')).toEqual(['ankh', 'djed', 'lotus']);
    for (const n of NEEDS) for (const id of n.suggests) expect(SYMBOLS.some((s) => s.id === id)).toBe(true);
    window.history.replaceState(null, '', '/exhibitions/egypt/amulet');
    const { container } = render(<AmuletMaker />);
    begin(AMULET_INTRO);
    const next = () => fireEvent.click(within(container.querySelector('.egr-step-nav, .ega-nav') as HTMLElement).getByRole('button', { name: /Next/ }));
    tap('A friend');
    fireEvent.change(screen.getByRole('textbox', { name: /Your friend’s name/ }), { target: { value: 'Sam' } });
    next();
    tap('A long life');
    next();
    next();
    // Carve: tap a symbol, then the amulet
    const symbols = within(screen.getByRole('group', { name: 'The symbols' }));
    for (const s of SYMBOLS.slice(0, MAX_SYMBOLS)) {
      fireEvent.click(symbols.getByRole('button', { name: new RegExp(`^${s.name}`) }));
      tap(`Carve the ${s.name.toLowerCase()} on your amulet`);
      expect(screen.getByRole('status')).toHaveTextContent(`${s.name} carved on your amulet.`);
    }
    fireEvent.click(symbols.getByRole('button', { name: new RegExp(`^${SYMBOLS[MAX_SYMBOLS].name}`) }));
    expect(screen.getByRole('status')).toHaveTextContent(`Your amulet has room for ${MAX_SYMBOLS} symbols. Take one off first.`);
    next();
    const saved = readAmulet();
    expect(saved).not.toBeNull();
    expect(saved!.name).toBe('Sam');
    expect(saved!.symbols).toEqual(SYMBOLS.slice(0, MAX_SYMBOLS).map((s) => s.id));
    expect(screen.getByRole('button', { name: 'Print my amulet' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Lay it in your tomb' })).toHaveAttribute('href', '/exhibitions/egypt/my-tomb');
    expect(screen.getByRole('link', { name: 'Tuck it into a mummy' })).toHaveAttribute('href', '/exhibitions/egypt/mummification');
    // The step bar is a row of its own, apart from the print and links.
    expect(container.querySelector('.ega-nav, .egr-step-nav')!.contains(screen.getByRole('button', { name: 'Print my amulet' }))).toBe(false);
    expect(window.localStorage.getItem(TOMB_KEY)).toBeNull();
  });
});

describe('Build Your Own Tomb', () => {
  it('reads the cartouche the name room saved, however its signs are written', () => {
    expect(readCartouche()).toBeNull();
    window.localStorage.setItem(CARTOUCHE_KEY, JSON.stringify({ name: 'Ra', signs: ['D21', 'G1'] }));
    expect(readCartouche()!.name).toBe('Ra');
    expect(readCartouche()!.spelled[0].glyphs).toBe(GLYPHS.D21 + GLYPHS.G1);
    window.localStorage.setItem(CARTOUCHE_KEY, JSON.stringify({ name: 'Ra', signs: ['NOT-A-SIGN'] }));
    expect(readCartouche()!.spelled.map((x) => x.letters)).toEqual(['R', 'A']);
    window.localStorage.setItem(CARTOUCHE_KEY, JSON.stringify({ name: 'Ankh', signs: ['S34'] }));
    expect(readCartouche()!.spelled[0].glyphs).toBe(GLYPHS.S34);
    window.localStorage.setItem(CARTOUCHE_KEY, JSON.stringify({ name: 'Mia', signs: [] }));
    expect(readCartouche()!.spelled.length).toBe(3);
    window.localStorage.setItem(CARTOUCHE_KEY, 'not json');
    expect(readCartouche()).toBeNull();
  });

  it('starts the journey: a lit tomb with six empty places, each a door to the room that fills it; furnished by tap and keyboard; sealed only when full', () => {
    window.history.replaceState(null, '', '/exhibitions/egypt/my-tomb');
    const { container } = render(<MyTomb />);
    const intro = screen.getByRole('dialog', { name: 'Build Your Own Tomb' });
    for (const l of MY_TOMB_INTRO) expect(within(intro).getByText(l)).toBeInTheDocument();
    fireEvent.click(within(intro).getByRole('button', { name: 'Enter your tomb' }));
    // Fully lit: no torch here.
    expect(container.querySelector('.egb-chamber')).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/torch/i);
    expect(screen.getByRole('img', { name: /an open coffin, empty/ })).toBeInTheDocument();

    // Each empty place, in the picture and in the list, leads to its room.
    for (const p of TOMB_PLACES) {
      expect(screen.getByRole('link', { name: new RegExp(`empty: it waits for ${p.waits}\\. Go to ${p.room}`) })).toHaveAttribute('href', p.href);
      expect(screen.getAllByRole('link', { name: new RegExp(p.room) }).length).toBeGreaterThanOrEqual(2);
    }
    expect(screen.getByRole('button', { name: 'Seal your tomb' })).toBeDisabled();

    tap('Furnish it');
    tap('Put in a chair');
    tap('Put in bread and fruit');
    const chair = screen.getByRole('button', { name: 'A chair, on the floor' });
    const before = chair.style.left;
    fireEvent.keyDown(chair, { key: 'ArrowRight' });
    expect(screen.getByRole('button', { name: 'A chair, on the floor' }).style.left).not.toBe(before);
    fireEvent.keyDown(screen.getByRole('button', { name: 'Bread and fruit, on the floor' }), { key: 'Delete' });
    expect(screen.queryByRole('button', { name: 'Bread and fruit, on the floor' })).toBeNull();
    for (const g of GOODS.slice(2, 2 + MAX_GOODS)) tap(`Put in ${g.name.toLowerCase()}`);
    expect(screen.getByRole('status')).toHaveTextContent(`The floor holds ${MAX_GOODS} things.`);
    tap(/Back to your tomb/);

    fireEvent.change(screen.getByRole('textbox', { name: 'Whose tomb is this?' }), { target: { value: 'Nefer' } });
    expect(screen.getByText('The tomb of Nefer')).toBeInTheDocument();
    // The furnishing is kept in this browser, to come back to; nothing is put in the rooms' places.
    expect(JSON.parse(window.localStorage.getItem('mm-egypt-my-tomb')!)).toMatchObject({ owner: 'Nefer', sealed: false });
    expect(readTomb().kept ?? {}).toEqual({});
  });

  it('shows what each room put in, in its place, glowing on arrival, then seals the tomb and can start a new one', () => {
    window.localStorage.setItem(CARTOUCHE_KEY, JSON.stringify({ name: 'Maya', signs: ['G17', 'G1', 'M17', 'G1'] }));
    window.localStorage.setItem(AMULET_KEY, JSON.stringify({ shape: 'oval', material: 'faience', symbols: ['wedjat'], name: 'Maya', nameGlyphs: '' }));
    window.localStorage.setItem(
      TOMB_KEY,
      JSON.stringify({
        done: {},
        found: {},
        painting: WALLS[2].id,
        kept: { walls: 'a painting of the cat', name: 'your name, in a cartouche', rosetta: 'a papyrus', amulet: 'your amulet', mummification: 'your mummy in its coffin', weighing: 'a heart amulet' },
      }),
    );
    window.history.replaceState(null, '', '/exhibitions/egypt/my-tomb');
    const { container } = render(<MyTomb />);
    // Straight in from a room: no intro, and what is new is said.
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('New in your tomb')).toBeInTheDocument();
    expect(container.querySelectorAll('.egb-arrived')).toHaveLength(6);
    const chamber = screen.getByRole('img', { name: /A burial chamber/ });
    expect(chamber).toHaveAccessibleName(expect.stringMatching(/painted coffin, closed, with the mummy inside/));
    expect(chamber).toHaveAccessibleName(expect.stringMatching(/cartouche with the name Maya/));
    expect(chamber).toHaveAccessibleName(expect.stringMatching(/In the niche: an oval of blue-green faience, carved with the wedjat eye/));
    expect(chamber).toHaveAccessibleName(expect.stringMatching(new RegExp(WALLS[2].title)));
    expect(screen.getByRole('img', { name: 'Your name in a cartouche: Maya' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /empty: it waits/ })).toBeNull();

    tap('Seal your tomb');
    expect(screen.getByRole('heading', { name: 'Your tomb is sealed' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /walled up with stone/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Print my tomb' })).toBeInTheDocument();
    tap('Start a new tomb');
    tap('Yes, empty it');
    expect(readTomb().kept).toEqual({});
    expect(screen.getByRole('button', { name: 'Seal your tomb' })).toBeDisabled();
  });
});
