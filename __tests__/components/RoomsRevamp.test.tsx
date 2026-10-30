import { act, fireEvent, render, screen } from '@testing-library/react';
import { CITIES } from '@/app/exhibitions/harlem-renaissance/migration-map/cities';
import TicketPunch from '@/app/exhibitions/harlem-renaissance/migration-map/TicketPunch';
import {
  EMPTY_TICKET,
  TICKET_QUESTIONS,
  answerTicket,
  stampCount,
  ticketComplete,
  type TicketState,
} from '@/app/exhibitions/harlem-renaissance/migration-map/ticket';
import { PLACE_ZONES, isRightPlace, stopsSpan, zoneForStop } from '@/app/exhibitions/in-their-hands/timeline/place';
import { toAstronomical } from '@/app/exhibitions/in-their-hands/timeline/chronology';
import { timelineStops } from '@/app/exhibitions/in-their-hands/timeline/timeline-data';
import PlaceTheCoin from '@/app/exhibitions/in-their-hands/timeline/PlaceTheCoin';
import GospelTimeline from '@/app/exhibitions/in-their-hands/timeline/page';

const COLORS = CITIES.map(() => ({ main: '#C9A94E', light: '#E8D48B', bg: '#111' }));

describe('Migration Map: punch your ticket', () => {
  it('has one question per stop, in the order of the journey, with Harlem last', () => {
    expect(TICKET_QUESTIONS.map((q) => q.cityId)).toEqual(CITIES.map((c) => c.id));
    expect(TICKET_QUESTIONS[TICKET_QUESTIONS.length - 1].cityId).toBe('harlem');
  });

  it('answers every question from that city’s own panel', () => {
    for (const q of TICKET_QUESTIONS) {
      const city = CITIES.find((c) => c.id === q.cityId)!;
      expect({ city: city.id, found: city.text.includes(q.evidence) }).toEqual({ city: city.id, found: true });
      expect(q.options).toContain(q.answer);
      expect(new Set(q.options).size).toBe(q.options.length);
    }
  });

  it('stamps a right answer, sets a wrong one aside, and never loses a stamp', () => {
    let t: TicketState = EMPTY_TICKET;
    const q = TICKET_QUESTIONS[0];
    const wrong = q.options.find((o) => o !== q.answer)!;
    let r = answerTicket(t, q.cityId, wrong);
    expect(r.correct).toBe(false);
    t = r.state;
    expect(t.misses[q.cityId]).toEqual([wrong]);
    expect(stampCount(t)).toBe(0);
    r = answerTicket(t, q.cityId, q.answer);
    expect(r.correct).toBe(true);
    t = r.state;
    expect(stampCount(t)).toBe(1);
    // A later wrong click cannot undo it.
    expect(answerTicket(t, q.cityId, wrong).state).toBe(t);
    for (const other of TICKET_QUESTIONS) t = answerTicket(t, other.cityId, other.answer).state;
    expect(ticketComplete(t)).toBe(true);
  });

  it('asks the question at a stop, then shows the stamp on the ticket', () => {
    const q = TICKET_QUESTIONS.find((x) => x.cityId === 'chicago')!;
    const onAnswer = jest.fn();
    const { rerender } = render(
      <TicketPunch cityId="chicago" ticket={EMPTY_TICKET} colors={COLORS} justStamped={null} lastWrong={null} onAnswer={onAnswer} />,
    );
    expect(screen.getByRole('heading', { name: 'Punch your ticket' })).toBeInTheDocument();
    expect(screen.getByText(q.question)).toBeInTheDocument();
    const group = screen.getByRole('group', { name: q.question });
    expect(group.querySelectorAll('button')).toHaveLength(q.options.length);
    fireEvent.click(screen.getByRole('button', { name: q.answer }));
    expect(onAnswer).toHaveBeenCalledWith(q.answer);

    const wrong = q.options.find((o) => o !== q.answer)!;
    const missed = answerTicket(EMPTY_TICKET, 'chicago', wrong).state;
    rerender(<TicketPunch cityId="chicago" ticket={missed} colors={COLORS} justStamped={null} lastWrong={wrong} onAnswer={onAnswer} />);
    expect(screen.getByText('Not quite. Read the story again and try another.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `${wrong} (not this one)` })).toHaveAttribute('aria-disabled', 'true');

    const stamped = answerTicket(missed, 'chicago', q.answer).state;
    rerender(<TicketPunch cityId="chicago" ticket={stamped} colors={COLORS} justStamped="chicago" lastWrong={null} onAnswer={onAnswer} />);
    expect(screen.getByText(/Stamped! King Oliver is right\./)).toHaveFocus();
    expect(screen.queryByRole('group', { name: q.question })).toBeNull();
    const ticket = screen.getByRole('list', { name: 'Your ticket' });
    expect(ticket.querySelectorAll('[data-stamped="true"]')).toHaveLength(1);
    expect(ticket.querySelectorAll('li')).toHaveLength(6);
    expect(screen.getByText('1 of 6 stamps')).toBeInTheDocument();
  });

  it('celebrates a full ticket at Harlem', () => {
    let t: TicketState = EMPTY_TICKET;
    for (const q of TICKET_QUESTIONS) t = answerTicket(t, q.cityId, q.answer).state;
    render(<TicketPunch cityId="harlem" ticket={t} colors={COLORS} justStamped="harlem" lastWrong={null} onAnswer={() => {}} />);
    expect(screen.getByText(/Ticket complete: all six stamps/)).toBeInTheDocument();
    expect(document.body.querySelector('[data-celebration]')).not.toBeNull();
  });
});

describe('Gospel Timeline: place the coin', () => {
  it('gives every stop exactly one place on the ribbon, spanning exactly its stops’ dates', () => {
    const all = PLACE_ZONES.flatMap((z) => z.stops);
    expect([...all].sort((a, b) => a - b)).toEqual(timelineStops.map((s) => s.id));
    for (const z of PLACE_ZONES) {
      const span = stopsSpan(z.stops);
      expect({ z: z.id, from: toAstronomical(z.from), to: toAstronomical(z.to ?? z.from) }).toEqual({ z: z.id, ...span });
    }
    // In order along the ribbon, without overlaps.
    for (let i = 1; i < PLACE_ZONES.length; i++) {
      expect(toAstronomical(PLACE_ZONES[i].from)).toBeGreaterThan(toAstronomical(PLACE_ZONES[i - 1].to ?? PLACE_ZONES[i - 1].from));
    }
    expect(zoneForStop(7).label).toBe('c. 30–33 AD');
    expect(isRightPlace(1, 'z-5bc')).toBe(true);
    expect(isRightPlace(1, 'z-30')).toBe(false);
  });

  const stop = timelineStops[0];

  it('takes a tap on a date: a wrong one is set aside, the right one snaps in and opens the story', () => {
    jest.useFakeTimers();
    const onPlaced = jest.fn();
    render(<PlaceTheCoin stop={stop} placedStops={[]} enterClass="visible" onPlaced={onPlaced} onSkip={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /c\. 44 AD/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Not quite: not c. 44 AD.');
    expect(screen.getByRole('button', { name: /c\. 44 AD.*\(not this one\)/ })).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(screen.getByRole('button', { name: /c\. 5–4 BC/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Yes: c. 5–4 BC.');
    expect(onPlaced).not.toHaveBeenCalled();
    act(() => { jest.advanceTimersByTime(1000); });
    expect(onPlaced).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('works from the keyboard: pick up the coin, arrow along the ribbon without turning the page, Enter to place', () => {
    const outer = jest.fn();
    render(
      <div onKeyDown={outer}>
        <PlaceTheCoin stop={timelineStops[8]} placedStops={[]} enterClass="visible" onPlaced={() => {}} onSkip={() => {}} />
      </div>,
    );
    const coin = screen.getByRole('button', { name: /pick it up/ });
    fireEvent.click(coin);
    expect(coin).toHaveAttribute('aria-pressed', 'true');
    const first = screen.getByRole('button', { name: /c\. 5–4 BC/ });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(outer).not.toHaveBeenCalled();
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(screen.getByRole('button', { name: /c\. 59–60 AD/ })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(coin).toHaveAttribute('aria-pressed', 'false');
  });

  it('drags the coin onto a place with a pointer', () => {
    const onPlaced = jest.fn();
    jest.useFakeTimers();
    render(<PlaceTheCoin stop={stop} placedStops={[]} enterClass="visible" onPlaced={onPlaced} onSkip={() => {}} />);
    const target = screen.getByRole('button', { name: /c\. 5–4 BC/ });
    const original = document.elementFromPoint;
    document.elementFromPoint = () => target;
    const coin = screen.getByRole('button', { name: /pick it up/ });
    fireEvent.pointerDown(coin, { clientX: 10, clientY: 10, button: 0, pointerType: 'touch', pointerId: 1 });
    fireEvent.pointerMove(coin, { clientX: 80, clientY: 120, pointerId: 1 });
    expect(document.body.querySelector('.tl-place-ghost')).not.toBeNull();
    fireEvent.pointerUp(coin, { clientX: 80, clientY: 120, pointerId: 1 });
    expect(document.body.querySelector('.tl-place-ghost')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('Yes: c. 5–4 BC.');
    act(() => { jest.advanceTimersByTime(1000); });
    expect(onPlaced).toHaveBeenCalled();
    document.elementFromPoint = original;
    jest.useRealTimers();
  });

  it('opens on the coin, not the story, and keeps the date hidden until it is placed', () => {
    render(<GospelTimeline />);
    expect(screen.getByText('Place the coin')).toBeInTheDocument();
    expect(screen.queryByText(stop.story)).toBeNull();
    expect(screen.getByRole('button', { name: 'Stop 1: Augustus Caesar' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Just show me the story' }));
    expect(screen.getByText(stop.story)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stop 1: Augustus Caesar, c. 5 BC' })).toBeInTheDocument();
  });

  it('lets a teacher turn placing off', () => {
    render(<GospelTimeline />);
    const toggle = screen.getByRole('button', { name: /Place the coins/ });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText(stop.story)).toBeInTheDocument();
  });
});
