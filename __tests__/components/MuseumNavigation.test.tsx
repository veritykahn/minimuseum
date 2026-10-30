import { act, fireEvent, render, screen } from '@testing-library/react';
import { existsSync } from 'fs';
import { join } from 'path';
import type { ComponentType } from 'react';
import Home from '@/app/page';
import GreatHall from '@/app/greathall/page';
import ThirdFloor from '@/app/exhibitions/third-floor/page';
import FloorPage from '@/components/FloorPage';
import { GROUND_FLOOR, STUDIO, STUDIO_TOOLS, studioToolHref } from '@/lib/floors';
import { HOME_LOGO_WORDS, HOME_M_IMAGES, HOME_M_WINDOWS } from '@/lib/homeLogo';
import { MUSEUM_OVERVIEW } from '@/components/museum-map/data/levels';
import { roomReturn } from '@/components/exhibition/helpers';
import { GREAT_WAR } from '@/app/exhibitions/great-war/greatWar';
import GreatWarMemorial from '@/app/exhibitions/great-war/memorial/page';
import GreatWarRoom from '@/app/exhibitions/great-war/RoomShell';
import AmericaSign from '@/app/exhibitions/america-250/sign/page';
import ChristmasCard from '@/app/exhibitions/victorian/christmas-card/page';
import Violet from '@/app/exhibitions/womens-history/violet/page';
import Representation from '@/app/exhibitions/black-history/representation/page';
import TypingStation from '@/app/exhibitions/writing-revolution/typing-station/page';
import HarlemInWords from '@/app/exhibitions/harlem-renaissance/harlem-in-words/page';

/*
 * Finding the way around: the landing page's logo, the Great Hall's stairs,
 * the floors' hallways and their light, and every "M ←" going back the way
 * the visitor came.
 */

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: jest.fn(), prefetch: jest.fn(), back: jest.fn(), forward: jest.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

function reducedMotion(on: boolean) {
  (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
    matches: on && query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

beforeEach(() => {
  push.mockClear();
  global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;
  sessionStorage.clear();
  reducedMotion(false);
  window.history.replaceState(null, '', '/');
});

afterEach(() => jest.restoreAllMocks());

describe('the landing page logo', () => {
  it('shows a picture through each big M, from one named slot each', () => {
    render(<Home />);
    const logo = screen.getByRole('img', { name: 'The Mini Museum' });
    expect(screen.getByRole('heading', { level: 1 })).toContainElement(logo);
    for (const m of ['mini', 'museum'] as const) {
      const window_ = logo.querySelector(`[data-m="${m}"]`) as HTMLElement;
      expect(window_.querySelector('img')).toHaveAttribute('src', HOME_M_IMAGES[m]);
      expect(window_.style.maskImage).toBe(`url(${HOME_M_WINDOWS[m].mask})`);
    }
    expect(HOME_M_IMAGES).toEqual({ mini: '/home/m-mini.jpg', museum: '/home/m-museum.jpg' });
    for (const file of [...Object.values(HOME_M_IMAGES), HOME_LOGO_WORDS, ...Object.values(HOME_M_WINDOWS).map((w) => w.mask)]) {
      expect(existsSync(join(process.cwd(), 'public', file))).toBe(true);
    }
  });
});

describe('the Great Hall', () => {
  it('names the third floor "Studio"', () => {
    render(<GreatHall />);
    expect(screen.getByRole('heading', { name: 'Studio' })).toBeInTheDocument();
    expect(screen.queryByText(/The Studio/)).not.toBeInTheDocument();
    expect(MUSEUM_OVERVIEW.rooms.find((r) => r.id === 'third-floor')?.label).toBe('3rd Floor: Studio');
  });

  it('plays its entrance on a first visit', () => {
    const { container } = render(<GreatHall />);
    expect(container.firstChild).not.toHaveClass('at-stairs');
    expect(screen.getByText('Select a Floor')).toHaveClass('fade-in');
  });

  it('opens at its stairs, entrance over, when the visitor comes back from a floor', () => {
    window.history.replaceState(null, '', '/greathall#floors');
    const scrollTo = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const { container } = render(<GreatHall />);
    expect(container.firstChild).toHaveClass('at-stairs');
    expect(scrollTo).toHaveBeenCalled();
    expect(container.querySelector('#floors')).toHaveAttribute('aria-label', 'Select a Floor');
    expect(container.querySelector('.explore-hint')).toHaveAttribute('tabindex', '-1');
    scrollTo.mockRestore();
  });
});

describe('a floor', () => {
  it('goes back to the Great Hall at its stairs', () => {
    render(<FloorPage floor={GROUND_FLOOR} />);
    expect(screen.getByRole('link', { name: 'Great Hall' })).toHaveAttribute('href', '/greathall#floors');
  });

  it('opens an exhibition, remembering its card', () => {
    render(<FloorPage floor={GROUND_FLOOR} />);
    fireEvent.click(screen.getByRole('button', { name: 'Enter Exhibition: America 250' }));
    expect(sessionStorage.getItem('groundFloorIndex')).toBe('3');
    expect(push).toHaveBeenCalledWith('/exhibitions/america-250');
  });

  it('comes back at the remembered card', () => {
    sessionStorage.setItem('groundFloorIndex', '2');
    const scrollTo = jest.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: scrollTo });
    render(<FloorPage floor={GROUND_FLOOR} />);
    expect(scrollTo).toHaveBeenCalledWith({ left: 2 * window.innerWidth, behavior: 'instant' });
    expect(sessionStorage.getItem('groundFloorIndex')).toBeNull();
  });
});

describe("a floor's hallway light", () => {
  function hallway(reduce = false) {
    reducedMotion(reduce);
    // Frames run when the test says, as a browser runs them after the scroll.
    const frames: FrameRequestCallback[] = [];
    const raf = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => frames.push(cb));
    const { container } = render(<FloorPage floor={GROUND_FLOOR} />);
    const scroller = container.querySelector('.exhibitions-scroll') as HTMLElement;
    let left = 0;
    Object.defineProperty(scroller, 'clientWidth', { configurable: true, value: 1000 });
    Object.defineProperty(scroller, 'scrollLeft', { configurable: true, get: () => left });
    const layers = Array.from(container.querySelectorAll<HTMLElement>('.hall-light-layer'));
    const swipeTo = (to: number) => {
      left = to;
      act(() => {
        scroller.dispatchEvent(new Event('scroll'));
        frames.splice(0).forEach((cb) => cb(0));
      });
    };
    return { container, layers, swipeTo, raf };
  }

  it("lays one light per exhibition behind the carousel, each in the exhibition's own colors", () => {
    const { container, layers, raf } = hallway();
    expect(container.querySelector('.hall-light')).toHaveAttribute('aria-hidden', 'true');
    expect(layers.map((l) => l.dataset.exhibition)).toEqual(GROUND_FLOOR.exhibitions.map((e) => e.slug));
    expect(layers[0].style.opacity).toBe('1');
    expect(layers[1].style.opacity).toBe('0');
    // The cards themselves no longer carry a tint: the light is behind them.
    expect((container.querySelector('.exhibition-card') as HTMLElement).style.background).toBe('');
    raf.mockRestore();
  });

  it('cross-fades from one exhibition to the next as the visitor swipes', () => {
    const { layers, swipeTo, raf } = hallway();
    swipeTo(1500);
    expect(layers.map((l) => Number(l.style.opacity))).toEqual([0, 0.5, 0.5, 0, 0]);
    swipeTo(1750);
    expect(layers.map((l) => Number(l.style.opacity))).toEqual([0, 0.25, 0.75, 0, 0]);
    swipeTo(4000);
    expect(layers.map((l) => Number(l.style.opacity))).toEqual([0, 0, 0, 0, 1]);
    raf.mockRestore();
  });

  it('with reduced motion, lights only the nearest exhibition (the stylesheet fades it over)', () => {
    const { layers, swipeTo, raf } = hallway(true);
    swipeTo(1400);
    expect(layers.map((l) => Number(l.style.opacity))).toEqual([0, 1, 0, 0, 0]);
    swipeTo(1600);
    expect(layers.map((l) => Number(l.style.opacity))).toEqual([0, 0, 1, 0, 0]);
    raf.mockRestore();
  });
});

describe('the Studio', () => {
  it('is named "Studio", and goes back to the Great Hall at its stairs', () => {
    render(<ThirdFloor />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Third Floor: Studio');
    expect(screen.getByRole('link', { name: 'Great Hall' })).toHaveAttribute('href', '/greathall#floors');
  });

  it('opens each tool through its door, remembering its card', () => {
    render(<ThirdFloor />);
    STUDIO_TOOLS.forEach((tool, i) => {
      fireEvent.click(screen.getByRole('button', { name: `Start Making: ${tool.title}` }));
      expect(push).toHaveBeenLastCalledWith(studioToolHref(tool.href));
      expect(sessionStorage.getItem(STUDIO.storageKey)).toBe(String(i));
    });
  });
});

describe("a tool's way back", () => {
  // Every Studio tool's room, by its route.
  const ROOMS: Record<string, ComponentType> = {
    '/exhibitions/america-250/sign': AmericaSign,
    '/exhibitions/victorian/christmas-card': ChristmasCard,
    '/exhibitions/great-war/memorial': GreatWarMemorial,
    '/exhibitions/harlem-renaissance/harlem-in-words': HarlemInWords,
    '/exhibitions/womens-history/violet': Violet,
    '/exhibitions/black-history/representation': Representation,
    '/exhibitions/writing-revolution/typing-station': TypingStation,
  };

  const backLink = () =>
    screen.queryByRole('link', { name: /^(M\s*←\s*)?(Studio|Display Case|Collection)$/ }) ??
    screen.getByRole('button', { name: /^(M\s*←\s*)?(Studio|Display Case|Collection)$/ });

  it('covers every tool the Studio opens, except the Jazz Lab (its audio engine needs a browser)', () => {
    const routes = new Set(STUDIO_TOOLS.map((t) => t.href.split('#')[0]));
    expect([...routes].filter((r) => !ROOMS[r])).toEqual(['/exhibitions/harlem-renaissance/jazz-lab']);
  });

  it.each(STUDIO_TOOLS.map((t, i) => [t.title, t, i] as const).filter(([, t]) => ROOMS[t.href.split('#')[0]]))(
    '%s: back to the Studio, at its own card, when the Studio opened it',
    (_, tool, i) => {
      window.history.replaceState(null, '', studioToolHref(tool.href));
      const Room = ROOMS[tool.href.split('#')[0]];
      render(<Room />);
      const back = backLink();
      expect(back).toHaveTextContent(/Studio$/);
      if (back.tagName === 'A') expect(back).toHaveAttribute('href', '/exhibitions/third-floor');
      fireEvent.click(back);
      expect(sessionStorage.getItem('studioIndex')).toBe(String(i));
      if (back.tagName === 'BUTTON') expect(push).toHaveBeenCalledWith('/exhibitions/third-floor');
    },
  );

  it.each(Object.entries(ROOMS))('%s: back to its display case on a direct visit', (route, Room) => {
    window.history.replaceState(null, '', route);
    render(<Room />);
    const back = backLink();
    expect(back).not.toHaveTextContent(/Studio/);
    if (back.tagName === 'A') expect(back.getAttribute('href')).toMatch(/\/artifacts/);
  });

  it("sends a room's foot link the same way as its corner", () => {
    expect(roomReturn(GREAT_WAR).label).toBe('Display Case');
    window.history.replaceState(null, '', '/exhibitions/great-war/memorial?from=studio#remember');
    render(
      <GreatWarRoom className="gw-test" label="Room" title="A room">
        <p>Inside</p>
      </GreatWarRoom>,
    );
    expect(screen.getByRole('link', { name: 'Studio' })).toHaveAttribute('href', '/exhibitions/third-floor');
    const foot = screen.getByRole('link', { name: 'Return to Studio' });
    expect(foot).toHaveAttribute('href', '/exhibitions/third-floor');
    fireEvent.click(foot);
    expect(sessionStorage.getItem('studioIndex')).toBe('3');
  });
});
