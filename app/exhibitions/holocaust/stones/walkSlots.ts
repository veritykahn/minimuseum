import fs from 'node:fs';
import path from 'node:path';
import { AMBIENTS, WALK_DIR, WALK_LINES, ambientSrc, slotFiles, type Ambient, type WalkPictures } from './walkLines';

/*
 * Which of the walk's picture and sound slots the owner has filled: read
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

export function walkSlotsOnDisk(): { pictures: WalkPictures; ambients: Ambient[] } {
  const pictures: Record<string, string> = {};
  for (const { slot } of WALK_LINES) {
    const file = slotFiles(slot).find((f) => onDisk(`${WALK_DIR}/${f}`));
    if (file) pictures[slot] = file;
  }
  return { pictures, ambients: AMBIENTS.filter((a) => onDisk(ambientSrc(a))) };
}
