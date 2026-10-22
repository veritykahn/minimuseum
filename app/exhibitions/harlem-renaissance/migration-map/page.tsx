'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import { srOnly, activateOnKey, prefersReducedMotion } from '@/lib/a11y';

const AUDIO_BASE = '/exhibitions/harlem/audio/migration/';
const PHOTO_BASE = '/exhibitions/harlem/images/migration/';

type CityData = {
  id: string;
  name: string;
  period: string;
  cx: number;
  cy: number;
  photo: string;
  /** What the photograph shows, for people who cannot see it. */
  photoAlt: string;
  photoCredit: string;
  text: string;
  music: { file: string; title: string; artist: string; year: string; note?: string };
  /**
   * A quotation, or, when `paraphrase` is set, a saying whose exact wording
   * cannot be traced to the person: shown without quotation marks.
   */
  quote: { text: string; author: string; paraphrase?: boolean };
};

const CITIES: CityData[] = [
  {
    id: 'delta',
    name: 'The Mississippi Delta',
    period: 'Before 1910',
    cx: 280, cy: 550,
    photo: 'delta.jpg',
    photoAlt: 'Workers picking cotton in a wide field in Georgia, 1907',
    photoCredit: '\u201CA Georgia Cotton Field,\u201D 1907. Photograph by Marcus L. Brown, Decatur, Georgia. Library of Congress Prints and Photographs Division. This field is in Georgia, not the Delta: the same work was done in cotton fields across the South.',
    text: 'It began here \u2014 in the flat cotton fields along the Mississippi River, where African Americans had been enslaved for generations. After emancipation, most stayed as sharecroppers, trapped in cycles of debt and poverty. But they carried something no one could take from them: their music. Work songs, field hollers, and spirituals echoed across the Delta \u2014 the raw material that would become the blues.',
    music: {
      file: 'delta.mp3', title: '\u201CSwing Low, Sweet Chariot\u201D', artist: 'Fisk University Jubilee Quartet', year: 'Victor Records, 1909',
      note: 'Sung by a quartet from Fisk University in Nashville, not in the Delta: one of the earliest recordings of a spiritual, the kind of song sung across the South.',
    },
    quote: { text: 'Before I\u2019d be a slave, I\u2019d be buried in my grave, and go home to my Lord and be saved.', author: 'Traditional spiritual, \u201CBefore I\u2019d Be a Slave\u201D' },
  },
  {
    id: 'new-orleans',
    name: 'New Orleans',
    period: '1890s\u20131920s',
    cx: 310, cy: 505,
    photo: 'new-orleans.jpg',
    photoAlt: 'Oscar \u201CPapa\u201D Celestin\u2019s Original Tuxedo Band, early 1900s',
    photoCredit: 'Oscar "Papa" Celestin\'s Original Tuxedo Band, early 1900s. William Russell Jazz Collection, The Historic New Orleans Collection, acquisition made possible by the Clarisse Claiborne Grima Fund.',
    text: 'Where the Mississippi meets the Gulf, New Orleans was the most musical city in America. In Congo Square, enslaved people of African descent gathered on Sunday afternoons to drum, sing, and dance \u2014 something few other places in the South allowed. By the 1890s, brass bands, ragtime, blues, and Caribbean rhythms were all colliding in the streets. They called the new sound \u201Cjass.\u201D King Oliver, Louis Armstrong, and Sidney Bechet all grew up hearing it.',
    music: { file: 'new-orleans.mp3', title: '\u201CWay Down Yonder in New Orleans\u201D', artist: 'The Georgians, Frank Guarente', year: 'Columbia Records, 1922' },
    quote: { text: 'Jazz was born in New Orleans and grew up in Chicago.', author: 'A popular saying, sometimes credited to Louis Armstrong', paraphrase: true },
  },
  {
    id: 'memphis',
    name: 'Memphis',
    period: '1900s\u20131920s',
    cx: 285, cy: 410,
    photo: 'memphis.jpg',
    photoAlt: 'W.C. Handy and associates outside the Tri-State Bank of Memphis',
    photoCredit: 'W.C. Handy (far right) with associates outside the Tri-State Bank of Memphis, Tennessee. Handy published "Memphis Blues" in 1912 \u2014 among the first blues ever published as sheet music.',
    text: 'Memphis sat at the crossroads \u2014 halfway between the Delta and the North. Beale Street became the main street of Black America, lined with clubs, theaters, and juke joints. W.C. Handy heard the blues here and wrote them down, publishing \u201CMemphis Blues\u201D in 1912 \u2014 one of the first blues ever printed as sheet music. It was the bridge between rural folk music and the commercial recording industry.',
    music: { file: 'memphis.mp3', title: '\u201CMemphis Blues\u201D', artist: 'Morton Harvey, vocal \u2014 W.C. Handy, composer', year: 'Victor Records, 1914' },
    quote: { text: 'The blues came from nothingness, from want, from desire.', author: 'W.C. Handy' },
  },
  {
    id: 'st-louis',
    name: 'St. Louis',
    period: '1890s\u20131920s',
    cx: 275, cy: 330,
    photo: 'st-louis.jpg',
    photoAlt: 'Fate Marable\u2019s Society Syncopators aboard a Mississippi riverboat, about 1919',
    photoCredit: 'Fate Marable\u2019s Society Syncopators aboard a Mississippi riverboat, c.\u20091919. Marable\u2019s band played the steamships between New Orleans and St. Louis. A young Louis Armstrong played cornet in this band before leaving for Chicago.',
    text: 'St. Louis was where the river met the railroad. Fate Marable\u2019s band played jazz on Mississippi riverboats, carrying the sound from New Orleans upriver to St. Louis and beyond. Scott Joplin had already made the city famous for ragtime \u2014 one of the first Black American styles to sweep the nation. When jazz came through on its way north, it picked up ragtime\u2019s sophistication and kept moving.',
    music: { file: 'st-louis.mp3', title: '\u201CSt. Louis Blues\u201D', artist: 'Original Dixieland Jazz Band with Al Bernard', year: 'Victor Records, 1921' },
    quote: { text: 'Syncopations are no indication of light or trashy music.', author: 'Scott Joplin' },
  },
  {
    id: 'chicago',
    name: 'Chicago',
    period: '1910s\u20131930s',
    cx: 370, cy: 155,
    photo: 'chicago.jpg',
    photoAlt: 'King Oliver\u2019s Creole Jazz Band posing with their instruments, Chicago, about 1923',
    photoCredit: 'King Oliver\u2019s Creole Jazz Band, Chicago, c.\u20091923. Photograph by Daguerre Studio. Left to right: Baby Dodds (drums), Honor\u00E9 Dutrey (trombone), King Oliver (cornet), Louis Armstrong (cornet), Lil Hardin (piano), Bill Johnson (banjo), Johnny Dodds (clarinet).',
    text: 'The trains from the South ended at Chicago\u2019s Illinois Central station. Most of the people who rode those trains came from Mississippi and its neighbors, straight up the Illinois Central line. Between 1910 and 1930, Chicago\u2019s Black population grew more than fivefold, from about 44,000 to about 234,000. They settled on the South Side, and the music followed. King Oliver moved from New Orleans to Chicago in 1918, then sent for young Louis Armstrong in 1922. The South Side became a laboratory where blues and jazz fused and evolved.',
    music: { file: 'chicago.mp3', title: '\u201CRiverside Blues\u201D', artist: 'King Oliver\u2019s Creole Jazz Band', year: 'Recorded 1923' },
    quote: { text: 'In the summer of 1922, Louis Armstrong took the train from New Orleans all the way to Chicago to join King Oliver\u2019s band.', author: 'Louis Armstrong\u2019s journey, in paraphrase', paraphrase: true },
  },
  {
    id: 'harlem',
    name: 'Harlem',
    period: '1920s\u20131930s',
    cx: 610, cy: 35,
    photo: 'harlem.jpg',
    photoAlt: 'A crowd lines a Harlem street as a parade passes; one sign reads \u201CThe New Negro has no fear\u201D',
    photoCredit: 'Harlem, New York, 1920s. A parade or rally passes through the neighborhood; a sign reads "THE NEW NEGRO HAS NO FEAR." By the 1920s, Harlem was the cultural capital of Black America.',
    text: 'Harlem was the destination \u2014 the Promised Land. Most of its newcomers had come up the Atlantic coast, from Virginia, the Carolinas, Georgia, and Florida; the music arrived from every direction, and in 1924 Louis Armstrong left Chicago for New York to join Fletcher Henderson\u2019s orchestra. By the 1920s Harlem was the cultural capital of Black America. The Cotton Club, the Apollo Theater, the Savoy Ballroom \u2014 music was everywhere. But the Harlem Renaissance was more than jazz. It was poetry, painting, philosophy, and pride. Langston Hughes, Zora Neale Hurston, and Duke Ellington all called Harlem home. A people who had been told they were nothing created an explosion of art that changed the world.',
    music: { file: 'harlem.mp3', title: '\u201CAny Woman\u2019s Blues\u201D', artist: 'Bessie Smith, vocal \u2014 Fletcher Henderson, piano', year: 'Columbia Records, 1923' },
    quote: { text: 'I, too, sing America.', author: 'Langston Hughes' },
  },
];

const CITY_COLORS = [
  { main: '#D4A847', light: '#E8D48B', dim: '#8B7535', bg: '#1C1608' },     // Delta — warm gold
  { main: '#5CBFAA', light: '#8DD9C9', dim: '#3D8072', bg: '#0A1C18' },     // New Orleans — teal
  { main: '#D4864A', light: '#E8B088', dim: '#8B5A32', bg: '#1C1008' },     // Memphis — amber
  { main: '#7BA3C7', light: '#A8C4DD', dim: '#526D86', bg: '#0C1420' },     // St. Louis — steel blue
  { main: '#D4645A', light: '#E89B94', dim: '#8B433C', bg: '#1C0C0A' },     // Chicago — brick red
  { main: '#B485D2', light: '#D0ACE8', dim: '#785A8B', bg: '#160C20' },     // Harlem — lavender
];

// The names the map shows beside each dot, used to begin each dot's
// accessible name so speech users can say what they see.
const DOT_LABELS: Record<string, string> = {
  delta: 'Mississippi Delta',
  'new-orleans': 'New Orleans',
  memphis: 'Memphis',
  'st-louis': 'St. Louis',
  chicago: 'Chicago',
  harlem: 'Harlem',
};

const ROUTE_PATH = 'M280,550 C290,530 305,515 310,505 Q315,480 295,440 Q290,425 285,410 Q280,390 278,370 Q275,350 275,330 Q280,290 310,260 Q330,240 345,225 Q360,200 370,170 Q375,160 370,155 Q390,140 430,115 Q470,95 510,75 Q550,55 580,42 Q595,37 610,35';

// ─── How the people moved ─────────────────────────────────────────
// The journey above follows the music. The people mostly took the railroad
// nearest home: up the Atlantic coast to Washington, Philadelphia and New
// York, or up the middle of the country to Chicago. Positions are schematic,
// like the rest of this map.
const EAST_COAST_PATH = 'M500,575 Q470,535 478,500 Q500,455 545,420 Q578,365 585,300 Q594,262 598,228 Q606,185 606,140 Q610,90 610,35';
const CENTRAL_PATH = 'M280,550 Q300,480 285,410 Q290,300 330,230 Q352,190 370,155';

type PeopleRoute = { id: string; label: string; detail: string; color: string; path: string };
const PEOPLE_ROUTES: PeopleRoute[] = [
  {
    id: 'east',
    label: 'Up the Atlantic coast to New York',
    detail: 'From Florida, Georgia, the Carolinas, and Virginia, on the railroad lines along the seaboard. This is how most of Harlem\u2019s newcomers came.',
    color: '#D0ACE8',
    path: EAST_COAST_PATH,
  },
  {
    id: 'central',
    label: 'Up the middle of the country to Chicago',
    detail: 'From Mississippi and its neighbors, on the Illinois Central Railroad.',
    color: '#E89B94',
    path: CENTRAL_PATH,
  },
];

const PEOPLE_PLACES: { name: string; x: number; y: number; anchor: 'start' | 'end' }[] = [
  { name: 'Florida', x: 500, y: 575, anchor: 'start' },
  { name: 'Georgia', x: 478, y: 500, anchor: 'start' },
  { name: 'The Carolinas', x: 545, y: 420, anchor: 'start' },
  { name: 'Virginia', x: 585, y: 300, anchor: 'start' },
  { name: 'Washington', x: 598, y: 228, anchor: 'end' },
  { name: 'Philadelphia', x: 606, y: 140, anchor: 'end' },
];

type RouteView = 'music' | 'people';

export default function MigrationMapPage() {

  const [currentCityIdx, setCurrentCityIdx] = useState(-1);
  const [cityViewOpen, setCityViewOpen] = useState(false);
  const [cityContentVisible, setCityContentVisible] = useState(false);
  const [expandState, setExpandState] = useState<'hidden' | 'positioned' | 'expanded'>('hidden');
  const [expandOrigin, setExpandOrigin] = useState({ x: 0, y: 0 });
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [trainVisible, setTrainVisible] = useState(false);
  const [trainPos, setTrainPos] = useState({ x: 0, y: 0 });
  const [traveledOffset, setTraveledOffset] = useState(1);
  const [travelTransition, setTravelTransition] = useState(true);
  const [mapZoom, setMapZoom] = useState({ originX: 50, originY: 50, scale: 1 });
  // Music: whether the current city's track is playing, and whether the
  // visitor wants music at all. Turning it off stops arrivals autoplaying.
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const soundOnRef = useRef(true);
  const [announcement, setAnnouncement] = useState('');
  // Which story the map tells: the music's road (the journey) or the people's.
  const [routeView, setRouteView] = useState<RouteView>('music');
  // Shorter rides between stops, and a way to skip the one under way.
  const [quickTrips, setQuickTrips] = useState(false);
  const quickRef = useRef(false);
  const [traveling, setTraveling] = useState(false);
  const skipRef = useRef(false);
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  const cityHeadingRef = useRef<HTMLHeadingElement>(null);
  const dotRefs = useRef<(SVGGElement | null)[]>([]);
  const boardBtnRef = useRef<HTMLButtonElement>(null);
  const peopleBtnRef = useRef<HTMLButtonElement>(null);

  const routePathRef = useRef<SVGPathElement>(null);
  const routeLengthRef = useRef(0);
  const cityPathPositionsRef = useRef<number[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const trainAudioRef = useRef<HTMLAudioElement | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cityViewRef = useRef<HTMLDivElement>(null);
  const currentCityIdxRef = useRef(-1);

  // Keep ref in sync
  useEffect(() => { currentCityIdxRef.current = currentCityIdx; }, [currentCityIdx]);

  // Initialize route path positions
  useEffect(() => {
    const path = routePathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    routeLengthRef.current = len;

    const positions: number[] = [];
    CITIES.forEach((city) => {
      let bestDist = Infinity;
      let bestT = 0;
      for (let t = 0; t <= 1; t += 0.001) {
        const pt = path.getPointAtLength(len * t);
        const dx = pt.x - city.cx;
        const dy = pt.y - city.cy;
        const dist = dx * dx + dy * dy;
        if (dist < bestDist) { bestDist = dist; bestT = t; }
      }
      positions.push(bestT);
    });
    cityPathPositionsRef.current = positions;
  }, []);

  const stopMusic = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    setMusicPlaying(false);
  }, []);

  const playMusic = useCallback((cityIdx: number) => {
    stopMusic();
    const city = CITIES[cityIdx];
    const audio = new Audio(AUDIO_BASE + city.music.file);
    audio.volume = 0.8;
    audio.onplay = () => setMusicPlaying(true);
    audio.onpause = () => setMusicPlaying(false);
    audio.onended = () => { currentAudioRef.current = null; setMusicPlaying(false); };
    currentAudioRef.current = audio;
    audio.play().catch(() => setMusicPlaying(false));
  }, [stopMusic]);

  const toggleMusic = useCallback(() => {
    const audio = currentAudioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      currentAudioRef.current = null;
      setMusicPlaying(false);
      // Pausing is a choice: later stops stay quiet until music is turned on.
      soundOnRef.current = false;
      setSoundOn(false);
      return;
    }
    soundOnRef.current = true;
    setSoundOn(true);
    playMusic(currentCityIdxRef.current);
  }, [playMusic]);

  const toggleSound = useCallback(() => {
    if (soundOnRef.current) {
      soundOnRef.current = false;
      setSoundOn(false);
      stopMusic();
      if (trainAudioRef.current) trainAudioRef.current.pause();
    } else {
      soundOnRef.current = true;
      setSoundOn(true);
      if (currentCityIdxRef.current >= 0) playMusic(currentCityIdxRef.current);
    }
  }, [playMusic, stopMusic]);

  /** How long each part of a hop takes: scenic, quick, or reduced motion. */
  const pace = useCallback((scenic: number, quick: number, reduced = 1) => {
    if (prefersReducedMotion()) return reduced;
    if (skipRef.current) return Math.min(quick, 300);
    return quickRef.current ? quick : scenic;
  }, []);

  const toggleQuickTrips = useCallback(() => {
    quickRef.current = !quickRef.current;
    setQuickTrips(quickRef.current);
  }, []);

  const skipRide = useCallback(() => {
    skipRef.current = true;
    setAnnouncement('Skipping ahead\u2026');
  }, []);

  const chooseView = useCallback((view: RouteView) => {
    setRouteView(view);
    setAnnouncement(view === 'people'
      ? 'Showing how the people moved: up the Atlantic coast to New York, and up the middle of the country to Chicago.'
      : 'Showing how the music moved: the journey from the Mississippi Delta to Harlem.');
  }, []);

  const getDotScreenPos = useCallback((idx: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const city = CITIES[idx];
    const pt = svg.createSVGPoint();
    pt.x = city.cx;
    pt.y = city.cy;
    const screenPt = pt.matrixTransform(svg.getScreenCTM()!);
    return { x: screenPt.x, y: screenPt.y };
  }, []);

  const expandCity = useCallback((idx: number) => {
    setCurrentCityIdx(idx);
    setPhotoLoaded(false);

    const pos = getDotScreenPos(idx);
    setExpandOrigin(pos);
    setExpandState('positioned');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setExpandState('expanded');
      });
    });

    setTimeout(() => {
      setCityViewOpen(true);
      setCityContentVisible(true);
      if (cityViewRef.current) cityViewRef.current.scrollTop = 0;
      setAnnouncement(`Stop ${idx + 1} of ${CITIES.length}: ${CITIES[idx].name}`);
      requestAnimationFrame(() => cityHeadingRef.current?.focus({ preventScroll: true }));
      // Auto-play music after expand fills the screen, unless the visitor
      // has turned music off. The Music on/off control is first in the view.
      if (soundOnRef.current) playMusic(idx);
    }, pace(1400, 500, 300));
  }, [getDotScreenPos, playMusic, pace]);

  const collapseCity = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      stopMusic();
      setCityContentVisible(false);

      setTimeout(() => {
        const pos = getDotScreenPos(currentCityIdxRef.current);
        setExpandOrigin(pos);
        setExpandState('positioned');

        setTimeout(() => {
          setCityViewOpen(false);
          setExpandState('hidden');
          resolve();
        }, pace(800, 300, 1));
      }, pace(400, 150, 1));
    });
  }, [stopMusic, getDotScreenPos, pace]);

  const playTrainSound = useCallback(() => {
    if (trainAudioRef.current && soundOnRef.current) {
      trainAudioRef.current.currentTime = 0;
      trainAudioRef.current.volume = 0.5;
      trainAudioRef.current.play().catch(() => {});
    }
  }, []);

  const animateTrainToCity = useCallback((fromIdx: number, toIdx: number): Promise<void> => {
    return new Promise((resolve) => {
      const path = routePathRef.current;
      const len = routeLengthRef.current;
      const positions = cityPathPositionsRef.current;
      if (!path || !len) { resolve(); return; }

      // Zoom into section between the two cities
      const c1 = CITIES[Math.max(0, fromIdx)];
      const c2 = CITIES[toIdx];
      const centerX = (c1.cx + c2.cx) / 2;
      const centerY = (c1.cy + c2.cy) / 2;
      const dx = Math.abs(c2.cx - c1.cx);
      const dy = Math.abs(c2.cy - c1.cy);
      const span = Math.max(dx, dy, 100);
      const scale = Math.min(2.5, Math.max(1.5, 300 / span));
      setMapZoom({
        originX: (centerX / 700) * 100,
        originY: (centerY / 620) * 100,
        scale,
      });

      setTrainVisible(true);
      const startPct = fromIdx >= 0 ? positions[fromIdx] : positions[0];
      const endPct = positions[toIdx];
      // A 5-second train journey (1.5 seconds with quick trips) — the last
      // stretch is the expanding dot. With reduced motion the train jumps
      // straight to the next stop, and Skip ends the ride at once.
      const duration = pace(5000, 1500);
      const startTime = performance.now();

      function animate(now: number) {
        const elapsed = now - startTime;
        const t = skipRef.current ? 1 : Math.min(elapsed / duration, 1);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const pct = startPct + (endPct - startPct) * eased;
        const pt = path!.getPointAtLength(len * pct);

        setTrainPos({ x: pt.x, y: pt.y });
        setTravelTransition(false);
        setTraveledOffset(1 - pct);

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          setTrainVisible(false);
          // Zoom back out
          setMapZoom({ originX: 50, originY: 50, scale: 1 });
          resolve();
        }
      }
      requestAnimationFrame(animate);
    });
  }, [pace]);

  const startJourney = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentCityIdx(0);
    setTravelTransition(true);
    const pct = cityPathPositionsRef.current[0] || 0;
    setTraveledOffset(1 - pct);

    setTimeout(() => {
      expandCity(0);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, expandCity]);

  const boardToNext = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const nextIdx = currentCityIdxRef.current + 1;
    if (nextIdx >= CITIES.length) { setIsAnimating(false); return; }

    skipRef.current = false;
    setTraveling(true);
    await collapseCity();
    setAnnouncement(`Boarding the train to ${CITIES[nextIdx].name}\u2026`);
    // The city view has gone; keep keyboard focus on the one control that
    // matters during the ride.
    requestAnimationFrame(() => skipBtnRef.current?.focus({ preventScroll: true }));
    playTrainSound();
    await animateTrainToCity(currentCityIdxRef.current, nextIdx);

    setCurrentCityIdx(nextIdx);
    setTimeout(() => {
      expandCity(nextIdx);
      setIsAnimating(false);
      setTraveling(false);
      skipRef.current = false;
    }, pace(300, 150, 1));
  }, [isAnimating, collapseCity, playTrainSound, animateTrainToCity, expandCity, pace]);

  const restartJourney = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    await collapseCity();
    setCurrentCityIdx(-1);
    setTravelTransition(true);
    setTraveledOffset(1);
    setTimeout(() => {
      setIsAnimating(false);
      startJourney();
    }, 500);
  }, [isAnimating, collapseCity, startJourney]);

  const backToMap = useCallback(async (view?: RouteView) => {
    if (isAnimating) return;
    setIsAnimating(true);
    await collapseCity();
    setIsAnimating(false);
    if (view) setRouteView(view);
    setAnnouncement(view === 'people'
      ? 'Back to the map, showing how the people moved'
      : 'Back to the map');
    const idx = currentCityIdxRef.current;
    requestAnimationFrame(() => (view === 'people'
      ? peopleBtnRef.current
      : (dotRefs.current[idx] || boardBtnRef.current))?.focus({ preventScroll: true }));
  }, [isAnimating, collapseCity]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  const city = currentCityIdx >= 0 ? CITIES[currentCityIdx] : null;
  const routeLen = routeLengthRef.current;

  const getDotClass = (i: number) => {
    if (i < currentCityIdx) return 'city-dot visited';
    if (i === currentCityIdx) return 'city-dot current';
    if (i === currentCityIdx + 1) return 'city-dot next-stop';
    return 'city-dot';
  };

  return (
    <div style={{ background: 'var(--mg-bg)', minHeight: '100vh' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Josefin+Sans:wght@300;400;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow-x: hidden; }

        :root {
          --mg-gold: #C9A94E;
          --mg-gold-light: #E8D48B;
          --mg-gold-dim: #8B7535;
          --mg-burgundy: #6B1D2A;
          --mg-burgundy-deep: #4A0E1C;
          --mg-burgundy-light: #8B2D3A;
          --mg-bg: #0A0A0A;
          --mg-text: #E8E0D0;
          --mg-text-dim: #8A8070;
        }

        /* === NAV === */
        .mg-nav {
          position: fixed; top: 32px; left: 32px; z-index: 1000;
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
          font-family: 'Cormorant Garamond', 'Playfair Display', serif;
          transition: all 0.3s ease; cursor: pointer;
        }
        .mg-nav:hover .mg-nav-label, .mg-nav:focus-visible .mg-nav-label { opacity: 1; max-width: 150px; }
        .mg-nav:hover .mg-nav-arrow, .mg-nav:focus-visible .mg-nav-arrow { transform: translateX(-4px); }
        .mg-nav-text { font-size: 28px; font-weight: 300; color: #525252; }
        .mg-nav-arrow { font-size: 16px; color: #7D8471; transition: all 0.3s ease; }
        .mg-nav-label {
          font-size: 13px; font-style: italic; color: #7D8471;
          opacity: 0; max-width: 0; overflow: hidden; white-space: nowrap;
          transition: all 0.4s ease;
        }

        /* === HEADER === */
        .mg-header { text-align: center; padding: 24px 20px 0; }
        .mg-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(20px, 4vw, 32px); font-weight: 900;
          color: var(--mg-gold); letter-spacing: 3px;
          text-transform: uppercase;
          text-shadow: 0 0 40px rgba(201,169,78,0.3);
        }
        .mg-header .mg-subtitle {
          font-family: 'Playfair Display', serif;
          font-size: clamp(12px, 2vw, 15px);
          font-style: italic; color: var(--mg-text-dim);
          margin-top: 4px; font-weight: 300;
        }

        /* === MAIN 3-COL LAYOUT === */
        .mg-main-layout {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 24px;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }
        .mg-left-col {
          flex: 0 0 280px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-right: 24px;
        }
        .mg-right-col {
          flex: 0 0 280px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding-left: 24px;
        }
        .mg-intro {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 15px; line-height: 1.85;
          color: var(--mg-text-dim); font-weight: 300;
        }
        .mg-intro em { color: var(--mg-gold-light); font-style: normal; }
        .mg-journey-prompt { text-align: center; }
        .mg-prompt-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px; letter-spacing: 4px;
          text-transform: uppercase;
          color: #94803B; font-weight: 600;
          margin-bottom: 12px;
        }
        .mg-prompt-text {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 13px; line-height: 1.8;
          color: var(--mg-text-dim); font-weight: 300;
          margin-bottom: 24px;
        }
        .mg-prompt-text em { color: var(--mg-gold-light); font-style: normal; }

        .mg-map-container {
          flex: 1;
          padding: 0;
          display: flex; align-items: center; justify-content: center;
          width: 100%;
          min-height: 0;
          min-width: 0;
        }
        .mg-map-svg-wrap {
          width: 100%; max-width: 100%;
          overflow: visible;
        }
        .mg-map-svg-wrap svg {
          width: 100%; height: auto; display: block;
          max-height: calc(100vh - 140px);
          transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Route */
        .mg-route-path { stroke: var(--mg-gold); stroke-width: 3; fill: none; opacity: 0.35; filter: drop-shadow(0 0 6px rgba(201,169,78,0.2)); }
        .mg-route-traveled { stroke: var(--mg-gold); stroke-width: 3.5; fill: none; opacity: 0.8; filter: drop-shadow(0 0 10px rgba(201,169,78,0.4)); }
        .mg-route-chevrons { opacity: 0.15; }
        .mg-water { fill: rgba(201,169,78,0.015); stroke: rgba(201,169,78,0.04); stroke-width: 0.5; }
        .mg-state-outline { fill: none; stroke: rgba(201,169,78,0.04); stroke-width: 0.5; }

        /* City dots — each city has its own color from CITY_COLORS applied inline */
        .city-dot { cursor: pointer; outline: none; }
        .city-dot:focus-visible .mg-dot-outer { stroke: #a8d5e5; stroke-width: 3; }
        .city-dot:focus-visible .mg-dot-inner { stroke: #a8d5e5; stroke-width: 1; }
        .mg-dot-outer { stroke-width: 2; transition: all 0.4s ease; }
        .mg-dot-inner { transition: all 0.4s ease; }
        .city-dot.visited .mg-dot-outer { opacity: 0.7; }
        .city-dot.visited .mg-dot-inner { opacity: 0.7; }
        .city-dot.current .mg-dot-outer { filter: drop-shadow(0 0 16px var(--dot-glow, rgba(201,169,78,0.5))); }
        .city-dot.next-stop .mg-dot-outer { animation: mg-next-pulse 2s ease-in-out infinite; }
        @keyframes mg-next-pulse {
          0%, 100% { filter: drop-shadow(0 0 6px var(--dot-glow, rgba(107,29,42,0.3))); }
          50% { filter: drop-shadow(0 0 18px var(--dot-glow, rgba(107,29,42,0.7))); }
        }
        .mg-city-label {
          font-family: 'Josefin Sans', sans-serif; font-size: 12px;
          letter-spacing: 2px; text-transform: uppercase;
          font-weight: 600;
          pointer-events: none; transition: fill 0.3s;
        }

        /* Board button */
        .mg-board-btn {
          font-family: 'Josefin Sans', sans-serif; font-size: 11px;
          letter-spacing: 3px; text-transform: uppercase; font-weight: 600;
          padding: 14px 36px; border: 1.5px solid var(--mg-burgundy);
          background: rgba(107,29,42,0.15); color: var(--mg-gold);
          cursor: pointer; transition: all 0.3s; border-radius: 4px;
          -webkit-tap-highlight-color: transparent;
        }
        .mg-board-btn:hover { background: rgba(107,29,42,0.3); border-color: var(--mg-gold-dim); }

        /* === EXPAND CIRCLE === */
        .mg-expand-bg {
          position: fixed; border-radius: 50%;
          z-index: 199;
          pointer-events: none; width: 20px; height: 20px;
        }
        .mg-expand-bg.positioned { display: block; }
        .mg-expand-bg.expanded {
          transition: width 2s cubic-bezier(0.4, 0, 0.2, 1),
                      height 2s cubic-bezier(0.4, 0, 0.2, 1),
                      top 2s cubic-bezier(0.4, 0, 0.2, 1),
                      left 2s cubic-bezier(0.4, 0, 0.2, 1),
                      border-radius 2s cubic-bezier(0.4, 0, 0.2, 1),
                      background 1s ease 0.6s;
          border-radius: 0; top: 0 !important; left: 0 !important;
          width: 100vw !important; height: 100vh !important;
        }

        /* === CITY VIEW === */
        .mg-city-view {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          z-index: 200; overflow-y: auto; -webkit-overflow-scrolling: touch;
        }
        .mg-city-content {
          position: relative; z-index: 201; min-height: 100vh;
          background: var(--mg-burgundy-deep);
          opacity: 0; transition: opacity 0.5s ease 0.4s;
        }
        .mg-city-content.visible { opacity: 1; }

        .mg-city-photo-wrap { width: 100%; height: 65vh; min-height: 400px; position: relative; overflow: hidden; }
        .mg-city-photo {
          width: 100%; height: 100%; object-fit: cover;
          filter: sepia(15%); transition: all 1.2s ease;
        }
        .mg-city-photo-placeholder {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(135deg, var(--mg-burgundy-deep) 0%, var(--mg-burgundy) 50%, var(--mg-burgundy-deep) 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif; font-size: 14px;
          font-style: italic; color: rgba(201,169,78,0.3);
        }
        .mg-city-photo-overlay {
          position: absolute; bottom: 0; left: 0; right: 0; height: 60%;
          background: linear-gradient(transparent, var(--mg-burgundy-deep));
          pointer-events: none;
        }
        .mg-city-station-badge {
          position: absolute; top: 24px; right: 24px;
          background: color-mix(in srgb, var(--mg-burgundy-deep) 80%, transparent);
          border: 1px solid color-mix(in srgb, var(--mg-gold) 30%, transparent);
          padding: 8px 16px; font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
          color: var(--mg-gold); font-weight: 600;
          backdrop-filter: blur(8px); border-radius: 3px;
        }
        .mg-city-photo-credit {
          position: relative; z-index: 6;
          padding: 16px 28px;
          max-width: 960px; margin: 0 auto;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 13px; line-height: 1.7;
          color: rgba(232,224,208,0.6); font-style: italic; font-weight: 300;
          background: color-mix(in srgb, var(--mg-burgundy-deep) 60%, transparent);
          border-bottom: 1px solid rgba(232,224,208,0.06);
        }
        .mg-city-body { padding: 32px 28px 40px; max-width: 960px; margin: 0 auto; position: relative; z-index: 5; }
        .mg-city-stop-number {
          font-family: 'Josefin Sans', sans-serif; font-size: 10px;
          letter-spacing: 4px; text-transform: uppercase;
          color: var(--mg-gold); font-weight: 600; margin-bottom: 8px;
        }
        .mg-city-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 6vw, 42px); font-weight: 900;
          color: var(--mg-gold); line-height: 1.1; margin-bottom: 4px;
          text-shadow: 0 0 30px rgba(201,169,78,0.2);
        }
        .mg-city-period {
          font-family: 'Playfair Display', serif; font-size: 14px;
          font-style: italic; color: var(--mg-gold); margin-bottom: 24px;
        }
        .mg-city-text {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px; line-height: 1.9;
          color: rgba(232,224,208,0.8); font-weight: 300;
        }

        .mg-city-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-top: 28px;
        }
        .mg-city-col-left { display: flex; flex-direction: column; gap: 28px; }
        .mg-city-col-right { display: flex; flex-direction: column; gap: 24px; }

        /* Music player */
        .mg-city-music {
          background: rgba(201,169,78,0.05); border: 1px solid rgba(201,169,78,0.12);
          border-radius: 8px; padding: 18px 22px;
          display: flex; align-items: center; gap: 14px;
        }
        .mg-city-music-play {
          width: 48px; height: 48px; border-radius: 50%;
          border: 1.5px solid var(--mg-gold-dim); background: rgba(201,169,78,0.08);
          color: var(--mg-gold); font-size: 18px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .mg-city-music-play:hover { border-color: var(--mg-gold); background: rgba(201,169,78,0.15); }
        .mg-city-music-play.playing {
          border-color: var(--mg-gold); background: rgba(201,169,78,0.2);
          animation: mg-music-pulse 2s ease-in-out infinite;
        }
        @keyframes mg-music-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(201,169,78,0.1); }
          50% { box-shadow: 0 0 22px rgba(201,169,78,0.3); }
        }
        .mg-city-music-info { flex: 1; min-width: 0; }
        .mg-sound-toggle {
          position: absolute; top: 24px; left: 24px; z-index: 3;
          font-family: 'Josefin Sans', sans-serif; font-size: 10px;
          letter-spacing: 3px; text-transform: uppercase; font-weight: 600;
          padding: 8px 16px; border-radius: 3px; cursor: pointer;
          backdrop-filter: blur(8px);
          background: color-mix(in srgb, var(--mg-burgundy-deep) 80%, transparent);
          border: 1px solid color-mix(in srgb, var(--mg-gold) 30%, transparent);
          color: var(--mg-gold);
          -webkit-tap-highlight-color: transparent;
        }
        .mg-sound-toggle:hover { border-color: var(--mg-gold); }
        .mg-city-name:focus { outline: none; }
        @media (prefers-reduced-motion: reduce) {
          .mg-map-svg-wrap svg { transition: none; }
          .city-dot.next-stop .mg-dot-outer, .mg-city-music-play.playing { animation: none; }
        }
        .mg-city-music-title { font-family: 'Playfair Display', serif; font-size: 15px; color: var(--mg-gold-light); font-style: italic; }
        .mg-city-music-artist { font-family: 'Josefin Sans', sans-serif; font-size: 11px; color: rgba(232,224,208,0.78); margin-top: 3px; font-weight: 300; }
        .mg-city-music-year { font-family: 'Josefin Sans', sans-serif; font-size: 10px; color: rgba(232,224,208,0.7); margin-top: 2px; font-weight: 300; letter-spacing: 1px; }

        /* Quote */
        .mg-city-quote { text-align: center; padding: 24px 0; border-top: 1px solid rgba(201,169,78,0.08); }
        .mg-city-quote .mg-quote-text {
          font-family: 'Playfair Display', serif;
          font-size: clamp(16px, 3vw, 20px);
          font-style: italic; color: var(--mg-gold-light);
          line-height: 1.6; font-weight: 300;
        }
        .mg-city-quote cite {
          display: block; margin-top: 10px;
          font-family: 'Josefin Sans', sans-serif; font-size: 10px;
          letter-spacing: 3px; text-transform: uppercase;
          color: var(--mg-gold); font-style: normal;
        }

        /* Train ticket */
        .mg-train-ticket {
          display: block; width: 100%; font: inherit; color: inherit;
          background: rgba(201,169,78,0.04); border: 1.5px solid rgba(201,169,78,0.2);
          border-radius: 8px; padding: 24px; text-align: center;
          cursor: pointer; transition: all 0.3s; position: relative;
          overflow: hidden; -webkit-tap-highlight-color: transparent;
        }
        .mg-train-ticket:hover { border-color: var(--mg-gold); background: rgba(201,169,78,0.08); }
        .mg-train-ticket::before, .mg-train-ticket::after {
          content: ''; position: absolute; width: 20px; height: 20px;
          background: var(--mg-burgundy-deep); border-radius: 50%;
          top: 50%; transform: translateY(-50%);
        }
        .mg-train-ticket::before { left: -10px; }
        .mg-train-ticket::after { right: -10px; }
        .mg-ticket-label { font-family: 'Josefin Sans', sans-serif; font-size: 9px; letter-spacing: 4px; text-transform: uppercase; color: var(--mg-gold); font-weight: 600; margin-bottom: 6px; }
        .mg-ticket-destination { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--mg-gold); font-weight: 700; margin-bottom: 4px; }
        .mg-ticket-line { width: 40px; height: 1px; background: var(--mg-gold-dim); margin: 10px auto; }
        .mg-ticket-action { font-family: 'Josefin Sans', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--mg-gold); font-weight: 600; }

        /* Final arrival */
        .mg-arrival-ticket { text-align: center; padding: 32px 24px; }
        .mg-arrival-ticket .mg-ticket-destination {
          font-family: 'Playfair Display', serif; font-size: 16px; font-style: italic;
          color: var(--mg-gold); margin-bottom: 12px; font-weight: 400;
        }
        .mg-arrival-links { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .mg-arrival-link {
          font-family: 'Josefin Sans', sans-serif; font-size: 10px;
          letter-spacing: 3px; text-transform: uppercase; font-weight: 600;
          padding: 12px 20px; border: 1px solid var(--mg-gold-dim);
          background: transparent; color: var(--mg-gold); cursor: pointer;
          transition: all 0.3s; border-radius: 4px;
          -webkit-tap-highlight-color: transparent;
        }
        .mg-arrival-link:hover { background: rgba(201,169,78,0.1); border-color: var(--mg-gold); }

        /* Music or people: which story the map tells */
        .mg-view-toggle {
          display: inline-flex; flex-wrap: wrap; justify-content: center;
          margin-top: 14px; padding: 3px; gap: 3px;
          border: 1px solid rgba(201,169,78,0.35); border-radius: 999px;
        }
        .mg-view-btn {
          font-family: 'Josefin Sans', sans-serif; font-size: 10px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          min-height: 32px; padding: 8px 16px; border: none; border-radius: 999px;
          background: transparent; color: var(--mg-text); cursor: pointer;
          transition: background 0.3s, color 0.3s;
        }
        .mg-view-btn:hover { background: rgba(201,169,78,0.12); }
        .mg-view-btn[aria-pressed='true'] { background: var(--mg-gold); color: var(--mg-bg); }
        .mg-view-btn:focus-visible, .mg-pace-btn:focus-visible, .mg-skip-btn:focus-visible,
        .mg-board-btn:focus-visible, .mg-arrival-link:focus-visible, .mg-return-map:focus-visible,
        .mg-train-ticket:focus-visible { outline: 2px solid #a8d5e5; outline-offset: 3px; }
        .mg-music-dim { opacity: 0.3; }

        .mg-pace-btn {
          display: block; margin: 16px auto 0; min-height: 32px; padding: 6px 14px;
          font-family: 'Josefin Sans', sans-serif; font-size: 11px; letter-spacing: 1px;
          background: none; border: 1px solid rgba(201,169,78,0.3); border-radius: 4px;
          color: rgba(232,224,208,0.8); cursor: pointer;
        }
        .mg-pace-btn[aria-pressed='true'] { border-color: var(--mg-gold); color: var(--mg-gold-light); }

        .mg-people-key { max-width: 280px; }
        .mg-people-key ul { list-style: none; display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }
        .mg-people-key li {
          display: flex; gap: 10px; align-items: flex-start;
          font-family: 'Josefin Sans', sans-serif; font-size: 13px; line-height: 1.6;
          color: rgba(232,224,208,0.75); font-weight: 300;
        }
        .mg-people-key strong { color: var(--mg-text); font-weight: 600; }
        .mg-key-swatch { flex: none; width: 22px; height: 4px; border-radius: 2px; margin-top: 9px; }
        .mg-key-music {
          background: repeating-linear-gradient(90deg, var(--mg-gold) 0 5px, transparent 5px 9px);
        }

        .mg-skip-btn {
          position: fixed; left: 50%; bottom: 32px; transform: translateX(-50%); z-index: 300;
          font-family: 'Josefin Sans', sans-serif; font-size: 11px; font-weight: 600;
          letter-spacing: 3px; text-transform: uppercase;
          padding: 12px 24px; min-height: 44px; border-radius: 999px; cursor: pointer;
          background: rgba(10,10,10,0.9); border: 1.5px solid var(--mg-gold); color: var(--mg-gold);
        }
        .mg-skip-btn:hover { background: rgba(201,169,78,0.15); }

        .mg-city-music-note {
          font-family: 'Josefin Sans', sans-serif; font-size: 12px; line-height: 1.7;
          font-style: italic; font-weight: 300; color: rgba(232,224,208,0.75);
          margin-top: -12px;
        }

        .mg-reflect { text-align: left; margin: 0 0 24px; }
        .mg-reflect-label {
          font-family: 'Josefin Sans', sans-serif; font-size: 10px; letter-spacing: 4px;
          text-transform: uppercase; color: var(--mg-gold); font-weight: 600; margin-bottom: 8px;
        }
        .mg-reflect p {
          font-family: 'Josefin Sans', sans-serif; font-size: 14px; line-height: 1.8;
          color: rgba(232,224,208,0.85); font-weight: 300;
        }

        .mg-footer {
          text-align: center; padding: 8px 20px 16px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; color: var(--mg-text-dim);
          letter-spacing: 2px; font-weight: 300;
        }

        /* Return to map link in city view */
        .mg-return-map {
          display: block; margin: 16px auto 0;
          background: none; border: none; cursor: pointer;
          font-family: 'Josefin Sans', sans-serif; font-size: 11px;
          letter-spacing: 2px; color: var(--mg-gold);
          transition: all 0.3s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .mg-return-map:hover { color: var(--mg-gold); }

        @media (max-width: 1100px) {
          .mg-left-col { flex: 0 0 220px; }
          .mg-right-col { flex: 0 0 220px; }
          .mg-intro { font-size: 13px; }
          .mg-prompt-text { font-size: 12px; }
        }
        @media (max-width: 900px) {
          .mg-main-layout {
            flex-direction: column;
            padding: 0 24px;
            gap: 8px;
          }
          .mg-left-col {
            flex: none;
            padding: 0;
            max-width: 500px;
            text-align: center;
          }
          .mg-right-col {
            flex: none;
            padding: 0;
          }
          .mg-map-container { flex: none; }
          .mg-map-svg-wrap svg { max-height: 50vh; }
        }
        @media (max-width: 768px) {
          .mg-nav { left: 20px; top: 20px; }
          .mg-nav-text { font-size: 24px; }
          /* Clear the back link, which sits over the title on a phone. */
          .mg-header { padding-top: 64px; }
          .mg-people-key { max-width: 500px; }
          /* Room for the city's last buttons to scroll clear of the Map button. */
          .mg-city-body { padding-bottom: 96px; }
        }
        @media (max-width: 480px) {
          .mg-view-toggle { flex-wrap: nowrap; }
          .mg-view-btn { letter-spacing: 0.5px; padding: 8px 10px; }
        }
        @media (max-width: 768px) {
          .mg-city-columns { grid-template-columns: 1fr; gap: 24px; }
        }
        @media (max-width: 600px) {
          .mg-city-body { padding: 16px 20px 32px; }
          .mg-city-name { font-size: 28px; }
          .mg-city-text { font-size: 13px; }
          .mg-city-photo-wrap { height: 45vh; min-height: 260px; }
          .mg-city-photo-credit { padding: 10px 20px; font-size: 10px; }
          .mg-city-station-badge { top: 16px; right: 16px; padding: 6px 12px; font-size: 9px; }
          .mg-sound-toggle { top: 16px; left: 16px; padding: 6px 12px; font-size: 9px; }
          .mg-train-ticket { padding: 20px; }
          .mg-ticket-destination { font-size: 18px; }
        }
      `}</style>

      {/* Hidden audio */}
      <audio ref={trainAudioRef} preload="auto" src={AUDIO_BASE + 'train.mp3'} />

      {/* Expanding circle — starts as city color from the dot, fades to dark bg */}
      {expandState !== 'hidden' && (
        <div
          className={`mg-expand-bg ${expandState}`}
          style={{
            ...(expandState === 'positioned' ? {
              left: expandOrigin.x - 10, top: expandOrigin.y - 10,
              width: 20, height: 20, display: 'block',
            } : {}),
            background: currentCityIdx >= 0
              ? (expandState === 'positioned'
                ? CITY_COLORS[currentCityIdx].main
                : CITY_COLORS[currentCityIdx].bg)
              : undefined,
          }}
        />
      )}

      {/* === MAP VIEW === */}
      <div style={srOnly} aria-live="polite" role="status">{announcement}</div>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} inert={cityViewOpen}>
        <ExhibitionNav className="mg-nav" href="/exhibitions/harlem-renaissance/artifacts" style={{ display: cityViewOpen ? 'none' : 'flex' }}>
          <span className="mg-nav-text" aria-hidden="true">M</span>
          <span className="mg-nav-arrow" aria-hidden="true">{'\u2190'}</span>
          <span className="mg-nav-label">Collection</span>
        </ExhibitionNav>

        <div className="mg-header">
          <h1>The Great Migration</h1>
          <div className="mg-subtitle">{routeView === 'music' ? 'Follow the Music North' : 'Follow the People North'}</div>
          <div className="mg-view-toggle" role="group" aria-label="What the map shows">
            <button type="button" className="mg-view-btn" aria-pressed={routeView === 'music'} onClick={() => chooseView('music')}>
              How the music moved
            </button>
            <button type="button" ref={peopleBtnRef} className="mg-view-btn" aria-pressed={routeView === 'people'} onClick={() => chooseView('people')}>
              How the people moved
            </button>
          </div>
        </div>

        <div className="mg-main-layout">
          <div className="mg-left-col">
            {routeView === 'music' ? (
              <div className="mg-intro">
                Between 1910 and 1940, over <em>1.5 million</em> African Americans left the rural South
                and traveled north, carrying their music with them. This journey follows the music
                &mdash; from the cotton fields of the Mississippi Delta, up the river to Chicago, and
                on to the stages of Harlem.
              </div>
            ) : (
              <div className="mg-intro">
                Most of the people who built Harlem did <em>not</em> come by way of Chicago. They
                came up the Atlantic coast &mdash; from Virginia, the Carolinas, Georgia, and
                Florida &mdash; on the railroad lines that ran north along the seaboard. People
                mostly took the line nearest home; the music took every road.
              </div>
            )}
          </div>

          <div className="mg-map-container">
          <div className="mg-map-svg-wrap">
            <svg ref={svgRef} viewBox="0 0 700 620" xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: `scale(${mapZoom.scale})`,
                transformOrigin: `${mapZoom.originX}% ${mapZoom.originY}%`,
              }}>
              {/* Geography */}
              <path d="M310,570 Q300,500 290,450 Q285,400 295,350 Q305,300 300,250 Q290,200 285,150 Q280,100 275,60" className="mg-water" strokeWidth="7" opacity="0.3" />
              <ellipse cx="420" cy="130" rx="75" ry="35" className="mg-water" />
              <path d="M230,480 L340,480 L340,580 L230,580 Z" className="mg-state-outline" />
              <path d="M200,570 L340,570 L360,620 L180,620 Z" className="mg-state-outline" />
              <path d="M200,370 L420,370 L420,420 L200,420 Z" className="mg-state-outline" />
              <path d="M200,270 L360,270 L360,370 L200,370 Z" className="mg-state-outline" />
              <path d="M310,150 L400,150 L400,300 L310,300 Z" className="mg-state-outline" />

              {/* Route paths */}
              <g className={routeView === 'people' ? 'mg-music-dim' : undefined}>
              <path ref={routePathRef} d={ROUTE_PATH} className="mg-route-path" />
              <path
                d={ROUTE_PATH}
                className="mg-route-traveled"
                style={{
                  strokeDasharray: routeLen || 1000,
                  strokeDashoffset: (routeLen || 1000) * traveledOffset,
                  transition: travelTransition ? 'stroke-dashoffset 0.5s ease' : 'none',
                }}
              />

              {/* Chevrons */}
              <g className="mg-route-chevrons" fill="none" stroke="var(--mg-gold)" strokeWidth="1">
                <path d="M295,490 l5,-7 l5,7" />
                <path d="M287,420 l5,-7 l5,7" />
                <path d="M278,340 l5,-7 l5,7" />
                <path d="M325,245 l5,-7 l5,7" />
                <path d="M365,160 l5,-6 l6,4" />
                <path d="M470,95 l6,-4 l3,6" />
                <path d="M555,50 l7,-3 l2,6" />
              </g>
              </g>

              {/* How the people moved: the two main railroad streams */}
              {routeView === 'people' && (
                <g aria-hidden="true">
                  {PEOPLE_ROUTES.map((r) => (
                    <path key={r.id} d={r.path} fill="none" stroke={r.color} strokeWidth="3.5"
                      strokeLinecap="round" opacity="0.9" className="mg-people-route" />
                  ))}
                  {PEOPLE_PLACES.map((pl) => (
                    <g key={pl.name}>
                      <circle cx={pl.x} cy={pl.y} r="5" fill={PEOPLE_ROUTES[0].color} />
                      <text className="mg-city-label" x={pl.anchor === 'start' ? pl.x + 14 : pl.x - 14} y={pl.y + 4}
                        textAnchor={pl.anchor} fill={PEOPLE_ROUTES[0].color}>{pl.name}</text>
                    </g>
                  ))}
                </g>
              )}

              {/* Train icon */}
              {trainVisible && (
                <g transform={`translate(${trainPos.x},${trainPos.y})`} filter="url(#mgTrainGlow)">
                  <circle r="10" fill="var(--mg-gold)" opacity="0.9" />
                  <circle r="5" fill="var(--mg-bg)" />
                </g>
              )}

              <defs>
                <filter id="mgTrainGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* City dots */}
              {CITIES.map((c, i) => {
                const cc = CITY_COLORS[i];
                return (
                <g key={c.id} className={getDotClass(i)} onClick={() => {
                  if (routeView === 'music' && i <= currentCityIdx) expandCity(i);
                }}
                  ref={(el) => { dotRefs.current[i] = el; }}
                  role="button"
                  tabIndex={routeView === 'music' && i <= currentCityIdx ? 0 : -1}
                  aria-hidden={routeView === 'people' ? true : undefined}
                  aria-disabled={i <= currentCityIdx ? undefined : true}
                  aria-label={`${DOT_LABELS[c.id] ?? c.name}, stop ${i + 1}${i <= currentCityIdx ? '' : ', not yet reached'}`}
                  onKeyDown={activateOnKey(() => { if (routeView === 'music' && i <= currentCityIdx) expandCity(i); })}
                  style={{ '--dot-glow': `${cc.main}88` } as React.CSSProperties}>
                  <circle className="mg-dot-outer" cx={c.cx} cy={c.cy} r="14"
                    fill={cc.dim} stroke={cc.main} />
                  <circle className="mg-dot-inner" cx={c.cx} cy={c.cy} r="8"
                    fill={cc.main} />
                  {c.id === 'delta' && (<>
                    <text className="mg-city-label" x={c.cx - 40} y={c.cy + 22} textAnchor="end" fill={cc.dim}>Mississippi{' '}</text>
                    <text className="mg-city-label" x={c.cx - 40} y={c.cy + 36} textAnchor="end" fill={cc.dim}>Delta</text>
                  </>)}
                  {c.id === 'new-orleans' && (<>
                    <text className="mg-city-label" x={c.cx + 36} y={c.cy - 5} fill={cc.dim}>New{' '}</text>
                    <text className="mg-city-label" x={c.cx + 36} y={c.cy + 9} fill={cc.dim}>Orleans</text>
                  </>)}
                  {c.id === 'memphis' && (
                    <text className="mg-city-label" x={c.cx - 44} y={c.cy + 4} textAnchor="end" fill={cc.dim}>Memphis</text>
                  )}
                  {c.id === 'st-louis' && (
                    <text className="mg-city-label" x={c.cx - 44} y={c.cy + 4} textAnchor="end" fill={cc.dim}>St. Louis</text>
                  )}
                  {c.id === 'chicago' && (
                    <text className="mg-city-label" x={c.cx - 44} y={c.cy - 4} textAnchor="end" fill={cc.dim}>Chicago</text>
                  )}
                  {c.id === 'harlem' && (
                    <text className="mg-city-label" x={c.cx - 44} y={c.cy - 6} textAnchor="end" fill={cc.dim}>Harlem</text>
                  )}
                </g>
                );
              })}
            </svg>
          </div>
        </div>

          <div className="mg-right-col">
            {routeView === 'music' ? (
              <div className="mg-journey-prompt">
                <div className="mg-prompt-label">Your Journey</div>
                <p className="mg-prompt-text">
                  Board the train and <em>ride from stop to stop</em> {'\u2014'} hear the music,
                  see the photographs, and trace the path the music took north.
                </p>
                <button ref={boardBtnRef} className="mg-board-btn" onClick={startJourney}>
                  {'\u25C6'} Begin in the Delta {'\u25C6'}
                </button>
                <button type="button" className="mg-pace-btn" aria-pressed={quickTrips} onClick={toggleQuickTrips}>
                  Quick trips between stops: {quickTrips ? 'on' : 'off'}
                </button>
              </div>
            ) : (
              <div className="mg-people-key">
                <div className="mg-prompt-label">Map Key</div>
                <ul>
                  {PEOPLE_ROUTES.map((r) => (
                    <li key={r.id}>
                      <span className="mg-key-swatch" style={{ background: r.color }} aria-hidden="true" />
                      <span><strong>{r.label}.</strong> {r.detail}</span>
                    </li>
                  ))}
                  <li>
                    <span className="mg-key-swatch mg-key-music" aria-hidden="true" />
                    <span><strong>How the music moved.</strong> The journey on this map, by river, rail, and road.</span>
                  </li>
                </ul>
                <button type="button" className="mg-board-btn" onClick={() => chooseView('music')}>
                  {'\u25C6'} Follow the Music {'\u25C6'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mg-footer">
          The Mini Museum &mdash; Harlem Renaissance Exhibition
        </div>
      </div>

      {/* Skip control while the train is moving between stops */}
      {traveling && (
        <button type="button" ref={skipBtnRef} className="mg-skip-btn" onClick={skipRide}>
          Skip the ride <span aria-hidden="true">{'\u25B8\u25B8'}</span>
        </button>
      )}

      {/* === CITY VIEW === */}
      {cityViewOpen && city && (
        <div className="mg-city-view" ref={cityViewRef} role="region" aria-labelledby="mg-city-name">
          <div className={`mg-city-content ${cityContentVisible ? 'visible' : ''}`} style={{
              '--mg-gold': CITY_COLORS[currentCityIdx].main,
              '--mg-gold-light': CITY_COLORS[currentCityIdx].light,
              '--mg-gold-dim': CITY_COLORS[currentCityIdx].dim,
              '--mg-burgundy-deep': CITY_COLORS[currentCityIdx].bg,
            } as React.CSSProperties}>
            <div className="mg-city-photo-wrap">
              {!photoLoaded && (
                <div className="mg-city-photo-placeholder">Photograph loading&hellip;</div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="mg-city-photo"
                src={PHOTO_BASE + city.photo}
                alt={city.photoAlt}
                style={{ opacity: photoLoaded ? 1 : 0, position: photoLoaded ? 'relative' : 'absolute' }}
                onLoad={() => setPhotoLoaded(true)}
                onError={() => setPhotoLoaded(false)}
              />
              <div className="mg-city-photo-overlay" />
              <button type="button" className="mg-sound-toggle" onClick={toggleSound}>
                {soundOn ? '\u266A Turn music off' : '\u266A Turn music on'}
              </button>
              <div className="mg-city-station-badge">Stop {currentCityIdx + 1} of 6</div>
            </div>

            <div className="mg-city-photo-credit">{city.photoCredit}</div>

            <div className="mg-city-body">
              <div className="mg-city-stop-number">Stop {currentCityIdx + 1}</div>
              <h2 className="mg-city-name" id="mg-city-name" tabIndex={-1} ref={cityHeadingRef}>{city.name}</h2>
              <div className="mg-city-period">{city.period}</div>

              <div className="mg-city-columns">
                <div className="mg-city-col-left">
                  <div className="mg-city-text">{city.text}</div>
                  <figure className="mg-city-quote">
                    {city.quote.paraphrase ? (
                      <p className="mg-quote-text">{city.quote.text}</p>
                    ) : (
                      <blockquote className="mg-quote-text">{'\u201C'}{city.quote.text}{'\u201D'}</blockquote>
                    )}
                    <figcaption><cite>{'\u2014'} {city.quote.author}</cite></figcaption>
                  </figure>
                </div>

                <div className="mg-city-col-right">
                  <div className="mg-city-music">
                    <button
                      type="button"
                      className={`mg-city-music-play ${musicPlaying ? 'playing' : ''}`}
                      onClick={toggleMusic}
                      aria-label={`Play ${city.music.title}`}
                      aria-pressed={musicPlaying}
                    >
                      <span aria-hidden="true">{musicPlaying ? '\u23F8' : '\u25B6'}</span>
                    </button>
                    <div className="mg-city-music-info">
                      <div className="mg-city-music-title">{city.music.title}</div>
                      <div className="mg-city-music-artist">{city.music.artist}</div>
                      <div className="mg-city-music-year">{city.music.year}</div>
                    </div>
                  </div>
                  {city.music.note && <p className="mg-city-music-note">{city.music.note}</p>}

                  {currentCityIdx < CITIES.length - 1 ? (<>
                    <button type="button" className="mg-train-ticket" onClick={boardToNext}>
                      <span className="mg-ticket-label" style={{ display: 'block' }}>Next Stop</span>
                      <span className="mg-ticket-destination" style={{ display: 'block' }}>{CITIES[currentCityIdx + 1].name}</span>
                      <span className="mg-ticket-line" style={{ display: 'block' }} />
                      <span className="mg-ticket-action" style={{ display: 'block' }}><span aria-hidden="true">{'\u25C6'}</span> Board the Train <span aria-hidden="true">{'\u25C6'}</span></span>
                    </button>
                    <button type="button" className="mg-pace-btn" aria-pressed={quickTrips} onClick={toggleQuickTrips}>
                      Quick trips between stops: {quickTrips ? 'on' : 'off'}
                    </button>
                    <button className="mg-return-map" onClick={() => backToMap()}>
                      {'\u2190'} Return to Map
                    </button>
                  </>) : (
                    <div className="mg-arrival-ticket">
                      <div className="mg-ticket-label">You Have Arrived</div>
                      <div className="mg-ticket-destination">The music made it. So did the people.</div>
                      <div className="mg-ticket-line" />
                      <div className="mg-reflect">
                        <h3 className="mg-reflect-label">Think About It</h3>
                        <p>
                          Most of the people who built Harlem came up the Atlantic coast, but much of
                          its music came by way of New Orleans and Chicago. Why might a song travel a
                          different road from the people who sing it? What carries music from place
                          to place today?
                        </p>
                      </div>
                      <div className="mg-arrival-links">
                        <button className="mg-arrival-link" onClick={() => backToMap('people')}>See How the People Moved</button>
                        <button className="mg-arrival-link" onClick={restartJourney}>Make the Journey Again</button>
                        <button className="mg-arrival-link" onClick={() => backToMap()}>View Map</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
