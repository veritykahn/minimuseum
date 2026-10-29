import type { CSSProperties } from 'react';
import type { Atmosphere, CasePageData, ExhibitionConfig, PanelFigure } from '@/components/exhibition/types';
import { floorReturnFor } from '@/lib/floors';

/*
 * The Writing Revolution: every word on screen, and the look.
 *
 * The poster copy is set exactly as printed on the two posters, with only the
 * owner's approved decisions:
 *   1. "suddenly, books cost 1/30th of their previous price" is set
 *      "suddenly, books cost a fraction of their previous price";
 *   2. "The U.S. Navy tested it during World War II and found dramatic
 *      improvements." is set "…and reported dramatic improvements, though the
 *      study was overseen by Dvorak himself and a 1956 government study found
 *      no real advantage.";
 *   3. "His solution was ingenious" is set "His solution, in the best-known
 *      account, was ingenious";
 *   4. "Studies show that while QWERTY forces our fingers to travel 50% more
 *      distance than necessary" is set "Studies suggest that while QWERTY
 *      makes our fingers travel farther than necessary";
 *   5. poster 1's admission ticket and its QR code are a link to the American
 *      Writers Museum;
 *   6. the Urania typewriter on both posters is the owner's own photograph,
 *      cut out here from poster 2, where it is larger and cleaner. No
 *      photographs of the installation are used.
 * Typesetting only: the missing space in "creativity.As AI" is restored.
 *
 * Each sentence lives in one place below, so a fix to the posters is a
 * one-line edit here. Paragraphs are split only between sentences; nothing is
 * reworded. The posters have no subheads, so each later paragraph's own
 * first sentence opens its chapter as a section title, still in the
 * poster's order.
 *
 * The "Talk about it" questions are for the projector's teacher strip: open
 * discussion questions, one per chapter, keyed by the section title exactly
 * as it is set (OPENING, '', is the panels before the first section title).
 * They make no factual claims.
 */

// The posters' color blocks: charcoal and coral-red (poster 1), bright cyan and charcoal (poster 2), and the white frame line.
const CHARCOAL = '#2B2B2B';
const CORAL = '#F2634D';
const CYAN = '#16B4D6';
const WHITE = '#FFFFFF';
/* Copy on the coral and the cyan: near-black, as poster 1 sets it on the coral (6.6:1 and 8.4:1). */
const INK = '#161616';
/* Copy on the charcoal: off-white (12:1). */
const PAPER = '#F2F0EA';

/* Titles: a tall condensed sans, all capitals (Antonio). */
const DISPLAY = "'Antonio', 'Oswald', 'Arial Narrow', sans-serif";
/* Copy: the posters' typewriter monospace (Courier Prime). */
const MONO = "'Courier Prime', 'Courier New', Courier, monospace";

export const AMERICAN_WRITERS_MUSEUM_URL = 'https://americanwritersmuseum.org/';

/** The Urania, the owner's own photograph, cut out of poster 2's cyan. */
const URANIA: PanelFigure = {
  src: '/exhibitions/writing-revolution/urania.webp',
  alt: 'A black Urania portable typewriter seen from the front: four rows of round silver-rimmed keys, the name Urania in gold above them and Clemens Müller A.G. Dresden in gold along the base',
  side: 'right',
};

/*
 * The posters' titles as pictures: their own tall white lettering with its
 * dotted capitals, cut from the posters at the posters' resolution and keyed
 * out of the color blocks behind it (public/exhibitions/writing-revolution/titles/).
 * A sharper export of the same lettering can replace a file at the same path;
 * update its size here.
 */
const TITLE_SIZES = {
  writingRevolution: { width: 650, height: 421 },
  qwertysAccidentalEmpire: { width: 474, height: 316 },
};

/*
 * The walkthrough's atmospheres (writing-revolution.css draws them), each from
 * the posters' own design:
 *   colorblock-split  the posters' two color blocks meeting, the thin white frame line drawn round them
 *   carriage-return   a sheet in the typewriter: the paper rolling up a line at a time, the carriage running across and back
 *   urania-bleed      the Urania sliding in and bleeding off the edge, as poster 1 sets it
 *   qwerty-rows       the keyboard's round keys in their rows, the top row struck Q, W, E, R, T, Y
 *   bondi-screen      the digital age: a Bondi blue screen glowing, scan lines rolling, a cursor blinking
 *   admission-ticket  poster 1's gold admission ticket, torn at its stub
 */
const ATMOSPHERES: Record<string, Atmosphere> = {
  'colorblock-split': { bg: CHARCOAL, text: PAPER, title: WHITE, parts: 3 },
  'carriage-return': { bg: '#EFEADF', text: INK, title: INK, parts: 3 },
  'urania-bleed': { bg: CORAL, text: INK, title: INK, parts: 1, images: [{ src: '/exhibitions/writing-revolution/urania.webp', className: 'wr-urania' }] },
  'qwerty-rows': { bg: CHARCOAL, text: PAPER, title: WHITE, parts: 4 },
  'bondi-screen': { bg: '#0A2630', text: '#E6FAFF', title: '#7FE3F5', parts: 3 },
  'admission-ticket': { bg: CYAN, text: INK, title: INK, parts: 2 },
};

export const WRITING_REVOLUTION_PROJECTOR_THEME = {
  '--pj-bg': CHARCOAL,
  '--pj-ink': PAPER,
  '--pj-muted': '#BDBAB2',
  '--pj-accent': CORAL,
  '--pj-on-accent': INK,
  '--pj-display': DISPLAY,
  '--pj-body': MONO,
} as CSSProperties;

export const WRITING_REVOLUTION: ExhibitionConfig<'poster1' | 'poster2'> = {
  slug: 'writing-revolution',
  name: 'The Writing Revolution',
  subtitle: 'From Movable Type to the Digital Age',
  fonts: {
    href: 'https://fonts.googleapis.com/css2?family=Antonio:wght@200..700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap',
    display: DISPLAY,
    body: MONO,
  },
  palette: {
    page: CHARCOAL,
    heading: WHITE,
    accent: CORAL,
    teach: { color: CORAL, border: 'rgba(242,99,77,0.6)' },
  },
  back: floorReturnFor('writing-revolution'),
  atmospheres: ATMOSPHERES,
  // The color blocks slide together as a poster opens; after that each panel arrives its own way.
  fx: { theme: 'wr', veil: 'first', text: 'all' },
  projector: {
    theme: WRITING_REVOLUTION_PROJECTOR_THEME,
    links: [{ label: 'The Typing Station: a typewriter, an iMac and the top row', href: '/exhibitions/writing-revolution/typing-station' }],
  },
  cases: [
    {
      href: '/exhibitions/writing-revolution/artifacts/case',
      label: 'Display Case',
      title: 'Artifacts',
    },
  ],
  interactives: [
    {
      href: '/exhibitions/writing-revolution/typing-station',
      // The owner's illustration (Leonardo.Ai).
      image: {
        src: '/exhibitions/writing-revolution/landing-typing-station.webp',
        alt: 'An illustration of a typewriter’s round keys, Q W E R T Y, against a coral wall',
        credit: 'Illustration made with Leonardo.Ai',
      },
      label: 'Interactive',
      title: 'The Typing Station',
      subtitle: 'The same line on a typewriter and an iMac',
    },
  ],
  posters: [
    // ============================================
    // POSTER 1: The Writing Revolution
    // ============================================
    {
      id: 'poster1',
      title: 'The Writing Revolution',
      hero: {
        src: '/exhibitions/writing-revolution/poster1.jpg',
        alt: 'The Writing Revolution poster: a charcoal block above a coral-red one inside a thin white frame line, the title in tall white capitals across both, a gold admission ticket at the top right, three paragraphs of typewritten text, and a black Urania typewriter running off the right edge',
      },
      colors: { bg: CHARCOAL, text: PAPER, title: WHITE },
      sections: {
        title: { className: 'wr-title wr-frame' },
        frame: { className: 'wr-frame' },
      },
      items: [
        {
          type: 'title-image',
          section: 'title',
          atmosphere: 'colorblock-split',
          effect: 'split-reveal',
          src: '/exhibitions/writing-revolution/titles/writing-revolution.png',
          ...TITLE_SIZES.writingRevolution,
          framing: 'centered',
          alt: 'The Writing Revolution',
        },
        { type: 'paragraph', atmosphere: 'carriage-return', effect: 'typewriter', position: 'center', text: 'For thousands of years, writing was a privilege reserved for scribes, monks, and the wealthy elite. This exclusivity shattered with each technological leap.' },
        { type: 'paragraph', atmosphere: 'carriage-return', effect: 'ink-spread', position: 'center', text: 'The printing press, invented by Johannes Gutenberg around 1440, was the first great equalizer—suddenly, books cost a fraction of their previous price, sparking mass literacy movements across Europe.' },
        { type: 'paragraph', atmosphere: 'urania-bleed', effect: 'film-credits', position: 'top-left', className: 'wr-beside-urania', text: 'But true democratization began with the typewriter. In 1868, Christopher Latham Sholes patented the first practical typewriter, giving ordinary citizens the power to create professional documents.' },
        { type: 'paragraph', atmosphere: 'qwerty-rows', effect: 'fade-in', section: 'frame', position: 'center', text: 'Women especially embraced this technology, flooding into offices as typists and gaining economic independence previously denied to them.' },

        { type: 'section-title', atmosphere: 'bondi-screen', effect: 'glitch', text: 'The computer age obliterated remaining barriers.' },
        { type: 'paragraph', atmosphere: 'bondi-screen', effect: 'typewriter', position: 'top-left', text: 'Early word processors in the 1970s meant anyone could edit and perfect their writing without costly reprints.' },
        { type: 'paragraph', atmosphere: 'bondi-screen', effect: 'rise-expand', position: 'center', text: "Desktop publishing software like PageMaker (1985) ended publishers' monopoly—suddenly, anyone could design newsletters, magazines, or books from their home." },
        { type: 'paragraph', atmosphere: 'bondi-screen', effect: 'blur-to-sharp', position: 'center', text: 'The internet completed this revolution: Blogger (1999) let millions publish their thoughts free, Wikipedia (2001) proved that collective amateur writers could rival encyclopedias, and social media transformed every phone owner into a publisher with potential global reach.' },
        { type: 'paragraph', atmosphere: 'qwerty-rows', effect: 'drift', section: 'frame', position: 'center', text: "Self-publishing platforms like Amazon's CreateSpace meant authors no longer needed agents or publishing houses to reach readers." },

        { type: 'section-title', atmosphere: 'colorblock-split', effect: 'mega-zoom-out', section: 'frame', text: 'This democratization has profound implications.' },
        { type: 'paragraph', atmosphere: 'carriage-return', effect: 'typewriter', position: 'center', text: 'In 1900, only major newspapers and publishers could spread ideas widely; today, a tweet from a teenager can influence millions.' },
        { type: 'paragraph', atmosphere: 'bondi-screen', effect: 'glitch', position: 'center', text: 'Yet this power brings new challenges: information overload, the spread of misinformation, and algorithms that decide what writing gets seen.' },
        { type: 'paragraph', atmosphere: 'carriage-return', effect: 'fade-in', position: 'center', text: 'At the same time we are also discovering surprising truths: while we read faster on screens, we remember more from printed pages, and handwriting activates different parts of our brain than typing, aiding memory and creativity.' },
        { type: 'paragraph', atmosphere: 'bondi-screen', effect: 'typewriter', position: 'center', text: 'As AI writing tools emerge, we face the ultimate democratization—what happens when anyone can generate professional-quality text instantly?' },
        { type: 'paragraph', atmosphere: 'urania-bleed', effect: 'shrink-back', position: 'top-left', className: 'wr-beside-urania', text: "The writing revolution's greatest achievement isn't just making everyone a potential writer, but proving that important ideas can come from anywhere, not just ivory towers and newsrooms." },
        { type: 'paragraph', atmosphere: 'colorblock-split', effect: 'breathe', section: 'frame', position: 'center', className: 'wr-closing', text: 'Every new technology has chipped away at the gates that once kept most voices silent.' },

        { type: 'callout', atmosphere: 'admission-ticket', effect: 'rise-expand', text: 'Visit the American Writers Museum', url: AMERICAN_WRITERS_MUSEUM_URL },
        { type: 'end', atmosphere: 'colorblock-split', section: 'frame', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Writing was once only for a few people. Who do you think gets to share their ideas today, and whose voices might still be missing?',
        'The computer age obliterated remaining barriers.':
          'If you could publish anything for the whole world to read, what would you write, and who would you hope reads it?',
        'This democratization has profound implications.':
          'How do you decide whether something you read is worth trusting? Does writing by hand feel different to you from typing?',
      },
    },

    // ============================================
    // POSTER 2: QWERTY's Accidental Empire
    // ============================================
    {
      id: 'poster2',
      title: "QWERTY's Accidental Empire",
      hero: {
        src: '/exhibitions/writing-revolution/poster2.jpg',
        alt: "QWERTY's Accidental Empire poster: a black Urania typewriter on a bright cyan block above a charcoal one, inside a thin white frame line, the title in tall white capitals across both blocks, and three columns of typewritten text",
      },
      colors: { bg: CHARCOAL, text: PAPER, title: WHITE },
      sections: {
        title: { className: 'wr-title wr-cyan wr-frame' },
        frame: { className: 'wr-frame' },
        cyan: { className: 'wr-cyan' },
      },
      items: [
        {
          type: 'title-image',
          section: 'title',
          atmosphere: 'colorblock-split',
          effect: 'rise-expand',
          src: '/exhibitions/writing-revolution/titles/qwertys-accidental-empire.png',
          ...TITLE_SIZES.qwertysAccidentalEmpire,
          framing: 'centered',
          alt: "QWERTY's Accidental Empire",
        },
        { type: 'paragraph', atmosphere: 'qwerty-rows', effect: 'kenburns-in', section: 'cyan', colors: { bg: CYAN, text: INK, title: INK }, position: 'center', figure: URANIA, className: 'wr-statement', text: 'The keyboard beneath your fingers holds a 150-year-old secret.' },
        { type: 'paragraph', atmosphere: 'carriage-return', effect: 'typewriter', position: 'center', text: 'In 1868, Christopher Latham Sholes, a Milwaukee newspaper editor, was perfecting his "Type-Writer" machine when he encountered a frustrating problem: when typists worked too quickly, the metal arms carrying the letters would jam together.' },
        { type: 'paragraph', atmosphere: 'qwerty-rows', effect: 'split-reveal', section: 'frame', position: 'top-left', text: 'His solution, in the best-known account, was ingenious—he analyzed letter frequency in the English language and separated commonly paired letters like "TH" and "HE" across the keyboard.' },
        { type: 'paragraph', atmosphere: 'qwerty-rows', effect: 'fade-in', section: 'frame', position: 'bottom-right', text: 'This seemingly random arrangement, which placed "QWERTY" across the top row, actually prevented mechanical collisions.' },
        { type: 'paragraph', atmosphere: 'urania-bleed', effect: 'film-credits', section: 'cyan', colors: { bg: CYAN }, position: 'top-left', className: 'wr-beside-urania', text: "Contrary to popular myth, Sholes didn't design QWERTY to slow typists down—he designed it to let them type as fast as possible without breaking the machine." },

        { type: 'section-title', atmosphere: 'colorblock-split', effect: 'blur-to-sharp', section: 'cyan', className: 'wr-long', text: 'By the time electric typewriters eliminated the jamming problem, QWERTY had already conquered the world.' },
        { type: 'paragraph', atmosphere: 'qwerty-rows', effect: 'drift', section: 'frame', position: 'center', text: 'Millions had trained their muscle memory on this layout, and entire industries depended on it.' },
        { type: 'paragraph', atmosphere: 'carriage-return', effect: 'typewriter', position: 'center', text: 'Challengers emerged: August Dvorak created a scientifically "superior" keyboard in 1936 that placed the most common letters on the home row, claiming it could increase typing speed by 74%.' },
        { type: 'paragraph', atmosphere: 'carriage-return', effect: 'ink-spread', position: 'center', text: 'The U.S. Navy tested it during World War II and reported dramatic improvements, though the study was overseen by Dvorak himself and a 1956 government study found no real advantage.' },
        { type: 'paragraph', atmosphere: 'colorblock-split', effect: 'mega-zoom-out', section: 'cyan', position: 'center', className: 'wr-closing', text: 'Yet QWERTY survived every assault.' },
        { type: 'paragraph', atmosphere: 'qwerty-rows', effect: 'shrink-back', section: 'frame', position: 'center', text: 'The reason was economic, not ergonomic—businesses couldn\'t afford to retrain workers and replace equipment, creating a "lock-in" effect economists now study as a prime example of how inferior technologies can dominate markets through sheer momentum.' },

        { type: 'section-title', atmosphere: 'bondi-screen', effect: 'glitch', className: 'wr-long', text: "Today, QWERTY's persistence reveals profound truths about human behavior and technology adoption." },
        { type: 'paragraph', atmosphere: 'bondi-screen', effect: 'typewriter', position: 'center', text: "In our age of touchscreens and voice recognition, we still arrange virtual keyboards in Sholes' pattern—even though there are no physical keys to jam." },
        { type: 'paragraph', atmosphere: 'qwerty-rows', effect: 'fade-in', section: 'frame', position: 'center', text: 'Studies suggest that while QWERTY makes our fingers travel farther than necessary, the cost of change outweighs the benefits.' },
        { type: 'paragraph', atmosphere: 'carriage-return', effect: 'breathe', position: 'center', text: 'This layout has literally shaped our language: "typewriter" remains one of the longest words you can type using only the top row, while the bottom row can barely form any words at all.' },
        { type: 'paragraph', atmosphere: 'urania-bleed', effect: 'waves-drift', section: 'cyan', colors: { bg: CYAN }, position: 'top-left', className: 'wr-beside-urania', text: 'As we enter the era of gesture typing and predictive text, QWERTY endures as a reminder that the best technology doesn\'t always win—sometimes, being first and "good enough" conquers all.' },

        { type: 'end', atmosphere: 'colorblock-split', section: 'cyan', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Have you ever kept doing something one way just because that is how everyone does it? Why do you think habits can be so hard to change?',
        'By the time electric typewriters eliminated the jamming problem, QWERTY had already conquered the world.':
          'Why might people stick with something familiar, even when there might be a better choice?',
        "Today, QWERTY's persistence reveals profound truths about human behavior and technology adoption.":
          'If you could invent a brand-new way to write or type, what would it be like? What would make people want to switch to it?',
      },
    },
  ],
};

/*
 * The display case (artifacts/case) and a page for each object in it
 * (artifacts/case/<id>). Every word is the owner's: each name and record line
 * from the Mini Museum record. No poster sentence is about these objects, so
 * each page shows its name and record line. The typing station is the display
 * itself and is listed on the case page. Photographs and 3D models are to come.
 */
export const WRITING_REVOLUTION_CASE: CasePageData = {
  label: 'Display Case',
  title: 'Artifacts',
  // Photographs to come: the case will be photographed anew.
  photos: [],
  artifacts: [
    {
      id: 'smith-corona-galaxie',
      name: 'Portable Smith-Corona Galaxie typewriter',
      record: 'Portable Smith-Corona Galaxie typewriter with original carrying case',
    },
    {
      id: 'imac-g3',
      name: 'Apple iMac G3',
      record: 'Functional Apple iMac G3 running AppleWorks software',
    },
  ],
  display: ['Interactive dual-typing station comparing mechanical and digital writing workflows'],
};
