import type { CSSProperties } from 'react';
import { floorReturnFor } from '@/lib/floors';
import type { ArtworkDisplayItem, Atmosphere, CasePageData, ExhibitionConfig, PanelDecor, PanelMarks } from '@/components/exhibition/types';
import { IWM } from './silence/film';

/*
 * The Great War: every word on screen, and the look.
 *
 * The poster copy is set exactly as printed on the two posters. Each sentence
 * lives in one place below, so a fix to the posters is a one-line edit here.
 * Where a poster paragraph runs across several panels it is split only
 * between sentences; nothing is reworded. The posters have no subheads, so
 * each later paragraph's own first sentence opens its chapter as a section
 * title, still in the poster's order.
 *
 * Left out: poster 1's "Scan here to learn more about the Doughboys" QR code,
 * which has no known destination. Poster 2's Imperial War Museum QR code is
 * the link at the end of that poster.
 *
 * The "Talk about it" questions are for the projector's teacher strip: open
 * discussion questions, one per chapter, keyed by the section title exactly
 * as it is set (OPENING, '', is the panels before the first section title).
 * They make no factual claims.
 */

// The posters' palette: near-black ground, warm off-white type, red date and time.
const GROUND = '#1C1C1C';
const DEEP = '#141414';
const INK = '#EDE6DA';
/*
 * The posters' red, #E8372C, sets the large date and time (great-war.css:
 * 3:1 or better on the ground). Small text takes it a shade lighter (4.5:1).
 */
const RED_TEXT = '#EC4A3F';

const POPPIES: PanelDecor = { src: '/exhibitions/great-war/poppies.png', placement: 'bottom-right', motion: 'rise', width: 'min(30vw, 380px)' };

/** The date and time the posters print at poster 1's foot and poster 2's head. */
const DATE_FOOT: PanelMarks = { left: '11.11.1918', right: '11:00', placement: 'foot' };
const DATE_HEAD: PanelMarks = { left: '11.11.1918', right: '11:00', placement: 'head' };

/*
 * The posters' titles as pictures: their own lettering, cut from the posters
 * at the posters' resolution (public/exhibitions/great-war/titles/). A
 * sharper export of the same lettering can replace a file at the same path;
 * update its size here when it does.
 */
const TITLE_SIZES = {
  doughboys: { width: 687, height: 112 },
  gunsFellSilent: { width: 709, height: 112 },
};

/** The Imperial War Museum's photograph of a trench on the first morning of the Somme, with its own description and credit. */
const IWM_TRENCH: ArtworkDisplayItem = {
  type: 'artwork-display',
  section: 'dusk',
  atmosphere: 'film-reel',
  effect: 'mega-zoom-out',
  src: IWM.trench.src,
  alt: IWM.trench.alt,
  text: IWM.trench.description,
  credit: { text: IWM.trench.credit, href: IWM.trench.url },
};

/*
 * The walkthrough's atmospheres (great-war.css draws them). Each section
 * stands in its own weather, as the hand-built walkthroughs' sections do:
 *   film-reel    the archival photographs: a flickering, scratched sepia reel
 *   trench-rain  the trenches: rain across a periscope's view of the line
 *   searchlight  courage, and the last hours: searchlights sweeping a night sky
 *   smoke        the guns, and their silence: smoke drifting over the field
 *   poppies      remembrance: poppy petals falling
 *   telegram     Armistice Day: a telegram form, the news typed onto it
 */
const ATMOSPHERES: Record<string, Atmosphere> = {
  'film-reel': { bg: '#19160f', parts: 4, particles: 7 },
  'trench-rain': { bg: '#121413', parts: 2, particles: 64 },
  searchlight: { bg: '#0d1016', parts: 3 },
  smoke: { bg: '#1a1918', parts: 4 },
  poppies: { bg: GROUND, particles: 16 },
  telegram: { bg: '#e6dcc4', text: '#2a241b', title: '#2a241b', parts: 2 },
};

export const GREAT_WAR_PROJECTOR_THEME = {
  '--pj-bg': DEEP,
  '--pj-ink': INK,
  '--pj-muted': '#B5ADA0',
  '--pj-accent': RED_TEXT,
  '--pj-on-accent': DEEP,
  '--pj-display': "'Italiana', 'Cormorant Garamond', Georgia, serif",
  '--pj-body': "'Cormorant Garamond', Georgia, serif",
} as CSSProperties;

export const GREAT_WAR: ExhibitionConfig<'poster1' | 'poster2'> = {
  slug: 'great-war',
  name: 'The Great War',
  subtitle: 'The Doughboys & the 11th Hour',
  fonts: {
    href: 'https://fonts.googleapis.com/css2?family=Italiana&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Outfit:wght@400;600&family=Courier+Prime&display=swap',
    display: "'Italiana', 'Cormorant Garamond', Georgia, serif",
    body: "'Cormorant Garamond', Georgia, serif",
    ui: "'Outfit', system-ui, sans-serif",
  },
  palette: {
    page: GROUND,
    heading: INK,
    accent: RED_TEXT,
    teach: { color: RED_TEXT, border: 'rgba(236,74,63,0.55)' },
  },
  back: floorReturnFor('great-war'),
  atmospheres: ATMOSPHERES,
  // The hush falls only as a poster opens: after that each panel arrives its own way.
  fx: { theme: 'gw', veil: 'first', text: 'all' },
  projector: {
    theme: GREAT_WAR_PROJECTOR_THEME,
    links: [
      { label: 'When the Guns Fell Silent (film)', href: '/exhibitions/great-war/silence' },
      { label: 'The Memorial: poppies, a soldier to remember, and the silence', href: '/exhibitions/great-war/memorial' },
    ],
  },
  cases: [
    {
      href: '/exhibitions/great-war/artifacts/case',
      label: 'Display Case',
      title: 'Artifacts',
    },
  ],
  // Each room's card shows the room itself: a screenshot of it (public/exhibitions/<slug>/rooms/).
  interactives: [
    {
      href: '/exhibitions/great-war/silence',
      image: { src: '/exhibitions/great-war/rooms/silence.webp', alt: 'The When the Guns Fell Silent room: the film’s title over a dark screen, ready to begin' },
      label: 'Interactive',
      title: 'When the Guns Fell Silent',
      subtitle: 'The last minute of the war',
    },
    {
      href: '/exhibitions/great-war/memorial',
      image: { src: '/exhibitions/great-war/rooms/memorial.webp', alt: 'The Memorial room: a soldier’s silhouette by a cross against the sunset, poppies in the field' },
      label: 'Interactive',
      title: 'The Memorial',
      subtitle: 'A field of poppies, a soldier to remember, and the silence',
    },
  ],
  posters: [
    // ============================================
    // POSTER 1: The Doughboys: America's Sons in The Great War
    // ============================================
    {
      id: 'poster1',
      title: "The Doughboys: America's Sons in The Great War",
      hero: {
        src: '/exhibitions/great-war/poster1.jpg',
        alt: "The Doughboys: America's Sons in The Great War poster: a sepia photograph of four soldiers walking away down a ruined trench above the faded faces of soldiers in helmets, the title in off-white, three paragraphs of text, and the date 11.11.1918 and the time 11:00 in red",
      },
      colors: { bg: GROUND, text: INK, title: INK },
      sections: {
        faces: { className: 'gw-faces' },
        dusk: { bg: DEEP, className: 'gw-dusk' },
      },
      items: [
        {
          type: 'title-image',
          section: 'faces',
          atmosphere: 'film-reel',
          effect: 'kenburns-in',
          src: '/exhibitions/great-war/titles/doughboys.png',
          ...TITLE_SIZES.doughboys,
          framing: 'centered',
          alt: "The Doughboys: America's Sons in The Great War",
          audio: '/exhibitions/great-war/audio/poster1-01.mp3',
          marks: DATE_FOOT,
        },
        { type: 'paragraph', atmosphere: 'film-reel', effect: 'film-credits', position: 'center', audio: '/exhibitions/great-war/audio/poster1-02.mp3', text: 'They were farmers from Iowa, factory workers from Pittsburgh, teenagers from small Texas towns who lied about their age to enlist.' },
        { type: 'paragraph', atmosphere: 'film-reel', effect: 'split-reveal', position: 'top-left', audio: '/exhibitions/great-war/audio/poster1-03.mp3', text: `When America entered "The Great War" in April 1917, two million young men—many barely out of high school—crossed the Atlantic to fight in the muddy, rat-infested trenches of France.` },
        { type: 'paragraph', atmosphere: 'film-reel', effect: 'line-by-line', position: 'bottom-right', audio: '/exhibitions/great-war/audio/poster1-04.mp3', text: `They were called "doughboys," possibly because the large brass buttons on their uniforms resembled small fried-dough pastries, or perhaps from the dust that coated infantry on the march in the Mexican-American War, as if they'd been rolled in flour. Whatever the origin, the nickname stuck, and these American soldiers carried it with pride into one of the bloodiest conflicts the world had ever seen.` },

        { type: 'section-title', atmosphere: 'trench-rain', effect: 'blur-to-sharp', section: 'dusk', audio: '/exhibitions/great-war/audio/poster1-05.mp3', text: 'Life in the trenches was a nightmare of mud, rats, lice, and constant danger.' },
        {
          type: 'full-image',
          section: 'dusk',
          atmosphere: 'trench-rain',
          effect: 'pan-lr',
          src: '/exhibitions/great-war/trench.jpg',
          alt: 'Sepia photograph of four soldiers in steel helmets walking away from the camera down a ruined trench',
        },
        { type: 'paragraph', atmosphere: 'trench-rain', effect: 'fade-in', section: 'dusk', position: 'top-left', audio: '/exhibitions/great-war/audio/poster1-06.mp3', text: `Soldiers spent weeks at a time in waterlogged ditches, their feet rotting from "trench foot," their lungs burning from poison gas attacks, their ears ringing from artillery bombardments that never seemed to stop.` },
        { ...IWM_TRENCH, audio: '/exhibitions/great-war/audio/poster1-07.mp3' },
        { type: 'paragraph', atmosphere: 'trench-rain', effect: 'ink-spread', section: 'dusk', position: 'bottom-right', audio: '/exhibitions/great-war/audio/poster1-08.mp3', text: `They witnessed horrors that would haunt them for the rest of their lives: friends cut down by machine gun fire, landscapes transformed into cratered moonscapes, horses and men drowning in the sucking mud of No Man's Land.` },
        { type: 'paragraph', atmosphere: 'film-reel', effect: 'typewriter', section: 'faces', position: 'center', audio: '/exhibitions/great-war/audio/poster1-09.mp3', text: 'Most American doughboys were in their early twenties, but many were teenagers—boys who should have been finishing high school or starting their first jobs, not charging into a hail of bullets.' },

        { type: 'section-title', atmosphere: 'searchlight', effect: 'split-reveal', audio: '/exhibitions/great-war/audio/poster1-10.mp3', text: 'Yet these ordinary young men showed extraordinary courage.' },
        { type: 'paragraph', atmosphere: 'searchlight', effect: 'line-by-line', position: 'top-left', audio: '/exhibitions/great-war/audio/poster1-11.mp3', text: `They fought in decisive battles like Belleau Wood, where U.S. Marines fought so fiercely that legend says German soldiers called them "Devil Dogs." They pushed through the Argonne Forest in the largest American offensive of the war.` },
        { type: 'paragraph', atmosphere: 'smoke', effect: 'blur-to-sharp', position: 'bottom-right', audio: '/exhibitions/great-war/audio/poster1-12.mp3', text: 'In all, over 116,000 American soldiers died—53,000 in combat, and another 63,000 from disease and accidents. Millions more came home with physical wounds and invisible scars we now recognize as PTSD.' },
        { type: 'paragraph', atmosphere: 'poppies', effect: 'breathe', section: 'dusk', position: 'center', audio: '/exhibitions/great-war/audio/poster1-13.mp3', text: "The doughboys didn't just fight for victory; they fought so that future generations—all of us—would never have to know the horror of such a war." },
        { type: 'paragraph', atmosphere: 'poppies', effect: 'typewriter', section: 'dusk', position: 'center', className: 'gw-closing', audio: '/exhibitions/great-war/audio/poster1-14.mp3', text: "That's why we remember them.", marks: DATE_FOOT },

        { type: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'They were farmers, factory workers and teenagers. What do you think it felt like to leave an ordinary life at home and go to war?',
        'Life in the trenches was a nightmare of mud, rats, lice, and constant danger.':
          'Many of these soldiers were not much older than you. What would you want people today to understand about what they went through?',
        'Yet these ordinary young men showed extraordinary courage.':
          'What does courage look like to you? Why do you think the poster ends with “That’s why we remember them”?',
      },
    },

    // ============================================
    // POSTER 2: When the Guns Fell Silent at the 11th Hour
    // ============================================
    {
      id: 'poster2',
      title: 'When the Guns Fell Silent at the 11th Hour',
      hero: {
        src: '/exhibitions/great-war/poster2.jpg',
        alt: 'When the Guns Fell Silent at the 11th Hour poster: the date 11.11.1918 and the time 11:00 in red above four paragraphs of text, and the title over a photograph of a soldier silhouetted beside a wooden cross on a hill, with red poppies climbing the right edge',
      },
      colors: { bg: GROUND, text: INK, title: INK },
      sections: {
        dusk: { bg: DEEP, className: 'gw-dusk' },
      },
      items: [
        {
          type: 'title-image',
          section: 'dusk',
          atmosphere: 'smoke',
          effect: 'rise-expand',
          src: '/exhibitions/great-war/titles/guns-fell-silent.png',
          ...TITLE_SIZES.gunsFellSilent,
          framing: 'centered',
          alt: 'When the Guns Fell Silent at the 11th Hour',
          audio: '/exhibitions/great-war/audio/poster2-01.mp3',
          marks: DATE_HEAD,
        },
        {
          type: 'full-image',
          section: 'dusk',
          atmosphere: 'film-reel',
          effect: 'kenburns-in',
          src: '/exhibitions/great-war/silhouette.jpg',
          alt: 'A soldier in a helmet, a rifle on his back, silhouetted beside a wooden cross on a hill under a gray sky, with red poppies at the right',
        },
        { type: 'paragraph', atmosphere: 'smoke', effect: 'typewriter', position: 'center', audio: '/exhibitions/great-war/audio/poster2-02.mp3', text: 'On the eleventh hour of the eleventh day of the eleventh month of 1918, something miraculous happened on the Western Front: after four years of relentless killing, the guns stopped firing.' },
        {
          type: 'image-text-stacked',
          atmosphere: 'smoke',
          effect: 'split-reveal',
          src: IWM.record.src,
          alt: IWM.record.alt,
          credit: { text: IWM.record.credit, href: IWM.record.url },
          text: 'At 11:00 AM on November 11, 1918, the armistice—the peace agreement—took effect, and an eerie silence fell over battlefields that had thundered with artillery for 1,568 days.',
          audio: '/exhibitions/great-war/audio/poster2-03.mp3',
        },
        { type: 'paragraph', atmosphere: 'smoke', effect: 'line-by-line', position: 'bottom-right', audio: '/exhibitions/great-war/audio/poster2-04.mp3', text: "Soldiers on both sides climbed out of their trenches, stunned and uncertain. Some shook hands with enemies they'd been trying to kill just minutes before. Some wept. Some couldn't believe they'd actually survived. Church bells rang across Europe." },
        { type: 'paragraph', atmosphere: 'searchlight', effect: 'fade-in', section: 'dusk', position: 'top-left', audio: '/exhibitions/great-war/audio/poster2-05.mp3', text: "But that final hour wasn't peaceful—knowing the war would end at 11:00 AM, some commanders still ordered attacks that morning. Nearly 11,000 soldiers became casualties on November 11th alone, including many who died in the final minutes before the ceasefire." },
        { type: 'paragraph', atmosphere: 'searchlight', effect: 'blur-to-sharp', section: 'dusk', position: 'center', audio: '/exhibitions/great-war/audio/poster2-06.mp3', text: 'The last Commonwealth soldier killed was Canadian Private George Lawrence Price, shot at 10:58 AM. A minute later, Private Henry Gunther became the last American to die.' },

        { type: 'section-title', atmosphere: 'smoke', effect: 'film-credits', className: 'gw-long', audio: '/exhibitions/great-war/audio/poster2-07.mp3', text: `World War I was supposed to be "the war to end all wars," but it became one of the deadliest conflicts in human history.` },
        { type: 'paragraph', atmosphere: 'smoke', effect: 'ink-spread', position: 'top-left', text: 'Around 20 million people died, soldiers and civilians alike. Entire towns in France and Belgium were erased from the map.' },
        { type: 'paragraph', atmosphere: 'smoke', effect: 'shrink-back', position: 'bottom-right', text: 'A generation of young men was lost—Britain alone lost 880,000 men, France lost 1.4 million, Germany lost 2 million.' },
        { type: 'paragraph', atmosphere: 'poppies', effect: 'fade-in', position: 'top-left', decor: POPPIES, text: `In the poem "In Flanders Fields," Canadian doctor and soldier John McCrae wrote about the crosses, row on row, marking graves in Flanders, where bright red poppies grew wild among the devastation.` },
        { type: 'paragraph', atmosphere: 'poppies', effect: 'line-by-line', position: 'top-left', decor: POPPIES, text: "The poppies became a symbol of remembrance because they were often the only living things that could grow in the churned, blood-soaked soil of the battlefields. When we wear poppies in November, we're remembering all those who gave their lives, and we're making a promise: we will never forget their sacrifice." },

        { type: 'section-title', atmosphere: 'telegram', effect: 'typewriter', section: 'dusk', text: 'The armistice of November 11, 1918 became a sacred day.' },
        { type: 'paragraph', atmosphere: 'telegram', effect: 'fade-in', section: 'dusk', position: 'top-left', text: `In 1919, President Woodrow Wilson proclaimed it "Armistice Day," declaring that the day should be "filled with solemn pride in the heroism of those who died in the country's service." At 11:00 AM, Americans paused their work for two minutes to honor the fallen.` },
        { type: 'paragraph', atmosphere: 'telegram', effect: 'line-by-line', section: 'dusk', position: 'bottom-right', text: 'After World War II and the Korean War, Congress changed the name to "Veterans Day" in 1954 to honor all American veterans, not just those from WWI. But many countries—including Canada, Britain, and France—still call it Remembrance Day and observe the tradition of the two-minute silence at the eleventh hour.' },
        { type: 'paragraph', atmosphere: 'searchlight', effect: 'blur-to-sharp', section: 'dusk', position: 'center', text: "In Arlington National Cemetery, a wreath is placed at the Tomb of the Unknown Soldier on Veterans Day, by tradition by the President of the United States, honoring all those whose names we'll never know but whose sacrifice we'll never forget." },

        { type: 'section-title', atmosphere: 'poppies', effect: 'split-reveal', text: 'Why do we still remember a war that ended over a century ago?' },
        { type: 'paragraph', atmosphere: 'poppies', effect: 'fade-in', position: 'top-left', text: "Because those young men—the doughboys in their steel helmets, the soldiers who carried shaving kits and rosaries into battle—went to war so that we might live in peace. They endured unimaginable horrors so that future generations wouldn't have to." },
        { type: 'paragraph', atmosphere: 'poppies', effect: 'line-by-line', position: 'bottom-right', text: "When we take a moment of silence on Veterans Day, when we wear a poppy, when we say a prayer for those who served, we're keeping a promise to them: You will not be forgotten. Your sacrifice mattered. And because of you, we live in freedom." },
        { type: 'paragraph', atmosphere: 'poppies', effect: 'breathe', section: 'dusk', position: 'center', className: 'gw-closing', decor: POPPIES, marks: DATE_HEAD, text: 'At the eleventh hour, on the eleventh day, of the eleventh month, the guns fell silent—but our gratitude never will.' },

        { type: 'callout', effect: 'film-credits', text: 'Explore the collections at the Imperial War Museum', url: 'https://www.iwm.org.uk/collections' },
        { type: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Imagine the moment the guns stopped. What do you think the soldiers on both sides felt in that silence?',
        'World War I was supposed to be "the war to end all wars," but it became one of the deadliest conflicts in human history.':
          'Why do you think a small flower like the poppy became a way to remember so many people?',
        'The armistice of November 11, 1918 became a sacred day.':
          'Why might people choose silence, rather than words, to honor those who died?',
        'Why do we still remember a war that ended over a century ago?':
          'The poster ends with a promise: “You will not be forgotten.” How could you keep that promise in your own way?',
      },
    },
  ],
};

/*
 * The display case (artifacts/case) and a page for each object in it
 * (artifacts/case/<id>). Every word is the owner's: each name and record line
 * from the Mini Museum record (*words* set in italics), the writing from this
 * exhibition's posters. The record's lines about the display itself are listed
 * on the case page. Photographs and 3D models are to come.
 */
export const GREAT_WAR_CASE: CasePageData = {
  label: 'Display Case',
  title: 'Artifacts',
  // Photographs to come: the case will be photographed anew.
  photos: [],
  artifacts: [
    {
      id: 'brodie-helmet',
      name: 'M1917 Brodie doughboy helmet',
      record: 'M1917 Brodie doughboy helmet with American Legion decal',
      writing: [
        { poster: 'poster2', text: "Because those young men—the doughboys in their steel helmets, the soldiers who carried shaving kits and rosaries into battle—went to war so that we might live in peace." },
      ],
    },
    {
      id: 'shaving-kit',
      name: 'US Army issue shaving kit',
      record: 'US Army issue shaving kit and the *Service for the Mobilized Soldier* field manual',
      writing: [
        { poster: 'poster2', text: "Because those young men—the doughboys in their steel helmets, the soldiers who carried shaving kits and rosaries into battle—went to war so that we might live in peace." },
      ],
    },
    {
      id: 'field-manual',
      name: '*Service for the Mobilized Soldier* field manual',
      record: 'US Army issue shaving kit and the *Service for the Mobilized Soldier* field manual',
    },
    {
      id: 'ammunition-pouch',
      name: 'Ammunition pouch',
      record: 'Ammunition pouch and commemorative service pins',
    },
    {
      id: 'service-pins',
      name: 'Commemorative service pins',
      record: 'Ammunition pouch and commemorative service pins',
    },
  ],
  display: ['Backlit silhouette display, take-away soldier profile cards, and an iPad Armistice audio station'],
};
