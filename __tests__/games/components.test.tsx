import { act, fireEvent, render, screen } from '@testing-library/react';
import GameResult from '@/components/games/GameResult';
import Magnifier from '@/components/games/Magnifier';
import HandsOfHistory from '@/app/exhibitions/in-their-hands/hands/page';
import RealOrReplica from '@/app/exhibitions/in-their-hands/real-or-replica/page';
import { HANDS_CHARACTERS } from '@/app/exhibitions/in-their-hands/hands/data';
import { ROUNDS } from '@/app/exhibitions/in-their-hands/real-or-replica/data';

beforeAll(() => {
  // jsdom has no layout or animation frames worth waiting for.
  window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList);
});

describe('GameResult', () => {
  it('moves focus to its headline and offers its actions', () => {
    const again = jest.fn();
    render(
      <GameResult
        score={3}
        scoreCaption="out of 5"
        title="A good start."
        actions={[{ label: 'Play again', onClick: again, primary: true }, { label: 'Back', href: '/x' }]}
        pips={[{ label: 'One', correct: true }, { label: 'Two', correct: false }]}
      />,
    );
    expect(screen.getByRole('heading', { name: 'A good start.' })).toHaveFocus();
    expect(screen.getByText('3 out of 5')).toBeInTheDocument();
    expect(screen.getByText('Two: missed')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Play again' }));
    expect(again).toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/x');
  });
});

describe('Magnifier', () => {
  it('opens with Enter, moves with arrows without letting them bubble, and closes with Escape', () => {
    const outer = jest.fn();
    render(
      <div onKeyDown={outer}>
        <Magnifier src="/coin.png" alt="Coin A" />
      </div>,
    );
    const box = screen.getByRole('group', { name: 'Coin A' });
    // jsdom has no layout: give the box a size.
    box.getBoundingClientRect = () => ({ width: 400, height: 200, left: 0, top: 0, right: 400, bottom: 200, x: 0, y: 0, toJSON() {} });
    box.focus();
    fireEvent.keyDown(box, { key: 'Enter' });
    const lens = () => box.querySelector('span[style*="background-image"]');
    expect(lens()).not.toBeNull();
    fireEvent.keyDown(box, { key: 'ArrowRight' });
    expect(outer).not.toHaveBeenCalledWith(expect.objectContaining({ key: 'ArrowRight' }));
    fireEvent.keyDown(box, { key: 'Escape' });
    expect(lens()).toBeNull();
  });
});

describe('Hands of History', () => {
  it('renders no shuffled answers on the server, so hydration cannot disagree', () => {
    // The Node build: jsdom lacks the browser build's MessageChannel.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { renderToString } = require('react-dom/server.node') as typeof import('react-dom/server');
    const html = renderToString(<HandsOfHistory />);
    for (const c of HANDS_CHARACTERS) expect(html).not.toContain(`>${c.character}</button>`);
  });

  it('plays through, explains each answer, and ends on a score-dependent title with Play again', () => {
    render(<HandsOfHistory />);
    for (let i = 0; i < HANDS_CHARACTERS.length; i++) {
      // Always choose wrongly: the first option that isn't this round's answer.
      const prompt = screen.getByRole('heading', { level: 1 }).textContent ?? '';
      const answer = HANDS_CHARACTERS.find((c) => c.prompt === prompt)!;
      const wrong = screen.getAllByRole('button').find((b) => HANDS_CHARACTERS.some((c) => c.character === b.textContent && c.id !== answer.id))!;
      fireEvent.click(wrong);
      expect(screen.getByText(`Not quite — these were the hands of ${answer.character}.`)).toBeInTheDocument();
      expect(screen.getByText(answer.clue)).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /Next|See Results/ }));
    }
    expect(screen.getByRole('heading', { name: 'These hands kept their secrets.' })).toHaveFocus();
    expect(screen.queryByText('You know these hands.')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Play again' }));
    expect(screen.getByText(/Round 1 of 7/)).toBeInTheDocument();
  });
});

describe('Real or Replica?', () => {
  it('scores, shows callouts, visits our own case, and ends without calling 0/5 a numismatist', () => {
    render(<RealOrReplica />);
    for (let i = 0; i < ROUNDS.length; i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Coin A is the fake' }));
      expect(screen.getByText(/is the fake\.$/)).toBeInTheDocument();
      expect(screen.getByText('Look closer — the numbers on the coins')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /Next Round|One more case/ }));
    }
    expect(screen.getByRole('heading', { name: 'Three replicas — and we say so' })).toBeInTheDocument();
    expect(screen.getAllByText(/museum-quality replica\./)).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: /Turn it over \(Tribute Penny/ }));
    expect(screen.getByRole('button', { name: /Show the front \(Tribute Penny/ })).toHaveAttribute('aria-pressed', 'true');
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /See your results/ }));
    });
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Play again' })).toBeInTheDocument();
  });
});
