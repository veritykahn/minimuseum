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
import { amesChildPx, amesDepth, STROOP_INKS, STROOP_WORDS } from '@/app/exhibitions/seeing-is-deceiving/illusions/lab/Brain';
import { snakeDisc, SNAKE_ORDER, SNAKE_PLAIN } from '@/app/exhibitions/seeing-is-deceiving/illusions/lab/Motion';
import { SLOTS, SLOT_DIR } from '@/app/exhibitions/seeing-is-deceiving/illusions/lab/slots';
import { entryText, stroopMatchResult } from '@/app/exhibitions/seeing-is-deceiving/illusions/lab/results';

/*
 * The Perception Lab, rebuilt from the owner-approved proposal (B4) and the
 * November review (B2): six benches and a bonus Ames room, from the biggest
 * "wow" to the subtlest, the moving illusions together; each illusion in
 * three steps (Try it, Break it, Why?), one notebook entry each, before and
 * after; results measured, never marked wrong, in a printable Lab Notebook
 * with an Illusion Fingerprint; a calm warning before anything that moves;
 * a class mode with hands-up tallies; every explaining sentence with its
 * source, and every source in the Sources drawer, not on the page.
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
  it('has six benches and a bonus, in the review’s order, the moving illusions together', () => {
    const on = (n: number) => ILLUSIONS.filter((i) => i.bench === n).map((i) => i.id);
    expect(BENCHES.map((b) => b.title)).toEqual([
      'Your brain fills the gaps',
      'Size and length',
      'Brightness',
      'Lines and angles',
      'Motion that isn’t there',
      'Brain against brain',
      'Bonus: the Ames room',
    ]);
    expect(on(1)).toEqual(['blind-spot', 'kanizsa', 'rubin']);
    expect(on(2)).toEqual(['ebbinghaus', 'muller-lyer', 'ponzo', 'jastrow']);
    expect(on(3)).toEqual(['checker', 'contrast']);
    expect(on(4)).toEqual(['cafe-wall', 'fraser', 'poggendorff']);
    expect(on(5)).toEqual(['lilac', 'waterfall', 'snakes', 'troxler']);
    expect(on(6)).toEqual(['stroop', 'paris']);
    expect(on(7)).toEqual(['ames']);
    // The array runs in bench order, so Next walks the benches.
    expect(ILLUSIONS.map((i) => i.bench)).toEqual([...ILLUSIONS.map((i) => i.bench)].sort((a, b) => a - b));
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

  it('flags every illusion on the motion bench for a warning first', () => {
    expect(ILLUSIONS.filter((i) => i.motion).map((i) => i.id)).toEqual(['lilac', 'waterfall', 'snakes', 'troxler']);
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
    expect(byId('snakes').creator?.label).toMatch(/Akiyoshi Kitaoka, Rotating Snakes \(2003\); circles drawn for the museum after his/);
    expect(SLOTS.snakes.file).toBeNull();
    expect(labSource()).not.toMatch(/rotating-snakes\.jpg/);
    expect(byId('snakes').more[0].sources[0].href).toBe('https://www.psy.ritsumei.ac.jp/~akitaoka/rotsnakee.html');
  });

  it('gives the Müller-Lyer a real explanation, marked for review with its source', () => {
    const ml = byId('muller-lyer');
    expect(ml.why.text).toMatch(/Richard Gregory, in 1968/);
    expect(ml.why.text).toMatch(/still testing it/);
    expect(ml.why.sources.map((s) => s.href)).toContain('https://michaelbach.de/ot/sze-muelue/');
    expect(fs.readFileSync(path.join(LAB, 'lab/data.ts'), 'utf8')).toMatch(/REVIEW \(new text\)[\s\S]*sze-muelue[\s\S]*Richard Gregory/);
  });
});

describe('measured, never marked wrong', () => {
  it('reports how far off a measurement was, and how strongly that fooled you', () => {
    expect(checkerResult(CHECKER_TRUTH, CHECKER_TRUTH)).toEqual({ line: 'You matched B’s real shade almost exactly.', strength: 0 });
    expect(checkerResult(168, 120).line).toBe('You saw B 40% lighter than it really is.');
    expect(checkerResult(168, 120).strength).toBe(1);
    expect(CHECKER_TRUTH).toBe(111);
    expect(contrastResult(100, 128).line).toMatch(/22% darker/);
    expect(mullerLyerResult(0.41).line).toBe('You put the middle 9% of the line too far to the left.');
    expect(mullerLyerResult(0.5).line).toBe('You found the exact middle.');
    expect(ebbinghausResult(39, 34).line).toBe('You made the right circle 15% too big.');
    expect(ponzoResult(120, 140).line).toBe('You made the top bar 14% too short.');
    expect(poggendorffResult(176, 156, 400).line).toBe('Your guess was 5% of the picture’s height too low.');
    expect(troxlerResult(null).strength).toBe(0);
    expect(troxlerResult(8).strength).toBe(1);
    expect(stroopResult(8, 12).line).toBe('Round 1: 8.0 s. Round 2: 12.0 s. The words made you 4.0 s slower.');
    expect(stroopMatchResult(7.5, 12).line).toBe('Round 3: 7.5 s, against 12.0 s for Round 2.');
    expect(observed('x', null).strength).toBeNull();
  });

  it('keeps one notebook entry per illusion: before, then after', () => {
    expect(entryText({ before: { line: 'A.', strength: 1 }, after: { line: 'B.', strength: 0 } })).toBe('Trick on: A. Trick off: B.');
    expect(entryText({ after: { line: 'B.', strength: 0 } })).toBe('Trick off: B.');
    expect(entryText(undefined)).toBeNull();
  });

  it('makes the Stroop words name a different colour from their ink, every time', () => {
    STROOP_INKS.forEach((ink, k) => expect(STROOP_WORDS[k]).not.toBe(ink));
  });

  it('builds the fingerprint from the kinds of trick, and the class’s from the hands', () => {
    const fp = fingerprint({
      checker: { before: { line: '', strength: 1 }, after: { line: '', strength: 0 } },
      contrast: { before: { line: '', strength: 0 } },
      rubin: { before: { line: '', strength: null } },
    });
    expect(fp.map((f) => f.category)).toEqual(CATEGORIES.map((c) => c.id));
    // The fingerprint counts what fooled you with the trick on.
    expect(fp.find((f) => f.category === 'brightness')).toMatchObject({ score: 0.5, count: 2 });
    expect(fp.find((f) => f.category === 'gaps')!.score).toBeNull();
    expect(fingerprintTitle(fp)).toBe('Fooled most by: brightness.');
    expect(fingerprintTitle(fingerprint({}))).toMatch(/Try an illusion/);
    const cfp = classFingerprint({ checker: { a: 6, b: 0, same: 2 } });
    expect(cfp.find((f) => f.category === 'brightness')!.score).toBe(0.75);
    expect(voteLine(byId('checker'), { a: 6, same: 2 })).toBe('A looks darker: 6 · B looks darker: 0 · They look the same: 2 (8 hands)');
  });
});

describe('a station: Try it, Break it, Why?', () => {
  it('starts at the benches, at Bench 1: the blind spot', () => {
    at('');
    render(<PerceptionLab />);
    expect(screen.getByRole('heading', { level: 1, name: 'Perception Lab' })).toBeInTheDocument();
    expect(screen.getByText('Being fooled isn’t wrong. It’s the result.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start at Bench 1' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Your blind spot' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#blind-spot');
    expect(screen.getByText(/Bench 1: Your brain fills the gaps · 1 of 19/)).toBeInTheDocument();
  });

  it('takes the visitor through Try it, Break it and Why?, keeping one entry, before and after', () => {
    at('#checker');
    render(<PerceptionLab />);
    expect(screen.getByRole('heading', { level: 1, name: 'Adelson’s checker shadow' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Try it' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(byId('checker').task)).toBeInTheDocument();
    // The owner's own picture, in its slot.
    expect(document.querySelector('[data-slot="checker.jpg"] image')).toHaveAttribute('href', `${SLOT_DIR}checker.jpg`);
    // Try it: measure, and write it down.
    fireEvent.change(screen.getByRole('slider', { name: 'Paint chip shade' }), { target: { value: '155' } });
    fireEvent.click(screen.getByRole('button', { name: 'Write it in my notebook' }));
    expect(screen.getByText('You saw B 40% lighter than it really is.')).toBeInTheDocument();
    // Break it: the same picture, a strip from A to B; the chip carries over, and is measured again.
    fireEvent.click(screen.getByRole('button', { name: /Now break it/ }));
    expect(screen.getByRole('tab', { name: 'Break it' })).toHaveAttribute('aria-selected', 'true');
    expect(document.querySelector('[data-slot="checker.jpg"] [data-mark="strip"]')).not.toBeNull();
    expect(screen.getByRole('slider', { name: 'Paint chip shade' })).toHaveValue('155');
    const sw = screen.getByRole('button', { name: 'Join A and B' });
    expect(sw).toHaveAttribute('aria-pressed', 'true');
    fireEvent.change(screen.getByRole('slider', { name: 'Paint chip shade' }), { target: { value: '111' } });
    fireEvent.click(screen.getByRole('button', { name: 'Write it in my notebook: trick off' }));
    expect(screen.getByText('You matched B’s real shade almost exactly.')).toBeInTheDocument();
    // Switched back on, nothing is measured.
    fireEvent.click(sw);
    expect(sw).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByRole('slider', { name: 'Paint chip shade' })).not.toBeInTheDocument();
    expect(document.querySelector('[data-mark="strip"]')).toBeNull();
    // Why: the science, and no source on the page: they are in the drawer.
    fireEvent.click(screen.getByRole('tab', { name: 'Why?' }));
    expect(screen.getByText(byId('checker').why.text)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Michael Bach, Optical Illusions' })).not.toBeInTheDocument();
    expect(screen.queryByText(/^Sources?:/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tell me more' }));
    expect(screen.getByText(byId('checker').more[0].text)).toBeInTheDocument();
    // The Sources drawer: this illusion's inventor, the owner's picture, and the source.
    fireEvent.click(screen.getByRole('button', { name: 'Sources' }));
    const drawer = screen.getByRole('dialog', { name: 'Sources' });
    expect(within(drawer).getByRole('heading', { name: 'Bench 3 · Adelson’s checker shadow' })).toBeInTheDocument();
    expect(within(drawer).getByText('Original illusion images: Verity Kahn')).toBeInTheDocument();
    expect(within(drawer).getByRole('link', { name: 'Edward H. Adelson (1995)' })).toBeInTheDocument();
    expect(within(drawer).getByRole('link', { name: 'Michael Bach, Optical Illusions' })).toHaveAttribute('href', 'https://michaelbach.de/ot/lum-adelsonCheckShadow/');
    fireEvent.click(within(drawer).getByRole('button', { name: 'Close sources' }));
    // On to the next, and the notebook has one entry: before and after.
    fireEvent.click(screen.getByRole('button', { name: /Next: Simultaneous contrast/ }));
    expect(screen.getByRole('heading', { level: 1, name: 'Simultaneous contrast' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /My notebook/ }));
    const nb = screen.getByRole('region', { name: 'My Lab Notebook' });
    const item = within(nb).getByRole('button', { name: 'Adelson’s checker shadow' }).closest('li')!;
    expect(item).toHaveTextContent('Trick on: You saw B 40% lighter than it really is.');
    expect(item).toHaveTextContent('Trick off: You matched B’s real shade almost exactly.');
    expect(within(nb).getAllByText('Not tried yet.')).toHaveLength(ILLUSIONS.length - 1);
    expect(screen.getByRole('img', { name: /My Illusion Fingerprint\. Fooled most by: brightness\./ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Print my notebook' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save my fingerprint as a picture' })).toBeInTheDocument();
    // On the notebook, the drawer lists every illusion's sources, bench by bench.
    fireEvent.click(screen.getByRole('button', { name: 'Sources' }));
    const all = screen.getByRole('dialog', { name: 'Sources' });
    expect(within(all).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
      ILLUSIONS.map((i) => `${i.bench < 7 ? `Bench ${i.bench}` : 'Bonus'} · ${i.name}`),
    );
  });

  it('keeps every source and credit, moved into the drawer, none lost', () => {
    at('#notebook');
    render(<PerceptionLab />);
    fireEvent.click(screen.getByRole('button', { name: 'Sources' }));
    const drawer = screen.getByRole('dialog', { name: 'Sources' });
    const hrefs = new Set(within(drawer).getAllByRole('link').map((l) => l.getAttribute('href')));
    for (const i of ILLUSIONS) for (const f of [i.why, ...i.more]) for (const s of f.sources) expect(hrefs).toContain(s.href);
    expect(within(drawer).getByText(/A well-known reading demonstration, with no single original source/)).toBeInTheDocument();
    expect(within(drawer).getByRole('link', { name: /circles drawn for the museum after his/ })).toBeInTheDocument();
    // The owner's pictures are credited wherever they are used.
    expect(within(drawer).getAllByText('Original illusion images: Verity Kahn')).toHaveLength(Object.values(SLOTS).filter((s) => s.file && s.owner).length);
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

  it('records the Müller-Lyer halfway test with fins, then without, the marker carried over', () => {
    at('#muller-lyer');
    render(<PerceptionLab />);
    fireEvent.change(screen.getByRole('slider', { name: 'Move the middle' }), { target: { value: '410' } });
    fireEvent.click(screen.getByRole('button', { name: 'Write it in my notebook' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Break it' }));
    expect(screen.getByRole('slider', { name: 'Move the middle' })).toHaveValue('410');
    fireEvent.change(screen.getByRole('slider', { name: 'Move the middle' }), { target: { value: '500' } });
    fireEvent.click(screen.getByRole('button', { name: 'Write it in my notebook: trick off' }));
    const noted = screen.getByText('In your notebook').parentElement!;
    expect(noted).toHaveTextContent('Trick on: You put the middle 9% of the line too far to the left.');
    expect(noted).toHaveTextContent('Trick off: You found the exact middle.');
  });

  it('starts the Ponzo bars the same length', () => {
    at('#ponzo');
    render(<PerceptionLab />);
    expect(screen.getByRole('slider', { name: 'Top bar’s length' })).toHaveValue('140');
    const bars = [...document.querySelectorAll('.pl-figure rect[fill="#c0392b"]')].map((r) => r.getAttribute('width'));
    expect(bars).toEqual(['140', '140']);
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
    expect(screen.getByText('In your notebook').parentElement).toHaveTextContent('Trick on: Round 1: 8.0 s. Round 2: 12.0 s. The words made you 4.0 s slower.');
    // Break it: Round 3, the words matching their ink, timed into the same entry.
    fireEvent.click(screen.getByRole('tab', { name: 'Break it' }));
    now.mockReturnValue(30000);
    fireEvent.click(screen.getByRole('button', { name: 'Start Round 3' }));
    now.mockReturnValue(37500);
    fireEvent.click(screen.getByRole('button', { name: 'Done!' }));
    expect(screen.getByText('In your notebook').parentElement).toHaveTextContent('Trick off: Round 3: 7.5 s, against 12.0 s for Round 2.');
    now.mockRestore();
  });

  it('turns the Kanizsa shapes by tap or key until the triangle appears', () => {
    at('#kanizsa');
    render(<PerceptionLab />);
    const turns = [4, 2, 3];
    // Every disc inside the picture, nothing cut off at its foot.
    const vb = document.querySelector('.pl-figure svg')!.getAttribute('viewBox')!.split(' ').map(Number);
    expect(vb[1] + vb[3]).toBeGreaterThan(125 + 66);
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
    // The next on the motion bench waits behind its own warning.
    expect(screen.getByRole('heading', { level: 1, name: 'The waterfall effect' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Before you look' })).toBeInTheDocument();
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

describe('the rebuilt illusions', () => {
  it('runs every snake ring the same way round, black, dark blue, white, yellow; Break it evens the middle shades', () => {
    expect(SNAKE_ORDER).toEqual(['#000000', '#1f3c9c', '#ffffff', '#e6d23c']);
    expect(SNAKE_PLAIN[1]).toBe(SNAKE_PLAIN[3]);
    const angle = (seg: string) => {
      const [x, y] = seg.trim().split(/[ L]/).map(Number);
      return Math.atan2(y, x);
    };
    for (const dir of [1, -1] as const) {
      const { paths, rings } = snakeDisc(0, 0, 140, dir);
      expect(rings).toBeGreaterThan(4);
      // Piece by piece, each shade starts a little further round (in the disc's direction) than the shade before it.
      const starts = paths.map((p) => p.split('M').filter(Boolean).map(angle));
      for (let b = 1; b < 4; b++)
        starts[b].forEach((a, k) => {
          const d = Math.atan2(Math.sin(a - starts[b - 1][k]), Math.cos(a - starts[b - 1][k]));
          expect(Math.sign(d)).toBe(dir);
        });
    }
  });

  it('keeps the Ames child one height: their picture shrinks with their real distance, as the plan shows', () => {
    expect(amesDepth(-2.5)).toBeCloseTo(1.5);
    expect(amesDepth(2.5)).toBeCloseTo(0.75);
    // Picture height times real distance is the same everywhere: one child, one height.
    for (const x of [-2.1, -1, 0, 1, 2.1]) expect(amesChildPx(x) * amesDepth(x)).toBeCloseTo(amesChildPx(0));
    at('#ames');
    render(<PerceptionLab />);
    const h0 = Number(document.querySelector('[data-child-px]')!.getAttribute('data-child-px'));
    fireEvent.change(screen.getByRole('slider', { name: 'Move the child' }), { target: { value: '100' } });
    const h1 = Number(document.querySelector('[data-child-px]')!.getAttribute('data-child-px'));
    expect(h1 / h0).toBeCloseTo(amesDepth(-2.1) / amesDepth(2.1), 2);
    fireEvent.click(screen.getByRole('tab', { name: 'Break it' }));
    expect(screen.getByRole('img', { name: /The child is the same size wherever they stand/ })).toBeInTheDocument();
    expect(document.querySelector('[data-child-r]')!.getAttribute('data-child-r')).toBe('11');
  });

  it('keeps the same picture in Try it, Break it and Why?', () => {
    at('#fraser');
    render(<PerceptionLab />);
    const vb = () => document.querySelector('.pl-figure svg')!.getAttribute('viewBox');
    const first = vb();
    fireEvent.click(screen.getByRole('tab', { name: 'Break it' }));
    expect(vb()).toBe(first);
    fireEvent.click(screen.getByRole('tab', { name: 'Why?' }));
    expect(vb()).toBe(first);
  });

  it('documents a picture slot for every illusion, and every slot file exists, web-sized', () => {
    expect(Object.keys(SLOTS).sort()).toEqual(ILLUSIONS.map((i) => i.id).sort());
    for (const s of Object.values(SLOTS)) {
      if (!s.file) continue;
      const f = path.join(process.cwd(), 'public', SLOT_DIR, s.file);
      expect(fs.existsSync(f)).toBe(true);
      expect(fs.statSync(f).size).toBeLessThan(400 * 1024);
    }
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
    expect(screen.getByRole('img', { name: /Our Class’s Illusion Fingerprint\. Fooled most by: brightness\..* Brightness: 75%/ })).toBeInTheDocument();
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
    // One fixed layout: the station fills the screen, the panel scrolls, the pager stays clear of the corner buttons.
    expect(css).toMatch(/\.pl-lab\[data-view='illusion'\] \{[^}]*height: 100dvh;/);
    expect(css).toMatch(/\.pl-panel \{[^}]*overflow-y: auto;/);
    expect(css).toMatch(/\.pl-pager \{[^}]*padding: 10px 96px 16px 136px;/);
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
