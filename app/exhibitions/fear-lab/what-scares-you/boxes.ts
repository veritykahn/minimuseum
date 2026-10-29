import type { ApprovedFact } from '@/components/exhibition/FactNote';
import type { Creature } from './sound';

/*
 * What is in the fear boxes: six creatures, the poster's pinecone, and
 * nothing at all. Each creature is a real photograph from Wikimedia Commons,
 * cut out from its background and saved as WebP in
 * public/exhibitions/fear-lab/creatures/ (the rat's lower edge, grass in the
 * original, fades out). Each is credited with its title, author and licence.
 *
 * Each creature has one creepy fact from outside the posters, checked
 * against the source named with it (a university extension service, the
 * National Park Service, National Geographic, the Australian Museum) and
 * kept to what that page says. They are set apart from the poster's words as
 * museum notes, with their sources.
 */

export type Credit = { title: string; author: string; licence: string; licenceHref?: string; href: string };

export type Content =
  | { kind: 'creature'; id: Creature; name: string; src: string; width: number; height: number; alt: string; fact: ApprovedFact; credit: Credit }
  | { kind: 'pinecone' }
  | { kind: 'nothing' };

const DIR = '/exhibitions/fear-lab/creatures';
const CC_BY_SA_4 = 'https://creativecommons.org/licenses/by-sa/4.0/';

export const CREATURES: Extract<Content, { kind: 'creature' }>[] = [
  {
    kind: 'creature',
    id: 'cockroach',
    name: 'A cockroach!',
    src: `${DIR}/cockroach.webp`,
    width: 786,
    height: 800,
    alt: 'An American cockroach, shiny red-brown, with long feelers',
    fact: {
      text: 'An adult American cockroach can survive two or three months without food, but only about a month without water.',
      sources: [{ label: 'Penn State Extension', href: 'https://extension.psu.edu/american-cockroaches' }],
    },
    credit: {
      title: 'Periplaneta americana - American cockroach (25859665686) (cropped)',
      author: 'Insects Unlocked',
      licence: 'CC0',
      licenceHref: 'https://creativecommons.org/publicdomain/zero/1.0/',
      href: 'https://commons.wikimedia.org/wiki/File:Periplaneta_americana_-_American_cockroach_(25859665686)_(cropped).jpg',
    },
  },
  {
    kind: 'creature',
    id: 'tarantula',
    name: 'A tarantula!',
    src: `${DIR}/tarantula.webp`,
    width: 800,
    height: 639,
    alt: 'A hairy black-and-gold tarantula, legs spread, facing you',
    fact: {
      text: 'A tarantula’s main defense is to fling barbed hairs from its belly at an attacker with its back legs. Its venom is considered non-toxic to humans.',
      sources: [{ label: 'National Park Service', href: 'https://www.nps.gov/zion/learn/nature/tarantulas.htm' }],
    },
    credit: {
      title: 'Grammostola pulchripes sur fond noir',
      author: 'Gean cartier',
      licence: 'CC BY-SA 4.0',
      licenceHref: CC_BY_SA_4,
      href: 'https://commons.wikimedia.org/wiki/File:Grammostola_pulchripes_sur_fond_noir.jpg',
    },
  },
  {
    kind: 'creature',
    id: 'bat',
    name: 'A bat!',
    src: `${DIR}/bat.webp`,
    width: 707,
    height: 800,
    alt: 'A flying fox, a large bat, with leathery brown wings spread wide',
    fact: {
      text: 'Bats are the only mammals capable of true flight, and a bat’s wing resembles a modified human hand.',
      sources: [{ label: 'National Park Service', href: 'https://www.nps.gov/subjects/bats/how-bats-fly.htm' }],
    },
    credit: {
      title: 'Flying-Fox-Bat',
      author: 'Hasitha Tudugalle; derivative by MathKnight',
      licence: 'CC BY 4.0',
      licenceHref: 'https://creativecommons.org/licenses/by/4.0/',
      href: 'https://commons.wikimedia.org/wiki/File:Flying-Fox-Bat.jpg',
    },
  },
  {
    kind: 'creature',
    id: 'snake',
    name: 'A snake!',
    src: `${DIR}/snake.webp`,
    width: 800,
    height: 591,
    alt: 'A coiled brown rat snake, its head raised, looking at you',
    fact: {
      text: 'Snakes hunt by flicking their forked tongues in different directions to smell their surroundings.',
      sources: [{ label: 'National Geographic', href: 'https://www.nationalgeographic.com/animals/reptiles/facts/snakes-1' }],
    },
    credit: {
      title: 'Elaphe climacophora.IMG 6423',
      author: 'Yasunori Koide',
      licence: 'CC BY-SA 4.0',
      licenceHref: CC_BY_SA_4,
      href: 'https://commons.wikimedia.org/wiki/File:Elaphe_climacophora.IMG_6423.jpg',
    },
  },
  {
    kind: 'creature',
    id: 'rat',
    name: 'A rat!',
    src: `${DIR}/rat.webp`,
    width: 800,
    height: 643,
    alt: 'A gray brown rat, face on, whiskers wide',
    fact: {
      text: 'A rat can squeeze through a hole no bigger than its head. Its teeth grow continuously, so it must gnaw on things to keep them trimmed.',
      sources: [{ label: 'National Geographic', href: 'https://www.nationalgeographic.com/animals/mammals/facts/rats' }],
    },
    credit: {
      title: 'Rattus norvegicus - Brown rat 03',
      author: 'Zeynel Cebeci',
      licence: 'CC BY-SA 4.0',
      licenceHref: CC_BY_SA_4,
      href: 'https://commons.wikimedia.org/wiki/File:Rattus_norvegicus_-_Brown_rat_03.jpg',
    },
  },
  {
    kind: 'creature',
    id: 'centipede',
    name: 'A centipede!',
    src: `${DIR}/centipede.webp`,
    width: 800,
    height: 320,
    alt: 'A long dark centipede with rows of yellow legs',
    fact: {
      text: 'A centipede has 15 to 191 pairs of legs, always an odd number, one pair per body segment.',
      sources: [{ label: 'Australian Museum', href: 'https://australian.museum/learn/species-identification/ask-an-expert/what-do-centipedes-look-like/' }],
    },
    credit: {
      title: 'Scolopendra dehaani Vietnam ベトナムオオムカデ M イエローレッグ AD W',
      author: 'Gaison64',
      licence: 'CC BY-SA 4.0',
      licenceHref: CC_BY_SA_4,
      href: 'https://commons.wikimedia.org/wiki/File:Scolopendra_dehaani_Vietnam_%E3%83%99%E3%83%88%E3%83%8A%E3%83%A0%E3%82%AA%E3%82%AA%E3%83%A0%E3%82%AB%E3%83%87_M_%E3%82%A4%E3%82%A8%E3%83%AD%E3%83%BC%E3%83%AC%E3%83%83%E3%82%B0_AD_W.jpg',
    },
  },
];

/** Every box's possible contents: the six creatures, the pinecone, and nothing. */
export const CONTENTS: Content[] = [...CREATURES, { kind: 'pinecone' }, { kind: 'nothing' }];

export const BOX_COUNT = 5;

/**
 * A fresh row of boxes: five of the eight contents, in a random order. At
 * least one box holds nothing or the pinecone, so not every box bites.
 */
export function fillBoxes(rand: () => number = Math.random): Content[] {
  const deck = [...CONTENTS];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  const row: Content[] = deck.slice(0, BOX_COUNT);
  if (!row.some((c) => c.kind !== 'creature')) row[Math.floor(rand() * BOX_COUNT)] = deck.find((c) => c.kind !== 'creature')!;
  return row;
}
