import { JARS } from '@/app/exhibitions/egypt/mummification/steps';
import {
  ALL_PASSES,
  CHOICE_STEPS,
  NATRON_PLACES,
  PASSES,
  RUB_NEEDED,
  STEP_ORDER,
  TOOLS,
  ZONES,
  canTuck,
  coated,
  jarOrder,
  judgeBrain,
  judgeEntry,
  judgeJar,
  judgeTool,
  natronResult,
  passX,
  rubInto,
  shelfAt,
  toolFor,
  wrapState,
  zoneAt,
} from '@/app/exhibitions/egypt/mummification/mummyGame';

/*
 * The rules of the mummification room (mummyGame.ts): each step is a real
 * decision or a gesture that has to be done properly, a mistake is caught
 * with a hint, and a second mistake shows the way.
 */

describe('What comes next?', () => {
  it('has one tool for each step, in the order of the seventy days', () => {
    expect(TOOLS.map((t) => t.step)).toEqual(STEP_ORDER.filter((s) => s !== 'organs'));
    expect(CHOICE_STEPS).toEqual(['brain', 'gods', 'natron', 'oils', 'wrap']);
  });

  it('keeps only the tools still to come on the shelf, so later choices narrow down', () => {
    expect(shelfAt('brain').map((t) => t.id)).toEqual(['hook', 'jars', 'natron', 'oil', 'linen', 'coffin']);
    expect(shelfAt('wrap').map((t) => t.id)).toEqual(['linen', 'coffin']);
    for (const s of CHOICE_STEPS) expect(shelfAt(s)).toContain(toolFor(s));
  });

  it('says why not yet for a wrong tool, and shows the right one after two wrong picks', () => {
    expect(judgeTool('natron', 'natron', 0)).toMatchObject({ ok: true });
    const first = judgeTool('brain', 'linen', 0);
    expect(first).toMatchObject({ ok: false, showRight: false });
    expect(first.message).toMatch(/^Not yet\./);
    const second = judgeTool('brain', 'coffin', 1);
    expect(second.showRight).toBe(true);
    expect(second.message).toMatch(/Try a long bronze hook/);
  });
});

describe('The brain', () => {
  it('goes out through the nose only, and is not kept', () => {
    expect(judgeEntry('nose', 0).ok).toBe(true);
    expect(judgeEntry('ear', 0)).toEqual({ ok: false, message: 'Not through the ear. Try another way in.' });
    expect(judgeEntry('crown', 1).message).toMatch(/through the nose/);
    expect(judgeBrain('basket').ok).toBe(true);
    expect(judgeBrain('jar').ok).toBe(false);
  });
});

describe('The jars', () => {
  it('stand in a new order for the challenge, never the order the gods were met in', () => {
    for (const seed of [null, 1, 2, 3, 42, 99, 1234, 0xffffffff]) {
      const order = jarOrder(seed);
      expect([...order].sort((a, b) => a.god.localeCompare(b.god))).toEqual([...JARS].sort((a, b) => a.god.localeCompare(b.god)));
      expect(order.map((j) => j.god)).not.toEqual(JARS.map((j) => j.god));
    }
  });

  it('takes each organ to its own god, teaches from a wrong jar, then shows the way, and keeps the heart in', () => {
    for (const j of JARS) expect(judgeJar(j.organ as never, j.god, 0).ok).toBe(true);
    const wrong = judgeJar('liver', 'Hapi', 0);
    expect(wrong).toMatchObject({ ok: false, kind: 'wrong', reveal: null });
    expect(wrong.message).toBe('That is Hapi’s jar, the baboon. Hapi guards the lungs, not the liver. Try another jar.');
    expect(judgeJar('liver', 'Hapi', 1)).toMatchObject({ ok: false, reveal: 'Imset' });
    expect(judgeJar('heart', 'Imset', 0)).toMatchObject({ ok: false, kind: 'heart' });
  });
});

describe('The natron', () => {
  it('must cover every part of the body, inside and out, or it is still damp', () => {
    expect(NATRON_PLACES).toEqual(['head', 'chest', 'belly', 'hips', 'legs', 'feet', 'inside']);
    expect(natronResult(NATRON_PLACES).dry).toBe(true);
    const outsideOnly = natronResult(ZONES.map((z) => z.id));
    expect(outsideOnly.dry).toBe(false);
    expect(outsideOnly.message).toMatch(/still damp: inside the body\./);
    expect(natronResult(['head']).message).toMatch(/the chest, the belly, the hips, the legs, the feet and inside the body/);
  });
});

describe('The oils', () => {
  it('coat each part only when it is rubbed, and the body only when every part is', () => {
    expect(zoneAt(200)).toBe(0);
    expect(zoneAt(600)).toBe(5);
    expect(zoneAt(100)).toBe(-1);
    let c = ZONES.map(() => 0);
    c = rubInto(c, 2, RUB_NEEDED / 2);
    expect(c[2]).toBeCloseTo(0.5);
    c = rubInto(c, 2, RUB_NEEDED);
    expect(c[2]).toBe(1);
    expect(coated(c)).toBe(false);
    expect(coated(ZONES.map(() => 1))).toBe(true);
    expect(rubInto(c, -1, 999)).toEqual(c);
  });
});

describe('The linen', () => {
  it('goes round the body pass by pass, head to feet then back, and waits for an amulet between the layers', () => {
    expect(passX(0)).toBeLessThan(passX(PASSES - 1));
    expect(passX(PASSES)).toBe(passX(PASSES - 1));
    expect(passX(ALL_PASSES - 1)).toBe(passX(0));
    expect(wrapState(0, 0)).toEqual({ layers: 0, pass: 0, waitsForAmulet: false, done: false });
    expect(wrapState(PASSES, 0).waitsForAmulet).toBe(true);
    expect(wrapState(PASSES, 1).waitsForAmulet).toBe(false);
    expect(wrapState(ALL_PASSES, 1).done).toBe(true);
    expect(canTuck(PASSES - 1, 0)).toBe(false);
    expect(canTuck(PASSES, 0)).toBe(true);
    expect(canTuck(PASSES + 1, 1)).toBe(false);
    expect(canTuck(PASSES, 4)).toBe(false);
  });
});
