import type { ApprovedFact, FactSource } from '@/components/exhibition/FactNote';

/*
 * The Perception Lab, as the owner approved it (proposal B4, "You are the
 * scientist"): six benches of illusions and a bonus Ames room. Each
 * illusion goes through the same three steps: Try it (one task, measured or
 * observed), Break it (one switch that takes the trick away), and Why (one
 * sentence, then "Tell me more").
 *
 * Every sentence that explains an illusion is a fact from outside the
 * posters, set with its source (FactNote): `why` and `more`. The tasks and
 * switches are instructions. The Paris phrase is the one exception the
 * proposal allows: a well-known reading demonstration with no single
 * original paper, so it is described as that, without a citation.
 */

export type Category = 'brightness' | 'size' | 'lines' | 'gaps' | 'motion' | 'brain';

export const CATEGORIES: { id: Category; label: string; short: string }[] = [
  { id: 'brightness', label: 'Brightness', short: 'Light' },
  { id: 'size', label: 'Size and length', short: 'Size' },
  { id: 'lines', label: 'Lines and angles', short: 'Lines' },
  { id: 'gaps', label: 'Filling the gaps', short: 'Gaps' },
  { id: 'motion', label: 'Motion', short: 'Motion' },
  { id: 'brain', label: 'Brain against brain', short: 'Brain' },
];

export type IllusionId =
  | 'checker'
  | 'contrast'
  | 'lilac'
  | 'muller-lyer'
  | 'ebbinghaus'
  | 'ponzo'
  | 'jastrow'
  | 'cafe-wall'
  | 'fraser'
  | 'poggendorff'
  | 'blind-spot'
  | 'kanizsa'
  | 'troxler'
  | 'waterfall'
  | 'snakes'
  | 'stroop'
  | 'paris'
  | 'rubin'
  | 'ames';

export type VoteOption = { id: string; label: string; /** Counted as "fooled" in the class fingerprint. */ fooled?: boolean };

export type Illusion = {
  id: IllusionId;
  name: string;
  bench: number;
  category: Category;
  /** Moves, flickers or seems to: a calm warning first, with a way to skip it. */
  motion?: boolean;
  /** Try it: the one task, in plain words. */
  task: string;
  /** Break it: the switch, and what to notice. */
  breakLabel: string;
  breakText: string;
  /** Why: one sentence, with its source. */
  why: ApprovedFact;
  /** Tell me more. */
  more: ApprovedFact[];
  /** Said instead of a source where there is no single original one. */
  unsourced?: string;
  /** Class mode: a hands-up question. */
  vote: { question: string; options: VoteOption[] };
  teacherTip: string;
};

const bach = (path: string, label = 'Michael Bach, Optical Illusions'): FactSource => ({ label, href: `https://michaelbach.de/ot/${path}/` });
const INDEX = (slug: string): FactSource => ({ label: 'The Illusions Index, University of Glasgow', href: `https://www.illusionsindex.org/i/${slug}` });
const AMIR_FIRESTONE: FactSource = {
  label: 'Amir and Firestone (2025), Psychological Review',
  href: 'https://perception.jhu.edu/files/PDFs/25_MullerLyer/AmirFirestone_MullerLyer_2025_PsychReview.pdf',
};
const DOHERTY: FactSource = {
  label: 'Doherty, Campbell, Tsuji and Phillips (2010), Developmental Science',
  href: 'https://dspace.stir.ac.uk/handle/1893/1473',
};
const GREGORY: FactSource = { label: 'Gregory and Heard (1979), Perception', href: 'https://richardgregory.org/papers/cafe_wall/cafe-wall_all.htm' };
const BONNEH: FactSource = { label: 'Bonneh and others (2014), PLoS ONE', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3962462/' };
const KITAOKA: FactSource = { label: 'Akiyoshi Kitaoka, Rotating Snakes', href: 'https://www.psy.ritsumei.ac.jp/~akitaoka/rotsnakee.html' };
const STROOP: FactSource = { label: 'Stroop (1935), Journal of Experimental Psychology', href: 'https://psychclassics.yorku.ca/Stroop/' };
const UMN: FactSource = { label: 'Sensation and Perception, University of Minnesota', href: 'https://pressbooks.umn.edu/sensationandperception/chapter/size-illusions/' };

const SAW = (a: string, b: string, same = 'They look the same'): VoteOption[] => [
  { id: 'a', label: a, fooled: true },
  { id: 'b', label: b, fooled: true },
  { id: 'same', label: same },
];

export const BENCHES: { n: number; title: string; category: Category }[] = [
  { n: 1, title: 'Brightness', category: 'brightness' },
  { n: 2, title: 'Size and length', category: 'size' },
  { n: 3, title: 'Lines and angles', category: 'lines' },
  { n: 4, title: 'Your brain fills the gaps', category: 'gaps' },
  { n: 5, title: 'Motion that isn’t there', category: 'motion' },
  { n: 6, title: 'Brain against brain', category: 'brain' },
  { n: 7, title: 'Bonus: the Ames room', category: 'size' },
];

export const ILLUSIONS: Illusion[] = [
  // ───────── Bench 1: Brightness ─────────
  {
    id: 'checker',
    name: 'Adelson’s checker shadow',
    bench: 1,
    category: 'brightness',
    task: 'Slide the paint chip until it is the same shade as square B looks.',
    breakLabel: 'Join A and B',
    breakText: 'A strip of gray joins A to B. Where it touches them, A and B are the same shade as the strip.',
    why: {
      text: 'Your brain judges a square’s shade by the light it thinks is falling on it: B is in the cylinder’s shadow, so your brain decides B must really be a light square.',
      sources: [bach('lum-adelsonCheckShadow')],
    },
    more: [{ text: 'Edward Adelson, a vision scientist at MIT, published this picture in 1995.', sources: [bach('lum-adelsonCheckShadow')] }],
    vote: { question: 'Hands up: which square looks darker?', options: SAW('A looks darker', 'B looks darker') },
    teacherTip: 'Point at the shadow over square B, and ask why the brain decides B must be lighter than it looks.',
  },
  {
    id: 'contrast',
    name: 'Simultaneous contrast',
    bench: 1,
    category: 'brightness',
    task: 'Make the right-hand square look the same shade as the left-hand one.',
    breakLabel: 'Frame the squares',
    breakText: 'A plain gray frame round each square cuts it off from the background. Now compare them.',
    why: {
      text: 'Your eyes and brain compare each patch with what is around it, so the same gray looks lighter on dark and darker on light.',
      sources: [bach('lum-inducedBrightness')],
    },
    more: [],
    vote: { question: 'Hands up: which square looks darker?', options: SAW('Left looks darker', 'Right looks darker') },
    teacherTip: 'Slide the square slowly across the background together, and ask the class to call out when it seems to change.',
  },
  {
    id: 'lilac',
    name: 'Lilac chaser',
    bench: 1,
    category: 'brightness',
    motion: true,
    task: 'Stare at the cross for 15 seconds. Then: what color is the gap going round?',
    breakLabel: 'Stop the motion',
    breakText: 'With every spot standing still, the green goes away.',
    why: {
      text: 'Each lilac spot tires your eye a little where it falls, so when it vanishes you see the opposite color, green.',
      sources: [bach('col-lilacChaser')],
    },
    more: [
      {
        text: 'Jeremy Hinton invented this illusion in 2005. If you keep your eyes very still on the cross, the lilac spots can fade away altogether, leaving one green spot going round.',
        sources: [bach('col-lilacChaser')],
      },
    ],
    vote: {
      question: 'Hands up: what color was the gap?',
      options: [
        { id: 'green', label: 'Green', fooled: true },
        { id: 'lilac', label: 'Lilac' },
        { id: 'none', label: 'No color' },
      ],
    },
    teacherTip: 'Ask everyone to keep their eyes on the cross for the whole count, then hide the motion and ask where the green went.',
  },

  // ───────── Bench 2: Size and length ─────────
  {
    id: 'muller-lyer',
    name: 'Müller-Lyer',
    bench: 2,
    category: 'size',
    task: 'Drag the middle arrowhead until it sits exactly halfway along the line.',
    breakLabel: 'Hide the fins',
    breakText: 'Now there are no fins. Try halfway again.',
    why: {
      text: 'Scientists still argue about why the fins change how long a line looks.',
      sources: [bach('sze-muelue'), AMIR_FIRESTONE],
    },
    more: [
      {
        text: 'A popular idea says the fins look like the near and far corners of a room. Another idea, that people who grow up among square buildings are fooled more, is disputed: a 2025 review argues that it is wrong.',
        sources: [bach('sze-muelue'), AMIR_FIRESTONE],
      },
      { text: 'Michael Bach, a vision scientist, says he puts the middle about 10% off on this test himself.', sources: [bach('sze-muelue')] },
    ],
    vote: { question: 'Hands up: which half looks longer?', options: SAW('Left half', 'Right half') },
    teacherTip: 'Let a volunteer set the middle on the board, then hide the fins and ask the class whether they would move it.',
  },
  {
    id: 'ebbinghaus',
    name: 'Ebbinghaus circles',
    bench: 2,
    category: 'size',
    task: 'Use the slider to make the right-hand orange circle the same size as the left-hand one.',
    breakLabel: 'Fade the rings',
    breakText: 'With the rings around them faded away, compare the two orange circles again.',
    why: {
      text: 'Next to big circles the middle circle looks small; next to small circles it looks big.',
      sources: [bach('cog-Ebbinghaus')],
    },
    more: [
      {
        text: 'A 2010 study found that children under about seven were much less fooled by these circles than adults. Ask a grown-up to try this one. Who got closer?',
        sources: [DOHERTY],
      },
    ],
    vote: { question: 'Hands up: which orange circle looks bigger?', options: SAW('Left', 'Right') },
    teacherTip: 'Send it home: ask students to test a grown-up and bring back both results.',
  },
  {
    id: 'ponzo',
    name: 'Ponzo railway',
    bench: 2,
    category: 'size',
    task: 'Stretch the top bar until it is the same length as the bottom bar. You can slide it up and down the tracks too.',
    breakLabel: 'Take the rails away',
    breakText: 'Without the rails, compare the two bars again.',
    why: {
      text: 'Lines that meet in the distance make your brain think of depth: the top bar seems further away, so your brain makes it look bigger.',
      sources: [INDEX('ponzo-illusion')],
    },
    more: [{ text: 'Mario Ponzo, an Italian psychologist, first published it in 1910.', sources: [INDEX('ponzo-illusion')] }],
    vote: { question: 'Hands up: which bar looks longer?', options: SAW('Top bar', 'Bottom bar') },
    teacherTip: 'Slide the top bar down to the bottom of the tracks, and ask what happened to its length.',
  },
  {
    id: 'jastrow',
    name: 'Jastrow curves',
    bench: 2,
    category: 'size',
    task: 'Which shape looks bigger? Then slide the top one down onto the bottom one.',
    breakLabel: 'Stack them',
    breakText: 'One on top of the other, they fit exactly. Swap them, and the “bigger” one swaps too.',
    why: {
      text: 'You compare the edges that sit next to each other: the short inside curve of one shape is beside the long outside curve of the other.',
      sources: [bach('geom-Jastrow')],
    },
    more: [],
    vote: { question: 'Hands up: which shape looks bigger?', options: SAW('Top', 'Bottom') },
    teacherTip: 'Press Swap a few times, and ask the class to watch which one seems bigger each time.',
  },

  // ───────── Bench 3: Lines and angles ─────────
  {
    id: 'cafe-wall',
    name: 'Café wall',
    bench: 3,
    category: 'lines',
    task: 'Do the lines between the rows look straight, or tilted?',
    breakLabel: 'Change the mortar',
    breakText: 'Slide the mortar from black to gray to white, and slide the rows into line. When does the tilt appear?',
    why: {
      text: 'The tilt appears only when the mortar is a shade between the dark and the light tiles.',
      sources: [GREGORY],
    },
    more: [
      {
        text: 'Richard Gregory and P. Heard studied it in 1979, after seeing a café wall near their laboratory in Bristol, England.',
        sources: [GREGORY],
      },
    ],
    vote: {
      question: 'Hands up: do the lines look tilted?',
      options: [
        { id: 'tilted', label: 'Tilted', fooled: true },
        { id: 'straight', label: 'Straight' },
      ],
    },
    teacherTip: 'Hold a ruler or a sheet of paper along one line on the board to show it is straight.',
  },
  {
    id: 'fraser',
    name: 'Fraser spiral',
    bench: 3,
    category: 'lines',
    task: 'Is it a spiral, or circles? Then trace one ring and see where it takes you.',
    breakLabel: 'Straighten the rope',
    breakText: 'With every piece of rope lying flat along its ring, there is no spiral.',
    why: {
      text: 'Each twisted piece of “rope” leans inward, and your brain joins all the leans into a spiral that isn’t there.',
      sources: [bach('ang-fraser')],
    },
    more: [{ text: 'J. Fraser published this figure in 1908.', sources: [bach('ang-fraser')] }],
    vote: {
      question: 'Hands up: spiral or circles?',
      options: [
        { id: 'spiral', label: 'A spiral', fooled: true },
        { id: 'circles', label: 'Circles' },
      ],
    },
    teacherTip: 'Ask a volunteer to trace one ring on the board with a finger, all the way round.',
  },
  {
    id: 'poggendorff',
    name: 'Poggendorff',
    bench: 3,
    category: 'lines',
    task: 'The line goes behind the bar. Move the marker to where you think it comes out.',
    breakLabel: 'Lift the bar',
    breakText: 'With the bar lifted, see where the line really goes.',
    why: {
      text: 'Next to the bar the angles look slightly wrong, so the line seems to come out in the wrong place.',
      sources: [bach('ang-poggendorff')],
    },
    more: [],
    vote: {
      question: 'Hands up: where does the line come out?',
      options: [
        { id: 'high', label: 'Higher up', fooled: true },
        { id: 'low', label: 'Lower down', fooled: true },
        { id: 'level', label: 'Just where it should' },
      ],
    },
    teacherTip: 'Take guesses from the class before lifting the bar, and mark them on the board.',
  },

  // ───────── Bench 4: Your brain fills the gaps ─────────
  {
    id: 'blind-spot',
    name: 'Your blind spot',
    bench: 4,
    category: 'gaps',
    task: 'Close your left eye. Look at the cross with your right eye. Move closer to the screen, or further away, until the dot vanishes.',
    breakLabel: 'Open both eyes',
    breakText: 'With both eyes open, the dot is back: each eye sees what the other one misses.',
    why: {
      text: 'Where the nerve fibres leave the back of your eye there is no room for light-sensing cells, so that spot sees nothing.',
      sources: [bach('cog-blindSpot')],
    },
    more: [
      {
        text: 'Your brain fills the hole with what is around it, so you never notice it. Scientists call this “filling in”, but how it works is not well understood.',
        sources: [bach('cog-blindSpot')],
      },
    ],
    vote: {
      question: 'Hands up: did the dot vanish?',
      options: [
        { id: 'yes', label: 'It vanished', fooled: true },
        { id: 'no', label: 'Not yet' },
      ],
    },
    teacherTip: 'Everyone can do this one from their seat at once: ask them to lean slowly towards the board and back.',
  },
  {
    id: 'kanizsa',
    name: 'Kanizsa triangle',
    bench: 4,
    category: 'gaps',
    task: 'Tap each shape to turn it. Can you make a triangle appear?',
    breakLabel: 'Close the mouths',
    breakText: 'With the gaps filled in, the triangle is gone. There was never an edge there.',
    why: {
      text: 'The gaps line up so neatly that your brain decides a white triangle must be lying on top of them.',
      sources: [bach('cog-Kanizsa'), INDEX('kanizsa-triangle')],
    },
    more: [],
    vote: {
      question: 'Hands up: can you see the triangle’s edges?',
      options: [
        { id: 'yes', label: 'Yes', fooled: true },
        { id: 'no', label: 'No' },
      ],
    },
    teacherTip: 'Ask a volunteer to trace the triangle’s edge on the board, then ask where exactly the edge is.',
  },
  {
    id: 'troxler',
    name: 'Troxler fading',
    bench: 4,
    category: 'gaps',
    task: 'Start the timer, then stare at the dot in the middle. Tap “It faded!” when the colors go.',
    breakLabel: 'Nudge it',
    breakText: 'Now the ring jumps a little every few seconds. Does it still fade?',
    why: {
      text: 'A faint pattern at the edge of your vision fades away if you keep your eyes still, because nerve cells stop responding to things that do not change.',
      sources: [BONNEH, INDEX('troxler-effect')],
    },
    more: [{ text: 'Ignaz Troxler first described it in 1804.', sources: [BONNEH] }],
    vote: {
      question: 'Hands up: did the colors fade?',
      options: [
        { id: 'yes', label: 'They faded', fooled: true },
        { id: 'no', label: 'They stayed' },
      ],
    },
    teacherTip: 'Ask the class not to blink, then count how many seconds it takes for the first hands to go up.',
  },

  // ───────── Bench 5: Motion that isn't there ─────────
  {
    id: 'waterfall',
    name: 'The waterfall effect',
    bench: 5,
    category: 'motion',
    motion: true,
    task: 'Stare at the middle of the turning spiral until the ring fills up (30 seconds). Then watch the still picture.',
    breakLabel: 'Turn both ways',
    breakText: 'Now the spiral changes direction every few seconds while you stare. Does the still picture move afterwards?',
    why: {
      text: 'The cells that sense movement one way tire out, so a still picture seems to drift the other way.',
      sources: [bach('mot-adapt'), INDEX('waterfall-illusion')],
    },
    more: [
      {
        text: 'In 1834 Robert Addams wrote about staring at a waterfall in Scotland and then seeing the rocks beside it seem to move upwards.',
        sources: [INDEX('waterfall-illusion')],
      },
    ],
    vote: {
      question: 'Hands up: did the still picture seem to move?',
      options: [
        { id: 'yes', label: 'It moved', fooled: true },
        { id: 'no', label: 'It stayed still' },
      ],
    },
    teacherTip: 'Ask the class to keep their eyes on the very middle for the whole 30 seconds, and to say nothing until the still picture appears.',
  },
  {
    id: 'snakes',
    name: 'Rotating snakes',
    bench: 5,
    category: 'motion',
    motion: true,
    task: 'Look around the picture. Do the circles seem to turn? Now look straight at one circle and hold still. What happens to it?',
    breakLabel: 'Change the order',
    breakText: 'The same circles with the two middle shades made the same gray. Do they still turn?',
    why: {
      text: 'The motion depends on your eyes moving and on the order of the shades, from black to dark blue to white to yellow; hold your eyes still and it stops.',
      sources: [bach('mot-snakes'), KITAOKA],
    },
    more: [
      {
        text: 'Akiyoshi Kitaoka made the Rotating Snakes in 2003. The circles here were drawn for the museum in the same way, after his.',
        sources: [KITAOKA],
      },
    ],
    vote: {
      question: 'Hands up: did the circles seem to turn?',
      options: [
        { id: 'yes', label: 'They turned', fooled: true },
        { id: 'no', label: 'They stayed still' },
      ],
    },
    teacherTip: 'Some people see little or no motion here: ask the class whether everyone saw the same thing.',
  },

  // ───────── Bench 6: Brain against brain ─────────
  {
    id: 'stroop',
    name: 'Stroop race',
    bench: 6,
    category: 'brain',
    task: 'Round 1: say the color of each patch, out loud. Round 2: say the color of the ink each word is printed in, not the word.',
    breakLabel: 'Round 3: matching ink',
    breakText: 'Now every word is printed in its own color. Say the ink colors again.',
    why: {
      text: 'Reading is so automatic that your brain reads the word before you can stop it, and that gets in the way of naming the color.',
      sources: [STROOP],
    },
    more: [{ text: 'J. Ridley Stroop published this test in 1935.', sources: [STROOP] }],
    vote: {
      question: 'Hands up: was Round 2 harder?',
      options: [
        { id: 'yes', label: 'Round 2 was harder', fooled: true },
        { id: 'no', label: 'They felt the same' },
      ],
    },
    teacherTip: 'Have the whole class say the colors aloud together while you time each round.',
  },
  {
    id: 'paris',
    // Named for what you do, not what it says, so the name gives nothing away.
    name: 'Read the sign',
    bench: 6,
    category: 'brain',
    task: 'Read the sign out loud. Then tap the word that is wrong.',
    breakLabel: 'Put it on one line',
    breakText: 'Written on one line, the extra word is easy to spot.',
    why: { text: '', sources: [] },
    more: [],
    unsourced: 'Your brain expects a familiar phrase and skips checking every word. This is a well-known reading demonstration rather than an illusion from one study, so there is no single original source.',
    vote: {
      question: 'Hands up: who spotted the mistake the first time they read it?',
      options: [
        { id: 'no', label: 'I missed it', fooled: true },
        { id: 'yes', label: 'I spotted it' },
      ],
    },
    teacherTip: 'Show it for three seconds only, then hide it and ask the class to say what it said.',
  },
  {
    id: 'rubin',
    name: 'Rubin’s vase',
    bench: 6,
    category: 'brain',
    task: 'What did you see first: a vase, or two faces? Now try to flip it on purpose.',
    breakLabel: 'Give the faces eyes',
    breakText: 'With eyes and a mouth, the faces win. Is the vase still there?',
    why: {
      text: 'Your brain picks one way of seeing it at a time, and switches between the vase and the faces.',
      sources: [INDEX('rubin-s-vase')],
    },
    more: [{ text: 'Edgar Rubin, a Danish psychologist, first published the figure in 1915.', sources: [INDEX('rubin-s-vase')] }],
    vote: {
      question: 'Hands up: what did you see first?',
      options: [
        { id: 'vase', label: 'A vase' },
        { id: 'faces', label: 'Two faces' },
      ],
    },
    teacherTip: 'Count the hands for each, then ask whether anyone can see both at the very same moment.',
  },

  // ───────── Bonus ─────────
  {
    id: 'ames',
    name: 'The Ames room',
    bench: 7,
    category: 'size',
    task: 'Look into the room through the peephole. Drag the child from one corner to the other.',
    breakLabel: 'Fly above',
    breakText: 'From above you can see the room’s real shape: the left corner is much further away than the right.',
    why: {
      text: 'The far wall is slanted, so one corner is much further away; from the peephole the room looks square, so people seem to change size.',
      sources: [UMN],
    },
    more: [{ text: 'Adelbert Ames Jr. invented the Ames room.', sources: [UMN] }],
    vote: {
      question: 'Hands up: did the child seem to grow?',
      options: [
        { id: 'yes', label: 'The child grew', fooled: true },
        { id: 'no', label: 'The child stayed the same' },
      ],
    },
    teacherTip: 'Ask the class how a real room could be built to do this, before you fly above.',
  },
];

export const byId = (id: IllusionId) => ILLUSIONS.find((i) => i.id === id)!;

/** The lab's own words for the start and the end (instructions, not facts). */
export const LAB_TEXT = {
  title: 'Perception Lab',
  kicker: 'Seeing is Deceiving',
  lead: 'You are the scientist. Measure how much each illusion fools you, switch the trick off, and write the result in your Lab Notebook.',
  rule: 'Being fooled isn’t wrong. It’s the result.',
  how: ['Try it: one task.', 'Break it: one switch takes the trick away.', 'Why? The science, with its source.'],
  noData: 'Nothing you do here is saved or sent anywhere.',
};
