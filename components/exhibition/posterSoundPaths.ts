/*
 * Where a poster exhibition's room sound drops in: a quiet loop under the
 * posters (a music box in the Victorian parlour, desert wind in Egypt), so
 * each room has a sound of its own. Each exhibition has one folder,
 * public/exhibitions/<slug>/poster-sound/, and in it:
 *
 *   <poster id>.mp3   that poster's own sound (poster1.mp3, poster2.mp3)
 *   posters.mp3       the sound for every poster without one of its own
 *   floor.mp3         optional: what is heard from its doorway in the floor's
 *                     hall (else its posters' sound; FloorSound.ts)
 *   moments/<name>.mp3  a panel's moment: an effect or a voice, played once
 *                     as the panel naming it arrives (PanelMoment.ts)
 *
 * A file should loop cleanly, about a minute or more, and be quiet already:
 * it plays under the audio guide, which it makes way for (RoomSound.tsx).
 * Which files are there is read when the site is built (posterSounds.ts), so
 * a file dropped in is used from the next build, and a room without one
 * shows no sound button at all.
 *
 * The Holocaust exhibition has none, whatever is in its folder: its quiet is
 * part of what it says (the walk, too, is heard only as its metal).
 */

/** The folder an exhibition's room sound goes in, under public/. */
export const posterSoundDir = (slug: string) => `/exhibitions/${slug}/poster-sound`;

/** A panel moment's file, by its exhibition and name (PanelMoment.ts). */
export const momentSrc = (slug: string, name: string) => `${posterSoundDir(slug)}/moments/${name}.mp3`;

/** The file for every poster without one of its own. */
export const ALL_POSTERS_SOUND = 'posters';

/** Its sound in the floor's hall, heard from its doorway, if not its posters' (FloorSound.ts). */
export const FLOOR_SOUND = 'floor';

/** Exhibitions kept silent, by slug. */
export const SILENT_EXHIBITIONS: readonly string[] = ['holocaust'];

/** Each poster's moments, by poster id: for each panel, its moment's public address, or null. */
export type PosterMoments<K extends string = string> = Partial<Record<K, (string | null)[]>>;

/** Each poster's sound, by poster id, as public addresses. */
export type PosterSounds<K extends string = string> = Partial<Record<K, string>>;
