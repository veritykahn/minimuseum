// Print-sized copies of the pictures the resources use. A coin is printed
// at most about 2.2 inches across, so 700px is 300dpi; a painted cover runs
// the page width, so 1600px. Copies live in resources-src/.cache and are
// rebuilt only when the original changes.
import sharp from 'sharp';
import fs from 'fs'; import path from 'path';
const [root, cache, ...srcs] = process.argv.slice(2);
for (const arg of srcs) {
  // a leading @ marks the document's cover picture, printed full width
  const hero = arg.startsWith('@'), src = hero ? arg.slice(1) : arg;
  const from = path.join(root, 'public', src), to = path.join(cache, src);
  if (fs.existsSync(to) && fs.statSync(to).mtimeMs >= fs.statSync(from).mtimeMs && (!hero || (await sharp(to).metadata()).width >= 1200 || (await sharp(from).metadata()).width < 1200)) continue;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  const max = hero || /\/(timeline|Hands)\/|hands\.jpg$/.test(src) ? 1500 : 450;
  const img = sharp(from).rotate().resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true });
  const buf = /\.png$/i.test(src)
    ? await img.png({ palette: true, quality: 88, effort: 10 }).toBuffer()
    : await img.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  fs.writeFileSync(to, buf);
}
