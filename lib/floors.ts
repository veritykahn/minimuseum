/**
 * The museum's floors: three of exhibitions, arranged by era, and the Studio.
 *
 * Ground Floor (Origins): the deep past up to about 1900, in historical order.
 * First Floor (Horizons): the 20th century.
 * Second Floor (Reflections): identity, words and the mind.
 * Third Floor (Studio): every make-your-own tool in the museum, each a
 * door to the tool where it lives in its exhibition (STUDIO_TOOLS).
 *
 * The order here is the order of the cards on each floor page, so an
 * exhibition's return link (see `floorReturnFor`) always lands on its own card.
 */

import type { HallLight } from './hallLight';

export type FloorExhibition = {
  /** The exhibition's slug: its page is /exhibitions/<slug>. */
  slug: string;
  title: string;
  subtitle: string;
  accent: string;
  darkAccent: string;
  textColor: string;
  description: string;
  /** Built and open; the rest show "Installation in progress". */
  active: boolean;
  /** Its light in the floor's hallway, from its landing page and display case (lib/hallLight.ts). */
  hall: HallLight;
};

/** What every floor page has, exhibitions or tools. */
type FloorBase = {
  /** The floor page's path. */
  path: string;
  /** The page's heading (read by screen readers). */
  heading: string;
  /** The small floor name in the top-right corner, and the back link's label. */
  name: string;
  /** The floor's own name, as the Great Hall lists it: "Origins". */
  title: string;
  /** "G", "1", "2", "3": the number by the stairs in the Great Hall. */
  marker: string;
  /** What the floor holds, under its name. */
  theme: string;
  /** The floor's own color: its theme line and back link on the floor page, and its row in the Great Hall. */
  accent: string;
  /** sessionStorage key holding the card to return to. */
  storageKey: string;
};

export type Floor = FloorBase & { exhibitions: FloorExhibition[] };

/** A make-your-own tool on the Studio floor: a door to it in its exhibition. */
export type StudioTool = {
  /** The tool's name, as its room names it. */
  title: string;
  /** The exhibition it lives in (its slug); the card takes that exhibition's name and accent. */
  exhibition: string;
  /** The tool itself: its room, with the tab's address where it has one. */
  href: string;
  /** What you make, plainly. */
  description: string;
};

export type StudioFloor = FloorBase & { tools: StudioTool[] };

export const GROUND_FLOOR: Floor = {
  path: '/exhibitions/ground-floor',
  heading: 'Ground Floor: Origins',
  name: 'Ground Floor',
  title: 'Origins',
  marker: 'G',
  theme: 'The deep past to 1900',
  accent: '#7D8471', // the Great Hall's sage
  storageKey: 'groundFloorIndex',
  exhibitions: [
    {
      slug: 'moon',
      title: 'Our Incredible Moon',
      subtitle: 'And Beyond',
      accent: '#7B2CBF',
      darkAccent: '#1a0a2e',
      hall: { glow: '#7B2CBF', bloom: '#F28BE8' }, // the poster's violet; its pink
      textColor: '#fff',
      description: 'A journey into planetary science and exoplanet exploration, blending the physics of our nearest neighbor with the search for distant worlds.',
      active: true,
    },
    {
      slug: 'egypt',
      title: 'Ancient Egypt',
      subtitle: 'Guardians of the Afterlife',
      accent: '#E85D04',
      darkAccent: '#1a0d02',
      hall: { glow: '#F04A1A', bloom: '#E85D04' }, // the landing's orange; its ember
      textColor: '#fff',
      description: 'A journey along the Nile, blending ancient mythology, sacred art, and the decipherment of lost scripts.',
      active: true,
    },
    {
      slug: 'in-their-hands',
      title: 'In Their Hands',
      subtitle: 'The Coins of the New Testament',
      accent: '#C9A84C',
      darkAccent: '#1C1409',
      hall: { glow: '#C9A84C', bloom: '#8C5A2B' }, // the coins' gold and bronze
      textColor: '#F5EDD8',
      description: 'Coins minted by the rulers of the New Testament — held by real people, in a real world.',
      active: true,
    },
    {
      slug: 'america-250',
      title: 'America 250',
      subtitle: 'The Declaration of Independence at 250',
      accent: '#B22234',
      darkAccent: '#1a0a0c',
      hall: { glow: '#B22234', bloom: '#56656F' }, // the flag's red; the landing's slate
      textColor: '#fff',
      description: 'A rare, unvarnished look at the birth of a nation, blending historical print culture with the human gamble of 1776.',
      active: true,
    },
    {
      slug: 'victorian',
      title: 'Victorian Britain',
      subtitle: 'Material & Domestic Life',
      accent: '#7D8471',
      darkAccent: '#1a1c18',
      hall: { glow: '#C98A92', bloom: '#4F7A55' }, // the landing's rose and green, deepened to glow
      textColor: '#fff',
      description: 'A journey into the 19th century, blending industrial innovation, decorative arts, and social reform.',
      active: true,
    },
  ],
};

export const FIRST_FLOOR: Floor = {
  path: '/exhibitions/first-floor',
  heading: 'First Floor: Horizons',
  name: 'First Floor',
  title: 'Horizons',
  marker: '1',
  theme: 'The 20th century',
  accent: '#9aa091', // the sage, a shade lighter
  storageKey: 'firstFloorIndex',
  exhibitions: [
    {
      slug: 'great-war',
      title: 'The Great War',
      subtitle: 'When the Guns Fell Silent',
      accent: '#E8372C', // the posters' red for the date and time
      darkAccent: '#1C1C1C',
      hall: { glow: '#E8372C', bloom: '#8B1A12' }, // the posters' red; a poppy's dark heart
      textColor: '#EDE6DA',
      description: 'The Doughboys, the trenches, and the armistice that came at the eleventh hour.',
      active: true,
    },
    {
      slug: 'harlem-renaissance',
      title: 'The Harlem Renaissance',
      subtitle: 'The Great Migration & a Cultural Revolution',
      accent: '#b485d2',
      darkAccent: '#1a0f2a',
      hall: { glow: '#b485d2', bloom: '#d992ba' }, // the landing's violet; its rose
      textColor: '#fff',
      description: 'How over one million Black Americans reshaped culture through literature, art, music, and activism.',
      active: true,
    },
    {
      slug: 'womens-history',
      title: "Women's History Month",
      subtitle: 'Letters From the Blitz',
      accent: '#1D3557',
      darkAccent: '#0a1220',
      hall: { glow: '#D08C8A', bloom: '#22335E' }, // the landing's rose, deepened to glow; its navy
      textColor: '#fff',
      description: 'An intimate look at working-class life, blending personal Blitz-damaged correspondence with digital storytelling.',
      active: true,
    },
    {
      slug: 'holocaust',
      title: 'Holocaust Memorial Day',
      subtitle: 'Never Forget',
      accent: '#78716C',
      darkAccent: '#1c1917',
      hall: { glow: '#78716C', bloom: '#D8D1CA' }, // the landing's stone, dark and light
      textColor: '#fff',
      description: 'A solemn historical encounter, blending authentic wartime artifacts with personal stories of faith and survival.',
      active: true,
    },
  ],
};

export const SECOND_FLOOR: Floor = {
  path: '/exhibitions/second-floor',
  heading: 'Second Floor: Reflections',
  name: 'Second Floor',
  title: 'Reflections',
  marker: '2',
  theme: 'Identity, words & the mind',
  accent: '#93a3b8', // a slate blue, as the floors climb
  storageKey: 'secondFloorIndex',
  exhibitions: [
    {
      slug: 'black-history',
      title: 'Black History Month',
      subtitle: 'Black Barbie & Representation',
      accent: '#EC4899',
      darkAccent: '#2d0a1f',
      hall: { glow: '#EC4899', bloom: '#C5DA3B' }, // the posters' pink; their lime
      textColor: '#fff',
      description: 'A colorful exploration of toy design, cultural identity, and the long struggle for authentic representation in popular culture.',
      active: true,
    },
    {
      slug: 'writing-revolution',
      title: 'The Writing Revolution',
      subtitle: 'From Movable Type to the Digital Age',
      accent: '#5B8DB8',
      darkAccent: '#0c1620',
      hall: { glow: '#5B8DB8', bloom: '#F2634D' }, // the landing's blue; its coral
      textColor: '#fff',
      description: 'A hands-on comparison of communication tools, blending mechanical history with the rise of modern desktop computing.',
      active: true,
    },
    {
      slug: 'seeing-is-deceiving',
      title: 'Seeing is Deceiving',
      subtitle: 'The Science of How We See',
      accent: '#a8d5e5', // light blue from the poster
      darkAccent: '#0a1a1f',
      hall: { glow: '#7CC4DE', bloom: '#00B7C7' }, // the poster's light blue, deepened to glow; the 3D glasses' cyan
      textColor: '#fff',
      description: 'Optical illusions, visual perception, and why your brain lies to you.',
      active: true,
    },
    {
      slug: 'fear-lab',
      title: 'The Fear Lab',
      subtitle: 'Page Turners & Spine Tinglers',
      accent: '#F2B33D', // marigold from the posters (their navy is too dark to read on this floor)
      darkAccent: '#1F3A5F',
      hall: { glow: '#F2B33D', bloom: '#1F3A5F' }, // the posters' marigold; their navy
      textColor: '#FBF6EC',
      description: "The science of being scared and why we just can't put our horror books down.",
      active: true,
    },
  ],
};

/** The floors that hold exhibitions, from the ground up. */
export const FLOORS: Floor[] = [GROUND_FLOOR, FIRST_FLOOR, SECOND_FLOOR];

/**
 * The Studio's tools, in the order of the floors they come from. Each stays
 * in its exhibition's room; the Studio is another door to it.
 */
export const STUDIO_TOOLS: StudioTool[] = [
  {
    title: 'Our Class Declaration',
    exhibition: 'america-250',
    href: '/exhibitions/america-250/sign#class',
    description: 'Fill in your teacher and grade, sign your class’s declaration one after another, and print it.',
  },
  {
    title: 'My Declaration',
    exhibition: 'america-250',
    href: '/exhibitions/america-250/sign#mine',
    description: 'Put your own name to a declaration for the year ahead, sign it at its foot, and print it.',
  },
  {
    title: 'Christmas Card Maker',
    exhibition: 'victorian',
    href: '/exhibitions/victorian/christmas-card',
    description: 'Choose a picture, a border and a paper, write your greeting inside, then print and fold your card.',
  },
  {
    title: 'Remember a Soldier',
    exhibition: 'great-war',
    href: '/exhibitions/great-war/memorial#remember',
    description: 'Draw or find one of the fallen, and keep their memorial card: save it as a picture or print it.',
  },
  {
    title: 'Jazz Studio',
    exhibition: 'harlem-renaissance',
    href: '/exhibitions/harlem-renaissance/jazz-lab#studio',
    description: 'Pick a session, then arrange loops on the timeline to make your own jazz record.',
  },
  {
    title: 'Harlem in Words',
    exhibition: 'harlem-renaissance',
    href: '/exhibitions/harlem-renaissance/harlem-in-words',
    description: 'Compose a poem from the language of the Harlem Renaissance, and hear it read aloud.',
  },
  {
    title: 'Make Your Own Timeline',
    exhibition: 'womens-history',
    href: '/exhibitions/womens-history/violet#make',
    description: 'Set out a timeline, as Violet’s is, for a woman in your own life. Save it or print it.',
  },
  {
    title: 'Design a Doll',
    exhibition: 'black-history',
    href: '/exhibitions/black-history/representation#design',
    description: 'Design a doll that looks like you or someone you love. Save it as a picture or print it.',
  },
  {
    title: 'Who’s in Your Books?',
    exhibition: 'black-history',
    href: '/exhibitions/black-history/representation#books',
    description: 'Count who is in the books around you, as a class.',
  },
  {
    title: 'The Class Board',
    exhibition: 'writing-revolution',
    href: '/exhibitions/writing-revolution/typing-station#board',
    description: 'Type a message on the typewriter or the iMac and post it to your class’s board. Save the board with a class code, or print it.',
  },
];

export const STUDIO: StudioFloor = {
  path: '/exhibitions/third-floor',
  heading: 'Third Floor: Studio',
  name: 'Third Floor',
  title: 'Studio',
  marker: '3',
  theme: 'Make your own',
  accent: '#E0A458', // a workshop's warm brass
  storageKey: 'studioIndex',
  tools: STUDIO_TOOLS,
};

/** The `from` a Studio door adds to its tool's address, so the tool's "M ←" returns to the Studio. */
export const FROM_STUDIO = 'studio';

/** A Studio tool's address as the Studio opens it: `?from=studio`, before any #tab. */
export function studioToolHref(href: string): string {
  const [path, hash] = href.split('#');
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}from=${FROM_STUDIO}${hash !== undefined ? `#${hash}` : ''}`;
}

/** The id of the Great Hall's "Select a Floor" section. */
export const GREAT_HALL_FLOORS_ID = 'floors';

/**
 * Where a floor's "M ← Great Hall" goes: the Great Hall at its stairs, where
 * the visitor chose the floor, without its entrance again.
 */
export const GREAT_HALL_FLOORS = `/greathall#${GREAT_HALL_FLOORS_ID}`;

/** Every floor, from the ground up: the Great Hall lists them top first. */
export const ALL_FLOORS: (Floor | StudioFloor)[] = [...FLOORS, STUDIO];

/** The exhibition on a floor, by slug. */
export function findExhibition(slug: string): FloorExhibition | undefined {
  for (const floor of FLOORS) {
    const e = floor.exhibitions.find((x) => x.slug === slug);
    if (e) return e;
  }
  return undefined;
}

/** An exhibition's page. */
export const exhibitionPath = (slug: string) => `/exhibitions/${slug}`;

/**
 * Where an exhibition's top-left "M ← Floor" link goes: its floor, with the
 * card to scroll back to saved under the floor's sessionStorage key.
 */
export function floorReturnFor(slug: string): { href: string; label: string; remember: { key: string; value: string } } {
  for (const floor of FLOORS) {
    const index = floor.exhibitions.findIndex((e) => e.slug === slug);
    if (index >= 0) {
      return { href: floor.path, label: floor.name, remember: { key: floor.storageKey, value: String(index) } };
    }
  }
  throw new Error(`No floor holds the exhibition "${slug}"`);
}
