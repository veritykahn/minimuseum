import type { CSSProperties } from 'react';
import type { FxTheme } from '@/components/poster-fx/PosterFx';
import type { PosterTalk } from '@/components/projector/posterTalk';
import type { ApprovedFact } from './FactNote';

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
 * A panel's own entrance: how it arrives. The vocabulary is the one the three
 * hand-built walkthroughs (Harlem, In Their Hands, Seeing is Deceiving) use,
 * so a data-driven exhibition can vary its panels as they do.
 *
 * A panel with an entrance takes it in place of the exhibition's reveal (the
 * theme's word-by-word rise, the developing photograph): the theme steps back
 * and the panel arrives its own way. A panel without one ('theme', or left
 * out) keeps the theme's reveal. 'none' simply appears.
 *
 * Text and pictures both take every entrance; each is drawn on the copy (the
 * paragraph, title or quote) or on the picture itself. A few are motions that
 * carry on after the panel has arrived (pan-lr, kenburns-in, shrink-back,
 * drift, breathe, waves-drift). Under prefers-reduced-motion every one of
 * them settles at once into its calm, final state.
 */
export const PANEL_EFFECTS = [
  'none',
  'theme',
  // Arrivals
  'fade-in',
  'blur-to-sharp',
  'split-reveal',
  'ink-spread',
  'film-credits',
  'rise-expand',
  'mega-zoom-out',
  'glitch',
  'blind-spot-reveal',
  // Copy set a piece at a time
  'line-by-line',
  'typewriter',
  // Slow motions that run on after the panel arrives
  'pan-lr',
  'kenburns-in',
  'shrink-back',
  'drift',
  'breathe',
  'waves-drift',
  // Rises into view, then fades as if forgotten (pictures only; copy simply rises)
  'erase',
] as const;
export type PanelEffect = (typeof PANEL_EFFECTS)[number];

/**
 * A section's atmosphere, as the hand-built posters' "specials" (Harlem's
 * train-journey, In Their Hands' parchment): it sets the stage's colors and
 * draws an animated, themed layer behind the panel. Each exhibition defines
 * its own set in ExhibitionConfig.atmospheres and draws them in its own
 * stylesheet, keyed on `.pe-atmo-<name>` (the layer) and
 * `[data-atmosphere='<name>']` (the stage, for the copy).
 *
 * The layer is decorative and hidden from assistive technology. It persists
 * while consecutive panels share the atmosphere, so rain keeps falling as
 * you walk on rather than starting over. Under prefers-reduced-motion it is
 * drawn still.
 */
export type Atmosphere = PanelColors & {
  /**
   * Particles drawn in the layer: rain, petals, sand, motes. Each is an <i>
   * with --i (its index), --x and --y (0–100, scattered), --r (0–1, a
   * per-particle random) for the stylesheet to place and animate.
   */
  particles?: number;
  /** Pictures drawn into the layer (decorative), each with a class for the stylesheet. */
  images?: { src: string; className: string }[];
  /** Extra plain layers (<b class="pe-atmo-part pe-atmo-part-N">) for beams, bands and washes. */
  parts?: number;
};

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
  /** Names an atmosphere in the exhibition's `atmospheres`; overrides the section's. */
  atmosphere?: string;
  /** How the panel arrives. Left out, it takes the exhibition's reveal. */
  effect?: PanelEffect;
  colors?: PanelColors;
  /** Extra classes for this panel's wrapper, for an exhibition's own CSS. */
  className?: string;
  decor?: PanelDecor;
  marks?: PanelMarks;
  /** The audio guide's recording for this panel (AudioGuide): a path under public/. */
  audio?: string;
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
  /**
   * Opening words set in bold before the copy, as a poster sets the start of
   * its first sentence ("Women's History Month, celebrated every March,").
   * Read as part of the paragraph: lead + ' ' + text.
   */
  lead?: string;
  position?: PanelPosition;
  figure?: PanelFigure;
  source?: PanelSource;
};

/** A chapter opening. Its text is also the chapter's name in projector mode. */
export type SectionTitleItem = PanelBase & {
  type: 'section-title';
  text: string;
  position?: PanelPosition;
};

/**
 * A title card that is a picture: the poster's own lettering, cut from it.
 * Set as the panel's heading; `alt` is the title as it is read.
 *
 * Framing, as the hand-built walkthroughs frame their titles:
 * 'height' fills the stage's height (tall lettering, often panned across);
 * 'width' fills its width; 'width-top' fills its width from the top;
 * 'centered' sits inside the stage at no more than its natural size
 * (transparent lettering cut from a poster).
 */
export type TitleImageItem = PanelBase & {
  type: 'title-image';
  src: string;
  alt: string;
  /** The picture's pixel size, so the panel does not jump as it loads (and is never drawn larger than it is). */
  width?: number;
  height?: number;
  framing?: 'height' | 'width' | 'width-top' | 'centered';
  /** @deprecated Use framing. */
  fit?: 'width' | 'centered';
  /**
   * How many of the picture's pixels make one pixel of the poster as served
   * (1050px wide): 1 for lettering cut from it, about 1.65 for lettering cut
   * from the poster's 1728px export. The lettering is drawn the same size
   * either way ('centered' framing); a denser cut is simply sharper.
   */
  density?: number;
  /**
   * The lettering set in type instead of drawn from the picture, in the
   * poster's own face, so it is sharp at any size and on any screen. Each
   * line is set on a line of its own; the exhibition's stylesheet gives the
   * block (`className`) and each line its face, size and color ("11^th^"
   * sets "th" as a superscript). Drawn for
   * the eye (`alt` is what is read); `src` stays the poster's cut, for
   * reference and for anything that shows the picture.
   */
  live?: { className?: string; lines: { text: string; className?: string }[] };
};

/**
 * A picture with its label beside it, as a gallery hangs a work: the picture
 * on one side; its title, maker and date, and a description on the other.
 * The description is copy and takes part in the panel's entrance.
 */
export type ArtworkDisplayItem = PanelBase & {
  type: 'artwork-display';
  src: string;
  alt: string;
  /** The work's title. *Title* is set in italics. */
  title?: string;
  /** Maker and date, set small above the description ("Imperial War Museum, 1916"). */
  meta?: string;
  /** The description. *word* is set in italics. */
  text: string;
  /** Which side the picture hangs on. Defaults to 'left'. */
  side?: 'left' | 'right';
  credit?: { text: string; href?: string };
};

/**
 * A picture and copy stacked: copy above the picture ('text-image-stacked')
 * or the picture above the copy ('image-text-stacked'), as In Their Hands
 * stacks a manuscript over its story.
 */
export type StackedItem = PanelBase & {
  type: 'text-image-stacked' | 'image-text-stacked';
  src: string;
  alt: string;
  /** The copy. *word* is set in italics. */
  text: string;
  credit?: { text: string; href?: string };
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
  /** A further short line under the subtitle, as a poster sets a pair of dates. */
  note?: string;
  /**
   * The title as the poster sets it, line by line ("WO", "MEN", "'S"), for
   * the exhibition's stylesheet to stack. Drawn for the eye; `kicker` and
   * `text` are what is read.
   */
  lines?: string[];
  /**
   * Lettering cut from the poster, drawn in place of the typeset title; the
   * title is still read as `text`.
   */
  lettering?: { src: string; width: number; height: number };
};

export type FullImageItem = PanelBase & {
  type: 'full-image';
  src: string;
  alt: string;
  /** A caption under the picture, such as its credit. *Title* is set in italics. */
  text?: string;
  /** Where the caption links: the picture's source record. */
  href?: string;
};

export type QuoteItem = PanelBase & {
  type: 'quote';
  /** The quotation. *word* is set in italics. */
  text: string;
  /** Who said or wrote it, set under the quote ("— Benjamin Franklin"). *Title* is set in italics. */
  cite?: string;
};

/** A link out of the poster, set as a button. */
export type LinkItem = PanelBase & {
  type: 'link';
  text: string;
  url: string;
};

/**
 * A boxed call to action, set like a poster's footer panel: a line of text
 * and, if the poster has one, its picture (a QR code). With a url (and no
 * picture) it is the poster's visit link, set as the admission ticket every
 * poster ends on (VisitTicket); it names a real museum or collection.
 */
export type CalloutItem = PanelBase & {
  type: 'callout';
  text: string;
  image?: { src: string; alt: string; pixelated?: boolean };
  url?: string;
};

/**
 * A museum note: owner-approved, fact-checked facts from outside the poster,
 * each set with its sources beneath it (FactNote), so it reads as a note and
 * never as poster wording. The kicker names it ("Museum note · …"). In a
 * fact, *word* is set in italics.
 */
export type NoteItem = PanelBase & {
  type: 'note';
  kicker?: string;
  facts: ApprovedFact[];
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
  | ArtworkDisplayItem
  | StackedItem
  | FullImageItem
  | QuoteItem
  | LinkItem
  | CalloutItem
  | NoteItem
  | EndItem;

export type PosterItemType = PosterItem['type'];

/** A section's look: its colors, its atmosphere, and any classes for the exhibition's own CSS. */
export type PosterSection = PanelColors & { className?: string; atmosphere?: string };

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
 * A display case on the landing page, or an interactive room on its case
 * page: a link to its own page. A case shows the owner's cut-out photograph
 * of it, or, with none, an empty case drawn in outline, labelled "Display
 * case — photographs to come" (CasePlaceholder). A room shows a screenshot
 * of itself (public/exhibitions/<slug>/rooms/), or a short typographic
 * emblem in its place ("11:00").
 */
export type DisplayCase = {
  href: string;
  image?: { src: string; alt: string };
  /** Set large where a room's picture would be; decorative (the title names the link). */
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
  /** The top-left "M ← Ground Floor" link off the landing page. */
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
   * Interactive rooms, listed under "Interactives" on the first display
   * case's page (CasePage). They live in the case, never on the landing
   * page. Leave out when there are none.
   */
  interactives?: DisplayCase[];
  /**
   * Picture credits, folded into a toggle at the foot of the landing page (LandingCredits), for pictures
   * the exhibition draws on for its look (a photograph washed in behind the
   * posters), each as its owner specifies, linked to its record. *Title* is
   * set in italics. Leave out when there are none.
   */
  credits?: { text: string; href?: string }[];
  /**
   * The exhibition's own atmospheres, by name, for sections and panels to
   * name (`atmosphere`). Drawn by the exhibition's stylesheet; see Atmosphere.
   */
  atmospheres?: Record<string, Atmosphere>;
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
    /** A short note for whoever teaches with it, set at the top of "Teach with this" (an age recommendation, say). */
    teachNote?: string;
  };
};

/** A photograph on a display case page, with its size so the page does not jump as it loads. */
export type CasePhoto = { src: string; alt: string; width: number; height: number };

export type CasePageData = {
  /** "Display Case" */
  label: string;
  /** The artifacts' heading: "Artifacts". */
  title: string;
  /** The photographs' heading, when there are photographs below the artifacts. */
  subtitle?: string;
  /**
   * The first is set large above the artifacts; the rest in a row below them.
   * Empty until the case is photographed: an empty case drawn in outline,
   * "Display case — photographs to come", stands in its place.
   */
  photos: CasePhoto[];
  /** Each object in the case, with its own page at <case path>/<id>. */
  artifacts: CaseArtifact[];
  /**
   * The record's lines about the display itself rather than an object in it
   * (panels, posters, the case, a digital extension), exactly as the record
   * has them. Listed on the case page; they have no page of their own.
   */
  display?: string[];
};

/**
 * One object in a display case. Every word is the owner's own: the name and
 * the record line come from the Mini Museum record; the writing is sentences
 * from the exhibition's own posters about this object. Nothing is added.
 */
export type CaseArtifact = {
  /** The route segment: /exhibitions/<slug>/artifacts/case/<id>. */
  id: string;
  /** Its name, cut from the record line (*words* set in italics). */
  name: string;
  /** The record's line for it, exactly as written (*words* set in italics). */
  record: string;
  /** Sentences from the exhibition's posters about it, each with its poster's id. */
  writing?: { poster: string; text: string }[];
};
