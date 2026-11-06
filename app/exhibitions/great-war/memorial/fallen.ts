/*
 * The fallen: one entry per American serviceman or woman of the Great War, in
 * the shape of a record of the American Battle Monuments Commission (ABMC).
 * These are the cards of "Remember a soldier".
 *
 * ABMC keeps the records of those who rest in its cemeteries overseas or are
 * named on its Tablets of the Missing; every card comes from one of them.
 */

/** The branch of service as ABMC records it. */
export type ServiceBranch =
  | 'U.S. Army'
  | 'U.S. Marine Corps'
  | 'U.S. Navy'
  | 'U.S. Coast Guard'
  // Any other wording a record uses, kept as written.
  | (string & {});

/** How the record says he died, or that he was lost. */
export type FallenStatus =
  | 'Killed in Action'
  | 'Died of Wounds'
  | 'Died of Disease'
  | 'Died'
  | 'Missing in Action'
  | 'Lost at Sea'
  | (string & {});

/** Where he rests: a grave in an ABMC cemetery, or his name on the Tablets of the Missing. */
export type Resting =
  | { kind: 'grave'; cemetery: string; plot?: string; row?: string; grave?: string }
  | { kind: 'missing'; cemetery: string };

export type Fallen = {
  /** Stable and unique, e.g. a slug of the name (and service number if needed). */
  id: string;
  /** As the record gives it, e.g. "Freddie Stowers". */
  name: string;
  rank?: string;
  /** Company, regiment and division as recorded, e.g. "Company C, 371st Infantry Regiment, 93rd Division". */
  unit?: string;
  branch?: ServiceBranch;
  /** The state he entered the service from, written out, e.g. "South Carolina". */
  enteredServiceFrom?: string;
  /** ISO date, YYYY-MM-DD. Unknown soldiers have none. */
  dateOfDeath?: string;
  /** Only where the record gives one: ABMC records missing status, not the cause of death. */
  status?: FallenStatus;
  /** A grave whose soldier is "known but to God": no name, rank or date on the record. */
  unknown?: true;
  awards?: string[];
  resting: Resting;
  source: 'ABMC';
};

/** Where the pool is served from, packed (decodeFallen). */
export const FALLEN_SRC = '/exhibitions/great-war/memorial/fallen.json';

/**
 * The pool as it is served: each rank, unit, branch, state and cemetery
 * written once, in a table, and each soldier one short row of
 * [id suffix, name, rank, unit, branch, state, date, cemetery, plot, row,
 * grave, flags], with -1 or "" where the record has nothing (flags: 1 named
 * on the Tablets of the Missing, 2 an unknown soldier).
 */
export type PackedFallen = {
  v: 1;
  source: 'ABMC';
  count: number;
  rank: string[];
  unit: string[];
  branch: string[];
  state: string[];
  cemetery: string[];
  rows: [string, string, number, number, number, number, string, number, string, string, string, number][];
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** The packed pool back into cards: only what each record says, nothing added. */
export function decodeFallen(p: PackedFallen): Fallen[] {
  const at = (table: string[], i: number) => (i >= 0 ? table[i] : undefined);
  return p.rows.map(([suffix, name, rank, unit, branch, state, date, cem, plot, row, grave, flags]) => {
    const cemetery = p.cemetery[cem];
    const missing = (flags & 1) !== 0;
    const resting: Resting = missing
      ? { kind: 'missing', cemetery }
      : { kind: 'grave', cemetery, ...(plot ? { plot } : {}), ...(row ? { row } : {}), ...(grave ? { grave } : {}) };
    if (flags & 2) return { id: `unknown-${suffix}`, name: 'An Unknown Soldier', unknown: true, resting, source: 'ABMC' };
    const f: Fallen = { id: `${slug(name)}-${suffix}`, name, resting, source: 'ABMC' };
    const r = at(p.rank, rank);
    const u = at(p.unit, unit);
    const b = at(p.branch, branch);
    const s = at(p.state, state);
    if (r) f.rank = r;
    if (u) f.unit = u;
    if (b) f.branch = b;
    if (s) f.enteredServiceFrom = s;
    if (date) f.dateOfDeath = date;
    if (missing) f.status = 'Missing in Action';
    return f;
  });
}

/**
 * The pool: ABMC's World War I records, from its public archive
 * (weremember.abmc.gov), turned into cards by
 * ~/Documents/minimuseum-data/abmc/build_fallen.py, which keeps only what each
 * record says, with the memorial's researched soldiers as ABMC records them.
 * It is fetched, once, when "Remember a soldier" opens, not bundled with the
 * page: it holds tens of thousands of soldiers.
 */
let loading: Promise<Fallen[]> | null = null;
export function loadFallen(): Promise<Fallen[]> {
  loading ??= fetch(FALLEN_SRC)
    .then((r) => {
      if (!r.ok) throw new Error(`The records did not load (${r.status}).`);
      return r.json() as Promise<PackedFallen>;
    })
    .then(decodeFallen)
    .catch((e) => {
      // A later visit to the section tries again.
      loading = null;
      throw e;
    });
  return loading;
}
