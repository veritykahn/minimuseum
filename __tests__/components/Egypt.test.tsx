import { artifactPath, plainText, recordLines } from '@/components/exhibition/artifacts';
import { isAddedPanel } from '@/components/exhibition/helpers';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { posterChapters } from '@/components/projector/posterTalk';
import { BM_EGYPT_URL, BM_GODS_URL, EGYPT, EGYPT_CASE } from '@/app/exhibitions/egypt/egypt';
import EgyptCase from '@/app/exhibitions/egypt/artifacts/case/page';

/*
 * Ancient Egypt: its config, the poster copy against the transcription (with
 * only the approved US spellings changed), the gods' chapters and pictures,
 * the links, and the display case page.
 */

const allItems = EGYPT.posters.flatMap((p) => p.items);
const textOf = (id: string, from: number, to: number) => {
  const p = EGYPT.posters.find((x) => x.id === id)!;
  return p.items
    .slice(from, to)
    .filter((it) => it.type === 'paragraph' && !isAddedPanel(it))
    .map((it) => ('text' in it ? it.text : ''))
    .join(' ');
};
const tick = (ms = 400) => act(() => { jest.advanceTimersByTime(ms); });

/** The posters' paragraphs exactly as printed (from the transcription). */
const PRINTED = {
  poster1:
    'The civilisation of ancient Egypt lasted for over three thousand years and was located in northeastern Africa along the river Nile. The ancient Egyptians left behind a legacy of impressive monuments, such as pyramids and temples – and invented hieroglyphic writing. It is thanks to the Rosetta Stone – a broken slab of a decree that was written in three scripts and allowed us to decipher hieroglyphs – that we have so much information about this fascinating, ancient civilization.',
  poster2Intro:
    'Ancient Egyptian culture was highly ritualized and concentrated much of its attention on birth and death rituals where a rich pantheon of gods controlled much of their world. Each of these gods and goddesses had their own role to play in maintaining peace and harmony across the land. ' +
    'Some gods took part in creation and others brought a flood every year, which was important for growing crops. Some offered protection while others took care of people after they died. There were local gods who represented towns and minor gods who represented plants or animals. And a few gods were very dangerous! The ancient Egyptians believed that it was important to recognise and worship these gods and goddesses so that life would continue smoothly.',
  Anubis:
    'Anubis was the god of mummification, the afterlife and the dead. He is portrayed as a man with the head of a jackal or as a full jackal. Despite his powerful and important role, Anubis was also seen as a gentle and caring god who took great care in ensuring that the dead were treated with respect.',
  Bastet:
    'Bastet was the goddess of cats, fertility (new life) and childbirth, and often associated with joy and dance. She is depicted with the head of a cat and the body of a human. She was often worshipped by Egyptians, who considered cats to be sacred animals. Her image was used as a symbol of good luck and protection.',
  Horus:
    'Horus was the god of the sky, war and hunting. He was associated with the pharaohs and was often depicted as their protector and defender. Portrayed as a man with the head of a falcon, or just as a falcon, Horus was worshipped throughout Egypt as a just and fair god who protected the people of Egypt and maintained order and balance.',
  Isis:
    "Isis was the goddess of protection, motherhood and magic. She is depicted as a woman with the hieroglyph for 'throne' worn as a crown and is the mother of Horus. Stories of Isis attributed the cause of the annual Nile floods to her tears as she cried for her dead husband Osiris. Ancient Egyptians believed that she could perform magic and heal the sick.",
};
/** The only changes the owner approved. */
const approved = (s: string) => s.replace('civilisation', 'civilization').replace('recognise', 'recognize');

const GODS = ['Anubis', 'Bastet', 'Horus', 'Isis'] as const;

describe('Ancient Egypt', () => {
  it('has two posters, each ending with Return to Exhibition, and one display case', () => {
    expect(EGYPT.slug).toBe('egypt');
    expect(EGYPT.posters.map((p) => p.id)).toEqual(['poster1', 'poster2']);
    expect(EGYPT.posters.map((p) => p.title)).toEqual(['The Mysteries of Ancient Egypt', 'Gods and Goddesses of Ancient Egypt']);
    for (const p of EGYPT.posters) expect(p.items[p.items.length - 1].type).toBe('end');
    expect(EGYPT.cases).toHaveLength(1);
    expect(EGYPT.cases?.[0].href).toBe('/exhibitions/egypt/artifacts/case');
  });

  it('goes back to the ground floor, as its second Origins room', () => {
    expect(EGYPT.back).toEqual({ href: '/exhibitions/ground-floor', label: 'Ground Floor', remember: { key: 'groundFloorIndex', value: '1' } });
  });

  it('sets the poster copy exactly as printed, split only between sentences, with only the approved spellings changed', () => {
    const p2 = EGYPT.posters[1].items;
    const at = (name: string) => p2.findIndex((it) => it.type === 'section-title' && it.text === name);
    expect(textOf('poster1', 0, Infinity)).toBe(approved(PRINTED.poster1));
    expect(textOf('poster2', 0, at('Anubis'))).toBe(approved(PRINTED.poster2Intro));
    GODS.forEach((god, i) => {
      const end = i < GODS.length - 1 ? at(GODS[i + 1]) : p2.length;
      expect(textOf('poster2', at(god), end)).toBe(PRINTED[god]);
    });
    // every panel break falls between sentences
    for (const it of allItems) if (it.type === 'paragraph') expect(it.text).toMatch(/[.!?]"?$/);
  });

  it('uses US spellings', () => {
    const text = allItems.map((it) => ('text' in it ? it.text : '')).join('\n');
    expect(text).toMatch(/civilization/);
    expect(text).toMatch(/recognize/);
    expect(text).not.toMatch(/civilisation|recognise|colour|honour/);
  });

  it('gives each god a chapter of its own, under its name, with its picture', () => {
    const p2 = EGYPT.posters[1];
    const titles = p2.items.filter((it) => it.type === 'section-title').map((it) => ('text' in it ? it.text : ''));
    expect(titles).toEqual([...GODS]);
    for (const god of GODS) {
      const i = p2.items.findIndex((it) => it.type === 'section-title' && it.text === god);
      const next = p2.items[i + 1];
      expect(next.type).toBe('paragraph');
      if (next.type !== 'paragraph') continue;
      expect(next.figure?.src).toBe(`/exhibitions/egypt/${god.toLowerCase()}.jpg`);
      expect(next.figure?.alt).toMatch(new RegExp(`^${god} `));
      expect(next.text.startsWith(`${god} was the`)).toBe(true);
    }
  });

  it.each(EGYPT.posters.map((p) => [p.id, p] as const))('%s: one question per chapter, and none left over', (_id, p) => {
    const chapters = posterChapters(p.items.map((it) => ({ type: it.type, text: 'text' in it ? it.text : undefined })), p.title);
    expect(chapters.length).toBeGreaterThan(0);
    expect(Object.keys(p.talk).sort()).toEqual(chapters.map((c) => c.key).sort());
    for (const c of chapters) expect(p.talk[c.key]).toMatch(/\?$/);
  });

  it('links the British Museum where the posters have QR codes', () => {
    const links = allItems.flatMap((it) => (it.type === 'callout' && it.url ? [{ text: it.text, url: it.url }] : []));
    expect(links).toEqual([
      { text: "Take a tour of the British Museum's Egyptian collection", url: BM_EGYPT_URL },
      { text: 'Learn more about Egyptian Gods and Goddesses', url: BM_GODS_URL },
    ]);
    expect(BM_EGYPT_URL).toBe('https://www.britishmuseum.org/collection/egypt');
    expect(BM_GODS_URL).toBe('https://www.britishmuseum.org/learn/schools/ages-7-11/ancient-egypt/ancient-egyptian-gods-and-goddesses');
    const text = allItems.map((it) => ('text' in it ? it.text : '')).join('\n');
    expect(text).not.toMatch(/Scan|QR/);
  });

  it('every picture has alt text', () => {
    for (const p of EGYPT.posters) expect(p.hero.alt).toBeTruthy();
    for (const it of allItems) if (it.type === 'paragraph' && it.figure) expect(it.figure.alt).toBeTruthy();
    for (const c of EGYPT.cases ?? []) expect(c.image).toBeUndefined();
  });

  describe('the walkthrough', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      window.history.replaceState(null, '', '/');
    });
    afterEach(() => jest.useRealTimers());

    it('opens on the title, and sets each god beside its picture', () => {
      render(<PosterExhibition config={EGYPT} />);
      expect(screen.getByRole('heading', { level: 1, name: 'Ancient Egypt' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /display case/i })).toHaveAttribute('href', '/exhibitions/egypt/artifacts/case');
      expect(screen.getByRole('link', { name: 'Ground Floor' })).toHaveAttribute('href', '/exhibitions/ground-floor');

      fireEvent.click(screen.getByRole('button', { name: /Gods and Goddesses of Ancient Egypt poster/ }));
      tick();
      const content = () => document.querySelector('.pe-walkthrough-content') as HTMLElement;
      expect(within(content()).getByRole('heading', { level: 2 })).toHaveTextContent('Gods and Goddesses of');
      expect(within(content()).getByRole('heading', { level: 2 })).toHaveTextContent('Ancient Egypt');

      const anubis = EGYPT.posters[1].items.findIndex((it) => it.type === 'section-title' && it.text === 'Anubis');
      for (let i = 0; i < anubis; i++) {
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        tick();
      }
      expect(within(content()).getByRole('heading', { level: 2, name: 'Anubis' })).toBeInTheDocument();
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      expect(within(content()).getByRole('img', { name: /^Anubis in the Egyptian style/ })).toHaveAttribute('src', '/exhibitions/egypt/anubis.jpg');
      expect(content().textContent?.replace(/\s+/g, ' ')).toContain('Anubis was the god of mummification');
    });
  });
});

describe('The Ancient Egypt display case page', () => {
  it('keeps the record, with a card for each artifact, beside an empty case awaiting its photographs', () => {
    render(<EgyptCase />);
    expect(screen.getByRole('heading', { level: 1, name: 'Ancient Egypt' })).toBeInTheDocument();
    // Every line of the record is kept: the objects' lines (each object a card) and the display's.
    expect(recordLines(EGYPT_CASE).map(plainText)).toEqual([
      'Hand-crafted replica Bastet statue, goddess of protection and cats',
      'Replica Anubis statue, god of mummification, and a scarab beetle amulet',
      'Display panels covering Egyptian pantheon mythology, with QR links to digital collections',
    ]);
    const cards = screen.getAllByRole('link', { name: /View artifact/ });
    expect(cards.map((c) => c.getAttribute('href'))).toEqual(EGYPT_CASE.artifacts.map((a) => artifactPath({ slug: EGYPT.slug }, a)));
    // No installation photographs: an empty case, drawn, stands in for them.
    expect(EGYPT_CASE.photos).toHaveLength(0);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
    expect(screen.getByText('Display case — photographs to come')).toBeInTheDocument();
    expect(JSON.stringify([EGYPT, EGYPT_CASE])).not.toMatch(/installation|case(-thumb|-table)?\.jpg|microscopes?(-sands)?\.jpg|sand-specimens\.jpg|moon-dust\.jpg/);
    expect(screen.getByRole('link', { name: 'Return to Exhibition' })).toHaveAttribute('href', '/exhibitions/egypt');
    expect(screen.getByRole('link', { name: 'Exhibition' })).toHaveAttribute('href', '/exhibitions/egypt');
  });
});
