import { mulberry32 } from '@/components/games/scoring';
import type { GameItemMeta } from '@/components/games/types';
import { case7Coins, type CoinData } from '../artifacts/coin-data';

/**
 * A point on one of the two photographs that the round's explanation talks
 * about. x and y are fractions of that photograph's width and height, set by
 * eye against each image so the marker sits on the detail named.
 */
export type ReplicaCallout = {
  on: 'fake' | 'real';
  x: number;
  y: number;
  /** Words taken from the round's explanation. */
  text: string;
};

export type ReplicaRound = GameItemMeta & {
  coinName: string;
  fakeImage: string;
  realImage: string;
  method: string;
  explanation: string;
  callouts: ReplicaCallout[];
};

const IMG = '/exhibitions/in-their-hands/real-or-fake';

export const ROUNDS: ReplicaRound[] = [
  {
    id: 'dekadrachm',
    teacherTip:
      'Point at the owl on each coin and ask which one has crisp, individual feather lines.',
    coinName: 'Dekadrachm of Athens',
    fakeImage: `${IMG}/Dekadrachm-fake.png`,
    realImage: `${IMG}/Dekadrachm-real.png`,
    method: 'Casting',
    explanation:
      "This is a cast counterfeit. Look at the surface: the genuine coin has natural depth and variation in its patina built up over two thousand years. The fake has an unnaturally uniform surface. Cast reproductions copy the shape of an original coin by pouring molten metal into a mold, but they lack the die-stress lines of a struck coin. Small bubbles, reduced detail, and a different edge profile are all telltale signs. The owl on the genuine coin has crisp, individual feather lines — the fake's owl is softer and slightly blurred.",
    callouts: [
      { on: 'fake', x: 0.75, y: 0.52, text: "The fake's owl is softer and slightly blurred." },
      { on: 'fake', x: 0.2, y: 0.3, text: 'The fake has an unnaturally uniform surface.' },
      { on: 'real', x: 0.73, y: 0.55, text: 'The genuine owl has crisp, individual feather lines.' },
      { on: 'real', x: 0.3, y: 0.66, text: 'The genuine coin has natural depth and variation in its patina.' },
    ],
  },
  {
    id: 'die-transfer',
    teacherTip:
      'Ask which coin looks flatter and grayer, and which keeps the sharpness of the original strike.',
    coinName: 'Greek Drachm — Die Transfer Counterfeit',
    fakeImage: `${IMG}/die-transfer-fake.png`,
    realImage: `${IMG}/die-transfer-real.png`,
    method: 'Die Transfer',
    explanation:
      "This is a die transfer counterfeit — one of the hardest fakes to spot. The counterfeiter created a mold from a genuine coin's die and used it to strike a new coin on a different blank. The design looks accurate at first glance, but compare the two carefully: the fake has a flatter, grayer appearance and the details lack the sharpness of the original strike. The metal composition is wrong — ancient coins have a specific alloy that modern fakes rarely match exactly. Experts use visual comparison with known genuine examples and sometimes X-ray analysis to catch these.",
    callouts: [
      { on: 'fake', x: 0.24, y: 0.36, text: 'The fake has a flatter, grayer appearance.' },
      { on: 'fake', x: 0.7, y: 0.42, text: "The details lack the sharpness of the original strike." },
      { on: 'real', x: 0.7, y: 0.42, text: 'The genuine coin keeps the sharpness of the original strike.' },
    ],
  },
  {
    id: 'lysimachus',
    teacherTip:
      'Compare the hair on the two portraits: which has sharp, defined curls, and which looks mushy?',
    coinName: 'Lysimachus Tetradrachm',
    fakeImage: `${IMG}/Lysimachus-fake.png`,
    realImage: `${IMG}/Lysimachus-real.png`,
    method: 'Sand Casting',
    explanation:
      "This is a sand cast counterfeit. In sand casting, the counterfeiter presses a genuine coin into fine sand to make a mold, then pours molten metal into it. The result looks roughly right but the surface is grainy and soft. Compare the hair on the portrait: the genuine coin has sharp, individually defined curls with natural die-wear. The fake's hair is mushy and indistinct. The edge is also a giveaway — sand cast coins have a different edge texture from coins struck between two dies. The patina on the fake sits on the surface rather than penetrating the metal.",
    callouts: [
      { on: 'fake', x: 0.2, y: 0.26, text: "The fake's hair is mushy and indistinct." },
      { on: 'fake', x: 0.79, y: 0.72, text: 'The surface is grainy and soft; the patina sits on top of the metal.' },
      { on: 'fake', x: 0.035, y: 0.62, text: 'The edge texture differs from a coin struck between two dies.' },
      { on: 'real', x: 0.19, y: 0.26, text: 'The genuine coin has sharp, individually defined curls.' },
    ],
  },
  {
    id: 'nero',
    teacherTip:
      'Point at the high points of each portrait and ask whether the wear looks even or artificial.',
    coinName: 'Sestertius of Nero',
    fakeImage: `${IMG}/nero-fake.png`,
    realImage: `${IMG}/nero-real.png`,
    method: 'False Dies',
    explanation:
      "This counterfeit was made using false dies — hand-engraved copies of the original dies used to strike coins that look very close to genuine. But look carefully at the portrait: the genuine coin has natural wear that softens the high points evenly, the way two thousand years of handling would. The fake's wear is artificial — made with a tumbler or sandpaper — and under magnification you would see small fractures instead of genuine smoothing. The genuine coin also has a lustrous quality when rotated that the fake lacks, because the metal composition is different.",
    callouts: [
      { on: 'fake', x: 0.55, y: 0.3, text: "The fake's wear is artificial — made with a tumbler or sandpaper." },
      { on: 'real', x: 0.47, y: 0.3, text: 'Natural wear softens the high points evenly.' },
    ],
  },
  {
    id: 'widow',
    teacherTip:
      'Ask why a lepton that looks too clean and too perfect should make an expert suspicious.',
    coinName: "Widow's Mite — Lepton",
    fakeImage: `${IMG}/widow-fake.png`,
    realImage: `${IMG}/widow-real.png`,
    method: 'Modern Reproduction',
    explanation:
      "This is a modern reproduction of a widow's mite. Ironically, fakes of cheap ancient coins often look too good. A genuine lepton was a low-denomination bronze coin mass-produced for daily use — the striking is crude, off-center, and irregular. That's not poor quality, it's exactly what you expect. The fake is too clean, too symmetrical, too well-defined. The patina is chemically applied and sits on the surface unnaturally. If a lepton looks perfect, be suspicious. The imperfection is the proof of authenticity.",
    callouts: [
      { on: 'fake', x: 0.1, y: 0.3, text: 'The fake is too clean, too symmetrical, too well-defined.' },
      { on: 'fake', x: 0.8, y: 0.64, text: 'The patina is chemically applied and sits on the surface.' },
      { on: 'real', x: 0.7, y: 0.42, text: 'The genuine striking is crude, off-center and irregular.' },
    ],
  },
];

export const TIERS = [
  {
    min: 1,
    title: 'You are now a numismatist.',
    message: 'Five for five. You read surface, edge and wear the way an expert does.',
  },
  {
    min: 0.8,
    title: 'A sharp-eyed collector.',
    message: 'Only one fake got past you.',
  },
  {
    min: 0.4,
    title: 'A good start.',
    message:
      'These fakes were made to deceive. Play again and look closely at what the explanations point to: surface, edge and wear.',
  },
  {
    min: 0,
    title: 'The counterfeiters win this round.',
    message:
      'Every one of these fakes was made to deceive. Play again and use the magnifier on the surface, the edge and the wear.',
  },
];

/** The closing paragraph of the original ending, kept for every score. */
export const CLOSING =
  'Every coin in this exhibition was once held by someone. The question of whether a coin is genuine is not an academic exercise — it is the question of whether the object in front of you really was there. A genuine Pontius Pilate prutah was minted in Jerusalem in the year of the Crucifixion. Someone held it. That matters. Authentication is how we protect that connection between the present and the past.';

/* ───────── Our own case ───────── */

export type OwnCaseCoin = {
  id: string;
  title: string;
  date: string;
  material: string;
  reference: string;
  frontImage: string;
  backImage: string;
  /** The coin's own sentence about why it is shown as a replica. */
  why: string;
};

/** The sentence in a coin's description that explains it is a replica. */
export function replicaSentence(coin: CoinData): string {
  const text = coin.description.join(' ');
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
  return (sentences.find((s) => /replica/i.test(s)) ?? '').trim();
}

/**
 * The three replicas shown in this exhibition, straight from the coin data
 * used by the case pages — nothing here is written for the game.
 */
export const OWN_CASE: OwnCaseCoin[] = case7Coins
  .filter((c) => c.authenticity === 'REPLICA')
  .map((c) => ({
    id: c.id,
    title: c.title,
    date: c.date,
    material: c.material,
    reference: c.reference,
    frontImage: c.frontImage,
    backImage: c.backImage,
    why: replicaSentence(c),
  }));

/* ───────── Placement ───────── */

export type Side = 'a' | 'b';

/** Which side the fake sits on in each round, from a seed — never from Math.random during render. */
export function fakeSides(seed: number, count: number): Side[] {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, () => (rng() < 0.5 ? 'a' : 'b'));
}
