import type { CSSProperties } from 'react';
import type { Atmosphere, CasePageData, ExhibitionConfig, PanelFigure } from '@/components/exhibition/types';
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
 * is split only between sentences; nothing is reworded. Each poster opens on
 * its own title lettering, cut from the poster.
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

/*
 * The posters' titles as pictures: their own thin Art Nouveau capitals, cut
 * from the posters at the posters' resolution and lifted off the washed
 * photographs behind them (public/exhibitions/victorian/titles/). A sharper
 * export of the same lettering can replace a file at the same path; update
 * its size here when it does.
 * The cut stays on disk; the title is set in type (`live`, in the poster's
 * own face, drawn in the exhibition's stylesheet) so it is sharp on any screen.
 */
const TITLE_SIZES = {
  revolutionary: { width: 500, height: 203 },
  christmas: { width: 835, height: 289 },
};

/*
 * The walkthrough's atmospheres (victorian.css draws them), each the setting
 * of a part of the story:
 *   glazed-roof       the museum: light through an iron-and-glass roof, dust in its beams
 *   wallpaper-damask  fashion and the decorative arts: damask hung strip by strip
 *   locomotive-steam  industry and invention: steam rolling past, rails and telegraph wires
 *   gaslamp           the city at night, and Dickens's London: fog round the gas lamps
 *   christmas-snow    the village at Christmas: snow falling, drifts and frost
 *   yule-hearth       the Christmas revived: firelight, sparks and an evergreen garland
 */
const ATMOSPHERES: Record<string, Atmosphere> = {
  'glazed-roof': { bg: '#DDC4C2', parts: 3, particles: 26 },
  'wallpaper-damask': { bg: '#E6D0CB', parts: 4 },
  'locomotive-steam': { bg: '#59625A', parts: 3, particles: 14 },
  gaslamp: { bg: '#1F2027', text: CREAM, title: CREAM, parts: 4 },
  'christmas-snow': { bg: '#E9ECE9', parts: 3, particles: 60 },
  'yule-hearth': { bg: '#3B211B', parts: 2, particles: 16 },
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
  atmospheres: ATMOSPHERES,
  // The page tears open as a poster opens; every panel arrives its own way.
  fx: { theme: 'vb', veil: 'chapters', text: 'all' },
  projector: {
    theme: VICTORIAN_PROJECTOR_THEME,
    links: [
      { label: 'Christmas Card Maker: design and print a Victorian Christmas card', href: '/exhibitions/victorian/christmas-card' },
      { label: 'Inventions Workshop: the railway, the telegraph and photography, hands on', href: '/exhibitions/victorian/inventions' },
      { label: 'Dickens’ Christmas Parlour: open the parts of a Victorian Christmas', href: '/exhibitions/victorian/christmas-parlour' },
    ],
  },
  cases: [
    {
      href: '/exhibitions/victorian/artifacts/case',
      label: 'Display Case',
      title: 'Artifacts',
    },
  ],
  // The three interactive rooms, each drawn (no photographs). The optical
  // toys that stood here have moved to Seeing is Deceiving.
  interactives: [
    {
      href: '/exhibitions/victorian/christmas-card',
      image: {
        src: '/exhibitions/victorian/room-christmas-card.svg',
        alt: 'A drawing of a Victorian Christmas card standing open on a table: a candlelit Christmas tree in a gilt arch on the front, holly inside',
      },
      label: 'Interactive',
      title: 'Christmas Card Maker',
      subtitle: 'Design and print a Victorian Christmas card',
    },
    {
      href: '/exhibitions/victorian/inventions',
      image: {
        src: '/exhibitions/victorian/room-inventions.svg',
        alt: 'A drawing of a workbench: a station clock, a diamond-shaped telegraph dial with five needles, and a wooden box camera',
      },
      label: 'Interactive',
      title: 'Inventions Workshop',
      subtitle: 'The railway, the telegraph and photography, hands on',
    },
    {
      href: '/exhibitions/victorian/christmas-parlour',
      image: {
        src: '/exhibitions/victorian/room-christmas-parlour.svg',
        alt: 'A drawing of a Victorian parlour at Christmas: a candlelit tree, a fire in the grate, and a book open on a round table',
      },
      label: 'Interactive',
      title: 'Dickens’ Christmas Parlour',
      subtitle: 'Open the parts of a Victorian Christmas',
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
        {
          type: 'title-image',
          section: 'title',
          atmosphere: 'glazed-roof',
          effect: 'split-reveal',
          src: '/exhibitions/victorian/titles/revolutionary-victorian-britain.png',
          ...TITLE_SIZES.revolutionary,
          framing: 'centered',
          live: { className: 'vb-live vb-live-revolutionary', lines: [{ text: 'REVOLUTIONARY', className: 'vb-live-small' }, { text: 'VICTORIAN' }, { text: 'BRITAIN' }] },
          alt: 'Revolutionary Victorian Britain',
        },
        { type: 'paragraph', section: 'lede', atmosphere: 'wallpaper-damask', effect: 'kenburns-in', figure: COURT_DRESS, text: 'Victorian Britain was a time of innovation, fashion, culture, and the birth of one of the most iconic museums in the world today!' },
        { type: 'paragraph', section: 'linen', atmosphere: 'locomotive-steam', effect: 'line-by-line', text: 'The Victorian era in Britain lasted from 1837 to 1901, during the reign of Queen Victoria. This period saw rapid industrial growth, transforming the nation into a global superpower with an expanding empire.' },
        { type: 'paragraph', section: 'linen', atmosphere: 'locomotive-steam', effect: 'typewriter', text: 'Iconic innovations like railways, the telegraph, and photography emerged, alongside cultural achievements in literature and art.' },
        { type: 'paragraph', section: 'linen', atmosphere: 'glazed-roof', effect: 'blur-to-sharp', text: 'The Victoria and Albert Museum (V&A) was founded in 1852 as a hallmark of this age, showcasing decorative arts and design to inspire creativity and educate the public.' },
        {
          type: 'full-image',
          section: 'picture',
          atmosphere: 'glazed-roof',
          effect: 'pan-lr',
          src: '/exhibitions/victorian/va-refreshment-room.jpg',
          alt: 'A sepia photograph of a grand Victorian dining room: tables laid with white cloths beneath tall arched stained-glass windows, patterned columns and a painted, vaulted ceiling',
          text: VA_REFRESHMENT_ROOM_CREDIT,
          href: VA_REFRESHMENT_ROOM_SOURCE,
        },
        { type: 'paragraph', section: 'linen', atmosphere: 'gaslamp', effect: 'fade-in', text: 'Social reform improved conditions for workers, while class divisions and urban challenges persisted. The legacy of Victorian Britain is still evident in its architecture, inventions, and global influence.' },

        { type: 'callout', section: 'link', atmosphere: 'wallpaper-damask', effect: 'film-credits', text: 'Learn more about the story of the V&A', url: VA_HISTORY_URL },
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
        title: { className: 'vb-title vb-scrap-right' },
        quote: { bg: CREAM, title: GREEN, text: GREEN, className: 'vb-quote' },
        village: { bg: CREAM, className: 'vb-village' },
        linen: { className: 'vb-linen' },
        end: { text: GREEN },
      },
      items: [
        {
          type: 'title-image',
          section: 'title',
          atmosphere: 'christmas-snow',
          effect: 'blur-to-sharp',
          src: '/exhibitions/victorian/titles/charles-dickens-christmas.png',
          ...TITLE_SIZES.christmas,
          framing: 'centered',
          live: { className: 'vb-live vb-live-christmas', lines: [{ text: 'CHARLES DICKENS,' }, { text: 'VICTORIAN BRITAIN' }, { text: 'AND THE INVENTION OF HOW WE CELEBRATE', className: 'vb-live-small' }, { text: 'CHRISTMAS', className: 'vb-live-big' }] },
          alt: 'Charles Dickens, Victorian Britain and the Invention of How We Celebrate Christmas',
        },
        {
          type: 'quote',
          section: 'quote',
          atmosphere: 'gaslamp',
          effect: 'ink-spread',
          text: '"Christmas was dead, to begin with. There is no doubt whatever about that."',
          cite: "After Charles Dickens, *A Christmas Carol* (1843): 'Marley was dead: to begin with.'",
        },
        {
          type: 'full-image',
          section: 'village',
          atmosphere: 'christmas-snow',
          effect: 'kenburns-in',
          src: '/exhibitions/victorian/village.jpg',
          alt: 'A painting of a snowy Victorian village street at dusk: snow-covered houses with lit windows, a church spire, two tall Christmas trees, and people walking in the snow',
        },
        { type: 'paragraph', section: 'linen', atmosphere: 'locomotive-steam', effect: 'line-by-line', text: 'In the 19th century, Christmas traditions were in decline, impacted by the lingering effects of Puritan opposition to its pagan roots and the Industrial Revolution, which left workers little time for celebration.' },
        { type: 'paragraph', section: 'linen', atmosphere: 'yule-hearth', effect: 'rise-expand', text: "The holiday's revival gained momentum under Queen Victoria and Prince Albert, who popularized German customs like the Christmas tree, while the first Christmas cards appeared in the 1840s." },
        { type: 'paragraph', section: 'linen', atmosphere: 'gaslamp', effect: 'film-credits', text: "However it was Charles Dickens' *A Christmas Carol* (1843) that truly gave us the Christmas we know today." },
        { type: 'paragraph', section: 'linen', atmosphere: 'yule-hearth', effect: 'split-reveal', text: 'Dickens may not have invented Christmas but he certainly reinvented it.' },
        { type: 'paragraph', section: 'linen', atmosphere: 'yule-hearth', effect: 'breathe', text: "*A Christmas Carol* emphasized kindness, charity, and community through Scrooge's transformation. Dickens' \"Carol Philosophy\" celebrated the holiday as a time to open hearts and embrace humanity, a message still resonating nearly 200 years later." },
        { type: 'paragraph', section: 'linen', atmosphere: 'christmas-snow', effect: 'fade-in', text: "Dickens' influence shaped modern Christmas celebrations more profoundly than almost anyone else." },

        { type: 'end', section: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Dickens’ story celebrated kindness, charity, and community. Which traditions, at any time of year, bring the people around you together, and what makes them matter to you?',
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
export const VICTORIAN_CASE: CasePageData = {
  label: 'Display Case',
  title: 'Artifacts',
  // Photographs to come: the case will be photographed anew.
  photos: [],
  artifacts: [
    {
      id: 'needle-case',
      name: 'Victorian needle case',
      record: 'Victorian needle case featuring a Queen Victoria lithograph',
      writing: [
        { poster: 'poster1', text: 'The Victorian era in Britain lasted from 1837 to 1901, during the reign of Queen Victoria.' },
      ],
    },
    {
      id: 'scott-birthday-book',
      name: '*The Scott Birthday Book*',
      record: 'Antique copy of *The Scott Birthday Book*',
    },
  ],
  display: ['Graphic panels exploring Victorian innovation, the V&A Museum, and Dickensian traditions'],
};
