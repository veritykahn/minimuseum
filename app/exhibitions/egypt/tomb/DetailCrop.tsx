import type { CSSProperties } from 'react';
import { cropAround } from './scenes';

/*
 * A find's piece of the painting: the wall's own picture, cut to a window
 * around the detail (cropAround) and shown large in the find's card, so
 * the visitor sees up close exactly what the torch found.
 */

export default function DetailCrop({
  src,
  width,
  height,
  detail,
  label,
}: {
  src: string;
  width: number;
  height: number;
  detail: { x: number; y: number; r: number };
  label: string;
}) {
  const c = cropAround(detail, width, height);
  const pos = (start: number, size: number, whole: number) => (whole > size ? (start / (whole - size)) * 100 : 0);
  const style: CSSProperties = {
    aspectRatio: `${Math.round(c.width)} / ${Math.round(c.height)}`,
    backgroundImage: `url(${src})`,
    backgroundSize: `${(width / c.width) * 100}% ${(height / c.height) * 100}%`,
    backgroundPosition: `${pos(c.left, c.width, width)}% ${pos(c.top, c.height, height)}%`,
  };
  return <div className="egt-crop" role="img" aria-label={label} style={style} />;
}
