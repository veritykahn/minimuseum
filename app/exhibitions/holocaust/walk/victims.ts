import type { FactSource } from '@/components/exhibition/FactNote';
import RECORDS from './victims.json';
import { WALK_NAMES } from './walkNames';

/*
 * The names on the walk: children murdered in the Holocaust, one at a time
 * ahead of the visitor as they walk, each with their age, the year they
 * died and where, as their own record gives them, and that record in the
 * walk's Sources drawer.
 *
 * They come from victims.json, an array of
 *   { id, name, age, died, place, source: { label, href } }
 * built from real records. It is read here, not trusted: an entry without
 * an id, a name or a source with a link is left out, an id seen before is
 * left out, and age and died may be given as numbers or as text. While the
 * file is empty, the walk's first seven children stand in (walkNames.ts),
 * with what is known of them: name and age.
 *
 * Each walk draws a fresh set (drawWalkNames), avoiding the names this
 * browser has already been shown on the walk (kept in localStorage; where
 * there is none, every walk starts fresh). When every name has been shown,
 * it starts again from the beginning of the list.
 */

export type Victim = {
  id: string;
  name: string;
  /** Their age when they died, as their record gives it. */
  age: string | null;
  /** The year they died. */
  died: string | null;
  /** Where they died. */
  place: string | null;
  source: FactSource;
};

const text = (v: unknown): string | null => {
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  if (typeof v === 'string' && v.trim()) return v.trim();
  return null;
};

/** The records, as the walk can use them: each with an id, a name and a linked source; each id once. */
export function readVictims(data: unknown): Victim[] {
  if (!Array.isArray(data)) return [];
  const seen = new Set<string>();
  const out: Victim[] = [];
  for (const r of data as Record<string, unknown>[]) {
    if (!r || typeof r !== 'object') continue;
    const id = text(r.id);
    const name = text(r.name);
    const src = r.source as Record<string, unknown> | undefined;
    const label = text(src?.label);
    const href = text(src?.href);
    if (!id || !name || !label || !href || !/^https?:\/\//.test(href) || seen.has(id)) continue;
    seen.add(id);
    out.push({ id, name, age: text(r.age), died: text(r.died), place: text(r.place), source: { label, href } });
  }
  return out;
}

/** victims.json, read. */
export const VICTIMS: readonly Victim[] = readVictims(RECORDS);

/** The seven children who stand in while victims.json is empty: name and age, as walkNames.ts has them. */
export const FALLBACK_VICTIMS: readonly Victim[] = WALK_NAMES.map((n) => ({ id: n.id, name: n.name, age: n.age, died: null, place: null, source: n.source }));

/** The names the walk draws from: the records, or the seven while there are none. */
export const walkPool = (records: readonly Victim[] = VICTIMS): readonly Victim[] => (records.length > 0 ? records : FALLBACK_VICTIMS);

/** When and where they died, as far as it is known: "died 1944, Auschwitz"; null if neither is. REVIEW (Verity): the format. */
export function victimDeath(v: Victim): string | null {
  if (v.died && v.place) return `died ${v.died}, ${v.place}`;
  if (v.died) return `died ${v.died}`;
  if (v.place) return `died in ${v.place}`;
  return null;
}

/** A name as it is read out, and listed in the Sources drawer: "Hana Brady, 13 · died 1944, Auschwitz". */
export function victimText(v: Victim): string {
  const death = victimDeath(v);
  return `${v.name}${v.age ? `, ${v.age}` : ''}${death ? ` · ${death}` : ''}`;
}

/** Where this browser keeps the ids of the names the walk has shown. */
export const SHOWN_KEY = 'mm-ho-walk-shown';

export function loadShown(): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(SHOWN_KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function saveShown(ids: readonly string[]) {
  try {
    window.localStorage.setItem(SHOWN_KEY, JSON.stringify(ids));
  } catch {
    // A private window: the next walk simply starts fresh.
  }
}

function shuffled<T>(list: readonly T[], random: () => number): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * A fresh set of `count` names for one walk (never more than the pool
 * holds, each once), taken first from those not yet `shown`; when those run
 * out, the list starts again, and what is remembered as shown starts again
 * with this walk's own. Returns the names, in the order they will come, and
 * the ids to remember as shown.
 */
export function drawWalkNames(pool: readonly Victim[], count: number, shown: readonly string[], random: () => number = Math.random): { names: Victim[]; shown: string[] } {
  const n = Math.max(0, Math.min(count, pool.length));
  const before = new Set(shown);
  const fresh = shuffled(pool.filter((v) => !before.has(v.id)), random);
  if (fresh.length >= n) {
    const names = fresh.slice(0, n);
    return { names, shown: [...shown.filter((id) => pool.some((v) => v.id === id)), ...names.map((v) => v.id)] };
  }
  // Every name has been shown: the rest of the fresh ones, then the list from the beginning again.
  const taken = new Set(fresh.map((v) => v.id));
  const again = shuffled(pool.filter((v) => !taken.has(v.id)), random).slice(0, n - fresh.length);
  const names = [...fresh, ...again];
  return { names, shown: names.map((v) => v.id) };
}
