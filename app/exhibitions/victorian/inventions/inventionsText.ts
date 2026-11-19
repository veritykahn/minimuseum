import type { ApprovedFact } from '@/components/exhibition/FactNote';

/*
 * The inventions workshop's words. The inventions are the three poster 1
 * names, "railways, the telegraph, and photography"; its lines are quoted
 * word for word (victorian.ts), and the room's test checks them. The rest
 * is instruction.
 *
 * What the benches show of each invention comes from outside the posters:
 * notes fact-checked against the Science Museum Group, Royal Museums
 * Greenwich, the V&A, the Getty and the Library of Congress, each set with
 * its source (NOTES). The railway's town times are the minutes given in the
 * Great Western Railway's 1841 timetable, as the Science Museum quotes it.
 * The photographs on the photography bench are Victorian photographs in the
 * Metropolitan Museum of Art's open-access collection (PHOTOS), each
 * credited and linked to its record.
 */

export const POSTER = {
  innovations: 'Iconic innovations like railways, the telegraph, and photography emerged, alongside cultural achievements in literature and art.',
  growth: 'This period saw rapid industrial growth, transforming the nation into a global superpower with an expanding empire.',
};

export const WORKSHOP_TEXT = {
  title: 'Inventions Workshop',
  railwayHeading: 'The railway',
  telegraphHeading: 'The telegraph',
  morseHeading: 'Morse code',
  photoHeading: 'Photography',
  railwayIntro: 'Steam down the line from London, town by town. At each station, compare the railway’s clock with the town’s own.',
  telegraphIntro: 'Build a telegraph and send the current down the wire. Press a letter on the dial and two needles swing to point to it. Send and receive telegrams.',
  morseIntro: 'Learn a few letters in Morse code, tap them out on the key, then decode a message.',
  photoIntro: 'Make a negative of a latticed window, then print from it: as many prints as you like.',
};

const SCIENCE_MUSEUM_TIME = { label: 'Science Museum, “Standardising time: Railways and the electric telegraph”', href: 'https://www.sciencemuseum.org.uk/objects-and-stories/standardising-time-railways-and-electric-telegraph' };
const RMG_LOCAL = { label: 'Royal Museums Greenwich, “Why do we have Greenwich Mean Time? ‘Local’ time and the railways”', href: 'https://www.rmg.co.uk/stories/time/time-greenwich-mean-time-confusing-case-travellers-watch' };
const RMG_GMT = { label: 'Royal Museums Greenwich, “What is Greenwich Mean Time (GMT)?”', href: 'https://www.rmg.co.uk/stories/time/greenwich-mean-time-gmt' };
const SMG_JOURNAL = { label: 'Science Museum Group Journal, “A tale of two telegraphs: Cooke and Wheatstone’s differing visions of electric telegraphy”', href: 'https://journal.sciencemuseum.ac.uk/article/cooke-and-wheatstones/' };
const VA_PROCESSES = { label: 'V&A, “An A to Z of photographic processes”', href: 'https://www.vam.ac.uk/articles/photographic-processes' };
const VA_TALBOT = { label: 'V&A, “William Henry Fox Talbot: an introduction”', href: 'https://www.vam.ac.uk/articles/william-henry-fox-talbot-an-introduction' };
const VA_CAMERON = { label: 'V&A, “Julia Margaret Cameron’s working methods”', href: 'https://www.vam.ac.uk/articles/julia-margaret-camerons-working-methods' };
const BT_TELEGRAM = { label: 'BT Archives, “The Greetings Telegram” (information sheet)', href: 'https://www.bt.com/bt-plc/assets/documents/about-bt/our-history/bt-archives/information-sheets-and-timelines/the-greetings-telegram.pdf' };
const GETTY_SMILE = { label: 'Getty, “Say Prunes!”: why people didn’t smile in early photographs', href: 'https://www.getty.edu/news/why-no-smile-photographs-history-education-question-answer/' };

export const NOTES = {
  /* ── The railway ── */
  railwayTime: {
    text: 'Towns kept their own time by the Sun, so the further west, the later their clocks. In 1841 the Great Western Railway’s timetable read “LONDON TIME is kept at all the Stations on the Railway”, and gave how many minutes each town’s time was behind it.',
    sources: [SCIENCE_MUSEUM_TIME],
  },
  timeSignals: {
    text: 'From 1852, accurate time signals from Greenwich went out across the country over the electric telegraph, and by 1855 nearly all public authorities, such as churches and town halls, set their clocks to “railway time”.',
    sources: [SCIENCE_MUSEUM_TIME],
  },
  sunTime: {
    text: 'In the early 19th century, people in Britain kept time by clocks set by the Sun, called local mean time. The Sun rises in the east and takes time to travel west, so noon came earlier in Greenwich than in Plymouth.',
    sources: [RMG_LOCAL],
  },
  missTrain: {
    text: 'A traveller who forgot that London time was ahead of the town’s own time risked missing the train.',
    sources: [SCIENCE_MUSEUM_TIME],
  },
  clearingHouse: {
    text: 'Railway companies brought in one standard time across their lines, mostly Greenwich Mean Time. In December 1847 the Railway Clearing House adopted it across Great Britain, and it became known as “Railway Time”.',
    sources: [RMG_GMT],
  },
  plymouth: {
    text: 'Local mean time in Plymouth was about 16½ minutes behind local mean time at Greenwich.',
    sources: [RMG_LOCAL],
  },
  travellersWatch: {
    text: 'In 1847 the clockmaker Benjamin Lewis Vulliamy made a gold watch with two minute hands: a gilt hand to show Greenwich time, and a steel hand that could be set to the time of the place the traveller visited.',
    sources: [RMG_LOCAL],
  },
  bristolClock: {
    text: 'The clock on Bristol’s Exchange was first installed in 1822. A second minute hand was later added to show the time in London as well as the local time in Bristol: a red minute hand shows Greenwich Mean Time, and a black one the original Bristol time.',
    sources: [{ label: 'Bristol City Council, “St Nicholas Markets: history” (archived page)', href: 'https://web.archive.org/web/20230529061424/https://www.bristol.gov.uk/st-nicholas-markets/about/history' }],
  },
  legalTime: {
    text: 'By the mid-1850s almost all public clocks in Britain were set to Greenwich Mean Time, and in 1880 it became Britain’s legal standard time.',
    sources: [RMG_GMT],
  },

  /* ── The telegraph ── */
  telegraph: {
    text: 'William Fothergill Cooke and Charles Wheatstone made their five-needle telegraph in 1837. Any two of its five needles would swing to point to a letter of the alphabet, and any of the 20 letters on the dial could be shown by the right pair.',
    sources: [
      { label: 'Science Museum Group, Cooke and Wheatstone 5-needle telegraph, 1837', href: 'https://collection.sciencemuseumgroup.org.uk/objects/co33374/cooke-and-wheatstone-5-needle-telegraph-1837' },
      { label: 'Science Museum blog, “Revealing the real Cooke and Wheatstone telegraph dial”', href: 'https://blog.sciencemuseum.org.uk/revealing-the-real-cooke-and-wheatstone-telegraph-dial/' },
    ],
  },
  dialLetters: {
    text: 'The dial was a diamond marked with 20 letters. C, J, Q, U, X and Z were left off, to save the expense of another needle and its wire.',
    sources: [SMG_JOURNAL],
  },
  wire: {
    text: 'The world’s first public telegraph service began in 1839, running 13 miles beside the Great Western Railway from London Paddington to West Drayton.',
    sources: [{ label: 'Science Museum Group, Cooke and Wheatstone five-needle telegraph', href: 'https://collection.sciencemuseumgroup.org.uk/objects/co32899' }],
  },
  oersted: {
    text: 'In 1820 Hans Christian Oersted found that a magnetised needle moved when it was brought near a wire carrying an electric current, and that it moved more if the wire was wound into a coil.',
    sources: [{ label: 'Science Museum Group, Oersted compass needle, 1828', href: 'https://collection.sciencemuseumgroup.org.uk/objects/co145363/oersted-compass-needle-1828' }],
  },
  needles: {
    text: 'On Cooke and Wheatstone’s dial the needles pointed up at rest, and leaned left or right when an electric current moved them. Two needles leaning opposite ways pointed to a letter.',
    sources: [SMG_JOURNAL],
  },
  morse: {
    text: 'Samuel Morse’s early receiver marked dots and dashes on a ribbon of paper. Later, clerks learned to read messages by ear from a “sounder”. On 24 May 1844 Morse sent “What hath God wrought?” from the U.S. Capitol in Washington to Baltimore.',
    sources: [{ label: 'Library of Congress, Samuel F. B. Morse Papers, “Invention of the Telegraph”', href: 'https://www.loc.gov/static/collections/samuel-morse-papers/articles-and-essays/collection-highlights/invention-of-the-telegraph.html' }],
  },

  morseBritain: {
    text: 'After 1870, when Britain’s telegraph companies were nationalised, needle telegraphs in Britain were standardised on Morse code: the needle leaning left for a dot, and right for a dash.',
    sources: [{ label: 'Science Museum Group, double-sided dummy single-needle telegraph used for training operators, 1870–1930', href: 'https://collection.sciencemuseumgroup.org.uk/objects/co8054889/double-sided-dummy-single-needle-telegraph-used-for-training-operators-1870-1930' }],
  },
  telegramPrice: {
    text: 'The Post Office changed the price of a telegraph message from 20 words for a shilling to 12 words for sixpence. To save money, people wrote shorter, more direct messages, and these were called “telegrams”.',
    sources: [BT_TELEGRAM],
  },
  telegramForm: {
    text: 'At the telegraph office, people filled out a form with their message. It was sent along the telegraph wires, then carried to the address by a messenger boy.',
    sources: [BT_TELEGRAM],
  },

  /* ── Photography ── */
  negative: {
    text: 'William Henry Fox Talbot made the oldest known surviving paper negative, of a window at Lacock Abbey, in August 1835.',
    sources: [{ label: 'Science Museum Group, Windows from inside south gallery, Lacock Abbey', href: 'https://collection.sciencemuseumgroup.org.uk/objects/co17291/windows-from-inside-south-gallery-lacock-abbey' }],
  },
  positives: {
    text: 'Talbot’s positive-negative process allows many positive prints to be made of the same image.',
    sources: [VA_TALBOT],
  },
  calotype: {
    text: 'Talbot patented his calotype process in 1841. Its negative was a sheet of good writing paper made sensitive to light with chemicals, and many prints could be made from it.',
    sources: [VA_PROCESSES],
  },
  sunPrint: {
    text: 'A print was made by laying the negative directly on sensitised photographic paper and putting it out in the sunlight.',
    sources: [VA_CAMERON],
  },
  exposure: {
    text: 'In the earliest days of the portrait daguerreotype, a photograph took over 15 minutes. That soon fell to just over a minute, but sitters still had to keep still the whole time, or the picture blurred.',
    sources: [GETTY_SMILE],
  },
  clamp: {
    text: 'Neck braces and head clamps were often used to hold sitters in place.',
    sources: [GETTY_SMILE],
  },
  prunes: {
    text: 'In London, the photographer Richard Beard told his sitters to say “prunes” before their portrait was made, for a small, tight mouth.',
    sources: [GETTY_SMILE],
  },
  daguerreotype: {
    text: 'Louis Daguerre announced the daguerreotype in 1839. It was made on a silver-plated sheet, and each one was a single picture that could not be copied.',
    sources: [VA_PROCESSES, VA_TALBOT],
  },
  collodion: {
    text: 'In the wet collodion process, introduced in 1851 by F. Scott Archer, a glass plate was coated, exposed while still wet and developed at once. It gave very fine detail.',
    sources: [VA_PROCESSES],
  },
  cameron: {
    text: 'Julia Margaret Cameron used the most common process of her time: albumen prints from wet collodion glass negatives.',
    sources: [VA_CAMERON],
  },
} satisfies Record<string, ApprovedFact>;

/** The towns on the line, east to west, and how many minutes each one's own time was behind London's (the 1841 timetable), with where each is on the map (longitude and latitude). */
export const STATIONS: { name: string; behind: number; lon: number; lat: number }[] = [
  { name: 'London', behind: 0, lon: -0.13, lat: 51.51 },
  { name: 'Reading', behind: 4, lon: -0.97, lat: 51.45 },
  { name: 'Steventon', behind: 5.5, lon: -1.32, lat: 51.62 },
  { name: 'Chippenham', behind: 8, lon: -2.12, lat: 51.46 },
  { name: 'Bath', behind: 11, lon: -2.36, lat: 51.38 },
  { name: 'Bristol', behind: 11, lon: -2.59, lat: 51.45 },
  { name: 'Bridgewater', behind: 14, lon: -3.0, lat: 51.13 },
];

/** Plymouth, further west and not on the 1841 line: its own time about 16½ minutes behind Greenwich's (NOTES.plymouth). */
export const PLYMOUTH = { name: 'Plymouth', behind: 16.5, lon: -4.14, lat: 50.37 };

/** Every town with a clock on the map: the line's, then Plymouth. */
export const MAP_TOWNS = [...STATIONS, PLYMOUTH];

/** Words to tap and send, every letter of them on the dial (no C, J, Q, U, X or Z), so none is left out. */
export const SEND_WORDS = ['HELLO', 'SNOW', 'STEAM', 'TEA', 'BRISTOL'];

/** Words for the needles to spell, every letter of them on the dial. */
export const READ_WORDS = ['STEAM', 'TRAIN', 'LONDON', 'BRISTOL', 'TELEGRAPH', 'PHOTOGRAPH'];

/*
 * The railway bench's steps, one idea each, in few words (instruction, no
 * claims beyond the notes): noon moving west across the map, a traveller's
 * watch against the town clocks, a train to catch, the stationmaster's job
 * of winding the station clocks on to London time, and Bristol's clock with
 * two minute hands, set by hand and used to catch a train.
 */
export type RailStepId = 'sun' | 'journey' | 'catch' | 'set' | 'bristol';
export const RAIL_STEPS: { id: RailStepId; title: string; body: string; task: string }[] = [
  {
    id: 'sun',
    title: 'Noon moves west',
    body: 'Each town set its clocks by the Sun. Noon came later to the towns further west.',
    task: 'Drag the Sun west across the map. Watch noon reach each town.',
  },
  {
    id: 'journey',
    title: 'Your watch says London time',
    body: 'Your watch keeps London time. Each town’s clock keeps its own time.',
    // REVIEW: new text
    task: 'Steam on. Before each town’s clock comes into view, predict it. Then compare it with your watch.',
  },
  {
    id: 'catch',
    title: 'Will you catch the train?',
    body: 'The trains ran by London time. The town clocks did not.',
    // REVIEW: new text
    task: 'Read the town clock. Work out London time. Then pick the next train you can still catch.',
  },
  {
    id: 'set',
    title: 'You’re the stationmaster',
    body: 'Your job: make every station clock on the line say London time.',
    // REVIEW: new text
    task: 'Read each station clock. Work out how many minutes it needs. Then wind it on.',
  },
  {
    id: 'bristol',
    title: 'A clock with two minute hands',
    body: 'Bristol’s Exchange clock shows two times at once: London’s on its red hand, and Bristol’s own on its black hand.',
    // REVIEW: new text
    task: 'Set both hands. Then use the clock to help a traveller catch the train.',
  },
];

/**
 * "Will you catch the train?": the town, what its own clock says, and the
 * trains to London on the board, by London time (all in minutes after
 * midnight). The game's own times, not a timetable's. The one to catch is
 * the earliest still to come by London time (workshop.ts, nextTrain); in
 * most, the train the town clock seems to say you can catch has already
 * gone, and in some the first train is still there, so no rule of thumb
 * ("never the first") works without working it out.
 */
// REVIEW: new text (the game's trains)
export const TRAIN_PUZZLES: { town: string; clock: number; trains: number[] }[] = [
  { town: 'Bath', clock: 11 * 60 + 52, trains: [12 * 60, 12 * 60 + 15, 12 * 60 + 45] },
  { town: 'Bristol', clock: 12 * 60 + 10, trains: [12 * 60 + 25, 12 * 60 + 40, 13 * 60] },
  { town: 'Bridgewater', clock: 15 * 60 + 30, trains: [15 * 60 + 40, 15 * 60 + 50, 16 * 60 + 20] },
  { town: 'Steventon', clock: 9 * 60 + 20, trains: [9 * 60 + 30, 9 * 60 + 45, 10 * 60 + 15] },
  { town: 'Reading', clock: 14 * 60 + 53, trains: [14 * 60 + 55, 15 * 60 + 10, 15 * 60 + 40] },
  { town: 'Chippenham', clock: 10 * 60 + 45, trains: [10 * 60 + 50, 11 * 60 + 5, 11 * 60 + 30] },
];

/**
 * "You're the stationmaster": the London time the telegraph wire brings
 * (the game's, not history's), and the stations whose clocks still show
 * their own town's time, to be wound on to it.
 */
export const STATION_JOB = {
  london: 12 * 60 + 10,
  towns: ['Reading', 'Chippenham', 'Bath', 'Bridgewater'],
  goal: [
    'The trains run by London time, so every station clock must say London time.',
    'A message comes down the telegraph wire from London with the time.',
    // REVIEW: new text
    'But these station clocks still show their own town’s time. Read each clock, and work out how many minutes to wind it on.',
  ],
};

/** Bristol's Exchange clock as the bench draws it: London time, and Bristol's own 11 minutes behind (the 1841 timetable). */
export const BRISTOL_CLOCK = { london: 12 * 60 + 10, behind: 11 };
/** The game's train from Bristol to London, by London time, caught with the clock. */
export const BRISTOL_TRAIN = 12 * 60 + 30;
/**
 * Bristol's clock, put to use: a traveller reads the black hand (Bristol's
 * own time) and thinks there is half an hour to the train, which goes by
 * London time. How long is there really? The answers: the right one (from
 * the red hand), the black hand's (the traveller's mistake), and the gap
 * between the hands.
 */
// REVIEW: new text
export const BRISTOL_ASK = {
  says: '“My train to London is at half past twelve,” says a traveller, looking up at the black hand. “Half an hour yet!”',
  question: 'How long has the traveller really got?',
  answers: [BRISTOL_TRAIN - (BRISTOL_CLOCK.london - BRISTOL_CLOCK.behind), BRISTOL_TRAIN - BRISTOL_CLOCK.london, BRISTOL_CLOCK.behind],
  right: BRISTOL_TRAIN - BRISTOL_CLOCK.london,
};

/*
 * Build a telegraph: five parts, each put where it does its job on the
 * drawing of the circuit. `job` is what its empty place on the drawing
 * says; `name` is the part in the tray; `line` is said once it is in place
 * (instruction and plain description, no claims beyond the notes).
 */
export type WirePartId = 'battery' | 'key' | 'wire' | 'coil' | 'needle';
export const WIRE_PARTS: { id: WirePartId; name: string; job: string; line: string }[] = [
  { id: 'battery', name: 'Battery', job: 'Makes the electric current', line: 'The battery makes an electric current.' },
  { id: 'key', name: 'Key', job: 'A switch: press it to send', line: 'The key is a switch. Press it and the current flows; let go and it stops.' },
  { id: 'wire', name: 'Wire', job: 'Carries the current miles away', line: 'The wire carries the current to a station miles away. The first telegraph wires ran beside the railway.' },
  { id: 'coil', name: 'Coil', job: 'Wire wound round: pushes on a magnet', line: 'At the far end the wire is wound into a coil. When the current flows through it, it pushes on a magnet.' },
  { id: 'needle', name: 'Needle', job: 'Swings to show the message', line: 'The magnet is a needle, like a compass needle. When the current flows, it swings, and a clerk at the far station reads it.' },
];

/*
 * The Morse code bench: a few letters to learn first (the short ones,
 * each made of no more than three dots and dashes), words to tap out made
 * of only those letters, and short messages to decode, made of them too.
 */
export const MORSE_LEARN = ['E', 'T', 'I', 'M', 'A', 'N', 'S', 'O'];
export const MORSE_WORDS = ['TEA', 'SEA', 'NEST', 'MOON', 'STONE', 'TOAST', 'MITTENS'];
export const MORSE_MESSAGES = ['TEA AT TEN', 'MEET ME AT NOON', 'TIME TO EAT', 'SEE ME SOON', 'NO TOAST', 'MEN AT SEA', 'MITTENS ON', 'SAM IS IN'];

/** International Morse code for each letter, to try on the key. */
export const MORSE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--',
  N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
};

/*
 * The telegraph office: write a telegram on the form, pay for it at the
 * counter from the money in your purse (crossing words out until it fits),
 * watch the clerk tap it out in International Morse code, then address it
 * and print it; or receive one and decode it. Twelve words for sixpence is
 * the Post Office's price (BT Archives, NOTES.telegramPrice); the halfpenny
 * for each word over twelve is the room's own game rule, and said so on the
 * page. So is the purse: the money in it is the game's, not a sum from the
 * records.
 */
export const TELEGRAM = {
  /** Words for the price of sixpence. */
  words: 12,
  /** The longest telegram the form takes, in words. */
  maxWords: 30,
  /** The game rule: each word over twelve costs a halfpenny more. */
  extraHalfpence: 1,
  rule: 'Game rule: each word over 12 costs a halfpenny more.',
  /** Said on the telegram form itself, above its letters. */
  morseNote: 'In International Morse code',
  /** What is in the visitor's purse, in halfpence (6d, 7d, 8d): one is chosen for each visit to the counter. */
  purses: [12, 14, 16],
  purseNote: 'The money in your purse is the game’s.',
};

/**
 * Letters to start from, written as you would write a letter: far too long
 * for the money in the purse, so there is something to cut. Made up for
 * the workshop. Each carries what the person it goes to must still be told
 * (`keep`): the clerk reads the form back before sending it, and asks about
 * any of these whose words have all been crossed out, so cutting is a
 * choice (what can go, and what must stay), not crossing out the end.
 */
// REVIEW: new text (the clerk's questions)
export const TELEGRAM_DRAFTS: { name: string; text: string; keep: { words: string[]; ask: string }[] }[] = [
  {
    name: 'Ada’s letter',
    text: 'DEAR MOTHER I HAVE ARRIVED SAFELY IN BATH AND THE TRAIN WAS VERY FAST PLEASE SEND MY WARM COAT AND SOME CAKE LOVE FROM ADA',
    keep: [
      { words: ['ARRIVED', 'SAFELY'], ask: 'Will your mother know you got there safely?' },
      { words: ['BATH'], ask: 'Will your mother know where you are?' },
      { words: ['COAT'], ask: 'Will your mother know what to send?' },
      { words: ['ADA'], ask: 'Will your mother know who it is from?' },
    ],
  },
  {
    name: 'Tom’s letter',
    text: 'DEAR UNCLE I AM SO SORRY BUT I HAVE MISSED THE TRAIN TO LONDON SO I WILL ARRIVE TOMORROW AT NOON INSTEAD FROM YOUR NEPHEW TOM',
    keep: [
      { words: ['MISSED'], ask: 'Will your uncle know what went wrong?' },
      { words: ['TOMORROW'], ask: 'Will your uncle know which day you are coming?' },
      { words: ['NOON'], ask: 'Will your uncle know what time to meet you?' },
      { words: ['TOM', 'NEPHEW'], ask: 'Will your uncle know who it is from?' },
    ],
  },
  {
    name: 'The new puppy',
    text: 'HELLO GRANDMA THE NEW PUPPY HAS COME TO LIVE WITH US AND HE IS SMALL AND BROWN AND WE HAVE CALLED HIM BISCUIT PLEASE VISIT SOON',
    keep: [
      { words: ['PUPPY'], ask: 'Will your grandma know what the news is?' },
      { words: ['BISCUIT'], ask: 'Will your grandma know the puppy’s name?' },
      { words: ['VISIT'], ask: 'Will your grandma know you want her to come?' },
    ],
  },
];

/**
 * Telegrams to receive and decode: short, made up for the workshop in the
 * style of the time (no real person's words), one chosen at random each
 * time. Every letter is in the chart.
 */
export const INCOMING = [
  'TEA AT FOUR',
  'TRAIN IS LATE',
  'COME HOME',
  'ALL IS WELL',
  'MEET ME AT BATH',
  'BABY GIRL BORN',
  'SHIP IN SAFE',
  'MISSED TRAIN HOME LATE',
  'BRING YOUR UMBRELLA',
  'CAKE WON FIRST PRIZE',
  'SNOW HERE SEND BOOTS',
  'HAPPY BIRTHDAY',
  'BACK ON FRIDAY',
  'LOST MY HAT',
  'GOOSE FOR CHRISTMAS',
  'PARCEL SENT TODAY',
  'WE WON AT CRICKET',
  'AUNT ARRIVES AT NOON',
  'KITTENS ALL FOUND HOMES',
  'RAIN STOPPED PLAY',
  'PONY SOLD AT FAIR',
  'PASSED MY EXAM',
  'BRIDGE IS OPEN',
  'FOG IN LONDON',
];
export const INCOMING_NOTE = 'Made-up telegrams, in the style of the time.';

/*
 * The photographs on the photography bench: Victorian photographs from the
 * Metropolitan Museum of Art's open-access collection (public domain), as
 * its records title and date them. The print of Talbot's negative is the
 * room's own: the negative's tones turned back, made for the room, and
 * said so wherever it is shown.
 */
export type PhotoId = 'negative' | 'openDoor' | 'daguerreotype' | 'cameron';
export const PHOTOS: Record<PhotoId, { src: string; alt: string; title: string; maker: string; date: string; medium: string; href: string; w: number; h: number }> = {
  negative: {
    src: '/exhibitions/victorian/photography/talbot-oriel-window-negative.webp',
    alt: 'A faded purple paper negative of a tall window: the panes come out dark and the stone bars between them light',
    title: 'The Oriel Window, South Gallery, Lacock Abbey',
    maker: 'William Henry Fox Talbot',
    date: 'probably 1835',
    medium: 'Paper negative',
    href: 'https://www.metmuseum.org/art/collection/search/282004',
    w: 1200,
    h: 991,
  },
  openDoor: {
    src: '/exhibitions/victorian/photography/talbot-open-door.webp',
    alt: 'A brown photograph of an open wooden door in a stone wall, a broom leaning against it and a lantern hanging beside it',
    title: 'The Open Door',
    maker: 'William Henry Fox Talbot',
    date: 'before May 1844',
    medium: 'Salted paper print from paper negative',
    href: 'https://www.metmuseum.org/art/collection/search/283068',
    w: 1400,
    h: 1023,
  },
  daguerreotype: {
    src: '/exhibitions/victorian/photography/claudet-daguerreotype.webp',
    alt: 'A hand-coloured portrait of a balding man in glasses and a dark coat, in a gilt frame with an arched top',
    title: 'Middle-aged Man with Glasses Holding Pocket Watch',
    maker: 'Antoine-François-Jean Claudet',
    date: '1844–59',
    medium: 'Daguerreotype with applied colour',
    href: 'https://www.metmuseum.org/art/collection/search/291820',
    w: 900,
    h: 1035,
  },
  cameron: {
    src: '/exhibitions/victorian/photography/cameron-cassiopeia.webp',
    alt: 'A brown portrait of a young woman with curly hair, looking straight at the camera',
    title: 'Cassiopeia',
    maker: 'Julia Margaret Cameron',
    date: 'June 1866',
    medium: 'Albumen silver print from glass negative',
    href: 'https://www.metmuseum.org/art/collection/search/282042',
    w: 900,
    h: 1182,
  },
};

/** The print of Talbot's negative, made for the room: its tones turned back, as a print in the sun turns them. */
export const POSITIVE = {
  src: '/exhibitions/victorian/photography/talbot-oriel-window-positive.webp',
  alt: 'The same window the right way round: bright panes and dark stone bars, in brown tones',
  note: 'Made for this room from Talbot’s negative, its light and dark turned back the way a print turns them.',
};

export const MET_CREDIT = 'The Metropolitan Museum of Art, public domain';

/**
 * The three ways to make a photograph: first taught (the process, the
 * photograph that shows it, and what it was, from the notes), then the
 * quiz, a clue for each photograph.
 */
export const PROCESS_CLUES: { photo: PhotoId; process: string; short: string; teach: string; clue: string; note: keyof typeof NOTES }[] = [
  {
    photo: 'daguerreotype',
    process: 'Daguerreotype',
    short: 'Daguerreotype',
    teach: 'Made on a shiny silver-plated sheet. Each one was a single picture that could not be copied.',
    clue: 'I was made on a shiny silver-plated sheet. There is only one of me: I could not be copied.',
    note: 'daguerreotype',
  },
  {
    photo: 'openDoor',
    process: 'Calotype (Talbot’s paper negative)',
    short: 'Calotype',
    teach: 'Talbot’s way: the negative was a sheet of paper, so many prints could be made from it.',
    clue: 'My negative was made of paper, so many prints could be made from it.',
    note: 'calotype',
  },
  {
    photo: 'cameron',
    process: 'Wet collodion (a glass negative)',
    short: 'Wet collodion',
    teach: 'The negative was a sheet of glass, coated, used while still wet and developed at once. It gave very fine detail.',
    clue: 'My negative was a sheet of glass, coated and used while it was still wet.',
    note: 'collodion',
  },
];

/** The quiz asks about the photographs in another order than the lesson showed them. */
export const QUIZ_ORDER: PhotoId[] = ['cameron', 'daguerreotype', 'openDoor'];

/** The photography bench's parts, each its own tab in the card. */
export const PHOTO_PARTS = [
  { id: 'print', label: 'Negative to print' },
  { id: 'still', label: 'Hold still!' },
  { id: 'three', label: 'Three ways' },
  { id: 'sheet', label: 'Print a sheet' },
] as const;
export type PhotoPart = (typeof PHOTO_PARTS)[number]['id'];

/*
 * Making the negative: lift the cap off the lens and count while the light
 * falls on the paper, then put it back. The workshop's seconds (a game
 * rule, said so on the page): under 4 the picture is too faint, over 9 the
 * whole sheet goes too dark, and 5 to 8 makes a good negative.
 */
export const EXPOSURE = { faintBelow: 4, darkAbove: 9, best: [5, 8] as const, max: 14 };

export type ExposureResult = 'faint' | 'good' | 'dark';
/** How a negative exposed for `seconds` comes out. */
export function exposureFor(seconds: number): ExposureResult {
  if (seconds < EXPOSURE.faintBelow) return 'faint';
  if (seconds > EXPOSURE.darkAbove) return 'dark';
  return 'good';
}
export const EXPOSURE_WORDS: Record<ExposureResult, string> = {
  faint: 'Too faint! The light had too little time. Try a new sheet, and count longer.',
  good: 'A good negative! The bright window has come out dark, and the dark stone light.',
  dark: 'Too dark! The light had too long, and the whole sheet darkened. Try a new sheet, and count less.',
};

/** How long the sitting takes, in seconds: a real one took a minute or more (NOTES.exposure). */
export const EXPOSURE_S = 8;

/**
 * How blurred the portrait comes out: two pixels of blur for every second
 * the sitter let go of the clamp (and so moved), and never more than twelve.
 */
export function blurFor(movedMs: number) {
  const px = (movedMs / 1000) * 2;
  return Math.min(12, Math.round(px * 10) / 10);
}

/** What the portrait came out as, by its blur. */
export function verdictFor(blur: number): { tone: 'right' | 'near' | 'wrong'; words: string } {
  if (blur <= 0.5) return { tone: 'right', words: 'Pin sharp! You held the clamp the whole time, so you kept perfectly still.' };
  if (blur <= 4) return { tone: 'near', words: 'A little soft. You let go of the clamp for a moment, and moved.' };
  return { tone: 'wrong', words: 'A blur! You let go of the clamp for too long. Try again, and keep holding it.' };
}
