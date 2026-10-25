import type { CSSProperties } from 'react';
import type { CasePageData, ExhibitionConfig, PanelFigure } from '@/components/exhibition/types';
import { floorReturnFor } from '@/lib/floors';

/*
 * Holocaust Memorial Day: every word on screen, and the look.
 *
 * The poster copy is set exactly as printed on the two posters, with only the
 * owner's approved decisions:
 *   1. the day is named "International Holocaust Remembrance Day" in poster
 *      1's title and its first sentence (the exhibition itself keeps its
 *      name, "Holocaust Memorial Day");
 *   2. "Jews deported to camps like Auschwitz often had identification
 *      numbers tattooed on their arms, …" is set "Prisoners registered at
 *      Auschwitz had identification numbers tattooed on their arms, …";
 *   3. from the posters only the neutral pictures are used: the barbed wire
 *      and the Star of David (drawn here), the stones on the memorial stone,
 *      the Auschwitz barracks and fence, and Block 24a. The survivor's
 *      tattooed arm, the photograph of Menashe Kadishman's Fallen Leaves and
 *      the candles on the Israeli flag are not used; in their place are three
 *      freely licensed photographs from Wikimedia Commons, each credited with
 *      its author and license and linked to its file page;
 *   4. poster 2's QR code is a link to the Holocaust Encyclopedia of the
 *      United States Holocaust Memorial Museum.
 * Typesetting only: the date is written in US style ("January 27"). "*…*"
 * marks italics; the posters set *Shoah* and *Righteous Among the Nations*
 * in bold italics, which holocaust.css follows.
 *
 * Each sentence lives in one place below, so a fix to the posters is a
 * one-line edit here. Paragraphs are split only between sentences; nothing is
 * reworded.
 *
 * The "Talk about it" questions are for the projector's teacher strip: open
 * questions about remembrance, courage and speaking up, one per chapter,
 * keyed by the section title exactly as it is set (OPENING, '', is the panels
 * before the first section title). They make no factual claims, and never ask
 * students to imagine themselves as victims or perpetrators.
 */

// The posters' palette: a warm grey stone ground, near-black type; black, with stone-grey titles and cream wire.
const STONE = '#D8D1CA';
/* Poster 1's type: a warm near-black, 12.4:1 on the stone. */
const INK = '#1F1C1A';
const BLACK = '#0B0A0A';
/* Poster 2's title: the stone grey, 12.9:1 on the black. */
const STONE_LIGHT = '#D6CFC7';
/* Poster 2's copy: a pale stone, 15:1 on the black. */
const PALE = '#ECE7E1';

/* Titles: a heavy condensed grotesque, all capitals (Anton). */
const DISPLAY = "'Anton', 'Impact', 'Haettenschweiler', 'Arial Narrow Bold', sans-serif";
/* Copy: a plain grotesque (Inter). */
const SANS = "'Inter', 'Helvetica Neue', Arial, sans-serif";
/* The Niemöller quotation is set in a tall condensed capital face (League Gothic), loaded below; holocaust.css sets it as --ho-tall. */

export const USHMM_URL = 'https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust';

/** A freely licensed photograph from Wikimedia Commons, credited as its file page gives it. */
export type CommonsPicture = { src: string; alt: string; author: string; title: string; license: string; href: string };

export const COMMONS_CANDLES: CommonsPicture = {
  src: '/exhibitions/holocaust/commons-candles.jpg',
  alt: 'Two long rows of lit memorial candles in white cups, glowing softly against a dark wall',
  author: 'Ted Eytan',
  title: 'Holocaust Day',
  license: 'CC BY-SA 2.0',
  href: 'https://commons.wikimedia.org/wiki/File:Holocaust_Day.jpg',
};
export const COMMONS_BERLIN: CommonsPicture = {
  src: '/exhibitions/holocaust/commons-berlin-memorial.jpg',
  alt: 'The Memorial to the Murdered Jews of Europe in Berlin: rows of plain grey concrete blocks of different heights on a cobbled ground, with autumn trees beyond',
  author: 'Dietmar Rabich',
  title: 'Berlin, Denkmal für die ermordeten Juden Europas -- 2011 -- 2415',
  license: 'CC BY-SA 4.0',
  href: 'https://commons.wikimedia.org/wiki/File:Berlin,_Denkmal_f%C3%BCr_die_ermordeten_Juden_Europas_--_2011_--_2415.jpg',
};
export const COMMONS_BIRKENAU: CommonsPicture = {
  src: '/exhibitions/holocaust/commons-birkenau-monument.jpg',
  alt: 'The International Monument at Auschwitz II-Birkenau: dark carved stone blocks beneath a tall stone slab, under a grey sky, with bare trees and pale banners behind',
  author: 'Danielle Jansen',
  title: 'International Monument Auschwitz II-Birkenau 08',
  license: 'CC BY-SA 4.0',
  href: 'https://commons.wikimedia.org/wiki/File:International_Monument_Auschwitz_II-Birkenau_08.jpg',
};
export const COMMONS_PICTURES = [COMMONS_CANDLES, COMMONS_BERLIN, COMMONS_BIRKENAU];

/** The credit line: author, *title*, license, via Wikimedia Commons. */
export const creditFor = (p: CommonsPicture) => `${p.author}, *${p.title}*. ${p.license}, via Wikimedia Commons`;
const commonsFigure = (p: CommonsPicture, side: PanelFigure['side']): PanelFigure => ({
  src: p.src,
  alt: p.alt,
  side,
  credit: { text: creditFor(p), href: p.href },
});

/* From the posters: the neutral photographs only (approved decision 3). */
const STONES: PanelFigure = {
  src: '/exhibitions/holocaust/poster-stones.jpg',
  alt: 'Small stones laid along the top of a granite memorial stone carved with a Star of David',
  side: 'right',
};
const BARRACKS: PanelFigure = {
  src: '/exhibitions/holocaust/poster-barracks.jpg',
  alt: 'A path at Auschwitz between two rows of barbed-wire fence on curved concrete posts, brick barracks either side and a watchtower at the end',
  side: 'right',
};
const FENCE: PanelFigure = {
  src: '/exhibitions/holocaust/poster-fence.jpg',
  alt: 'A barbed-wire fence on curved concrete posts running between rows of brick barracks at Auschwitz, under a pale sky',
  side: 'right',
};
const BLOCK_24A: PanelFigure = {
  src: '/exhibitions/holocaust/poster-block-24a.jpg',
  alt: 'A black-and-white photograph of a brick wall at Auschwitz with a sign reading Block 24a and a lamp beside a doorway',
  side: 'left',
};

export const HOLOCAUST_PROJECTOR_THEME = {
  '--pj-bg': STONE,
  '--pj-ink': INK,
  '--pj-muted': '#4A443F',
  '--pj-accent': INK,
  '--pj-on-accent': STONE,
  '--pj-display': DISPLAY,
  '--pj-body': SANS,
} as CSSProperties;

export const HOLOCAUST: ExhibitionConfig<'poster1' | 'poster2'> = {
  slug: 'holocaust',
  name: 'Holocaust Memorial Day',
  subtitle: 'Never Forget',
  fonts: {
    href: 'https://fonts.googleapis.com/css2?family=Anton&family=League+Gothic&family=Inter:ital,wght@0,400;0,500;0,700;1,400;1,700&display=swap',
    display: DISPLAY,
    body: SANS,
    ui: SANS,
  },
  palette: {
    page: STONE,
    heading: INK,
    accent: INK,
    teach: { color: INK, border: 'rgba(31,28,26,0.55)' },
  },
  back: floorReturnFor('holocaust'),
  fx: { theme: 'ho', veil: 'chapters', text: 'all' },
  projector: { theme: HOLOCAUST_PROJECTOR_THEME, links: [] },
  cases: [
    {
      href: '/exhibitions/holocaust/artifacts/case',
      emblem: 'Display case — photographs to come',
      label: 'Display Case',
      title: 'Artifacts',
      subtitle: 'Photographs to come',
    },
  ],
  credits: COMMONS_PICTURES.map((p) => ({ text: creditFor(p), href: p.href })),
  posters: [
    // ============================================
    // POSTER 1: International Holocaust Remembrance Day
    // ============================================
    {
      id: 'poster1',
      title: 'International Holocaust Remembrance Day',
      hero: {
        src: '/exhibitions/holocaust/poster1.jpg',
        alt: 'National Holocaust Memorial Day poster: the title in heavy near-black condensed capitals on a warm grey ground, under a line of barbed wire with a Star of David; two paragraphs of text and the words Never Forget; down the right side, a black film strip of photographs: stones on a memorial stone, the barracks at Auschwitz, candles, and a sculpture of metal faces',
      },
      colors: { bg: STONE, text: INK, title: INK },
      sections: {
        title: { className: 'ho-p1 ho-title' },
        body: { className: 'ho-p1 ho-body' },
        close: { className: 'ho-p1 ho-close' },
        end: { className: 'ho-p1' },
      },
      items: [
        {
          type: 'title-text',
          section: 'title',
          text: 'International Holocaust Remembrance Day',
          lines: ['INTERNATIONAL', 'HOLOCAUST', 'REMEMBRANCE', 'DAY'],
        },
        { type: 'paragraph', section: 'body', className: 'ho-lamp', figure: STONES, text: 'International Holocaust Remembrance Day is observed annually on January 27 to commemorate the six million Jewish people who were murdered by the Nazi regime, as well as the millions of other victims who were persecuted.' },
        { type: 'paragraph', section: 'body', className: 'ho-advance', figure: commonsFigure(COMMONS_BERLIN, 'left'), text: 'By 1945, over 67% of the European Jewish population had been eradicated in an act of genocide.' },
        { type: 'paragraph', section: 'body', className: 'ho-lamp', figure: BARRACKS, text: 'The date marks the liberation of Auschwitz-Birkenau, the largest Nazi concentration and extermination camp, in 1945.' },
        { type: 'paragraph', section: 'body', text: 'This day also honors those affected by subsequent genocides in Cambodia, Rwanda, Bosnia and Darfur.' },
        { type: 'paragraph', section: 'body', className: 'ho-glow', figure: commonsFigure(COMMONS_CANDLES, 'left'), text: 'It serves as a powerful reminder of the consequences of hatred, discrimination, and indifference, encouraging reflection, remembrance and a commitment to building a safer, more inclusive world.' },
        { type: 'section-title', section: 'close', text: 'Never Forget.' },
        { type: 'end', section: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'The poster names hatred, discrimination, and indifference. What everyday choices can people make to help build a safer, more inclusive world?',
        'Never Forget.': 'What are some of the ways people and communities keep the memory of the past alive, and why do you think remembering matters?',
      },
    },

    // ============================================
    // POSTER 2: What Was the Holocaust?
    // ============================================
    {
      id: 'poster2',
      title: 'What Was the Holocaust?',
      hero: {
        src: '/exhibitions/holocaust/poster2.jpg',
        alt: 'What Was the Holocaust? poster: the title in stone-grey condensed capitals on black, under a cream line of barbed wire with a Star of David; a QR code; two paragraphs of text; photographs in 35mm film frames of the barbed-wire fence and barracks at Auschwitz, the sign for Block 24a, and a survivor’s forearm; and the words of Martin Niemöller in tall condensed capitals',
      },
      colors: { bg: BLACK, text: PALE, title: STONE_LIGHT },
      sections: {
        title: { className: 'ho-p2 ho-title' },
        body: { className: 'ho-p2 ho-body' },
        monument: { className: 'ho-p2 ho-monument' },
        quote: { className: 'ho-p2 ho-quote' },
        link: { className: 'ho-p2 ho-link' },
        end: { className: 'ho-p2' },
      },
      items: [
        {
          type: 'title-text',
          section: 'title',
          text: 'What Was the Holocaust?',
          lines: ['WHAT WAS THE', 'HOLOCAUST?'],
        },
        { type: 'paragraph', section: 'body', className: 'ho-advance', figure: FENCE, text: 'The Holocaust, also known as the *Shoah* (a Hebrew word meaning “catastrophe”), was the systematic persecution and murder of six million Jewish men, women, and children by Nazi Germany and its collaborators between 1933 and 1945.' },
        { type: 'paragraph', section: 'body', text: 'While the Nazis specifically despised and persecuted Jews, other groups such as Roma, political prisoners, and people with disabilities were targeted.' },
        { type: 'paragraph', section: 'body', text: 'Before being deported to concentration and extermination camps, many Jewish people were confined to ghettos, overcrowded and walled-off sections of cities where living conditions were inhumane. Disease, starvation, and violence were rampant in ghettos such as those in Warsaw, Lodz, and Vilna.' },
        { type: 'paragraph', section: 'body', className: 'ho-advance', figure: BLOCK_24A, text: 'Prisoners registered at Auschwitz had identification numbers tattooed on their arms, stripping them of their identities and humanity.' },
        { type: 'paragraph', section: 'body', text: 'Despite the horrors, acts of bravery emerged as individuals and groups risked their lives to save Jews. These rescuers are honored as the *Righteous Among the Nations*, a title awarded by Yad Vashem, Israel’s Holocaust memorial, to recognize their courage and humanity in the face of unspeakable evil.' },
        {
          type: 'full-image',
          section: 'monument',
          src: COMMONS_BIRKENAU.src,
          alt: COMMONS_BIRKENAU.alt,
          text: creditFor(COMMONS_BIRKENAU),
          href: COMMONS_BIRKENAU.href,
        },
        {
          type: 'quote',
          section: 'quote',
          text: '“First they came for the socialists, and I did not speak out—because I was not a socialist. Then they came for the trade unionists, and I did not speak out—because I was not a trade unionist. Then they came for the Jews, and I did not speak out—because I was not a Jew. Then they came for me—and there was no one left to speak for me.”',
          cite: '— Martin Niemöller',
        },
        { type: 'callout', section: 'link', text: 'Learn more about the Holocaust at the United States Holocaust Memorial Museum', url: USHMM_URL },
        { type: 'end', section: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'The Righteous Among the Nations risked their lives to save Jews, and Martin Niemöller’s words describe what happens when no one speaks out. What helps a person find the courage to speak up for others?',
      },
    },
  ],
};

/*
 * The display case page (artifacts/case). The artifacts are listed exactly as
 * the Mini Museum record lists them. There are no photographs yet: the owner
 * will photograph the case afresh, so the page holds a placeholder.
 */
export const HOLOCAUST_CASE: CasePageData = {
  label: 'Display Case',
  title: 'Artifacts',
  subtitle: 'Photographs of the installation',
  photos: [],
  placeholder: 'Display case — photographs to come',
  artifacts: [
    'Original 1 Krone Theresienstadt ghetto scrip',
    'Replica of a brass mezuzah recovered in Warsaw by a survivor',
    'Traditional brass and pottery Shabbat candle holders',
    'Educational panels on Holocaust history, resistance, and international memorialization',
  ],
};
