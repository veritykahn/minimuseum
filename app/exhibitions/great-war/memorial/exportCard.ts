import { GREAT_WAR } from '../greatWar';
import { PRINT } from './printLayout';

/*
 * "Save as image": the card on screen, drawn to a PNG at print resolution
 * (300 dpi at 3.65" × 4.9", so 1095 × 1470 pixels) with html-to-image.
 *
 * The exhibition's faces come from Google Fonts, whose stylesheet the browser
 * will not let a page read back. So the fonts are fetched here (latin only),
 * turned into data URLs and handed to html-to-image, so the saved card is set
 * in Italiana, Cormorant Garamond and Outfit like the one on screen. The
 * playing candle is left out and the still frame beneath it is drawn instead.
 */

export const EXPORT_DPI = 300;

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

/** The @font-face rules for the latin subsets in Google's stylesheet, or all of them if it names no subsets. */
export function latinFontFaces(css: string): string[] {
  const named = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)];
  if (named.length) return named.filter((m) => m[1] === 'latin').map((m) => m[2]);
  return css.match(/@font-face\s*\{[^}]*\}/g) ?? [];
}

function embeddedFontCss(): Promise<string> {
  if (!fontCss) {
    fontCss = (async () => {
      const css = await (await fetch(GREAT_WAR.fonts.href)).text();
      const faces = await Promise.all(
        latinFontFaces(css).map(async (face) => {
          const m = /url\((['"]?)([^'")]+)\1\)/.exec(face);
          if (!m) return face;
          return face.replace(m[0], `url(${await toDataUrl(m[2])})`);
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

/** Draw the card to a PNG data URL, 300 dpi at the card's printed size. */
export async function cardToPng(node: HTMLElement): Promise<string> {
  const { toPng } = await import('html-to-image');
  let fontEmbedCSS: string | undefined;
  try {
    fontEmbedCSS = await embeddedFontCss();
  } catch {
    fontEmbedCSS = undefined; // html-to-image then tries the page's own font rules
  }
  await document.fonts?.ready;
  const pixelRatio = (PRINT.card.width * EXPORT_DPI) / node.offsetWidth;
  node.classList.add('is-exporting');
  try {
    return await toPng(node, {
      pixelRatio,
      fontEmbedCSS,
      filter: (n) => !(n instanceof HTMLElement && n.dataset.exportSkip !== undefined),
    });
  } finally {
    node.classList.remove('is-exporting');
  }
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
