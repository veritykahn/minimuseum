/*
 * The printed memorial cards, at the installation's own measurements: each
 * card 3.65" × 4.9", four to a Letter page in a 2 × 2 grid, 0.2" apart,
 * inside 0.5" margins. 2 × 3.65 + 0.2 = 7.5" across and 2 × 4.9 + 0.2 = 10"
 * down: exactly the 8.5" × 11" page less its margins.
 */

export const PRINT = {
  page: { width: 8.5, height: 11 },
  margin: 0.5,
  card: { width: 3.65, height: 4.9 },
  gap: 0.2,
  columns: 2,
  rows: 2,
} as const;

export type CardSlot = { x: number; y: number; width: number; height: number };

/** Where each of up to four cards sits on the page, in inches from the page's top-left corner. */
export function sheetSlots(count: number): CardSlot[] {
  const slots: CardSlot[] = [];
  const per = PRINT.columns * PRINT.rows;
  for (let i = 0; i < Math.min(count, per); i++) {
    const col = i % PRINT.columns;
    const row = Math.floor(i / PRINT.columns);
    slots.push({
      x: round(PRINT.margin + col * (PRINT.card.width + PRINT.gap)),
      y: round(PRINT.margin + row * (PRINT.card.height + PRINT.gap)),
      width: PRINT.card.width,
      height: PRINT.card.height,
    });
  }
  return slots;
}

/** The printable area the grid fills, in inches. */
export function gridSize() {
  return {
    width: round(PRINT.columns * PRINT.card.width + (PRINT.columns - 1) * PRINT.gap),
    height: round(PRINT.rows * PRINT.card.height + (PRINT.rows - 1) * PRINT.gap),
  };
}

const round = (n: number) => Math.round(n * 1000) / 1000;

/**
 * The print stylesheet, only while a print is being made: the page is Letter
 * with 0.5" margins, everything but the print sheet is hidden, and the cards
 * sit in the 2 × 2 grid at their exact size with their paper printed.
 */
export function printCss(): string {
  const { width, height } = gridSize();
  const c = PRINT.card;
  return `
@page { size: ${PRINT.page.width}in ${PRINT.page.height}in; margin: ${PRINT.margin}in; }
@media print {
  html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
  body > :not(.gwm-print-root) { display: none !important; }
  .gwm-print-root { display: block !important; }
  .gwm-print-sheet {
    display: grid;
    grid-template-columns: repeat(${PRINT.columns}, ${c.width}in);
    grid-auto-rows: ${c.height}in;
    gap: ${PRINT.gap}in;
    width: ${width}in;
    height: ${height}in;
    overflow: hidden;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .gwm-print-sheet .gwm-mc { width: ${c.width}in; height: ${c.height}in; break-inside: avoid; }
}
`;
}
