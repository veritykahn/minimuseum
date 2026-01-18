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
};

// Poster 1 content - Seeing is Deceiving
const poster1Content: ContentItem[] = [
  {
    type: 'title-image',
    src: '/exhibitions/seeing/poster1-title.jpg',
    alt: 'Seeing is Deceiving',
    effect: 'kenburns-in'
  },
  {
    type: 'section-title',
    text: 'The Science of How We See',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'paragraph',
    text: 'Right now, you believe you\'re seeing the world exactly as it is. But you\'re not. Your eyes are simply sensors that gather light – it is your brain that does all the interpreting and it takes remarkable shortcuts.',
    position: 'top-left',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'Every second, 11 million bits of sensory information flood into your brain. You consciously process only about 40 bits. Which means your brain discards 99.999% of visual information and constructs what it thinks you need to see.',
    position: 'bottom-right',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'So reality is not quite as you see it.',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'paragraph',
    text: 'To handle this impossible task, your brain doesn\'t record reality like a camera – it predicts reality. Based on past experience, it fills in gaps, smooths over inconsistencies, and makes thousands of assumptions.',
    position: 'top-right',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'You can read tihs senetnce even wehn the leettrs are srcambled because your brain predicts what should be there.',
    position: 'center',
    effect: 'typewriter'
  },
  {
    type: 'paragraph',
    text: 'This prediction system keeps you alive—you can catch a ball, spot danger, recognize faces. But it also means you see what you expect to see, not necessarily what\'s actually there.',
    position: 'bottom-left',
    effect: 'fade-in'
  },
  {
    type: 'blind-spot',
    text: 'Your eyes have a blind spot where the optic nerve connects to your retina—a patch in each eye where you literally cannot see. Right now, you have two holes in your vision. You\'ve never noticed because your brain seamlessly fills them in, inventing information to complete the picture.',
    position: 'center',
    effect: 'blind-spot-reveal'
  },
  {
    type: 'paragraph',
    text: 'If your brain lies to you about something this basic, what else is it hiding?',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'section-title',
    text: 'The First Motion Pictures (1820s–1830s)',
    position: 'full-width',
    effect: 'split-reveal'
  },
  {
    type: 'paragraph',
    text: 'Inventors discovered something strange: show the eye rapid sequences of still images and the brain sees continuous motion that doesn\'t exist. The thaumatrope (1825) was a disk with different images on each side—spin it and a bird appears inside a cage. The zoetrope (1834) showed sequential drawings through slits—spin it and horses gallop, people dance.',
    position: 'top-left',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'Nothing actually moves. Your brain creates the motion. Movies are still pictures shown fast. Every screen you look at exploits this biological quirk discovered 200 years ago.',
    position: 'bottom-right',
    effect: 'fade-in'
  },
  {
    type: 'section-title',
    text: 'The Stereoscope: Inventing Depth',
    position: 'full-width',
    effect: 'split-reveal'
  },
  {
    type: 'paragraph',
    text: 'In the 1830s, physicist Charles Wheatstone discovered that your two eyes see slightly different images, and your brain calculates depth from those differences. He built the first stereoscope—showing each eye a different flat picture. Your brain combines them and suddenly you perceive three dimensions that don\'t exist.',
    position: 'top-right',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'By the late 1800s, Victorians used stereoscopes to "travel" to Egypt or Niagara Falls without leaving home. The same principle powers modern 3D movies and VR headsets. The technology evolved. Your brain didn\'t.',
    position: 'bottom-left',
    effect: 'fade-in'
  },
  {
    type: 'full-image',
    src: '/exhibitions/seeing/face.jpg',
    alt: 'Abstract face illustration',
    effect: 'mega-zoom-out'
  },
  {
    type: 'section-title',
    text: 'Color Illusions: Context Changes Everything',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'paragraph',
    text: 'Your brain doesn\'t show you "true" color—it interprets based on context. In the checkerboard shadow illusion, two squares appear completely different shades. Measure the actual light and they\'re identical. Your brain "corrects" for the shadow, and you cannot see them as the same color even when you know they are.',
    position: 'top-left',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'Remember the dress that broke the internet in 2015—blue and black or white and gold? Your brain\'s assumptions about lighting changed the actual colors you perceived. Two identical things can look completely different depending on what surrounds them.',
    position: 'bottom-right',
    effect: 'fade-in'
  },
  {
    type: 'section-title',
    text: 'One Picture, Two Realities',
    position: 'full-width',
    effect: 'split-reveal'
  },
  {
    type: 'paragraph',
    text: 'Some illusions show your brain\'s pattern-finding obsession. The old woman/young woman illusion (1888) uses the same lines to create two completely different faces. The rabbit/duck illusion (1892) can be seen as either animal but never both simultaneously. The Rubin vase (1915): white vase or two black faces?',
    position: 'top-right',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'Your brain organizes visual information into familiar patterns, sometimes finding multiple interpretations of the same image. What you "see" depends on which pattern your brain emphasizes.',
    position: 'bottom-left',
    effect: 'fade-in'
  },
  {
    type: 'section-title',
    text: 'Motion That Isn\'t There',
    position: 'full-width',
    effect: 'split-reveal'
  },
  {
    type: 'paragraph',
    text: 'Some static images appear to move. The peripheral drift illusion uses high-contrast patterns—stare at the center and edges seem to rotate, though nothing moves. The Rotating Snakes illusion (2003) shows circles that appear to spin when you glance around the image. Your brain is so committed to detecting motion that it sometimes sees movement that isn\'t there.',
    position: 'center',
    effect: 'fade-in'
  },
  {
    type: 'section-title',
    text: 'Impossible Objects',
    position: 'full-width',
    effect: 'split-reveal'
  },
  {
    type: 'paragraph',
    text: 'The Penrose triangle (1934) and M.C. Escher\'s impossible staircases (1960) show objects that cannot exist in three-dimensional space. Your brain tries to make sense of them and fails, creating that unsettling feeling when you see something impossible.',
    position: 'center',
    effect: 'fade-in'
  },
  {
    type: 'section-title',
    text: 'Why Your Eyes Aren\'t Trustworthy',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'paragraph',
    text: 'You don\'t see reality—you see your brain\'s interpretation based on prediction, context, pattern recognition, and efficiency shortcuts. Your brain takes these shortcuts to help you survive: you can catch balls, spot danger, recognize faces. But you can also be fooled by colors that aren\'t what they appear, motion that doesn\'t exist, depth that isn\'t there, and details your brain invents to fill gaps.',
    position: 'center',
    effect: 'fade-in'
  },
  { type: 'end', text: 'Return to Exhibition' }
];

// Poster 2 content - A History of Lies
const poster2Content = [
  {
    type: 'title-image',
    src: '/exhibitions/seeing/poster2-title.jpg',
    alt: 'A History of Lies: From Magic Lanterns to AI Deepfakes',
    effect: 'drift'
  },
  {
    type: 'section-title',
    text: 'The First Visual Deceptions (1600s–1800s)',
    position: 'full-width',
    effect: 'split-reveal'
  },
  {
    type: 'paragraph',
    text: 'Long before photography, humans created visual trickery. In the 1600s, camera obscura devices projected upside-down images onto walls in darkened rooms. People who didn\'t understand the optics believed they were seeing magic.',
    position: 'top-left',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'By the 1700s, traveling showmen used magic lanterns—early projectors casting painted images onto screens. In darkened rooms, they created moving ghosts and demons that terrified audiences who\'d never seen projected light.',
    position: 'bottom-right',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'The lesson: new technology creates windows for deception. When people don\'t understand how something works, realistic results are accepted as truth.',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'section-title',
    text: 'Spirit Photography: When Cameras Lied (1860s–1920s)',
    position: 'full-width',
    effect: 'split-reveal',
    special: 'static-overlay'
  },
  {
    type: 'paragraph',
    text: 'In 1861, photographer William Mumler accidentally created the first spirit photograph using double exposure—exposing the same plate twice. A ghostly figure appeared beside him. Grieving families paid fortunes for photographs of dead relatives, not understanding how cameras could be manipulated.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'static-overlay'
  },
  {
    type: 'paragraph',
    text: 'For sixty years, spirit photography boomed. Photographers used simple tricks—double exposures, hanging cloth, accomplices in sheets—to create "proof" of the afterlife. Why did it work? Photography was new, the images looked real, people wanted to believe, and "seeing is believing" was still reliable.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'static-overlay'
  },
  {
    type: 'paragraph',
    text: 'By the 1920s, magicians like Houdini exposed the tricks, but for decades fake photographs had influenced beliefs and extracted money from grieving families.',
    position: 'center',
    effect: 'fade-in',
    special: 'static-overlay'
  },
  {
    type: 'section-title',
    text: 'Hollywood Magic: Manufacturing Reality (1920s–1980s)',
    position: 'full-width',
    effect: 'film-credits'
  },
  {
    type: 'paragraph',
    text: 'Film brought new illusions. Miniatures made tiny models look massive—King Kong (1933) was an 18-inch puppet. Matte paintings created castles and cities that didn\'t exist. Stop-motion brought creatures to life frame by frame. Rear projection put actors in exotic locations while they stood in studios.',
    position: 'top-right',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'Everyone knew movies were fiction, but your brain believed them anyway. You knew the monster wasn\'t real, but your heart still raced.',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'section-title',
    text: 'Photoshop: Everyone Can Fake (1990s–2000s)',
    position: 'full-width',
    effect: 'split-reveal',
    special: 'rgb-split'
  },
  {
    type: 'paragraph',
    text: 'In 1990, Photoshop made photo editing accessible to anyone with a computer. Suddenly you could remove people from photographs, add things that were never there, alter faces and bodies, combine multiple images. Magazine covers showed impossible perfection. News photos were altered to remove inconvenient politicians.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'rgb-split'
  },
  {
    type: 'paragraph',
    text: 'The manipulation was often detectable if you looked closely—inconsistent lighting, weird shadows, wrong proportions. But most people weren\'t looking closely. They were scrolling fast, trusting their eyes. A new assumption emerged: every photograph might be fake.',
    position: 'bottom-right',
    effect: 'fade-in'
  },
  {
    type: 'full-image',
    src: '/exhibitions/seeing/waves.jpg',
    alt: 'Optical illusion waves',
    effect: 'waves-drift'
  },
  {
    type: 'section-title',
    text: 'Deepfakes: AI Creates Reality (2017–Present)',
    position: 'center',
    effect: 'glitch'
  },
  {
    type: 'paragraph',
    text: 'In 2017, AI could generate photorealistic images of people who don\'t exist. By 2018, AI created convincing videos of real people saying things they never said. By 2020, these "deepfakes" were indistinguishable from authentic footage.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'glitch-subtle'
  },
  {
    type: 'paragraph',
    text: 'You can create deepfakes with free software, a decent computer, and hours of source footage. No expertise required. The technology also enables voice cloning from seconds of audio, AI-generated photographs of events that never happened, and face-swapping in real-time video.',
    position: 'bottom-right',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'We\'re now in a world where seeing something happen is no longer reliable evidence that it happened.',
    position: 'center',
    effect: 'glitch'
  },
  {
    type: 'section-title',
    text: 'The Pattern Across 400 Years',
    position: 'full-width',
    effect: 'split-reveal'
  },
  {
    type: 'timeline',
    items: [
      '1600s: Magic lanterns deceive people who\'ve never seen projected light.',
      '1860s: Spirit photography deceives people who don\'t understand cameras.',
      '1930s: Film creates convincing fictional realities.',
      '1990s: Photoshop makes manipulation accessible to everyone.',
      '2020s: AI generates realistic content of things that never existed.'
    ],
    position: 'center',
    effect: 'line-by-line'
  },
  {
    type: 'paragraph',
    text: 'The tools change. Human psychology doesn\'t. Every advance creates a window where realistic results are accepted as truth until people learn to recognize the tricks.',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'section-title',
    text: 'How Deception Has Been Used',
    position: 'full-width',
    effect: 'split-reveal'
  },
  {
    type: 'paragraph',
    text: 'Visual manipulation has been weaponized to exploit grief, sell products, create false evidence, spread propaganda, manipulate politics, influence markets, destroy reputations, and evade accountability. The motivation hasn\'t changed in 400 years: profit, power, politics, personal gain.',
    position: 'center',
    effect: 'fade-in'
  },
  {
    type: 'section-title',
    text: 'How to Verify What You See',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'paragraph',
    text: 'Question the source: Who created this? Why? Who benefits? If you can\'t answer, you don\'t have enough information.',
    position: 'top-left',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'Look for technical tells: Unnatural blinking, mismatched lighting, audio sync issues, weird artifacts, strangely smooth skin textures.',
    position: 'top-right',
    effect: 'fade-in'
  },
  {
    type: 'paragraph',
    text: 'Recognize confirmation bias: Content that confirms what you already believe is most dangerous. It feels true because you want it to be true. That\'s when you should be MOST skeptical.',
    position: 'bottom-center',
    effect: 'fade-in'
  },
  {
    type: 'quote',
    text: 'Spirit photography worked because people wanted proof their loved ones weren\'t gone. Deepfakes work because your brain treats seeing as evidence. This instinct served humanity for thousands of years—until we invented ways to show you things that never happened.',
    position: 'center',
    effect: 'blur-to-sharp'
  },
  {
    type: 'link',
    text: 'Explore More: Josef Albers — The Interaction of Color',
    url: 'https://artsandculture.google.com/story/josef-albers-the-interaction-of-color-bechtler-museum-of-modern-art/owVxXkSkjQuPJA'
  },
  { type: 'end', text: 'Return to Exhibition' }
];

// Typewriter component
const TypewriterText = ({ text, onComplete, color }: { text: string; onComplete?: () => void; color: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <span style={{ color }}>
      {displayedText}
      <span className="typewriter-cursor">|</span>
    </span>
  );
};

// Line by line component
const LineByLine = ({ items, color }: { items: string[]; color: string }) => {
  return (
    <div className="line-by-line-container">
      {items.map((item, i) => (
        <p
          key={i}
          className="line-fade"
          style={{
            animationDelay: `${i * 0.4}s`,
            color
          }}
        >
          {item}
        </p>
      ))}
    </div>
  );
};

export default function SeeingIsDeceiving() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'main' | 'poster1' | 'poster2' | 'artifacts'>('main');
  const [posterStep, setPosterStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  const currentPosterContent = activeView === 'poster1' ? poster1Content : poster2Content;

  const handleBack = () => {
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

  // Colors
  const wavesBlue = '#a8d5e5';
  const darkCharcoal = '#2a2a2a';
  const bgColor = isPoster1 ? '#e8e8e8' : '#0a0a0a';
  const textColor = isPoster1 ? darkCharcoal : wavesBlue;

  // Position classes
  const getPositionClass = (position?: string) => {
    switch(position) {
      case 'top-left': return 'pos-top-left';
      case 'top-right': return 'pos-top-right';
      case 'bottom-left': return 'pos-bottom-left';
      case 'bottom-right': return 'pos-bottom-right';
      case 'bottom-center': return 'pos-bottom-center';
      case 'full-width': return 'pos-full-width';
      default: return 'pos-center';
    }
  };

  // Effect classes
  const getEffectClass = (effect?: string) => {
    switch(effect) {
      case 'blur-to-sharp': return 'effect-blur-sharp';
      case 'split-reveal': return 'effect-split-reveal';
      case 'glitch': return 'effect-glitch';
      case 'film-credits': return 'effect-film-credits';
      default: return '';
    }
  };

  return (
    <div style={{ background: activeView === 'main' ? '#0a0a0a' : bgColor, minHeight: '100vh', transition: 'background 0.5s ease' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }

        /* Navigation */
        .nav-m {
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
        .nav-m-left { left: 32px; }
        .nav-m-right { right: 32px; }
        .nav-m:hover .nav-label { opacity: 1; max-width: 150px; }
        .nav-m:hover .nav-arrow-left { transform: translateX(-4px); }
        .nav-m:hover .nav-arrow-right { transform: translateX(4px); }
        .nav-m-text { font-size: 28px; font-weight: 300; transition: color 0.3s ease; }
        .nav-arrow { font-size: 16px; transition: all 0.3s ease; }
        .nav-label {
          font-size: 13px;
          font-style: italic;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.4s ease;
        }

        /* Typewriter cursor */
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .typewriter-cursor {
          animation: blink 0.8s infinite;
          margin-left: 2px;
        }

        /* Simple paragraph fade-in */
        @keyframes paragraphFade {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .effect-fade-in {
          animation: paragraphFade 0.8s ease forwards;
        }

        /* Line by line fade */
        @keyframes lineFade {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .line-fade {
          opacity: 0;
          animation: lineFade 0.6s ease forwards;
          margin-bottom: 16px;
        }
        .line-by-line-container {
          text-align: left;
        }

        /* Blur to sharp */
        @keyframes blurToSharp {
          from { filter: blur(12px); opacity: 0; }
          to { filter: blur(0); opacity: 1; }
        }
        .effect-blur-sharp {
          animation: blurToSharp 1.2s ease forwards;
        }

        /* Split reveal */
        @keyframes splitReveal {
          from {
            clip-path: inset(0 50% 0 50%);
            opacity: 0;
          }
          to {
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }
        .effect-split-reveal {
          animation: splitReveal 0.8s ease forwards;
        }

        /* Glitch effect */
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-3px, 3px); filter: hue-rotate(90deg); }
          40% { transform: translate(-3px, -3px); filter: hue-rotate(180deg); }
          60% { transform: translate(3px, 3px); filter: hue-rotate(270deg); }
          80% { transform: translate(3px, -3px); filter: hue-rotate(360deg); }
          100% { transform: translate(0); filter: hue-rotate(0); }
        }
        .effect-glitch {
          animation: glitch 0.4s ease forwards, blurToSharp 0.8s ease forwards;
        }

        /* Film credits slide */
        @keyframes filmCredits {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .effect-film-credits {
          animation: filmCredits 1s ease forwards;
        }

        /* Ken Burns zoom in */
        @keyframes kenburnIn {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .effect-kenburns-in {
          animation: kenburnIn 8s ease forwards;
        }

        /* Mega zoom out */
        @keyframes megaZoomOut {
          from { transform: scale(1.2); }
          to { transform: scale(1); }
        }
        .effect-mega-zoom-out {
          animation: megaZoomOut 2s ease forwards;
        }

        /* Waves drift */
        @keyframes wavesDrift {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        .effect-waves-drift {
          animation: wavesDrift 4s ease-in-out infinite;
        }

        /* Drift */
        @keyframes drift {
          0% { transform: translateX(0); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
        .effect-drift {
          animation: drift 6s ease-in-out infinite;
        }

        /* Static noise overlay */
        @keyframes staticNoise {
          0% { background-position: 0 0; }
          100% { background-position: 100% 100%; }
        }
        .static-overlay {
          position: relative;
        }
        .static-overlay::before {
          content: '';
          position: absolute;
          inset: -50%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.18;
          pointer-events: none;
          animation: staticNoise 0.2s steps(10) infinite;
          z-index: 1;
        }

        /* RGB split */
        .rgb-split {
          text-shadow:
            -2px 0 #ff0000,
            2px 0 #00ffff;
          animation: rgbPulse 2s ease infinite;
        }
        @keyframes rgbPulse {
          0%, 100% { text-shadow: -2px 0 #ff000033, 2px 0 #00ffff33; }
          50% { text-shadow: -3px 0 #ff000066, 3px 0 #00ffff66; }
        }

        /* Blind spot effect */
        .blind-spot-container {
          position: relative;
        }
        .blind-spot-hole {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,232,232,1) 0%, rgba(232,232,232,0) 70%);
          pointer-events: none;
          animation: blindSpotFill 3s ease forwards 1s;
          z-index: 10;
        }
        @keyframes blindSpotFill {
          to { opacity: 0; }
        }

        /* Positions */
        .pos-center {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .pos-top-left {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          text-align: left;
          padding-top: 15vh;
          padding-left: 10vw;
          padding-right: 30vw;
        }
        .pos-top-right {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          text-align: right;
          padding-top: 15vh;
          padding-right: 10vw;
          padding-left: 30vw;
        }
        .pos-bottom-left {
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          text-align: left;
          padding-bottom: 180px;
          padding-left: 10vw;
          padding-right: 30vw;
        }
        .pos-bottom-right {
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          text-align: right;
          padding-bottom: 180px;
          padding-right: 10vw;
          padding-left: 30vw;
        }
        .pos-bottom-center {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          text-align: center;
          padding-bottom: 180px;
        }
        .pos-full-width {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
        }

        /* Main Exhibition View */
        .exhibition-main {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 120px 40px 80px;
          gap: 60px;
        }

        .exhibition-title {
          text-align: center;
          margin-bottom: 20px;
        }

        .exhibition-title h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 300;
          color: #fafafa;
          margin-bottom: 12px;
        }

        .exhibition-title p {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 3vw, 1.4rem);
          font-style: italic;
          color: #a8d5e5;
        }

        .exhibition-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
          max-width: 1200px;
          width: 100%;
          align-items: start;
        }

        @media (max-width: 900px) {
          .exhibition-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .pos-top-left, .pos-top-right, .pos-bottom-left, .pos-bottom-right {
            padding: 15vh 24px 15vh 24px;
          }
        }

        .poster-frame {
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
        }
        .poster-frame:hover {
          transform: translateY(-8px);
        }
        .poster-frame:hover .poster-hint {
          opacity: 1;
        }

        .poster-frame img {
          width: 100%;
          height: auto;
          display: block;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        .poster-hint {
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

        .display-case {
          background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.1);
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          cursor: pointer;
          transition: all 0.4s ease;
        }
        .display-case:hover {
          border-color: rgba(168, 213, 229, 0.3);
          background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
        }

        .case-placeholder {
          width: 120px;
          height: 120px;
          border: 1px dashed rgba(168, 213, 229, 0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .case-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #737373;
          margin-bottom: 8px;
        }

        .case-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #fafafa;
          margin-bottom: 16px;
        }

        .case-status {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #a8d5e5;
        }

        /* Walkthrough */
        .poster-walkthrough {
          min-height: 100vh;
          width: 100vw;
          transition: opacity 0.4s ease;
          overflow: hidden;
        }

        .poster-walkthrough.fade-out {
          opacity: 0;
        }

        .walkthrough-content {
          min-height: 100vh;
          width: 100%;
          position: relative;
        }

        /* Full bleed images */
        .full-bleed-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .full-bleed-image img {
          min-width: 100%;
          min-height: 100%;
          object-fit: cover;
        }

        .full-bleed-image.title-image img {
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
          min-width: auto;
          min-height: auto;
          object-fit: contain;
        }

        .full-bleed-image.face-image img {
          min-width: 120%;
          min-height: 120%;
        }

        /* Text content wrapper */
        .text-content-wrapper {
          min-height: 100vh;
          width: 100%;
          padding: 80px 40px;
        }

        /* Section title */
        .section-title-text {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1rem, 3vw, 1.3rem);
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* Paragraph */
        .paragraph-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 3vw, 1.6rem);
          font-weight: 400;
          line-height: 1.8;
          max-width: 600px;
        }

        /* Quote */
        .quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.3rem, 3.5vw, 1.8rem);
          font-style: italic;
          font-weight: 300;
          line-height: 1.7;
          max-width: 700px;
          padding: 40px;
          border-left: 3px solid;
        }

        /* Link */
        .content-link {
          display: inline-block;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 16px 32px;
          border: 1px solid;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .content-link:hover {
          background: #a8d5e5;
          color: #0a0a0a;
          border-color: #a8d5e5;
        }

        /* End button */
        .content-end {
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
        .content-end:hover {
          background: #a8d5e5;
          color: #0a0a0a;
          border-color: #a8d5e5;
        }

        /* Navigation arrows */
        .walkthrough-nav {
          position: fixed;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 40px;
          z-index: 100;
        }

        .nav-arrow-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .nav-arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .nav-arrow-btn:not(:disabled):hover {
          transform: scale(1.1);
          background: rgba(168, 213, 229, 0.2);
        }

        .step-indicator {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
        }

        /* Download button */
        .download-btn {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .download-btn:hover {
          background: rgba(0,0,0,0.8);
          border-color: rgba(255,255,255,0.4);
        }

        @media (max-width: 768px) {
          .nav-m-left { left: 20px; top: 20px; }
          .nav-m-right { right: 20px; top: 20px; }
          .nav-m-text { font-size: 24px; }
          .exhibition-main { padding: 100px 24px 60px; }
          .walkthrough-nav { bottom: 40px; gap: 24px; }
          .nav-arrow-btn { width: 44px; height: 44px; font-size: 18px; }
          .download-btn { bottom: 20px; right: 20px; padding: 10px 16px; font-size: 10px; }
          .text-content-wrapper { padding: 100px 24px; }
        }
      `}</style>

      {/* Navigation */}
      <div
        className="nav-m nav-m-left"
        onClick={activeView === 'main' ? handleBack : returnToMain}
      >
        <span className="nav-m-text" style={{ color: isPoster1 ? '#525252' : '#525252' }}>M</span>
        <span className="nav-arrow nav-arrow-left" style={{ color: '#7D8471' }}>←</span>
        <span className="nav-label" style={{ color: '#7D8471' }}>
          {activeView === 'main' ? 'First Floor' : 'Exhibition'}
        </span>
      </div>

      <div className="nav-m nav-m-right">
        <span className="nav-label" style={{ color: '#7D8471' }}>Resources</span>
        <span className="nav-arrow nav-arrow-right" style={{ color: '#7D8471' }}>→</span>
        <span className="nav-m-text" style={{ color: isPoster1 ? '#525252' : '#525252' }}>M</span>
      </div>

      {/* Main Exhibition View */}
      {activeView === 'main' && (
        <div className="exhibition-main">
          <div className="exhibition-title">
            <h1>Seeing is Deceiving</h1>
            <p>The Science of How We See</p>
          </div>

          <div className="exhibition-grid">
            <div className="poster-frame" onClick={() => openPoster('poster1')}>
              <img src="/exhibitions/seeing/poster1.jpg" alt="Seeing is Deceiving poster" />
              <span className="poster-hint">Click to explore</span>
            </div>

            <div className="display-case" onClick={() => setActiveView('artifacts')}>
              <div className="case-placeholder">
                <span style={{ color: '#a8d5e5', fontSize: '12px', letterSpacing: '0.1em' }}>3D</span>
              </div>
              <p className="case-label">Artifacts</p>
              <p className="case-title">The Collection</p>
              <p className="case-status">Coming Soon</p>
            </div>

            <div className="poster-frame" onClick={() => openPoster('poster2')}>
              <img src="/exhibitions/seeing/poster2.jpg" alt="A History of Lies poster" />
              <span className="poster-hint">Click to explore</span>
            </div>
          </div>
        </div>
      )}

      {/* Poster Walkthrough View */}
      {(activeView === 'poster1' || activeView === 'poster2') && (
        <div className={`poster-walkthrough ${fadeIn ? '' : 'fade-out'}`} key={animationKey}>
          <div className="walkthrough-content">

            {/* Title Image - Full Bleed */}
            {currentItem.type === 'title-image' && (
              <div className={`full-bleed-image title-image ${currentItem.effect === 'kenburns-in' ? 'effect-kenburns-in' : ''} ${currentItem.effect === 'drift' ? 'effect-drift' : ''}`}>
                <img src={currentItem.src} alt={currentItem.alt} />
              </div>
            )}

            {/* Full Image - Mega Zoom */}
            {currentItem.type === 'full-image' && (
              <div className={`full-bleed-image ${currentItem.effect === 'mega-zoom-out' ? 'face-image' : ''}`}>
                <img
                  src={currentItem.src}
                  alt={currentItem.alt}
                  className={currentItem.effect === 'mega-zoom-out' ? 'effect-mega-zoom-out' : currentItem.effect === 'waves-drift' ? 'effect-waves-drift' : ''}
                />
              </div>
            )}

            {/* Section Title */}
            {currentItem.type === 'section-title' && (
              <div className={`text-content-wrapper ${getPositionClass(currentItem.position)} ${currentItem.special === 'static-overlay' ? 'static-overlay' : ''}`}>
                <h2
                  className={`section-title-text ${getEffectClass(currentItem.effect)} ${currentItem.special === 'rgb-split' ? 'rgb-split' : ''}`}
                  style={{ color: textColor }}
                >
                  {currentItem.text}
                </h2>
              </div>
            )}

            {/* Paragraph */}
            {currentItem.type === 'paragraph' && currentItem.text && (
              <div className={`text-content-wrapper ${getPositionClass(currentItem.position)} ${currentItem.special === 'static-overlay' ? 'static-overlay' : ''}`}>
                <p
                  className={`paragraph-text ${currentItem.special === 'rgb-split' ? 'rgb-split' : ''} ${currentItem.effect === 'fade-in' ? 'effect-fade-in' : ''} ${currentItem.effect === 'blur-to-sharp' ? 'effect-blur-sharp' : ''} ${currentItem.effect === 'glitch' ? 'effect-glitch' : ''}`}
                  style={{ color: textColor }}
                >
                  {currentItem.effect === 'typewriter' ? (
                    <TypewriterText text={currentItem.text} color={textColor} />
                  ) : (
                    currentItem.text
                  )}
                </p>
              </div>
            )}

            {/* Blind Spot */}
            {currentItem.type === 'blind-spot' && currentItem.text && (
              <div className={`text-content-wrapper ${getPositionClass(currentItem.position)} blind-spot-container`}>
                <div className="blind-spot-hole"></div>
                <p className="paragraph-text effect-fade-in" style={{ color: textColor }}>
                  {currentItem.text}
                </p>
              </div>
            )}

            {/* Timeline */}
            {currentItem.type === 'timeline' && currentItem.items && (
              <div className={`text-content-wrapper ${getPositionClass(currentItem.position)}`}>
                <LineByLine items={currentItem.items} color={textColor} />
              </div>
            )}

            {/* Quote */}
            {currentItem.type === 'quote' && currentItem.text && (
              <div className={`text-content-wrapper pos-center`}>
                <blockquote
                  className={`quote-text ${currentItem.effect === 'blur-to-sharp' ? 'effect-blur-sharp' : ''}`}
                  style={{ color: textColor, borderColor: textColor }}
                >
                  {currentItem.text}
                </blockquote>
              </div>
            )}

            {/* Link */}
            {currentItem.type === 'link' && (
              <div className="text-content-wrapper pos-center">
                <a
                  href={currentItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="content-link"
                  style={{ color: textColor, borderColor: textColor }}
                >
                  {currentItem.text}
                </a>
              </div>
            )}

            {/* End */}
            {currentItem.type === 'end' && (
              <div className="text-content-wrapper pos-center">
                <button
                  className="content-end"
                  onClick={returnToMain}
                  style={{ color: textColor, borderColor: textColor }}
                >
                  {currentItem.text}
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          {currentItem.type !== 'end' && (
            <div className="walkthrough-nav">
              <button
                className="nav-arrow-btn"
                onClick={prevStep}
                disabled={posterStep === 0}
                style={{ color: textColor, borderColor: textColor }}
              >
                ←
              </button>
              <span className="step-indicator" style={{ color: textColor }}>
                {posterStep + 1} / {currentPosterContent.length}
              </span>
              <button
                className="nav-arrow-btn"
                onClick={nextStep}
                disabled={posterStep === currentPosterContent.length - 1}
                style={{ color: textColor, borderColor: textColor }}
              >
                →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Artifacts View - Placeholder */}
      {activeView === 'artifacts' && (
        <div className="exhibition-main">
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'Outfit',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#737373',
              marginBottom: '24px'
            }}>
              3D Artifact Viewer
            </p>
            <h2 style={{
              fontFamily: 'Cormorant Garamond',
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 300,
              color: '#fafafa',
              marginBottom: '24px'
            }}>
              Coming Soon
            </h2>
            <p style={{
              fontFamily: 'Cormorant Garamond',
              fontSize: '18px',
              fontStyle: 'italic',
              color: '#737373',
              marginBottom: '48px',
              maxWidth: '500px'
            }}>
              The 1904 Monarch Stereoscope, Victorian optical illusion cards, and color perception demonstrations will be viewable in 3D.
            </p>
            <button
              onClick={returnToMain}
              style={{
                fontFamily: 'Outfit',
                fontSize: '12px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '16px 32px',
                background: 'transparent',
                border: '1px solid #525252',
                color: '#fafafa',
                cursor: 'pointer'
              }}
            >
              Return to Exhibition
            </button>
          </div>
        </div>
      )}

      {/* Download Resources Button */}
      {activeView === 'main' && (
        <button className="download-btn">
          <span>↓</span>
          <span>Resources</span>
        </button>
      )}
    </div>
  );
}
