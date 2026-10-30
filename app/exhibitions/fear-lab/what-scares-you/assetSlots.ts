import fs from 'node:fs';
import path from 'node:path';
import { ASSET_DIR, SLOT_FILES } from './assets';

/*
 * Which of the lab's drop-in slots the owner has filled: read from public/
 * when the page is built (server only), so a file dropped in place is used
 * from the next build, and an empty slot is never asked for.
 */

const onDisk = (file: string) => {
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', ASSET_DIR, file));
  } catch {
    return false;
  }
};

export function assetsOnDisk(): string[] {
  return SLOT_FILES.filter(onDisk);
}
