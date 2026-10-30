import { act, fireEvent, render, screen, within } from '@testing-library/react';
import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { colorsFor, emphasisRuns, posterLengths, projectorPosters, veilFor } from '@/components/exhibition/helpers';
import type { ExhibitionConfig, PosterItem } from '@/components/exhibition/types';
import { OPENING, posterChapters } from '@/components/projector/posterTalk';
import { FEAR_LAB, FEAR_LAB_CASE } from '@/app/exhibitions/fear-lab/fearLab';
import FearLabCase from '@/app/exhibitions/fear-lab/artifacts/case/page';
import { plainText, recordLines } from '@/components/exhibition/artifacts';

/*
 * The poster exhibition engine (components/exhibition): landing page,
 * walkthrough navigation, the end-of-poster panel, projector deep links,
 * and the Fear Lab's config.
 */

type Id = 'poster1' | 'poster2';

function makeConfig(over: Partial<ExhibitionConfig<Id>> = {}): ExhibitionConfig<Id> {
  return {
    slug: 'test-exhibition',
    name: 'Test Exhibition',
    subtitle: 'A subtitle',
    fonts: { href: 'https://fonts.googleapis.com/css2?family=Outfit', display: 'Outfit', body: 'Outfit' },
    palette: { page: '#000', heading: '#fff', accent: '#fc0', teach: { color: '#fc0', border: '#fc0' } },
    back: { href: '/exhibitions/first-floor', label: 'First Floor', remember: { key: 'firstFloorIndex', value: '3' } },
    fx: { theme: 'fl', veil: 'every-panel', text: 'all' },
    projector: { theme: {}, links: [{ label: 'Teacher resources', href: '/resources' }] },
    posters: [
      {
        id: 'poster1',
        title: 'First Poster',
        hero: { src: '/p1.jpg', alt: 'First poster image' },
        colors: { bg: '#111', text: '#eee', title: '#fc0' },
        items: [
          { type: 'title-text', text: 'FIRST', kicker: 'THE' },
          { type: 'paragraph', text: 'Opening words.' },
          { type: 'section-title', text: 'Chapter A' },
          { type: 'paragraph', text: 'Body of chapter A.' },
          { type: 'end', text: 'Return to Exhibition' },
        ],
        talk: { [OPENING]: 'Opening question?', 'Chapter A': 'Question about A?' },
      },
      {
        id: 'poster2',
        title: 'Second Poster',
        hero: { src: '/p2.jpg', alt: 'Second poster image' },
        colors: { bg: '#222', text: '#ddd', title: '#fc0' },
        items: [
          { type: 'full-image', src: '/img.jpg', alt: 'A picture' },
          { type: 'quote', text: 'A quotation.' },
          { type: 'end', text: 'Return to Exhibition' },
        ],
        talk: {},
      },
    ],
    ...over,
  };
}

const press = (key: string) => fireEvent.keyDown(document, { key });
const tick = (ms = 400) => act(() => { jest.advanceTimersByTime(ms); });
/** The copy on the open panel (short lines are split into words for the reveal). */
const panelText = () => document.querySelector('.pe-walkthrough-content')?.textContent?.replace(/\s+/g, ' ') ?? '';
const liveRegion = () => document.querySelector('[aria-live="polite"][aria-atomic="true"]');

describe('PosterExhibition', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.sessionStorage.clear();
    window.history.replaceState(null, '', '/');
  });
  afterEach(() => {
    jest.useRealTimers();
    window.history.replaceState(null, '', '/');
  });

  it('draws the landing page: title, teach button, posters and any display cases', () => {
    const { rerender } = render(<PosterExhibition config={makeConfig()} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Test Exhibition' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Teach with this/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /First poster image/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Second poster image/ })).toBeInTheDocument();
    expect(screen.queryAllByRole('link').filter((l) => l.classList.contains('pe-display-case'))).toHaveLength(0);

    rerender(
      <PosterExhibition
        config={makeConfig({ cases: [{ href: '/case-1', image: { src: '/c.png', alt: 'A display case' }, label: 'Gallery II, Case 1', title: 'Case', subtitle: 'Sub' }] })}
      />,
    );
    const caseLink = screen.getByRole('link', { name: /A display case/ });
    expect(caseLink).toHaveAttribute('href', '/case-1');
    // the first poster, then the cases, then the rest
    const order = Array.from(document.querySelectorAll('.pe-exhibition-grid > *')).map((el) => el.getAttribute('data-poster') ?? 'case');
    expect(order).toEqual(['poster1', 'case', 'poster2']);
  });

  it('draws an empty case, photographs to come, for a display case with no photograph', () => {
    render(<PosterExhibition config={makeConfig({ cases: [{ href: '/case-1', label: 'Display Case', title: 'Artifacts' }] })} />);
    const caseLink = screen.getByRole('link', { name: /Display case — photographs to come/ });
    expect(caseLink).toHaveAttribute('href', '/case-1');
    expect(within(caseLink).queryAllByRole('img')).toHaveLength(0);
    expect(caseLink.querySelector('.pe-case-placeholder svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('remembers the floor position on the way back', () => {
    render(<PosterExhibition config={makeConfig()} />);
    fireEvent.click(screen.getByRole('link', { name: /First Floor/ }));
    expect(window.sessionStorage.getItem('firstFloorIndex')).toBe('3');
  });

  it('walks a poster with the keys, announces each panel, and closes on Escape', () => {
    render(<PosterExhibition config={makeConfig()} />);
    fireEvent.click(screen.getByRole('button', { name: /First poster image/ }));
    tick();
    expect(screen.getByRole('heading', { level: 1, name: 'First Poster' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /THE\s*FIRST/ })).toBeInTheDocument();
    expect(liveRegion()).toHaveTextContent(/^Panel 1 of 5\. Use the left and right arrow keys/);
    expect(screen.getByText(/swipe or tap to explore/)).toBeInTheDocument();

    press('ArrowRight');
    tick();
    expect(panelText()).toContain('Opening words.');
    expect(liveRegion()).toHaveTextContent('Panel 2 of 5.');
    expect(screen.queryByText(/swipe or tap to explore/)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Next panel' }));
    tick();
    expect(screen.getByRole('heading', { level: 2, name: 'Chapter A' })).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Previous panel' }));
    tick();
    expect(liveRegion()).toHaveTextContent('Panel 2 of 5.');

    press('Escape');
    tick();
    expect(screen.getByRole('heading', { level: 1, name: 'Test Exhibition' })).toBeInTheDocument();
    expect(liveRegion()).toHaveTextContent('');
    expect(screen.getByRole('button', { name: /First poster image/ })).toHaveFocus();
  });

  it('ends a poster on Return to Exhibition, with no list of lessons', () => {
    render(<PosterExhibition config={makeConfig({ slug: 'in-their-hands' })} />);
    fireEvent.click(screen.getByRole('button', { name: /First poster image/ }));
    tick();
    press('End');
    tick();
    expect(screen.queryByRole('button', { name: 'Next panel' })).toBeNull();
    expect(screen.queryByRole('heading', { name: /Teach this poster|For teachers/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /lessons/i })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Return to Exhibition' }));
    tick();
    expect(screen.getByRole('heading', { level: 1, name: 'Test Exhibition' })).toBeInTheDocument();
  });

  it('opens "Teach with this" as a dialog: choose a role, see its lessons by grade, close on Escape', () => {
    render(<PosterExhibition config={makeConfig({ slug: 'in-their-hands' })} />);
    const teach = screen.getByRole('button', { name: /Teach with this/ });
    teach.focus();
    fireEvent.click(teach);
    tick(50);
    const dialog = screen.getByRole('dialog', { name: 'Test Exhibition' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(within(dialog).getByRole('heading', { name: 'Who is teaching?' })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /Teacher/ }));
    expect(window.sessionStorage.getItem('mm-teach-role')).toBe('teacher');
    expect(within(dialog).getByRole('button', { name: 'Teacher' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(dialog).getByRole('heading', { name: 'Lessons by grade' })).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'PreK–K' })).toBeInTheDocument();
    // a faith-based lesson is one choice among the others, and says so
    expect(within(dialog).getByRole('link', { name: /Whose Image Is This\?.*Faith-based/ })).toHaveAttribute(
      'href',
      '/exhibitions/in-their-hands/lessons/whose-image-is-this',
    );
    expect(within(dialog).getByRole('link', { name: /Who Ruled Judaea\?/ }).textContent).not.toMatch(/Faith-based/);
    expect(within(dialog).getByRole('heading', { name: 'Printables' })).toBeInTheDocument();
    // the poster's chapter questions, and the classroom links that are not the resources page
    expect(within(dialog).getByText('Question about A?')).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /Teacher resources/ })).toHaveAttribute('href', '/resources');

    // a parent leads with talking about it
    fireEvent.click(within(dialog).getByRole('button', { name: 'Parent / homeschool' }));
    const groups = Array.from(dialog.querySelectorAll('h4')).map((h) => h.textContent);
    expect(groups[0]).toBe('Talk about it together');
    expect(within(dialog).getByRole('link', { name: /Parent Resource Guide/ })).toHaveAttribute('target', '_blank');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: 'Test Exhibition' })).toBeInTheDocument();
  });

  it('remembers the role, and opens projector mode from "Present the posters"', () => {
    window.sessionStorage.setItem('mm-teach-role', 'librarian');
    render(<PosterExhibition config={makeConfig()} />);
    fireEvent.click(screen.getByRole('button', { name: /Teach with this/ }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'For librarians' })).toBeInTheDocument();
    // no lessons for this exhibition: no lessons group, no printables
    expect(within(dialog).queryByRole('heading', { name: /Lessons/ })).toBeNull();
    expect(within(dialog).queryByRole('heading', { name: 'Printables' })).toBeNull();
    fireEvent.click(within(dialog).getByRole('button', { name: /Open projector mode/ }));
    tick();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('navigation', { name: 'Projector tools' })).toBeInTheDocument();
  });

  it('shows no lessons when the exhibition has none', () => {
    render(<PosterExhibition config={makeConfig()} />);
    expect(screen.queryByRole('link', { name: /lessons/i })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /First poster image/ }));
    tick();
    press('End');
    tick();
    expect(screen.getByRole('button', { name: 'Return to Exhibition' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Teach this poster|For teachers/ })).toBeNull();
  });

  it('opens a ?projector=1&poster=N&panel=N deep link at that panel, with its chapter question', () => {
    window.history.replaceState(null, '', '/x?projector=1&poster=1&panel=4');
    render(<PosterExhibition config={makeConfig()} />);
    tick(10);
    tick();
    expect(screen.getByRole('navigation', { name: 'Projector tools' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Teacher strip' })).toHaveTextContent('Panel 4 of 5');
    expect(screen.getByText('Question about A?')).toBeInTheDocument();
    expect(panelText()).toContain('Body of chapter A.');
    // the corner navigation and nav hint step aside for the projector
    expect(screen.queryByRole('link', { name: /First Floor/ })).toBeNull();
    expect(screen.queryByText(/swipe or tap to explore/)).toBeNull();
  });

  it('draws the projector’s end screen in place of Return to Exhibition', () => {
    window.history.replaceState(null, '', '/x?projector=1&poster=1&panel=5');
    render(<PosterExhibition config={makeConfig()} />);
    tick(10);
    tick();
    expect(screen.getByText('End of poster 1 of 2')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Return to Exhibition' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Continue to poster 2/ }));
    tick();
    expect(screen.getByRole('img', { name: 'A picture' })).toBeInTheDocument();
    expect(window.location.search).toBe('?projector=1&poster=2&panel=1');
  });

  it('ignores a poster deep link without ?projector=1', () => {
    window.history.replaceState(null, '', '/x?poster=2&panel=2');
    render(<PosterExhibition config={makeConfig()} />);
    tick(10);
    tick();
    expect(screen.getByRole('heading', { level: 1, name: 'Test Exhibition' })).toBeInTheDocument();
  });
});

describe('exhibition helpers', () => {
  const poster = makeConfig().posters[0];

  it('counts panels and lists the posters for the projector', () => {
    const cfg = makeConfig();
    expect(posterLengths(cfg.posters)).toEqual({ poster1: 5, poster2: 3 });
    const pj = projectorPosters(cfg.posters);
    expect(pj[0]).toMatchObject({ id: 'poster1', title: 'First Poster', thumb: '/p1.jpg' });
    expect(pj[0].items[2]).toEqual({ type: 'section-title', text: 'Chapter A' });
  });

  it('takes a panel’s colors from itself, then its section, then its poster', () => {
    const p = { ...poster, sections: { dark: { bg: '#000', text: '#ccc' } } };
    const item: PosterItem = { type: 'paragraph', text: 'x', section: 'dark', colors: { text: '#f00' } };
    expect(colorsFor(p, item)).toEqual({ bg: '#000', text: '#f00', title: '#fc0' });
    expect(colorsFor(p, { type: 'paragraph', text: 'x' })).toEqual({ bg: '#111', text: '#eee', title: '#fc0' });
  });

  it('chooses the reveal layer by mode', () => {
    const para: PosterItem = { type: 'paragraph', text: 'x' };
    const title: PosterItem = { type: 'section-title', text: 'T' };
    expect(veilFor('every-panel', para, 3)).toBe('text');
    expect(veilFor('chapters', para, 3)).toBeNull();
    expect(veilFor('chapters', title, 3)).toBe('title');
    expect(veilFor('chapters', para, 0)).toBe('media');
    expect(veilFor('first', para, 0)).toBe('media');
    expect(veilFor('first', para, 1)).toBeNull();
    expect(veilFor('none', para, 0)).toBeNull();
  });

  it('sets *starred* words in italics', () => {
    expect(emphasisRuns("WHY WE JUST *CAN'T* PUT")).toEqual([
      { text: 'WHY WE JUST ', em: false },
      { text: "CAN'T", em: true },
      { text: ' PUT', em: false },
    ]);
  });
});

describe('The Fear Lab', () => {
  it('has two posters, each ending with Return to Exhibition, and one display case', () => {
    expect(FEAR_LAB.posters.map((p) => p.id)).toEqual(['poster1', 'poster2']);
    for (const p of FEAR_LAB.posters) expect(p.items[p.items.length - 1].type).toBe('end');
    expect(FEAR_LAB.cases?.map((c) => [c.href, c.label, c.title])).toEqual([['/exhibitions/fear-lab/artifacts/case', 'Display Case', 'Artifacts']]);
  });

  it('keeps the record in its case, with a card for each artifact, beside an empty case awaiting its photographs', () => {
    render(<FearLabCase />);
    expect(screen.getByRole('heading', { level: 1, name: 'The Fear Lab' })).toBeInTheDocument();
    // Every line of the record is kept: the objects' lines (each object a card) and the display's.
    expect(recordLines(FEAR_LAB_CASE).map(plainText)).toEqual([
      'Two tactile, mystery Fear Boxes with rotating weekly contents',
      'Vintage collection of original Point Horror paperback editions with library cards',
      'Educational panels explaining the neuroscience of fear, pareidolia, and Gothic literature',
    ]);
    const cards = screen.getAllByRole('link', { name: /View artifact/ });
    expect(cards.map((c) => c.getAttribute('href'))).toEqual(['/exhibitions/fear-lab/artifacts/case/fear-boxes', '/exhibitions/fear-lab/artifacts/case/point-horror']);
    // No installation photographs: an empty case, drawn, stands in for them.
    expect(FEAR_LAB_CASE.photos).toHaveLength(0);
    expect(screen.getByText('Display case — photographs to come')).toBeInTheDocument();
    expect(JSON.stringify(FEAR_LAB_CASE)).not.toMatch(/installation|\.jpg/);
    // The lab opens from the case, under its Interactives tab.
    fireEvent.click(screen.getByRole('tab', { name: /Interactives/ }));
    expect(screen.getByRole('link', { name: /What Scares You\?/ })).toHaveAttribute('href', '/exhibitions/fear-lab/what-scares-you');
  });

  it.each(FEAR_LAB.posters.map((p) => [p.id, p] as const))('%s: one question per chapter, and none left over', (_id, p) => {
    const chapters = posterChapters(p.items.map((it) => ({ type: it.type, text: 'text' in it ? it.text : undefined })), p.title);
    expect(Object.keys(p.talk).sort()).toEqual(chapters.map((c) => c.key).sort());
    for (const c of chapters) expect(p.talk[c.key]).toBeTruthy();
  });

  it('carries the approved fact fixes, and links the two museums', () => {
    const items = FEAR_LAB.posters.flatMap((p) => p.items);
    const text = items.map((it) => ('text' in it ? it.text : '')).join('\n');
    expect(text).not.toMatch(/Allen Poe|ALLEN POE/);
    expect(text).toContain("Today's Red Eye series (Stripes Publishing's modern horror line)");
    expect(text).toContain('people saw imaginary faces as male about four times as often as female');
    expect(text).not.toContain('90%');
    const links = items.flatMap((it) => (it.type === 'callout' && it.url ? [it.url] : []));
    expect(links).toEqual(['https://poemuseum.org/', 'https://www.houseoffrankenstein.com/']);
  });
});
