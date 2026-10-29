import { StrictMode } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import VioletsLife from '@/app/exhibitions/womens-history/violet/page';
import {
  LIMITS,
  MAX_STOPS,
  OWN_KEY,
  PROMPTS,
  addStop,
  emptyTimeline,
  imageFileName,
  parse,
  promptFor,
  removeStop,
  serialize,
  stopLabel,
  updateStop,
} from '@/app/exhibitions/womens-history/violet/yourTimeline';

// A photograph is made smaller on a canvas, which jsdom has not got: here it is handed straight back.
jest.mock('@/app/exhibitions/womens-history/violet/yourTimeline', () => ({
  ...jest.requireActual('@/app/exhibitions/womens-history/violet/yourTimeline'),
  shrinkPhoto: () => Promise.resolve('data:image/jpeg;base64,AAAA'),
}));

/*
 * A timeline of your own, in Violet's room: the timeline's rules (adding,
 * taking off, the questions, what is kept in this browser and what never
 * is), and making one on the page.
 */

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
});

describe('the timeline', () => {
  it('starts with her card and one moment, and holds no more than the limit', () => {
    let t = emptyTimeline();
    expect(t.stops).toHaveLength(1);
    for (let i = 0; i < 20; i++) t = addStop(t, t.stops.length - 1);
    expect(t.stops).toHaveLength(MAX_STOPS);
    expect(new Set(t.stops.map((s) => s.id)).size).toBe(MAX_STOPS);
  });

  it('adds a moment after the one named, and never takes off the last', () => {
    let t = updateStop(emptyTimeline(), 0, { place: 'First' });
    t = addStop(t, 0);
    t = updateStop(t, 1, { place: 'Last' });
    t = addStop(t, 0);
    expect(t.stops.map((s) => s.place)).toEqual(['First', '', 'Last']);
    t = removeStop(removeStop(t, 1), 0);
    expect(t.stops.map((s) => s.place)).toEqual(['Last']);
    expect(removeStop(t, 0).stops).toHaveLength(1);
  });

  it('names a moment by its year and place, or its number', () => {
    const s = emptyTimeline().stops[0];
    expect(stopLabel(s, 0)).toBe('Moment 1');
    expect(stopLabel({ ...s, when: '1952', place: ' Kingston ' }, 0)).toBe('1952, Kingston');
  });

  it('asks a short question beside each moment, and another on request', () => {
    expect(promptFor(0)).toBe(PROMPTS[0]);
    expect(promptFor(0, 1)).toBe(PROMPTS[1]);
    expect(promptFor(PROMPTS.length)).toBe(PROMPTS[0]);
    expect(PROMPTS.every((p) => p.endsWith('?') && p.length < 60)).toBe(true);
  });

  it('keeps her words in this browser, but never a photograph', () => {
    const t = { ...updateStop(emptyTimeline(), 0, { memory: 'She sang', photo: 'data:image/jpeg;base64,AAAA' }), name: 'Rose', photo: 'data:image/jpeg;base64,BBBB' };
    const raw = serialize(t);
    expect(raw).not.toContain('data:image');
    const back = parse(raw)!;
    expect(back.name).toBe('Rose');
    expect(back.stops[0].memory).toBe('She sang');
    expect(back.stops[0].photo).toBeUndefined();
  });

  it('trusts nothing it reads back', () => {
    expect(parse(null)).toBeNull();
    expect(parse('not json')).toBeNull();
    const t = parse(JSON.stringify({ name: 'x'.repeat(500), stops: [{ keepsake: 'bomb', memory: 7 }] }))!;
    expect(t.name).toHaveLength(LIMITS.name);
    expect(t.stops[0].keepsake).not.toBe('bomb');
    expect(t.stops[0].memory).toBe('');
  });

  it('saves the picture under her name', () => {
    expect(imageFileName({ ...emptyTimeline(), name: 'Grandma Rosé!' })).toBe('grandma-rose-timeline.png');
    expect(imageFileName(emptyTimeline())).toBe('my-timeline.png');
  });
});

describe('making one', () => {
  it('opens from Violet’s Life, and has its own address', () => {
    render(<VioletsLife />);
    fireEvent.click(screen.getByRole('button', { name: 'Make your own' }));
    expect(window.location.hash).toBe('#make');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your Timeline');
    expect(screen.getByRole('button', { name: 'Make your own' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/Photos are never uploaded/)).toBeInTheDocument();
  });

  it('sets her name on the thread, adds a moment, and keeps the words on this device', () => {
    window.history.replaceState(null, '', '/#make');
    render(<VioletsLife />);
    fireEvent.change(screen.getByLabelText('Her name'), { target: { value: 'Grandma Rose' } });
    expect(screen.getByRole('tab', { name: 'Grandma Rose' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Next/ }));
    const panel = screen.getByRole('tabpanel');
    expect(within(panel).getByRole('heading', { name: 'Moment 1' })).toBeInTheDocument();
    expect(panel).toHaveTextContent(PROMPTS[0]);
    fireEvent.change(screen.getByLabelText('A year or an age'), { target: { value: '1952' } });
    fireEvent.change(screen.getByLabelText('A place'), { target: { value: 'Kingston' } });
    fireEvent.click(screen.getByRole('radio', { name: 'Piano' }));
    expect(screen.getByRole('tab', { name: '1952, Kingston' })).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(screen.getAllByRole('button', { name: 'Add a moment' })[0]);
    expect(screen.getByRole('heading', { name: 'Moment 2' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Moment 2 added');

    const kept = parse(localStorage.getItem(OWN_KEY))!;
    expect(kept.name).toBe('Grandma Rose');
    expect(kept.stops[0]).toMatchObject({ when: '1952', place: 'Kingston', keepsake: 'piano' });
    expect(kept.stops).toHaveLength(2);
  });

  it('comes back as it was left', () => {
    localStorage.setItem(OWN_KEY, serialize({ ...emptyTimeline(), name: 'Aunt May' }));
    window.history.replaceState(null, '', '/#make');
    render(<VioletsLife />);
    expect(screen.getByLabelText('Her name')).toHaveValue('Aunt May');
  });

  it('names every keepsake in the picker where it can be seen, not in a tooltip', () => {
    window.history.replaceState(null, '', '/#make');
    const { container } = render(<VioletsLife />);
    fireEvent.click(screen.getByRole('button', { name: /Next/ }));
    const names = [...container.querySelectorAll('.whv-keepsake-name')];
    expect(names.map((n) => n.textContent)).toContain('Cauliflower');
    for (const n of names) expect(n).not.toHaveClass('visually-hidden');
    expect(container.querySelector('.whv-keepsake[title]')).toBeNull();
    expect(screen.getByRole('radio', { name: 'Needle and thread' })).toBeInTheDocument();
  });

  it('goes back to Violet’s life', () => {
    window.history.replaceState(null, '', '/#make');
    render(<VioletsLife />);
    fireEvent.click(screen.getByRole('button', { name: 'Violet’s life' }));
    expect(screen.getByRole('img', { name: 'Violet Dina Want' })).toBeInTheDocument();
  });

  // Regression: React's development double run wrote the blank first render over what was kept.
  it('comes back as it was left, under React’s strict mode too', () => {
    localStorage.setItem(OWN_KEY, serialize({ ...emptyTimeline(), name: 'Aunt May' }));
    window.history.replaceState(null, '', '/#make');
    render(
      <StrictMode>
        <VioletsLife />
      </StrictMode>,
    );
    expect(screen.getByLabelText('Her name')).toHaveValue('Aunt May');
    expect(parse(localStorage.getItem(OWN_KEY))!.name).toBe('Aunt May');
  });

  // Regression: going to Violet's life and back emptied the timeline and lost its photographs.
  it('is still there, photograph and all, after a visit to Violet’s life', async () => {
    window.history.replaceState(null, '', '/#make');
    const { container } = render(
      <StrictMode>
        <VioletsLife />
      </StrictMode>,
    );
    fireEvent.change(screen.getByLabelText('Her name'), { target: { value: 'Grandma Rose' } });
    const file = new File(['x'], 'rose.jpg', { type: 'image/jpeg' });
    await act(async () => {
      fireEvent.change(container.querySelector('input[type=file]')!, { target: { files: [file] } });
    });
    expect(screen.getByRole('img', { name: 'Your photograph of Grandma Rose' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Violet’s life' }));
    fireEvent.click(screen.getByRole('button', { name: 'Make your own' }));
    expect(screen.getByLabelText('Her name')).toHaveValue('Grandma Rose');
    expect(screen.getByRole('img', { name: 'Your photograph of Grandma Rose' })).toBeInTheDocument();
  });
});
