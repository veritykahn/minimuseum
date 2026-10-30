/**
 * Every photogrammetry model on the site, with the still photograph shown in
 * its place when the 3D viewer cannot run (no WebGL, the model fails to load,
 * the viewer throws). Kept apart from the viewers so a page can name its
 * still without pulling in three.js.
 *
 * The stills are renders of the same scans, saved as webp.
 */
export type ModelStill = {
  model: string;
  still: string;
  alt: string;
  title: string;
  date: string;
  backHref: string;
  backLabel: string;
};

export const MODEL_STILLS = {
  phonograph: {
    model: '/exhibitions/harlem/artifacts/phonograph.glb',
    still: '/exhibitions/harlem/artifacts/phonograph-still.webp',
    alt: 'Portable electric phonograph in a dark leather-covered case, lid open, with a Columbia 78 rpm record on the turntable',
    title: 'Electric Phonograph & Bessie Smith 78 RPM',
    date: 'c. 1924–1930s',
    backHref: '/exhibitions/harlem-renaissance/artifacts',
    backLabel: 'Back to the collection',
  },
  'fire-in-the-flint': {
    model: '/exhibitions/harlem/artifacts/flint.glb',
    still: '/exhibitions/harlem/artifacts/flint-still.webp',
    alt: 'The Fire in the Flint by Walter F. White, red cloth binding with an orange Art Deco border and title',
    title: 'The Fire in the Flint',
    date: '1924',
    backHref: '/exhibitions/harlem-renaissance/artifacts',
    backLabel: 'Back to the collection',
  },
  stereoscope: {
    model: '/exhibitions/seeing/artifacts/stereoscope.glb',
    still: '/exhibitions/seeing/artifacts/stereoscope-still.webp',
    alt: 'Wooden hand-held stereoscope with a hooded eyepiece, sliding card holder and turned handle',
    title: 'Monarch Stereoscope',
    date: '1904',
    backHref: '/exhibitions/seeing-is-deceiving/artifacts',
    backLabel: 'Back to the collection',
  },
  'stereoscope-cards': {
    model: '/exhibitions/seeing/artifacts/stereoscope-card.glb',
    still: '/exhibitions/seeing/artifacts/stereoscope-card-still.webp',
    alt: 'Stereoscope card on a stand: two nearly identical photographs of the village of Dalen beside Lake Bandaksvand, Norway',
    title: 'The Village of Dalen, Lake Bandaksvand',
    date: '1906',
    backHref: '/exhibitions/seeing-is-deceiving/artifacts',
    backLabel: 'Back to the collection',
  },
  'victorian-cards': {
    model: '/exhibitions/seeing/artifacts/victorian-cards.glb',
    still: '/exhibitions/seeing/artifacts/victorian-cards-still.webp',
    alt: 'Victorian optical illusion puzzle card titled Fish & Fishermann, on a clear stand',
    title: 'Victorian Optical Illusion Puzzle Cards',
    date: 'c.1890-1900',
    backHref: '/exhibitions/seeing-is-deceiving/artifacts',
    backLabel: 'Back to the collection',
  },
} satisfies Record<string, ModelStill>;

export type ModelId = keyof typeof MODEL_STILLS;
