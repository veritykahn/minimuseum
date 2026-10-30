import type { CSSProperties } from 'react';
import type { ApprovedFact, FactSource } from '@/components/exhibition/FactNote';
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

/*
 * Panels added to the posters (A18, owner-approved, every fact checked
 * against the page it cites): each carries its sources (`sources`) and is set
 * apart from the printed copy, which is unchanged. Where printed copy needs a
 * word of caution, a small "Did you know?" note (`note`) is set beneath it,
 * with its sources; the printed words stay as they are.
 */
const S = {
  crinoline: { label: 'V&A, Cage crinoline, 1871', href: 'https://collections.vam.ac.uk/item/O122389/cage-crinoline' },
  courtDress: { label: 'V&A, Court dress, T.329 to B, AA-1977', href: VA_COURT_DRESS_SOURCE },
  standardTime: { label: 'Science Museum, “Standardising time: Railways and the electric telegraph”', href: 'https://www.sciencemuseum.org.uk/objects-and-stories/standardising-time-railways-and-electric-telegraph' },
  photography: { label: 'Science and Media Museum, “The history of photography in pictures”', href: 'https://www.scienceandmediamuseum.org.uk/objects-and-stories/history-photography' },
  building: { label: 'V&A, “Building the V&A”', href: VA_HISTORY_URL },
  coal: { label: 'National Coal Mining Museum for England, “The 1842 Royal Commission” (PDF)', href: 'https://www.ncm.org.uk/app/uploads/2023/02/1842-Commission.pdf' },
  christmasTraditions: { label: 'V&A, “Victorian Christmas traditions”', href: 'https://www.vam.ac.uk/articles/victorian-christmas-traditions' },
  firstCard: { label: 'V&A, “The first Christmas card”', href: 'https://www.vam.ac.uk/articles/the-first-christmas-card/' },
  dickens: { label: 'V&A, “Charles Dickens”', href: 'https://www.vam.ac.uk/articles/charles-dickens' },
  stocktonDarlington: { label: 'Science Museum Group Archive, “Commonplace books of an unknown engineer” (the Stockton & Darlington Railway, 1825)', href: 'https://archives.sciencemuseumgroup.ac.uk/Details/archive/110073953' },
  twoTelegraphs: { label: 'Science Museum Group Journal, “A tale of two telegraphs”', href: 'https://journal.sciencemuseum.ac.uk/article/cooke-and-wheatstones' },
  namChristmas: { label: 'National Army Museum, “Christmas at war”', href: 'https://www.nam.ac.uk/explore/war-christmas' },
} satisfies Record<string, FactSource>;

/** The "Did you know?" notes set beneath printed copy. */
export const VICTORIAN_NOTES = {
  inventions: {
    text: 'All three began just before Victoria came to the throne in 1837: the first steam-operated public railway opened in 1825, the oldest surviving photographic negative was taken in 1835, and Cooke and Wheatstone filed their first telegraph patent early in 1837. Her reign is when they spread.',
    sources: [S.stocktonDarlington, S.photography, S.twoTelegraphs],
  },
  puritans: {
    text: 'The Puritans’ ban was long over by then: Parliament abolished the feast of Christmas in June 1647, and it was fully restored in 1660. The V&A says simply that at the start of the 19th century, “Christmas was hardly celebrated.”',
    sources: [S.namChristmas, S.christmasTraditions],
  },
} satisfies Record<string, ApprovedFact>;

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
  // Each room's card shows the room itself: a screenshot of it (public/exhibitions/<slug>/rooms/).
  // The optical toys that stood here have moved to Seeing is Deceiving.
  interactives: [
    {
      href: '/exhibitions/victorian/christmas-card',
      image: { src: '/exhibitions/victorian/rooms/christmas-card.webp', alt: 'The Christmas Card Maker room: a card with a candlelit tree, beside the choices for its front and greeting' },
      label: 'Interactive',
      title: 'Christmas Card Maker',
      subtitle: 'Design and print a Victorian Christmas card',
    },
    {
      href: '/exhibitions/victorian/inventions',
      image: { src: '/exhibitions/victorian/rooms/inventions.webp', alt: 'The Inventions Workshop room: a railway line between two station clocks, beside the steps to try' },
      label: 'Interactive',
      title: 'Inventions Workshop',
      subtitle: 'The railway, the telegraph and photography, hands on',
    },
    {
      href: '/exhibitions/victorian/christmas-parlour',
      image: { src: '/exhibitions/victorian/rooms/christmas-parlour.webp', alt: 'The Dickens’ Christmas Parlour room: a parlour with a tree and a fireplace, each part ready to open' },
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
        // Added (A18): the dress.
        { type: 'paragraph', section: 'linen', position: 'top-right', atmosphere: 'wallpaper-damask', effect: 'fade-in', lead: 'Fun tidbit:', text: 'The ivory silk court dress shown here was made in the 1860s. Its wide skirt sat over a crinoline, and its embroidered train is 11 feet long! Young women spent hours practising how to curtsey and walk backward in a dress like this before being presented at court.', sources: [S.courtDress] },
        { type: 'paragraph', section: 'linen', position: 'bottom-left', atmosphere: 'wallpaper-damask', effect: 'breathe', lead: 'Fun tidbit:', text: 'A crinoline was a light cage of spring-steel hoops worn under the skirt to hold it out. Some were nicknamed "skeleton" petticoats!', sources: [S.crinoline] },

        { type: 'paragraph', section: 'linen', atmosphere: 'locomotive-steam', effect: 'line-by-line', text: 'The Victorian era in Britain lasted from 1837 to 1901, during the reign of Queen Victoria. This period saw rapid industrial growth, transforming the nation into a global superpower with an expanding empire.' },
        { type: 'paragraph', section: 'linen', atmosphere: 'locomotive-steam', effect: 'typewriter', text: 'Iconic innovations like railways, the telegraph, and photography emerged, alongside cultural achievements in literature and art.', note: VICTORIAN_NOTES.inventions },

        // Added (A18): the inventions.
        { type: 'section-title', atmosphere: 'locomotive-steam', effect: 'film-credits', colors: { title: CREAM }, text: 'Trains, wires and photographs changed everyday life.', sources: [S.standardTime, S.photography] },
        { type: 'paragraph', section: 'linen', position: 'top-left', atmosphere: 'locomotive-steam', effect: 'drift', text: 'Before the railways, every town set its clocks by the Sun, so Bristol\'s time was 11 minutes behind London\'s! Time signals were then sent from the Royal Observatory at Greenwich along the telegraph, and by 1855 nearly every town had switched to "railway time."', sources: [S.standardTime] },
        { type: 'paragraph', section: 'linen', position: 'bottom-right', atmosphere: 'locomotive-steam', effect: 'ink-spread', text: "William Cooke and Charles Wheatstone's electric telegraph used needles that swung to point to letters on a dial. Its first commercially successful use anywhere in the world was on a London railway in 1840.", sources: [S.standardTime] },
        { type: 'paragraph', section: 'linen', position: 'top-right', atmosphere: 'glazed-roof', effect: 'rise-expand', lead: 'Fun tidbit:', text: 'The oldest photographic negative that still survives is a picture of a window, taken by William Henry Fox Talbot in August 1835. Then, in 1843, Anna Atkins began publishing the first book in Britain illustrated with photographs: bright blue "cyanotype" prints of seaweed, made by laying the plants on sun-sensitive paper.', sources: [S.photography] },

        { type: 'paragraph', section: 'linen', atmosphere: 'glazed-roof', effect: 'blur-to-sharp', text: 'The Victoria and Albert Museum (V&A) was founded in 1852 as a hallmark of this age, showcasing decorative arts and design to inspire creativity and educate the public.' },

        // Added (A18): the museum.
        { type: 'section-title', atmosphere: 'glazed-roof', effect: 'mega-zoom-out', text: 'It all began with the Great Exhibition.', sources: [S.building] },
        { type: 'paragraph', section: 'linen', position: 'bottom-left', atmosphere: 'glazed-roof', effect: 'typewriter', text: 'In 1851, the Great Exhibition filled a gigantic "Crystal Palace" in London\'s Hyde Park with everything from steam engines to treasures from around the world. About six million people visited, a third of Britain\'s population, including Charles Darwin and Charles Dickens.', sources: [S.building] },
        { type: 'paragraph', section: 'linen', position: 'top-right', atmosphere: 'wallpaper-damask', effect: 'line-by-line', text: 'Prince Albert urged that the Exhibition\'s profits be used to build museums and colleges in South Kensington, and the V&A was the first of them. Its first director, Henry Cole, said the museum should be "a schoolroom for everyone."', sources: [S.building] },
        { type: 'paragraph', section: 'linen', position: 'center', atmosphere: 'gaslamp', effect: 'glitch', lead: 'Fun tidbit:', text: 'The museum once had a "Chamber of Horrors": a gallery of badly designed everyday objects, meant to teach visitors good taste. The manufacturers were mortified and complained, and it closed after only two weeks!', sources: [S.building] },
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
        // Added (A18): captions the photograph above.
        { type: 'paragraph', section: 'linen', position: 'bottom-left', atmosphere: 'gaslamp', effect: 'breathe', lead: 'Fun tidbit:', text: "The museum's refreshment rooms were the first of their kind in the world. Gas lighting let its galleries stay open on winter evenings, so working people could visit after a day's work.", sources: [S.building] },
        { type: 'paragraph', section: 'linen', position: 'top-left', atmosphere: 'glazed-roof', effect: 'kenburns-in', text: "In 1899, at what turned out to be her last public ceremony, Queen Victoria laid the foundation stone of the museum's grand new building, and it was renamed the Victoria and Albert Museum.", sources: [S.building] },

        { type: 'paragraph', section: 'linen', atmosphere: 'gaslamp', effect: 'fade-in', text: 'Social reform improved conditions for workers, while class divisions and urban challenges persisted. The legacy of Victorian Britain is still evident in its architecture, inventions, and global influence.' },
        // Added (A18): one example of reform.
        { type: 'paragraph', section: 'linen', position: 'top-right', atmosphere: 'locomotive-steam', effect: 'split-reveal', text: 'One example: in 1842, a report on children working in coal mines shocked the public. A new law made it illegal for women and girls, or boys under ten, to work underground in a mine. With only one inspector for the whole country it was hard to enforce, but it was a first step.', sources: [S.coal] },
        { type: 'paragraph', section: 'linen', position: 'center', atmosphere: 'locomotive-steam', effect: 'drift', lead: 'Fun tidbit:', text: 'That 1842 report was the first Royal Commission report ever to include illustrations, so people could see the conditions for themselves.', sources: [S.coal] },

        { type: 'callout', section: 'link', atmosphere: 'wallpaper-damask', effect: 'film-credits', text: 'Learn more about the story of the V&A', url: VA_HISTORY_URL },
        { type: 'end', section: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Victorian Britain changed quickly, in fashion as well as in industry. What is something that has changed quickly in your own lifetime, and how has it changed everyday life?',
        'Trains, wires and photographs changed everyday life.': 'Before railway time, towns kept their own clocks. What would be hard about everyday life if every town kept a different time?',
        'It all began with the Great Exhibition.': 'The V&A was founded to inspire creativity and educate the public. If you could start a museum to inspire people today, what would you put in it, and why?',
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
        { type: 'paragraph', section: 'linen', atmosphere: 'locomotive-steam', effect: 'line-by-line', text: 'In the 19th century, Christmas traditions were in decline, impacted by the lingering effects of Puritan opposition to its pagan roots and the Industrial Revolution, which left workers little time for celebration.', note: VICTORIAN_NOTES.puritans },
        // Added (A18).
        { type: 'paragraph', section: 'linen', position: 'top-left', atmosphere: 'christmas-snow', effect: 'fade-in', text: "At the start of the 1800s, many businesses didn't even treat Christmas as a holiday, and presents were traditionally given at New Year. By the end of the century, Christmas had become the biggest celebration of the year in Britain.", sources: [S.christmasTraditions] },
        { type: 'paragraph', section: 'linen', atmosphere: 'yule-hearth', effect: 'rise-expand', text: "The holiday's revival gained momentum under Queen Victoria and Prince Albert, who popularized German customs like the Christmas tree, while the first Christmas cards appeared in the 1840s." },
        // Added (A18): the tree, the first card, the cracker, the railways.
        { type: 'paragraph', section: 'linen', position: 'bottom-right', atmosphere: 'christmas-snow', effect: 'drift', text: 'In 1848, the *Illustrated London News* printed a picture of the royal family gathered around a decorated Christmas tree, and trees quickly became popular all over Britain. The first advertisements for tree ornaments appeared in 1853.', sources: [S.christmasTraditions] },
        { type: 'section-title', atmosphere: 'wallpaper-damask', effect: 'mega-zoom-out', text: "The very first Christmas card was sent by the V&A's own first director.", sources: [S.firstCard] },
        { type: 'paragraph', section: 'linen', position: 'top-right', atmosphere: 'wallpaper-damask', effect: 'line-by-line', text: 'In 1843, Henry Cole had so much Christmas mail piling up that he asked his friend, the artist John Callcott Horsley, to design a card he could send instead. It showed three generations of the Cole family raising a toast, surrounded by scenes of giving to people in need.', sources: [S.firstCard] },
        { type: 'paragraph', section: 'linen', position: 'bottom-left', atmosphere: 'glazed-roof', effect: 'breathe', lead: 'Fun tidbit:', text: 'Cole printed 1,000 cards and sold the spares for a shilling each, which was so expensive that the venture was judged a flop. But when one of his cards was auctioned in 2013, it sold for £22,000!', sources: [S.firstCard] },
        { type: 'paragraph', section: 'linen', position: 'center', atmosphere: 'christmas-snow', effect: 'shrink-back', lead: 'Fun tidbit:', text: 'Victorian Christmas cards made robins, holly, snowy scenes and Father Christmas into the symbols of the season. One even shows Father Christmas riding a bicycle! Today, around a billion Christmas cards are bought in the UK every year.', sources: [S.firstCard] },
        { type: 'paragraph', section: 'linen', position: 'top-left', atmosphere: 'yule-hearth', effect: 'glitch', lead: 'Fun tidbit:', text: 'Christmas crackers are a Victorian invention too! Sweet-shop owner Tom Smith came up with the idea in the 1840s after seeing paper-wrapped sweets in Paris, and by the 1860s he had perfected the "bang."', sources: [S.christmasTraditions] },
        { type: 'paragraph', section: 'linen', position: 'top-right', atmosphere: 'locomotive-steam', effect: 'pan-lr', text: 'The new railways helped too. People who had moved to the cities to find work could travel home to spend Christmas with the people they loved.', sources: [S.christmasTraditions] },
        { type: 'paragraph', section: 'linen', atmosphere: 'gaslamp', effect: 'film-credits', text: "However it was Charles Dickens' *A Christmas Carol* (1843) that truly gave us the Christmas we know today." },
        // Added (A18).
        { type: 'paragraph', section: 'linen', position: 'bottom-right', atmosphere: 'gaslamp', effect: 'typewriter', lead: 'Fun tidbit:', text: "Dickens's own handwritten manuscript of *A Christmas Carol* still survives. It is kept at the Morgan Library in New York.", sources: [S.dickens] },
        { type: 'paragraph', section: 'linen', atmosphere: 'yule-hearth', effect: 'split-reveal', text: 'Dickens may not have invented Christmas but he certainly reinvented it.' },
        { type: 'paragraph', section: 'linen', atmosphere: 'yule-hearth', effect: 'breathe', text: "*A Christmas Carol* emphasized kindness, charity, and community through Scrooge's transformation. Dickens' \"Carol Philosophy\" celebrated the holiday as a time to open hearts and embrace humanity, a message still resonating nearly 200 years later." },
        { type: 'paragraph', section: 'linen', atmosphere: 'christmas-snow', effect: 'fade-in', text: "Dickens' influence shaped modern Christmas celebrations more profoundly than almost anyone else." },

        { type: 'end', section: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Dickens’ story celebrated kindness, charity, and community. Which traditions, at any time of year, bring the people around you together, and what makes them matter to you?',
        "The very first Christmas card was sent by the V&A's own first director.": 'Henry Cole made one card he could send to many people at once. If you designed a card for the people you care about, what would you put on it, and why?',
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
