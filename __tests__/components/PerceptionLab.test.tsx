import fs from 'fs';
import path from 'path';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import PerceptionLab from '@/app/exhibitions/seeing-is-deceiving/illusions/page';
import { BENCHES, byId, CATEGORIES, ILLUSIONS } from '@/app/exhibitions/seeing-is-deceiving/illusions/lab/data';
import {
  checkerResult,
  classFingerprint,
  contrastResult,
  ebbinghausResult,
  fingerprint,
  fingerprintTitle,
  mullerLyerResult,
  observed,
  poggendorffResult,
  ponzoResult,
  stroopResult,
  troxlerResult,
  voteLine,
} from '@/app/exhibitions/seeing-is-deceiving/illusions/lab/results';
import { CHECKER_TRUTH } from '@/app/exhibitions/seeing-is-deceiving/illusions/lab/Brightness';
import { STROOP_INKS, STROOP_WORDS } from '@/app/exhibitions/seeing-is-deceiving/illusions/lab/Brain';

/*
 * The Perception Lab, rebuilt from the owner-approved proposal (B4): six
 * benches and a bonus Ames room; each illusion in three steps (Try it,
 * Break it, Why?); results measured, never marked wrong, in a printable Lab
 * Notebook with an Illusion Fingerprint; a calm warning before anything that
 * moves; a class mode with hands-up tallies; and every explaining sentence
 * set with its source.
 */

const LAB = path.join(process.cwd(), 'app/exhibitions/seeing-is-deceiving/illusions');
const labSource = () =>
  fs
    .readdirSync(path.join(LAB, 'lab'))
    .map((f) => fs.readFileSync(path.join(LAB, 'lab', f), 'utf8'))
    .concat(fs.readFileSync(path.join(LAB, 'page.tsx'), 'utf8'))
    .join('\n');

function reducedMotion(on: boolean) {
  (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
    matches: on && query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

const at = (hash: string, search = '') => window.history.replaceState(null, '', `/exhibitions/seeing-is-deceiving/illusions${search}${hash}`);

afterEach(() => {
  reducedMotion(false);
  jest.useRealTimers();
});

describe('the benches, as the proposal lists them', () => {
  it('has six benches and a bonus, with the proposal’s illusions on each', () => {
    const on = (n: number) => ILLUSIONS.filter((i) => i.bench === n).map((i) => i.id);
    expect(BENCHES).toHaveLength(7);
    expect(on(1)).toEqual(['checker', 'contrast', 'lilac']);
    expect(on(2)).toEqual(['muller-lyer', 'ebbinghaus', 'ponzo', 'jastrow']);
    expect(on(3)).toEqual(['cafe-wall', 'fraser', 'poggendorff']);
    expect(on(4)).toEqual(['blind-spot', 'kanizsa', 'troxler']);
    expect(on(5)).toEqual(['waterfall', 'snakes']);
    expect(on(6)).toEqual(['stroop', 'paris', 'rubin']);
    expect(on(7)).toEqual(['ames']);
  });

  it('gives every illusion a task, one switch to break it, a hands-up question and a one-sentence teacher tip', () => {
    for (const i of ILLUSIONS) {
      expect(i.task.length).toBeGreaterThan(10);
      expect(i.breakLabel.length).toBeGreaterThan(3);
      expect(i.breakText.length).toBeGreaterThan(10);
      expect(i.vote.options.length).toBeGreaterThanOrEqual(2);
      expect(i.teacherTip).toMatch(/^[A-Z].*[.?]$/);
      expect(i.teacherTip.split(/[.?!]\s/)).toHaveLength(1);
    }
  });

  it('flags the motion illusions for a warning first', () => {
    expect(ILLUSIONS.filter((i) => i.motion).map((i) => i.id)).toEqual(['lilac', 'waterfall', 'snakes']);
  });
});

describe('every explaining sentence has its source', () => {
  it('sets each why and each “tell me more” with at least one linked source', () => {
    for (const i of ILLUSIONS) {
      const facts = [i.why, ...i.more].filter((f) => f.text);
      if (i.id === 'paris') {
        // The proposal's one exception: a well-known demonstration with no single original paper, said so.
        expect(i.why.text).toBe('');
        expect(i.unsourced).toMatch(/no single original source/);
        continue;
      }
      expect(facts.length).toBeGreaterThan(0);
      for (const f of facts) {
        expect(f.sources.length).toBeGreaterThan(0);
        for (const s of f.sources) expect(s.href).toMatch(/^https:\/\//);
      }
    }
  });

  it('applies the owner-approved fact fixes', () => {
    const src = labSource();
    // Ebbinghaus: young children are barely fooled (Doherty and others, 2010).
    const ebb = byId('ebbinghaus').more[0];
    expect(ebb.text).toMatch(/children under about seven were much less fooled/);
    expect(ebb.sources[0].href).toBe('https://dspace.stir.ac.uk/handle/1893/1473');
    expect(src).not.toMatch(/as young as 4|even on some animals/);
    // Müller-Lyer and culture: disputed, with its source; never "partly learned".
    const ml = byId('muller-lyer');
    expect(ml.more[0].text).toMatch(/disputed/);
    expect(ml.more[0].sources.map((s) => s.label)).toContain('Amir and Firestone (2025), Psychological Review');
    expect(src).not.toMatch(/partially learned|partly learned|San of the Kalahari/);
    // Ponzo: 1910, from the Illusions Index.
    expect(byId('ponzo').more[0].text).toMatch(/1910/);
    expect(src).not.toMatch(/1911/);
    // No "11 million bits"; chromostereopsis cut, as the proposal suggests.
    expect(src).not.toMatch(/11 million|bits per second/i);
    expect(src).not.toMatch(/chromostereopsis/i);
    // The Ames room's year is unresolved: none is given.
    expect([byId('ames').why.text, ...byId('ames').more.map((m) => m.text)].join(' ')).not.toMatch(/\b1[89]\d\d\b/);
  });

  it('draws its own rotating snakes, crediting Kitaoka, and uses no image of his', () => {
    const src = labSource();
    expect(src).toMatch(/drawn for the museum after Akiyoshi Kitaoka’s Rotating Snakes/);
    expect(src).not.toMatch(/<img/);
    expect(byId('snakes').more[0].sources[0].href).toBe('https://www.psy.ritsumei.ac.jp/~akitaoka/rotsnakee.html');
  });
});

describe('measured, never marked wrong', () => {
  it('reports how far off a measurement was, and how strongly that fooled you', () => {
    expect(checkerResult(CHECKER_TRUTH, CHECKER_TRUTH)).toEqual({ line: 'You matched B’s real shade almost exactly.', strength: 0 });
    expect(checkerResult(168, 120).line).toBe('You saw B 40% lighter than it really is.');
    expect(checkerResult(168, 120).strength).toBe(1);
    expect(contrastResult(100, 128).line).toMatch(/22% darker/);
    expect(mullerLyerResult(0.41).line).toBe('With fins: you put the middle 9% of the line too far to the left.');
    expect(mullerLyerResult(0.41, 0.5).line).toMatch(/Without fins: exact\./);
    expect(ebbinghausResult(39, 34).line).toBe('You made the right circle 15% too big.');
    expect(ponzoResult(120, 140).line).toBe('You made the top bar 14% too short.');
    expect(poggendorffResult(176, 156, 400).line).toBe('Your guess was 5% of the picture’s height too low.');
    expect(troxlerResult(null).strength).toBe(0);
    expect(troxlerResult(8).strength).toBe(1);
    expect(stroopResult(8, 12).line).toBe('Round 1: 8.0 s. Round 2: 12.0 s. The words made you 4.0 s slower.');
    expect(observed('x', null).strength).toBeNull();
  });

  it('makes the Stroop words name a different colour from their ink, every time', () => {
    STROOP_INKS.forEach((ink, k) => expect(STROOP_WORDS[k]).not.toBe(ink));
  });

  it('builds the fingerprint from the kinds of trick, and the class’s from the hands', () => {
    const fp = fingerprint({ checker: { line: '', strength: 1 }, contrast: { line: '', strength: 0 }, rubin: { line: '', strength: null } });
    expect(fp.map((f) => f.category)).toEqual(CATEGORIES.map((c) => c.id));
    expect(fp[0]).toMatchObject({ category: 'brightness', score: 0.5, count: 2 });
    expect(fp.find((f) => f.category === 'brain')!.score).toBeNull();
    expect(fingerprintTitle(fp)).toBe('Fooled most by: brightness.');
    expect(fingerprintTitle(fingerprint({}))).toMatch(/Try an illusion/);
    const cfp = classFingerprint({ checker: { a: 6, b: 0, same: 2 } });
    expect(cfp[0].score).toBe(0.75);
    expect(voteLine(byId('checker'), { a: 6, same: 2 })).toBe('A looks darker: 6 · B looks darker: 0 · They look the same: 2 (8 hands)');
  });
});

describe('a station: Try it, Break it, Why?', () => {
  it('starts at the benches, and takes the visitor through the three steps, writing the result in the notebook', () => {
    at('');
    render(<PerceptionLab />);
    expect(screen.getByRole('heading', { level: 1, name: 'Perception Lab' })).toBeInTheDocument();
    expect(screen.getByText('Being fooled isn’t wrong. It’s the result.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start at Bench 1' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Adelson’s checker shadow' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#checker');
    expect(screen.getByRole('tab', { name: 'Try it' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(byId('checker').task)).toBeInTheDocument();
    // Measure, and write it down.
    fireEvent.change(screen.getByRole('slider', { name: 'Paint chip shade' }), { target: { value: '168' } });
    fireEvent.click(screen.getByRole('button', { name: 'Write it in my notebook' }));
    expect(screen.getByText('You saw B 40% lighter than it really is.')).toBeInTheDocument();
    // Break it: one switch, on and off.
    fireEvent.click(screen.getByRole('tab', { name: 'Break it' }));
    const sw = screen.getByRole('button', { name: 'Join A and B' });
    expect(sw).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(sw);
    expect(sw).toHaveAttribute('aria-pressed', 'false');
    // Why: one sentence with its source, then more.
    fireEvent.click(screen.getByRole('tab', { name: 'Why?' }));
    expect(screen.getByText(byId('checker').why.text)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Michael Bach, Optical Illusions' })[0]).toHaveAttribute('href', 'https://michaelbach.de/ot/lum-adelsonCheckShadow/');
    fireEvent.click(screen.getByRole('button', { name: 'Tell me more' }));
    expect(screen.getByText(byId('checker').more[0].text)).toBeInTheDocument();
    // On to the next, and the notebook has it.
    fireEvent.click(screen.getByRole('button', { name: /Next: Simultaneous contrast/ }));
    expect(screen.getByRole('heading', { level: 1, name: 'Simultaneous contrast' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /My notebook/ }));
    const nb = screen.getByRole('region', { name: 'My Lab Notebook' });
    expect(within(nb).getByText('You saw B 40% lighter than it really is.')).toBeInTheDocument();
    expect(within(nb).getAllByText('Not tried yet.')).toHaveLength(ILLUSIONS.length - 1);
    expect(screen.getByRole('img', { name: /My Illusion Fingerprint\. Fooled most by: brightness\./ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Print my notebook' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save my fingerprint as a picture' })).toBeInTheDocument();
  });

  it('opens each illusion from its own address, and the step tabs work with the arrow keys', () => {
    at('#muller-lyer');
    render(<PerceptionLab />);
    expect(screen.getByRole('heading', { level: 1, name: 'Müller-Lyer' })).toBeInTheDocument();
    const tryTab = screen.getByRole('tab', { name: 'Try it' });
    fireEvent.keyDown(tryTab, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Break it' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Break it' })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Break it' }), { key: 'End' });
    expect(screen.getByRole('tab', { name: 'Why?' })).toHaveAttribute('aria-selected', 'true');
  });

  it('records the Müller-Lyer halfway test with fins, then without', () => {
    at('#muller-lyer');
    render(<PerceptionLab />);
    fireEvent.change(screen.getByRole('slider', { name: 'Move the middle' }), { target: { value: '410' } });
    fireEvent.click(screen.getByRole('button', { name: 'Write it in my notebook' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Break it' }));
    fireEvent.change(screen.getByRole('slider', { name: 'Move the middle' }), { target: { value: '500' } });
    fireEvent.click(screen.getByRole('button', { name: 'Write both in my notebook' }));
    expect(screen.getByText('With fins: you put the middle 9% of the line too far to the left. Without fins: exact.')).toBeInTheDocument();
  });

  it('times a Stroop race, round by round', () => {
    jest.useFakeTimers();
    const now = jest.spyOn(performance, 'now');
    at('#stroop');
    render(<PerceptionLab />);
    now.mockReturnValue(1000);
    fireEvent.click(screen.getByRole('button', { name: 'Start Round 1' }));
    now.mockReturnValue(9000);
    fireEvent.click(screen.getByRole('button', { name: 'Done!' }));
    expect(screen.getByRole('button', { name: 'Start Round 2' })).toBeInTheDocument();
    now.mockReturnValue(10000);
    fireEvent.click(screen.getByRole('button', { name: 'Start Round 2' }));
    now.mockReturnValue(22000);
    act(() => {
      jest.advanceTimersByTime(200);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Done!' }));
    expect(screen.getByText('Round 1: 8.0 s. Round 2: 12.0 s. The words made you 4.0 s slower.')).toBeInTheDocument();
    now.mockRestore();
  });

  it('turns the Kanizsa shapes by tap or key until the triangle appears', () => {
    at('#kanizsa');
    render(<PerceptionLab />);
    const turns = [4, 2, 3];
    turns.forEach((n, i) => {
      // Each shape turns from the picture itself (a tap, or Enter) and from its button beside it.
      const [inPicture, beside] = screen.getAllByRole('button', { name: `Turn shape ${i + 1}` });
      for (let k = 0; k < n; k++) {
        if (k === 0) fireEvent.keyDown(inPicture, { key: 'Enter' });
        else fireEvent.click(k % 2 ? beside : inPicture);
      }
    });
    expect(screen.getByText('Does the triangle look brighter than the white page around it?')).toBeInTheDocument();
  });

  it('never names the Paris trick before the visitor reads the sign', () => {
    at('#paris');
    render(<PerceptionLab />);
    expect(screen.getByRole('heading', { level: 1, name: 'Read the sign' })).toBeInTheDocument();
    expect(screen.queryByText(/the the/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Something was wrong' }));
    const words = screen.getAllByRole('button', { name: 'THE' });
    fireEvent.click(words[1]);
    expect(screen.getByText('Yes: that “THE” is there twice.')).toBeInTheDocument();
  });
});

describe('motion, with care', () => {
  it('shows a calm warning before a motion illusion, with a way to skip it', () => {
    at('#lilac');
    render(<PerceptionLab />);
    expect(screen.getByRole('heading', { name: 'Before you look' })).toBeInTheDocument();
    expect(screen.getByText(/photosensitive epilepsy, skip this one/)).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /lilac spots/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Skip this one' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Müller-Lyer' })).toBeInTheDocument();
  });

  it('shows the illusion once asked, and under reduced motion says why it waited', () => {
    reducedMotion(true);
    at('#snakes');
    render(<PerceptionLab />);
    expect(screen.getByText(/set to reduce motion/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Show it' }));
    expect(screen.getByRole('img', { name: /Nothing in the picture moves/ })).toBeInTheDocument();
  });
});

describe('class mode', () => {
  it('counts hands for each answer, and fills the class notebook and fingerprint from them', () => {
    jest.useFakeTimers();
    at('#checker', '?projector=1');
    render(<PerceptionLab />);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByRole('heading', { name: 'Hands up: which square looks darker?' })).toBeInTheDocument();
    for (let k = 0; k < 3; k++) fireEvent.click(screen.getByRole('button', { name: 'One more: A looks darker' }));
    fireEvent.click(screen.getByRole('button', { name: 'One more: They look the same' }));
    expect(screen.getByText('4 hands')).toBeInTheDocument();
    expect(screen.getByText(/Teacher tip:/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Class notebook/ }));
    expect(screen.getByText('A looks darker: 3 · B looks darker: 0 · They look the same: 1 (4 hands)')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Our Class’s Illusion Fingerprint\. Fooled most by: brightness\. Brightness: 75%/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Leave class mode' }));
    expect(screen.getByRole('button', { name: 'Teach with this' })).toBeInTheDocument();
  });
});

describe('printing and the way back', () => {
  it('prints the notebook on Letter paper, the notebook then the fingerprint, and nothing else', () => {
    const css = fs.readFileSync(path.join(LAB, 'lab/lab.css'), 'utf8');
    expect(fs.readFileSync(path.join(LAB, 'lab/Notebook.tsx'), 'utf8')).toContain("'@page { size: 8.5in 11in; margin: 0.5in; }'");
    expect(css).toMatch(/@media print[\s\S]*\.pl-lab :is\(\.pl-top, \.pl-nb-tools, \.pl-foot, \.pl-station, \.pl-intro\) \{ display: none !important; \}/);
    expect(css).toMatch(/\.pl-nb-page \{[^}]*break-after: page/);
  });

  it('goes back to the display case at the Interactives, and says nothing is stored', () => {
    at('');
    render(<PerceptionLab />);
    for (const l of screen.getAllByRole('link', { name: /Display Case|Back to the display case/i })) {
      expect(l.getAttribute('href')).toBe('/exhibitions/seeing-is-deceiving/artifacts?view=interactives');
    }
    expect(screen.getByText('Nothing you do here is saved or sent anywhere.')).toBeInTheDocument();
  });

  it('keeps its text large and its buttons big enough to tap', () => {
    const css = fs.readFileSync(path.join(LAB, 'lab/lab.css'), 'utf8');
    expect(css).toMatch(/--pl-text: 20px;/);
    expect(css).toMatch(/\.pl-lab \.pl-btn \{[^}]*min-height: 52px;/);
    expect(css).toMatch(/\.pl-lab\[data-teach\] \{ --pl-text: 26px; \}/);
  });
});
