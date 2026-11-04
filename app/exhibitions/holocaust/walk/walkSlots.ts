import fs from 'node:fs';
import path from 'node:path';
import { CLANK_FILE, MUSIC_SRC, RATTLE_SRC, SOUND_DIR, WALK_DIR, WALK_LINES, slotFiles, type WalkPictures, type WalkSounds } from './walkLines';

/*
 * Which of the walk's picture and sound slots the owner has filled (the
 * film's pictures and its music, and the walk's steps): read
 * from public/ when the page is built (server only), so a file dropped in
 * place is used from the next build, and an empty slot costs no request.
 * A picture may be named for its slot (w07-broken-window.webp) or by its
 * number (walk-07.jpg); the first found is used.
 */

const onDisk = (src: string) => {
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', src));
  } catch {
    return false;
  }
};

const clanksOnDisk = (): string[] => {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), 'public', SOUND_DIR))
      .filter((f) => CLANK_FILE.test(f))
      .sort()
      .map((f) => `${SOUND_DIR}/${f}`);
  } catch {
    return [];
  }
};

export function walkSlotsOnDisk(): { pictures: WalkPictures; sounds: WalkSounds; music: string | null } {
  const pictures: Record<string, string> = {};
  for (const { slot } of WALK_LINES) {
    const file = slotFiles(slot).find((f) => onDisk(`${WALK_DIR}/${f}`));
    if (file) pictures[slot] = file;
  }
  return { pictures, sounds: { clanks: clanksOnDisk(), rattle: onDisk(RATTLE_SRC) ? RATTLE_SRC : null }, music: onDisk(MUSIC_SRC) ? MUSIC_SRC : null };
}
