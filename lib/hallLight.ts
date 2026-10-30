/**
 * The light in a floor's hallway. The corridor is dark; behind each
 * exhibition's title glows that exhibition's own color, and a second color
 * rises from the floor, both taken from its landing page and display case,
 * so the hallway takes on each exhibition as you swipe to it (FloorPage
 * cross-fades one into the next).
 *
 * Every color the hallway sets its words in is checked here against the
 * brightest the glow gets behind them, and lightened (on the dark) or
 * darkened (on the ticket) until it reads at WCAG AA, 4.5:1.
 */

export type HallLight = {
  /** Behind the title. */
  glow: string;
  /** Rising from the floor. */
  bloom: string;
};

/** The corridor. */
export const HALL_DARK = '#0a0a0a';
/** The ticket's paper. */
export const TICKET_PAPER = '#faf8f5';

/** How strongly each light shows at its brightest. */
export const GLOW_ALPHA = 0.42;
export const BLOOM_ALPHA = 0.3;

type Rgb = [number, number, number];

function rgb(hex: string): Rgb {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as Rgb;
}

const hex = (c: Rgb) => `#${c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')}`;

const rgba = (color: string, alpha: number) => `rgba(${rgb(color).join(', ')}, ${alpha})`;

/** `top` laid over `under` at this alpha. */
export function over(top: string, alpha: number, under: string): string {
  const a = rgb(top);
  const b = rgb(under);
  return hex([0, 1, 2].map((i) => a[i] * alpha + b[i] * (1 - alpha)) as Rgb);
}

function luminance(color: string): number {
  const [r, g, b] = rgb(color).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** The WCAG contrast ratio between two colors. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * The color as it is, if it reads on this ground at `min`; otherwise moved
 * a step at a time toward white (on a dark ground) or black (on a light
 * one) until it does, so it stays recognisably the exhibition's.
 */
export function readable(color: string, ground: string, min = 4.5): string {
  const toward = luminance(ground) < 0.18 ? '#ffffff' : '#000000';
  for (let t = 0; t <= 1; t += 0.05) {
    const c = over(toward, t, color);
    if (contrast(c, ground) >= min) return c;
  }
  return toward;
}

/** How strongly the glow's wash tints the whole corridor. */
const WASH_ALPHA = 0.08;

/** The brightest the hallway gets behind an exhibition's words: the glow at its strongest, on its wash. */
export function behindTitle(light: HallLight): string {
  return over(light.glow, GLOW_ALPHA, over(light.glow, WASH_ALPHA, HALL_DARK));
}

/** The exhibition's color for words in its hallway: its kicker and subtitle. */
export function hallText(accent: string, light: HallLight): string {
  return readable(accent, behindTitle(light));
}

/** A Studio tool's line about what you make: a warm grey, lightened where the glow is bright. */
export function hallBody(light: HallLight): string {
  return readable('#c9c4bb', behindTitle(light));
}

/** The brightest the hallway gets at its foot, where "Swipe to explore" sits: the bloom at its strongest. */
export function atFloor(light: HallLight): string {
  return over(light.bloom, BLOOM_ALPHA, HALL_DARK);
}

/** "Swipe to explore": light enough to read on any exhibition's bloom. */
export const HALL_HINT = '#c8c8c8';

/** The exhibition's color for the call on its ticket ("Enter Exhibition"). */
export function ticketText(accent: string): string {
  return readable(accent, TICKET_PAPER);
}

/**
 * The hallway's light for one exhibition, as a CSS background: the glow
 * behind the title, fading out well before the walls; a faint wash of it
 * across the whole corridor; and the bloom rising from the floor.
 */
export function hallBackground(light: HallLight): string {
  return [
    `radial-gradient(ellipse 60% 48% at 50% 46%, ${rgba(light.glow, GLOW_ALPHA)} 0%, ${rgba(light.glow, GLOW_ALPHA * 0.5)} 38%, ${rgba(light.glow, 0)} 72%)`,
    `radial-gradient(ellipse 130% 55% at 50% 108%, ${rgba(light.bloom, BLOOM_ALPHA)} 0%, ${rgba(light.bloom, BLOOM_ALPHA * 0.35)} 45%, ${rgba(light.bloom, 0)} 75%)`,
    `radial-gradient(ellipse 110% 90% at 50% 40%, ${rgba(light.glow, WASH_ALPHA)} 0%, ${rgba(light.glow, 0)} 85%)`,
  ].join(', ');
}
