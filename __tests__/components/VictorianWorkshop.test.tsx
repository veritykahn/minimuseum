import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import VictorianInventions from '@/app/exhibitions/victorian/inventions/page';
import { BRISTOL_CLOCK, INCOMING, MAP_TOWNS, MORSE, NOTES, PHOTOS, PLYMOUTH, POSITIVE, PROCESS_CLUES, RAIL_STEPS, READ_WORDS, SEND_WORDS, STATIONS, TELEGRAM, TRAIN_PUZZLES, WIRE_STEPS, blurFor, verdictFor } from '@/app/exhibitions/victorian/inventions/inventionsText';
import { INVENTIONS_SOURCES, RAIL_FACTS, WIRE_FACTS } from '@/app/exhibitions/victorian/inventions/sources';
import { DIAL, DIAL_LETTERS, DIAL_ROWS, MAP, catchTrain, clockTime, dragMinute, hands, morseTimeline, needleAngles, oldMoney, onDial, project, spell, sunTimeAt, sunX, telegramCost, telegramWords, toMorse } from '@/app/exhibitions/victorian/inventions/workshop';

/*
 * The inventions workshop, rebuilt after the owner's "better but needs to
 * be improved" round: railway time on a map in five one-screen steps (noon
 * moving west, a traveller's watch, a train to catch, the stationmaster's
 * clocks, Bristol's clock with two minute hands); telegrams to write, tap
 * out in International Morse code, print and receive; the needle dial's
 * letters held still as they are read; and on every bench the notes behind
 * "Did you know?", so a step fits on one screen. Every new note is sourced.
 */

const DIR = path.join(process.cwd(), 'app/exhibitions/victorian/inventions');
const css = fs.readFileSync(path.join(DIR, 'inventions.css'), 'utf8');

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

afterEach(() => {
  media(() => false);
  jest.useRealTimers();
});

const at = (hash = '') => window.history.replaceState(null, '', `/exhibitions/victorian/inventions${hash}`);

/** The workshop's Sources drawer, opened, and the group whose heading starts so. */
const sourcesFor = (title: string) => {
  if (!screen.queryByRole('dialog', { name: 'Sources and credits' })) fireEvent.click(screen.getByRole('button', { name: 'Sources and credits' }));
  const drawer = screen.getByRole('dialog', { name: 'Sources and credits' });
  return within(drawer).getByRole('heading', { name: new RegExp(`^${title.replace(/[()]/g, '\\$&')}`) }).closest('section') as HTMLElement;
};
const closeSources = () => fireEvent.click(screen.getByRole('button', { name: 'Close sources' }));
/** Jumps a bench's card to one of its steps, by its numbered dot. */
const goStep = (n: number) => fireEvent.click(screen.getByRole('button', { name: new RegExp(`^Step ${n}: `) }));
const railStep = (id: (typeof RAIL_STEPS)[number]['id']) => goStep(RAIL_STEPS.findIndex((s) => s.id === id) + 1);
/** Opens "Did you know?" and returns its panel. */
function openFacts() {
  fireEvent.click(screen.getByRole('button', { name: /Did you know\?/ }));
  return screen.getByRole('region', { name: 'Did you know?' });
}

describe('the workshop’s Sources drawer', () => {
  it('lists every note’s source and every photograph’s credit, bench by bench and step by step, and none inline', () => {
    const drawn = INVENTIONS_SOURCES.flatMap((g) => g.items.map((i) => i.href));
    for (const note of Object.values(NOTES)) for (const s of note.sources) expect(drawn).toContain(s.href);
    for (const p of Object.values(PHOTOS)) expect(drawn).toContain(p.href);
    expect(INVENTIONS_SOURCES.map((g) => g.title)).toEqual(expect.arrayContaining(RAIL_STEPS.map((s, i) => `The railway, step ${i + 1}: ${s.title}`)));
    // The benches read their notes from the same map as the drawer.
    for (const s of RAIL_STEPS) expect(RAIL_FACTS[s.id].length).toBeGreaterThan(0);
    for (const s of WIRE_STEPS) expect(WIRE_FACTS[s.id].length).toBeGreaterThan(0);
  });
});

describe('the workshop’s new notes', () => {
  it('sets each new sentence with its source: RMG, Bristol City Council, BT Archives and the Science Museum Group', () => {
    expect(NOTES.plymouth.text).toContain('about 16½ minutes behind');
    expect(NOTES.plymouth.sources[0].href).toBe('https://www.rmg.co.uk/stories/time/time-greenwich-mean-time-confusing-case-travellers-watch');
    expect(NOTES.travellersWatch.text).toMatch(/^In 1847 the clockmaker Benjamin Lewis Vulliamy made a gold watch with two minute hands/);
    expect(NOTES.bristolClock.text).toContain('first installed in 1822');
    expect(NOTES.bristolClock.text).toContain('a red minute hand shows Greenwich Mean Time, and a black one the original Bristol time');
    expect(NOTES.bristolClock.sources[0].href).toMatch(/^https:\/\/web\.archive\.org\/web\/\d+\/https:\/\/www\.bristol\.gov\.uk\/st-nicholas-markets\/about\/history$/);
    expect(NOTES.telegramPrice.text).toContain('from 20 words for a shilling to 12 words for sixpence');
    for (const n of [NOTES.telegramPrice, NOTES.telegramForm]) expect(n.sources[0].href).toMatch(/^https:\/\/www\.bt\.com\/bt-plc\/assets\/documents\/about-bt\/our-history\/bt-archives\//);
    expect(NOTES.morseBritain.text).toContain('needle telegraphs in Britain were standardised on Morse code');
    expect(NOTES.morseBritain.sources[0].href).toMatch(/^https:\/\/collection\.sciencemuseumgroup\.org\.uk\/objects\/co8054889/);
    // The halfpenny a word over twelve is the room's own rule, and says so; the code is said to be International Morse.
    expect(TELEGRAM.rule).toMatch(/^Game rule:/);
    expect(TELEGRAM.morseNote).toBe('In International Morse code');
  });
});

describe('railway time: the map', () => {
  it('puts the towns on a map west of London, Plymouth among them, each further west further behind', () => {
    expect(STATIONS.map((s) => [s.name, s.behind])).toEqual([
      ['London', 0],
      ['Reading', 4],
      ['Steventon', 5.5],
      ['Chippenham', 8],
      ['Bath', 11],
      ['Bristol', 11],
      ['Bridgewater', 14],
    ]);
    expect(PLYMOUTH.behind).toBe(16.5);
    const xs = MAP_TOWNS.map((t) => project(t.lon, t.lat).x);
    // London furthest east, Plymouth furthest west, and all on the drawing.
    expect(Math.max(...xs)).toBe(xs[0]);
    expect(Math.min(...xs)).toBe(xs[xs.length - 1]);
    for (const t of MAP_TOWNS) {
      const p = project(t.lon, t.lat);
      expect(p.x).toBeGreaterThan(0);
      expect(p.x).toBeLessThan(MAP.w);
      expect(p.y).toBeGreaterThan(0);
      expect(p.y).toBeLessThan(MAP.h);
    }
  });

  it('moves the Sun west as London’s time goes on: over each town when its own clock says noon', () => {
    for (const t of MAP_TOWNS.filter((x) => x.name !== 'Bath' && x.name !== 'Bristol')) expect(sunX(720 + t.behind, MAP_TOWNS)).toBeCloseTo(project(t.lon, t.lat).x, 0);
    // Bath and Bristol share their minutes, so the Sun stands between them.
    const bath = project(-2.36, 51.38).x;
    const bristol = project(-2.59, 51.45).x;
    expect(sunX(731, MAP_TOWNS)).toBeCloseTo((bath + bristol) / 2, 0);
    let last = Infinity;
    for (let t = 720; t <= 737; t += 0.5) {
      const x = sunX(t, MAP_TOWNS);
      expect(x).toBeLessThanOrEqual(last);
      last = x;
    }
    expect(sunTimeAt(sunX(728, MAP_TOWNS), MAP_TOWNS, 720, 737)).toBe(728);
  });

  it('step 1: the Sun’s slider brings noon to each town in turn, glowing on the map', () => {
    at();
    render(<VictorianInventions />);
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: RAIL_STEPS[0].title })).toBeInTheDocument();
    const map = screen.getByRole('img', { name: /A map of the south of England and Wales/ });
    expect(map).toHaveAccessibleName(expect.stringContaining('Plymouth 11:43½'));
    const slider = screen.getByRole('slider', { name: 'Move the Sun west' });
    fireEvent.change(slider, { target: { value: '731' } });
    expect(screen.getByRole('status')).toHaveTextContent('Noon in Bath and Bristol. In London it is 12:11.');
    const noon = [...map.querySelectorAll('.vbi-mini[data-noon]')].map((g) => g.querySelector('.vbi-mini-name')!.textContent);
    expect(noon).toEqual(['Bath', 'Bristol']);
    // Reading's noon has been and gone; Plymouth's has not come.
    expect(map.querySelectorAll('.vbi-mini[data-reached]')).toHaveLength(6);
    expect(screen.queryByRole('button', { name: /^Step 1: .*\(done\)/ })).toBeNull();
    fireEvent.change(slider, { target: { value: '737' } });
    expect(screen.getByRole('button', { name: /^Step 1: .*\(done\)/ })).toBeInTheDocument();
  });

  it('plays the Sun across by itself, a half minute at a time', () => {
    jest.useFakeTimers();
    at();
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Play the Sun' }));
    act(() => {
      jest.advanceTimersByTime(260 * 40);
    });
    expect(screen.getByRole('slider', { name: 'Move the Sun west' })).toHaveValue('737');
    expect(screen.getByRole('button', { name: 'Again' })).toBeInTheDocument();
  });

  it('crops the map to the towns on a phone, so their clocks read larger', () => {
    media((q) => q.includes('max-width: 760px'));
    at();
    render(<VictorianInventions />);
    expect(screen.getByRole('img', { name: /A map of the south/ })).toHaveAttribute('viewBox', '60 40 900 520');
  });
});

describe('railway time: the traveller, the train and the clocks', () => {
  beforeEach(() => at());

  it('step 2: steams west, your watch (London time) against each town clock, by the timetable’s minutes', () => {
    render(<VictorianInventions />);
    railStep('journey');
    const map = screen.getByRole('img', { name: /A map of the railway west from London/ });
    const train = map.querySelector('.vbi-train') as SVGGElement;
    const before = train.style.transform;
    fireEvent.click(screen.getByRole('button', { name: /Steam to the next station/ }));
    expect(train.style.transform).not.toBe(before);
    expect(map).toHaveAccessibleName(expect.stringContaining('The train is at Reading. Your watch says 10:40; Reading’s clock says 10:36.'));
    expect(screen.getByText('Reading’s clock is 4 minutes behind.')).toBeInTheDocument();
    for (let i = 0; i < 5; i++) fireEvent.click(screen.getByRole('button', { name: /Steam to the next station/ }));
    expect(screen.getByText('Bridgewater’s clock is 14 minutes behind.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Steam to the next station/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /^Step 2: .*\(done\)/ })).toBeInTheDocument();
    const facts = openFacts();
    expect(within(facts).getByText(NOTES.travellersWatch.text)).toBeInTheDocument();
    expect(within(facts).getByText(NOTES.railwayTime.text)).toBeInTheDocument();
  });

  it('step 3: works out from the timetable’s minutes whether you catch the train; the answer is a big tick or the train gone', () => {
    const verdicts = TRAIN_PUZZLES.map((p) => catchTrain(p, STATIONS.find((s) => s.name === p.town)!.behind));
    // Some caught and some missed, each by a few minutes.
    expect(verdicts.map((v) => v.caught)).toEqual([false, true, false, true]);
    expect(verdicts.map((v) => v.spare)).toEqual([-3, 6, -4, 4]);
    render(<VictorianInventions />);
    railStep('catch');
    expect(screen.getByRole('img', { name: /London time is a time to work out/ })).toBeInTheDocument();
    const yes = screen.getByRole('button', { name: 'Yes, I’ll catch it' });
    fireEvent.click(yes);
    expect(yes).toHaveAttribute('data-verdict', 'wrong');
    const feedback = document.querySelector('.vbi-puzzle .vbi-feedback')!;
    expect(feedback).toHaveTextContent('Not quite: try again.');
    expect(feedback).toHaveAttribute('data-verdict', 'wrong');
    fireEvent.click(screen.getByRole('button', { name: 'No, it’s gone' }));
    expect(screen.getByRole('button', { name: 'No, it’s gone' })).toHaveAttribute('data-verdict', 'right');
    expect(document.querySelector('.vbi-why')).toHaveTextContent('it is already 12:03 in London. The train left 3 minutes ago!');
    const scene = screen.getByRole('img', { name: /Bath station/ });
    expect(scene).toHaveAccessibleName(expect.stringContaining('London time is 12:03: the train has gone.'));
    expect(scene.querySelector('.vbi-stamp')).toHaveTextContent('Missed it!');
    expect(scene.querySelector('.vbi-catch-train')).toHaveAttribute('data-gone', 'true');
    fireEvent.click(screen.getByRole('button', { name: /Another train/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Yes, I’ll catch it' }));
    const reading = screen.getByRole('img', { name: /Reading station/ });
    expect(reading.querySelector('.vbi-stamp')).toHaveTextContent('You catch it!');
    expect(reading.querySelector('.vbi-catch-train')).not.toHaveAttribute('data-gone');
    expect(document.querySelector('.vbi-why')).toHaveTextContent('6 minutes to spare');
    expect(openFacts()).toHaveTextContent(NOTES.missTrain.text);
  });

  it('step 4: the stationmaster turns each town clock to London time, by its minute hand, keys or buttons', () => {
    expect(dragMinute(709, 0)).toBe(720);
    expect(dragMinute(709, 354)).toBe(719);
    expect(dragMinute(715, 180)).toBe(690);
    // Past twelve the hour carries on.
    expect(dragMinute(718, 12)).toBe(722);
    render(<VictorianInventions />);
    railStep('set');
    const clock = screen.getByRole('slider', { name: /Bath’s clock: drag the minute hand/ });
    expect(clock).toHaveAttribute('aria-valuetext', '11:49');
    for (let i = 0; i < 11; i++) fireEvent.keyDown(clock, { key: 'ArrowUp' });
    expect(clock).toHaveAttribute('aria-valuetext', '12:00');
    expect(screen.getByText('Bath keeps railway time!')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Bath’s clock keeps railway time');
    expect(screen.getByRole('button', { name: 'Bath (set)' })).toBeInTheDocument();
    // Pressed quickly, each press counts; Steventon's last half minute clicks into place.
    fireEvent.click(screen.getByRole('button', { name: 'Steventon' }));
    const forward = screen.getByRole('button', { name: 'Forward one minute' });
    act(() => {
      for (let i = 0; i < 5; i++) forward.click();
    });
    expect(screen.getByText('Steventon keeps railway time!')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reading' }));
    expect(screen.getByText('2 of 6 clocks set.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Send the time by telegraph' }));
    expect(screen.getByText('Every clock on the line now says 12:00.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Step 4: .*\(done\)/ })).toBeInTheDocument();
    const facts = openFacts();
    expect(within(facts).getByText(NOTES.clearingHouse.text)).toBeInTheDocument();
    expect(within(facts).getByText(NOTES.timeSignals.text)).toBeInTheDocument();
  });

  it('step 5: Bristol’s clock with two minute hands, red for London and black for Bristol', () => {
    expect(BRISTOL_CLOCK.behind).toBe(STATIONS.find((s) => s.name === 'Bristol')!.behind);
    render(<VictorianInventions />);
    railStep('bristol');
    const clock = screen.getByRole('img', { name: /Bristol’s Exchange clock, with one hour hand and two minute hands: a red one at 12:10 and a black one at 11:59/ });
    expect(clock.querySelectorAll('.vbi-bhand')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'The black hand' }));
    expect(screen.getByRole('button', { name: 'The black hand' })).toHaveAttribute('data-verdict', 'wrong');
    fireEvent.click(screen.getByRole('button', { name: 'The red hand' }));
    expect(screen.getByText('Right! Red is London. Black is Bristol.')).toBeInTheDocument();
    expect(clock).toHaveAccessibleName(expect.stringContaining('The red hand shows London time'));
    const facts = openFacts();
    expect(within(facts).getByText(NOTES.bristolClock.text)).toBeInTheDocument();
    // Its source is in the workshop's Sources drawer, under the step.
    expect(within(facts).queryByRole('link')).toBeNull();
    const group = sourcesFor('The railway, step 5');
    expect(within(group).getByRole('link', { name: /Bristol City Council/ })).toHaveAttribute('href', NOTES.bristolClock.sources[0].href);
    closeSources();
    expect(within(facts).getByText(NOTES.legalTime.text)).toBeInTheDocument();
  });

  it('keeps every note behind "Did you know?", closed until opened, and closes it again on Escape and on a new step', () => {
    render(<VictorianInventions />);
    for (const id of RAIL_STEPS.map((s) => s.id)) {
      railStep(id);
      const card = document.querySelector('.vbi-panel:not([hidden]) .vbr-card')!;
      const notes = [...card.querySelectorAll('[data-fact]')];
      expect(notes.length).toBeGreaterThan(0);
      for (const n of notes) expect(n.closest('.vbi-dyk-panel')).not.toBeNull();
    }
    expect(screen.queryByRole('region', { name: 'Did you know?' })).toBeNull();
    const panel = openFacts();
    expect(screen.getByRole('button', { name: /Did you know\?/ })).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(panel, { key: 'Escape' });
    expect(screen.queryByRole('region', { name: 'Did you know?' })).toBeNull();
    openFacts();
    railStep('sun');
    expect(screen.queryByRole('region', { name: 'Did you know?' })).toBeNull();
  });
});

describe('the telegraph: how it works and the needle dial', () => {
  beforeEach(() => at('#telegraph'));

  it('sets the five-needle dial’s 20 letters where their two needles cross', () => {
    expect(DIAL).toHaveLength(20);
    expect(DIAL_LETTERS.split('').sort().join('')).toBe('ABDEFGHIKLMNOPRSTVWY');
    expect(DIAL_ROWS.map((r) => r.length)).toEqual([1, 2, 3, 4, 4, 3, 2, 1]);
    for (const l of DIAL) {
      const a = needleAngles(l.letter);
      expect(a.filter((x) => x !== 0)).toHaveLength(2);
      for (const n of [l.i, l.j]) {
        const rad = (a[n - 1] * Math.PI) / 180;
        expect(Math.abs((l.x - n) * -Math.cos(rad) - l.y * Math.sin(rad))).toBeLessThan(1e-9);
      }
    }
    for (const c of 'CJQUXZ') expect(onDial(c)).toBe(false);
    expect(spell('Mince pie!')).toEqual({ letters: ['M', 'I', 'N', 'E', 'P', 'I', 'E'], skipped: ['C'] });
    for (const w of [...READ_WORDS, ...SEND_WORDS]) expect(spell(w).skipped).toEqual([]);
    expect(clockTime(720 - 5.5)).toBe('11:54½');
    expect(hands(720).minute).toBeGreaterThan(hands(709).minute);
  });

  it('opens on how it works, the key setting the current running by pointer and by keyboard', () => {
    expect(WIRE_STEPS.map((s) => s.id)).toEqual(['battery', 'wire', 'coil', 'needle', 'morse']);
    render(<VictorianInventions />);
    expect(screen.getByRole('button', { name: 'How it works' })).toHaveAttribute('aria-pressed', 'true');
    const circuit = screen.getByRole('img', { name: /A telegraph circuit/ });
    const key = screen.getByRole('button', { name: 'Press the key' });
    fireEvent.pointerDown(key);
    expect(circuit).toHaveAttribute('data-live', 'true');
    fireEvent.pointerUp(key);
    fireEvent.keyDown(key, { key: ' ' });
    expect(circuit).toHaveAttribute('data-live', 'true');
    fireEvent.keyUp(key, { key: ' ' });
    expect(circuit).not.toHaveAttribute('data-live');
    for (const [id, note] of [['wire', NOTES.wire], ['coil', NOTES.oersted], ['needle', NOTES.needles], ['morse', NOTES.morse]] as const) {
      fireEvent.click(screen.getByRole('button', { name: /^Next/ }));
      expect(circuit).toHaveAttribute('data-step', id);
      expect(openFacts()).toHaveTextContent(note.text);
      fireEvent.click(screen.getByRole('button', { name: /Close/ }));
    }
    fireEvent.click(screen.getByRole('button', { name: /Now try the five-needle telegraph/ }));
    expect(screen.getByRole('button', { name: 'Needle dial' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('taps Morse on the key in step 5: a quick tap a dot, a long press a dash, a pause the letter', () => {
    jest.useFakeTimers();
    render(<VictorianInventions />);
    goStep(5);
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
    act(() => {
      jest.advanceTimersByTime(1200);
    });
    expect(screen.getByRole('status')).toHaveTextContent('.- is A.');
  });

  it('sends a word on the needles, saying which letters the dial has not got', () => {
    jest.useFakeTimers();
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Needle dial' }));
    fireEvent.click(screen.getByRole('button', { name: 'H' }));
    expect(screen.getByRole('status')).toHaveTextContent('H: needles 1 and 2, above.');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your word' }), { target: { value: 'Coal' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send it' }));
    expect(screen.getByText('C is not on the dial, so it is left out.')).toBeInTheDocument();
    for (let i = 0; i < 3; i++)
      act(() => {
        jest.advanceTimersByTime(1400);
      });
    expect(screen.getByRole('status')).toHaveTextContent('Sent.');
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.queryByText(/not on the dial, so/)).toBeNull();
    const words = screen.getByRole('group', { name: 'Words the dial can spell' });
    fireEvent.click(within(words).getByRole('button', { name: SEND_WORDS[0] }));
    expect(within(words).getByRole('button', { name: SEND_WORDS[1] })).toBeDisabled();
  });

  it('reads the needles: right green with stars, wrong red, and the word’s letters held in fixed slots that never move', () => {
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Needle dial' }));
    fireEvent.click(screen.getByRole('button', { name: 'Read the needles' }));
    const word = READ_WORDS[0];
    const slots = [...document.querySelectorAll('.vbi-word-letter')];
    expect(slots).toHaveLength(word.length);
    // Every slot holds its dot and its letter's place from the start; finding a letter changes only which shows.
    for (const s of slots) expect(s.querySelectorAll('.vbi-word-dot, .vbi-word-char')).toHaveLength(2);
    const wrong = word[0] === 'A' ? 'B' : 'A';
    fireEvent.click(screen.getByRole('button', { name: wrong }));
    expect(screen.getByRole('button', { name: wrong })).toHaveAttribute('data-verdict', 'wrong');
    fireEvent.click(screen.getByRole('button', { name: word[0] }));
    expect(screen.getByRole('button', { name: word[0] })).toHaveAttribute('data-verdict', 'right');
    expect(screen.getByText(`Right! ${word[0]}.`).closest('[data-verdict]')).toHaveAttribute('data-verdict', 'right');
    expect(document.querySelector('.vbr-celebrate')).not.toBeNull();
    for (const c of word.slice(1)) fireEvent.click(screen.getByRole('button', { name: c }));
    expect(screen.getByText(`Well read! The word is ${word}.`)).toBeInTheDocument();
    // The same slots, in the same order, now each showing its letter.
    expect([...document.querySelectorAll('.vbi-word-letter')]).toEqual(slots);
    expect(slots.map((s) => s.querySelector('.vbi-word-char')!.textContent).join('')).toBe(word);
    expect(screen.getByRole('list', { name: `The word so far: ${word}` })).toBeInTheDocument();
  });

  it('pops a right letter about its own centre: the letter is placed by `translate`, and the pop animates `scale` alone', () => {
    const rule = css.match(/\.vb-room \.vbi-letter \{([^}]*)\}/)![1];
    expect(rule).toMatch(/translate: -50% -50%;/);
    expect(rule).not.toMatch(/(^|\s)transform:/);
    expect(rule).not.toMatch(/transition:[^;]*\btransform\b/);
    const pop = css.match(/@keyframes vbi-letter-pop \{([^\n]*)\}/)![1];
    expect(pop).toMatch(/scale/);
    expect(pop).not.toMatch(/transform|translate/);
    expect(css).toMatch(/\.vb-room \.vbi-letter\[data-verdict='right'\] \{[^}]*animation: vbi-letter-pop/);
    // The word's slots: ten fixed columns in a monospace face.
    expect(css).toMatch(/\.vbi-word \{[^}]*grid-template-columns: repeat\(10, minmax\(0, 1fr\)\)/);
    expect(css).toMatch(/\.vbi-word-letter \{[^}]*monospace/);
  });
});

describe('telegrams in International Morse code', () => {
  beforeEach(() => at('#telegraph'));

  it('counts a telegram’s words and its price: twelve for sixpence, and (the game rule) a halfpenny a word more', () => {
    expect(telegramWords('Arriving Bath, 4 o’clock!  ')).toEqual(['ARRIVING', 'BATH', 'OCLOCK']);
    expect(telegramCost(0)).toBe(0);
    expect(oldMoney(telegramCost(5))).toBe('6d');
    expect(oldMoney(telegramCost(12))).toBe('6d');
    expect(oldMoney(telegramCost(13))).toBe('6½d');
    expect(oldMoney(telegramCost(20))).toBe('10d');
    expect(oldMoney(24)).toBe('1s');
    expect(oldMoney(25)).toBe('1s ½d');
    expect(toMorse('so s', MORSE).map((c) => c.code)).toEqual(['...', '---', '', '...']);
    // International timing: a dot one unit, a dash three, three between letters, seven between words.
    const tl = morseTimeline('E T', MORSE, 1);
    expect(tl.map((p) => [p.on, p.ms])).toEqual([
      [true, 1],
      [false, 3],
      [false, 4],
      [true, 3],
      [false, 3],
    ]);
    for (const m of INCOMING) for (const c of m.replace(/ /g, '')) expect(MORSE[c]).toBeTruthy();
  });

  it('writes a telegram, says it is International Morse, and prices it as it grows', () => {
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Send a telegram' }));
    expect(document.querySelector('.vbi-tg-head')).toHaveTextContent('Telegram' + TELEGRAM.morseNote);
    expect(screen.getByText(TELEGRAM.rule)).toBeInTheDocument();
    const box = screen.getByRole('textbox', { name: 'Your telegram' });
    fireEvent.change(box, { target: { value: 'arriving bath at noon, send more tea!' } });
    expect(box).toHaveValue('ARRIVING BATH AT NOON SEND MORE TEA');
    expect(document.querySelector('.vbi-tg-meta')).toHaveTextContent('7 words · 6d');
    fireEvent.change(box, { target: { value: 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen' } });
    expect(document.querySelector('.vbi-tg-meta')).toHaveTextContent('14 words · 7d');
    // No more than twenty words.
    fireEvent.change(box, { target: { value: 'a '.repeat(30) } });
    expect((box as HTMLTextAreaElement).value.trim().split(/\s+/)).toHaveLength(TELEGRAM.maxWords);
    const facts = openFacts();
    expect(within(facts).getByText(NOTES.telegramPrice.text)).toBeInTheDocument();
    expect(within(facts).queryByRole('link')).toBeNull();
    // The two notes share one BT Archives source: the drawer lists it once.
    expect(within(sourcesFor('The telegraph: send a telegram')).getAllByRole('link', { name: /BT Archives/ })).toHaveLength(1);
    closeSources();
  });

  it('taps it out letter by letter, the chart lighting each letter’s code; a wrong tap starts that letter again', () => {
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Send a telegram' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your telegram' }), { target: { value: 'tea' } });
    goStep(2);
    const lit = () => document.querySelector('.vbi-chart-cell[data-lit]')?.textContent?.[0];
    expect(lit()).toBe('T');
    expect(screen.getByText(/Letter 1 of 3:/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Dot' }));
    expect(screen.getByRole('status')).toHaveTextContent('Not quite: T is dash. Try T again.');
    expect(document.querySelector('.vbi-tg-cell[data-current]')).toHaveAttribute('data-miss', '1');
    fireEvent.click(screen.getByRole('button', { name: 'Dash' }));
    expect(lit()).toBe('E');
    expect(document.querySelectorAll('.vbi-tg-cell[data-done]')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Dot' }));
    fireEvent.click(screen.getByRole('button', { name: 'Dot' }));
    fireEvent.click(screen.getByRole('button', { name: 'Dash' }));
    expect(screen.getByRole('status')).toHaveTextContent('The whole telegram is sent!');
    expect(screen.getByRole('button', { name: /^Step 2: .*\(done\)/ })).toBeInTheDocument();
    expect(openFacts()).toHaveTextContent(NOTES.morseBritain.text);
  });

  it('taps by the key too, quick for a dot and held for a dash, and the clerk can send the rest', () => {
    jest.useFakeTimers();
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Send a telegram' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your telegram' }), { target: { value: 'at home' } });
    goStep(2);
    const key = screen.getByRole('button', { name: /The key/ });
    fireEvent.keyDown(key, { key: ' ' });
    act(() => {
      jest.advanceTimersByTime(80);
    });
    fireEvent.keyUp(key, { key: ' ' });
    fireEvent.pointerDown(key);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.pointerUp(key);
    expect(screen.getByRole('status')).toHaveTextContent('A, sent. Next: T, dash.');
    fireEvent.click(screen.getByRole('button', { name: 'Let the clerk send the rest' }));
    for (let i = 0; i < 40; i++)
      act(() => {
        jest.advanceTimersByTime(500);
      });
    expect(screen.getByRole('status')).toHaveTextContent('The clerk has sent your whole telegram.');
    expect(document.querySelectorAll('.vbi-tg-cell[data-done]')).toHaveLength(6);
  });

  it('keeps the sound off until it is turned on', () => {
    const made = jest.fn();
    const osc = { frequency: { value: 0 }, connect: jest.fn(), start: jest.fn(), stop: jest.fn() };
    const was = (window as unknown as { AudioContext?: unknown }).AudioContext;
    (window as unknown as { AudioContext: unknown }).AudioContext = jest.fn(() => {
      made();
      return { createGain: () => ({ gain: { value: 0 }, connect: jest.fn() }), createOscillator: () => osc, destination: {} };
    });
    try {
      render(<VictorianInventions />);
      fireEvent.click(screen.getByRole('button', { name: 'Send a telegram' }));
      fireEvent.change(screen.getByRole('textbox', { name: 'Your telegram' }), { target: { value: 'tea' } });
      goStep(2);
      const key = screen.getByRole('button', { name: /The key/ });
      expect(screen.getByRole('button', { name: /Sound off/ })).toHaveAttribute('aria-pressed', 'false');
      fireEvent.pointerDown(key);
      fireEvent.pointerUp(key);
      expect(made).not.toHaveBeenCalled();
      fireEvent.click(screen.getByRole('button', { name: /Sound off/ }));
      fireEvent.pointerDown(key);
      expect(made).toHaveBeenCalledTimes(1);
      expect(osc.start).toHaveBeenCalled();
      fireEvent.pointerUp(key);
      expect(osc.stop).toHaveBeenCalled();
    } finally {
      (window as unknown as { AudioContext?: unknown }).AudioContext = was;
    }
  });

  it('prints the telegram form: to, from, the message with its Morse under every letter, and the price', async () => {
    const print = jest.fn();
    window.print = print;
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Send a telegram' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your telegram' }), { target: { value: 'tea at four' } });
    goStep(3);
    fireEvent.change(screen.getByRole('textbox', { name: 'To' }), { target: { value: 'Grandma' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'From' }), { target: { value: 'Ada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Print my telegram' }));
    const sheet = document.querySelector('body > .vbr-print-root') as HTMLElement;
    expect(sheet).not.toBeNull();
    expect(sheet).toHaveTextContent('Telegram');
    expect(sheet).toHaveTextContent('Grandma');
    expect(sheet).toHaveTextContent('Ada');
    expect(sheet).toHaveTextContent('3 · 6d');
    expect([...sheet.querySelectorAll('.vbi-tg-sheet-word')].map((w) => w.textContent!.replace(/[^A-Z]/g, ''))).toEqual(['TEA', 'AT', 'FOUR']);
    // T is one dash; E one dot; under every letter its marks.
    const cells = [...sheet.querySelectorAll('.vbi-tg-sheet-cell')];
    expect(cells).toHaveLength(9);
    expect(cells[0].querySelectorAll('.vbi-m-dash')).toHaveLength(1);
    expect(cells[1].querySelectorAll('.vbi-m-dot')).toHaveLength(1);
    expect(sheet).toHaveTextContent('In International Morse code.');
    // And the chart, A to Z, for whoever it is sent to.
    expect(sheet.querySelectorAll('.vbi-tg-sheet-chart li')).toHaveLength(26);
    await waitFor(() => expect(print).toHaveBeenCalled(), { timeout: 4000 });
    act(() => {
      window.dispatchEvent(new Event('afterprint'));
    });
    expect(document.querySelector('body > .vbr-print-root')).toBeNull();
  });

  it('receives a telegram: the lamp flashes it, the tape shows it, and you decode it from the chart, wrong red and right green', () => {
    jest.useFakeTimers();
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Receive a telegram' }));
    const message = INCOMING[0];
    const chart = screen.getByRole('group', { name: 'International Morse code chart' });
    expect(within(chart).getByRole('button', { name: /^T: dash$/ })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Play the telegram' }));
    const lamp = document.querySelector('.vbi-tg-lamp-big')!;
    expect(lamp).toHaveAttribute('data-on', 'true');
    act(() => {
      jest.advanceTimersByTime(morseTimeline(message, MORSE, 130).reduce((s, p) => s + p.ms, 0) + 100);
    });
    expect(lamp).not.toHaveAttribute('data-on');
    expect(screen.getByRole('status')).toHaveTextContent('The telegram is in. Decode it from the chart.');
    expect(document.querySelectorAll('.vbi-tg-decode .vbi-tg-code[data-shown]')).toHaveLength(message.replace(/ /g, '').length);
    fireEvent.click(within(chart).getByRole('button', { name: /^E: dot$/ }));
    expect(document.querySelector('.vbi-tg-decode [data-current]')).toHaveAttribute('data-miss', '1');
    expect(screen.getByText('Not that one: look again.').closest('[data-verdict]')).toHaveAttribute('data-verdict', 'wrong');
    for (const c of message.replace(/ /g, '')) fireEvent.click(within(chart).getByRole('button', { name: new RegExp(`^${c}: `) }));
    expect(screen.getByText(`Well decoded! “${message}”`).closest('[data-verdict]')).toHaveAttribute('data-verdict', 'right');
    expect(document.querySelectorAll('.vbi-tg-decode .vbi-tg-cell[data-done]')).toHaveLength(message.replace(/ /g, '').length);
  });

  it('under reduced motion, brings the incoming telegram up on the tape at once, the lamp still', () => {
    jest.useFakeTimers();
    media((q) => q.includes('prefers-reduced-motion'));
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Receive a telegram' }));
    fireEvent.click(screen.getByRole('button', { name: 'Play the telegram' }));
    expect(document.querySelector('.vbi-tg-lamp-big')).not.toHaveAttribute('data-on');
    expect(document.querySelectorAll('.vbi-tg-decode .vbi-tg-code[data-shown]')).toHaveLength(INCOMING[0].replace(/ /g, '').length);
  });
});

describe('photography, in four parts', () => {
  beforeEach(() => at('#photography'));

  it('uses real Victorian photographs, open access, each credited and linked, and in the public folder', () => {
    for (const p of Object.values(PHOTOS)) {
      expect(p.href).toMatch(/^https:\/\/www\.metmuseum\.org\/art\/collection\/search\/\d+$/);
      expect(fs.existsSync(path.join(process.cwd(), 'public', p.src))).toBe(true);
    }
    expect(fs.existsSync(path.join(process.cwd(), 'public', POSITIVE.src))).toBe(true);
  });

  it('makes Talbot’s negative and prints from it, as many prints as you like, its notes and credit behind "Did you know?"', () => {
    jest.useFakeTimers();
    render(<VictorianInventions />);
    expect(screen.getByRole('button', { name: 'Print from it' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Uncover the lens' }));
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByRole('img', { name: /Talbot’s negative/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Print from it' }));
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Print another' }));
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    expect(screen.getByText('2 prints from the one negative.')).toBeInTheDocument();
    const facts = openFacts();
    for (const n of [NOTES.negative, NOTES.calotype, NOTES.sunPrint, NOTES.positives]) expect(within(facts).getByText(n.text)).toBeInTheDocument();
    // The photograph's credit (and the room's print made from it) is in the Sources drawer, not under the notes.
    expect(within(facts).queryByText(/Made for this room from Talbot’s negative/)).toBeNull();
    const group = sourcesFor('Photography: Negative to print');
    expect(within(group).getByRole('link', { name: /Made for this room from Talbot’s negative/ })).toHaveAttribute('href', PHOTOS.negative.href);
    expect(within(group).getByText(/The Metropolitan Museum of Art, public domain/)).toBeInTheDocument();
    closeSources();
  });

  it('under reduced motion, makes each sheet at once', () => {
    jest.useFakeTimers();
    media((q) => q.includes('prefers-reduced-motion'));
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Uncover the lens' }));
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByRole('button', { name: 'Print from it' })).toBeEnabled();
  });

  it('sits for a daguerreotype: hold still and it comes out sharp; let go and it blurs', () => {
    expect(blurFor(2000, true)).toBe(blurFor(2000, false) / 2);
    expect(verdictFor(0).tone).toBe('right');
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
    expect(openFacts()).toHaveTextContent(NOTES.prunes.text);
  });

  it('matches daguerreotype, calotype and wet collodion to real photographs, the right one’s note shown at once', () => {
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: '3. Three ways' }));
    const wrong = screen.getByRole('button', { name: new RegExp(PHOTOS[PROCESS_CLUES[1].photo].title) });
    fireEvent.click(wrong);
    expect(wrong).toHaveAttribute('data-verdict', 'wrong');
    for (const c of PROCESS_CLUES) {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(PHOTOS[c.photo].title) }));
      expect(screen.getByText(NOTES[c.note].text)).toBeVisible();
      if (c !== PROCESS_CLUES[PROCESS_CLUES.length - 1]) fireEvent.click(screen.getByRole('button', { name: /Next clue/ }));
    }
    expect(screen.getByText(/^All three matched:/)).toBeInTheDocument();
    expect(openFacts()).toHaveTextContent(NOTES.cameron.text);
  });

  it('prints a sheet of the photographs and what you made, with their credits, once its pictures are in', async () => {
    const print = jest.fn();
    window.print = print;
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: '4. Print a sheet' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'Ada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Print my sheet' }));
    const sheet = document.querySelector('body > .vbr-print-root') as HTMLElement;
    expect(sheet).toHaveTextContent('By Ada');
    for (const p of Object.values(PHOTOS)) expect(sheet).toHaveTextContent(p.maker);
    await waitFor(() => expect(print).toHaveBeenCalled(), { timeout: 4000 });
    act(() => {
      window.dispatchEvent(new Event('afterprint'));
    });
    expect(document.querySelector('body > .vbr-print-root')).toBeNull();
  });
});

describe('one screen a step', () => {
  it('keeps each bench’s card to its step: its foot pinned, the notes over it, the task line left off a phone', () => {
    expect(css).toMatch(/\.vbi-foot \{ margin-top: auto; \}/);
    expect(css).toMatch(/\.vbi-dyk-panel \{[^}]*position: absolute;[^}]*overflow-y: auto;/);
    expect(css).toMatch(/@media \(max-width: 760px\) \{[\s\S]*\.vbi-task \{ display: none; \}/);
    // Under reduced motion, nothing slides, spins or flashes.
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.vbi-sun[\s\S]*\.vbi-catch-train[\s\S]*\.vbi-tg-lamp/);
  });

  it('credits no illustration as made with Leonardo', () => {
    for (const f of fs.readdirSync(DIR)) expect(fs.readFileSync(path.join(DIR, f), 'utf8')).not.toMatch(/illustrations? made with Leonardo/i);
  });
});
