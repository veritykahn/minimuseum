import type { GoodId } from './myTomb';

/*
 * The things the visitor can take into their tomb: each one the owner's
 * picture (made with Leonardo.Ai, cut out of its white background; not
 * credited on the page, at the owner's request), in
 * public/exhibitions/egypt/grave-goods.
 *
 * They stand in the chamber at their real sizes, all against the bed, so a
 * lamp is a lamp beside a bed and not the size of a chair. `real` is the
 * thing's real size in centimetres, measured `along` its width ('w') or its
 * height ('h'); `w` and `h` are the picture's own pixels, cropped to the
 * thing, its base on the bottom edge. A new picture: cut it out the same
 * way, crop it to the thing, and put its pixel size here.
 *
 * Real sizes, about those of the kind of thing in New Kingdom tombs:
 *   bed 180 cm long, chair 90 cm tall, chest 70 cm long, model boat 80 cm
 *   long, jars 60 cm tall, senet board 45 cm long, basket of bread and
 *   fruit 35 cm across, mirror 25 cm tall, a pair of sandals 22 cm across, toy horse
 *   15 cm tall, lamp 12 cm across.
 */
export type GoodLook = { src: string; w: number; h: number; real: number; along: 'w' | 'h' };

const DIR = '/exhibitions/egypt/grave-goods';

export const GOOD_LOOK: Record<GoodId, GoodLook> = {
  bed: { src: `${DIR}/bed.webp`, w: 900, h: 672, real: 180, along: 'w' },
  chair: { src: `${DIR}/chair.webp`, w: 542, h: 644, real: 90, along: 'h' },
  chest: { src: `${DIR}/chest.webp`, w: 548, h: 459, real: 70, along: 'w' },
  boat: { src: `${DIR}/boat.webp`, w: 681, h: 276, real: 80, along: 'w' },
  jars: { src: `${DIR}/jars.webp`, w: 456, h: 476, real: 60, along: 'h' },
  game: { src: `${DIR}/game.webp`, w: 434, h: 174, real: 45, along: 'w' },
  food: { src: `${DIR}/food.webp`, w: 401, h: 243, real: 35, along: 'w' },
  mirror: { src: `${DIR}/mirror.webp`, w: 196, h: 412, real: 25, along: 'h' },
  sandals: { src: `${DIR}/sandals.webp`, w: 214, h: 123, real: 22, along: 'w' },
  horse: { src: `${DIR}/horse.webp`, w: 267, h: 339, real: 15, along: 'h' },
  lamp: { src: `${DIR}/lamp.webp`, w: 304, h: 175, real: 12, along: 'w' },
};

/** The chamber's units to a centimetre, at the middle of the floor: the bed comes out about 250 across. */
export const UNITS_PER_CM = 1.4;

/** A thing's size in the chamber's units, before the floor's depth shrinks it. */
export function goodSize(id: GoodId) {
  const l = GOOD_LOOK[id];
  const k = (l.real * UNITS_PER_CM) / (l.along === 'w' ? l.w : l.h);
  return { w: l.w * k, h: l.h * k };
}
