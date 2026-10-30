import { FLOORS, STUDIO_TOOLS, findExhibition } from '@/lib/floors';
import {
  GLOW_ALPHA,
  HALL_DARK,
  HALL_HINT,
  TICKET_PAPER,
  atFloor,
  behindTitle,
  contrast,
  hallBackground,
  hallBody,
  hallText,
  readable,
  ticketText,
} from '@/lib/hallLight';

/*
 * The hallway's light: strong enough that the corridor takes on each
 * exhibition's color, never so bright that a word on it stops reading at
 * WCAG AA (4.5:1), and never lighting the corridor itself.
 */

const EXHIBITIONS = FLOORS.flatMap((f) => f.exhibitions);
const AA = 4.5;

describe('the hallway light', () => {
  it("gives every exhibition a glow and a bloom of its own colors", () => {
    for (const e of EXHIBITIONS) {
      expect(e.hall.glow).toMatch(/^#[0-9a-f]{6}$/i);
      expect(e.hall.bloom).toMatch(/^#[0-9a-f]{6}$/i);
    }
    expect(findExhibition('black-history')?.hall.glow).toBe('#EC4899');
    expect(findExhibition('in-their-hands')?.hall.glow).toBe('#C9A84C');
  });

  it('is several times stronger than the old faint tint (0x20 of the accent), and fades out before the walls', () => {
    expect(GLOW_ALPHA).toBeGreaterThanOrEqual(3 * (0x20 / 255));
    const bg = hallBackground(EXHIBITIONS[0].hall);
    expect(bg.match(/radial-gradient/g)).toHaveLength(3);
    // Every gradient ends fully transparent: the corridor stays dark.
    for (const g of bg.split('radial-gradient').slice(1)) expect(g).toMatch(/, 0\) \d+%\)/);
  });

  it('keeps the title, kicker and subtitle readable on the glow at its brightest', () => {
    for (const e of EXHIBITIONS) {
      const bg = behindTitle(e.hall);
      expect(contrast('#fafafa', bg)).toBeGreaterThanOrEqual(AA);
      expect(contrast(hallText(e.accent, e.hall), bg)).toBeGreaterThanOrEqual(AA);
    }
  });

  it("keeps each Studio tool's line readable on its exhibition's glow", () => {
    for (const t of STUDIO_TOOLS) {
      const { hall } = findExhibition(t.exhibition)!;
      expect(contrast(hallBody(hall), behindTitle(hall))).toBeGreaterThanOrEqual(AA);
    }
  });

  it('keeps "Swipe to explore" readable on every bloom, and every ticket\'s call on its paper', () => {
    for (const e of EXHIBITIONS) {
      expect(contrast(HALL_HINT, atFloor(e.hall))).toBeGreaterThanOrEqual(AA);
      expect(contrast(ticketText(e.accent), TICKET_PAPER)).toBeGreaterThanOrEqual(AA);
    }
  });

  it('leaves a color alone when it already reads, and moves it the right way when not', () => {
    expect(readable('#fafafa', HALL_DARK)).toBe('#fafafa');
    expect(contrast(readable('#1D3557', HALL_DARK), HALL_DARK)).toBeGreaterThanOrEqual(AA);
    expect(contrast(readable('#a8d5e5', TICKET_PAPER), TICKET_PAPER)).toBeGreaterThanOrEqual(AA);
  });
});
