import { fireEvent, render, screen, within } from '@testing-library/react';
import { poster1Content, poster2Content } from '@/app/exhibitions/in-their-hands/posters';
import { CASE_NOTES } from '@/app/exhibitions/in-their-hands/notes';
import Case6 from '@/app/exhibitions/in-their-hands/artifacts/case-6/page';
import Case7 from '@/app/exhibitions/in-their-hands/artifacts/case-7/page';
import Case8 from '@/app/exhibitions/in-their-hands/artifacts/case-8/page';
import { ITH_TALK } from '@/components/projector/posterTalk';
import { FLOORS } from '@/lib/floors';

/*
 * In Their Hands for every visitor (owner-approved, proposals B8.1–B8.3): the
 * subtitle, the poster lines that now describe a faith rather than speak from
 * inside it, the corrected timeline date, and the museum notes under each
 * case, each with its sources.
 */

const texts = [...poster1Content, ...poster2Content].map((it) => [it.text ?? '', ...(it.items ?? [])].join('\n')).join('\n');

describe('In Their Hands, for everyone', () => {
  it('names the exhibition Coins of Roman Judaea on its floor card', () => {
    const card = FLOORS.flatMap((f) => f.exhibitions).find((e) => e.slug === 'in-their-hands');
    expect(card?.subtitle).toBe('Coins of Roman Judaea');
  });

  it('sets the approved poster lines, and the replaced wording is gone', () => {
    expect(texts).toContain("The relationship between scholarship and the Catholic Church is not mere coincidence. The Church's Catechism states the conviction plainly: faith and reason are not enemies. They are partners in the same search for truth.");
    expect(texts).toContain('For Jewish and Christian readers who had always trusted the transmission of Scripture, this was a confirmation. For historians of every belief, it was a rare chance to measure how carefully an ancient text had been copied.');
    expect(texts).toContain('Scholars of every tradition, religious and secular, have been asking it for centuries');
    expect(texts).toContain('as, many scholars think, deliberate acts of provocation');
    expect(texts).toContain('but most scholars identify it as Tyrian shekels');
    expect(texts).toContain('Before the Story — 126 BC — Tyrian shekel minting begins at Tyre.');
    expect(texts).not.toMatch(/Catholic partnership|near-unanimous|63 BC|The Catholic tradition has been asking/);
    expect(ITH_TALK.poster1['The Dead Sea Scrolls']).toMatch(/read these texts as Scripture, and why would it matter to historians\?$/);
  });

  it('gives every museum note a title, its words and at least one linked source', () => {
    const notes = Object.values(CASE_NOTES).flatMap((g) => g.notes);
    expect(notes).toHaveLength(7);
    for (const n of notes) {
      expect(n.title).toBeTruthy();
      expect(n.text).toMatch(/[.”]$/);
      expect(n.sources.length).toBeGreaterThan(0);
      for (const s of n.sources) expect(s.href).toMatch(/^https?:\/\//);
    }
    // The Mishnah's date is cited, not left bare.
    const half = notes.find((n) => n.id === 'the-half-shekel')!;
    expect(half.text).toContain('compiled around AD 200');
    expect(half.sources.map((s) => s.href)).toContain('https://www.sefaria.org/texts/Mishnah');
  });

  it.each([
    [6, Case6, 'How we know', ['Four kinds of witness']],
    [7, Case7, 'Beside the coins', ['Coins of a Jewish kingdom', 'The half-shekel and the money of Tyre']],
    [8, Case8, 'What came next', ['Shekels of a free Jerusalem, AD 66–70', 'Judaea Capta: Rome’s answer, AD 71', 'After the Temple: the half-shekel goes to Rome', 'Bar Kokhba: the last revolt, AD 132–135']],
  ] as const)('Case %i sets its notes under the coins, their sources behind the page\'s "i"', (_n, Page, heading, titles) => {
    render(<Page />);
    const section = screen.getByRole('region', { name: heading });
    expect(within(section).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(titles);
    expect(section.querySelector('.cl-note-source')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Sources and credits' }));
    const drawer = within(screen.getByRole('dialog', { name: 'Sources and credits' }));
    for (const title of titles) {
      const links = within(drawer.getByRole('list', { name: title })).getAllByRole('link');
      for (const a of links) expect(a).toHaveAttribute('target', '_blank');
    }
  });
});
