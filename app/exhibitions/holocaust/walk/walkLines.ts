import type { FactSource } from '@/components/exhibition/FactNote';

/*
 * The history, one line at a time, in its order, step by step: Jewish life
 * before 1933; the first camp, the boycott, the burned books, the laws,
 * Kristallnacht; the war, the ghettos, Babi Yar, the star; Wannsee and the
 * "Final Solution"; the trains and the killing centers; the fighters who
 * rose up in the Warsaw ghetto; Hungary in 1944, when Germany was already
 * losing; the death marches; and the toll. Rebuilt on November 4, 2026, at
 * the owner's request, so that it builds; the rescuers, the hiding and the
 * survivors' words stay on the posters. The lines are the owner's own film
 * script ("The Walk: film script", November 4, 2026), word for word: the
 * rows she deleted there are gone from here too. The film ends on its music;
 * then, in silence, a few words on what the walk is (WalkThreshold, Walk.tsx). It began as the owner-approved draft (A18/B13/B14
 * proposal, 2D) for the walk; the lines changed or moved since say so in
 * their REVIEW notes. The lines are now carried by the film that opens the
 * walk (Film.tsx), each over its picture, in order; the walk itself has
 * only the children's names (victims.ts).
 *
 * Every line comes from Yad Vashem, the USHMM or the Holocaust Memorial Day
 * Trust, and every survivor's words are quoted exactly from the page named
 * with them. Each line has a REVIEW note with its source, for the owner.
 * The sources are listed in the walk's Sources drawer, by line, never on
 * the screen with the line.
 *
 * Each line has a picture slot: an object or a place, never a person,
 * nothing graphic. The owner supplies her own pictures; until one is in
 * place, a dark, softly lit silhouette of one of the agreed objects (empty
 * tracks, shoes, a suitcase, a closed door, an empty chair, a candle;
 * `placeholder`, WalkPicture.tsx), marked "Picture to come", stands in.
 * A slot keeps its number wherever its line falls, and its picture is
 * dropped in under either name:
 *   public/exhibitions/holocaust/walk/<slot>.webp   (or .jpg; e.g. w01-open-door.webp)
 *   public/exhibitions/holocaust/walk/walk-NN.jpg   (NN the slot's number, walk-01.jpg; or .webp, .png)
 * and is used from the next build (walkSlots.ts looks for the files).
 *
 * Sound. The film's music, when the owner has put it in place, plays with
 * the film and fades as it ends:
 *   public/exhibitions/holocaust/walk/film-music.mp3
 * On the walk, nothing but the steps. Each footfall is a clank of metal,
 * from the owner's recordings cut into single clanks, with a long resonant
 * rattle that comes in over about one step in three (metal.ts):
 *   public/exhibitions/holocaust/walk/sound/clank-01.mp3, clank-02.mp3, …
 *   public/exhibitions/holocaust/walk/sound/rattle.mp3
 * Until the clanks are in place, the steps are made in the browser
 * (footsteps.ts).
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
const AUSCHWITZ = USHMM('Auschwitz', 'auschwitz');
const YV_NAMES: FactSource = { label: 'Yad Vashem, press release, November 11, 2025', href: 'https://www.yadvashem.org/press-release/11-november-2025-08-44.html' };
const DACHAU = USHMM('Dachau', 'dachau');
const BOYCOTT = USHMM('Boycott of Jewish Businesses', 'boycott-of-jewish-businesses');
const HEINE: FactSource = { label: 'Heinrich Heine, Almansor (1821), as discussed in the Jewish Review of Books, “Where They Have Burned Books, They Will End Up Burning People”', href: 'https://jewishreviewofbooks.com/articles/2788/burned-books-will-end-burning-people/' };
const POPULATION: FactSource = { label: 'USHMM, “Jewish Population of Europe in 1933”', href: 'https://encyclopedia.ushmm.org/narrative/2906' };
const BADGE = USHMM('Jewish Badge: During the Nazi Era', 'jewish-badge-during-the-nazi-era');
const WARSAW_GHETTO = USHMM('Warsaw', 'warsaw');
const EINSATZ = USHMM('Einsatzgruppen', 'einsatzgruppen');
const WANNSEE = USHMM('Wannsee Conference and the “Final Solution”', 'wannsee-conference-and-the-final-solution');
const KILLING_CENTERS = USHMM('Killing Centers: An Overview', 'killing-centers-an-overview');
const HUNGARY = USHMM('The Holocaust in Hungary', 'the-holocaust-in-hungary');
const ANNE = USHMM('Anne Frank Biography', 'anne-frank-biography');
const DEATH_MARCHES = USHMM('Death Marches', 'death-marches');
const NUMBERS = USHMM('Documenting Numbers of Victims of the Holocaust and Nazi Persecution', 'documenting-numbers-of-victims-of-the-holocaust-and-nazi-persecution');
const POLAND = USHMM('Invasion of Poland, Fall 1939', 'invasion-of-poland-fall-1939');
const WIESEL_LIFE = USHMM('Elie Wiesel', 'elie-wiesel');
const WIESEL: FactSource = { label: 'USHMM, Elie Wiesel’s remarks at the Museum’s dedication, April 22, 1993', href: 'https://www.ushmm.org/information/about-the-museum/mission-and-history/wiesel' };

/** The agreed objects, drawn as dark, softly lit silhouettes until the owner's picture is in place. */
export type Placeholder = 'tracks' | 'shoes' | 'suitcase' | 'door' | 'chair' | 'candle';
export const PLACEHOLDERS: readonly Placeholder[] = ['tracks', 'shoes', 'suitcase', 'door', 'chair', 'candle'];

/** The three parts of the history: ordinary life, the history, and remembering. */
export type Ambient = 'before' | 'during' | 'after';

export const SOUND_DIR = `${WALK_DIR}/sound`;
/** A clank's file name: clank-01.mp3, clank-02.mp3, … */
export const CLANK_FILE = /^clank-\d{2}\.mp3$/;
export const RATTLE_SRC = `${SOUND_DIR}/rattle.mp3`;
/** The film's music, when it is in place. */
export const MUSIC_SRC = `${WALK_DIR}/film-music.mp3`;
/** The metal the walk's steps are made of: the clanks found, and the rattle if there is one. */
export type WalkSounds = { clanks: readonly string[]; rattle: string | null };
export const NO_SOUNDS: WalkSounds = { clanks: [], rattle: null };

export type WalkLine = {
  id: string;
  text: string;
  sources: readonly FactSource[];
  /** The picture's slot (its file name, without the extension), and what the picture should show. */
  slot: string;
  image: string;
  /** The silhouette that stands in until the picture is there. */
  placeholder: Placeholder;
  /** Which part of the history this line belongs to. */
  part: Ambient;
  /** How long the film holds this line, when longer than the rest (FILM_LINE_MS): the names of the killing centers, and the toll. */
  hold?: number;
};

const line = (id: string, text: string, sources: FactSource[], slot: string, image: string, placeholder: Placeholder, part: Ambient, hold?: number): WalkLine => ({ id, text, sources, slot, image, placeholder, part, ...(hold ? { hold } : {}) });

export const WALK_LINES: readonly WalkLine[] = [
  // The film was rebuilt on November 4, 2026, at the owner's request: it climbs step by step, from the first laws to the death marches and the toll. Its lines are the owner's film script, word for word.
  // ── Before ──
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/jewish-life-in-europe-before-the-holocaust ("Jews have lived in Europe for more than two thousand years.")
  line('W1', 'Jews had lived in Europe for more than two thousand years.', [JEWISH_LIFE], 'w01-open-door', 'An open front door, warm light inside', 'door', 'before'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/jewish-life-in-europe-before-the-holocaust (photo caption: "Leipzig, Germany, April 1929").
  line('W2', 'Leipzig, April 1929: Berta Rosenheim holds a large paper school cone on her first day of school.', [JEWISH_LIFE], 'w03-school-cone', 'A paper school cone (Schultüte) on a desk', 'chair', 'before'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust ("in 1933 numbered 9 million people")
  line('W3', 'In 1933, about nine million Jewish people lived in Europe.', [INTRO], 'w02-lit-windows', 'Rows of lit windows in a town at dusk', 'candle', 'before'),
  // ── The steps ──
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/dachau ("established in March 1933"; "the first regular concentration camp"; its first prisoners "German Communists, Social Democrats, trade unionists")
  line('W4', 'March 1933. The Nazis opened Dachau, their first regular concentration camp, for people who opposed them.', [DACHAU], 'w33-camp-gate', 'A gate in a high wire fence, shut (no people)', 'door', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/boycott-of-jewish-businesses ("On April 1, 1933, the Nazis carried out the first nationwide, planned action against Jews")
  line('W5', 'April 1, 1933. The Nazis told Germans not to buy from Jewish shops.', [BOYCOTT], 'w34-shop-door', 'A small shop door with its blind pulled down', 'door', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/book-burning ("tens of thousands of books"; from May 10, 1933)
  line('W6', 'May 1933. Students threw tens of thousands of books into bonfires.', [BOOKS], 'w04-closed-book', 'A single closed book on stone', 'chair', 'during'),
  // REVIEW (new): Heinrich Heine, Almansor (1821): "Dort, wo man Bücher verbrennt, verbrennt man auch am Ende Menschen." Engraved at the book-burning memorial on Bebelplatz, Berlin. Please confirm the English wording you prefer.
  line('W7', '“Where they burn books, in the end they will burn people too.” (Heinrich Heine, a German Jewish poet, in his play Almansor, 1821)', [HEINE], 'w36-embers', 'Embers and grey ash on stone, the fire gone out', 'candle', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/the-nuremberg-race-laws (Jews could not be citizens; "future intermarriages … between Jews and people 'of German or related blood'" were banned)
  line('W8', 'September 15, 1935. New laws said Jews could not be citizens, and could not marry non-Jewish Germans.', [NUREMBERG], 'w05-nameplate-removed', 'A door with its nameplate removed', 'door', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/kristallnacht ("more than 1,400 synagogues"; "vandalized thousands of Jewish-owned businesses")
  line('W9', 'November 9–10, 1938. Nazis burned more than 1,400 synagogues and smashed thousands of Jewish shops.', [KRISTALLNACHT], 'w07-broken-window', 'A broken window pane, glass on the sill (no fire, no people)', 'door', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/kristallnacht ("about 26,000 Jewish men were imprisoned in the three camps": Dachau, Buchenwald, Sachsenhausen)
  line('W10', 'Then they sent about 26,000 Jewish men to concentration camps.', [KRISTALLNACHT], 'w11-closed-gate', 'A closed gate in a brick wall', 'door', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/kindertransport-1938-40 ("about 10,000 children to safety in Great Britain"; "Parents or guardians could not accompany the children.")
  line('W11', 'From December 1938, about 10,000 children were sent alone to Britain to find safety. Their parents could not come.', [KINDER], 'w08-suitcase-platform', 'A small suitcase on a station platform', 'suitcase', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/narrative/2906 (Jewish population of Europe in 1933: Poland "about 3,000,000", the largest community)
  line('W12', 'September 1, 1939. Germany invaded Poland, home to about three million Jews, more than any other country in Europe.', [POLAND, POPULATION], 'w39-empty-road', 'An empty country road under a low grey sky', 'tracks', 'during'),
  // REVIEW: https://hmd.org.uk/resource/steven-frank/ ("I was no longer allowed to play in the park"; the Netherlands, occupied in 1940)
  line('W13', '“I was no longer allowed to play in the park.” (Steven Frank, a boy in the occupied Netherlands)', [HMD('Steven Frank', 'steven-frank')], 'w06-park-bench', 'An empty park bench', 'chair', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/warsaw (sealed "mid-November 1940"; "over 400,000 Jews"; "an area of 1.3 square miles")
  line('W14', 'November 1940. More than 400,000 Jews were shut inside the Warsaw ghetto, an area of 1.3 square miles.', [WARSAW_GHETTO], 'w38-ghetto-wall', 'A high brick wall across a street, topped with wire', 'door', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/einsatzgruppen ("33,771 Jews" at Babi Yar, "over two days in September 1941")
  line('W15', 'September 1941. At Babi Yar, outside Kyiv, 33,771 Jews were shot in two days.', [EINSATZ], 'w43-ravine', 'An empty ravine under a grey sky', 'tracks', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/jewish-badge-during-the-nazi-era (from September 1941 all Jews in the Reich "six years of age or older"; in occupied Poland from 1939)
  line('W16', 'In Germany, from 1941, every Jew aged six or older was forced to wear a star on their clothes.', [BADGE], 'w40-star', 'A cloth star sewn on a dark coat on a hook', 'chair', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/wannsee-conference-and-the-final-solution (January 20, 1942; 15 officials; a villa in Wannsee)
  line('W17', 'January 20, 1942. Fifteen officials met at a villa at Wannsee, near Berlin, to plan the “Final Solution.”', [WANNSEE], 'w45-meeting-table', 'A long polished table, fifteen chairs, papers (no people)', 'chair', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/wannsee-conference-and-the-final-solution ("the code name for the systematic, deliberate, physical annihilation of the European Jews"; "approximately 11,000,000 Jews in Europe")
  line('W18', 'It meant the murder of every Jew in Europe. Their list counted about 11 million.', [WANNSEE], 'w46-typed-list', 'A typed list of countries and numbers on a desk', 'chair', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/wannsee-conference-and-the-final-solution ("The men at the table did not deliberate whether such a plan should be undertaken")
  line('W19', 'They did not discuss whether to do it. Only how.', [WANNSEE], 'w47-chairs-pushed-back', 'The same table, the chairs pushed back, the meeting over', 'chair', 'during'),
  // REVIEW: https://hmd.org.uk/resource/miep-gies/ ("on 6 July 1942, Otto and his family went to the upper rear rooms of his office building") and https://hmd.org.uk/resource/anne-frank/
  line('W20', 'In Amsterdam, July 6, 1942. The Frank family went into hiding, behind a bookcase.', [HMD('Miep Gies', 'miep-gies'), HMD('Anne Frank', 'anne-frank')], 'w12-bookcase', 'A bookcase, slightly open, like a door', 'door', 'during'),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/deportations-to-killing-centers
  line('W21', 'Trains carried Jews from across Europe. The Nazis called it “resettlement to the east.”', [DEPORTATIONS], 'w15-tracks-fog', 'Empty railway tracks into fog', 'tracks', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/killing-centers-an-overview (five killing centers, for "the sole purpose of murdering Jewish people on a mass scale using poisonous gas")
  line('W22', 'The trains went to killing centers, built for one purpose: to murder Jews with poison gas.', [KILLING_CENTERS], 'w16-suitcases', 'A row of old suitcases', 'suitcase', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/killing-centers-an-overview (the five: Chełmno, Belzec, Sobibor, Treblinka, Auschwitz-Birkenau). Held a little longer.
  line('W23', 'Chełmno. Belzec. Sobibor. Treblinka. Auschwitz-Birkenau.', [KILLING_CENTERS], 'w48-sidings', 'Railway sidings running up to a closed gate', 'tracks', 'during', 7000),
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/warsaw-ghetto-uprising ("On April 19, 1943"; the eve of Passover; "about 700 young Jewish fighters")
  line('W24', 'April 19, 1943, the eve of Passover. About 700 young Jewish fighters rose up in the Warsaw ghetto.', [WARSAW], 'w18-candle', 'One candle, burning steadily', 'candle', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/warsaw-ghetto-uprising (the resistance lasted 27 days; the Germans razed the ghetto, "burning and demolishing it block by block")
  line('W25', 'They held out for 27 days. The Germans burned the ghetto down, block by block.', [WARSAW], 'w50-burned-street', 'A street of burned-out buildings, empty', 'door', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/the-holocaust-in-hungary (deportations "Between May 15 and July 9, 1944"), as the Allies were about to land in France.
  line('W26', 'May 1944. Germany was losing the war. Still the trains ran.', [HUNGARY], 'w51-signal', 'A railway signal in summer haze', 'tracks', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/the-holocaust-in-hungary ("approximately 437,000 Jews were deported from Hungary"; about 330,000, "about 75 percent", "murdered in the gas chambers upon arrival" at Auschwitz-Birkenau)
  line('W27', 'In less than eight weeks, about 437,000 Jews were deported from Hungary. Most were murdered as soon as they reached Auschwitz.', [HUNGARY], 'w28-suitcase-on-side', 'A suitcase, closed, on its side', 'suitcase', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/anne-frank-biography ("On August 4, 1944, the German SS and police discovered the hiding place")
  line('W28', 'August 4, 1944. The Franks’ hiding place was found.', [ANNE], 'w13-diary', 'An open diary with a checked cover', 'chair', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/death-marches (the winter of 1944–1945; the SS evacuated the camps as the Allies closed in, on foot)
  line('W29', 'Winter 1944–45. As the Allied armies closed in, the SS forced prisoners out of the camps on foot, through the snow.', [DEATH_MARCHES], 'w52-snow-road', 'A road through snow, trodden (no people)', 'tracks', 'during'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/death-marches ("SS guards had strict orders to kill prisoners who could no longer walk"; "Thousands of prisoners died of exposure, starvation, and exhaustion")
  line('W30', 'Prisoners who could not keep walking were shot. Thousands more died of cold, hunger and exhaustion.', [DEATH_MARCHES], 'w53-shoe-in-snow', 'One worn shoe in the snow by a roadside', 'shoes', 'during'),
  // ── The end ──
  // REVIEW: https://encyclopedia.ushmm.org/content/en/article/auschwitz ("On January 27, 1945, Soviet troops liberated approximately 7,000 prisoners")
  line('W31', 'January 27, 1945. Soviet troops reached Auschwitz. About 7,000 prisoners were still alive there.', [AUSCHWITZ], 'w25-tracks-snow', 'Empty tracks in snow, first light', 'tracks', 'after'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/anne-frank-biography ("Anne Frank died in February or March 1945"; Bergen-Belsen; typhus; "at the age of 15")
  line('W32', 'February or March 1945. Anne Frank died at Bergen-Belsen, of typhus. She was 15.', [ANNE], 'w27-morning-window', 'A window with morning light', 'candle', 'after', 7000),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust (it "ended in May 1945, when the Allied Powers defeated Nazi Germany")
  line('W33', 'May 1945. The war in Europe ended.', [INTRO], 'w26-door-daylight', 'A hatch or door opening onto daylight', 'door', 'after'),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust ("six million European Jews").
  line('W34', 'Six million Jews had been murdered.', [INTRO], 'w29-stones-ledge', 'Stones, each a little different, along a ledge', 'candle', 'after', 8000),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust ("nearly two out of every three European Jews")
  line('W35', 'Nearly two out of every three Jews in Europe.', [INTRO], 'w24-table-for-one-more', 'A kitchen table set, the chairs empty', 'chair', 'after', 8000),
  // REVIEW (new): https://encyclopedia.ushmm.org/content/en/article/documenting-numbers-of-victims-of-the-holocaust-and-nazi-persecution (Roma "at least 250,000"; people with disabilities "250,000–300,000"; Soviet prisoners of war "around 3.3 million"; non-Jewish Polish civilians "around 1.8 million")
  line('W36', 'The Nazis also murdered at least 250,000 Roma and Sinti people, 250,000 disabled people, and millions of others.', [NUMBERS], 'w23-farmhouse-door', 'A farmhouse door, open, no one there', 'door', 'after', 8000),
  // REVIEW: Yad Vashem, November 3, 2025: the names of five million of the six million recovered; about a million still to be identified (as reported by Reuters, JTA and the Smithsonian). Yad Vashem's own page refused an automated check: please confirm.
  line('W37', 'Yad Vashem has found the names of five million of the six million Jews. About one million still have no name.', [YV_NAMES], 'w55-names-wall', 'A stone wall carved with rows of names, too many to read', 'candle', 'after', 8000),
  // REVIEW (new): https://www.ushmm.org/information/about-the-museum/mission-and-history/wiesel (his words, engraved at the entrance to the US Holocaust Memorial Museum)
  line('W38', '“For the dead and the living, we must bear witness.” (Elie Wiesel, who survived Auschwitz and Buchenwald)', [WIESEL, WIESEL_LIFE], 'w31-candle-window', 'A candle in a window at night', 'candle', 'after', 10000),
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
