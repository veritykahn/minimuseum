import { artifactPath, plainText, recordLines } from '@/components/exhibition/artifacts';
import fs from 'fs';
import path from 'path';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import PosterExhibition from '@/components/exhibition/PosterExhibition';
import WritingRevolutionCase from '@/app/exhibitions/writing-revolution/artifacts/case/page';
import { posterChapters } from '@/components/projector/posterTalk';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';
import { AMERICAN_WRITERS_MUSEUM_URL, WRITING_REVOLUTION, WRITING_REVOLUTION_CASE } from '@/app/exhibitions/writing-revolution/writingRevolution';
import { floorReturnFor } from '@/lib/floors';

/*
 * The Writing Revolution: its config, the poster copy against the
 * transcription (with only the owner's approved decisions), the pictures (the
 * owner's own Urania photograph and the posters' own lettering; never the
 * installation), the link out, the walkthrough, the display case page
 * (photographs to come), and the map.
 */

const poster = (id: string) => WRITING_REVOLUTION.posters.find((p) => p.id === id)!;
const allItems = WRITING_REVOLUTION.posters.flatMap((p) => p.items);
/** A poster's copy in order: its section titles and paragraphs. */
const copy = (id: string) =>
  poster(id).items.flatMap((it) => (it.type === 'paragraph' || it.type === 'section-title' ? [it.text] : []));
const allText = allItems.map((it) => ('text' in it && it.text ? it.text : '')).join('\n');
const tick = (ms = 400) => act(() => { jest.advanceTimersByTime(ms); });

/** Poster 1's copy exactly as printed, from the transcription. */
const PRINTED_WR1 = `For thousands of years, writing was a privilege reserved for scribes, monks, and the wealthy elite. This exclusivity shattered with each technological leap. The printing press, invented by Johannes Gutenberg around 1440, was the first great equalizer—suddenly, books cost 1/30th of their previous price, sparking mass literacy movements across Europe. But true democratization began with the typewriter. In 1868, Christopher Latham Sholes patented the first practical typewriter, giving ordinary citizens the power to create professional documents. Women especially embraced this technology, flooding into offices as typists and gaining economic independence previously denied to them. The computer age obliterated remaining barriers. Early word processors in the 1970s meant anyone could edit and perfect their writing without costly reprints. Desktop publishing software like PageMaker (1985) ended publishers' monopoly—suddenly, anyone could design newsletters, magazines, or books from their home. The internet completed this revolution: Blogger (1999) let millions publish their thoughts free, Wikipedia (2001) proved that collective amateur writers could rival encyclopedias, and social media transformed every phone owner into a publisher with potential global reach. Self-publishing platforms like Amazon's CreateSpace meant authors no longer needed agents or publishing houses to reach readers. This democratization has profound implications. In 1900, only major newspapers and publishers could spread ideas widely; today, a tweet from a teenager can influence millions. Yet this power brings new challenges: information overload, the spread of misinformation, and algorithms that decide what writing gets seen. At the same time we are also discovering surprising truths: while we read faster on screens, we remember more from printed pages, and handwriting activates different parts of our brain than typing, aiding memory and creativity.As AI writing tools emerge, we face the ultimate democratization—what happens when anyone can generate professional-quality text instantly? The writing revolution's greatest achievement isn't just making everyone a potential writer, but proving that important ideas can come from anywhere, not just ivory towers and newsrooms. Every new technology has chipped away at the gates that once kept most voices silent.`;
/** Poster 2's copy exactly as printed, from the transcription. */
const PRINTED_WR2 = `The keyboard beneath your fingers holds a 150-year-old secret. In 1868, Christopher Latham Sholes, a Milwaukee newspaper editor, was perfecting his "Type-Writer" machine when he encountered a frustrating problem: when typists worked too quickly, the metal arms carrying the letters would jam together. His solution was ingenious—he analyzed letter frequency in the English language and separated commonly paired letters like "TH" and "HE" across the keyboard. This seemingly random arrangement, which placed "QWERTY" across the top row, actually prevented mechanical collisions. Contrary to popular myth, Sholes didn't design QWERTY to slow typists down—he designed it to let them type as fast as possible without breaking the machine. By the time electric typewriters eliminated the jamming problem, QWERTY had already conquered the world. Millions had trained their muscle memory on this layout, and entire industries depended on it. Challengers emerged: August Dvorak created a scientifically "superior" keyboard in 1936 that placed the most common letters on the home row, claiming it could increase typing speed by 74%. The U.S. Navy tested it during World War II and found dramatic improvements. Yet QWERTY survived every assault. The reason was economic, not ergonomic—businesses couldn't afford to retrain workers and replace equipment, creating a "lock-in" effect economists now study as a prime example of how inferior technologies can dominate markets through sheer momentum. Today, QWERTY's persistence reveals profound truths about human behavior and technology adoption. In our age of touchscreens and voice recognition, we still arrange virtual keyboards in Sholes' pattern—even though there are no physical keys to jam. Studies show that while QWERTY forces our fingers to travel 50% more distance than necessary, the cost of change outweighs the benefits. This layout has literally shaped our language: "typewriter" remains one of the longest words you can type using only the top row, while the bottom row can barely form any words at all. As we enter the era of gesture typing and predictive text, QWERTY endures as a reminder that the best technology doesn't always win—sometimes, being first and "good enough" conquers all.`;

/** Applies a replacement that must match exactly once, so a fix that silently matches nothing fails. */
function fix(text: string, from: string, to: string) {
  expect(text.split(from)).toHaveLength(2);
  return text.replace(from, to);
}

describe('The Writing Revolution', () => {
  it('has two posters, each opening on its own lettering and ending with Return to Exhibition, and one display case', () => {
    expect(WRITING_REVOLUTION.slug).toBe('writing-revolution');
    expect(WRITING_REVOLUTION.name).toBe('The Writing Revolution');
    expect(WRITING_REVOLUTION.subtitle).toBe('From Movable Type to the Digital Age');
    expect(WRITING_REVOLUTION.posters.map((p) => p.id)).toEqual(['poster1', 'poster2']);
    expect(WRITING_REVOLUTION.posters.map((p) => p.title)).toEqual(['The Writing Revolution', "QWERTY's Accidental Empire"]);
    for (const p of WRITING_REVOLUTION.posters) {
      expect(p.items[0]).toMatchObject({ type: 'title-image', alt: p.title });
      expect(p.items[p.items.length - 1].type).toBe('end');
      expect(p.hero.alt).toBeTruthy();
      expect(fs.existsSync(path.join(process.cwd(), 'public', p.hero.src))).toBe(true);
    }
    expect(WRITING_REVOLUTION.cases).toHaveLength(1);
    expect(WRITING_REVOLUTION.cases?.[0].href).toBe('/exhibitions/writing-revolution/artifacts/case');
    expect(WRITING_REVOLUTION.fx.theme).toBe('wr');
  });

  it('goes back to the second floor, as its second Reflections room', () => {
    expect(WRITING_REVOLUTION.back).toEqual(floorReturnFor('writing-revolution'));
    expect(WRITING_REVOLUTION.back).toEqual({ href: '/exhibitions/second-floor', label: 'Second Floor', remember: { key: 'secondFloorIndex', value: '1' } });
  });

  it('sets poster 1 exactly as printed, with only the approved fix (decision 1) and the missing space', () => {
    let expected = fix(PRINTED_WR1, 'books cost 1/30th of their previous price', 'books cost a fraction of their previous price');
    expected = fix(expected, 'creativity.As AI', 'creativity. As AI');
    expect(copy('poster1').join(' ')).toBe(expected);
  });

  it('sets poster 2 exactly as printed, with only the approved fixes (decisions 2, 3 and 4)', () => {
    let expected = fix(
      PRINTED_WR2,
      'The U.S. Navy tested it during World War II and found dramatic improvements.',
      'The U.S. Navy tested it during World War II and reported dramatic improvements, though the study was overseen by Dvorak himself and a 1956 government study found no real advantage.',
    );
    expected = fix(expected, 'His solution was ingenious—he analyzed', 'His solution, in the best-known account, was ingenious—he analyzed');
    expected = fix(
      expected,
      'Studies show that while QWERTY forces our fingers to travel 50% more distance than necessary, the cost of change outweighs the benefits.',
      'Studies suggest that while QWERTY makes our fingers travel farther than necessary, the cost of change outweighs the benefits.',
    );
    expect(copy('poster2').join(' ')).toBe(expected);
  });

  it('applies the approved decisions, and the replaced wording is gone', () => {
    expect(allText).not.toMatch(/1\/30th|found dramatic improvements|Studies show|50% more distance|forces our fingers|creativity\.As/);
    expect(allText).toContain('His solution, in the best-known account, was ingenious');
    expect(allText).not.toMatch(/Scan|QR code|Writer's Museum/i);
    expect(allText).not.toMatch(/ {2}/);
  });

  it('splits paragraphs only between sentences', () => {
    for (const it of allItems) if (it.type === 'paragraph' || it.type === 'section-title') expect(it.text).toMatch(/[.!?]"?$/);
  });

  it.each(WRITING_REVOLUTION.posters.map((p) => [p.id, p] as const))('%s: one open question per chapter, and none left over', (_id, p) => {
    const chapters = posterChapters(p.items.map((it) => ({ type: it.type, text: 'text' in it ? it.text : undefined })), p.title);
    expect(chapters.length).toBeGreaterThan(0);
    expect(Object.keys(p.talk).sort()).toEqual(chapters.map((c) => c.key).sort());
    for (const c of chapters) expect(p.talk[c.key]).toMatch(/\?$/);
  });

  describe('the pictures (approved decision 6)', () => {
    const dir = path.join(process.cwd(), 'public/exhibitions/writing-revolution');
    const files = (d: string): string[] =>
      fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(path.join(d, e.name)).map((f) => `${e.name}/${f}`) : [e.name]));

    it('holds only the posters, their lettering and the Urania cut out of poster 2', () => {
      expect(files(dir).sort()).toEqual([
        'poster1.jpg',
        'poster2.jpg',
        'titles/qwertys-accidental-empire.png',
        'titles/writing-revolution.png',
        'urania.webp',
      ]);
    });

    it('sets the Urania beside the poster 2 opening, described, and uses no photograph of the installation', () => {
      const figure = poster('poster2').items.flatMap((it) => (it.type === 'paragraph' && it.figure ? [it.figure] : []));
      expect(figure).toHaveLength(1);
      expect(figure[0].src).toBe('/exhibitions/writing-revolution/urania.webp');
      expect(figure[0].alt).toMatch(/Urania/);
      const json = JSON.stringify([WRITING_REVOLUTION, WRITING_REVOLUTION_CASE]);
      expect(json).not.toMatch(/writing\d?\.jpg|images\/mm\/|installation/);
      expect(WRITING_REVOLUTION.cases?.[0].image).toBeUndefined();
      expect(WRITING_REVOLUTION_CASE.photos).toEqual([]);
    });
  });

  it('links the admission ticket to the American Writers Museum (approved decision 5)', () => {
    const callouts = allItems.flatMap((it) => (it.type === 'callout' ? [{ text: it.text, url: it.url }] : []));
    expect(callouts).toEqual([{ text: 'Visit the American Writers Museum', url: AMERICAN_WRITERS_MUSEUM_URL }]);
    expect(AMERICAN_WRITERS_MUSEUM_URL).toBe('https://americanwritersmuseum.org/');
  });

  describe('the walkthrough', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      window.history.replaceState(null, '', '/');
    });
    afterEach(() => jest.useRealTimers());

    it('shows the posters and the display case on the landing page', () => {
      render(<PosterExhibition config={WRITING_REVOLUTION} />);
      expect(screen.getByRole('heading', { level: 1, name: 'The Writing Revolution' })).toBeInTheDocument();
      const caseLink = screen.getByRole('link', { name: /display case/i });
      expect(caseLink).toHaveAttribute('href', '/exhibitions/writing-revolution/artifacts/case');
      expect(caseLink).toHaveTextContent('Display case — photographs to come');
      expect(screen.getByRole('link', { name: 'Second Floor' })).toHaveAttribute('href', '/exhibitions/second-floor');
    });

    it('opens The Writing Revolution on its lettering, types its first lines, and ends with the link to the museum', () => {
      render(<PosterExhibition config={WRITING_REVOLUTION} />);
      fireEvent.click(screen.getByRole('button', { name: /^The Writing Revolution poster/ }));
      tick();
      const content = () => document.querySelector('.pe-walkthrough-content') as HTMLElement;
      expect(within(content()).getByRole('heading', { level: 2, name: 'The Writing Revolution' })).toBeInTheDocument();
      expect(document.querySelector('.pe-atmo-colorblock-split')).toHaveAttribute('aria-hidden', 'true');

      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      expect((document.querySelector('.pe-poster-walkthrough') as HTMLElement).dataset.entrance).toBe('typewriter');
      expect(content().querySelector('.visually-hidden')).toHaveTextContent(copy('poster1')[0]);

      const callout = poster('poster1').items.findIndex((it) => it.type === 'callout');
      for (let i = 1; i < callout; i++) {
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        tick();
      }
      expect(within(content()).getByRole('link', { name: /Visit the American Writers Museum/ })).toHaveAttribute('href', AMERICAN_WRITERS_MUSEUM_URL);
    });

    it("opens QWERTY's Accidental Empire on its lettering, then the Urania", () => {
      render(<PosterExhibition config={WRITING_REVOLUTION} />);
      fireEvent.click(screen.getByRole('button', { name: /^QWERTY's Accidental Empire poster/ }));
      tick();
      const content = () => document.querySelector('.pe-walkthrough-content') as HTMLElement;
      expect(within(content()).getByRole('heading', { level: 2, name: "QWERTY's Accidental Empire" })).toBeInTheDocument();
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      expect(within(content()).getByRole('img', { name: /Urania portable typewriter/ })).toHaveAttribute('src', '/exhibitions/writing-revolution/urania.webp');
    });
  });
});

describe('The Writing Revolution display case page', () => {
  it('keeps the record, with a card for each artifact, beside an empty case awaiting its photographs', () => {
    render(<WritingRevolutionCase />);
    expect(screen.getByRole('heading', { level: 1, name: 'The Writing Revolution' })).toBeInTheDocument();
    expect(recordLines(WRITING_REVOLUTION_CASE).map(plainText)).toEqual([
      'Portable Smith-Corona Galaxie typewriter with original carrying case',
      'Functional Apple iMac G3 running AppleWorks software',
      'Interactive dual-typing station comparing mechanical and digital writing workflows',
    ]);
    const cards = screen.getAllByRole('link', { name: /View artifact/ });
    expect(cards.map((c) => c.getAttribute('href'))).toEqual([
      '/exhibitions/writing-revolution/artifacts/case/smith-corona-galaxie',
      '/exhibitions/writing-revolution/artifacts/case/imac-g3',
    ]);
    expect(cards.map((c) => c.getAttribute('href'))).toEqual(WRITING_REVOLUTION_CASE.artifacts.map((a) => artifactPath({ slug: WRITING_REVOLUTION.slug }, a)));
    expect(screen.getByRole('heading', { level: 2, name: 'In the display' })).toBeInTheDocument();
    for (const a of WRITING_REVOLUTION_CASE.artifacts) expect(a.writing).toBeUndefined();
    expect(WRITING_REVOLUTION_CASE.photos).toHaveLength(0);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
    expect(screen.getByText('Display case — photographs to come')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to Exhibition' })).toHaveAttribute('href', '/exhibitions/writing-revolution');
  });
});

describe('The Writing Revolution on the museum map', () => {
  it('is a room on the Second Floor, with an Exhibition Hall, a Display Case and its interactive room', () => {
    const level = getLevelConfig('/exhibitions/writing-revolution/artifacts/case');
    expect(level.title).toBe('The Writing Revolution');
    expect(level.backTarget?.path).toBe('/exhibitions/second-floor');
    expect(level.floorPlan?.rooms.map((r) => [r.label, r.path])).toEqual([
      ['Exhibition Hall', '/exhibitions/writing-revolution'],
      ['Display Case', '/exhibitions/writing-revolution/artifacts/case'],
      ['The Typing Station', '/exhibitions/writing-revolution/typing-station'],
    ]);
    expect(getRoomByPath('/exhibitions/writing-revolution')?.parent).toBe('second-floor');
    expect(getRoomByPath('/exhibitions/writing-revolution/artifacts/case')?.parent).toBe('writing-revolution');
    const room = getLevelConfig('/exhibitions/second-floor').rooms.find((r) => r.id === 'writing-revolution')!;
    expect(room.comingSoon).toBeFalsy();
    expect(room.path).toBe('/exhibitions/writing-revolution');
  });
});
