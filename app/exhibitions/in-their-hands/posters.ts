import type { Atmosphere, PanelEffect } from '@/components/exhibition/types';

/*
 * In Their Hands' two posters, panel by panel, for the hand-built walkthrough
 * in page.tsx. The wording is the posters' own.
 *
 * Each panel arrives its own way (`effect`, from the engine's vocabulary in
 * components/exhibition/types.ts): copy is typed out, set line by line,
 * spread like ink; a picture pans, zooms or comes into focus. A panel with no
 * effect of its own takes the exhibition's reveal: gilt light at a chapter
 * title, a portrait or a coin lifting and glinting. The title cards keep
 * their own motions (breathing, shrinking back).
 *
 * `special` keeps the section looks the posters were built with: the grounds
 * and copy colours, the frosted Tissot watercolour, the coins' glint.
 */

export type IthItem = {
  type: string;
  text?: string;
  src?: string;
  alt?: string;
  url?: string;
  position?: string;
  /** How the panel arrives; left out, it takes the exhibition's reveal. */
  effect?: PanelEffect;
  special?: string;
  /** The setting it stands in (ITH_ATMOSPHERES), drawn behind the panel. */
  atmosphere?: string;
  items?: string[];
  artworkTitle?: string;
  artworkArtist?: string;
  artworkDate?: string;
  artworkDescription?: string;
};

/**
 * The walkthrough's atmospheres (in-their-hands.css draws them), each a
 * setting from the story:
 *   scriptorium     the scholar's desk: candlelight on parchment, ruled lines
 *   vatican-stars   the Vatican Observatory: the night sky turning overhead
 *   qumran-cave     the caves above the Dead Sea: a shaft of light and dust
 *   jerusalem-dusk  Jerusalem in the spring of 30 AD: a low crimson dusk
 *   tyrian-silver   the thirty pieces: light sweeping across silver
 *   caiaphas-tomb   the burial cave broken open in 1990: torchlight, falling grit
 */
export const ITH_ATMOSPHERES: Record<string, Atmosphere> = {
  scriptorium: { parts: 3 },
  'vatican-stars': { parts: 2, particles: 34 },
  'qumran-cave': { parts: 3, particles: 18 },
  'jerusalem-dusk': { parts: 2 },
  'tyrian-silver': { parts: 2, particles: 8 },
  'caiaphas-tomb': { parts: 2, particles: 14 },
};


// ============================================
// POSTER 1: Faith and Reason
// ============================================
export const poster1Content: IthItem[] = [
  {
    type: 'title-image',
    src: '/exhibitions/in-their-hands/poster1-title-card.png',
    alt: 'Faith and Reason',
    effect: 'breathe',
    special: 'poster1-title'
  },
  {
    type: 'artwork-display',
    src: '/exhibitions/in-their-hands/poster1-lemaitre.jpg',
    alt: 'Black-and-white portrait photograph of Georges Lemaître in round glasses and a clerical collar',
    artworkTitle: 'Georges Lemaître',
    artworkArtist: 'Belgian Catholic priest',
    artworkDate: '1894–1966',
    text: 'In 1927, a Belgian Catholic priest named Georges Lemaître proposed that the universe had begun from a single point of unimaginable density: that space and time themselves had an origin, and that everything had been expanding ever since.',
    special: 'parchment',
    atmosphere: 'scriptorium'
  },
  {
    type: 'paragraph',
    text: 'Einstein told him his physics was correct but his intuition was "abominable." Two years later, Edwin Hubble\'s observations confirmed it. The priest had been right. We call his idea the Big Bang.',
    position: 'bottom-right',
    special: 'parchment',
    effect: 'line-by-line',
    atmosphere: 'scriptorium'
  },
  {
    type: 'paragraph',
    text: 'Lemaître was not an anomaly.',
    position: 'center',
    special: 'parchment',
    effect: 'blur-to-sharp',
    atmosphere: 'scriptorium'
  },
  {
    type: 'artwork-display',
    src: '/exhibitions/in-their-hands/poster1-mendel.jpg',
    alt: 'Black-and-white portrait photograph of Gregor Mendel in spectacles and a clerical collar',
    artworkTitle: 'Gregor Mendel',
    artworkArtist: 'Augustinian friar',
    artworkDate: '1822–1884',
    text: 'Gregor Mendel, the Augustinian friar, founded genetics in a monastery garden. The Dominican scholars of the École Biblique in Jerusalem were among the first to work on the Dead Sea Scrolls.',
    special: 'parchment',
    position: 'right',
    atmosphere: 'scriptorium'
  },
  {
    type: 'image-text-stacked',
    src: '/exhibitions/in-their-hands/poster1-vatican-observatory.jpg',
    alt: 'A domed observatory building lit gold beneath a star-filled night sky',
    text: 'The Vatican Observatory, still operating today, is one of the oldest astronomical research institutions in the world.',
    special: 'observatory',
    effect: 'kenburns-in',
    atmosphere: 'vatican-stars'
  },
  {
    type: 'paragraph',
    text: 'The relationship between scholarship and the Catholic faith is not mere coincidence but the expression of a conviction stated plainly in the Catechism: faith and reason are not enemies. They are partners in the same search for truth.',
    position: 'bottom-left',
    special: 'parchment',
    effect: 'ink-spread',
    atmosphere: 'scriptorium'
  },
  {
    type: 'full-image',
    src: '/exhibitions/in-their-hands/poster1-image.jpg',
    alt: 'James Tissot watercolor of the old city walls and citadel of Jerusalem, with a slender minaret against a hazy sky',
    special: 'frost',
    effect: 'shrink-back'
  },
  {
    type: 'section-title',
    text: 'The Dead Sea Scrolls',
    position: 'full-width',
    special: 'scrolls',
    atmosphere: 'qumran-cave'
  },
  {
    type: 'paragraph',
    text: 'In 1947, a young Bedouin shepherd threw a stone into a cave above the Dead Sea and heard something break.',
    position: 'center',
    special: 'scrolls',
    effect: 'split-reveal',
    atmosphere: 'qumran-cave'
  },
  {
    type: 'text-image-stacked',
    text: 'Inside were ancient clay jars containing scrolls — the oldest surviving manuscripts of the Hebrew Bible, hidden by the Essenes before the Roman destruction of Jerusalem in 70 AD.',
    src: '/exhibitions/in-their-hands/poster1-dead-sea-scrolls.jpg',
    alt: 'The Great Isaiah Scroll, unrolled in three long strips of columned Hebrew text on worn parchment',
    special: 'scrolls',
    effect: 'pan-lr',
    atmosphere: 'qumran-cave'
  },
  {
    type: 'paragraph',
    text: 'Before 1947, the oldest complete manuscripts of the Hebrew Bible dated from the medieval period. The Scrolls pushed that record back a thousand years, to before the birth of Jesus.',
    position: 'bottom-right',
    special: 'scrolls',
    effect: 'fade-in',
    atmosphere: 'qumran-cave'
  },
  {
    type: 'paragraph',
    text: 'And the text, across all that time, had barely changed. The Great Isaiah Scroll, over seven metres long and two millennia old, matches the text we use today with extraordinary fidelity.',
    position: 'top-left',
    special: 'scrolls',
    effect: 'typewriter',
    atmosphere: 'qumran-cave'
  },
  {
    type: 'paragraph',
    text: 'A thousand years of copying, and the words had not wandered.',
    position: 'center',
    special: 'scrolls',
    effect: 'ink-spread',
    atmosphere: 'qumran-cave'
  },
  {
    type: 'paragraph',
    text: 'For Catholic scholars who had always trusted the transmission of Scripture, this was a confirmation. One more example of the Catholic partnership between faith and reason.',
    position: 'bottom-right',
    special: 'scrolls',
    effect: 'fade-in',
    atmosphere: 'qumran-cave'
  },
  {
    type: 'section-title',
    text: 'The Question That Matters',
    position: 'full-width',
    special: 'authentication',
    atmosphere: 'scriptorium'
  },
  {
    type: 'paragraph',
    text: 'The discipline that authenticated those scrolls — testing metal, reading die-marks, dating parchment, authenticating inscriptions — trains a habit of mind that matters far beyond the museum.',
    position: 'top-right',
    special: 'authentication',
    effect: 'line-by-line',
    atmosphere: 'scriptorium'
  },
  {
    type: 'paragraph',
    text: 'It asks one question above all others: is this authentic? Not: does it feel true? Not: do I want it to be true? But: what does the physical evidence actually show?',
    position: 'bottom-left',
    special: 'authentication',
    effect: 'blur-to-sharp',
    atmosphere: 'scriptorium'
  },
  {
    type: 'paragraph',
    text: 'In an age of deepfakes, fabricated images, and information engineered to feel true without being true, that question is not merely academic. It is urgent.',
    position: 'top-left',
    special: 'authentication',
    effect: 'glitch',
    atmosphere: 'scriptorium'
  },
  {
    type: 'paragraph',
    text: 'The Catholic tradition has been asking it for centuries — not from scepticism, but from the confidence that truth is real, that it can be found, and that it will not contradict faith when honestly sought.',
    position: 'bottom-right',
    special: 'authentication',
    effect: 'rise-expand',
    atmosphere: 'scriptorium'
  },
  {
    type: 'quote',
    text: '"Faith and reason are like two wings on which the human spirit rises to the contemplation of truth." — John Paul II, Fides et Ratio',
    position: 'center',
    effect: 'film-credits',
    atmosphere: 'scriptorium'
  },
  { type: 'end', text: 'Return to Exhibition' }
];

// ============================================
// POSTER 2: The Weight of Thirty Pieces
// ============================================
export const poster2Content: IthItem[] = [
  {
    type: 'title-image',
    src: '/exhibitions/in-their-hands/poster2-title-card.jpg',
    alt: 'The Weight of Thirty Pieces',
    effect: 'shrink-back'
  },
  {
    type: 'paragraph',
    text: 'In the spring of approximately 30 AD, a series of events unfolded in Jerusalem that would reshape the history of the world.',
    position: 'center',
    special: 'passion',
    effect: 'blur-to-sharp',
    atmosphere: 'jerusalem-dusk'
  },
  {
    type: 'paragraph',
    text: 'The account exists in four texts written within living memory of the events. Then archaeologists began to dig.',
    position: 'center',
    special: 'passion',
    effect: 'line-by-line',
    atmosphere: 'jerusalem-dusk'
  },
  {
    type: 'paragraph',
    text: 'What they found, across two centuries of excavation, was the world those texts describe. The political figures, the administrative structures, the legal practices, the currency.',
    position: 'bottom-right',
    special: 'passion',
    effect: 'fade-in',
    atmosphere: 'jerusalem-dusk'
  },
  {
    type: 'paragraph',
    text: 'A coin cannot be forged the way a text can: its metal can be tested, its die-marks traced to specific mints, its age confirmed by the earth it came from.',
    position: 'top-left',
    special: 'passion',
    effect: 'split-reveal',
    atmosphere: 'jerusalem-dusk'
  },
  {
    type: 'artwork-display',
    src: '/exhibitions/in-their-hands/poster2-pilate-stone.jpg',
    alt: 'The Pilate Stone: a weathered limestone block carved with Latin lettering naming Pontius Pilate',
    text: 'For decades, some scholars questioned whether Pontius Pilate was a historical figure. Then in 1961, a construction crew at Caesarea Maritima uncovered a limestone block inscribed PONTIVS PILATVS PRAEFECTVS IVDAEAE.',
    special: 'passion',
    position: 'right',
    effect: 'mega-zoom-out',
    atmosphere: 'jerusalem-dusk'
  },
  {
    type: 'paragraph',
    text: 'The Pilate Stone settled the question, but Pilate\'s coins had been evidence all along — small bronze prutot stamped with pagan religious symbols as deliberate acts of provocation against Jewish religious law.',
    position: 'center',
    special: 'passion',
    effect: 'fade-in',
    atmosphere: 'jerusalem-dusk'
  },
  {
    type: 'full-image',
    src: '/exhibitions/in-their-hands/poster2-image1.jpg',
    alt: 'Painting of Christ carrying the cross through a crowd of soldiers, horsemen and mourning women, fading into darkness',
    special: 'passion',
    effect: 'pan-lr',
    atmosphere: 'jerusalem-dusk'
  },
  {
    type: 'section-title',
    text: 'The Thirty Pieces',
    position: 'full-width',
    special: 'thirty-pieces',
    atmosphere: 'tyrian-silver'
  },
  {
    type: 'paragraph',
    text: 'No detail in the Passion narrative has generated more numismatic attention than the thirty pieces of silver paid to Judas Iscariot.',
    position: 'center',
    special: 'thirty-pieces',
    effect: 'blur-to-sharp',
    atmosphere: 'tyrian-silver'
  },
  {
    type: 'artwork-display',
    src: '/exhibitions/in-their-hands/poster2-tyrian-shekel.png',
    alt: 'Both faces of a worn silver Tyrian shekel: the laureate head of Melqart, and an eagle',
    artworkTitle: 'Tyrian Shekel',
    artworkArtist: 'Mint of Tyre',
    artworkDate: '126 BC – 56 AD',
    text: 'The currency is not named in Matthew\'s Gospel, but scholars identify it with near-unanimous agreement as Tyrian shekels — minted at the Phoenician city of Tyre from exceptionally pure silver, bearing the image of Melqart, chief deity of Tyre. A pagan coin, by every measure of Jewish religious law.',
    special: 'thirty-pieces',
    atmosphere: 'tyrian-silver'
  },
  {
    type: 'paragraph',
    text: 'And yet the Tyrian shekel was the only currency accepted for payment of the annual Temple tax in Jerusalem, because no other silver coin of sufficient purity circulated in the region.',
    position: 'bottom-right',
    special: 'thirty-pieces',
    effect: 'line-by-line',
    atmosphere: 'tyrian-silver'
  },
  {
    type: 'paragraph',
    text: 'The Temple authorities had made a pragmatic compromise: the purity of the metal overrode the offensiveness of the image.',
    position: 'center',
    special: 'thirty-pieces',
    effect: 'split-reveal',
    atmosphere: 'tyrian-silver'
  },
  {
    type: 'paragraph',
    text: 'The ironies are stacked. The only coin permitted before God in the Temple bore a pagan idol. The price of betrayal was sacred Temple currency.',
    position: 'top-right',
    special: 'thirty-pieces',
    effect: 'typewriter',
    atmosphere: 'tyrian-silver'
  },
  {
    type: 'artwork-display',
    src: '/exhibitions/in-their-hands/poster2-potters-field.jpg',
    alt: 'Watercolor of Judas in a swirling brown robe flinging coins across a pillared Temple court as elders look on',
    artworkTitle: 'Judas Returns the Money (Judas rend l\'argent)',
    artworkArtist: 'James Tissot',
    text: 'When Judas returned the thirty pieces in remorse, the priests refused to receive them back — blood money could not re-enter the treasury — and used them instead to purchase a potter\'s field for the burial of strangers.',
    special: 'thirty-pieces',
    position: 'right',
    atmosphere: 'tyrian-silver'
  },
  {
    type: 'paragraph',
    text: 'Sacred money, contaminated by betrayal, went to buy ground for the dead. Matthew saw the irony and in it the fulfilment of ancient prophecy.',
    position: 'center',
    special: 'thirty-pieces',
    effect: 'ink-spread',
    atmosphere: 'tyrian-silver'
  },
  {
    type: 'full-image',
    src: '/exhibitions/in-their-hands/poster2-image2.jpg',
    alt: 'Painting of a crowded square beneath tall palm trees, a tiled building at left and a fort on the horizon, fading into darkness',
    special: 'thirty-pieces',
    effect: 'kenburns-in',
    atmosphere: 'tyrian-silver'
  },
  {
    type: 'section-title',
    text: 'What Archaeology Found by Accident',
    position: 'full-width',
    special: 'accident',
    atmosphere: 'caiaphas-tomb'
  },
  {
    type: 'paragraph',
    text: 'In 1990, a construction crew in Jerusalem accidentally broke through the roof of a burial cave.',
    position: 'center',
    special: 'accident',
    effect: 'film-credits',
    atmosphere: 'caiaphas-tomb'
  },
  {
    type: 'text-image-stacked',
    text: 'Inside were twelve ossuaries — bone boxes used to collect the remains of the dead. One was ornately carved, inscribed: Yehosef bar Qayafa. Joseph, son of Caiaphas.',
    src: '/exhibitions/in-their-hands/poster2-caiaphas-ossuary.png',
    alt: 'The Caiaphas Ossuary: a limestone bone box carved with rosettes, its end scratched with an Aramaic inscription',
    special: 'accident',
    effect: 'blur-to-sharp',
    atmosphere: 'caiaphas-tomb'
  },
  {
    type: 'paragraph',
    text: 'The bones of a sixty-year-old man were inside. Most scholars believe these are the remains of the High Priest who presided at the trial of Jesus. It had taken a crew breaking through a roof by accident to find him.',
    position: 'bottom-right',
    special: 'accident',
    effect: 'fade-in',
    atmosphere: 'caiaphas-tomb'
  },
  {
    type: 'paragraph',
    text: 'This is the nature of the archaeological record: partial, contingent, arriving by thrown stones and construction accidents.',
    position: 'top-right',
    special: 'accident',
    effect: 'drift',
    atmosphere: 'caiaphas-tomb'
  },
  {
    type: 'paragraph',
    text: 'No single discovery proves the events of the Passion. The convergence of many coins, inscriptions, ossuaries, excavated streets and pools and gates builds a portrait of a world in which those events could have occurred exactly as described.',
    position: 'bottom-left',
    special: 'accident',
    effect: 'line-by-line',
    atmosphere: 'caiaphas-tomb'
  },
  {
    type: 'paragraph',
    text: 'The political figures were real. The legal procedures were real. The currency was real.',
    position: 'center',
    special: 'accident',
    effect: 'rise-expand',
    atmosphere: 'caiaphas-tomb'
  },
  {
    type: 'quote',
    position: 'center',
    text: 'These coins do not prove the Resurrection. Faith is not proved by archaeology. But they prove something important: the world the Gospels describe was a real world.',
    effect: 'breathe',
    atmosphere: 'caiaphas-tomb'
  },
  {
    type: 'timeline',
    text: 'Coins Across the Gospel',
    position: 'center',
    items: [
      'Before the Story — 63 BC — Tyrian shekel minting begins at Tyre. The coin that will become the thirty pieces of silver enters the world.',
      'The King\'s Decree — 4 BC — Death of Herod the Great. The king who ordered the Massacre of the Innocents dies the same year as his own command.',
      'The Provocateur Arrives — 26 AD — Pontius Pilate appointed Prefect of Judaea. His first coins are minted bearing pagan symbols.',
      'The Passion — c. 30 AD — Thirty Tyrian shekels change hands. Pilate washes his hands. A potter\'s field is purchased.',
      'The Last Ruler — 59 AD — Paul appeals to Caesar before Porcius Festus. The last named ruler of the New Testament mints this coin.'
    ],
    effect: 'line-by-line',
    atmosphere: 'tyrian-silver'
  },
  { type: 'end', text: 'Return to Exhibition' }
];
