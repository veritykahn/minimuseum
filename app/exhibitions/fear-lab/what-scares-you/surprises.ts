import type { AnimationSlot, SoundSlot } from './assets';

/*
 * The silly surprises: totally harmless things that burst out of a fear box
 * instead of a creature (Surprise.tsx draws them). Each ends with a short,
 * friendly line tying back to the poster's idea, that not knowing is the
 * scary part. The lines are the lab's own, not the poster's words, and make
 * no factual claims.
 */

export type SurpriseId = 'slime' | 'confetti' | 'jack' | 'chicken' | 'bubbles' | 'feather';

export type Surprise = {
  id: SurpriseId;
  /** The heading, once the lights are back up. */
  name: string;
  /** What was inside, on the closed box's little label. */
  label: string;
  /** The friendly line under the heading. */
  line: string;
  /** What the screen reader hears as it bursts out, in the dark. */
  out: string;
  /** The still picture's description. */
  alt: string;
  sound: SoundSlot;
  /** When the sound starts, in ms after it bursts out: as the slime hits the glass, as the chicken lands. */
  soundAt?: number;
  /** The owner's own animation for it, if it has a slot. */
  animation?: AnimationSlot;
};

export const SURPRISES: Surprise[] = [
  {
    id: 'slime',
    name: 'Just slime!',
    label: 'slime',
    line: 'Just slime! Your heart still jumped, didn’t it?',
    out: 'Splat! Something gooey bursts out of the box and splats all over the screen!',
    alt: 'A big splat of bright green slime, dripping',
    sound: 'slime',
    soundAt: 650,
    animation: 'slime',
  },
  {
    id: 'confetti',
    name: 'Surprise! Confetti!',
    label: 'confetti',
    line: 'Pop! Only a party popper. The waiting was the scary part.',
    out: 'Pop! Something bursts out of the box in a shower of colors!',
    alt: 'A party popper, with confetti flying out of it',
    sound: 'confetti',
  },
  {
    id: 'jack',
    name: 'A jack-in-the-box!',
    label: 'a jack-in-the-box',
    line: 'Boing! Just a jack-in-the-box. Did you jump before you even saw it?',
    out: 'Boing! Something springs up out of the box!',
    alt: 'A grinning jack-in-the-box face in a party hat, on a spring',
    sound: 'boing',
  },
  {
    id: 'chicken',
    name: 'A rubber chicken!',
    label: 'a rubber chicken',
    line: 'Squawk! A rubber chicken. Not knowing was scarier than the chicken.',
    out: 'Squawk! Something leaps out of the box!',
    alt: 'A floppy yellow rubber chicken with a red comb',
    sound: 'squeak',
    soundAt: 1250,
  },
  {
    id: 'bubbles',
    name: 'Just bubbles!',
    label: 'bubbles',
    line: 'Just bubbles! All that dread, for a few little pops.',
    out: 'Something floats up out of the box, and pops…',
    alt: 'A cluster of shiny soap bubbles',
    sound: 'bubbles',
  },
  {
    id: 'feather',
    name: 'Just a feather',
    label: 'a feather',
    line: 'Just a feather, drifting down. In the dark, it could have been anything.',
    out: 'Something puffs out of the box and drifts slowly down…',
    alt: 'A soft, curling feather',
    sound: 'feather',
  },
];

export const surprise = (id: SurpriseId) => SURPRISES.find((s) => s.id === id)!;
