/**
 * Illusion content data for the carousel
 */

export type IllusionItem = {
  type: 'intro' | 'illusion' | 'closing';
  title?: string;
  subtitle?: string;
  text?: string;
  illusionType?: string;
  src?: string;
  revealSrc?: string;
  altRevealSrc?: string;
  question?: string;
  answer?: string;
  scienceExplanation?: string;
};

export const ILLUSION_CONTENT: IllusionItem[] = [
  // SECTION INTRO
  {
    type: 'intro',
    title: 'Test Your Perception',
    subtitle: 'Interactive optical illusions that reveal how your brain interprets reality'
  },

  // 1. CHECKER SHADOW
  {
    type: 'illusion',
    illusionType: 'checker-shadow',
    src: '/exhibitions/seeing/checker-shadow.jpg',
    revealSrc: '/exhibitions/seeing/checker-reveal.jpg',
    question: 'A is darker than B — true or false?',
    answer: 'The answer is: IDENTICAL — Both squares are the exact same shade. Your brain "corrects" for the shadow.',
    scienceExplanation: 'This is called "lightness constancy" — your visual system automatically adjusts for lighting conditions so you can recognize objects whether they\'re in shadow or sunlight. The cylinder casts a shadow over square B, so your brain assumes B must actually be lighter than it appears (otherwise it would look even darker in the shadow). This compensation is so automatic you can\'t turn it off, even knowing the trick. MIT professor Edward Adelson created this illusion in 1995 to demonstrate that perception isn\'t about measuring light — it\'s about interpreting scenes.'
  },

  // 2. SIMULTANEOUS CONTRAST (SVG)
  {
    type: 'illusion',
    illusionType: 'simultaneous-contrast',
    question: 'Which is darker — A or B?',
    answer: 'The answer is: Your brain judges color by comparison. The same cyan appears more blue-green on orange and more greenish on purple.',
    scienceExplanation: 'Your visual system evolved to detect differences, not absolute values. When the same color sits on different backgrounds, your neurons compare it to the surroundings. On orange, the cyan appears to shift toward blue-green. On purple, it appears more greenish. This relative coding is efficient — it lets you recognize objects under wildly different lighting conditions. But it means you never see "true" colors; you only see relationships.'
  },

  // 3. BALCONY
  {
    type: 'illusion',
    illusionType: 'balcony',
    src: '/exhibitions/seeing/balcony.jpg',
    revealSrc: '/exhibitions/seeing/balcony-out.jpg',
    altRevealSrc: '/exhibitions/seeing/balcony-over.jpg',
    question: 'What do you see? A man on a balcony looking out — or looking over a ledge from inside?',
    answer: 'The answer is: Both interpretations are valid. The image supports both equally — your brain picks one.',
    scienceExplanation: 'This is a "bistable" or "reversible" figure — an image with two equally valid interpretations that your brain cannot hold simultaneously. Your visual cortex must commit to one 3D interpretation of the 2D image. The switch happens in your brain\'s "dorsal stream," which processes spatial relationships. Interestingly, once you see both interpretations, you can often voluntarily switch between them, but you\'ll never see both at once. Your brain literally cannot perceive ambiguity — it must decide.'
  },

  // 4. RUBIN'S VASE
  {
    type: 'illusion',
    illusionType: 'rubins-vase',
    src: '/exhibitions/seeing/rubins-vase.jpg',
    revealSrc: '/exhibitions/seeing/rubins-vase-vase.jpg',
    altRevealSrc: '/exhibitions/seeing/rubins-vase-face.jpg',
    question: 'Do you see a vase or two faces?',
    answer: 'The answer is: BOTH! Your brain can interpret the same contour as either — but never both at once.',
    scienceExplanation: 'Created by Danish psychologist Edgar Rubin in 1915, this demonstrates "figure-ground segregation" — your brain\'s need to decide what\'s the object and what\'s the background. The same curved line can be the edge of a vase OR the profile of a face, but not both simultaneously. This happens in your visual cortex\'s "border ownership" neurons, which must assign each edge to one side or the other. The ambiguity reveals a fundamental choice your brain makes thousands of times per second, usually without you noticing.'
  },

  // 5. FRASER SPIRAL
  {
    type: 'illusion',
    illusionType: 'fraser-spiral',
    src: '/exhibitions/seeing/fraser-spiral.jpg',
    revealSrc: '/exhibitions/seeing/fraser-spiral.gif',
    question: 'What shape is this — spirals or circles?',
    answer: 'The answer is: CIRCLES! These are perfect concentric circles — no spiral exists. The twisted cord pattern tricks your brain.',
    scienceExplanation: 'The "twisted cord" elements create local tilt signals that your brain integrates into a global spiral percept. Each small segment appears tilted due to the black and white pattern, and your visual system — trying to find continuous contours — links these tilts into a spiral that doesn\'t exist. This reveals how your brain constructs edges: it doesn\'t just trace lines, it interprets local orientation cues and sometimes gets fooled when those cues conflict with the actual geometry. Discovered by British psychologist James Fraser in 1908.'
  },

  // 6. CAFÉ WALL (SVG)
  {
    type: 'illusion',
    illusionType: 'cafe-wall',
    question: 'Which way do the gray lines tilt — left or right?',
    answer: 'The answer is: NEITHER! They\'re perfectly parallel. The offset tiles create a powerful tilt illusion.',
    scienceExplanation: 'Discovered on an actual café wall in Bristol, England in 1979, this illusion occurs because your brain\'s edge-detection neurons respond differently to high-contrast boundaries. Where black tiles meet the gray mortar on one side and white tiles on the other, your visual system perceives a subtle "wedge" shape. These local wedge signals accumulate across the image, creating a compelling sense of alternating tilt in lines that are perfectly horizontal. The gray mortar is essential — without it, the illusion disappears.'
  },

  // 7. BULGING GRID
  {
    type: 'illusion',
    illusionType: 'bulging-grid',
    src: '/exhibitions/seeing/bulging-grid.jpg',
    revealSrc: '/exhibitions/seeing/grid.jpg',
    question: 'The center of this grid bulges outward — true or false?',
    answer: 'The answer is: FALSE — It\'s perfectly flat. The varying square sizes create the illusion of depth.',
    scienceExplanation: 'Your brain uses size gradients as depth cues — in the real world, objects appear smaller as they recede. Here, the squares get progressively smaller toward the center, triggering your depth perception system to interpret this as a surface curving away from you. The high contrast and regular geometry amplify the effect. This exploits the same neural mechanisms that let you perceive depth in photographs and paintings — mechanisms so fundamental they activate even when you know they\'re being tricked.'
  },

  // 8. ROTATING SNAKES
  {
    type: 'illusion',
    illusionType: 'rotating-snakes',
    src: '/exhibitions/seeing/rotating-snakes.jpg',
    question: 'Look around the image. Do you see movement?',
    answer: 'The answer is: Nothing is moving. This is a static image. Your peripheral vision sees motion that isn\'t there.',
    scienceExplanation: 'Created by Akiyoshi Kitaoka in 2003, this illusion exploits how your brain processes motion. The specific color sequence (black → dark blue → white → yellow) creates asymmetric neural responses in your retina and visual cortex. When your eyes make tiny involuntary movements called "microsaccades," different parts of the pattern activate at slightly different times, and your motion-detection neurons interpret this as rotation. The effect is strongest in peripheral vision because those neurons are more sensitive to motion than to fine detail.'
  },

  // 9. LILAC CHASER (SVG Animation)
  {
    type: 'illusion',
    illusionType: 'lilac-chaser',
    question: 'Stare at the center cross for 15 seconds. What do you see?',
    answer: 'The answer is: A GREEN DOT appears to chase the gap! With prolonged fixation, the dots may fade entirely.',
    scienceExplanation: 'This illusion combines multiple phenomena. First, Troxler\'s fading: when you fixate steadily, unchanging peripheral stimuli fade from awareness as neurons stop responding to constant input. Second, negative afterimages: the lilac (magenta) dots fatigue the red and blue cone cells, so when a dot disappears, you see its complementary color — green. The result is a phantom green dot that seems to "chase" the gap around the circle, even though nothing green exists in the image.'
  },

  // 10. PONZO CORRIDOR
  {
    type: 'illusion',
    illusionType: 'ponzo-corridor',
    src: '/exhibitions/seeing/ponzo-corridor.jpg',
    question: 'Which checkered ball is larger?',
    answer: 'The answer is: IDENTICAL — Depth cues from the corridor make the back ball seem larger.',
    scienceExplanation: 'Named after Italian psychologist Mario Ponzo (1911), this illusion demonstrates "size constancy" — your brain\'s automatic adjustment for distance. The converging lines signal depth (like railway tracks receding), telling your brain the upper ball is "farther away." Since it takes up the same space on your retina as the "closer" ball, your brain concludes it must be physically larger. This compensation is essential for real-world perception — without it, people would appear to shrink as they walked away from you.'
  },

  // 11. PONZO RAILROAD (SVG)
  {
    type: 'illusion',
    illusionType: 'ponzo-railroad',
    question: 'The top yellow bar is longer than the bottom — true or false?',
    answer: 'The answer is: FALSE — They\'re identical. The converging lines create false depth, making the "distant" bar seem larger.',
    scienceExplanation: 'This simplified version of the Ponzo illusion strips away realistic imagery to show the pure geometry. The converging lines mimic railway tracks or a corridor receding into the distance. Your brain automatically applies perspective correction: if two objects cast the same retinal image but one is "farther away," the distant one must be physically larger. This correction happens before conscious perception — you can\'t turn it off even when you know the lines are equal.'
  },

  // 12. MÜLLER-LYER (SVG)
  {
    type: 'illusion',
    illusionType: 'muller-lyer',
    question: 'Which line is longer — 1 or 2?',
    answer: 'The answer is: IDENTICAL — The arrow direction creates a powerful length illusion.',
    scienceExplanation: 'Discovered by Franz Carl Müller-Lyer in 1889, this is one of the most studied illusions in psychology. One theory: outward-pointing arrows resemble the inside corners of a room (which recede from you), while inward arrows resemble outside corners (which project toward you). Your brain applies size constancy, making the "receding" line seem longer. Remarkably, people from cultures without rectangular architecture (like the San of the Kalahari) are less susceptible — suggesting the illusion is partially learned.'
  },

  // 13. JASTROW
  {
    type: 'illusion',
    illusionType: 'jastrow',
    src: '/exhibitions/seeing/jastrow-tracks.jpg',
    revealSrc: '/exhibitions/seeing/jastrow-tracks-reveal.gif',
    question: 'Which curved shape is larger?',
    answer: 'The answer is: IDENTICAL — Your brain compares the short inner edge of one to the long outer edge of the other.',
    scienceExplanation: 'Discovered by Joseph Jastrow in 1889, this illusion occurs because your brain judges size by comparing adjacent edges rather than measuring absolute dimensions. The short inner curve of one shape sits directly against the long outer curve of the other, making the first seem smaller by comparison. Your visual system evolved to make quick relative judgments (is that predator bigger than me?) rather than precise measurements — usually helpful, but exploitable by the right geometry.'
  },

  // 14. EBBINGHAUS CIRCLES
  {
    type: 'illusion',
    illusionType: 'ebbinghaus-circles',
    src: '/exhibitions/seeing/ebbinghaus.jpg',
    revealSrc: '/exhibitions/seeing/ebbinghaus-reveal.jpg',
    question: 'Which purple circle is larger — left or right?',
    answer: 'The answer is: IDENTICAL — Size is relative. Surrounded by large circles, the center looks small; surrounded by small circles, it looks large.',
    scienceExplanation: 'Also called the Titchener circles, this illusion demonstrates that your brain judges size by context, not absolute measurement. The same circle appears smaller when surrounded by large circles (it\'s the smallest thing in view) and larger when surrounded by small circles (it\'s the largest thing in view). This relative sizing is deeply embedded in perception — even knowing the trick, you cannot see the circles as equal. The illusion works on children as young as 4 and even on some animals.'
  },

  // 15. IMPOSSIBLE TRIDENT
  {
    type: 'illusion',
    illusionType: 'impossible-trident',
    src: '/exhibitions/seeing/impossible-trident.jpg',
    question: 'How many prongs does this object have?',
    answer: 'The answer is: Two at the top, three at the bottom. This object cannot exist in 3D space.',
    scienceExplanation: 'Also called a "blivet," this impossible figure exploits how your brain interprets 2D line drawings as 3D objects. Each local region of the drawing is valid — you can trace any small section and it makes sense. But globally, the figure contradicts itself. Your brain uses "non-accidental properties" (junctions, parallel lines) to infer 3D structure, and here those cues create an object that violates physical law. First published in 1964, it reveals the assumptions your visual system makes — and how easily they break.'
  },

  // 16. KANIZSA TRIANGLE (SVG)
  {
    type: 'illusion',
    illusionType: 'kanizsa-triangle-svg',
    question: 'Do you see a black triangle?',
    answer: 'The answer is: There IS no black triangle — your brain creates edges where none exist.',
    scienceExplanation: 'Created by Italian psychologist Gaetano Kanizsa in 1955, this demonstrates "illusory contours" or "subjective contours." Your brain\'s visual cortex contains neurons that respond to edges — but these neurons can be activated by implied edges too. The pac-man shapes suggest a triangle occluding them, so your brain "completes" the triangle, even perceiving it as slightly brighter than the background (which it isn\'t). This completion happens automatically, revealing how much your brain constructs rather than passively receives.'
  },

  // 17. SANDER PARALLELOGRAM
  {
    type: 'illusion',
    illusionType: 'sander-parallelogram',
    src: '/exhibitions/seeing/line-comparison.jpg',
    revealSrc: '/exhibitions/seeing/line-comparison-reveal.gif',
    question: 'Which line is longer — A-B or B-C?',
    answer: 'The answer is: IDENTICAL — Both lines are exactly the same length. The angled lines create a false sense of perspective.',
    scienceExplanation: 'Named after German psychologist Friedrich Sander (1926), this illusion shows how context shapes size perception. The diagonal of a large parallelogram is judged against the full shape, making it seem proportionally smaller. The diagonal of a small parallelogram dominates its enclosure, making it seem proportionally larger. Your brain doesn\'t measure lines in isolation — it evaluates them relative to their surroundings, and this comparative judgment can be dramatically wrong.'
  },

  // 18. POGGENDORFF
  {
    type: 'illusion',
    illusionType: 'poggendorff',
    src: '/exhibitions/seeing/poggendorf.jpg',
    revealSrc: '/exhibitions/seeing/poggendorf-reveal.jpg',
    question: 'Which line does the yellow line connect to — grey or purple?',
    answer: 'The answer is: PURPLE — The rectangle disrupts your ability to track the trajectory.',
    scienceExplanation: 'Discovered by physicist Johann Poggendorff in 1860, this illusion reveals a flaw in how your brain tracks lines across interruptions. When a diagonal line disappears behind an occluding rectangle, your visual system must "continue" it mentally — but it systematically errs, typically perceiving the continuation as too high. This may relate to how your brain processes acute angles: the diagonal\'s angle with the vertical edge is misperceived, throwing off the trajectory. The wider the rectangle, the stronger the illusion.'
  },

  // 19. GRADIENT BAR
  {
    type: 'illusion',
    illusionType: 'gradient-bar',
    src: '/exhibitions/seeing/gradient.jpg',
    revealSrc: '/exhibitions/seeing/gradient-reveal.jpg',
    question: 'Is the bar a gradient or solid color?',
    answer: 'The answer is: SOLID COLOR! The bar is uniform throughout. The gradient background creates the illusion of variation.',
    scienceExplanation: 'This is simultaneous contrast in action. Your visual neurons encode brightness relative to their surroundings, not absolutely. On the dark end of the gradient, the gray bar appears lighter (it\'s brighter than its background). On the light end, the same gray appears darker (it\'s dimmer than its background). This relative encoding is extremely useful — it lets you see objects consistently under varying illumination. But it means you can never see "true" colors, only relationships.'
  },

  // 20. HERMANN GRID
  {
    type: 'illusion',
    illusionType: 'hermann-grid',
    src: '/exhibitions/seeing/ghost-dots.jpg',
    question: 'Do you see gray dots at the intersections?',
    answer: 'The answer is: Ghost dots appear where you\'re NOT looking. Look directly — they vanish!',
    scienceExplanation: 'Discovered by Ludimar Hermann in 1870, this illusion was long attributed to "lateral inhibition" — retinal cells suppressing their neighbors. At intersections, more white surrounds each point, so more inhibition occurs, making those spots appear darker. However, recent research suggests the effect also involves neurons in your visual cortex that respond to specific spatial frequencies. The dots vanish when you look directly because your central vision (fovea) has much finer resolution than your peripheral vision, resolving the true brightness.'
  },

  // 21. PARIS IN THE SPRINGTIME (SVG)
  {
    type: 'illusion',
    illusionType: 'paris-springtime-svg',
    question: 'Read the text inside the triangle carefully.',
    answer: 'The answer is: "THE" appears TWICE! Your brain predicts familiar phrases and skips what it expects.',
    scienceExplanation: 'This isn\'t a visual illusion — it\'s a demonstration of "predictive processing." Your brain doesn\'t passively receive information; it actively predicts what\'s coming based on context. When you read a familiar phrase like "Paris in the springtime," your brain predicts the words and only checks for confirmation, not for accuracy. The duplicate "THE" slips past because it matches the predicted word. This predictive efficiency usually helps (reading would be impossibly slow otherwise) but creates blind spots for unexpected repetitions.'
  },

  // 22. CHROMOSTEREOPSIS
  {
    type: 'illusion',
    illusionType: 'chromostereopsis',
    src: '/exhibitions/seeing/chromostereopsis.jpg',
    question: 'Does the red appear to float above the blue?',
    answer: 'The answer is: This image is completely flat — yet it appears 3D. Red and blue light focus at different depths in your eye, creating a false sense of depth where none exists.',
    scienceExplanation: 'Chromostereopsis occurs because different wavelengths of light focus at slightly different distances within your eye. Red light focuses slightly behind your retina while blue focuses in front, creating a depth difference your brain interprets as real 3D. This "chromatic aberration" is usually too subtle to notice, but with high-contrast red and blue placed together, the effect becomes striking. Some people see red in front, others see blue in front — it depends on subtle differences in eye physiology.'
  },

  // 23. SEESAW
  {
    type: 'illusion',
    illusionType: 'seesaw',
    src: '/exhibitions/seeing/seesaw.jpg',
    revealSrc: '/exhibitions/seeing/seesaw-reveal.gif',
    question: 'Which side is heavier?',
    answer: 'The answer is: They\'re balanced! Your brain uses visual cues like size and position to estimate weight, but these cues can be deceiving.',
    scienceExplanation: 'Your brain constantly makes predictions about the physical world based on visual cues. Size, position, and apparent density all contribute to weight estimation. But these intuitive physics judgments can be fooled when visual cues conflict with actual physics. This reveals how much your perception of weight is a construction, not a direct measurement.'
  },

  // CLOSING
  {
    type: 'closing',
    text: 'These aren\'t tricks — they\'re features. Your brain takes shortcuts to process 11 million bits of information per second. Usually it works. Sometimes it doesn\'t.'
  }
];
