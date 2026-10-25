import type { CSSProperties } from 'react';
import type { CasePageData, ExhibitionConfig, PanelFigure } from '@/components/exhibition/types';
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
  fx: { theme: 'eg', veil: 'chapters', text: 'all' },
  projector: { theme: EGYPT_PROJECTOR_THEME, links: [] },
  cases: [
    {
      href: '/exhibitions/egypt/artifacts/case',
      label: 'Display Case',
      title: 'Artifacts',
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
        { type: 'title-text', section: 'title', kicker: 'The Mysteries of', text: 'Ancient Egypt' },
        { type: 'paragraph', section: 'right', position: 'center', figure: RAMESSES, text: 'The civilization of ancient Egypt lasted for over three thousand years and was located in northeastern Africa along the river Nile.' },
        { type: 'paragraph', section: 'left', position: 'center', text: 'The ancient Egyptians left behind a legacy of impressive monuments, such as pyramids and temples – and invented hieroglyphic writing.' },
        { type: 'paragraph', section: 'right', position: 'center', text: 'It is thanks to the Rosetta Stone – a broken slab of a decree that was written in three scripts and allowed us to decipher hieroglyphs – that we have so much information about this fascinating, ancient civilization.' },

        { type: 'callout', text: "Take a tour of the British Museum's Egyptian collection", url: BM_EGYPT_URL },
        { type: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'The ancient Egyptians left behind monuments and writing that we still study today. What would you want people thousands of years from now to discover about us?',
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
        { type: 'title-text', section: 'title', kicker: 'Gods and Goddesses of', text: 'Ancient Egypt' },
        { type: 'paragraph', section: 'right', position: 'center', text: 'Ancient Egyptian culture was highly ritualized and concentrated much of its attention on birth and death rituals where a rich pantheon of gods controlled much of their world.' },
        { type: 'paragraph', section: 'right', position: 'center', text: 'Each of these gods and goddesses had their own role to play in maintaining peace and harmony across the land.' },
        { type: 'paragraph', section: 'left', position: 'center', text: 'Some gods took part in creation and others brought a flood every year, which was important for growing crops. Some offered protection while others took care of people after they died.' },
        { type: 'paragraph', section: 'left', position: 'center', text: 'There were local gods who represented towns and minor gods who represented plants or animals. And a few gods were very dangerous!' },
        { type: 'paragraph', section: 'right', position: 'center', text: 'The ancient Egyptians believed that it was important to recognize and worship these gods and goddesses so that life would continue smoothly.', source: { text: 'Adapted from the British Museum’s “Ancient Egyptian gods and goddesses”', href: BM_GODS_URL } },

        { type: 'section-title', section: 'name', text: 'Anubis' },
        { type: 'paragraph', section: 'god', figure: ANUBIS, text: 'Anubis was the god of mummification, the afterlife and the dead. He is portrayed as a man with the head of a jackal or as a full jackal.' },
        { type: 'paragraph', section: 'right', position: 'center', text: 'Despite his powerful and important role, Anubis was also seen as a gentle and caring god who took great care in ensuring that the dead were treated with respect.' },

        { type: 'section-title', section: 'name', text: 'Bastet' },
        { type: 'paragraph', section: 'god', figure: BASTET, text: 'Bastet was the goddess of cats, fertility (new life) and childbirth, and often associated with joy and dance. She is depicted with the head of a cat and the body of a human.' },
        { type: 'paragraph', section: 'left', position: 'center', text: 'She was often worshipped by Egyptians, who considered cats to be sacred animals. Her image was used as a symbol of good luck and protection.' },

        { type: 'section-title', section: 'name', text: 'Horus' },
        { type: 'paragraph', section: 'god', figure: HORUS, text: 'Horus was the god of the sky, war and hunting. He was associated with the pharaohs and was often depicted as their protector and defender.' },
        { type: 'paragraph', section: 'right', position: 'center', text: 'Portrayed as a man with the head of a falcon, or just as a falcon, Horus was worshipped throughout Egypt as a just and fair god who protected the people of Egypt and maintained order and balance.' },

        { type: 'section-title', section: 'name', text: 'Isis' },
        { type: 'paragraph', section: 'god', figure: ISIS, text: "Isis was the goddess of protection, motherhood and magic. She is depicted as a woman with the hieroglyph for 'throne' worn as a crown and is the mother of Horus." },
        { type: 'paragraph', section: 'left', position: 'center', text: 'Stories of Isis attributed the cause of the annual Nile floods to her tears as she cried for her dead husband Osiris. Ancient Egyptians believed that she could perform magic and heal the sick.' },

        { type: 'callout', text: 'Learn more about Egyptian Gods and Goddesses', url: BM_GODS_URL },
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
 * The display case page (artifacts/case). The artifacts are listed exactly as
 * the Mini Museum record lists them.
 */
export const EGYPT_CASE: CasePageData = {
  label: 'Display Case',
  title: 'Artifacts',
  // Photographs to come: the case will be photographed anew.
  photos: [],
  artifacts: [
    'Hand-crafted replica Bastet statue, goddess of protection and cats',
    'Replica Anubis statue, god of mummification, and a scarab beetle amulet',
    'Display panels covering Egyptian pantheon mythology, with QR links to digital collections',
  ],
};
