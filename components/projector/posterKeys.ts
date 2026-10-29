/*
 * Keys in poster projector mode. A clicker sends PageDown/PageUp (some send
 * the arrows, and "." or B to blank, as in presentation software); a keyboard
 * adds Space, Home/End, T and F, and A and P for the audio guide. Pure, so it can be tested on its own.
 */

export type PosterKeyCommand =
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'first' }
  | { type: 'last' }
  | { type: 'blank' }
  | { type: 'unblank' }
  | { type: 'strip' }
  | { type: 'fullscreen' }
  /** Turn the audio guide on or off. */
  | { type: 'audio' }
  /** Pause the audio guide, or play this panel again. */
  | { type: 'play' }
  /** Taken so it does nothing (Escape would otherwise close the poster underneath). */
  | { type: 'swallow' };

export type PosterKeyContext = {
  /** A poster is open (false on the poster picker). */
  open: boolean;
  /** The screen is blanked. */
  blank: boolean;
  /** Focus is on a button or link, where Space presses it. */
  onControl: boolean;
  /** Focus is in a text field. */
  inField: boolean;
};

const NAV_KEYS = new Set(['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp', ' ', 'Home', 'End', 'Escape', 'Enter']);

export function posterKeyCommand(
  key: string,
  ctx: PosterKeyContext,
  mods: { alt?: boolean; ctrl?: boolean; meta?: boolean } = {},
): PosterKeyCommand | null {
  if (mods.alt || mods.ctrl || mods.meta) return null;
  if (ctx.inField) return null;

  if (key === 'b' || key === 'B' || key === '.') return { type: ctx.blank ? 'unblank' : 'blank' };
  // While the screen is blank, moving keys only bring it back: nothing changes behind it.
  if (ctx.blank && NAV_KEYS.has(key)) {
    if (key === 'Enter' && ctx.onControl) return null;
    return { type: 'unblank' };
  }

  switch (key) {
    case 'ArrowRight':
    case 'PageDown':
      return { type: 'next' };
    case ' ':
      return ctx.onControl ? null : { type: 'next' };
    case 'ArrowLeft':
    case 'PageUp':
      return { type: 'prev' };
    case 'Home':
      return ctx.open ? { type: 'first' } : null;
    case 'End':
      return ctx.open ? { type: 'last' } : null;
    case 't':
    case 'T':
      return { type: 'strip' };
    case 'f':
    case 'F':
      return { type: 'fullscreen' };
    case 'a':
    case 'A':
      return ctx.open ? { type: 'audio' } : null;
    case 'p':
    case 'P':
      return ctx.open ? { type: 'play' } : null;
    case 'Escape':
      return ctx.open ? { type: 'swallow' } : null;
    default:
      return null;
  }
}
