import type { Fallen, Resting } from './fallen';

/*
 * "Remember a soldier": drawing a card, searching the pool, and the words on
 * the card. Plain functions, so they work the same for five records or for
 * many thousands, and can be tested without a browser.
 */

/* ───────── Drawing a card ───────── */

export type Picker = {
  /** The index of the next soldier. No index comes back until every other has been drawn. */
  next: () => number;
  /** How many are left before the pool starts over. */
  remaining: () => number;
};

/**
 * A shuffled bag of the indices 0..size-1. Each draw takes one from the bag;
 * when the bag is empty it is refilled and shuffled again, and the first draw
 * of the new round is never the last draw of the old one (when size > 1).
 * Memory is one Int32Array of the pool's size.
 */
export function createPicker(size: number, random: () => number = Math.random): Picker {
  const bag = new Int32Array(Math.max(0, size));
  let left = 0;
  let last = -1;

  const refill = () => {
    for (let i = 0; i < size; i++) bag[i] = i;
    // Fisher–Yates; draws come off the end.
    for (let i = size - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      const t = bag[i];
      bag[i] = bag[j];
      bag[j] = t;
    }
    left = size;
    if (size > 1 && bag[left - 1] === last) {
      const t = bag[left - 1];
      bag[left - 1] = bag[0];
      bag[0] = t;
    }
  };

  return {
    next() {
      if (size <= 0) return -1;
      if (left === 0) refill();
      left -= 1;
      last = bag[left];
      return last;
    },
    remaining: () => left,
  };
}

/* ───────── Searching ───────── */

const STATES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut',
  DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana',
  NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah',
  VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  PR: 'Puerto Rico', PH: 'Philippines',
};

/** Lower case, accents and punctuation gone, spaces single. */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * The search index: one short string per soldier ("name|state"), in pool
 * order. Built once; a search is a single pass over plain strings, which is
 * quick for tens of thousands of rows.
 */
export type SearchIndex = { names: string[]; states: string[] };

export function buildIndex(pool: readonly Fallen[]): SearchIndex {
  const names = new Array<string>(pool.length);
  const states = new Array<string>(pool.length);
  for (let i = 0; i < pool.length; i++) {
    // Unknown soldiers are drawn, but there is no name to search for.
    names[i] = pool[i].unknown ? '' : normalize(pool[i].name);
    states[i] = normalize(pool[i].enteredServiceFrom ?? '');
  }
  return { names, states };
}

/**
 * Indices of the soldiers matching the query, best first, at most `limit`.
 * Every word of the query must appear in the name or the state; a two-letter
 * postal code ("NJ") or a whole state name matches the state. Names that
 * start with the query come first.
 */
export function search(index: SearchIndex, query: string, limit = 12): number[] {
  const q = normalize(query);
  if (!q) return [];
  const code = STATES[query.trim().toUpperCase()];
  const stateQ = code ? normalize(code) : null;

  const first: number[] = [];
  const rest: number[] = [];
  const words = q.split(' ');
  const n = index.names.length;
  for (let i = 0; i < n && first.length < limit; i++) {
    const name = index.names[i];
    const state = index.states[i];
    if (stateQ !== null) {
      // "Al" may be Alabama or the start of "Alvin": both come first.
      if (state === stateQ || name.startsWith(q) || name.includes(' ' + q)) first.push(i);
      else if (name.includes(q) && rest.length < limit) rest.push(i);
      continue;
    }
    let ok = true;
    for (const w of words) {
      if (!name.includes(w) && !state.includes(w)) { ok = false; break; }
    }
    if (!ok) continue;
    if (name.startsWith(q) || name.includes(' ' + q) || state === q) first.push(i);
    else if (rest.length < limit) rest.push(i);
  }
  return first.concat(rest).slice(0, limit);
}

/* ───────── The words on the card ───────── */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "1918-11-11" → "November 11, 1918". Anything else is returned as written. */
export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const month = MONTHS[Number(m[2]) - 1];
  if (!month) return iso;
  return `${month} ${Number(m[3])}, ${m[1]}`;
}

/** Where he rests, in two lines: the place, then the plot (or the tablets). */
export function restingLines(r: Resting): { lead: string; place: string; plot?: string } {
  if (r.kind === 'missing') {
    return { lead: 'Named on the Tablets of the Missing', place: r.cemetery };
  }
  const parts = [r.plot && `Plot ${r.plot}`, r.row && `Row ${r.row}`, r.grave && `Grave ${r.grave}`].filter(Boolean);
  return { lead: 'Rests in', place: r.cemetery, plot: parts.length ? parts.join(' · ') : undefined };
}

/** "Corporal · South Carolina · September 28, 1918", for the search results. */
export function summary(f: Fallen): string {
  return [f.rank, f.enteredServiceFrom, f.dateOfDeath && formatDate(f.dateOfDeath)].filter(Boolean).join(' · ');
}

/** What the live region says when a card is drawn or chosen. */
export function announcement(f: Fallen): string {
  if (f.unknown) return `Remembering an unknown soldier, known but to God, who rests in ${f.resting.cemetery}.`;
  const who = [f.rank, f.name].filter(Boolean).join(' ');
  const from = f.enteredServiceFrom ? `, of ${f.enteredServiceFrom}` : '';
  const date = f.dateOfDeath && formatDate(f.dateOfDeath);
  const when = f.status ? [f.status, date].filter(Boolean).join(', ') : date ? `Died ${date}` : '';
  return `Remembering ${who}${from}.${when ? ` ${when}.` : ''}`;
}
