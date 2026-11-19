import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import BuildABand from '@/app/exhibitions/harlem-renaissance/jazz-lab/BuildABand';
import {
  BAND_GOALS,
  BAND_INSTRUMENTS,
  INSTRUMENTS,
  SECTIONS,
  judgeGoal,
  problemLine,
  type BandGoal,
  type BandInstrumentId,
  type BandState,
} from '@/app/exhibitions/harlem-renaissance/jazz-lab/data';
import { answerRound, loopOffset, useAudioEngine, useBandBuilder, type QuizRound } from '@/app/exhibitions/harlem-renaissance/jazz-lab/hooks';
import { SESSIONS, TIMELINE_DURATION, dropStart, loopDuration, songEnd, type LaneBlock } from '@/app/exhibitions/harlem-renaissance/jazz-lab/studio-data';
import { MENTOR_POEM, PROMPT_CARDS, repeatedLines } from '@/app/exhibitions/harlem-renaissance/harlem-in-words/mentor-poem';
import {
  checkPrompt,
  poemLines,
  refrainEntries,
  usedWords,
  wrapText,
  type PoemEntry,
} from '@/app/exhibitions/harlem-renaissance/harlem-in-words/poem-tools';

/*
 * The Harlem rooms' new logic: the bandleader's requests in Build a Band, the
 * second listen in Name That Instrument, loops that keep time together,
 * dropping a loop where it was let go in the Jazz Studio, and the refrain in
 * Harlem in Words.
 */

const band = (section: number, active: BandInstrumentId[], spotlight: BandInstrumentId | null = null): BandState => ({
  section,
  active: new Set(active),
  spotlight,
});

/** The band that answers a request. */
function rightBand(goal: BandGoal): BandState {
  const solo = goal.soloists[0] ?? null;
  const players = goal.everyone
    ? BAND_INSTRUMENTS.filter((i) => i.sections.includes(goal.section)).map((i) => i.id)
    : [...goal.needs, ...(solo ? [solo] : [])];
  return band(goal.section, players, solo);
}

describe('Build a Band: the bandleader’s requests', () => {
  it('asks for a real song section in its own words, never naming the section', () => {
    for (const g of BAND_GOALS) {
      const s = SECTIONS.find((x) => x.number === g.section)!;
      expect(s).toBeDefined();
      expect(g.goal.toLowerCase()).not.toContain(s.name.toLowerCase());
      // Everyone it needs can play that section.
      for (const id of [...g.needs, ...g.soloists]) {
        expect({ goal: g.id, id, plays: BAND_INSTRUMENTS.find((i) => i.id === id)!.sections.includes(g.section) }).toEqual({ goal: g.id, id, plays: true });
      }
    }
    expect(new Set(BAND_GOALS.map((g) => g.id)).size).toBe(BAND_GOALS.length);
  });

  it('passes the band that answers each request', () => {
    for (const g of BAND_GOALS) expect({ goal: g.id, ...judgeGoal(g, rightBand(g)) }).toEqual({ goal: g.id, problems: [], missing: [] });
  });

  it('names what is still off, a pointer rather than the answer', () => {
    const piano = BAND_GOALS.find((g) => g.id === 'piano-solo')!;
    expect(judgeGoal(piano, band(1, ['drums', 'bass', 'piano'], 'piano')).problems).toEqual(['section']);
    const r = judgeGoal(piano, band(3, ['piano'], 'piano'));
    expect(r.problems).toEqual(['missing']);
    expect(r.missing).toEqual(['drums', 'bass']);
    expect(problemLine(piano, 'missing', r.missing)).toBe('Someone is missing: bring on the drums and bass.');
    expect(judgeGoal(piano, band(3, ['drums', 'bass', 'piano'], 'bass')).problems).toEqual(['soloist']);
    expect(judgeGoal(piano, band(3, ['drums', 'bass', 'piano'])).problems).toEqual(['soloist']);

    const horn = BAND_GOALS.find((g) => g.id === 'horn-solo')!;
    expect(judgeGoal(horn, band(4, ['drums', 'bass', 'trumpet'], 'trumpet')).problems).toEqual([]);
    expect(judgeGoal(horn, band(4, ['drums', 'bass', 'saxophone'], 'saxophone')).problems).toEqual([]);
    expect(problemLine(horn, 'soloist', [])).toMatch(/Which instruments are horns/);

    const groove = BAND_GOALS.find((g) => g.id === 'groove')!;
    expect(judgeGoal(groove, band(6, ['piano', 'bass', 'drums'], 'piano')).problems).toEqual(['no-soloist']);

    const finale = BAND_GOALS.find((g) => g.id === 'finale')!;
    expect(judgeGoal(finale, band(8, ['drums', 'bass', 'piano'])).missing).toEqual(['horns']);
    for (const p of ['section', 'missing', 'soloist', 'no-soloist'] as const) {
      // No line names the section the request wants.
      expect(problemLine(piano, p, ['drums'])).not.toMatch(/Piano Solo/);
    }
  });
});

function Band() {
  const audio = useAudioEngine();
  const band = useBandBuilder(audio, { preload: false });
  return <BuildABand band={band} />;
}

describe('Build a Band: playing a request for the bandleader', () => {
  beforeEach(() => {
    class Ctx {
      state = 'running';
      currentTime = 0;
      destination = {};
      createBufferSource() { return { buffer: null, loop: false, onended: null, connect() {}, disconnect() {}, start() {}, stop() {} }; }
      createGain() { return { gain: { value: 1, setValueAtTime() {}, linearRampToValueAtTime() {}, cancelScheduledValues() {} }, connect() {}, disconnect() {} }; }
      decodeAudioData() { return Promise.resolve({ duration: 10 }); }
      resume() { return Promise.resolve(); }
      close() { return Promise.resolve(); }
    }
    (window as unknown as { AudioContext: unknown }).AudioContext = Ctx;
    global.fetch = jest.fn(() => Promise.resolve({ arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) })) as unknown as typeof fetch;
  });

  const tapPlayer = (name: string) => fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${name}(,|$)`) }));

  it('checks the band, says what is off with a hint, then passes the right band', async () => {
    render(<Band />);
    const play = screen.getByRole('button', { name: 'Play it for the bandleader' });
    expect(play).toBeDisabled();
    const text = document.getElementById('jl-goal-name')!.textContent!;
    const goal = BAND_GOALS.find((g) => text.includes(g.goal))!;
    expect(goal).toBeDefined();

    // The Intro, with only the drums: not what was asked.
    await act(async () => { tapPlayer('Drums'); });
    fireEvent.click(play);
    expect(screen.getByText(problemLine(goal, 'section', []))).toBeInTheDocument();
    expect(screen.getByText(goal.hint)).toBeInTheDocument();

    // Now the band that answers it.
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: SECTIONS.find((x) => x.number === goal.section)!.name }));
    });
    const r = rightBand(goal);
    const byId = (id: BandInstrumentId) => BAND_INSTRUMENTS.find((i) => i.id === id)!.name;
    for (const id of r.active) {
      if (id === r.spotlight) continue;
      // Tapping brings a player on and into the spotlight; a second tap hands the music back.
      await act(async () => { if (!screen.queryByRole('button', { name: new RegExp(`^${byId(id)}, on stage`) })) tapPlayer(byId(id)); });
      await act(async () => { if (screen.queryByRole('button', { name: new RegExp(`^${byId(id)}, on stage, in the spotlight`) })) tapPlayer(byId(id)); });
    }
    if (r.spotlight) await act(async () => { tapPlayer(byId(r.spotlight!)); });
    fireEvent.click(play);
    expect(screen.getByText(goal.success)).toBeInTheDocument();
    expect(screen.getByText(/1 of 5 played/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next request' }));
    expect(document.getElementById('jl-goal-name')!.textContent).not.toContain(goal.goal);
  });
});

describe('Name That Instrument: a second listen', () => {
  const round: QuizRound = { id: 'r1', audioSrc: '/a.mp3', correctAnswer: 'trumpet' };

  it('ends the round on a right first answer', () => {
    expect(answerRound(round, 'trumpet', null)).toEqual({ next: 'answered', record: { round, chosen: 'trumpet', correct: true } });
  });

  it('gives one more try after a miss, counts the first answer, and ignores the same miss twice', () => {
    expect(answerRound(round, 'clarinet', null)).toEqual({ next: 'retry' });
    expect(answerRound(round, 'clarinet', 'clarinet')).toEqual({ next: 'retry' });
    expect(answerRound(round, 'trumpet', 'clarinet')).toEqual({
      next: 'answered',
      record: { round, chosen: 'clarinet', correct: false, secondTry: 'trumpet' },
    });
    expect(answerRound(round, 'piano', 'clarinet').record).toEqual({ round, chosen: 'clarinet', correct: false, secondTry: 'piano' });
  });

  it('says what to listen for on every instrument', () => {
    for (const i of INSTRUMENTS) expect(i.listenFor.length).toBeGreaterThan(20);
  });
});

describe('the band keeps time together', () => {
  it('starts a joining loop at the point the band has reached', () => {
    expect(loopOffset(0, 10)).toBe(0);
    expect(loopOffset(3.5, 10)).toBeCloseTo(3.5);
    expect(loopOffset(23.5, 10)).toBeCloseTo(3.5);
    expect(loopOffset(5, 0)).toBe(0);
    expect(loopOffset(-1, 10)).toBe(0);
    expect(loopOffset(5, Number.NaN)).toBe(0);
  });

  class Src {
    buffer: { duration: number } | null = null;
    loop = false;
    onended: (() => void) | null = null;
    args: number[] = [];
    connect() {}
    disconnect() {}
    start(...a: number[]) { this.args = a; }
    stop() { const cb = this.onended; setTimeout(() => cb?.(), 0); }
  }
  const param = () => ({ value: 1, setValueAtTime() {}, linearRampToValueAtTime() {}, cancelScheduledValues() {} });
  let sources: Src[];
  let ctx: { currentTime: number };

  beforeEach(() => {
    sources = [];
    class Ctx {
      state = 'running';
      currentTime = 0;
      destination = {};
      constructor() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias -- the test moves this context's clock
        ctx = this;
      }
      createBufferSource() { const s = new Src(); sources.push(s); return s; }
      createGain() { return { gain: param(), connect() {}, disconnect() {} }; }
      decodeAudioData() { return Promise.resolve({ duration: 10 }); }
      resume() { return Promise.resolve(); }
      close() { return Promise.resolve(); }
    }
    (window as unknown as { AudioContext: unknown }).AudioContext = Ctx;
    global.fetch = jest.fn(() => Promise.resolve({ arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) })) as unknown as typeof fetch;
  });

  it('starts a second loop on the same clock part-way in, and a fresh clock from the top', async () => {
    const { result } = renderHook(() => useAudioEngine());
    await act(async () => { await result.current.playLoop('drums', '/d.mp3', 0.7, { sync: 'band' }); });
    expect(sources[0].args).toEqual([0.03, 0]);
    ctx.currentTime = 12.5;
    await act(async () => { await result.current.playLoop('bass', '/b.mp3', 0.7, { sync: 'band' }); });
    // 12.53 - 0.03 = 12.5 seconds into a 10-second loop: 2.5 seconds in.
    expect(sources[1].args[0]).toBeCloseTo(12.53);
    expect(sources[1].args[1]).toBeCloseTo(2.5);
    act(() => result.current.resetClock('band'));
    await act(async () => { await result.current.playLoop('piano', '/p.mp3', 0.7, { sync: 'band' }); });
    expect(sources[2].args[1]).toBe(0);
  });

  it('says when a sound has played to its end, but not when it was stopped', async () => {
    jest.useFakeTimers();
    try {
      const { result } = renderHook(() => useAudioEngine());
      const ended = jest.fn();
      await act(async () => { await result.current.playOnce('quiz', '/q.mp3', 0.8, { onEnded: ended }); });
      act(() => sources[0].onended?.());
      expect(ended).toHaveBeenCalledTimes(1);
      await act(async () => { await result.current.playOnce('quiz', '/q.mp3', 0.8, { onEnded: ended }); });
      act(() => { result.current.stopSource('quiz'); jest.runAllTimers(); });
      expect(ended).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });
});

describe('Jazz Studio: a loop lands where it is dropped', () => {
  const session = SESSIONS[0];
  const loop = session.loops.find((l) => l.instrument === 'drums' && l.bars === 4)!;
  const bar = 240 / session.bpm;
  const len = loopDuration(session.bpm, loop.bars);

  it('snaps the drop to the nearest bar, inside the timeline', () => {
    expect(dropStart(loop, 0, [], session)).toBe(0);
    expect(dropStart(loop, bar * 3.2, [], session)).toBeCloseTo(bar * 3);
    expect(dropStart(loop, -5, [], session)).toBe(0);
    const late = dropStart(loop, TIMELINE_DURATION + 50, [], session)!;
    expect(late + len).toBeLessThanOrEqual(TIMELINE_DURATION + 1e-6);
  });

  it('refuses a drop on top of a loop in the same lane, but not in another lane', () => {
    const blocks: LaneBlock[] = [{ loopId: loop.id, lane: 'drums', startTime: bar * 4 }];
    expect(dropStart(loop, bar * 5, blocks, session)).toBeNull();
    expect(dropStart(loop, bar * 8, blocks, session)).toBeCloseTo(bar * 8);
    expect(dropStart(loop, 0, blocks, session)).toBe(0);
    const piano = session.loops.find((l) => l.instrument === 'piano')!;
    expect(dropStart(piano, bar * 5, blocks, session)).toBeCloseTo(bar * 5);
  });

  it('ends the song at the end of its last loop', () => {
    expect(songEnd([], session)).toBe(0);
    expect(songEnd([{ loopId: loop.id, lane: 'drums', startTime: bar * 4 }, { loopId: loop.id, lane: 'drums', startTime: 0 }], session)).toBeCloseTo(bar * 4 + len);
  });
});

describe('Harlem in Words: lines that come back', () => {
  let n = 0;
  const uid = () => `u${++n}`;
  const w = (text: string, category: PoemEntry['category'], sourceWord: string | undefined = text): PoemEntry => ({ uid: uid(), text, category, sourceWord });
  const br = (): PoemEntry => ({ uid: uid(), text: '\n', category: 'connector', isLineBreak: true });

  it('finds the mentor poem’s two refrains', () => {
    expect(repeatedLines()).toHaveLength(2);
    expect(repeatedLines()[0]).toMatch(/I’ve known rivers/);
    expect(repeatedLines()[1]).toMatch(/My soul has grown deep like the rivers/);
    expect(MENTOR_POEM.stanzas.flat().at(-1)).toBe(repeatedLines()[1]);
    expect(repeatedLines([['a', 'b'], ['a', 'c', 'b', 'a']])).toEqual(['a', 'b']);
  });

  it('copies a line to the end of the poem on its own line, keeping each word’s bank word', () => {
    const poem = [w('I', 'connector', undefined), w('dream', 'dream'), br(), w('rivers', 'nature')];
    const added = refrainEntries(poem, 0, uid);
    expect(added[0].isLineBreak).toBe(true);
    expect(added.slice(1).map((e) => e.text)).toEqual(['I', 'dream']);
    const after = [...poem, ...added];
    expect(poemLines(after).map((l) => l.map((e) => e.text).join(' '))).toEqual(['I dream', 'rivers', 'I dream']);
    expect(new Set(after.map((e) => e.uid)).size).toBe(after.length);
    expect(usedWords(after)).toEqual(new Set(['dream', 'rivers']));
    // Ending on a break already: no second break.
    expect(refrainEntries([...poem, br()], 1, uid)[0].text).toBe('rivers');
    expect(refrainEntries(poem, 5, uid)).toEqual([]);
  });

  it('checks each prompt from the poem itself', () => {
    expect(PROMPT_CARDS).toHaveLength(5);
    expect(checkPrompt(0, [w('I', 'connector', undefined), w('run', 'action')]).done).toBe(true);
    expect(checkPrompt(0, [w('run', 'action'), w('I', 'connector', undefined)]).done).toBe(false);
    expect(checkPrompt(1, [w('Harlem', 'harlem', 'harlem')])).toEqual({ done: true, status: 'Done: your poem goes to Harlem.' });
    expect(checkPrompt(2, [w('river', 'nature'), br(), w('joy', 'emotion')]).done).toBe(false);
    expect(checkPrompt(2, [w('river', 'nature'), w('joy', 'emotion')]).done).toBe(true);
    const three = [w('run', 'action'), br(), w('sing', 'action'), br(), w('climb', 'action')];
    expect(checkPrompt(3, three)).toEqual({ done: false, status: '3 of 4 lines have an Action word.' });
    const line = [w('I', 'connector', undefined), w('dream', 'dream')];
    expect(checkPrompt(4, line).done).toBe(false);
    expect(checkPrompt(4, [...line, ...refrainEntries(line, 0, uid)]).done).toBe(true);
    // A one-word line said twice is not a refrain.
    const one = [w('blues', 'music')];
    expect(checkPrompt(4, [...one, ...refrainEntries(one, 0, uid)]).done).toBe(false);
  });

  it('wraps the saved picture’s text to its width', () => {
    const measure = (s: string) => s.length * 10;
    expect(wrapText('I dream a world of song', 100, measure)).toEqual(['I dream a', 'world of', 'song']);
    expect(wrapText('extraordinarily', 50, measure)).toEqual(['extraordinarily']);
    expect(wrapText('', 100, measure)).toEqual(['']);
  });
});
