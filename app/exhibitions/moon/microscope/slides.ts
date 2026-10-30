import type { ApprovedFact } from '@/components/exhibition/FactNote';

/*
 * The slides on the stage: real photographs of real samples down a
 * microscope, three of Moon soil and one of Earth's sand for each of the
 * poster's three words (Wikimedia Commons, NASA). Each is a square crop of
 * the original, in public/exhibitions/moon/microscope/.
 *
 * The Moon's three are all lunar soil (regolith), checked against their
 * records: a mixed handful of far-side soil from Chang'e 6, and two views of
 * the Apollo 17 "orange soil" (sample 74220), its glass beads in reflected
 * light and its finest orange glass with light shone through. (An earlier
 * slide, NASA S70-20418, was an electron-microscope picture of one pit in one
 * glass grain: a real lunar sample, but not soil, so it was replaced.)
 *
 * Each slide's caption says what the photograph shows, in the words of its
 * own record (NASA's caption, the paper, or the photographer's description
 * on its Commons page), and is set as a museum note with that record as its
 * source. The credit names the photograph, its author and its licence.
 *
 * Originals:
 *   moon-soil          Li et al. 2024, Natl Sci Rev 11:nwae328, fig. 2d, https://commons.wikimedia.org/wiki/File:Chang%27e-6_lunar_regolith_under_stereomicroscope.jpg (805 × 788), centre square, 788 px
 *   moon-beads         NASA S73-15083, https://commons.wikimedia.org/wiki/File:S73-15083.jpg (6576 × 8204), centre square, 2000 px
 *   moon-orange-glass  NASA S73-15171, https://images.nasa.gov/details/S73-15171 (6176 × 8204), centre square, 2000 px
 *   earth-wind        https://commons.wikimedia.org/wiki/File:Sand_from_Gobi_Desert.jpg (2001 × 2001), whole
 *   earth-water        https://commons.wikimedia.org/wiki/File:Sand_grains_from_river.jpg (7276 × 4525), centre square
 *   earth-life         https://commons.wikimedia.org/wiki/File:00290_IMG_6291_037_Bermuda_coral_sand_32_mm.jpg (4272 × 2848), centre square
 */

export type MoonSlide = 'soil' | 'beads' | 'glass';
export type EarthSample = 'wind' | 'water' | 'life';
export type SlideId = `moon-${MoonSlide}` | `earth-${EarthSample}`;

export type Credit = {
  /** The photograph's title, as on its source page. */
  title: string;
  author: string;
  licence: string;
  /** The licence's deed, when it has one. */
  licenceHref?: string;
  /** The photograph's own page. */
  href: string;
};

export type Slide = {
  id: SlideId;
  /** The jar's label in the tray: for Earth, the poster's word for what shaped it. */
  label: string;
  /** The sample's name, from its record: the description's heading. */
  name: string;
  src: string;
  /** What the photograph shows, for a screen reader. */
  alt: string;
  caption: ApprovedFact;
  credit: Credit;
};

const DIR = '/exhibitions/moon/microscope';
const CC_BY_4 = 'https://creativecommons.org/licenses/by/4.0/';
const CC_BY_SA_3 ='https://creativecommons.org/licenses/by-sa/3.0/';
const CC_BY_SA_4 = 'https://creativecommons.org/licenses/by-sa/4.0/';

export const MOON_SLIDES: (Slide & { id: `moon-${MoonSlide}`; key: MoonSlide })[] = [
  {
    id: 'moon-soil',
    key: 'soil',
    label: 'Soil',
    name: 'Far-side Moon soil',
    src: `${DIR}/moon-soil.jpg`,
    alt: 'A photomicrograph of lunar soil from Chang’e 6: gray and brown broken grains of many sizes, some clear, some dark and clumped',
    caption: {
      text: 'Lunar soil from the far side of the Moon, enlarged under a microscope. China’s Chang’e 6 mission collected it in 2024: the first samples ever brought back from the far side.',
      sources: [
        { label: 'Li et al., National Science Review (2024)', href: 'https://doi.org/10.1093/nsr/nwae328' },
        { label: 'Wikimedia Commons', href: 'https://commons.wikimedia.org/wiki/File:Chang%27e-6_lunar_regolith_under_stereomicroscope.jpg' },
      ],
    },
    credit: {
      title: 'Chang’e-6 lunar regolith under stereomicroscope',
      author: 'Chunlai Li, Hao Hu, Meng-Fei Yang et al.',
      licence: 'CC BY 4.0',
      licenceHref: CC_BY_4,
      href: 'https://commons.wikimedia.org/wiki/File:Chang%27e-6_lunar_regolith_under_stereomicroscope.jpg',
    },
  },
  {
    id: 'moon-beads',
    key: 'beads',
    label: 'Glass beads',
    name: 'Apollo 17 glass beads',
    src: `${DIR}/moon-beads.jpg`,
    alt: 'A NASA photomicrograph of Apollo 17 soil: dark glassy beads and broken fragments on a pale slide',
    caption: {
      text: 'Spheres and fragments in the “orange” soil from Apollo 17, magnified 31.5 times. These grains are 150 to 250 microns across: fine sand.',
      sources: [{ label: 'NASA, photo S73-15083', href: 'https://commons.wikimedia.org/wiki/File:S73-15083.jpg' }],
    },
    credit: { title: 'S73-15083', author: 'NASA', licence: 'Public domain', href: 'https://commons.wikimedia.org/wiki/File:S73-15083.jpg' },
  },
  {
    id: 'moon-glass',
    key: 'glass',
    label: 'Orange glass',
    name: 'Apollo 17 orange glass',
    src: `${DIR}/moon-orange-glass.jpg`,
    alt: 'A NASA photomicrograph of Apollo 17 orange soil: orange glass spheres and fragments mixed with black grains',
    caption: {
      text: 'Orange glass spheres and fragments from Apollo 17, magnified 160 times: the finest particles ever brought back from the Moon, 20 to 45 microns across.',
      sources: [{ label: 'NASA, photo S73-15171', href: 'https://images.nasa.gov/details/S73-15171' }],
    },
    credit: { title: 'S73-15171', author: 'NASA', licence: 'Public domain', href: 'https://images.nasa.gov/details/S73-15171' },
  },
];

export const EARTH_SLIDES: (Slide & { id: `earth-${EarthSample}`; key: EarthSample })[] = [
  {
    id: 'earth-wind',
    key: 'wind',
    label: 'Wind',
    name: 'Gobi Desert sand',
    src: `${DIR}/earth-wind.jpg`,
    alt: 'A photomicrograph of desert sand: small, rounded grains, clear, cream, orange and dark',
    caption: {
      text: 'Rounded, fine-grained wind-blown sand from the Gobi Desert in Mongolia. The view is 10 mm wide.',
      sources: [{ label: 'Siim Sepp, Wikimedia Commons', href: 'https://commons.wikimedia.org/wiki/File:Sand_from_Gobi_Desert.jpg' }],
    },
    credit: {
      title: 'Sand from Gobi Desert',
      author: 'Siim Sepp',
      licence: 'CC BY-SA 3.0',
      licenceHref: CC_BY_SA_3,
      href: 'https://commons.wikimedia.org/wiki/File:Sand_from_Gobi_Desert.jpg',
    },
  },
  {
    id: 'earth-water',
    key: 'water',
    label: 'Water',
    name: 'Vistula River sand',
    src: `${DIR}/earth-water.jpg`,
    alt: 'A close photograph of river sand: clear, glassy, smooth-edged grains with a few dark and pink ones',
    caption: {
      text: 'Grains of sand from the Vistula River in Warsaw, Poland.',
      sources: [{ label: 'Krzem Anonim, Wikimedia Commons', href: 'https://commons.wikimedia.org/wiki/File:Sand_grains_from_river.jpg' }],
    },
    credit: {
      title: 'Sand grains from river',
      author: 'Krzem Anonim',
      licence: 'CC BY-SA 4.0',
      licenceHref: CC_BY_SA_4,
      href: 'https://commons.wikimedia.org/wiki/File:Sand_grains_from_river.jpg',
    },
  },
  {
    id: 'earth-life',
    key: 'life',
    label: 'Living things',
    name: 'Bermuda coral sand',
    src: `${DIR}/earth-life.jpg`,
    alt: 'A photomicrograph of coral sand: cream and white pieces of coral and shell with pink speckled grains',
    caption: {
      text: 'Coral sand from Bermuda, with pieces of coral and mollusc shells, and pink foraminifera, which give Bermuda’s beaches their pink color.',
      sources: [{ label: 'Siim Sepp, Wikimedia Commons', href: 'https://commons.wikimedia.org/wiki/File:00290_IMG_6291_037_Bermuda_coral_sand_32_mm.jpg' }],
    },
    credit: {
      title: '00290 IMG 6291 037 Bermuda coral sand 32 mm',
      author: 'Siim Sepp (Sandatlas)',
      licence: 'CC BY-SA 3.0',
      licenceHref: CC_BY_SA_3,
      href: 'https://commons.wikimedia.org/wiki/File:00290_IMG_6291_037_Bermuda_coral_sand_32_mm.jpg',
    },
  },
];

export const SLIDES = Object.fromEntries([...MOON_SLIDES, ...EARTH_SLIDES].map((s) => [s.id, s])) as unknown as Record<SlideId, Slide>;

/** Is this slide the Moon's (or Earth's)? */
export const isMoon = (slide: Slide) => slide.id.startsWith('moon-');
