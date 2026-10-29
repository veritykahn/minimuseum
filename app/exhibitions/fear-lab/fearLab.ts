import type { CSSProperties } from 'react';
import { floorReturnFor } from '@/lib/floors';
import type { Atmosphere, ExhibitionConfig, PanelDecor } from '@/components/exhibition/types';

/*
 * The Fear Lab: every word on screen, and the look.
 *
 * The poster copy is set exactly as printed on the two posters, including
 * their own spellings. Each sentence lives in one place below, so a fix to
 * the posters is a one-line edit here. Where a poster paragraph runs across
 * several panels it is split only between sentences; nothing is reworded.
 *
 * Each poster opens on its own title lettering, cut from the poster (poster
 * 1's with the spider crouched over it, as printed). Poster 2's starburst
 * line follows as a panel of its own, in its own words. The two vampire
 * illustrations are set beside the copy they illustrate on the poster.
 *
 * The "Talk about it" questions are for the projector's teacher strip: open
 * discussion questions, one per chapter, keyed by the section title exactly
 * as it is set (OPENING, '', is the panels before the first section title).
 */

// The posters' palette: navy ground, cream type, marigold subheads.
const NAVY = '#1F3A5F';
const CREAM = '#FBF6EC';
const MARIGOLD = '#F2B33D';

const SPIDER: PanelDecor = { src: '/exhibitions/fear-lab/spider.png', placement: 'top-right', motion: 'drop', width: 'min(26vw, 330px)' };
const HAND: PanelDecor = { src: '/exhibitions/fear-lab/hand.png', placement: 'bottom-left', motion: 'rise', width: 'min(30vw, 400px)' };

/*
 * Poster 1's paragraphs that the lab (what-scares-you/) sets as well as the
 * walkthrough: each lives here once, and both read it from here.
 */
export const FEAR_LAB_COPY = {
  box: `Put your hand in a box you can't see into. Your heart races before you even touch anything. Why?`,
  unknown: `Because your brain's #1 fear isn't spiders or snakes—it's the UNKNOWN. And your imagination is programmed to fill that unknown with the worst possible thing.`,
  ambiguity: `Scientists call it "ambiguity aversion"—we'd rather face a known danger than an unknown possibility. In experiments, a 50% chance of a small electric shock stressed people out more than knowing for certain they'd get one.`,
  amygdala: `Uncertainty itself sets off the amygdala (your brain's alarm system). When you can't see what's in that box, your brain screams "THREAT!" louder than if you saw an actual spider.`,
  dread: `Brain scans show that dread is real: in one study, some people chose a stronger shock right away rather than wait for a weaker one.`,
  mysteryBox: `That's why reaching into a mystery box feels scarier than touching what's actually inside—your imagination creates horrors worse than reality.`,
  pinecone: `Your brain invents poisonous spiders, slimy worms or nibbling rodents when it's really just a pinecone.`,
  byDesign: `This isn't a flaw—it's by design. Our brains know it is better to see 100 fake threats than miss one real predator.`,
  tigers: `When faced with uncertainty, your brain doesn't imagine neutral scenarios—it imagines disasters. This "negativity bias" kept ancestors alive. Those who assumed rustling bushes contained tigers lived longer than optimists.`,
};
const C = FEAR_LAB_COPY;

/*
 * The posters' titles as pictures: their own lettering, cut from the posters
 * at the posters' resolution with the navy ground keyed out
 * (public/exhibitions/fear-lab/titles/). A sharper export of the same
 * lettering can replace a file at the same path; update its size here when
 * it does.
 */
const TITLE_SIZES = {
  scienceOfBeingScared: { width: 943, height: 332 },
  pageTurners: { width: 832, height: 170 },
};

/*
 * The walkthrough's atmospheres (fear-lab.css draws them), each the setting
 * of a part of the story:
 *   racing-heart     the hand in the box, and dread: a heartbeat traced across the dark, the edges pulsing
 *   amygdala-alarm   the brain's alarm system: a warning beacon turning, its light sweeping the walls
 *   shadow-people    the unknown, and pareidolia: shapes at the edge of the dark, eyes that open and close
 *   vampire-storm    the Gothic originals: slanting rain, lightning, a full moon behind cloud
 *   penny-candle     reading for a fright: a candle's light flickering on the page, smoke curling up
 *   red-eye-glitch   horror for the digital generation: a screen's scan lines, a red eye glowing through
 */
const ATMOSPHERES: Record<string, Atmosphere> = {
  'racing-heart': { bg: '#170d18', parts: 2 },
  'amygdala-alarm': { bg: '#140c10', parts: 3 },
  'shadow-people': { bg: '#0a1220', parts: 3, particles: 6 },
  'vampire-storm': { bg: '#0d1a2b', parts: 3, particles: 70 },
  'penny-candle': { bg: '#170f08', parts: 3, particles: 10 },
  'red-eye-glitch': { bg: '#0d0a12', parts: 4 },
};

export const FEAR_LAB_PROJECTOR_THEME = {
  '--pj-bg': '#0E1A2C',
  '--pj-ink': CREAM,
  '--pj-muted': '#B4C0D2',
  '--pj-accent': MARIGOLD,
  '--pj-on-accent': '#0E1A2C',
  '--pj-display': "'Righteous', 'Montserrat', system-ui, sans-serif",
  '--pj-body': "'Montserrat', system-ui, sans-serif",
} as CSSProperties;

export const FEAR_LAB: ExhibitionConfig<'poster1' | 'poster2'> = {
  slug: 'fear-lab',
  name: 'The Fear Lab',
  subtitle: 'Page Turners & Spine Tinglers',
  fonts: {
    href: 'https://fonts.googleapis.com/css2?family=Righteous&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,700;1,800&display=swap',
    display: "'Righteous', 'Montserrat', system-ui, sans-serif",
    body: "'Montserrat', system-ui, sans-serif",
  },
  palette: {
    page: '#0E1A2C',
    heading: CREAM,
    accent: MARIGOLD,
    teach: { color: MARIGOLD, border: 'rgba(242,179,61,0.55)' },
  },
  back: floorReturnFor('fear-lab'),
  atmospheres: ATMOSPHERES,
  // The torch switches on as a poster opens and at each chapter; every other panel arrives its own way.
  fx: { theme: 'fl', veil: 'chapters', text: 'all' },
  projector: {
    theme: FEAR_LAB_PROJECTOR_THEME,
    links: [{ label: 'What Scares You? The fear boxes, known or unknown, and the rustling bushes', href: '/exhibitions/fear-lab/what-scares-you' }],
  },
  // No display cases yet: the artifacts have not been photographed.
  interactives: [
    {
      href: '/exhibitions/fear-lab/what-scares-you',
      // A drawing of the mystery box, not a photograph.
      image: {
        src: '/exhibitions/fear-lab/mystery-box.svg',
        alt: 'A drawing of a dark box with a question mark on it and a round hole in its top, a cream clawed hand reaching down into it',
      },
      label: 'Interactive',
      title: 'What Scares You?',
      subtitle: 'The fear boxes, known or unknown, and the rustling bushes',
    },
  ],
  posters: [
    // ============================================
    // POSTER 1: The Science of Being Scared: Fear Lab
    // ============================================
    {
      id: 'poster1',
      title: 'The Science of Being Scared: Fear Lab',
      hero: {
        src: '/exhibitions/fear-lab/poster1.jpg',
        alt: 'The Science of Being Scared: Fear Lab poster: the title in cream capitals on navy beside a black spider, above a box of text and a cream clawed hand reaching up',
      },
      colors: { bg: NAVY, text: CREAM, title: MARIGOLD },
      items: [
        {
          type: 'title-image',
          atmosphere: 'shadow-people',
          effect: 'mega-zoom-out',
          src: '/exhibitions/fear-lab/titles/science-of-being-scared.png',
          ...TITLE_SIZES.scienceOfBeingScared,
          framing: 'centered',
          alt: 'The Science of Being Scared: Fear Lab',
        },
        { type: 'paragraph', atmosphere: 'racing-heart', effect: 'line-by-line', position: 'bottom-right', decor: HAND, text: C.box },
        { type: 'paragraph', atmosphere: 'shadow-people', effect: 'blind-spot-reveal', position: 'center', text: C.unknown },

        { type: 'section-title', atmosphere: 'amygdala-alarm', effect: 'glitch', text: `Fear of the Unknown: Your Brain's Biggest Trick` },
        { type: 'paragraph', atmosphere: 'amygdala-alarm', effect: 'typewriter', position: 'top-left', text: C.ambiguity },
        { type: 'paragraph', atmosphere: 'amygdala-alarm', effect: 'split-reveal', position: 'bottom-right', text: C.amygdala },

        { type: 'section-title', atmosphere: 'racing-heart', effect: 'breathe', text: 'Anticipation Makes Everything Scarier' },
        { type: 'paragraph', atmosphere: 'racing-heart', effect: 'fade-in', position: 'top-right', text: C.dread },
        { type: 'paragraph', atmosphere: 'shadow-people', effect: 'ink-spread', position: 'bottom-left', text: C.mysteryBox },
        { type: 'paragraph', atmosphere: 'shadow-people', effect: 'film-credits', position: 'center', decor: SPIDER, text: C.pinecone },

        { type: 'section-title', atmosphere: 'shadow-people', effect: 'blur-to-sharp', text: 'Pareidolia: Seeing Monsters Everywhere' },
        { type: 'paragraph', atmosphere: 'shadow-people', effect: 'line-by-line', position: 'top-left', text: `Your brain is a pattern-seeking machine that sees faces and threats where none exist. In experiments, people saw imaginary faces as male about four times as often as female.` },
        { type: 'paragraph', atmosphere: 'shadow-people', effect: 'drift', position: 'center', text: `Shadow people? Just your brain turning random darkness into human shapes.` },
        { type: 'paragraph', atmosphere: 'amygdala-alarm', effect: 'fade-in', position: 'bottom-right', text: C.byDesign },

        { type: 'section-title', atmosphere: 'amygdala-alarm', effect: 'split-reveal', text: 'Your Brain Catastrophizes on Purpose' },
        { type: 'paragraph', atmosphere: 'shadow-people', effect: 'typewriter', position: 'top-right', text: C.tigers },
        { type: 'paragraph', atmosphere: 'racing-heart', effect: 'rise-expand', position: 'bottom-right', decor: HAND, text: `Today, that same wiring makes you imagine the worst possible thing in a dark box. Your brain literally can't help lying to you about danger—it's trying to save your life.` },

        {
          type: 'callout',
          atmosphere: 'penny-candle',
          effect: 'film-credits',
          text: 'VISIT THE EDGAR ALLAN POE MUSEUM, THE ORIGINAL MASTER OF FEAR!',
          url: 'https://poemuseum.org/',
        },
        { type: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Think of a time you were scared of something you couldn’t see. What did your imagination fill the gap with?',
        'Fear of the Unknown: Your Brain\'s Biggest Trick':
          'Would you rather know exactly what is in the box, or not know? Why might not knowing feel worse?',
        'Anticipation Makes Everything Scarier':
          'Have you ever found that waiting for something was worse than the thing itself? What was it like?',
        'Pareidolia: Seeing Monsters Everywhere':
          'Where have you seen a face in something that wasn’t a face? Why might it be safer to see a fake threat than to miss a real one?',
        'Your Brain Catastrophizes on Purpose':
          'When has your brain imagined the worst? What could you say to yourself when it does?',
      },
    },

    // ============================================
    // POSTER 2: Page Turners & Spine Tinglers
    // ============================================
    {
      id: 'poster2',
      title: 'Page Turners & Spine Tinglers',
      hero: {
        src: '/exhibitions/fear-lab/poster2.jpg',
        alt: 'Page Turners & Spine Tinglers poster: the title in cream capitals above an illustration of a caped vampire before a Gothic tower under a full moon, a marigold starburst and two columns of text',
      },
      colors: { bg: NAVY, text: CREAM, title: MARIGOLD },
      items: [
        {
          type: 'title-image',
          atmosphere: 'penny-candle',
          effect: 'split-reveal',
          src: '/exhibitions/fear-lab/titles/page-turners.png',
          ...TITLE_SIZES.pageTurners,
          framing: 'centered',
          alt: 'Page Turners & Spine Tinglers',
        },
        // The poster's marigold starburst (fear-lab.css draws it).
        { type: 'paragraph', atmosphere: 'penny-candle', effect: 'rise-expand', className: 'fl-burst', text: "WHY WE JUST *CAN'T* PUT OUR HORROR BOOKS DOWN!" },
        {
          type: 'image-text-stacked',
          atmosphere: 'vampire-storm',
          effect: 'kenburns-in',
          src: '/exhibitions/fear-lab/vampire-moon.jpg',
          alt: 'Illustration of a caped vampire seen from behind, facing a Gothic tower with lit red windows in the rain, under a full moon',
          className: 'fl-question',
          colors: { text: MARIGOLD },
          text: 'Why do we willingly read stories designed to scare us?',
        },
        { type: 'paragraph', atmosphere: 'penny-candle', effect: 'line-by-line', position: 'bottom-left', text: `The answer lies in our brain's irresistible urge to practice survival—without actual danger. When we read horror, we're conducting risk-free rehearsals for dangerous situations, gaining a sense of mastery as we face monsters and survive.` },

        { type: 'section-title', atmosphere: 'vampire-storm', effect: 'shrink-back', text: 'The Gothic Originals' },
        { type: 'paragraph', atmosphere: 'vampire-storm', effect: 'typewriter', position: 'top-left', text: `It began with Mary Shelley's "Frankenstein" (1818). Then came Robert Louis Stevenson's "Jekyll and Hyde" (1886), Wilde's "Picture of Dorian Gray" (1890), and Stoker's "Dracula" (1897).` },
        { type: 'paragraph', atmosphere: 'vampire-storm', effect: 'ink-spread', position: 'bottom-right', text: `These Gothic classics established horror's golden rule: the real terror isn't the creature, it's what it represents—fear of new technology, anxiety about moral decay, losing your humanity.` },
        { type: 'paragraph', atmosphere: 'penny-candle', effect: 'film-credits', position: 'top-right', text: `While the educated read these novels, working-class Victorians devoured "penny dreadfuls"—cheap weekly serials like "Varney the Vampire" and "Spring-Heeled Jack", proving that horror tapped into something innate to the human condition.` },
        { type: 'paragraph', atmosphere: 'penny-candle', effect: 'pan-lr', position: 'bottom-left', text: `Later writers like H.P. Lovecraft, Shirley Jackson and Stephen King bridged oceans and decades and proved that horror was not to be dismissed as peculiar to the Victorian era.` },

        { type: 'section-title', atmosphere: 'racing-heart', effect: 'split-reveal', text: 'Point Horror: Horror Grows Up (By Growing Down)' },
        { type: 'paragraph', atmosphere: 'racing-heart', effect: 'fade-in', position: 'top-left', text: `In 1991, Scholastic realized teenagers wanted their own horror, launching the Point Horror series with authors like R.L. Stine (whose "Blind Date" launched his career), Christopher Pike, Caroline B. Cooney, and Diane Hoh.` },
        { type: 'paragraph', atmosphere: 'shadow-people', effect: 'blur-to-sharp', position: 'bottom-right', text: `With titles like "The Babysitter" and "The Boyfriend," these books moved horror from Gothic castles to high school hallways.` },

        { type: 'section-title', atmosphere: 'red-eye-glitch', effect: 'glitch', text: 'Red Eye: Horror for the Digital Generation' },
        { type: 'paragraph', atmosphere: 'red-eye-glitch', effect: 'typewriter', position: 'top-right', text: `Today's Red Eye series (Stripes Publishing's modern horror line) features books like "Frozen Charlotte" and "Sleepless"—updating classic fears for the Instagram age.` },
        {
          type: 'artwork-display',
          atmosphere: 'vampire-storm',
          effect: 'mega-zoom-out',
          side: 'right',
          src: '/exhibitions/fear-lab/vampire.jpg',
          alt: 'Illustration of a caped vampire in a red-lined cloak, seen from behind against a stormy, moonlit sky',
          text: 'But these contemporary horrors retain their Gothic DNA: isolation, transformation, and the terrifying realization that you might BE the monster.',
        },
        { type: 'paragraph', atmosphere: 'red-eye-glitch', effect: 'drift', position: 'bottom-left', text: 'From Gothic novels to Point Horror to Red Eye, each generation gets the monsters it needs to face its anxieties.' },
        { type: 'quote', atmosphere: 'penny-candle', effect: 'breathe', text: `But perhaps the real reason we love these spine tinglers is that scary books bring us together. Psychologists have known since a famous 1959 experiment that frightened people seek each other's company. We're literally wired to bond over being scared together.` },

        { type: 'callout', atmosphere: 'vampire-storm', effect: 'film-credits', text: 'Explore Mary Shelley’s House of Frankenstein', url: 'https://www.houseoffrankenstein.com/' },
        { type: 'end', text: 'Return to Exhibition' },
      ],
      talk: {
        '': 'Why do you think people choose to read stories that are designed to scare them? Do you?',
        'The Gothic Originals':
          'The poster says the real terror isn’t the creature, it’s what it represents. Pick a monster you know. What might it stand for?',
        'Point Horror: Horror Grows Up (By Growing Down)':
          'If you wrote a scary story set in your own school’s hallways, what would it be about?',
        'Red Eye: Horror for the Digital Generation':
          'What fears might a new scary story explore for your generation? And why might being scared together bring people closer?',
      },
    },
  ],
};
