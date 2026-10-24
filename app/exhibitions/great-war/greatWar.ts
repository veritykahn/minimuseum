import type { CSSProperties } from 'react';
import type { ExhibitionConfig, PanelDecor, PanelMarks } from '@/components/exhibition/types';

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
    href: 'https://fonts.googleapis.com/css2?family=Italiana&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Outfit:wght@400;600&display=swap',
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
  back: {
    href: '/exhibitions/first-floor',
    label: 'First Floor',
    remember: { key: 'firstFloorIndex', value: '4' },
  },
  fx: { theme: 'gw', veil: 'chapters', text: 'all' },
  projector: { theme: GREAT_WAR_PROJECTOR_THEME, links: [] },
  cases: [
    {
      href: '/exhibitions/great-war/artifacts/case',
      image: {
        src: '/exhibitions/great-war/case-thumb.jpg',
        alt: 'The display case: a steel helmet, a canvas pouch and a field manual under clear acrylic, beside a backlit silhouette of a soldier and a cross, among red poppies',
      },
      label: 'Display Case',
      title: 'Artifacts',
      subtitle: 'Photographs of the installation',
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
        { type: 'title-text', section: 'faces', text: "The Doughboys: America's Sons in The Great War", marks: DATE_FOOT },
        { type: 'paragraph', position: 'center', text: 'They were farmers from Iowa, factory workers from Pittsburgh, teenagers from small Texas towns who lied about their age to enlist.' },
        { type: 'paragraph', position: 'top-left', text: `When America entered "The Great War" in April 1917, two million young men—many barely out of high school—crossed the Atlantic to fight in the muddy, rat-infested trenches of France.` },
        { type: 'paragraph', position: 'bottom-right', text: `They were called "doughboys," possibly because the large brass buttons on their uniforms resembled small fried-dough pastries, or perhaps from the dust that coated infantry on the march in the Mexican-American War, as if they'd been rolled in flour. Whatever the origin, the nickname stuck, and these American soldiers carried it with pride into one of the bloodiest conflicts the world had ever seen.` },

        { type: 'section-title', section: 'dusk', text: 'Life in the trenches was a nightmare of mud, rats, lice, and constant danger.' },
        {
          type: 'full-image',
          section: 'dusk',
          src: '/exhibitions/great-war/trench.jpg',
          alt: 'Sepia photograph of four soldiers in steel helmets walking away from the camera down a ruined trench',
        },
        { type: 'paragraph', section: 'dusk', position: 'top-left', text: `Soldiers spent weeks at a time in waterlogged ditches, their feet rotting from "trench foot," their lungs burning from poison gas attacks, their ears ringing from artillery bombardments that never seemed to stop.` },
        { type: 'paragraph', section: 'dusk', position: 'bottom-right', text: `They witnessed horrors that would haunt them for the rest of their lives: friends cut down by machine gun fire, landscapes transformed into cratered moonscapes, horses and men drowning in the sucking mud of No Man's Land.` },
        { type: 'paragraph', section: 'faces', position: 'center', text: 'Most American doughboys were in their early twenties, but many were teenagers—boys who should have been finishing high school or starting their first jobs, not charging into a hail of bullets.' },

        { type: 'section-title', text: 'Yet these ordinary young men showed extraordinary courage.' },
        { type: 'paragraph', position: 'top-left', text: `They fought in decisive battles like Belleau Wood, where U.S. Marines fought so fiercely that legend says German soldiers called them "Devil Dogs." They pushed through the Argonne Forest in the largest American offensive of the war.` },
        { type: 'paragraph', position: 'bottom-right', text: 'In all, over 116,000 American soldiers died—53,000 in combat, and another 63,000 from disease and accidents. Millions more came home with physical wounds and invisible scars we now recognize as PTSD.' },
        { type: 'paragraph', section: 'dusk', position: 'center', text: "The doughboys didn't just fight for victory; they fought so that future generations—all of us—would never have to know the horror of such a war." },
        { type: 'paragraph', section: 'dusk', position: 'center', className: 'gw-closing', text: "That's why we remember them.", marks: DATE_FOOT },

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
        { type: 'title-text', section: 'dusk', text: 'When the Guns Fell Silent at the 11th Hour', marks: DATE_HEAD },
        {
          type: 'full-image',
          section: 'dusk',
          src: '/exhibitions/great-war/silhouette.jpg',
          alt: 'A soldier in a helmet, a rifle on his back, silhouetted beside a wooden cross on a hill under a gray sky, with red poppies at the right',
        },
        { type: 'paragraph', position: 'center', text: 'On the eleventh hour of the eleventh day of the eleventh month of 1918, something miraculous happened on the Western Front: after four years of relentless killing, the guns stopped firing.' },
        { type: 'paragraph', position: 'top-left', text: 'At 11:00 AM on November 11, 1918, the armistice—the peace agreement—took effect, and an eerie silence fell over battlefields that had thundered with artillery for 1,568 days.' },
        { type: 'paragraph', position: 'bottom-right', text: "Soldiers on both sides climbed out of their trenches, stunned and uncertain. Some shook hands with enemies they'd been trying to kill just minutes before. Some wept. Some couldn't believe they'd actually survived. Church bells rang across Europe." },
        { type: 'paragraph', section: 'dusk', position: 'top-left', text: "But that final hour wasn't peaceful—knowing the war would end at 11:00 AM, some commanders still ordered attacks that morning. Nearly 11,000 soldiers became casualties on November 11th alone, including many who died in the final minutes before the ceasefire." },
        { type: 'paragraph', section: 'dusk', position: 'center', text: 'The last Commonwealth soldier killed was Canadian Private George Lawrence Price, shot at 10:58 AM. A minute later, Private Henry Gunther became the last American to die.' },

        { type: 'section-title', className: 'gw-long', text: `World War I was supposed to be "the war to end all wars," but it became one of the deadliest conflicts in human history.` },
        { type: 'paragraph', position: 'top-left', text: 'Over 17 million people died—9 million soldiers and 8 million civilians. Entire towns in France and Belgium were erased from the map.' },
        { type: 'paragraph', position: 'bottom-right', text: 'A generation of young men was lost—Britain alone lost 880,000 men, France lost 1.4 million, Germany lost 2 million.' },
        { type: 'paragraph', position: 'top-left', decor: POPPIES, text: `In the poem "In Flanders Fields," Canadian doctor and soldier John McCrae wrote about the crosses, row on row, marking graves in Flanders, where bright red poppies grew wild among the devastation.` },
        { type: 'paragraph', position: 'top-left', decor: POPPIES, text: "The poppies became a symbol of remembrance because they were often the only living things that could grow in the churned, blood-soaked soil of the battlefields. When we wear poppies in November, we're remembering all those who gave their lives, and we're making a promise: we will never forget their sacrifice." },

        { type: 'section-title', section: 'dusk', text: 'The armistice of November 11, 1918 became a sacred day.' },
        { type: 'paragraph', section: 'dusk', position: 'top-left', text: `In 1919, President Woodrow Wilson proclaimed it "Armistice Day," declaring that the day should be "filled with solemn pride in the heroism of those who died in the country's service." At 11:00 AM, Americans paused their work for two minutes to honor the fallen.` },
        { type: 'paragraph', section: 'dusk', position: 'bottom-right', text: 'After World War II and the Korean War, Congress changed the name to "Veterans Day" in 1954 to honor all American veterans, not just those from WWI. But many countries—including Canada, Britain, and France—still call it Remembrance Day and observe the tradition of the two-minute silence at the eleventh hour.' },
        { type: 'paragraph', section: 'dusk', position: 'center', text: "In Arlington National Cemetery, a wreath is placed at the Tomb of the Unknown Soldier on Veterans Day, by tradition by the President of the United States, honoring all those whose names we'll never know but whose sacrifice we'll never forget." },

        { type: 'section-title', text: 'Why do we still remember a war that ended over a century ago?' },
        { type: 'paragraph', position: 'top-left', text: "Because those young men—the doughboys in their steel helmets, the soldiers who carried shaving kits and rosaries into battle—went to war so that we might live in peace. They endured unimaginable horrors so that future generations wouldn't have to." },
        { type: 'paragraph', position: 'bottom-right', text: "When we take a moment of silence on Veterans Day, when we wear a poppy, when we say a prayer for those who served, we're keeping a promise to them: You will not be forgotten. Your sacrifice mattered. And because of you, we live in freedom." },
        { type: 'paragraph', section: 'dusk', position: 'center', className: 'gw-closing', decor: POPPIES, marks: DATE_HEAD, text: 'At the eleventh hour, on the eleventh day, of the eleventh month, the guns fell silent—but our gratitude never will.' },

        { type: 'callout', text: 'Explore the collections at the Imperial War Museum', url: 'https://www.iwm.org.uk/collections' },
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
 * The display case page (artifacts/case). The artifacts are listed exactly as
 * the Mini Museum record lists them; *words* are set in italics.
 */
export const GREAT_WAR_CASE = {
  label: 'Display Case',
  title: 'Artifacts',
  subtitle: 'Photographs of the installation',
  photos: [
    {
      src: '/exhibitions/great-war/case.jpg',
      alt: 'The display case: a steel helmet with a round decal, a canvas pouch, a field manual titled Service for the Mobilized Soldier and a shaving kit under clear acrylic, beside a backlit silhouette of a soldier and a cross and a tray of cards, on a table strewn with red poppies, with a tablet on the shelf below',
      width: 1200,
      height: 900,
    },
    {
      src: '/exhibitions/great-war/installation.jpg',
      alt: 'The installation: the two posters on the wall either side of a green curtain beneath The Mini Museum sign, with the display case and backlit silhouette on a table below, and a green armchair',
      width: 900,
      height: 1200,
    },
    {
      src: '/exhibitions/great-war/installation-corner.jpg',
      alt: 'The installation from the side: the posters, the green curtain and The Mini Museum sign above the display case and its table of red poppies',
      width: 840,
      height: 1200,
    },
  ],
  artifacts: [
    'M1917 Brodie doughboy helmet with American Legion decal',
    'US Army issue shaving kit and the *Service for the Mobilized Soldier* field manual',
    'Ammunition pouch and commemorative service pins',
    'Backlit silhouette display, take-away soldier profile cards, and an iPad Armistice audio station',
  ],
};
