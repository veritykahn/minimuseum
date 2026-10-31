import type { ApprovedFact } from '@/components/exhibition/FactNote';
import { met } from '../rooms';

/*
 * The tomb's walls: five paintings from tombs at Thebes, in the copies
 * (most of them full size) The Metropolitan Museum of Art's artists painted in the 1900s,
 * from the Met's Open Access collection (public domain), each linked to its
 * record. The pictures are the Met's own photographs, scaled to 1800 px wide,
 * in public/exhibitions/egypt/tomb/.
 *
 * Each wall hides one detail for the torch to find. Its note is the Met's
 * own record of the painting: what the scene shows, where it was painted
 * and when. Where the record says only that, the note says only that.
 *
 *   menna-marshes     https://www.metmuseum.org/art/collection/search/548437
 *   menna-harvest     https://www.metmuseum.org/art/collection/search/548574
 *   sennedjem-fields  https://www.metmuseum.org/art/collection/search/548354
 *   sennedjem-cat     https://www.metmuseum.org/art/collection/search/548564
 *   ipuy-wine         https://www.metmuseum.org/art/collection/search/548573
 */

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
  /** The detail the torch is searching for: where it is, as a share of the picture, and what to call it. */
  find: { x: number; y: number; label: string };
  note: ApprovedFact;
  credit: { text: string; href: string };
};

const DIR = '/exhibitions/egypt/tomb';

export const WALLS: Wall[] = [
  {
    id: 'menna-marshes',
    name: 'The marshes',
    title: 'Menna and Family Hunting in the Marshes, Tomb of Menna',
    src: `${DIR}/menna-marshes.jpg`,
    width: 1800,
    height: 991,
    alt: 'A tomb painting: Menna stands twice in a papyrus boat among tall papyrus, on one side raising a throwstick at birds and on the other spearing fish, with his family beside him and water full of fish and birds below',
    find: { x: 0.45, y: 0.88, label: 'the crocodile' },
    note: {
      text: 'Menna fishes and hunts birds in the papyrus marshes, with his family crowded into his papyrus boat. The marsh teems with birds, fish, a crocodile and a small cat.',
      sources: [met(548437, 'Menna and Family Hunting in the Marshes')],
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
    find: { x: 0.6, y: 0.56, label: 'the ploughing cows' },
    note: {
      text: 'In the fields of the next world, Sennedjem and his wife Iineferti harvest grain, sow seeds and pull flax. The scene illustrates spell 110 of the Book of the Dead.',
      sources: [met(548354, 'Sennedjem and Iineferti in the Fields of Iaru')],
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
    find: { x: 0.54, y: 0.42, label: 'the cat' },
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
    find: { x: 0.15, y: 0.72, label: 'the horse and chariot' },
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
    find: { x: 0.8, y: 0.45, label: 'the bunches of grapes' },
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

/** How near the torch's centre must come to a hidden detail to find it, as a share of the picture's width. */
export const FIND_RADIUS = 0.11;

export function nearDetail(wall: Wall, x: number, y: number, aspect = wall.width / wall.height): boolean {
  const dx = x - wall.find.x;
  const dy = (y - wall.find.y) / aspect;
  return Math.hypot(dx, dy) <= FIND_RADIUS;
}

export const TOMB_NOTES = {
  copies: {
    text: 'These walls are copies: paintings in tempera on paper, most of them full size, made in the 1900s by artists working for The Met, of paintings in tombs at Thebes.',
    sources: [met(548437, 'Menna and Family Hunting in the Marshes'), met(548354, 'Sennedjem and Iineferti in the Fields of Iaru')],
  },
} satisfies Record<string, ApprovedFact>;
