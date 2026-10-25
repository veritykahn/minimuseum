/*
 * The fallen: one entry per American serviceman or woman of the Great War, in
 * the shape of a record of the American Battle Monuments Commission (ABMC).
 * These are the cards of "Remember a soldier".
 *
 * ABMC keeps the records of those who rest in its cemeteries overseas or are
 * named on its Tablets of the Missing. So the pool holds only those: of the
 * memorial's eleven researched soldiers (soldiers.ts), the five ABMC records
 * are below. The other six were brought home, or died at home, and ABMC has
 * no record of them; they keep their story cards.
 *
 * Every field below is taken from the approved research notes, as soldiers.ts
 * gives it, and nothing is added. "Entered service from" is the state where
 * the notes say he enlisted or was drafted. Like the plots, it must be checked
 * by hand against the ABMC burial search (abmc.gov) before this goes live.
 *
 * The owner's ABMC records (hundreds, later perhaps thousands) will be parsed
 * into this same shape. This module is loaded only when the "Remember a
 * soldier" section needs it, so its size never weighs on the page.
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
  /** ISO date, YYYY-MM-DD. */
  dateOfDeath: string;
  status: FallenStatus;
  awards?: string[];
  resting: Resting;
  source: 'ABMC';
};

export const FALLEN: Fallen[] = [
  {
    id: 'freddie-stowers',
    name: 'Freddie Stowers',
    rank: 'Corporal',
    unit: 'Company C, 371st Infantry Regiment, 93rd Division',
    branch: 'U.S. Army',
    enteredServiceFrom: 'South Carolina',
    dateOfDeath: '1918-09-28',
    status: 'Killed in Action',
    awards: ['Medal of Honor'],
    resting: { kind: 'grave', cemetery: 'Meuse-Argonne American Cemetery', plot: 'F', row: '36', grave: '40' },
    source: 'ABMC',
  },
  {
    id: 'eben-m-stout',
    name: 'Eben M. Stout',
    rank: 'Private',
    unit: 'Company M, 369th Infantry Regiment, 93rd Division',
    branch: 'U.S. Army',
    enteredServiceFrom: 'New Jersey',
    dateOfDeath: '1918-09-26',
    status: 'Killed in Action',
    resting: { kind: 'grave', cemetery: 'Meuse-Argonne American Cemetery', plot: 'C', row: '41', grave: '14' },
    source: 'ABMC',
  },
  {
    id: 'john-b-healey',
    name: 'John B. Healey',
    rank: 'Private',
    unit: '102nd Infantry Regiment, 26th Division',
    branch: 'U.S. Army',
    enteredServiceFrom: 'Connecticut',
    dateOfDeath: '1918-07-21',
    status: 'Missing in Action',
    resting: { kind: 'missing', cemetery: 'Aisne-Marne American Cemetery' },
    source: 'ABMC',
  },
  {
    id: 'matej-kocak',
    name: 'Matej Kocak',
    rank: 'Sergeant',
    unit: '66th Company, 5th Marines, 2nd Division',
    branch: 'U.S. Marine Corps',
    enteredServiceFrom: 'Pennsylvania',
    dateOfDeath: '1918-10-04',
    status: 'Killed in Action',
    awards: ['Medal of Honor (Army)', 'Medal of Honor (Navy)'],
    resting: { kind: 'grave', cemetery: 'Meuse-Argonne American Cemetery', plot: 'D', row: '41', grave: '32' },
    source: 'ABMC',
  },
  {
    id: 'wayne-miner',
    name: 'Wayne Miner',
    rank: 'Private',
    unit: 'Company A, 366th Infantry Regiment, 92nd Division',
    branch: 'U.S. Army',
    enteredServiceFrom: 'Missouri',
    dateOfDeath: '1918-11-11',
    status: 'Killed in Action',
    resting: { kind: 'grave', cemetery: 'St. Mihiel American Cemetery', plot: 'B', row: '14', grave: '17' },
    source: 'ABMC',
  },
];
