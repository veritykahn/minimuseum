import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { ClassroomView } from '@/components/lesson/ClassroomView';
import ResourcesPage from '@/app/exhibitions/harlem-renaissance/resources/page';
import { ON_SCREEN_LESSONS } from '@/app/exhibitions/harlem-renaissance/resources/data/resource-data';
import { getLesson, lessonsFor } from '@/lib/lessons';
import type { Lesson } from '@/lib/lessons/types';

const EX = 'harlem-renaissance';
const BASE = `/exhibitions/${EX}/lessons`;
const lesson = (slug: string) => getLesson(EX, slug)!;
const lessons = lessonsFor(EX);

// next/image is mocked to a plain <img>; keep its unknown-prop warnings quiet
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});
beforeEach(() => window.localStorage.clear());

/** press → until the step with this title is on screen */
function goTo(l: Lesson, title: string) {
  const k = l.steps.findIndex((s) => s.title === title);
  expect(k).toBeGreaterThanOrEqual(0);
  for (let j = -1; j < k; j++) {
    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowRight' });
    });
  }
  expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
}

/** every file a lesson shows or plays */
function files(l: Lesson): string[] {
  const out: string[] = [];
  const walk = (x: unknown, key?: string) => {
    if (typeof x === 'string') {
      if ((key === 'img' || key === 'src' || key === 'echo') && x.startsWith('/')) out.push(x);
    } else if (Array.isArray(x)) x.forEach((v) => walk(v, key));
    else if (x && typeof x === 'object') Object.entries(x).forEach(([k, v]) => walk(v, k));
  };
  walk(l);
  return out;
}

const flat = (t: string) => t.replace(/\*+/g, '').replace(/\s+/g, ' ').toLowerCase();

describe('Harlem Renaissance lessons: shape', () => {
  it('lists one lesson for each plan on the Resources page', () => {
    expect(lessons.map((l) => l.slug).sort()).toEqual(Object.values(ON_SCREEN_LESSONS).sort());
    expect(lessons).toHaveLength(13);
  });

  it.each(lessons.map((l) => [l.slug, l]))('%s: its steps fill the timing bar', (_, l) => {
    expect(l.steps.reduce((a, s) => a + s.minutes, 0)).toBe(l.totalMinutes);
    expect(l.phases.reduce((a, p) => a + p.minutes, 0)).toBe(l.totalMinutes);
  });

  it.each(lessons.map((l) => [l.slug, l]))('%s: every step has a purpose, a task and a script', (_, l) => {
    for (const s of l.steps) {
      expect(s.purpose).toBeTruthy();
      expect(s.students?.length).toBeGreaterThan(0);
    }
    // the only steps without a paragraph of their own are a plan's bare "Activity" headings
    for (const s of l.steps.filter((x) => x.script.length === 0)) expect(s.screen.kind).toBe('levels');
  });

  it.each(lessons.map((l) => [l.slug, l]))('%s: links its own plan and its three handouts', (_, l) => {
    expect(fs.existsSync(path.join(process.cwd(), 'public', l.lessonPlan))).toBe(true);
    expect(l.handouts.map((h) => h.key)).toEqual(['green', 'yellow', 'red']);
    const folder = path.dirname(l.lessonPlan);
    for (const h of l.handouts) {
      expect(path.dirname(h.href)).toBe(folder);
      expect(fs.existsSync(path.join(process.cwd(), 'public', h.href))).toBe(true);
    }
  });

  it.each(lessons.map((l) => [l.slug, l]))('%s: shows only the exhibition’s own files, and no Douglas still in copyright', (_, l) => {
    for (const f of files(l)) {
      expect(f.startsWith('/exhibitions/harlem/')).toBe(true);
      expect(fs.existsSync(path.join(process.cwd(), 'public', f))).toBe(true);
      expect(f).not.toMatch(/aspiration|creation/);
    }
  });

  it.each(lessons.map((l) => [l.slug, l]))('%s: sets large only words the plan says', (_, l) => {
    for (const s of l.steps) {
      if (s.screen.kind !== 'words') continue;
      const said = flat(s.script.join(' '));
      for (const line of s.screen.text.split('\n')) expect(said).toContain(flat(line));
    }
  });
});

describe('Stories of a Great Journey (Grades 1–2)', () => {
  const l = lesson('stories-of-a-great-journey');

  it('plays the exhibition’s own Bessie Smith record for the hook', () => {
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'A song from far away');
    const player = screen.getByLabelText('“Woman’s Trouble Blues”');
    expect(player.tagName).toBe('AUDIO');
    expect(player).toHaveAttribute('src', '/exhibitions/harlem/artifacts/audio/womans-trouble-blues.mp3');
    expect(screen.getByText(/Close your eyes and just listen/)).toBeInTheDocument();
  });

  it('traces the journey with the Migration Map’s photographs and their credits', () => {
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'The big move');
    expect(screen.getByAltText(/Workers picking cotton/)).toBeInTheDocument();
    expect(screen.getByText(/This field is in Georgia, not the Delta/)).toBeInTheDocument();
  });
});

describe('Seeing in Silhouette (Art 5–8)', () => {
  const l = lesson('seeing-in-silhouette');

  it('names Song of the Towers and links to the museum’s page instead of showing it', () => {
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'What do you see?');
    expect(screen.getByText('Song of the Towers')).toBeInTheDocument();
    expect(screen.getByText('Aaron Douglas · 1934')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Song of the Towers \(1934\) — Schomburg Center, NYPL/ });
    expect(link.getAttribute('href')).toMatch(/^https:\/\/digitalcollections\.nypl\.org\//);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('projects the five techniques as a chart', () => {
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'Five signature techniques');
    const table = screen.getByRole('table', { name: /five signature techniques/ });
    expect(within(table).getAllByRole('rowheader')).toHaveLength(5);
  });
});

describe('Migration by Numbers (Math 5–8)', () => {
  const l = lesson('migration-by-numbers');

  it('reads Chicago’s population from the plan’s census table', () => {
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'Reading the data');
    const rows = within(screen.getByRole('table')).getAllByRole('row');
    expect(rows).toHaveLength(7);
    expect(rows[6]).toHaveTextContent('1960812,637');
  });

  it('works the percentage changes to the right answers', () => {
    const step = l.steps.find((s) => s.title === 'Percentage change')!;
    expect(step.screen.kind).toBe('worked');
    if (step.screen.kind !== 'worked') return;
    const pct = (a: number, b: number) => (((b - a) / a) * 100).toFixed(1);
    expect(step.screen.examples.map((e) => e.answer)).toEqual([
      `${pct(44103, 109458)}% increase`,
      `${pct(492265, 812637)}% increase`,
    ]);
  });
});

describe('Rhythm, Sound & the Science of Music (Science 5–8)', () => {
  it('plays a trumpet, a bass and a piano from the Jazz Lab', () => {
    const l = lesson('rhythm-sound-and-the-science-of-music');
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'What is sound?');
    for (const name of ['Trumpet', 'Double bass', 'Piano']) {
      expect(screen.getByLabelText(name).getAttribute('src')).toMatch(/^\/exhibitions\/harlem\/audio\/guess-instrument\//);
    }
  });
});

describe('Resources page', () => {
  const choose = async (name: string) => {
    fireEvent.click(screen.getByRole('button', { name }));
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
  };

  it.each([
    ['PreK–K', 'music-stories-and-movement'],
    ['Grades 1–2', 'stories-of-a-great-journey'],
    ['Grades 3–4', 'making-something-new'],
  ])('offers Lesson mode to %s teachers', async (grade, slug) => {
    jest.useFakeTimers();
    render(<ResourcesPage />);
    await choose('Teacher');
    await choose(grade);
    const link = screen.getByRole('link', { name: /Teach this lesson on screen/ });
    expect(link).toHaveAttribute('href', `${BASE}/${slug}`);
    expect(link).toHaveTextContent(`a ${lesson(slug).totalMinutes}-minute timer`);
    jest.useRealTimers();
  });

  it.each([
    ['Science', 'rhythm-sound-and-the-science-of-music'],
    ['ELA', 'voice-and-verse'],
    ['Social Studies', 'why-people-move'],
    ['Art', 'seeing-in-silhouette'],
    ['Math', 'migration-by-numbers'],
    ['PE', 'move-like-harlem'],
    ['Religion', 'created-in-gods-image'],
    ['Spanish', 'el-renacimiento-de-harlem'],
    ['Theater', 'voice-body-story'],
    ['Music', 'the-sound-of-harlem'],
  ])('offers Lesson mode to Grades 5–8 %s teachers', async (subject, slug) => {
    jest.useFakeTimers();
    render(<ResourcesPage />);
    await choose('Teacher');
    await choose('Grades 5–8');
    await choose(subject);
    expect(screen.getByRole('link', { name: /Teach this lesson on screen/ })).toHaveAttribute('href', `${BASE}/${slug}`);
    jest.useRealTimers();
  });

  it('offers no Lesson mode to librarians', async () => {
    jest.useFakeTimers();
    render(<ResourcesPage />);
    await choose('Librarian');
    await choose('PreK–K');
    expect(screen.queryByRole('link', { name: /Teach this lesson on screen/ })).not.toBeInTheDocument();
    jest.useRealTimers();
  });
});
