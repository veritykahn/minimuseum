import fs from 'fs';
import path from 'path';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import LandingRow from '@/components/exhibition/LandingRow';
import LandingCredits from '@/components/exhibition/LandingCredits';
import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { CaseViewTabs, useCaseView, viewFromSearch } from '@/components/exhibition/CaseViews';
import { interactivesView, roomReturn } from '@/components/exhibition/helpers';
import { EXHIBITION_CASES } from '@/lib/exhibitionCases';

/*
 * The owner's review notes: every landing page fits on one screen (a compact
 * head, the posters and case sized to the screen, a swipe row on a phone
 * with a hint, credits folded into a toggle); every case card has its
 * exhibition's frame; every display case page has Artifacts | Interactives
 * tabs, and a room's way back opens the Interactives; the Leonardo.Ai
 * illustrations are gone, but for the Holocaust walk room's textures.
 */

const ROOT = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');

describe('the landing row', () => {
  const setWidths = (row: HTMLElement, scroll: number, client: number) => {
    Object.defineProperty(row, 'scrollWidth', { configurable: true, value: scroll });
    Object.defineProperty(row, 'clientWidth', { configurable: true, value: client });
  };

  it('shows no swipe hint while everything fits', () => {
    render(
      <LandingRow className="grid">
        <button type="button">One</button>
        <button type="button">Two</button>
      </LandingRow>,
    );
    expect(screen.queryByText(/Swipe/)).toBeNull();
    expect(document.querySelector('.pe-landing-row')).toHaveStyle({ '--pe-n': '2' });
  });

  it('on a phone, where the row overflows, says there is more to swipe, with a dot for each item', () => {
    const { container, rerender } = render(
      <LandingRow>
        <button type="button">One</button>
        <span className="pe-landing-case">Case</span>
        <button type="button">Two</button>
      </LandingRow>,
    );
    const row = container.querySelector('.pe-landing-row') as HTMLElement;
    setWidths(row, 900, 390);
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    rerender(
      <LandingRow>
        <button type="button">One</button>
        <span className="pe-landing-case">Case</span>
        <button type="button">Two</button>
      </LandingRow>,
    );
    expect(screen.getByText(/Swipe for more/)).toBeInTheDocument();
    const dots = screen.getAllByRole('button', { name: /Show \d of 3/ });
    expect(dots).toHaveLength(3);
    expect(dots[0]).toHaveAttribute('aria-current', 'true');
    // One case among three: the tall-screen layout gives the cases their own row.
    expect(row).toHaveStyle({ '--pe-cases': '1', '--pe-posters': '2' });
    const scrollIntoView = jest.fn();
    (row.children[2] as HTMLElement).scrollIntoView = scrollIntoView;
    fireEvent.click(dots[2]);
    expect(scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ inline: 'center' }));
  });
});

describe('the landing page', () => {
  const credits = [{ text: '*A Picture*, by Someone', href: 'https://example.org/a' }];

  it('folds the picture credits into a toggle at its foot', () => {
    render(<LandingCredits credits={credits} />);
    const toggle = screen.getByText('Picture credits');
    expect(toggle.tagName).toBe('SUMMARY');
    const details = toggle.closest('details') as HTMLDetailsElement;
    expect(details.open).toBe(false);
    fireEvent.click(toggle);
    const link = within(screen.getByRole('list', { name: 'Picture credits' })).getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.org/a');
    expect(link.querySelector('em')).toHaveTextContent('A Picture');
  });

  it('draws nothing when there are no credits', () => {
    const { container } = render(<LandingCredits credits={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it.each(EXHIBITION_CASES.map((c) => [c.config.slug, c.config] as const))('%s: one screen, its case framed, no rooms', (_slug, config) => {
    window.history.replaceState(null, '', '/');
    render(<PosterExhibition config={config} />);
    expect(document.querySelector('.pe-landing .pe-landing-head h1')).toHaveTextContent(config.name);
    const row = document.querySelector('.pe-landing .pe-landing-row') as HTMLElement;
    expect(row.querySelectorAll(':scope > .pe-landing-poster')).toHaveLength(config.posters.length);
    for (const c of row.querySelectorAll(':scope > .pe-landing-case')) expect(c.querySelector('.pe-case-frame')).toHaveAttribute('aria-hidden', 'true');
    for (const r of config.interactives ?? []) expect(document.querySelector(`a[href="${r.href}"]`)).toBeNull();
  });

  it.each([
    ['app/exhibitions/harlem-renaissance/page.tsx', 1],
    ['app/exhibitions/in-their-hands/page.tsx', 3],
    ['app/exhibitions/seeing-is-deceiving/page.tsx', 1],
  ] as const)('%s takes the same one-screen layout, its cases framed', (file, caseCount) => {
    const src = read(file);
    expect(src).toMatch(/className="[a-z-]*exhibition-main pe-landing"/);
    expect(src).toMatch(/pe-landing-head/);
    expect(src).toMatch(/<LandingRow className="[a-z-]*exhibition-grid">/);
    expect(src.match(/pe-landing-poster/g)).toHaveLength(2);
    expect(src.match(/<span className="pe-case-frame" aria-hidden="true" \/>/g)).toHaveLength(caseCount);
  });

  it('sizes the landing to the screen: dvh, a size-container row, and a swipe row on phones', () => {
    const css = read('components/exhibition/poster-exhibition.css');
    expect(css).toMatch(/\.pe-root \.pe-landing \{[^}]*height: 100dvh;/);
    expect(css).toMatch(/\.pe-landing-row \{[^}]*container-type: size;/);
    expect(css).toMatch(/@media \(max-width: 640px\)[\s\S]*scroll-snap-type: x mandatory;/);
    expect(css).toMatch(/prefers-reduced-motion: reduce\) \{\s*\.pe-swipe-arrow \{ animation: none; \}/);
  });
});

describe('a display case page’s views', () => {
  function Harness() {
    const [view, setView] = useCaseView();
    return (
      <>
        <CaseViewTabs view={view} onChange={setView} idPrefix="t" counts={{ artifacts: 3, interactives: 2 }} />
        <p>{view}</p>
      </>
    );
  }
  afterEach(() => window.history.replaceState(null, '', '/'));

  it('opens on the Artifacts, switches by click and by arrow key, and keeps the view in the address', () => {
    window.history.replaceState(null, '', '/exhibitions/x/artifacts/case');
    render(<Harness />);
    const [artifacts, interactives] = screen.getAllByRole('tab');
    expect(artifacts).toHaveTextContent('Artifacts 3');
    expect(artifacts).toHaveAttribute('aria-selected', 'true');
    expect(interactives).toHaveAttribute('tabindex', '-1');
    fireEvent.click(interactives);
    expect(screen.getByText('interactives')).toBeInTheDocument();
    expect(window.location.search).toBe('?view=interactives');
    fireEvent.keyDown(interactives, { key: 'ArrowLeft' });
    expect(screen.getByText('artifacts')).toBeInTheDocument();
    expect(artifacts).toHaveFocus();
    expect(window.location.search).toBe('');
  });

  it('opens at the Interactives when the address asks', () => {
    window.history.replaceState(null, '', '/exhibitions/x/artifacts/case?view=interactives');
    render(<Harness />);
    expect(screen.getByRole('tab', { name: /Interactives/ })).toHaveAttribute('aria-selected', 'true');
    expect(viewFromSearch('?view=nonsense')).toBe('artifacts');
  });

  it('sends a room back to its case at the Interactives', () => {
    expect(interactivesView('/exhibitions/x/artifacts/case')).toBe('/exhibitions/x/artifacts/case?view=interactives');
    expect(interactivesView('/a?from=studio#tab')).toBe('/a?from=studio&view=interactives#tab');
    expect(roomReturn({ slug: 'x', cases: [{ href: '/exhibitions/x/artifacts/case', label: 'Display Case', title: 'Artifacts' }] })).toEqual({
      href: '/exhibitions/x/artifacts/case?view=interactives',
      label: 'Display Case',
    });
  });

  it.each([
    'app/exhibitions/harlem-renaissance/jazz-lab/page.tsx',
    'app/exhibitions/harlem-renaissance/harlem-in-words/page.tsx',
    'app/exhibitions/harlem-renaissance/migration-map/page.tsx',
    'app/exhibitions/seeing-is-deceiving/illusions/page.tsx',
    'app/exhibitions/seeing-is-deceiving/optical-toys/page.tsx',
    'app/exhibitions/in-their-hands/hands/page.tsx',
    'app/exhibitions/in-their-hands/timeline/page.tsx',
    'app/exhibitions/in-their-hands/real-or-replica/page.tsx',
  ])('%s goes back to its case at the Interactives', (file) => {
    // Every quoted address of its case (not of an artifact in it).
    const backs = read(file).match(/['"]\/exhibitions\/[a-z-]+\/artifacts(\/case-\d)?(\?[^'"]*)?['"]/g) ?? [];
    expect(backs.length).toBeGreaterThan(0);
    for (const b of backs) expect(b).toMatch(/\?view=interactives['"]$/);
  });

  it('puts the hand-built case pages on their landing page’s colour, but leaves Harlem’s case as built', () => {
    expect(read('app/exhibitions/seeing-is-deceiving/artifacts/page.tsx')).toMatch(/\.artifacts-page \{[^}]*background: #e0dede;/);
    expect(read('app/exhibitions/seeing-is-deceiving/artifacts/artifact-viewer.tsx')).toMatch(/\.artifact-viewer \{[^}]*background: #e0dede;/);
    expect(read('app/exhibitions/in-their-hands/artifacts/case-listing.tsx')).toMatch(/\.case-listing-page \{[^}]*background: #443c31;/);
    expect(read('app/exhibitions/in-their-hands/artifacts/coin-viewer.tsx')).not.toMatch(/background: #0a0a0a;/);
    expect(read('app/exhibitions/harlem-renaissance/artifacts/page.tsx')).toMatch(/\.hr-artifacts-page \{[^}]*background: #0a0a0a;/);
  });
});

describe('the Leonardo.Ai illustrations', () => {
  const walk = (d: string): string[] =>
    fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  const code = [...walk(path.join(ROOT, 'app')), ...walk(path.join(ROOT, 'components'))].filter((f) => /\.(tsx?|css)$/.test(f));

  it('are gone, but for the textures of the Holocaust stones room (the walk)', () => {
    const mentions = code.filter((f) => /Leonardo/.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(ROOT, f));
    expect(mentions.sort()).toEqual(['app/exhibitions/holocaust/stones/MemorialStone.tsx', 'app/exhibitions/holocaust/stones/memorial-stone.css']);
  });

  it.each([
    'black-history/landing-barbie-timeline.webp',
    'black-history/landing-who-do-you-see.webp',
    'fear-lab/landing-fear-boxes.webp',
    'fear-lab/boxes/box-chest.webp',
    'great-war/landing-guns-fell-silent.webp',
    'womens-history/landing-who-gets-remembered.webp',
    'writing-revolution/landing-typing-station.webp',
    'seeing-is-deceiving/optical-toys/zoetrope.webp',
    'victorian/christmas-card/card-church.webp',
    'victorian/inventions/workshop-bench.webp',
    'victorian/parlour/parlour-warm.webp',
  ])('%s is removed', (f) => {
    expect(fs.existsSync(path.join(ROOT, 'public/exhibitions', f))).toBe(false);
  });
});
