import { fireEvent, render, screen } from '@testing-library/react';
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
import { PLACE_ZONES, coinOrder, eraOf, isRightPlace, placeVerdict, stopsSpan, zoneForStop } from '@/app/exhibitions/in-their-hands/timeline/place';
import { COIN_CLUES } from '@/app/exhibitions/in-their-hands/timeline/clues';
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

describe('Gospel Timeline: Place the Coin', () => {
  it('gives every stop exactly one place on the timeline, spanning exactly its stops’ dates', () => {
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

  it('says which way to look when a place is wrong, and shuffles the coins out of story order', () => {
    // Augustus belongs in the first place; Festus in the last.
    expect(placeVerdict(1, 'z-5bc')).toBe('right');
    expect(placeVerdict(1, 'z-44')).toBe('too-late');
    expect(placeVerdict(11, 'z-30')).toBe('too-early');
    expect(eraOf(timelineStops[0])).toBe('gospels');
    expect(eraOf(timelineStops[10])).toBe('acts');
    for (const seed of [1, 2, 3, 99, 2026]) {
      const order = coinOrder(seed);
      expect([...order.map((s) => s.id)].sort((a, b) => a - b)).toEqual(timelineStops.map((s) => s.id));
      expect(order.map((s) => s.id)).not.toEqual(timelineStops.map((s) => s.id));
    }
    expect(coinOrder(7).map((s) => s.id)).toEqual(coinOrder(7).map((s) => s.id));
  });

  it('gives every coin two clues and a reason, and no clue gives its date away', () => {
    for (const s of timelineStops) {
      const c = COIN_CLUES[s.id];
      expect(c).toBeDefined();
      for (const text of [c.who, c.story]) expect({ id: s.id, text, dated: /\d+\s*(BC|AD)|\bc\.\s*\d/.test(text) }).toEqual({ id: s.id, text, dated: false });
      expect(c.why.length).toBeGreaterThan(20);
    }
  });

  const order = [timelineStops[9], timelineStops[0], timelineStops[6]]; // Claudius, Augustus, Pilate

  it('opens with how to play, explaining the timeline, before the first coin', () => {
    render(<PlaceTheCoin order={order} onReadStories={() => {}} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Place the Coin' })).toBeInTheDocument();
    expect(screen.getByText(/A timeline is a line of years: the earliest on the left, the latest on the right/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open the purse' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Emperor Claudius' })).toBeInTheDocument();
    expect(screen.getByText(COIN_CLUES[10].who)).toBeInTheDocument();
    expect(screen.getByText('Coin 1 of 3')).toBeInTheDocument();
    // The places keep their dates hidden until a coin lands there.
    expect(screen.queryByText('c. 49 AD')).toBeNull();
    expect(screen.getByRole('button', { name: 'Place 1 of 6, the earliest (place the coin here)' })).toBeInTheDocument();
  });

  it('says too early or too late, crosses the place off, then snaps the coin in, says why and moves on', () => {
    render(<PlaceTheCoin order={order} onReadStories={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open the purse' }));
    fireEvent.click(screen.getByRole('button', { name: /^Place 1 of 6/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Too early! This coin’s story comes later.');
    expect(screen.getByRole('button', { name: /^Place 1 of 6.*\(not this one\)/ })).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(screen.getByRole('button', { name: /^Place 6 of 6/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Too late!');
    expect(screen.getByRole('status')).toHaveTextContent('Hint: its story is in Acts');
    fireEvent.click(screen.getByRole('button', { name: /^Place 5 of 6/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Yes! The Emperor Claudius coin belongs at c. 49 AD.');
    expect(screen.getByText(COIN_CLUES[10].why)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /c\. 49 AD \(the coin is here\)/ })).toBeInTheDocument();
    const next = screen.getByRole('button', { name: /Next coin/ });
    expect(next).toHaveFocus();
    expect(screen.getByText('0 stars')).toBeInTheDocument();
    fireEvent.click(next);
    expect(screen.getByRole('heading', { level: 2, name: 'Augustus Caesar' })).toBeInTheDocument();
    expect(screen.getByText('Coin 2 of 3')).toBeInTheDocument();
    // The date found stays on the timeline.
    expect(screen.getByRole('button', { name: /^c\. 49 AD \(place the coin here\)/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^Place 1 of 6/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Right first time: a star!');
    expect(screen.getByText('1 star')).toBeInTheDocument();
  });

  it('works from the keyboard: pick up the coin, arrow along the timeline without turning the page, Escape to put it down', () => {
    const outer = jest.fn();
    render(
      <div onKeyDown={outer}>
        <PlaceTheCoin order={order} onReadStories={() => {}} />
      </div>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open the purse' }));
    const coin = screen.getByRole('button', { name: /pick it up/ });
    expect(coin).toHaveFocus();
    fireEvent.click(coin);
    expect(coin).toHaveAttribute('aria-pressed', 'true');
    const first = screen.getByRole('button', { name: /^Place 1 of 6/ });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(outer).not.toHaveBeenCalled();
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(screen.getByRole('button', { name: /^Place 6 of 6/ })).toHaveFocus();
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(coin).toHaveAttribute('aria-pressed', 'false');
  });

  it('drags the coin onto a place with a pointer', () => {
    render(<PlaceTheCoin order={[timelineStops[0]]} onReadStories={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open the purse' }));
    const target = screen.getByRole('button', { name: /^Place 1 of 6/ });
    const original = document.elementFromPoint;
    document.elementFromPoint = () => target;
    const coin = screen.getByRole('button', { name: /pick it up/ });
    fireEvent.pointerDown(coin, { clientX: 10, clientY: 10, button: 0, pointerType: 'touch', pointerId: 1 });
    fireEvent.pointerMove(coin, { clientX: 80, clientY: 120, pointerId: 1 });
    expect(document.body.querySelector('.ptc-ghost')).not.toBeNull();
    fireEvent.pointerUp(coin, { clientX: 80, clientY: 120, pointerId: 1 });
    expect(document.body.querySelector('.ptc-ghost')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('Yes! The Augustus Caesar coin belongs at c. 5–4 BC.');
    document.elementFromPoint = original;
    fireEvent.click(screen.getByRole('button', { name: /See your score/ }));
    expect(screen.getByRole('heading', { level: 1, name: 'A perfect timeline!' })).toHaveFocus();
    expect(screen.getByRole('button', { name: /Read the stories/ })).toBeInTheDocument();
  });

  it('opens on the game, not the stories, and the skip button opens the stories', () => {
    window.history.replaceState(null, '', '/');
    render(<GospelTimeline />);
    expect(screen.getByRole('heading', { level: 1, name: 'Place the Coin' })).toBeInTheDocument();
    expect(screen.queryByText(timelineStops[0].story)).toBeNull();
    expect(screen.queryByRole('navigation', { name: 'Timeline stops' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Just show me the stories' }));
    expect(screen.getByText(timelineStops[0].story)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stop 1: Augustus Caesar, c. 5 BC' })).toBeInTheDocument();
  });

  it('lets a teacher turn the game off and on', () => {
    window.history.replaceState(null, '', '/');
    render(<GospelTimeline />);
    const toggle = screen.getByRole('button', { name: /Place the coins/ });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText(timelineStops[0].story)).toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Open the purse' })).toBeInTheDocument();
  });

  it('opens a linked stop’s story straight away', () => {
    window.history.replaceState(null, '', '/?stop=3');
    render(<GospelTimeline />);
    expect(screen.getByText(timelineStops[2].story)).toBeInTheDocument();
    window.history.replaceState(null, '', '/');
  });
});
