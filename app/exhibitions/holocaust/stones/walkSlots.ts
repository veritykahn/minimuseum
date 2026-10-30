import fs from 'node:fs';
import path from 'node:path';
import { AMBIENTS, WALK_LINES, ambientSrc, slotSrc, type Ambient } from './walkLines';

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

export function walkSlotsOnDisk(): { pictures: string[]; ambients: Ambient[] } {
  return {
    pictures: [...new Set(WALK_LINES.map((l) => l.slot))].filter((s) => onDisk(slotSrc(s))),
    ambients: AMBIENTS.filter((a) => onDisk(ambientSrc(a))),
  };
}
