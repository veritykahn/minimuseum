import fs from 'fs';
import path from 'path';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import PosterProjector, { PosterProjectorEnd, type ProjectorPoster } from '@/components/projector/PosterProjector';
import { posterKeyCommand } from '@/components/projector/posterKeys';
import { HARLEM_TALK, ITH_TALK, OPENING, SEEING_TALK, chapterAt, posterChapters } from '@/components/projector/posterTalk';
import { posterRequested, projectorRequested, usePosterDeepLink, writeProjectorParams } from '@/components/projector/useProjectorMode';

const ctx = { open: true, blank: false, onControl: false, inField: false };

describe('posterKeyCommand', () => {
  it('moves with arrows, page keys, Space, Home and End', () => {
    expect(posterKeyCommand('ArrowRight', ctx)).toEqual({ type: 'next' });
    expect(posterKeyCommand('PageDown', ctx)).toEqual({ type: 'next' });
    expect(posterKeyCommand(' ', ctx)).toEqual({ type: 'next' });
    expect(posterKeyCommand('ArrowLeft', ctx)).toEqual({ type: 'prev' });
    expect(posterKeyCommand('PageUp', ctx)).toEqual({ type: 'prev' });
    expect(posterKeyCommand('Home', ctx)).toEqual({ type: 'first' });
    expect(posterKeyCommand('End', ctx)).toEqual({ type: 'last' });
  });

  it('leaves Space to a focused button, and every key to a text field or a modifier', () => {
    expect(posterKeyCommand(' ', { ...ctx, onControl: true })).toBeNull();
    expect(posterKeyCommand('ArrowRight', { ...ctx, inField: true })).toBeNull();
    expect(posterKeyCommand('ArrowRight', ctx, { ctrl: true })).toBeNull();
    expect(posterKeyCommand('b', ctx, { meta: true })).toBeNull();
  });

  it('blanks with B or a clicker’s “.”, and any moving key only brings the screen back', () => {
    expect(posterKeyCommand('b', ctx)).toEqual({ type: 'blank' });
    expect(posterKeyCommand('.', ctx)).toEqual({ type: 'blank' });
    expect(posterKeyCommand('B', { ...ctx, blank: true })).toEqual({ type: 'unblank' });
    for (const k of ['ArrowRight', 'ArrowLeft', 'PageDown', ' ', 'Escape', 'End']) {
      expect(posterKeyCommand(k, { ...ctx, blank: true })).toEqual({ type: 'unblank' });
    }
  });

  it('toggles the strip and full screen, and takes Escape so the poster stays open', () => {
    expect(posterKeyCommand('t', ctx)).toEqual({ type: 'strip' });
    expect(posterKeyCommand('F', ctx)).toEqual({ type: 'fullscreen' });
    expect(posterKeyCommand('Escape', ctx)).toEqual({ type: 'swallow' });
    expect(posterKeyCommand('Home', { ...ctx, open: false })).toBeNull();
  });
});

describe('projector deep links', () => {
  it('reads ?projector=1 and ?poster=N&panel=N, clamped', () => {
    expect(projectorRequested('?projector=1')).toBe(true);
    expect(projectorRequested('?projector=0')).toBe(false);
    expect(posterRequested('?projector=1&poster=2&panel=7', [10, 20])).toEqual({ poster: 1, panel: 6 });
    expect(posterRequested('?poster=1&panel=99', [10, 20])).toEqual({ poster: 0, panel: 9 });
    expect(posterRequested('?poster=1', [10, 20])).toEqual({ poster: 0, panel: 0 });
    expect(posterRequested('?poster=3', [10, 20])).toBeNull();
    expect(posterRequested('', [10, 20])).toBeNull();
  });

  it('writes the position into the address, and clears it on exit', () => {
    writeProjectorParams(true, { poster: 1, panel: 4 });
    expect(window.location.search).toBe('?projector=1&poster=2&panel=5');
    writeProjectorParams(false);
    expect(window.location.search).toBe('');
  });

  it('opens the linked poster at the linked panel, only with ?projector=1', () => {
    jest.useFakeTimers();
    const open = jest.fn();
    window.history.replaceState(null, '', '/x?projector=1&poster=2&panel=3');
    renderHook(() => usePosterDeepLink(['poster1', 'poster2'] as const, { poster1: 5, poster2: 8 }, open));
    act(() => { jest.advanceTimersByTime(10); });
    expect(open).toHaveBeenCalledWith('poster2', 2);

    open.mockClear();
    window.history.replaceState(null, '', '/x?poster=2&panel=3');
    renderHook(() => usePosterDeepLink(['poster1', 'poster2'] as const, { poster1: 5, poster2: 8 }, open));
    act(() => { jest.advanceTimersByTime(10); });
    expect(open).not.toHaveBeenCalled();
    window.history.replaceState(null, '', '/');
    jest.useRealTimers();
  });
});

describe('Talk about it', () => {
  // Every chapter of every poster has a question, keyed by its exact title.
  const pages: [string, { poster1: Record<string, string>; poster2: Record<string, string> }][] = [
    ['seeing-is-deceiving', SEEING_TALK],
    ['harlem-renaissance', HARLEM_TALK],
    ['in-their-hands', ITH_TALK],
  ];
  it.each(pages)('%s: one question per chapter, and none left over', (slug, talk) => {
    const src = fs.readFileSync(path.join(process.cwd(), 'app/exhibitions', slug, 'page.tsx'), 'utf8');
    const p2 = src.indexOf('const poster2Content');
    const end = src.indexOf('];', p2);
    const titles = (s: string) =>
      [...s.matchAll(/type: 'section-title',\s*\n\s*text: '((?:[^'\\]|\\.)*)'/g)].map((m) => m[1].replace(/\\'/g, "'"));
    const t1 = titles(src.slice(0, p2));
    const t2 = titles(src.slice(p2, end));
    expect(t1.length).toBeGreaterThan(1);
    for (const [titlesOf, map] of [[t1, talk.poster1], [t2, talk.poster2]] as const) {
      for (const t of titlesOf) expect(map[t]).toBeTruthy();
      const keys = Object.keys(map).filter((k) => k !== OPENING);
      expect(keys.sort()).toEqual([...titlesOf].sort());
    }
  });

  it('finds chapters, with an opening only when it holds more than title panels', () => {
    const items = [
      { type: 'title-image' },
      { type: 'paragraph', text: 'a' },
      { type: 'section-title', text: 'One' },
      { type: 'paragraph', text: 'b' },
      { type: 'end' },
    ];
    const ch = posterChapters(items, 'Poster');
    expect(ch.map((c) => [c.start, c.name, c.key])).toEqual([[0, 'Poster', OPENING], [2, 'One', 'One']]);
    expect(chapterAt(ch, 3)?.name).toBe('One');
    expect(posterChapters([{ type: 'title-image' }, { type: 'section-title', text: 'A' }], 'P')).toHaveLength(1);
    expect(chapterAt(posterChapters([{ type: 'title-image' }, { type: 'section-title', text: 'A' }], 'P'), 0)).toBeNull();
  });
});

describe('PosterProjector', () => {
  const posters: ProjectorPoster<'poster1' | 'poster2'>[] = [
    {
      id: 'poster1',
      title: 'First Poster',
      thumb: '/p1.jpg',
      items: [{ type: 'title-image' }, { type: 'section-title', text: 'Chapter A' }, { type: 'paragraph', text: 'Words.' }, { type: 'end' }],
      talk: { 'Chapter A': 'What do you think about A?' },
    },
    { id: 'poster2', title: 'Second Poster', thumb: '/p2.jpg', items: [{ type: 'title-image' }, { type: 'end' }], talk: {} },
  ];

  function setup(over: Partial<React.ComponentProps<typeof PosterProjector<'poster1' | 'poster2'>>> = {}) {
    const fns = {
      onExit: jest.fn(),
      openPoster: jest.fn(),
      goToStep: jest.fn(),
      nextStep: jest.fn(),
      prevStep: jest.fn(),
      returnToMain: jest.fn(),
    };
    const props = {
      on: true,
      exhibition: 'Test Exhibition',
      theme: {},
      links: [{ label: 'Teacher resources', href: '/resources' }],
      posters,
      activeView: 'poster1' as const,
      step: 2,
      ...fns,
      ...over,
    };
    const r = render(
      <PosterProjector {...props}>
        <div data-poster-stage="">
          <h2>Panel</h2>
          {props.step === 3 && <PosterProjectorEnd />}
        </div>
      </PosterProjector>,
    );
    return { ...r, ...fns, props };
  }
  const press = (key: string) => fireEvent.keyDown(document.body, { key });
  const blanked = () => screen.queryAllByText(/Screen blanked/).some((e) => e.tagName === 'P');

  afterEach(() => window.history.replaceState(null, '', '/'));

  it('renders only the walkthrough when off', () => {
    setup({ on: false });
    expect(screen.queryByRole('navigation', { name: 'Projector tools' })).toBeNull();
    expect(screen.getByRole('heading', { name: 'Panel' })).toBeInTheDocument();
  });

  it('shows the teacher strip with the chapter question, and T toggles it', () => {
    setup();
    expect(screen.getByRole('region', { name: 'Teacher strip' })).toHaveTextContent('Panel 3 of 4');
    expect(screen.getByText('What do you think about A?')).toBeInTheDocument();
    expect(screen.getByText('Chapter A')).toBeInTheDocument();
    press('t');
    expect(screen.queryByRole('region', { name: 'Teacher strip' })).toBeNull();
    expect(screen.getByRole('button', { name: /Teacher strip/ })).toHaveAttribute('aria-pressed', 'false');
    press('T');
    expect(screen.getByRole('region', { name: 'Teacher strip' })).toBeInTheDocument();
  });

  it('drives the walkthrough from the keys, and keeps the address in step', () => {
    const { nextStep, prevStep, goToStep } = setup();
    press('ArrowRight');
    press('PageDown');
    press(' ');
    expect(nextStep).toHaveBeenCalledTimes(3);
    press('ArrowLeft');
    press('PageUp');
    expect(prevStep).toHaveBeenCalledTimes(2);
    press('Home');
    press('End');
    expect(goToStep.mock.calls).toEqual([[0], [3]]);
    expect(window.location.search).toBe('?projector=1&poster=1&panel=3');
  });

  it('blanks the screen with B; a moving key brings it back without moving', () => {
    const { nextStep } = setup();
    press('b');
    expect(blanked()).toBe(true);
    press('ArrowRight');
    expect(nextStep).not.toHaveBeenCalled();
    expect(blanked()).toBe(false);
    press('.');
    expect(blanked()).toBe(true);
    press('B');
    expect(blanked()).toBe(false);
  });

  it('keeps Escape from closing the poster underneath', () => {
    const { returnToMain, onExit } = setup();
    const outer = jest.fn();
    document.addEventListener('keydown', outer);
    press('Escape');
    expect(outer).not.toHaveBeenCalled();
    expect(returnToMain).not.toHaveBeenCalled();
    expect(onExit).not.toHaveBeenCalled();
    document.removeEventListener('keydown', outer);
  });

  it('ends a poster with Continue to poster 2 (→ too) and the classroom links', () => {
    const { openPoster } = setup({ step: 3 });
    expect(screen.getByRole('heading', { name: 'First Poster' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Teacher resources/ })).toHaveAttribute('href', '/resources');
    fireEvent.click(screen.getByRole('button', { name: /Continue to poster 2/ }));
    expect(openPoster).toHaveBeenLastCalledWith('poster2');
    press('ArrowRight');
    expect(openPoster).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole('button', { name: 'Chapter A' }));
  });

  it('shows the poster picker when no poster is open, and exits', () => {
    const { openPoster, onExit } = setup({ activeView: 'main', step: 0 });
    expect(screen.getByRole('heading', { level: 1, name: 'Test Exhibition' })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: /Second Poster/ }));
    expect(openPoster).toHaveBeenCalledWith('poster2');
    press('ArrowRight');
    expect(openPoster).toHaveBeenLastCalledWith('poster1');
    fireEvent.click(screen.getByRole('button', { name: 'Exit projector' }));
    expect(onExit).toHaveBeenCalled();
  });
});
