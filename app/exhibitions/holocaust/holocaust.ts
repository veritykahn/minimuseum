import type { CSSProperties } from 'react';
import type { ApprovedFact } from '@/components/exhibition/FactNote';
import type { Atmosphere, CasePageData, ExhibitionConfig, PanelFigure } from '@/components/exhibition/types';
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
 * Poster 2 opens on its own title lettering, cut from the poster. Poster 1
 * does not: its lettering reads "NATIONAL HOLOCAUST MEMORIAL DAY", and the
 * approved name is "International Holocaust Remembrance Day" (decision 1),
 * so its title is set in type, in the poster's heavy condensed capitals.
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
export const STONES: PanelFigure = {
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

/** Poster 1's first two sentences: the walkthrough and Lay a Stone's countdown and walk (stones/) set them from here. */
export const REMEMBRANCE_LINE = 'International Holocaust Remembrance Day is observed annually on January 27 to commemorate the six million Jewish people who were murdered by the Nazi regime, as well as the millions of other victims who were persecuted.';
export const LIBERATION_LINE = 'The date marks the liberation of Auschwitz-Birkenau, the largest Nazi concentration and extermination camp, in 1945.';

/** Poster 2's quotation: the walkthrough and the memorial stone's room (stones/) both set it from here. */
export const NIEMOLLER = {
  text: '“First they came for the socialists, and I did not speak out—because I was not a socialist. Then they came for the trade unionists, and I did not speak out—because I was not a trade unionist. Then they came for the Jews, and I did not speak out—because I was not a Jew. Then they came for me—and there was no one left to speak for me.”',
  cite: '— Martin Niemöller',
};

/*
 * Lay a Stone's one note on the custom, beside "Lay a stone, to remember.":
 * not poster copy, but owner-approved and fact-checked, and set with its
 * source (My Jewish Learning).
 */
export const STONE_CUSTOM: ApprovedFact = {
  text: 'Many Jewish visitors place a small stone on a grave or memorial to show that someone has come and that the person is remembered. A stone lasts where flowers fade.',
  sources: [{ label: 'My Jewish Learning', href: 'https://www.myjewishlearning.com/article/ask-the-expert-stones-on-graves/' }],
};

/*
 * Poster 2's title as a picture: its own stone-grey lettering, cut from the
 * poster at the poster's resolution with the black keyed out
 * (public/exhibitions/holocaust/titles/). A sharper export of the same
 * lettering can replace the file at the same path; update its size here.
 * The cut stays on disk; the title is set in type (`live`, in the poster's
 * own face, drawn in the exhibition's stylesheet) so it is sharp on any screen.
 */
const TITLE_SIZES = {
  whatWasTheHolocaust: { width: 527, height: 193 },
};

/*
 * The walkthrough's atmospheres (holocaust.css draws them), each the setting
 * of a part of the story. All of them slow and still: light that comes and
 * goes over minutes, never a flicker.
 *   still-stone         memorials: a slab of grey stone, a slow light passing over it
 *   remembrance-stones  remembering: small stones set along a ledge, one by one
 *   first-light         the liberation, and the rescuers: a cold dawn coming up
 *   candle-vigil        remembrance, and the words of Martin Niemöller: one candle's light
 *   film-strip          the photographs: the edges of a strip of 35mm film
 *   barbed-wire         persecution, the ghettos and the camps: the posters' wire under a grey sky
 */
const ATMOSPHERES: Record<string, Atmosphere> = {
  'still-stone': { bg: '#d3ccc4', text: INK, title: INK, parts: 3 },
  'remembrance-stones': { bg: '#cfc8c0', text: INK, title: INK, parts: 2, particles: 14 },
  'first-light': { bg: '#16171a', text: PALE, title: STONE_LIGHT, parts: 3 },
  'candle-vigil': { bg: '#0d0b0a', text: PALE, title: STONE_LIGHT, parts: 3, particles: 6 },
  'film-strip': { bg: '#0b0a0a', text: PALE, title: STONE_LIGHT, parts: 3 },
  'barbed-wire': { bg: '#18191b', text: PALE, title: STONE_LIGHT, parts: 2, images: [{ src: '/exhibitions/holocaust/barbed-wire-cream.svg', className: 'ho-wire' }] },
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
  atmospheres: ATMOSPHERES,
  // The light comes up slowly as a poster opens; every other panel arrives its own way, quietly.
  fx: { theme: 'ho', veil: 'chapters', text: 'all' },
  projector: {
    theme: HOLOCAUST_PROJECTOR_THEME,
    links: [{ label: 'Lay a Stone: the memorial stone, a minute’s stillness, and the walk', href: '/exhibitions/holocaust/stones' }],
  },
  cases: [
    {
      href: '/exhibitions/holocaust/artifacts/case',
      label: 'Display Case',
      title: 'Artifacts',
    },
  ],
  // Each room's card shows the room itself: a screenshot of it (public/exhibitions/<slug>/rooms/).
  interactives: [
    {
      href: '/exhibitions/holocaust/stones',
      image: { src: '/exhibitions/holocaust/rooms/stones.webp', alt: 'The Lay a Stone room: stones laid along the ledge of a granite memorial in a dark room' },
      label: 'Interactive',
      title: 'Lay a Stone',
      subtitle: 'Stones laid by visitors, a minute’s stillness, and a walk',
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
          atmosphere: 'still-stone',
          effect: 'fade-in',
          text: 'International Holocaust Remembrance Day',
          lines: ['INTERNATIONAL', 'HOLOCAUST', 'REMEMBRANCE', 'DAY'],
        },
        { type: 'paragraph', section: 'body', atmosphere: 'remembrance-stones', effect: 'blur-to-sharp', figure: STONES, text: REMEMBRANCE_LINE },
        { type: 'paragraph', section: 'body', atmosphere: 'still-stone', effect: 'rise-expand', figure: commonsFigure(COMMONS_BERLIN, 'left'), text: 'By 1945, over 67% of the European Jewish population had been eradicated in an act of genocide.' },
        { type: 'paragraph', section: 'body', atmosphere: 'first-light', effect: 'kenburns-in', figure: BARRACKS, text: LIBERATION_LINE },
        { type: 'paragraph', section: 'body', atmosphere: 'remembrance-stones', effect: 'ink-spread', text: 'This day also honors those affected by subsequent genocides in Cambodia, Rwanda, Bosnia and Darfur.' },
        // The candles come up out of the dark, as the reveal brings them up (the theme's own entrance).
        { type: 'paragraph', section: 'body', atmosphere: 'candle-vigil', className: 'ho-glow', figure: commonsFigure(COMMONS_CANDLES, 'left'), text: 'It serves as a powerful reminder of the consequences of hatred, discrimination, and indifference, encouraging reflection, remembrance and a commitment to building a safer, more inclusive world.' },
        { type: 'section-title', section: 'close', atmosphere: 'candle-vigil', effect: 'split-reveal', text: 'Never Forget.' },
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
          type: 'title-image',
          section: 'title',
          atmosphere: 'barbed-wire',
          effect: 'fade-in',
          src: '/exhibitions/holocaust/titles/what-was-the-holocaust.png',
          ...TITLE_SIZES.whatWasTheHolocaust,
          framing: 'centered',
          live: { className: 'ho-live', lines: [{ text: 'WHAT WAS THE' }, { text: 'HOLOCAUST?' }] },
          alt: 'What Was the Holocaust?',
        },
        // A frame of film advances into the gate, as the reveal brings it (the theme's own entrance).
        { type: 'paragraph', section: 'body', atmosphere: 'film-strip', className: 'ho-advance', figure: FENCE, text: 'The Holocaust, also known as the *Shoah* (a Hebrew word meaning “catastrophe”), was the systematic persecution and murder of six million Jewish men, women, and children by Nazi Germany and its collaborators between 1933 and 1945.' },
        { type: 'paragraph', section: 'body', atmosphere: 'barbed-wire', effect: 'blur-to-sharp', text: 'While the Nazis specifically despised and persecuted Jews, other groups such as Roma, political prisoners, and people with disabilities were targeted.' },
        { type: 'paragraph', section: 'body', atmosphere: 'barbed-wire', effect: 'ink-spread', text: 'Before being deported to concentration and extermination camps, many Jewish people were confined to ghettos, overcrowded and walled-off sections of cities where living conditions were inhumane. Disease, starvation, and violence were rampant in ghettos such as those in Warsaw, Lodz, and Vilna.' },
        { type: 'paragraph', section: 'body', atmosphere: 'film-strip', effect: 'kenburns-in', figure: BLOCK_24A, text: 'Prisoners registered at Auschwitz had identification numbers tattooed on their arms, stripping them of their identities and humanity.' },
        { type: 'paragraph', section: 'body', atmosphere: 'first-light', effect: 'rise-expand', text: 'Despite the horrors, acts of bravery emerged as individuals and groups risked their lives to save Jews. These rescuers are honored as the *Righteous Among the Nations*, a title awarded by Yad Vashem, Israel’s Holocaust memorial, to recognize their courage and humanity in the face of unspeakable evil.' },
        {
          // The monument comes up under a lamp, as the reveal brings it (the theme's own entrance).
          type: 'full-image',
          section: 'monument',
          atmosphere: 'still-stone',
          src: COMMONS_BIRKENAU.src,
          alt: COMMONS_BIRKENAU.alt,
          text: creditFor(COMMONS_BIRKENAU),
          href: COMMONS_BIRKENAU.href,
        },
        {
          type: 'quote',
          section: 'quote',
          atmosphere: 'candle-vigil',
          effect: 'line-by-line',
          text: NIEMOLLER.text,
          cite: NIEMOLLER.cite,
        },
        { type: 'callout', section: 'link', atmosphere: 'candle-vigil', effect: 'film-credits', text: 'Learn more about the Holocaust at the United States Holocaust Memorial Museum', url: USHMM_URL },
        { type: 'end', section: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'The Righteous Among the Nations risked their lives to save Jews, and Martin Niemöller’s words describe what happens when no one speaks out. What helps a person find the courage to speak up for others?',
      },
    },
  ],
};

/*
 * The display case (artifacts/case) and a page for each object in it
 * (artifacts/case/<id>). Every word is the owner's: each name and record line
 * from the Mini Museum record. No sentence on either poster is about these
 * objects, so each page shows only its name and record line. The record's
 * line about the display itself is listed on the case page. Photographs and
 * 3D models are to come.
 */
export const HOLOCAUST_CASE: CasePageData = {
  label: 'Display Case',
  title: 'Artifacts',
  // Photographs to come: the case will be photographed anew.
  photos: [],
  artifacts: [
    {
      id: 'ghetto-scrip',
      name: '1 Krone Theresienstadt ghetto scrip',
      record: 'Original 1 Krone Theresienstadt ghetto scrip',
    },
    {
      id: 'mezuzah',
      name: 'Replica brass mezuzah',
      record: 'Replica of a brass mezuzah recovered in Warsaw by a survivor',
    },
    {
      id: 'shabbat-candle-holders',
      name: 'Shabbat candle holders',
      record: 'Traditional brass and pottery Shabbat candle holders',
    },
  ],
  display: ['Educational panels on Holocaust history, resistance, and international memorialization'],
};
