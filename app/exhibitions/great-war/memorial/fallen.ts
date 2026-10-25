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

import ABMC from './fallen-abmc.json';

/**
 * The pool: World War I records fetched from ABMC's public archive
 * (weremember.abmc.gov) and turned into cards by
 * ~/Documents/minimuseum-data/abmc/build_fallen.py, which keeps only what each
 * record says. It holds a sample of 2,000 drawn across every cemetery, plus
 * the memorial's researched soldiers as ABMC records them; the rest of ABMC's
 * 35,418 World War I records can be added the same way.
 */
export const FALLEN: Fallen[] = ABMC as Fallen[];
