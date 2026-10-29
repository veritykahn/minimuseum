import { latinFontFaces } from '@/app/exhibitions/great-war/memorial/exportCard';
import { WOMENS_HISTORY } from '../womensHistory';

/*
 * "Save as image" and "Print" for a timeline of your own. The sheet is drawn
 * to a PNG in the browser with html-to-image (as the Great War's memorial
 * cards are), with the exhibition's faces fetched from Google Fonts and
 * embedded so the image is set as the screen is. Nothing is uploaded: the
 * PNG is made here and handed straight to the visitor's downloads.
 */

/** The sheet's width on paper and in the image: US Letter, landscape. */
export const SHEET = { width: 11, height: 8.5, margin: 0.4, dpi: 200 } as const;

let fontCss: Promise<string> | null = null;

async function toDataUrl(url: string): Promise<string> {
  const blob = await (await fetch(url)).blob();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

function embeddedFontCss(): Promise<string> {
  if (!fontCss) {
    fontCss = (async () => {
      const css = await (await fetch(WOMENS_HISTORY.fonts.href)).text();
      const faces = await Promise.all(
        latinFontFaces(css).map(async (face) => {
          const m = /url\((['"]?)([^'")]+)\1\)/.exec(face);
          return m ? face.replace(m[0], `url(${await toDataUrl(m[2])})`) : face;
        }),
      );
      return faces.join('\n');
    })().catch((err) => {
      fontCss = null;
      throw err;
    });
  }
  return fontCss;
}

/** The sheet as a PNG data URL, at SHEET.dpi across its printed width. */
export async function sheetToPng(node: HTMLElement): Promise<string> {
  const { toPng } = await import('html-to-image');
  let fontEmbedCSS: string | undefined;
  try {
    fontEmbedCSS = await embeddedFontCss();
  } catch {
    fontEmbedCSS = undefined;
  }
  await document.fonts?.ready;
  const printable = SHEET.width - SHEET.margin * 2;
  const restore = await keepsakesAsPictures(node);
  try {
    return await toPng(node, { pixelRatio: (printable * SHEET.dpi) / node.offsetWidth, fontEmbedCSS, backgroundColor: '#f6efe4' });
  } finally {
    restore();
  }
}

/**
 * The keepsakes are drawn in the room's colours by CSS custom properties,
 * which a picture of the page cannot follow. So for the moment of the
 * picture each one is swapped for an image of itself, its colours written
 * in, and put back after.
 */
async function keepsakesAsPictures(node: HTMLElement): Promise<() => void> {
  const swaps: [SVGSVGElement, HTMLImageElement][] = [];
  const style = getComputedStyle(node);
  for (const svg of Array.from(node.querySelectorAll('svg'))) {
    const box = svg.getBoundingClientRect();
    const ink = getComputedStyle(svg).color;
    let markup = new XMLSerializer().serializeToString(svg);
    markup = markup.replace(/var\((--[\w-]+)\)/g, (_, name: string) => style.getPropertyValue(name).trim() || '#000').replace(/currentColor/g, ink);
    const img = new Image(Math.round(box.width), Math.round(box.height));
    img.className = svg.getAttribute('class') ?? '';
    img.alt = '';
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
    await img.decode().catch(() => undefined);
    svg.replaceWith(img);
    swaps.push([svg, img]);
  }
  return () => swaps.forEach(([svg, img]) => img.replaceWith(svg));
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** Only the sheet is printed, on one landscape Letter page. */
export function printCss(): string {
  return `
@page { size: ${SHEET.width}in ${SHEET.height}in; margin: ${SHEET.margin}in; }
@media print {
  html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
  body > :not(.whv-print-root) { display: none !important; }
  .whv-print-root { position: static !important; left: auto !important; display: block !important; }
  .whv-print-root .whv-own-sheet { width: ${SHEET.width - SHEET.margin * 2}in; max-height: ${SHEET.height - SHEET.margin * 2}in; overflow: hidden; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;
}
