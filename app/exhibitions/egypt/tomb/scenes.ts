import type { ApprovedFact, FactSource } from '@/components/exhibition/FactNote';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { met } from '../rooms';

/*
 * The tomb's walls: five paintings from tombs at Thebes, in the copies
 * (most of them full size) The Metropolitan Museum of Art's artists painted in the 1900s,
 * from the Met's Open Access collection (public domain), each linked to its
 * record. The pictures are the Met's own photographs, scaled to 1800 px wide,
 * in public/exhibitions/egypt/tomb/.
 *
 * Each wall hides three details for the torch to find, each with a line on
 * what it tells us. A detail's place is in the picture's own pixels (its
 * natural size, `width` × `height`), checked against the painting itself;
 * the room maps the torch into those pixels through the picture's rendered
 * box (toPicture), so where the torch finds a detail and where its ring is
 * drawn are always the same place, whatever the screen.
 *
 * The wall's note is the Met's own record of the painting: what the scene
 * shows, where it was painted and when. Where the record says only that,
 * the note says only that.
 *
 *   menna-marshes     https://www.metmuseum.org/art/collection/search/548437
 *   menna-harvest     https://www.metmuseum.org/art/collection/search/548574
 *   sennedjem-fields  https://www.metmuseum.org/art/collection/search/548354
 *   sennedjem-cat     https://www.metmuseum.org/art/collection/search/548564
 *   ipuy-wine         https://www.metmuseum.org/art/collection/search/548573
 *
 * The details' lines are new (REVIEW, for the owner): each is from the
 * Met's record of its painting, or from the Met's own book of these copies,
 * Charles K. Wilkinson and Marsha Hill, "Egyptian Wall Paintings: The
 * Metropolitan Museum of Art's Collection of Facsimiles" (1983), free from
 * the Met (MET_FACSIMILES), or, for the cat, from UCL's Digital Egypt and
 * the British Museum's record of the Greenfield Papyrus.
 */

/** The Met's book of its facsimiles (1983), free to read on the Met's site. */
export const MET_FACSIMILES: FactSource = {
  label: 'Wilkinson and Hill, Egyptian Wall Paintings: The Metropolitan Museum of Art’s Collection of Facsimiles (The Met, 1983)',
  href: 'https://www.metmuseum.org/met-publications/egyptian-wall-paintings-the-metropolitan-museum-of-arts-collection-of-facsimiles',
};
const UCL_CAT_RA: FactSource = {
  label: 'UCL, Digital Egypt for Universities, “Cats and Ra”',
  href: 'https://www.ucl.ac.uk/museums-static/digitalegypt/foodproduction/catre.html',
};
const BM_GREENFIELD: FactSource = {
  label: 'British Museum, the Greenfield Papyrus (EA10554,76)',
  href: 'https://www.britishmuseum.org/collection/object/Y_EA10554-76',
};

export type Detail = {
  id: string;
  /** What to search for, as the clue names it: "the crocodile". */
  label: string;
  /** Its centre, in the picture's natural pixels. */
  x: number;
  y: number;
  /** How near the torch must come, in the picture's natural pixels. */
  r: number;
  /** What this detail tells us. */
  tells: ApprovedFact;
};

export type Wall = {
  id: string;
  /** The tab's short name. */
  name: string;
  /** The Met's title for the painting. */
  title: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  details: Detail[];
  note: ApprovedFact;
  credit: { text: string; href: string };
};

const DIR = '/exhibitions/egypt/tomb';

const MARSHES = met(548437, 'Menna and Family Hunting in the Marshes');
const FIELDS = met(548354, 'Sennedjem and Iineferti in the Fields of Iaru');

export const WALLS: Wall[] = [
  {
    id: 'menna-marshes',
    name: 'The marshes',
    title: 'Menna and Family Hunting in the Marshes, Tomb of Menna',
    src: `${DIR}/menna-marshes.jpg`,
    width: 1800,
    height: 991,
    alt: 'A tomb painting: Menna stands twice in a papyrus boat among tall papyrus, on one side raising a throwstick at birds and on the other spearing fish, with his family beside him and water full of fish and birds below',
    details: [
      {
        id: 'crocodile',
        label: 'the crocodile',
        x: 810,
        y: 877,
        r: 120,
        // REVIEW: new text. Met record 548437: "Both the papyrus thicket … and the water beneath his boats are teeming with wildlife, including birds, fish, even a crocodile …" and "By defeating these enemies, Menna was helping to ensure the maintenance of the Egyptian world."
        tells: {
          text: 'The water beneath Menna’s boats teems with wildlife, even a crocodile. By defeating the wild creatures of the marsh, Menna was helping to keep the Egyptian world in order.',
          sources: [MARSHES],
        },
      },
      {
        id: 'cat',
        label: 'the little cat',
        x: 995,
        y: 272,
        r: 85,
        // REVIEW: new text. Met record 548437: "a small cat, the latter of which climbs up a papyrus stalk, hoping to catch one of the migratory birds that flies above." Wilkinson and Hill, p. 58: "little animals climbing the papyrus stalks to steal birds' eggs".
        tells: {
          text: 'A small cat climbs up a papyrus stalk, hoping to catch one of the birds flying above. Painters liked to show little animals climbing the papyrus to steal birds’ eggs.',
          sources: [MARSHES, MET_FACSIMILES],
        },
      },
      {
        id: 'fish',
        label: 'the two big fish',
        x: 940,
        y: 650,
        r: 120,
        // REVIEW: new text. Met record 548437: "he uses a long spear to catch two large fish, most likely Tilapia" … "Tilapia, fish that carry their young in their mouth and thus also were linked with regeneration."
        tells: {
          text: 'With a long spear, Menna catches two large fish, most likely tilapia. Tilapia carry their young in their mouths, so they were linked with new life.',
          sources: [MARSHES],
        },
      },
    ],
    note: {
      text: 'Menna fishes and hunts birds in the papyrus marshes, with his family crowded into his papyrus boat. The marsh teems with birds, fish, a crocodile and a small cat.',
      sources: [MARSHES],
    },
    credit: {
      text: 'Nina de Garis Davies, facsimile, 1924, of a painting in the tomb of Menna (TT 69), Thebes, about 1396–1347 BCE. The Metropolitan Museum of Art, Rogers Fund, 1930. Public domain.',
      href: 'https://www.metmuseum.org/art/collection/search/548437',
    },
  },
  {
    id: 'sennedjem-fields',
    name: 'The fields',
    title: 'Sennedjem and Iineferti in the Fields of Iaru',
    src: `${DIR}/sennedjem-fields.jpg`,
    width: 1800,
    height: 1169,
    alt: 'A tomb painting of fields bordered by blue water: a man and a woman cut grain, pull flax and plough with a pair of spotted cows, beneath a row of seated gods, with rows of date palms and flowers below',
    details: [
      {
        id: 'plough',
        label: 'the plough',
        x: 1080,
        y: 660,
        r: 130,
        // REVIEW: new text. Wilkinson and Hill, p. 62 (fig. 64): "In the paradise of Sennedjem, which is irrigated by canals, the couple plow and sow the fields and harvest flax and wheat."
        tells: {
          text: 'In Sennedjem’s paradise, watered by canals, he and his wife plough and sow the fields, and harvest flax and wheat.',
          sources: [MET_FACSIMILES],
        },
      },
      {
        id: 'harvest',
        label: 'the wheat harvest',
        x: 470,
        y: 455,
        r: 120,
        // REVIEW: new text. Wilkinson and Hill, p. 52: "the plowing and reaping are done not by the peasants for their lord and master but by Sennedjem and his wife".
        tells: {
          text: 'Here in the next world, the reaping is done not by farm workers but by Sennedjem and his wife themselves.',
          sources: [MET_FACSIMILES],
        },
      },
      {
        id: 'orchard',
        label: 'the orchard',
        x: 900,
        y: 830,
        r: 150,
        // REVIEW: new text. Wilkinson and Hill, p. 62 (fig. 64): "The orchard is well stocked, and the garden lush with flowers."
        tells: {
          text: 'The orchard is well stocked, and the garden below it is lush with flowers.',
          sources: [MET_FACSIMILES],
        },
      },
    ],
    note: {
      text: 'In the fields of the next world, Sennedjem and his wife Iineferti harvest grain, sow seeds and pull flax. The scene illustrates spell 110 of the Book of the Dead.',
      sources: [FIELDS],
    },
    credit: {
      text: 'Charles K. Wilkinson, facsimile, 1922, of a painting in the tomb of Sennedjem (TT 1), Deir el-Medina, about 1300–1224 BCE. The Metropolitan Museum of Art, Rogers Fund, 1930. Public domain.',
      href: 'https://www.metmuseum.org/art/collection/search/548354',
    },
  },
  {
    id: 'sennedjem-cat',
    name: 'The cat',
    title: 'Wall painting of a cat killing a serpent',
    src: `${DIR}/sennedjem-cat.jpg`,
    width: 1800,
    height: 1054,
    alt: 'A tomb painting: a spotted cat sits beside a leafy tree, holding a knife against a great blue spotted serpent',
    details: [
      {
        id: 'cat',
        label: 'the cat',
        x: 900,
        y: 520,
        r: 150,
        // REVIEW: new text. Wilkinson and Hill, p. 22 (fig. 16): "This painting of the cat shown as a deity adorns a doorjamb of the subterranean burial chamber in the tomb of Sennedjem."
        tells: {
          text: 'This cat is not a pet: it is shown as a god. It was painted beside a doorway in Sennedjem’s burial chamber, deep underground.',
          sources: [MET_FACSIMILES],
        },
      },
      {
        id: 'serpent',
        label: 'the serpent',
        x: 1500,
        y: 600,
        r: 150,
        // REVIEW: new text. UCL Digital Egypt: "In the Book of the Dead chapter 17 Re appears as the 'big tom cat' who kills the snake of evil next to the persea tree in Heliopolis."
        tells: {
          text: 'In chapter 17 of the Book of the Dead, the sun god Ra appears as a big tomcat who kills the snake of evil.',
          sources: [UCL_CAT_RA, met(548564, 'Wall painting of a cat killing a serpent')],
        },
      },
      {
        id: 'tree',
        label: 'the tree',
        x: 330,
        y: 470,
        r: 150,
        // REVIEW: new text. British Museum EA10554,76: "a cat slaying a snake by a tree". UCL: "next to the persea tree in Heliopolis" (the spell's tree; the painting's own tree is not named).
        tells: {
          text: 'The spell sets the fight beside a tree. Other Books of the Dead show the same scene, a cat slaying a snake by a tree, like the Greenfield Papyrus in the British Museum.',
          sources: [UCL_CAT_RA, BM_GREENFIELD],
        },
      },
    ],
    note: {
      text: 'A cat fights a serpent beside a tree, in the tomb of Sennedjem. The Met links the scene with chapter 17 of the Book of the Dead.',
      sources: [met(548564, 'Wall painting of a cat killing a serpent')],
    },
    credit: {
      text: 'Charles K. Wilkinson, facsimile, 1920–1921, of a painting in the tomb of Sennedjem (TT 1), Deir el-Medina, about 1300–1224 BCE. The Metropolitan Museum of Art, Rogers Fund, 1930. Public domain.',
      href: 'https://www.metmuseum.org/art/collection/search/548564',
    },
  },
  {
    id: 'menna-harvest',
    name: 'The harvest',
    title: 'Harvest Scenes, Tomb of Menna',
    src: `${DIR}/menna-harvest.jpg`,
    width: 1800,
    height: 757,
    alt: 'A tomb painting in two rows: above, men walk through a field of ripe grain holding a long rope; below, a horse and chariot wait while workers heap grain and scribes sit writing',
    details: [
      {
        id: 'chariot',
        label: 'the horses and chariot',
        x: 330,
        y: 560,
        r: 140,
        // REVIEW: new text. Wilkinson and Hill, p. 49 (fig. 46): "At the left Menna's chariot and horses, held by a groom, await his departure."
        tells: {
          text: 'Menna’s chariot and horses, held by a groom, wait for him to leave.',
          sources: [MET_FACSIMILES],
        },
      },
      {
        id: 'rope',
        label: 'the measuring rope',
        x: 560,
        y: 200,
        r: 110,
        // REVIEW: new text. Wilkinson and Hill, p. 49 (fig. 46): "On an estate supervised by Menna, overseer of government lands, two surveyors measure the standing grain with a rope knotted at regular intervals."
        tells: {
          text: 'Two surveyors measure the field of grain with a rope knotted at regular spaces. Menna was in charge of the government’s lands.',
          sources: [MET_FACSIMILES],
        },
      },
      {
        id: 'scribes',
        label: 'the scribes',
        x: 1320,
        y: 500,
        r: 130,
        // REVIEW: new text. Wilkinson and Hill, p. 49 (fig. 46): "eight scribes record the harvest, as laborers measure the grain by bushels. One scribe, sitting on top of a grain pile, counts on his fingers."
        tells: {
          text: 'Scribes write down the harvest as workers measure the grain. One scribe, sitting on top of a pile of grain, counts on his fingers.',
          sources: [MET_FACSIMILES],
        },
      },
    ],
    note: {
      text: 'Harvest scenes from the tomb of Menna at Thebes, painted about 1396–1347 BCE, in the reigns of Thutmose IV to Amenhotep III.',
      sources: [met(548574, 'Harvest Scenes, Tomb of Menna')],
    },
    credit: {
      text: 'Charles K. Wilkinson, facsimile of a painting in the tomb of Menna, Thebes, about 1396–1347 BCE. The Metropolitan Museum of Art, Rogers Fund, 1930. Public domain.',
      href: 'https://www.metmuseum.org/art/collection/search/548574',
    },
  },
  {
    id: 'ipuy-wine',
    name: 'The vineyard',
    title: 'Winemaking, Tomb of Ipuy',
    src: `${DIR}/ipuy-wine.jpg`,
    width: 1800,
    height: 1265,
    alt: 'A tomb painting on a yellow ground: men pick bunches of dark grapes from a leafy vine into baskets, while others, holding ropes, tread grapes in a vat',
    details: [
      {
        id: 'grapes',
        label: 'the bunches of grapes',
        x: 1440,
        y: 570,
        r: 130,
        // REVIEW: new text. Wilkinson and Hill, p. 50 (fig. 47): "This scene shows wine making, from the picking of grapes to the sealing of wine jars."
        tells: {
          text: 'This wall shows wine being made, from picking the grapes to sealing the wine in jars.',
          sources: [MET_FACSIMILES],
        },
      },
      {
        id: 'treaders',
        label: 'the grape treaders',
        x: 420,
        y: 800,
        r: 150,
        // REVIEW: new text. Wilkinson and Hill, p. 50: "Grapes are grown in well-ordered vineyards, picked, trodden, and wine stored in jars."
        tells: {
          text: 'Grapes were grown in well-ordered vineyards, picked, and trodden underfoot, and the wine was stored in jars.',
          sources: [MET_FACSIMILES],
        },
      },
      {
        id: 'vine',
        label: 'the vine leaves',
        x: 1280,
        y: 420,
        r: 150,
        // REVIEW: new text. Wilkinson and Hill, p. 50 (fig. 47): "Vineyards were usually depicted with grayish backgrounds until the Ramesside period, when yellow was used with pleasing results."
        tells: {
          text: 'Vineyards were usually painted on a grey background, until the time of the kings called Ramesses, when painters began to use yellow, like this.',
          sources: [MET_FACSIMILES],
        },
      },
    ],
    note: {
      text: 'Winemaking, from the tomb of Ipuy at Deir el-Medina, painted in the reign of Ramesses II, about 1290–1224 BCE.',
      sources: [met(548573, 'Winemaking, Tomb of Ipuy')],
    },
    credit: {
      text: 'Charles K. Wilkinson, facsimile of a painting in the tomb of Ipuy (TT 217), Deir el-Medina, about 1290–1224 BCE. The Metropolitan Museum of Art, Rogers Fund, 1930. Public domain.',
      href: 'https://www.metmuseum.org/art/collection/search/548573',
    },
  },
];

/** A picture's rendered box on the screen, in client pixels. */
export type Box = { left: number; top: number; width: number; height: number };

/**
 * Where a picture of natural size w × h is actually drawn inside an element's
 * box, for object-fit `contain` (letterboxed) or `cover` (cropped): the box
 * the picture's own pixels occupy, which may be larger or smaller than the
 * element.
 */
export function renderedBox(el: Box, w: number, h: number, fit: 'contain' | 'cover' = 'contain'): Box {
  const scale = fit === 'contain' ? Math.min(el.width / w, el.height / h) : Math.max(el.width / w, el.height / h);
  const width = w * scale;
  const height = h * scale;
  return { left: el.left + (el.width - width) / 2, top: el.top + (el.height - height) / 2, width, height };
}

/** A point on the screen, in the picture's natural pixels (through its rendered box). */
export function toPicture(clientX: number, clientY: number, box: Box, w: number, h: number) {
  return { x: ((clientX - box.left) / box.width) * w, y: ((clientY - box.top) / box.height) * h };
}

/** A point in the picture's natural pixels, back on the screen. */
export function toScreen(x: number, y: number, box: Box, w: number, h: number) {
  return { x: box.left + (x / w) * box.width, y: box.top + (y / h) * box.height };
}

/** The detail the torch's centre is on (in the picture's natural pixels), if any. */
export function detailAt<T extends { x: number; y: number; r: number }>(details: readonly T[], x: number, y: number): T | undefined {
  return details.find((d) => Math.hypot(x - d.x, y - d.y) <= d.r);
}

export const TOMB_NOTES = {
  copies: {
    text: 'These walls are copies: paintings in tempera on paper, most of them full size, made in the 1900s by artists working for The Met, of paintings in tombs at Thebes.',
    sources: [met(548437, 'Menna and Family Hunting in the Marshes'), met(548354, 'Sennedjem and Iineferti in the Fields of Iaru')],
  },
} satisfies Record<string, ApprovedFact>;

/** The tomb's Sources drawer: each wall's picture credit and the sources of its notes. */
export function tombSources(chamber: readonly { label: string; tells?: ApprovedFact }[]): SourceGroup[] {
  const uniq = (list: FactSource[]) => [...new Map(list.map((s) => [s.href, s])).values()];
  return [
    {
      title: 'The burial chamber',
      items: [
        { label: 'The chamber is drawn for the Mini Museum.', note: 'Picture' },
        ...uniq(chamber.flatMap((c) => c.tells?.sources ?? [])),
      ],
    },
    ...WALLS.map((w) => ({
      title: w.title,
      items: [
        { label: w.title, href: w.credit.href, note: 'Picture', licence: w.credit.text },
        ...uniq([...w.note.sources, ...w.details.flatMap((d) => d.tells.sources)]),
      ],
    })),
    { title: 'About these copies', items: [...TOMB_NOTES.copies.sources] },
  ];
}
