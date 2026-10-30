import type { FactSource } from '@/components/exhibition/FactNote';

/*
 * The walk, one line per step, in the order of the history: the
 * owner-approved draft (A18/B13/B14 proposal, 2D), word for word, each with
 * its source. Poster 1's first sentence still comes at step 3 (Walk.tsx,
 * LINE_AFTER); these follow from step 4, one a step, and the walk goes on
 * quietly after the last.
 *
 * Each line has a picture slot: an object or a place, never a person,
 * nothing graphic (the draft's suggested image). The owner supplies her own
 * pictures; until one is in place, a quiet drawing of the same kind of
 * thing (`motif`, WalkPicture.tsx) stands in. A picture is dropped in at
 *   public/exhibitions/holocaust/walk/<slot>.webp
 * and is used from the next build (walkSlots.ts looks for the files).
 *
 * Sound: the footsteps are made in the browser (footsteps.ts). Under them,
 * if the owner supplies them, three quiet ambient recordings, one for each
 * part of the walk, looped and faded:
 *   public/exhibitions/holocaust/walk/sound/<ambient>.mp3
 */

export const WALK_DIR = '/exhibitions/holocaust/walk';

const USHMM = (title: string, slug: string): FactSource => ({ label: `USHMM, “${title}”`, href: `https://encyclopedia.ushmm.org/content/en/article/${slug}` });
const HMD = (title: string, slug: string): FactSource => ({ label: `Holocaust Memorial Day Trust, “${title}”`, href: `https://hmd.org.uk/resource/${slug}/` });

const JEWISH_LIFE = USHMM('Jewish Life in Europe before the Holocaust', 'jewish-life-in-europe-before-the-holocaust');
const INTRO = USHMM('Introduction to the Holocaust', 'introduction-to-the-holocaust');
const BOOKS = USHMM('Book Burning', 'book-burning');
const NUREMBERG = USHMM('The Nuremberg Race Laws', 'the-nuremberg-race-laws');
const KRISTALLNACHT = USHMM('Kristallnacht', 'kristallnacht');
const KINDER = USHMM('Kindertransport, 1938–40', 'kindertransport-1938-40');
const DEPORTATIONS = USHMM('Deportations to Killing Centers', 'deportations-to-killing-centers');
const WARSAW = USHMM('Warsaw Ghetto Uprising', 'warsaw-ghetto-uprising');
const CHILDREN = USHMM('Children during the Holocaust', 'children-during-the-holocaust');
const DENMARK = USHMM('Rescue in Denmark', 'rescue-in-denmark');
const CHAMBON = USHMM('Le Chambon-sur-Lignon', 'le-chambon-sur-lignon');
const AUSCHWITZ = USHMM('Auschwitz', 'auschwitz');
const RIGHTEOUS = USHMM('Righteous Among the Nations', 'righteous-among-the-nations');
const LUGGAGE: FactSource = { label: 'USHMM, “Luggage belonging to Jews who were deported to killing centers”', href: 'https://encyclopedia.ushmm.org/content/en/photo/luggage-belonging-to-jews-who-were-deported-to-killing-centers' };
const SCRIP: FactSource = { label: 'USHMM Collections, Theresienstadt scrip, 1 krone note', href: 'https://collections.ushmm.org/search/catalog/irn548074' };
const AFH_MIEP: FactSource = { label: 'Anne Frank House, “Miep Gies”', href: 'https://www.annefrank.org/en/anne-frank/main-characters/miep-gies/' };
const YV_NAMES: FactSource = { label: 'Yad Vashem, press release, November 11, 2025', href: 'https://www.yadvashem.org/press-release/11-november-2025-08-44.html' };
const YV_RIGHTEOUS: FactSource = { label: 'Yad Vashem, “The Righteous Among the Nations”', href: 'https://www.yadvashem.org/righteous/stories.html' };
const HMD_WHAT: FactSource = { label: 'Holocaust Memorial Day Trust, “What is Holocaust Memorial Day?”', href: 'https://www.hmd.org.uk/what-is-holocaust-memorial-day/' };

/** The kinds of quiet drawing that stand in until a picture is supplied. */
export type Motif =
  | 'door' | 'windows' | 'cone' | 'book' | 'nameplate' | 'bench' | 'pane' | 'suitcase' | 'tag' | 'hat'
  | 'gate' | 'bookcase' | 'diary' | 'bicycle' | 'tracks' | 'suitcases' | 'note' | 'candle' | 'shoes'
  | 'shutter' | 'boat' | 'table' | 'stones' | 'tree' | 'path';

export type Ambient = 'before' | 'during' | 'after';
export const AMBIENTS: readonly Ambient[] = ['before', 'during', 'after'];
export const ambientSrc = (a: Ambient) => `${WALK_DIR}/sound/ambient-${a}.mp3`;

export type WalkLine = {
  id: string;
  text: string;
  sources: readonly FactSource[];
  /** The picture's file name (without .webp), and what it should show. */
  slot: string;
  image: string;
  motif: Motif;
  /** Which part of the walk: its ambient sound. */
  part: Ambient;
};

const line = (id: string, text: string, sources: FactSource[], slot: string, image: string, motif: Motif, part: Ambient): WalkLine => ({ id, text, sources, slot, image, motif, part });

export const WALK_LINES: readonly WalkLine[] = [
  line('W1', 'Jews had lived in Europe for more than two thousand years.', [JEWISH_LIFE], 'w01-open-door', 'An open front door, warm light inside', 'door', 'before'),
  line('W2', 'In 1933, about nine million Jewish people lived in Europe.', [INTRO], 'w02-lit-windows', 'Rows of lit windows in a town at dusk', 'windows', 'before'),
  line('W3', 'Leipzig, April 1929: Berta Rosenheim holds a large cone of sweets on her first day of school.', [JEWISH_LIFE], 'w03-school-cone', 'A paper school cone (Schultüte) on a desk', 'cone', 'before'),
  line('W4', 'May 1933. Students threw tens of thousands of books into bonfires.', [BOOKS], 'w04-closed-book', 'A single closed book on stone', 'book', 'during'),
  line('W5', 'September 15, 1935. New laws said Jews could not be citizens.', [NUREMBERG], 'w05-nameplate-removed', 'A door with its nameplate removed', 'nameplate', 'during'),
  line('W6', '“I was no longer allowed to play in the park.” (Steven Frank, aged five)', [HMD('Steven Frank', 'steven-frank')], 'w06-park-bench', 'An empty park bench', 'bench', 'during'),
  line('W7', 'November 9–10, 1938. More than 1,400 synagogues were burned.', [KRISTALLNACHT], 'w07-broken-window', 'A broken window pane, glass on the sill (no fire, no people)', 'pane', 'during'),
  line('W8', 'From December 1938, the Kindertransport carried about 10,000 children to safety in Britain. Their parents could not come.', [KINDER], 'w08-suitcase-platform', 'A small suitcase on a station platform', 'suitcase', 'during'),
  line('W9', '“…wearing labels round our necks and carrying only a small suitcase, we waited for our names to be called out.” (Ann Kirk)', [HMD('Ann Kirk', 'ann-kirk')], 'w09-luggage-tag', 'A luggage tag on a suitcase handle', 'tag', 'during'),
  line('W10', '“Then with a light suitcase, a heavy heart and a silly red hat that kept flopping into my face, I climbed into a compartment.” (Martha Blend)', [HMD('Martha Blend', 'martha-blend')], 'w10-red-hat', 'A red hat on a train seat', 'hat', 'during'),
  line('W11', 'Ghettos were parts of towns where Jews were forced to live, overcrowded and unsanitary.', [INTRO], 'w11-closed-gate', 'A closed gate in a brick wall', 'gate', 'during'),
  line('W12', 'July 6, 1942. The Frank family went into hiding, behind a bookcase.', [HMD('Miep Gies', 'miep-gies'), HMD('Anne Frank', 'anne-frank')], 'w12-bookcase', 'A bookcase, slightly open, like a door', 'bookcase', 'during'),
  line('W13', '“I want the diary to be my friend, and I’m going to call this friend Kitty.” (Anne Frank)', [HMD('Anne Frank', 'anne-frank')], 'w13-diary', 'An open diary with a checked cover', 'diary', 'during'),
  line('W14', 'Miep Gies carried food to the hiding place in shopping bags on her bicycle.', [AFH_MIEP], 'w14-bicycle', 'A bicycle with shopping bags', 'bicycle', 'during'),
  line('W15', 'Trains carried Jews from across Europe. The Nazis called it “resettlement to the east.”', [DEPORTATIONS], 'w15-tracks-fog', 'Empty railway tracks into fog', 'tracks', 'during'),
  line('W16', 'The suitcases of people who were deported now rest at the foot of a railcar in the US Holocaust Memorial Museum.', [LUGGAGE], 'w16-suitcases', 'A row of old suitcases', 'suitcases', 'during'),
  line('W17', 'In Theresienstadt, prisoners were given scrip instead of money, “to create a false appearance of normalcy.”', [SCRIP], 'w17-scrip', 'A paper banknote on a wooden table', 'note', 'during'),
  line('W18', 'April 19, 1943. About 700 young Jewish fighters rose up in the Warsaw ghetto.', [WARSAW], 'w18-candle', 'One candle, burning steadily', 'candle', 'during'),
  line('W19', 'As many as 1.5 million Jewish children were murdered.', [CHILDREN], 'w19-small-shoes', 'One pair of small shoes', 'shoes', 'during'),
  line('W20', 'Thousands of Jewish children survived, many because someone hid them.', [CHILDREN], 'w20-shutter-light', 'A shuttered window with a crack of light', 'shutter', 'during'),
  line('W21', '“Being a hidden child during the Holocaust was a distressing experience; we lived in constant fear.” (Yvonne Bernstein)', [HMD('Yvonne Bernstein', 'yvonne-bernstein')], 'w21-shutter-closed', 'The same window, shutters closed', 'shutter', 'during'),
  line('W22', 'October 1943. Danish fishermen ferried some 7,200 Jews to safety in Sweden.', [DENMARK], 'w22-fishing-boat', 'A small fishing boat on a calm night sea', 'boat', 'during'),
  line('W23', 'A French village and its neighbors gave refuge to an estimated 5,000 people.', [CHAMBON], 'w23-farmhouse-door', 'A farmhouse door, open', 'door', 'during'),
  line('W24', '“I had to do something for another mother’s son.” (Louisa Gould, Jersey)', [HMD('Louisa Gould', 'louisa-gould')], 'w24-table-for-one-more', 'A kitchen table set for one more', 'table', 'during'),
  line('W25', 'January 27, 1945. Soviet troops liberated about 7,000 prisoners at Auschwitz.', [AUSCHWITZ], 'w25-tracks-snow', 'Empty tracks in snow, first light', 'tracks', 'after'),
  line('W26', '“A Russian soldier said ‘the war is finished and you are free’.” (Helen Aronson)', [HMD('Helen Aronson', 'helen-aronson-bem')], 'w26-door-daylight', 'A hatch or door opening onto daylight', 'door', 'after'),
  line('W27', '“We found the danger is over for the time being. We are safe.” (Otto Rosenberg, after liberation)', [HMD('Otto Rosenberg', 'otto-rosenberg')], 'w27-morning-window', 'A window with morning light', 'windows', 'after'),
  line('W28', '“There was nothing to go back to Austria for.” (Martha Blend, after the war)', [HMD('Martha Blend', 'martha-blend')], 'w28-suitcase-on-side', 'A suitcase, closed, on its side', 'suitcase', 'after'),
  line('W29', 'Yad Vashem has recovered five million names of the six million Jews who were murdered.', [YV_NAMES], 'w29-stones-ledge', 'Stones, each a little different, along a ledge', 'stones', 'after'),
  line('W30', 'More than 28,000 rescuers have been honored as Righteous Among the Nations. Trees are planted in their honor.', [YV_RIGHTEOUS, RIGHTEOUS], 'w30-young-tree', 'A young tree on a path', 'tree', 'after'),
  line('W31', 'Each January 27, people light a candle in their window to remember, and to stand against hatred today.', [HMD_WHAT], 'w31-candle-window', 'A candle in a window at night', 'candle', 'after'),
  line('W32', '“There is nothing we can do about the past, but we can do a lot about the present and the future” (Zigi Shipper)', [HMD('Zigi Shipper', 'zigi-shipper-hmd-2017')], 'w32-path-into-light', 'The stone path running on ahead, into light', 'path', 'after'),
];

export const slotSrc = (slot: string) => `${WALK_DIR}/${slot}.webp`;

/** The line for step `steps` (1-based), from LINE_AFTER + 1 on; null before, and after the last. */
export function lineForStep(steps: number, lineAfter: number): WalkLine | null {
  const i = steps - lineAfter - 1;
  return i >= 0 && i < WALK_LINES.length ? WALK_LINES[i] : null;
}
