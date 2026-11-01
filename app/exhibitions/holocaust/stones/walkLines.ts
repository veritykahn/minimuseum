import type { FactSource } from '@/components/exhibition/FactNote';

/*
 * The walk, one line per step, in the order of the history: from Jewish
 * life before 1933, through the laws, Kristallnacht, the Kindertransport,
 * the ghettos, hiding, the deportations and the rescuers, to liberation,
 * the survivors, and remembering. It began as the owner-approved draft
 * (A18/B13/B14 proposal, 2D); the lines changed or moved since say so in
 * their REVIEW notes. The first step brings the first line; every step has
 * a line and a picture. Between some of the steps, a child's name
 * (walkNames.ts); after the last, the walk closes quietly (Walk.tsx).
 *
 * Every line comes from Yad Vashem, the USHMM or the Holocaust Memorial Day
 * Trust, and every survivor's words are quoted exactly from the page named
 * with them. Each line has a REVIEW note with its source, for the owner.
 * The sources are listed in the room's Sources drawer, by step, never under
 * the line itself.
 *
 * Each line has a picture slot: an object or a place, never a person,
 * nothing graphic. The owner supplies her own pictures; until one is in
 * place, a dark, softly lit silhouette of one of the agreed objects (empty
 * tracks, shoes, a suitcase, a closed door, an empty chair, a candle;
 * `placeholder`, WalkPicture.tsx), marked "Picture to come", stands in.
 * A slot keeps its number wherever its line falls in the walk, and its
 * picture is dropped in under either name:
 *   public/exhibitions/holocaust/walk/<slot>.webp   (or .jpg; e.g. w01-open-door.webp)
 *   public/exhibitions/holocaust/walk/walk-NN.jpg   (NN the slot's number, walk-01.jpg; or .webp, .png)
 * and is used from the next build (walkSlots.ts looks for the files).
 *
 * Sound: the footsteps are made in the browser (footsteps.ts). Under them,
 * if the owner supplies them, three quiet ambient recordings, one for each
 * part of the walk, looped and faded, and never before the visitor turns
 * the sound on:
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
const YV_NAMES: FactSource = { label: 'Yad Vashem, press release, November 11, 2025', href: 'https://www.yadvashem.org/press-release/11-november-2025-08-44.html' };
const YV_RIGHTEOUS: FactSource = { label: 'Yad Vashem, “The Righteous Among the Nations”', href: 'https://www.yadvashem.org/righteous/stories.html' };
const HMD_WHAT: FactSource = { label: 'Holocaust Memorial Day Trust, “What is Holocaust Memorial Day?”', href: 'https://www.hmd.org.uk/what-is-holocaust-memorial-day/' };

/** The agreed objects, drawn as dark, softly lit silhouettes until the owner's picture is in place. */
export type Placeholder = 'tracks' | 'shoes' | 'suitcase' | 'door' | 'chair' | 'candle';
export const PLACEHOLDERS: readonly Placeholder[] = ['tracks', 'shoes', 'suitcase', 'door', 'chair', 'candle'];

export type Ambient = 'before' | 'during' | 'after';
export const AMBIENTS: readonly Ambient[] = ['before', 'during', 'after'];
export const ambientSrc = (a: Ambient) => `${WALK_DIR}/sound/ambient-${a}.mp3`;

export type WalkLine = {
  id: string;
  text: string;
  sources: readonly FactSource[];
  /** The picture's slot (its file name, without the extension), and what the picture should show. */
  slot: string;
  image: string;
  /** The silhouette that stands in until the picture is there. */
  placeholder: Placeholder;
  /** Which part of the walk: its ambient sound. */
  part: Ambient;
};

const line = (id: string, text: string, sources: FactSource[], slot: string, image: string, placeholder: Placeholder, part: Ambient): WalkLine => ({ id, text, sources, slot, image, placeholder, part });

export const WALK_LINES: readonly WalkLine[] = [
  // ── Before ──
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/jewish-life-in-europe-before-the-holocaust ("Jews have lived in Europe for more than two thousand years.")
  line('W1', 'Jews had lived in Europe for more than two thousand years.', [JEWISH_LIFE], 'w01-open-door', 'An open front door, warm light inside', 'door', 'before'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/jewish-life-in-europe-before-the-holocaust (photo caption: "Leipzig, Germany, April 1929"). Moved before the 1933 line, so the walk keeps to the order of the history.
  line('W2', 'Leipzig, April 1929: Berta Rosenheim holds a large cone of sweets on her first day of school.', [JEWISH_LIFE], 'w03-school-cone', 'A paper school cone (Schultüte) on a desk', 'chair', 'before'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust ("in 1933 numbered 9 million people")
  line('W3', 'In 1933, about nine million Jewish people lived in Europe.', [INTRO], 'w02-lit-windows', 'Rows of lit windows in a town at dusk', 'candle', 'before'),
  // ── During ──
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/book-burning
  line('W4', 'May 1933. Students threw tens of thousands of books into bonfires.', [BOOKS], 'w04-closed-book', 'A single closed book on stone', 'chair', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/the-nuremberg-race-laws
  line('W5', 'September 15, 1935. New laws said Jews could not be citizens.', [NUREMBERG], 'w05-nameplate-removed', 'A door with its nameplate removed', 'door', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/kristallnacht (the owner's decision: the USHMM figure, "more than 1,400 synagogues")
  line('W6', 'November 9–10, 1938. More than 1,400 synagogues were burned.', [KRISTALLNACHT], 'w07-broken-window', 'A broken window pane, glass on the sill (no fire, no people)', 'door', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/kindertransport-1938-40 ("From December 1938 until May 1940 … about 10,000 children to safety in Great Britain"; "Parents or guardians could not accompany the children.")
  line('W7', 'From December 1938, the Kindertransport carried about 10,000 children to safety in Britain. Their parents could not come.', [KINDER], 'w08-suitcase-platform', 'A small suitcase on a station platform', 'suitcase', 'during'),
  // REVIEW: https://hmd.org.uk/resource/ann-kirk/ (her words, exactly as quoted there)
  line('W8', '“…wearing labels round our necks and carrying only a small suitcase, we waited for our names to be called out.” (Ann Kirk)', [HMD('Ann Kirk', 'ann-kirk')], 'w09-luggage-tag', 'A luggage tag on a suitcase handle', 'suitcase', 'during'),
  // REVIEW: https://hmd.org.uk/resource/martha-blend/ (her words, exactly as quoted there)
  line('W9', '“Then with a light suitcase, a heavy heart and a silly red hat that kept flopping into my face, I climbed into a compartment.” (Martha Blend)', [HMD('Martha Blend', 'martha-blend')], 'w10-red-hat', 'A red hat on a train seat', 'chair', 'during'),
  // REVIEW: https://hmd.org.uk/resource/steven-frank/ ("I was no longer allowed to play in the park"; he was five when the Nazis invaded the Netherlands, in 1940). Moved after the Kindertransport, to 1940, where it falls; "aged five" is now "a boy in the occupied Netherlands", as the page does not give his age when the rule came.
  line('W10', '“I was no longer allowed to play in the park.” (Steven Frank, a boy in the occupied Netherlands)', [HMD('Steven Frank', 'steven-frank')], 'w06-park-bench', 'An empty park bench', 'chair', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust ("forced Jews to live in overcrowded and unsanitary conditions")
  line('W11', 'Ghettos were parts of towns where Jews were forced to live, overcrowded and unsanitary.', [INTRO], 'w11-closed-gate', 'A closed gate in a brick wall', 'door', 'during'),
  // REVIEW: https://hmd.org.uk/resource/miep-gies/ ("on 6 July 1942, Otto and his family went to the upper rear rooms of his office building") and https://hmd.org.uk/resource/anne-frank/
  line('W12', 'July 6, 1942. The Frank family went into hiding, behind a bookcase.', [HMD('Miep Gies', 'miep-gies'), HMD('Anne Frank', 'anne-frank')], 'w12-bookcase', 'A bookcase, slightly open, like a door', 'door', 'during'),
  // REVIEW: https://hmd.org.uk/resource/anne-frank/ (her words, exactly as quoted there)
  line('W13', '“I want the diary to be my friend, and I’m going to call this friend Kitty.” (Anne Frank)', [HMD('Anne Frank', 'anne-frank')], 'w13-diary', 'An open diary with a checked cover', 'chair', 'during'),
  // REVIEW: https://hmd.org.uk/resource/miep-gies/ ("Miep sourced food from different places and would make several trips each day … so she never had to carry more than one or two bags at a time"). Rewritten from the HMD Trust's page: the old line (shopping bags on her bicycle) came from the Anne Frank House.
  line('W14', 'Miep Gies brought food to the hiding place, one or two bags at a time, several trips each day.', [HMD('Miep Gies', 'miep-gies')], 'w14-bicycle', 'A bicycle with shopping bags', 'chair', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/deportations-to-killing-centers
  line('W15', 'Trains carried Jews from across Europe. The Nazis called it “resettlement to the east.”', [DEPORTATIONS], 'w15-tracks-fog', 'Empty railway tracks into fog', 'tracks', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/photo/luggage-belonging-to-jews-who-were-deported-to-killing-centers
  line('W16', 'The suitcases of people who were deported now rest at the foot of a railcar in the US Holocaust Memorial Museum.', [LUGGAGE], 'w16-suitcases', 'A row of old suitcases', 'suitcase', 'during'),
  // REVIEW: https://collections.ushmm.org/search/catalog/irn548074
  line('W17', 'In Theresienstadt, prisoners were given scrip instead of money, “to create a false appearance of normalcy.”', [SCRIP], 'w17-scrip', 'A paper banknote on a wooden table', 'chair', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/warsaw-ghetto-uprising ("On April 19, 1943, the Warsaw ghetto uprising began"; "About 700 young Jewish fighters")
  line('W18', 'April 19, 1943. About 700 young Jewish fighters rose up in the Warsaw ghetto.', [WARSAW], 'w18-candle', 'One candle, burning steadily', 'candle', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/children-during-the-holocaust
  line('W19', 'As many as 1.5 million Jewish children were murdered.', [CHILDREN], 'w19-small-shoes', 'One pair of small shoes', 'shoes', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/children-during-the-holocaust
  line('W20', 'Thousands of Jewish children survived, many because someone hid them.', [CHILDREN], 'w20-shutter-light', 'A shuttered window with a crack of light', 'door', 'during'),
  // REVIEW: https://hmd.org.uk/resource/yvonne-bernstein/ (her words, exactly as quoted there)
  line('W21', '“Being a hidden child during the Holocaust was a distressing experience; we lived in constant fear.” (Yvonne Bernstein)', [HMD('Yvonne Bernstein', 'yvonne-bernstein')], 'w21-shutter-closed', 'The same window, shutters closed', 'door', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/rescue-in-denmark
  line('W22', 'October 1943. Danish fishermen ferried some 7,200 Jews to safety in Sweden.', [DENMARK], 'w22-fishing-boat', 'A small fishing boat on a calm night sea', 'candle', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/le-chambon-sur-lignon
  line('W23', 'A French village and its neighbors gave refuge to an estimated 5,000 people.', [CHAMBON], 'w23-farmhouse-door', 'A farmhouse door, open', 'door', 'during'),
  // REVIEW: https://hmd.org.uk/resource/louisa-gould/ (her words, exactly as quoted there)
  line('W24', '“I had to do something for another mother’s son.” (Louisa Gould, Jersey)', [HMD('Louisa Gould', 'louisa-gould')], 'w24-table-for-one-more', 'A kitchen table set for one more', 'chair', 'during'),
  // ── After ──
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/auschwitz ("On January 27, 1945, Soviet troops liberated approximately 7,000 prisoners")
  line('W25', 'January 27, 1945. Soviet troops liberated about 7,000 prisoners at Auschwitz.', [AUSCHWITZ], 'w25-tracks-snow', 'Empty tracks in snow, first light', 'tracks', 'after'),
  // REVIEW: https://hmd.org.uk/resource/helen-aronson-bem/ (her words, exactly as quoted there)
  line('W26', '“A Russian soldier said ‘the war is finished and you are free’.” (Helen Aronson)', [HMD('Helen Aronson', 'helen-aronson-bem')], 'w26-door-daylight', 'A hatch or door opening onto daylight', 'door', 'after'),
  // REVIEW: https://hmd.org.uk/resource/otto-rosenberg/ (his words, exactly as quoted there)
  line('W27', '“We found the danger is over for the time being. We are safe.” (Otto Rosenberg, after liberation)', [HMD('Otto Rosenberg', 'otto-rosenberg')], 'w27-morning-window', 'A window with morning light', 'candle', 'after'),
  // REVIEW: https://hmd.org.uk/resource/martha-blend/ (her words, exactly as quoted there)
  line('W28', '“There was nothing to go back to Austria for.” (Martha Blend, after the war)', [HMD('Martha Blend', 'martha-blend')], 'w28-suitcase-on-side', 'A suitcase, closed, on its side', 'suitcase', 'after'),
  // REVIEW: https://www.yadvashem.org/press-release/11-november-2025-08-44.html (Yad Vashem's site refused an automated re-check on November 1, 2026: please confirm the figure)
  line('W29', 'Yad Vashem has recovered five million names of the six million Jews who were murdered.', [YV_NAMES], 'w29-stones-ledge', 'Stones, each a little different, along a ledge', 'candle', 'after'),
  // REVIEW: https://www.yadvashem.org/righteous/stories.html and https://encyclopedia.ushmm.org/content/en/article/righteous-among-the-nations ("28,707 individuals from 51 countries"; "a place where trees are planted to commemorate rescuers")
  line('W30', 'More than 28,000 rescuers have been honored as Righteous Among the Nations. Trees are planted in their honor.', [YV_RIGHTEOUS, RIGHTEOUS], 'w30-young-tree', 'A young tree on a path', 'chair', 'after'),
  // REVIEW: https://www.hmd.org.uk/what-is-holocaust-memorial-day/
  line('W31', 'Each January 27, people light a candle in their window to remember, and to stand against hatred today.', [HMD_WHAT], 'w31-candle-window', 'A candle in a window at night', 'candle', 'after'),
  // REVIEW: https://hmd.org.uk/resource/zigi-shipper-hmd-2017/ (his words, exactly as quoted there)
  line('W32', '“There is nothing we can do about the past, but we can do a lot about the present and the future” (Zigi Shipper)', [HMD('Zigi Shipper', 'zigi-shipper-hmd-2017')], 'w32-path-into-light', 'A cobbled path between trees, running on into light', 'candle', 'after'),
];

/** A slot's number, from its name: 'w07-broken-window' is 7. */
export const slotNumber = (slot: string) => Number(slot.slice(1, 3));

/** The names a slot's picture may be dropped in under, in the order they are looked for. */
export function slotFiles(slot: string): string[] {
  const nn = String(slotNumber(slot)).padStart(2, '0');
  return [`${slot}.webp`, `${slot}.jpg`, `walk-${nn}.jpg`, `walk-${nn}.webp`, `walk-${nn}.png`];
}

/** The slots the owner has filled, each with the file found for it (walkSlots.ts). */
export type WalkPictures = Readonly<Record<string, string>>;

/** Where a slot's picture is served from: the file found for it (walkSlots.ts), or its first name. */
export const slotSrc = (slot: string, file = slotFiles(slot)[0]) => `${WALK_DIR}/${file}`;
