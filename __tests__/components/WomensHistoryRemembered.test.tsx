import { fireEvent, render, screen } from '@testing-library/react';
import WhoGetsRemembered from '@/app/exhibitions/womens-history/remembered/page';
import {
  AUDIT,
  FACT_MERMAIDS,
  FACT_OTHERS,
  FACT_TOP_50,
  POSTER,
  START_TILT,
  TOP_50,
  WEIGHTS,
  WOMEN_IN_TOP_50,
  beamTilt,
  guessLine,
} from '@/app/exhibitions/womens-history/remembered/remembered';
import { WOMENS_HISTORY } from '@/app/exhibitions/womens-history/womensHistory';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';
import sitemap from '@/app/sitemap';

/*
 * Who Gets Remembered?: the poster's own words, the audit's figures as the
 * report prints them, the guess and the uncovering, the scale, and the
 * room's place on the landing page, the map, the projector and the sitemap.
 */

beforeEach(() => window.history.replaceState(null, '', '/'));

const posterText = () => WOMENS_HISTORY.posters.flatMap((p) => p.items.map((i) => ('text' in i ? i.text : ''))).join(' ');

describe('its words and figures', () => {
  it('quotes poster 1 word for word', () => {
    for (const line of Object.values(POSTER)) expect(posterText()).toContain(line);
  });

  it('sets the audit’s Top 50, in rank order, with exactly three women', () => {
    expect(TOP_50.map((p) => p.rank)).toEqual(Array.from({ length: 50 }, (_, i) => i + 1));
    expect(WOMEN_IN_TOP_50.map((p) => [p.rank, p.name])).toEqual([
      [18, 'Joan of Arc'],
      [24, 'Harriet Tubman'],
      [28, 'Sacagawea'],
    ]);
    expect(TOP_50[0]).toMatchObject({ name: 'Abraham Lincoln', monuments: 193 });
    expect(TOP_50.every((p, i) => i === 0 || p.monuments <= TOP_50[i - 1].monuments)).toBe(true);
  });

  it('cites every fact from outside the poster to the audit', () => {
    for (const f of [FACT_TOP_50, FACT_MERMAIDS, FACT_OTHERS]) expect(f.sources).toEqual([AUDIT]);
    expect(FACT_TOP_50.text).toContain('6%');
    expect(FACT_MERMAIDS.text).toContain('mermaids (22)');
    expect(FACT_OTHERS.text).toContain('Only five of the Top 50 were Black or Indigenous');
    expect(AUDIT.href).toBe('https://www.monumentlab.com/monumentlab-nationalmonumentaudit.pdf');
  });

  it('tips the scale toward the men at first, and levels it with all six', () => {
    expect(beamTilt(0)).toBe(START_TILT);
    expect(beamTilt(3)).toBeCloseTo(START_TILT / 2);
    expect(beamTilt(WEIGHTS.length)).toBe(0);
    expect(WEIGHTS.every((w) => POSTER.deeper.includes(w.label) || POSTER.households.includes(w.label.replace('their roles', 'Their roles')))).toBe(true);
  });

  it('says how the guess went', () => {
    expect(guessLine(3)).toBe('You guessed 3. You were right: only 3.');
    expect(guessLine(12)).toBe('You guessed 12. The answer is 3.');
  });
});

describe('the room', () => {
  it('uncovers the names after a guess, and names the three women', () => {
    render(<WhoGetsRemembered />);
    expect(screen.queryByText('Abraham Lincoln')).toBeNull();
    fireEvent.change(screen.getByRole('slider', { name: 'Your guess: how many are women?' }), { target: { value: '7' } });
    fireEvent.click(screen.getByRole('button', { name: 'Uncover the names' }));
    expect(screen.getByRole('list', { name: /50 people/ })).toBeInTheDocument();
    expect(screen.getByText('Abraham Lincoln')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('You guessed 7. The answer is 3. Joan of Arc, Harriet Tubman, Sacagawea.');
    expect(screen.getAllByRole('link', { name: AUDIT.label })).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Guess again' }));
    expect(screen.queryByText('Abraham Lincoln')).toBeNull();
  });

  it('lays the poster’s words on the scale until it is level', () => {
    window.history.replaceState(null, '', '/#scale');
    render(<WhoGetsRemembered />);
    expect(screen.getByRole('tab', { name: 'Tip the scale' })).toHaveAttribute('aria-selected', 'true');
    for (const w of WEIGHTS) fireEvent.click(screen.getByRole('button', { name: w.label }));
    expect(screen.getByRole('img', { name: 'A scale, now level' })).toBeInTheDocument();
    expect(screen.getByText(POSTER.households)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('The scale is level.');
  });

  it('moves between the tabs with the arrow keys, and notes the same is true of other groups', () => {
    render(<WhoGetsRemembered />);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Who gets a statue?' }), { key: 'End' });
    const talk = screen.getByRole('tab', { name: 'Talk about it' });
    expect(talk).toHaveFocus();
    expect(window.location.hash).toBe('#talk');
    const note = screen.getByRole('complementary', { name: 'Not only women' });
    expect(note).toHaveTextContent('other minorities and underrepresented groups');
    expect(note).toHaveTextContent(FACT_OTHERS.text);
    expect(screen.getByRole('link', { name: 'Make a timeline of a woman in your life' })).toHaveAttribute('href', '/exhibitions/womens-history/violet#make');
  });
});

describe('wiring', () => {
  it('sets the room on the landing page, the map, the projector and the sitemap', () => {
    expect(WOMENS_HISTORY.interactives?.map((c) => c.href)).toEqual(['/exhibitions/womens-history/violet', '/exhibitions/womens-history/remembered']);
    expect(WOMENS_HISTORY.projector.links.map((l) => l.href)).toContain('/exhibitions/womens-history/remembered');
    expect(getRoomByPath('/exhibitions/womens-history/remembered')?.id).toBe('wh-remembered');
    expect(getLevelConfig('/exhibitions/womens-history/remembered').title).toBe("Women's History Month");
    expect(sitemap().some((e) => e.url.endsWith('/exhibitions/womens-history/remembered'))).toBe(true);
  });
});
