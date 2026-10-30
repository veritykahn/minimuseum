import { act, fireEvent, render, screen, within } from '@testing-library/react';
import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { posterChapters } from '@/components/projector/posterTalk';
import { artifactPath, plainText, recordLines } from '@/components/exhibition/artifacts';
import America250Case from '@/app/exhibitions/america-250/artifacts/case/page';
import {
  AMERICA_250,
  AMERICA_250_CASE,
  LEUTZE_CREDIT,
  LEUTZE_SOURCE,
  NARA_DECLARATION_URL,
  NARA_SIGNERS_URL,
  TRUMBULL_CREDIT,
  TRUMBULL_SOURCE,
} from '@/app/exhibitions/america-250/america250';
import { floorReturnFor } from '@/lib/floors';

/*
 * America 250: its config, the poster copy against the transcription (with
 * only the owner's seven approved fixes), the paintings' credits, and the
 * walkthrough with its press reveal, and the display case page.
 */

const poster = (id: string) => AMERICA_250.posters.find((p) => p.id === id)!;
const allItems = AMERICA_250.posters.flatMap((p) => p.items);
/** The copy as read: "*…*" marks italics and is not part of the words. */
const plain = (t: string) => t.replace(/\*/g, '');
const paragraphs = (id: string) => poster(id).items.flatMap((it) => (it.type === 'paragraph' ? [plain(it.text)] : []));
const quotes = (id: string) => poster(id).items.flatMap((it) => (it.type === 'quote' ? [{ text: it.text, cite: it.cite }] : []));
const allText = allItems.map((it) => ('text' in it && it.text ? plain(it.text) : '')).join('\n');
const tick = (ms = 400) => act(() => { jest.advanceTimersByTime(ms); });

/** Poster 1's copy exactly as printed, from the transcription. */
const PRINTED_1 = "If the Declaration of Independence is America's birth certificate, it raises an immediate question: why didn't the Father of America sign it? For most Americans, the Declaration is precisely that — a birth certificate, a cosmogony, the moment the Founding Fathers created a nation in a single spontaneous act. It is not slow or meandering, uncertain or at risk. It is momentous and sudden and instantaneous. The entirety of the war, the Constitutional Convention, the years of a fragile and failing republic — all of it is swallowed into one mythic moment on the Fourth of July 1776, when godlike Founders put pen to parchment and America was suddenly there where it had not before been. And presiding over it all, signing the nation into existence as a father signs a birth certificate, is George Washington. Except that Washington never signed the Declaration of Independence. He was not even in the room: he was commanding the army. In fact, almost none of the story Americans tell about this document is accurate. On 3 July 1776, John Adams wrote to his wife Abigail in a state of elation that Independence had been resolved the previous day, and Adams was certain of its significance. The Second of July, he declared, would be celebrated by future generations as the great anniversary — marked with pomp, parades, and illuminations from one end of the continent to the other. Adams was remarkably prescient about everything, except the date. Independence was resolved on 2 July 1776. The Declaration, adopted two days later, was merely the formal explanation of a decision already made — a statement of justification, not an act of independence. July 4th was, in Adams' own understanding, a formality. Yet the myth settled on it regardless, and Adams' prediction was displaced by the very story he had helped to create. What most people picture as the Declaration of Independence was not the actual document present at the Continental Congress. It is, in fact, an engraving made in 1823 by William J. Stone — itself an imperfect copy of the Engrossed parchment, now in the National Archives, which was a reproduction of the 4 July Fair Copy, itself an edited version of Jefferson's Rough Draft. The Engrossed Copy was not actually completed until 19 July and it was signed even later. Even the transcription offered by the National Archives is a transcription of the Stone engraving, not the original. The document Americans venerate is a copy of a copy, made nearly fifty years after the fact. Jefferson was the author but not the sole author. In fact, there were at least four. \"We hold these truths to be self-evident\" was Franklin's alteration of Jefferson's original \"sacred and undeniable.\" The \"pursuit of happiness\" was also shaped by Franklin's pen. Congress made further changes, most significantly removing Jefferson's charge against George III for the slave trade, whose removal left Jefferson so despondent that he needed consolation. What survived was a cooler, more measured document than Jefferson intended. The preamble that Americans now consider the Declaration's heart was, in 1776, its least important section. The twenty-seven charges against the King — the longest part of the text — were the whole point. The Declaration was a legal and diplomatic argument designed above all to persuade France to enter the war, not a birth certificate or even a philosophical promise for the new Republic. For the first fifteen years after its adoption the Declaration was largely ignored, kept in poor conditions, its parchment already deteriorating. Adams himself called it \"hackneyed\" — not an idea in it that had not been discussed in Congress for two years prior. It was Jefferson's rising political career, and then his death in 1826 on the fiftieth anniversary of its adoption — the same day Adams also died, an event widely interpreted as divine providence — that transformed the document into something approaching scripture. Abraham Lincoln completed the transformation at Gettysburg, elevating the preamble above the Constitution itself and making \"all men are created equal\" the founding promise of the nation. The charges against the King, which had been the Declaration's entire purpose, were forgotten. The philosophy, which had been secondary, became everything.";
/** Poster 2's copy exactly as printed, from the transcription. */
const PRINTED_2 = "The fifty-six men who signed the Declaration of Independence did so in the knowledge that a British victory meant, for the leaders of the rebellion, a public execution. High treason against the Crown carried a very specific sentence under eighteenth-century British law: death by hanging, drawing, and quartering. These men were not signing a certificate of triumph, but a death warrant. The war had been going badly. It would get considerably worse. When they lifted their pens to sign, not one of those men could say with certainty what the outcome would be. The popular memory of the Revolution treats American independence as inevitable: a righteous cause whose triumph was always assured. Benjamin Rush, writing to Richard Price in 1786, offered a more accurate account: \"The American war is over; but this is far from being the case with the American revolution. On the contrary, nothing but the first act of the drama is closed.\" When the Declaration was signed in the summer of 1776, Washington commanded approximately 19,000 men, many sick, poorly equipped, serving on enlistments already expiring. By contrast they were up against the greatest military in the world: Britain had landed 32,000 troops on Staten Island, the largest expeditionary force the Empire had ever assembled. Within weeks, the Battle of Long Island had become a near-catastrophe for the colonists. By November, Washington was retreating across New Jersey with perhaps 3,000 effective troops remaining. Thomas Paine wrote The American Crisis in those weeks — \"These are the times that try men's souls\" — not as the rhetoric of a winning side but as a desperate attempt to hold together an army that was dissolving. The British, from occupied New York, published declarations urging colonists to return to their allegiance while terms were still available. Many believed they would. The signers were now identified men. They had put their names to an act of treason and this meant real consequences. Richard Stockton, a New Jersey delegate, was captured by the British, imprisoned, and tortured. His home was burned, his library destroyed. Under those conditions he recanted his signature. It is the most human moment in the whole story of the Declaration: a man in pain, in fear, saying what his captors *wanted* him to say and what he *needed* to say to avoid execution. Stockton never recovered his health and died in 1781, broken by what had been done to him and what he had done under duress. He had pledged everything the Declaration asked of him, yet by the time of his death Independence had still not been won. Charles Carroll of Carrollton was the only Catholic among the fifty-six signers. In 1776, Catholics could still not hold public office in most of the American colonies. When it was observed that there were many men named Charles Carroll and he might escape personal consequence, Carroll responded by adding his full address to his signature — \"of Carrollton\" — so there could be no mistaking which Charles Carroll had signed. He refused the protection of ambiguity to stand in life and death with his fellow signers. Carroll eventually outlived every other signatory, dying in 1832 at the age of ninety-five as the last living connection to that room, that day, that decision. When asked what he considered his most important contribution, he did not mention his wealth or his longevity. Carroll's answer was his signature on the Declaration, and the fact that he had made sure it could be read. The signatures of 1776 did not end the wager on the colonies' independence, rather they began it. The independence the Declaration asserted so assuredly still had to be built through the failed confederation, the Constitutional Convention held in secret, and the ratification process that was anything but certain. America was constantly and consistently referred to as an experiment by the same men who were attempting to forge it. Washington fought the war, presided over the Constitutional Convention, served two terms as the republic's first president, and then voluntarily surrendered power and returned to his farm, a move that led King George III to proclaim Washington to be the greatest man in the world. The wager fifty-six men made with their signatures in 1776 was not settled on a battlefield. It was settled by what they built, and what they were willing to give up, in the decades that followed.";

/** Applies a replacement that must match exactly once, so a fix that silently matches nothing fails. */
function fix(text: string, from: string, to: string) {
  expect(text.split(from)).toHaveLength(2);
  return text.replace(from, to);
}

/** The owner's approved fixes to poster 1, and nothing else. */
function approved1() {
  // 4. US date style
  let t = fix(PRINTED_1, 'On 3 July 1776, John Adams', 'On July 3, 1776, John Adams');
  t = fix(t, 'Independence was resolved on 2 July 1776.', 'Independence was resolved on July 2, 1776.');
  t = fix(t, 'the 4 July Fair Copy', 'the July 4 Fair Copy');
  // 5. the Engrossed Copy
  t = fix(
    t,
    'The Engrossed Copy was not actually completed until 19 July and it was signed even later.',
    'Congress did not order the Engrossed Copy until July 19, and most delegates signed it on August 2.',
  );
  return t;
}

/** The owner's approved fixes to poster 2, and nothing else. */
function approved2() {
  // 3. Carroll, told as a story, with the family reason
  let t = fix(PRINTED_2, 'When it was observed that there were many men named Charles Carroll', 'The story goes that when it was observed that there were many men named Charles Carroll');
  t = fix(
    t,
    'so there could be no mistaking which Charles Carroll had signed. He refused',
    'so there could be no mistaking which Charles Carroll had signed. (He often signed that way to tell himself apart from his father, Charles Carroll of Annapolis.) He refused',
  );
  // 6. George III
  t = fix(
    t,
    'a move that led King George III to proclaim Washington to be the greatest man in the world.',
    'a choice King George III is reported to have said would make Washington the greatest man in the world.',
  );
  return t;
}

describe('America 250', () => {
  it('has two posters, each opening on its title and ending with Return to Exhibition, one display case, and the signing room', () => {
    expect(AMERICA_250.slug).toBe('america-250');
    expect(AMERICA_250.name).toBe('America 250');
    expect(AMERICA_250.subtitle).toBe('The Declaration of Independence at 250');
    expect(AMERICA_250.posters.map((p) => p.id)).toEqual(['poster1', 'poster2']);
    expect(AMERICA_250.posters.map((p) => p.title)).toEqual(['Before it was Sacred', 'We Shall All Hang Together']);
    for (const p of AMERICA_250.posters) {
      expect(p.items[0].type).toBe('title-image');
      expect(p.items[p.items.length - 1].type).toBe('end');
    }
    expect(AMERICA_250.cases?.map((c) => [c.href, c.label, c.title])).toEqual([['/exhibitions/america-250/artifacts/case', 'Display Case', 'Artifacts']]);
    expect(AMERICA_250.interactives?.map((c) => c.href)).toEqual(['/exhibitions/america-250/sign']);
    expect(AMERICA_250.fx.theme).toBe('ap');
  });

  it('opens on the posters’ script titles, and sets their subtitles under the paintings', () => {
    expect(AMERICA_250.posters.map((p) => (p.items[0].type === 'title-image' ? p.items[0].alt : undefined))).toEqual(AMERICA_250.posters.map((p) => p.title));
    const subtitles = AMERICA_250.posters.map((p) => p.items.flatMap((it) => (it.type === 'image-text-stacked' ? [it.text] : []))[0]);
    expect(subtitles).toEqual([
      'The Declaration of Independence: What It Was, What It Became, and Why the Difference Matters',
      'The Wager Fifty-Six Men Made With Their Signatures',
    ]);
  });

  it('goes back to the ground floor, as its fourth Origins room', () => {
    expect(AMERICA_250.back).toEqual(floorReturnFor('america-250'));
    expect(AMERICA_250.back).toEqual({ href: '/exhibitions/ground-floor', label: 'Ground Floor', remember: { key: 'groundFloorIndex', value: '3' } });
  });

  it('sets poster 1 exactly as printed, with only the approved fixes', () => {
    expect(paragraphs('poster1').join(' ')).toBe(approved1());
  });

  it('sets poster 2 exactly as printed, with only the approved fixes', () => {
    // The transcription marks the poster's italics (*wanted*, *needed*) as the config does.
    expect(paragraphs('poster2').join(' ')).toBe(plain(approved2()));
  });

  it('opens each chapter with the section titles the posters set', () => {
    const titles = (id: string) => poster(id).items.flatMap((it) => (it.type === 'section-title' ? [it.text] : []));
    expect(titles('poster1')).toEqual(['The Wrong Date', 'The Wrong Document', 'The Wrong Author', 'The Wrong Significance']);
    expect(titles('poster2')).toEqual(['The War That Nearly Was Not Won', 'What Signing Actually Meant', 'The Catholic Who Refused To Be Anonymous', 'The Long Wager']);
  });

  it('sets the pull quotes and the epigraph as quotes, with the approved credits', () => {
    expect(quotes('poster1')).toEqual([
      { text: "\"Independence is not understood as having needed to be won, but by virtue of the Declaration alone, America was suddenly there where it had not before been.\"", cite: '— Verity Kahn, *The Myth of the Declaration of Independence*' },
      { text: "Before it was sacred, the Declaration was a formality. Understanding what it actually was makes what it became considerably more remarkable.", cite: undefined },
    ]);
    expect(quotes('poster2')).toEqual([
      { text: "\"We must all hang together, or assuredly we shall all hang separately.\"", cite: '— attributed to Benjamin Franklin, upon signing the Declaration of Independence' },
      { text: "It took fifty-six signatures, seven years of war, and a generation of men willing to lose everything to fulfill the Declaration.", cite: undefined },
    ]);
  });

  it('applies the approved fixes, and the replaced wording is gone', () => {
    // 1, 7: the credits
    expect(allItems.some((it) => it.type === 'quote' && it.cite === '— attributed to Benjamin Franklin, upon signing the Declaration of Independence')).toBe(true);
    expect(allItems.some((it) => it.type === 'quote' && it.cite === '— Verity Kahn, *The Myth of the Declaration of Independence*')).toBe(true);
    // 2: Franklin's sentences, as printed
    expect(allText).toContain('"We hold these truths to be self-evident" was Franklin\'s alteration of Jefferson\'s original "sacred and undeniable."');
    expect(allText).toContain('The "pursuit of happiness" was also shaped by Franklin\'s pen.');
    // 3
    expect(allText).toContain('The story goes that when it was observed');
    expect(allText).toContain('(He often signed that way to tell himself apart from his father, Charles Carroll of Annapolis.)');
    // 4, 5, 6
    expect(allText).toContain('On July 3, 1776, John Adams');
    expect(allText).toContain('Independence was resolved on July 2, 1776.');
    expect(allText).toContain('the July 4 Fair Copy');
    expect(allText).toContain('Congress did not order the Engrossed Copy until July 19, and most delegates signed it on August 2.');
    expect(allText).toContain('a choice King George III is reported to have said would make Washington the greatest man in the world.');

    expect(allText).not.toMatch(/\b\d{1,2} July\b/);
    expect(allText).not.toMatch(/not actually completed|signed even later|led King George III to proclaim/);
    expect(allItems.some((it) => it.type === 'quote' && it.cite === '— Benjamin Franklin, upon signing the Declaration of Independence')).toBe(false);
    expect(allItems.some((it) => it.type === 'quote' && it.cite === '— The Myth of the Declaration of Independence')).toBe(false);
    expect(allText).not.toMatch(/ {2}/);
  });

  it('keeps the posters’ italics, and sets the title of a work in italics', () => {
    const copy = allItems.map((it) => ('text' in it && it.text ? it.text : '')).join('\n');
    expect(copy).toContain('saying what his captors *wanted* him to say and what he *needed* to say');
    expect(copy).toContain('Thomas Paine wrote *The American Crisis* in those weeks');
  });

  it('splits paragraphs only between sentences', () => {
    for (const it of allItems) if (it.type === 'paragraph') expect(plain(it.text)).toMatch(/[.!?]"?$/);
  });

  it('uses US spellings', () => {
    expect(allText).toMatch(/fulfill/);
    expect(allText).not.toMatch(/fulfil\b|colour|honour|recognise|civilisation|centre/);
  });

  it.each(AMERICA_250.posters.map((p) => [p.id, p] as const))('%s: one question per chapter, and none left over', (_id, p) => {
    const chapters = posterChapters(p.items.map((it) => ({ type: it.type, text: 'text' in it ? it.text : undefined })), p.title);
    expect(chapters.map((c) => c.key)).toHaveLength(5);
    expect(Object.keys(p.talk).sort()).toEqual(chapters.map((c) => c.key).sort());
    for (const c of chapters) expect(p.talk[c.key]).toMatch(/\?$/);
  });

  it('credits the two paintings on every picture, linked to their public-domain sources', () => {
    expect(TRUMBULL_CREDIT).toBe('John Trumbull, *Declaration of Independence*, 1818. U.S. Capitol. Public domain.');
    expect(LEUTZE_CREDIT).toBe('Emanuel Leutze, *Washington Crossing the Delaware*, 1851. The Metropolitan Museum of Art. Public domain.');
    expect(TRUMBULL_SOURCE).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    expect(LEUTZE_SOURCE).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);

    const pictures = allItems.flatMap((it) => {
      if (it.type === 'full-image') return [{ src: it.src, alt: it.alt, credit: it.text, href: it.href }];
      if (it.type === 'image-text-stacked') return [{ src: it.src, alt: it.alt, credit: it.credit?.text, href: it.credit?.href }];
      if (it.type === 'paragraph' && it.figure) return [{ src: it.figure.src, alt: it.figure.alt, credit: it.figure.credit?.text, href: it.figure.credit?.href }];
      return [];
    });
    expect(pictures.length).toBeGreaterThanOrEqual(10);
    for (const pic of pictures) {
      expect(pic.alt).toBeTruthy();
      const trumbull = pic.src.includes('/trumbull');
      expect(pic.credit).toBe(trumbull ? TRUMBULL_CREDIT : LEUTZE_CREDIT);
      expect(pic.href).toBe(trumbull ? TRUMBULL_SOURCE : LEUTZE_SOURCE);
    }
    // Poster 1 is built on Trumbull, poster 2 on Leutze.
    for (const it of poster('poster1').items) if (it.type === 'full-image' || it.type === 'image-text-stacked') expect(it.src).toMatch(/\/trumbull/);
    for (const it of poster('poster2').items) if (it.type === 'full-image' || it.type === 'image-text-stacked') expect(it.src).toMatch(/\/leutze/);
    for (const p of AMERICA_250.posters) expect(p.hero.alt).toBeTruthy();
  });

  it('links the National Archives', () => {
    const links = allItems.flatMap((it) => (it.type === 'callout' && it.url ? [it.url] : []));
    expect(links).toEqual([NARA_DECLARATION_URL, NARA_SIGNERS_URL]);
  });

  describe('the walkthrough', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      window.history.replaceState(null, '', '/');
    });
    afterEach(() => jest.useRealTimers());

    it('sets the display case on the landing page, and the signing room inside it', () => {
      render(<PosterExhibition config={AMERICA_250} />);
      expect(screen.getByRole('heading', { level: 1, name: 'America 250' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /display case/i })).toHaveAttribute('href', '/exhibitions/america-250/artifacts/case');
      expect(document.querySelector('a[href="/exhibitions/america-250/sign"]')).toBeNull();
      expect(screen.getByRole('link', { name: 'Ground Floor' })).toHaveAttribute('href', '/exhibitions/ground-floor');
    });

    it('opens We Shall All Hang Together under the press, and sets the epigraph, the credits and the italics', () => {
      render(<PosterExhibition config={AMERICA_250} />);
      fireEvent.click(screen.getByRole('button', { name: /We Shall All Hang Together poster/ }));
      tick();
      const content = () => document.querySelector('.pe-walkthrough-content') as HTMLElement;
      expect(within(content()).getByRole('heading', { level: 2 })).toHaveTextContent('We Shall All Hang Together');
      expect(content().querySelector('.pfx-ap-press')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      expect(content().querySelector('blockquote')).toHaveTextContent('We must all hang together, or assuredly we shall all hang separately.');
      expect(content()).toHaveTextContent('— attributed to Benjamin Franklin, upon signing the Declaration of Independence');

      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      expect(content()).toHaveTextContent('The Wager Fifty-Six Men Made With Their Signatures');
      const credit = content().querySelector('.pe-stack-credit a') as HTMLElement;
      expect(credit).toHaveTextContent('Emanuel Leutze, Washington Crossing the Delaware, 1851. The Metropolitan Museum of Art. Public domain.');
      expect(credit).toHaveAttribute('href', LEUTZE_SOURCE);
      expect(credit.querySelector('em')).toHaveTextContent('Washington Crossing the Delaware');

      const stockton = poster('poster2').items.findIndex((it) => it.type === 'paragraph' && it.text.includes('*wanted*'));
      for (let i = 2; i < stockton; i++) {
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        tick();
      }
      const ems = Array.from(content().querySelectorAll('em')).map((e) => e.textContent);
      expect(ems).toEqual(['wanted', 'needed']);
      expect(content().textContent).not.toContain('*');

      const callout = poster('poster2').items.findIndex((it) => it.type === 'callout');
      for (let i = stockton; i < callout; i++) {
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        tick();
      }
      expect(within(content()).getByRole('link', { name: /Meet the signers at the National Archives/ })).toHaveAttribute('href', NARA_SIGNERS_URL);
    });

    it('credits the first pull quote with the title in italics', () => {
      render(<PosterExhibition config={AMERICA_250} />);
      fireEvent.click(screen.getByRole('button', { name: /Before it was Sacred poster/ }));
      tick();
      const content = () => document.querySelector('.pe-walkthrough-content') as HTMLElement;
      const quote = poster('poster1').items.findIndex((it) => it.type === 'quote');
      for (let i = 0; i < quote; i++) {
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        tick();
      }
      expect(content().querySelector('.pe-quote-cite')).toHaveTextContent('— Verity Kahn, The Myth of the Declaration of Independence');
      expect(content().querySelector('.pe-quote-cite em')).toHaveTextContent('The Myth of the Declaration of Independence');
    });
  });
});

describe('The America 250 display case page', () => {
  it('keeps the record, with a card for each artifact, beside an empty case awaiting its photographs', () => {
    render(<America250Case />);
    expect(screen.getByRole('heading', { level: 1, name: 'America 250' })).toBeInTheDocument();
    // Every line of the record is kept: the objects' lines (each object a card) and the display's.
    expect(recordLines(AMERICA_250_CASE).map(plainText)).toEqual([
      'Hand-forged Valley Forge iron bolt',
      "18th-century gun wad Bible leaf from Christoph Saur II's Germantown Bible",
      "Original editions of The London Evening Post (carrying Howe's Declaration) and The London Chronicle",
      'Flat jersey shadow boxes with velvet risers, black mat LED lip lighting, and tethered magnifiers',
    ]);
    const cards = screen.getAllByRole('link', { name: /View artifact/ });
    expect(cards.map((c) => c.getAttribute('href'))).toEqual(AMERICA_250_CASE.artifacts.map((a) => artifactPath({ slug: AMERICA_250.slug }, a)));
    // The two newspapers share the record's line, and each is a card.
    expect(cards.slice(2).map((c) => c.querySelector('.pe-artifact-card-name em')?.textContent)).toEqual(['The London Evening Post', 'The London Chronicle']);
    // No installation photographs: an empty case, drawn, stands in for them.
    expect(AMERICA_250_CASE.photos).toHaveLength(0);
    expect(screen.getByText('Display case — photographs to come')).toBeInTheDocument();
    expect(JSON.stringify(AMERICA_250_CASE)).not.toMatch(/installation|\.jpg/);
    // The signing room opens from the case, under its Interactives tab.
    fireEvent.click(screen.getByRole('tab', { name: /Interactives/ }));
    expect(screen.getByRole('link', { name: /Put Your Name to It/ })).toHaveAttribute('href', '/exhibitions/america-250/sign');
    expect(screen.getByRole('link', { name: 'Return to Exhibition' })).toHaveAttribute('href', '/exhibitions/america-250');
  });
});
