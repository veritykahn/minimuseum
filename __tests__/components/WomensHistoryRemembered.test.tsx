import { fireEvent, render, screen, within } from '@testing-library/react';
import WhoGetsRemembered from '@/app/exhibitions/womens-history/remembered/page';
import {
  AUDIT,
  FACT_MERMAIDS,
  FACT_OTHERS,
  FACT_TOP_50,
  POSTER,
  QUESTIONS,
  TOP_50,
  WOMEN_IN_TOP_50,
  guessLine,
} from '@/app/exhibitions/womens-history/remembered/remembered';
import { CONFEDERATE_NAMES, FACT_CONFEDERATE, LOC_JOAN, NWHM_SACAGAWEA, NWHM_TUBMAN, THREE_WOMEN } from '@/app/exhibitions/womens-history/remembered/threeWomen';
import { CLAIM, EVIDENCE, MAX_TILT, WEIGHING, argumentLines, evidenceTilt, isRight } from '@/app/exhibitions/womens-history/remembered/weighEvidence';
import { AFTER, BEFORE, INTERVIEW, INTERVIEW_COUNT, LISTENING, ORAL_SOURCES, REFLECT, VETERANS_HISTORY, WRITE_UP } from '@/app/exhibitions/womens-history/remembered/oralHistoryText';
import { WOMENS_HISTORY } from '@/app/exhibitions/womens-history/womensHistory';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';
import sitemap from '@/app/sitemap';

/*
 * Who Gets Remembered?: the poster's own words, the audit's figures as the
 * report prints them, the guess and the uncovering, the three women and the
 * note on the Confederate names, weighing the evidence and the argument it
 * makes, the oral history and its printables, and the room's place on the
 * landing page, the map, the projector and the sitemap.
 */

beforeEach(() => window.history.replaceState(null, '', '/'));

/** What the student sees: the element's words without the print-only sheets and lines. */
function onScreen(el: Element) {
  const copy = el.cloneNode(true) as Element;
  copy.querySelectorAll('.whr-print, .whr-print-source').forEach((e) => e.remove());
  return copy.textContent ?? '';
}

/** The room's Sources drawer, opened: nothing is cited on the student's screen, every source is here. */
function openSources() {
  fireEvent.click(screen.getByRole('button', { name: 'Sources and credits' }));
  return within(screen.getByRole('dialog', { name: 'Sources and credits' }));
}

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

  it('sets the three women’s lines from one source each, with no disputed dates', () => {
    expect(THREE_WOMEN.map((w) => [w.name, w.source])).toEqual([
      ['Joan of Arc', LOC_JOAN],
      ['Harriet Tubman', NWHM_TUBMAN],
      ['Sacagawea', NWHM_SACAGAWEA],
    ]);
    for (const w of THREE_WOMEN) expect(w.lines).toHaveLength(5);
    const all = JSON.stringify(THREE_WOMEN);
    expect(all).not.toMatch(/canoni[sz]ed|1905|1920|1884|burned/);
    expect(all).toContain('put to death as a heretic in 1431');
  });

  it('notes the Confederate names neutrally, with the audit, the Park Service and the SPLC', () => {
    expect(CONFEDERATE_NAMES.every((n) => TOP_50.some((p) => p.name === n))).toBe(true);
    expect(FACT_CONFEDERATE.sources.map((s) => s.href)).toEqual([
      AUDIT.href,
      'https://www.nps.gov/stories/confronting-slavery-and-revealing-the-lost-cause.htm',
      'https://www.splcenter.org/presscenter/splc-launches-third-edition-its-whose-heritage-report-tracking-confederate-memorials-and',
    ]);
    expect(FACT_CONFEDERATE.text).toContain('between 1900 and 1920');
    expect(FACT_CONFEDERATE.text).toContain('377 Confederate symbols have been removed, renamed or relocated');
  });

  it('weighs only real evidence: level at first, down on the evidence side with all three', () => {
    expect(evidenceTilt({})).toBe(0);
    expect(evidenceTilt({ lincoln: 'scale', march8: 'scale', orleans: 'scale', others: 'scale' })).toBe(0);
    expect(evidenceTilt(Object.fromEntries(WEIGHING.map((c) => [c.id, 'scale' as const])))).toBe(-MAX_TILT);
    expect(WEIGHING.map((c) => c.id)).toEqual(['top50', 'mermaids', 'outnumber']);
    expect(EVIDENCE).toHaveLength(7);
    for (const c of EVIDENCE) {
      expect(c.sources.length).toBeGreaterThan(0);
      expect(isRight(c, c.weighs ? 'scale' : 'aside')).toBe(true);
      expect(isRight(c, c.weighs ? 'aside' : 'scale')).toBe(false);
    }
    // The claim is the poster's own sentence.
    expect(POSTER.overshadowed.replace(/'/g, '’')).toContain(CLAIM.slice(0, -1));
    expect(EVIDENCE.find((c) => c.id === 'lincoln')!.text).toContain(String(TOP_50[0].monuments));
  });

  it('puts the argument together as claim, evidence and reasoning', () => {
    expect(argumentLines(WEIGHING[0], ['numbers', 'compares'], '  Only three!  ')).toEqual({
      claim: CLAIM,
      evidence: FACT_TOP_50.text,
      reasoning: 'It uses numbers. It compares women with men. Only three!',
    });
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
    // The audit is cited once, in the Sources drawer, not under the facts.
    expect(screen.queryAllByRole('link', { name: AUDIT.label })).toHaveLength(0);
    expect(document.querySelector('.whr-statues')).not.toHaveTextContent(/Sources?:/);
    const drawer = openSources();
    expect(drawer.getAllByRole('link', { name: AUDIT.label }).length).toBeGreaterThan(0);
    fireEvent.click(drawer.getByRole('button', { name: 'Close sources' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guess again' }));
    expect(screen.queryByText('Abraham Lincoln')).toBeNull();
  });

  it('meets the three women after the names are uncovered, each with her source', () => {
    render(<WhoGetsRemembered />);
    expect(screen.queryByRole('group', { name: 'Meet the three women' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Uncover the names' }));
    const pick = screen.getByRole('group', { name: 'Meet the three women' });
    expect(within(pick).getAllByRole('button').map((b) => b.textContent)).toEqual(['Joan of Arc', 'Harriet Tubman', 'Sacagawea']);
    fireEvent.click(within(pick).getByRole('button', { name: 'Harriet Tubman' }));
    const card = screen.getByRole('article', { name: 'Harriet Tubman' });
    expect(card).toHaveTextContent('Number 24 in the Top 50, with 21 recorded monuments.');
    for (const l of THREE_WOMEN[1].lines) expect(card).toHaveTextContent(l);
    expect(within(card).queryByRole('link', { name: NWHM_TUBMAN.label })).toBeNull();
    const drawer = openSources();
    expect(drawer.getAllByText('Harriet Tubman', { exact: false }).length).toBeGreaterThan(0);
    expect(drawer.getByRole('link', { name: NWHM_TUBMAN.label })).toHaveAttribute('href', NWHM_TUBMAN.href);
    fireEvent.click(drawer.getByRole('button', { name: 'Close sources' }));
    fireEvent.click(within(card).getByRole('button', { name: 'Meet Sacagawea' }));
    expect(screen.getByRole('article', { name: 'Sacagawea' })).toHaveTextContent('has been of great service to me as a pilot through this country.');
    fireEvent.click(screen.getByRole('button', { name: 'Back to the fifty statues' }));
    expect(screen.getByRole('list', { name: /50 people/ })).toBeInTheDocument();
  });

  it('shows the Confederate names as the data does, marked, with a sourced note', () => {
    render(<WhoGetsRemembered />);
    fireEvent.click(screen.getByRole('button', { name: 'Uncover the names' }));
    const list = screen.getByRole('list', { name: /50 people/ });
    for (const n of CONFEDERATE_NAMES) expect(within(list).getByText(n).closest('.whr-name')).toHaveTextContent('(a Confederate leader');
    fireEvent.click(screen.getByRole('button', { name: /About four of these names/ }));
    const note = screen.getByRole('article', { name: 'About four of these names' });
    expect(note).toHaveTextContent(FACT_CONFEDERATE.text);
    // Its sources are in the drawer, under "Who gets a statue?".
    expect(within(note).queryAllByRole('link')).toHaveLength(0);
    const drawer = openSources();
    for (const s of FACT_CONFEDERATE.sources) expect(drawer.getAllByRole('link', { name: s.label })[0]).toHaveAttribute('href', s.href);
  });

  it('weighs the evidence, card by card, then builds and prints an argument', () => {
    window.history.replaceState(null, '', '/#scale');
    const print = jest.spyOn(window, 'print').mockImplementation(() => {});
    render(<WhoGetsRemembered />);
    expect(screen.getByRole('tab', { name: 'Tip the scale' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('img', { name: /level: no evidence/ })).toBeInTheDocument();
    for (const [i, c] of EVIDENCE.entries()) {
      expect(screen.getByRole('heading', { name: `Evidence ${i + 1} of ${EVIDENCE.length}` })).toBeInTheDocument();
      expect(screen.getByText(c.text)).toBeInTheDocument();
      // One card is laid on wrongly, to see the room say so and let it be set aside.
      if (c.id === 'lincoln') {
        fireEvent.click(screen.getByRole('button', { name: 'Lay it on the scale' }));
        expect(screen.getByText('It weighs nothing here.')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /tipped toward the evidence: 1 of 3/ })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Set it aside instead' }));
      } else fireEvent.click(screen.getByRole('button', { name: c.weighs ? 'Lay it on the scale' : 'Set it aside' }));
      expect(document.querySelector('.whr-verdict')).toHaveTextContent(c.why);
      fireEvent.click(screen.getByRole('button', { name: i < EVIDENCE.length - 1 ? 'Next card' : 'Weigh it up' }));
    }
    expect(screen.getByRole('img', { name: /3 of 3 pieces/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Which evidence weighs the most?' })).toBeInTheDocument();
    expect(screen.getByText(/You got 6 of 7 right the first time/)).toBeInTheDocument();
    const build = screen.getByRole('button', { name: 'Build my argument' });
    expect(build).toBeDisabled();
    fireEvent.click(screen.getByRole('radio', { name: FACT_MERMAIDS.text }));
    expect(build).toBeDisabled();
    fireEvent.click(screen.getByRole('checkbox', { name: 'It surprised me.' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'In your own words' }), { target: { value: 'Mermaids are not real.' } });
    fireEvent.click(build);
    const argument = screen.getByRole('region', { name: 'My argument' });
    expect(argument).toHaveTextContent(CLAIM);
    expect(argument).toHaveTextContent(FACT_MERMAIDS.text);
    expect(argument).toHaveTextContent('It surprised me. Mermaids are not real.');
    expect(argument).toHaveTextContent(POSTER.households);
    fireEvent.click(screen.getByRole('button', { name: 'Print my argument' }));
    expect(print).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Start again' }));
    expect(screen.getByRole('heading', { name: 'Evidence 1 of 7' })).toBeInTheDocument();
    print.mockRestore();
  });

  it('is an oral history in six steps, with an interview sheet and a write-up to print', () => {
    const print = jest.spyOn(window, 'print').mockImplementation(() => {});
    render(<WhoGetsRemembered />);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Who gets a statue?' }), { key: 'End' });
    expect(screen.getByRole('tab', { name: 'Talk about it' })).toHaveFocus();
    expect(window.location.hash).toBe('#talk');
    const panel = screen.getByRole('tabpanel', { name: 'Talk about it' });
    expect(within(panel).getByRole('heading', { name: 'Interview a woman in your family' })).toBeInTheDocument();
    for (const t of BEFORE) expect(panel).toHaveTextContent(t.text);
    fireEvent.click(within(panel).getByRole('button', { name: /Next: The questions/ }));
    expect(within(panel).getByRole('heading', { name: '14 questions to ask' })).toHaveFocus();
    const questions = INTERVIEW.flatMap((g) => g.questions);
    expect(questions).toHaveLength(INTERVIEW_COUNT);
    expect(INTERVIEW_COUNT).toBe(14);
    for (const q of questions) expect(within(panel).getAllByText(q).length).toBeGreaterThan(0);
    fireEvent.click(within(panel).getByRole('button', { name: 'While you listen' }));
    for (const t of LISTENING) expect(panel).toHaveTextContent(t.text);
    expect(within(panel).queryAllByRole('link', { name: VETERANS_HISTORY.label })).toHaveLength(0);
    fireEvent.click(within(panel).getByRole('button', { name: 'Afterwards' }));
    for (const t of AFTER) expect(panel).toHaveTextContent(t.text);
    // The interview sheet: the tips and all fourteen questions, to take along.
    fireEvent.click(within(panel).getByRole('button', { name: 'Print the interview sheet' }));
    expect(print).toHaveBeenCalledTimes(1);
    const sheet = document.querySelector('.whr-print-sheet')!;
    for (const q of questions) expect(sheet).toHaveTextContent(q);
    for (const r of REFLECT) expect(sheet).toHaveTextContent(r);
    // The write-up.
    fireEvent.click(within(panel).getByRole('button', { name: 'Write it up' }));
    fireEvent.change(within(panel).getByRole('textbox', { name: 'I interviewed' }), { target: { value: 'Grandma Rose' } });
    fireEvent.change(within(panel).getByRole('textbox', { name: WRITE_UP[0].label }), { target: { value: 'She sang in a choir.' } });
    fireEvent.click(within(panel).getByRole('button', { name: 'Print my write-up' }));
    expect(print).toHaveBeenCalledTimes(2);
    const writeup = document.querySelector('.whr-print-writeup')!;
    expect(writeup).toHaveTextContent('I interviewed Grandma Rose');
    expect(writeup).toHaveTextContent('She sang in a choir.');
    // And questions for the class, with the note that the same is true of other groups.
    fireEvent.click(within(panel).getByRole('button', { name: 'With your class' }));
    for (const q of QUESTIONS) expect(panel).toHaveTextContent(q);
    expect(screen.getByRole('complementary', { name: 'Not only women' })).toHaveTextContent(FACT_OTHERS.text);
    expect(screen.getByRole('link', { name: 'Make a timeline of a woman in your life' })).toHaveAttribute('href', '/exhibitions/womens-history/violet#make');
    expect(ORAL_SOURCES.map((x) => x.href)).toContain('https://www.loc.gov/vets/conducttheinterview.html');
    // Every interview guide is in the drawer; the printed sheets keep their own source lines.
    expect(onScreen(panel)).not.toMatch(/Sources?:/);
    const drawer = openSources();
    for (const s of ORAL_SOURCES) expect(drawer.getAllByRole('link', { name: s.label })[0]).toHaveAttribute('href', s.href);
    expect(document.querySelector('.whr-print-sheet')).toHaveTextContent(`Sources: ${ORAL_SOURCES.map((x) => x.label).join('; ')}`);
    print.mockRestore();
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
