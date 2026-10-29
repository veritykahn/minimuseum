import type { Atmosphere, PanelEffect } from '@/components/exhibition/types';

/*
 * Seeing is Deceiving's two posters, panel by panel, for the hand-built
 * walkthrough in page.tsx. The wording is the posters' own.
 *
 * Each panel arrives its own way (`effect`, from the engine's vocabulary in
 * components/exhibition/types.ts): typed out, set line by line, glitched,
 * filling in like the blind spot. A section title with no effect of its own
 * takes the exhibition's chromatic slat reveal. The title cards and the two
 * full pictures keep their own motions (Ken Burns, drift, the face zooming
 * out, the waves).
 *
 * `special` keeps the section looks the posters were built with: the old
 * film's scratches and flicker, the stereoscope's floating depth, the colour
 * wash, the drifting discs, the spirit photographs' static, Photoshop's split
 * channels and the deepfakes' glitch.
 */

export type SidItem = {
  type: string;
  text?: string;
  src?: string;
  alt?: string;
  url?: string;
  position?: string;
  /** How the panel arrives; left out, it takes the exhibition's reveal. */
  effect?: PanelEffect;
  special?: string;
  /** The setting it stands in (SEEING_ATMOSPHERES), drawn behind the panel. */
  atmosphere?: string;
  items?: string[];
};

/**
 * The walkthrough's atmospheres (seeing.css draws them), each a setting from
 * the story:
 *   projected-light  light thrown on a wall in the dark: the camera obscura,
 *                    the magic lantern, the zoetrope, the picture house
 *   stereo-depth     the stereoscope: two views drifting together into depth
 *   checker-shadow   the checker-shadow illusion: a board under a cast shadow
 *   rotating-snakes  the peripheral drift illusion: discs that seem to turn
 *   spirit-static    the spirit photograph: grain, and a figure that is not there
 *   deepfake-glitch  the deepfake: scan lines and a picture slipping its channels
 */
export const SEEING_ATMOSPHERES: Record<string, Atmosphere> = {
  'projected-light': { parts: 3, particles: 16 },
  'stereo-depth': { parts: 5 },
  'checker-shadow': { parts: 3 },
  'rotating-snakes': { parts: 4 },
  'spirit-static': { parts: 3 },
  'deepfake-glitch': { parts: 4 },
};


// Poster 1 content - Seeing is Deceiving
export const poster1Content: SidItem[] = [
  {
    type: 'title-image',
    src: '/exhibitions/seeing/poster1-title.jpg',
    alt: 'Seeing is Deceiving',
    effect: 'kenburns-in'
  },
  {
    type: 'section-title',
    text: 'The Science of How We See',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'paragraph',
    text: 'Right now, you believe you\'re seeing the world exactly as it is. But you\'re not. Your eyes are simply sensors that gather light – it is your brain that does all the interpreting and it takes remarkable shortcuts.',
    position: 'top-left',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'Every second, 11 million bits of sensory information flood into your brain. You consciously process only about 40 bits. Which means your brain discards 99.999% of visual information and constructs what it thinks you need to see.',
    position: 'bottom-right',
    effect: 'line-by-line'
  },
  {
    type: 'paragraph',
    text: 'So reality is not quite as you see it.',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'paragraph',
    text: 'To handle this impossible task, your brain doesn\'t record reality like a camera – it predicts reality. Based on past experience, it fills in gaps, smooths over inconsistencies, and makes thousands of assumptions.',
    position: 'top-right',
    effect: 'ink-spread'
  },
  {
    type: 'paragraph',
    text: 'You can read tihs senetnce even wehn the leettrs are srcambled because your brain predicts what should be there.',
    position: 'center',
    effect: 'typewriter'
  },
  {
    type: 'paragraph',
    text: 'This prediction system keeps you alive—you can catch a ball, spot danger, recognize faces. But it also means you see what you expect to see, not necessarily what\'s actually there.',
    position: 'bottom-left',
    effect: 'fade-in'
  },
  {
    type: 'blind-spot',
    text: 'Your eyes have a blind spot where the optic nerve connects to your retina—a patch in each eye where you literally cannot see. Right now, you have two holes in your vision. You\'ve never noticed because your brain seamlessly fills them in, inventing information to complete the picture.',
    position: 'center',
    effect: 'blind-spot-reveal'
  },
  {
    type: 'paragraph',
    text: 'If your brain lies to you about something this basic, what else is it hiding?',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'section-title',
    text: 'The First Motion Pictures (1820s–1830s)',
    position: 'full-width',
    special: 'vintage-film',
    atmosphere: 'projected-light'
  },
  {
    type: 'paragraph',
    text: 'Inventors discovered something strange: show the eye rapid sequences of still images and the brain sees continuous motion that doesn\'t exist. The thaumatrope (1825) was a disk with different images on each side—spin it and a bird appears inside a cage. The zoetrope (1834) showed sequential drawings through slits—spin it and horses gallop, people dance.',
    position: 'top-left',
    special: 'vintage-film',
    effect: 'line-by-line',
    atmosphere: 'projected-light'
  },
  {
    type: 'paragraph',
    text: 'Nothing actually moves. Your brain creates the motion. Movies are still pictures shown fast. Every screen you look at exploits this biological quirk discovered 200 years ago.',
    position: 'bottom-right',
    special: 'vintage-film',
    effect: 'film-credits',
    atmosphere: 'projected-light'
  },
  {
    type: 'section-title',
    text: 'The Stereoscope: Inventing Depth',
    position: 'full-width',
    special: 'depth-parallax',
    atmosphere: 'stereo-depth'
  },
  {
    type: 'paragraph',
    text: 'In the 1830s, physicist Charles Wheatstone discovered that your two eyes see slightly different images, and your brain calculates depth from those differences. He built the first stereoscope—showing each eye a different flat picture. Your brain combines them and suddenly you perceive three dimensions that don\'t exist.',
    position: 'top-right',
    special: 'depth-parallax',
    effect: 'rise-expand',
    atmosphere: 'stereo-depth'
  },
  {
    type: 'paragraph',
    text: 'By the late 1800s, Victorians used stereoscopes to "travel" to Egypt or Niagara Falls without leaving home. The same principle powers modern 3D movies and VR headsets. The technology evolved. Your brain didn\'t.',
    position: 'bottom-left',
    special: 'depth-parallax',
    effect: 'pan-lr',
    atmosphere: 'stereo-depth'
  },
  {
    type: 'full-image',
    src: '/exhibitions/seeing/face.jpg',
    alt: 'Continuous black line drawing of half a face: one eye, a nose and lips',
    effect: 'mega-zoom-out'
  },
  {
    type: 'section-title',
    text: 'Color Illusions: Context Changes Everything',
    position: 'center',
    special: 'color-shift',
    effect: 'blur-to-sharp',
    atmosphere: 'checker-shadow'
  },
  {
    type: 'paragraph',
    text: 'Your brain doesn\'t show you "true" color—it interprets based on context. In the checkerboard shadow illusion, two squares appear completely different shades. Measure the actual light and they\'re identical. Your brain "corrects" for the shadow, and you cannot see them as the same color even when you know they are.',
    position: 'top-left',
    special: 'color-shift',
    effect: 'fade-in',
    atmosphere: 'checker-shadow'
  },
  {
    type: 'paragraph',
    text: 'Remember the dress that broke the internet in 2015—blue and black or white and gold? Your brain\'s assumptions about lighting changed the actual colors you perceived. Two identical things can look completely different depending on what surrounds them.',
    position: 'bottom-right',
    special: 'color-shift',
    effect: 'split-reveal',
    atmosphere: 'checker-shadow'
  },
  {
    type: 'section-title',
    text: 'One Picture, Two Realities',
    position: 'full-width'
  },
  {
    type: 'paragraph',
    text: 'Some illusions show your brain\'s pattern-finding obsession. The old woman/young woman illusion (1888) uses the same lines to create two completely different faces. The rabbit/duck illusion (1892) can be seen as either animal but never both simultaneously. The Rubin vase (1915): white vase or two black faces?',
    position: 'top-right',
    effect: 'shrink-back'
  },
  {
    type: 'paragraph',
    text: 'Your brain organizes visual information into familiar patterns, sometimes finding multiple interpretations of the same image. What you "see" depends on which pattern your brain emphasizes.',
    position: 'bottom-left',
    effect: 'ink-spread'
  },
  {
    type: 'section-title',
    text: 'Motion That Isn\'t There',
    position: 'full-width',
    special: 'peripheral-drift',
    atmosphere: 'rotating-snakes'
  },
  {
    type: 'paragraph',
    text: 'Some static images appear to move. The peripheral drift illusion uses high-contrast patterns—stare at the center and edges seem to rotate, though nothing moves. The Rotating Snakes illusion (2003) shows circles that appear to spin when you glance around the image. Your brain is so committed to detecting motion that it sometimes sees movement that isn\'t there.',
    position: 'center',
    special: 'peripheral-drift',
    effect: 'drift',
    atmosphere: 'rotating-snakes'
  },
  {
    type: 'section-title',
    text: 'Impossible Objects',
    position: 'full-width'
  },
  {
    type: 'paragraph',
    text: 'The Penrose triangle (1934) and M.C. Escher\'s impossible staircases (1960) show objects that cannot exist in three-dimensional space. Your brain tries to make sense of them and fails, creating that unsettling feeling when you see something impossible.',
    position: 'center',
    effect: 'breathe'
  },
  {
    type: 'section-title',
    text: 'Why Your Eyes Aren\'t Trustworthy',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'paragraph',
    text: 'You don\'t see reality—you see your brain\'s interpretation based on prediction, context, pattern recognition, and efficiency shortcuts. Your brain takes these shortcuts to help you survive: you can catch balls, spot danger, recognize faces. But you can also be fooled by colors that aren\'t what they appear, motion that doesn\'t exist, depth that isn\'t there, and details your brain invents to fill gaps.',
    position: 'center',
    effect: 'fade-in'
  },
  { type: 'end', text: 'Return to Exhibition' }
];

// Poster 2 content - A History of Lies
export const poster2Content: SidItem[] = [
  {
    type: 'title-image',
    src: '/exhibitions/seeing/poster2-title.jpg',
    alt: 'A History of Lies: From Magic Lanterns to AI Deepfakes',
    effect: 'drift'
  },
  {
    type: 'section-title',
    text: 'The First Visual Deceptions (1600s–1800s)',
    position: 'full-width',
    atmosphere: 'projected-light'
  },
  {
    type: 'paragraph',
    text: 'Long before photography, humans created visual trickery. In the 1600s, camera obscura devices projected upside-down images onto walls in darkened rooms. People who didn\'t understand the optics believed they were seeing magic.',
    position: 'top-left',
    effect: 'blur-to-sharp',
    atmosphere: 'projected-light'
  },
  {
    type: 'paragraph',
    text: 'By the 1700s, traveling showmen used magic lanterns—early projectors casting painted images onto screens. In darkened rooms, they created moving ghosts and demons that terrified audiences who\'d never seen projected light.',
    position: 'bottom-right',
    effect: 'fade-in',
    atmosphere: 'projected-light'
  },
  {
    type: 'paragraph',
    text: 'The lesson: new technology creates windows for deception. When people don\'t understand how something works, realistic results are accepted as truth.',
    position: 'center',
    effect: 'line-by-line',
    atmosphere: 'projected-light'
  },
  {
    type: 'section-title',
    text: 'Spirit Photography: When Cameras Lied (1860s–1920s)',
    position: 'full-width',
    special: 'static-overlay',
    atmosphere: 'spirit-static'
  },
  {
    type: 'paragraph',
    text: 'In 1862, photographer William Mumler accidentally created the first spirit photograph using double exposure—exposing the same plate twice. A ghostly figure appeared beside him. Grieving families paid fortunes for photographs of dead relatives, not understanding how cameras could be manipulated.',
    position: 'top-left',
    special: 'static-overlay',
    effect: 'ink-spread',
    atmosphere: 'spirit-static'
  },
  {
    type: 'paragraph',
    text: 'For sixty years, spirit photography boomed. Photographers used simple tricks—double exposures, hanging cloth, accomplices in sheets—to create "proof" of the afterlife. Why did it work? Photography was new, the images looked real, people wanted to believe, and "seeing is believing" was still reliable.',
    position: 'bottom-right',
    special: 'static-overlay',
    effect: 'line-by-line',
    atmosphere: 'spirit-static'
  },
  {
    type: 'paragraph',
    text: 'By the 1920s, magicians like Houdini exposed the tricks, but for decades fake photographs had influenced beliefs and extracted money from grieving families.',
    position: 'center',
    special: 'static-overlay',
    effect: 'shrink-back',
    atmosphere: 'spirit-static'
  },
  {
    type: 'section-title',
    text: 'Hollywood Magic: Manufacturing Reality (1920s–1980s)',
    position: 'full-width',
    special: 'vintage-film',
    effect: 'film-credits',
    atmosphere: 'projected-light'
  },
  {
    type: 'paragraph',
    text: 'Film brought new illusions. Miniatures made tiny models look massive—King Kong (1933) was an 18-inch puppet. Matte paintings created castles and cities that didn\'t exist. Stop-motion brought creatures to life frame by frame. Rear projection put actors in exotic locations while they stood in studios.',
    position: 'top-right',
    special: 'vintage-film',
    effect: 'pan-lr',
    atmosphere: 'projected-light'
  },
  {
    type: 'paragraph',
    text: 'Everyone knew movies were fiction, but your brain believed them anyway. You knew the monster wasn\'t real, but your heart still raced.',
    position: 'center',
    special: 'vintage-film',
    effect: 'blur-to-sharp',
    atmosphere: 'projected-light'
  },
  {
    type: 'section-title',
    text: 'Photoshop: Everyone Can Fake (1990s–2000s)',
    position: 'full-width',
    special: 'rgb-split'
  },
  {
    type: 'paragraph',
    text: 'In 1990, Photoshop made photo editing accessible to anyone with a computer. Suddenly you could remove people from photographs, add things that were never there, alter faces and bodies, combine multiple images. Magazine covers showed impossible perfection. News photos were altered to remove inconvenient politicians.',
    position: 'top-left',
    special: 'rgb-split',
    effect: 'split-reveal'
  },
  {
    type: 'paragraph',
    text: 'The manipulation was often detectable if you looked closely—inconsistent lighting, weird shadows, wrong proportions. But most people weren\'t looking closely. They were scrolling fast, trusting their eyes. A new assumption emerged: every photograph might be fake.',
    position: 'bottom-right',
    special: 'rgb-split',
    effect: 'fade-in'
  },
  {
    type: 'full-image',
    src: '/exhibitions/seeing/waves.jpg',
    alt: 'Op-art pattern of rippling black and pale blue stripes',
    effect: 'waves-drift'
  },
  {
    type: 'section-title',
    text: 'Deepfakes: AI Creates Reality (2017–Present)',
    position: 'center',
    special: 'glitch-persistent',
    effect: 'glitch',
    atmosphere: 'deepfake-glitch'
  },
  {
    type: 'paragraph',
    text: 'In 2017, AI could generate photorealistic images of people who don\'t exist. By 2018, AI created convincing videos of real people saying things they never said. By 2020, these "deepfakes" were indistinguishable from authentic footage.',
    position: 'top-left',
    special: 'glitch-persistent',
    effect: 'typewriter',
    atmosphere: 'deepfake-glitch'
  },
  {
    type: 'paragraph',
    text: 'You can create deepfakes with free software, a decent computer, and hours of source footage. No expertise required. The technology also enables voice cloning from seconds of audio, AI-generated photographs of events that never happened, and face-swapping in real-time video.',
    position: 'bottom-right',
    special: 'glitch-persistent',
    effect: 'line-by-line',
    atmosphere: 'deepfake-glitch'
  },
  {
    type: 'paragraph',
    text: 'We\'re now in a world where seeing something happen is no longer reliable evidence that it happened.',
    position: 'center',
    special: 'glitch-persistent',
    effect: 'glitch',
    atmosphere: 'deepfake-glitch'
  },
  {
    type: 'section-title',
    text: 'The Pattern Across 400 Years',
    position: 'full-width'
  },
  {
    type: 'timeline',
    items: [
      '1600s: Magic lanterns deceive people who\'ve never seen projected light.',
      '1860s: Spirit photography deceives people who don\'t understand cameras.',
      '1930s: Film creates convincing fictional realities.',
      '1990s: Photoshop makes manipulation accessible to everyone.',
      '2020s: AI generates realistic content of things that never existed.'
    ],
    position: 'center',
    effect: 'line-by-line'
  },
  {
    type: 'paragraph',
    text: 'The tools change. Human psychology doesn\'t. Every advance creates a window where realistic results are accepted as truth until people learn to recognize the tricks.',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'section-title',
    text: 'How Deception Has Been Used',
    position: 'full-width'
  },
  {
    type: 'paragraph',
    text: 'Visual manipulation has been weaponized to exploit grief, sell products, create false evidence, spread propaganda, manipulate politics, influence markets, destroy reputations, and evade accountability. The motivation hasn\'t changed in 400 years: profit, power, politics, personal gain.',
    position: 'center',
    effect: 'rise-expand'
  },
  {
    type: 'section-title',
    text: 'How to Verify What You See',
    position: 'center',
    effect: 'blur-to-sharp',
    atmosphere: 'deepfake-glitch'
  },
  {
    type: 'paragraph',
    text: 'Question the source: Who created this? Why? Who benefits? If you can\'t answer, you don\'t have enough information.',
    position: 'top-left',
    effect: 'typewriter',
    atmosphere: 'deepfake-glitch'
  },
  {
    type: 'paragraph',
    text: 'Look for technical tells: Unnatural blinking, mismatched lighting, audio sync issues, weird artifacts, strangely smooth skin textures.',
    position: 'top-right',
    effect: 'fade-in',
    atmosphere: 'deepfake-glitch'
  },
  {
    type: 'paragraph',
    text: 'Recognize confirmation bias: Content that confirms what you already believe is most dangerous. It feels true because you want it to be true. That\'s when you should be MOST skeptical.',
    position: 'bottom-center',
    effect: 'split-reveal',
    atmosphere: 'deepfake-glitch'
  },
  {
    type: 'quote',
    text: 'Spirit photography worked because people wanted proof their loved ones weren\'t gone. Deepfakes work because your brain treats seeing as evidence. This instinct served humanity for thousands of years—until we invented ways to show you things that never happened.',
    position: 'center',
    effect: 'ink-spread',
    atmosphere: 'spirit-static'
  },
  {
    type: 'link',
    text: 'Explore More: Josef Albers — The Interaction of Color',
    url: 'https://artsandculture.google.com/story/josef-albers-the-interaction-of-color-bechtler-museum-of-modern-art/owVxXkSkjQuPJA',
    effect: 'film-credits'
  },
  { type: 'end', text: 'Return to Exhibition' }
];
