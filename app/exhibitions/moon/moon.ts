import type { CSSProperties } from 'react';
import type { ApprovedFact, FactSource } from '@/components/exhibition/FactNote';
import type { Atmosphere, CasePageData, ExhibitionConfig } from '@/components/exhibition/types';
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
 * Poster 1's title is cut with the moon it rises over, since the lettering
 * melts into the moon there.
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

/*
 * The posters' titles as pictures: their own lettering, cut from the posters
 * at the posters' 1728px exports with the night sky keyed out
 * (public/exhibitions/moon/titles/). A sharper export of the same lettering
 * can replace a file at the same path; update its size here when it does.
 */
/** Cut from the poster's 1728px export: 1728 of its pixels to every 1050 of the served poster's. */
const TITLE_DENSITY = 1728 / 1050;
const TITLE_SIZES = {
  ourIncredibleMoon: { width: 1567, height: 1032, density: TITLE_DENSITY },
  anotherEarth: { width: 719, height: 885, density: TITLE_DENSITY },
};

/*
 * The walkthrough's atmospheres (moon.css draws them), each the setting of a
 * part of the story:
 *   moon-tides         the Moon and the Earth: a swell rising and falling under a path of moonlight
 *   meteor-shower      space rocks: streaks across the sky, and the dust a traveler would meet
 *   apollo-tracking    Apollo 11: a tracking scope sweeping, the flight path from Earth to the Moon
 *   lunar-dust         the regolith: a gray horizon, fine dust lifting and glinting
 *   exoplanet-transit  the search for exoplanets: a far star dimming as its planet crosses it
 *   dark-forest-sky    the Fermi Paradox: a black sky whose distant lights go quiet one by one
 */
const ATMOSPHERES: Record<string, Atmosphere> = {
  'moon-tides': { bg: '#1d1838', parts: 4, particles: 26 },
  'meteor-shower': { bg: '#151127', parts: 1, particles: 22 },
  'apollo-tracking': { bg: '#0f1a22', parts: 4, particles: 6 },
  'lunar-dust': { bg: '#26232f', parts: 2, particles: 48 },
  'exoplanet-transit': { bg: '#271c49', parts: 4, particles: 18 },
  'dark-forest-sky': { bg: '#0b0916', parts: 1, particles: 30 },
};

/*
 * Poster 1's paragraph on the regolith, sentence by sentence: the walkthrough,
 * the display case and the microscope (microscope/) all set it from here.
 */
export const REGOLITH = {
  study: 'Our Moon is fascinating to study.',
  surface: 'Its surface alone, which is covered in a layer of fine dust called lunar regolith, provides huge contrasts to our own Earth.',
  unlike: "Unlike Earth's soil, which is shaped by wind, water, and living things, lunar dust is formed over billions of years through meteorite impacts.",
  jagged: 'This makes the dust particles sharp and jagged, and they can stick to everything because of static electricity.',
  gunpowder: 'Astronauts who walked on the Moon said the dust smelled like gunpowder and was hard to clean off their suits.',
  differences: "These differences between Moon dust and Earth's soil help scientists learn more about the Moon's history and why it's such a unique place in our solar system.",
};

/*
 * The microscope's two notes from outside the posters: owner-approved and
 * fact-checked, each set with its source (NASA; Washington University in
 * St. Louis), apart from the poster's words. Not used on the display case,
 * whose writing is the posters' sentences only.
 */
export const MICROSCOPE_NOTES = {
  dust: {
    text: 'Moon dust is made of rock chips, mineral fragments and glass, with agglutinates: bits of minerals glued together with glass.',
    sources: [{ label: 'NASA', href: 'https://science.nasa.gov/moon/composition/' }],
  },
  adrar: {
    text: 'Adrar 013 is a lunar meteorite weighing 3,150 grams in all, purchased in Adrar, Algeria, in 2023.',
    sources: [{ label: 'Washington University in St. Louis', href: 'https://sites.wustl.edu/meteoritesite/?p=16700' }],
  },
} satisfies Record<string, ApprovedFact>;

/*
 * Panels added to the posters (A18, owner-approved, every fact checked
 * against the page it cites): each carries its sources (`sources`) and is set
 * apart from the printed copy, which is unchanged. Where printed copy needs a
 * word of caution, a small "Did you know?" note (`note`) is set beneath it,
 * with its source; the printed words stay as they are.
 */
const S = {
  formation: { label: 'NASA Science, “Moon Formation”', href: 'https://science.nasa.gov/moon/formation/' },
  facts: { label: 'NASA Science, “Moon Facts”', href: 'https://science.nasa.gov/moon/facts/' },
  laser: { label: 'NASA JPL, “The Apollo Experiment That Keeps on Giving”', href: 'https://www.jpl.nasa.gov/news/the-apollo-experiment-that-keeps-on-giving/' },
  phases: { label: 'NASA Science, “Moon Phases”', href: 'https://science.nasa.gov/moon/moon-phases/' },
  apollo11: { label: 'NASA, “Apollo 11”', href: 'https://www.nasa.gov/mission/apollo-11/' },
  apollo30: { label: 'NASA NSSDCA, “30th anniversary of Apollo 11”', href: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_11_30th.html' },
  curation: { label: 'NASA JSC Astromaterials, “Lunar Rocks and Soils from Apollo Missions”', href: 'https://curator.jsc.nasa.gov/lunar/' },
  exploration: { label: 'NASA Science, “Moon Exploration”', href: 'https://science.nasa.gov/moon/exploration/' },
  lro10: { label: 'NASA, “10 Years Ago: Lunar Reconnaissance Orbiter Begins Mission to Map the Moon”', href: 'https://www.nasa.gov/history/10-years-ago-lunar-reconnaissance-orbiter-begins-mission-to-map-the-moon/' },
  lroCool: { label: 'NASA Science, “10 Cool Things NASA’s LRO is Teaching Us”', href: 'https://science.nasa.gov/solar-system/moon/10-cool-things-nasas-lunar-reconnaissance-orbiter-is-teaching-us-about-the-moon/' },
  artemis2: { label: 'NASA, “Artemis II”', href: 'https://www.nasa.gov/mission/artemis-ii/' },
  howWeFind: { label: 'NASA Science, “How We Find and Characterize”', href: 'https://science.nasa.gov/exoplanets/how-we-find-and-characterize/' },
  kepler: { label: 'NASA, “NASA Retires Kepler Space Telescope, Passes Planet-Hunting Torch”', href: 'https://www.nasa.gov/news-release/nasa-retires-kepler-space-telescope-passes-planet-hunting-torch/' },
  oxford: { label: 'Oxford University Physics, “Researchers confirm the existence of an exoplanet in the habitable zone”', href: 'https://www.physics.ox.ac.uk/news/researchers-confirm-existence-exoplanet-habitable-zone' },
  iac: { label: 'Instituto de Astrofísica de Canarias: Nari et al. 2025, Astronomy & Astrophysics 693, A297', href: 'https://iac.es/en/science-and-technology/publications/revisiting-multi-planetary-system-nearby-star-hd-20794-confirmation-low-mass-planet' },
  proxima: { label: 'NASA Science, “Exoplanet Travel Bureau: Proxima Centauri b”', href: 'https://science.nasa.gov/exoplanets/immersive/exoplanet-travel-bureau/proxima-centauri-b/' },
  exoplanets: { label: 'NASA Science, “Exoplanets”', href: 'https://science.nasa.gov/exoplanets/' },
  webb: { label: 'NASA Science, “NASA’s Webb Detects Carbon Dioxide in Exoplanet Atmosphere”', href: 'https://science.nasa.gov/missions/webb/nasas-webb-detects-carbon-dioxide-in-exoplanet-atmosphere/' },
  homeAlone: { label: 'NASA Science, “Among Trillions of Planets, Are We ‘Home Alone?’”', href: 'https://science.nasa.gov/universe/exoplanets/among-trillions-of-planets-are-we-home-alone/' },
  jones: { label: 'Eric M. Jones, “Where is everybody?” An account of Fermi’s question (Los Alamos, 1985)', href: 'https://www.osti.gov/biblio/5746675' },
  voyager: { label: 'NASA Science, “Voyager 1: What Is a Light-Day?”', href: 'https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/' },
  planetaryProtection: { label: 'NASA Office of Safety and Mission Assurance, “Planetary Protection”', href: 'https://sma.nasa.gov/sma-disciplines/planetary-protection' },
  darkForestUT: { label: 'Universe Today, “Beyond Fermi’s Paradox XVI: What is the Dark Forest Hypothesis?”', href: 'https://www.universetoday.com/articles/beyond-fermis-paradox-xvi-what-is-the-dark-forest-hypothesis' },
  darkForestWarwick: { label: 'University of Warwick, Cosmic Stories: “The Dark Forest”', href: 'https://warwick.ac.uk/cosmicstories/the_dark_forest' },
} satisfies Record<string, FactSource>;

/** The "Did you know?" notes set beneath printed copy on poster 2. */
export const MOON_NOTES = {
  orbit: {
    text: 'HD 20794 d’s orbit is not a circle but a stretched oval, so the planet does not stay inside the habitable zone: over its year it moves between the zone’s outer and inner edges.',
    sources: [S.oxford],
  },
  darkForest: {
    text: 'The “Dark Forest” idea takes its name from a science-fiction novel, The Dark Forest, by the Chinese writer Liu Cixin. It is one proposed answer to the Fermi Paradox: an untested hypothesis, not a scientific theory backed by evidence.',
    sources: [S.darkForestUT, S.darkForestWarwick],
  },
  germs: {
    text: 'Scientists have not yet found any life beyond Earth, germs included. To be safe, NASA practices “planetary protection”: keeping Earth’s microbes off other worlds, and protecting Earth “from possible life forms that may be returned” from them.',
    sources: [S.planetaryProtection],
  },
} satisfies Record<string, ApprovedFact>;

export const NHM_MOON_URL ='https://www.nhm.ac.uk/discover/factfile-the-moon.html';
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
    href: 'https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300;0,400;0,500;1,300&family=League+Spartan:wght@700;800&family=Turret+Road:wght@200;300;400&display=swap',
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
  atmospheres: ATMOSPHERES,
  // The moonrise opens each poster; after that every panel arrives its own way.
  fx: { theme: 'mo', veil: 'first', text: 'all' },
  projector: {
    theme: MOON_PROJECTOR_THEME,
    links: [{ label: "Under the Microscope: Moon dust beside Earth's soil", href: '/exhibitions/moon/microscope' }],
  },
  cases: [
    {
      href: '/exhibitions/moon/artifacts/case',
      label: 'Display Case',
      title: 'Artifacts',
    },
  ],
  // Each room's card shows the room itself: a screenshot of it (public/exhibitions/<slug>/rooms/).
  interactives: [
    {
      href: '/exhibitions/moon/microscope',
      image: { src: '/exhibitions/moon/rooms/microscope.webp', alt: 'The Under the Microscope room: moon dust in the round microscope view, beside its notes' },
      label: 'Interactive',
      title: 'Under the Microscope',
      subtitle: "Moon dust beside Earth's soil",
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
          type: 'title-image',
          section: 'title',
          atmosphere: 'moon-tides',
          effect: 'rise-expand',
          src: '/exhibitions/moon/titles/our-incredible-moon.webp',
          ...TITLE_SIZES.ourIncredibleMoon,
          framing: 'centered',
          alt: 'Our Incredible Moon',
        },
        { type: 'paragraph', section: 'caps', atmosphere: 'moon-tides', effect: 'waves-drift', text: "The Moon is more than just a glowing ball in the night sky—it plays a crucial role in supporting life on Earth. Its gravity helps control our planet's tides, which are essential for marine life and coastal ecosystems." },
        { type: 'paragraph', section: 'caps', atmosphere: 'moon-tides', effect: 'drift', text: "The Moon also helps stabilize Earth's tilt, which affects our climate and seasons. Without the Moon, Earth's axis might wobble more, leading to extreme weather changes." },
        { type: 'paragraph', section: 'caps', atmosphere: 'meteor-shower', effect: 'mega-zoom-out', text: "Additionally, the Moon's cratered face is a record of the space rocks that have struck our corner of the solar system for billions of years." },

        // Added (A18): where the Moon came from.
        { type: 'section-title', atmosphere: 'meteor-shower', effect: 'split-reveal', text: 'The Moon was probably born in a giant crash.', sources: [S.formation] },
        { type: 'paragraph', section: 'caps', position: 'top-left', atmosphere: 'meteor-shower', effect: 'fade-in', text: 'Scientists think an object about the size of Mars, nicknamed Theia, slammed into the young Earth about 4.5 billion years ago. The debris from that collision came together to form our Moon.', sources: [S.formation, S.facts] },
        { type: 'paragraph', section: 'caps', position: 'bottom-right', atmosphere: 'moon-tides', effect: 'rise-expand', lead: 'Fun tidbit:', text: 'The Moon is about 238,855 miles (384,400 kilometers) away, and it is slowly drifting farther from us, by about 1.5 inches (3.8 centimeters) every year.', sources: [S.facts, S.laser] },
        { type: 'paragraph', section: 'caps', position: 'top-left', atmosphere: 'moon-tides', effect: 'kenburns-in', lead: 'Fun tidbit:', text: 'We always see the same side of the Moon, because it spins exactly once each time it circles Earth. The far side is not a "dark side," though: it gets just as much sunlight. We simply never see it from here.', sources: [S.phases] },

        { type: 'paragraph', section: 'caps', atmosphere: 'apollo-tracking', effect: 'typewriter', text: "In 1969, humans achieved the remarkable feat of landing on the Moon during NASA's Apollo 11 mission. Some people have questioned whether the Moon landings were real, but there's strong evidence proving this happened." },

        // Added (A18): the landing.
        { type: 'section-title', atmosphere: 'apollo-tracking', effect: 'film-credits', text: 'July 20, 1969: "The Eagle has landed."', sources: [S.apollo11] },
        { type: 'paragraph', section: 'caps', position: 'bottom-left', atmosphere: 'apollo-tracking', effect: 'ink-spread', text: 'Neil Armstrong and Buzz Aldrin landed in the Sea of Tranquility while Michael Collins circled the Moon in the command module. Armstrong\'s famous words were, "That\'s one small step for [a] man, one giant leap for mankind."', sources: [S.apollo11, S.apollo30] },

        { type: 'paragraph', section: 'caps', atmosphere: 'lunar-dust', effect: 'blur-to-sharp', text: "For example, the astronauts brought back Moon rocks that are very different from any rocks found on Earth. These rocks have unique features that couldn't be faked or created on our planet." },
        { type: 'paragraph', section: 'caps', position: 'top-left', atmosphere: 'lunar-dust', effect: 'breathe', text: 'Between 1969 and 1972, six Apollo missions brought back 842 pounds (382 kilograms) of Moon rocks, pebbles, sand, and dust: 2,200 separate samples in all. Twelve astronauts walked on the Moon.', sources: [S.curation, S.exploration] },
        { type: 'paragraph', section: 'caps', atmosphere: 'apollo-tracking', effect: 'line-by-line', text: 'Additionally, the missions were tracked by scientists around the world. All this evidence confirms that humans truly did land on the Moon in 1969.' },
        { type: 'paragraph', section: 'caps', position: 'bottom-right', atmosphere: 'apollo-tracking', effect: 'shrink-back', lead: 'Fun tidbit:', text: "Apollo 11 left a panel of 100 small glass prisms on the Moon. Scientists still fire lasers at it today and time the light's trip back, to measure the distance to the Moon to within a few millimeters. NASA's Lunar Reconnaissance Orbiter has also photographed all six Apollo landing sites from above, where the landers and even the astronauts' boot tracks can be seen.", sources: [S.laser, S.lro10] },

        { type: 'paragraph', section: 'caps', atmosphere: 'lunar-dust', effect: 'fade-in', text: `${REGOLITH.study} ${REGOLITH.surface}` },
        { type: 'paragraph', section: 'caps', atmosphere: 'lunar-dust', effect: 'split-reveal', text: `${REGOLITH.unlike} ${REGOLITH.jagged}` },
        { type: 'paragraph', section: 'caps', atmosphere: 'lunar-dust', effect: 'ink-spread', text: `${REGOLITH.gunpowder} ${REGOLITH.differences}` },

        // Added (A18): footprints, and what comes next.
        { type: 'paragraph', section: 'caps', position: 'bottom-left', atmosphere: 'lunar-dust', effect: 'drift', lead: 'Fun tidbit:', text: "The Moon has no wind or rain, so unless a meteorite happens to strike them, the astronauts' footprints will probably last for millions of years. The surface swings from about 260°F (127°C) in full sunlight to about −280°F (−173°C) in the dark.", sources: [S.apollo30, S.lroCool, S.facts] },
        { type: 'paragraph', section: 'caps', position: 'top-left', atmosphere: 'apollo-tracking', effect: 'mega-zoom-out', text: "In April 2026, NASA's Artemis II mission carried four astronauts, among them Christina Koch and Canada's Jeremy Hansen, around the far side of the Moon and safely back to Earth.", sources: [S.exploration, S.artemis2] },

        { type: 'callout', section: 'link', atmosphere: 'moon-tides', effect: 'breathe', text: NHM_CALLOUT, url: NHM_MOON_URL },
        { type: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'The Moon is in our sky almost every night. What is one question you would most like to ask about it, and how might you find the answer?',
        'The Moon was probably born in a giant crash.': 'No one was there to watch the Moon form. How can scientists work out what probably happened billions of years ago?',
        'July 20, 1969: "The Eagle has landed."': 'Some people have questioned whether the Moon landings were real. When you hear a surprising claim, what kinds of evidence would help you decide whether to believe it?',
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
        copy: { className: 'mo-copy' },
        link: { className: 'mo-link' },
      },
      items: [
        {
          type: 'title-image',
          section: 'title',
          atmosphere: 'exoplanet-transit',
          effect: 'glitch',
          src: '/exhibitions/moon/titles/another-earth.webp',
          ...TITLE_SIZES.anotherEarth,
          framing: 'centered',
          alt: 'Another Earth',
          decor: { src: '/exhibitions/moon/ringed-planet.jpg', placement: 'top-left', motion: 'none', width: 'min(26vw, 250px)' },
        },
        { type: 'paragraph', section: 'copy', position: 'top-left', atmosphere: 'exoplanet-transit', effect: 'fade-in', text: 'For centuries, humans have wondered if there are other planets like Earth in the universe. This curiosity led to the discovery of exoplanets—planets outside our solar system.' },

        // Added (A18): how planets are found.
        { type: 'section-title', atmosphere: 'exoplanet-transit', effect: 'kenburns-in', text: "How do you find a planet you can't see?", sources: [S.howWeFind] },
        { type: 'paragraph', section: 'copy', position: 'bottom-right', atmosphere: 'exoplanet-transit', effect: 'drift', text: "Planets are hidden in the glare of their stars, so astronomers usually hunt for clues instead. They watch for tiny dips in a star's light when a planet passes in front of it, or for a star's wobble as an orbiting planet tugs on it.", sources: [S.howWeFind] },

        { type: 'paragraph', section: 'right', atmosphere: 'exoplanet-transit', effect: 'typewriter', text: 'In 1992, astronomers found the first exoplanets orbiting a pulsar, a type of neutron star. Then, in 1995, scientists discovered 51 Pegasi b, the first exoplanet orbiting a star similar to our Sun.' },
        { type: 'paragraph', section: 'copy', position: 'top-right', atmosphere: 'exoplanet-transit', effect: 'rise-expand', lead: 'Fun tidbit:', text: "NASA's Kepler space telescope, launched in 2009, discovered more than 2,600 planets. Its results suggest that 20 to 50 percent of the stars we can see in the night sky may have small, possibly rocky planets in their habitable zones.", sources: [S.kepler] },
        { type: 'paragraph', section: 'copy', position: 'bottom-right', atmosphere: 'exoplanet-transit', effect: 'line-by-line', text: 'Since then, over 6,000 exoplanets have been confirmed, including HD 20794 d, a "super-Earth" located about 20 light-years away in the constellation Eridanus. This planet is roughly six times the mass of Earth and orbits within its star\'s habitable zone, where temperatures could allow liquid water to exist.', note: MOON_NOTES.orbit },
        { type: 'paragraph', section: 'copy', position: 'bottom-left', atmosphere: 'exoplanet-transit', effect: 'fade-in', text: 'HD 20794 d takes about 647 days to circle its star. Its orbit is a stretched oval, so over its year it swings between the inner and outer edges of the habitable zone. Astronomers confirmed it in 2025, using more than 20 years of measurements.', sources: [S.oxford, S.iac] },
        { type: 'paragraph', section: 'copy', position: 'center', atmosphere: 'exoplanet-transit', effect: 'mega-zoom-out', lead: 'Fun tidbit:', text: 'The closest known exoplanet, Proxima Centauri b, is only 4.2 light-years from Earth. NASA scientists say there are more planets than stars in our galaxy.', sources: [S.proxima, S.exoplanets] },
        { type: 'paragraph', section: 'copy', position: 'top-right', atmosphere: 'exoplanet-transit', effect: 'breathe', text: 'The discovery of HD 20794 d raises hopes of finding alien life, as scientists continue to explore exoplanets that might host life forms.' },
        { type: 'paragraph', section: 'copy', position: 'bottom-left', atmosphere: 'exoplanet-transit', effect: 'typewriter', text: "In 2022, NASA's James Webb Space Telescope found the first clear evidence of carbon dioxide in the air of a planet outside our solar system: WASP-39 b, a hot gas giant 700 light-years away. Webb reads the starlight that filters through a planet's atmosphere, because different gases absorb different colors of light.", sources: [S.webb] },

        { type: 'paragraph', section: 'copy', position: 'center', atmosphere: 'dark-forest-sky', effect: 'blind-spot-reveal', text: "But if the universe is so vast and full of stars, why haven't we found aliens yet? This question is known as the Fermi Paradox." },
        { type: 'paragraph', section: 'copy', position: 'top-right', atmosphere: 'dark-forest-sky', effect: 'film-credits', lead: 'Fun tidbit:', text: 'The question goes back to 1950, when physicist Enrico Fermi asked it over lunch with fellow physicists: "Where is everybody?"', sources: [S.homeAlone, S.jones] },
        { type: 'paragraph', section: 'copy', position: 'bottom-left', atmosphere: 'dark-forest-sky', effect: 'blur-to-sharp', text: 'One idea, called the "Dark Forest" theory, suggests that intelligent civilizations stay silent to avoid attracting attention, fearing that other civilizations might be dangerous. Another possibility is that life is rare or doesn\'t last long, making it hard for civilizations to find each other before disappearing.', note: MOON_NOTES.darkForest },
        { type: 'paragraph', section: 'right', atmosphere: 'dark-forest-sky', effect: 'split-reveal', text: 'There\'s also the "Great Filter" theory, which suggests that advanced civilizations might destroy themselves before they can develop the technology needed for interstellar travel or communication. This could happen through wars, environmental disasters, or other self-inflicted problems.' },

        { type: 'paragraph', section: 'copy', position: 'top-left', atmosphere: 'meteor-shower', effect: 'pan-lr', text: 'Even once we find a planet like HD 20794 d, traveling there would be extremely difficult. The planet is 20 light-years away, and with current technology, it would take hundreds of thousands of years to reach it.' },
        // The draft's "has taken almost 50 years" is worded so it reads true on either side of 18 November 2026, when NASA says Voyager 1 reaches one light-day.
        { type: 'paragraph', section: 'copy', position: 'center', atmosphere: 'meteor-shower', effect: 'line-by-line', lead: 'Fun tidbit:', text: 'NASA\'s Voyager 1, launched in 1977 and cruising at nearly 38,000 miles per hour, takes almost 50 years, until November 2026, to travel one "light-day" (about 16 billion miles) from Earth. HD 20794 d is about 7,300 light-days away.', sources: [S.voyager] },
        { type: 'paragraph', section: 'copy', position: 'bottom-right', atmosphere: 'meteor-shower', effect: 'shrink-back', text: 'Space travelers would face dangers like harmful radiation and collisions with space dust. Making such a planet habitable would also be challenging, as it might lack the right atmosphere or have extreme temperatures.' },
        { type: 'paragraph', section: 'copy', position: 'top-right', atmosphere: 'exoplanet-transit', effect: 'ink-spread', text: 'Another concern is the possibility of encountering alien microbes. Scientists warn that our immune systems might struggle to detect and respond to germs originating from other planets, posing significant health risks to humans and other mammals.', note: MOON_NOTES.germs },
        {
          type: 'paragraph',
          section: 'right',
          atmosphere: 'moon-tides',
          effect: 'rise-expand',
          className: 'mo-landscape',
          text: 'While the search for alien life is thrilling, it reminds us how special and unique our own Earth is.',
          decor: { src: '/exhibitions/moon/three-moons.jpg', placement: 'bottom-left', motion: 'rise', width: '100%' },
        },

        { type: 'callout', section: 'link', atmosphere: 'exoplanet-transit', effect: 'film-credits', text: NHM_CALLOUT, url: NHM_SPACE_URL },
        { type: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'If scientists found a planet very like Earth, would you want people to try to travel there one day? What would you want to know before deciding?',
        "How do you find a planet you can't see?": 'Astronomers often find planets from the clues they leave rather than by seeing them. What else do we know about only from the clues it leaves behind?',
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
export const MOON_CASE: CasePageData = {
  label: 'Display Case',
  title: 'Artifacts',
  // Photographs to come: the case will be photographed anew.
  photos: [],
  artifacts: [
    {
      id: 'lunar-meteorite',
      name: 'Lunar meteorite, Adrar 013',
      record: 'Genuine lunar meteorite, Adrar 013 sample',
      writing: [
        { poster: 'poster1', text: "Additionally, the Moon's cratered face is a record of the space rocks that have struck our corner of the solar system for billions of years." },
        { poster: 'poster1', text: `${REGOLITH.study} ${REGOLITH.surface}` },
        { poster: 'poster1', text: `${REGOLITH.unlike} ${REGOLITH.jagged}` },
      ],
    },
    {
      id: 'sand-specimens',
      name: 'Global sand and geology specimens',
      record: 'Laboratory microscopes with comparative global sand and geology specimens',
      writing: [
        { poster: 'poster1', text: REGOLITH.differences },
      ],
    },
  ],
  display: ['Display posters detailing lunar formation, regolith chemistry, exoplanet orbital mechanics, and astrobiology'],
};
