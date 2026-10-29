import { KEEPSAKE_IDS, type KeepsakeId } from './Keepsake';

/*
 * A timeline of your own: an important woman in the visitor's life (a
 * grandmother, a mother, an aunt, a teacher), set out as Violet's is, a
 * thread of keepsakes with a place and a memory at each. The visitor's
 * words stay in this browser (localStorage, for coming back to); a
 * photograph is kept only while the page is open, never stored or sent
 * anywhere. Nothing here reaches a server.
 *
 * The questions are prompts only, in the spirit of poster 2's last
 * paragraph (resilience, humor and hard work; everyday sacrifices and
 * triumphs). They make no claims.
 */

export const OWN_KEY = 'whv-own-timeline';
/** Her card, then up to eleven moments. */
export const MAX_STOPS = 11;
export const LIMITS = { name: 60, relation: 40, when: 24, place: 48, memory: 280 } as const;

export const PROMPTS = [
  'Where did she grow up?',
  'What work did she do?',
  'What did she make, grow or mend?',
  'What made her laugh?',
  'What hard time did she get through?',
  'What music did she love?',
  'What did she teach you?',
  'What would you like people to remember about her?',
] as const;

export type OwnStop = {
  id: string;
  /** A year or an age: "1962", "At 14". */
  when: string;
  place: string;
  memory: string;
  keepsake: KeepsakeId;
  /** A photograph from the visitor's device, as a data URL: kept in memory only. */
  photo?: string;
};

export type OwnTimeline = {
  name: string;
  /** Who she is to the visitor: "My grandmother". */
  relation: string;
  /** Her own photograph, on her card (memory only). */
  photo?: string;
  stops: OwnStop[];
};

let seq = 0;
export const newStopId = () => `s${Date.now().toString(36)}${(seq++).toString(36)}`;

/** The keepsakes a new stop is given in turn, before the visitor picks one. */
const START_KEEPSAKES: KeepsakeId[] = ['house', 'machine', 'rose', 'piano', 'certificate', 'coat', 'radio', 'rings', 'cauliflower', 'window', 'rabbit'];

export function blankStop(i: number): OwnStop {
  return { id: newStopId(), when: '', place: '', memory: '', keepsake: START_KEEPSAKES[i % START_KEEPSAKES.length] };
}

export function emptyTimeline(): OwnTimeline {
  return { name: '', relation: '', stops: [blankStop(0)] };
}

/** The question beside stop `i` (0 is the first moment after her card). */
export function promptFor(i: number, turn = 0): string {
  return PROMPTS[(((i + turn) % PROMPTS.length) + PROMPTS.length) % PROMPTS.length];
}

export function addStop(t: OwnTimeline, after: number): OwnTimeline {
  if (t.stops.length >= MAX_STOPS) return t;
  const stops = t.stops.slice();
  stops.splice(after + 1, 0, blankStop(t.stops.length));
  return { ...t, stops };
}

export function removeStop(t: OwnTimeline, i: number): OwnTimeline {
  if (t.stops.length <= 1 || i < 0 || i >= t.stops.length) return t;
  return { ...t, stops: t.stops.filter((_, j) => j !== i) };
}

export function updateStop(t: OwnTimeline, i: number, patch: Partial<Omit<OwnStop, 'id'>>): OwnTimeline {
  return { ...t, stops: t.stops.map((s, j) => (j === i ? { ...s, ...patch } : s)) };
}

/** A stop's short name, for its keepsake on the thread and for screen readers. */
export function stopLabel(s: OwnStop, i: number): string {
  const bits = [s.when.trim(), s.place.trim()].filter(Boolean);
  return bits.length ? bits.join(', ') : `Moment ${i + 1}`;
}

const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.slice(0, n) : '');

/** What is kept in this browser: the words and keepsakes, never the photographs. */
export function serialize(t: OwnTimeline): string {
  return JSON.stringify({
    name: t.name,
    relation: t.relation,
    stops: t.stops.map(({ id, when, place, memory, keepsake }) => ({ id, when, place, memory, keepsake })),
  });
}

/** Read back what serialize wrote, trusting nothing in it. */
export function parse(raw: string | null): OwnTimeline | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as Record<string, unknown>;
    if (!d || typeof d !== 'object' || !Array.isArray(d.stops)) return null;
    const stops = (d.stops as Record<string, unknown>[]).slice(0, MAX_STOPS).map((s, i) => ({
      id: typeof s?.id === 'string' && s.id ? s.id.slice(0, 32) : newStopId(),
      when: clip(s?.when, LIMITS.when),
      place: clip(s?.place, LIMITS.place),
      memory: clip(s?.memory, LIMITS.memory),
      keepsake: KEEPSAKE_IDS.includes(s?.keepsake as KeepsakeId) ? (s.keepsake as KeepsakeId) : blankStop(i).keepsake,
    }));
    return { name: clip(d.name, LIMITS.name), relation: clip(d.relation, LIMITS.relation), stops: stops.length ? stops : [blankStop(0)] };
  } catch {
    return null;
  }
}

/** The file name for "Save as image": her name, or "timeline". */
export function imageFileName(t: OwnTimeline): string {
  const slug = t.name.trim().toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 40);
  return `${slug || 'my'}-timeline.png`;
}

/**
 * A photograph from the visitor's device, made smaller (no side over `max`
 * px) and returned as a data URL. It is read here, in the browser, and goes
 * nowhere else.
 */
export function shrinkPhoto(file: File, max = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(img.naturalWidth * k));
      c.height = Math.max(1, Math.round(img.naturalHeight * k));
      const g = c.getContext('2d');
      URL.revokeObjectURL(url);
      if (!g) return reject(new Error('no canvas'));
      g.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/jpeg', 0.86));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('not an image'));
    };
    img.src = url;
  });
}
