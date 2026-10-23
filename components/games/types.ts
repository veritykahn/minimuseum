/**
 * Fields every game item can carry beyond its own content. Each game's item
 * type extends this, so a later teacher projector mode can read them the same
 * way everywhere.
 */
export type GameItemMeta = {
  /** Stable id, used for scoring and "replay the ones you missed". */
  id: string;
  /**
   * Shown to a teacher in projector mode, with the reveal: one sentence on
   * what to ask or point at, drawn only from the item's own explanation.
   */
  teacherTip?: string;
  /**
   * Shown now, in a collapsed "For teachers" note on the item: content a
   * teacher may want to preview before showing it to a younger class.
   */
  teacherNote?: string;
};

/** Where an ending's button goes: an in-page action or a route. */
export type GameAction = {
  label: string;
  onClick?: () => void;
  href?: string;
  /** The single most likely next step; drawn filled. */
  primary?: boolean;
};

/** One dot in an ending's round-by-round row. */
export type GamePip = {
  label: string;
  correct: boolean;
  /** Read after the label by screen readers; defaults to "right" / "missed". */
  status?: string;
};
