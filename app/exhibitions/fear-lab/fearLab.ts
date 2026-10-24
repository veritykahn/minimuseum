import type { CSSProperties } from 'react';
import { floorReturnFor } from '@/lib/floors';
import type { ExhibitionConfig, PanelDecor } from '@/components/exhibition/types';

/*
 * The Fear Lab: every word on screen, and the look.
 *
 * The poster copy is set exactly as printed on the two posters, including
 * their own spellings. Each sentence lives in one place below, so a fix to
 * the posters is a one-line edit here. Where a poster paragraph runs across
 * several panels it is split only between sentences; nothing is reworded.
 *
 * The "Talk about it" questions are for the projector's teacher strip: open
 * discussion questions, one per chapter, keyed by the section title exactly
 * as it is set (OPENING, '', is the panels before the first section title).
 */

// The posters' palette: navy ground, cream type, marigold subheads.
const NAVY = '#1F3A5F';
const NIGHT = '#152B47';
const DEEP = '#0C1828';
const CREAM = '#FBF6EC';
const MARIGOLD = '#F2B33D';

const SPIDER: PanelDecor = { src: '/exhibitions/fear-lab/spider.png', placement: 'top-right', motion: 'drop', width: 'min(26vw, 330px)' };
const HAND: PanelDecor = { src: '/exhibitions/fear-lab/hand.png', placement: 'bottom-left', motion: 'rise', width: 'min(30vw, 400px)' };

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
  name: 'Fear Lab',
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
  fx: { theme: 'fl', veil: 'every-panel', text: 'all' },
  projector: { theme: FEAR_LAB_PROJECTOR_THEME, links: [] },
  // No display cases yet: the artifacts have not been photographed.
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
      sections: {
        dark: { bg: DEEP, className: 'fl-lamp' },
        night: { bg: NIGHT, className: 'fl-lamp' },
        shadows: { bg: DEEP, className: 'fl-lamp fl-shadows' },
        footer: { bg: NAVY },
      },
      items: [
        { type: 'title-text', kicker: 'THE SCIENCE OF BEING SCARED:', text: 'FEAR LAB', colors: { title: CREAM }, decor: SPIDER },
        { type: 'paragraph', section: 'dark', position: 'bottom-right', decor: HAND, text: `Put your hand in a box you can't see into. Your heart races before you even touch anything. Why?` },
        { type: 'paragraph', section: 'dark', position: 'center', text: `Because your brain's #1 fear isn't spiders or snakes—it's the UNKNOWN. And your imagination is programmed to fill that unknown with the worst possible thing.` },

        { type: 'section-title', text: `Fear of the Unknown: Your Brain's Biggest Trick` },
        { type: 'paragraph', section: 'night', position: 'top-left', text: `Scientists call it "ambiguity aversion"—we'd rather face a known danger than an unknown possibility. In experiments, a 50% chance of a small electric shock stressed people out more than knowing for certain they'd get one.` },
        { type: 'paragraph', section: 'night', position: 'bottom-right', text: `Uncertainty itself sets off the amygdala (your brain's alarm system). When you can't see what's in that box, your brain screams "THREAT!" louder than if you saw an actual spider.` },

        { type: 'section-title', text: 'Anticipation Makes Everything Scarier' },
        { type: 'paragraph', section: 'night', position: 'top-right', text: `Brain scans show that dread is real: in one study, some people chose a stronger shock right away rather than wait for a weaker one.` },
        { type: 'paragraph', section: 'night', position: 'bottom-left', text: `That's why reaching into a mystery box feels scarier than touching what's actually inside—your imagination creates horrors worse than reality.` },
        { type: 'paragraph', section: 'dark', position: 'center', decor: SPIDER, text: `Your brain invents poisonous spiders, slimy worms or nibbling rodents when it's really just a pinecone.` },

        { type: 'section-title', text: 'Pareidolia: Seeing Monsters Everywhere' },
        { type: 'paragraph', section: 'shadows', position: 'top-left', text: `Your brain is a pattern-seeking machine that sees faces and threats where none exist. In experiments, people saw imaginary faces as male about four times as often as female.` },
        { type: 'paragraph', section: 'shadows', position: 'center', text: `Shadow people? Just your brain turning random darkness into human shapes.` },
        { type: 'paragraph', section: 'shadows', position: 'bottom-right', text: `This isn't a flaw—it's by design. Our brains know it is better to see 100 fake threats than miss one real predator.` },

        { type: 'section-title', text: 'Your Brain Catastrophizes on Purpose' },
        { type: 'paragraph', section: 'night', position: 'top-right', text: `When faced with uncertainty, your brain doesn't imagine neutral scenarios—it imagines disasters. This "negativity bias" kept ancestors alive. Those who assumed rustling bushes contained tigers lived longer than optimists.` },
        { type: 'paragraph', section: 'dark', position: 'bottom-right', decor: HAND, text: `Today, that same wiring makes you imagine the worst possible thing in a dark box. Your brain literally can't help lying to you about danger—it's trying to save your life.` },

        {
          type: 'callout',
          section: 'footer',
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
      sections: {
        dark: { bg: DEEP, className: 'fl-lamp' },
        night: { bg: NIGHT, className: 'fl-lamp' },
        storm: { bg: DEEP, className: 'fl-lamp fl-rain' },
        footer: { bg: NAVY },
      },
      items: [
        {
          type: 'title-text',
          text: 'PAGE TURNERS & SPINE TINGLERS',
          badge: "WHY WE JUST *CAN'T* PUT OUR HORROR BOOKS DOWN!",
          colors: { title: CREAM },
          className: 'fl-title-long',
        },
        {
          type: 'full-image',
          section: 'dark',
          src: '/exhibitions/fear-lab/vampire-moon.jpg',
          alt: 'Illustration of a caped vampire seen from behind, facing a Gothic tower with lit red windows in the rain, under a full moon',
          effect: 'kenburns-in',
        },
        { type: 'paragraph', section: 'dark', position: 'center', colors: { text: MARIGOLD }, text: 'Why do we willingly read stories designed to scare us?' },
        { type: 'paragraph', section: 'night', position: 'bottom-left', text: `The answer lies in our brain's irresistible urge to practice survival—without actual danger. When we read horror, we're conducting risk-free rehearsals for dangerous situations, gaining a sense of mastery as we face monsters and survive.` },

        { type: 'section-title', text: 'The Gothic Originals' },
        { type: 'paragraph', section: 'storm', position: 'top-left', text: `It began with Mary Shelley's "Frankenstein" (1818). Then came Robert Louis Stevenson's "Jekyll and Hyde" (1886), Wilde's "Picture of Dorian Gray" (1890), and Stoker's "Dracula" (1897).` },
        { type: 'paragraph', section: 'storm', position: 'bottom-right', text: `These Gothic classics established horror's golden rule: the real terror isn't the creature, it's what it represents—fear of new technology, anxiety about moral decay, losing your humanity.` },
        { type: 'paragraph', section: 'night', position: 'top-right', text: `While the educated read these novels, working-class Victorians devoured "penny dreadfuls"—cheap weekly serials like "Varney the Vampire" and "Spring-Heeled Jack", proving that horror tapped into something innate to the human condition.` },
        { type: 'paragraph', section: 'night', position: 'bottom-left', text: `Later writers like H.P. Lovecraft, Shirley Jackson and Stephen King bridged oceans and decades and proved that horror was not to be dismissed as peculiar to the Victorian era.` },

        { type: 'section-title', text: 'Point Horror: Horror Grows Up (By Growing Down)' },
        { type: 'paragraph', section: 'night', position: 'top-left', text: `In 1991, Scholastic realized teenagers wanted their own horror, launching the Point Horror series with authors like R.L. Stine (whose "Blind Date" launched his career), Christopher Pike, Caroline B. Cooney, and Diane Hoh.` },
        { type: 'paragraph', section: 'night', position: 'bottom-right', text: `With titles like "The Babysitter" and "The Boyfriend," these books moved horror from Gothic castles to high school hallways.` },

        { type: 'section-title', text: 'Red Eye: Horror for the Digital Generation' },
        { type: 'paragraph', section: 'night', position: 'top-right', text: `Today's Red Eye series (Stripes Publishing's modern horror line) features books like "Frozen Charlotte" and "Sleepless"—updating classic fears for the Instagram age.` },
        { type: 'paragraph', section: 'dark', position: 'center', text: 'But these contemporary horrors retain their Gothic DNA: isolation, transformation, and the terrifying realization that you might BE the monster.' },
        {
          type: 'full-image',
          section: 'dark',
          src: '/exhibitions/fear-lab/vampire.jpg',
          alt: 'Illustration of a caped vampire in a red-lined cloak, seen from behind against a stormy, moonlit sky',
        },
        { type: 'paragraph', section: 'night', position: 'bottom-left', text: 'From Gothic novels to Point Horror to Red Eye, each generation gets the monsters it needs to face its anxieties.' },
        { type: 'quote', section: 'dark', text: `But perhaps the real reason we love these spine tinglers is that scary books bring us together. Psychologists have known since a famous 1959 experiment that frightened people seek each other's company. We're literally wired to bond over being scared together.` },

        { type: 'callout', section: 'footer', text: 'Explore Mary Shelley’s House of Frankenstein', url: 'https://www.houseoffrankenstein.com/' },
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
