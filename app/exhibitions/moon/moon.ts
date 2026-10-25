import type { CSSProperties } from 'react';
import type { CasePageData, ExhibitionConfig } from '@/components/exhibition/types';
import { floorReturnFor } from '@/lib/floors';

/*
 * Our Incredible Moon: every word on screen, and the look.
 *
 * The poster copy is set exactly as printed on the two posters, with only the
 * owner's approved fixes:
 *   - poster 1: the sentences about the Moon as a shield are replaced with
 *     "Additionally, the Moon's cratered face is a record of …";
 *   - poster 2: "over 6,000 exoplanets" (was 5,500), and "hundreds of
 *     thousands of years to reach it" (was thousands);
 *   - the QR codes are links to the Natural History Museum, London;
 *   - typesetting only: the stray spaces before three periods on poster 1
 *     are gone.
 * Each sentence lives in one place below, so a fix to the posters is a
 * one-line edit here. Where a poster paragraph runs across several panels it
 * is split only between sentences; nothing is reworded.
 *
 * Poster 1 sets its copy in capitals. Here it is stored in sentence case (the
 * same words) and the stylesheet sets it in capitals, so a screen reader reads
 * words rather than letters.
 *
 * The pictures in the walkthrough (the rising moon, the ringed planet, the
 * alien landscape with three moons) are cut from the posters themselves.
 *
 * The "Talk about it" questions are for the projector's teacher strip: open
 * discussion questions, one per chapter, keyed by the section title exactly
 * as it is set (OPENING, '', is the panels before the first section title;
 * neither poster has section titles). They make no factual claims.
 */

// The posters' palette: a violet-to-indigo night, a lavender moon, white type,
// and poster 2's pink and aqua.
const NIGHT = '#2A2245';
const DUSK = '#3B2C68';
const WHITE = '#FFFFFF';
const INK = '#F3F0FA';
const LAVENDER = '#B9A6E6';
/* Poster 2's pink: 6.8:1 on NIGHT and 5.5:1 on DUSK, so it serves small text too. */
const PINK = '#F28BE8';

/* "Our Incredible": a thin, segmented, futuristic face. */
const THIN = "'Turret Road', 'Eurostile', system-ui, sans-serif";
/* Copy: a light geometric sans, as on both posters. */
const BODY = "'Jost', 'Futura', system-ui, sans-serif";

export const NHM_MOON_URL = 'https://www.nhm.ac.uk/discover/factfile-the-moon.html';
export const NHM_SPACE_URL = 'https://www.nhm.ac.uk/discover/space.html';

/** The link callout that takes the place of each poster's QR code. */
export const NHM_CALLOUT = 'Explore more at the Natural History Museum, London';

export const MOON_PROJECTOR_THEME = {
  '--pj-bg': NIGHT,
  '--pj-ink': INK,
  '--pj-muted': '#C9C0E3',
  '--pj-accent': LAVENDER,
  '--pj-on-accent': NIGHT,
  '--pj-display': THIN,
  '--pj-body': BODY,
} as CSSProperties;

export const MOON: ExhibitionConfig<'poster1' | 'poster2'> = {
  slug: 'moon',
  name: 'Our Incredible Moon',
  subtitle: 'And Beyond',
  fonts: {
    href: 'https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300;0,400;0,500;1,300&family=League+Spartan:wght@700;800&family=Silkscreen&family=Turret+Road:wght@200;300;400&display=swap',
    display: THIN,
    body: BODY,
  },
  palette: {
    page: NIGHT,
    heading: WHITE,
    accent: LAVENDER,
    teach: { color: LAVENDER, border: 'rgba(185,166,230,0.55)' },
  },
  back: floorReturnFor('moon'),
  fx: { theme: 'mo', veil: 'every-panel', text: 'all' },
  projector: { theme: MOON_PROJECTOR_THEME, links: [] },
  cases: [
    {
      href: '/exhibitions/moon/artifacts/case',
      label: 'Display Case',
      title: 'Artifacts',
    },
  ],
  posters: [
    // ============================================
    // POSTER 1: Our Incredible Moon
    // ============================================
    {
      id: 'poster1',
      title: 'Our Incredible Moon',
      hero: {
        src: '/exhibitions/moon/poster1.jpg',
        alt: 'Our Incredible Moon poster: the title in white over a night sky, Moon in huge heavy letters above a large lavender moon rising, and three blocks of text in spaced capitals',
      },
      colors: { bg: NIGHT, text: INK, title: WHITE },
      sections: {
        title: { className: 'mo-title' },
        caps: { className: 'mo-caps' },
        link: { className: 'mo-link' },
      },
      items: [
        {
          type: 'title-text',
          section: 'title',
          kicker: 'Our Incredible',
          text: 'Moon',
          decor: { src: '/exhibitions/moon/moonrise.jpg', placement: 'bottom-left', motion: 'rise', width: '100%' },
        },
        { type: 'paragraph', section: 'caps', text: "The Moon is more than just a glowing ball in the night sky—it plays a crucial role in supporting life on Earth. Its gravity helps control our planet's tides, which are essential for marine life and coastal ecosystems." },
        { type: 'paragraph', section: 'caps', text: "The Moon also helps stabilize Earth's tilt, which affects our climate and seasons. Without the Moon, Earth's axis might wobble more, leading to extreme weather changes." },
        { type: 'paragraph', section: 'caps', text: "Additionally, the Moon's cratered face is a record of the space rocks that have struck our corner of the solar system for billions of years." },

        { type: 'paragraph', section: 'caps', text: "In 1969, humans achieved the remarkable feat of landing on the Moon during NASA's Apollo 11 mission. Some people have questioned whether the Moon landings were real, but there's strong evidence proving this happened." },
        { type: 'paragraph', section: 'caps', text: "For example, the astronauts brought back Moon rocks that are very different from any rocks found on Earth. These rocks have unique features that couldn't be faked or created on our planet." },
        { type: 'paragraph', section: 'caps', text: 'Additionally, the missions were tracked by scientists around the world. All this evidence confirms that humans truly did land on the Moon in 1969.' },

        { type: 'paragraph', section: 'caps', text: 'Our Moon is fascinating to study. Its surface alone, which is covered in a layer of fine dust called lunar regolith, provides huge contrasts to our own Earth.' },
        { type: 'paragraph', section: 'caps', text: "Unlike Earth's soil, which is shaped by wind, water, and living things, lunar dust is formed over billions of years through meteorite impacts. This makes the dust particles sharp and jagged, and they can stick to everything because of static electricity." },
        { type: 'paragraph', section: 'caps', text: "Astronauts who walked on the Moon said the dust smelled like gunpowder and was hard to clean off their suits. These differences between Moon dust and Earth's soil help scientists learn more about the Moon's history and why it's such a unique place in our solar system." },

        { type: 'callout', section: 'link', text: NHM_CALLOUT, url: NHM_MOON_URL },
        { type: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Some people have questioned whether the Moon landings were real. When you hear a surprising claim, what kinds of evidence would help you decide whether to believe it?',
      },
    },

    // ============================================
    // POSTER 2: Another Earth
    // ============================================
    {
      id: 'poster2',
      title: 'Another Earth',
      hero: {
        src: '/exhibitions/moon/poster2.jpg',
        alt: 'Another Earth poster: the title in tall blocky letters, pink above and white below, beside three paragraphs of text, with cartoon planets and a nebula above an alien landscape of purple cliffs, a teal river and three moons',
      },
      // The title's first line is pink, its second white (moon.css), as on the poster.
      colors: { bg: DUSK, text: INK, title: PINK },
      sections: {
        title: { className: 'mo-earth' },
        right: { className: 'mo-right' },
        link: { className: 'mo-link' },
      },
      items: [
        {
          type: 'title-text',
          section: 'title',
          kicker: 'Another',
          text: 'Earth',
          decor: { src: '/exhibitions/moon/ringed-planet.jpg', placement: 'top-left', motion: 'none', width: 'min(26vw, 250px)' },
        },
        { type: 'paragraph', section: 'right', text: 'For centuries, humans have wondered if there are other planets like Earth in the universe. This curiosity led to the discovery of exoplanets—planets outside our solar system.' },
        { type: 'paragraph', section: 'right', text: 'In 1992, astronomers found the first exoplanets orbiting a pulsar, a type of neutron star. Then, in 1995, scientists discovered 51 Pegasi b, the first exoplanet orbiting a star similar to our Sun.' },
        { type: 'paragraph', section: 'right', text: 'Since then, over 6,000 exoplanets have been confirmed, including HD 20794 d, a "super-Earth" located about 20 light-years away in the constellation Eridanus. This planet is roughly six times the mass of Earth and orbits within its star\'s habitable zone, where temperatures could allow liquid water to exist.' },
        { type: 'paragraph', section: 'right', text: 'The discovery of HD 20794 d raises hopes of finding alien life, as scientists continue to explore exoplanets that might host life forms.' },

        { type: 'paragraph', section: 'right', text: "But if the universe is so vast and full of stars, why haven't we found aliens yet? This question is known as the Fermi Paradox." },
        { type: 'paragraph', section: 'right', text: 'One idea, called the "Dark Forest" theory, suggests that intelligent civilizations stay silent to avoid attracting attention, fearing that other civilizations might be dangerous. Another possibility is that life is rare or doesn\'t last long, making it hard for civilizations to find each other before disappearing.' },
        { type: 'paragraph', section: 'right', text: 'There\'s also the "Great Filter" theory, which suggests that advanced civilizations might destroy themselves before they can develop the technology needed for interstellar travel or communication. This could happen through wars, environmental disasters, or other self-inflicted problems.' },

        { type: 'paragraph', section: 'right', text: 'Even once we find a planet like HD 20794 d, traveling there would be extremely difficult. The planet is 20 light-years away, and with current technology, it would take hundreds of thousands of years to reach it.' },
        { type: 'paragraph', section: 'right', text: 'Space travelers would face dangers like harmful radiation and collisions with space dust. Making such a planet habitable would also be challenging, as it might lack the right atmosphere or have extreme temperatures.' },
        { type: 'paragraph', section: 'right', text: 'Another concern is the possibility of encountering alien microbes. Scientists warn that our immune systems might struggle to detect and respond to germs originating from other planets, posing significant health risks to humans and other mammals.' },
        {
          type: 'paragraph',
          section: 'right',
          className: 'mo-landscape',
          text: 'While the search for alien life is thrilling, it reminds us how special and unique our own Earth is.',
          decor: { src: '/exhibitions/moon/three-moons.jpg', placement: 'bottom-left', motion: 'rise', width: '100%' },
        },

        { type: 'callout', section: 'link', text: NHM_CALLOUT, url: NHM_SPACE_URL },
        { type: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'If scientists found a planet very like Earth, would you want people to try to travel there one day? What would you want to know before deciding?',
      },
    },
  ],
};

/*
 * The display case page (artifacts/case). The artifacts are listed exactly as
 * the Mini Museum record lists them.
 */
export const MOON_CASE: CasePageData = {
  label: 'Display Case',
  title: 'Artifacts',
  // Photographs to come: the case will be photographed anew.
  photos: [],
  artifacts: [
    'Genuine lunar meteorite, Adrar 013 sample',
    'Laboratory microscopes with comparative global sand and geology specimens',
    'Display posters detailing lunar formation, regolith chemistry, exoplanet orbital mechanics, and astrobiology',
  ],
};
