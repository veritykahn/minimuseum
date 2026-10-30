import type { CSSProperties } from 'react';
import type { Atmosphere, CasePageData, ExhibitionConfig, PanelFigure } from '@/components/exhibition/types';
import { floorReturnFor } from '@/lib/floors';

/*
 * Black History Month: every word on screen, and the look.
 *
 * The poster copy is set exactly as printed on the two posters, with only the
 * owner's approved decisions:
 *   1. poster 2's "the "So In Style" line and the AKA Centennial Barbie in
 *      2009" is set "the AKA Centennial Barbie (2008) and the "So In Style"
 *      line (2009)"; the rest of that sentence is unchanged;
 *   2. the Mattel photograph of the dolls on poster 2 is not used, cropped or
 *      otherwise, and nor are any photographs of the installation. The
 *      walkthrough draws on poster 1's illustrated figures (design-tool
 *      artwork, cut from the poster) and its type; the full posters are on
 *      the landing page;
 *   3. poster 1's QR code is a link to the *Cultural Expressions* exhibition
 *      at the National Museum of African American History & Culture;
 *   4. two typos are mended: "empoweringchildren" and "pavedthe".
 * "*…*" marks italics.
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

// The posters' palette: poster 1's acid lime, poster 2's bubblegum pink, and the vignettes' red, orange and green.
const LIME = '#C5DA3B';
const PINK = '#EE8DBF';
/* Copy on the lime: near-black, as poster 1 sets it (13:1). */
const INK = '#141414';
/* Poster 2's bubble title is a dark brown; on the pink it carries the copy too (8:1), where the poster's white would not read. */
const BROWN = '#2A1A14';
/* The black blob at the heart of poster 1's ring. */
const BLOB = '#111111';
const WHITE = '#FFFFFF';

/* Titles: a heavy extended grotesque, all capitals (Archivo at its widest). */
const DISPLAY = "'Archivo', 'Arial Black', 'Helvetica Neue', sans-serif";
/* Copy: a condensed grotesque, as poster 1 sets it (Barlow Condensed). */
const BODY = "'Barlow Condensed', 'Arial Narrow', 'Helvetica Neue', sans-serif";
/* Poster 2's 1970s bubble face (Shrikhand) is loaded below; black-history.css sets it as --bh-bubble. */

export const NMAAHC_CULTURAL_EXPRESSIONS_URL = 'https://nmaahc.si.edu/explore/exhibitions/cultural-expressions';

/** Poster 1's ring of illustrated vignettes around the black blob and its lettering, cut from the poster, the lime keyed out. */
const RING: PanelFigure = {
  src: '/exhibitions/black-history/ring.webp',
  alt: 'Poster 1’s ring of circular vignettes in red, orange, green and black: illustrated figures of a musician, a singer at a microphone, a worker in a cap and a scientist at a microscope, music notes and an atom, around a black shape lettered Black History Month',
  side: 'right',
};

/*
 * The posters' titles. Poster 1's is set in type (Archivo at its widest, as
 * the poster sets it), so it is sharp on any screen; its cut lettering stays
 * on disk. Poster 2's bubble lettering has no matching web face, so it is a
 * picture: cut from the poster's 1728px export (density) and keyed out of
 * the pink (public/exhibitions/black-history/titles/). A sharper export of
 * the same lettering can replace the file; update its size here.
 */
const TITLE_SIZES = {
  blackHistoryMonth: { width: 648, height: 116 },
  importanceOfBlackBarbie: { width: 1228, height: 191, density: 1728 / 1050 },
};

/** Poster 1's illustrated vignettes, each cut from the ring as a disc (public/exhibitions/black-history/vignettes/). */
const VIGNETTES = ['musician', 'worker', 'scientist', 'singer', 'notes', 'atom'];

/*
 * The walkthrough's atmospheres (black-history.css draws them), each from the
 * posters' own design:
 *   lime-sunburst   poster 1's ground: green rays bursting from the corner
 *   vignette-ring   the ring of circular vignettes, popping into place around the stage
 *   heritage-blob   the black blob at the ring's heart, the lime line winding through it
 *   month-lockup    the vertical "Black History Month" lockup and the black rays at its foot
 *   bubblegum-rays  poster 2's pink, its red sunburst and orange rays
 *   groovy-bubbles  1970s bubble type: soft rounded shapes rising like a lava lamp
 */
const ATMOSPHERES: Record<string, Atmosphere> = {
  'lime-sunburst': { bg: LIME, text: INK, title: INK, parts: 2 },
  'vignette-ring': { bg: LIME, text: INK, title: INK, images: VIGNETTES.map((v, i) => ({ src: `/exhibitions/black-history/vignettes/${v}.webp`, className: `bh-vignette bh-vignette-${i + 1}` })) },
  'heritage-blob': { bg: BLOB, text: WHITE, title: LIME, parts: 3 },
  'month-lockup': { bg: LIME, text: INK, title: INK, parts: 3 },
  'bubblegum-rays': { bg: PINK, text: BROWN, title: BROWN, parts: 4 },
  'groovy-bubbles': { bg: PINK, text: BROWN, title: BROWN, parts: 1, particles: 14 },
};

export const BLACK_HISTORY_PROJECTOR_THEME = {
  '--pj-bg': BLOB,
  '--pj-ink': '#F4F6E4',
  '--pj-muted': '#C9CDB4',
  '--pj-accent': LIME,
  '--pj-on-accent': INK,
  '--pj-display': DISPLAY,
  '--pj-body': BODY,
} as CSSProperties;

export const BLACK_HISTORY: ExhibitionConfig<'poster1' | 'poster2'> = {
  slug: 'black-history',
  name: 'Black History Month',
  subtitle: 'Black Barbie & Representation',
  fonts: {
    href: 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Barlow+Condensed:ital,wght@0,400;0,500;0,600;1,400&family=Shrikhand&display=swap',
    display: DISPLAY,
    body: BODY,
  },
  palette: {
    page: LIME,
    heading: INK,
    accent: INK,
    teach: { color: INK, border: 'rgba(20,20,20,0.55)' },
  },
  back: floorReturnFor('black-history'),
  atmospheres: ATMOSPHERES,
  // The rays burst open as a poster opens; after that each panel arrives its own way.
  fx: { theme: 'bh', veil: 'first', text: 'all' },
  projector: {
    theme: BLACK_HISTORY_PROJECTOR_THEME,
    links: [
      { label: 'The Black Barbie Timeline', href: '/exhibitions/black-history/timeline' },
      { label: 'Who Do You See?', href: '/exhibitions/black-history/representation' },
    ],
  },
  cases: [
    {
      href: '/exhibitions/black-history/artifacts/case',
      label: 'Display Case',
      title: 'Artifacts',
    },
  ],
  // Each room's card shows the room itself: a screenshot of it (public/exhibitions/<slug>/rooms/).
  interactives: [
    // The timeline sets poster 2's words, and three added stops (Dolls of the
    // World, Shani, Inspiring Women): owner-approved, fact-checked notes, each
    // with its source (timeline/timelineStops.ts).
    {
      href: '/exhibitions/black-history/timeline',
      image: { src: '/exhibitions/black-history/rooms/timeline.webp', alt: 'The Black Barbie Timeline room: 1967 and Francie in a ringed circle on the lime ground, a right guess, and the years still to find along a road below' },
      label: 'Interactive',
      title: 'The Black Barbie Timeline',
      subtitle: 'From Francie to “So In Style”',
    },
    // Three ways into representation, as tabs: design a doll, the Clarks'
    // doll tests (checked facts, each with its source) and a class survey
    // of who is in your books (representation/representationText.ts).
    {
      href: '/exhibitions/black-history/representation',
      image: { src: '/exhibitions/black-history/rooms/representation.webp', alt: 'The Who Do You See? room: a doll being designed on a pink card, with choices of hair, face and skin tone' },
      label: 'Interactive',
      title: 'Who Do You See?',
      subtitle: 'Design a doll, the Doll Test, and who’s in your books',
    },
  ],
  posters: [
    // ============================================
    // POSTER 1: Black History Month
    // ============================================
    {
      id: 'poster1',
      title: 'Black History Month',
      hero: {
        src: '/exhibitions/black-history/poster1.jpg',
        alt: 'Black History Month poster on an acid lime ground: a ring of circular illustrated vignettes in red, orange, green and black around a black shape lettered Black History Month, the title again in heavy white capitals above three paragraphs of text, green and black sunburst rays in the corners, and Black History Month set vertically at the right',
      },
      colors: { bg: LIME, text: INK, title: INK },
      sections: {
        title: { className: 'bh-title' },
      },
      items: [
        {
          type: 'title-image',
          section: 'title',
          atmosphere: 'lime-sunburst',
          effect: 'rise-expand',
          src: '/exhibitions/black-history/titles/black-history-month.png',
          ...TITLE_SIZES.blackHistoryMonth,
          framing: 'centered',
          live: { className: 'bh-live bh-live-month', lines: [{ text: 'BLACK HISTORY' }, { text: 'MONTH' }] },
          alt: 'Black History Month',
        },
        { type: 'paragraph', atmosphere: 'vignette-ring', effect: 'blur-to-sharp', position: 'center', audio: '/exhibitions/black-history/audio/poster1-01.mp3', text: 'Carter G. Woodson played a crucial role in bringing Black history to national attention by creating Negro History Week in 1926, which later became Black History Month.' },
        { type: 'paragraph', atmosphere: 'heritage-blob', effect: 'line-by-line', position: 'center', audio: '/exhibitions/black-history/audio/poster1-02.mp3', text: 'A Harvard-trained historian, Woodson believed that African American history should not be confined to academics but serve as a tool for racial uplift. His organization, the Association for the Study of Negro Life and History, worked to make Black history widely accessible.' },
        { type: 'paragraph', atmosphere: 'lime-sunburst', effect: 'kenburns-in', position: 'center', figure: RING, audio: '/exhibitions/black-history/audio/poster1-03.mp3', text: 'Inspired by the cultural awakening of the Harlem Renaissance, Woodson established this week to educate schoolchildren and highlight Black contributions to American society, choosing February to align with the birthdays of Abraham Lincoln and Frederick Douglass.' },

        { type: 'section-title', atmosphere: 'month-lockup', effect: 'split-reveal', className: 'bh-long', audio: '/exhibitions/black-history/audio/poster1-04.mp3', text: 'Despite significant progress in race relations, Black History Month remains a vital tool for transformation.' },
        { type: 'paragraph', atmosphere: 'month-lockup', effect: 'fade-in', position: 'top-left', audio: '/exhibitions/black-history/audio/poster1-05.mp3', text: 'It serves as a reminder of the struggles and achievements of African Americans, countering historical amnesia and ensuring that crucial aspects of history, like slavery and the fight for civil rights, are not forgotten.' },
        { type: 'paragraph', atmosphere: 'heritage-blob', effect: 'ink-spread', position: 'center', audio: '/exhibitions/black-history/audio/poster1-06.mp3', text: "Surveys reveal a concerning lack of awareness about slavery's impact, even among African Americans." },
        { type: 'paragraph', atmosphere: 'vignette-ring', effect: 'line-by-line', position: 'center', audio: '/exhibitions/black-history/audio/poster1-07.mp3', text: 'By fostering discussion and reflection, Black History Month can bridge these gaps, inspire a deeper connection to the past, and promote an understanding of the resilience and contributions of Black individuals throughout history.' },

        { type: 'section-title', atmosphere: 'heritage-blob', effect: 'rise-expand', className: 'bh-long', audio: '/exhibitions/black-history/audio/poster1-08.mp3', text: 'Beyond education, Black History Month reinforces the importance of preserving African American culture and heritage.' },
        { type: 'paragraph', atmosphere: 'lime-sunburst', effect: 'film-credits', position: 'bottom-right', audio: '/exhibitions/black-history/audio/poster1-09.mp3', text: 'From safeguarding historical sites to encouraging donations of artifacts to museums, cultural preservation ensures that Black history is recognized and valued.' },
        { type: 'paragraph', atmosphere: 'vignette-ring', effect: 'shrink-back', position: 'center', audio: '/exhibitions/black-history/audio/poster1-10.mp3', text: 'Additionally, the celebration provides inspiration by honoring figures like Martin Luther King Jr., Harriet Tubman, and Langston Hughes.' },
        { type: 'paragraph', atmosphere: 'month-lockup', effect: 'breathe', position: 'top-left', className: 'bh-closing', audio: '/exhibitions/black-history/audio/poster1-11.mp3', text: 'As society evolves, Black History Month continues to be relevant, reminding all Americans that understanding the past is essential for shaping a more just and inclusive future.' },

        { type: 'callout', atmosphere: 'heritage-blob', effect: 'drift', text: 'Visit the *Cultural Expressions* exhibition at the National Museum of African American History & Culture', url: NMAAHC_CULTURAL_EXPRESSIONS_URL },
        { type: 'end', atmosphere: 'lime-sunburst', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Carter G. Woodson wanted Black history to reach schoolchildren, not only scholars. Why do you think it matters who gets to learn history?',
        'Despite significant progress in race relations, Black History Month remains a vital tool for transformation.':
          'Why might it be important to remember the hard parts of history as well as the achievements? How can talking about them together help?',
        'Beyond education, Black History Month reinforces the importance of preserving African American culture and heritage.':
          'If you could help keep one story, place or object safe for people in the future, what would it be, and why?',
      },
    },

    // ============================================
    // POSTER 2: The Importance of Black Barbie
    // ============================================
    {
      id: 'poster2',
      title: 'The Importance of Black Barbie',
      hero: {
        src: '/exhibitions/black-history/poster2.jpg',
        alt: 'The Importance of Black Barbie poster on a bubblegum pink ground: a ring of circles over a photograph of Black Barbie dolls dressed in red, the title in a chunky dark brown 1970s script, two paragraphs of text in white, a red sunburst with Black History Month set vertically at the left, and orange rays at the top right',
      },
      colors: { bg: PINK, text: BROWN, title: BROWN },
      sections: {
        title: { className: 'bh-title bh-title-bubble' },
      },
      items: [
        {
          type: 'title-image',
          section: 'title',
          atmosphere: 'bubblegum-rays',
          effect: 'kenburns-in',
          src: '/exhibitions/black-history/titles/importance-of-black-barbie.webp',
          ...TITLE_SIZES.importanceOfBlackBarbie,
          framing: 'centered',
          alt: 'The Importance of Black Barbie',
        },
        { type: 'paragraph', atmosphere: 'groovy-bubbles', effect: 'blur-to-sharp', position: 'center', text: 'The first Black Barbie doll, introduced by Mattel in 1980, marked a significant milestone in toy manufacturing and cultural representation.' },
        { type: 'paragraph', atmosphere: 'bubblegum-rays', effect: 'line-by-line', position: 'top-left', text: "While Mattel had previously created two Black dolls—Christie in 1968 and Francie in 1967—these earlier efforts were problematic. Christie was presented as part of Barbie's friend group, while Francie was essentially a white doll design with darker skin." },
        { type: 'paragraph', atmosphere: 'groovy-bubbles', effect: 'rise-expand', position: 'center', text: 'The first Black Barbie, however, was a groundbreaking creation designed by Kitty Black Perkins, a trailblazing Black fashion designer at Mattel.' },
        { type: 'paragraph', atmosphere: 'groovy-bubbles', effect: 'ink-spread', position: 'center', text: 'This doll broke away from past missteps, featuring Afrocentric facial features, natural hairstyles, and a glamorous design that celebrated Black beauty.' },
        { type: 'paragraph', atmosphere: 'bubblegum-rays', effect: 'fade-in', position: 'bottom-right', text: 'Its launch addressed decades of criticism about the lack of diversity in toys and the harmful effects of Eurocentric beauty standards perpetuated by the original Barbie.' },

        { type: 'section-title', atmosphere: 'heritage-blob', effect: 'split-reveal', className: 'bh-long bh-bubble', colors: { title: PINK }, text: 'The introduction of the first Black Barbie was a monumental step toward inclusivity, offering Black children a doll that reflected their identity and celebrated their cultural heritage.' },
        { type: 'paragraph', atmosphere: 'groovy-bubbles', effect: 'breathe', position: 'center', className: 'bh-closing', text: 'It challenged conventional beauty standards empowering children to embrace their natural features.' },
        { type: 'paragraph', atmosphere: 'bubblegum-rays', effect: 'line-by-line', position: 'top-left', text: 'Beyond its immediate impact, Black Barbie became a symbol of progress, inspiring further diversification in the toy industry. Over the years, Mattel expanded its range to include dolls with diverse skin tones, facial features, hairstyles, and cultural identities.' },
        { type: 'paragraph', atmosphere: 'bubblegum-rays', effect: 'film-credits', position: 'center', text: 'The success of Black Barbie paved the way for initiatives like the AKA Centennial Barbie (2008) and the "So In Style" line (2009), which highlighted authentic Black features and realistic hair textures.' },
        { type: 'paragraph', atmosphere: 'groovy-bubbles', effect: 'shrink-back', position: 'center', text: 'Each new iteration built on the legacy of Christie, Francie, and the first Black Barbie, pushing for greater authenticity and representation.' },
        { type: 'paragraph', atmosphere: 'bubblegum-rays', effect: 'waves-drift', position: 'bottom-right', className: 'bh-closing', text: "Today, Black Barbie is both a cherished collector's item and a symbol of the ongoing journey toward equality and representation in media and consumer products." },

        { type: 'end', atmosphere: 'groovy-bubbles', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Why do you think it matters for children to see toys that look like them?',
        'The introduction of the first Black Barbie was a monumental step toward inclusivity, offering Black children a doll that reflected their identity and celebrated their cultural heritage.':
          'What can toys, books and pictures tell children about who belongs? What would you want them to show?',
      },
    },
  ],
};

/*
 * The display case (artifacts/case) and a page for each object in it
 * (artifacts/case/<id>). Every word is the owner's: each name and record line
 * from the Mini Museum record, cut from it where one line lists several
 * objects. No poster sentence is about these objects, so each page shows its
 * name and record line. The timeline is the display itself and is listed on
 * the case page. Photographs and 3D models are to come.
 */
export const BLACK_HISTORY_CASE: CasePageData = {
  label: 'Display Case',
  title: 'Artifacts',
  // Photographs to come: the case will be photographed anew.
  photos: [],
  artifacts: [
    {
      id: 'nigerian-ghanaian-editions',
      name: 'Boxed Nigerian and Ghanaian editions',
      record: 'Original boxed Nigerian and Ghanaian editions',
    },
    {
      id: 'bessie-coleman',
      name: 'Bessie Coleman',
      record: 'Inspiring Women series: Bessie Coleman, Ida B. Wells, and Madam C. J. Walker',
    },
    {
      id: 'ida-b-wells',
      name: 'Ida B. Wells',
      record: 'Inspiring Women series: Bessie Coleman, Ida B. Wells, and Madam C. J. Walker',
    },
    {
      id: 'madam-c-j-walker',
      name: 'Madam C. J. Walker',
      record: 'Inspiring Women series: Bessie Coleman, Ida B. Wells, and Madam C. J. Walker',
    },
  ],
  display: ['Illustrated visual timeline detailing the history of Black representation in toy design'],
};

