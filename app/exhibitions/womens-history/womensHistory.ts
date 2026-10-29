import type { CSSProperties } from 'react';
import type { Atmosphere, CasePageData, ExhibitionConfig, PanelDecor, PanelFigure } from '@/components/exhibition/types';
import { floorReturnFor } from '@/lib/floors';

/*
 * Women's History Month: every word on screen, and the look.
 *
 * The poster copy is set exactly as printed on the two posters, with only the
 * owner's approved decisions:
 *   1. the whole biography of Violet Dina Want is published as printed,
 *      family names and all: it is the owner's own family history, and her
 *      decision;
 *   2. all four family photographs on poster 2 are used as they are;
 *   3. "a bomb designed by the Nazi's" is set "a bomb designed by the Nazis";
 *   4. the dates line is set in US style: "Born January 27, 1907 | Died
 *      March 2, 1988";
 *   5. the QR codes are links: poster 1 to the Imperial War Museum's Women's
 *      Work Collection, poster 2 to the London Museum's Objects & Stories.
 * Typesetting only: poster 1's last sentence takes the final period the
 * poster leaves off, and the poster's caption of the af Klint is set as a
 * credit, with the title, date and holder as Wikimedia Commons gives them.
 * "*…*" marks italics.
 *
 * Each sentence lives in one place below, so a fix to the posters is a
 * one-line edit here. Where a poster paragraph runs across several panels it
 * is split only between sentences, at the biography's natural beats
 * (childhood, work, marriage, family, music, the war, after the war, later
 * life, legacy); nothing is reworded.
 *
 * Each poster opens on its own title lettering, cut from the poster; its
 * subtitle follows on a card of its own, set in type, in the poster's lines.
 *
 * Pictures:
 *   - Hilma af Klint's The Ten Largest, No. 1, Childhood (1907) is the public
 *     domain scan on Wikimedia Commons, at the full resolution Commons serves,
 *     its white scan margin trimmed.
 *   - The four family photographs, the paint splashes, the title lettering
 *     and the "Violet Dina Want" lettering are cropped from the posters
 *     themselves.
 *
 * The "Talk about it" questions are for the projector's teacher strip: open
 * discussion questions, one per chapter, keyed by the section title exactly
 * as it is set (OPENING, '', is the panels before the first section title;
 * neither poster has section titles, so each has one). They make no factual
 * claims.
 */

// The posters' palette: blush and dusty rose grounds, deep navy type, orange and royal-blue paint.
const BLUSH = '#E8D6CC';
const ROSE = '#D9A8A6';
/* The titles' navy: 9.6:1 on the blush, 6.4:1 on the rose. */
const NAVY = '#22335E';
/* Poster 2's typewritten copy: a warm near-black, 9:1 on the rose. */
const INK = '#2A2226';
const WHITE = '#FFFFFF';

/* Titles: a heavy, high-contrast serif (Playfair Display, 900). */
const DISPLAY = "'Playfair Display', 'Didot', 'Bodoni 72', Georgia, serif";
/* Poster 1's copy: the same serif at text weight, as the poster sets it. */
const SERIF = "'Playfair Display', Georgia, serif";
/* Captions, credits and labels: a clean geometric sans (Poppins), as the poster sets its caption. */
const SANS = "'Poppins', 'Helvetica Neue', Arial, sans-serif";
/* Poster 2's copy is typewritten (Courier Prime), loaded below; womensHistory.css sets it as --wh-mono. */

export const IWM_WOMENS_WORK_URL = 'https://www.iwm.org.uk/history/iwm/collections/womens-work';
export const LONDON_MUSEUM_URL = 'https://www.londonmuseum.org.uk/collections/';

export const AF_KLINT_CREDIT = 'Hilma af Klint, *The Ten Largest, No. 1, Childhood*, Group IV, 1907. Stiftelsen Hilma af Klints Verk (the Hilma af Klint Foundation). Public domain, via Wikimedia Commons';
export const AF_KLINT_SOURCE = 'https://commons.wikimedia.org/wiki/File:Hilma_af_Klint_-_The_Ten_Largest_No._1_-_Childhood_-_1907.jpg';

const SPLASH_TL = '/exhibitions/womens-history/splash-tl.png';
const SPLASH_TR = '/exhibitions/womens-history/splash-tr.png';
const splash = (src: string, placement: PanelDecor['placement'], width = 'min(34vw, 440px)'): PanelDecor => ({ src, placement, motion: 'none', width });

/* The family photographs, from poster 2, the owner's own. */
export const PHOTO_VIOLET: PanelFigure = {
  src: '/exhibitions/womens-history/photo-violet.jpg',
  alt: 'A sepia studio portrait of Violet as a young woman, standing beside a small pedestal table in a long belted coat with a strap across her chest, a brimmed hat and white gloves',
  side: 'right',
};
export const PHOTO_PROMENADE: PanelFigure = {
  src: '/exhibitions/womens-history/photo-promenade.jpg',
  alt: 'A sepia snapshot of three people walking arm in arm along a promenade: a woman holding a patterned parasol, a man in a straw hat and jacket, and a young woman in a pale blouse and dark trousers',
  side: 'left',
};
export const PHOTO_FAMILY: PanelFigure = {
  src: '/exhibitions/womens-history/photo-family.jpg',
  alt: 'A faded photograph of a family group outside a house: five women, three standing and two seated, with a baby in a white dress sitting between them',
  side: 'right',
};
export const PHOTO_FOUR_WOMEN = {
  src: '/exhibitions/womens-history/photo-four-women.jpg',
  alt: 'A black-and-white photograph of four women standing close together in front of a net-curtained window, two of them in white dresses',
};

/*
 * Poster 2's biography, paragraph by paragraph, as printed: the walkthrough
 * below and Violet's room (violet/) both set it from here.
 */
export const VIOLET_NAME = 'Violet Dina Want';
export const VIOLET_NEE = 'née Knight';
export const VIOLET_DATES = 'Born January 27, 1907 | Died March 2, 1988';
export const VIOLET_LETTERING = { src: '/exhibitions/womens-history/violet-dina-want.png', width: 1530, height: 225 };
export const BIOGRAPHY_MOTTO = 'BIOGRAPHY OF A WORKING CLASS WOMAN';
export const BIO_LEAD = 'VIOLET DINA WANT NÉE KNIGHT';
export const BIO = {
  childhood: 'was born at the turn of the 20th century in Fulham, Hammersmith, London, into a large working-class family with three sisters and two brothers. As the second eldest daughter, she was expected to help both at home and financially from a young age. She took on a great deal of responsibility, caring for her younger sisters after school and as she aged, after work.',
  father: 'Her father worked as a commissionaire (now known as a doorman) at a hotel, occasionally bringing home leftover food from the restaurant to help feed the family. Despite their modest circumstances, Violet excelled in school, earning certificates for attendance and religious studies every year. Her teachers saw great potential in her and encouraged her to pursue a teaching career—a well-respected and middle-class profession at the time.',
  factory: "However, when one of her sisters was believed to be going blind and needed to attend a specialized school, Violet had to leave school at 14 to work and help support the family. She became a piecework machinist in a factory, where machinists get paid for each 'piece of work' they complete.",
  garden: 'During this time, she also learned gardening from her father, an essential source of food for many families. It was common if you had a garden, even in large cities like London, to grow vegetables and keep rabbits for "the pot". One of these rabbits became Violet\'s pet, often perching on her shoulder as she worked in the garden—until the day she came home to find it had been cooked for dinner.',
  faith: 'Violet was religious throughout her life and joined the Salvation Army, or "Sally Army," as an adult. In 1928, at the age of 21, she married Harold Henry Robert Want, saying she had chosen him because he made her laugh.',
  harold: 'Harold Want had previously been married but his wife died young and left him with an infant son. While Violet would have been happy to care for and raise this son, he was instead sent to live with an older, childless aunt—a common practice at the time.',
  family: 'Violet and Harold began their own family in 1929 with the birth of their eldest daughter, Edna, followed by Doris, in 1930. After a long gap, they had two sons in 1938 and 1942. Money was often tight—Harold worked as a barman and struggled with alcoholism—but Violet ensured her children were always warm and well-dressed.',
  seamstress: 'A skilled seamstress from her years as a machinist, she could take apart adult coats, resize them, and reassemble them perfectly for her children. Her resourcefulness meant they were often better off than others in their community. For example, it was common for poor families to place their youngest child in a makeshift cot by pushing two wooden armchairs together and rolling the baby in a blanket fastened with safety pins.',
  music: 'Music played a significant role in their home. Violet always owned a piano, which she could play by ear, and it became the centerpiece of lively "knees-up" parties with family and friends.',
  blitz: "Before World War II, Violet's extended family lived in close-knit neighboring streets, but the heavy bombing during the Blitz destroyed their homes, scattering them across the South of England. When a V-1 'doodlebug' bomb, a bomb designed by the Nazis to terrorize the British civilian population and lower morale, exploded nearby, it shattered all the windows in Violet's home and collapsed her mother's house, killing her instantly along with a family dog.",
  blast: 'Her mother was identified only by the rings on her finger. The blast also maimed a family puppy, which had to be put down, and left Violet with spinal rheumatism, making breathing painful—though she eventually recovered.',
  essex: 'After the war, she was offered a home on a new council estate in Essex. It was a corner house with a large garden, where she cultivated beautiful flowers like begonias, chrysanthemums, and ice plants, along with vegetables such as string beans and peas. However, her favorite flowers were roses, which she planted at the bottom of the garden.',
  greengrocer: 'By the time her grandchildren knew her, Violet worked at the local greengrocer, passing on her knowledge about selecting the best produce—such as choosing cauliflowers with their inner leaves still curled over to keep the curds white. She also had a particular fondness for young turnips, eating them like apples.',
  later: 'Widowed in 1956, Violet remained strong and resilient. She continued to garden, even when rheumatoid arthritis made it difficult, and enjoyed sitting outside with her beloved dog, Shona. Music remained a constant in her life; she always kept a piano in her home and, in her seventies, developed a love for Strauss waltzes, which she listened to on the radio. She also had a surprising penchant for wrestling, tuning in every Saturday, and knew Tiny Carr personally, a famous referee of the time.',
  legacy: "Violet Want's life is a testament to resilience, humor, and hard work. As a family matriarch, her story offers a rich snapshot of working-class life in England, spanning the Edwardian era, two world wars, and the societal shifts of the 1970s and 80s. The personal histories of women like her help us understand the past—not just in grand historical events, but through the everyday sacrifices and triumphs of ordinary people who shaped the world we live in today.",
} as const;

/*
 * The posters' titles as pictures: their own navy lettering, the stacked and
 * underlined WO / MEN / 'S and WO / MAN / 'S, cut from the posters at the
 * posters' resolution with the ground keyed out
 * (public/exhibitions/womens-history/titles/). A sharper export of the same
 * lettering can replace a file at the same path; update its size here.
 */
const TITLE_SIZES = {
  womensHistory: { width: 657, height: 282 },
  workingWomans: { width: 572, height: 282 },
};

/*
 * The walkthrough's atmospheres (womensHistory.css draws them), each the
 * setting of a part of the story:
 *   paint-splash    poster 1's own paint: its splashes thrown into the lower corners, drops flicked in from the edges
 *   blitz-letters   the family letters in the case: a ruled page, written on, its edges scorched
 *   running-stitch  the machinist and the seamstress: a tape measure, and a seam sewn across
 *   rose-garden     the gardens, her father's and her own: rose petals falling
 *   parlour-piano   music at home: lamplight, the piano's keys, notes in the air
 *   blackout        the Blitz: a taped window in the blackout, a far glow, dust settling
 */
const ATMOSPHERES: Record<string, Atmosphere> = {
  'paint-splash': {
    bg: BLUSH,
    text: NAVY,
    title: NAVY,
    parts: 1,
    particles: 26,
    images: [
      { src: SPLASH_TR, className: 'wh-splash wh-splash-bl' },
      { src: SPLASH_TL, className: 'wh-splash wh-splash-br' },
    ],
  },
  'blitz-letters': { bg: '#efe5d3', text: INK, title: NAVY, parts: 3 },
  'running-stitch': { bg: '#e4c2ba', text: INK, title: NAVY, parts: 4, particles: 9 },
  'rose-garden': { bg: '#e9ddd0', text: INK, title: NAVY, parts: 2, particles: 18 },
  'parlour-piano': { bg: '#2a1e22', text: '#f2e6da', title: '#f2c7b8', parts: 4, particles: 10 },
  blackout: { bg: '#15171e', text: '#ebe3da', title: '#f0d2b4', parts: 4, particles: 30 },
};

export const WOMENS_HISTORY_PROJECTOR_THEME = {
  '--pj-bg': BLUSH,
  '--pj-ink': NAVY,
  '--pj-muted': '#5B4A55',
  '--pj-accent': NAVY,
  '--pj-on-accent': WHITE,
  '--pj-display': DISPLAY,
  '--pj-body': SERIF,
} as CSSProperties;

export const WOMENS_HISTORY: ExhibitionConfig<'poster1' | 'poster2'> = {
  slug: 'womens-history',
  name: "Women's History Month",
  subtitle: 'Letters From the Blitz',
  fonts: {
    href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Poppins:wght@400;500&display=swap',
    display: DISPLAY,
    body: SERIF,
    ui: SANS,
  },
  palette: {
    page: BLUSH,
    heading: NAVY,
    accent: NAVY,
    teach: { color: NAVY, border: 'rgba(34,51,94,0.55)' },
  },
  back: floorReturnFor('womens-history'),
  atmospheres: ATMOSPHERES,
  // The paint (poster 1) or the typewriter's sheet (poster 2) crosses as a poster opens; every panel then arrives its own way.
  fx: { theme: 'wh', veil: 'chapters', text: 'all' },
  projector: {
    theme: WOMENS_HISTORY_PROJECTOR_THEME,
    links: [
      { label: 'Violet’s Life: her places and moments, and a timeline of your own', href: '/exhibitions/womens-history/violet' },
      { label: 'Who Gets Remembered?: statues, a scale, and questions for the class', href: '/exhibitions/womens-history/remembered' },
    ],
  },
  cases: [
    {
      href: '/exhibitions/womens-history/artifacts/case',
      label: 'Display Case',
      title: 'Artifacts',
    },
  ],
  interactives: [
    {
      href: '/exhibitions/womens-history/violet',
      image: { src: PHOTO_VIOLET.src, alt: PHOTO_VIOLET.alt },
      label: 'Interactive',
      title: 'Violet’s Life',
      subtitle: 'Her places and moments, and a timeline of your own',
    },
    // The owner's illustration (Leonardo.Ai), no photographs: rows of statues on their plinths, three of them orange.
    {
      href: '/exhibitions/womens-history/remembered',
      image: {
        src: '/exhibitions/womens-history/landing-who-gets-remembered.webp',
        alt: 'An illustration of three rows of navy statues of men on plinths in a park, with three orange statues of women among them',
        credit: 'Illustration made with Leonardo.Ai',
      },
      label: 'Interactive',
      title: 'Who Gets Remembered?',
      subtitle: 'Who gets a statue, and whose stories are left out',
    },
  ],
  credits: [{ text: AF_KLINT_CREDIT, href: AF_KLINT_SOURCE }],
  posters: [
    // ============================================
    // POSTER 1: Women's History
    // ============================================
    {
      id: 'poster1',
      title: "Women's History",
      hero: {
        src: '/exhibitions/womens-history/poster1.jpg',
        alt: "Women's History poster: the title in heavy navy capitals, WO, MEN and 'S stacked and underlined beside HISTORY, on a blush ground splashed with orange and royal-blue paint; a painting by Hilma af Klint of pale flowers and pink rose discs on deep blue; a paragraph of text; a QR code; and a vertical line reading Women's History Month, March 1st to 31st, International Women's Day, March 8th",
      },
      colors: { bg: BLUSH, text: NAVY, title: NAVY },
      sections: {
        title: { className: 'wh-p1 wh-title' },
        motto: { className: 'wh-p1 wh-motto' },
        painting: { className: 'wh-p1 wh-painting' },
        lede: { className: 'wh-p1 wh-lede' },
        body: { className: 'wh-p1 wh-body' },
        link: { className: 'wh-p1 wh-link' },
        end: { className: 'wh-p1' },
      },
      items: [
        {
          type: 'title-image',
          section: 'title',
          atmosphere: 'paint-splash',
          effect: 'split-reveal',
          src: '/exhibitions/womens-history/titles/womens-history.png',
          ...TITLE_SIZES.womensHistory,
          framing: 'centered',
          alt: "Women's History",
          marks: { left: "Women's History Month | March 1st to 31st", right: "International Women's Day | March 8th" },
          decor: splash(SPLASH_TL, 'top-left'),
        },
        {
          type: 'title-text',
          section: 'motto',
          atmosphere: 'paint-splash',
          effect: 'blur-to-sharp',
          text: 'MOVING FORWARD TOGETHER! WOMEN EDUCATING & INSPIRING GENERATIONS',
          lines: ['MOVING FORWARD TOGETHER!', 'WOMEN EDUCATING &', 'INSPIRING GENERATIONS'],
        },
        {
          type: 'full-image',
          section: 'painting',
          atmosphere: 'paint-splash',
          effect: 'kenburns-in',
          src: '/exhibitions/womens-history/af-klint-childhood.jpg',
          alt: 'A painting by Hilma af Klint: on a deep blue ground, a ring of pale, petal-like flowers with orange and yellow centers and white ovals holding pink rose discs, above looping orange lines like handwriting around a pale violet circle ringed with yellow, and a row of yellow, blue and white circles along the foot',
          text: AF_KLINT_CREDIT,
          href: AF_KLINT_SOURCE,
        },
        {
          type: 'paragraph',
          section: 'lede',
          atmosphere: 'paint-splash',
          effect: 'rise-expand',
          lead: "Women's History Month, celebrated every March,",
          text: 'honors the achievements and contributions of women throughout history.',
          decor: splash(SPLASH_TR, 'top-right'),
        },
        { type: 'paragraph', section: 'body', atmosphere: 'paint-splash', effect: 'line-by-line', text: "It began in 1978 as a local week-long celebration in Santa Rosa, California, inspiring similar observances across the U.S. In 1980, President Jimmy Carter declared the first official National Women's History Week, and by 1987, Congress expanded it to the entire month of March." },
        {
          type: 'paragraph',
          section: 'body',
          atmosphere: 'blitz-letters',
          effect: 'ink-spread',
          text: 'Historically, women\'s roles have often been overshadowed by those of men, who were traditionally credited with "shaping history." However, women\'s lived experiences provide a deeper, more nuanced understanding of the past—not just through the contributions of overlooked inventors, activists, artists, and writers, but also through the everyday lives of ordinary women.',
        },
        { type: 'paragraph', section: 'body', atmosphere: 'running-stitch', effect: 'pan-lr', text: 'Their roles in households and communities offer invaluable insight into the way societies function, making it essential to recognize and celebrate their impact in shaping human history.' },

        { type: 'callout', section: 'link', atmosphere: 'paint-splash', effect: 'film-credits', text: "Explore the Women's Work Collection at the Imperial War Museum", url: IWM_WOMENS_WORK_URL },
        { type: 'end', section: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Women’s lived experiences, and not only famous names, help us understand the past. Whose everyday story, in your family or your community, do you think deserves to be remembered, and why?',
      },
    },

    // ============================================
    // POSTER 2: Working Woman's (Biography of a Working Class Woman)
    // ============================================
    {
      id: 'poster2',
      title: "Working Woman's",
      hero: {
        src: '/exhibitions/womens-history/poster2.jpg',
        alt: "Working Woman's poster: WORK and WO, MAN and 'S in heavy navy capitals on dusty rose, the name Violet Dina Want in decorative lettering above née Knight and her dates, a biography in typewriter text, four family photographs mounted as strips of film negative, and a QR code",
      },
      colors: { bg: ROSE, text: INK, title: NAVY },
      sections: {
        title: { className: 'wh-p2 wh-title wh-title-work' },
        motto: { className: 'wh-p2 wh-motto' },
        name: { className: 'wh-p2 wh-name' },
        bio: { className: 'wh-p2 wh-bio' },
        contact: { className: 'wh-p2 wh-contact' },
        link: { className: 'wh-p2 wh-link' },
        end: { className: 'wh-p2' },
      },
      items: [
        {
          type: 'title-image',
          section: 'title',
          atmosphere: 'running-stitch',
          effect: 'blur-to-sharp',
          src: '/exhibitions/womens-history/titles/working-womans.png',
          ...TITLE_SIZES.workingWomans,
          framing: 'centered',
          alt: "Working Woman's",
        },
        {
          type: 'title-text',
          section: 'motto',
          atmosphere: 'blitz-letters',
          effect: 'fade-in',
          text: BIOGRAPHY_MOTTO,
          lines: ['BIOGRAPHY OF A', 'WORKING CLASS', 'WOMAN'],
        },
        // Her name is inked in with the pen, as the reveal does it (the theme's own entrance).
        {
          type: 'title-text',
          section: 'name',
          atmosphere: 'blitz-letters',
          text: VIOLET_NAME,
          lettering: VIOLET_LETTERING,
          subtitle: VIOLET_NEE,
          note: VIOLET_DATES,
        },

        // Childhood
        {
          type: 'paragraph',
          section: 'bio',
          atmosphere: 'blitz-letters',
          effect: 'kenburns-in',
          figure: PHOTO_VIOLET,
          lead: BIO_LEAD,
          text: BIO.childhood,
        },
        { type: 'paragraph', section: 'bio', atmosphere: 'blitz-letters', effect: 'typewriter', text: BIO.father },

        // Work
        { type: 'paragraph', section: 'bio', atmosphere: 'running-stitch', effect: 'line-by-line', text: BIO.factory },
        { type: 'paragraph', section: 'bio', atmosphere: 'rose-garden', effect: 'rise-expand', text: BIO.garden },

        // Marriage
        {
          type: 'paragraph',
          section: 'bio',
          atmosphere: 'blitz-letters',
          effect: 'pan-lr',
          figure: PHOTO_PROMENADE,
          text: BIO.faith,
        },
        { type: 'paragraph', section: 'bio', atmosphere: 'blitz-letters', effect: 'fade-in', text: BIO.harold },

        // Family
        {
          type: 'paragraph',
          section: 'bio',
          atmosphere: 'running-stitch',
          effect: 'shrink-back',
          figure: PHOTO_FAMILY,
          text: BIO.family,
        },
        { type: 'paragraph', section: 'bio', atmosphere: 'running-stitch', effect: 'typewriter', text: BIO.seamstress },

        // Music
        { type: 'paragraph', section: 'bio', atmosphere: 'parlour-piano', effect: 'waves-drift', text: BIO.music },

        // The war
        { type: 'paragraph', section: 'bio', atmosphere: 'blackout', effect: 'line-by-line', text: BIO.blitz },
        { type: 'paragraph', section: 'bio', atmosphere: 'blackout', effect: 'fade-in', text: BIO.blast },

        // After the war
        { type: 'paragraph', section: 'bio', atmosphere: 'rose-garden', effect: 'blur-to-sharp', text: BIO.essex },

        // Later life
        { type: 'paragraph', section: 'bio', atmosphere: 'rose-garden', effect: 'typewriter', text: BIO.greengrocer },
        {
          type: 'full-image',
          section: 'contact',
          atmosphere: 'parlour-piano',
          effect: 'kenburns-in',
          src: PHOTO_FOUR_WOMEN.src,
          alt: PHOTO_FOUR_WOMEN.alt,
        },
        { type: 'paragraph', section: 'bio', atmosphere: 'parlour-piano', effect: 'drift', text: BIO.later },

        // Legacy
        { type: 'paragraph', section: 'bio', atmosphere: 'blitz-letters', effect: 'ink-spread', className: 'wh-legacy', text: BIO.legacy },

        { type: 'callout', section: 'link', atmosphere: 'blitz-letters', effect: 'film-credits', text: 'Explore objects and stories at the London Museum', url: LONDON_MUSEUM_URL },
        { type: 'end', section: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Violet’s story is one ordinary life, told through its everyday details. What can one person’s life tell us about the past that a history book might leave out?',
      },
    },
  ],
};

/*
 * The display case (artifacts/case) and a page for each object in it
 * (artifacts/case/<id>). Every word is the owner's: each name and record line
 * from the Mini Museum record (*words* set in italics), the writing from this
 * exhibition's posters. The record's lines about the display itself are listed
 * on the case page. Photographs and 3D models are to come.
 */
export const WOMENS_HISTORY_CASE: CasePageData = {
  label: 'Display Case',
  title: 'Artifacts',
  // Photographs to come: the case will be photographed anew.
  photos: [],
  artifacts: [
    {
      id: 'blitz-letters',
      name: 'Blitz bomb-damaged family letters',
      record: "Original Blitz bomb-damaged family letters from Violet Dina Want's estate",
      writing: [
        { poster: 'poster2', text: "Before World War II, Violet's extended family lived in close-knit neighboring streets, but the heavy bombing during the Blitz destroyed their homes, scattering them across the South of England." },
      ],
    },
  ],
  display: [
    'Archival glass display case presentation with clear document mounts',
    "Digital extension: an 11-slide interactive biographical presentation on Violet's life",
  ],
};
