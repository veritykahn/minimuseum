import type { StripId } from './toysText';
import { TAU } from './spin';

/*
 * The zoetrope's strips, the two the poster names, drawn picture by picture
 * on a canvas like the printed strips of the toy's day: dark sepia figures
 * on cream paper, with a ground line. Each strip is one loop, its last
 * picture leading back into its first (the horse takes one stride, the
 * dancers two hops), so the drum can spin for ever.
 *
 * The horse's legs follow a gallop's order of footfalls (the hind legs, then
 * the forelegs, then all four gathered off the ground), each foot planted
 * and swept back, then lifted and carried forward, the leg bent to reach it.
 */

const INK = '#3b2a1c';
const FAR = '#7a634b';
const PAPER = '#f3ead6';
const WASH = 'rgba(168, 213, 229, 0.35)';

export function drawFrame(g: CanvasRenderingContext2D, strip: StripId, k: number, n: number, w: number, h: number) {
  const t = k / n;
  g.save();
  g.clearRect(0, 0, w, h);
  g.fillStyle = PAPER;
  g.fillRect(0, 0, w, h);
  if (strip === 'horses') horse(g, t, w, h);
  else dancers(g, t, w, h);
  g.restore();
}

/** A limb from a to b, its width tapering from w0 to w1, rounded at both ends. */
function limb(g: CanvasRenderingContext2D, ax: number, ay: number, bx: number, by: number, w0: number, w1: number) {
  const l = Math.hypot(bx - ax, by - ay) || 1;
  const nx = -(by - ay) / l;
  const ny = (bx - ax) / l;
  g.beginPath();
  g.moveTo(ax + (nx * w0) / 2, ay + (ny * w0) / 2);
  g.lineTo(bx + (nx * w1) / 2, by + (ny * w1) / 2);
  g.lineTo(bx - (nx * w1) / 2, by - (ny * w1) / 2);
  g.lineTo(ax - (nx * w0) / 2, ay - (ny * w0) / 2);
  g.closePath();
  g.fill();
  g.beginPath();
  g.arc(ax, ay, w0 / 2, 0, TAU);
  g.arc(bx, by, w1 / 2, 0, TAU);
  g.fill();
}

/** Where a joint bends: the two-bone reach from a hip to a foot, bending to the side `bend` (+1 or -1). */
export function knee(hx: number, hy: number, fx: number, fy: number, l1: number, l2: number, bend: number) {
  const dx = fx - hx;
  const dy = fy - hy;
  const d = Math.min(Math.hypot(dx, dy), l1 + l2 - 0.01);
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const base = Math.atan2(dy, dx);
  const ang = base + bend * a;
  return { x: hx + Math.cos(ang) * l1, y: hy + Math.sin(ang) * l1 };
}

/** A foot's place at a stride's moment `u` (0 to 1): planted and swept back, then lifted and carried forward. */
export function footAt(u: number, reach: number, lift: number, stance = 0.34) {
  const p = ((u % 1) + 1) % 1;
  if (p < stance) return { x: reach * (1 - (2 * p) / stance), y: 0 };
  const v = (p - stance) / (1 - stance);
  // Forward again, quickest mid-swing.
  const e = 0.5 - 0.5 * Math.cos(Math.PI * v);
  return { x: -reach + 2 * reach * e, y: -lift * Math.sin(Math.PI * v) };
}

function horse(g: CanvasRenderingContext2D, t: number, w: number, h: number) {
  const ground = h * 0.86;
  // the turf runs back under the hooves
  g.strokeStyle = INK;
  g.lineWidth = 1.4;
  g.beginPath();
  g.moveTo(0, ground);
  g.lineTo(w, ground);
  g.stroke();
  g.fillStyle = WASH;
  g.fillRect(0, ground + 1, w, h - ground);
  g.strokeStyle = 'rgba(59, 42, 28, 0.45)';
  for (let i = 0; i < 6; i++) {
    const x = ((((i / 6 - t) % 1) + 1) % 1) * (w + 40) - 20;
    g.beginPath();
    g.moveTo(x, ground + 8);
    g.lineTo(x + 14, ground + 8);
    g.stroke();
  }

  const s = w / 320;
  const L1 = 34 * s;
  const L2 = 40 * s;
  const reach = 34 * s;
  const lift = 30 * s;
  // The body rises as the legs gather and falls as they land, and rocks a little.
  const bob = Math.sin(TAU * (t - 0.2)) * 6 * s;
  const pitch = Math.sin(TAU * (t - 0.05)) * 0.05;
  const cx = w * 0.42;
  const cy = ground - (L1 + L2) * 0.88 - 8 * s + bob;
  const at = (x: number, y: number) => ({
    x: cx + x * Math.cos(pitch) - y * Math.sin(pitch),
    y: cy + x * Math.sin(pitch) + y * Math.cos(pitch),
  });
  const hb = at(-50 * s, 8 * s);
  const hf = at(44 * s, 10 * s);

  // A gallop's footfalls: left hind, right hind, left fore, right fore.
  const legs = [
    { hip: hb, phase: 0.0, front: false, near: false },
    { hip: hf, phase: 0.3, front: true, near: false },
    { hip: hb, phase: 0.1, front: false, near: true },
    { hip: hf, phase: 0.4, front: true, near: true },
  ];
  const drawLeg = (leg: (typeof legs)[number]) => {
    const f = footAt(t - leg.phase, reach, lift, 0.3);
    const fx = leg.hip.x + f.x;
    const fy = ground - 3 * s + f.y;
    // Forelegs fold back at the knee; hind legs at the hock, the other way.
    const k = knee(leg.hip.x, leg.hip.y, fx, fy, L1, L2, leg.front ? -1 : 1);
    g.fillStyle = leg.near ? INK : FAR;
    limb(g, leg.hip.x, leg.hip.y, k.x, k.y, 16 * s, 8 * s);
    limb(g, k.x, k.y, fx, fy, 7 * s, 5 * s);
    g.beginPath();
    g.ellipse(fx + 1 * s, fy + 0.5 * s, 5 * s, 3.4 * s, 0, 0, TAU);
    g.fill();
  };
  legs.filter((l) => !l.near).forEach(drawLeg);

  g.save();
  g.translate(cx, cy);
  g.rotate(pitch);
  g.fillStyle = INK;
  g.strokeStyle = INK;
  g.lineCap = 'round';
  g.lineJoin = 'round';

  // the tail, streaming back
  const flick = Math.sin(TAU * t) * 6 * s;
  g.lineWidth = 9 * s;
  g.beginPath();
  g.moveTo(-62 * s, -14 * s);
  g.bezierCurveTo(-80 * s, -18 * s + flick, -98 * s, -4 * s - flick, -112 * s, 10 * s + flick);
  g.stroke();
  g.lineWidth = 4 * s;
  g.beginPath();
  g.moveTo(-70 * s, -10 * s);
  g.bezierCurveTo(-88 * s, -6 * s + flick, -102 * s, 10 * s - flick, -116 * s, 22 * s + flick);
  g.stroke();

  // the body: rump, barrel and chest, as one silhouette
  g.beginPath();
  g.moveTo(-64 * s, -10 * s);
  g.bezierCurveTo(-60 * s, -30 * s, -36 * s, -30 * s, -18 * s, -24 * s);
  g.bezierCurveTo(0, -20 * s, 20 * s, -24 * s, 34 * s, -26 * s);
  g.bezierCurveTo(54 * s, -26 * s, 66 * s, -8 * s, 62 * s, 12 * s);
  g.bezierCurveTo(56 * s, 26 * s, 36 * s, 26 * s, 20 * s, 24 * s);
  g.bezierCurveTo(0, 26 * s, -24 * s, 26 * s, -40 * s, 22 * s);
  g.bezierCurveTo(-60 * s, 18 * s, -68 * s, 6 * s, -64 * s, -10 * s);
  g.fill();

  // the neck and head, stretched forward, nodding with the stride
  const nod = Math.sin(TAU * (t + 0.1)) * 0.08;
  g.save();
  g.translate(40 * s, -12 * s);
  g.rotate(nod);
  g.beginPath();
  g.moveTo(-14 * s, -10 * s);
  g.bezierCurveTo(0, -30 * s, 20 * s, -46 * s, 38 * s, -54 * s);
  g.lineTo(42 * s, -64 * s);
  g.lineTo(47 * s, -54 * s);
  g.bezierCurveTo(60 * s, -50 * s, 74 * s, -38 * s, 84 * s, -26 * s);
  g.bezierCurveTo(88 * s, -20 * s, 84 * s, -13 * s, 78 * s, -14 * s);
  g.bezierCurveTo(68 * s, -16 * s, 58 * s, -22 * s, 52 * s, -26 * s);
  g.bezierCurveTo(42 * s, -18 * s, 30 * s, 0, 22 * s, 20 * s);
  g.closePath();
  g.fill();
  // the mane, flying
  g.lineWidth = 2.6 * s;
  for (let i = 0; i < 5; i++) {
    const u = i / 5;
    const x = -6 * s + u * 40 * s;
    const y = -20 * s - u * 32 * s;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x - 12 * s - flick * 0.4, y - 4 * s);
    g.stroke();
  }
  // the eye
  g.fillStyle = PAPER;
  g.beginPath();
  g.arc(56 * s, -44 * s, 1.9 * s, 0, TAU);
  g.fill();
  g.restore();
  g.restore();

  legs.filter((l) => l.near).forEach(drawLeg);
}

function dancers(g: CanvasRenderingContext2D, t: number, w: number, h: number) {
  const ground = h * 0.88;
  g.strokeStyle = INK;
  g.lineWidth = 1.4;
  g.beginPath();
  g.moveTo(0, ground);
  g.lineTo(w, ground);
  g.stroke();
  g.fillStyle = WASH;
  g.fillRect(0, ground + 1, w, h - ground);

  const s = w / 320;
  // Two hops a loop: up off the floor, and down again.
  const hop = (p: number) => Math.abs(Math.sin(TAU * p)) * 12 * s;
  // Their joined hands swing up and down together.
  const swing = Math.sin(TAU * t);

  // He is on the left, in a tailcoat; she is on the right, in a full skirt.
  const him = { x: w * 0.36, y: ground - hop(t) };
  const her = { x: w * 0.64, y: ground - hop(t + 0.25) };
  const hands = { x: w * 0.5, y: h * 0.42 - swing * 18 * s };

  g.fillStyle = INK;
  g.strokeStyle = INK;
  g.lineCap = 'round';

  // His legs: one kicks out as he lands, the other the next hop.
  const kick = Math.sin(TAU * 2 * t);
  const hipM = { x: him.x, y: him.y - 58 * s };
  const kneeA = { x: hipM.x + 4 * s + Math.max(0, kick) * 16 * s, y: hipM.y + 28 * s - Math.max(0, kick) * 10 * s };
  const footA = { x: kneeA.x + 6 * s + Math.max(0, kick) * 14 * s, y: Math.min(him.y, kneeA.y + 30 * s) };
  const kneeB = { x: hipM.x - 6 * s + Math.max(0, -kick) * 16 * s, y: hipM.y + 28 * s - Math.max(0, -kick) * 10 * s };
  const footB = { x: kneeB.x - 2 * s + Math.max(0, -kick) * 14 * s, y: Math.min(him.y, kneeB.y + 30 * s) };
  for (const [k, f] of [
    [kneeA, footA],
    [kneeB, footB],
  ] as const) {
    limb(g, hipM.x, hipM.y, k.x, k.y, 9 * s, 7 * s);
    limb(g, k.x, k.y, f.x, f.y, 7 * s, 5 * s);
    g.beginPath();
    g.ellipse(f.x + 4 * s, f.y - 1 * s, 7 * s, 3 * s, 0, 0, TAU);
    g.fill();
  }
  // his coat, tails flying as he hops
  const neckM = { x: him.x + 2 * s, y: him.y - 108 * s };
  g.beginPath();
  g.moveTo(neckM.x - 14 * s, neckM.y + 4 * s);
  g.lineTo(neckM.x + 14 * s, neckM.y + 4 * s);
  g.lineTo(hipM.x + 12 * s, hipM.y + 2 * s);
  g.lineTo(hipM.x - 16 * s, hipM.y + 14 * s - hop(t) * 0.6);
  g.lineTo(hipM.x - 14 * s, hipM.y);
  g.closePath();
  g.fill();
  // his arms: one to her hand, one on his hip
  limb(g, neckM.x + 10 * s, neckM.y + 10 * s, hands.x - 4 * s, hands.y, 7 * s, 5 * s);
  limb(g, neckM.x - 10 * s, neckM.y + 10 * s, neckM.x - 22 * s, neckM.y + 32 * s, 7 * s, 6 * s);
  limb(g, neckM.x - 22 * s, neckM.y + 32 * s, hipM.x - 8 * s, hipM.y - 6 * s, 6 * s, 5 * s);
  // his head and top hat
  g.beginPath();
  g.arc(neckM.x, neckM.y - 12 * s, 11 * s, 0, TAU);
  g.fill();
  g.fillRect(neckM.x - 9 * s, neckM.y - 44 * s, 18 * s, 24 * s);
  g.fillRect(neckM.x - 15 * s, neckM.y - 22 * s, 30 * s, 4 * s);

  // Her skirt sways against the hop, and her feet show beneath it.
  const sway = -swing * 8 * s;
  const waist = { x: her.x, y: her.y - 66 * s };
  const kickF = Math.sin(TAU * 2 * (t + 0.25));
  for (const side of [-1, 1]) {
    const up = Math.max(0, side * kickF);
    const fx = her.x + side * 8 * s - up * 6 * s;
    const fy = her.y - up * 10 * s;
    limb(g, her.x + side * 6 * s, her.y - 22 * s, fx, fy, 6 * s, 5 * s);
    g.beginPath();
    g.ellipse(fx - 3 * s, fy - 1 * s, 6 * s, 2.6 * s, 0, 0, TAU);
    g.fill();
  }
  g.beginPath();
  g.moveTo(waist.x - 8 * s, waist.y);
  g.quadraticCurveTo(waist.x - 30 * s + sway, her.y - 30 * s, waist.x - 40 * s + sway * 1.6, her.y - 18 * s);
  for (let i = 0; i <= 6; i++) {
    const x = waist.x - 40 * s + sway * 1.6 + (i / 6) * 80 * s;
    g.quadraticCurveTo(x - 6 * s, her.y - 12 * s + (i % 2) * 4 * s, x, her.y - 18 * s);
  }
  g.quadraticCurveTo(waist.x + 30 * s + sway, her.y - 30 * s, waist.x + 8 * s, waist.y);
  g.closePath();
  g.fill();
  // her bodice, arms and head
  const neckW = { x: her.x - 2 * s, y: her.y - 104 * s };
  g.beginPath();
  g.moveTo(neckW.x - 11 * s, neckW.y + 4 * s);
  g.lineTo(neckW.x + 11 * s, neckW.y + 4 * s);
  g.lineTo(waist.x + 7 * s, waist.y + 2 * s);
  g.lineTo(waist.x - 7 * s, waist.y + 2 * s);
  g.closePath();
  g.fill();
  limb(g, neckW.x - 9 * s, neckW.y + 10 * s, hands.x + 4 * s, hands.y, 6 * s, 5 * s);
  limb(g, neckW.x + 9 * s, neckW.y + 10 * s, neckW.x + 22 * s, neckW.y + 34 * s - swing * 4 * s, 6 * s, 5 * s);
  g.beginPath();
  g.arc(neckW.x, neckW.y - 12 * s, 10 * s, 0, TAU);
  g.fill();
  // her hair, up in a bun
  g.beginPath();
  g.arc(neckW.x + 7 * s, neckW.y - 20 * s, 6 * s, 0, TAU);
  g.fill();

  // their joined hands
  g.beginPath();
  g.arc(hands.x, hands.y, 5 * s, 0, TAU);
  g.fill();
}
