import { fireEvent, render, screen, within } from '@testing-library/react';
import ResourcesHub from '@/app/resources/page';
import { FLOORS } from '@/lib/floors';

/*
 * The Resources hub (/resources): every exhibition's lessons and printables,
 * by role, with the same lesson finder as "Teach with this".
 */

describe('The Resources hub', () => {
  beforeEach(() => window.sessionStorage.clear());
  afterAll(() => window.sessionStorage.clear());

  it('asks who you are, then finds your lesson across every exhibition', () => {
    render(<ResourcesHub />);
    expect(screen.getByRole('heading', { level: 1, name: 'Resources' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Great Hall/ })).toHaveAttribute('href', '/greathall');
    expect(screen.queryByRole('heading', { name: 'Find your lesson' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /^Teacher/ }));
    expect(window.sessionStorage.getItem('mm-teach-role')).toBe('teacher');
    expect(screen.getByRole('heading', { name: 'Find your lesson' })).toBe(document.activeElement);

    fireEvent.click(screen.getByRole('button', { name: 'Grade 7' }));
    fireEvent.click(screen.getByRole('button', { name: 'Social Studies' }));
    const titles = screen.getAllByRole('article').map((a) => a.getAttribute('aria-label'));
    expect(titles).toEqual(expect.arrayContaining(['Who Ruled Judaea?', 'Why People Move: The Great Migration', 'Visual Propaganda Through History']));
    // faith-based lessons stay out until the switch is on
    expect(screen.getByRole('switch', { name: 'Include faith-based lessons' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.queryByRole('button', { name: 'Religion' })).toBeNull();
  });

  it('lists every open exhibition, each with its lessons and its parent guide', () => {
    window.sessionStorage.setItem('mm-teach-role', 'parent');
    render(<ResourcesHub />);
    expect(screen.getByRole('button', { name: 'Parent' })).toHaveAttribute('aria-pressed', 'true');
    const active = FLOORS.flatMap((f) => f.exhibitions.filter((e) => e.active));
    const list = screen.getByRole('heading', { name: 'Every exhibition' }).parentElement as HTMLElement;
    active.forEach((e) => expect(within(list).getByRole('heading', { level: 3, name: e.title })).toBeInTheDocument());
    const lessonLinks = within(list).getAllByRole('link', { name: /^All \d+ lessons/ }).map((a) => a.getAttribute('href'));
    expect(lessonLinks).toContain('/exhibitions/in-their-hands/lessons');
    expect(lessonLinks).toContain('/exhibitions/holocaust/lessons');
    expect(lessonLinks.length).toBe(active.length);
    expect(within(list).queryAllByText('Lesson plans on their way')).toEqual([]);
    expect(within(list).getAllByRole('link', { name: /Parent Resource Guide/ }).length).toBe(active.length);
  });
});
