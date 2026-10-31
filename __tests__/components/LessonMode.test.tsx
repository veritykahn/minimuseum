import { render, screen, fireEvent, act } from '@testing-library/react';
import { ClassroomView } from '@/components/lesson/ClassroomView';
import ResourcesPage from '@/app/exhibitions/in-their-hands/resources/page';
import { getLesson } from '@/lib/lessons';

const lesson = getLesson('in-their-hands', 'whose-image-is-this')!;
const BASE = '/exhibitions/in-their-hands/lessons';

// next/image is mocked to a plain <img>; keep its unknown-prop warnings quiet
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});
beforeEach(() => window.localStorage.clear());

function status() {
  return screen.getByRole('status').textContent ?? '';
}

describe('Lesson mode classroom view', () => {
  it('opens on the cover and starts with the button', () => {
    render(<ClassroomView lesson={lesson} basePath={BASE} />);
    expect(screen.getByRole('heading', { level: 1, name: lesson.title })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start the lesson' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Read a coin' })).toBeInTheDocument();
    expect(status()).toMatch(/^Step 1 of 7, Hook: Read a coin/);
  });

  it('moves with the arrow keys, pauses with Space and shows notes with N', () => {
    render(<ClassroomView lesson={lesson} basePath={BASE} />);
    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowRight' });
    });
    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowRight' });
    });
    expect(screen.getByRole('heading', { level: 1, name: 'The trap' })).toBeInTheDocument();
    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
    });
    expect(screen.getByRole('heading', { level: 1, name: 'Read a coin' })).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(window, { key: ' ' });
    });
    expect(status()).toMatch(/Timer paused/);
    expect(screen.getByRole('button', { name: 'Resume the timer' })).toBeInTheDocument();

    expect(screen.queryByRole('complementary', { name: 'Teacher notes' })).not.toBeInTheDocument();
    act(() => {
      fireEvent.keyDown(window, { key: 'n' });
    });
    const notes = screen.getByRole('complementary', { name: 'Teacher notes' });
    expect(notes).toHaveTextContent('Hold up an ordinary coin.');
  });

  it('sets out the objectives on the cover, the go-deeper one marked', () => {
    render(<ClassroomView lesson={lesson} basePath={BASE} />);
    expect(screen.getByRole('heading', { level: 2, name: 'By the end of this lesson you will be able to:' })).toBeInTheDocument();
    const items = screen.getAllByRole('listitem').filter((li) => li.closest('section')?.textContent?.startsWith('By the end'));
    expect(items).toHaveLength(4);
    expect(items[3]).toHaveTextContent(/^Go deeperjudge when obedience to the state/);
    expect(screen.getByText(/Coins, flags and screens all ask for our loyalty/)).toBeInTheDocument();
  });

  it('gives each step a task for students, and the notes say why', () => {
    render(<ClassroomView lesson={lesson} basePath={BASE} />);
    fireEvent.click(screen.getByRole('button', { name: 'Start the lesson' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Your task' })).toBeInTheDocument();
    expect(screen.getByText('Whose face is on it?')).toBeInTheDocument();
    for (const name of ['Augustus', 'Tiberius', 'Claudius']) expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText('Museum-quality replica')).toBeInTheDocument();
    act(() => {
      fireEvent.keyDown(window, { key: 'n' });
    });
    const notes = screen.getByRole('complementary', { name: 'Teacher notes' });
    expect(notes).toHaveTextContent('Why this step');
    expect(notes).toHaveTextContent('Get students reading a coin as a message');
  });

  it('looks back at the objectives before the prayer', () => {
    render(<ClassroomView lesson={lesson} basePath={BASE} />);
    const k = lesson.steps.findIndex((s) => s.screen.kind === 'review');
    expect(lesson.steps[k + 1].screen.kind).toBe('prayer');
    for (let j = 0; j <= k; j++) {
      act(() => {
        fireEvent.keyDown(window, { key: 'ArrowRight' });
      });
    }
    expect(screen.getByRole('heading', { level: 1, name: 'Look back' })).toBeInTheDocument();
    expect(screen.getByText('Can you now…')).toBeInTheDocument();
    expect(screen.getByText('read a coin as evidence?')).toBeInTheDocument();
    expect(screen.getByText('Go deeper')).toBeInTheDocument();
  });

  it('links to the presenter view', () => {
    render(<ClassroomView lesson={lesson} basePath={BASE} />);
    const links = screen.getAllByRole('link', { name: /presenter view/i });
    expect(links[0]).toHaveAttribute('href', `${BASE}/whose-image-is-this/presenter`);
  });
});

describe('Resources page', () => {
  it('offers Lesson mode to Grades 5–8 Religion teachers', async () => {
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
    await choose('Religion (faith-based)');
    expect(screen.getByRole('link', { name: /Teach this lesson on screen/ })).toHaveAttribute(
      'href',
      `${BASE}/whose-image-is-this`,
    );
    jest.useRealTimers();
  });
});
