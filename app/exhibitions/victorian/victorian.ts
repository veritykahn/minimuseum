import type { CSSProperties } from 'react';
import type { CasePageData, ExhibitionConfig, PanelFigure } from '@/components/exhibition/types';
import { floorReturnFor } from '@/lib/floors';

/*
 * Victorian Britain: every word on screen, and the look.
 *
 * The poster copy is set exactly as printed on the two posters, with only the
 * owner's approved fixes:
 *   1. Victoria and Albert "popularized" German customs like the Christmas
 *      tree (the poster says "introduced");
 *   2. the Dickens quote is credited "After Charles Dickens, *A Christmas
 *      Carol* (1843): 'Marley was dead: to begin with.'";
 *   3. "impacted by the lingering effects of Puritan opposition to its pagan
 *      roots and the Industrial Revolution";
 *   4. the V&A photographs are used only where they could be matched to the
 *      V&A's own records, credited as the V&A specifies and linked (below);
 *   5. poster 1's QR code is a link to the V&A's own history of the museum.
 * Typesetting only: *A Christmas Carol* is set in italics. "Dickens'" stays
 * as printed. "*…*" marks italics.
 *
 * Each sentence lives in one place below, so a fix to the posters is a
 * one-line edit here. Where a poster paragraph runs across several panels it
 * is split only between sentences; nothing is reworded.
 *
 * Pictures:
 *   - The embroidered ivory court dress on poster 1 is the V&A's T.329 to B,
 *     AA-1977, in the museum's own photograph (image 2006AV6103), credited
 *     "© Victoria and Albert Museum, London" as the record specifies.
 *   - The washed interior behind the exhibition, and the photograph set after
 *     the V&A's founding, is the V&A's own photograph of its Centre
 *     Refreshment Room (now the Gamble Room), E.655-2009, credited the same
 *     way.
 *   - Left out: the painted ceiling on poster 1. It is the Gamble Room, but
 *     the photograph on the poster could not be matched to a V&A record, so
 *     it cannot carry the museum's credit.
 *   - The snowy village painting on poster 2 is part of the poster's design,
 *     cropped from the poster.
 *
 * The "Talk about it" questions are for the projector's teacher strip: open
 * discussion questions, one per chapter, keyed by the section title exactly
 * as it is set (OPENING, '', is the panels before the first section title;
 * neither poster has section titles, so each has one). They make no factual
 * claims.
 */

// The posters' palette: dusty rose, sage-green linen, cream paper and deep green type.
const ROSE = '#D9B7B8';
const SAGE = '#4E6152';
const CREAM = '#F4EEE3';
/* The titles' deep green: 5.4:1 on the rose, 9:1 on the cream. */
const GREEN = '#2F4A32';
const WHITE = '#FFFFFF';

/* Titles: a light, wide Art Nouveau capital (Poiret One). */
const DISPLAY = "'Poiret One', 'Josefin Sans', 'Century Gothic', sans-serif";
/* Copy: a light geometric sans, white on the green linen (Jost). */
const SANS = "'Jost', 'Century Gothic', 'Helvetica Neue', sans-serif";
/* The lede and the quote: a book serif (Lora), loaded below; victorian.css sets it as --vb-serif. */

export const VA_HISTORY_URL = 'https://www.vam.ac.uk/articles/building-the-museum';

export const VA_COURT_DRESS_CREDIT = 'Court dress, Great Britain, 1860–1865. V&A T.329 to B, AA-1977. © Victoria and Albert Museum, London';
export const VA_COURT_DRESS_SOURCE = 'https://collections.vam.ac.uk/item/O74557/';
export const VA_REFRESHMENT_ROOM_CREDIT = '*The Centre Refreshment Room, opened 1868.* Photograph, late 1860s. V&A E.655-2009. © Victoria and Albert Museum, London';
export const VA_REFRESHMENT_ROOM_SOURCE = 'https://collections.vam.ac.uk/item/O1160016/';

const COURT_DRESS: PanelFigure = {
  src: '/exhibitions/victorian/va-court-dress.jpg',
  alt: 'A Victorian court dress of ivory silk on a mannequin holding a fan: a wide crinoline skirt and a long train spreading across the floor, edged with lace and embroidered with roses',
  side: 'right',
  credit: { text: VA_COURT_DRESS_CREDIT, href: VA_COURT_DRESS_SOURCE },
};

export const VICTORIAN_PROJECTOR_THEME = {
  '--pj-bg': CREAM,
  '--pj-ink': GREEN,
  '--pj-muted': '#5C6B5E',
  '--pj-accent': SAGE,
  '--pj-on-accent': WHITE,
  '--pj-display': DISPLAY,
  '--pj-body': SANS,
} as CSSProperties;

export const VICTORIAN: ExhibitionConfig<'poster1' | 'poster2'> = {
  slug: 'victorian',
  name: 'Victorian Britain',
  subtitle: 'Material & Domestic Life',
  fonts: {
    href: 'https://fonts.googleapis.com/css2?family=Poiret+One&family=Jost:wght@300;400;500&family=Lora:ital,wght@0,400;0,500;1,400&display=swap',
    display: DISPLAY,
    body: SANS,
  },
  palette: {
    page: ROSE,
    heading: GREEN,
    accent: GREEN,
    teach: { color: GREEN, border: 'rgba(47,74,50,0.55)' },
  },
  back: floorReturnFor('victorian'),
  fx: { theme: 'vb', veil: 'chapters', text: 'all' },
  projector: { theme: VICTORIAN_PROJECTOR_THEME, links: [] },
  cases: [
    {
      href: '/exhibitions/victorian/artifacts/case',
      image: {
        src: '/exhibitions/victorian/case-thumb.jpg',
        alt: 'The display case: a small leather-bound book open on its stand behind a needle case printed with a portrait of Queen Victoria, in a clear case, with a printed card beside it',
      },
      label: 'Display Case',
      title: 'Artifacts',
      subtitle: 'Photographs of the installation',
    },
  ],
  // The V&A's photograph of its Centre Refreshment Room is washed in behind the posters.
  credits: [{ text: VA_REFRESHMENT_ROOM_CREDIT, href: VA_REFRESHMENT_ROOM_SOURCE }],
  posters: [
    // ============================================
    // POSTER 1: Revolutionary Victorian Britain
    // ============================================
    {
      id: 'poster1',
      title: 'Revolutionary Victorian Britain',
      hero: {
        src: '/exhibitions/victorian/poster1.jpg',
        alt: 'Revolutionary Victorian Britain poster: the title in thin dark green capitals on dusty rose over a pale photograph of a domed museum hall, an ivory court dress on a mannequin, a painted ceiling, a paragraph of white text on a torn green panel, and a QR code above the words Learn more about the story of the V&A',
      },
      colors: { bg: ROSE, text: WHITE, title: GREEN },
      sections: {
        title: { className: 'vb-title vb-scrap-left' },
        lede: { text: GREEN, className: 'vb-lede' },
        linen: { className: 'vb-linen' },
        picture: { bg: CREAM, text: GREEN, className: 'vb-picture' },
        link: { className: 'vb-link' },
        end: { text: GREEN },
      },
      items: [
        { type: 'title-text', section: 'title', kicker: 'Revolutionary', text: 'Victorian Britain' },
        { type: 'paragraph', section: 'lede', figure: COURT_DRESS, text: 'Victorian Britain was a time of innovation, fashion, culture, and the birth of one of the most iconic museums in the world today!' },
        { type: 'paragraph', section: 'linen', text: 'The Victorian era in Britain lasted from 1837 to 1901, during the reign of Queen Victoria. This period saw rapid industrial growth, transforming the nation into a global superpower with an expanding empire.' },
        { type: 'paragraph', section: 'linen', text: 'Iconic innovations like railways, the telegraph, and photography emerged, alongside cultural achievements in literature and art. The Victoria and Albert Museum (V&A) was founded in 1852 as a hallmark of this age, showcasing decorative arts and design to inspire creativity and educate the public.' },
        {
          type: 'full-image',
          section: 'picture',
          src: '/exhibitions/victorian/va-refreshment-room.jpg',
          alt: 'A sepia photograph of a grand Victorian dining room: tables laid with white cloths beneath tall arched stained-glass windows, patterned columns and a painted, vaulted ceiling',
          text: VA_REFRESHMENT_ROOM_CREDIT,
          href: VA_REFRESHMENT_ROOM_SOURCE,
        },
        { type: 'paragraph', section: 'linen', text: 'Social reform improved conditions for workers, while class divisions and urban challenges persisted. The legacy of Victorian Britain is still evident in its architecture, inventions, and global influence.' },

        { type: 'callout', section: 'link', text: 'Learn more about the story of the V&A', url: VA_HISTORY_URL },
        { type: 'end', section: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'The V&A was founded to inspire creativity and educate the public. If you could start a museum to inspire people today, what would you put in it, and why?',
      },
    },

    // ============================================
    // POSTER 2: Charles Dickens, Victorian Britain and the Invention of How We Celebrate Christmas
    // ============================================
    {
      id: 'poster2',
      title: 'Charles Dickens, Victorian Britain and the Invention of How We Celebrate Christmas',
      hero: {
        src: '/exhibitions/victorian/poster2.jpg',
        alt: 'Charles Dickens, Victorian Britain and the Invention of How We Celebrate Christmas poster: the title in thin dark green capitals, with Christmas very large, over a pale photograph of an ornate museum café, a quotation, a painting of a snowy village street with Christmas trees, and two paragraphs of white text on a torn green panel',
      },
      colors: { bg: ROSE, text: WHITE, title: GREEN },
      sections: {
        title: { className: 'vb-title vb-title-carol vb-scrap-right' },
        quote: { bg: CREAM, title: GREEN, text: GREEN, className: 'vb-quote' },
        village: { bg: CREAM, className: 'vb-village' },
        linen: { className: 'vb-linen' },
        end: { text: GREEN },
      },
      items: [
        { type: 'title-text', section: 'title', kicker: 'Charles Dickens, Victorian Britain and the Invention of How We Celebrate', text: 'Christmas' },
        {
          type: 'quote',
          section: 'quote',
          text: '"Christmas was dead, to begin with. There is no doubt whatever about that."',
          cite: "After Charles Dickens, *A Christmas Carol* (1843): 'Marley was dead: to begin with.'",
        },
        {
          type: 'full-image',
          section: 'village',
          src: '/exhibitions/victorian/village.jpg',
          alt: 'A painting of a snowy Victorian village street at dusk: snow-covered houses with lit windows, a church spire, two tall Christmas trees, and people walking in the snow',
        },
        { type: 'paragraph', section: 'linen', text: 'In the 19th century, Christmas traditions were in decline, impacted by the lingering effects of Puritan opposition to its pagan roots and the Industrial Revolution, which left workers little time for celebration.' },
        { type: 'paragraph', section: 'linen', text: "The holiday's revival gained momentum under Queen Victoria and Prince Albert, who popularized German customs like the Christmas tree, while the first Christmas cards appeared in the 1840s." },
        { type: 'paragraph', section: 'linen', text: "However it was Charles Dickens' *A Christmas Carol* (1843) that truly gave us the Christmas we know today. Dickens may not have invented Christmas but he certainly reinvented it." },
        { type: 'paragraph', section: 'linen', text: "*A Christmas Carol* emphasized kindness, charity, and community through Scrooge's transformation. Dickens' \"Carol Philosophy\" celebrated the holiday as a time to open hearts and embrace humanity, a message still resonating nearly 200 years later." },
        { type: 'paragraph', section: 'linen', text: "Dickens' influence shaped modern Christmas celebrations more profoundly than almost anyone else." },

        { type: 'end', section: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Dickens’ story celebrated kindness, charity, and community. Which traditions, at any time of year, bring the people around you together, and what makes them matter to you?',
      },
    },
  ],
};

/*
 * The display case page (artifacts/case). The artifacts are listed exactly as
 * the Mini Museum record lists them; *The Scott Birthday Book* is a title, in
 * italics. The photographs are cropped to the installation.
 */
export const VICTORIAN_CASE: CasePageData = {
  label: 'Display Case',
  title: 'Artifacts',
  subtitle: 'Photographs of the installation',
  photos: [
    {
      src: '/exhibitions/victorian/installation.jpg',
      alt: 'The installation: the posters Revolutionary Victorian Britain and the Dickens Christmas poster on the wall either side of a green curtain beneath The Mini Museum sign, a small clear display case on a glass table below, green velvet armchairs, and a lit Christmas tree in the corner',
      width: 1032,
      height: 900,
    },
    {
      src: '/exhibitions/victorian/case.jpg',
      alt: 'Inside the display case: the Scott Birthday Book open on its stand, a needle case printed with a portrait of Queen Victoria in front of it, and beside the case a printed card describing both',
      width: 1200,
      height: 900,
    },
    {
      src: '/exhibitions/victorian/installation-christmas.jpg',
      alt: 'The installation at Christmas: the Dickens poster beside a green curtain under The Mini Museum sign, the display case on its glass table between green velvet seats, and a Christmas tree hung with white lights',
      width: 960,
      height: 900,
    },
  ],
  artifacts: [
    'Victorian needle case featuring a Queen Victoria lithograph',
    'Antique copy of *The Scott Birthday Book*',
    'Graphic panels exploring Victorian innovation, the V&A Museum, and Dickensian traditions',
  ],
};
