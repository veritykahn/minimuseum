import { render, screen, fireEvent, act } from '@testing-library/react';
import { ClassroomView } from '@/components/lesson/ClassroomView';
import ResourcesPage from '@/app/exhibitions/in-their-hands/resources/page';
import { getLesson, lessonsFor } from '@/lib/lessons';
import type { Lesson } from '@/lib/lessons';

const BASE = '/exhibitions/in-their-hands/lessons';

// the three In Their Hands lessons for the younger grades: slug, minutes, objectives
const YOUNGER: [string, number, number, string][] = [
  ['two-tiny-coins', 25, 3, 'PreK–K'],
  ['whose-hands-held-this', 30, 4, 'Grades 1–2'],
  ['coin-detectives', 40, 4, 'Grades 3–4'],
];

const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});
beforeEach(() => window.localStorage.clear());

function next(times = 1) {
  for (let k = 0; k < times; k++) {
    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowRight' });
    });
  }
}

describe.each(YOUNGER)('exported lesson %s', (slug, total, count) => {
  const lesson = getLesson('in-their-hands', slug) as Lesson;

  it('exists, set large for young classes, and its steps fill the timing bar', () => {
    expect(lesson).toBeDefined();
    expect(lesson.large).toBe(true);
    expect(lesson.totalMinutes).toBe(total);
    expect(lesson.steps.reduce((a, s) => a + s.minutes, 0)).toBe(total);
    expect(lesson.phases.reduce((a, p) => a + p.minutes, 0)).toBe(total);
  });

  it('gives every step a script, a purpose and a task', () => {
    for (const s of lesson.steps) {
      expect(s.script.length).toBeGreaterThan(0);
      expect(s.purpose).toBeTruthy();
      expect(s.students?.length).toBeGreaterThan(0);
    }
  });

  it('asks every objective back in the look back, within the lesson', () => {
    const o = lesson.objectives!;
    expect(o.items).toHaveLength(count);
    expect(o.why).toBeTruthy();
    const review = lesson.steps.find((s) => s.screen.kind === 'review')!;
    expect(review.students).toEqual(o.items.map((i) => i.question));
    expect(review.screen.kind === 'review' && review.screen.hint).toMatch(/thumb/);
  });

  it('never shows Herod’s order in Bethlehem, and every picture has words', () => {
    const text = JSON.stringify(lesson);
    expect(text).not.toContain('herod-tissot');
    for (const s of lesson.steps) {
      const sc = s.screen;
      if (sc.kind === 'pair') sc.items.forEach((i) => expect(i.alt).toBeTruthy());
      if (sc.kind === 'people') sc.people.forEach((p) => expect(p.alt).toBeTruthy());
      if (sc.kind === 'person') expect(sc.person.alt).toBeTruthy();
      if (sc.kind === 'coins') sc.coins.forEach((c) => expect(c.alt).toBeTruthy());
    }
  });
});

describe('lesson index', () => {
  it('lists the younger lessons before Grades 5–8 Religion', () => {
    expect(lessonsFor('in-their-hands').map((l) => l.slug).slice(0, 4)).toEqual([
      'two-tiny-coins',
      'whose-hands-held-this',
      'coin-detectives',
      'whose-image-is-this',
    ]);
  });
});

describe('Two Tiny Coins on screen', () => {
  const lesson = getLesson('in-their-hands', 'two-tiny-coins')!;

  it('says the objectives as a child would on the cover', () => {
    render(<ClassroomView lesson={lesson} basePath={BASE} />);
    expect(screen.getByRole('heading', { level: 2, name: 'I can…' })).toBeInTheDocument();
    expect(screen.getByText('count the widow’s two coins')).toBeInTheDocument();
    // the teacher's wording stays in the notes
    act(() => {
      fireEvent.keyDown(window, { key: 'n' });
    });
    const notes = screen.getByRole('complementary', { name: 'Teacher notes' });
    expect(notes).toHaveTextContent('By the end of this lesson you will be able to:');
  });

  it('opens on two pictures to compare, each labeled', () => {
    render(<ClassroomView lesson={lesson} basePath={BASE} />);
    next();
    expect(screen.getByRole('heading', { level: 1, name: 'Many coins, two coins' })).toBeInTheDocument();
    expect(screen.getByText('Many coins')).toBeInTheDocument();
    expect(screen.getByText('Two tiny coins')).toBeInTheDocument();
    expect(screen.getByAltText('The widow’s cupped hands, holding two tiny coins')).toBeInTheDocument();
    expect(screen.getByText('Who gave more? Point!')).toBeInTheDocument();
  });
});

describe('Whose Hands Held This? on screen', () => {
  const lesson = getLesson('in-their-hands', 'whose-hands-held-this')!;

  it('meets each person by their hands, with their story', () => {
    render(<ClassroomView lesson={lesson} basePath={BASE} />);
    next(3);
    expect(screen.getByRole('heading', { level: 1, name: 'The Widow' })).toBeInTheDocument();
    expect(screen.getByText(/A poor widow came and put in two tiny coins/)).toBeInTheDocument();
    expect(screen.getByAltText('Old, cupped hands holding two tiny coins')).toBeInTheDocument();
    next(3);
    expect(screen.getByRole('heading', { level: 1, name: 'The Temple Priest' })).toBeInTheDocument();
    expect(screen.getByText('Replica')).toBeInTheDocument();
  });

  it('names its questions as the plan does, for the presenter', () => {
    expect(lesson.questionsLabel).toBe('Questions for story time');
    expect(lesson.questions).toHaveLength(4);
  });
});

describe('Coin Detectives on screen', () => {
  const lesson = getLesson('in-their-hands', 'coin-detectives')!;

  it('asks which is the fake, then shows the proof', () => {
    render(<ClassroomView lesson={lesson} basePath={BASE} />);
    next(3);
    expect(screen.getByRole('heading', { level: 1, name: 'Real or fake?' })).toBeInTheDocument();
    expect(screen.getByText('Coin A')).toBeInTheDocument();
    expect(screen.getByText('Coin B')).toBeInTheDocument();
    expect(screen.queryByText('Fake')).not.toBeInTheDocument();
    next();
    expect(screen.getByRole('heading', { level: 1, name: 'The proof' })).toBeInTheDocument();
    expect(screen.getByText('Fake')).toBeInTheDocument();
    expect(screen.getByText('Genuine')).toBeInTheDocument();
    expect(screen.getByText(/If a lepton looks perfect, be suspicious/)).toBeInTheDocument();
  });
});

describe('Resources page', () => {
  it.each(YOUNGER)('offers Lesson mode for %s to its grade', async (slug, _m, _n, grade) => {
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
    expect(screen.getByRole('link', { name: /Teach this lesson on screen/ })).toHaveAttribute('href', `${BASE}/${slug}`);
    jest.useRealTimers();
  });
});
