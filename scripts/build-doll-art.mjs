#!/usr/bin/env node
/*
 * Design a doll: copies the owner's doll artwork into the site, cleans three
 * known defects in the copies, makes small picker thumbnails, and writes the
 * typed manifest the designer reads.
 *
 *   node scripts/build-doll-art.mjs [--src <folder>] [--report <folder>]
 *
 * --src     the artwork folder with manifest.json (default: the owner's
 *           "Mini Museum assets/Black History/design-a-doll" folder)
 * --report  also write before/after crops of every fixed layer there
 * --report-only  with --report: only the fixes and the crops, nothing written to the site
 *
 * It writes:
 *   public/exhibitions/black-history/dolls/<same paths as the manifest>
 *   public/exhibitions/black-history/dolls/thumbs/<same paths>   (160px picker thumbnails)
 *   app/exhibitions/black-history/representation/dollArt.ts      (generated; don't edit by hand)
 *
 * The originals are only read, never changed. Layers with no fix are copied
 * byte for byte. sharp comes with Next.js, so nothing extra is installed.
 *
 * The fixes (see FIXES below), each limited to the files named:
 *  1. "ghost": some curly styles carry a smooth, untextured copy of the face
 *     outline in the hair colour, so a band of grey or blonde lies over the
 *     forehead, cheeks and neck. It is found by growing out from the face
 *     opening into hair that has no curl texture, inside the body's outline,
 *     and is cleared with a soft edge. The mask is found once per style (on
 *     the grey, where the band shows most) and applied to every colour, since
 *     the colours share one alpha.
 *  2. "defringe": the half-transparent edge pixels of the blonde and grey
 *     afros and curls are paler than the hair inside them, so the outline
 *     looks chalky. Their colour is replaced with the nearby solid hair's,
 *     and the edge is pulled in by about half a pixel.
 *  3. "holes": the rose headscarf (tichel) has see-through blotches inside
 *     the fabric. Enclosed transparent patches that are not the face opening
 *     are made solid, their colour matched to the fabric around them.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(ROOT, 'package.json'));
const sharp = require('sharp');

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const SRC = path.resolve(arg('--src', path.join(process.env.HOME ?? '', 'Documents/Mini Museum assets/Black History/design-a-doll')));
const REPORT = arg('--report', null);
const OUT = path.join(ROOT, 'public/exhibitions/black-history/dolls');
const TS = path.join(ROOT, 'app/exhibitions/black-history/representation/dollArt.ts');
const PUBLIC_BASE = '/exhibitions/black-history/dolls/';
const THUMB = 160;

const manifest = JSON.parse(fs.readFileSync(path.join(SRC, 'manifest.json'), 'utf8'));
const [W, H] = manifest.canvas;
const N = W * H;

/* ───────── Which files get which fix ───────── */
const GHOST_STYLES = [
  { sex: 'W', style: 'afro' },
  { sex: 'W', style: 'puffs' },
  { sex: 'W', style: 'curls' },
  { sex: 'M', style: 'afro' },
];
const DEFRINGE = [
  ['W', 'afro'],
  ['M', 'afro'],
  ['W', 'curls'],
  ['M', 'curly'],
].flatMap(([sex, style]) => ['blonde', 'grey'].map((c) => manifest.hair[sex][style].files[c]));
const HOLES = [manifest.head.W.tichel.file];

/* ───────── Every file the manifest names ───────── */
function allFiles() {
  const files = new Set();
  const walk = (v) => {
    if (typeof v === 'string' && v.endsWith('.webp')) files.add(v);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  for (const k of ['bodies', 'prosthetic', 'seatedHands', 'hair', 'outfits', 'head', 'extras']) walk(manifest[k]);
  return [...files].sort();
}

/* ───────── Pixel helpers (raw RGBA, W×H) ───────── */
const raw = async (file) => sharp(path.join(SRC, file)).ensureAlpha().raw().toBuffer();
const lum = (px) => {
  const L = new Float32Array(N);
  for (let i = 0; i < N; i++) L[i] = 0.3 * px[i * 4] + 0.59 * px[i * 4 + 1] + 0.11 * px[i * 4 + 2];
  return L;
};
function boxBlur(src, r) {
  const tmp = new Float32Array(N);
  const out = new Float32Array(N);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let s = 0;
      let n = 0;
      for (let k = -r; k <= r; k++) {
        const xx = x + k;
        if (xx >= 0 && xx < W) {
          s += src[y * W + xx];
          n++;
        }
      }
      tmp[y * W + x] = s / n;
    }
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let s = 0;
      let n = 0;
      for (let k = -r; k <= r; k++) {
        const yy = y + k;
        if (yy >= 0 && yy < H) {
          s += tmp[yy * W + x];
          n++;
        }
      }
      out[y * W + x] = s / n;
    }
  }
  return out;
}
/** Binary dilate (grow) or erode (shrink) by a square of radius r. */
function morph(src, r, grow) {
  const out = new Uint8Array(N);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let v = grow ? 0 : 1;
      outer: for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          const s = xx < 0 || yy < 0 || xx >= W || yy >= H ? 0 : src[yy * W + xx];
          if (grow && s) {
            v = 1;
            break outer;
          }
          if (!grow && !s) {
            v = 0;
            break outer;
          }
        }
      }
      out[y * W + x] = v;
    }
  }
  return out;
}
const NEIGHBOURS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];
/** Connected component (4-way) of pixels passing `ok`, from a seed. */
function flood(seed, ok) {
  const seen = new Uint8Array(N);
  const q = [seed];
  seen[seed] = 1;
  for (let h = 0; h < q.length; h++) {
    const i = q[h];
    const x = i % W;
    const y = (i / W) | 0;
    for (const [dx, dy] of NEIGHBOURS) {
      const xx = x + dx;
      const yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      const j = yy * W + xx;
      if (!seen[j] && ok(j)) {
        seen[j] = 1;
        q.push(j);
      }
    }
  }
  return seen;
}

/* ───────── Fix 1: the ghost band ───────── */
/**
 * The alpha multiplier (0..1) that clears the untextured band between the
 * face opening and the real hair. `hair` is the grey colour's pixels;
 * `body` is the standing body's (every tone shares one outline).
 */
function ghostMask(hair, body) {
  const SMOOTH = 6; // curl texture below this is "no texture"
  const REACH = 40; // px the band may run from the face opening
  const HEAD_BOTTOM = 420; // the head and neck lie above this row
  const L = lum(hair);
  const blur = boxBlur(L, 1);
  const hp = new Float32Array(N);
  for (let i = 0; i < N; i++) hp[i] = Math.abs(L[i] - blur[i]);
  const texture = boxBlur(hp, 2);
  const inBody = (i) => body[i * 4 + 3] > 200;

  // The face opening: the see-through part of the hair over the face, found from between the eyes.
  const faceSeed = 182 * W + W / 2;
  if (hair[faceSeed * 4 + 3] > 10) throw new Error('ghost: the face is not open at its centre');
  const opening = flood(faceSeed, (j) => inBody(j) && hair[j * 4 + 3] < 10 && j < HEAD_BOTTOM * W);
  let top = H;
  for (let i = 0; i < N; i++) if (opening[i]) top = Math.min(top, (i / W) | 0);

  // Grow into smooth hair, more cautiously above the opening (where the scalp is).
  const dist = new Int32Array(N).fill(-1);
  const q = [];
  for (let i = 0; i < N; i++) if (opening[i]) {
    dist[i] = 0;
    q.push(i);
  }
  for (let h = 0; h < q.length; h++) {
    const i = q[h];
    const x = i % W;
    const y = (i / W) | 0;
    for (const [dx, dy] of NEIGHBOURS) {
      const xx = x + dx;
      const yy = y + dy;
      if (xx < 0 || xx >= W || yy < top - 25 || yy >= HEAD_BOTTOM) continue;
      const j = yy * W + xx;
      if (dist[j] >= 0 || !inBody(j) || dist[i] + 1 > REACH) continue;
      if (texture[j] > (yy < top ? SMOOTH / 2 : SMOOTH)) continue;
      dist[j] = dist[i] + 1;
      q.push(j);
    }
  }
  let m = new Uint8Array(N);
  for (let i = 0; i < N; i++) m[i] = dist[i] >= 0 ? 1 : 0;
  m = morph(morph(m, 3, true), 3, false); // close small gaps (a ghost eyebrow, an eyelash)
  for (let i = 0; i < N; i++) if (!inBody(i) || i >= HEAD_BOTTOM * W) m[i] = 0;
  // A soft edge, only over the body, so the hair beside the head stays solid.
  const grown = morph(m, 2, true);
  const g = new Float32Array(N);
  for (let i = 0; i < N; i++) g[i] = grown[i];
  const soft = boxBlur(boxBlur(g, 3), 3);
  const keep = new Float32Array(N);
  let cleared = 0;
  for (let i = 0; i < N; i++) {
    const over = (body[i * 4 + 3] / 255) ** 2;
    keep[i] = m[i] ? 0 : Math.min(1, Math.max(0, 1 - soft[i] * over));
    if (keep[i] < 0.5 && hair[i * 4 + 3] > 10) cleared++;
  }
  return { keep, cleared };
}

/* ───────── Fix 2: pale edges ───────── */
function defringe(px) {
  const out = Buffer.from(px);
  const SOLID = 245;
  let changed = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const a = px[i * 4 + 3];
      if (a === 0 || a >= SOLID) continue;
      // The colour of the solid hair nearby (radius 3, then 6).
      let r = 0;
      let g = 0;
      let b = 0;
      let n = 0;
      for (const R of [3, 6]) {
        for (let dy = -R; dy <= R; dy++) {
          for (let dx = -R; dx <= R; dx++) {
            const xx = x + dx;
            const yy = y + dy;
            if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
            const j = (yy * W + xx) * 4;
            if (px[j + 3] >= SOLID) {
              r += px[j];
              g += px[j + 1];
              b += px[j + 2];
              n++;
            }
          }
        }
        if (n) break;
      }
      if (n) {
        out[i * 4] = Math.round(r / n);
        out[i * 4 + 1] = Math.round(g / n);
        out[i * 4 + 2] = Math.round(b / n);
      }
      // Pull the edge in by about half a pixel: lean toward the faintest neighbour.
      let lo = a;
      for (const [dx, dy] of NEIGHBOURS) {
        const xx = x + dx;
        const yy = y + dy;
        lo = Math.min(lo, xx < 0 || yy < 0 || xx >= W || yy >= H ? 0 : px[(yy * W + xx) * 4 + 3]);
      }
      out[i * 4 + 3] = Math.round(a * 0.6 + lo * 0.4);
      changed++;
    }
  }
  return { px: out, changed };
}

/* ───────── Fix 3: holes in the fabric ───────── */
function fillHoles(px) {
  const out = Buffer.from(px);
  // The fabric's whole shape: its solid part, closed over gaps up to about 20px.
  const solid = new Uint8Array(N);
  for (let i = 0; i < N; i++) solid[i] = px[i * 4 + 3] >= 128 ? 1 : 0;
  const shape = morph(morph(solid, 10, true), 10, false);
  // The real openings, the outside and the face, kept clear with a margin, so no corner is webbed over.
  const open = new Uint8Array(N);
  for (const seed of [0, W - 1, N - W, N - 1, 182 * W + W / 2]) {
    if (open[seed] || shape[seed]) continue;
    const c = flood(seed, (j) => !shape[j]);
    for (let i = 0; i < N; i++) if (c[i]) open[i] = 1;
  }
  const margin = morph(open, 2, true);
  const target = new Uint8Array(N);
  for (let i = 0; i < N; i++) target[i] = shape[i] && !margin[i] && px[i * 4 + 3] < 250 ? 1 : 0;
  const done = new Uint8Array(N);
  let filled = 0;
  const patches = [];
  for (let s = 0; s < N; s++) {
    if (done[s] || !target[s]) continue;
    const c = flood(s, (j) => target[j] === 1);
    const members = [];
    for (let i = 0; i < N; i++) if (c[i]) {
      members.push(i);
      done[i] = 1;
    }
    // Match the patch's own colour to the fabric in a ring around it.
    const ring = new Uint8Array(N);
    const sum = [0, 0, 0, 0, 0, 0];
    let rn = 0;
    for (const i of members) {
      const x = i % W;
      const y = (i / W) | 0;
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
          const j = yy * W + xx;
          if (ring[j] || c[j] || px[j * 4 + 3] < 250) continue;
          ring[j] = 1;
          for (let k = 0; k < 3; k++) sum[k] += px[j * 4 + k];
          rn++;
        }
      }
    }
    for (const i of members) for (let k = 0; k < 3; k++) sum[3 + k] += px[i * 4 + k];
    if (!rn) continue;
    for (const i of members) {
      for (let k = 0; k < 3; k++) {
        const ratio = sum[k] / rn / Math.max(1, sum[3 + k] / members.length);
        out[i * 4 + k] = Math.min(255, Math.round(px[i * 4 + k] * ratio));
      }
      out[i * 4 + 3] = 255;
    }
    filled += members.length;
    patches.push(members.length);
  }
  return { px: out, filled, patches };
}

/* ───────── Writing ───────── */
const ensureDir = (f) => fs.mkdirSync(path.dirname(f), { recursive: true });
const toWebp = (px) => sharp(px, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 88, alphaQuality: 100, effort: 6 }).toBuffer();

async function reportCrop(name, file, before, after, under, region, bg) {
  if (!REPORT) return;
  const layer = async (px) => sharp(px, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  const view = async (px) => {
    const composed = await sharp({ create: { width: W, height: H, channels: 4, background: bg } })
      .composite([...under.map((u) => ({ input: path.join(SRC, u) })), { input: await layer(px) }])
      .png()
      .toBuffer();
    return sharp(composed).extract(region).png().toBuffer();
  };
  const [b, a] = [await view(before), await view(after)];
  ensureDir(path.join(REPORT, 'x'));
  await sharp(b).toFile(path.join(REPORT, `${name}-before.png`));
  await sharp(a).toFile(path.join(REPORT, `${name}-after.png`));
  await sharp({ create: { width: region.width * 2 + 12, height: region.height, channels: 4, background: '#ffffff' } })
    .composite([
      { input: b, left: 0, top: 0 },
      { input: a, left: region.width + 12, top: 0 },
    ])
    .png()
    .toFile(path.join(REPORT, `${name}-before-after.png`));
}

async function main() {
  const files = allFiles();
  const missing = files.filter((f) => !fs.existsSync(path.join(SRC, f)));
  if (missing.length) throw new Error(`Missing from the artwork folder: ${missing.join(', ')}`);

  const fixed = new Map(); // file -> fixed RGBA
  const notes = [];
  const HEAD = { left: 200, top: 10, width: 370, height: 440 };

  // 1. The ghost band, then 2. the pale edges, on the hair styles named.
  for (const { sex, style } of GHOST_STYLES) {
    const s = manifest.hair[sex][style];
    const body = await raw(manifest.bodies[sex].t1);
    const { keep, cleared } = ghostMask(await raw(s.files.grey), body);
    notes.push(`ghost: ${sex} ${style}, ${cleared} px of band cleared in each colour`);
    for (const colour of manifest.hairColours) {
      const f = s.files[colour];
      const px = await raw(f);
      const out = Buffer.from(px);
      for (let i = 0; i < N; i++) out[i * 4 + 3] = Math.round(px[i * 4 + 3] * keep[i]);
      fixed.set(f, out);
    }
  }
  for (const f of DEFRINGE) {
    const before = fixed.get(f) ?? (await raw(f));
    const { px, changed } = defringe(before);
    fixed.set(f, px);
    notes.push(`defringe: ${f}, ${changed} edge px`);
  }
  // 3. The holes in the headscarf.
  for (const f of HOLES) {
    const { px, filled, patches } = fillHoles(await raw(f));
    fixed.set(f, px);
    notes.push(`holes: ${f}, ${patches.length} patches, ${filled} px made solid`);
  }

  // Before/after crops, for the owner to judge.
  if (REPORT) {
    for (const [sex, style, colour, tone] of [
      ['W', 'afro', 'grey', 't1'],
      ['W', 'afro', 'blonde', 't2'],
      ['W', 'afro', 'black', 't7'],
      ['W', 'puffs', 'grey', 't3'],
      ['W', 'curls', 'grey', 't1'],
      ['W', 'curls', 'blonde', 't4'],
      ['M', 'afro', 'grey', 't1'],
      ['M', 'curly', 'blonde', 't2'],
    ]) {
      const f = manifest.hair[sex][style].files[colour];
      const region = style === 'curls' ? { left: 150, top: 30, width: 470, height: 560 } : HEAD;
      await reportCrop(`${sex}-${style}-${colour}-${tone}`, f, await raw(f), fixed.get(f), [manifest.bodies[sex][tone]], region, '#ee8dbf');
    }
    const t = manifest.head.W.tichel.file;
    await reportCrop('W-tichel-t1', t, await raw(t), fixed.get(t), [manifest.bodies.W.t1], { left: 280, top: 50, width: 220, height: 330 }, '#ee8dbf');
  }

  if (args.includes('--report-only')) {
    for (const n of notes) console.log(n);
    return;
  }

  // Copy every layer: fixed ones re-encoded, the rest byte for byte.
  const bytes = {};
  for (const f of files) {
    const dest = path.join(OUT, f);
    ensureDir(dest);
    if (fixed.has(f)) fs.writeFileSync(dest, await toWebp(fixed.get(f)));
    else fs.copyFileSync(path.join(SRC, f), dest);
    bytes[f] = fs.statSync(dest).size;
  }

  // Thumbnails: each picker item cropped square around itself, over a soft silhouette of the doll.
  const silhouette = {};
  for (const pose of ['W', 'M', 'WS', 'MS']) {
    const a = await sharp(path.join(SRC, manifest.bodies[pose].t1)).ensureAlpha().extractChannel(3).raw().toBuffer();
    const px = Buffer.alloc(N * 4);
    for (let i = 0; i < N; i++) {
      px[i * 4] = 222;
      px[i * 4 + 1] = 214;
      px[i * 4 + 2] = 206;
      px[i * 4 + 3] = a[i];
    }
    silhouette[pose] = await sharp(px, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  }
  const bboxOf = async (f) => {
    const { info } = await sharp(path.join(OUT, f)).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
    return { left: -info.trimOffsetLeft, top: -info.trimOffsetTop, width: info.width, height: info.height };
  };
  const thumb = async (f, pose, box) => {
    const b = box ?? (await bboxOf(f));
    const side = Math.round(Math.max(b.width, b.height) * 1.08);
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    const left = Math.round(cx - side / 2);
    const top = Math.round(cy - side / 2);
    // Pad the canvas so a square near an edge still fits.
    const pad = side;
    const composed = await sharp({ create: { width: W + pad * 2, height: H + pad * 2, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([
        { input: silhouette[pose], left: pad, top: pad },
        { input: path.join(OUT, f), left: pad, top: pad },
      ])
      .png()
      .toBuffer();
    const dest = path.join(OUT, 'thumbs', f);
    ensureDir(dest);
    await sharp(composed)
      .extract({ left: left + pad, top: top + pad, width: side, height: side })
      .resize(THUMB, THUMB)
      .webp({ quality: 74, alphaQuality: 80, effort: 6 })
      .toFile(dest);
  };
  const FACE = { W: { left: 290, top: 120, width: 190, height: 150 }, M: { left: 290, top: 120, width: 190, height: 150 } };
  for (const sex of ['W', 'M']) {
    // One frame per style (its colours share an outline), so a style's thumbnails match whatever the colour.
    for (const s of Object.values(manifest.hair[sex])) {
      const box = await bboxOf(s.files.black);
      for (const f of Object.values(s.files)) await thumb(f, sex, box);
    }
    for (const h of Object.values(manifest.head[sex])) await thumb(h.file, sex);
    for (const [id, e] of Object.entries(manifest.extras[sex])) {
      if (e.files) for (const f of Object.values(e.files)) await thumb(f, sex, FACE[sex]);
      else await thumb(e.file, sex, id === 'glasses' || id === 'hearing' ? FACE[sex] : undefined);
    }
  }
  for (const pose of ['W', 'M', 'WS', 'MS']) for (const o of Object.values(manifest.outfits[pose])) await thumb(o.file, pose);
  // The doll pickers: each body whole, and for the prosthetic, the legs.
  for (const pose of ['W', 'M', 'WS', 'MS']) for (const f of Object.values(manifest.bodies[pose])) await thumb(f, pose);
  const LEGS = { left: 250, top: 900, width: 270, height: 440 };
  for (const sex of ['W', 'M']) for (const f of Object.values(manifest.prosthetic[sex])) await thumb(f, sex, LEGS);

  // Swatch colours, sampled from the art: the lit middle of the skin (not the white
  // underclothes), and the solid middle tones of the hair.
  const hex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const band = (px, keep, from, to) => {
    const L = [];
    for (let i = 0; i < N; i++) if (px[i * 4 + 3] === 255 && keep(px[i * 4], px[i * 4 + 1], px[i * 4 + 2])) L.push([0.3 * px[i * 4] + 0.59 * px[i * 4 + 1] + 0.11 * px[i * 4 + 2], i]);
    L.sort((x, y) => x[0] - y[0]);
    const mid = L.slice(Math.floor(L.length * from), Math.floor(L.length * to));
    const s = [0, 0, 0];
    for (const [, i] of mid) for (let k = 0; k < 3; k++) s[k] += px[i * 4 + k];
    return hex(s[0] / mid.length, s[1] / mid.length, s[2] / mid.length);
  };
  const skinSwatch = {};
  const coloured = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b) > 0.12 * Math.max(r, g, b, 1);
  for (const t of manifest.skinTones) skinSwatch[t] = band(await raw(manifest.bodies.W[t]), coloured, 0.55, 0.7);
  const hairSwatch = {};
  for (const c of manifest.hairColours) hairSwatch[c] = band(await raw(manifest.hair.W.straight.files[c]), () => true, 0.55, 0.85);

  // The rule that names the coverings that hide the hair, matched to the manifest's own labels.
  const rule = manifest.rules.find((r) => /hides the hair/i.test(r));
  const named = rule.match(/\(([^)]+)\)/)[1].split(',').map((s) => s.trim().toLowerCase());
  const coversHair = [];
  for (const term of named) {
    const hits = Object.entries(manifest.head).flatMap(([sex, hs]) => Object.entries(hs).filter(([, h]) => h.label.toLowerCase().startsWith(term)).map(([id]) => `${sex}:${id}`));
    if (!hits.length) throw new Error(`The rule names "${term}", but no head covering has that label`);
    coversHair.push(...hits);
  }

  const data = {
    canvas: manifest.canvas,
    order: manifest.order,
    poses: manifest.poses,
    skinTones: manifest.skinTones,
    skinToneLabels: manifest.skinToneLabels,
    bodies: manifest.bodies,
    prosthetic: manifest.prosthetic,
    hairColours: manifest.hairColours,
    hair: manifest.hair,
    outfits: manifest.outfits,
    head: manifest.head,
    extras: manifest.extras,
    rules: manifest.rules,
    kippahLift: manifest.kippahLift,
    seatedHands: manifest.seatedHands ?? {},
    coversHair: [...new Set(coversHair.map((h) => h.split(':')[1]))],
    skinSwatch,
    hairSwatch,
  };
  const ts = `/*
 * GENERATED by scripts/build-doll-art.mjs from the owner's design-a-doll
 * manifest.json. Don't edit by hand: change the artwork folder and run
 *   node scripts/build-doll-art.mjs
 *
 * Every layer is the full ${W}x${H} canvas, already in place; they stack with
 * no offsets in \`order\`. \`coversHair\` is read from the manifest's rule
 * ("${rule}"). \`skinSwatch\` and \`hairSwatch\` are sampled from the art.
 * \`DOLL_BYTES\` is each copied layer's size, for the page-weight test (kept
 * apart, so the page itself never carries it).
 */

export type Sex = 'W' | 'M';
export type Pose = 'W' | 'M' | 'WS' | 'MS';
export type Tone = ${manifest.skinTones.map((t) => `'${t}'`).join(' | ')};
export type HairColour = ${manifest.hairColours.map((c) => `'${c}'`).join(' | ')};
export type Labelled = { label: string };
export type OneFile = Labelled & { file: string };
export type ByColour = Labelled & { files: Record<HairColour, string> };

export type DollArtData = {
  canvas: [number, number];
  order: string[];
  poses: Record<Pose, string>;
  skinTones: Tone[];
  skinToneLabels: Record<Tone, string>;
  bodies: Record<Pose, Record<Tone, string>>;
  prosthetic: Record<Sex, Record<Tone, string>>;
  hairColours: HairColour[];
  hair: Record<Sex, Record<string, ByColour>>;
  outfits: Record<Pose, Record<string, OneFile>>;
  head: Record<Sex, Record<string, OneFile>>;
  extras: { M: { beard: ByColour; glasses: OneFile; hearing: OneFile }; W: { glasses: OneFile; hearing: OneFile } };
  /** The seated woman's hands, by skin tone: stacked right after the outfit so they rest on her lap. */
  seatedHands: { note?: string } & Partial<Record<Pose, Record<Tone, string>>>;
  rules: string[];
  kippahLift: Record<string, number>;
  coversHair: string[];
  skinSwatch: Record<Tone, string>;
  hairSwatch: Record<HairColour, string>;
};

/** Where the layers are served from; a layer's path is relative to it. */
export const DOLL_BASE = '${PUBLIC_BASE}';
/** A layer's small picker thumbnail lives at the same path under thumbs/. */
export const thumbOf = (file: string) => \`thumbs/\${file}\`;

export const DOLL_ART: DollArtData = ${JSON.stringify(data, null, 2)};

export const DOLL_BYTES: Record<string, number> = ${JSON.stringify(bytes, null, 2)};
`;
  fs.writeFileSync(TS, ts);

  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  console.log(`${files.length} layers copied to ${path.relative(ROOT, OUT)} (${(total / 1024 / 1024).toFixed(2)} MB)`);
  for (const n of notes) console.log(n);
  console.log(`wrote ${path.relative(ROOT, TS)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
