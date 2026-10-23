import fs from 'fs';
import path from 'path';
import {
  AD, BC, toAstronomical, yearsBetween, ribbonPosition, windowPosition, parseStopParam, formatYear,
  RIBBON_START, RIBBON_END,
} from '@/app/exhibitions/in-their-hands/timeline/chronology';
import { timelineStops } from '@/app/exhibitions/in-their-hands/timeline/timeline-data';
import {
  COIN_CASE, COIN_TIMELINE_STOP, HANDS_COIN_NAME, coinHref, timelineHref, storyLinksForCoin, type CoinId,
} from '@/app/exhibitions/in-their-hands/story-links';
import { case6Coins, case7Coins, case8Coins } from '@/app/exhibitions/in-their-hands/artifacts/coin-data';
import {
  SESSIONS, TEMPLATES, TIMELINE_DURATION, checkAABA, loopDuration, type PlacedLoop,
} from '@/app/exhibitions/harlem-renaissance/jazz-lab/studio-data';
import { MENTOR_POEM } from '@/app/exhibitions/harlem-renaissance/harlem-in-words/mentor-poem';

const root = path.resolve(__dirname, '../..');

describe('timeline chronology (no year zero)', () => {
  it('numbers 1 BC as year 0 astronomically, and 1 AD follows it directly', () => {
    expect(toAstronomical(BC(1))).toBe(0);
    expect(toAstronomical(AD(1))).toBe(1);
    expect(yearsBetween(BC(1), AD(1))).toBe(1);
    expect(yearsBetween(BC(5), AD(1))).toBe(5);
    expect(yearsBetween(BC(4), AD(30))).toBe(33);
  });

  it('rejects a year zero', () => {
    expect(() => toAstronomical(AD(0))).toThrow(RangeError);
    expect(() => toAstronomical(BC(0))).toThrow(RangeError);
  });

  it('spans 66 years from 5 BC to 62 AD and places the ends at 0 and 1', () => {
    expect(formatYear(RIBBON_START)).toBe('5 BC');
    expect(formatYear(RIBBON_END)).toBe('62 AD');
    expect(yearsBetween(RIBBON_START, RIBBON_END)).toBe(66);
    expect(ribbonPosition(RIBBON_START)).toBe(0);
    expect(ribbonPosition(RIBBON_END)).toBe(1);
    expect(ribbonPosition(AD(1))).toBeCloseTo(5 / 66);
    expect(ribbonPosition(AD(29))).toBeCloseTo(33 / 66);
    expect(windowPosition(AD(30), AD(33))).toBeCloseTo(((34 + 37) / 2) / 66);
  });

  it('puts every stop on the ribbon in chronological order', () => {
    const pos = timelineStops.map(s => windowPosition(s.when.from, s.when.to));
    pos.forEach(p => { expect(p).toBeGreaterThanOrEqual(0); expect(p).toBeLessThanOrEqual(1); });
    for (let i = 1; i < pos.length; i++) expect(pos[i]).toBeGreaterThanOrEqual(pos[i - 1]);
    timelineStops.forEach(s => expect(s.when.label).toMatch(/^c\. \d+(–\d+)? (BC|AD)$/));
  });
});

describe('timeline deep links', () => {
  it('reads ?stop=N as a 1-based stop', () => {
    expect(parseStopParam('1', 11)).toBe(0);
    expect(parseStopParam('7', 11)).toBe(6);
    expect(parseStopParam('11', 11)).toBe(10);
  });
  it('ignores missing, out-of-range and malformed values', () => {
    for (const v of [null, undefined, '', '0', '12', '-1', '2.5', 'seven', '3abc']) {
      expect(parseStopParam(v as string | null, 11)).toBeNull();
    }
  });
});

describe('coin story links', () => {
  const coins = [...case6Coins, ...case7Coins, ...case8Coins];

  it('maps every coin to a viewer page that exists and to its own timeline stop', () => {
    expect(Object.keys(COIN_CASE).sort()).toEqual(coins.map(c => c.id).sort());
    for (const id of Object.keys(COIN_CASE) as CoinId[]) {
      const href = coinHref(id);
      expect(fs.existsSync(path.join(root, 'app', href, 'page.tsx'))).toBe(true);
      const stop = timelineStops[COIN_TIMELINE_STOP[id] - 1];
      expect(stop.coinId).toBe(id);
    }
    expect(timelineStops.map(s => s.id)).toEqual(timelineStops.map((_, i) => i + 1));
  });

  it('deep-links each coin to its timeline stop', () => {
    expect(timelineHref(7)).toBe('/exhibitions/in-their-hands/timeline?stop=7');
    expect(storyLinksForCoin('pilate')[0].href).toBe(timelineHref(7));
    expect(storyLinksForCoin('nonexistent')).toEqual([]);
  });

  it('links to Hands of History only for coins that are a round there, without naming the character', () => {
    const hands = fs.readFileSync(path.join(root, 'app/exhibitions/in-their-hands/hands/page.tsx'), 'utf8');
    const roundNames = [...hands.matchAll(/coinName: "([^"]+)"/g)].map(m =>
      m[1].replace(/\\u([0-9A-Fa-f]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))));
    expect(Object.values(HANDS_COIN_NAME).sort()).toEqual([...roundNames].sort());
    expect(storyLinksForCoin('claudius').some(l => l.kind === 'hands')).toBe(false);
    for (const l of storyLinksForCoin('pilate')) expect(l.label).not.toMatch(/soldier/i);
  });

  it('points the Tribute Penny at the lesson built around it', () => {
    const lesson = storyLinksForCoin('tribute-penny').find(l => l.kind === 'lesson');
    expect(lesson?.href).toBe('/exhibitions/in-their-hands/lessons/whose-image-is-this');
    expect(fs.existsSync(path.join(root, 'lib/lessons/in-their-hands/whose-image-is-this.json'))).toBe(true);
  });
});

describe('Gospel Timeline copy', () => {
  it('uses US spellings and no longer claims certainty it cannot have', () => {
    const text = JSON.stringify(timelineStops);
    for (const uk of ['travelled', 'pence', 'afterwards', 'mould', 'colour', 'centre', 'grey']) {
      expect(text).not.toContain(uk);
    }
    for (const sure of ['precise year', 'exact years', 'only silence', 'exact type', 'almost certainly']) {
      expect(text).not.toContain(sure);
    }
  });
});

describe('Jazz Studio loops', () => {
  it('gives every loop a descriptive name, unique within its session, and keeps its code', () => {
    for (const s of SESSIONS) {
      const names = s.loops.map(l => l.label);
      expect(new Set(names).size).toBe(names.length);
      for (const l of s.loops) {
        expect(l.label).not.toMatch(/^[A-Z]{1,2}\d+v?\d*$/);
        expect(l.code).toMatch(/^[A-Z]{1,2}\d*v?\d*$/);
        expect(l.label.length).toBeLessThanOrEqual(32);
      }
    }
  });

  it('builds each Head → Solo → Head template from real loops with no overlaps', () => {
    for (const s of SESSIONS) {
      const t = TEMPLATES[s.id];
      expect(t).toBeDefined();
      const bar = 240 / s.bpm;
      const placed = t.placements.map(p => {
        const l = s.loops.find(x => x.id === p.loopId);
        expect(l).toBeDefined();
        return { lane: l!.instrument, start: p.bar * bar, end: p.bar * bar + loopDuration(s.bpm, l!.bars) };
      });
      for (const a of placed) {
        expect(a.end).toBeLessThanOrEqual(TIMELINE_DURATION);
        for (const b of placed) {
          if (a === b || a.lane !== b.lane) continue;
          expect(a.start < b.end - 1e-9 && b.start < a.end - 1e-9).toBe(false);
        }
      }
      // The head comes back: the same lead loops start in bars 1–8 and 17–24.
      const lead = (lo: number) => t.placements
        .filter(p => p.bar >= lo && p.bar < lo + 8)
        .filter(p => ['horns', 'piano'].includes(s.loops.find(l => l.id === p.loopId)!.instrument))
        .map(p => p.loopId).sort();
      expect(lead(16)).toEqual(lead(0));
    }
  });

  it('checks a 32-bar AABA arrangement', () => {
    const s = SESSIONS.find(x => x.id === 'bu')!;
    const bar = 240 / s.bpm;
    const put = (loopId: string, b: number): PlacedLoop => ({
      loopId, lane: s.loops.find(l => l.id === loopId)!.instrument, startTime: b * bar,
    });
    const A = '118_f_bu_horns_8', B = '118_f_bu_horns_2';
    const bass = [0, 4, 8, 12, 16, 20, 24, 28].map(b => put('118_f_bu_ac_bass_9', b));
    const full = checkAABA([put(A, 0), put(A, 8), put(B, 16), put(A, 24), ...bass], s);
    expect(full.done).toBe(true);
    const noBridge = checkAABA([put(A, 0), put(A, 8), put(A, 16), put(A, 24), ...bass], s);
    expect(noBridge.bridge).toBe(false);
    expect(noBridge.done).toBe(false);
    const short = checkAABA([put(A, 0), put(A, 8), put(B, 16), ...bass], s);
    expect(short.lastA).toBe(false);
    const noRhythm = checkAABA([put(A, 0), put(A, 8), put(B, 16), put(A, 24)], s);
    expect(noRhythm.rhythm).toBe(false);
  });
});

describe('Harlem in Words mentor poem', () => {
  it('quotes the 1921 Crisis text of "The Negro Speaks of Rivers" exactly', () => {
    const text = MENTOR_POEM.stanzas.map(st => st.join('\n')).join('\n\n');
    expect(text).toBe([
      'I’ve known rivers:',
      'I’ve known rivers ancient as the world and older than the flow of human blood in human veins.',
      '',
      'My soul has grown deep like the rivers.',
      '',
      'I bathed in the Euphrates when dawns were young.',
      'I built my hut near the Congo and it lulled me to sleep.',
      'I looked upon the Nile and raised the pyramids above it.',
      'I heard the singing of the Mississippi when Abe Lincoln went down to New Orleans, and I’ve seen its muddy bosom turn all golden in the sunset.',
      '',
      'I’ve known rivers:',
      'Ancient, dusky rivers.',
      '',
      'My soul has grown deep like the rivers.',
    ].join('\n'));
    expect(MENTOR_POEM.credit).toContain('The Crisis, June 1921');
  });
});
