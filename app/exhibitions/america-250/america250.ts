import type { CSSProperties } from 'react';
import type { Atmosphere, CasePageData, ExhibitionConfig, PanelFigure } from '@/components/exhibition/types';
import type { ApprovedFact } from '@/components/exhibition/FactNote';
import { floorReturnFor } from '@/lib/floors';

/*
 * America 250: every word on screen, and the look.
 *
 * The poster copy is set exactly as printed on the two posters, with only the
 * owner's seven approved fixes:
 *   1. the epigraph is credited "attributed to Benjamin Franklin";
 *   2. Franklin's "self-evident" and "pursuit of happiness" sentences stay as
 *      printed;
 *   3. the Carroll episode is told as a story ("The story goes that …"), with
 *      his reason for signing that way (his father, Charles Carroll of
 *      Annapolis);
 *   4. dates in US style ("July 3, 1776", "the July 4 Fair Copy");
 *   5. "Congress did not order the Engrossed Copy until July 19, and most
 *      delegates signed it on August 2." in place of the sentence about its
 *      completion;
 *   6. George III "is reported to have said" Washington's choice would make
 *      him the greatest man in the world;
 *   7. the first pull quote is credited to Verity Kahn, *The Myth of the
 *      Declaration of Independence*.
 * And one approved move on each poster: its pull quote ("Before it was
 * sacred …", "It took fifty-six signatures …") is its last panel before the
 * link, closing the poster, in place of its spot mid-way.
 * And one approved section title (B9.2): "The Signer Who Refused To Be
 * Anonymous", in place of "The Catholic Who …"; the copy beneath still names
 * Carroll's faith, as history. After that chapter, a museum note (not poster
 * wording): Many Faiths, One Declaration (MANY_FAITHS).
 * Typesetting only: the two doubled spaces on poster 2 are single, and the
 * title of Paine's pamphlet is set in italics, as are the two stressed words
 * the poster italicizes (*wanted*, *needed*). "*…*" marks italics.
 *
 * Each sentence lives in one place below, so a fix to the posters is a
 * one-line edit here. Where a poster paragraph runs across several panels it
 * is split only between sentences; nothing is reworded. Each poster's section
 * titles open its chapters, as the posters set them. Each poster opens on its
 * own script title, cut from the poster; its subtitle is set under the
 * painting, as the poster sets it under the triptych.
 *
 * The pictures are the two paintings the posters are built around, from the
 * public-domain originals on Wikimedia Commons, each credited where it
 * appears: John Trumbull's Declaration of Independence (U.S. Capitol) and
 * Emanuel Leutze's Washington Crossing the Delaware (The Metropolitan Museum
 * of Art). The display case (AMERICA_250_CASE) lists the artifacts exactly
 * as the Mini Museum record does; it has not been photographed yet.
 *
 * The "Talk about it" questions are for the projector's teacher strip: open
 * discussion questions, one per chapter, keyed by the section title exactly
 * as it is set (OPENING, '', is the panels before the first section title).
 * They make no factual claims.
 */

// The posters' palette: cream paper, framed in slate (poster 1) or rust
// (poster 2), set in a warm near-black ink.
const PAPER = '#F8F6F0';
const INK = '#2A2724';
/* Poster 1's frame and script: 5.5:1 on the paper, so it serves small text too. */
const SLATE = '#56656F';
/* Poster 2's frame and script: 4.9:1 on the paper. */
const RUST = '#A84F33';

/* The titles are set in a flowing monoline script, as on the posters
   (Allison, loaded below; america250.css sets it as --ap-script). */
/* Section heads, quotes and copy: Caslon, the face of the 1776 broadsides. */
const SERIF = "'Libre Caslon Text', 'Big Caslon', Georgia, serif";
/* Subtitles and labels: the posters' thin light sans. */
const SANS = "'IBM Plex Sans', 'Helvetica Neue', system-ui, sans-serif";

export const NARA_DECLARATION_URL = 'https://www.archives.gov/founding-docs/declaration';
export const NARA_SIGNERS_URL = 'https://www.archives.gov/founding-docs/signers-factsheet';

export const TRUMBULL_CREDIT = 'John Trumbull, *Declaration of Independence*, 1818. U.S. Capitol. Public domain.';
export const TRUMBULL_SOURCE = 'https://commons.wikimedia.org/wiki/File:Declaration_of_Independence_(1819),_by_John_Trumbull.jpg';
export const LEUTZE_CREDIT = 'Emanuel Leutze, *Washington Crossing the Delaware*, 1851. The Metropolitan Museum of Art. Public domain.';
export const LEUTZE_SOURCE = 'https://commons.wikimedia.org/wiki/File:Washington_Crossing_the_Delaware_by_Emanuel_Leutze,_MMA-NYC,_1851.jpg';

/*
 * "Many Faiths, One Declaration" (proposal B9.3, owner-approved): a museum
 * note set straight after the Carroll chapter, so it is clearly not poster
 * wording. It keeps Carroll's Catholic fact as history and sets it among the
 * religious variety of the founding era. Each fact carries its sources
 * (FactNote); where a source could not be confirmed, the claim that hung on
 * it was left out ("read aloud every year", "a minority in Connecticut",
 * "with a razor").
 */
export const MANY_FAITHS_KICKER = 'Museum note · Many Faiths, One Declaration';
export const MANY_FAITHS: Record<string, ApprovedFact> = {
  intro: {
    text: 'Carroll was not the only signer whose faith set him apart. The men and women of the founding era included Presbyterians and Anglicans, Quakers and Baptists, Jews and freethinkers, and in 1787 the Constitution declared that no religious test would ever be required to hold federal office.',
    sources: [{ label: 'National Archives, the Constitution, Article VI', href: 'https://www.archives.gov/founding-docs/constitution-transcript' }],
  },
  witherspoon: {
    text: 'John Witherspoon, a Presbyterian minister born in Scotland and president of the College of New Jersey (now Princeton University), signed for New Jersey. He was the only clergyman to sign.',
    sources: [
      { label: 'National Archives, Signers gallery', href: 'https://www.archives.gov/founding-docs/signers-gallery' },
      { label: 'Library of Congress, Religion and the Founding of the American Republic', href: 'https://www.loc.gov/exhibits/religion/rel03.html' },
      { label: 'Princeton University, “Princeton in the nation’s service”', href: 'https://www.princeton.edu/news/2026/06/25/princeton-service-new-nation' },
    ],
  },
  quakers: {
    text: 'Most Quakers held to their faith’s refusal of violence and would not fight. Those who took up arms were disowned by their meetings, and some of them formed their own congregation, the Free Quakers.',
    sources: [{ label: 'Library of Congress, “Religion and the American Revolution”', href: 'https://www.loc.gov/exhibits/religion/rel03.html' }],
  },
  salomon: {
    text: 'Haym Salomon, a Jewish immigrant from Poland, worked in Philadelphia as a broker for Robert Morris, the Superintendent of Finance, selling the bills of exchange that helped pay for the war. Members of Congress, among them James Madison, depended on him for personal loans.',
    sources: [
      { label: 'Founders Online (National Archives), Madison Papers, editorial note, October 18, 1782', href: 'https://founders.archives.gov/documents/Madison/01-05-02-0090' },
      { label: 'Britannica Money, Haym Salomon', href: 'https://www.britannica.com/money/Haym-Salomon' },
    ],
  },
  newport: {
    text: 'In August 1790 President Washington visited Newport, Rhode Island, and answered a letter from its Jewish congregation. The government of the United States, he wrote, “gives to bigotry no sanction, to persecution no assistance.” He borrowed the phrase from the congregation’s own letter, written by its warden, Moses Seixas. Their synagogue, dedicated in 1763, is the oldest synagogue building in the United States.',
    sources: [
      { label: 'National Park Service, Touro Synagogue', href: 'https://www.nps.gov/places/touro-synagogue.htm' },
      { label: 'Founders Online (National Archives), From George Washington to the Hebrew Congregation in Newport, August 18, 1790', href: 'https://founders.archives.gov/documents/Washington/05-06-02-0135' },
      { label: 'George Washington’s Mount Vernon, “Moses Seixas”', href: 'https://mountvernon.org/digital-encyclopedia/article/moses-seixas' },
    ],
  },
  saur: {
    text: 'The Bible leaf in this exhibition’s display case comes from the German Bible printed at Germantown, Pennsylvania, by Christoph Saur II, a minister of the Brethren (the “Dunkers”), a small peace church. His father’s edition of 1743 was the first Bible printed in North America in a European language.',
    sources: [
      { label: 'Bridwell Library, Southern Methodist University, “Saur Bible”', href: 'https://bridwell.omeka.net/exhibits/show/pietists/northamerica/saur' },
      { label: 'Museum of the Bible, “The Gun-Wad Bible”', href: 'https://collections.museumofthebible.org/artifacts/2337-the-gun-wad-bible' },
    ],
  },
  freethinkers: {
    text: 'Some founders questioned the churches of their day. Benjamin Franklin wrote in his autobiography that as a young man he “soon became a thorough Deist.” Late in life Thomas Jefferson cut passages from the Gospels and rearranged them into his own book of Jesus’s moral teachings. The Smithsonian calls it “a personal exercise in understanding Jesus’s moral teachings separated from religious doctrine.”',
    sources: [
      { label: 'Center for the Study of the American Constitution, University of Wisconsin–Madison, “Deism and the Founders”', href: 'https://csac.history.wisc.edu/2025/07/17/deism-and-the-founders/' },
      { label: 'Smithsonian National Museum of American History, Jefferson’s Bible', href: 'https://amhistory.si.edu/documentsgallery/exhibitions/jefferson/index.html' },
      { label: 'Smithsonian, Jefferson’s Bible: making the book', href: 'https://amhistory.si.edu/documentsgallery/exhibitions/jefferson/2.html' },
    ],
  },
  danbury: {
    text: 'The Baptists of Danbury, Connecticut, wrote to President Jefferson about their religious liberty. On January 1, 1802, he answered that the First Amendment had built “a wall of separation between church and state.” In his draft he had first written “a wall of *eternal* separation.”',
    sources: [
      { label: 'Library of Congress, “Religion and the Federal Government”', href: 'https://loc.gov/exhibits/religion/rel06-2.html' },
      { label: 'Library of Congress Information Bulletin, June 1998, James Hutson, “‘A Wall of Separation’”', href: 'https://www.loc.gov/loc/lcib/9806/danbury.html' },
    ],
  },
};

const trumbull = { text: TRUMBULL_CREDIT, href: TRUMBULL_SOURCE };
const leutze = { text: LEUTZE_CREDIT, href: LEUTZE_SOURCE };

// Details of the paintings, set beside the copy.
const DELEGATES: PanelFigure = {
  src: '/exhibitions/america-250/trumbull-delegates.jpg',
  alt: 'A detail of Trumbull’s painting: delegates of the Continental Congress in powdered wigs and knee breeches, seated and standing at green-covered tables, one writing',
  side: 'right',
  credit: trumbull,
};
const DRAFT: PanelFigure = {
  src: '/exhibitions/america-250/trumbull-draft.jpg',
  alt: 'A detail of Trumbull’s painting: a hand laying the handwritten draft on a table covered in green cloth, among rolled papers, books and an inkstand with a quill',
  side: 'left',
  credit: trumbull,
};
const HANCOCK: PanelFigure = {
  src: '/exhibitions/america-250/trumbull-hancock.jpg',
  alt: 'A detail of Trumbull’s painting: John Hancock, president of the Congress, seated in a red armchair at the table, with delegates standing behind him',
  side: 'right',
  credit: trumbull,
};
const ROWERS: PanelFigure = {
  src: '/exhibitions/america-250/leutze-rowers.jpg',
  alt: 'A detail of Leutze’s painting: soldiers at the bow of the boat pushing through ice floes with poles and oars, the far shore white with snow',
  side: 'left',
  credit: leutze,
};
const CROSSING: PanelFigure = {
  src: '/exhibitions/america-250/leutze-crossing.jpg',
  alt: 'A detail of Leutze’s painting: a soldier in a fur cap leaning on his oar at the stern, and behind him more boats crowded with men and horses crossing the icy river',
  side: 'right',
  credit: leutze,
};
const WASHINGTON: PanelFigure = {
  src: '/exhibitions/america-250/leutze-washington.jpg',
  alt: 'A detail of Leutze’s painting: George Washington standing in the boat in a dark cloak and tricorn hat, gazing ahead, as an officer behind him holds up a flag of stars and stripes',
  side: 'left',
  credit: leutze,
};

/*
 * The posters' titles as pictures: their own flowing script, cut from the
 * posters at the posters' resolution and lifted off the paper and the top of
 * the painting it crosses (public/exhibitions/america-250/titles/). A sharper
 * export of the same lettering can replace a file at the same path; update
 * its size here when it does.
 */
const TITLE_SIZES = {
  beforeItWasSacred: { width: 920, height: 266 },
  hangTogether: { width: 880, height: 199 },
};

/*
 * The walkthrough's atmospheres (america250.css draws them), each the setting
 * of a part of the story:
 *   signing-quill     the pen: laid paper, an ink line written across it, blots
 *   july-illuminations the Fourth as it is celebrated (and as Adams foresaw it):
 *                     fireworks over a town with a candle in every window
 *   stone-engraving   Stone's 1823 engraving: the plate's mark pressed into the
 *                     paper, cross-hatching cut in at its edges
 *   foxed-parchment   the parchment ageing: brown foxing spreading, worn edges
 *   delaware-ice      the winter of 1776: sleet on the wind, ice floes drifting
 *   thirteen-stars    the republic still to be built: thirteen stars lit in a ring
 */
const ATMOSPHERES: Record<string, Atmosphere> = {
  'signing-quill': { bg: PAPER, parts: 3, particles: 7 },
  'july-illuminations': { bg: '#121726', text: '#F1E9D8', title: '#E8C77D', parts: 2, particles: 9 },
  'stone-engraving': { bg: '#EFE8D8', parts: 3 },
  'foxed-parchment': { bg: '#E9DCBF', parts: 3, particles: 18 },
  'delaware-ice': { bg: '#D9DFE2', parts: 4, particles: 70 },
  'thirteen-stars': { bg: '#1C2640', text: '#F1ECE0', title: '#F1ECE0', parts: 2, particles: 13 },
};

export const AMERICA_PROJECTOR_THEME = {
  '--pj-bg': PAPER,
  '--pj-ink': INK,
  '--pj-muted': '#5E5850',
  '--pj-accent': SLATE,
  '--pj-on-accent': PAPER,
  '--pj-display': SERIF,
  '--pj-body': SERIF,
} as CSSProperties;

const END = 'Return to Exhibition';

export const AMERICA_250: ExhibitionConfig<'poster1' | 'poster2'> = {
  slug: 'america-250',
  name: 'America 250',
  subtitle: 'The Declaration of Independence at 250',
  fonts: {
    href: 'https://fonts.googleapis.com/css2?family=Allison&family=IBM+Plex+Sans:wght@200;300;400&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&display=swap',
    display: SERIF,
    body: SERIF,
    ui: SANS,
  },
  palette: {
    page: PAPER,
    heading: SLATE,
    accent: RUST,
    teach: { color: SLATE, border: 'rgba(86,101,111,0.55)' },
  },
  back: floorReturnFor('america-250'),
  atmospheres: ATMOSPHERES,
  // The press comes down as a poster opens and at each chapter; every panel arrives its own way.
  fx: { theme: 'ap', veil: 'chapters', text: 'all' },
  projector: {
    theme: AMERICA_PROJECTOR_THEME,
    links: [{ label: 'Put Your Name to It: sign with a quill, and follow a copy of a copy', href: '/exhibitions/america-250/sign' }],
  },
  cases: [
    {
      href: '/exhibitions/america-250/artifacts/case',
      label: 'Display Case',
      title: 'Artifacts',
    },
  ],
  // Each room's card shows the room itself: a screenshot of it (public/exhibitions/<slug>/rooms/).
  interactives: [
    {
      href: '/exhibitions/america-250/sign',
      image: { src: '/exhibitions/america-250/rooms/sign.webp', alt: 'The Put Your Name to It room: the Declaration on parchment beside a candle, and the signing steps' },
      label: 'Interactive',
      title: 'Put Your Name to It',
      subtitle: 'Sign with a quill, and follow a copy of a copy',
    },
  ],
  posters: [
    // ============================================
    // POSTER 1: Before it was Sacred
    // ============================================
    {
      id: 'poster1',
      title: 'Before it was Sacred',
      hero: {
        src: '/exhibitions/america-250/poster1.jpg',
        alt: 'Before it was Sacred poster: cream paper in a slate-blue border, the title in a large flowing slate script across John Trumbull’s painting of the Declaration being presented to Congress, set as three panels, with a pull quote and six columns of text',
      },
      colors: { bg: PAPER, text: INK, title: SLATE, quoteRule: SLATE },
      sections: {
        title: { className: 'ap-p1 ap-title' },
        subtitle: { className: 'ap-p1 ap-subtitle' },
        head: { className: 'ap-p1 ap-head', title: INK },
        copy: { className: 'ap-p1 ap-copy' },
        quote: { className: 'ap-p1 ap-quote' },
        picture: { className: 'ap-p1 ap-picture' },
        link: { className: 'ap-p1 ap-link' },
        end: { className: 'ap-p1 ap-end' },
      },
      items: [
        {
          type: 'title-image',
          section: 'title',
          atmosphere: 'signing-quill',
          effect: 'ink-spread',
          src: '/exhibitions/america-250/titles/before-it-was-sacred.png',
          ...TITLE_SIZES.beforeItWasSacred,
          framing: 'centered',
          alt: 'Before it was Sacred',
        },
        {
          type: 'image-text-stacked',
          section: 'subtitle',
          atmosphere: 'july-illuminations',
          effect: 'kenburns-in',
          src: '/exhibitions/america-250/trumbull.jpg',
          alt: 'John Trumbull’s Declaration of Independence: in a high-ceilinged hall hung with red curtains and captured flags, five men stand at the center presenting the draft to John Hancock, seated at the right, while the delegates of the Congress look on',
          text: 'The Declaration of Independence: What It Was, What It Became, and Why the Difference Matters',
          credit: trumbull,
        },
        { type: 'paragraph', section: 'copy', atmosphere: 'july-illuminations', effect: 'line-by-line', text: "If the Declaration of Independence is America's birth certificate, it raises an immediate question: why didn't the Father of America sign it? For most Americans, the Declaration is precisely that — a birth certificate, a cosmogony, the moment the Founding Fathers created a nation in a single spontaneous act. It is not slow or meandering, uncertain or at risk. It is momentous and sudden and instantaneous." },
        { type: 'paragraph', section: 'copy', atmosphere: 'july-illuminations', effect: 'rise-expand', text: 'The entirety of the war, the Constitutional Convention, the years of a fragile and failing republic — all of it is swallowed into one mythic moment on the Fourth of July 1776, when godlike Founders put pen to parchment and America was suddenly there where it had not before been. And presiding over it all, signing the nation into existence as a father signs a birth certificate, is George Washington.' },
        { type: 'paragraph', section: 'copy', atmosphere: 'signing-quill', effect: 'blur-to-sharp', text: 'Except that Washington never signed the Declaration of Independence. He was not even in the room: he was commanding the army. In fact, almost none of the story Americans tell about this document is accurate.' },
        {
          type: 'quote',
          section: 'quote',
          atmosphere: 'thirteen-stars',
          effect: 'breathe',
          text: '"Independence is not understood as having needed to be won, but by virtue of the Declaration alone, America was suddenly there where it had not before been."',
          cite: '— Verity Kahn, *The Myth of the Declaration of Independence*',
        },

        { type: 'section-title', section: 'head', atmosphere: 'signing-quill', effect: 'split-reveal', text: 'The Wrong Date' },
        { type: 'paragraph', section: 'copy', atmosphere: 'july-illuminations', effect: 'shrink-back', figure: DELEGATES, text: 'On July 3, 1776, John Adams wrote to his wife Abigail in a state of elation that Independence had been resolved the previous day, and Adams was certain of its significance. The Second of July, he declared, would be celebrated by future generations as the great anniversary — marked with pomp, parades, and illuminations from one end of the continent to the other.' },
        { type: 'paragraph', section: 'copy', atmosphere: 'signing-quill', effect: 'fade-in', text: 'Adams was remarkably prescient about everything, except the date. Independence was resolved on July 2, 1776. The Declaration, adopted two days later, was merely the formal explanation of a decision already made — a statement of justification, not an act of independence.' },
        { type: 'paragraph', section: 'copy', atmosphere: 'signing-quill', effect: 'typewriter', text: "July 4th was, in Adams' own understanding, a formality. Yet the myth settled on it regardless, and Adams' prediction was displaced by the very story he had helped to create." },

        { type: 'section-title', section: 'head', atmosphere: 'stone-engraving', effect: 'blur-to-sharp', text: 'The Wrong Document' },
        { type: 'paragraph', section: 'copy', atmosphere: 'stone-engraving', effect: 'mega-zoom-out', figure: DRAFT, text: "What most people picture as the Declaration of Independence was not the actual document present at the Continental Congress. It is, in fact, an engraving made in 1823 by William J. Stone — itself an imperfect copy of the Engrossed parchment, now in the National Archives, which was a reproduction of the July 4 Fair Copy, itself an edited version of Jefferson's Rough Draft." },
        { type: 'paragraph', section: 'copy', atmosphere: 'stone-engraving', effect: 'line-by-line', text: 'Congress did not order the Engrossed Copy until July 19, and most delegates signed it on August 2. Even the transcription offered by the National Archives is a transcription of the Stone engraving, not the original. The document Americans venerate is a copy of a copy, made nearly fifty years after the fact.' },

        { type: 'section-title', section: 'head', atmosphere: 'signing-quill', effect: 'film-credits', text: 'The Wrong Author' },
        {
          type: 'full-image',
          section: 'picture',
          atmosphere: 'signing-quill',
          effect: 'kenburns-in',
          src: '/exhibitions/america-250/trumbull-committee.jpg',
          alt: 'A detail of Trumbull’s painting: the five-man drafting committee — John Adams, Roger Sherman, Robert Livingston, Thomas Jefferson and Benjamin Franklin — standing at the table as Jefferson lays down the draft',
          text: TRUMBULL_CREDIT,
          href: TRUMBULL_SOURCE,
        },
        { type: 'paragraph', section: 'copy', atmosphere: 'signing-quill', effect: 'fade-in', text: 'Jefferson was the author but not the sole author. In fact, there were at least four. "We hold these truths to be self-evident" was Franklin\'s alteration of Jefferson\'s original "sacred and undeniable." The "pursuit of happiness" was also shaped by Franklin\'s pen.' },
        { type: 'paragraph', section: 'copy', atmosphere: 'signing-quill', effect: 'line-by-line', text: "Congress made further changes, most significantly removing Jefferson's charge against George III for the slave trade, whose removal left Jefferson so despondent that he needed consolation. What survived was a cooler, more measured document than Jefferson intended." },
        { type: 'paragraph', section: 'copy', atmosphere: 'signing-quill', effect: 'blur-to-sharp', text: "The preamble that Americans now consider the Declaration's heart was, in 1776, its least important section. The twenty-seven charges against the King — the longest part of the text — were the whole point. The Declaration was a legal and diplomatic argument designed above all to persuade France to enter the war, not a birth certificate or even a philosophical promise for the new Republic." },

        { type: 'section-title', section: 'head', atmosphere: 'foxed-parchment', effect: 'split-reveal', text: 'The Wrong Significance' },
        // Largely ignored: the painting rises, then fades as if forgotten.
        { type: 'paragraph', section: 'copy', atmosphere: 'foxed-parchment', effect: 'erase', figure: HANCOCK, text: 'For the first fifteen years after its adoption the Declaration was largely ignored, kept in poor conditions, its parchment already deteriorating. Adams himself called it "hackneyed" — not an idea in it that had not been discussed in Congress for two years prior.' },
        { type: 'paragraph', section: 'copy', atmosphere: 'foxed-parchment', effect: 'rise-expand', text: "It was Jefferson's rising political career, and then his death in 1826 on the fiftieth anniversary of its adoption — the same day Adams also died, an event widely interpreted as divine providence — that transformed the document into something approaching scripture." },
        { type: 'paragraph', section: 'copy', atmosphere: 'thirteen-stars', effect: 'line-by-line', text: 'Abraham Lincoln completed the transformation at Gettysburg, elevating the preamble above the Constitution itself and making "all men are created equal" the founding promise of the nation. The charges against the King, which had been the Declaration\'s entire purpose, were forgotten. The philosophy, which had been secondary, became everything.' },
        // The owner's approved move: this line closes the poster.
        { type: 'quote', section: 'quote', atmosphere: 'stone-engraving', effect: 'ink-spread', text: 'Before it was sacred, the Declaration was a formality. Understanding what it actually was makes what it became considerably more remarkable.' },

        { type: 'callout', section: 'link', atmosphere: 'foxed-parchment', effect: 'breathe', text: 'Read the Declaration at the National Archives', url: NARA_DECLARATION_URL },
        { type: 'end', section: 'end', text: END },
      ],
      talk: {
        '': 'Many people picture the Declaration as the moment the nation suddenly began. Why do you think people are drawn to stories in which something begins in a single moment?',
        'The Wrong Date': 'John Adams expected a different day to become the great anniversary. Why do you think some dates are remembered and others are forgotten?',
        'The Wrong Document': 'The document many people picture is a copy of a copy. Does it matter to you whether you see an original or a copy? Why or why not?',
        'The Wrong Author': 'Several people shaped the words of the Declaration. How might a piece of writing change when more than one person works on it?',
        'The Wrong Significance': 'What a document meant to the people who wrote it can be different from what it means to people later. Can you think of something whose meaning has changed over time?',
      },
    },

    // ============================================
    // POSTER 2: We Shall All Hang Together
    // ============================================
    {
      id: 'poster2',
      title: 'We Shall All Hang Together',
      hero: {
        src: '/exhibitions/america-250/poster2.jpg',
        alt: 'We Shall All Hang Together poster: cream paper in a rust border, a quotation at the top, the title in a large flowing rust script across Emanuel Leutze’s painting of Washington crossing the icy Delaware, set as three panels, and five sections of text with a pull quote',
      },
      colors: { bg: PAPER, text: INK, title: RUST, quoteRule: RUST },
      sections: {
        title: { className: 'ap-p2 ap-title' },
        subtitle: { className: 'ap-p2 ap-subtitle' },
        head: { className: 'ap-p2 ap-head', title: INK },
        copy: { className: 'ap-p2 ap-copy' },
        quote: { className: 'ap-p2 ap-quote' },
        epigraph: { className: 'ap-p2 ap-quote ap-epigraph' },
        picture: { className: 'ap-p2 ap-picture' },
        link: { className: 'ap-p2 ap-link' },
        end: { className: 'ap-p2 ap-end' },
      },
      items: [
        {
          type: 'title-image',
          section: 'title',
          atmosphere: 'delaware-ice',
          effect: 'blur-to-sharp',
          src: '/exhibitions/america-250/titles/we-shall-all-hang-together.png',
          ...TITLE_SIZES.hangTogether,
          framing: 'centered',
          alt: 'We Shall All Hang Together',
        },
        {
          type: 'quote',
          section: 'epigraph',
          atmosphere: 'signing-quill',
          effect: 'ink-spread',
          text: '"We must all hang together, or assuredly we shall all hang separately."',
          cite: '— attributed to Benjamin Franklin, upon signing the Declaration of Independence',
        },
        {
          type: 'image-text-stacked',
          section: 'subtitle',
          atmosphere: 'delaware-ice',
          effect: 'pan-lr',
          src: '/exhibitions/america-250/leutze.jpg',
          alt: 'Emanuel Leutze’s Washington Crossing the Delaware: George Washington stands in a crowded rowboat as soldiers push it through ice floes on a gray winter river, an officer behind him raising a flag of stars and stripes, and more boats following under a stormy sky',
          text: 'The Wager Fifty-Six Men Made With Their Signatures',
          credit: leutze,
        },
        { type: 'paragraph', section: 'copy', atmosphere: 'signing-quill', effect: 'line-by-line', text: 'The fifty-six men who signed the Declaration of Independence did so in the knowledge that a British victory meant, for the leaders of the rebellion, a public execution. High treason against the Crown carried a very specific sentence under eighteenth-century British law: death by hanging, drawing, and quartering.' },
        { type: 'paragraph', section: 'copy', atmosphere: 'signing-quill', effect: 'fade-in', text: 'These men were not signing a certificate of triumph, but a death warrant. The war had been going badly. It would get considerably worse. When they lifted their pens to sign, not one of those men could say with certainty what the outcome would be.' },

        { type: 'section-title', section: 'head', atmosphere: 'delaware-ice', effect: 'split-reveal', text: 'The War That Nearly Was Not Won' },
        { type: 'paragraph', section: 'copy', atmosphere: 'delaware-ice', effect: 'waves-drift', figure: ROWERS, text: 'The popular memory of the Revolution treats American independence as inevitable: a righteous cause whose triumph was always assured. Benjamin Rush, writing to Richard Price in 1786, offered a more accurate account: "The American war is over; but this is far from being the case with the American revolution. On the contrary, nothing but the first act of the drama is closed."' },
        { type: 'paragraph', section: 'copy', atmosphere: 'delaware-ice', effect: 'line-by-line', text: 'When the Declaration was signed in the summer of 1776, Washington commanded approximately 19,000 men, many sick, poorly equipped, serving on enlistments already expiring. By contrast they were up against the greatest military in the world: Britain had landed 32,000 troops on Staten Island, the largest expeditionary force the Empire had ever assembled.' },
        // The army dwindling: the copy settles back as it is read.
        { type: 'paragraph', section: 'copy', atmosphere: 'delaware-ice', effect: 'shrink-back', text: 'Within weeks, the Battle of Long Island had become a near-catastrophe for the colonists. By November, Washington was retreating across New Jersey with perhaps 3,000 effective troops remaining.' },
        {
          type: 'full-image',
          section: 'picture',
          atmosphere: 'delaware-ice',
          effect: 'kenburns-in',
          src: '/exhibitions/america-250/leutze-ice.jpg',
          alt: 'A detail of Leutze’s painting: jagged blocks of ice and churning gray-green water at the foot of the boat, an oar dipping in among the floes',
          text: LEUTZE_CREDIT,
          href: LEUTZE_SOURCE,
        },
        { type: 'paragraph', section: 'copy', atmosphere: 'delaware-ice', effect: 'typewriter', text: 'Thomas Paine wrote *The American Crisis* in those weeks — "These are the times that try men\'s souls" — not as the rhetoric of a winning side but as a desperate attempt to hold together an army that was dissolving.' },
        { type: 'paragraph', section: 'copy', atmosphere: 'delaware-ice', effect: 'fade-in', text: 'The British, from occupied New York, published declarations urging colonists to return to their allegiance while terms were still available. Many believed they would.' },

        { type: 'section-title', section: 'head', atmosphere: 'signing-quill', effect: 'blur-to-sharp', text: 'What Signing Actually Meant' },
        { type: 'paragraph', section: 'copy', atmosphere: 'delaware-ice', effect: 'mega-zoom-out', figure: CROSSING, text: 'The signers were now identified men. They had put their names to an act of treason and this meant real consequences. Richard Stockton, a New Jersey delegate, was captured by the British, imprisoned, and tortured. His home was burned, his library destroyed. Under those conditions he recanted his signature.' },
        { type: 'paragraph', section: 'copy', atmosphere: 'signing-quill', effect: 'line-by-line', text: 'It is the most human moment in the whole story of the Declaration: a man in pain, in fear, saying what his captors *wanted* him to say and what he *needed* to say to avoid execution.' },
        { type: 'paragraph', section: 'copy', atmosphere: 'foxed-parchment', effect: 'fade-in', text: 'Stockton never recovered his health and died in 1781, broken by what had been done to him and what he had done under duress. He had pledged everything the Declaration asked of him, yet by the time of his death Independence had still not been won.' },

        { type: 'section-title', section: 'head', atmosphere: 'signing-quill', effect: 'film-credits', text: 'The Signer Who Refused To Be Anonymous' },
        { type: 'paragraph', section: 'copy', atmosphere: 'signing-quill', effect: 'ink-spread', text: 'Charles Carroll of Carrollton was the only Catholic among the fifty-six signers. In 1776, Catholics could still not hold public office in most of the American colonies.' },
        { type: 'paragraph', section: 'copy', atmosphere: 'signing-quill', effect: 'line-by-line', text: 'The story goes that when it was observed that there were many men named Charles Carroll and he might escape personal consequence, Carroll responded by adding his full address to his signature — "of Carrollton" — so there could be no mistaking which Charles Carroll had signed. (He often signed that way to tell himself apart from his father, Charles Carroll of Annapolis.) He refused the protection of ambiguity to stand in life and death with his fellow signers.' },
        { type: 'paragraph', section: 'copy', atmosphere: 'foxed-parchment', effect: 'blur-to-sharp', text: "Carroll eventually outlived every other signatory, dying in 1832 at the age of ninety-five as the last living connection to that room, that day, that decision. When asked what he considered his most important contribution, he did not mention his wealth or his longevity. Carroll's answer was his signature on the Declaration, and the fact that he had made sure it could be read." },
        // Museum note, not poster wording (owner-approved, B9.3): Many Faiths, One Declaration.
        { type: 'note', section: 'copy', atmosphere: 'stone-engraving', effect: 'fade-in', kicker: MANY_FAITHS_KICKER, facts: [MANY_FAITHS.intro] },
        { type: 'note', section: 'copy', atmosphere: 'signing-quill', effect: 'drift', kicker: MANY_FAITHS_KICKER, facts: [MANY_FAITHS.witherspoon, MANY_FAITHS.quakers] },
        { type: 'note', section: 'copy', atmosphere: 'signing-quill', effect: 'rise-expand', kicker: MANY_FAITHS_KICKER, facts: [MANY_FAITHS.salomon] },
        { type: 'note', section: 'copy', atmosphere: 'stone-engraving', effect: 'breathe', kicker: MANY_FAITHS_KICKER, facts: [MANY_FAITHS.newport] },
        { type: 'note', section: 'copy', atmosphere: 'foxed-parchment', effect: 'fade-in', kicker: MANY_FAITHS_KICKER, facts: [MANY_FAITHS.saur, MANY_FAITHS.freethinkers] },
        { type: 'note', section: 'copy', atmosphere: 'thirteen-stars', effect: 'ink-spread', kicker: MANY_FAITHS_KICKER, facts: [MANY_FAITHS.danbury] },

        { type: 'section-title', section: 'head', atmosphere: 'thirteen-stars', effect: 'split-reveal', text: 'The Long Wager' },
        { type: 'paragraph', section: 'copy', atmosphere: 'thirteen-stars', effect: 'rise-expand', text: 'The signatures of 1776 did not end the wager on the colonies\' independence, rather they began it. The independence the Declaration asserted so assuredly still had to be built through the failed confederation, the Constitutional Convention held in secret, and the ratification process that was anything but certain. America was constantly and consistently referred to as an experiment by the same men who were attempting to forge it.' },
        { type: 'paragraph', section: 'copy', atmosphere: 'thirteen-stars', effect: 'kenburns-in', figure: WASHINGTON, text: "Washington fought the war, presided over the Constitutional Convention, served two terms as the republic's first president, and then voluntarily surrendered power and returned to his farm, a choice King George III is reported to have said would make Washington the greatest man in the world." },
        { type: 'paragraph', section: 'copy', atmosphere: 'july-illuminations', effect: 'line-by-line', text: 'The wager fifty-six men made with their signatures in 1776 was not settled on a battlefield. It was settled by what they built, and what they were willing to give up, in the decades that followed.' },
        // The owner's approved move: this line closes the poster.
        { type: 'quote', section: 'quote', atmosphere: 'thirteen-stars', effect: 'breathe', text: 'It took fifty-six signatures, seven years of war, and a generation of men willing to lose everything to fulfill the Declaration.' },

        { type: 'callout', section: 'link', atmosphere: 'july-illuminations', effect: 'film-credits', text: 'Meet the signers at the National Archives', url: NARA_SIGNERS_URL },
        { type: 'end', section: 'end', text: END },
      ],
      talk: {
        '': 'The signers could not know how the war would turn out. What makes it hard to stand up for something when you cannot know how it will end?',
        'The War That Nearly Was Not Won': 'Looking back, the outcome of a war can seem certain. Why do you think stories about the past can make events feel more certain than they felt at the time?',
        'What Signing Actually Meant': 'Richard Stockton said what he needed to say to survive. How should we think about what people say or do when they are in pain or afraid?',
        'The Signer Who Refused To Be Anonymous': 'Charles Carroll made sure his signature could not be mistaken. When might it matter to put your own name to what you believe?',
        'The Long Wager': 'The poster says the wager was settled by what the signers built and what they were willing to give up. What is something worth building that takes many years to finish?',
      },
    },
  ],
};

/*
 * The display case: the artifacts exactly as the Mini Museum record lists
 * them. The two newspapers share a line of the record, and each has a page of
 * its own. The posters do not discuss these objects, so none carries poster
 * writing.
 */
export const AMERICA_250_CASE: CasePageData = {
  label: 'Display Case',
  title: 'Artifacts',
  // Photographs to come: the case has not been photographed yet.
  photos: [],
  artifacts: [
    {
      id: 'valley-forge-iron-bolt',
      name: 'Valley Forge iron bolt',
      record: 'Hand-forged Valley Forge iron bolt',
    },
    // "Gun wad" is the leaf's traditional name, kept as the record has it. The
    // story behind it (that unbound pages of Saur's Bible were used for
    // cartridge paper at the Battle of Germantown, 1777) is a legend, now
    // mostly discredited (Museum of the Bible, "The Gun-Wad Bible"): any label
    // that ever tells it says "the story goes" (owner-approved; the case's
    // test checks it).
    {
      id: 'gun-wad-bible-leaf',
      name: 'Gun wad Bible leaf',
      record: "18th-century gun wad Bible leaf from Christoph Saur II's Germantown Bible",
    },
    {
      id: 'london-evening-post',
      name: '*The London Evening Post*',
      record: "Original editions of *The London Evening Post* (carrying Howe's Declaration) and *The London Chronicle*",
    },
    {
      id: 'london-chronicle',
      name: '*The London Chronicle*',
      record: "Original editions of *The London Evening Post* (carrying Howe's Declaration) and *The London Chronicle*",
    },
  ],
  display: ['Flat jersey shadow boxes with velvet risers, black mat LED lip lighting, and tethered magnifiers'],
};
