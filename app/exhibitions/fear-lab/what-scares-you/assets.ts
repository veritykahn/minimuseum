/*
 * The lab's drop-in slots: every sound and animation the owner can replace
 * with her own file. Each slot names one file under
 * public/exhibitions/fear-lab/. Drop a file in at that exact name and the
 * lab uses it from the next build; until then, the lab makes the sound
 * itself (Web Audio, sound.ts) or draws the animation (CSS and SVG). No code
 * needs changing. Which slots are filled is read from disk when the page is
 * built (assetSlots.ts), so an empty slot costs no request.
 *
 * Sounds: MP3, short, quiet enough to sit over the drone. Gentle mode plays
 * the same file at about half the volume.
 * Animations: WebM (VP9), full screen, played muted over the dark. With the
 * visitor's reduced-motion setting, the drawn, fading version is used
 * instead, whatever is dropped in.
 */

export const ASSET_DIR = '/exhibitions/fear-lab';

export const SOUND_SLOTS = {
  // The fear boxes
  creak: { file: 'sounds/creak.mp3', use: 'A box lid creaking slowly open in the dark (about 2.5 seconds).' },
  'lid-close': { file: 'sounds/lid-close.mp3', use: 'The lid shutting again: a soft wooden clunk.' },
  harmless: { file: 'sounds/harmless.mp3', use: 'Something harmless appears (the pinecone): a warm, pleasant chime.' },
  empty: { file: 'sounds/empty.mp3', use: 'An empty box: a soft, hollow breath of air.' },
  scary: { file: 'sounds/scary.mp3', use: 'The scare: a rush and a stinger as the spiders pour out.' },
  spiders: { file: 'sounds/spiders.mp3', use: 'Hundreds of little legs skittering across the floor (about 4 seconds).' },
  'creature-cockroach': { file: 'sounds/creature-cockroach.mp3', use: 'The cockroach: a dry skitter.' },
  'creature-tarantula': { file: 'sounds/creature-tarantula.mp3', use: 'The tarantula: a slow, heavy skitter.' },
  'creature-bat': { file: 'sounds/creature-bat.mp3', use: 'The bat: wing flaps.' },
  'creature-snake': { file: 'sounds/creature-snake.mp3', use: 'The snake: a hiss.' },
  'creature-rat': { file: 'sounds/creature-rat.mp3', use: 'The rat: squeaks and scrabbling.' },
  'creature-centipede': { file: 'sounds/creature-centipede.mp3', use: 'The centipede: a fast, many-legged skitter.' },
  // The fear boxes: the silly surprises (nothing scary in any of them)
  slime: { file: 'sounds/slime.mp3', use: 'Slime splats on the screen: a wet, squelchy splat, then a slow slurp as it slides down (about 2 seconds).' },
  confetti: { file: 'sounds/confetti.mp3', use: 'A party popper: one bright pop, then confetti pattering down, maybe a small cheer.' },
  boing: { file: 'sounds/boing.mp3', use: 'A jack-in-the-box: a springy, wobbling “boing-oing-oing”.' },
  squeak: { file: 'sounds/squeak.mp3', use: 'A rubber chicken: a silly squeezed squawk, two or three times.' },
  bubbles: { file: 'sounds/bubbles.mp3', use: 'Bubbles floating up and popping: soft little plips and pops (about 2 seconds).' },
  feather: { file: 'sounds/feather.mp3', use: 'A feather drifting down: a soft, airy whoosh with a gentle twinkle.' },
  // Known or unknown
  zap: { file: 'sounds/zap.mp3', use: 'A small electric shock: a short buzz and crackle.' },
  'big-zap': { file: 'sounds/big-zap.mp3', use: 'A stronger electric shock: a longer, lower buzz.' },
  clock: { file: 'sounds/clock.mp3', use: 'Waiting: a clock ticking (about 2 seconds).' },
  dread: { file: 'sounds/dread.mp3', use: 'The unknown: a slow swell of dread.' },
  skitter: { file: 'sounds/skitter.mp3', use: 'A spider you can see, running across the glass.' },
  marbles: { file: 'sounds/marbles.mp3', use: 'A jar of marbles, clinking.' },
  ghost: { file: 'sounds/ghost.mp3', use: 'A friendly, only-a-little-scary haunted-house “oooo”.' },
  haunt: { file: 'sounds/haunt.mp3', use: 'The scariest haunted house: a low organ chord and a thump.' },
  quiet: { file: 'sounds/quiet.mp3', use: 'An empty, quiet room: a faint hum.' },
  tick: { file: 'sounds/tick.mp3', use: 'A soft click, for buttons and the countdown’s last seconds.' },
  // The rustling bushes
  rustle: { file: 'sounds/rustle.mp3', use: 'Leaves rustling in a bush.' },
  growl: { file: 'sounds/growl.mp3', use: 'A clue: a very low, quiet growl from inside a bush.' },
  gust: { file: 'sounds/gust.mp3', use: 'A clue that it is only the wind: a gust through the leaves.' },
  startle: { file: 'sounds/startle.mp3', use: 'The eyes appear: a deep thump.' },
} as const;

export type SoundSlot = keyof typeof SOUND_SLOTS;

export const ANIMATION_SLOTS = {
  spiders: { file: 'animations/spiders.webm', use: 'The scare: lots and lots of spiders crawling out across the whole screen (about 4 seconds, over black).' },
  'spiders-gentle': { file: 'animations/spiders-gentle.webm', use: 'Gentle mode: a few slow, cartoonish spiders wandering across (about 5 seconds, over black).' },
  slime: { file: 'animations/slime.webm', use: 'Optional: green slime splatting onto the screen and sliding down (about 3 seconds, on a transparent background, VP9 with alpha). Without it, the lab draws its own slime.' },
} as const;

export type AnimationSlot = keyof typeof ANIMATION_SLOTS;

export const soundUrl = (slot: SoundSlot) => `${ASSET_DIR}/${SOUND_SLOTS[slot].file}`;
export const animationUrl = (slot: AnimationSlot) => `${ASSET_DIR}/${ANIMATION_SLOTS[slot].file}`;

/** The files the owner has dropped in, as named in the slots (for example 'sounds/creak.mp3'). */
export type OwnedAssets = readonly string[];

/** Every slot's file, sounds and animations together. */
export const SLOT_FILES: string[] = [...Object.values(SOUND_SLOTS), ...Object.values(ANIMATION_SLOTS)].map((s) => s.file);

export const ownsSound = (owned: OwnedAssets, slot: SoundSlot) => owned.includes(SOUND_SLOTS[slot].file);
export const ownsAnimation = (owned: OwnedAssets, slot: AnimationSlot) => owned.includes(ANIMATION_SLOTS[slot].file);
