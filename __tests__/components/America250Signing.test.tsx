import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import America250Signing from '@/app/exhibitions/america-250/sign/page';
import ACopyOfACopy from '@/app/exhibitions/america-250/copies/page';
import AddAStar from '@/app/exhibitions/america-250/flag/page';
import { CASE_FILES, EXHIBIT_LETTERS, HINTS, PICTURE, exhibitAlt, exhibitOrder, fileFor } from '@/app/exhibitions/america-250/copies/missions';
import { DECADES, ERAS, MAX_SCORE, ROUNDS, decadeOf, joinedBefore, judge, milestonesBetween, namesOf, pickRounds, verdictLine } from '@/app/exhibitions/america-250/flag/game';
import { nextSeed } from '@/components/games/useClientSeed';

// A fixed seed, so the rooms that shuffle (Add a Star's states, A Copy of a
// Copy's exhibits) can be played in a known order.
const SEED = 7;
jest.mock('@/components/games/useClientSeed', () => ({
  ...jest.requireActual('@/components/games/useClientSeed'),
  useClientSeed: () => 7,
}));
import { COPIES, COPIES_HREF, FLAG_HREF, FLAG_MILESTONES, FLAG_STATES, FLAG_TEXT, SIGN_TEXT, starLine } from '@/app/exhibitions/america-250/sign/signText';
import { DECLARATION_BODY, DECLARATION_HEAD, DECLARATION_SIGNERS, DECLARATION_SOURCE, DECLARATION_TITLE, OWN_DECLARATIONS, classWords, gradeWords, ownTitle, ownWording, PRINT_SIGNATURE_LINES } from '@/app/exhibitions/america-250/sign/declaration';
import { FLAG, starLayout, stripesFor, unionHeight } from '@/app/exhibitions/america-250/sign/flagLayout';
import { inkAfter, inkAlpha, INK_PER_DIP, nibPath, nibQuad, thin } from '@/app/exhibitions/america-250/sign/signing';
import fs from 'fs';
import path from 'path';
import { AMERICA_250 } from '@/app/exhibitions/america-250/america250';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';
import sitemap from '@/app/sitemap';
import { COPIES_SOURCES, FLAG_SOURCES, SIGN_SOURCES } from '@/app/exhibitions/america-250/sign/sources';

/** The room's Sources drawer, opened: every source and picture credit is there, none inline. */
function openSources() {
  fireEvent.click(screen.getByRole('button', { name: 'Sources and credits' }));
  return screen.getByRole('dialog', { name: 'Sources and credits' });
}
/** The drawer's group for a step, by its heading. */
function sourcesGroup(drawer: HTMLElement, title: string) {
  return within(drawer).getByRole('heading', { name: title }).closest('section') as HTMLElement;
}


/*
 * America 250's signing, now three rooms of its own: Put Your Name to It
 * (read the Declaration, dip the quill, sign; or the class's or the
 * student's own declaration), A Copy of a Copy (a detective's case, copy by
 * copy) and Add a Star (guess when each state joined, and grow the flag).
 * Every line about 1776 is the posters' own; carved out of that, the four
 * copies' notes (COPIES), the flag's states and milestones (FLAG_TEXT,
 * FLAG_STATES, FLAG_MILESTONES), owner-approved and fact-checked, each set
 * with its source. The parchment carries the Declaration's own words, the
 * National Archives' transcription; the class's and the student's
 * declarations are the owner's wording, their blanks filled in, and print
 * with their names.
 */

/** The posters' words, as read: "*…*" marks italics; quotes and cites both. */
const posterText = AMERICA_250.posters
  .flatMap((p) => p.items)
  .flatMap((it) => ['text' in it && it.text ? it.text : '', 'cite' in it && it.cite ? it.cite : ''])
  .join('\n')
  .replace(/\*/g, '');

beforeAll(() => {
  // jsdom draws nothing; the room carries on without a canvas.
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

describe('the words', () => {
  it('quotes the posters word for word, and adds no facts but the approved notes', () => {
    // The approved notes are not quotes, and are not in the quoted list below.
    for (const c of COPIES) expect(posterText).not.toContain(c.note.text);
    const quoted = [SIGN_TEXT.carroll.text, SIGN_TEXT.epigraph.text, SIGN_TEXT.epigraph.cite, ...SIGN_TEXT.signed, SIGN_TEXT.copiesIntro, SIGN_TEXT.copiesClose, ...COPIES.flatMap((c) => (c.quote ? [c.quote] : []))];
    for (const q of quoted) expect(posterText).toContain(q);
  });
});

describe('a copy of a copy: four real copies, side by side', () => {
  it('sets the Dunlap and Goddard broadsides, Stone’s engraving and the faded original, in that order', () => {
    expect(COPIES.map((c) => c.id)).toEqual(['dunlap', 'goddard', 'stone', 'original']);
    expect(COPIES.map((c) => c.date)).toEqual(['July 4–5, 1776', '1777', '1823', 'Signed 1776']);
  });

  it('shows each as a real photograph in the public folder, credited and linked to its Library of Congress or National Archives record', () => {
    for (const c of COPIES) {
      expect(fs.existsSync(path.join(process.cwd(), 'public', c.src))).toBe(true);
      expect(c.credit.label).toMatch(/(Library of Congress|National Archives).*Public domain\.$/);
      expect(c.credit.href).toMatch(/^https:\/\/(www\.loc\.gov\/item\/|www\.archives\.gov\/|catalog\.archives\.gov\/id\/)/);
      expect(c.alt.length).toBeGreaterThan(60);
      expect(c.ratio).toBeGreaterThan(0.75);
      expect(c.ratio).toBeLessThan(0.9);
    }
    // No credit to an image generator, anywhere in the copies.
    expect(JSON.stringify(COPIES)).not.toMatch(/leonardo/i);
  });

  it('gives each a short sourced note from the Library of Congress or the National Archives', () => {
    for (const c of COPIES) {
      expect(c.note.sources.length).toBeGreaterThan(0);
      for (const s of c.note.sources) expect(s.href).toMatch(/^https:\/\/(www\.loc\.gov|blogs\.loc\.gov|www\.archives\.gov)\//);
    }
    const [dunlap, goddard, stone, original] = COPIES.map((c) => c.note.text);
    expect(dunlap).toContain('evening of July 4 and the early morning of July 5, 1776');
    expect(goddard).toContain('first printing with the signers’ names');
    expect(goddard).toContain('Mary Katharine Goddard');
    expect(stone).toContain('The 1823 Stone engraving is the most frequently reproduced version of the Declaration.');
    expect(original).toContain('faded');
  });

  it('no longer draws lines of make-believe handwriting', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'app/exhibitions/america-250/sign/Sheet.tsx'))).toBe(false);
    const signing = fs.readFileSync(path.join(process.cwd(), 'app/exhibitions/america-250/sign/signing.ts'), 'utf8');
    expect(signing).not.toMatch(/scribble/);
  });
});

describe('the quill', () => {
  it('runs dry after a dip of writing, the ink thinning as it goes', () => {
    expect(inkAfter(1, INK_PER_DIP / 2)).toBeCloseTo(0.5);
    expect(inkAfter(0.1, 10)).toBe(0);
    expect(inkAlpha(1)).toBeGreaterThan(inkAlpha(0.3));
    expect(inkAlpha(0.3)).toBeGreaterThan(inkAlpha(0));
  });

  it('writes broad down-strokes and hairlines along the nib, as a broad-nibbed quill does', () => {
    const area = (q: [number, number][]) => Math.abs(q.reduce((a, [x, y], i) => { const [nx, ny] = q[(i + 1) % q.length]; return a + x * ny - nx * y; }, 0)) / 2;
    const down = area(nibQuad({ x: 0, y: 0 }, { x: 0, y: 0.1 }, 1));
    const along = area(nibQuad({ x: 0, y: 0 }, { x: Math.cos((-40 * Math.PI) / 180) * 0.1, y: Math.sin((-40 * Math.PI) / 180) * 0.1 }, 1));
    expect(down).toBeGreaterThan(along * 10);
  });

  it('keeps a stroke’s ends and drops crowded points; a copy is traced the same way each time', () => {
    const s = Array.from({ length: 50 }, (_, i) => ({ x: i * 0.0005, y: 0 }));
    const t = thin(s);
    expect(t[0]).toEqual(s[0]);
    expect(t[t.length - 1]).toEqual(s[s.length - 1]);
    expect(t.length).toBeLessThan(s.length);
    expect(nibPath([s], 700)).toBe(nibPath([s], 700));
  });
});

describe('Put Your Name to It: the way in', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/america-250/sign'));

  it('says what to do in the middle of the room, and offers the three declarations as separate choices', () => {
    render(<America250Signing />);
    expect(screen.getByRole('heading', { level: 1, name: SIGN_TEXT.title })).toBeInTheDocument();
    expect(screen.getByText(SIGN_TEXT.chooseLead)).toBeInTheDocument();
    const how = screen.getByRole('list', { name: 'How it works' });
    expect(within(how).getAllByRole('listitem').map((li) => li.textContent)).toEqual(SIGN_TEXT.steps.map((s, i) => `${i + 1}${s}`));
    expect(screen.getByRole('heading', { level: 2, name: SIGN_TEXT.chooseAsk })).toBeInTheDocument();
    for (const name of [/The Declaration/, /Our Class Declaration/, /My Declaration/]) expect(screen.getByRole('button', { name })).toBeInTheDocument();
    // Nothing to the side: no parchment, no tray, until one is chosen.
    expect(screen.queryByRole('region', { name: /Declaration of Independence/ })).toBeNull();
    expect(screen.queryByRole('tab')).toBeNull();
  });

  it('opens the chosen one on the desk, at its own address, and goes back to choose another', () => {
    render(<America250Signing />);
    fireEvent.click(screen.getByRole('button', { name: /Our Class Declaration/ }));
    expect(window.location.hash).toBe('#class');
    expect(screen.getByRole('region', { name: /Our Class Declaration/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Our Class Declaration' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { level: 1, name: SIGN_TEXT.title })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: SIGN_TEXT.chooseOther }));
    expect(window.location.hash).toBe('');
    expect(screen.getByRole('heading', { level: 2, name: SIGN_TEXT.chooseAsk })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /The Declaration/ }));
    expect(window.location.hash).toBe('#sign');
    expect(screen.getByRole('region', { name: /Declaration of Independence/ })).toBeInTheDocument();
  });

  it('walks the three steps: read it, dip the quill (it starts dry), sign', () => {
    window.history.replaceState(null, '', '/exhibitions/america-250/sign#sign');
    render(<America250Signing />);
    const steps = within(screen.getByRole('list', { name: 'Three steps' })).getAllByRole('listitem');
    expect(steps[0]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText(SIGN_TEXT.dipFirst, { selector: '.aps-dry' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Go to the line to sign/ }));
    expect(steps[0]).toHaveTextContent('(done)');
    expect(steps[1]).toHaveAttribute('aria-current', 'step');
    fireEvent.click(screen.getByRole('button', { name: 'Dip the quill in the ink' }));
    expect(screen.getByRole('status')).toHaveTextContent('The quill is full of ink.');
    expect(screen.queryByText(SIGN_TEXT.dipFirst, { selector: '.aps-dry' })).toBeNull();
    expect(steps[2]).toHaveAttribute('aria-current', 'step');
  });

  it('asks for a dip before the dry quill will write', () => {
    window.history.replaceState(null, '', '/exhibitions/america-250/sign#sign');
    const box = { left: 0, top: 0, right: 100, bottom: 30, width: 100, height: 30, x: 0, y: 0, toJSON: () => ({}) };
    const rect = jest.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue(box as DOMRect);
    try {
      render(<America250Signing />);
      const pad = screen.getByRole('img', { name: /The line to sign on/ });
      fireEvent(pad, new MouseEvent('pointerdown', { bubbles: true, clientX: 10, clientY: 10 }));
      expect(screen.getByRole('status')).toHaveTextContent('The quill is dry. Dip it in the ink first.');
    } finally {
      rect.mockRestore();
    }
  });
});

describe('Put Your Name to It: the Declaration', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/america-250/sign#sign'));

  it('signs by keyboard: type a name and an address, put your name to it, and the posters answer', () => {
    render(<America250Signing />);
    const seal = screen.getByRole('button', { name: 'Put your name to it' });
    expect(seal).toBeDisabled();
    expect(screen.getByText(SIGN_TEXT.privacy)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Type it instead' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'A. Visitor' } });
    fireEvent.change(screen.getByRole('textbox', { name: SIGN_TEXT.addressLabel }), { target: { value: 'Baltimore' } });
    expect(seal).toBeEnabled();
    fireEvent.click(seal);
    expect(screen.getByRole('status')).toHaveTextContent('Signed.');
    for (const line of SIGN_TEXT.signed) expect(screen.getByText(line)).toBeInTheDocument();
    expect(screen.getByText(SIGN_TEXT.epigraph.text)).toBeInTheDocument();
    // Signed at the foot of the parchment, under the signers of 1776
    const parchment = screen.getByRole('region', { name: /Declaration of Independence/ });
    expect(within(parchment).getByRole('img', { name: 'Signed: A. Visitor' })).toBeInTheDocument();
    expect(parchment).toHaveTextContent('of Baltimore');
  });

  it('sets the Declaration’s own words on the parchment, to read inside it, with the signers, its source in the drawer', () => {
    render(<America250Signing />);
    const parchment = screen.getByRole('region', { name: /Declaration of Independence/ });
    expect(parchment).toHaveAttribute('tabindex', '0');
    expect(within(parchment).getByText(DECLARATION_HEAD)).toBeInTheDocument();
    expect(within(parchment).getByRole('heading', { name: DECLARATION_TITLE })).toBeInTheDocument();
    for (const p of DECLARATION_BODY) expect(within(parchment).getByText(p)).toBeInTheDocument();
    expect(within(parchment).getByText('Charles Carroll of Carrollton')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Go to the line to sign/ }));
    expect(screen.getByRole('status')).toHaveTextContent('the line to sign on');
    // The transcription's source is in the Sources drawer, not under the sheet.
    expect(screen.queryByRole('link', { name: DECLARATION_SOURCE.label })).toBeNull();
    const group = sourcesGroup(openSources(), SIGN_TEXT.title);
    expect(within(group).getByRole('link', { name: DECLARATION_SOURCE.label })).toHaveAttribute('href', 'https://www.archives.gov/founding-docs/declaration-transcript');
  });
});

describe('the Declaration’s text', () => {
  it('is the National Archives’ transcription: its opening, its pledge and its 56 signers', () => {
    expect(DECLARATION_HEAD).toBe('In Congress, July 4, 1776');
    expect(DECLARATION_TITLE).toBe('The unanimous Declaration of the thirteen united States of America,');
    expect(DECLARATION_BODY[0]).toMatch(/^When in the Course of human events, it becomes necessary for one people to dissolve the political bands/);
    expect(DECLARATION_BODY[1]).toMatch(/^We hold these truths to be self-evident, that all men are created equal/);
    expect(DECLARATION_BODY[DECLARATION_BODY.length - 1]).toMatch(/we mutually pledge to each other our Lives, our Fortunes and our sacred Honor\.$/);
    // The Archives' spelling, kept
    expect(DECLARATION_BODY.join(' ')).toContain('Brittish brethren');
    expect(DECLARATION_BODY.filter((p) => p.startsWith('He has')).length).toBeGreaterThan(15);
    expect(DECLARATION_SIGNERS.flatMap((c) => c.names)).toHaveLength(56);
    expect(DECLARATION_SIGNERS[0]).toEqual({ state: 'Georgia', names: ['Button Gwinnett', 'Lyman Hall', 'George Walton'] });
  });

});

describe('the class’s and the student’s own declarations', () => {
  const print = jest.fn();
  beforeEach(() => {
    window.history.replaceState(null, '', '/exhibitions/america-250/sign#sign');
    print.mockClear();
    window.print = print;
  });

  it('sets the owner’s wording word for word, in both of the class’s versions and the student’s', () => {
    const [classroom, middle] = OWN_DECLARATIONS.class.versions;
    expect(classroom.wording).toHaveLength(5);
    expect(classroom.wording[0]).toMatch(/^Two hundred and fifty years ago, in the city of Philadelphia, fifty-six men /);
    expect(classroom.wording[0]).toContain("we — the students of [Teacher]'s [Grade] — set our names to our own.");
    expect(classroom.wording[2]).toContain('That we will leave this [grade] better than we found it');
    expect(middle.wording[1]).toMatch(/^We hold these truths to be self-evident: that every person in this school was made/);
    expect(middle.wording[2]).toMatch(/having been worth the investment made in us\.$/);
    // The same opening, pledge and closing.
    for (const i of [0, 3, 4]) expect(middle.wording[i]).toBe(classroom.wording[i]);
    expect(classroom.wording[3]).toBe('And so we mutually pledge to one another our attention, our kindness, and our honour.');
    expect(classroom.wording[4]).toBe('In witness whereof, we set our names below.');
    const mine = OWN_DECLARATIONS.mine.versions[0].wording;
    expect(mine[0]).toMatch(/In this anniversary year, I set my name to my own\.$/);
    expect(mine[1]).toMatch(/^I hold these truths to be self-evident: that every person in this classroom/);
    expect(mine[2]).toMatch(/^I therefore declare that I will come to school ready to learn/);
    expect(mine[3]).toBe('And so I pledge my attention, my kindness, and my honour.');
    expect(mine[4]).toBe('In witness whereof, I set my name below.');
    // Only the person changes: no "we", "our" or "us" is left in the student's own.
    expect(mine.join(' ')).not.toMatch(/\b(we|our|us)\b/i);
  });

  it('fills her blanks: the teacher and the grade, or "our class" and "classroom" when blank', () => {
    expect(gradeWords('')).toBe('');
    for (const g of ['4', '4th', '4th grade', 'Grade 4', '4TH GRADE', ' 4th  Grade ']) expect(gradeWords(g)).toBe('4th grade');
    expect(gradeWords('1')).toBe('1st grade');
    expect(gradeWords('2nd')).toBe('2nd grade');
    expect(gradeWords('3')).toBe('3rd grade');
    expect(gradeWords('11')).toBe('11th grade');
    expect(gradeWords('12')).toBe('12th grade');
    expect(gradeWords('K')).toBe('kindergarten');
    expect(gradeWords('Year 5')).toBe('Year 5');

    expect(classWords({})).toBe('our class');
    expect(classWords({ teacher: 'Mrs Ruiz', grade: '4' })).toBe('Mrs Ruiz’s 4th grade');
    expect(classWords({ teacher: 'Mrs Ruiz' })).toBe('Mrs Ruiz’s class');
    expect(classWords({ grade: '4th grade' })).toBe('the 4th grade');
    expect(classWords({ teacher: '  ', grade: ' ' })).toBe('our class');

    expect(ownTitle('class')).toBe('Our Class Declaration of Independence');
    expect(ownTitle('class', { teacher: 'Mrs Ruiz', grade: '4th grade' })).toBe('Mrs Ruiz’s 4th Grade Declaration of Independence');
    expect(ownTitle('class', { teacher: 'Mr Jones' })).toBe('Mr Jones’s Class Declaration of Independence');
    expect(ownTitle('class', { grade: '6' })).toBe('Our 6th Grade Declaration of Independence');
    expect(ownTitle('mine')).toBe('My Declaration of Independence');
    expect(ownTitle('mine', { name: 'Cleo' })).toBe('Cleo’s Declaration of Independence');

    const blank = ownWording('class', 'classroom');
    expect(blank[0]).toContain('we — the students of our class — set our names to our own.');
    expect(blank[2]).toContain('That we will leave this classroom better than we found it');
    const filled = ownWording('class', 'classroom', { teacher: 'Mrs Ruiz', grade: '4' });
    expect(filled[0]).toContain('we — the students of Mrs Ruiz’s 4th grade — set our names to our own.');
    expect(filled[2]).toContain('That we will leave this 4th grade better than we found it');
    expect(ownWording('class', 'middle', { teacher: 'Mrs Ruiz', grade: '8' })[2]).toContain('That we will leave this school, when the time comes');
    expect(ownWording('mine', 'classroom', { grade: '5th' })[2]).toContain('That I will leave this 5th grade better than I found it');
    expect(ownWording('mine', 'classroom')[2]).toContain('That I will leave this classroom better than I found it');
    // No blank is ever left showing.
    expect([...blank, ...filled, ...ownWording('mine', 'classroom')].join(' ')).not.toMatch(/\[/);
  });

  it('opens the class’s with its blanks, takes them up in the heading and her words, and switches version', () => {
    render(<America250Signing />);
    fireEvent.click(screen.getByRole('button', { name: 'Our Class Declaration' }));
    expect(window.location.hash).toBe('#class');
    const parchment = screen.getByRole('region', { name: /Our Class Declaration/ });
    expect(within(parchment).getByRole('heading', { name: 'Our Class Declaration of Independence' })).toBeInTheDocument();
    expect(within(parchment).getByText(/the students of our class/)).toBeInTheDocument();
    // The school line is blank: no school is filled in for them.
    expect(within(parchment).getByRole('textbox', { name: /School, place and year/ })).toHaveValue('');
    fireEvent.change(within(parchment).getByRole('textbox', { name: 'Teacher' }), { target: { value: 'Mrs Ruiz' } });
    fireEvent.change(within(parchment).getByRole('textbox', { name: 'Grade' }), { target: { value: '4' } });
    expect(within(parchment).getByRole('heading', { name: 'Mrs Ruiz’s 4th Grade Declaration of Independence' })).toBeInTheDocument();
    expect(within(parchment).getByText(/the students of Mrs Ruiz’s 4th grade/)).toBeInTheDocument();
    expect(within(parchment).getByText(/leave this 4th grade better/)).toBeInTheDocument();
    expect(within(parchment).getByText('Teacher:')).toBeInTheDocument();

    const versions = screen.getByRole('group', { name: 'Version' });
    expect(within(versions).getByRole('button', { name: 'Classroom' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(within(versions).getByRole('button', { name: 'Middle school' }));
    expect(within(versions).getByRole('button', { name: 'Middle school' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(parchment).getByText(/education is not merely the accumulation of knowledge/)).toBeInTheDocument();
    expect(within(parchment).queryByText(/learning is one of the greatest gifts/)).not.toBeInTheDocument();
  });

  it('takes a class’s names one after another, and prints them on the teacher’s line and 25 lines to sign', async () => {
    render(<America250Signing />);
    fireEvent.click(screen.getByRole('button', { name: 'Our Class Declaration' }));
    const parchment = screen.getByRole('region', { name: /Our Class Declaration/ });
    fireEvent.change(within(parchment).getByRole('textbox', { name: 'Teacher' }), { target: { value: 'Mrs Ruiz' } });
    fireEvent.change(within(parchment).getByRole('textbox', { name: /School, place and year/ }), { target: { value: 'Hillside School, Dayton, 2026' } });
    fireEvent.click(screen.getByRole('button', { name: 'Type it instead' }));
    for (const name of ['Ada', 'Ben']) {
      fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: name } });
      fireEvent.click(screen.getByRole('button', { name: 'Add my name' }));
    }
    expect(within(parchment).getByRole('img', { name: 'Signed: Ada' })).toBeInTheDocument();
    expect(within(parchment).getByRole('img', { name: 'Signed: Ben' })).toBeInTheDocument();
    expect(screen.getByText('2 names signed')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Your name' })).toHaveValue('');
    fireEvent.click(screen.getByRole('button', { name: 'Print it' }));
    const root = document.querySelector('.aps-print-root')!;
    expect(root).toHaveTextContent('Mrs Ruiz’s Class Declaration of Independence');
    expect(root).toHaveTextContent('Hillside School, Dayton, 2026');
    expect(root).toHaveTextContent('the students of Mrs Ruiz’s class');
    expect(root).toHaveTextContent('Teacher:');
    expect(root.querySelector('input, textarea')).toBeNull();
    expect(root.querySelectorAll('.aps-parch-slots > li')).toHaveLength(PRINT_SIGNATURE_LINES);
    expect(root.querySelectorAll('.aps-parch-sig')).toHaveLength(2);
    await waitFor(() => expect(print).toHaveBeenCalled());
  });

  it('prints a class’s parchment before anyone signs, its lines to be signed by hand, with no school line', async () => {
    render(<America250Signing />);
    fireEvent.click(screen.getByRole('button', { name: 'Our Class Declaration' }));
    fireEvent.click(screen.getByRole('button', { name: 'Print it' }));
    const root = document.querySelector('.aps-print-root')!;
    expect(root).toHaveTextContent('Our Class Declaration of Independence');
    expect(root.querySelector('.aps-parch-school')).toBeNull();
    expect(root.querySelectorAll('.aps-parch-slots > li')).toHaveLength(PRINT_SIGNATURE_LINES);
    expect(root.querySelectorAll('.aps-parch-sig')).toHaveLength(0);
    await waitFor(() => expect(print).toHaveBeenCalled());
  });

  it('opens a student’s own from its address, signs once, and prints it', async () => {
    window.history.replaceState(null, '', '/exhibitions/america-250/sign#mine');
    render(<America250Signing />);
    expect(screen.getByRole('button', { name: 'My Declaration' })).toHaveAttribute('aria-pressed', 'true');
    const parchment = screen.getByRole('region', { name: /My Declaration/ });
    expect(within(parchment).getByRole('heading', { name: 'My Declaration of Independence' })).toBeInTheDocument();
    fireEvent.change(within(parchment).getByRole('textbox', { name: 'Name' }), { target: { value: 'Cleo' } });
    fireEvent.change(within(parchment).getByRole('textbox', { name: 'Grade' }), { target: { value: '5' } });
    expect(within(parchment).getByRole('heading', { name: 'Cleo’s Declaration of Independence' })).toBeInTheDocument();
    expect(within(parchment).queryByText('Teacher:')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Type it instead' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'Cleo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Put your name to it' }));
    expect(screen.getByText(SIGN_TEXT.mineSigned)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Print it' }));
    await waitFor(() => expect(print).toHaveBeenCalled());
    const root = document.querySelector('.aps-print-root')!;
    expect(root).toHaveTextContent('Cleo’s Declaration of Independence');
    expect(root).toHaveTextContent('That I will leave this 5th grade better than I found it');
    expect(root.querySelectorAll('.aps-parch-sig')).toHaveLength(1);
  });
});

describe('A Copy of a Copy', () => {
  beforeEach(() => window.history.replaceState(null, '', COPIES_HREF));

  it('has a case file for each copy, in the chain’s order, and muddles the exhibits out of that order', () => {
    expect(CASE_FILES.map((f) => f.copy)).toEqual(COPIES.map((c) => c.id));
    for (const seed of [0, 1, 2, 7, 99, 2026]) {
      const order = exhibitOrder(seed);
      expect([...order].sort()).toEqual([...COPIES.map((c) => c.id)].sort());
      expect(order).not.toEqual(COPIES.map((c) => c.id));
    }
    // What each file says to look for is what its photograph shows (its alt text) and its note says.
    expect(COPIES[0].alt).toContain('only John Hancock’s and Charles Thomson’s names printed at its foot');
    expect(COPIES[1].alt).toContain('the signers’ names in print, grouped by state');
    expect(COPIES[2].alt).toContain('every signature clear and dark at the foot');
    expect(COPIES[3].alt).toContain('nearly all the signatures faded almost away');
    // An exhibit's description gives what is to be seen, but not its name.
    for (const c of COPIES) {
      const alt = exhibitAlt(c.id, 'A');
      expect(alt.startsWith('Exhibit A: ')).toBe(true);
      expect(alt).not.toContain(c.name);
    }
  });

  const exhibits = exhibitOrder(nextSeed(SEED, 0));
  const fileButton = (copy: (typeof exhibits)[number]) => screen.getByRole('button', { name: new RegExp(`^${fileFor(copy).title}`) });

  it('opens on the case: the posters’ words, what to do, and one button to start', () => {
    render(<ACopyOfACopy />);
    expect(screen.getByRole('heading', { level: 1, name: SIGN_TEXT.copiesHeading })).toBeInTheDocument();
    expect(screen.getByText(SIGN_TEXT.copiesIntro)).toBeInTheDocument();
    expect(screen.getByText(SIGN_TEXT.copiesLead)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: SIGN_TEXT.copiesStart }));
    // The first exhibit, unlabelled: its name waits until it is matched.
    expect(screen.getByRole('heading', { level: 1, name: 'Exhibit A' })).toHaveFocus();
    const first = COPIES.find((c) => c.id === exhibits[0])!;
    const lens = screen.getByRole('group', { name: exhibitAlt(first.id, 'A') });
    expect(lens).toHaveAttribute('aria-roledescription', 'magnifier');
    expect(lens.querySelector('img')).toHaveAttribute('src', first.src);
    // The four case files to choose from, and the chain in date order, empty.
    for (const f of CASE_FILES) expect(fileButton(f.copy)).toBeInTheDocument();
    const chain = within(screen.getByRole('list', { name: /The copy chain/ })).getAllByRole('listitem');
    expect(chain).toHaveLength(4);
    chain.forEach((li, i) => expect(li).toHaveTextContent(CASE_FILES[i].title));
    expect(chain[0]).toHaveTextContent('(not matched yet)');
  });

  it('says where to look on the sheet after a wrong match, then turns the slip over to what the copy is', () => {
    render(<ACopyOfACopy />);
    fireEvent.click(screen.getByRole('button', { name: SIGN_TEXT.copiesStart }));
    const right = exhibits[0];
    const wrong = CASE_FILES.find((f) => f.copy !== right)!.copy;
    fireEvent.click(fileButton(wrong));
    expect(fileButton(wrong)).toBeDisabled();
    expect(screen.getByText(HINTS[right])).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Not that file.');
    const copy = COPIES.find((c) => c.id === right)!;
    expect(screen.queryByText(copy.note.text)).toBeNull();
    fireEvent.click(fileButton(right));
    expect(screen.getByRole('heading', { level: 1, name: new RegExp(copy.name) })).toBeInTheDocument();
    expect(screen.getByText(copy.note.text)).toBeInTheDocument();
    expect(screen.queryByText(/a star!/)).toBeNull();
    // Nothing cited on the slip: the sources and the picture's credit are in the Sources drawer.
    for (const src of [...copy.note.sources, copy.credit]) expect(screen.queryByRole('link', { name: src.label })).toBeNull();
    const next = screen.getByRole('button', { name: /The next exhibit/ });
    expect(next).toHaveFocus();
    fireEvent.click(next);
    expect(screen.getByRole('heading', { level: 1, name: 'Exhibit B' })).toBeInTheDocument();
    // The matched copy has its place on the chain, and its file says which exhibit it was.
    const chain = within(screen.getByRole('list', { name: /The copy chain/ })).getAllByRole('listitem');
    expect(chain[CASE_FILES.findIndex((f) => f.copy === right)]).toHaveTextContent('Exhibit A (matched)');
    expect(fileButton(right)).toHaveTextContent('Matched: Exhibit A');
    // Choosing a file already matched says so.
    fireEvent.click(fileButton(right));
    expect(screen.getByRole('status')).toHaveTextContent('That file is already matched, to Exhibit A.');
  });

  it('ends on a twist (which copy do people picture?), then closes the case with the stars and the way on', () => {
    render(<ACopyOfACopy />);
    fireEvent.click(screen.getByRole('button', { name: SIGN_TEXT.copiesStart }));
    exhibits.forEach((copy, i) => {
      fireEvent.click(fileButton(copy));
      expect(screen.getByText(/Matched first time: a star!/, { selector: '.apc-star-earned' })).toBeInTheDocument();
      const c = COPIES.find((x) => x.id === copy)!;
      if (c.quote) expect(screen.getByText(c.quote)).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: i === exhibits.length - 1 ? /One last question/ : /The next exhibit/ }));
    });
    expect(screen.getByRole('heading', { level: 1, name: PICTURE.ask })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: /^The signed parchment today/ }));
    expect(screen.getByText(PICTURE.hint)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^Stone’s engraving/ }));
    expect(screen.getByText(PICTURE.found)).toBeInTheDocument();
    expect(screen.getByText(SIGN_TEXT.copiesIntro)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Close the case/ }));
    expect(screen.getByRole('heading', { level: 1, name: SIGN_TEXT.copiesEnd })).toHaveFocus();
    expect(screen.getByText('4 of 4 matched first time')).toBeInTheDocument();
    expect(screen.getByText(SIGN_TEXT.copiesClose)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Next: Add a Star/ })).toHaveAttribute('href', FLAG_HREF);
    fireEvent.click(screen.getByRole('button', { name: 'Play again' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Exhibit A' })).toBeInTheDocument();
    expect(EXHIBIT_LETTERS).toHaveLength(4);
  });

  it('lists each copy’s sources and picture credit in its Sources drawer', () => {
    const { container } = render(<ACopyOfACopy />);
    expect(container.querySelector('.apc-fact-source')).toBeNull();
    const drawer = openSources();
    expect(within(drawer).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(COPIES_SOURCES.map((g) => g.title));
    for (const c of COPIES) {
      const group = sourcesGroup(drawer, `${SIGN_TEXT.copiesHeading}: ${c.name}`);
      for (const src of c.note.sources) expect(within(group).getByRole('link', { name: src.label })).toHaveAttribute('href', src.href);
      expect(within(group).getByRole('link', { name: c.credit.label })).toHaveAttribute('href', c.credit.href);
    }
  });
});

describe('Add a Star: the flag', () => {
  it('draws 13 to 50 stars, 15 stripes only from 1795 to 1818, and the 50 as Executive Order 10834 sets them', () => {
    expect(stripesFor(13)).toBe(13);
    expect(stripesFor(15)).toBe(15);
    expect(stripesFor(19)).toBe(15);
    expect(stripesFor(20)).toBe(13);
    for (let n = 13; n <= 50; n++) {
      const stars = starLayout(n);
      expect(stars).toHaveLength(n);
      const uh = unionHeight(stripesFor(n));
      for (const s of stars) {
        expect(s.x - s.r).toBeGreaterThanOrEqual(0);
        expect(s.x + s.r).toBeLessThanOrEqual(FLAG.unionW);
        expect(s.y - s.r).toBeGreaterThanOrEqual(0);
        expect(s.y + s.r).toBeLessThanOrEqual(uh);
      }
    }
    expect(new Set(starLayout(50).map((s) => s.y)).size).toBe(9);
    expect(FLAG_MILESTONES.map((m) => [m.year, m.stars])).toEqual([[1777, 13], [1795, 15], [1818, 20], [1960, 50]]);
  });

  it('names a state and the year it joined for every star from 14 to 50, in order, ending with Hawaii in 1959', () => {
    expect(FLAG_TEXT.originals).toHaveLength(13);
    expect(FLAG_STATES.map((s) => s.stars)).toEqual(Array.from({ length: 37 }, (_, i) => i + 14));
    expect(new Set([...FLAG_TEXT.originals, ...FLAG_STATES.map((s) => s.state)]).size).toBe(50);
    for (let i = 1; i < FLAG_STATES.length; i++) expect(FLAG_STATES[i].year).toBeGreaterThanOrEqual(FLAG_STATES[i - 1].year);
    expect(FLAG_STATES[0]).toEqual({ stars: 14, state: 'Vermont', year: 1791 });
    expect(FLAG_STATES[1]).toEqual({ stars: 15, state: 'Kentucky', year: 1792 });
    expect(FLAG_STATES.find((s) => s.stars === 48)).toEqual({ stars: 48, state: 'Arizona', year: 1912 });
    expect(FLAG_STATES.at(-2)).toEqual({ stars: 49, state: 'Alaska', year: 1959 });
    expect(FLAG_STATES.at(-1)).toEqual({ stars: 50, state: 'Hawaii', year: 1959 });
    expect(starLine(13)).toBeNull();
    expect(starLine(14)).toBe('The 14th star: Vermont, which joined the Union in 1791.');
    expect(starLine(22)).toBe('The 22nd star: Alabama, which joined the Union in 1819.');
    expect(starLine(43)).toBe('The 43rd star: Idaho, which joined the Union in 1890.');
    expect(FLAG_MILESTONES.at(-1)!.text).toContain('July 4, 1960');
  });
});

describe('Add a Star: the game', () => {
  beforeEach(() => window.history.replaceState(null, '', FLAG_HREF));

  it('groups the states by the year they joined, on a ruler of decades from the 1790s to the 1950s', () => {
    expect(ROUNDS.flatMap((r) => r.states.map((s) => s.stars))).toEqual(FLAG_STATES.map((s) => s.stars));
    expect(ROUNDS).toHaveLength(new Set(FLAG_STATES.map((s) => s.year)).size);
    expect(namesOf(ROUNDS.find((r) => r.year === 1889)!)).toBe('North Dakota, South Dakota, Montana and Washington');
    expect(namesOf(ROUNDS.find((r) => r.year === 1959)!)).toBe('Alaska and Hawaii');
    expect(DECADES[0]).toBe(1790);
    expect(DECADES.at(-1)).toBe(1950);
    expect(DECADES).toHaveLength(17);
    expect(decadeOf(1791)).toBe(1790);
    expect([judge(1790, 1791), judge(1800, 1791), judge(1780, 1791), judge(1830, 1803), judge(1790, 1803)]).toEqual(['bullseye', 'close', 'close', 'late', 'close']);
    expect(judge(1790, 1821)).toBe('early');
    expect(verdictLine('bullseye', ROUNDS[0])).toBe('Bullseye! Vermont joined the Union in 1791.');
    expect(milestonesBetween(14, 15).map((m) => m.year)).toEqual([1795]);
    expect(milestonesBetween(15, 16)).toEqual([]);
    expect(milestonesBetween(14, 22).map((m) => m.year)).toEqual([1795, 1818]);
    expect(MAX_SCORE).toBe(ERAS.length * 3);
  });

  it('grows the flag in seven jumps, one state asked from each stretch, never the decade just answered or the next along', () => {
    for (let seed = 0; seed < 60; seed++) {
      const rounds = pickRounds(seed);
      expect(rounds).toHaveLength(7);
      // One from each era, in order, ending on Alaska and Hawaii.
      rounds.forEach((r, i) => expect(r.year >= ERAS[i].from && r.year <= ERAS[i].to).toBe(true));
      expect(rounds.at(-1)!.year).toBe(1959);
      // Each answer at least two decades on from the last: "the next one along" never scores a bullseye.
      for (let i = 1; i < rounds.length; i++) expect(decadeOf(rounds[i].year) - decadeOf(rounds[i - 1].year)).toBeGreaterThanOrEqual(20);
    }
    // Not the same states every game.
    expect(new Set(Array.from({ length: 20 }, (_, s) => pickRounds(s).map((r) => r.year).join())).size).toBeGreaterThan(1);
    // The stars that go on with a jump: every state between the flag's count and the one asked.
    const texas = ROUNDS.find((r) => r.year === 1845)!;
    expect(joinedBefore(23, texas).map((s) => s.state)).toEqual(['Missouri', 'Arkansas', 'Michigan']);
    expect(joinedBefore(13, ROUNDS[0])).toEqual([]);
  });

  it('opens on the 13 stars and the 13 original states, and how to play', () => {
    render(<AddAStar />);
    expect(screen.getByRole('heading', { level: 1, name: SIGN_TEXT.flagHeading })).toBeInTheDocument();
    expect(screen.getByText(FLAG_TEXT.intro)).toBeInTheDocument();
    expect(screen.getByText(FLAG_TEXT.thirteen.text)).toBeInTheDocument();
    const list = screen.getByRole('list', { name: FLAG_TEXT.originalsLabel });
    expect(within(list).getAllByRole('listitem').map((li) => li.textContent)).toEqual(FLAG_TEXT.originals);
    expect(screen.getByRole('img', { name: 'The flag with 13 stars' })).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: FLAG_TEXT.pick })).toBeNull();
  });

  const game = pickRounds(nextSeed(SEED, 0));

  it('asks the decade before each jump, then puts on its star with every state that joined in between', () => {
    render(<AddAStar />);
    fireEvent.click(screen.getByRole('button', { name: FLAG_TEXT.start }));
    const [a, b] = game;
    expect(screen.getByRole('heading', { level: 1, name: namesOf(a) })).toHaveFocus();
    const ruler = screen.getByRole('group', { name: FLAG_TEXT.pick });
    expect(within(ruler).getAllByRole('button').map((x) => x.textContent)).toEqual(DECADES.map((d) => `${d}s`));
    fireEvent.click(within(ruler).getByRole('button', { name: `${decadeOf(a.year)}s` }));
    const aStars = a.states.at(-1)!.stars;
    expect(screen.getByRole('img', { name: `The flag with ${aStars} stars` })).toBeInTheDocument();
    expect(screen.getByText(verdictLine('bullseye', a))).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(`Next: ${namesOf(b)}.`);
    expect(screen.getByRole('heading', { level: 1, name: namesOf(b) })).toBeInTheDocument();
    // Guess far too late for the second: no points, and the states between go on too.
    fireEvent.click(within(ruler).getByRole('button', { name: '1950s' }));
    expect(screen.getByText(verdictLine('late', b))).toBeInTheDocument();
    const between = joinedBefore(aStars, b).map((s) => s.state);
    if (between.length) expect(screen.getByText(new RegExp(`^${between[0]}.* joined in between`))).toBeInTheDocument();
    expect(screen.getByRole('img', { name: `The flag with ${b.states.at(-1)!.stars} stars` })).toBeInTheDocument();
    // The milestones the jump passed (the 1795 flag at 15 stars, back to 13 stripes at 20).
    const passed = milestonesBetween(aStars, b.states.at(-1)!.stars);
    for (const m of passed) expect(screen.getByText(m.text)).toBeInTheDocument();
    expect(screen.getByText(/Score/)).toHaveTextContent('Score 3');
  });

  it('grows the flag to 50 stars, and ends with the score and every milestone', () => {
    render(<AddAStar />);
    fireEvent.click(screen.getByRole('button', { name: FLAG_TEXT.start }));
    for (const r of game) fireEvent.click(screen.getByRole('button', { name: `${decadeOf(r.year)}s` }));
    expect(screen.getByRole('heading', { level: 1, name: FLAG_TEXT.finished })).toHaveFocus();
    expect(screen.getByRole('img', { name: 'The flag with 50 stars' })).toBeInTheDocument();
    expect(screen.getByText(/You scored/)).toHaveTextContent(`You scored ${MAX_SCORE} of ${MAX_SCORE}, with 7 bullseyes.`);
    const milestones = within(screen.getByRole('list', { name: 'Milestones' })).getAllByRole('listitem');
    expect(milestones.map((m) => m.textContent)).toEqual(FLAG_MILESTONES.map((m) => `${m.year} ${m.text}`));
    expect(screen.getByRole('link', { name: SIGN_TEXT.backToSign })).toHaveAttribute('href', '/exhibitions/america-250/sign');
    // Play again draws the states afresh.
    fireEvent.click(screen.getByRole('button', { name: FLAG_TEXT.again }));
    expect(screen.getByRole('heading', { level: 1, name: namesOf(pickRounds(nextSeed(SEED, 1))[0]) })).toBeInTheDocument();
  });

  it('sets its sources, linked, in the Sources drawer', () => {
    render(<AddAStar />);
    for (const src of FLAG_TEXT.sources) expect(screen.queryByRole('link', { name: src.label })).toBeNull();
    const drawer = openSources();
    expect(within(drawer).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(FLAG_SOURCES.map((g) => g.title));
    const group = sourcesGroup(drawer, SIGN_TEXT.flagHeading);
    for (const src of FLAG_TEXT.sources) expect(within(group).getByRole('link', { name: src.label })).toHaveAttribute('href', src.href);
    expect(FLAG_TEXT.sources.map((x) => x.href)).toEqual([
      'https://www.govinfo.gov/content/pkg/CDOC-108hdoc97/html/CDOC-108hdoc97.htm',
      'https://www.archives.gov/federal-register/codification/executive-order/10834.html',
      'https://postalmuseum.si.edu/exhibition/long-may-it-wave/the-evolution-of-the-american-flag',
    ]);
  });
});

describe('wiring', () => {
  it('sets the three rooms on the landing page, the projector, the map and the sitemap', () => {
    const rooms = [
      ['/exhibitions/america-250/sign', 'Put Your Name to It', 'ap-sign'],
      ['/exhibitions/america-250/copies', 'A Copy of a Copy', 'ap-copies'],
      ['/exhibitions/america-250/flag', 'Add a Star', 'ap-flag'],
    ];
    expect(AMERICA_250.interactives?.map((c) => [c.href, c.label, c.title])).toEqual(rooms.map(([href, title]) => [href, 'Interactive', title]));
    expect(AMERICA_250.interactives?.[0].image?.src).toBe('/exhibitions/america-250/rooms/sign.webp');
    expect(AMERICA_250.projector.links.map((l) => l.href)).toEqual(rooms.map(([href]) => href));
    const plan = getLevelConfig('/exhibitions/america-250').floorPlan?.rooms.map((r) => r.path);
    for (const [href, , id] of rooms) {
      expect(getRoomByPath(href)?.id).toBe(id);
      expect(getLevelConfig(href).title).toBe('America 250');
      expect(plan).toContain(href);
      expect(sitemap().map((e) => e.url)).toContainEqual(expect.stringMatching(new RegExp(`${href}$`)));
    }
  });
});

describe('fine tuning (regressions from trying the room)', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/exhibitions/america-250/sign#sign');
    window.print = jest.fn();
  });

  it('opens each parchment at its head, not scrolled to where the last one was left', () => {
    render(<America250Signing />);
    const declaration = screen.getByRole('region', { name: /Declaration of Independence/ });
    declaration.scrollTop = 900;
    fireEvent.click(screen.getByRole('button', { name: 'Our Class Declaration' }));
    const own = screen.getByRole('region', { name: /Our Class Declaration/ });
    expect(own).not.toBe(declaration);
    expect(own.scrollTop).toBe(0);
  });

  it('prints again when Print it is pressed again before the browser says the printing is done', async () => {
    render(<America250Signing />);
    fireEvent.click(screen.getByRole('button', { name: 'Type it instead' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'A. Visitor' } });
    fireEvent.click(screen.getByRole('button', { name: 'Put your name to it' }));
    fireEvent.click(screen.getByRole('button', { name: 'Print it' }));
    await waitFor(() => expect(window.print).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByRole('button', { name: 'Print it' }));
    await waitFor(() => expect(window.print).toHaveBeenCalledTimes(2));
  });

  it('says where it can be seen when the quill runs dry, and a dip fills it', () => {
    const box = { left: 0, top: 0, right: 100, bottom: 30, width: 100, height: 30, x: 0, y: 0, toJSON: () => ({}) };
    const rect = jest.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue(box as DOMRect);
    try {
      render(<America250Signing />);
      fireEvent.click(screen.getByRole('button', { name: 'Dip the quill in the ink' }));
      expect(screen.queryByText(/The quill is dry/)).toBeNull();
      const pad = screen.getByRole('img', { name: /The line to sign on/ });
      // jsdom has no PointerEvent: a mouse event of the pointer's type carries the position.
      const at = (type: string, clientX: number) => fireEvent(pad, new MouseEvent(type, { bubbles: true, clientX, clientY: 10 }));
      at('pointerdown', 0);
      // Back and forth across the line, more than a dip of ink can write
      for (let i = 1; i <= 8; i++) at('pointermove', i % 2 ? 100 : 0);
      at('pointerup', 0);
      expect(screen.getByText(/The quill is dry/)).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Dip the quill in the ink' }));
      expect(screen.queryByText(/The quill is dry/)).toBeNull();
    } finally {
      rect.mockRestore();
    }
  });

  it('takes the signer on to A Copy of a Copy', () => {
    render(<America250Signing />);
    fireEvent.click(screen.getByRole('button', { name: 'Type it instead' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'A. Visitor' } });
    fireEvent.click(screen.getByRole('button', { name: 'Put your name to it' }));
    expect(screen.getByRole('link', { name: /Next: A Copy of a Copy/ })).toHaveAttribute('href', COPIES_HREF);
  });
});

describe('the Sources drawer', () => {
  it('lists the Declaration’s source, and nothing is cited on the page', () => {
    window.history.replaceState(null, '', '/exhibitions/america-250/sign#sign');
    const { container } = render(<America250Signing />);
    expect(container.querySelector('.aps-credit, .aps-fact-source')).toBeNull();
    expect(screen.queryByText(/^(Source|Sources|Picture):/)).toBeNull();
    const drawer = openSources();
    expect(within(drawer).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(SIGN_SOURCES.map((g) => g.title));
  });
});
