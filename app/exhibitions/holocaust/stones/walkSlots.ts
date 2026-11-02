import fs from 'node:fs';
import path from 'node:path';
import { CLANK_FILE, RATTLE_SRC, SOUND_DIR, WALK_LINES, slotSrc, type WalkSounds } from './walkLines';

/*
 * Which of the walk's picture and sound slots the owner has filled: read
 * from public/ when the page is built (server only), so a file dropped in
 * place is used from the next build, and an empty slot costs no request.
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

export function walkSlotsOnDisk(): { pictures: string[]; sounds: WalkSounds } {
  return {
    pictures: [...new Set(WALK_LINES.map((l) => l.slot))].filter((s) => onDisk(slotSrc(s))),
    sounds: { clanks: clanksOnDisk(), rattle: onDisk(RATTLE_SRC) ? RATTLE_SRC : null },
  };
}
