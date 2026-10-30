/*
 * The film's drop-in sound slots: each sound the owner can replace with her
 * own file. Each slot names one file under public/exhibitions/great-war/.
 * Drop an MP3 in at that exact name and the film uses it from the next build
 * (soundSlots.ts looks on disk when the page is built, so an empty slot costs
 * no request and leaves no 404 in the console); until then, the film makes
 * the sound itself with Web Audio (armisticeSound.ts).
 *
 * Every file is played on the film's own clock, so the guns still stop dead
 * at 11:00 whatever is dropped in.
 */

export const SOUND_DIR = '/exhibitions/great-war';

export const SOUND_SLOTS = {
  battle: {
    file: 'sounds/battle.mp3',
    use: 'Rifle and machine-gun fire across the front. Looped from the first title card, and cut dead at 11:00.',
  },
  artillery: {
    file: 'sounds/artillery.mp3',
    use: 'The artillery barrage: heavy guns firing, near and far. Looped under the gunfire, and cut dead at 11:00.',
  },
  breeze: {
    file: 'sounds/breeze.mp3',
    use: 'A gentle breeze, nothing else. Fades in a moment after 11:00, loops quietly, and fades away after the film.',
  },
  bird: {
    file: 'sounds/bird.mp3',
    use: 'A single bird singing, a few seconds long. Played once, right at the very end of the film.',
  },
} as const;

export type SoundSlot = keyof typeof SOUND_SLOTS;

export const SLOT_NAMES = Object.keys(SOUND_SLOTS) as SoundSlot[];

export const soundSrc = (slot: SoundSlot) => `${SOUND_DIR}/${SOUND_SLOTS[slot].file}`;
