'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import { srOnly, activateOnKey, prefersReducedMotion } from '@/lib/a11y';
import { CITIES } from './cities';
import { MIGRATION_SOURCES } from './sources';
import { COAST_PLACES, CENTRAL_PATH, EAST_COAST_PATH, MUSIC_PATH, at, type LonLat } from './routes';
import { MAP_H, MAP_W, RIVERS, STATES } from './usMap';
import TicketPunch, { TicketStrip } from './TicketPunch';
import { EMPTY_TICKET, answerTicket, type TicketState } from './ticket';

const AUDIO_BASE = '/exhibitions/harlem/audio/migration/';
const PHOTO_BASE = '/exhibitions/harlem/images/migration/';

const CITY_COLORS = [
  { main: '#5CBFAA', light: '#8DD9C9', dim: '#3D8072', bg: '#0A1C18' },     // New Orleans — teal
  { main: '#D4A847', light: '#E8D48B', dim: '#8B7535', bg: '#1C1608' },     // Delta — warm gold
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

// The map: the states, the Mississippi and the Ohio (usMap.ts), with every
// stop and line placed by its real latitude and longitude (routes.ts).
const ROUTE_PATH = MUSIC_PATH;

/** Where each stop's name sits beside its dot, clear of its neighbours and the route. */
const DOT_LABEL_AT: Record<string, { dx: number; dy: number; anchor: 'start' | 'end'; lines?: string[] }> = {
  'new-orleans': { dx: 22, dy: 16, anchor: 'start', lines: ['New', 'Orleans'] },
  delta: { dx: -22, dy: 2, anchor: 'end', lines: ['Mississippi', 'Delta'] },
  memphis: { dx: 22, dy: 0, anchor: 'start' },
  'st-louis': { dx: -22, dy: 0, anchor: 'end' },
  chicago: { dx: -22, dy: -10, anchor: 'end' },
  harlem: { dx: -4, dy: -26, anchor: 'start' },
};

/** Names of the seas and the lake, to find your way. */
const WATER_LABELS: { name: string; at: LonLat }[] = [
  { name: 'Gulf of Mexico', at: [-89.6, 27.3] },
  { name: 'Atlantic Ocean', at: [-74.6, 33.6] },
  { name: 'Lake Michigan', at: [-86.95, 43.6] },
];

// ─── How the people moved ─────────────────────────────────────────
// The journey above follows the music. The people mostly took the railroad
// nearest home: up the Atlantic coast to Washington, Philadelphia and New
// York, or up the middle of the country to Chicago on the Illinois Central.

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

// Each named on the inland side of the line: the sea is on the other.
const PEOPLE_PLACES: { name: string; x: number; y: number; anchor: 'start' | 'end' }[] = COAST_PLACES.map((pl) => ({ name: pl.name, ...at(pl.at), anchor: 'end' }));

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
  // Punch your ticket: a stamp per city, earned from that city's panel.
  const [ticket, setTicket] = useState<TicketState>(EMPTY_TICKET);
  const [justStamped, setJustStamped] = useState<string | null>(null);
  const [lastWrong, setLastWrong] = useState<{ cityId: string; choice: string } | null>(null);
  const punch = useCallback((cityId: string, choice: string) => {
    const { state, correct } = answerTicket(ticket, cityId, choice);
    setTicket(state);
    if (correct) { setJustStamped(cityId); setLastWrong(null); }
    else setLastWrong({ cityId, choice });
  }, [ticket]);
  const skipRef = useRef(false);
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  const cityHeadingRef = useRef<HTMLHeadingElement>(null);
  const dotRefs = useRef<(SVGGElement | null)[]>([]);
  const boardBtnRef = useRef<HTMLButtonElement>(null);
  const peopleBtnRef = useRef<HTMLButtonElement>(null);

  const routePathRef = useRef<SVGPathElement>(null);
  const routeLengthRef = useRef(0);
  const [chevrons, setChevrons] = useState<{ x: number; y: number; angle: number }[]>([]);
  const cityPathPositionsRef = useRef<number[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const trainAudioRef = useRef<HTMLAudioElement | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cityViewRef = useRef<HTMLDivElement>(null);
  const currentCityIdxRef = useRef(-1);
  // False once the page has gone: the journey's timers can still fire after
  // the visitor leaves, and must not start a song nobody can stop.
  const aliveRef = useRef(true);

  // Keep ref in sync
  useEffect(() => { currentCityIdxRef.current = currentCityIdx; }, [currentCityIdx]);

  // Initialize route path positions
  useEffect(() => {
    const path = routePathRef.current;
    // (No measuring in a browser without layout, such as a test's.)
    if (!path || typeof path.getTotalLength !== 'function') return;
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
    // A chevron midway along the route between each stop and the next, pointing the way.
    setChevrons(positions.slice(1).map((t, k) => {
      const mid = ((positions[k] + t) / 2) * len;
      const a = path.getPointAtLength(mid);
      const b = path.getPointAtLength(Math.min(len, mid + 2));
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;
      return { x: Math.round(a.x * 10) / 10, y: Math.round(a.y * 10) / 10, angle: Math.round(angle) };
    }));
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
    if (!aliveRef.current) return;
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
      setJustStamped(null);
      setLastWrong(null);
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
    if (aliveRef.current && trainAudioRef.current && soundOnRef.current) {
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
        originX: (centerX / MAP_W) * 100,
        originY: (centerY / MAP_H) * 100,
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
    setTicket(EMPTY_TICKET);
    setJustStamped(null);
    setLastWrong(null);
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

  // Stop every sound on unmount, and when the page is hidden for good
  // (closing the tab, or going into the back-forward cache).
  useEffect(() => {
    aliveRef.current = true;
    const train = trainAudioRef.current;
    const silence = () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      train?.pause();
    };
    const onPageHide = () => { silence(); setMusicPlaying(false); };
    window.addEventListener('pagehide', onPageHide);
    return () => {
      aliveRef.current = false;
      window.removeEventListener('pagehide', onPageHide);
      silence();
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
          width: 100%; height: auto; display: block; margin: 0 auto;
          max-height: calc(100vh - 140px);
          transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          /* The map fades out at its edges, rather than stopping at a hard line. */
          -webkit-mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent), linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent);
          -webkit-mask-composite: source-in;
          mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent), linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent);
          mask-composite: intersect;
        }

        /* Route */
        .mg-route-path { stroke: var(--mg-gold); stroke-width: 3; fill: none; opacity: 0.35; filter: drop-shadow(0 0 6px rgba(201,169,78,0.2)); }
        .mg-route-traveled { stroke: var(--mg-gold); stroke-width: 3.5; fill: none; opacity: 0.8; filter: drop-shadow(0 0 10px rgba(201,169,78,0.4)); }
        .mg-route-chevrons { opacity: 0.55; }
        /* The map: dark land, faint state lines, the rivers in a muted blue, the seas left black */
        .mg-state { fill: #15130e; stroke: rgba(201,169,78,0.28); stroke-width: 0.7; stroke-linejoin: round; }
        .mg-river { fill: none; stroke: #3f6c86; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; opacity: 0.85; }
        .mg-water-label {
          font-family: 'Playfair Display', serif; font-style: italic; font-size: 12px;
          fill: #6f8fa3; letter-spacing: 1px; pointer-events: none;
        }

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
        /* Clear of the Sources and Map buttons in the bottom corners. */
        .mg-footer { padding-inline: 84px; }
        @media (max-width: 768px) {
          .mg-footer { padding-bottom: 84px; }
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
          /* The map is drawn small on a phone: its words larger, to stay readable. */
          .mg-city-label { font-size: 19px; letter-spacing: 1px; }
          .mg-water-label { font-size: 17px; }
          .mg-city-body { padding: 16px 20px 96px; }
          .mg-city-name { font-size: 28px; }
          .mg-city-text { font-size: 13px; }
          .mg-city-photo-wrap { height: 45vh; min-height: 260px; }
          .mg-city-photo-credit { padding: 10px 20px; font-size: 10px; }
          .mg-city-station-badge { top: 16px; right: 16px; padding: 6px 12px; font-size: 9px; }
          .mg-sound-toggle { top: 16px; left: 16px; padding: 6px 12px; font-size: 9px; }
          .mg-train-ticket { padding: 20px; }
          .mg-ticket-destination { font-size: 18px; }
        }
        /* === PUNCH YOUR TICKET === */
        .mg-punch {
          border: 1.5px dashed color-mix(in srgb, var(--mg-gold) 55%, transparent);
          border-radius: 10px;
          padding: 20px 22px 22px;
          background: color-mix(in srgb, var(--mg-gold) 6%, transparent);
        }
        .mg-punch-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: clamp(14px, 0.5vw + 10px, 17px);
          letter-spacing: 3px; text-transform: uppercase; font-weight: 700;
          color: var(--mg-gold); margin: 0 0 14px;
        }
        .mg-ticket-strip { margin: 0 0 16px; container-type: inline-size; }
        .mg-ticket-strip-title {
          font-family: 'Josefin Sans', sans-serif;
          font-size: clamp(14px, 0.4vw + 11px, 16px);
          color: var(--mg-text); margin: 0 0 10px;
          display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap;
        }
        .mg-ticket-strip-count { color: var(--mg-gold-light); font-weight: 600; }
        .mg-stamps {
          list-style: none; display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 6px; padding: 0; margin: 0;
        }
        .mg-stamp {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          text-align: center; min-width: 0;
        }
        .mg-stamp-mark {
          width: 44px; height: 44px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 2px dashed color-mix(in srgb, var(--stamp, #C9A94E) 50%, transparent);
          color: color-mix(in srgb, var(--mg-text) 70%, transparent);
          font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700;
        }
        .mg-stamp.on .mg-stamp-mark {
          border: 2px solid var(--stamp, #C9A94E);
          background: color-mix(in srgb, var(--stamp, #C9A94E) 28%, transparent);
          color: var(--stamp-light, #E8D48B);
          transform: rotate(-8deg);
          font-size: 22px;
        }
        .mg-stamp.fresh .mg-stamp-mark { animation: mg-stamp-in 0.5s cubic-bezier(0.3, 1.5, 0.5, 1) both; }
        @keyframes mg-stamp-in {
          0% { transform: scale(1.9) rotate(-24deg); opacity: 0; }
          100% { transform: scale(1) rotate(-8deg); opacity: 1; }
        }
        .mg-stamp-name {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 13px; line-height: 1.2; font-weight: 600;
          color: var(--mg-text);
        }
        /* Six stamps in a row where there is room; two rows of three where not. */
        @container (max-width: 370px) {
          .mg-stamps { grid-template-columns: repeat(3, minmax(0, 1fr)); row-gap: 12px; }
        }
        .mg-punch-q {
          font-family: 'Playfair Display', serif;
          font-size: clamp(19px, 0.8vw + 13px, 26px); line-height: 1.35;
          color: var(--mg-text); margin: 0 0 6px;
        }
        .mg-punch-hint {
          font-family: 'Josefin Sans', sans-serif;
          font-size: clamp(14px, 0.4vw + 11px, 17px);
          color: color-mix(in srgb, var(--mg-text) 75%, transparent); margin: 0 0 14px;
        }
        .mg-punch-options { display: flex; flex-direction: column; gap: 10px; }
        .mg-punch-option {
          min-height: 52px; padding: 12px 18px; text-align: left;
          border-radius: 8px; border: 1.5px solid color-mix(in srgb, var(--mg-gold) 55%, transparent);
          background: color-mix(in srgb, var(--mg-burgundy-deep) 70%, black);
          color: var(--mg-text);
          font-family: 'Josefin Sans', sans-serif;
          font-size: clamp(16px, 0.5vw + 12px, 20px);
          cursor: pointer; transition: background 0.2s, border-color 0.2s;
        }
        .mg-punch-option:hover { border-color: var(--mg-gold); background: color-mix(in srgb, var(--mg-gold) 14%, transparent); }
        .mg-punch-option:focus-visible, .mg-punch-done:focus-visible { outline: 2px solid #a8d5e5; outline-offset: 3px; }
        .mg-punch-option.missed {
          cursor: default; opacity: 0.55; text-decoration: line-through;
          border-style: dashed;
        }
        .mg-punch-option.missed:hover { background: color-mix(in srgb, var(--mg-burgundy-deep) 70%, black); border-color: color-mix(in srgb, var(--mg-gold) 55%, transparent); }
        .mg-punch-miss {
          font-family: 'Josefin Sans', sans-serif;
          font-size: clamp(15px, 0.4vw + 12px, 18px);
          color: #F0B37E; margin: 12px 0 0;
        }
        .mg-punch-done {
          font-family: 'Playfair Display', serif;
          font-size: clamp(19px, 0.8vw + 13px, 25px); line-height: 1.4;
          color: var(--mg-gold-light); margin: 0; outline: none;
        }
        .mg-punch-done-mark { color: var(--mg-gold); }
        .mg-right-col .mg-ticket-strip { margin-top: 24px; width: 100%; }
        @media (max-width: 480px) {
          .mg-punch { padding: 16px 14px 18px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mg-stamp.fresh .mg-stamp-mark { animation: none; }
        }
      `}</style>

      {/* Every source and picture credit, by stop, in one drawer (bottom left) */}
      <SourcesDrawer groups={MIGRATION_SOURCES} />

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
        <ExhibitionNav className="mg-nav" href="/exhibitions/harlem-renaissance/artifacts?view=interactives" style={{ display: cityViewOpen ? 'none' : 'flex' }}>
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
                {/* REVIEW (Verity): the last sentence is new, for the journey's new order (sources in routes.ts). */}
                Between 1910 and 1940, over <em>1.5 million</em> African Americans left the rural South
                and traveled north, carrying their music with them. This journey follows the music
                &mdash; from New Orleans, up the Mississippi River through the cotton fields of the Delta,
                north to Chicago, and on to the stages of Harlem.
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
            <svg ref={svgRef} viewBox={`0 0 ${MAP_W} ${MAP_H}`} xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: `scale(${mapZoom.scale})`,
                transformOrigin: `${mapZoom.originX}% ${mapZoom.originY}%`,
              }}>
              {/* Geography: the states (U.S. Census Bureau outlines), the Mississippi and the Ohio, and the seas */}
              <g aria-hidden="true">
                {STATES.map((st) => (
                  <path key={st.name} d={st.d} className="mg-state" data-state={st.name} />
                ))}
                {Object.entries(RIVERS).map(([name, d]) => (
                  <path key={name} d={d} className="mg-river" data-river={name} />
                ))}
                {WATER_LABELS.map((w) => {
                  const p = at(w.at);
                  return (
                    <text key={w.name} className="mg-water-label" x={p.x} y={p.y} textAnchor="middle">{w.name}</text>
                  );
                })}
              </g>

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

              {/* Chevrons: which way the journey goes, midway between stops */}
              <g className="mg-route-chevrons" fill="none" stroke="var(--mg-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {chevrons.map((c, k) => (
                  <path key={k} d="M-5,4 L0,-3 L5,4" transform={`translate(${c.x},${c.y}) rotate(${c.angle})`} />
                ))}
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
                  {(() => {
                    const l = DOT_LABEL_AT[c.id];
                    const lines = l.lines ?? [DOT_LABELS[c.id] ?? c.name];
                    return (
                      <text className="mg-city-label" x={c.cx + l.dx} y={c.cy + l.dy} textAnchor={l.anchor} fill={cc.light}>
                        {lines.map((line, n) => (
                          <tspan key={line} x={c.cx + l.dx} dy={n === 0 ? `${0.35 - (lines.length - 1) * 0.55}em` : '1.1em'}>{line}</tspan>
                        ))}
                      </text>
                    );
                  })()}
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
                  {'\u25C6'} Begin in New Orleans {'\u25C6'}
                </button>
                <button type="button" className="mg-pace-btn" aria-pressed={quickTrips} onClick={toggleQuickTrips}>
                  Quick trips between stops: {quickTrips ? 'on' : 'off'}
                </button>
                {currentCityIdx >= 0 && <TicketStrip ticket={ticket} colors={CITY_COLORS} />}
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

            <div className="mg-city-photo-credit">{city.photoCaption}</div>

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

                  <TicketPunch
                    cityId={city.id}
                    ticket={ticket}
                    colors={CITY_COLORS}
                    justStamped={justStamped}
                    lastWrong={lastWrong?.cityId === city.id ? lastWrong.choice : null}
                    onAnswer={(choice) => punch(city.id, choice)}
                  />

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
