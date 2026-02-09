'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useCallback, useEffect } from 'react';

const AUDIO_BASE = '/exhibitions/harlem/audio/migration/';
const PHOTO_BASE = '/exhibitions/harlem/images/migration/';

type CityData = {
  id: string;
  name: string;
  period: string;
  cx: number;
  cy: number;
  photo: string;
  photoCredit: string;
  text: string;
  music: { file: string; title: string; artist: string; year: string };
  quote: { text: string; author: string };
};

const CITIES: CityData[] = [
  {
    id: 'delta',
    name: 'The Mississippi Delta',
    period: 'Before 1910',
    cx: 280, cy: 550,
    photo: 'delta.jpg',
    photoCredit: '\u201CA Georgia Cotton Field,\u201D 1907. Photograph by Marcus L. Brown, Decatur, Georgia. Library of Congress Prints and Photographs Division.',
    text: 'It began here \u2014 in the flat cotton fields along the Mississippi River, where African Americans had been enslaved for generations. After emancipation, most stayed as sharecroppers, trapped in cycles of debt and poverty. But they carried something no one could take from them: their music. Work songs, field hollers, and spirituals echoed across the Delta \u2014 the raw material that would become the blues.',
    music: { file: 'delta.mp3', title: '\u201CSwing Low, Sweet Chariot\u201D', artist: 'Fisk Jubilee Singers', year: 'Victor Records, 1909' },
    quote: { text: 'I\u2019d rather be in a deep, dark grave than to be a slave.', author: 'Traditional spiritual' },
  },
  {
    id: 'new-orleans',
    name: 'New Orleans',
    period: '1890s\u20131920s',
    cx: 310, cy: 505,
    photo: 'new-orleans.jpg',
    photoCredit: 'Oscar "Papa" Celestin\'s Original Tuxedo Band, early 1900s. William Russell Jazz Collection, The Historic New Orleans Collection, acquisition made possible by the Clarisse Claiborne Grima Fund.',
    text: 'Where the Mississippi meets the Gulf, New Orleans was the most musical city in America. It was the only place where enslaved people had been allowed to gather and play music \u2014 in Congo Square. By the 1890s, brass bands, ragtime, blues, and Caribbean rhythms were all colliding in the streets. They called the new sound \u201Cjass.\u201D King Oliver, Louis Armstrong, and Sidney Bechet all grew up hearing it.',
    music: { file: 'new-orleans.mp3', title: '\u201CWay Down Yonder in New Orleans\u201D', artist: 'The Georgians, Frank Guarente', year: 'Columbia Records, 1922' },
    quote: { text: 'Jazz was born in New Orleans and grew up in Chicago.', author: 'Louis Armstrong' },
  },
  {
    id: 'memphis',
    name: 'Memphis',
    period: '1900s\u20131920s',
    cx: 285, cy: 410,
    photo: 'memphis.jpg',
    photoCredit: 'W.C. Handy (far right) with associates outside the Tri-State Bank of Memphis, Tennessee. Handy published "Memphis Blues" in 1912 \u2014 the first blues song to appear in sheet music.',
    text: 'Memphis sat at the crossroads \u2014 halfway between the Delta and the North. Beale Street became the main street of Black America, lined with clubs, theaters, and juke joints. W.C. Handy heard the blues here and wrote them down for the first time, publishing \u201CMemphis Blues\u201D in 1912. It was the bridge between rural folk music and the commercial recording industry.',
    music: { file: 'memphis.mp3', title: '\u201CMemphis Blues\u201D', artist: 'Morton Harvey, vocal \u2014 W.C. Handy, composer', year: 'Victor Records, 1914' },
    quote: { text: 'The blues come from nothingness, from want, from desire.', author: 'W.C. Handy' },
  },
  {
    id: 'st-louis',
    name: 'St. Louis',
    period: '1890s\u20131920s',
    cx: 275, cy: 330,
    photo: 'st-louis.jpg',
    photoCredit: 'Fate Marable\u2019s Society Syncopators aboard a Mississippi riverboat, c.\u20091919. Marable\u2019s band played the steamships between New Orleans and St. Louis. A young Louis Armstrong played cornet in this band before leaving for Chicago.',
    text: 'St. Louis was where the river met the railroad. Fate Marable\u2019s band played jazz on Mississippi riverboats, carrying the sound from New Orleans upriver to St. Louis and beyond. Scott Joplin had already made the city famous for ragtime \u2014 the first Black American music to become a national craze. When jazz came through on its way north, it picked up ragtime\u2019s sophistication and kept moving.',
    music: { file: 'st-louis.mp3', title: '\u201CSt. Louis Blues\u201D', artist: 'Original Dixieland Jazz Band with Al Bernard', year: 'Victor Records, 1921' },
    quote: { text: 'Syncopations are no indication of light or trashy music.', author: 'Scott Joplin' },
  },
  {
    id: 'chicago',
    name: 'Chicago',
    period: '1910s\u20131930s',
    cx: 370, cy: 155,
    photo: 'chicago.jpg',
    photoCredit: 'King Oliver\u2019s Creole Jazz Band, Chicago, c.\u20091923. Photograph by Daguerre Studio. Left to right: Baby Dodds (drums), Honor\u00E9 Dutrey (trombone), King Oliver (cornet), Louis Armstrong (cornet), Lil Hardin (piano), Bill Johnson (banjo), Johnny Dodds (clarinet).',
    text: 'The trains from the South ended at Chicago\u2019s Illinois Central station. Between 1910 and 1930, over 500,000 Black Southerners arrived. They settled on the South Side, and the music followed. King Oliver brought his Creole Jazz Band from New Orleans in 1918, then sent for young Louis Armstrong in 1922. The South Side became a laboratory where blues and jazz fused, electrified, and evolved.',
    music: { file: 'chicago.mp3', title: '\u201CRiverside Blues\u201D', artist: 'King Oliver\u2019s Creole Jazz Band', year: 'Recorded 1923' },
    quote: { text: 'I got on the train in New Orleans and I didn\u2019t stop until I got to Chicago.', author: 'Louis Armstrong' },
  },
  {
    id: 'harlem',
    name: 'Harlem',
    period: '1920s\u20131930s',
    cx: 610, cy: 35,
    photo: 'harlem.jpg',
    photoCredit: 'Harlem, New York, 1920s. A parade or rally passes through the neighborhood; a sign reads "THE NEW NEGRO HAS NO FEAR." By the 1920s, Harlem was the cultural capital of Black America.',
    text: 'Harlem was the destination \u2014 the Promised Land. By the 1920s it was the cultural capital of Black America. The Cotton Club, the Apollo Theater, the Savoy Ballroom \u2014 music was everywhere. But the Harlem Renaissance was more than jazz. It was poetry, painting, philosophy, and pride. Langston Hughes, Zora Neale Hurston, Duke Ellington, and Bessie Smith all called Harlem home. A people who had been told they were nothing created an explosion of art that changed the world.',
    music: { file: 'harlem.mp3', title: '\u201CAny Woman\u2019s Blues\u201D', artist: 'Bessie Smith, vocal \u2014 Fletcher Henderson, piano', year: 'Columbia Records, 1923' },
    quote: { text: 'I, too, sing America.', author: 'Langston Hughes' },
  },
];

const CITY_COLORS = [
  { main: '#D4A847', light: '#E8D48B', dim: '#8B7535' },     // Delta — warm gold
  { main: '#5CBFAA', light: '#8DD9C9', dim: '#3D8072' },     // New Orleans — teal
  { main: '#D4864A', light: '#E8B088', dim: '#8B5A32' },     // Memphis — amber
  { main: '#7BA3C7', light: '#A8C4DD', dim: '#526D86' },     // St. Louis — steel blue
  { main: '#D4645A', light: '#E89B94', dim: '#8B433C' },     // Chicago — brick red
  { main: '#B485D2', light: '#D0ACE8', dim: '#785A8B' },     // Harlem — lavender
];

const ROUTE_PATH = 'M280,550 C290,530 305,515 310,505 Q315,480 295,440 Q290,425 285,410 Q280,390 278,370 Q275,350 275,330 Q280,290 310,260 Q330,240 345,225 Q360,200 370,170 Q375,160 370,155 Q390,140 430,115 Q470,95 510,75 Q550,55 580,42 Q595,37 610,35';

export default function MigrationMapPage() {
  const router = useRouter();

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
  }, []);

  const playMusic = useCallback((cityIdx: number) => {
    stopMusic();
    const city = CITIES[cityIdx];
    const audio = new Audio(AUDIO_BASE + city.music.file);
    audio.volume = 0.8;
    audio.play().catch(() => {});
    audio.onended = () => { currentAudioRef.current = null; };
    currentAudioRef.current = audio;
  }, [stopMusic]);

  const toggleMusic = useCallback(() => {
    const audio = currentAudioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      currentAudioRef.current = null;
      return;
    }
    playMusic(currentCityIdxRef.current);
  }, [playMusic]);

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
      // Auto-play music
      playMusic(idx);
    }, 500);
  }, [getDotScreenPos, playMusic]);

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
        }, 800);
      }, 400);
    });
  }, [stopMusic, getDotScreenPos]);

  const playTrainSound = useCallback(() => {
    if (trainAudioRef.current) {
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
      const duration = 5000;
      const startTime = performance.now();

      function animate(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
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
  }, []);

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

    await collapseCity();
    playTrainSound();
    await animateTrainToCity(currentCityIdxRef.current, nextIdx);

    setCurrentCityIdx(nextIdx);
    setTimeout(() => {
      expandCity(nextIdx);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, collapseCity, playTrainSound, animateTrainToCity, expandCity]);

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

  const backToMap = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    await collapseCity();
    setIsAnimating(false);
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
        .mg-nav:hover .mg-nav-label { opacity: 1; max-width: 150px; }
        .mg-nav:hover .mg-nav-arrow { transform: translateX(-4px); }
        .mg-nav-text { font-size: 28px; font-weight: 300; color: #525252; }
        .mg-nav-arrow { font-size: 16px; color: #7D8471; transition: all 0.3s ease; }
        .mg-nav-label {
          font-size: 13px; font-style: italic; color: #7D8471;
          opacity: 0; max-width: 0; overflow: hidden; white-space: nowrap;
          transition: all 0.4s ease;
        }

        /* === HEADER === */
        .mg-header { text-align: center; padding: 36px 20px 8px; }
        .mg-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 5vw, 40px); font-weight: 900;
          color: var(--mg-gold); letter-spacing: 3px;
          text-transform: uppercase;
          text-shadow: 0 0 40px rgba(201,169,78,0.3);
        }
        .mg-header .mg-subtitle {
          font-family: 'Playfair Display', serif;
          font-size: clamp(13px, 2.5vw, 17px);
          font-style: italic; color: var(--mg-text-dim);
          margin-top: 6px; font-weight: 300;
        }

        .mg-intro {
          max-width: 580px; margin: 0 auto;
          padding: 16px 24px 20px; text-align: center;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 13px; line-height: 1.8;
          color: var(--mg-text-dim); font-weight: 300;
        }
        .mg-intro em { color: var(--mg-gold-light); font-style: normal; }

        .mg-map-container {
          margin: 0 auto; flex: 1;
          padding: 0 24px;
          display: flex; align-items: center;
        }
        .mg-map-svg-wrap { width: 100%; overflow: hidden; border-radius: 8px; }
        .mg-map-svg-wrap svg {
          width: 100%; height: auto; display: block;
          transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Route */
        .mg-route-path { stroke: var(--mg-gold); stroke-width: 3; fill: none; opacity: 0.35; filter: drop-shadow(0 0 6px rgba(201,169,78,0.2)); }
        .mg-route-traveled { stroke: var(--mg-gold); stroke-width: 3.5; fill: none; opacity: 0.8; filter: drop-shadow(0 0 10px rgba(201,169,78,0.4)); }
        .mg-route-chevrons { opacity: 0.15; }
        .mg-water { fill: rgba(201,169,78,0.015); stroke: rgba(201,169,78,0.04); stroke-width: 0.5; }
        .mg-state-outline { fill: none; stroke: rgba(201,169,78,0.04); stroke-width: 0.5; }

        /* City dots */
        .city-dot { cursor: pointer; }
        .mg-dot-outer { fill: var(--mg-burgundy-deep); stroke: var(--mg-burgundy); stroke-width: 2; transition: all 0.4s ease; }
        .mg-dot-inner { fill: var(--mg-burgundy); transition: all 0.4s ease; }
        .city-dot.visited .mg-dot-outer { stroke: var(--mg-gold-dim); }
        .city-dot.visited .mg-dot-inner { fill: var(--mg-gold-dim); }
        .city-dot.current .mg-dot-outer { stroke: var(--mg-gold); filter: drop-shadow(0 0 16px rgba(201,169,78,0.5)); }
        .city-dot.current .mg-dot-inner { fill: var(--mg-burgundy-light); }
        .city-dot.next-stop .mg-dot-outer { stroke: var(--mg-burgundy-light); animation: mg-next-pulse 2s ease-in-out infinite; }
        @keyframes mg-next-pulse {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(107,29,42,0.3)); }
          50% { filter: drop-shadow(0 0 18px rgba(107,29,42,0.7)); }
        }
        .mg-city-label {
          font-family: 'Josefin Sans', sans-serif; font-size: 12px;
          letter-spacing: 2px; text-transform: uppercase;
          fill: var(--mg-text-dim); font-weight: 600;
          pointer-events: none; transition: fill 0.3s;
        }
        .city-dot.current .mg-city-label, .city-dot.visited .mg-city-label { fill: var(--mg-gold-dim); }

        /* Board button */
        .mg-board-btn-wrap { text-align: center; padding: 20px 20px 36px; }
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
          background: var(--mg-burgundy-deep); z-index: 199;
          pointer-events: none; width: 20px; height: 20px;
        }
        .mg-expand-bg.positioned { display: block; }
        .mg-expand-bg.expanded {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
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
          background: rgba(74,14,28,0.8); border: 1px solid rgba(201,169,78,0.3);
          padding: 8px 16px; font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
          color: var(--mg-gold); font-weight: 600;
          backdrop-filter: blur(8px); border-radius: 3px;
        }
        .mg-city-photo-credit {
          position: relative; z-index: 6;
          padding: 14px 28px;
          max-width: 960px; margin: 0 auto;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px; line-height: 1.5;
          color: rgba(232,224,208,0.45); font-style: italic; font-weight: 300;
          background: rgba(74,14,28,0.4);
          border-bottom: 1px solid rgba(232,224,208,0.06);
        }
        .mg-city-body { padding: 32px 28px 40px; max-width: 960px; margin: 0 auto; position: relative; z-index: 5; }
        .mg-city-stop-number {
          font-family: 'Josefin Sans', sans-serif; font-size: 10px;
          letter-spacing: 4px; text-transform: uppercase;
          color: var(--mg-gold-dim); font-weight: 600; margin-bottom: 8px;
        }
        .mg-city-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 6vw, 42px); font-weight: 900;
          color: var(--mg-gold); line-height: 1.1; margin-bottom: 4px;
          text-shadow: 0 0 30px rgba(201,169,78,0.2);
        }
        .mg-city-period {
          font-family: 'Playfair Display', serif; font-size: 14px;
          font-style: italic; color: var(--mg-gold-dim); margin-bottom: 24px;
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
        .mg-city-music-title { font-family: 'Playfair Display', serif; font-size: 15px; color: var(--mg-gold-light); font-style: italic; }
        .mg-city-music-artist { font-family: 'Josefin Sans', sans-serif; font-size: 11px; color: rgba(232,224,208,0.5); margin-top: 3px; font-weight: 300; }
        .mg-city-music-year { font-family: 'Josefin Sans', sans-serif; font-size: 10px; color: rgba(232,224,208,0.3); margin-top: 2px; font-weight: 300; letter-spacing: 1px; }

        /* Quote */
        .mg-city-quote { text-align: center; padding: 24px 0; border-top: 1px solid rgba(201,169,78,0.08); }
        .mg-city-quote blockquote {
          font-family: 'Playfair Display', serif;
          font-size: clamp(16px, 3vw, 20px);
          font-style: italic; color: rgba(201,169,78,0.6);
          line-height: 1.6; font-weight: 300;
        }
        .mg-city-quote cite {
          display: block; margin-top: 10px;
          font-family: 'Josefin Sans', sans-serif; font-size: 10px;
          letter-spacing: 3px; text-transform: uppercase;
          color: var(--mg-gold-dim); font-style: normal;
        }

        /* Train ticket */
        .mg-train-ticket {
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
        .mg-ticket-label { font-family: 'Josefin Sans', sans-serif; font-size: 9px; letter-spacing: 4px; text-transform: uppercase; color: var(--mg-gold-dim); font-weight: 600; margin-bottom: 6px; }
        .mg-ticket-destination { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--mg-gold); font-weight: 700; margin-bottom: 4px; }
        .mg-ticket-line { width: 40px; height: 1px; background: var(--mg-gold-dim); margin: 10px auto; }
        .mg-ticket-action { font-family: 'Josefin Sans', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--mg-gold-dim); font-weight: 600; }

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

        .mg-footer {
          text-align: center; padding: 24px 20px 36px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px; color: var(--mg-text-dim);
          letter-spacing: 2px; font-weight: 300;
        }

        /* Back button in city view */
        .mg-city-back {
          position: fixed; top: 24px; left: 24px; z-index: 210;
          display: flex; align-items: center; gap: 10px;
          background: none; border: none; cursor: pointer;
          font-family: 'Cormorant Garamond', 'Playfair Display', serif;
          transition: all 0.3s ease;
        }
        .mg-city-back:hover .mg-city-back-label { opacity: 1; max-width: 150px; }
        .mg-city-back:hover .mg-city-back-arrow { transform: translateX(-4px); }
        .mg-city-back-text { font-size: 28px; font-weight: 300; color: rgba(201,169,78,0.4); }
        .mg-city-back-arrow { font-size: 16px; color: rgba(201,169,78,0.3); transition: all 0.3s ease; }
        .mg-city-back-label {
          font-size: 13px; font-style: italic; color: rgba(201,169,78,0.4);
          opacity: 0; max-width: 0; overflow: hidden; white-space: nowrap;
          transition: all 0.4s ease;
        }

        @media (max-width: 768px) {
          .mg-nav { left: 20px; top: 20px; }
          .mg-nav-text { font-size: 24px; }
          .mg-city-back { left: 16px; top: 16px; }
          .mg-city-back-text { font-size: 24px; }
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
          .mg-train-ticket { padding: 20px; }
          .mg-ticket-destination { font-size: 18px; }
        }
      `}</style>

      {/* Hidden audio */}
      <audio ref={trainAudioRef} preload="auto" src={AUDIO_BASE + 'train.mp3'} />

      {/* Expanding circle */}
      {expandState !== 'hidden' && (
        <div
          className={`mg-expand-bg ${expandState}`}
          style={expandState === 'positioned' ? {
            left: expandOrigin.x - 10, top: expandOrigin.y - 10,
            width: 20, height: 20, display: 'block',
          } : undefined}
        />
      )}

      {/* === MAP VIEW === */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="mg-nav" onClick={() => router.push('/exhibitions/harlem-renaissance/artifacts')}>
          <span className="mg-nav-text">M</span>
          <span className="mg-nav-arrow">{'\u2190'}</span>
          <span className="mg-nav-label">Collection</span>
        </div>

        <div className="mg-header">
          <h1>The Great Migration</h1>
          <div className="mg-subtitle">Follow the Music North</div>
        </div>

        <div className="mg-intro">
          Between 1910 and 1940, over <em>1.5 million</em> African Americans left the rural South
          and traveled north, carrying their music with them. Tap the button below to board the train
          and follow the journey from the cotton fields to Harlem.
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
              {CITIES.map((c, i) => (
                <g key={c.id} className={getDotClass(i)} onClick={() => {
                  if (i <= currentCityIdx) expandCity(i);
                }}>
                  <circle className="mg-dot-outer" cx={c.cx} cy={c.cy} r="14" />
                  <circle className="mg-dot-inner" cx={c.cx} cy={c.cy} r="8" />
                  {c.id === 'delta' && (<>
                    <text className="mg-city-label" x={c.cx - 40} y={c.cy + 22} textAnchor="end">Mississippi</text>
                    <text className="mg-city-label" x={c.cx - 40} y={c.cy + 36} textAnchor="end">Delta</text>
                  </>)}
                  {c.id === 'new-orleans' && (<>
                    <text className="mg-city-label" x={c.cx + 36} y={c.cy - 5}>New</text>
                    <text className="mg-city-label" x={c.cx + 36} y={c.cy + 9}>Orleans</text>
                  </>)}
                  {c.id === 'memphis' && (
                    <text className="mg-city-label" x={c.cx - 44} y={c.cy + 4} textAnchor="end">Memphis</text>
                  )}
                  {c.id === 'st-louis' && (
                    <text className="mg-city-label" x={c.cx - 44} y={c.cy + 4} textAnchor="end">St. Louis</text>
                  )}
                  {c.id === 'chicago' && (
                    <text className="mg-city-label" x={c.cx - 44} y={c.cy - 4} textAnchor="end">Chicago</text>
                  )}
                  {c.id === 'harlem' && (
                    <text className="mg-city-label" x={c.cx - 44} y={c.cy - 6} textAnchor="end">Harlem</text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="mg-board-btn-wrap">
          <button className="mg-board-btn" onClick={startJourney}>
            {'\u25C6'} Board the Train {'\u25C6'}
          </button>
        </div>

        <div className="mg-footer">
          The Mini Museum &mdash; Harlem Renaissance Exhibition
        </div>
      </div>

      {/* === CITY VIEW === */}
      {cityViewOpen && city && (
        <div className="mg-city-view" ref={cityViewRef}>
          <button className="mg-city-back" onClick={backToMap}>
            <span className="mg-city-back-text">M</span>
            <span className="mg-city-back-arrow">{'\u2190'}</span>
            <span className="mg-city-back-label">Map</span>
          </button>

          <div className={`mg-city-content ${cityContentVisible ? 'visible' : ''}`} style={{
              '--mg-gold': CITY_COLORS[currentCityIdx].main,
              '--mg-gold-light': CITY_COLORS[currentCityIdx].light,
              '--mg-gold-dim': CITY_COLORS[currentCityIdx].dim,
            } as React.CSSProperties}>
            <div className="mg-city-photo-wrap">
              {!photoLoaded && (
                <div className="mg-city-photo-placeholder">Photograph loading&hellip;</div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="mg-city-photo"
                src={PHOTO_BASE + city.photo}
                alt={city.name}
                style={{ opacity: photoLoaded ? 1 : 0, position: photoLoaded ? 'relative' : 'absolute' }}
                onLoad={() => setPhotoLoaded(true)}
                onError={() => setPhotoLoaded(false)}
              />
              <div className="mg-city-photo-overlay" />
              <div className="mg-city-station-badge">Stop {currentCityIdx + 1} of 6</div>
            </div>

            <div className="mg-city-photo-credit">{city.photoCredit}</div>

            <div className="mg-city-body">
              <div className="mg-city-stop-number">Stop {currentCityIdx + 1}</div>
              <h2 className="mg-city-name">{city.name}</h2>
              <div className="mg-city-period">{city.period}</div>

              <div className="mg-city-columns">
                <div className="mg-city-col-left">
                  <div className="mg-city-text">{city.text}</div>
                  <div className="mg-city-quote">
                    <blockquote>{'\u201C'}{city.quote.text}{'\u201D'}</blockquote>
                    <cite>{'\u2014'} {city.quote.author}</cite>
                  </div>
                </div>

                <div className="mg-city-col-right">
                  <div className="mg-city-music">
                    <button
                      className={`mg-city-music-play ${currentAudioRef.current && !currentAudioRef.current.paused ? 'playing' : ''}`}
                      onClick={toggleMusic}
                    >
                      <span>{currentAudioRef.current && !currentAudioRef.current.paused ? '\u23F8' : '\u25B6'}</span>
                    </button>
                    <div className="mg-city-music-info">
                      <div className="mg-city-music-title">{city.music.title}</div>
                      <div className="mg-city-music-artist">{city.music.artist}</div>
                      <div className="mg-city-music-year">{city.music.year}</div>
                    </div>
                  </div>

                  {currentCityIdx < CITIES.length - 1 ? (
                    <div className="mg-train-ticket" onClick={boardToNext}>
                      <div className="mg-ticket-label">Next Stop</div>
                      <div className="mg-ticket-destination">{CITIES[currentCityIdx + 1].name}</div>
                      <div className="mg-ticket-line" />
                      <div className="mg-ticket-action">{'\u25C6'} Board the Train {'\u25C6'}</div>
                    </div>
                  ) : (
                    <div className="mg-arrival-ticket">
                      <div className="mg-ticket-label">You Have Arrived</div>
                      <div className="mg-ticket-destination">The music made it. So did the people.</div>
                      <div className="mg-ticket-line" />
                      <div className="mg-arrival-links">
                        <button className="mg-arrival-link" onClick={restartJourney}>Ride Again</button>
                        <button className="mg-arrival-link" onClick={backToMap}>View Map</button>
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
