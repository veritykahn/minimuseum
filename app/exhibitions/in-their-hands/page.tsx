'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ContentItem = {
  type: string;
  text?: string;
  src?: string;
  alt?: string;
  url?: string;
  position?: string;
  effect?: string;
  special?: string;
  items?: string[];
  artworkTitle?: string;
  artworkArtist?: string;
  artworkDate?: string;
  artworkDescription?: string;
};

// ============================================
// POSTER 1: Faith and Reason
// ============================================
const poster1Content: ContentItem[] = [
  {
    type: 'title-image',
    src: '/exhibitions/in-their-hands/poster1-title-card.png',
    alt: 'Faith and Reason',
    effect: 'breathe',
    special: 'poster1-title'
  },
  {
    type: 'paragraph',
    text: 'In 1927, a Belgian Catholic priest named Georges Lemaître proposed that the universe had begun from a single point of unimaginable density: that space and time themselves had an origin, and that everything had been expanding ever since.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'parchment'
  },
  {
    type: 'artwork-display',
    src: '/exhibitions/in-their-hands/poster1-lemaitre.jpg',
    alt: 'Georges Lemaître',
    artworkTitle: 'Georges Lemaître',
    artworkArtist: 'Belgian Catholic priest',
    artworkDate: '1894–1966',
    artworkDescription: 'Father of the Big Bang theory.',
    special: 'parchment',
    position: 'right'
  },
  {
    type: 'paragraph',
    text: 'Einstein told him his physics was correct but his intuition was "abominable." Two years later, Edwin Hubble\'s observations confirmed it. The priest had been right. We call his idea the Big Bang.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'parchment'
  },
  {
    type: 'paragraph',
    text: 'Lemaître was not an anomaly.',
    position: 'center',
    effect: 'blur-to-sharp',
    special: 'parchment'
  },
  {
    type: 'artwork-display',
    src: '/exhibitions/in-their-hands/poster1-mendel.jpg',
    alt: 'Gregor Mendel',
    artworkTitle: 'Gregor Mendel',
    artworkArtist: 'Augustinian friar',
    artworkDate: '1822–1884',
    artworkDescription: 'Founder of genetics.',
    special: 'parchment'
  },
  {
    type: 'paragraph',
    text: 'Gregor Mendel, the Augustinian friar, founded genetics in a monastery garden. The Dominican scholars of the École Biblique in Jerusalem were among the first to work on the Dead Sea Scrolls.',
    position: 'top-right',
    effect: 'fade-in',
    special: 'parchment'
  },
  {
    type: 'image-text-stacked',
    src: '/exhibitions/in-their-hands/poster1-vatican-observatory.jpg',
    alt: 'Vatican Observatory',
    text: 'The Vatican Observatory, still operating today, is one of the oldest astronomical research institutions in the world.',
    special: 'observatory'
  },
  {
    type: 'paragraph',
    text: 'The relationship between scholarship and the Catholic faith is not mere coincidence but the expression of a conviction stated plainly in the Catechism: faith and reason are not enemies. They are partners in the same search for truth.',
    position: 'bottom-left',
    effect: 'fade-in',
    special: 'parchment'
  },
  {
    type: 'section-title',
    text: 'The Dead Sea Scrolls',
    position: 'full-width',
    effect: 'split-reveal',
    special: 'scrolls'
  },
  {
    type: 'paragraph',
    text: 'In 1947, a young Bedouin shepherd threw a stone into a cave above the Dead Sea and heard something break.',
    position: 'center',
    effect: 'blur-to-sharp',
    special: 'scrolls'
  },
  {
    type: 'text-image-stacked',
    text: 'Inside were ancient clay jars containing scrolls — the oldest surviving manuscripts of the Hebrew Bible, hidden by the Essenes before the Roman destruction of Jerusalem in 70 AD.',
    src: '/exhibitions/in-their-hands/poster1-dead-sea-scrolls.jpg',
    alt: 'The Great Isaiah Scroll',
    special: 'scrolls'
  },
  {
    type: 'paragraph',
    text: 'Before 1947, the oldest complete manuscripts of the Hebrew Bible dated from the medieval period. The Scrolls pushed that record back a thousand years, to before the birth of Jesus.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'scrolls'
  },
  {
    type: 'paragraph',
    text: 'And the text, across all that time, had barely changed. The Great Isaiah Scroll, over seven metres long and two millennia old, matches the text we use today with extraordinary fidelity.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'scrolls'
  },
  {
    type: 'paragraph',
    text: 'A thousand years of copying, and the words had not wandered.',
    position: 'center',
    effect: 'blur-to-sharp',
    special: 'scrolls'
  },
  {
    type: 'paragraph',
    text: 'For Catholic scholars who had always trusted the transmission of Scripture, this was a confirmation. One more example of the Catholic partnership between faith and reason.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'scrolls'
  },
  {
    type: 'full-image',
    src: '/exhibitions/in-their-hands/poster1-pilate-stone.jpg',
    alt: 'The Pilate Stone',
    effect: 'blur-to-sharp'
  },
  {
    type: 'section-title',
    text: 'The Question That Matters',
    position: 'full-width',
    effect: 'split-reveal',
    special: 'authentication'
  },
  {
    type: 'paragraph',
    text: 'The discipline that authenticated those scrolls — testing metal, reading die-marks, dating parchment, authenticating inscriptions — trains a habit of mind that matters far beyond the museum.',
    position: 'top-right',
    effect: 'fade-in',
    special: 'authentication'
  },
  {
    type: 'paragraph',
    text: 'It asks one question above all others: is this authentic? Not: does it feel true? Not: do I want it to be true? But: what does the physical evidence actually show?',
    position: 'bottom-left',
    effect: 'fade-in',
    special: 'authentication'
  },
  {
    type: 'paragraph',
    text: 'In an age of deepfakes, fabricated images, and information engineered to feel true without being true, that question is not merely academic. It is urgent.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'authentication'
  },
  {
    type: 'paragraph',
    text: 'The Catholic tradition has been asking it for centuries — not from scepticism, but from the confidence that truth is real, that it can be found, and that it will not contradict faith when honestly sought.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'authentication'
  },
  {
    type: 'quote',
    text: '"Faith and reason are like two wings on which the human spirit rises to the contemplation of truth." — John Paul II, Fides et Ratio',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  { type: 'end', text: 'Return to Exhibition' }
];

// ============================================
// POSTER 2: The Weight of Thirty Pieces
// ============================================
const poster2Content: ContentItem[] = [
  {
    type: 'title-image',
    src: '/exhibitions/in-their-hands/poster2-title-card.jpg',
    alt: 'The Weight of Thirty Pieces',
    effect: 'drift'
  },
  {
    type: 'section-title',
    text: 'The Weight of Thirty Pieces',
    position: 'center',
    effect: 'blur-to-sharp',
    special: 'passion'
  },
  {
    type: 'paragraph',
    text: 'In the spring of approximately 30 AD, a series of events unfolded in Jerusalem that would reshape the history of the world.',
    position: 'center',
    effect: 'blur-to-sharp',
    special: 'passion'
  },
  {
    type: 'paragraph',
    text: 'The account exists in four texts written within living memory of the events. Then archaeologists began to dig.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'passion'
  },
  {
    type: 'full-image',
    src: '/exhibitions/in-their-hands/poster2-image1.jpg',
    alt: 'The Passion',
    effect: 'kenburns-in'
  },
  {
    type: 'paragraph',
    text: 'What they found, across two centuries of excavation, was the world those texts describe. The political figures, the administrative structures, the legal practices, the currency.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'passion'
  },
  {
    type: 'paragraph',
    text: 'A coin cannot be forged the way a text can: its metal can be tested, its die-marks traced to specific mints, its age confirmed by the earth it came from.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'passion'
  },
  {
    type: 'paragraph',
    text: 'For decades, some scholars questioned whether Pontius Pilate was a historical figure. Then in 1961, a construction crew at Caesarea Maritima uncovered a limestone block inscribed PONTIVS PILATVS PRAEFECTVS IVDAEAE.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'passion'
  },
  {
    type: 'full-image',
    src: '/exhibitions/in-their-hands/poster2-pilate-coin.jpg',
    alt: 'Pontius Pilate prutah',
    effect: 'blur-to-sharp'
  },
  {
    type: 'paragraph',
    text: 'The Pilate Stone settled the question, but Pilate\'s coins had been evidence all along — small bronze prutot stamped with pagan religious symbols as deliberate acts of provocation against Jewish religious law.',
    position: 'center',
    effect: 'fade-in',
    special: 'passion'
  },
  {
    type: 'section-title',
    text: 'The Thirty Pieces',
    position: 'full-width',
    effect: 'split-reveal',
    special: 'thirty-pieces'
  },
  {
    type: 'paragraph',
    text: 'No detail in the Passion narrative has generated more numismatic attention than the thirty pieces of silver paid to Judas Iscariot.',
    position: 'center',
    effect: 'blur-to-sharp',
    special: 'thirty-pieces'
  },
  {
    type: 'paragraph',
    text: 'The currency is not named in Matthew\'s Gospel, but scholars identify it with near-unanimous agreement as Tyrian shekels — minted at the Phoenician city of Tyre from exceptionally pure silver, bearing the image of Melqart, chief deity of Tyre. A pagan coin, by every measure of Jewish religious law.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'thirty-pieces'
  },
  {
    type: 'full-image',
    src: '/exhibitions/in-their-hands/poster2-tyrian-shekel.jpg',
    alt: 'Tyrian Shekel',
    effect: 'blur-to-sharp'
  },
  {
    type: 'paragraph',
    text: 'And yet the Tyrian shekel was the only currency accepted for payment of the annual Temple tax in Jerusalem, because no other silver coin of sufficient purity circulated in the region.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'thirty-pieces'
  },
  {
    type: 'paragraph',
    text: 'The Temple authorities had made a pragmatic compromise: the purity of the metal overrode the offensiveness of the image.',
    position: 'center',
    effect: 'blur-to-sharp',
    special: 'thirty-pieces'
  },
  {
    type: 'full-image',
    src: '/exhibitions/in-their-hands/poster2-image2.jpg',
    alt: 'The Passion narrative',
    effect: 'drift'
  },
  {
    type: 'paragraph',
    text: 'The ironies are stacked. The only coin permitted before God in the Temple bore a pagan idol. The price of betrayal was sacred Temple currency.',
    position: 'top-right',
    effect: 'fade-in',
    special: 'thirty-pieces'
  },
  {
    type: 'paragraph',
    text: 'When Judas returned the thirty pieces in remorse, the priests refused to receive them back — blood money could not re-enter the treasury — and used them instead to purchase a potter\'s field for the burial of strangers.',
    position: 'bottom-left',
    effect: 'fade-in',
    special: 'thirty-pieces'
  },
  {
    type: 'paragraph',
    text: 'Sacred money, contaminated by betrayal, went to buy ground for the dead. Matthew saw the irony and in it the fulfilment of ancient prophecy.',
    position: 'center',
    effect: 'blur-to-sharp',
    special: 'thirty-pieces'
  },
  {
    type: 'full-image',
    src: '/exhibitions/in-their-hands/poster2-potters-field.jpg',
    alt: 'Judas Returns the Price of Blood — James Tissot',
    effect: 'blur-to-sharp'
  },
  {
    type: 'section-title',
    text: 'What Archaeology Found by Accident',
    position: 'full-width',
    effect: 'split-reveal',
    special: 'accident'
  },
  {
    type: 'paragraph',
    text: 'In 1990, a construction crew in Jerusalem accidentally broke through the roof of a burial cave.',
    position: 'center',
    effect: 'blur-to-sharp',
    special: 'accident'
  },
  {
    type: 'paragraph',
    text: 'Inside were twelve ossuaries — bone boxes used to collect the remains of the dead. One was ornately carved, inscribed: Yehosef bar Qayafa. Joseph, son of Caiaphas.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'accident'
  },
  {
    type: 'full-image',
    src: '/exhibitions/in-their-hands/poster2-caiaphas-ossuary.png',
    alt: 'The Caiaphas Ossuary',
    effect: 'blur-to-sharp'
  },
  {
    type: 'paragraph',
    text: 'The bones of a sixty-year-old man were inside. Most scholars believe these are the remains of the High Priest who presided at the trial of Jesus. It had taken a crew breaking through a roof by accident to find him.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'accident'
  },
  {
    type: 'paragraph',
    text: 'This is the nature of the archaeological record: partial, contingent, arriving by thrown stones and construction accidents.',
    position: 'top-right',
    effect: 'fade-in',
    special: 'accident'
  },
  {
    type: 'paragraph',
    text: 'No single discovery proves the events of the Passion. The convergence of many coins, inscriptions, ossuaries, excavated streets and pools and gates builds a portrait of a world in which those events could have occurred exactly as described.',
    position: 'bottom-left',
    effect: 'fade-in',
    special: 'accident'
  },
  {
    type: 'paragraph',
    text: 'The political figures were real. The legal procedures were real. The currency was real.',
    position: 'center',
    effect: 'blur-to-sharp',
    special: 'accident'
  },
  {
    type: 'timeline',
    position: 'center',
    effect: 'line-by-line',
    items: [
      '63 BC — Tyrian shekel minting begins at Tyre. The coin that will become the thirty pieces of silver enters the world.',
      '4 BC — Death of Herod the Great. The king who ordered the Massacre of the Innocents dies the same year as his own command.',
      '26 AD — Pontius Pilate appointed Prefect of Judaea. His first coins are minted bearing pagan symbols.',
      'c. 30 AD — The Passion. Thirty Tyrian shekels change hands. Pilate washes his hands. A potter\'s field is purchased.',
      '59 AD — Paul appeals to Caesar before Porcius Festus. The last named ruler of the New Testament mints this coin.'
    ]
  },
  {
    type: 'quote',
    position: 'center',
    effect: 'blur-to-sharp',
    text: 'These coins do not prove the Resurrection. Faith is not proved by archaeology. But they prove something important: the world the Gospels describe was a real world.'
  },
  { type: 'end', text: 'Return to Exhibition' }
];

// ============================================
// HELPER COMPONENTS
// ============================================

const TypewriterText = ({ text, color }: { text: string; onComplete?: () => void; color: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [currentIndex, text]);

  return (
    <span style={{ color }}>
      {displayedText}
      <span className="ith-typewriter-cursor">|</span>
    </span>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function InTheirHands() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'main' | 'poster1' | 'poster2'>('main');
  const [posterStep, setPosterStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  const currentPosterContent = activeView === 'poster1' ? poster1Content : poster2Content;

  const handleBack = () => {
    sessionStorage.setItem('firstFloorIndex', '2');
    router.push('/exhibitions/first-floor');
  };

  const openPoster = (poster: 'poster1' | 'poster2') => {
    setFadeIn(false);
    setTimeout(() => {
      setActiveView(poster);
      setPosterStep(0);
      setAnimationKey(prev => prev + 1);
      setFadeIn(true);
    }, 300);
  };

  const nextStep = () => {
    if (posterStep < currentPosterContent.length - 1) {
      setFadeIn(false);
      setTimeout(() => {
        setPosterStep(posterStep + 1);
        setAnimationKey(prev => prev + 1);
        setFadeIn(true);
      }, 400);
    }
  };

  const prevStep = () => {
    if (posterStep > 0) {
      setFadeIn(false);
      setTimeout(() => {
        setPosterStep(posterStep - 1);
        setAnimationKey(prev => prev + 1);
        setFadeIn(true);
      }, 400);
    }
  };

  const returnToMain = () => {
    setFadeIn(false);
    setTimeout(() => {
      setActiveView('main');
      setPosterStep(0);
      setFadeIn(true);
    }, 300);
  };

  const currentItem = currentPosterContent[posterStep];
  const isPoster1 = activeView === 'poster1';

  // Colors — drawn from the exhibition palettes
  const poster1Gold = '#C9A84C';
  const poster1Cream = '#F0EDD8';
  const poster2Antique = '#C8C4A0';
  const poster2Cream = '#F0ECD8';
  const gold = '#C9A84C';

  // Per-section background colors
  const getBgColor = () => {
    if (!currentItem) return isPoster1 ? '#2C2416' : '#1A0A0A';

    if (currentItem.type === 'title-image') {
      return isPoster1 ? '#2C2416' : '#1A0A0A';
    }

    if (isPoster1) {
      switch (currentItem.special) {
        case 'parchment':       return '#1A1208';
        case 'scrolls':         return '#0F1A0F';
        case 'observatory':     return '#0A0A1A';
        case 'authentication':  return '#1A1208';
        default:                return '#2C2416';
      }
    } else {
      switch (currentItem.special) {
        case 'passion':         return '#0F0A04';
        case 'thirty-pieces':   return '#1A0A0A';
        case 'accident':        return '#0A0F0A';
        default:                return '#1A0A0A';
      }
    }
  };

  const bgColor = getBgColor();
  const textColor = isPoster1 ? poster1Cream : poster2Cream;

  // Per-section color palette
  const getSectionColors = (special?: string) => {
    if (isPoster1) {
      switch (special) {
        case 'parchment':       return { title: poster1Gold, text: poster1Cream };
        case 'scrolls':         return { title: '#A8C4A0', text: poster1Cream };
        case 'observatory':     return { title: '#A0B8D0', text: '#D0D8E8' };
        case 'authentication':  return { title: poster1Gold, text: poster1Cream };
        default:                return { title: poster1Gold, text: poster1Cream };
      }
    } else {
      switch (special) {
        case 'passion':         return { title: poster2Antique, text: poster2Cream };
        case 'thirty-pieces':   return { title: '#D0CCA8', text: poster2Cream };
        case 'accident':        return { title: '#B8C0A8', text: poster2Cream };
        default:                return { title: poster2Antique, text: poster2Cream };
      }
    }
  };

  // Position classes
  const getPositionClass = (position?: string) => {
    switch(position) {
      case 'top-left': return 'ith-pos-top-left';
      case 'top-right': return 'ith-pos-top-right';
      case 'bottom-left': return 'ith-pos-bottom-left';
      case 'bottom-right': return 'ith-pos-bottom-right';
      case 'bottom-center': return 'ith-pos-bottom-center';
      case 'full-width': return 'ith-pos-full-width';
      default: return 'ith-pos-center';
    }
  };

  // Effect classes
  const getEffectClass = (effect?: string) => {
    switch(effect) {
      case 'blur-to-sharp': return 'ith-effect-blur-sharp';
      case 'split-reveal': return 'ith-effect-split-reveal';
      case 'fade-in': return 'ith-effect-fade-in';
      case 'ink-spread': return 'ith-effect-ink-spread';
      case 'line-by-line': return 'ith-effect-fade-in';
      default: return '';
    }
  };

  // Special classes
  const getSpecialClass = (special?: string) => {
    if (!special) return '';
    const classes: string[] = [];
    if (special === 'parchment') classes.push('ith-parchment');
    if (special === 'scrolls') classes.push('ith-scrolls');
    if (special === 'observatory') classes.push('ith-observatory');
    if (special === 'authentication') classes.push('ith-parchment');
    if (special === 'passion') classes.push('ith-passion');
    if (special === 'thirty-pieces') classes.push('ith-thirty-pieces');
    if (special === 'accident') classes.push('ith-accident');
    return classes.join(' ');
  };

  return (
    <div style={{ background: activeView === 'main' ? '#0a0a0a' : bgColor, minHeight: '100vh', transition: 'background 0.5s ease' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }

        /* ============================================
           NAVIGATION
           ============================================ */
        .ith-nav {
          position: fixed;
          top: 32px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          font-family: 'Cormorant Garamond', serif;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .ith-nav-left { left: 32px; }
        .ith-nav-right { right: 32px; }
        .ith-nav:hover .ith-nav-label { opacity: 1; max-width: 150px; }
        .ith-nav:hover .ith-nav-arrow-left { transform: translateX(-4px); }
        .ith-nav:hover .ith-nav-arrow-right { transform: translateX(4px); }
        .ith-nav-text { font-size: 28px; font-weight: 300; transition: color 0.3s ease; }
        .ith-nav-arrow { font-size: 16px; transition: all 0.3s ease; }
        .ith-nav-label {
          font-size: 13px;
          font-style: italic;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.4s ease;
        }

        /* ============================================
           TYPEWRITER
           ============================================ */
        @keyframes ithBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .ith-typewriter-cursor {
          animation: ithBlink 0.8s infinite;
          margin-left: 2px;
        }

        /* ============================================
           BASE ANIMATIONS
           ============================================ */
        @keyframes ithFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .ith-effect-fade-in {
          animation: ithFadeIn 0.8s ease forwards;
        }

        @keyframes ithBlurToSharp {
          from { filter: blur(12px); opacity: 0; }
          to { filter: blur(0); opacity: 1; }
        }
        .ith-effect-blur-sharp {
          animation: ithBlurToSharp 1.2s ease forwards;
        }

        @keyframes ithSplitReveal {
          from { clip-path: inset(0 50% 0 50%); opacity: 0; }
          to { clip-path: inset(0 0 0 0); opacity: 1; }
        }
        .ith-effect-split-reveal {
          animation: ithSplitReveal 0.8s ease forwards;
        }

        @keyframes ithInkSpread {
          from { filter: blur(3px); opacity: 0; letter-spacing: 0.08em; }
          to { filter: blur(0); opacity: 1; letter-spacing: normal; }
        }
        .ith-effect-ink-spread {
          animation: ithInkSpread 1.4s ease forwards;
        }

        @keyframes ithKenburnIn {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        .ith-effect-kenburns-in {
          animation: ithKenburnIn 8s ease forwards;
        }

        @keyframes ithDrift {
          0% { transform: translateX(0); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
        .ith-effect-drift {
          animation: ithDrift 6s ease-in-out infinite;
        }

        /* ============================================
           SPECIAL EFFECT 1: PARCHMENT — Poster 1 base
           Warm texture, slow radial pulse, aged paper grain
           ============================================ */
        .ith-parchment {
          position: relative;
          overflow: hidden;
        }
        .ith-parchment::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%);
          animation: ithParchmentPulse 6s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        .ith-parchment::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 28px,
            rgba(201,168,76,0.03) 28px,
            rgba(201,168,76,0.03) 29px
          );
          pointer-events: none;
          z-index: 0;
        }
        @keyframes ithParchmentPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.04); }
        }
        .ith-parchment .ith-paragraph-text,
        .ith-parchment .ith-section-title-text {
          text-shadow: 0 0 30px rgba(201,168,76,0.15);
        }

        /* ============================================
           SPECIAL EFFECT 2: SCROLLS — Dead Sea Scrolls
           Forest-dark, manuscript column lines, ink-spread text
           ============================================ */
        .ith-scrolls {
          position: relative;
          overflow: hidden;
        }
        .ith-scrolls::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 180px,
            rgba(168,196,160,0.04) 180px,
            rgba(168,196,160,0.04) 181px
          );
          pointer-events: none;
          z-index: 0;
        }
        .ith-scrolls::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 22px,
            rgba(168,196,160,0.025) 22px,
            rgba(168,196,160,0.025) 23px
          );
          pointer-events: none;
          z-index: 0;
        }
        .ith-scrolls .ith-paragraph-text {
          text-shadow: 0 0 20px rgba(168,196,160,0.1);
        }

        /* ============================================
           SPECIAL EFFECT 3: OBSERVATORY — Night sky / cosmos
           Deep sky, star-like points, slow celestial rotation
           ============================================ */
        .ith-observatory {
          position: relative;
          overflow: hidden;
        }
        .ith-observatory::before {
          content: '';
          position: absolute;
          inset: -20%;
          background:
            radial-gradient(1px 1px at 20% 30%, rgba(200,210,240,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 80% 20%, rgba(200,210,240,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 40% 70%, rgba(200,210,240,0.35) 0%, transparent 100%),
            radial-gradient(1px 1px at 65% 45%, rgba(200,210,240,0.25) 0%, transparent 100%),
            radial-gradient(1px 1px at 10% 80%, rgba(200,210,240,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 65%, rgba(200,210,240,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 55% 15%, rgba(200,210,240,0.35) 0%, transparent 100%),
            radial-gradient(1px 1px at 30% 55%, rgba(200,210,240,0.25) 0%, transparent 100%),
            radial-gradient(1px 1px at 75% 85%, rgba(200,210,240,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 15% 50%, rgba(200,210,240,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 50% 90%, rgba(200,210,240,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 85% 40%, rgba(200,210,240,0.25) 0%, transparent 100%);
          pointer-events: none;
          z-index: 0;
        }
        .ith-observatory::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 200%;
          transform: translate(-50%, -50%);
          background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            rgba(160,184,208,0.03) 30deg,
            transparent 60deg,
            rgba(160,184,208,0.02) 90deg,
            transparent 120deg,
            rgba(160,184,208,0.03) 150deg,
            transparent 180deg,
            rgba(160,184,208,0.02) 210deg,
            transparent 240deg,
            rgba(160,184,208,0.03) 270deg,
            transparent 300deg,
            rgba(160,184,208,0.02) 330deg,
            transparent 360deg
          );
          animation: ithCelestialRotate 60s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes ithCelestialRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .ith-observatory .ith-paragraph-text,
        .ith-observatory .ith-section-title-text {
          text-shadow: 0 0 20px rgba(160,184,208,0.15);
        }

        /* ============================================
           SPECIAL EFFECT 4: PASSION — Pilate / Passion sections
           Near-black, faint crimson radial pulse, weighted stillness
           ============================================ */
        .ith-passion {
          position: relative;
          overflow: hidden;
        }
        .ith-passion::before {
          content: '';
          position: absolute;
          inset: -10%;
          background: radial-gradient(
            ellipse at 50% 50%,
            rgba(120,20,20,0.08) 0%,
            transparent 60%
          );
          animation: ithPassionPulse 8s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes ithPassionPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }

        /* ============================================
           SPECIAL EFFECT 5: THIRTY PIECES — Silver shimmer
           Faint metallic sheen, slow diagonal light sweep
           ============================================ */
        .ith-thirty-pieces {
          position: relative;
          overflow: hidden;
        }
        .ith-thirty-pieces::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 50% 50%,
            rgba(192,192,200,0.04) 0%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 0;
        }
        .ith-thirty-pieces::after {
          content: '';
          position: absolute;
          top: -100%;
          left: -100%;
          width: 50%;
          height: 300%;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(200,200,210,0.04) 45%,
            rgba(220,220,225,0.06) 50%,
            rgba(200,200,210,0.04) 55%,
            transparent 100%
          );
          animation: ithSilverSweep 12s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes ithSilverSweep {
          0% { transform: translate(-30%, -10%) rotate(30deg); }
          100% { transform: translate(250%, -10%) rotate(30deg); }
        }

        /* ============================================
           SPECIAL EFFECT 6: ACCIDENT — Cave / torch flicker
           Warm near-black, occasional faint flicker
           ============================================ */
        .ith-accident {
          position: relative;
          overflow: hidden;
        }
        .ith-accident::before {
          content: '';
          position: absolute;
          inset: -10%;
          background: radial-gradient(
            ellipse at 45% 55%,
            rgba(180,140,60,0.06) 0%,
            transparent 50%
          );
          animation: ithTorchFlicker 3s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes ithTorchFlicker {
          0%, 100% { opacity: 0.4; }
          15% { opacity: 0.9; }
          30% { opacity: 0.3; }
          45% { opacity: 0.7; }
          60% { opacity: 0.5; }
          75% { opacity: 0.8; }
          90% { opacity: 0.35; }
        }

        /* ============================================
           POSTER 1 PERSISTENT BACKGROUND
           Tissot Jerusalem watercolour behind all text slides
           ============================================ */
        .ith-poster1-bg {
          position: fixed;
          inset: 0;
          background-image: url('/exhibitions/in-their-hands/poster1-image.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          z-index: 0;
          animation: ithBgKenburns 60s ease-in-out infinite alternate;
        }
        @keyframes ithBgKenburns {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        .ith-poster1-overlay {
          position: fixed;
          inset: 0;
          background: rgba(20, 14, 6, 0.65);
          z-index: 1;
        }

        /* ============================================
           POSITIONS
           ============================================ */
        .ith-pos-center {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .ith-pos-top-left {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          text-align: left;
          padding-top: 15vh;
          padding-left: 10vw;
          padding-right: 30vw;
        }
        .ith-pos-top-right {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          text-align: right;
          padding-top: 15vh;
          padding-right: 10vw;
          padding-left: 30vw;
        }
        .ith-pos-bottom-left {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          text-align: left;
          padding-left: 10vw;
          padding-right: 30vw;
        }
        .ith-pos-bottom-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          text-align: right;
          padding-right: 10vw;
          padding-left: 30vw;
        }
        .ith-pos-bottom-center {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .ith-pos-full-width {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
        }

        /* ============================================
           MAIN EXHIBITION VIEW
           ============================================ */
        .ith-exhibition-main {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 120px 40px 80px;
          gap: 60px;
        }

        .ith-exhibition-title { text-align: center; margin-bottom: 20px; }
        .ith-exhibition-title h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 300;
          color: #fafafa;
          margin-bottom: 12px;
        }
        .ith-exhibition-title p {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 3vw, 1.4rem);
          font-style: italic;
          color: ${gold};
        }

        .ith-exhibition-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
          max-width: 1200px;
          width: 100%;
          align-items: center;
        }

        .ith-poster-frame {
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
        }
        .ith-poster-frame:hover { transform: translateY(-8px); }
        .ith-poster-frame:hover .ith-poster-hint { opacity: 1; }
        .ith-poster-frame img {
          width: 100%;
          height: auto;
          display: block;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .ith-poster-hint {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7D8471;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .ith-display-case {
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          cursor: pointer;
          transition: all 0.4s ease;
          overflow: hidden;
        }
        .ith-display-case:hover {
          border-color: rgba(201,168,76,0.3);
        }
        .ith-display-case:hover .ith-case-image {
          transform: scale(1.02);
        }
        .ith-case-image {
          width: 100%;
          max-width: 280px;
          height: auto;
          object-fit: contain;
          margin-bottom: 20px;
          transition: transform 0.4s ease;
        }
        .ith-case-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #737373;
          margin-bottom: 8px;
        }
        .ith-case-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #fafafa;
          margin-bottom: 8px;
        }
        .ith-case-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-style: italic;
          color: ${gold};
        }

        /* ============================================
           WALKTHROUGH
           ============================================ */
        .ith-poster-walkthrough {
          min-height: 100vh;
          width: 100vw;
          transition: opacity 0.4s ease;
          overflow: hidden;
        }
        .ith-poster-walkthrough.fade-out { opacity: 0; }

        .ith-walkthrough-content {
          min-height: 100vh;
          width: 100%;
          position: relative;
          z-index: 2;
        }

        /* Full bleed images */
        .ith-full-bleed-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .ith-full-bleed-image.ith-title-width img {
          width: 100%;
          height: auto;
          min-width: 100%;
          object-fit: cover;
        }
        /* Centered PNG title card — no background, transparent */
        .ith-full-bleed-image.ith-title-centered {
          z-index: 2;
        }
        .ith-full-bleed-image.ith-title-centered img {
          max-width: 60%;
          max-height: 70vh;
          width: auto;
          height: auto;
          object-fit: contain;
        }
        @keyframes ithBreathe {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.03); opacity: 1; }
        }
        .ith-effect-breathe {
          animation: ithBreathe 5s ease-in-out infinite;
        }
        /* Full image (photographs etc) */
        .ith-full-bleed-image.ith-full-image img {
          max-width: 90%;
          max-height: 90vh;
          width: auto;
          height: auto;
          object-fit: contain;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .ith-image-caption {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          opacity: 0.6;
          text-align: center;
          white-space: nowrap;
        }

        /* Text content wrapper */
        .ith-text-content-wrapper {
          min-height: 100vh;
          width: 100%;
          padding: 80px 40px;
          position: relative;
          z-index: 2;
        }

        /* Section title */
        .ith-section-title-text {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1rem, 3vw, 1.3rem);
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          position: relative;
          z-index: 10;
        }

        /* Paragraph */
        .ith-paragraph-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 3vw, 1.6rem);
          font-weight: 400;
          line-height: 1.8;
          max-width: 600px;
          position: relative;
          z-index: 10;
        }

        /* Quote */
        .ith-quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.3rem, 3.5vw, 1.8rem);
          font-style: italic;
          font-weight: 300;
          line-height: 1.7;
          max-width: 700px;
          padding: 40px;
          border-left: 3px solid;
          position: relative;
          z-index: 10;
        }

        /* Timeline */
        .ith-timeline {
          position: relative;
          z-index: 10;
          max-width: 640px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .ith-timeline-item {
          display: flex;
          gap: 20px;
          padding: 20px 0;
          border-left: 2px solid rgba(201,168,76,0.2);
          padding-left: 24px;
          position: relative;
        }
        .ith-timeline-item::before {
          content: '';
          position: absolute;
          left: -5px;
          top: 26px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${gold};
        }
        .ith-timeline-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 2.5vw, 1.3rem);
          line-height: 1.7;
          color: #F0ECD8;
        }

        /* End button */
        .ith-content-end {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 16px 32px;
          border: 1px solid;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .ith-content-end:hover {
          background: ${gold};
          color: #0a0a0a;
          border-color: ${gold};
        }

        /* ============================================
           IMAGE-TEXT STACKED — Image above, text below
           ============================================ */
        .ith-image-text-stacked {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          gap: 40px;
          position: relative;
          z-index: 2;
        }
        .ith-stacked-image {
          max-width: 45%;
          display: flex;
          justify-content: center;
        }
        .ith-stacked-image img {
          max-width: 100%;
          max-height: 40vh;
          width: auto;
          height: auto;
          object-fit: contain;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          animation: ithFadeIn 1s ease forwards;
        }

        /* ============================================
           ARTWORK DISPLAY — Full image + info alongside
           ============================================ */
        .ith-artwork-display {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          gap: 60px;
          position: relative;
        }
        .ith-artwork-reversed {
          flex-direction: row-reverse;
        }
        .ith-artwork-image-side {
          flex: 0 1 auto;
          max-width: 35%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ith-artwork-image-side img {
          max-height: 50vh;
          width: auto;
          max-width: 100%;
          object-fit: contain;
          box-shadow: 0 16px 48px rgba(0,0,0,0.4);
          animation: ithArtworkReveal 1.2s ease forwards;
        }
        @keyframes ithArtworkReveal {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .ith-artwork-info-side {
          flex: 1;
          max-width: 400px;
          position: relative;
          z-index: 10;
          animation: ithFadeIn 1s ease forwards 0.4s;
          opacity: 0;
        }
        .ith-artwork-info-side h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 300;
          font-style: italic;
          margin-bottom: 8px;
        }
        .ith-artwork-info-side .ith-artwork-meta {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 24px;
          opacity: 0.7;
        }
        .ith-artwork-info-side .ith-artwork-desc {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          line-height: 1.8;
          opacity: 0.9;
        }

        /* ============================================
           WALKTHROUGH NAVIGATION
           ============================================ */
        .ith-walkthrough-nav {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 24px;
          z-index: 100;
        }

        .ith-nav-arrow-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.3s ease;
        }
        .ith-nav-arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .ith-nav-arrow-btn:not(:disabled):hover {
          transform: scale(1.1);
          background: rgba(201,168,76,0.2);
        }

        .ith-step-indicator {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          min-width: 50px;
          text-align: center;
        }

        /* ============================================
           RESPONSIVE
           ============================================ */
        @media (max-width: 900px) {
          .ith-exhibition-grid { grid-template-columns: 1fr; gap: 32px; }
          .ith-entry-cards { grid-template-columns: 1fr; gap: 20px; }
          .ith-pos-top-left, .ith-pos-top-right { padding: 15vh 24px 15vh 24px; }
          .ith-pos-bottom-left, .ith-pos-bottom-right, .ith-pos-bottom-center {
            padding-left: 24px;
            padding-right: 24px;
          }
          .ith-artwork-display {
            flex-direction: column;
            padding: 60px 24px;
            gap: 32px;
          }
          .ith-artwork-image-side {
            max-width: 100%;
          }
          .ith-artwork-image-side img {
            max-height: 50vh;
          }
          .ith-artwork-info-side {
            max-width: 100%;
            text-align: center;
          }
        }
        @media (max-width: 768px) {
          .ith-nav-left { left: 20px; top: 20px; }
          .ith-nav-right { right: 20px; top: 20px; }
          .ith-nav-text { font-size: 24px; }
          .ith-exhibition-main { padding: 100px 24px 60px; }
          .ith-walkthrough-nav { bottom: 20px; gap: 16px; }
          .ith-nav-arrow-btn { width: 40px; height: 40px; font-size: 16px; }
          .ith-text-content-wrapper { padding: 100px 24px; }
        }
      `}</style>

      {/* ============================================
          NAVIGATION
          ============================================ */}
      <div
        className="ith-nav ith-nav-left"
        onClick={activeView === 'main' ? handleBack : returnToMain}
      >
        <span className="ith-nav-text" style={{ color: '#525252' }}>M</span>
        <span className="ith-nav-arrow ith-nav-arrow-left" style={{ color: '#7D8471' }}>&#8592;</span>
        <span className="ith-nav-label" style={{ color: '#7D8471' }}>
          {activeView === 'main' ? 'First Floor' : 'Exhibition'}
        </span>
      </div>

      <div className="ith-nav ith-nav-right" onClick={() => router.push('/exhibitions/in-their-hands/resources')}>
        <span className="ith-nav-label" style={{ color: '#7D8471' }}>Resources</span>
        <span className="ith-nav-arrow ith-nav-arrow-right" style={{ color: '#7D8471' }}>&#8594;</span>
        <span className="ith-nav-text" style={{ color: '#525252' }}>M</span>
      </div>

      {/* ============================================
          MAIN EXHIBITION VIEW
          ============================================ */}
      {activeView === 'main' && (
        <div className="ith-exhibition-main">
          <div className="ith-exhibition-title">
            <h1>In Their Hands</h1>
            <p>New Testament Coins of the Passion</p>
          </div>

          <div className="ith-exhibition-grid">
            <div className="ith-poster-frame" onClick={() => openPoster('poster1')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/exhibitions/in-their-hands/poster1-hero.jpg" alt="Faith and Reason" />
              <span className="ith-poster-hint">Click to explore</span>
            </div>

            <div className="ith-display-case" onClick={() => router.push('/exhibitions/in-their-hands/artifacts')}>
              <p className="ith-case-label">Gallery III, Case 1</p>
              <p className="ith-case-title">Coins of the Passion</p>
              <p className="ith-case-subtitle">Collection &middot; Holy Family Catholic School</p>
            </div>

            <div className="ith-poster-frame" onClick={() => openPoster('poster2')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/exhibitions/in-their-hands/poster2-hero.jpg" alt="The Weight of Thirty Pieces" />
              <span className="ith-poster-hint">Click to explore</span>
            </div>
          </div>

        </div>
      )}

      {/* ============================================
          POSTER WALKTHROUGH VIEW
          ============================================ */}
      {(activeView === 'poster1' || activeView === 'poster2') && (
        <div className={`ith-poster-walkthrough ${fadeIn ? '' : 'fade-out'}`} key={animationKey}>

          {/* Poster 1 persistent background — Tissot Jerusalem watercolour */}
          {isPoster1 && currentItem.type !== 'full-image' && (
            <>
              <div className="ith-poster1-bg" />
              {currentItem.special !== 'poster1-title' && <div className="ith-poster1-overlay" />}
            </>
          )}

          <div className="ith-walkthrough-content">

            {/* Title Image — Full Bleed or Centered PNG */}
            {currentItem.type === 'title-image' && currentItem.special === 'poster1-title' && (
              <div className="ith-full-bleed-image ith-title-centered">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentItem.src} alt={currentItem.alt} className="ith-effect-breathe" />
              </div>
            )}
            {currentItem.type === 'title-image' && currentItem.special !== 'poster1-title' && (
              <div className={`ith-full-bleed-image ith-title-width ${currentItem.effect ? `ith-effect-${currentItem.effect}` : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentItem.src} alt={currentItem.alt} />
              </div>
            )}

            {/* Full Image (photograph etc) */}
            {currentItem.type === 'full-image' && (
              <div className={`ith-full-bleed-image ith-full-image ${currentItem.effect === 'kenburns-in' ? 'ith-effect-kenburns-in' : currentItem.effect === 'drift' ? 'ith-effect-drift' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentItem.src} alt={currentItem.alt} />
                {currentItem.text && (
                  <span className="ith-image-caption" style={{ color: textColor }}>{currentItem.text}</span>
                )}
              </div>
            )}

            {/* Section Title */}
            {currentItem.type === 'section-title' && (
              <div className={`ith-text-content-wrapper ${getPositionClass(currentItem.position)} ${getSpecialClass(currentItem.special)}`}>
                <h2
                  className={`ith-section-title-text ${getEffectClass(currentItem.effect)}`}
                  style={{ color: getSectionColors(currentItem.special).title }}
                >
                  {currentItem.text}
                </h2>
              </div>
            )}

            {/* Paragraph */}
            {currentItem.type === 'paragraph' && currentItem.text && (
              <div className={`ith-text-content-wrapper ${getPositionClass(currentItem.position)} ${getSpecialClass(currentItem.special)}`}>
                <p
                  className={`ith-paragraph-text ${getEffectClass(currentItem.effect)}`}
                  style={{ color: getSectionColors(currentItem.special).text }}
                >
                  {currentItem.text}
                </p>
              </div>
            )}

            {/* Image above text — stacked vertically */}
            {currentItem.type === 'image-text-stacked' && (
              <div className={`ith-image-text-stacked ${getSpecialClass(currentItem.special)}`}>
                <div className="ith-stacked-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentItem.src} alt={currentItem.alt} />
                </div>
                <p
                  className="ith-paragraph-text ith-effect-fade-in"
                  style={{ color: getSectionColors(currentItem.special).text, textAlign: 'center' }}
                >
                  {currentItem.text}
                </p>
              </div>
            )}

            {/* Text above image — stacked vertically */}
            {currentItem.type === 'text-image-stacked' && (
              <div className={`ith-image-text-stacked ${getSpecialClass(currentItem.special)}`}>
                <p
                  className="ith-paragraph-text ith-effect-fade-in"
                  style={{ color: getSectionColors(currentItem.special).text, textAlign: 'center' }}
                >
                  {currentItem.text}
                </p>
                <div className="ith-stacked-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentItem.src} alt={currentItem.alt} />
                </div>
              </div>
            )}

            {/* Artwork Display — Full image with info alongside */}
            {currentItem.type === 'artwork-display' && (
              <div className={`ith-artwork-display ${currentItem.position === 'right' ? 'ith-artwork-reversed' : ''} ${getSpecialClass(currentItem.special)}`}>
                <div className="ith-artwork-image-side">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentItem.src} alt={currentItem.alt} />
                </div>
                <div className="ith-artwork-info-side" style={{ color: textColor }}>
                  <h3>{currentItem.artworkTitle}</h3>
                  <p className="ith-artwork-meta">
                    {currentItem.artworkArtist}, {currentItem.artworkDate}
                  </p>
                  <p className="ith-artwork-desc">
                    {currentItem.artworkDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Timeline */}
            {currentItem.type === 'timeline' && currentItem.items && (
              <div className={`ith-text-content-wrapper ith-pos-center ${getSpecialClass(currentItem.special)}`}>
                <div className="ith-timeline">
                  {currentItem.items.map((item, i) => (
                    <div
                      key={i}
                      className="ith-timeline-item"
                      style={{ animation: `ithFadeIn 0.6s ease forwards ${i * 0.15}s`, opacity: 0 }}
                    >
                      <span className="ith-timeline-text">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quote */}
            {currentItem.type === 'quote' && currentItem.text && (
              <div className="ith-text-content-wrapper ith-pos-center">
                <blockquote
                  className={`ith-quote-text ${getEffectClass(currentItem.effect)}`}
                  style={{ color: isPoster1 ? poster1Gold : poster2Antique, borderColor: isPoster1 ? 'rgba(201,168,76,0.4)' : 'rgba(200,196,160,0.3)' }}
                >
                  {currentItem.text}
                </blockquote>
              </div>
            )}

            {/* End */}
            {currentItem.type === 'end' && (
              <div className="ith-text-content-wrapper ith-pos-center">
                <button
                  className="ith-content-end"
                  onClick={returnToMain}
                  style={{ color: textColor, borderColor: textColor }}
                >
                  {currentItem.text}
                </button>
              </div>
            )}
          </div>

          {/* Walkthrough Navigation */}
          {currentItem.type !== 'end' && (
            <div className="ith-walkthrough-nav">
              <button
                className="ith-nav-arrow-btn"
                onClick={prevStep}
                disabled={posterStep === 0}
                style={{ color: textColor, borderColor: textColor }}
              >
                &#8592;
              </button>
              <span className="ith-step-indicator" style={{ color: textColor }}>
                {posterStep + 1} / {currentPosterContent.length}
              </span>
              <button
                className="ith-nav-arrow-btn"
                onClick={nextStep}
                disabled={posterStep === currentPosterContent.length - 1}
                style={{ color: textColor, borderColor: textColor }}
              >
                &#8594;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
