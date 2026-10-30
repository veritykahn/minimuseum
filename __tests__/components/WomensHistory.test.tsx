import { artifactPath, plainText, recordLines } from '@/components/exhibition/artifacts';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import PosterExhibition from '@/components/exhibition/PosterExhibition';
import WomensHistoryCase from '@/app/exhibitions/womens-history/artifacts/case/page';
import { posterChapters } from '@/components/projector/posterTalk';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';
import {
  AF_KLINT_CREDIT,
  AF_KLINT_SOURCE,
  IWM_WOMENS_WORK_URL,
  LONDON_MUSEUM_URL,
  OWN_HISTORY_TITLE,
  TALK_ABOUT_IT_HREF,
  WARTIME_TITLE,
  WOMENS_HISTORY,
  WOMENS_HISTORY_MONTH_GOV_URL,
  WOMENS_HISTORY_CASE,
} from '@/app/exhibitions/womens-history/womensHistory';
import { floorReturnFor } from '@/lib/floors';

/*
 * Women's History Month: its config, the poster copy against the
 * transcription (with only the owner's approved decisions), the af Klint
 * credit, the link outs, the walkthrough with its paint-and-paper reveal,
 * the display case page, and the map.
 */

const poster = (id: string) => WOMENS_HISTORY.posters.find((p) => p.id === id)!;
const allItems = WOMENS_HISTORY.posters.flatMap((p) => p.items);
/** The copy as read: "*…*" marks italics and is not part of the words. */
const plain = (t: string) => t.replace(/\*/g, '');
/** A printed paragraph as read: its bold lead-in, then its copy (the museum's added panels left out). */
const paragraphs = (id: string) =>
  poster(id).items.flatMap((it) => (it.type === 'paragraph' && it.section !== 'added' ? [plain(it.lead ? `${it.lead} ${it.text}` : it.text)] : []));
/** The museum's added panels, in order. */
const added = (id: string) => poster(id).items.filter((it) => it.section === 'added');
const allText = allItems
  .map((it) => [('lead' in it && it.lead) || '', 'text' in it && it.text ? plain(it.text) : '', ('subtitle' in it && it.subtitle) || '', ('note' in it && it.note) || ''].filter(Boolean).join(' '))
  .join('\n');
const tick = (ms = 400) => act(() => { jest.advanceTimersByTime(ms); });

/** Poster 1's copy exactly as printed, from the transcription (the poster leaves off the final period). */
const PRINTED_1 = "Women's History Month, celebrated every March, honors the achievements and contributions of women throughout history. It began in 1978 as a local week-long celebration in Santa Rosa, California, inspiring similar observances across the U.S. In 1980, President Jimmy Carter declared the first official National Women's History Week, and by 1987, Congress expanded it to the entire month of March. Historically, women's roles have often been overshadowed by those of men, who were traditionally credited with \"shaping history.\" However, women's lived experiences provide a deeper, more nuanced understanding of the past—not just through the contributions of overlooked inventors, activists, artists, and writers, but also through the everyday lives of ordinary women. Their roles in households and communities offer invaluable insight into the way societies function, making it essential to recognize and celebrate their impact in shaping human history";
/** Poster 2's biography exactly as printed, from the transcription. */
const PRINTED_2 = "VIOLET DINA WANT NÉE KNIGHT was born at the turn of the 20th century in Fulham, Hammersmith, London, into a large working-class family with three sisters and two brothers. As the second eldest daughter, she was expected to help both at home and financially from a young age. She took on a great deal of responsibility, caring for her younger sisters after school and as she aged, after work. Her father worked as a commissionaire (now known as a doorman) at a hotel, occasionally bringing home leftover food from the restaurant to help feed the family. Despite their modest circumstances, Violet excelled in school, earning certificates for attendance and religious studies every year. Her teachers saw great potential in her and encouraged her to pursue a teaching career—a well-respected and middle-class profession at the time. However, when one of her sisters was believed to be going blind and needed to attend a specialized school, Violet had to leave school at 14 to work and help support the family. She became a piecework machinist in a factory, where machinists get paid for each 'piece of work' they complete. During this time, she also learned gardening from her father, an essential source of food for many families. It was common if you had a garden, even in large cities like London, to grow vegetables and keep rabbits for \"the pot\". One of these rabbits became Violet's pet, often perching on her shoulder as she worked in the garden—until the day she came home to find it had been cooked for dinner. Violet was religious throughout her life and joined the Salvation Army, or \"Sally Army,\" as an adult. In 1928, at the age of 21, she married Harold Henry Robert Want, saying she had chosen him because he made her laugh. Harold Want had previously been married but his wife died young and left him with an infant son. While Violet would have been happy to care for and raise this son, he was instead sent to live with an older, childless aunt—a common practice at the time. Violet and Harold began their own family in 1929 with the birth of their eldest daughter, Edna, followed by Doris, in 1930. After a long gap, they had two sons in 1938 and 1942. Money was often tight—Harold worked as a barman and struggled with alcoholism—but Violet ensured her children were always warm and well-dressed. A skilled seamstress from her years as a machinist, she could take apart adult coats, resize them, and reassemble them perfectly for her children. Her resourcefulness meant they were often better off than others in their community. For example, it was common for poor families to place their youngest child in a makeshift cot by pushing two wooden armchairs together and rolling the baby in a blanket fastened with safety pins. Music played a significant role in their home. Violet always owned a piano, which she could play by ear, and it became the centerpiece of lively \"knees-up\" parties with family and friends. Before World War II, Violet's extended family lived in close-knit neighboring streets, but the heavy bombing during the Blitz destroyed their homes, scattering them across the South of England. When a V-1 'doodlebug' bomb, a bomb designed by the Nazi's to terrorize the British civilian population and lower morale, exploded nearby, it shattered all the windows in Violet's home and collapsed her mother's house, killing her instantly along with a family dog. Her mother was identified only by the rings on her finger. The blast also maimed a family puppy, which had to be put down, and left Violet with spinal rheumatism, making breathing painful—though she eventually recovered. After the war, she was offered a home on a new council estate in Essex. It was a corner house with a large garden, where she cultivated beautiful flowers like begonias, chrysanthemums, and ice plants, along with vegetables such as string beans and peas. However, her favorite flowers were roses, which she planted at the bottom of the garden. By the time her grandchildren knew her, Violet worked at the local greengrocer, passing on her knowledge about selecting the best produce—such as choosing cauliflowers with their inner leaves still curled over to keep the curds white. She also had a particular fondness for young turnips, eating them like apples. Widowed in 1956, Violet remained strong and resilient. She continued to garden, even when rheumatoid arthritis made it difficult, and enjoyed sitting outside with her beloved dog, Shona. Music remained a constant in her life; she always kept a piano in her home and, in her seventies, developed a love for Strauss waltzes, which she listened to on the radio. She also had a surprising penchant for wrestling, tuning in every Saturday, and knew Tiny Carr personally, a famous referee of the time. Violet Want's life is a testament to resilience, humor, and hard work. As a family matriarch, her story offers a rich snapshot of working-class life in England, spanning the Edwardian era, two world wars, and the societal shifts of the 1970s and 80s. The personal histories of women like her help us understand the past—not just in grand historical events, but through the everyday sacrifices and triumphs of ordinary people who shaped the world we live in today.";

/** Applies a replacement that must match exactly once, so a fix that silently matches nothing fails. */
function fix(text: string, from: string, to: string) {
  expect(text.split(from)).toHaveLength(2);
  return text.replace(from, to);
}

describe("Women's History Month", () => {
  it('has two posters, each opening on its title and ending with Return to Exhibition, and one display case', () => {
    expect(WOMENS_HISTORY.slug).toBe('womens-history');
    expect(WOMENS_HISTORY.name).toBe("Women's History Month");
    expect(WOMENS_HISTORY.subtitle).toBe('Letters From the Blitz');
    expect(WOMENS_HISTORY.posters.map((p) => p.id)).toEqual(['poster1', 'poster2']);
    expect(WOMENS_HISTORY.posters.map((p) => p.title)).toEqual(["Women's History", "Working Woman's"]);
    for (const p of WOMENS_HISTORY.posters) {
      expect(p.items[0].type).toBe('title-image');
      expect(p.items[p.items.length - 1].type).toBe('end');
      expect(p.hero.alt).toBeTruthy();
    }
    expect(WOMENS_HISTORY.cases).toHaveLength(1);
    expect(WOMENS_HISTORY.cases?.[0].href).toBe('/exhibitions/womens-history/artifacts/case');
    expect(WOMENS_HISTORY.cases?.[0].image).toBeUndefined(); // photographs to come
    expect(WOMENS_HISTORY.fx.theme).toBe('wh');
  });

  it('sets the titles in the posters’ own lettering, read as the full title, each with its subtitle after it', () => {
    const [t1, t2] = WOMENS_HISTORY.posters.map((p) => p.items[0]);
    expect(t1).toMatchObject({ type: 'title-image', alt: "Women's History", src: '/exhibitions/womens-history/titles/womens-history.png' });
    expect(t2).toMatchObject({ type: 'title-image', alt: "Working Woman's", src: '/exhibitions/womens-history/titles/working-womans.png' });
    expect(t1.marks).toEqual({ left: "Women's History Month | March 1st to 31st", right: "International Women's Day | March 8th" });
    const [s1, s2] = WOMENS_HISTORY.posters.map((p) => p.items[1]);
    expect(s1).toMatchObject({ type: 'title-text', text: 'MOVING FORWARD TOGETHER! WOMEN EDUCATING & INSPIRING GENERATIONS' });
    expect(s2).toMatchObject({ type: 'title-text', text: 'BIOGRAPHY OF A WORKING CLASS WOMAN' });
  });

  it("sets Violet's name, née Knight, and her dates in US style", () => {
    const name = poster('poster2').items[2];
    expect(name).toMatchObject({ type: 'title-text', text: 'Violet Dina Want', subtitle: 'née Knight', note: 'Born January 27, 1907 | Died March 2, 1988' });
    expect(allText).not.toMatch(/27th Jan|2nd Mar|\bb\. |\bd\. /);
  });

  it('goes back to the first floor, as its third Horizons room', () => {
    expect(WOMENS_HISTORY.back).toEqual(floorReturnFor('womens-history'));
    expect(WOMENS_HISTORY.back).toEqual({ href: '/exhibitions/first-floor', label: 'First Floor', remember: { key: 'firstFloorIndex', value: '2' } });
  });

  it('sets poster 1 exactly as printed, with only the final period added', () => {
    expect(paragraphs('poster1').join(' ')).toBe(`${PRINTED_1}.`);
  });

  it('sets the biography exactly as printed, with only the approved fix', () => {
    expect(paragraphs('poster2').join(' ')).toBe(fix(PRINTED_2, 'a bomb designed by the Nazi\'s to', 'a bomb designed by the Nazis to'));
  });

  it('applies the approved decisions, and the replaced wording is gone', () => {
    expect(allText).toContain('a bomb designed by the Nazis to terrorize');
    expect(allText).not.toContain("Nazi's");
    // The whole biography, as printed: the family names and the alcoholism line stay.
    expect(allText).toContain('Harold Henry Robert Want');
    expect(allText).toContain('Edna, followed by Doris, in 1930');
    expect(allText).toContain('Harold worked as a barman and struggled with alcoholism');
    expect(allText).toContain('shaping human history.');
    expect(allText).not.toMatch(/ {2}/);
  });

  it('splits paragraphs only between sentences', () => {
    for (const it of allItems) if (it.type === 'paragraph') expect(plain(it.text)).toMatch(/[.!?]["”]?$/);
  });

  describe('the museum’s added panels (the owner’s approved drafts)', () => {
    it('adds seven panels to poster 1, after the painting, after Santa Rosa and in a wartime chapter', () => {
      const items = poster('poster1').items;
      const panels = added('poster1').filter((it) => it.type === 'paragraph');
      const callouts = items.filter((it) => it.type === 'callout');
      // Six paragraphs, and the second callout (womenshistorymonth.gov).
      expect(panels).toHaveLength(6);
      expect(callouts.map((c) => c.type === 'callout' && c.url)).toEqual([IWM_WOMENS_WORK_URL, WOMENS_HISTORY_MONTH_GOV_URL]);
      expect(items).toHaveLength(17);
      const at = (start: string) => items.findIndex((it) => 'text' in it && plain(it.text ?? '').startsWith(start));
      expect(at('The painting is by Hilma af Klint')).toBe(items.findIndex((it) => it.type === 'full-image') + 1);
      expect(at('The Santa Rosa organizers')).toBe(at('It began in 1978') + 1);
      expect(at('Between 1988 and 1994')).toBe(at('The Santa Rosa organizers') + 1);
      expect(at('Each year the National')).toBe(at('Between 1988 and 1994') + 1);
      expect(at(WARTIME_TITLE)).toBe(at('Their roles in households') + 1);
      expect(at('The Imperial War Museum began')).toBe(at('Explore the Women') - 1);
      expect(poster('poster1').talk[WARTIME_TITLE]).toMatch(/“for boys” or “for girls,”/);
    });

    it('closes poster 2 after the legacy with "Your own women’s history", linked to the Talk About It room', () => {
      const items = poster('poster2').items;
      const legacy = items.findIndex((it) => it.className === 'wh-legacy');
      expect(items[legacy + 1]).toMatchObject({ type: 'section-title', text: OWN_HISTORY_TITLE });
      const link = items.find((it) => it.type === 'link');
      expect(link).toMatchObject({ text: 'Step into Talk About It', url: TALK_ABOUT_IT_HREF });
      expect(TALK_ABOUT_IT_HREF).toBe('/exhibitions/womens-history/remembered#talk');
      expect(items.indexOf(link!)).toBe(items.findIndex((it) => it.type === 'callout') - 1);
      expect(allText).toContain("Violet's story is one family's memory, written down so it would not be lost.");
      expect(poster('poster2').talk[OWN_HISTORY_TITLE]).toMatch(/before it is forgotten\?$/);
    });

    it('cites every added panel that states a fact, each source a link', () => {
      const facts = [...added('poster1'), ...added('poster2')].flatMap((it) => (it.type === 'paragraph' ? [it] : []));
      // The two invitations in "Your own women's history" make no claim.
      const unsourced = facts.filter((it) => !it.sources).map((it) => plain(it.text).slice(0, 20));
      expect(unsourced).toEqual(["Violet's story is on", 'Ask. Listen. Write i']);
      for (const it of facts) for (const s of it.sources ?? []) expect(s.href).toMatch(/^https:\/\//);
    });
  });

  it('uses US spellings', () => {
    expect(allText).toMatch(/honors/);
    expect(allText).toMatch(/centerpiece/);
    expect(allText).toMatch(/favorite/);
    expect(allText).toMatch(/humor/);
    expect(allText).not.toMatch(/colour|honour|humour|favourite|recognise|centre\b|neighbouring|specialised|terrorise/);
  });

  it.each(WOMENS_HISTORY.posters.map((p) => [p.id, p] as const))('%s: one open question per chapter, and none left over', (_id, p) => {
    const chapters = posterChapters(p.items.map((it) => ({ type: it.type, text: 'text' in it ? it.text : undefined })), p.title);
    expect(chapters.length).toBeGreaterThan(0);
    expect(Object.keys(p.talk).sort()).toEqual(chapters.map((c) => c.key).sort());
    for (const c of chapters) expect(p.talk[c.key]).toMatch(/\?$/);
  });

  it('credits the af Klint as Wikimedia Commons gives it, linked to its file page', () => {
    expect(AF_KLINT_CREDIT).toContain('Hilma af Klint, *The Ten Largest, No. 1, Childhood*');
    expect(AF_KLINT_CREDIT).toContain('1907');
    expect(AF_KLINT_CREDIT).toContain('Stiftelsen Hilma af Klints Verk');
    expect(AF_KLINT_CREDIT).toContain('Public domain, via Wikimedia Commons');
    expect(AF_KLINT_SOURCE).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:Hilma_af_Klint/);
    const painting = allItems.find((it) => it.type === 'full-image' && it.src.includes('af-klint'));
    expect(painting).toMatchObject({ text: AF_KLINT_CREDIT, href: AF_KLINT_SOURCE });
    expect(WOMENS_HISTORY.credits).toEqual([{ text: AF_KLINT_CREDIT, href: AF_KLINT_SOURCE }]);
  });

  it('uses all four family photographs, each with alt text', () => {
    const photos = allItems.flatMap((it) => {
      if (it.type === 'full-image' && it.src.includes('/photo-')) return [{ src: it.src, alt: it.alt }];
      if (it.type === 'paragraph' && it.figure) return [{ src: it.figure.src, alt: it.figure.alt }];
      return [];
    });
    expect(photos.map((p) => p.src).sort()).toEqual([
      '/exhibitions/womens-history/photo-family.jpg',
      '/exhibitions/womens-history/photo-four-women.jpg',
      '/exhibitions/womens-history/photo-promenade.jpg',
      '/exhibitions/womens-history/photo-violet.jpg',
    ]);
    for (const p of photos) expect(p.alt).toBeTruthy();
  });

  it('links the QR codes to the Imperial War Museum and the London Museum', () => {
    const callouts = allItems.flatMap((it) => (it.type === 'callout' ? [{ text: it.text, url: it.url }] : []));
    expect(callouts).toEqual([
      { text: "Explore the Women's Work Collection at the Imperial War Museum", url: IWM_WOMENS_WORK_URL },
      // Added: where teachers can find more.
      { text: "Explore Women's History Month resources from the Library of Congress, the National Archives, the National Park Service, the Smithsonian and other national museums together", url: WOMENS_HISTORY_MONTH_GOV_URL },
      { text: 'Explore objects and stories at the London Museum', url: LONDON_MUSEUM_URL },
    ]);
    expect(IWM_WOMENS_WORK_URL).toBe('https://www.iwm.org.uk/history/iwm/collections/womens-work');
    expect(LONDON_MUSEUM_URL).toBe('https://www.londonmuseum.org.uk/collections/');
    expect(allText).not.toMatch(/Scan Here/);
  });

  describe('the walkthrough', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      window.history.replaceState(null, '', '/');
    });
    afterEach(() => jest.useRealTimers());

    it('shows the posters, the display case and the picture credit on the landing page', () => {
      render(<PosterExhibition config={WOMENS_HISTORY} />);
      expect(screen.getByRole('heading', { level: 1, name: "Women's History Month" })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /display case/i })).toHaveAttribute('href', '/exhibitions/womens-history/artifacts/case');
      expect(screen.getByRole('link', { name: 'First Floor' })).toHaveAttribute('href', '/exhibitions/first-floor');
      const credit = within(screen.getByRole('list', { name: 'Picture credits' })).getByRole('link');
      expect(credit).toHaveAttribute('href', AF_KLINT_SOURCE);
      expect(credit.querySelector('em')).toHaveTextContent('The Ten Largest, No. 1, Childhood');
    });

    it("opens Women's History with paint splashed across the page, the title read whole, and the IWM link", () => {
      render(<PosterExhibition config={WOMENS_HISTORY} />);
      fireEvent.click(screen.getByRole('button', { name: /^Women's History poster/ }));
      tick();
      const content = () => document.querySelector('.pe-walkthrough-content') as HTMLElement;
      expect(within(content()).getByRole('heading', { level: 2, name: "Women's History" })).toBeInTheDocument();
      expect(content().querySelector('.pfx-wh-open')).toBeInTheDocument();
      // Set in type, stacked and underlined as the poster sets it; the lettering is for the eye only.
      expect(content().querySelector('.pe-title-live')?.closest('[aria-hidden="true"]')).not.toBeNull();

      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      expect(within(content()).getByRole('heading', { level: 2, name: 'MOVING FORWARD TOGETHER! WOMEN EDUCATING & INSPIRING GENERATIONS' })).toBeInTheDocument();
      expect(content().querySelectorAll('.pe-title-line')).toHaveLength(3);

      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      const credit = content().querySelector('.pe-image-caption a') as HTMLElement;
      expect(credit).toHaveAttribute('href', AF_KLINT_SOURCE);
      expect(credit.querySelector('em')).toHaveTextContent('The Ten Largest, No. 1, Childhood');

      // The museum's added note on the artist, with its source beneath it.
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      expect(content()).toHaveTextContent('The painting is by Hilma af Klint, a Swedish artist born in 1862.');
      expect(content().querySelector('.pe-source')).toHaveTextContent('Source: Tate, “The first abstract artist? (And it’s not Kandinsky)”');

      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      expect(content().querySelector('.pe-lead')).toHaveTextContent("Women's History Month, celebrated every March,");

      const callout = poster('poster1').items.findIndex((it) => it.type === 'callout');
      for (let i = 4; i < callout; i++) {
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        tick();
      }
      expect(within(content()).getByRole('link', { name: /Explore the Women's Work Collection at the Imperial War Museum/ })).toHaveAttribute('href', IWM_WOMENS_WORK_URL);
    });

    it("opens Working Woman's, sets Violet's name in the poster's lettering, and links to the London Museum", () => {
      render(<PosterExhibition config={WOMENS_HISTORY} />);
      fireEvent.click(screen.getByRole('button', { name: /^Working Woman's poster/ }));
      tick();
      const content = () => document.querySelector('.pe-walkthrough-content') as HTMLElement;
      expect(within(content()).getByRole('heading', { level: 2, name: "Working Woman's" })).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      expect(within(content()).getByRole('heading', { level: 2, name: 'BIOGRAPHY OF A WORKING CLASS WOMAN' })).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      expect(within(content()).getByRole('heading', { level: 2, name: 'Violet Dina Want' })).toBeInTheDocument();
      expect(content().querySelector('.pe-title-lettering')).toHaveAttribute('src', '/exhibitions/womens-history/violet-dina-want.png');
      expect(content().querySelector('.pe-title-subtitle')).toHaveTextContent('née Knight');
      expect(content().querySelector('.pe-title-note')).toHaveTextContent('Born January 27, 1907 | Died March 2, 1988');

      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      expect(content().querySelector('.pe-lead')).toHaveTextContent('VIOLET DINA WANT NÉE KNIGHT');
      expect(content().querySelector('.pe-figure img')).toHaveAttribute('src', '/exhibitions/womens-history/photo-violet.jpg');

      // The closing link opens the Talk About It room in place, not in a new tab.
      const link = poster('poster2').items.findIndex((it) => it.type === 'link');
      for (let i = 3; i < link; i++) {
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        tick();
      }
      const room = within(content()).getByRole('link', { name: 'Step into Talk About It' });
      expect(room).toHaveAttribute('href', TALK_ABOUT_IT_HREF);
      expect(room).not.toHaveAttribute('target');

      const callout = poster('poster2').items.findIndex((it) => it.type === 'callout');
      for (let i = link; i < callout; i++) {
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        tick();
      }
      expect(within(content()).getByRole('link', { name: /Explore objects and stories at the London Museum/ })).toHaveAttribute('href', LONDON_MUSEUM_URL);
    });
  });
});

describe("The Women's History Month display case page", () => {
  it('keeps the record, with a card for each artifact, beside an empty case awaiting its photographs', () => {
    render(<WomensHistoryCase />);
    expect(screen.getByRole('heading', { level: 1, name: "Women's History Month" })).toBeInTheDocument();
    // Every line of the record is kept: the objects' lines (each object a card) and the display's.
    expect(recordLines(WOMENS_HISTORY_CASE).map(plainText)).toEqual([
      "Original Blitz bomb-damaged family letters from Violet Dina Want's estate",
      'Archival glass display case presentation with clear document mounts',
      "Digital extension: an 11-slide interactive biographical presentation on Violet's life",
    ]);
    const cards = screen.getAllByRole('link', { name: /View artifact/ });
    expect(cards.map((c) => c.getAttribute('href'))).toEqual(WOMENS_HISTORY_CASE.artifacts.map((a) => artifactPath({ slug: WOMENS_HISTORY.slug }, a)));
    // No installation photographs: an empty case, drawn, stands in for them.
    expect(WOMENS_HISTORY_CASE.photos).toHaveLength(0);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
    expect(screen.getByText('Display case — photographs to come')).toBeInTheDocument();
    expect(JSON.stringify([WOMENS_HISTORY, WOMENS_HISTORY_CASE])).not.toMatch(/installation|case(-thumb|-table)?\.jpg|microscopes?(-sands)?\.jpg|sand-specimens\.jpg|moon-dust\.jpg/);
    expect(screen.getByRole('link', { name: 'Return to Exhibition' })).toHaveAttribute('href', '/exhibitions/womens-history');
    expect(screen.getByRole('link', { name: 'Exhibition' })).toHaveAttribute('href', '/exhibitions/womens-history');
  });
});

describe("Women's History Month on the museum map", () => {
  it('is a room on the First Floor, with an Exhibition Hall, a Display Case, Violet’s Life and Who Gets Remembered?', () => {
    const level = getLevelConfig('/exhibitions/womens-history/artifacts/case');
    expect(level.title).toBe("Women's History Month");
    expect(level.backTarget?.path).toBe('/exhibitions/first-floor');
    expect(level.floorPlan?.rooms.map((r) => [r.label, r.path])).toEqual([
      ['Exhibition Hall', '/exhibitions/womens-history'],
      ['Display Case', '/exhibitions/womens-history/artifacts/case'],
      ['Violet’s Life', '/exhibitions/womens-history/violet'],
      ['Who Gets\nRemembered?', '/exhibitions/womens-history/remembered'],
    ]);
    expect(getRoomByPath('/exhibitions/womens-history')?.parent).toBe('first-floor');
    expect(getRoomByPath('/exhibitions/womens-history/artifacts/case')?.parent).toBe('womens-history');
    const room = getLevelConfig('/exhibitions/first-floor').rooms.find((r) => r.id === 'womens-history')!;
    expect(room.comingSoon).toBeFalsy();
    expect(room.path).toBe('/exhibitions/womens-history');
  });
});
