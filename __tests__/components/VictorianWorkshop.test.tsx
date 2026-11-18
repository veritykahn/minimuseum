import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import VictorianInventions from '@/app/exhibitions/victorian/inventions/page';
import { BRISTOL_CLOCK, BRISTOL_TRAIN, INCOMING, MAP_TOWNS, MORSE, NOTES, PHOTOS, PLYMOUTH, POSITIVE, PROCESS_CLUES, RAIL_STEPS, READ_WORDS, SEND_WORDS, STATION_JOB, STATIONS, TELEGRAM, TRAIN_PUZZLES, WIRE_STEPS, blurFor, verdictFor } from '@/app/exhibitions/victorian/inventions/inventionsText';
import { INVENTIONS_SOURCES, RAIL_FACTS, WIRE_FACTS } from '@/app/exhibitions/victorian/inventions/sources';
import { londonTimeUnderSun, noonBetween, trainAt, watchAt } from '@/app/exhibitions/victorian/inventions/Railway';
import { DIAL, DIAL_LETTERS, DIAL_ROWS, MAP, catchTrain, clockTime, dragMinute, hands, morseTimeline, needleAngles, oldMoney, onDial, project, spell, sunTimeAt, sunX, telegramCost, telegramWords, toMorse } from '@/app/exhibitions/victorian/inventions/workshop';

/*
 * The inventions workshop, rebuilt after the owner's "better but needs to
 * be improved" round: railway time in five one-screen steps, each laid out
 * its own way (noon moving west with the town times hidden until it comes,
 * a traveller's watch, counting on to catch a train on the platform, the
 * stationmaster's job of winding the clocks on, Bristol's clock with two
 * minute hands set by hand); telegrams to write, tap
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

  it('moves the Sun west as London’s time goes on: over each town when its own clock says noon, and back again smoothly', () => {
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
    // Dragged, the Sun gives London's time to the moment, not in jumps.
    for (const t of [720, 722.3, 728, 733.7, 736.5]) expect(londonTimeUnderSun(sunX(t, MAP_TOWNS))).toBeCloseTo(t, 1);
    expect(noonBetween(720, 731).map((t) => t.name)).toEqual(['Reading', 'Steventon', 'Chippenham', 'Bath', 'Bristol']);
    expect(noonBetween(731, 731.5)).toEqual([]);
  });

  it('step 1: hides each town’s time until noon reaches it, and writes the noon book as the Sun goes west', () => {
    at();
    render(<VictorianInventions />);
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: RAIL_STEPS[0].title })).toBeInTheDocument();
    const map = screen.getByRole('img', { name: /A map of the south of England and Wales/ });
    expect(map).toHaveAccessibleName(expect.stringContaining('Noon has reached only London so far.'));
    // Before the Sun moves, no town but London shows its time: the faces are covered, and no time is written on the map.
    expect(map.querySelectorAll('.vrw-mini:not([data-reached]) .vrw-mini-cover')).toHaveLength(7);
    expect(map).not.toHaveTextContent(/\d:\d\d/);
    const book = screen.getByRole('region', { name: 'The noon book' });
    expect(within(book).getAllByText('…')).toHaveLength(7);

    const slider = screen.getByRole('slider', { name: 'Move the Sun west' });
    fireEvent.change(slider, { target: { value: '731' } });
    expect(screen.getByRole('status')).toHaveTextContent('Noon in Reading, Steventon, Chippenham, Bath and Bristol. In London it is 12:11.');
    const noon = [...map.querySelectorAll('.vbi-town[data-noon]')].map((g) => g.querySelector('.vbi-mini-name')!.textContent);
    expect(noon).toEqual(['☀ Bath', '☀ Bristol']);
    expect(map.querySelectorAll('.vbi-town[data-reached]')).toHaveLength(6);
    expect(within(book).getByText('Bath').closest('li')).toHaveTextContent('Bath12:11+11 min');
    expect(within(book).getByText('Reading').closest('li')).toHaveTextContent('Reading12:04+4 min');
    expect(within(book).getByText('Plymouth').closest('li')).toHaveTextContent('Plymouth…');
    expect(screen.getByRole('img', { name: 'London’s clock says 12:11.' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Step 1: .*\(done\)/ })).toBeNull();
    fireEvent.change(slider, { target: { value: '737' } });
    expect(within(book).getByText('Plymouth').closest('li')).toHaveTextContent('Plymouth12:16½+16½ min');
    expect(within(book).getByText('The further west, the later the noon!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Step 1: .*\(done\)/ })).toBeInTheDocument();
  });

  it('plays the Sun across by itself, the clocks’ hands sweeping on smoothly rather than jumping', () => {
    jest.useFakeTimers();
    at();
    render(<VictorianInventions />);
    const london = screen.getByRole('img', { name: /London’s clock says/ });
    const minuteHand = () => [...london.querySelectorAll('line')].pop()!.getAttribute('transform');
    expect(minuteHand()).toBe(`rotate(${hands(720).minute})`);
    fireEvent.click(screen.getByRole('button', { name: 'Play the Sun' }));
    act(() => {
      jest.advanceTimersByTime(40);
    });
    // A twentieth of a minute on: the minute hand has crept 0.3°.
    expect(minuteHand()).toBe('rotate(4320.3)');
    act(() => {
      jest.advanceTimersByTime(40 * 400);
    });
    expect(screen.getByRole('slider', { name: 'Move the Sun west' })).toHaveValue('737');
    expect(screen.getByRole('button', { name: 'Again' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Step 1: .*\(done\)/ })).toBeInTheDocument();
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

  it('step 2: steams along the line, your watch (London time) ticking on, then side by side with each town’s clock', () => {
    expect(trainAt(0)).toEqual(project(STATIONS[0].lon, STATIONS[0].lat));
    expect(trainAt(6)).toEqual(project(STATIONS[6].lon, STATIONS[6].lat));
    expect(watchAt(0)).toBe(600);
    expect(watchAt(0.5)).toBe(620);
    jest.useFakeTimers();
    render(<VictorianInventions />);
    railStep('journey');
    expect(screen.getByText('In London they agree.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Steam on to Reading/ }));
    act(() => {
      jest.advanceTimersByTime(400);
    });
    // On the way: the watch ticks on, and the town's clock is not yet in view.
    expect(screen.getByRole('img', { name: /Your pocket watch, set in London, says 10:10/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Reading’s clock, coming into view.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Steam on to/ })).toBeDisabled();
    act(() => {
      jest.advanceTimersByTime(1600);
    });
    expect(screen.getByRole('img', { name: /A map of the railway west from London/ })).toHaveAccessibleName(expect.stringContaining('The train is at Reading.'));
    expect(screen.getByRole('img', { name: 'Your pocket watch, set in London, says 10:40.' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Reading’s own clock says 10:36.' })).toBeInTheDocument();
    expect(screen.getByText('Reading’s clock is 4 minutes behind.')).toBeInTheDocument();
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Steam on to/ }));
      act(() => {
        jest.advanceTimersByTime(1700);
      });
    }
    expect(screen.getByText('Bridgewater’s clock is 14 minutes behind.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back to London' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Step 2: .*\(done\)/ })).toBeInTheDocument();
    const facts = openFacts();
    expect(within(facts).getByText(NOTES.travellersWatch.text)).toBeInTheDocument();
    expect(within(facts).getByText(NOTES.railwayTime.text)).toBeInTheDocument();
  });

  it('step 3: counts on the town’s minutes to London time on the platform, then the train waits or goes', () => {
    const verdicts = TRAIN_PUZZLES.map((p) => catchTrain(p, STATIONS.find((s) => s.name === p.town)!.behind));
    // Some caught and some missed, each by a few minutes.
    expect(verdicts.map((v) => v.caught)).toEqual([false, true, false, true]);
    expect(verdicts.map((v) => v.spare)).toEqual([-3, 6, -4, 4]);
    render(<VictorianInventions />);
    railStep('catch');
    const scene = () => screen.getByRole('img', { name: /station\. The town clock says/ });
    expect(scene()).toHaveAccessibleName(expect.stringContaining('London time is a time to work out.'));
    expect(scene().querySelector('.vrw-board-now')).toHaveTextContent('?');
    // Taught first: no answer to give until London time is counted on.
    expect(screen.queryByRole('button', { name: 'Yes, I’ll catch it' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '+ 5 minutes' }));
    fireEvent.click(screen.getByRole('button', { name: '+ 5 minutes' }));
    expect(screen.getByText('+10 of 11')).toBeInTheDocument();
    expect(scene().querySelector('.vrw-ghost')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '+ 5 minutes' }));
    expect(screen.getByRole('status')).toHaveTextContent('Too far! Bath is only 11 minutes behind: 1 minute left to count.');
    fireEvent.click(screen.getByRole('button', { name: '+ 1 minute' }));
    expect(scene().querySelector('.vrw-board-now')).toHaveTextContent('12:03');
    const yes = screen.getByRole('button', { name: 'Yes, I’ll catch it' });
    fireEvent.click(yes);
    expect(yes).toHaveAttribute('data-verdict', 'wrong');
    expect(screen.getByRole('status')).toHaveTextContent('Not quite. Compare 12:03 with 12:00.');
    fireEvent.click(screen.getByRole('button', { name: 'No, it’s gone' }));
    expect(document.querySelector('.vrw-why')).toHaveTextContent('it is already 12:03 in London. The train left 3 minutes ago!');
    expect(scene()).toHaveAccessibleName(expect.stringContaining('London time is 12:03: the train has gone.'));
    expect(scene().querySelector('.vbi-stamp')).toHaveTextContent('Missed it!');
    expect(scene().querySelector('.vrw-catch-train')).toHaveAttribute('data-gone', 'true');
    expect(screen.getByRole('button', { name: /^Step 3: .*\(done\)/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Another train/ }));
    for (let i = 0; i < 4; i++) fireEvent.click(screen.getByRole('button', { name: '+ 1 minute' }));
    fireEvent.click(screen.getByRole('button', { name: 'Yes, I’ll catch it' }));
    const reading = screen.getByRole('img', { name: /Reading station/ });
    expect(reading.querySelector('.vbi-stamp')).toHaveTextContent('You catch it!');
    expect(reading.querySelector('.vrw-catch-train')).not.toHaveAttribute('data-gone');
    expect(document.querySelector('.vrw-why')).toHaveTextContent('6 minutes to spare');
    expect(openFacts()).toHaveTextContent(NOTES.missTrain.text);
  });

  it('step 4: the stationmaster’s job is said first, then each station clock is wound on to the telegram’s London time', () => {
    media((q) => q.includes('prefers-reduced-motion'));
    render(<VictorianInventions />);
    railStep('set');
    for (const g of STATION_JOB.goal) expect(screen.getByText(g)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Reading' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Read the telegram/ }));
    expect(screen.getByRole('note', { name: 'Telegram from London' })).toHaveTextContent('LONDON TIME IS 12:10');
    // Each clock still shows its own town's time, by the timetable's minutes.
    expect(screen.getByRole('img', { name: 'Reading’s station clock says 12:06.' })).toBeInTheDocument();
    const more = () => fireEvent.click(screen.getByRole('button', { name: 'One minute more' }));
    const fewer = () => fireEvent.click(screen.getByRole('button', { name: 'One minute fewer' }));
    expect(screen.getByRole('button', { name: /Wind it on/ })).toBeDisabled();
    for (let i = 0; i < 3; i++) more();
    fireEvent.click(screen.getByRole('button', { name: /Wind it on/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Reading’s clock says 12:09: still 1 minute behind London. Wind it on again.');
    more();
    fireEvent.click(screen.getByRole('button', { name: /Wind it on/ }));
    expect(screen.getByRole('button', { name: 'Reading (set)' })).toBeInTheDocument();
    expect(screen.getByText('1 of 4 stations set')).toBeInTheDocument();
    // A clue from the timetable, and a clock wound too far is wound back.
    fireEvent.click(screen.getByRole('button', { name: 'Chippenham' }));
    fireEvent.click(screen.getByRole('button', { name: 'Need a clue?' }));
    expect(screen.getByText('The 1841 timetable: Chippenham’s own time is 8 minutes behind London’s.')).toBeInTheDocument();
    for (let i = 0; i < 10; i++) more();
    fireEvent.click(screen.getByRole('button', { name: /Wind it on/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Chippenham’s clock says 12:12: 2 minutes too far. Wind it back.');
    expect(screen.getByText(/How many minutes must/)).toHaveTextContent('go back?');
    fewer();
    fewer();
    fireEvent.click(screen.getByRole('button', { name: /Wind it back/ }));
    expect(screen.getByRole('button', { name: 'Chippenham (set)' })).toBeInTheDocument();
    for (const [town, behind] of [
      ['Bath', 11],
      ['Bridgewater', 14],
    ] as const) {
      fireEvent.click(screen.getByRole('button', { name: town }));
      for (let i = 0; i < behind; i++) more();
      fireEvent.click(screen.getByRole('button', { name: /Wind it on/ }));
    }
    expect(screen.getByRole('status')).toHaveTextContent('Well done! Every station on the line says 12:10: railway time.');
    expect(screen.getByRole('button', { name: /^Step 4: .*\(done\)/ })).toBeInTheDocument();
    const facts = openFacts();
    expect(within(facts).getByText(NOTES.clearingHouse.text)).toBeInTheDocument();
    expect(within(facts).getByText(NOTES.timeSignals.text)).toBeInTheDocument();
  });

  it('step 4: winds a clock’s hands round smoothly, not in one jump', () => {
    jest.useFakeTimers();
    render(<VictorianInventions />);
    railStep('set');
    fireEvent.click(screen.getByRole('button', { name: /Read the telegram/ }));
    for (let i = 0; i < 4; i++) fireEvent.click(screen.getByRole('button', { name: 'One minute more' }));
    fireEvent.click(screen.getByRole('button', { name: /Wind it on/ }));
    act(() => {
      jest.advanceTimersByTime(45 * 3);
    });
    expect(screen.getByRole('img', { name: /Reading’s station clock says 12:07½/ })).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(45 * 10);
    });
    expect(screen.getByRole('button', { name: 'Reading (set)' })).toBeInTheDocument();
  });

  it('step 5: Bristol’s clock, set by hand (red to London, black back to Bristol), then wound on to catch the train', () => {
    expect(BRISTOL_CLOCK.behind).toBe(STATIONS.find((s) => s.name === 'Bristol')!.behind);
    render(<VictorianInventions />);
    railStep('bristol');
    const clock = screen.getByRole('img', { name: /Bristol’s Exchange clock, with one hour hand and two minute hands/ });
    expect(clock).toHaveAccessibleName(expect.stringContaining('a red one for London time at 12:00, and a black one for Bristol’s own time at 12:00. They are together.'));
    // Dragged, a minute hand goes to the nearest minute, carrying the hour on past twelve.
    expect(dragMinute(709, 0)).toBe(720);
    expect(dragMinute(718, 12)).toBe(722);
    const both = screen.getByRole('slider', { name: /The clock’s minute hands/ });
    for (let i = 0; i < 10; i++) fireEvent.keyDown(both, { key: 'ArrowUp' });
    expect(screen.getByRole('status')).toHaveTextContent('Right! The red hand says London time, 12:10.');
    const black = screen.getByRole('slider', { name: /The black minute hand/ });
    expect(black).toHaveAttribute('aria-valuetext', '12:10');
    for (let i = 0; i < 11; i++) fireEvent.keyDown(black, { key: 'ArrowDown' });
    expect(clock).toHaveAccessibleName(expect.stringContaining('They are 11 minutes apart.'));
    expect(clock.querySelector('.vrw-wedge')).not.toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('Bristol’s own time, 11 minutes behind London');
    for (let i = 0; i < 20; i++) fireEvent.click(screen.getByRole('button', { name: 'On one minute' }));
    expect(screen.getByRole('status')).toHaveTextContent(`The red hand says ${clockTime(BRISTOL_TRAIN)}: your train goes! The black hand says only 12:19.`);
    expect(clock.querySelector('.vrw-bristol-train')).toHaveAttribute('data-gone', 'true');
    expect(screen.getByText(/Go by the black hand, and you miss it by 11 minutes!/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Step 5: .*\(done\)/ })).toBeInTheDocument();
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
      const bench = document.querySelector('.vbi-panel:not([hidden]) .vrw')!;
      const notes = [...bench.querySelectorAll('[data-fact]')];
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

  it('gives each step its own layout over the whole stage, the platform painting reaching the foot of the room', () => {
    const rail = fs.readFileSync(path.join(DIR, 'railway.css'), 'utf8');
    expect(fs.readFileSync(path.join(DIR, 'Railway.tsx'), 'utf8')).toContain("import './railway.css';");
    expect(rail).toMatch(/\.vbi-stage\[data-tab='railway'\] \.vbi-bench-top \{ display: none; \}/);
    for (const cls of ['vrw-sun', 'vrw-journey', 'vrw-catch', 'vrw-set', 'vrw-bristol']) expect(rail).toMatch(new RegExp(`\\.${cls} \\{ display: (grid|flex);`));
    expect(rail).toMatch(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*\.vrw-catch-train, \.vrw-bristol-train \{ transition: none !important; \}/);
    render(<VictorianInventions />);
    for (const id of RAIL_STEPS.map((s) => s.id)) {
      railStep(id);
      expect(document.querySelector('.vrw')).toHaveAttribute('data-step', id);
      // No step goes back to the old picture-left, card-right frame.
      expect(document.querySelector('.vbi-panel:not([hidden]) .vbr-scene, .vbi-panel:not([hidden]) .vbr-card')).toBeNull();
    }
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
