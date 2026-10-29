import { fireEvent, render, screen, within } from '@testing-library/react';
import WhoDoYouSee from '@/app/exhibitions/black-history/representation/page';
import { CCBC_2025, CCBC_FACT, DOLL_TEST_FACTS, DOLL_TEST_STEPS, DOLL_TEST_TEXT, SURVEY_QUESTIONS } from '@/app/exhibitions/black-history/representation/representationText';
import { CLOTH_COLORS, FIRST_DOLL, HAIR_STYLES, SKIN, describe as describeDoll, shade, surprise } from '@/app/exhibitions/black-history/representation/dollOptions';
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
    expect(doll).toHaveAccessibleName(/black hair in locs/);
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
