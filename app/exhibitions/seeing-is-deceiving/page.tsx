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
    effect: 'split-reveal',
    special: 'vintage-film'
  },
  {
    type: 'paragraph',
    text: 'Inventors discovered something strange: show the eye rapid sequences of still images and the brain sees continuous motion that doesn\'t exist. The thaumatrope (1825) was a disk with different images on each side—spin it and a bird appears inside a cage. The zoetrope (1834) showed sequential drawings through slits—spin it and horses gallop, people dance.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'vintage-film'
  },
  {
    type: 'paragraph',
    text: 'Nothing actually moves. Your brain creates the motion. Movies are still pictures shown fast. Every screen you look at exploits this biological quirk discovered 200 years ago.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'vintage-film'
  },
  {
    type: 'section-title',
    text: 'The Stereoscope: Inventing Depth',
    position: 'full-width',
    effect: 'split-reveal',
    special: 'depth-parallax'
  },
  {
    type: 'paragraph',
    text: 'In the 1830s, physicist Charles Wheatstone discovered that your two eyes see slightly different images, and your brain calculates depth from those differences. He built the first stereoscope—showing each eye a different flat picture. Your brain combines them and suddenly you perceive three dimensions that don\'t exist.',
    position: 'top-right',
    effect: 'fade-in',
    special: 'depth-parallax'
  },
  {
    type: 'paragraph',
    text: 'By the late 1800s, Victorians used stereoscopes to "travel" to Egypt or Niagara Falls without leaving home. The same principle powers modern 3D movies and VR headsets. The technology evolved. Your brain didn\'t.',
    position: 'bottom-left',
    effect: 'fade-in',
    special: 'depth-parallax'
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
    effect: 'blur-to-sharp',
    special: 'color-shift'
  },
  {
    type: 'paragraph',
    text: 'Your brain doesn\'t show you "true" color—it interprets based on context. In the checkerboard shadow illusion, two squares appear completely different shades. Measure the actual light and they\'re identical. Your brain "corrects" for the shadow, and you cannot see them as the same color even when you know they are.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'color-shift'
  },
  {
    type: 'paragraph',
    text: 'Remember the dress that broke the internet in 2015—blue and black or white and gold? Your brain\'s assumptions about lighting changed the actual colors you perceived. Two identical things can look completely different depending on what surrounds them.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'color-shift'
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
    effect: 'split-reveal',
    special: 'peripheral-drift'
  },
  {
    type: 'paragraph',
    text: 'Some static images appear to move. The peripheral drift illusion uses high-contrast patterns—stare at the center and edges seem to rotate, though nothing moves. The Rotating Snakes illusion (2003) shows circles that appear to spin when you glance around the image. Your brain is so committed to detecting motion that it sometimes sees movement that isn\'t there.',
    position: 'center',
    effect: 'fade-in',
    special: 'peripheral-drift'
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
    effect: 'film-credits',
    special: 'vintage-film'
  },
  {
    type: 'paragraph',
    text: 'Film brought new illusions. Miniatures made tiny models look massive—King Kong (1933) was an 18-inch puppet. Matte paintings created castles and cities that didn\'t exist. Stop-motion brought creatures to life frame by frame. Rear projection put actors in exotic locations while they stood in studios.',
    position: 'top-right',
    effect: 'fade-in',
    special: 'vintage-film'
  },
  {
    type: 'paragraph',
    text: 'Everyone knew movies were fiction, but your brain believed them anyway. You knew the monster wasn\'t real, but your heart still raced.',
    position: 'center',
    effect: 'blur-to-sharp',
    special: 'vintage-film'
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
    effect: 'fade-in',
    special: 'rgb-split'
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
    effect: 'glitch',
    special: 'glitch-persistent'
  },
  {
    type: 'paragraph',
    text: 'In 2017, AI could generate photorealistic images of people who don\'t exist. By 2018, AI created convincing videos of real people saying things they never said. By 2020, these "deepfakes" were indistinguishable from authentic footage.',
    position: 'top-left',
    effect: 'fade-in',
    special: 'glitch-persistent'
  },
  {
    type: 'paragraph',
    text: 'You can create deepfakes with free software, a decent computer, and hours of source footage. No expertise required. The technology also enables voice cloning from seconds of audio, AI-generated photographs of events that never happened, and face-swapping in real-time video.',
    position: 'bottom-right',
    effect: 'fade-in',
    special: 'glitch-persistent'
  },
  {
    type: 'paragraph',
    text: 'We\'re now in a world where seeing something happen is no longer reliable evidence that it happened.',
    position: 'center',
    effect: 'glitch',
    special: 'glitch-persistent'
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

// Film dust/scratch component for old film effect
const FilmOverlay = () => {
  return (
    <div className="film-overlay">
      {/* Traveling vertical scratches */}
      <div className="film-scratch scratch-1"></div>
      <div className="film-scratch scratch-2"></div>
      <div className="film-scratch scratch-3"></div>
      {/* Random dust specks */}
      <div className="film-dust dust-1"></div>
      <div className="film-dust dust-2"></div>
      <div className="film-dust dust-3"></div>
      <div className="film-dust dust-4"></div>
      <div className="film-dust dust-5"></div>
      <div className="film-dust dust-6"></div>
      {/* Vignette */}
      <div className="film-vignette"></div>
      {/* Sepia tint */}
      <div className="film-sepia"></div>
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
  const bgColor = isPoster1 ? '#e0dede' : '#0a0a0a';
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
          from { opacity: 0; }
          to { opacity: 1; }
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
          from { clip-path: inset(0 50% 0 50%); opacity: 0; }
          to { clip-path: inset(0 0 0 0); opacity: 1; }
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
        @keyframes staticNoise {
          0% { background-position: 0 0; }
          100% { background-position: 100% 100%; }
        }

        /* RGB split */
        .rgb-split {
          text-shadow: -2px 0 #ff0000, 2px 0 #00ffff;
          animation: rgbPulse 2s ease infinite;
        }
        @keyframes rgbPulse {
          0%, 100% { text-shadow: -2px 0 #ff000033, 2px 0 #00ffff33; }
          50% { text-shadow: -3px 0 #ff000066, 3px 0 #00ffff66; }
        }

        /* Blind spot effect */
        .blind-spot-container { position: relative; }
        .blind-spot-hole {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(224,222,222,1) 0%, rgba(224,222,222,0.9) 40%, rgba(224,222,222,0) 70%);
          pointer-events: none;
          animation: blindSpotFill 3s ease forwards 1s;
          z-index: 10;
        }
        @keyframes blindSpotFill {
          to { opacity: 0; }
        }

        /* ============================================
           VINTAGE FILM EFFECT - with animated scratches and dust
           ============================================ */
        .vintage-film {
          position: relative;
          overflow: hidden;
        }
        
        .film-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 50;
        }
        
        /* Traveling vertical scratches */
        .film-scratch {
          position: absolute;
          top: -100%;
          width: 2px;
          height: 200%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255,255,255,0.3) 20%,
            rgba(255,255,255,0.5) 50%,
            rgba(255,255,255,0.3) 80%,
            transparent 100%
          );
          animation: scratchMove 0.8s linear infinite;
        }
        .scratch-1 { left: 15%; animation-delay: 0s; animation-duration: 0.6s; }
        .scratch-2 { left: 45%; animation-delay: 0.2s; animation-duration: 0.5s; opacity: 0.7; }
        .scratch-3 { left: 78%; animation-delay: 0.4s; animation-duration: 0.7s; opacity: 0.5; }
        
        @keyframes scratchMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50%); }
        }
        
        /* Random dust specks that appear and disappear */
        .film-dust {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255,255,255,0.8);
          border-radius: 50%;
          animation: dustFlash 0.15s ease-in-out infinite;
        }
        .dust-1 { top: 20%; left: 30%; animation-delay: 0s; }
        .dust-2 { top: 45%; left: 70%; animation-delay: 0.05s; }
        .dust-3 { top: 70%; left: 20%; animation-delay: 0.1s; }
        .dust-4 { top: 15%; left: 80%; animation-delay: 0.08s; width: 6px; height: 6px; }
        .dust-5 { top: 60%; left: 50%; animation-delay: 0.12s; width: 3px; height: 3px; }
        .dust-6 { top: 85%; left: 35%; animation-delay: 0.03s; }
        
        @keyframes dustFlash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        /* Vignette darkening around edges */
        .film-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 50%,
            rgba(0,0,0,0.3) 100%
          );
        }
        
        /* Sepia/warm tint */
        .film-sepia {
          position: absolute;
          inset: 0;
          background: rgba(112, 66, 20, 0.08);
          mix-blend-mode: multiply;
        }
        
        /* Flicker effect on content */
        .vintage-film .section-title-text,
        .vintage-film .paragraph-text {
          animation: filmFlicker 0.1s ease-in-out infinite;
        }
        @keyframes filmFlicker {
          0%, 100% { opacity: 1; }
          30% { opacity: 0.97; }
          60% { opacity: 0.94; }
          90% { opacity: 0.98; }
        }

        /* ============================================
           DEPTH PARALLAX - Visible 3D stereoscopic effect
           ============================================ */
        .depth-parallax {
          position: relative;
        }
        
        /* Floating depth layers behind text */
        .depth-parallax::before {
          content: '';
          position: absolute;
          top: 20%;
          left: 10%;
          right: 10%;
          bottom: 20%;
          border: 2px solid rgba(168, 213, 229, 0.15);
          border-radius: 20px;
          animation: depthLayerFloat 4s ease-in-out infinite;
          pointer-events: none;
        }
        .depth-parallax::after {
          content: '';
          position: absolute;
          top: 15%;
          left: 5%;
          right: 5%;
          bottom: 15%;
          border: 1px solid rgba(168, 213, 229, 0.08);
          border-radius: 30px;
          animation: depthLayerFloat 4s ease-in-out infinite reverse;
          animation-delay: -2s;
          pointer-events: none;
        }
        
        @keyframes depthLayerFloat {
          0%, 100% { 
            transform: translateZ(0) scale(1);
            opacity: 0.5;
          }
          50% { 
            transform: translateZ(20px) scale(1.02);
            opacity: 1;
          }
        }
        
        /* Text with dramatic shadow for depth */
        .depth-parallax .section-title-text {
          text-shadow: 
            1px 1px 0 rgba(168, 213, 229, 0.3),
            2px 2px 0 rgba(168, 213, 229, 0.2),
            4px 4px 8px rgba(0,0,0,0.3),
            8px 8px 16px rgba(0,0,0,0.2);
          animation: textDepthPulse 3s ease-in-out infinite;
        }
        .depth-parallax .paragraph-text {
          text-shadow: 
            1px 1px 0 rgba(168, 213, 229, 0.2),
            2px 2px 4px rgba(0,0,0,0.2),
            4px 4px 8px rgba(0,0,0,0.15);
          animation: textDepthPulse 3s ease-in-out infinite;
          animation-delay: -1.5s;
        }
        
        @keyframes textDepthPulse {
          0%, 100% {
            transform: translateY(0);
            text-shadow: 
              1px 1px 0 rgba(168, 213, 229, 0.3),
              2px 2px 0 rgba(168, 213, 229, 0.2),
              4px 4px 8px rgba(0,0,0,0.3);
          }
          50% {
            transform: translateY(-3px);
            text-shadow: 
              2px 2px 0 rgba(168, 213, 229, 0.4),
              4px 4px 0 rgba(168, 213, 229, 0.25),
              8px 8px 16px rgba(0,0,0,0.4);
          }
        }
        
        /* Floating orbs for depth perception */
        .depth-orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 5;
        }
        .depth-orb-1 {
          width: 100px;
          height: 100px;
          top: 15%;
          left: 10%;
          background: radial-gradient(circle at 30% 30%, rgba(168, 213, 229, 0.15), transparent 70%);
          animation: orbFloat 6s ease-in-out infinite;
        }
        .depth-orb-2 {
          width: 60px;
          height: 60px;
          top: 70%;
          right: 15%;
          background: radial-gradient(circle at 30% 30%, rgba(168, 213, 229, 0.1), transparent 70%);
          animation: orbFloat 5s ease-in-out infinite reverse;
        }
        .depth-orb-3 {
          width: 40px;
          height: 40px;
          top: 40%;
          right: 25%;
          background: radial-gradient(circle at 30% 30%, rgba(168, 213, 229, 0.12), transparent 70%);
          animation: orbFloat 7s ease-in-out infinite;
          animation-delay: -2s;
        }
        
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10px, -15px) scale(1.1); }
          50% { transform: translate(5px, 10px) scale(0.95); }
          75% { transform: translate(-10px, -5px) scale(1.05); }
        }

        /* ============================================
           COLOR SHIFT - Already working, keeping it
           ============================================ */
        .color-shift {
          position: relative;
          overflow: hidden;
        }
        .color-shift::before {
          content: '';
          position: absolute;
          inset: -50%;
          background: 
            conic-gradient(
              from 0deg at 50% 50%,
              rgba(255, 100, 100, 0.15) 0deg,
              rgba(255, 255, 100, 0.15) 60deg,
              rgba(100, 255, 100, 0.15) 120deg,
              rgba(100, 255, 255, 0.15) 180deg,
              rgba(100, 100, 255, 0.15) 240deg,
              rgba(255, 100, 255, 0.15) 300deg,
              rgba(255, 100, 100, 0.15) 360deg
            );
          animation: colorRotate 10s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        .color-shift::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 180, 180, 0.12) 0%,
            rgba(180, 255, 180, 0.12) 33%,
            rgba(180, 180, 255, 0.12) 66%,
            rgba(255, 255, 180, 0.12) 100%
          );
          background-size: 200% 200%;
          animation: colorShift 5s ease infinite;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes colorRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes colorShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .color-shift .section-title-text,
        .color-shift .paragraph-text {
          position: relative;
          z-index: 5;
        }

        /* Peripheral drift effect */
        .peripheral-drift {
          position: relative;
        }
        .peripheral-drift::before,
        .peripheral-drift::after {
          content: '';
          position: fixed;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: repeating-conic-gradient(
            from 0deg,
            rgba(42,42,42,0.04) 0deg 10deg,
            transparent 10deg 20deg
          );
          pointer-events: none;
          animation: peripheralRotate 20s linear infinite;
          z-index: 0;
        }
        .peripheral-drift::before { top: 10%; left: -50px; }
        .peripheral-drift::after { bottom: 15%; right: -50px; animation-direction: reverse; }
        @keyframes peripheralRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Persistent glitch effect */
        .glitch-persistent {
          position: relative;
        }
        .glitch-persistent .paragraph-text,
        .glitch-persistent .section-title-text {
          animation: glitchPersistent 4s ease-in-out infinite;
        }
        @keyframes glitchPersistent {
          0%, 90%, 100% { transform: translate(0); text-shadow: none; }
          91% { transform: translate(-2px, 1px); text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
          92% { transform: translate(2px, -1px); text-shadow: -2px 0 #ff0000, 2px 0 #00ffff; }
          93% { transform: translate(0); text-shadow: none; }
          96% { transform: translate(1px, 1px); text-shadow: 1px 0 #ff0000, -1px 0 #00ffff; }
          97% { transform: translate(-1px, -1px); text-shadow: -1px 0 #ff0000, 1px 0 #00ffff; }
        }

        /* ============================================
           POSITIONS - Fixed to not overlap nav
           ============================================ */
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
          align-items: center;
          justify-content: flex-start;
          text-align: left;
          padding-left: 10vw;
          padding-right: 30vw;
        }
        .pos-bottom-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          text-align: right;
          padding-right: 10vw;
          padding-left: 30vw;
        }
        .pos-bottom-center {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
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

        .exhibition-title { text-align: center; margin-bottom: 20px; }
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
          .exhibition-grid { grid-template-columns: 1fr; gap: 32px; }
          .pos-top-left, .pos-top-right { padding: 15vh 24px 15vh 24px; }
          .pos-bottom-left, .pos-bottom-right, .pos-bottom-center {
            padding-left: 24px;
            padding-right: 24px;
          }
        }

        .poster-frame {
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
        }
        .poster-frame:hover { transform: translateY(-8px); }
        .poster-frame:hover .poster-hint { opacity: 1; }
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
        .poster-walkthrough.fade-out { opacity: 0; }

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
        .full-bleed-image.title-image.poster1-title img {
          width: 100%;
          height: auto;
          min-width: 100%;
          object-fit: cover;
        }
        .full-bleed-image.title-image.poster2-title img {
          width: auto;
          height: 100%;
          max-height: 100vh;
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

        /* ============================================
           NAVIGATION - Minimal, transparent, no overlap
           ============================================ */
        .walkthrough-nav {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 24px;
          z-index: 100;
        }

        .nav-arrow-btn {
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
          min-width: 50px;
          text-align: center;
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

        /* Artifacts Grid */
        .artifacts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          max-width: 700px;
          width: 100%;
        }
        .artifact-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 24px;
          background: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .artifact-clickable { cursor: pointer; }
        .artifact-clickable:hover {
          border-color: rgba(168, 213, 229, 0.4);
          background: linear-gradient(145deg, rgba(168, 213, 229, 0.08), rgba(168, 213, 229, 0.02));
          transform: translateY(-4px);
        }
        .artifact-pedestal {
          width: 100px;
          height: 100px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.05), transparent);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .artifact-pedestal::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 4px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
        }
        .artifact-active::after {
          background: linear-gradient(to right, transparent, rgba(168, 213, 229, 0.3), transparent);
        }
        .artifact-glass-case {
          width: 70px;
          height: 70px;
          border: 1px dashed rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .artifact-active-glow {
          border-color: rgba(168, 213, 229, 0.5);
          box-shadow: 0 0 20px rgba(168, 213, 229, 0.2);
        }
        .artifact-3d-icon {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.3);
        }
        .artifact-explore-icon { font-size: 20px; color: #a8d5e5; }
        .artifact-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          color: #fafafa;
          text-align: center;
        }
        .artifact-status {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #525252;
        }
        .artifact-status-active { color: #a8d5e5; }

        @media (max-width: 768px) {
          .nav-m-left { left: 20px; top: 20px; }
          .nav-m-right { right: 20px; top: 20px; }
          .nav-m-text { font-size: 24px; }
          .exhibition-main { padding: 100px 24px 60px; }
          .walkthrough-nav { bottom: 20px; gap: 16px; }
          .nav-arrow-btn { width: 40px; height: 40px; font-size: 16px; }
          .download-btn { bottom: 20px; right: 20px; padding: 10px 16px; font-size: 10px; }
          .text-content-wrapper { padding: 100px 24px; }
          .artifacts-grid { grid-template-columns: 1fr; gap: 24px; max-width: 320px; }
          .artifact-card { padding: 20px; }
        }
      `}</style>

      {/* Navigation */}
      <div
        className="nav-m nav-m-left"
        onClick={activeView === 'main' ? handleBack : returnToMain}
      >
        <span className="nav-m-text" style={{ color: '#525252' }}>M</span>
        <span className="nav-arrow nav-arrow-left" style={{ color: '#7D8471' }}>←</span>
        <span className="nav-label" style={{ color: '#7D8471' }}>
          {activeView === 'main' ? 'First Floor' : 'Exhibition'}
        </span>
      </div>

      <div className="nav-m nav-m-right">
        <span className="nav-label" style={{ color: '#7D8471' }}>Resources</span>
        <span className="nav-arrow nav-arrow-right" style={{ color: '#7D8471' }}>→</span>
        <span className="nav-m-text" style={{ color: '#525252' }}>M</span>
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

            <div className="display-case" onClick={() => router.push('/exhibitions/seeing-is-deceiving/artifacts')}>
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
              <div className={`full-bleed-image title-image ${isPoster1 ? 'poster1-title' : 'poster2-title'} ${currentItem.effect === 'kenburns-in' ? 'effect-kenburns-in' : ''} ${currentItem.effect === 'drift' ? 'effect-drift' : ''}`}>
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
              <div className={`text-content-wrapper ${getPositionClass(currentItem.position)} ${currentItem.special === 'static-overlay' ? 'static-overlay' : ''} ${currentItem.special === 'vintage-film' ? 'vintage-film' : ''} ${currentItem.special === 'depth-parallax' ? 'depth-parallax' : ''} ${currentItem.special === 'color-shift' ? 'color-shift' : ''} ${currentItem.special === 'peripheral-drift' ? 'peripheral-drift' : ''} ${currentItem.special === 'glitch-persistent' ? 'glitch-persistent' : ''}`}>
                {/* Film overlay for vintage film sections */}
                {currentItem.special === 'vintage-film' && <FilmOverlay />}
                {/* Depth orbs for stereoscope sections */}
                {currentItem.special === 'depth-parallax' && (
                  <>
                    <div className="depth-orb depth-orb-1"></div>
                    <div className="depth-orb depth-orb-2"></div>
                    <div className="depth-orb depth-orb-3"></div>
                  </>
                )}
                <h2
                  className={`section-title-text ${getEffectClass(currentItem.effect)} ${currentItem.special === 'rgb-split' ? 'rgb-split' : ''}`}
                  style={{ color: textColor, position: 'relative', zIndex: 10 }}
                >
                  {currentItem.text}
                </h2>
              </div>
            )}

            {/* Paragraph */}
            {currentItem.type === 'paragraph' && currentItem.text && (
              <div className={`text-content-wrapper ${getPositionClass(currentItem.position)} ${currentItem.special === 'static-overlay' ? 'static-overlay' : ''} ${currentItem.special === 'vintage-film' ? 'vintage-film' : ''} ${currentItem.special === 'depth-parallax' ? 'depth-parallax' : ''} ${currentItem.special === 'color-shift' ? 'color-shift' : ''} ${currentItem.special === 'peripheral-drift' ? 'peripheral-drift' : ''} ${currentItem.special === 'glitch-persistent' ? 'glitch-persistent' : ''}`}>
                {/* Film overlay for vintage film sections */}
                {currentItem.special === 'vintage-film' && <FilmOverlay />}
                {/* Depth orbs for stereoscope sections */}
                {currentItem.special === 'depth-parallax' && (
                  <>
                    <div className="depth-orb depth-orb-1"></div>
                    <div className="depth-orb depth-orb-2"></div>
                    <div className="depth-orb depth-orb-3"></div>
                  </>
                )}
                <p
                  className={`paragraph-text ${currentItem.special === 'rgb-split' ? 'rgb-split' : ''} ${currentItem.effect === 'fade-in' ? 'effect-fade-in' : ''} ${currentItem.effect === 'blur-to-sharp' ? 'effect-blur-sharp' : ''} ${currentItem.effect === 'glitch' ? 'effect-glitch' : ''}`}
                  style={{ color: textColor, position: 'relative', zIndex: 10 }}
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

          {/* Navigation - minimal and transparent */}
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