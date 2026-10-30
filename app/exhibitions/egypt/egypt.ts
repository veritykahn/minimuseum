import type { CSSProperties } from 'react';
import type { ApprovedFact, FactSource } from '@/components/exhibition/FactNote';
import type { Atmosphere, CasePageData, ExhibitionConfig, PanelFigure } from '@/components/exhibition/types';
import { floorReturnFor } from '@/lib/floors';

/*
 * Ancient Egypt: every word on screen, and the look.
 *
 * The poster copy is set exactly as printed on the two posters, with the two
 * spellings the owner approved for US style ("civilization", "recognize")
 * and nothing else changed. Each sentence lives in one place below, so a fix
 * to the posters is a one-line edit here. Where a poster paragraph runs
 * across several panels it is split only between sentences; nothing is
 * reworded. Each of the four gods on poster 2 opens a chapter of its own,
 * under the god's name as the poster sets it, in script.
 *
 * The posters' QR codes are links: poster 1's to the British Museum's Egypt
 * collection, poster 2's to the British Museum's page on ancient Egyptian
 * gods and goddesses.
 *
 * Left out: the pharaoh bust and the painted coffin face on poster 1. The
 * bust is the British Museum's "Younger Memnon" (EA 19), but the photograph
 * on the poster is not one of the Museum's own, so it cannot carry the
 * Museum's credit; the coffin could not be matched to a collection record.
 *
 * The "Talk about it" questions are for the projector's teacher strip: open
 * discussion questions, one per chapter, keyed by the section title exactly
 * as it is set (OPENING, '', is the panels before the first section title).
 * They make no factual claims.
 */

// The posters' palette: near-black ground, white type, orange-red script and dots.
const GROUND = '#1B1B1B';
const DEEP = '#141414';
const INK = '#EFEBE5';
const WHITE = '#FFFFFF';
/* The posters' orange-red. 4.7:1 on the ground, so it serves small text too. */
const ORANGE = '#F04A1A';

const DISPLAY = "'Playfair Display', Georgia, serif";
const BODY = "'Playfair', 'Playfair Display', Georgia, serif";

export const BM_EGYPT_URL = 'https://www.britishmuseum.org/collection/egypt';
export const BM_GODS_URL = 'https://www.britishmuseum.org/learn/schools/ages-7-11/ancient-egypt/ancient-egyptian-gods-and-goddesses';

/** The Younger Memnon (Ramesses II), British Museum EA 19, in the museum's own photograph. */
const RAMESSES: PanelFigure = {
  src: '/exhibitions/egypt/bm-ea19-younger-memnon.jpg',
  alt: 'The Younger Memnon: a colossal granite bust of the pharaoh Ramesses II wearing the striped nemes headdress, lit against black',
  side: 'right',
  credit: {
    text: '© The Trustees of the British Museum. Shared under a CC BY-NC-SA 4.0 licence.',
    href: 'https://www.britishmuseum.org/collection/object/Y_EA19',
  },
};

const ANUBIS: PanelFigure = {
  src: '/exhibitions/egypt/anubis.jpg',
  alt: 'Anubis in the Egyptian style: a man with the black head of a jackal, holding a staff and an ankh, in a border of colored petals',
};
const BASTET: PanelFigure = {
  src: '/exhibitions/egypt/bastet.jpg',
  alt: 'Bastet in the Egyptian style: a woman with the black head of a cat, in a long white dress, holding a sistrum and an ankh, in a border of colored petals',
};
const HORUS: PanelFigure = {
  src: '/exhibitions/egypt/horus.jpg',
  alt: 'Horus in the Egyptian style: a man with the head of a falcon and a tall crown, holding a staff and an ankh, in a border of colored petals',
};
const ISIS: PanelFigure = {
  src: '/exhibitions/egypt/isis.jpg',
  alt: 'Isis in the Egyptian style: a woman in a long red dress with a crown on her head, holding a staff and an ankh, in a border of colored petals',
};

/*
 * The posters' titles as pictures: their own lettering, the white serif and
 * the orange-red script together (no web face matches the script), cut
 * from the posters' 1728px exports (public/exhibitions/egypt/titles/). A
 * sharper export of the same lettering can replace a file; update its size here.
 */
/** Cut from the poster's 1728px export: 1728 of its pixels to every 1050 of the served poster's. */
const TITLE_DENSITY = 1728 / 1050;
const TITLE_SIZES = {
  mysteries: { width: 1048, height: 991, density: TITLE_DENSITY },
  godsAndGoddesses: { width: 1029, height: 566, density: TITLE_DENSITY },
};

/** The hieroglyphs poster 2 sets beside each god's name (design elements, used as part of the exhibition's design). */
const GLYPHS = ['anubis', 'bastet', 'horus', 'isis'];

/*
 * The walkthrough's atmospheres (egypt.css draws them), each the setting of
 * a part of the story:
 *   sand         the desert: sand blowing low across the ground
 *   nile         the river: water shimmering, a glint on its surface
 *   hieroglyphs  writing: the poster's hieroglyphs carved into the wall, stroke by stroke
 *   papyrus      the Rosetta Stone and its reading: a sheet of papyrus unrolled
 *   torchlight   the tomb: torchlight flickering on stone, embers rising
 *   gold         treasure and the gods: gold leaf catching the light
 */
const ATMOSPHERES: Record<string, Atmosphere> = {
  sand: { bg: '#1e1913', parts: 2, particles: 56 },
  nile: { bg: '#0f181a', parts: 3, particles: 14 },
  hieroglyphs: { bg: '#181512', parts: 2, images: GLYPHS.flatMap((g) => [1, 2].map((n) => ({ src: `/exhibitions/egypt/glyphs/${g}.png`, className: `eg-glyph eg-glyph-${g} eg-glyph-col-${n}` }))) },
  papyrus: { bg: GROUND, text: '#2b2014', title: '#9c2f0c', parts: 3 },
  torchlight: { bg: '#130e0a', parts: 2, particles: 10 },
  gold: { bg: '#17120a', parts: 2, particles: 22 },
};

/*
 * Panels added to the posters (A18, owner-approved, every fact checked
 * against the page it cites): each carries its sources (`sources`) and is set
 * apart from the printed copy, which is unchanged. Where printed copy needs a
 * word of caution, a small "Did you know?" note (`note`) is set beneath it,
 * with its source; the printed words stay as they are.
 */
const S = {
  gizaFaq: { label: 'Harvard University, Digital Giza, “Frequently Asked Questions”', href: 'https://giza.fas.harvard.edu/faq/' },
  carnegieNile: { label: 'Carnegie Museum of Natural History, “Egypt and the Nile”', href: 'https://carnegiemnh.org/egypt-and-the-nile/' },
  eesPyramids: { label: 'Egypt Exploration Society, “Who built the Egyptian pyramids?”', href: 'https://www.ees.ac.uk/resource/who-built-the-egyptian-pyramids.html' },
  eesChildhood: { label: 'Egypt Exploration Society, “Childhood in Ancient Egypt”', href: 'https://www.ees.ac.uk/resource/childhood-in-ancient-egypt.html' },
  eesCharms: { label: 'Egypt Exploration Society, “Charms of the Nile Valley”', href: 'https://www.ees.ac.uk/resource/charms-of-the-nile-valley.html' },
  bmRosetta: { label: 'British Museum, “Everything you ever wanted to know about the Rosetta Stone”', href: 'https://www.britishmuseum.org/blog/everything-you-ever-wanted-know-about-rosetta-stone' },
  amScribe: { label: 'Australian Museum, “The Scribe and Hieroglyphs”', href: 'https://australian.museum/learn/cultures/international-collection/ancient-egyptian/the-scribe-and-heiroglyphs/' },
  amGods: { label: 'Australian Museum, “Religion and gods in ancient Egypt”', href: 'https://australian.museum/learn/cultures/international-collection/ancient-egyptian/religion-and-gods-in-ancient-egypt/' },
  amMummified: { label: 'Australian Museum, “How were ancient Egyptians mummified?”', href: 'https://australian.museum/learn/cultures/international-collection/ancient-egyptian/how-were-ancient-egyptians-mummified/' },
  amAfterlife: { label: 'Australian Museum, “The underworld and the afterlife in ancient Egypt”', href: 'https://australian.museum/learn/cultures/international-collection/ancient-egyptian/the-underworld-and-the-afterlife-in-ancient-egypt/' },
  carnegieCats: { label: 'Carnegie Museum of Natural History, “Why Were Cats Mummified in Ancient Egypt?”', href: 'https://carnegiemnh.org/why-were-cats-mummified-in-ancient-egypt/' },
} satisfies Record<string, FactSource>;

/** The "Did you know?" note set beneath printed copy on poster 2. */
export const EGYPT_NOTES = {
  horus: {
    text: 'Horus is best known as the falcon-headed sky god and “the embodiment of divine kingship.” War and hunting were more often linked with other gods: Neith, for example, was “a goddess of hunting and warfare.”',
    sources: [S.amGods],
  },
} satisfies Record<string, ApprovedFact>;

export const EGYPT_PROJECTOR_THEME = {
  '--pj-bg': DEEP,
  '--pj-ink': INK,
  '--pj-muted': '#B8B2A9',
  '--pj-accent': ORANGE,
  '--pj-on-accent': WHITE,
  '--pj-display': DISPLAY,
  '--pj-body': BODY,
} as CSSProperties;

export const EGYPT: ExhibitionConfig<'poster1' | 'poster2'> = {
  slug: 'egypt',
  name: 'Ancient Egypt',
  subtitle: 'Guardians of the Afterlife',
  fonts: {
    href: 'https://fonts.googleapis.com/css2?family=Ms+Madi&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Playfair:ital,opsz,wght@0,5..1200,300..600;1,5..1200,300..500&display=swap',
    display: DISPLAY,
    body: BODY,
  },
  palette: {
    page: GROUND,
    heading: ORANGE,
    accent: ORANGE,
    teach: { color: ORANGE, border: 'rgba(240,74,26,0.55)' },
  },
  back: floorReturnFor('egypt'),
  atmospheres: ATMOSPHERES,
  // The doorway opens as a poster opens and at each god's name; every other panel arrives its own way.
  fx: { theme: 'eg', veil: 'chapters', text: 'all' },
  projector: { theme: EGYPT_PROJECTOR_THEME, links: [] },
  cases: [
    {
      href: '/exhibitions/egypt/artifacts/case',
      label: 'Display Case',
      title: 'Artifacts',
    },
  ],
  // The rooms open from the display case (its Interactives). Each card sets a
  // short typographic emblem until it has a picture of the room itself.
  interactives: [
    {
      href: '/exhibitions/egypt/hieroglyph-name',
      emblem: 'Your name',
      label: 'Interactive',
      title: 'Your Name in Hieroglyphs',
      subtitle: 'Write your name in a cartouche, and print it',
    },
    {
      href: '/exhibitions/egypt/rosetta-stone',
      emblem: '196 BC',
      label: 'Interactive',
      title: 'The Rosetta Stone Decoder',
      subtitle: 'Three scripts, and two royal names to crack',
    },
    {
      href: '/exhibitions/egypt/tomb',
      emblem: 'Torchlight',
      label: 'Interactive',
      title: 'Tomb Explorer',
      subtitle: 'Light the painted walls of a dark tomb',
    },
    {
      href: '/exhibitions/egypt/mummification',
      emblem: '70 days',
      label: 'Interactive',
      title: 'Mummification, Step by Step',
      subtitle: 'Natron, canopic jars, linen and amulets',
    },
    {
      href: '/exhibitions/egypt/weighing-of-the-heart',
      emblem: 'Maat',
      label: 'Interactive',
      title: 'The Weighing of the Heart',
      subtitle: 'Help Ani before the judges of the afterlife',
    },
    {
      href: '/exhibitions/egypt/amulet',
      emblem: 'Ankh',
      label: 'Interactive',
      title: 'Design an Amulet',
      subtitle: 'Choose its symbols, learn their meanings, and print it',
    },
  ],
  posters: [
    // ============================================
    // POSTER 1: The Mysteries of Ancient Egypt
    // ============================================
    {
      id: 'poster1',
      title: 'The Mysteries of Ancient Egypt',
      hero: {
        src: '/exhibitions/egypt/poster1.jpg',
        alt: 'The Mysteries of Ancient Egypt poster: three orange dots above the title in white, with Ancient Egypt in orange-red script, a painted coffin face in a thin white arch at the top right, a granite bust of a pharaoh in an arch at the bottom left, and a paragraph of text',
      },
      colors: { bg: GROUND, text: INK, title: WHITE },
      sections: {
        title: { className: 'eg-title eg-arch-right' },
        right: { className: 'eg-arch-right' },
        left: { bg: DEEP, className: 'eg-arch-left' },
      },
      items: [
        {
          type: 'title-image',
          section: 'title',
          atmosphere: 'sand',
          effect: 'rise-expand',
          src: '/exhibitions/egypt/titles/mysteries.webp',
          ...TITLE_SIZES.mysteries,
          framing: 'centered',
          alt: 'The Mysteries of Ancient Egypt',
        },
        { type: 'paragraph', atmosphere: 'nile', effect: 'kenburns-in', section: 'right', position: 'center', figure: RAMESSES, text: 'The civilization of ancient Egypt lasted for over three thousand years and was located in northeastern Africa along the river Nile.' },
        // Added (A18): the Nile.
        { type: 'paragraph', atmosphere: 'nile', effect: 'fade-in', section: 'left', position: 'top-right', text: 'The ancient Egyptians called their country Kemet – "the black land" – after the dark, fertile soil left behind by the Nile\'s floods. The hot, dry desert beyond was Deshret, "the red land."', sources: [S.gizaFaq, S.carnegieNile] },
        { type: 'paragraph', atmosphere: 'nile', effect: 'line-by-line', section: 'right', position: 'bottom-left', text: 'Their year had three seasons: Akhet, when the Nile flooded; Peret, the growing season; and Shemu, the harvest. To keep track of the flood, they built Nilometers to measure how high the river rose each year.', sources: [S.carnegieNile] },

        { type: 'paragraph', atmosphere: 'hieroglyphs', effect: 'ink-spread', section: 'left', position: 'center', text: 'The ancient Egyptians left behind a legacy of impressive monuments, such as pyramids and temples – and invented hieroglyphic writing.' },

        // Added (A18): the pyramids.
        { type: 'section-title', atmosphere: 'sand', effect: 'split-reveal', text: 'Who really built the pyramids?', sources: [S.gizaFaq] },
        { type: 'paragraph', atmosphere: 'sand', effect: 'typewriter', section: 'right', position: 'top-left', text: 'Contrary to popular belief, the pyramids were not built by slaves. Archaeologists have uncovered the town and tombs of the pyramid builders, and they estimate that the workforce was made up of 20,000 to 30,000 Egyptians.', sources: [S.gizaFaq] },
        { type: 'paragraph', atmosphere: 'sand', effect: 'drift', section: 'left', position: 'top-right', text: "Khufu's architect, Hemiunu, led an army of artisans, sculptors, masons and metalworkers, and many of them lived in a settlement built especially for them. Inspectors like a man named Merer kept the project supplied with food and drink rations, tools, clothes, medical treatments and building materials.", sources: [S.eesPyramids] },
        { type: 'paragraph', atmosphere: 'papyrus', effect: 'breathe', section: 'right', position: 'center', lead: 'Fun tidbit:', text: 'Merer kept a diary on papyrus. It was found preserved in caves at Wadi el-Jarf, on the Red Sea coast, in 2013, and it tells us how the pyramids of Giza were supplied with materials.', sources: [S.eesPyramids] },
        { type: 'paragraph', atmosphere: 'gold', effect: 'mega-zoom-out', section: 'left', position: 'bottom-right', lead: 'Fun tidbit:', text: 'At 146 metres (about 480 feet), the Great Pyramid of Khufu was the tallest structure on Earth for nearly 4,000 years, until the spire of Lincoln Cathedral in England passed it in 1311. Yet the only complete statue of Khufu ever found is a tiny ivory figure just 7.5 centimetres (3 inches) tall!', sources: [S.eesPyramids] },
        { type: 'paragraph', atmosphere: 'sand', effect: 'shrink-back', section: 'right', position: 'bottom-left', lead: 'Fun tidbit:', text: 'Egypt is not the only land of pyramids. Sudan, its neighbor to the south, kept building them for much longer and today has even more pyramids than Egypt.', sources: [S.eesPyramids] },
        { type: 'paragraph', atmosphere: 'torchlight', effect: 'rise-expand', section: 'left', position: 'top-right', lead: 'Fun tidbit:', text: 'Egyptian children may have played with toys much like ours: the British Museum has a little wooden horse on wheels, made to be pulled along by a string.', sources: [S.eesChildhood] },

        { type: 'paragraph', atmosphere: 'papyrus', effect: 'blur-to-sharp', section: 'right', position: 'center', text: 'It is thanks to the Rosetta Stone – a broken slab of a decree that was written in three scripts and allowed us to decipher hieroglyphs – that we have so much information about this fascinating, ancient civilization.' },

        // Added (A18): the Rosetta Stone. The British Museum panels (⚑) were read from an archived copy of the Museum's page; confirm them against the live page before publishing.
        { type: 'section-title', atmosphere: 'hieroglyphs', effect: 'kenburns-in', text: 'The Rosetta Stone cracked the code.', sources: [S.bmRosetta] },
        { type: 'paragraph', atmosphere: 'sand', effect: 'fade-in', section: 'right', position: 'top-left', text: 'The story most often told is that French soldiers found the Rosetta Stone in July 1799 while digging foundations for a fort near the town of Rashid, which the French called Rosetta. It had been built into a very old wall.', sources: [S.bmRosetta] },
        { type: 'paragraph', atmosphere: 'hieroglyphs', effect: 'line-by-line', section: 'left', position: 'center', text: 'The same message is carved three times: in hieroglyphs, in Demotic (the everyday Egyptian script) and in Ancient Greek. Because scholars could still read Ancient Greek, the stone became the key to unlocking the hieroglyphs.', sources: [S.bmRosetta] },
        { type: 'paragraph', atmosphere: 'papyrus', effect: 'typewriter', section: 'right', position: 'center', text: "The English scientist Thomas Young showed that some of the signs spelled out the sounds of a king's name, Ptolemy. Then, in 1822, the French scholar Jean-François Champollion announced his great discovery: hieroglyphs recorded the sounds of the Egyptian language.", sources: [S.bmRosetta] },
        { type: 'paragraph', atmosphere: 'sand', effect: 'split-reveal', section: 'left', position: 'top-right', lead: 'Fun tidbit:', text: 'How do you read hieroglyphs? They could be written in rows or in columns, so look at the people and animals: if they face right, you read from right to left.', sources: [S.amScribe] },
        { type: 'paragraph', atmosphere: 'torchlight', effect: 'drift', section: 'right', position: 'bottom-left', lead: 'Fun tidbit:', text: "During the First World War, the British Museum moved the Rosetta Stone to safety. It spent two years in a station of the Post Office's underground railway, 50 feet below the streets of London.", sources: [S.bmRosetta] },

        { type: 'callout', atmosphere: 'gold', effect: 'film-credits', text: "Take a tour of the British Museum's Egyptian collection", url: BM_EGYPT_URL },
        { type: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'The ancient Egyptians left behind monuments and writing that we still study today. What would you want people thousands of years from now to discover about us?',
        'Who really built the pyramids?': 'Building a pyramid took thousands of people working together. What is the biggest thing you have ever made or done with other people, and what made the teamwork easy or hard?',
        'The Rosetta Stone cracked the code.': 'The same message carved in three scripts helped people read hieroglyphs again. If you wanted to leave a message that people could still understand thousands of years from now, how would you do it?',
      },
    },

    // ============================================
    // POSTER 2: Gods and Goddesses of Ancient Egypt
    // ============================================
    {
      id: 'poster2',
      title: 'Gods and Goddesses of Ancient Egypt',
      hero: {
        src: '/exhibitions/egypt/poster2.jpg',
        alt: 'Gods and Goddesses of Ancient Egypt poster: the title in white, with Ancient Egypt in orange-red script, two paragraphs of text, and four framed illustrations of Anubis, Bastet, Horus and Isis, each beside its description and the name in script and in hieroglyphs',
      },
      colors: { bg: GROUND, text: INK, title: ORANGE },
      sections: {
        title: { className: 'eg-title eg-arch-right', title: WHITE },
        right: { className: 'eg-arch-right' },
        left: { bg: DEEP, className: 'eg-arch-left' },
        name: { bg: DEEP, className: 'eg-name' },
        god: { className: 'eg-god' },
      },
      items: [
        {
          type: 'title-image',
          section: 'title',
          atmosphere: 'gold',
          effect: 'kenburns-in',
          src: '/exhibitions/egypt/titles/gods-and-goddesses.webp',
          ...TITLE_SIZES.godsAndGoddesses,
          framing: 'centered',
          alt: 'Gods and Goddesses of Ancient Egypt',
        },
        { type: 'paragraph', atmosphere: 'torchlight', effect: 'blur-to-sharp', section: 'right', position: 'center', text: 'Ancient Egyptian culture was highly ritualized and concentrated much of its attention on birth and death rituals where a rich pantheon of gods controlled much of their world.' },
        { type: 'paragraph', atmosphere: 'torchlight', effect: 'fade-in', section: 'right', position: 'center', text: 'Each of these gods and goddesses had their own role to play in maintaining peace and harmony across the land.' },
        { type: 'paragraph', atmosphere: 'nile', effect: 'line-by-line', section: 'left', position: 'center', text: 'Some gods took part in creation and others brought a flood every year, which was important for growing crops. Some offered protection while others took care of people after they died.' },
        { type: 'paragraph', atmosphere: 'sand', effect: 'split-reveal', section: 'left', position: 'center', text: 'There were local gods who represented towns and minor gods who represented plants or animals. And a few gods were very dangerous!' },
        // Added (A18).
        { type: 'paragraph', atmosphere: 'torchlight', effect: 'mega-zoom-out', section: 'right', position: 'top-left', lead: 'Fun tidbit:', text: 'One of the most dangerous was Sakhmet, a lion-headed goddess of war and destruction. Her name comes from the Egyptian word *sekhem*, meaning "powerful."', sources: [S.amGods] },
        { type: 'paragraph', atmosphere: 'torchlight', effect: 'breathe', section: 'left', position: 'top-right', lead: 'Fun tidbit:', text: 'Not every god was grand. Bes was a popular household god who protected families, and he became the protector god of children.', sources: [S.amGods] },
        { type: 'paragraph', atmosphere: 'papyrus', effect: 'typewriter', section: 'right', position: 'center', text: 'The ancient Egyptians believed that it was important to recognize and worship these gods and goddesses so that life would continue smoothly.', source: { text: 'Adapted from the British Museum’s “Ancient Egyptian gods and goddesses”', href: BM_GODS_URL } },

        { type: 'section-title', atmosphere: 'hieroglyphs', section: 'name', text: 'Anubis' },
        { type: 'paragraph', atmosphere: 'torchlight', effect: 'shrink-back', section: 'god', figure: ANUBIS, text: 'Anubis was the god of mummification, the afterlife and the dead. He is portrayed as a man with the head of a jackal or as a full jackal.' },
        { type: 'paragraph', atmosphere: 'torchlight', effect: 'ink-spread', section: 'right', position: 'center', text: 'Despite his powerful and important role, Anubis was also seen as a gentle and caring god who took great care in ensuring that the dead were treated with respect.' },
        // Added (A18).
        { type: 'paragraph', atmosphere: 'sand', effect: 'drift', section: 'left', position: 'top-right', text: "Anubis was the patron god of embalmers, the people who prepared mummies. The whole process took about 70 days: the body was dried out with a natural salt called natron, but the heart was usually left inside, because it was thought to hold a person's knowledge and feelings.", sources: [S.amGods, S.amMummified] },
        { type: 'paragraph', atmosphere: 'gold', effect: 'rise-expand', section: 'right', position: 'bottom-left', text: 'In the afterlife, the heart was weighed against the feather of Ma\'at, goddess of truth and justice. If the scales balanced, the person could enter the afterlife. Many were buried with a "heart scarab" amulet, carved with a spell to stop the heart from "betraying" its owner!', sources: [S.amAfterlife, S.eesCharms] },

        { type: 'section-title', atmosphere: 'hieroglyphs', section: 'name', text: 'Bastet' },
        { type: 'paragraph', atmosphere: 'gold', effect: 'split-reveal', section: 'god', figure: BASTET, text: 'Bastet was the goddess of cats, fertility (new life) and childbirth, and often associated with joy and dance. She is depicted with the head of a cat and the body of a human.' },
        { type: 'paragraph', atmosphere: 'gold', effect: 'line-by-line', section: 'left', position: 'center', text: 'She was often worshipped by Egyptians, who considered cats to be sacred animals. Her image was used as a symbol of good luck and protection.' },
        // Added (A18).
        { type: 'paragraph', atmosphere: 'sand', effect: 'fade-in', section: 'right', position: 'top-left', text: "Bastet was the gentle counterpart of fierce, lion-headed Sakhmet, and a protector of the home. At her temple in the city of Bubastis, people left mummified cats as offerings to her. Some pet cats were even mummified and placed in their owners' tombs, so that the pair could stay together in the afterlife.", sources: [S.amGods, S.carnegieCats] },

        { type: 'section-title', atmosphere: 'hieroglyphs', section: 'name', text: 'Horus' },
        { type: 'paragraph', atmosphere: 'sand', effect: 'film-credits', section: 'god', figure: HORUS, text: 'Horus was the god of the sky, war and hunting. He was associated with the pharaohs and was often depicted as their protector and defender.', note: EGYPT_NOTES.horus },
        { type: 'paragraph', atmosphere: 'sand', effect: 'typewriter', section: 'right', position: 'center', text: 'Portrayed as a man with the head of a falcon, or just as a falcon, Horus was worshipped throughout Egypt as a just and fair god who protected the people of Egypt and maintained order and balance.' },
        // Added (A18).
        { type: 'paragraph', atmosphere: 'gold', effect: 'blind-spot-reveal', section: 'left', position: 'top-right', text: "Egypt's kings were thought of as Horus on earth. The Eye of Horus, called the *wedjat*, was a powerful symbol of protection and healing, and people wore it as an amulet.", sources: [S.amGods, S.eesCharms] },

        { type: 'section-title', atmosphere: 'hieroglyphs', section: 'name', text: 'Isis' },
        { type: 'paragraph', atmosphere: 'nile', effect: 'waves-drift', section: 'god', figure: ISIS, text: "Isis was the goddess of protection, motherhood and magic. She is depicted as a woman with the hieroglyph for 'throne' worn as a crown and is the mother of Horus." },
        { type: 'paragraph', atmosphere: 'nile', effect: 'blur-to-sharp', section: 'left', position: 'center', text: 'Stories of Isis attributed the cause of the annual Nile floods to her tears as she cried for her dead husband Osiris. Ancient Egyptians believed that she could perform magic and heal the sick.' },
        // Added (A18).
        { type: 'paragraph', atmosphere: 'nile', effect: 'split-reveal', section: 'right', position: 'bottom-left', text: "Isis's husband, Osiris, was god of the underworld and of the yearly Nile flood. Stories said he was killed by his brother Seth and then miraculously brought back to life, so Osiris became a symbol of the hope for eternal life.", sources: [S.amAfterlife] },

        { type: 'callout', atmosphere: 'gold', effect: 'breathe', text: 'Learn more about Egyptian Gods and Goddesses', url: BM_GODS_URL },
        { type: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Each god and goddess had a role to play in keeping peace and harmony. Why do you think people long ago told stories about gods to make sense of the world around them?',
        Anubis: 'Anubis had a powerful role, but he was also seen as gentle and caring. Why might it matter to people that the god who looked after the dead was kind?',
        Bastet: 'Bastet’s image was used as a symbol of good luck and protection. Is there an object or a symbol that makes you feel lucky or safe? What makes it special to you?',
        Horus: 'Horus was seen as a just and fair protector. What do you think makes someone a fair protector of other people?',
        Isis: 'People told a story that the Nile floods came from Isis’s tears. Why do you think people tell stories to explain things that happen in nature?',
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
export const EGYPT_CASE: CasePageData = {
  label: 'Display Case',
  title: 'Artifacts',
  // Photographs to come: the case will be photographed anew.
  photos: [],
  artifacts: [
    {
      id: 'bastet',
      name: 'Replica Bastet statue',
      record: 'Hand-crafted replica Bastet statue, goddess of protection and cats',
      writing: [
        { poster: 'poster2', text: 'Bastet was the goddess of cats, fertility (new life) and childbirth, and often associated with joy and dance. She is depicted with the head of a cat and the body of a human.' },
        { poster: 'poster2', text: 'She was often worshipped by Egyptians, who considered cats to be sacred animals. Her image was used as a symbol of good luck and protection.' },
      ],
    },
    {
      id: 'anubis',
      name: 'Replica Anubis statue',
      record: 'Replica Anubis statue, god of mummification, and a scarab beetle amulet',
      writing: [
        { poster: 'poster2', text: 'Anubis was the god of mummification, the afterlife and the dead. He is portrayed as a man with the head of a jackal or as a full jackal.' },
        { poster: 'poster2', text: 'Despite his powerful and important role, Anubis was also seen as a gentle and caring god who took great care in ensuring that the dead were treated with respect.' },
      ],
    },
    {
      id: 'scarab',
      name: 'Scarab beetle amulet',
      record: 'Replica Anubis statue, god of mummification, and a scarab beetle amulet',
    },
  ],
  display: ['Display panels covering Egyptian pantheon mythology, with QR links to digital collections'],
};
