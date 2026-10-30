import fs from 'node:fs';
import path from 'node:path';
import { SLOT_NAMES, soundSrc, type SoundSlot } from './sounds';

/*
 * Which of the film's sound slots the owner has filled: read from public/
 * when the page is built (server only), so a file dropped in place is used
 * from the next build, and an empty slot costs no request.
 */

const onDisk = (src: string) => {
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', src));
  } catch {
    return false;
  }
};

export function soundSlotsOnDisk(): SoundSlot[] {
  return SLOT_NAMES.filter((slot) => onDisk(soundSrc(slot)));
}
