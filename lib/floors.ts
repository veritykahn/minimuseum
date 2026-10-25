/**
 * The museum's two exhibition floors, arranged by theme.
 *
 * Ground Floor (Origins): the deep past up to about 1900, in historical order.
 * First Floor (Horizons): the 20th century and the mind.
 *
 * The order here is the order of the cards on each floor page, so an
 * exhibition's return link (see `floorReturnFor`) always lands on its own card.
 */

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
};

export type Floor = {
  /** The floor page's path. */
  path: string;
  /** The page's heading (read by screen readers). */
  heading: string;
  /** The small floor name in the top-right corner, and the back link's label. */
  name: string;
  /** What the floor holds, under its name. */
  theme: string;
  /** sessionStorage key holding the card to return to. */
  storageKey: string;
  exhibitions: FloorExhibition[];
};

export const GROUND_FLOOR: Floor = {
  path: '/exhibitions/ground-floor',
  heading: 'Ground Floor: Origins',
  name: 'Ground Floor',
  theme: 'The deep past to 1900',
  storageKey: 'groundFloorIndex',
  exhibitions: [
    {
      slug: 'moon',
      title: 'Our Incredible Moon',
      subtitle: 'And Beyond',
      accent: '#7B2CBF',
      darkAccent: '#1a0a2e',
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
  theme: 'The 20th century and the mind',
  storageKey: 'firstFloorIndex',
  exhibitions: [
    {
      slug: 'great-war',
      title: 'The Great War',
      subtitle: 'When the Guns Fell Silent',
      accent: '#E8372C', // the posters' red for the date and time
      darkAccent: '#1C1C1C',
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
      textColor: '#fff',
      description: 'An intimate look at working-class life, blending personal Blitz-damaged correspondence with digital storytelling.',
      active: false,
    },
    {
      slug: 'holocaust',
      title: 'Holocaust Memorial Day',
      subtitle: 'Never Forget',
      accent: '#78716C',
      darkAccent: '#1c1917',
      textColor: '#fff',
      description: 'A solemn historical encounter, blending authentic wartime artifacts with personal stories of faith and survival.',
      active: false,
    },
    {
      slug: 'black-history',
      title: 'Black History Month',
      subtitle: 'Black Barbie & Representation',
      accent: '#EC4899',
      darkAccent: '#2d0a1f',
      textColor: '#fff',
      description: 'A colorful exploration of toy design, cultural identity, and the long struggle for authentic representation in popular culture.',
      active: false,
    },
    {
      slug: 'writing-revolution',
      title: 'The Writing Revolution',
      subtitle: 'From Movable Type to the Digital Age',
      accent: '#5B8DB8',
      darkAccent: '#0c1620',
      textColor: '#fff',
      description: 'A hands-on comparison of communication tools, blending mechanical history with the rise of modern desktop computing.',
      active: false,
    },
    {
      slug: 'seeing-is-deceiving',
      title: 'Seeing is Deceiving',
      subtitle: 'The Science of How We See',
      accent: '#a8d5e5', // light blue from the poster
      darkAccent: '#0a1a1f',
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
      textColor: '#FBF6EC',
      description: "The science of being scared and why we just can't put our horror books down.",
      active: true,
    },
  ],
};

export const FLOORS: Floor[] = [GROUND_FLOOR, FIRST_FLOOR];

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
