import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import America250Signing from '@/app/exhibitions/america-250/sign/page';
import { COPY_NOTES, COPY_STAGES, FLAG_MILESTONES, FLAG_TEXT, SIGN_TEXT } from '@/app/exhibitions/america-250/sign/signText';
import { DECLARATION_BODY, DECLARATION_HEAD, DECLARATION_SIGNERS, DECLARATION_SOURCE, DECLARATION_TITLE, OWN_DECLARATIONS, WORDING_COMING_SOON } from '@/app/exhibitions/america-250/sign/declaration';
import { FLAG, starLayout, stripesFor, unionHeight } from '@/app/exhibitions/america-250/sign/flagLayout';
import { inkAfter, inkAlpha, INK_PER_DIP, nibQuad, scribbleLine, thin, tracePath } from '@/app/exhibitions/america-250/sign/signing';
import { AMERICA_250 } from '@/app/exhibitions/america-250/america250';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';
import sitemap from '@/app/sitemap';

/*
 * America 250's signing room: every line about 1776 is the posters' own, the
 * quill's ink and nib, signing (typed, for the keyboard), the copies, and the
 * flag. Carved out of "the posters' own": where the Rough Draft and the
 * Engrossed Copy are held (COPY_NOTES) and the flag's milestones
 * (FLAG_MILESTONES), owner-approved and fact-checked, each set with its source.
 * The parchment carries the Declaration's own words, the National Archives'
 * transcription; the class's and the student's declarations wait for the
 * owner's wording, and print with their names.
 */

/** The posters' words, as read: "*…*" marks italics; quotes and cites both. */
const posterText = AMERICA_250.posters
  .flatMap((p) => p.items)
  .flatMap((it) => ['text' in it && it.text ? it.text : '', 'cite' in it && it.cite ? it.cite : ''])
  .join('\n')
  .replace(/\*/g, '');
const straight = (s: string) => s.replace(/[’‘]/g, "'");

beforeAll(() => {
  // jsdom draws nothing; the room carries on without a canvas.
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

describe('the words', () => {
  it('quotes the posters word for word, and adds no facts but the approved notes', () => {
    // The approved notes are not quotes, and are not in the quoted list below.
    for (const n of Object.values(COPY_NOTES)) expect(posterText).not.toContain(n.text);
    const quoted = [SIGN_TEXT.carroll.text, SIGN_TEXT.epigraph.text, SIGN_TEXT.epigraph.cite, ...SIGN_TEXT.signed, SIGN_TEXT.copiesIntro, SIGN_TEXT.copiesClose, ...COPY_STAGES.map((s) => s.quote)];
    for (const q of quoted) expect(posterText).toContain(q);
  });

  it('names the copies as the posters do, oldest first', () => {
    expect(COPY_STAGES.map((s) => s.id)).toEqual(['rough', 'fair', 'engrossed', 'stone', 'transcription']);
    for (const name of ["Jefferson's Rough Draft", 'July 4 Fair Copy', 'Engrossed Copy']) expect(posterText).toContain(name);
    expect(straight(COPY_STAGES[0].name)).toBe("Jefferson's Rough Draft");
    // The one legible line on the sheet, and the words struck from the draft
    expect(posterText).toContain('We hold these truths to be self-evident');
    expect(posterText).toContain('sacred and undeniable');
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
    expect(tracePath([s], 700, 0.004, 3)).toBe(tracePath([s], 700, 0.004, 3));
    expect(scribbleLine(5, 0, 100, 500, 10)).toBe(scribbleLine(5, 0, 100, 500, 10));
    expect(scribbleLine(5, 0, 100, 500, 10)).toMatch(/^M/);
  });
});

describe('the room', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/america-250/sign'));

  it('has three tabs, and the keyboard moves between them', () => {
    render(<America250Signing />);
    const sign = screen.getByRole('tab', { name: /Sign your name/ });
    const copies = screen.getByRole('tab', { name: /A copy of a copy/ });
    expect(sign).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(sign, { key: 'ArrowRight' });
    expect(copies).toHaveAttribute('aria-selected', 'true');
    expect(copies).toHaveFocus();
    expect(window.location.hash).toBe('#copies');
    fireEvent.keyDown(copies, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: /The flag/ })).toHaveAttribute('aria-selected', 'true');
    expect(window.location.hash).toBe('#flag');
  });

  it('notes where the Rough Draft and the Engrossed Copy are held, each with its source', () => {
    render(<America250Signing />);
    fireEvent.click(screen.getByRole('tab', { name: /A copy of a copy/ }));
    const panel = screen.getByRole('tabpanel', { name: /A copy of a copy/ });
    expect(within(panel).getByText(COPY_NOTES.rough.text)).toBeInTheDocument();
    expect(within(panel).getByRole('link', { name: 'Library of Congress' })).toHaveAttribute(
      'href',
      'https://www.loc.gov/exhibits/creating-the-united-states/interactives/declaration-of-independence/equal/index.html',
    );
    fireEvent.click(within(panel).getByRole('button', { name: /Engrossed Copy/ }));
    expect(within(panel).getByText(COPY_NOTES.engrossed.text)).toBeInTheDocument();
    expect(within(panel).getByRole('link', { name: 'National Archives' })).toHaveAttribute('href', 'https://www.archives.gov/milestone-documents/declaration-of-independence');
    fireEvent.click(within(panel).getByRole('button', { name: /July 4 Fair Copy/ }));
    expect(within(panel).queryByRole('link')).toBeNull();
  });

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

  it('sets the Declaration’s own words on the parchment, to read inside it, with the signers and the source', () => {
    render(<America250Signing />);
    const parchment = screen.getByRole('region', { name: /Declaration of Independence/ });
    expect(parchment).toHaveAttribute('tabindex', '0');
    expect(within(parchment).getByText(DECLARATION_HEAD)).toBeInTheDocument();
    expect(within(parchment).getByRole('heading', { name: DECLARATION_TITLE })).toBeInTheDocument();
    for (const p of DECLARATION_BODY) expect(within(parchment).getByText(p)).toBeInTheDocument();
    expect(within(parchment).getByText('Charles Carroll of Carrollton')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: DECLARATION_SOURCE.label })).toHaveAttribute('href', 'https://www.archives.gov/founding-docs/declaration-transcript');
    fireEvent.click(screen.getByRole('button', { name: /Go to the line to sign/ }));
    expect(screen.getByRole('status')).toHaveTextContent('the line to sign on');
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

  it('carries on to the Engrossed Copy, Stone’s engraving and the transcription; the drafts keep their drawn hand', () => {
    window.history.replaceState(null, '', '/exhibitions/america-250/sign#copies');
    render(<America250Signing />);
    const panel = screen.getByRole('tabpanel', { name: /A copy of a copy/ });
    expect(screen.getByRole('img', { name: /A draft in handwriting/ })).not.toHaveTextContent('When in the Course');
    fireEvent.click(within(panel).getByRole('button', { name: /Engrossed Copy/ }));
    expect(screen.getByRole('img', { name: /A parchment in a formal hand/ })).toHaveTextContent('When in the Course of human events');
    fireEvent.click(within(panel).getByRole('button', { name: /transcription/ }));
    expect(screen.getByRole('img', { name: 'A printed page' })).toHaveTextContent('our sacred Honor');
  });
});

describe('the class’s and the student’s own declarations', () => {
  const print = jest.fn();
  beforeEach(() => {
    window.history.replaceState(null, '', '/exhibitions/america-250/sign');
    print.mockClear();
    window.print = print;
  });

  it('awaits the owner’s wording: a quiet placeholder, and no words written for her', () => {
    expect(OWN_DECLARATIONS.class.wording).toBeNull();
    expect(OWN_DECLARATIONS.mine.wording).toBeNull();
    render(<America250Signing />);
    fireEvent.click(screen.getByRole('button', { name: 'Our Class Declaration' }));
    expect(window.location.hash).toBe('#class');
    const parchment = screen.getByRole('region', { name: /Our Class Declaration/ });
    expect(within(parchment).getByRole('heading', { name: 'Our Class Declaration' })).toBeInTheDocument();
    expect(within(parchment).getByText(WORDING_COMING_SOON)).toBeInTheDocument();
  });

  it('takes a class’s names one after another, and prints the parchment with them', async () => {
    render(<America250Signing />);
    fireEvent.click(screen.getByRole('button', { name: 'Our Class Declaration' }));
    const parchment = screen.getByRole('region', { name: /Our Class Declaration/ });
    fireEvent.change(within(parchment).getByRole('textbox', { name: /Write your class’s own declaration/ }), { target: { value: 'We, Room 12, declare.' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Your class' }), { target: { value: 'Room 12' } });
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
    expect(root).toHaveTextContent('We, Room 12, declare.');
    expect(root).toHaveTextContent('Room 12');
    expect(root.querySelectorAll('.aps-parch-sig')).toHaveLength(2);
    await waitFor(() => expect(print).toHaveBeenCalled());
  });

  it('opens a student’s own from its address, signs once, and prints it', async () => {
    window.history.replaceState(null, '', '/exhibitions/america-250/sign#mine');
    render(<America250Signing />);
    expect(screen.getByRole('button', { name: 'My Declaration' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Type it instead' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'Cleo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Put your name to it' }));
    expect(screen.getByText(SIGN_TEXT.mineSigned)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Print it' }));
    await waitFor(() => expect(print).toHaveBeenCalled());
    expect(document.querySelector('.aps-print-root')).toHaveTextContent(WORDING_COMING_SOON);
  });
});

describe('the quill and the copies', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/america-250/sign'));

  it('dips the quill', () => {
    render(<America250Signing />);
    fireEvent.click(screen.getByRole('button', { name: 'Dip the quill in the ink' }));
    expect(screen.getByRole('status')).toHaveTextContent('The quill is full of ink.');
  });

  it('follows the signature from copy to copy, to the transcription set in type', () => {
    render(<America250Signing />);
    fireEvent.click(screen.getByRole('button', { name: 'Type it instead' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'A. Visitor' } });
    fireEvent.click(screen.getByRole('button', { name: 'Put your name to it' }));
    fireEvent.click(screen.getByRole('button', { name: 'Follow it from copy to copy' }));
    const panel = screen.getByRole('tabpanel', { name: /A copy of a copy/ });
    expect(within(panel).getByText(COPY_STAGES[0].quote)).toBeInTheDocument();
    expect(within(panel).getByRole('button', { name: 'Earlier' })).toBeDisabled();
    const next = within(panel).getByRole('button', { name: 'The next copy' });
    fireEvent.click(next);
    fireEvent.click(next);
    expect(screen.getByRole('status')).toHaveTextContent('3 of 5: The Engrossed Copy');
    expect(screen.getByRole('img', { name: /with your signature/ })).toHaveTextContent('A. Visitor');
    fireEvent.click(next);
    fireEvent.click(next);
    expect(next).toBeDisabled();
    expect(within(panel).getByText(SIGN_TEXT.copiesClose)).toBeInTheDocument();
    fireEvent.change(within(panel).getByRole('textbox', { name: SIGN_TEXT.printedNameLabel }), { target: { value: 'Ada Visitor' } });
    expect(screen.getByRole('img', { name: 'A printed page' })).toHaveTextContent('Ada Visitor');
    // Any copy can be chosen directly
    fireEvent.click(within(panel).getByRole('button', { name: /Rough Draft/ }));
    expect(within(panel).getByText(COPY_STAGES[0].quote)).toBeInTheDocument();
  });
});

describe('the flag', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/america-250/sign#flag'));

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

  it('opens at #flag; a tap, the button and the arrow keys add stars, and the milestones appear as they pass', () => {
    render(<America250Signing />);
    expect(screen.getByRole('tab', { name: /The flag/ })).toHaveAttribute('aria-selected', 'true');
    const panel = screen.getByRole('tabpanel', { name: /The flag/ });
    const flag = screen.getByRole('slider', { name: /stars/ });
    expect(flag).toHaveAttribute('aria-valuenow', '13');
    expect(within(panel).getByText(FLAG_MILESTONES[0].text)).toBeInTheDocument();
    expect(within(panel).queryByText(FLAG_MILESTONES[1].text)).toBeNull();

    fireEvent.click(flag);
    fireEvent.click(within(panel).getByRole('button', { name: 'Add a star' }));
    expect(flag).toHaveAttribute('aria-valuenow', '15');
    expect(flag).toHaveAttribute('aria-valuetext', '15 stars and 15 stripes');
    expect(within(panel).getByText(FLAG_MILESTONES[1].text)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(`1795: ${FLAG_MILESTONES[1].text}`);

    for (let i = 0; i < 5; i++) fireEvent.keyDown(flag, { key: 'ArrowRight' });
    expect(flag).toHaveAttribute('aria-valuenow', '20');
    expect(within(panel).getByText(FLAG_MILESTONES[2].text)).toBeInTheDocument();
    fireEvent.keyDown(flag, { key: 'End' });
    expect(flag).toHaveAttribute('aria-valuenow', '50');
    expect(within(panel).getByText(FLAG_MILESTONES[3].text)).toBeInTheDocument();
    expect(within(panel).getByRole('button', { name: 'Add a star' })).toBeDisabled();
    fireEvent.keyDown(flag, { key: 'ArrowDown' });
    expect(flag).toHaveAttribute('aria-valuenow', '49');
    expect(within(panel).queryByText(FLAG_MILESTONES[3].text)).toBeNull();
    fireEvent.click(within(panel).getByRole('button', { name: 'Back to 13' }));
    expect(flag).toHaveAttribute('aria-valuenow', '13');
  });

  it('sets its sources, linked', () => {
    render(<America250Signing />);
    const panel = screen.getByRole('tabpanel', { name: /The flag/ });
    for (const s of FLAG_TEXT.sources) expect(within(panel).getByRole('link', { name: s.label })).toHaveAttribute('href', s.href);
    expect(FLAG_TEXT.sources.map((s) => s.href)).toEqual([
      'https://www.archives.gov/federal-register/codification/executive-order/10834.html',
      'https://postalmuseum.si.edu/exhibition/long-may-it-wave/the-evolution-of-the-american-flag',
    ]);
  });
});

describe('wiring', () => {
  it('sets the room on the landing page, the projector, the map and the sitemap', () => {
    expect(AMERICA_250.interactives?.map((c) => [c.href, c.label, c.title])).toEqual([['/exhibitions/america-250/sign', 'Interactive', 'Put Your Name to It']]);
    expect(AMERICA_250.interactives?.[0].image?.src).toMatch(/\.svg$/);
    expect(AMERICA_250.projector.links.map((l) => l.href)).toEqual(['/exhibitions/america-250/sign']);
    expect(getRoomByPath('/exhibitions/america-250/sign')?.id).toBe('ap-sign');
    expect(getLevelConfig('/exhibitions/america-250/sign').title).toBe('America 250');
    expect(getLevelConfig('/exhibitions/america-250').floorPlan?.rooms.map((r) => r.path)).toContain('/exhibitions/america-250/sign');
    expect(sitemap().map((e) => e.url)).toContainEqual(expect.stringMatching(/\/exhibitions\/america-250\/sign$/));
  });
});
