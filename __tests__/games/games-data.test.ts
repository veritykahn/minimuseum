import { HANDS_CHARACTERS, TIERS as HANDS_TIERS, buildRounds } from '@/app/exhibitions/in-their-hands/hands/data';
import { OWN_CASE, ROUNDS, TIERS as RR_TIERS, fakeSides } from '@/app/exhibitions/in-their-hands/real-or-replica/data';
import { ALL_INSTRUMENT_IDS, INSTRUMENTS, QUIZ_TIERS, SECTIONS } from '@/app/exhibitions/harlem-renaissance/jazz-lab/data';
import { bandVolume, generateRounds, instrumentBreakdown, missedRounds, type QuizRecord } from '@/app/exhibitions/harlem-renaissance/jazz-lab/hooks';
import { mulberry32, tierFor } from '@/components/games/scoring';

describe('Hands of History', () => {
  it('builds the same rounds from the same seed', () => {
    expect(buildRounds(123).map((r) => r.character.id)).toEqual(buildRounds(123).map((r) => r.character.id));
  });

  it('plays every character once, each with four distinct names including the answer', () => {
    for (const seed of [1, 2, 3, 99, 4096]) {
      const rounds = buildRounds(seed);
      expect(rounds.map((r) => r.character.id).sort()).toEqual(HANDS_CHARACTERS.map((c) => c.id).sort());
      for (const r of rounds) {
        expect(r.options).toHaveLength(4);
        expect(new Set(r.options.map((o) => o.id)).size).toBe(4);
        expect(r.options).toContain(r.character);
      }
    }
  });

  it('gives every character a clue and only the Mother a teacher note', () => {
    for (const c of HANDS_CHARACTERS) expect(c.clue.length).toBeGreaterThan(20);
    expect(HANDS_CHARACTERS.filter((c) => c.teacherNote).map((c) => c.character)).toEqual(['The Mother']);
  });

  it('only says "You know these hands" for a perfect score', () => {
    expect(tierFor(7, 7, HANDS_TIERS).title).toBe('You know these hands.');
    expect(tierFor(6, 7, HANDS_TIERS).title).not.toBe('You know these hands.');
    expect(tierFor(0, 7, HANDS_TIERS).title).toBe('These hands kept their secrets.');
  });
});

describe('Real or Replica?', () => {
  it('places the fakes from a seed, repeatably', () => {
    expect(fakeSides(5, 5)).toEqual(fakeSides(5, 5));
    expect(fakeSides(5, 5).every((s) => s === 'a' || s === 'b')).toBe(true);
  });

  it('never calls a zero score a numismatist', () => {
    expect(tierFor(5, 5, RR_TIERS).title).toBe('You are now a numismatist.');
    expect(tierFor(0, 5, RR_TIERS).title).not.toMatch(/numismatist/);
    expect(tierFor(4, 5, RR_TIERS).title).not.toMatch(/numismatist/);
  });

  it('keeps every callout on its photograph and its words in the explanation', () => {
    for (const r of ROUNDS) {
      expect(r.callouts.length).toBeGreaterThan(0);
      for (const c of r.callouts) {
        expect(c.x).toBeGreaterThanOrEqual(0);
        expect(c.x).toBeLessThanOrEqual(1);
        expect(c.y).toBeGreaterThanOrEqual(0);
        expect(c.y).toBeLessThanOrEqual(1);
      }
    }
  });

  it('uses US spellings', () => {
    const text = ROUNDS.map((r) => r.explanation).join(' ');
    expect(text).not.toMatch(/mould|centre|grey|travelled|different to/i);
  });

  it('shows the museum’s three replicas, straight from the coin data', () => {
    expect(OWN_CASE.map((c) => c.id).sort()).toEqual(['antipas', 'shekel', 'tribute-penny']);
    for (const c of OWN_CASE) expect(c.why).toMatch(/exceptional rarity; this is a museum-quality replica\.$/);
  });
});

describe('Jazz Lab', () => {
  it('deals twelve rounds, two per instrument, never the same instrument twice running', () => {
    for (let seed = 1; seed <= 25; seed++) {
      const rounds = generateRounds(mulberry32(seed));
      expect(rounds).toHaveLength(12);
      for (const id of ALL_INSTRUMENT_IDS) expect(rounds.filter((r) => r.correctAnswer === id)).toHaveLength(2);
      expect(new Set(rounds.map((r) => r.audioSrc)).size).toBe(12);
      for (let i = 1; i < rounds.length; i++) expect(rounds[i].correctAnswer).not.toBe(rounds[i - 1].correctAnswer);
    }
  });

  it('replays only the missed rounds and tallies by instrument', () => {
    const rounds = generateRounds(mulberry32(3));
    const records: QuizRecord[] = rounds.map((round, i) => ({
      round,
      chosen: i % 3 === 0 ? 'piano' : round.correctAnswer,
      correct: i % 3 === 0 ? round.correctAnswer === 'piano' : true,
    }));
    const missed = missedRounds(records, mulberry32(1));
    expect(missed.map((r) => r.id).sort()).toEqual(records.filter((r) => !r.correct).map((r) => r.round.id).sort());
    const rows = instrumentBreakdown(records, ALL_INSTRUMENT_IDS);
    expect(rows.reduce((n, r) => n + r.total, 0)).toBe(12);
    expect(rows.reduce((n, r) => n + r.correct, 0)).toBe(records.filter((r) => r.correct).length);
  });

  it('keeps the original rating names at the original thresholds', () => {
    expect(tierFor(12, 12, QUIZ_TIERS).title).toBe('Jazz Master');
    expect(tierFor(10, 12, QUIZ_TIERS).title).toBe('Jazz Aficionado');
    expect(tierFor(7, 12, QUIZ_TIERS).title).toBe('Bandstand Regular');
    expect(tierFor(4, 12, QUIZ_TIERS).title).toBe('Jazz Newcomer');
    expect(tierFor(3, 12, QUIZ_TIERS).title).toBe('First Night at the Club');
  });

  it('has a listening tip for every instrument and a sentence for every section', () => {
    for (const i of INSTRUMENTS) expect(i.tip).toMatch(new RegExp(i.name === 'Double Bass' ? 'double bass' : i.name, 'i'));
    for (const s of SECTIONS) expect(s.description.length).toBeGreaterThan(20);
  });

  it('puts the soloist up front and the band even without one', () => {
    expect(bandVolume('piano', 'piano')).toBe(1);
    expect(bandVolume('drums', 'piano')).toBe(0.4);
    expect(bandVolume('drums', null)).toBe(0.7);
  });
});

