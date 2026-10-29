import { artifactPath, plainText, recordLines } from '@/components/exhibition/artifacts';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import PosterExhibition from '@/components/exhibition/PosterExhibition';
import VictorianCase from '@/app/exhibitions/victorian/artifacts/case/page';
import { posterChapters } from '@/components/projector/posterTalk';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';
import {
  VA_COURT_DRESS_CREDIT,
  VA_COURT_DRESS_SOURCE,
  VA_HISTORY_URL,
  VA_REFRESHMENT_ROOM_CREDIT,
  VA_REFRESHMENT_ROOM_SOURCE,
  VICTORIAN,
  VICTORIAN_CASE,
} from '@/app/exhibitions/victorian/victorian';
import { floorReturnFor } from '@/lib/floors';

/*
 * Victorian Britain: its config, the poster copy against the transcription
 * (with only the owner's approved fixes), the V&A credits, the walkthrough
 * with its torn-paper reveal, the display case page, and the map.
 */

const poster = (id: string) => VICTORIAN.posters.find((p) => p.id === id)!;
const allItems = VICTORIAN.posters.flatMap((p) => p.items);
/** The copy as read: "*…*" marks italics and is not part of the words. */
const plain = (t: string) => t.replace(/\*/g, '');
const paragraphs = (id: string) => poster(id).items.flatMap((it) => (it.type === 'paragraph' ? [plain(it.text)] : []));
const allText = allItems.map((it) => ('text' in it && it.text ? plain(it.text) : '')).join('\n');
const tick = (ms = 400) => act(() => { jest.advanceTimersByTime(ms); });

/** Poster 1's copy exactly as printed, from the transcription: the lede, then the paragraph. */
const PRINTED_1 = 'Victorian Britain was a time of innovation, fashion, culture, and the birth of one of the most iconic museums in the world today! The Victorian era in Britain lasted from 1837 to 1901, during the reign of Queen Victoria. This period saw rapid industrial growth, transforming the nation into a global superpower with an expanding empire. Iconic innovations like railways, the telegraph, and photography emerged, alongside cultural achievements in literature and art. The Victoria and Albert Museum (V&A) was founded in 1852 as a hallmark of this age, showcasing decorative arts and design to inspire creativity and educate the public. Social reform improved conditions for workers, while class divisions and urban challenges persisted. The legacy of Victorian Britain is still evident in its architecture, inventions, and global influence.';
/** Poster 2's copy exactly as printed, from the transcription. */
const PRINTED_2 = "In the 19th century, Christmas traditions were in decline, impacted by Puritan opposition to pagan roots and the Industrial Revolution, which left workers little time for celebration. The holiday's revival gained momentum under Queen Victoria and Prince Albert, who introduced German customs like the Christmas tree, while the first Christmas cards appeared in the 1840s. However it was Charles Dickens' A Christmas Carol (1843) that truly gave us the Christmas we know today. Dickens may not have invented Christmas but he certainly reinvented it. A Christmas Carol emphasized kindness, charity, and community through Scrooge's transformation. Dickens' \"Carol Philosophy\" celebrated the holiday as a time to open hearts and embrace humanity, a message still resonating nearly 200 years later. Dickens' influence shaped modern Christmas celebrations more profoundly than almost anyone else.";

/** Applies a replacement that must match exactly once, so a fix that silently matches nothing fails. */
function fix(text: string, from: string, to: string) {
  expect(text.split(from)).toHaveLength(2);
  return text.replace(from, to);
}

/** The owner's approved fixes to poster 2's copy, and nothing else. */
function approved2() {
  // 3. the lingering effects of Puritan opposition
  let t = fix(
    PRINTED_2,
    'impacted by Puritan opposition to pagan roots and the Industrial Revolution',
    'impacted by the lingering effects of Puritan opposition to its pagan roots and the Industrial Revolution',
  );
  // 1. popularized, not introduced
  t = fix(t, 'who introduced German customs like the Christmas tree', 'who popularized German customs like the Christmas tree');
  return t;
}

describe('Victorian Britain', () => {
  it('has two posters, each opening on its title and ending with Return to Exhibition, and one display case', () => {
    expect(VICTORIAN.slug).toBe('victorian');
    expect(VICTORIAN.name).toBe('Victorian Britain');
    expect(VICTORIAN.subtitle).toBe('Material & Domestic Life');
    expect(VICTORIAN.posters.map((p) => p.id)).toEqual(['poster1', 'poster2']);
    expect(VICTORIAN.posters.map((p) => p.title)).toEqual([
      'Revolutionary Victorian Britain',
      'Charles Dickens, Victorian Britain and the Invention of How We Celebrate Christmas',
    ]);
    for (const p of VICTORIAN.posters) {
      expect(p.items[0].type).toBe('title-image');
      expect(p.items[p.items.length - 1].type).toBe('end');
      expect(p.hero.alt).toBeTruthy();
    }
    expect(VICTORIAN.cases).toHaveLength(1);
    expect(VICTORIAN.cases?.[0].href).toBe('/exhibitions/victorian/artifacts/case');
    expect(VICTORIAN.cases?.[0].image).toBeUndefined(); // photographs to come
    expect(VICTORIAN.fx.theme).toBe('vb');
  });

  it('sets the titles as the posters do', () => {
    const titles = VICTORIAN.posters.map((p) => (p.items[0].type === 'title-image' ? p.items[0].alt : ''));
    expect(titles).toEqual(VICTORIAN.posters.map((p) => p.title));
  });

  it('goes back to the ground floor, as its fifth Origins room', () => {
    expect(VICTORIAN.back).toEqual(floorReturnFor('victorian'));
    expect(VICTORIAN.back).toEqual({ href: '/exhibitions/ground-floor', label: 'Ground Floor', remember: { key: 'groundFloorIndex', value: '4' } });
  });

  it('sets poster 1 exactly as printed', () => {
    expect(paragraphs('poster1').join(' ')).toBe(PRINTED_1);
  });

  it('sets poster 2 exactly as printed, with only the approved fixes', () => {
    expect(paragraphs('poster2').join(' ')).toBe(approved2());
  });

  it('sets the Dickens quote as printed, with the approved credit', () => {
    const quotes = allItems.flatMap((it) => (it.type === 'quote' ? [{ text: it.text, cite: it.cite }] : []));
    expect(quotes).toEqual([
      {
        text: '"Christmas was dead, to begin with. There is no doubt whatever about that."',
        cite: "After Charles Dickens, *A Christmas Carol* (1843): 'Marley was dead: to begin with.'",
      },
    ]);
  });

  it('applies the approved fixes, and the replaced wording is gone', () => {
    expect(allText).toContain('who popularized German customs like the Christmas tree');
    expect(allText).toContain('impacted by the lingering effects of Puritan opposition to its pagan roots and the Industrial Revolution');
    expect(allText).not.toMatch(/introduced German customs/);
    expect(allText).not.toMatch(/impacted by Puritan opposition|opposition to pagan roots/);
    // "Dickens'" stays as printed.
    expect(allText).toContain("Charles Dickens' A Christmas Carol (1843)");
    expect(allText).toContain("Dickens' \"Carol Philosophy\"");
    expect(allText).toContain("Dickens' influence shaped");
    expect(allText).not.toMatch(/ {2}/);
  });

  it('sets A Christmas Carol in italics wherever it is named', () => {
    const copy = allItems.map((it) => ('text' in it && it.text ? it.text : '') + (it.type === 'quote' ? ` ${it.cite}` : '')).join('\n');
    expect(copy.match(/A Christmas Carol/g)).toHaveLength(3);
    expect(copy.match(/\*A Christmas Carol\*/g)).toHaveLength(3);
  });

  it('splits paragraphs only between sentences', () => {
    for (const it of allItems) if (it.type === 'paragraph') expect(plain(it.text)).toMatch(/[.!?]"?$/);
  });

  it('uses US spellings', () => {
    expect(allText).toMatch(/emphasized/);
    expect(allText).toMatch(/popularized/);
    expect(allText).not.toMatch(/colour|honour|recognise|emphasised|popularised|centre\b/);
  });

  it.each(VICTORIAN.posters.map((p) => [p.id, p] as const))('%s: one open question per chapter, and none left over', (_id, p) => {
    const chapters = posterChapters(p.items.map((it) => ({ type: it.type, text: 'text' in it ? it.text : undefined })), p.title);
    expect(chapters.length).toBeGreaterThan(0);
    expect(Object.keys(p.talk).sort()).toEqual(chapters.map((c) => c.key).sort());
    for (const c of chapters) expect(p.talk[c.key]).toMatch(/\?$/);
  });

  it('credits the V&A photographs as the V&A specifies, linked to their records, and leaves out the unmatched ceiling', () => {
    expect(VA_COURT_DRESS_CREDIT).toMatch(/© Victoria and Albert Museum, London$/);
    expect(VA_COURT_DRESS_CREDIT).toContain('T.329 to B, AA-1977');
    expect(VA_COURT_DRESS_SOURCE).toBe('https://collections.vam.ac.uk/item/O74557/');
    expect(VA_REFRESHMENT_ROOM_CREDIT).toMatch(/© Victoria and Albert Museum, London$/);
    expect(VA_REFRESHMENT_ROOM_CREDIT).toContain('E.655-2009');
    expect(VA_REFRESHMENT_ROOM_SOURCE).toBe('https://collections.vam.ac.uk/item/O1160016/');

    const pictures = allItems.flatMap((it) => {
      if (it.type === 'full-image') return [{ src: it.src, alt: it.alt, credit: it.text, href: it.href }];
      if (it.type === 'paragraph' && it.figure) return [{ src: it.figure.src, alt: it.figure.alt, credit: it.figure.credit?.text, href: it.figure.credit?.href }];
      return [];
    });
    expect(pictures.map((p) => p.src)).toEqual([
      '/exhibitions/victorian/va-court-dress.jpg',
      '/exhibitions/victorian/va-refreshment-room.jpg',
      '/exhibitions/victorian/village.jpg',
    ]);
    for (const pic of pictures) {
      expect(pic.alt).toBeTruthy();
      if (pic.src.includes('/va-court-dress')) expect(pic).toMatchObject({ credit: VA_COURT_DRESS_CREDIT, href: VA_COURT_DRESS_SOURCE });
      if (pic.src.includes('/va-refreshment-room')) expect(pic).toMatchObject({ credit: VA_REFRESHMENT_ROOM_CREDIT, href: VA_REFRESHMENT_ROOM_SOURCE });
    }
    expect(pictures.some((p) => /ceiling/.test(p.src))).toBe(false);
    // The photograph washed in behind the posters is credited on the landing page.
    expect(VICTORIAN.credits).toEqual([{ text: VA_REFRESHMENT_ROOM_CREDIT, href: VA_REFRESHMENT_ROOM_SOURCE }]);
  });

  it('links the QR code to the V&A’s history of the museum', () => {
    const callouts = allItems.flatMap((it) => (it.type === 'callout' ? [{ text: it.text, url: it.url }] : []));
    expect(callouts).toEqual([{ text: 'Learn more about the story of the V&A', url: VA_HISTORY_URL }]);
    expect(VA_HISTORY_URL).toMatch(/^https:\/\/www\.vam\.ac\.uk\//);
  });

  describe('the walkthrough', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      window.history.replaceState(null, '', '/');
    });
    afterEach(() => jest.useRealTimers());

    it('shows the posters, the display case and the picture credit on the landing page', () => {
      render(<PosterExhibition config={VICTORIAN} />);
      expect(screen.getByRole('heading', { level: 1, name: 'Victorian Britain' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /display case/i })).toHaveAttribute('href', '/exhibitions/victorian/artifacts/case');
      expect(screen.getByRole('link', { name: 'Ground Floor' })).toHaveAttribute('href', '/exhibitions/ground-floor');
      const credits = screen.getByRole('list', { name: 'Picture credits' });
      const credit = within(credits).getByRole('link');
      expect(credit).toHaveAttribute('href', VA_REFRESHMENT_ROOM_SOURCE);
      expect(credit.querySelector('em')).toHaveTextContent('The Centre Refreshment Room, opened 1868.');
    });

    it('opens Revolutionary Victorian Britain with the page torn open, and credits the court dress', () => {
      render(<PosterExhibition config={VICTORIAN} />);
      fireEvent.click(screen.getByRole('button', { name: /Revolutionary Victorian Britain poster/ }));
      tick();
      const content = () => document.querySelector('.pe-walkthrough-content') as HTMLElement;
      expect(within(content()).getByRole('heading', { level: 2 })).toHaveTextContent(/^Revolutionary\s*Victorian Britain$/);
      expect(content().querySelector('.pfx-vb-tear')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      const credit = content().querySelector('.pe-figure-credit a') as HTMLElement;
      expect(credit).toHaveTextContent(VA_COURT_DRESS_CREDIT);
      expect(credit).toHaveAttribute('href', VA_COURT_DRESS_SOURCE);

      const callout = poster('poster1').items.findIndex((it) => it.type === 'callout');
      for (let i = 1; i < callout; i++) {
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        tick();
      }
      expect(within(content()).getByRole('link', { name: /Learn more about the story of the V&A/ })).toHaveAttribute('href', VA_HISTORY_URL);
    });

    it('credits the Dickens quote, with the title in italics', () => {
      render(<PosterExhibition config={VICTORIAN} />);
      fireEvent.click(screen.getByRole('button', { name: /Invention of How We Celebrate Christmas poster/ }));
      tick();
      const content = () => document.querySelector('.pe-walkthrough-content') as HTMLElement;
      expect(within(content()).getByRole('heading', { level: 2 })).toHaveTextContent(/^Charles Dickens, Victorian Britain and the Invention of How We Celebrate\s*Christmas$/);
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      expect(content().querySelector('blockquote')).toHaveTextContent('"Christmas was dead, to begin with. There is no doubt whatever about that."');
      expect(content().querySelector('.pe-quote-cite')).toHaveTextContent("After Charles Dickens, A Christmas Carol (1843): 'Marley was dead: to begin with.'");
      expect(content().querySelector('.pe-quote-cite em')).toHaveTextContent('A Christmas Carol');
      expect(content().textContent).not.toContain('*');
    });
  });
});

describe('The Victorian Britain display case page', () => {
  it('keeps the record, with a card for each artifact, beside an empty case awaiting its photographs', () => {
    render(<VictorianCase />);
    expect(screen.getByRole('heading', { level: 1, name: 'Victorian Britain' })).toBeInTheDocument();
    // Every line of the record is kept: the objects' lines (each object a card) and the display's.
    expect(recordLines(VICTORIAN_CASE).map(plainText)).toEqual([
      'Victorian needle case featuring a Queen Victoria lithograph',
      'Antique copy of The Scott Birthday Book',
      'Graphic panels exploring Victorian innovation, the V&A Museum, and Dickensian traditions',
    ]);
    const cards = screen.getAllByRole('link', { name: /View artifact/ });
    expect(cards.map((c) => c.getAttribute('href'))).toEqual(VICTORIAN_CASE.artifacts.map((a) => artifactPath({ slug: VICTORIAN.slug }, a)));
    // No installation photographs: an empty case, drawn, stands in for them.
    expect(VICTORIAN_CASE.photos).toHaveLength(0);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
    expect(screen.getByText('Display case — photographs to come')).toBeInTheDocument();
    expect(JSON.stringify([VICTORIAN, VICTORIAN_CASE])).not.toMatch(/installation|case(-thumb|-table)?\.jpg|microscopes?(-sands)?\.jpg|sand-specimens\.jpg|moon-dust\.jpg/);
    expect(screen.getByRole('link', { name: 'Return to Exhibition' })).toHaveAttribute('href', '/exhibitions/victorian');
    expect(screen.getByRole('link', { name: 'Exhibition' })).toHaveAttribute('href', '/exhibitions/victorian');
  });
});

describe('Victorian Britain on the museum map', () => {
  it('is a room on the Ground Floor, with an Exhibition Hall, a Display Case and three interactive rooms', () => {
    const level = getLevelConfig('/exhibitions/victorian/artifacts/case');
    expect(level.title).toBe('Victorian Britain');
    expect(level.backTarget?.path).toBe('/exhibitions/ground-floor');
    expect(level.floorPlan?.rooms.map((r) => [r.label, r.path])).toEqual([
      ['Exhibition Hall', '/exhibitions/victorian'],
      ['Display Case', '/exhibitions/victorian/artifacts/case'],
      ['Card Maker', '/exhibitions/victorian/christmas-card'],
      ['Inventions', '/exhibitions/victorian/inventions'],
      ['Parlour', '/exhibitions/victorian/christmas-parlour'],
    ]);
    expect(getRoomByPath('/exhibitions/victorian')?.parent).toBe('ground-floor');
    expect(getRoomByPath('/exhibitions/victorian/artifacts/case')?.parent).toBe('victorian');
    const room = getLevelConfig('/exhibitions/ground-floor').rooms.find((r) => r.id === 'victorian')!;
    expect(room.comingSoon).toBeFalsy();
  });
});
