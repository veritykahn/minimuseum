import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { ClassroomView } from '@/components/lesson/ClassroomView';
import ResourcesPage from '@/app/exhibitions/in-their-hands/resources/page';
import { getLesson, lessonsFor } from '@/lib/lessons';
import type { Lesson, Screen } from '@/lib/lessons/types';

const BASE = '/exhibitions/in-their-hands/lessons';
const SLUGS = ['who-ruled-judaea', 'the-numbers-in-the-coins', 'small-works-of-power'];
const lesson = (slug: string) => getLesson('in-their-hands', slug)!;

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

describe('Grades 5–8 lessons: shape', () => {
  it.each(SLUGS)('%s is listed, runs 45 minutes and ends with a look back', (slug) => {
    const l = lesson(slug);
    expect(lessonsFor('in-their-hands').map((x) => x.slug)).toContain(slug);
    expect(l.totalMinutes).toBe(45);
    expect(l.steps.reduce((a, s) => a + s.minutes, 0)).toBe(45);
    const last = l.steps[l.steps.length - 1];
    expect(last.screen.kind).toBe('review');
    expect(last.title).toBe('Look back');
  });

  it.each(SLUGS)('%s sets out 3–4 objectives, the last to go deeper, and asks each back', (slug) => {
    const l = lesson(slug);
    const o = l.objectives!;
    expect(o.heading).toBe('By the end of this lesson you will be able to:');
    expect(o.items.length).toBeGreaterThanOrEqual(3);
    expect(o.items.length).toBeLessThanOrEqual(4);
    expect(o.items.map((i) => Boolean(i.deeper))).toEqual(o.items.map((_, k) => k === o.items.length - 1));
    expect(o.why.length).toBeGreaterThan(20);
    const review = l.steps[l.steps.length - 1];
    expect(review.students).toEqual(o.items.map((i) => i.question));
    expect(review.screen).toMatchObject({ kind: 'review', lead: 'Can you now…', deeper: [o.items.length - 1] });
  });

  it.each(SLUGS)('%s gives every step a purpose and a task', (slug) => {
    for (const s of lesson(slug).steps) {
      expect(s.purpose).toBeTruthy();
      expect(s.students?.length).toBeGreaterThan(0);
    }
  });
});

describe('Who Ruled Judaea?', () => {
  const l = lesson('who-ruled-judaea');

  it('projects the Who ruled when chart, nine rulers, replicas marked', () => {
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'Who ruled when');
    const table = screen.getByRole('table', { name: /Who ruled when/ });
    const heads = within(table).getAllByRole('columnheader').map((h) => h.textContent);
    expect(heads).toEqual(['Ruler', 'Title', 'Where', 'Years', 'Scripture']);
    const rows = within(table).getAllByRole('rowheader');
    expect(rows).toHaveLength(9);
    expect(rows[0]).toHaveTextContent('Augustus');
    expect(rows.filter((r) => r.textContent?.includes('Replica')).map((r) => r.textContent)).toEqual([
      'TiberiusReplica',
      'Herod AntipasReplica',
    ]);
    // the chart region scrolls on a phone, so it takes focus
    expect(screen.getByRole('region', { name: /Who ruled when/ })).toHaveAttribute('tabindex', '0');
  });

  it('sorts the coins into four kinds of power', () => {
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'Four kinds of power');
    for (const h of ['The emperor in Rome', 'Herod’s family', 'The Roman governors', 'Beyond the border']) {
      expect(screen.getByRole('heading', { level: 2, name: h })).toBeInTheDocument();
    }
    expect(screen.getByAltText(/bronze prutah of Aretas IV/)).toBeInTheDocument();
  });

  it('describes the Surikov painting, not the tribute scene', () => {
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'Who answered to whom?');
    expect(screen.getByAltText(/painted by Vasily Surikov/)).toBeInTheDocument();
    expect(screen.getByText('Acts 25:10–12')).toBeInTheDocument();
  });
});

describe('The Numbers in the Coins', () => {
  const l = lesson('the-numbers-in-the-coins');

  /** years from b BC to a AD: there is no year zero */
  const span = (b: number, a: number) => a + b - 1;

  it('has the spans the screens rely on', () => {
    expect(span(27, 14)).toBe(40); // Augustus
    expect(span(2, 2)).toBe(3); // the hops
    expect(span(1, 1)).toBe(1); // the Shekel of Tyre
    expect(span(4, 39)).toBe(42); // Herod Antipas, the exit ticket
  });

  it('gets every sum on screen right', () => {
    // every "x + y = z", "x − y = z" and "x/y = z" in what students see
    const text = JSON.stringify(l.steps.map((s) => [s.screen, s.students])).replace(/\*\*/g, '');
    const sums = [...text.matchAll(/(\d+) ([+−]) (\d+)(?: ([+−]) (\d+))? = (\d+)/g)];
    expect(sums.length).toBeGreaterThanOrEqual(3);
    for (const m of sums) {
      let v = Number(m[1]) + (m[2] === '+' ? 1 : -1) * Number(m[3]);
      if (m[4]) v += (m[4] === '+' ? 1 : -1) * Number(m[5]);
      expect(`${m[0]} → ${v}`).toBe(`${m[0]} → ${m[6]}`);
    }
    for (const m of text.matchAll(/(\d+)\/(\d+) = (\d+)/g)) expect(Number(m[1]) / Number(m[2])).toBe(Number(m[3]));
  });

  it('works the examples out to the right answers', () => {
    const worked = l.steps.flatMap((s) => {
      const sc: Screen = s.screen;
      if (sc.kind === 'worked') return sc.examples;
      if (sc.kind === 'numberline' && sc.worked) return [sc.worked];
      return [];
    });
    const byTitle = Object.fromEntries(worked.map((w) => [w.title, w]));
    expect(byTitle['Both dates AD'].answer).toBe(`${54 - 41} years`);
    expect(byTitle['Both dates BC'].answer).toBe(`${37 - 4} years`);
    expect(byTitle['The Temple tax'].answer).toBe('1 : 2');
    expect(byTitle['The widow’s gift'].answer).toBe(`${(2 / 2) * 100}%`);
    expect(byTitle['How long did Augustus rule?'].steps.join(' ')).toContain(`**41 − 1 = ${span(27, 14)} years.**`);
  });

  it('draws the number line with no year zero, and reads it out', () => {
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'No year zero');
    expect(screen.getByRole('img', { name: /1 BC is followed straight away by AD 1: there is no year zero/ })).toBeInTheDocument();
    goTo(l, 'Across the join', l.steps.findIndex((s) => s.title === 'No year zero'));
    expect(screen.getByRole('img', { name: /Three hops run from 2 BC to AD 2/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'How long did Augustus rule?' })).toBeInTheDocument();
    expect(screen.getByText('The rule')).toBeInTheDocument();
  });
});

describe('Small Works of Power', () => {
  const l = lesson('small-works-of-power');

  it('compares portrait, symbol and inscription', () => {
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'Portrait, symbol, inscription');
    for (const h of ['Portrait', 'Symbol', 'Inscription']) {
      expect(screen.getByRole('heading', { level: 2, name: h })).toBeInTheDocument();
    }
    expect(screen.getByText('PONTIF MAXIM')).toBeInTheDocument();
    expect(screen.getAllByText('Replica')).toHaveLength(3);
  });

  it('sets a genuine coin beside its sand-cast fake', () => {
    render(<ClassroomView lesson={l} basePath={BASE} />);
    goTo(l, 'Real or replica?');
    expect(screen.getByAltText(/The genuine coin, both sides/)).toBeInTheDocument();
    expect(screen.getByAltText(/The sand-cast fake, both sides/)).toBeInTheDocument();
  });
});

describe('Resources page', () => {
  it.each([
    ['Social Studies', 'who-ruled-judaea'],
    ['Math', 'the-numbers-in-the-coins'],
    ['Art', 'small-works-of-power'],
  ])('offers Lesson mode to Grades 5–8 %s teachers', async (subject, slug) => {
    jest.useFakeTimers();
    render(<ResourcesPage />);
    const choose = async (name: string) => {
      fireEvent.click(screen.getByRole('button', { name }));
      await act(async () => {
        jest.advanceTimersByTime(400);
      });
    };
    await choose('Teacher');
    await choose('Grades 5–8');
    await choose(subject);
    expect(screen.getByRole('link', { name: /Teach this lesson on screen/ })).toHaveAttribute('href', `${BASE}/${slug}`);
    jest.useRealTimers();
  });
});
