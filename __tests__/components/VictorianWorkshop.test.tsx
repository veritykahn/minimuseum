import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import VictorianInventions from '@/app/exhibitions/victorian/inventions/page';
import { BRISTOL_ASK, BRISTOL_CLOCK, BRISTOL_TRAIN, EXPOSURE, EXPOSURE_WORDS, INCOMING, INCOMING_NOTE, MAP_TOWNS, MORSE, NOTES, PHOTOS, PLYMOUTH, POSITIVE, PROCESS_CLUES, QUIZ_ORDER, RAIL_STEPS, READ_WORDS, SEND_WORDS, STATIONS, STATION_JOB, TELEGRAM, TRAIN_PUZZLES, WIRE_PARTS, blurFor, exposureFor, verdictFor } from '@/app/exhibitions/victorian/inventions/inventionsText';
import { INVENTIONS_SOURCES, RAIL_FACTS, WIRE_FACTS } from '@/app/exhibitions/victorian/inventions/sources';
import { londonTimeUnderSun, noonBetween, trainAt, watchAt } from '@/app/exhibitions/victorian/inventions/Railway';
import { trayOrder } from '@/app/exhibitions/victorian/inventions/Telegraph';
import { quizOrder } from '@/app/exhibitions/victorian/inventions/Photography';
import { DIAL, DIAL_LETTERS, DIAL_ROWS, MAP, clockTime, compareBehind, dragMinute, hands, judgeTrain, morseTimeline, needleAngles, nextTrain, oldMoney, onDial, project, spell, sunTimeAt, sunX, telegramCost, telegramWords, toMorse } from '@/app/exhibitions/victorian/inventions/workshop';

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
    for (const p of WIRE_PARTS) expect(WIRE_FACTS[p.id].length).toBeGreaterThan(0);
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

  it('step 2: steams along the line, your watch (London time) ticking on, and predicts each town’s clock before it is uncovered', () => {
    expect(trainAt(0)).toEqual(project(STATIONS[0].lon, STATIONS[0].lat));
    expect(trainAt(6)).toEqual(project(STATIONS[6].lon, STATIONS[6].lat));
    expect(watchAt(0)).toBe(600);
    expect(watchAt(0.5)).toBe(620);
    // Each town further behind than the last, but for Bristol, which keeps Bath's minutes.
    expect(STATIONS.slice(1).map((s, i) => compareBehind(STATIONS[i].behind, s.behind))).toEqual(['more', 'more', 'more', 'more', 'same', 'more']);
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
    // Arrived: the clock stays covered, and there is no steaming on, until you predict it.
    expect(screen.getByRole('img', { name: 'Reading’s clock, covered until you predict it.' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Steam on to/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Behind my watch' }));
    expect(screen.getByRole('img', { name: 'Reading’s own clock says 10:36.' })).toBeInTheDocument();
    expect(screen.getByText('Right! Reading’s clock is 4 minutes behind.')).toBeInTheDocument();
    const towns = ['Steventon', 'Chippenham', 'Bath', 'Bristol', 'Bridgewater'];
    towns.forEach((town, i) => {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`Steam on to ${town}`) }));
      act(() => {
        jest.advanceTimersByTime(1700);
      });
      const prev = i ? towns[i - 1] : 'Reading';
      // Further behind every time, even at Bristol: a wrong guess is told why.
      fireEvent.click(screen.getByRole('button', { name: `Further behind than ${prev}` }));
    });
    expect(screen.getByRole('status')).toHaveTextContent('Bridgewater’s clock says 1:01: 14 minutes behind your watch, further behind than Bristol (11 minutes).');
    expect(screen.getByText('Bridgewater’s clock is 14 minutes behind.', { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/5 of 6 predicted/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back to London' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Step 2: .*\(done\)/ })).toBeInTheDocument();
    const facts = openFacts();
    expect(within(facts).getByText(NOTES.travellersWatch.text)).toBeInTheDocument();
    expect(within(facts).getByText(NOTES.railwayTime.text)).toBeInTheDocument();
  });

  it('step 2: at Bristol, a guess of "further behind" is told that the timetable gives Bath and Bristol the same minutes', () => {
    media((q) => q.includes('prefers-reduced-motion'));
    render(<VictorianInventions />);
    railStep('journey');
    const steps: [string, string][] = [
      ['Reading', 'Behind my watch'],
      ['Steventon', 'Further behind than Reading'],
      ['Chippenham', 'Further behind than Steventon'],
      ['Bath', 'Further behind than Chippenham'],
      ['Bristol', 'Further behind than Bath'],
    ];
    for (const [town, guess] of steps) {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`Steam on to ${town}`) }));
      fireEvent.click(screen.getByRole('button', { name: guess }));
    }
    expect(screen.getByRole('status')).toHaveTextContent('Not quite. Bristol’s clock says 12:14: 11 minutes behind your watch, the same as Bath: the 1841 timetable gives both 11 minutes.');
    expect(screen.getByText('Not quite: Bristol’s clock is 11 minutes behind.')).toBeInTheDocument();
  });

  it('step 3: picks the next train you can still catch from the board, by London time, counting on the clock as a tool', () => {
    // The one to catch is the earliest still to come by London time; in most, the first on the board has gone.
    const nexts = TRAIN_PUZZLES.map((p) => nextTrain(p.clock, STATIONS.find((s) => s.name === p.town)!.behind, p.trains));
    expect(nexts.map((v) => v.gone.length)).toEqual([1, 0, 1, 0, 1, 1]);
    expect(nexts.map((v) => clockTime(v.next!))).toEqual(['12:15', '12:25', '3:50', '9:30', '3:10', '11:05']);
    expect(judgeTrain(12 * 60, 11 * 60 + 52, 11, [12 * 60, 12 * 60 + 15])).toBe('gone');
    expect(judgeTrain(12 * 60 + 45, 11 * 60 + 52, 11, [12 * 60, 12 * 60 + 15, 12 * 60 + 45])).toBe('later');
    render(<VictorianInventions />);
    railStep('catch');
    const scene = () => screen.getByRole('img', { name: /station\. The town clock says/ });
    expect(scene()).toHaveAccessibleName(expect.stringContaining('London time is a time to work out.'));
    expect(scene().querySelector('.vrw-board-now')).toHaveTextContent('?');
    // The trap: the town clock says 11:52, so the 12:00 looks fine, but it has gone.
    fireEvent.click(screen.getByRole('button', { name: 'The 12:00' }));
    expect(screen.getByRole('button', { name: 'The 12:00' })).toHaveAttribute('data-verdict', 'wrong');
    expect(screen.getByRole('status')).toHaveTextContent('Gone already! The trains run by London time, and Bath’s clock is 11 minutes behind it. Count on 11 minutes from 11:52 first.');
    expect(document.querySelector('.vrw-ticket-help')).toHaveAttribute('data-nudge', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'The 12:45' }));
    expect(screen.getByRole('status')).toHaveTextContent('there is an earlier train you can still catch');
    // Counting on, on the clock: a red hand moves on.
    fireEvent.click(screen.getByRole('button', { name: '+ 5 minutes' }));
    fireEvent.click(screen.getByRole('button', { name: '+ 5 minutes' }));
    expect(screen.getByText('+10 of 11')).toBeInTheDocument();
    expect(scene().querySelector('.vrw-ghost')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '+ 5 minutes' }));
    expect(screen.getByRole('status')).toHaveTextContent('Too far! Bath is only 11 minutes behind: 1 minute left to count.');
    fireEvent.click(screen.getByRole('button', { name: '+ 1 minute' }));
    expect(scene().querySelector('.vrw-board-now')).toHaveTextContent('12:03');
    fireEvent.click(screen.getByRole('button', { name: 'The 12:15' }));
    expect(document.querySelector('.vrw-why')).toHaveTextContent('it is already 12:03 in London. The 12:00 had gone. The 12:15 was the one to catch.');
    expect(scene().querySelector('.vbi-stamp')).toHaveTextContent('Aboard the 12:15!');
    expect(scene().querySelector('.vrw-board-row[data-gone]')).toHaveTextContent('12:00');
    expect(screen.getByRole('button', { name: /^Step 3: .*\(done\)/ })).toBeInTheDocument();
    // Bristol: here the first train is still there, so "never the first" does not work.
    fireEvent.click(screen.getByRole('button', { name: /Another station/ }));
    fireEvent.click(screen.getByRole('button', { name: 'The 12:25' }));
    expect(document.querySelector('.vrw-why')).toHaveTextContent('The 12:25 was the one to catch, first time!');
    expect(openFacts()).toHaveTextContent(NOTES.missTrain.text);
  });

  it('step 3: counts on half a minute where the timetable has one (Steventon, 5½ minutes behind)', () => {
    render(<VictorianInventions />);
    railStep('catch');
    for (let i = 0; i < 3; i++) {
      // The trains in board order, earliest first, until the one to catch.
      for (const b of screen.getAllByRole('button', { name: /^The \d/ })) {
        if (document.querySelector('.vrw-why')) break;
        fireEvent.click(b);
      }
      fireEvent.click(screen.getByRole('button', { name: /Another station/ }));
    }
    expect(screen.getByRole('img', { name: /Steventon station/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '+ 5 minutes' }));
    fireEvent.click(screen.getByRole('button', { name: '+ ½ minute' }));
    expect(screen.getByRole('img', { name: /Steventon station/ }).querySelector('.vrw-board-now')).toHaveTextContent('9:25½');
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
    // Read from its face: no time in figures until it is set, or asked for as a clue.
    expect(document.querySelector('.vrw-bigclock .vrw-big-time')).toHaveTextContent('Read the clock');
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
    expect(document.querySelector('.vrw-clue-text')).toHaveTextContent('Chippenham’s clock says 12:02. The telegram says 12:10.');
    expect(document.querySelector('.vrw-bigclock .vrw-big-time')).toHaveTextContent('12:02');
    fireEvent.click(screen.getByRole('button', { name: 'Another clue?' }));
    expect(document.querySelector('.vrw-clue-text')).toHaveTextContent('The 1841 timetable: Chippenham’s own time is 8 minutes behind London’s.');
    expect(screen.queryByRole('button', { name: /clue\?/ })).toBeNull();
    for (let i = 0; i < 2; i++) fireEvent.click(screen.getByRole('button', { name: 'Five minutes more' }));
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
      // By fives and ones, not a tap a minute.
      for (let i = 0; i < Math.floor(behind / 5); i++) fireEvent.click(screen.getByRole('button', { name: 'Five minutes more' }));
      for (let i = 0; i < behind % 5; i++) more();
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
    // A traveller goes by the black hand: how long is there really, to a train that goes by London time?
    expect(screen.queryByRole('button', { name: 'On one minute' })).toBeNull();
    expect(BRISTOL_ASK.answers).toEqual([31, 20, 11]);
    fireEvent.click(screen.getByRole('button', { name: '31 minutes' }));
    expect(screen.getByRole('button', { name: '31 minutes' })).toHaveAttribute('data-verdict', 'wrong');
    expect(screen.getByRole('status')).toHaveTextContent('That is going by the black hand, Bristol’s own time.');
    fireEvent.click(screen.getByRole('button', { name: '11 minutes' }));
    expect(screen.getByRole('status')).toHaveTextContent('11 minutes is how far apart the two hands are.');
    fireEvent.click(screen.getByRole('button', { name: '20 minutes' }));
    expect(screen.getByRole('status')).toHaveTextContent('Right! 20 minutes: the train goes by London time, the red hand');
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

describe('the telegraph: build it, and the needle dial', () => {
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

  it('opens on building a telegraph: each part put where it does its job, a wrong place explained, then the key sets the current running', () => {
    expect(WIRE_PARTS.map((p) => p.id)).toEqual(['battery', 'key', 'wire', 'coil', 'needle']);
    render(<VictorianInventions />);
    expect(screen.getByRole('button', { name: 'Build a telegraph' })).toHaveAttribute('aria-pressed', 'true');
    // Its own look: the scene across the bench and the card a strip along the foot, not the steps of before.
    expect(document.querySelector('.vbi-build')).toHaveAttribute('data-look', 'strip');
    expect(screen.queryByRole('button', { name: /^Step 1: / })).toBeNull();
    const circuit = screen.getByRole('img', { name: /A telegraph circuit to build/ });
    expect(circuit).toHaveAccessibleName(expect.stringContaining('0 of 5 parts in place'));
    const tray = screen.getByRole('list', { name: 'The parts tray' });
    // The tray is shuffled, never in the circuit's own order, so a part is matched by its job, not its turn.
    const order = within(tray).getAllByRole('button').map((b) => b.textContent);
    expect(order).not.toEqual(WIRE_PARTS.map((p) => p.name));
    for (const seed of [null, 1, 2, 3, 4, 5, 6, 7, 8]) {
      const t = trayOrder(seed).map((p) => p.id);
      expect([...t].sort()).toEqual(WIRE_PARTS.map((p) => p.id).sort());
      expect(t).not.toEqual(WIRE_PARTS.map((p) => p.id));
    }
    // A place tapped with nothing picked says what to do.
    fireEvent.click(screen.getByRole('button', { name: 'Empty place: Makes the electric current' }));
    expect(screen.getByRole('status')).toHaveTextContent('First pick a part from the tray.');
    // The battery in the key's place: it says what it is, and what that place needs.
    fireEvent.click(within(tray).getByRole('button', { name: /Battery/ }));
    expect(within(tray).getByRole('button', { name: /Battery/ })).toHaveAttribute('aria-pressed', 'true');
    const keyPlace = screen.getByRole('button', { name: 'Empty place: A switch: press it to send' });
    fireEvent.click(keyPlace);
    expect(keyPlace).toHaveAttribute('data-wrong', '1');
    expect(screen.getByRole('status')).toHaveTextContent('That’s the battery. This place needs the part that switches the current on and off.');
    // After a wrong place the battery stays in the hand, ready for its right place.
    expect(within(tray).getByRole('button', { name: /Battery/ })).toHaveAttribute('aria-pressed', 'true');
    for (const p of WIRE_PARTS) {
      const btn = within(tray).getByRole('button', { name: new RegExp(p.name) });
      if (btn.getAttribute('aria-pressed') !== 'true') fireEvent.click(btn);
      fireEvent.click(screen.getByRole('button', { name: `Empty place: ${p.job}` }));
      expect(screen.queryByRole('button', { name: `Empty place: ${p.job}` })).toBeNull();
      if (p.id !== 'needle') expect(screen.getByText(p.line)).toBeInTheDocument();
    }
    expect(screen.getByText('Your telegraph is built!')).toBeInTheDocument();
    const key = screen.getByRole('button', { name: 'Press the key' });
    fireEvent.pointerDown(key);
    expect(circuit).toHaveAttribute('data-live', 'true');
    fireEvent.pointerUp(key);
    expect(circuit).not.toHaveAttribute('data-live');
    fireEvent.keyDown(key, { key: ' ' });
    expect(circuit).toHaveAttribute('data-live', 'true');
    fireEvent.keyUp(key, { key: ' ' });
    expect(circuit).not.toHaveAttribute('data-live');
    // Each part's note, behind "Did you know?".
    const facts = openFacts();
    for (const n of [NOTES.wire, NOTES.oersted, NOTES.needles]) expect(facts).toHaveTextContent(n.text);
    fireEvent.click(screen.getByRole('button', { name: /Close/ }));
    fireEvent.click(screen.getByRole('button', { name: /Now try the five-needle telegraph/ }));
    expect(screen.getByRole('button', { name: 'Needle dial' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('drags a part from the tray onto its place on the drawing', () => {
    render(<VictorianInventions />);
    const place = screen.getByRole('button', { name: 'Empty place: Makes the electric current' });
    const was = document.elementsFromPoint;
    document.elementsFromPoint = jest.fn(() => [place]);
    try {
      const battery = within(screen.getByRole('list', { name: 'The parts tray' })).getByRole('button', { name: /Battery/ });
      fireEvent.pointerDown(battery, { clientX: 10, clientY: 10 });
      fireEvent.pointerMove(battery, { clientX: 200, clientY: 120 });
      expect(document.querySelector('.vbi-ghost')).not.toBeNull();
      fireEvent.pointerUp(battery, { clientX: 300, clientY: 200 });
      fireEvent.click(battery);
    } finally {
      document.elementsFromPoint = was;
    }
    expect(screen.queryByRole('button', { name: 'Empty place: Makes the electric current' })).toBeNull();
    expect(screen.getByRole('img', { name: /A telegraph circuit to build/ })).toHaveAccessibleName(expect.stringContaining('1 of 5 parts in place'));
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
  afterEach(() => jest.restoreAllMocks());

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

  it('prints the telegram form once it is paid for and sent: to, from, the message with its Morse under every letter, and the price', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const print = jest.fn();
    window.print = print;
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Send a telegram' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your telegram' }), { target: { value: 'tea at four' } });
    // Not before it is handed over the counter.
    goStep(3);
    expect(screen.queryByRole('textbox', { name: 'To' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Hand it over the counter' }));
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

  it('receives one of many telegrams, chosen at random: the lamp flashes it, the tape shows it, and you decode it from the chart, wrong red and right green', () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0);
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Receive a telegram' }));
    const message = INCOMING[0];
    const chart = screen.getByRole('group', { name: 'International Morse code chart' });
    expect(within(chart).getByRole('button', { name: /^T: dash$/ })).toBeDisabled();
    expect(screen.getByText(INCOMING_NOTE)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Play the telegram' }));
    act(() => {
      jest.advanceTimersByTime(1);
    });
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
    // Another: a different one.
    (Math.random as jest.Mock).mockReturnValue(0.5);
    fireEvent.click(screen.getByRole('button', { name: 'Another telegram' }));
    const cellsNow = document.querySelectorAll('.vbi-tg-decode .vbi-tg-cell').length;
    expect(INCOMING.filter((m) => m !== message).map((m) => m.replace(/ /g, '').length)).toContain(cellsNow);
  });

  it('has many different telegrams to receive, all made up and short', () => {
    expect(INCOMING.length).toBeGreaterThanOrEqual(20);
    expect(new Set(INCOMING).size).toBe(INCOMING.length);
    for (const m of INCOMING) expect(m.split(' ').length).toBeLessThanOrEqual(5);
    expect(INCOMING_NOTE).toMatch(/Made-up telegrams/);
  });

  it('under reduced motion, brings the incoming telegram up on the tape at once, the lamp still', () => {
    jest.useFakeTimers();
    jest.spyOn(Math, 'random').mockReturnValue(0);
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

  it('times a negative by hand: too faint, too dark, or good, and its result said', () => {
    expect(exposureFor(2)).toBe('faint');
    expect(exposureFor(EXPOSURE.best[0])).toBe('good');
    expect(exposureFor(EXPOSURE.best[1])).toBe('good');
    expect(exposureFor(EXPOSURE.darkAbove + 1)).toBe('dark');
    jest.useFakeTimers();
    render(<VictorianInventions />);
    const cap = () => screen.getByRole('button', { name: /Lift the lens cap|Put the cap back/ });
    // Too short.
    fireEvent.click(cap());
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(cap()).toHaveTextContent('Put the cap back');
    fireEvent.click(cap());
    expect(screen.getAllByText(EXPOSURE_WORDS.faint, { exact: false }).find((el) => el.closest('[data-verdict]'))!.closest('[data-verdict]')).toHaveAttribute('data-verdict', 'wrong');
    // A new sheet starts again with blank paper (it used to do nothing).
    fireEvent.click(screen.getByRole('button', { name: 'A new sheet' }));
    expect(screen.getByRole('img', { name: 'A sheet of sensitive paper in the camera, still blank' })).toBeInTheDocument();
    // Too long: the cap goes back by itself at the most the sheet can take.
    fireEvent.click(cap());
    act(() => {
      jest.advanceTimersByTime(EXPOSURE.max * 1000 + 200);
    });
    expect(screen.getAllByText(EXPOSURE_WORDS.dark, { exact: false }).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'A new sheet' }));
    // Just right.
    fireEvent.click(cap());
    act(() => {
      jest.advanceTimersByTime(6000);
    });
    fireEvent.click(cap());
    expect(screen.getByRole('img', { name: /Talbot’s negative/ })).toBeInTheDocument();
  });

  it('prints from a good negative, as many prints as you like, its notes and credit behind "Did you know?"', () => {
    jest.useFakeTimers();
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Lift the lens cap' }));
    act(() => {
      jest.advanceTimersByTime(6000);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Put the cap back' }));
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
    // A new sheet from the print bench goes back to the camera, blank.
    fireEvent.click(screen.getByRole('button', { name: 'A new sheet' }));
    expect(screen.getByRole('button', { name: 'Lift the lens cap' })).toBeInTheDocument();
  });

  it('under reduced motion, makes each print at once', () => {
    jest.useFakeTimers();
    media((q) => q.includes('prefers-reduced-motion'));
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: 'Lift the lens cap' }));
    act(() => {
      jest.advanceTimersByTime(6000);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Put the cap back' }));
    fireEvent.click(screen.getByRole('button', { name: 'Print from it' }));
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(screen.getByText('One print from the negative.')).toBeInTheDocument();
  });

  it('sits for a daguerreotype: holding the clamp is holding still, letting go is moving, and it says which, honestly', () => {
    expect(blurFor(0)).toBe(0);
    expect(verdictFor(blurFor(0)).tone).toBe('right');
    jest.useFakeTimers();
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: '2. Hold still!' }));
    expect(screen.queryByRole('button', { name: /Use the head clamp/ })).toBeNull();
    expect(screen.getByText(/Press and hold the clamp/, { selector: 'strong' })).toBeInTheDocument();
    const hold = screen.getByRole('button', { name: 'Press and hold the clamp' });
    fireEvent.pointerDown(hold);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    // Held: still, and it says so; nothing moved.
    expect(hold).toHaveTextContent(/Holding the clamp: still/);
    expect(document.querySelector('.vbi-sitter')).not.toHaveAttribute('data-moving');
    fireEvent.pointerUp(hold);
    // Let go: moving, and it says so.
    expect(hold).toHaveTextContent(/You let go!/);
    expect(document.querySelector('.vbi-sitter')).toHaveAttribute('data-moving', 'true');
    fireEvent.pointerDown(hold);
    act(() => {
      jest.advanceTimersByTime(8100);
    });
    fireEvent.pointerUp(hold);
    expect(screen.getByText(verdictFor(0).words).closest('[data-verdict]')).toHaveAttribute('data-verdict', 'right');
    expect(openFacts()).toHaveTextContent(NOTES.prunes.text);
    fireEvent.click(screen.getByRole('button', { name: /Close/ }));
    // Again, letting go for most of it: a blur.
    fireEvent.click(screen.getByRole('button', { name: 'Sit again' }));
    const again = screen.getByRole('button', { name: 'Press and hold the clamp' });
    fireEvent.pointerDown(again);
    fireEvent.pointerUp(again);
    act(() => {
      jest.advanceTimersByTime(8100);
    });
    expect(screen.getByText(verdictFor(blurFor(8000)).words).closest('[data-verdict]')).toHaveAttribute('data-verdict', 'wrong');
  });

  it('teaches the three ways first, then asks: daguerreotype, calotype and wet collodion matched to real photographs', () => {
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: '3. Three ways' }));
    const quiz = screen.getByRole('button', { name: /Take the quiz/ });
    expect(quiz).toBeDisabled();
    for (const c of PROCESS_CLUES) {
      const card = screen.getByRole('button', { name: new RegExp(`^${c.short}: `) });
      fireEvent.click(card);
      expect(card).toHaveAttribute('aria-pressed', 'true');
      expect(card).toHaveTextContent(c.teach);
    }
    fireEvent.click(quiz);
    // The clues come in a shuffled order: read which one is showing.
    const showing = () => PROCESS_CLUES.find((c) => screen.queryByText(`“${c.clue}”`))!;
    const first = showing();
    const wrongId = QUIZ_ORDER.find((id) => id !== first.photo)!;
    const wrong = screen.getByRole('button', { name: new RegExp(PHOTOS[wrongId].title) });
    fireEvent.click(wrong);
    expect(wrong).toHaveAttribute('data-verdict', 'wrong');
    expect(screen.getByText(`Not that one. Hint: ${first.hint}`)).toBeInTheDocument();
    const asked: string[] = [];
    for (let i = 0; i < QUIZ_ORDER.length; i++) {
      const c = showing();
      asked.push(c.photo);
      fireEvent.click(screen.getByRole('button', { name: new RegExp(PHOTOS[c.photo].title) }));
      expect(screen.getByText(NOTES[c.note].text)).toBeVisible();
      if (i < QUIZ_ORDER.length - 1) fireEvent.click(screen.getByRole('button', { name: /Next clue/ }));
    }
    expect([...asked].sort()).toEqual([...QUIZ_ORDER].sort());
    expect(screen.getByText(/^All three matched:/)).toBeInTheDocument();
  });

  it('shuffles the quiz: the clues and the photographs each in an order of their own, fixed until the page is live', () => {
    expect(quizOrder(null)).toEqual({ clues: QUIZ_ORDER, photos: QUIZ_ORDER });
    const seen = new Set<string>();
    for (let s = 1; s < 40; s++) {
      const o = quizOrder(s);
      expect([...o.clues].sort()).toEqual([...QUIZ_ORDER].sort());
      expect([...o.photos].sort()).toEqual([...QUIZ_ORDER].sort());
      seen.add(o.clues.join());
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it('counts a wobble of the finger on the clamp as moving', () => {
    // jsdom has no PointerEvent: without one the pointer's position is lost.
    const had = 'PointerEvent' in window;
    if (!had) (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = class extends MouseEvent {} as typeof MouseEvent;
    jest.useFakeTimers();
    render(<VictorianInventions />);
    fireEvent.click(screen.getByRole('button', { name: '2. Hold still!' }));
    const hold = screen.getByRole('button', { name: 'Press and hold the clamp' });
    fireEvent.pointerDown(hold, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(hold, { clientX: 103, clientY: 102 });
    expect(hold).toHaveTextContent('Holding the clamp');
    fireEvent.pointerMove(hold, { clientX: 140, clientY: 100 });
    expect(hold).toHaveTextContent('You wobbled!');
    act(() => {
      jest.advanceTimersByTime(8100);
    });
    fireEvent.pointerUp(hold);
    expect(screen.getByText(verdictFor(blurFor(600)).words)).toBeInTheDocument();
    if (!had) delete (window as unknown as { PointerEvent?: unknown }).PointerEvent;
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
