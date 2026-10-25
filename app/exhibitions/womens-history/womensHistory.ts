import type { CSSProperties } from 'react';
import type { CasePageData, ExhibitionConfig, PanelDecor, PanelFigure } from '@/components/exhibition/types';
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
 * Pictures:
 *   - Hilma af Klint's The Ten Largest, No. 1, Childhood (1907) is the public
 *     domain scan on Wikimedia Commons, at the full resolution Commons serves,
 *     its white scan margin trimmed.
 *   - The four family photographs, the paint splashes and the "Violet Dina
 *     Want" lettering are cropped from the posters themselves.
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
const PHOTO_VIOLET: PanelFigure = {
  src: '/exhibitions/womens-history/photo-violet.jpg',
  alt: 'A sepia studio portrait of Violet as a young woman, standing beside a small pedestal table in a long belted coat with a strap across her chest, a brimmed hat and white gloves',
  side: 'right',
};
const PHOTO_PROMENADE: PanelFigure = {
  src: '/exhibitions/womens-history/photo-promenade.jpg',
  alt: 'A sepia snapshot of three people walking arm in arm along a promenade: a woman holding a patterned parasol, a man in a straw hat and jacket, and a young woman in a pale blouse and dark trousers',
  side: 'left',
};
const PHOTO_FAMILY: PanelFigure = {
  src: '/exhibitions/womens-history/photo-family.jpg',
  alt: 'A faded photograph of a family group outside a house: five women, three standing and two seated, with a baby in a white dress sitting between them',
  side: 'right',
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
  fx: { theme: 'wh', veil: 'chapters', text: 'all' },
  projector: { theme: WOMENS_HISTORY_PROJECTOR_THEME, links: [] },
  cases: [
    {
      href: '/exhibitions/womens-history/artifacts/case',
      label: 'Display Case',
      title: 'Artifacts',
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
        painting: { className: 'wh-p1 wh-painting' },
        lede: { className: 'wh-p1 wh-lede' },
        body: { className: 'wh-p1 wh-body' },
        link: { className: 'wh-p1 wh-link' },
        end: { className: 'wh-p1' },
      },
      items: [
        {
          type: 'title-text',
          section: 'title',
          text: "Women's History",
          lines: ['WO', 'MEN', '’S', 'HISTORY'],
          subtitle: 'MOVING FORWARD TOGETHER! WOMEN EDUCATING & INSPIRING GENERATIONS',
          marks: { left: "Women's History Month | March 1st to 31st", right: "International Women's Day | March 8th" },
          decor: splash(SPLASH_TL, 'top-left'),
        },
        {
          type: 'full-image',
          section: 'painting',
          src: '/exhibitions/womens-history/af-klint-childhood.jpg',
          alt: 'A painting by Hilma af Klint: on a deep blue ground, a ring of pale, petal-like flowers with orange and yellow centers and white ovals holding pink rose discs, above looping orange lines like handwriting around a pale violet circle ringed with yellow, and a row of yellow, blue and white circles along the foot',
          text: AF_KLINT_CREDIT,
          href: AF_KLINT_SOURCE,
        },
        {
          type: 'paragraph',
          section: 'lede',
          lead: "Women's History Month, celebrated every March,",
          text: 'honors the achievements and contributions of women throughout history.',
          decor: splash(SPLASH_TR, 'top-right'),
        },
        { type: 'paragraph', section: 'body', text: "It began in 1978 as a local week-long celebration in Santa Rosa, California, inspiring similar observances across the U.S. In 1980, President Jimmy Carter declared the first official National Women's History Week, and by 1987, Congress expanded it to the entire month of March." },
        {
          type: 'paragraph',
          section: 'body',
          className: 'wh-splash-low',
          text: 'Historically, women\'s roles have often been overshadowed by those of men, who were traditionally credited with "shaping history." However, women\'s lived experiences provide a deeper, more nuanced understanding of the past—not just through the contributions of overlooked inventors, activists, artists, and writers, but also through the everyday lives of ordinary women.',
          decor: splash(SPLASH_TR, 'bottom-right', 'min(28vw, 360px)'),
        },
        { type: 'paragraph', section: 'body', text: 'Their roles in households and communities offer invaluable insight into the way societies function, making it essential to recognize and celebrate their impact in shaping human history.' },

        { type: 'callout', section: 'link', text: "Explore the Women's Work Collection at the Imperial War Museum", url: IWM_WOMENS_WORK_URL },
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
        name: { className: 'wh-p2 wh-name' },
        bio: { className: 'wh-p2 wh-bio' },
        contact: { className: 'wh-p2 wh-contact' },
        link: { className: 'wh-p2 wh-link' },
        end: { className: 'wh-p2' },
      },
      items: [
        {
          type: 'title-text',
          section: 'title',
          text: "Working Woman's",
          lines: ['WORK', 'WO', 'MAN', '’S'],
          subtitle: 'BIOGRAPHY OF A WORKING CLASS WOMAN',
        },
        {
          type: 'title-text',
          section: 'name',
          text: 'Violet Dina Want',
          lettering: { src: '/exhibitions/womens-history/violet-dina-want.png', width: 1530, height: 225 },
          subtitle: 'née Knight',
          note: 'Born January 27, 1907 | Died March 2, 1988',
        },

        // Childhood
        {
          type: 'paragraph',
          section: 'bio',
          figure: PHOTO_VIOLET,
          lead: 'VIOLET DINA WANT NÉE KNIGHT',
          text: 'was born at the turn of the 20th century in Fulham, Hammersmith, London, into a large working-class family with three sisters and two brothers. As the second eldest daughter, she was expected to help both at home and financially from a young age. She took on a great deal of responsibility, caring for her younger sisters after school and as she aged, after work.',
        },
        { type: 'paragraph', section: 'bio', text: 'Her father worked as a commissionaire (now known as a doorman) at a hotel, occasionally bringing home leftover food from the restaurant to help feed the family. Despite their modest circumstances, Violet excelled in school, earning certificates for attendance and religious studies every year. Her teachers saw great potential in her and encouraged her to pursue a teaching career—a well-respected and middle-class profession at the time.' },

        // Work
        { type: 'paragraph', section: 'bio', text: "However, when one of her sisters was believed to be going blind and needed to attend a specialized school, Violet had to leave school at 14 to work and help support the family. She became a piecework machinist in a factory, where machinists get paid for each 'piece of work' they complete." },
        { type: 'paragraph', section: 'bio', text: 'During this time, she also learned gardening from her father, an essential source of food for many families. It was common if you had a garden, even in large cities like London, to grow vegetables and keep rabbits for "the pot". One of these rabbits became Violet\'s pet, often perching on her shoulder as she worked in the garden—until the day she came home to find it had been cooked for dinner.' },

        // Marriage
        {
          type: 'paragraph',
          section: 'bio',
          figure: PHOTO_PROMENADE,
          text: 'Violet was religious throughout her life and joined the Salvation Army, or "Sally Army," as an adult. In 1928, at the age of 21, she married Harold Henry Robert Want, saying she had chosen him because he made her laugh.',
        },
        { type: 'paragraph', section: 'bio', text: 'Harold Want had previously been married but his wife died young and left him with an infant son. While Violet would have been happy to care for and raise this son, he was instead sent to live with an older, childless aunt—a common practice at the time.' },

        // Family
        {
          type: 'paragraph',
          section: 'bio',
          figure: PHOTO_FAMILY,
          text: 'Violet and Harold began their own family in 1929 with the birth of their eldest daughter, Edna, followed by Doris, in 1930. After a long gap, they had two sons in 1938 and 1942. Money was often tight—Harold worked as a barman and struggled with alcoholism—but Violet ensured her children were always warm and well-dressed.',
        },
        { type: 'paragraph', section: 'bio', text: 'A skilled seamstress from her years as a machinist, she could take apart adult coats, resize them, and reassemble them perfectly for her children. Her resourcefulness meant they were often better off than others in their community. For example, it was common for poor families to place their youngest child in a makeshift cot by pushing two wooden armchairs together and rolling the baby in a blanket fastened with safety pins.' },

        // Music
        { type: 'paragraph', section: 'bio', text: 'Music played a significant role in their home. Violet always owned a piano, which she could play by ear, and it became the centerpiece of lively "knees-up" parties with family and friends.' },

        // The war
        { type: 'paragraph', section: 'bio', text: "Before World War II, Violet's extended family lived in close-knit neighboring streets, but the heavy bombing during the Blitz destroyed their homes, scattering them across the South of England. When a V-1 'doodlebug' bomb, a bomb designed by the Nazis to terrorize the British civilian population and lower morale, exploded nearby, it shattered all the windows in Violet's home and collapsed her mother's house, killing her instantly along with a family dog." },
        { type: 'paragraph', section: 'bio', text: 'Her mother was identified only by the rings on her finger. The blast also maimed a family puppy, which had to be put down, and left Violet with spinal rheumatism, making breathing painful—though she eventually recovered.' },

        // After the war
        { type: 'paragraph', section: 'bio', text: 'After the war, she was offered a home on a new council estate in Essex. It was a corner house with a large garden, where she cultivated beautiful flowers like begonias, chrysanthemums, and ice plants, along with vegetables such as string beans and peas. However, her favorite flowers were roses, which she planted at the bottom of the garden.' },

        // Later life
        { type: 'paragraph', section: 'bio', text: 'By the time her grandchildren knew her, Violet worked at the local greengrocer, passing on her knowledge about selecting the best produce—such as choosing cauliflowers with their inner leaves still curled over to keep the curds white. She also had a particular fondness for young turnips, eating them like apples.' },
        {
          type: 'full-image',
          section: 'contact',
          src: '/exhibitions/womens-history/photo-four-women.jpg',
          alt: 'A black-and-white photograph of four women standing close together in front of a net-curtained window, two of them in white dresses',
        },
        { type: 'paragraph', section: 'bio', text: 'Widowed in 1956, Violet remained strong and resilient. She continued to garden, even when rheumatoid arthritis made it difficult, and enjoyed sitting outside with her beloved dog, Shona. Music remained a constant in her life; she always kept a piano in her home and, in her seventies, developed a love for Strauss waltzes, which she listened to on the radio. She also had a surprising penchant for wrestling, tuning in every Saturday, and knew Tiny Carr personally, a famous referee of the time.' },

        // Legacy
        { type: 'paragraph', section: 'bio', className: 'wh-legacy', text: "Violet Want's life is a testament to resilience, humor, and hard work. As a family matriarch, her story offers a rich snapshot of working-class life in England, spanning the Edwardian era, two world wars, and the societal shifts of the 1970s and 80s. The personal histories of women like her help us understand the past—not just in grand historical events, but through the everyday sacrifices and triumphs of ordinary people who shaped the world we live in today." },

        { type: 'callout', section: 'link', text: 'Explore objects and stories at the London Museum', url: LONDON_MUSEUM_URL },
        { type: 'end', section: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Violet’s story is one ordinary life, told through its everyday details. What can one person’s life tell us about the past that a history book might leave out?',
      },
    },
  ],
};

/*
 * The display case page (artifacts/case). The artifacts are listed exactly as
 * the Mini Museum record lists them.
 */
export const WOMENS_HISTORY_CASE: CasePageData = {
  label: 'Display Case',
  title: 'Artifacts',
  // Photographs to come: the case will be photographed anew.
  photos: [],
  artifacts: [
    "Original Blitz bomb-damaged family letters from Violet Dina Want's estate",
    'Archival glass display case presentation with clear document mounts',
    "Digital extension: an 11-slide interactive biographical presentation on Violet's life",
  ],
};
