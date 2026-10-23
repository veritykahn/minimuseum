import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ClassroomView } from '@/components/lesson/ClassroomView';
import ResourcesPage from '@/app/exhibitions/seeing-is-deceiving/resources/page';
import { getLesson, lessonsFor } from '@/lib/lessons';
import type { Lesson, Screen } from '@/lib/lessons/types';

const EXHIBITION = 'seeing-is-deceiving';
const BASE = `/exhibitions/${EXHIBITION}/lessons`;
const PUBLIC = path.join(__dirname, '../../public');
const lesson = (slug: string) => getLesson(EXHIBITION, slug)!;

// next/image is mocked to a plain <img>; keep its unknown-prop warnings quiet
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});
beforeEach(() => window.localStorage.clear());

/** press → until the step with this title is on screen (from the cover, or from step `from`) */
function goTo(l: Lesson, title: string, from = -1) {
  const k = l.steps.findIndex((s) => s.title === title);
  expect(k).toBeGreaterThan(from);
  for (let j = from; j < k; j++) {
    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowRight' });
    });
  }
  expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
}

/** every picture a screen shows */
function pictures(s: Screen): string[] {
  switch (s.kind) {
    case 'image':
      return [s.img.img];
    case 'pair':
      return s.items.map((i) => i.img);
    case 'gallery':
      return s.groups.flatMap((g) => g.items.map((i) => i.img));
    case 'chart':
      return s.rows.flatMap((r) => (r.img ? [r.img] : []));
    default:
      return [];
  }
}

const lessons = lessonsFor(EXHIBITION);

describe('Seeing is Deceiving lessons: shape', () => {
  it('has a lesson for each classroom plan', () => {
    expect(lessons.map((l) => l.slug)).toEqual([
      'my-eyes-can-trick-me',
      'brain-detective',
      'fact-checkers',
      'how-vision-works',
      'evaluating-sources',
      'visual-propaganda-through-history',
      'creating-optical-illusions',
      'geometry-of-perspective',
      'vision-and-athletics',
      'bearing-true-witness',
      'verdad-o-mentira',
      'the-art-of-illusion',
      'sound-illusions',
    ]);
  });

  it.each(lessons.map((l) => [l.slug, l] as const))('%s keeps to its plan’s minutes', (_, l) => {
    const planned = l.phases.reduce((a, p) => a + p.minutes, 0);
    expect(l.totalMinutes).toBe(planned);
    expect(l.steps.reduce((a, s) => a + s.minutes, 0)).toBe(planned);
    expect(l.sub).toContain(`${planned} minutes`);
  });

  it.each(lessons.map((l) => [l.slug, l] as const))('%s links its plan and three handouts, all on disk', (_, l) => {
    expect(l.handouts.map((h) => h.key)).toEqual(['green', 'yellow', 'red']);
    for (const href of [l.lessonPlan, ...l.handouts.map((h) => h.href)]) {
      expect(fs.existsSync(path.join(PUBLIC, href))).toBe(true);
    }
  });

  it.each(lessons.map((l) => [l.slug, l] as const))('%s shows only pictures the site already has', (_, l) => {
    const imgs = [l.hero?.img, ...l.steps.flatMap((s) => pictures(s.screen))].filter(Boolean) as string[];
    for (const img of imgs) expect(fs.existsSync(path.join(PUBLIC, img))).toBe(true);
  });

  it.each(lessons.map((l) => [l.slug, l] as const))('%s gives every step a purpose, a script and materials', (_, l) => {
    expect(l.objective[0]).toBeTruthy();
    expect(l.materials.length).toBeGreaterThan(0);
    expect(l.connection.length).toBeGreaterThan(0);
    for (const s of l.steps) {
      expect(s.purpose).toBeTruthy();
      expect(s.script.length).toBeGreaterThan(0);
    }
  });
});

describe('illusions on screen', () => {
  it('shows the checker shadow large, then reveals it', () => {
    const l = lesson('fact-checkers');
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'Same or different?');
    expect(screen.getByAltText(/A checkerboard with a brown cylinder/)).toBeInTheDocument();
    expect(screen.getByText('Checker Shadow')).toBeInTheDocument();
    expect(screen.getByText('Are they the same color or different colors?')).toBeInTheDocument();
    goTo(l, 'Exactly the same color', l.steps.findIndex((s) => s.title === 'Same or different?'));
    expect(screen.getByAltText(/squares A and B alone on black/)).toBeInTheDocument();
    expect(screen.getByText('These squares are EXACTLY the same color!')).toBeInTheDocument();
  });

  it('credits the Rotating Snakes as the Perception Lab does', () => {
    const l = lesson('fact-checkers');
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'Is this picture moving?');
    expect(screen.getByText('Rotating Snakes · Akiyoshi Kitaoka, 2003')).toBeInTheDocument();
  });

  it('sets the vase and the faces side by side for the youngest', () => {
    const l = lesson('my-eyes-can-trick-me');
    expect(l.large).toBe(true);
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'Both are right!');
    expect(screen.getByText('A vase')).toBeInTheDocument();
    expect(screen.getByText('Two faces')).toBeInTheDocument();
  });

  it('charts where in the visual system each illusion happens', () => {
    const l = lesson('how-vision-works');
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'Where does it happen?');
    const heads = screen.getAllByRole('columnheader').map((h) => h.textContent);
    expect(heads).toEqual(['Illusion', 'What', 'Why', 'Location']);
    expect(screen.getAllByRole('rowheader')).toHaveLength(4);
  });
});

describe('Resources page', () => {
  it.each([
    ['PreK–K', null, 'my-eyes-can-trick-me', 20],
    ['Grades 5–8', 'Science', 'how-vision-works', 30],
    ['Grades 5–8', 'Music', 'sound-illusions', 30],
  ])('offers Lesson mode to %s %s teachers', async (grade, subject, slug, minutes) => {
    jest.useFakeTimers();
    render(<ResourcesPage />);
    const choose = async (name: string) => {
      fireEvent.click(screen.getByRole('button', { name }));
      await act(async () => {
        jest.advanceTimersByTime(400);
      });
    };
    await choose('Teacher');
    await choose(grade);
    if (subject) await choose(subject);
    const link = screen.getByRole('link', { name: /Teach this lesson on screen/ });
    expect(link).toHaveAttribute('href', `${BASE}/${slug}`);
    expect(link).toHaveTextContent(`a ${minutes}-minute timer`);
    jest.useRealTimers();
  });
});
