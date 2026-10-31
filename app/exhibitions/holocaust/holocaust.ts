import type { CSSProperties } from 'react';
import type { ApprovedFact, FactSource } from '@/components/exhibition/FactNote';
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
 * The museum's additions: panels set beside the printed copy, never in it,
 * each owner-approved, every fact checked against its source and cited
 * beneath it (`sources`). They stand in their own section ('added'), styled
 * as the copy around them, so the printed words stay whole and countable.
 * They follow USHMM's guidelines for teaching the Holocaust: people before
 * numbers, the history in context, nothing graphic, and no prompt to imagine
 * being a victim or a perpetrator. "[S]" marks a source seen only in a search
 * excerpt (Yad Vashem blocked reading it), kept by the owner's decision, to
 * be checked in a browser.
 */
const ushmm = (title: string, slug: string): FactSource => ({ label: `USHMM Holocaust Encyclopedia, “${title}”`, href: `https://encyclopedia.ushmm.org/content/en/article/${slug}` });
/* HMD's own addresses: its life stories at hmd.org.uk, its other pages at www.hmd.org.uk. */
const hmd = (title: string, href: string): FactSource => ({ label: `Holocaust Memorial Day Trust, “${title}”`, href });
const SRC = {
  ihrd: ushmm('International Holocaust Remembrance Day', 'international-holocaust-remembrance-day'),
  jewishLife: ushmm('Jewish Life in Europe before the Holocaust', 'jewish-life-in-europe-before-the-holocaust'),
  intro: ushmm('Introduction to the Holocaust', 'introduction-to-the-holocaust'),
  auschwitz: ushmm('Auschwitz', 'auschwitz'),
  bookBurning: ushmm('Book Burning', 'book-burning'),
  nuremberg: ushmm('The Nuremberg Race Laws', 'the-nuremberg-race-laws'),
  // The owner's decision: USHMM's "more than 1,400 synagogues" (HMD's Nicholas Winton page gives 267 destroyed; only one figure is used).
  kristallnacht: ushmm('Kristallnacht', 'kristallnacht'),
  roma: ushmm('Genocide of European Roma (Gypsies), 1939–1945', 'genocide-of-european-roma-gypsies-1939-1945'),
  euthanasia: ushmm('Euthanasia Program', 'euthanasia-program'),
  warsawUprising: ushmm('Warsaw Ghetto Uprising', 'warsaw-ghetto-uprising'),
  theresienstadt: ushmm('Theresienstadt', 'theresienstadt'),
  scrip: { label: 'USHMM Collections, “Theresienstadt ghetto-labor camp scrip, 1 krone note”', href: 'https://collections.ushmm.org/search/catalog/irn548074' },
  children: ushmm('Children during the Holocaust', 'children-during-the-holocaust'),
  kindertransport: ushmm('Kindertransport, 1938–40', 'kindertransport-1938-40'),
  anneFrankBio: ushmm('Anne Frank Biography', 'anne-frank-biography'),
  denmark: ushmm('Rescue in Denmark', 'rescue-in-denmark'),
  leChambon: ushmm('Le Chambon-sur-Lignon', 'le-chambon-sur-lignon'),
  displacedPersons: ushmm('Displaced Persons', 'displaced-persons'),
  cambodia: hmd('Cambodia', 'https://www.hmd.org.uk/learn-about-the-holocaust-and-genocides/cambodia/'),
  rwanda: hmd('Rwanda', 'https://www.hmd.org.uk/learn-about-the-holocaust-and-genocides/rwanda/'),
  bosnia: hmd('Bosnia', 'https://www.hmd.org.uk/learn-about-the-holocaust-and-genocides/bosnia/'),
  darfur: hmd('Darfur', 'https://www.hmd.org.uk/learn-about-the-holocaust-and-genocides/darfur/'),
  whatIsGenocide: hmd('What is genocide?', 'https://www.hmd.org.uk/learn-about-the-holocaust-and-genocides/what-is-genocide/'),
  whatIsHmd: hmd('What is Holocaust Memorial Day?', 'https://www.hmd.org.uk/what-is-holocaust-memorial-day/'),
  stockholm: hmd('The Stockholm Declaration', 'https://www.hmd.org.uk/what-is-holocaust-memorial-day/the-stockholm-declaration/'),
  stevenFrank: hmd('Steven Frank', 'https://hmd.org.uk/resource/steven-frank/'),
  annaLehnkering: hmd('Anna Lehnkering', 'https://hmd.org.uk/resource/anna-lehnkering/'),
  anneFrankHmd: hmd('Anne Frank', 'https://hmd.org.uk/resource/anne-frank/'),
  niemoller: hmd('Pastor Martin Niemöller', 'https://hmd.org.uk/resource/pastor-martin-niemoller-hmd-2021/'),
  wiesel: hmd('Elie Wiesel', 'https://hmd.org.uk/resource/elie-wiesel-hmd-2017/'),
  whoWasAnne: { label: 'Anne Frank House, “Who was Anne Frank?”', href: 'https://www.annefrank.org/en/anne-frank/who-was-anne-frank/' },
  /* [S] */
  yvRighteous: { label: 'Yad Vashem, “The Righteous Among the Nations”', href: 'https://www.yadvashem.org/righteous/stories.html' },
  /* [S] */
  yv2024: { label: 'Yad Vashem, “Highlights of Yad Vashem’s Activities in 2024”', href: 'https://www.yadvashem.org/pressroom/highlights/2024.html' },
} satisfies Record<string, FactSource>;

/* Poster 2's chapters, the museum's own (the printed poster has none). */
export const STEP_BY_STEP = 'Step by step';
export const CHILDREN = 'Children';
export const RESCUE = 'Rescue';
export const AFTER = 'After';

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
    links: [{ label: 'Never Forget: lay a stone, keep a minute’s stillness, walk the path', href: '/exhibitions/holocaust/stones' }],
    teachNote: 'Recommended for grades 6 and up; for younger students, preview first and stay with them.',
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
      image: { src: '/exhibitions/holocaust/rooms/stones.webp', alt: 'The Never Forget room: stones laid along the ledge of a granite memorial in a dark room' },
      label: 'Interactive',
      // Was "Lay a Stone". The subtitle carries the room's three parts, so the card does not read as a repeat of poster 1's close, "Never Forget."
      title: 'Never Forget',
      subtitle: 'Lay a stone, keep a minute’s stillness, walk the path',
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
        added: { className: 'ho-p1 ho-body ho-added' },
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
        // Why "international".
        { type: 'paragraph', section: 'added', atmosphere: 'still-stone', effect: 'typewriter', position: 'top-left', text: 'On November 1, 2005, the United Nations General Assembly chose January 27 as International Holocaust Remembrance Day. The first ceremony was held at the UN Headquarters in New York on January 27, 2006.', sources: [SRC.ihrd] },
        // The people before the number ("Translate Statistics Into People").
        { type: 'paragraph', section: 'added', atmosphere: 'remembrance-stones', effect: 'line-by-line', position: 'top-right', text: 'Jews had lived in Europe for more than two thousand years. In 1933, about 9 million Jewish people lived there, in big cities and small villages, with their own schools, music, languages and traditions.', sources: [SRC.jewishLife, SRC.intro] },
        { type: 'paragraph', section: 'body', atmosphere: 'still-stone', effect: 'rise-expand', figure: commonsFigure(COMMONS_BERLIN, 'left'), text: 'By 1945, over 67% of the European Jewish population had been eradicated in an act of genocide.' },
        { type: 'paragraph', section: 'body', atmosphere: 'first-light', effect: 'kenburns-in', figure: BARRACKS, text: LIBERATION_LINE },
        { type: 'paragraph', section: 'added', atmosphere: 'first-light', effect: 'fade-in', position: 'bottom-left', text: 'On January 27, 1945, Soviet troops liberated about 7,000 prisoners from Auschwitz. About 1.1 million people were murdered there, about one million of them Jews.', sources: [SRC.auschwitz] },
        { type: 'paragraph', section: 'body', atmosphere: 'remembrance-stones', effect: 'ink-spread', text: 'This day also honors those affected by subsequent genocides in Cambodia, Rwanda, Bosnia and Darfur.' },
        {
          type: 'paragraph',
          section: 'added',
          atmosphere: 'remembrance-stones',
          effect: 'blur-to-sharp',
          position: 'top-left',
          text: 'Each of these places has its own history. In Cambodia, from 1975, the Khmer Rouge regime caused the deaths of well over two million people. In Rwanda in 1994, about one million people were murdered in 100 days. In July 1995, about 8,000 Bosnian Muslim men and boys were murdered at Srebrenica. In Darfur, Sudan, from 2003, villages were destroyed and about 2.5 million people were forced from their homes.',
          sources: [SRC.cambodia, SRC.rwanda, SRC.bosnia, SRC.darfur],
        },
        { type: 'paragraph', section: 'added', atmosphere: 'still-stone', effect: 'drift', position: 'bottom-right', text: 'The Holocaust Memorial Day Trust reminds us: “Genocide never just happens. There is always a set of circumstances which occur or which are created to build the climate in which genocide can take place.”', sources: [SRC.whatIsGenocide] },
        // The candles come up out of the dark, as the reveal brings them up (the theme's own entrance).
        { type: 'paragraph', section: 'body', atmosphere: 'candle-vigil', className: 'ho-glow', figure: commonsFigure(COMMONS_CANDLES, 'left'), text: 'It serves as a powerful reminder of the consequences of hatred, discrimination, and indifference, encouraging reflection, remembrance and a commitment to building a safer, more inclusive world.' },
        { type: 'paragraph', section: 'added', atmosphere: 'candle-vigil', effect: 'rise-expand', position: 'top-right', text: 'Every year on Holocaust Memorial Day, people across the UK light a candle in their window “to remember those murdered and to stand against hatred today.”', sources: [SRC.whatIsHmd] },
        { type: 'section-title', section: 'close', atmosphere: 'candle-vigil', effect: 'split-reveal', text: 'Never Forget.' },
        // The promise, under the poster's own close: no second "Never Forget" (the room's card is "Never Forget" too, with its own subtitle).
        { type: 'paragraph', section: 'added', atmosphere: 'first-light', effect: 'line-by-line', text: 'In 2000, representatives from 46 governments met in Stockholm and promised to keep the memory of the Holocaust alive. Their declaration says: “The selfless sacrifices of those who defied the Nazis, and sometimes gave their own lives to protect or rescue the Holocaust’s victims, must also be inscribed in our hearts.”', sources: [SRC.stockholm] },
        { type: 'end', section: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'The poster names hatred, discrimination, and indifference. What everyday choices can people make to help build a safer, more inclusive world?',
        // One question per chapter: the poster's own question stays, and the Stockholm Declaration's follows it.
        'Never Forget.': 'What are some of the ways people and communities keep the memory of the past alive, and why do you think remembering matters? The Stockholm Declaration asks us to remember the people who helped others. Why do you think it matters to remember those who helped, as well as those who were harmed?',
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
        added: { className: 'ho-p2 ho-body ho-added' },
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
        // The source sentence goes on to say how; the panel stops at the number.
        { type: 'paragraph', section: 'added', atmosphere: 'still-stone', effect: 'blur-to-sharp', position: 'top-right', text: 'Nazi Germany and its allies and collaborators killed nearly two out of every three European Jews.', sources: [SRC.intro] },

        // Step by step: it did not begin with camps ("The Holocaust Was Not Inevitable").
        { type: 'section-title', section: 'added', atmosphere: 'barbed-wire', effect: 'split-reveal', text: STEP_BY_STEP },
        { type: 'paragraph', section: 'added', atmosphere: 'still-stone', effect: 'typewriter', position: 'top-left', text: 'It did not begin with camps. In May 1933, a few months after Hitler came to power, pro-Nazi university students threw tens of thousands of books into bonfires in more than 20 towns and cities, including books by Jewish authors.', sources: [SRC.bookBurning] },
        { type: 'paragraph', section: 'added', atmosphere: 'film-strip', effect: 'fade-in', position: 'bottom-right', text: 'On September 15, 1935, the Nuremberg Race Laws said that Jews could not be German citizens and restricted who Jews could marry. Soon Jews were shut out of public places across Germany.', sources: [SRC.nuremberg] },
        { type: 'paragraph', section: 'added', atmosphere: 'remembrance-stones', effect: 'drift', position: 'top-right', text: 'Steven Frank was five when the Nazis occupied the Netherlands. He later said: “I was suddenly different from all my other friends. I was no longer allowed to play in the park, my father could not take public transport to work; I couldn’t go into the swimming pool or the zoo.”', sources: [SRC.stevenFrank] },
        { type: 'paragraph', section: 'added', atmosphere: 'barbed-wire', effect: 'ink-spread', position: 'bottom-left', text: 'On the night of November 9–10, 1938, Nazis burned more than 1,400 synagogues and vandalized thousands of Jewish-owned shops and homes. It came to be called Kristallnacht, the “Night of Broken Glass.”', sources: [SRC.kristallnacht] },
        { type: 'paragraph', section: 'body', atmosphere: 'barbed-wire', effect: 'blur-to-sharp', text: 'While the Nazis specifically despised and persecuted Jews, other groups such as Roma, political prisoners, and people with disabilities were targeted.' },
        { type: 'paragraph', section: 'added', atmosphere: 'barbed-wire', effect: 'fade-in', position: 'bottom-right', text: 'At least 250,000 European Roma were killed during the war, and the number may be as high as 500,000. A Nazi program to kill people with mental and physical disabilities took the lives of about 250,000 men, women and children.', sources: [SRC.roma, SRC.euthanasia] },
        // One name ("Translate Statistics Into People").
        { type: 'paragraph', section: 'added', atmosphere: 'remembrance-stones', effect: 'rise-expand', position: 'bottom-right', text: 'Anna Lehnkering was born in Germany in 1915. She loved playing with children and hoped to help in a nursery one day. Because she had a disability, the Nazis took her life in 1940, when she was 24. Decades later her niece, Sigrid, found Anna’s name on a list and wrote her story so that she would not be forgotten.', sources: [SRC.annaLehnkering] },
        { type: 'paragraph', section: 'body', atmosphere: 'barbed-wire', effect: 'ink-spread', text: 'Before being deported to concentration and extermination camps, many Jewish people were confined to ghettos, overcrowded and walled-off sections of cities where living conditions were inhumane. Disease, starvation, and violence were rampant in ghettos such as those in Warsaw, Lodz, and Vilna.' },
        { type: 'paragraph', section: 'added', atmosphere: 'candle-vigil', effect: 'line-by-line', position: 'top-right', text: 'People resisted. On April 19, 1943, about 700 young Jewish fighters in the Warsaw ghetto rose up against German troops. It was the largest uprising by Jews during World War II.', sources: [SRC.warsawUprising] },
        // The object in the display case: the 1 Krone Theresienstadt scrip.
        { type: 'paragraph', section: 'added', atmosphere: 'still-stone', effect: 'typewriter', position: 'bottom-left', text: 'Look for the 1 Krone note in our display case. It was made for Theresienstadt, a ghetto in what is now the Czech Republic. Prisoners were not allowed real money. The SS ordered this scrip “to create a false appearance of normalcy,” and there was little to buy with it.', sources: [SRC.scrip, SRC.theresienstadt] },

        // Children.
        { type: 'section-title', section: 'added', atmosphere: 'remembrance-stones', effect: 'fade-in', text: CHILDREN },
        { type: 'paragraph', section: 'added', atmosphere: 'remembrance-stones', effect: 'blur-to-sharp', position: 'top-left', text: 'As many as 1.5 million Jewish children were murdered. Thousands of Jewish children survived, many because they were hidden. From December 1938 to May 1940, the Kindertransport brought about 10,000 children, without their parents, to safety in Great Britain.', sources: [SRC.children, SRC.kindertransport] },
        { type: 'paragraph', section: 'added', atmosphere: 'still-stone', effect: 'drift', position: 'bottom-right', text: 'Anne Frank was born in Frankfurt, Germany, in 1929. In July 1942 her family went into hiding in Amsterdam, in rooms behind a bookcase in her father’s office building. There she kept her diary. The eight people in hiding were discovered on August 4, 1944. Anne died at Bergen-Belsen in February 1945. Her father, Otto, was the only one of them to survive.', sources: [SRC.whoWasAnne, SRC.anneFrankHmd, SRC.anneFrankBio] },
        { type: 'paragraph', section: 'body', atmosphere: 'film-strip', effect: 'kenburns-in', figure: BLOCK_24A, text: 'Prisoners registered at Auschwitz had identification numbers tattooed on their arms, stripping them of their identities and humanity.' },

        // Rescue.
        { type: 'section-title', section: 'added', atmosphere: 'first-light', effect: 'split-reveal', text: RESCUE },
        { type: 'paragraph', section: 'body', atmosphere: 'first-light', effect: 'rise-expand', text: 'Despite the horrors, acts of bravery emerged as individuals and groups risked their lives to save Jews. These rescuers are honored as the *Righteous Among the Nations*, a title awarded by Yad Vashem, Israel’s Holocaust memorial, to recognize their courage and humanity in the face of unspeakable evil.' },
        { type: 'paragraph', section: 'added', atmosphere: 'first-light', effect: 'fade-in', position: 'top-right', text: 'Yad Vashem has recognized more than 28,000 people as Righteous Among the Nations. A little over half of them are women.', sources: [SRC.yvRighteous, SRC.yv2024] },
        { type: 'paragraph', section: 'added', atmosphere: 'first-light', effect: 'waves-drift', position: 'bottom-left', text: 'In October 1943, people across Denmark hid their Jewish neighbors in homes, hospitals and churches. Fishermen ferried some 7,200 Danish Jews and 680 non-Jewish family members across the water to safety in Sweden.', sources: [SRC.denmark] },
        { type: 'paragraph', section: 'added', atmosphere: 'first-light', effect: 'line-by-line', position: 'top-left', text: 'From 1940 to 1944, the people of the French village of Le Chambon-sur-Lignon and its neighbors gave refuge to an estimated 5,000 people. In 1990 Israel honored them all together as Righteous Among the Nations.', sources: [SRC.leChambon] },
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
        // The poem in context ("Avoid Romanticizing History"), and why versions of it differ.
        { type: 'paragraph', section: 'added', atmosphere: 'candle-vigil', effect: 'typewriter', position: 'bottom-right', text: 'Pastor Martin Niemöller is “a complicated figure.” He first supported the Nazis, and changed his views after he was imprisoned in a concentration camp for speaking out against Nazi control of the churches. He wrote “First They Came” after the war and spoke it on a 1947 world tour, which led to “several slightly different versions.”', sources: [SRC.niemoller] },
        {
          type: 'quote',
          section: 'quote',
          atmosphere: 'candle-vigil',
          effect: 'line-by-line',
          text: NIEMOLLER.text,
          cite: NIEMOLLER.cite,
        },

        // After.
        { type: 'section-title', section: 'added', atmosphere: 'first-light', effect: 'split-reveal', text: AFTER },
        { type: 'paragraph', section: 'added', atmosphere: 'first-light', effect: 'blur-to-sharp', position: 'top-left', text: 'When the war ended, many survivors could not go home. Many lived in displaced persons camps while they searched for family and rebuilt their lives.', sources: [SRC.intro, SRC.displacedPersons] },
        { type: 'paragraph', section: 'added', atmosphere: 'candle-vigil', effect: 'breathe', position: 'bottom-right', text: 'Elie Wiesel survived Auschwitz and Buchenwald as a boy and spent his life helping the world remember. He wrote: “The survivors had every reason to despair of society; they did not. They opted to work for humankind, not against it.”', sources: [SRC.wiesel] },
        { type: 'callout', section: 'link', atmosphere: 'candle-vigil', effect: 'film-credits', text: 'Learn more about the Holocaust at the United States Holocaust Memorial Museum', url: USHMM_URL },
        { type: 'end', section: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'The Righteous Among the Nations risked their lives to save Jews, and Martin Niemöller’s words describe what happens when no one speaks out. What helps a person find the courage to speak up for others?',
        [STEP_BY_STEP]: 'The Holocaust did not begin with camps. What small steps, like the laws and the book burnings, came first? Why might it matter to notice small steps?',
        [CHILDREN]: 'Anne Frank kept writing while she was in hiding. Why do you think writing and keeping a diary mattered so much to young people at that time?',
        [RESCUE]: 'Whole villages and a whole country helped their neighbors. What do you think helps people to act together for others?',
        [AFTER]: 'Elie Wiesel said survivors chose to work for humankind. What are ways people can choose to work for others after something hard has happened?',
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
