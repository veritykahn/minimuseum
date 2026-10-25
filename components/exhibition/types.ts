import type { CSSProperties } from 'react';
import type { FxTheme } from '@/components/poster-fx/PosterFx';
import type { PosterTalk } from '@/components/projector/posterTalk';

/*
 * The shape of a poster exhibition: everything PosterExhibition needs to draw
 * the landing page, walk each poster panel by panel, and put it on a
 * classroom screen. An exhibition is data; the engine is the same for all.
 *
 * Adding a panel type: add its shape to PosterItem below and a renderer to
 * PANEL_RENDERERS in PosterPanel.tsx. TypeScript then refuses to build until
 * every type has a renderer.
 */

/** Where a text panel sits on the stage, as on the posters. */
export type PanelPosition =
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'full-width';

/**
 * A panel's own entrance, on top of the exhibition's reveal. Text effects are
 * used when the reveal leaves body copy alone (fx.text 'titles'); image
 * effects always run.
 */
export type PanelEffect =
  | 'none'
  | 'fade-in'
  | 'blur-to-sharp'
  | 'split-reveal'
  | 'kenburns-in'
  | 'drift'
  | 'breathe'
  | 'shrink-back';

/** Colors for a panel. Any left out come from its section, then its poster. */
export type PanelColors = {
  /** The stage ground behind the panel. */
  bg?: string;
  /** Body copy. */
  text?: string;
  /** Section titles, title cards and quotes. */
  title?: string;
};

/**
 * A decorative picture drawn into a panel — a spider in a corner, a hand
 * reaching up. Hidden from assistive technology, so it takes no alt text.
 */
export type PanelDecor = {
  src: string;
  /** Which corner or edge it hangs from. */
  placement: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** How it arrives: drops on a thread, rises from below, or simply appears. */
  motion?: 'drop' | 'rise' | 'none';
  /** CSS width, e.g. 'min(34vw, 420px)'. */
  width?: string;
};

/**
 * Short lines set at a panel's head or foot, one at each side, as a poster
 * prints a date in its corners ("11.11.1918" … "11:00"). Copy, not ornament:
 * it is read out with the panel.
 */
export type PanelMarks = {
  left?: string;
  right?: string;
  /** 'foot' (the default) or 'head'. */
  placement?: 'head' | 'foot';
};

type PanelBase = {
  /** Names a section in the poster's `sections`, which sets its colors and look. */
  section?: string;
  colors?: PanelColors;
  /** Extra classes for this panel's wrapper, for an exhibition's own CSS. */
  className?: string;
  decor?: PanelDecor;
  marks?: PanelMarks;
};

/**
 * A picture set beside a panel's copy, as a poster sets an illustration
 * beside its text. Unlike decor, it is content and takes alt text.
 */
export type PanelFigure = {
  src: string;
  alt: string;
  /** Which side of the copy it sits on (on a phone, above it). Defaults to 'left'. */
  side?: 'left' | 'right';
  /** The picture's credit as its owner specifies it, linked to the source record. *Title* is set in italics. */
  credit?: { text: string; href?: string };
};

/** Where a panel's wording comes from, when it follows another source closely. */
export type PanelSource = { text: string; href: string };

export type ParagraphItem = PanelBase & {
  type: 'paragraph';
  /** The copy. *word* is set in italics, as the posters set a title or a stressed word. */
  text: string;
  position?: PanelPosition;
  effect?: PanelEffect;
  figure?: PanelFigure;
  source?: PanelSource;
};

/** A chapter opening. Its text is also the chapter's name in projector mode. */
export type SectionTitleItem = PanelBase & {
  type: 'section-title';
  text: string;
  position?: PanelPosition;
  effect?: PanelEffect;
};

/** A title card that is a picture. */
export type TitleImageItem = PanelBase & {
  type: 'title-image';
  src: string;
  alt: string;
  /** 'width' fills the stage's width; 'centered' sits inside it (transparent PNGs). */
  fit?: 'width' | 'centered';
  effect?: PanelEffect;
};

/**
 * A title card set in type rather than drawn: the display face, with an
 * optional smaller line above, and an optional badge (a starburst on the
 * posters). In the badge, *word* is set in italics.
 */
export type TitleTextItem = PanelBase & {
  type: 'title-text';
  text: string;
  kicker?: string;
  badge?: string;
  /** A lighter line set under the title, as a poster sets its subtitle. */
  subtitle?: string;
};

export type FullImageItem = PanelBase & {
  type: 'full-image';
  src: string;
  alt: string;
  /** A caption under the picture, such as its credit. *Title* is set in italics. */
  text?: string;
  /** Where the caption links: the picture's source record. */
  href?: string;
  effect?: PanelEffect;
};

export type QuoteItem = PanelBase & {
  type: 'quote';
  /** The quotation. *word* is set in italics. */
  text: string;
  /** Who said or wrote it, set under the quote ("— Benjamin Franklin"). *Title* is set in italics. */
  cite?: string;
  effect?: PanelEffect;
};

/** A link out of the poster, set as a button. */
export type LinkItem = PanelBase & {
  type: 'link';
  text: string;
  url: string;
};

/**
 * A boxed call to action, set like a poster's footer panel: a line of text
 * and, if the poster has one, its picture (a QR code). With a url, the box
 * is a link out.
 */
export type CalloutItem = PanelBase & {
  type: 'callout';
  text: string;
  image?: { src: string; alt: string; pixelated?: boolean };
  url?: string;
};

/** The last panel: "Return to Exhibition", or the projector's end screen. */
export type EndItem = PanelBase & {
  type: 'end';
  text: string;
};

export type PosterItem =
  | ParagraphItem
  | SectionTitleItem
  | TitleImageItem
  | TitleTextItem
  | FullImageItem
  | QuoteItem
  | LinkItem
  | CalloutItem
  | EndItem;

export type PosterItemType = PosterItem['type'];

/** A section's look: its colors and any classes for the exhibition's own CSS. */
export type PosterSection = PanelColors & { className?: string };

export type PosterConfig<K extends string = string> = {
  /** 'poster1': lessons, deep links (?poster=1) and focus all use it. */
  id: K;
  /** The poster's full title: the walkthrough's heading and the projector's. */
  title: string;
  /** The poster image on the landing page and in the projector's picker. */
  hero: { src: string; alt: string };
  /** Defaults for every panel. */
  colors: Required<Pick<PanelColors, 'bg' | 'text' | 'title'>> & {
    /** The left rule beside a quote; defaults to the title color. */
    quoteRule?: string;
  };
  sections?: Record<string, PosterSection>;
  items: PosterItem[];
  /** "Talk about it" for the projector's teacher strip: one open question per chapter, keyed by section title ('' for the opening). */
  talk: PosterTalk;
};

/**
 * A display case on the landing page: a link to its own page. It shows a
 * photograph, or, for a room with no photograph (an interactive), a short
 * typographic emblem in its place ("11:00").
 */
export type DisplayCase = {
  href: string;
  image?: { src: string; alt: string };
  /** Set large where a photograph would be; decorative (the title names the link). */
  emblem?: string;
  /** "Gallery II, Case 6" */
  label: string;
  title: string;
  subtitle?: string;
};

export type ExhibitionConfig<K extends string = string> = {
  /** 'fear-lab': the route, the lessons catalog key and the projector's. */
  slug: string;
  /** The exhibition's name, as its landing page and projector show it. */
  name: string;
  subtitle: string;
  fonts: {
    /** A Google Fonts css2 URL, loaded the way the other exhibitions load theirs. */
    href: string;
    /** font-family lists. */
    display: string;
    body: string;
    /** Corner navigation and labels; defaults to the body face. */
    ui?: string;
  };
  palette: {
    /** The landing page's ground. */
    page: string;
    /** The landing page's title. */
    heading: string;
    /** The subtitle, display case subtitles, and the walkthrough's button hover. */
    accent: string;
    /** "Teach with this" and the lessons chip. */
    teach: { color: string; border: string };
  };
  /** The top-left "M ← First Floor" link off the landing page. */
  back: {
    href: string;
    label: string;
    /** Saved to sessionStorage on the way out, so the floor scrolls back to this exhibition. */
    remember?: { key: string; value: string };
  };
  /** The top-right link, if the exhibition has one ("Resources →"). */
  corner?: { href: string; label: string };
  posters: PosterConfig<K>[];
  /**
   * Display cases on the landing page. The first poster comes first, then the
   * cases, then the other posters. Leave out when there are none yet.
   */
  cases?: DisplayCase[];
  /**
   * Interactive rooms, set as display cases in a row of their own under the
   * posters. Leave out when there are none.
   */
  interactives?: DisplayCase[];
  /** The panel reveal (components/poster-fx). */
  fx: {
    theme: FxTheme;
    /**
     * When the reveal layer crosses the panel: on every panel, on the first
     * panel and each chapter title, on the first panel only, or never.
     */
    veil: 'every-panel' | 'chapters' | 'first' | 'none';
    /**
     * 'all': every text panel takes part in the reveal (short lines rise word
     * by word). 'titles': only section titles do; other copy keeps its effect.
     */
    text: 'all' | 'titles';
  };
  projector: {
    /** --pj-* custom properties (see components/projector/themes.ts). */
    theme: CSSProperties;
    links: { label: string; href: string }[];
  };
};

/** A photograph on a display case page, with its size so the page does not jump as it loads. */
export type CasePhoto = { src: string; alt: string; width: number; height: number };

export type CasePageData = {
  /** "Display Case" */
  label: string;
  /** The artifacts' heading: "Artifacts". */
  title: string;
  /** The photographs' heading: "Photographs of the installation". */
  subtitle: string;
  /** The first is set large above the artifacts; the rest in a row below them. */
  photos: CasePhoto[];
  artifacts: string[];
};
