import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import WhoDoYouSee from '@/app/exhibitions/black-history/representation/page';
import DollPicture from '@/app/exhibitions/black-history/representation/Doll';
import { CCBC_2025, CCBC_FACT, DOLL_TEST_FACTS, DOLL_TEST_STEPS, DOLL_TEST_TEXT, SURVEY_QUESTIONS } from '@/app/exhibitions/black-history/representation/representationText';
import { CLOTH_COLORS, FIRST_DOLL, HAIR_STYLES, SKIN, describe as describeDoll, freckleColor, lightness, shade, surprise, vitiligoEdge, vitiligoPatch } from '@/app/exhibitions/black-history/representation/dollOptions';
import { BLACK_HISTORY } from '@/app/exhibitions/black-history/blackHistory';
import { OWNER_BARBIE_PHOTOS } from '@/app/exhibitions/black-history/timeline/timelineStops';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * Who Do You See?: the doll designer (a wide range, keyboard choices, a
 * doll that changes as you choose), the Doll Test (every fact a checked
 * note with its sources, ending on poster 2's own sentence), the book
 * survey (tallies that stay in the browser, and the CCBC's own figures),
 * the room's tabs, and its place on the map.
 */

const posterCopy = BLACK_HISTORY.posters[1].items.map((i) => (i as { text?: string }).text ?? '').join(' ');

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  window.localStorage.clear();
});

describe('the doll’s choices', () => {
  it('offer a wide range: twelve skin tones, deepest to lightest, and hair from afros to a hijab', () => {
    expect(SKIN).toHaveLength(12);
    expect(SKIN[0].label).toMatch(/deepest/);
    expect(SKIN[11].label).toMatch(/lightest/);
    expect(HAIR_STYLES.map((h) => h.label)).toEqual(expect.arrayContaining(['Afro', 'Box braids', 'Locs', 'Twists', 'Curls', 'Long and straight', 'Head wrap', 'Hijab']));
    expect(CLOTH_COLORS.length).toBeGreaterThanOrEqual(8);
  });

  it('describe the doll in words, and a surprise is always a whole doll', () => {
    expect(describeDoll({ ...FIRST_DOLL, name: 'Ada', glasses: 'round', hearing: 'aids', mobility: 'wheelchair' })).toBe(
      'Ada: a doll with skin tone 4 of 12, black hair in afro puffs, round dark brown eyes, a smile, round glasses, hearing aids, sitting in a wheelchair, a red dress.',
    );
    const r = surprise('Sam', () => 0.99);
    expect(r.name).toBe('Sam');
    expect(Object.values(r).every((v) => typeof v === 'string')).toBe(true);
    expect(shade('#808080', -1)).toBe('#000000');
    expect(shade('#808080', 1)).toBe('#ffffff');
  });
});

describe('the Doll Test', () => {
  it('tells every fact as a note with its sources, from the agreed authorities', () => {
    const allowed = /^https:\/\/(www\.)?(naacpldf\.org|loc\.gov|archives\.gov|law\.cornell\.edu)\//;
    for (const f of Object.values(DOLL_TEST_FACTS)) {
      expect(f.sources.length).toBeGreaterThan(0);
      for (const s of f.sources) expect(s.href).toMatch(allowed);
    }
    expect(DOLL_TEST_FACTS.footnote.text).toContain('footnote 11');
    expect(DOLL_TEST_FACTS.decision.text).toContain('May 17, 1954');
  });

  it('ends on poster 2’s own sentence, quoted whole', () => {
    expect(posterCopy).toContain(DOLL_TEST_TEXT.poster);
    expect(DOLL_TEST_STEPS.at(-1)!.facts).toEqual([]);
  });

  it('moves along the steps by button and by key, saying where it is', () => {
    render(<WhoDoYouSee />);
    fireEvent.click(screen.getByRole('tab', { name: 'The Doll Test' }));
    expect(window.location.hash).toBe('#doll-test');
    const panel = screen.getByRole('tabpanel', { name: 'The Doll Test' });
    expect(within(panel).getByRole('heading', { level: 2, name: 'Two psychologists' })).toBeInTheDocument();
    expect(within(panel).getByText(DOLL_TEST_FACTS.clarks.text)).toBeInTheDocument();
    expect(within(panel).getByRole('link', { name: /NAACP Legal Defense Fund/ })).toHaveAttribute('href', 'https://www.naacpldf.org/brown-vs-board/significance-doll-test/');

    fireEvent.click(within(panel).getByRole('button', { name: 'Next' }));
    expect(within(panel).getByRole('heading', { level: 2, name: 'Four dolls' })).toBeInTheDocument();
    fireEvent.keyDown(within(panel).getByRole('button', { name: '2: Four dolls' }), { key: 'End' });
    expect(within(panel).getByRole('button', { name: `${DOLL_TEST_STEPS.length}: What it teaches` })).toHaveFocus();
    expect(within(panel).getByText(DOLL_TEST_TEXT.poster)).toBeInTheDocument();
    expect(within(panel).getByText(`${DOLL_TEST_STEPS.length} of ${DOLL_TEST_STEPS.length}: What it teaches`)).toHaveAttribute('role', 'status');
  });
});

describe('the book survey', () => {
  it('uses the CCBC’s own 2025 figures, with its source', () => {
    expect(CCBC_2025).toMatchObject({ year: 2025, received: 3638, aboutBlack: 491, byBlack: 398 });
    expect(CCBC_FACT.text).toContain('3,638');
    expect(CCBC_FACT.text).toContain('491 (13.5%)');
    expect(CCBC_FACT.text).toContain('398 (10.9%)');
    expect(CCBC_FACT.sources[0].href).toMatch(/^https:\/\/ccbc\.education\.wisc\.edu\//);
  });

  it('counts, charts and keeps the tallies in this browser only', () => {
    render(<WhoDoYouSee />);
    fireEvent.click(screen.getByRole('tab', { name: 'Who’s in your books?' }));
    const panel = screen.getByRole('tabpanel', { name: 'Who’s in your books?' });
    const more = within(panel).getByRole('button', { name: 'One more: Black/African' });
    fireEvent.click(more);
    fireEvent.click(more);
    fireEvent.click(within(panel).getByRole('button', { name: 'One more: White' }));
    const tally = within(panel).getByRole('table');
    expect(within(tally).getByText('(3 counted)')).toBeInTheDocument();
    expect(within(tally).getByText('67%')).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('mm-bh-survey-v1')!).books.background).toEqual({ black: 2, white: 1 });
    expect(within(panel).getByText(CCBC_FACT.text)).toBeInTheDocument();

    // Toys have no authors to count.
    fireEvent.click(within(panel).getByRole('radio', { name: 'Toys' }));
    expect(within(panel).queryByRole('tab', { name: 'Authors' })).toBeNull();
    expect(within(within(panel).getByRole('table')).getByText('(0 counted)')).toBeInTheDocument();
    expect(SURVEY_QUESTIONS.map((q) => q.id)).toEqual(['background', 'gender', 'ability', 'authors']);
  });
});

describe('the room', () => {
  it('opens on the doll designer, and a choice changes the doll and is announced', () => {
    render(<WhoDoYouSee />);
    expect(screen.getByRole('heading', { level: 1, name: 'Who Do You See?' })).toBeInTheDocument();
    const doll = screen.getByRole('img', { name: /doll with skin tone 4 of 12/ });
    fireEvent.click(screen.getByRole('tab', { name: 'Hair' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Locs' }));
    expect(doll).toHaveAccessibleName(/black locs/);
    expect(screen.getByText(/^Hair style: Locs\./)).toHaveAttribute('role', 'status');
    // The wrap color is offered only for a covered style.
    expect(screen.queryByRole('group', { name: 'Wrap or scarf color' })).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: 'Hijab' }));
    expect(screen.getByRole('group', { name: 'Wrap or scarf color' })).toBeInTheDocument();
  });

  it('moves between the tabs by key, each with its address', () => {
    render(<WhoDoYouSee />);
    const tabs = screen.getAllByRole('tablist')[0];
    fireEvent.keyDown(within(tabs).getByRole('tab', { name: 'Design a doll' }), { key: 'End' });
    expect(within(tabs).getByRole('tab', { name: 'Who’s in your books?' })).toHaveFocus();
    expect(window.location.hash).toBe('#books');
  });

  it('has its place on the landing page, the map, the projector and the sitemap', async () => {
    const href = '/exhibitions/black-history/representation';
    expect(BLACK_HISTORY.interactives?.map((c) => c.href)).toEqual(['/exhibitions/black-history/timeline', href]);
    expect(BLACK_HISTORY.projector.links.map((l) => l.href)).toContain(href);
    expect(getRoomByPath(href)?.id).toBe('bh-representation');
    expect(getLevelConfig(href).title).toBe('Black History Month');
    const sitemap = (await import('@/app/sitemap')).default();
    expect(sitemap.map((e) => e.url)).toContainEqual(expect.stringContaining(href));
  });

  it('leaves the timeline a place for the owner’s photographs, empty until they come', () => {
    expect(OWNER_BARBIE_PHOTOS).toEqual([]);
  });
});

/*
 * Found in the room's QA pass: a hair color that did nothing under a wrap
 * or hijab, a vitiligo patch and a shaved head drawn off the face, the doll
 * described in awkward words, a print with no bars and a small doll, and
 * the focus dropped by the survey's question and the Doll Test's last step.
 */
describe('fixes from the QA pass', () => {
  it('offers hair color only where the hair shows', () => {
    render(<WhoDoYouSee />);
    fireEvent.click(screen.getByRole('tab', { name: 'Hair' }));
    expect(screen.getByRole('group', { name: 'Hair color' })).toBeInTheDocument();
    for (const covered of ['Head wrap', 'Hijab']) {
      fireEvent.click(screen.getByRole('radio', { name: covered }));
      expect(screen.queryByRole('group', { name: 'Hair color' })).toBeNull();
      expect(screen.getByRole('group', { name: 'Wrap or scarf color' })).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole('radio', { name: 'Short' }));
    expect(screen.getByRole('group', { name: 'Hair color' })).toBeInTheDocument();
  });

  it('keeps vitiligo’s patches and a shaved head inside the head’s outline', () => {
    const { container } = render(<DollPicture doll={{ ...FIRST_DOLL, hair: 'shaved', marks: 'vitiligo' }} />);
    const clip = container.querySelector('clipPath#bhr-doll-head ellipse');
    expect(clip).toHaveAttribute('rx', '58');
    const clipped = container.querySelectorAll('[clip-path="url(#bhr-doll-head)"]');
    // The shaved hair, and the face's patches (the hand's patch is not on the head).
    expect(clipped).toHaveLength(2);
    expect([...clipped].map((el) => el.tagName)).toEqual(['g', 'path']);
    expect(clipped[0].querySelectorAll('path')).toHaveLength(3);
  });

  it('shows freckles on the deepest tone and vitiligo on the lightest', () => {
    const deepest = SKIN[0].color;
    const lightest = SKIN[11].color;
    // Freckles a clear step from the skin, lighter on the deepest tones, darker on the rest.
    expect(Math.abs(lightness(freckleColor(deepest)) - lightness(deepest))).toBeGreaterThan(0.12);
    expect(lightness(freckleColor(deepest))).toBeGreaterThan(lightness(deepest));
    expect(lightness(freckleColor(lightest))).toBeLessThan(lightness(lightest) - 0.12);
    // On the lightest tone the patch is near white with a rim; on the deepest the rim isn't needed.
    expect(lightness(vitiligoPatch(lightest)) - lightness(lightest)).toBeGreaterThan(0.08);
    expect(vitiligoEdge(lightest)).not.toBe('none');
    expect(vitiligoEdge(deepest)).toBe('none');
    const { container } = render(<DollPicture doll={{ ...FIRST_DOLL, skin: SKIN[0].id, marks: 'both' }} />);
    expect(container.querySelector(`g[fill="${freckleColor(deepest)}"]`)?.querySelectorAll('circle')).toHaveLength(8);
  });

  it('sets each choice on one line on a phone, so a group shows whole', () => {
    const css = readFileSync(join(process.cwd(), 'app/exhibitions/black-history/representation/representation.css'), 'utf8');
    const phone = css.slice(css.indexOf('/* ───────── On a phone ───────── */'));
    expect(phone).toMatch(/\.bhr-field \{ display: grid; grid-template-columns: 58px minmax\(0, 1fr\)/);
    expect(phone).toMatch(/\.bhr-field legend \{ float: left;/);
  });

  it('describes the doll in words that read', () => {
    const d = describeDoll({ ...FIRST_DOLL, hair: 'straight', hairColor: 'blond', mouth: 'calm', outfit: 'overalls', clothes: 'green' });
    expect(d).toContain('long, straight blond hair');
    expect(d).toContain('a calm mouth');
    expect(d).toContain(', green overalls.');
    expect(describeDoll({ ...FIRST_DOLL, hair: 'afro' })).toContain('a black afro');
    expect(describeDoll({ ...FIRST_DOLL, hair: 'hijab', fabric: 'pink' })).toContain('a pink hijab');
  });

  it('prints the survey’s bars, and the doll at its full size', () => {
    const css = readFileSync(join(process.cwd(), 'app/exhibitions/black-history/representation/representation.css'), 'utf8');
    const print = css.slice(css.indexOf('@media print'));
    expect(print).toMatch(/\.bhr-print \.bhr-bar-fill \{[^}]*print-color-adjust: exact/);
    expect(print).toMatch(/\.bhr-room\[data-tab='design'\] \.bhr-doll \{[^}]*height: 9in;[^}]*max-height: none;/);
  });

  it('takes the focus into the survey’s question and back out again', async () => {
    render(<WhoDoYouSee />);
    fireEvent.click(screen.getByRole('tab', { name: 'Who’s in your books?' }));
    const panel = screen.getByRole('tabpanel', { name: 'Who’s in your books?' });
    fireEvent.click(within(panel).getByRole('button', { name: 'One more: Asian' }));
    fireEvent.click(within(panel).getByRole('button', { name: 'Start again' }));
    expect(within(panel).getByText('Clear every count for books?')).toBeInTheDocument();
    await waitFor(() => expect(within(panel).getByRole('button', { name: 'No' })).toHaveFocus());
    fireEvent.click(within(panel).getByRole('button', { name: 'No' }));
    await waitFor(() => expect(within(panel).getByRole('button', { name: 'Start again' })).toHaveFocus());
    fireEvent.click(within(panel).getByRole('button', { name: 'Start again' }));
    fireEvent.click(within(panel).getByRole('button', { name: 'Yes' }));
    await waitFor(() => expect(within(panel).getByRole('button', { name: 'Start again' })).toHaveFocus());
    expect(within(panel).getByText('Every count for books is cleared.')).toHaveAttribute('role', 'status');
  });

  it('hands the focus to the last step as Next goes dim, and only the step shown is in the tab order', () => {
    render(<WhoDoYouSee />);
    fireEvent.click(screen.getByRole('tab', { name: 'The Doll Test' }));
    const panel = screen.getByRole('tabpanel', { name: 'The Doll Test' });
    const next = within(panel).getByRole('button', { name: 'Next' });
    for (let n = 1; n < DOLL_TEST_STEPS.length; n++) fireEvent.click(next);
    expect(next).toBeDisabled();
    const lastStep = within(panel).getByRole('button', { name: `${DOLL_TEST_STEPS.length}: What it teaches` });
    expect(lastStep).toHaveFocus();
    expect(lastStep).toHaveAttribute('tabindex', '0');
    expect(within(panel).getByRole('button', { name: '1: Two psychologists' })).toHaveAttribute('tabindex', '-1');
  });
});
