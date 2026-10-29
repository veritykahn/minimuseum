import type { StripId } from './toysText';
import { TAU } from './spin';

/*
 * The zoetrope's strips, drawn picture by picture on a canvas in the
 * posters' palette. Each strip is one loop: its last picture leads back into
 * its first (the wheels turn once, the snow falls one screen, the dancer
 * turns once), so the drum can spin for ever.
 */

const GREEN = '#2f4a32';
const LEAF = '#3f6446';
const SAGE = '#4e6152';
const DEEP_ROSE = '#a4565c';
const GOLD = '#c9a24a';
const CREAM = '#f4eee3';
const SOOT = '#2a2522';

/** A stable random number from a seed, for the snow. */
function hash(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function drawFrame(g: CanvasRenderingContext2D, strip: StripId, k: number, n: number, w: number, h: number) {
  const t = k / n;
  g.save();
  g.clearRect(0, 0, w, h);
  if (strip === 'locomotive') locomotive(g, t, w, h);
  else if (strip === 'snow') snow(g, t, w, h);
  else waltz(g, t, w, h);
  g.restore();
}

function locomotive(g: CanvasRenderingContext2D, t: number, w: number, h: number) {
  g.fillStyle = CREAM;
  g.fillRect(0, 0, w, h);
  // the far hills, still
  g.fillStyle = 'rgba(78, 97, 82, 0.28)';
  g.beginPath();
  g.moveTo(0, h * 0.6);
  g.quadraticCurveTo(w * 0.25, h * 0.46, w * 0.5, h * 0.58);
  g.quadraticCurveTo(w * 0.75, h * 0.66, w, h * 0.54);
  g.lineTo(w, h * 0.8);
  g.lineTo(0, h * 0.8);
  g.fill();
  // a telegraph pole passing, once a loop, and its wires
  const px = w * 1.1 - t * w * 1.2;
  g.strokeStyle = '#6b4a32';
  g.lineWidth = w * 0.012;
  g.beginPath();
  g.moveTo(px, h * 0.8);
  g.lineTo(px, h * 0.16);
  g.moveTo(px - w * 0.04, h * 0.2);
  g.lineTo(px + w * 0.04, h * 0.2);
  g.stroke();
  g.strokeStyle = SOOT;
  g.lineWidth = 1;
  for (const dy of [0.2, 0.25]) {
    g.beginPath();
    g.moveTo(px - w * 1.2, h * dy);
    g.quadraticCurveTo(px - w * 0.6, h * (dy + 0.07), px, h * dy);
    g.quadraticCurveTo(px + w * 0.6, h * (dy + 0.07), px + w * 1.2, h * dy);
    g.stroke();
  }
  // the sleepers run back under the wheels
  const gap = w * 0.1;
  g.fillStyle = '#6b4a32';
  for (let x = -gap + (1 - t) * gap * 2; x < w + gap; x += gap) g.fillRect(x - w * 0.015, h * 0.83, w * 0.03, h * 0.05);
  g.fillStyle = '#4a4440';
  g.fillRect(0, h * 0.83, w, h * 0.018);

  // the engine
  const base = h * 0.82;
  const bob = Math.sin(t * TAU * 2) * h * 0.004;
  g.save();
  g.translate(0, bob);
  // steam, rolling back from the chimney
  for (let i = 0; i < 5; i++) {
    const p = (t + i / 5) % 1;
    g.fillStyle = `rgba(244, 238, 227, ${0.95 - p * 0.6})`;
    g.strokeStyle = `rgba(120, 112, 102, ${0.7 - p * 0.6})`;
    g.lineWidth = 1;
    g.beginPath();
    g.arc(w * 0.7 - p * w * 0.55, h * 0.3 - p * h * 0.2 - Math.sin(p * 6) * h * 0.02, h * (0.04 + p * 0.09), 0, TAU);
    g.fill();
    g.stroke();
  }
  g.fillStyle = GREEN;
  g.fillRect(w * 0.18, h * 0.34, w * 0.16, base - h * 0.08 - h * 0.34);
  g.fillStyle = SOOT;
  g.fillRect(w * 0.16, h * 0.31, w * 0.2, h * 0.04);
  g.fillStyle = '#f2d68a';
  g.fillRect(w * 0.21, h * 0.4, w * 0.06, h * 0.08);
  g.fillStyle = LEAF;
  roundRect(g, w * 0.33, h * 0.48, w * 0.42, h * 0.22, h * 0.1);
  g.fill();
  g.strokeStyle = GOLD;
  g.lineWidth = 2;
  for (const x of [0.43, 0.58]) {
    g.beginPath();
    g.moveTo(w * x, h * 0.48);
    g.lineTo(w * x, h * 0.7);
    g.stroke();
  }
  g.fillStyle = SOOT;
  g.fillRect(w * 0.665, h * 0.3, w * 0.045, h * 0.19);
  g.fillRect(w * 0.645, h * 0.28, w * 0.085, h * 0.035);
  g.fillStyle = GOLD;
  g.beginPath();
  g.arc(w * 0.52, h * 0.48, w * 0.04, Math.PI, 0);
  g.fill();
  g.fillStyle = DEEP_ROSE;
  g.fillRect(w * 0.75, h * 0.64, w * 0.04, h * 0.08);
  g.fillStyle = SOOT;
  g.fillRect(w * 0.16, h * 0.7, w * 0.62, h * 0.03);
  // the wheels turn once a loop; the rod rides their cranks
  const turn = t * TAU;
  const wheels = [
    [0.27, 0.1],
    [0.45, 0.1],
    [0.68, 0.06],
  ];
  for (const [x, r] of wheels) {
    const cx = w * x;
    const R = h * r * 1.15;
    const cy = base - R;
    g.fillStyle = DEEP_ROSE;
    g.strokeStyle = SOOT;
    g.lineWidth = 2.5;
    g.beginPath();
    g.arc(cx, cy, R, 0, TAU);
    g.fill();
    g.stroke();
    g.lineWidth = 1.4;
    for (let s = 0; s < 6; s++) {
      const a = turn + (s * TAU) / 6;
      g.beginPath();
      g.moveTo(cx, cy);
      g.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      g.stroke();
    }
  }
  const crank = (x: number) => {
    const R = h * 0.1 * 1.15;
    return [w * x + Math.cos(turn) * R * 0.55, base - R + Math.sin(turn) * R * 0.55];
  };
  const [ax, ay] = crank(0.27);
  const [bx, by] = crank(0.45);
  g.strokeStyle = '#8a8279';
  g.lineWidth = 3.5;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(ax, ay);
  g.lineTo(bx, by);
  g.stroke();
  g.restore();
}

function snow(g: CanvasRenderingContext2D, t: number, w: number, h: number) {
  const sky = g.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#34463a');
  sky.addColorStop(1, '#6f8573');
  g.fillStyle = sky;
  g.fillRect(0, 0, w, h);
  // the village: roofs deep in snow, lamplight in the windows, a spire
  const houses = [
    [0.02, 0.24, 0.62],
    [0.24, 0.2, 0.55],
    [0.62, 0.22, 0.6],
    [0.82, 0.2, 0.66],
  ];
  // the spire
  g.fillStyle = '#2b3a2e';
  g.beginPath();
  g.moveTo(w * 0.47, h * 0.12);
  g.lineTo(w * 0.53, h * 0.42);
  g.lineTo(w * 0.41, h * 0.42);
  g.fill();
  g.fillRect(w * 0.42, h * 0.42, w * 0.1, h * 0.5);
  g.fillStyle = CREAM;
  g.beginPath();
  g.moveTo(w * 0.47, h * 0.12);
  g.lineTo(w * 0.495, h * 0.24);
  g.lineTo(w * 0.445, h * 0.24);
  g.fill();
  for (const [x, wd, top] of houses) {
    const X = w * x;
    const W = w * wd;
    const Y = h * top;
    // chimney smoke, rising once a loop
    for (let i = 0; i < 3; i++) {
      const p = (t + i / 3) % 1;
      g.fillStyle = `rgba(220, 220, 214, ${0.5 * (1 - p)})`;
      g.beginPath();
      g.arc(X + W * 0.75 + Math.sin(p * 5 + x * 9) * w * 0.015, Y - h * 0.1 - p * h * 0.22, h * (0.02 + p * 0.03), 0, TAU);
      g.fill();
    }
    g.fillStyle = '#3d2f2a';
    g.fillRect(X + W * 0.7, Y - h * 0.1, W * 0.1, h * 0.08);
    g.fillStyle = '#5a4038';
    g.fillRect(X, Y, W, h - Y);
    g.fillStyle = CREAM;
    g.beginPath();
    g.moveTo(X - w * 0.02, Y + h * 0.02);
    g.lineTo(X + W / 2, Y - h * 0.12);
    g.lineTo(X + W + w * 0.02, Y + h * 0.02);
    g.closePath();
    g.fill();
    g.fillStyle = '#f2c96a';
    g.fillRect(X + W * 0.2, Y + h * 0.1, W * 0.22, h * 0.09);
    g.fillRect(X + W * 0.58, Y + h * 0.1, W * 0.22, h * 0.09);
  }
  g.fillStyle = CREAM;
  g.fillRect(0, h * 0.9, w, h * 0.1);
  // the snow falls one picture-height a loop
  for (let i = 0; i < 46; i++) {
    const x0 = hash(i) * w;
    const y = ((hash(i + 100) + t) % 1) * h * 1.05 - h * 0.03;
    const r = 1 + hash(i + 200) * 2.6;
    g.fillStyle = 'rgba(255, 255, 255, 0.92)';
    g.beginPath();
    g.arc(x0 + Math.sin((t + hash(i + 300)) * TAU) * w * 0.02, y, r, 0, TAU);
    g.fill();
  }
}

function waltz(g: CanvasRenderingContext2D, t: number, w: number, h: number) {
  g.fillStyle = CREAM;
  g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(217, 183, 184, 0.45)';
  g.fillRect(0, h * 0.86, w, h * 0.14);
  const a = t * TAU; // she turns once a loop
  const cx = w * 0.5 + Math.sin(a) * w * 0.02;
  const waist = h * 0.42;
  const hem = h * 0.86;
  const sway = Math.sin(a) * w * 0.05;
  // the skirt: a bell, swinging out as she turns
  const half = (y: number) => {
    const u = (y - waist) / (hem - waist);
    return w * (0.05 + 0.3 * Math.pow(u, 0.75));
  };
  g.fillStyle = '#cf9a9d';
  g.beginPath();
  g.moveTo(cx - w * 0.05, waist);
  g.quadraticCurveTo(cx - w * 0.12 + sway * 0.3, h * 0.62, cx - half(hem) + sway, hem);
  for (let i = 0; i <= 10; i++) {
    const x = cx - half(hem) + sway + (i / 10) * half(hem) * 2;
    g.quadraticCurveTo(x - half(hem) * 0.1, hem + h * 0.025, x, hem);
  }
  g.quadraticCurveTo(cx + w * 0.12 + sway * 0.3, h * 0.62, cx + w * 0.05, waist);
  g.fill();
  // the skirt's panels, turning with her
  g.strokeStyle = DEEP_ROSE;
  g.lineWidth = 2.4;
  for (let j = 0; j < 8; j++) {
    const b = a + (j * TAU) / 8;
    if (Math.cos(b) < 0) continue;
    g.globalAlpha = 0.25 + 0.6 * Math.cos(b);
    g.beginPath();
    for (let s = 0; s <= 12; s++) {
      const y = waist + ((hem - waist) * s) / 12;
      const u = s / 12;
      const x = cx + Math.sin(b) * half(y) * 0.95 + sway * u;
      if (s === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
  }
  g.globalAlpha = 1;
  // the bodice and sleeves
  g.fillStyle = GREEN;
  g.beginPath();
  g.moveTo(cx - w * 0.055, waist + h * 0.01);
  g.lineTo(cx - w * 0.07, h * 0.27);
  g.lineTo(cx + w * 0.07, h * 0.27);
  g.lineTo(cx + w * 0.055, waist + h * 0.01);
  g.fill();
  // arms: one raised with her fan, one at her skirt
  const lift = Math.sin(a) * 0.15;
  g.strokeStyle = '#e6c9b5';
  g.lineWidth = w * 0.022;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(cx + w * 0.06, h * 0.29);
  g.lineTo(cx + w * 0.14, h * (0.2 - lift * 0.4));
  g.lineTo(cx + w * 0.17, h * (0.1 - lift * 0.5));
  g.moveTo(cx - w * 0.06, h * 0.29);
  g.lineTo(cx - w * 0.12, h * 0.38);
  g.lineTo(cx - w * 0.1, h * 0.46);
  g.stroke();
  // the fan
  const fx = cx + w * 0.17;
  const fy = h * (0.1 - lift * 0.5);
  g.fillStyle = GOLD;
  g.beginPath();
  g.moveTo(fx, fy);
  g.arc(fx, fy, h * 0.08, -Math.PI * 0.95 + lift, -Math.PI * 0.35 + lift);
  g.closePath();
  g.fill();
  g.strokeStyle = '#9c7a2c';
  g.lineWidth = 1;
  g.stroke();
  // head; her hair bun shows which way she faces as she turns
  g.fillStyle = '#e6c9b5';
  g.beginPath();
  g.arc(cx, h * 0.2, h * 0.055, 0, TAU);
  g.fill();
  g.fillStyle = '#4a3226';
  g.beginPath();
  g.arc(cx, h * 0.185, h * 0.056, Math.PI * 1.05, Math.PI * 1.95);
  g.fill();
  g.beginPath();
  g.arc(cx - Math.sin(a) * h * 0.05, h * 0.16 + (Math.cos(a) > 0 ? 0 : h * 0.005), h * 0.03, 0, TAU);
  g.fill();
  g.fillStyle = SAGE;
  g.fillRect(cx - w * 0.012, h * 0.245, w * 0.024, h * 0.03);
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
