import { artifactPath, plainText, recordLines } from '@/components/exhibition/artifacts';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { posterChapters } from '@/components/projector/posterTalk';
import { MOON, MOON_CASE, NHM_CALLOUT, NHM_MOON_URL, NHM_SPACE_URL } from '@/app/exhibitions/moon/moon';
import MoonCase from '@/app/exhibitions/moon/artifacts/case/page';
import { floorReturnFor } from '@/lib/floors';

/*
 * Our Incredible Moon: its config, the poster copy against the transcription
 * (with only the owner's approved fixes), the links, and the display case
 * page.
 */

const allItems = MOON.posters.flatMap((p) => p.items);
const paragraphs = (id: string) =>
  MOON.posters.find((x) => x.id === id)!.items.flatMap((it) => (it.type === 'paragraph' ? [it.text] : []));
const allText = allItems.map((it) => ('text' in it ? it.text : '')).join('\n');
const tick = (ms = 400) => act(() => { jest.advanceTimersByTime(ms); });

/** Poster 1 exactly as printed (all capitals on the poster), from the transcription. */
const PRINTED_1 =
  "THE MOON IS MORE THAN JUST A GLOWING BALL IN THE NIGHT SKY—IT PLAYS A CRUCIAL ROLE IN SUPPORTING LIFE ON EARTH. ITS GRAVITY HELPS CONTROL OUR PLANET'S TIDES, WHICH ARE ESSENTIAL FOR MARINE LIFE AND COASTAL ECOSYSTEMS . THE MOON ALSO HELPS STABILIZE EARTH'S TILT, WHICH AFFECTS OUR CLIMATE AND SEASONS. WITHOUT THE MOON, EARTH'S AXIS MIGHT WOBBLE MORE, LEADING TO EXTREME WEATHER CHANGES. ADDITIONALLY, THE MOON ACTS AS A SHIELD, ABSORBING IMPACTS FROM SPACE ROCKS THAT MIGHT OTHERWISE HIT EARTH. THIS PROTECTION HAS BEEN VITAL IN EARTH'S HISTORY, ALLOWING LIFE TO DEVELOP AND THRIVE. " +
  "IN 1969, HUMANS ACHIEVED THE REMARKABLE FEAT OF LANDING ON THE MOON DURING NASA'S APOLLO 11 MISSION. SOME PEOPLE HAVE QUESTIONED WHETHER THE MOON LANDINGS WERE REAL, BUT THERE'S STRONG EVIDENCE PROVING THIS HAPPENED. FOR EXAMPLE, THE ASTRONAUTS BROUGHT BACK MOON ROCKS THAT ARE VERY DIFFERENT FROM ANY ROCKS FOUND ON EARTH. THESE ROCKS HAVE UNIQUE FEATURES THAT COULDN'T BE FAKED OR CREATED ON OUR PLANET . ADDITIONALLY, THE MISSIONS WERE TRACKED BY SCIENTISTS AROUND THE WORLD. ALL THIS EVIDENCE CONFIRMS THAT HUMANS TRULY DID LAND ON THE MOON IN 1969. " +
  "OUR MOON IS FASCINATING TO STUDY. ITS SURFACE ALONE, WHICH IS COVERED IN A LAYER OF FINE DUST CALLED LUNAR REGOLITH, PROVIDES HUGE CONTRASTS TO OUR OWN EARTH. UNLIKE EARTH'S SOIL, WHICH IS SHAPED BY WIND, WATER, AND LIVING THINGS, LUNAR DUST IS FORMED OVER BILLIONS OF YEARS THROUGH METEORITE IMPACTS. THIS MAKES THE DUST PARTICLES SHARP AND JAGGED, AND THEY CAN STICK TO EVERYTHING BECAUSE OF STATIC ELECTRICITY . ASTRONAUTS WHO WALKED ON THE MOON SAID THE DUST SMELLED LIKE GUNPOWDER AND WAS HARD TO CLEAN OFF THEIR SUITS. THESE DIFFERENCES BETWEEN MOON DUST AND EARTH'S SOIL HELP SCIENTISTS LEARN MORE ABOUT THE MOON'S HISTORY AND WHY IT'S SUCH A UNIQUE PLACE IN OUR SOLAR SYSTEM.";

/** Poster 2 exactly as printed, from the transcription. */
const PRINTED_2 =
  'For centuries, humans have wondered if there are other planets like Earth in the universe. This curiosity led to the discovery of exoplanets—planets outside our solar system. In 1992, astronomers found the first exoplanets orbiting a pulsar, a type of neutron star. Then, in 1995, scientists discovered 51 Pegasi b, the first exoplanet orbiting a star similar to our Sun. Since then, over 5,500 exoplanets have been confirmed, including HD 20794 d, a "super-Earth" located about 20 light-years away in the constellation Eridanus. This planet is roughly six times the mass of Earth and orbits within its star\'s habitable zone, where temperatures could allow liquid water to exist. The discovery of HD 20794 d raises hopes of finding alien life, as scientists continue to explore exoplanets that might host life forms. ' +
  'But if the universe is so vast and full of stars, why haven\'t we found aliens yet? This question is known as the Fermi Paradox. One idea, called the "Dark Forest" theory, suggests that intelligent civilizations stay silent to avoid attracting attention, fearing that other civilizations might be dangerous. Another possibility is that life is rare or doesn\'t last long, making it hard for civilizations to find each other before disappearing. There\'s also the "Great Filter" theory, which suggests that advanced civilizations might destroy themselves before they can develop the technology needed for interstellar travel or communication. This could happen through wars, environmental disasters, or other self-inflicted problems. ' +
  'Even once we find a planet like HD 20794 d, traveling there would be extremely difficult. The planet is 20 light-years away, and with current technology, it would take thousands of years to reach it. Space travelers would face dangers like harmful radiation and collisions with space dust. Making such a planet habitable would also be challenging, as it might lack the right atmosphere or have extreme temperatures. Another concern is the possibility of encountering alien microbes. Scientists warn that our immune systems might struggle to detect and respond to germs originating from other planets, posing significant health risks to humans and other mammals. While the search for alien life is thrilling, it reminds us how special and unique our own Earth is.';

/** Applies a replacement that must match exactly once, so a fix that silently matches nothing fails. */
function fix(text: string, from: string, to: string) {
  expect(text.split(from)).toHaveLength(2);
  return text.replace(from, to);
}

/** The owner's approved fixes, and nothing else. */
function approved1() {
  let t = fix(
    PRINTED_1,
    "ADDITIONALLY, THE MOON ACTS AS A SHIELD, ABSORBING IMPACTS FROM SPACE ROCKS THAT MIGHT OTHERWISE HIT EARTH. THIS PROTECTION HAS BEEN VITAL IN EARTH'S HISTORY, ALLOWING LIFE TO DEVELOP AND THRIVE.",
    "ADDITIONALLY, THE MOON'S CRATERED FACE IS A RECORD OF THE SPACE ROCKS THAT HAVE STRUCK OUR CORNER OF THE SOLAR SYSTEM FOR BILLIONS OF YEARS.",
  );
  // typesetting only: the stray spaces before three periods
  for (const w of ['ECOSYSTEMS', 'PLANET', 'ELECTRICITY']) t = fix(t, `${w} .`, `${w}.`);
  return t;
}
function approved2() {
  let t = fix(PRINTED_2, 'over 5,500 exoplanets', 'over 6,000 exoplanets');
  t = fix(t, 'it would take thousands of years to reach it', 'it would take hundreds of thousands of years to reach it');
  return t;
}

describe('Our Incredible Moon', () => {
  it('has two posters, each ending with Return to Exhibition, and one display case', () => {
    expect(MOON.slug).toBe('moon');
    expect(MOON.name).toBe('Our Incredible Moon');
    expect(MOON.subtitle).toBe('And Beyond');
    expect(MOON.posters.map((p) => p.id)).toEqual(['poster1', 'poster2']);
    expect(MOON.posters.map((p) => p.title)).toEqual(['Our Incredible Moon', 'Another Earth']);
    for (const p of MOON.posters) {
      expect(p.items[0].type).toBe('title-text');
      expect(p.items[p.items.length - 1].type).toBe('end');
    }
    expect(MOON.cases).toHaveLength(1);
    expect(MOON.cases?.[0].href).toBe('/exhibitions/moon/artifacts/case');
    expect(MOON.fx.theme).toBe('mo');
  });

  it('goes back to the ground floor, as its first Origins room', () => {
    expect(MOON.back).toEqual(floorReturnFor('moon'));
    expect(MOON.back).toEqual({ href: '/exhibitions/ground-floor', label: 'Ground Floor', remember: { key: 'groundFloorIndex', value: '0' } });
  });

  it('sets poster 1 exactly as printed, in sentence case, with only the approved fixes', () => {
    const text = paragraphs('poster1').join(' ');
    // Same words: capitalized, it is the printed poster with the approved fixes.
    expect(text.toUpperCase()).toBe(approved1());
    // Stored in sentence case, so a screen reader reads words; the capitals are CSS.
    expect(text).not.toBe(text.toUpperCase());
    expect(text.startsWith('The Moon is more than just a glowing ball in the night sky—it plays')).toBe(true);
    expect(text).toContain("NASA's Apollo 11 mission");
    expect(MOON.posters[0].sections?.caps.className).toBe('mo-caps');
    for (const it of MOON.posters[0].items) if (it.type === 'paragraph') expect(it.section).toBe('caps');
  });

  it('sets poster 2 exactly as printed, with only the approved fixes', () => {
    expect(paragraphs('poster2').join(' ')).toBe(approved2());
  });

  it('applies the approved fixes, and the replaced wording is gone', () => {
    expect(allText).toContain("Additionally, the Moon's cratered face is a record of the space rocks that have struck our corner of the solar system for billions of years.");
    expect(allText).toContain('over 6,000 exoplanets');
    expect(allText).toContain('it would take hundreds of thousands of years to reach it');
    expect(allText).not.toMatch(/shield|absorbing impacts|might otherwise hit Earth|vital in Earth's history|develop and thrive/i);
    expect(allText).not.toMatch(/5,500/);
    expect(allText).not.toMatch(/take thousands of years/);
    expect(allText).not.toMatch(/ \./);
  });

  it('splits paragraphs only between sentences', () => {
    for (const it of allItems) if (it.type === 'paragraph') expect(it.text).toMatch(/[.!?]$/);
  });

  it('uses US spellings', () => {
    expect(allText).toMatch(/stabilize/);
    expect(allText).toMatch(/traveling/);
    expect(allText).not.toMatch(/stabilise|travelling|colour|centre|civilisation|recognise/);
  });

  it.each(MOON.posters.map((p) => [p.id, p] as const))('%s: one question per chapter, and none left over', (_id, p) => {
    const chapters = posterChapters(p.items.map((it) => ({ type: it.type, text: 'text' in it ? it.text : undefined })), p.title);
    expect(chapters.length).toBeGreaterThan(0);
    expect(Object.keys(p.talk).sort()).toEqual(chapters.map((c) => c.key).sort());
    for (const c of chapters) expect(p.talk[c.key]).toMatch(/\?$/);
  });

  it('links the Natural History Museum where the posters have QR codes', () => {
    const links = allItems.flatMap((it) => (it.type === 'callout' && it.url ? [{ text: it.text, url: it.url }] : []));
    expect(links).toEqual([
      { text: 'Explore more at the Natural History Museum, London', url: NHM_MOON_URL },
      { text: 'Explore more at the Natural History Museum, London', url: NHM_SPACE_URL },
    ]);
    expect(NHM_CALLOUT).toBe('Explore more at the Natural History Museum, London');
    expect(NHM_MOON_URL).toBe('https://www.nhm.ac.uk/discover/factfile-the-moon.html');
    expect(NHM_SPACE_URL).toBe('https://www.nhm.ac.uk/discover/space.html');
    expect(allText).not.toMatch(/Scan|QR/);
  });

  it('uses only pictures cut from the posters, and every picture has alt text', () => {
    for (const p of MOON.posters) expect(p.hero.alt).toBeTruthy();
    const decor = allItems.flatMap((it) => (it.decor ? [it.decor.src] : []));
    expect(decor.sort()).toEqual(['/exhibitions/moon/moonrise.jpg', '/exhibitions/moon/ringed-planet.jpg', '/exhibitions/moon/three-moons.jpg']);
    for (const c of MOON.cases ?? []) expect(c.image).toBeUndefined();
  });

  describe('the walkthrough', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      window.history.replaceState(null, '', '/');
    });
    afterEach(() => jest.useRealTimers());

    it('opens Another Earth on its title, and reaches the museum link', () => {
      render(<PosterExhibition config={MOON} />);
      expect(screen.getByRole('heading', { level: 1, name: 'Our Incredible Moon' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /display case/i })).toHaveAttribute('href', '/exhibitions/moon/artifacts/case');
      expect(screen.getByRole('link', { name: 'Ground Floor' })).toHaveAttribute('href', '/exhibitions/ground-floor');

      fireEvent.click(screen.getByRole('button', { name: /Another Earth poster/ }));
      tick();
      const content = () => document.querySelector('.pe-walkthrough-content') as HTMLElement;
      const title = within(content()).getByRole('heading', { level: 2 });
      expect(title).toHaveTextContent('Another');
      expect(title).toHaveTextContent('Earth');
      // the moonrise veil opens the poster
      expect(content().querySelector('.pfx-mo-rise')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      expect(content().textContent?.replace(/\s+/g, ' ')).toContain('For centuries, humans have wondered');
      // and a phase crosses each panel of copy
      expect(content().querySelector('.pfx-mo-phase')).toBeInTheDocument();

      const callout = MOON.posters[1].items.findIndex((it) => it.type === 'callout');
      for (let i = 1; i < callout; i++) {
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        tick();
      }
      expect(within(content()).getByRole('link', { name: /Explore more at the Natural History Museum, London/ })).toHaveAttribute('href', NHM_SPACE_URL);
    });
  });
});

describe('The Our Incredible Moon display case page', () => {
  it('keeps the record, with a card for each artifact, beside an empty case awaiting its photographs', () => {
    render(<MoonCase />);
    expect(screen.getByRole('heading', { level: 1, name: 'Our Incredible Moon' })).toBeInTheDocument();
    // Every line of the record is kept: the objects' lines (each object a card) and the display's.
    expect(recordLines(MOON_CASE).map(plainText)).toEqual([
      'Genuine lunar meteorite, Adrar 013 sample',
      'Laboratory microscopes with comparative global sand and geology specimens',
      'Display posters detailing lunar formation, regolith chemistry, exoplanet orbital mechanics, and astrobiology',
    ]);
    const cards = screen.getAllByRole('link', { name: /View artifact/ });
    expect(cards.map((c) => c.getAttribute('href'))).toEqual(MOON_CASE.artifacts.map((a) => artifactPath({ slug: MOON.slug }, a)));
    // No installation photographs: an empty case, drawn, stands in for them.
    expect(MOON_CASE.photos).toHaveLength(0);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
    expect(screen.getByText('Display case — photographs to come')).toBeInTheDocument();
    expect(JSON.stringify([MOON, MOON_CASE])).not.toMatch(/installation|case(-thumb|-table)?\.jpg|microscopes?(-sands)?\.jpg|sand-specimens\.jpg|moon-dust\.jpg/);
    expect(screen.getByRole('link', { name: 'Return to Exhibition' })).toHaveAttribute('href', '/exhibitions/moon');
    expect(screen.getByRole('link', { name: 'Exhibition' })).toHaveAttribute('href', '/exhibitions/moon');
  });
});
