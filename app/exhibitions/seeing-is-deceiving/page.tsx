'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type ContentItem = {
  type: string;
  text?: string;
  src?: string;
  alt?: string;
  url?: string;
};

// Poster 1 content - Seeing is Deceiving
const poster1Content: ContentItem[] = [
  { type: 'title-image', src: '/exhibitions/seeing/poster1-title.jpg', alt: 'Seeing is Deceiving' },
  {
    type: 'section-title',
    text: 'The Science of How We See'
  },
  {
    type: 'paragraph',
    text: 'Right now, you believe you\'re seeing the world exactly as it is. But you\'re not. Your eyes are simply sensors that gather light – it is your brain that does all the interpreting and it takes remarkable shortcuts. Every second, 11 million bits of sensory information flood into your brain. You consciously process only about 40 bits. Which means your brain discards 99.999% of visual information and constructs what it thinks you need to see, and so reality is not quite as you see it.'
  },
  {
    type: 'paragraph',
    text: 'To handle this impossible task, your brain doesn\'t record reality like a camera – it predicts reality. Based on past experience, it fills in gaps, smooths over inconsistencies, and makes thousands of assumptions. You can read tihs senetnce even wehn the leettrs are srcambled because your brain predicts what should be there. This prediction system keeps you alive—you can catch a ball, spot danger, recognize faces. But it also means you see what you expect to see, not necessarily what\'s actually there.'
  },
  {
    type: 'paragraph',
    text: 'Your eyes have a blind spot where the optic nerve connects to your retina—a patch in each eye where you literally cannot see. Right now, you have two holes in your vision. You\'ve never noticed because your brain seamlessly fills them in, inventing information to complete the picture. If your brain lies to you about something this basic, what else is it hiding?'
  },
  {
    type: 'section-title',
    text: 'The First Motion Pictures (1820s-1830s)'
  },
  {
    type: 'paragraph',
    text: 'Inventors discovered something strange: show the eye rapid sequences of still images and the brain sees continuous motion that doesn\'t exist. The thaumatrope (1825) was a disk with different images on each side—spin it and a bird appears inside a cage. The zoetrope (1834) showed sequential drawings through slits—spin it and horses gallop, people dance. Nothing actually moves. Your brain creates the motion. Movies are still pictures shown fast. Every screen you look at exploits this biological quirk discovered 200 years ago.'
  },
  {
    type: 'section-title',
    text: 'The Stereoscope: Inventing Depth'
  },
  {
    type: 'paragraph',
    text: 'In the 1830s, physicist Charles Wheatstone discovered that your two eyes see slightly different images, and your brain calculates depth from those differences. He built the first stereoscope—showing each eye a different flat picture. Your brain combines them and suddenly you perceive three dimensions that don\'t exist. By the late 1800s, Victorians used stereoscopes to "travel" to Egypt or Niagara Falls without leaving home. The same principle powers modern 3D movies and VR headsets. The technology evolved. Your brain didn\'t.'
  },
  { type: 'image', src: '/exhibitions/seeing/face.jpg', alt: 'Abstract face illustration' },
  {
    type: 'section-title',
    text: 'Color Illusions: Context Changes Everything'
  },
  {
    type: 'paragraph',
    text: 'Your brain doesn\'t show you "true" color—it interprets based on context. In the checkerboard shadow illusion, two squares appear completely different shades. Measure the actual light and they\'re identical. Your brain "corrects" for the shadow, and you cannot see them as the same color even when you know they are. Remember the dress that broke the internet in 2015—blue and black or white and gold? Your brain\'s assumptions about lighting changed the actual colors you perceived. Two identical things can look completely different depending on what surrounds them.'
  },
  {
    type: 'section-title',
    text: 'One Picture, Two Realities'
  },
  {
    type: 'paragraph',
    text: 'Some illusions show your brain\'s pattern-finding obsession. The old woman/young woman illusion (1888) uses the same lines to create two completely different faces. The rabbit/duck illusion (1892) can be seen as either animal but never both simultaneously. The Rubin vase (1915): white vase or two black faces? Your brain organizes visual information into familiar patterns, sometimes finding multiple interpretations of the same image. What you "see" depends on which pattern your brain emphasizes.'
  },
  {
    type: 'section-title',
    text: 'Motion That Isn\'t There'
  },
  {
    type: 'paragraph',
    text: 'Some static images appear to move. The peripheral drift illusion uses high-contrast patterns—stare at the center and edges seem to rotate, though nothing moves. The Rotating Snakes illusion (2003) shows circles that appear to spin when you glance around the image. Your brain is so committed to detecting motion that it sometimes sees movement that isn\'t there.'
  },
  {
    type: 'section-title',
    text: 'Impossible Objects'
  },
  {
    type: 'paragraph',
    text: 'The Penrose triangle (1934) and M.C. Escher\'s impossible staircases (1960) show objects that cannot exist in three-dimensional space. Your brain tries to make sense of them and fails, creating that unsettling feeling when you see something impossible.'
  },
  {
    type: 'section-title',
    text: 'Why Your Eyes Aren\'t Trustworthy'
  },
  {
    type: 'paragraph',
    text: 'You don\'t see reality—you see your brain\'s interpretation based on prediction, context, pattern recognition, and efficiency shortcuts. Your brain takes these shortcuts to help you survive: you can catch balls, spot danger, recognize faces. But you can also be fooled by colors that aren\'t what they appear, motion that doesn\'t exist, depth that isn\'t there, and details your brain invents to fill gaps.'
  },
  { type: 'end', text: 'Return to Exhibition' }
];

// Poster 2 content - A History of Lies
const poster2Content: ContentItem[] = [
  { type: 'title-image', src: '/exhibitions/seeing/poster2-title.jpg', alt: 'A History of Lies: From Magic Lanterns to AI Deepfakes' },
  {
    type: 'section-title',
    text: 'The First Visual Deceptions (1600s-1800s)'
  },
  {
    type: 'paragraph',
    text: 'Long before photography, humans created visual trickery. In the 1600s, camera obscura devices projected upside-down images onto walls in darkened rooms. People who didn\'t understand the optics believed they were seeing magic. By the 1700s, traveling showmen used magic lanterns—early projectors casting painted images onto screens. In darkened rooms, they created moving ghosts and demons that terrified audiences who\'d never seen projected light. The lesson: new technology creates windows for deception. When people don\'t understand how something works, realistic results are accepted as truth.'
  },
  {
    type: 'section-title',
    text: 'Spirit Photography: When Cameras Lied (1860s-1920s)'
  },
  {
    type: 'paragraph',
    text: 'In 1861, photographer William Mumler accidentally created the first spirit photograph using double exposure—exposing the same plate twice. A ghostly figure appeared beside him. Grieving families paid fortunes for photographs of dead relatives, not understanding how cameras could be manipulated. For sixty years, spirit photography boomed. Photographers used simple tricks—double exposures, hanging cloth, accomplices in sheets—to create "proof" of the afterlife. Why did it work? Photography was new, the images looked real, people wanted to believe, and "seeing is believing" was still reliable. By the 1920s, magicians like Houdini exposed the tricks, but for decades fake photographs had influenced beliefs and extracted money from grieving families.'
  },
  {
    type: 'section-title',
    text: 'Hollywood Magic: Manufacturing Reality (1920s-1980s)'
  },
  {
    type: 'paragraph',
    text: 'Film brought new illusions. Miniatures made tiny models look massive—King Kong (1933) was an 18-inch puppet. Matte paintings created castles and cities that didn\'t exist. Stop-motion brought creatures to life frame by frame. Rear projection put actors in exotic locations while they stood in studios. Everyone knew movies were fiction, but your brain believed them anyway. You knew the monster wasn\'t real, but your heart still raced.'
  },
  {
    type: 'section-title',
    text: 'Photoshop: Everyone Can Fake (1990s-2000s)'
  },
  {
    type: 'paragraph',
    text: 'In 1990, Photoshop made photo editing accessible to anyone with a computer. Suddenly you could remove people from photographs, add things that were never there, alter faces and bodies, combine multiple images. Magazine covers showed impossible perfection. News photos were altered to remove inconvenient politicians. The manipulation was often detectable if you looked closely—inconsistent lighting, weird shadows, wrong proportions. But most people weren\'t looking closely. They were scrolling fast, trusting their eyes. A new assumption emerged: every photograph might be fake.'
  },
  { type: 'image', src: '/exhibitions/seeing/waves.jpg', alt: 'Optical illusion waves' },
  {
    type: 'section-title',
    text: 'Deepfakes: AI Creates Reality (2017-Present)'
  },
  {
    type: 'paragraph',
    text: 'In 2017, AI could generate photorealistic images of people who don\'t exist. By 2018, AI created convincing videos of real people saying things they never said. By 2020, these "deepfakes" were indistinguishable from authentic footage. You can create deepfakes with free software, a decent computer, and hours of source footage. No expertise required. The technology also enables voice cloning from seconds of audio, AI-generated photographs of events that never happened, and face-swapping in real-time video. We\'re now in a world where seeing something happen is no longer reliable evidence that it happened.'
  },
  {
    type: 'section-title',
    text: 'The Pattern Across 400 Years'
  },
  {
    type: 'paragraph',
    text: '1600s: Magic lanterns deceive people who\'ve never seen projected light. 1860s: Spirit photography deceives people who don\'t understand cameras. 1930s: Film creates convincing fictional realities. 1990s: Photoshop makes manipulation accessible to everyone. 2020s: AI generates realistic content of things that never existed. The tools change. Human psychology doesn\'t. Every advance creates a window where realistic results are accepted as truth until people learn to recognize the tricks.'
  },
  {
    type: 'section-title',
    text: 'How Deception Has Been Used'
  },
  {
    type: 'paragraph',
    text: 'Visual manipulation has been weaponized to exploit grief (spirit photographers charging for fake ghost photos), sell products (fake before-and-after photos), create false evidence (doctored court photographs), spread propaganda (altered wartime images), manipulate politics (fabricated statements), influence markets (fake announcements), destroy reputations (synthetic compromising videos), and evade accountability ("that real footage is a deepfake"). The motivation hasn\'t changed in 400 years: profit, power, politics, personal gain.'
  },
  {
    type: 'section-title',
    text: 'How to Verify What You See'
  },
  {
    type: 'paragraph',
    text: 'Question the source: Who created this? Why? Who benefits? If you can\'t answer, you don\'t have enough information. Look for technical tells: Unnatural blinking, mismatched lighting, audio sync issues, weird artifacts, strangely smooth skin textures. Recognize confirmation bias: Content that confirms what you already believe is most dangerous. It feels true because you want it to be true. That\'s when you should be MOST skeptical.'
  },
  {
    type: 'quote',
    text: 'Spirit photography worked because people wanted proof their loved ones weren\'t gone. Deepfakes work because your brain treats seeing as evidence. This instinct served humanity for thousands of years—until we invented ways to show you things that never happened.'
  },
  {
    type: 'link',
    text: 'Explore More: Josef Albers — The Interaction of Color',
    url: 'https://artsandculture.google.com/story/josef-albers-the-interaction-of-color-bechtler-museum-of-modern-art/owVxXkSkjQuPJA'
  },
  { type: 'end', text: 'Return to Exhibition' }
];

export default function SeeingIsDeceiving() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'main' | 'poster1' | 'poster2' | 'artifacts'>('main');
  const [posterStep, setPosterStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const currentPosterContent = activeView === 'poster1' ? poster1Content : poster2Content;

  const handleBack = () => {
    // Return to first floor at the Seeing is Deceiving position
    router.push('/exhibitions/first-floor');
  };

  const openPoster = (poster: 'poster1' | 'poster2') => {
    setFadeIn(false);
    setTimeout(() => {
      setActiveView(poster);
      setPosterStep(0);
      setFadeIn(true);
    }, 300);
  };

  const nextStep = () => {
    if (posterStep < currentPosterContent.length - 1) {
      setFadeIn(false);
      setTimeout(() => {
        setPosterStep(posterStep + 1);
        setFadeIn(true);
      }, 300);
    }
  };

  const prevStep = () => {
    if (posterStep > 0) {
      setFadeIn(false);
      setTimeout(() => {
        setPosterStep(posterStep - 1);
        setFadeIn(true);
      }, 300);
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

  // Determine background color based on which poster
  const getBgColor = () => {
    if (activeView === 'poster1') return '#e8e8e8'; // Light gray for Seeing is Deceiving
    if (activeView === 'poster2') return '#0a0a0a'; // Black for History of Lies
    return '#0a0a0a';
  };

  const getTextColor = () => {
    if (activeView === 'poster1') return '#1a1a1a';
    return '#fafafa';
  };

  const getAccentColor = () => {
    if (activeView === 'poster2') return '#a8d5e5'; // Light blue accent for History of Lies
    return '#1a1a1a';
  };

  return (
    <div style={{ background: getBgColor(), minHeight: '100vh', transition: 'background 0.5s ease' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }

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

        /* Poster Walkthrough View */
        .poster-walkthrough {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 120px 40px;
          transition: opacity 0.3s ease;
        }

        .poster-walkthrough.fade-out {
          opacity: 0;
        }

        .walkthrough-content {
          max-width: 700px;
          width: 100%;
          text-align: center;
        }

        /* Content type styles */
        .content-title-image {
          max-width: 100%;
          max-height: 50vh;
          margin: 0 auto;
          display: block;
        }

        .content-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2.5rem, 10vw, 5rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 0.95;
          margin-bottom: 20px;
        }

        .content-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 4vw, 1.8rem);
          font-style: italic;
          font-weight: 300;
          margin-bottom: 40px;
        }

        .content-section-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(0.9rem, 2.5vw, 1.1rem);
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 32px;
        }

        .content-paragraph {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 3vw, 1.4rem);
          font-weight: 400;
          line-height: 1.8;
          text-align: left;
        }

        .content-image {
          max-width: 100%;
          max-height: 60vh;
          margin: 0 auto;
        }

        .content-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 3.5vw, 1.6rem);
          font-style: italic;
          font-weight: 300;
          line-height: 1.7;
          padding: 40px;
          border-left: 3px solid;
          text-align: left;
        }

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
          background: currentColor;
        }

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
          background: currentColor;
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
        }
        .nav-arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .nav-arrow-btn:not(:disabled):hover {
          transform: scale(1.1);
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
          .poster-walkthrough { padding: 100px 24px; }
          .walkthrough-nav { bottom: 40px; gap: 24px; }
          .nav-arrow-btn { width: 44px; height: 44px; font-size: 18px; }
          .download-btn { bottom: 20px; right: 20px; padding: 10px 16px; font-size: 10px; }
        }
      `}</style>

      {/* Navigation - changes color based on view */}
      <div
        className="nav-m nav-m-left"
        onClick={activeView === 'main' ? handleBack : returnToMain}
        style={{ color: activeView === 'poster1' ? '#525252' : '#525252' }}
      >
        <span className="nav-m-text" style={{ color: getTextColor() === '#1a1a1a' ? '#525252' : '#525252' }}>M</span>
        <span className="nav-arrow nav-arrow-left" style={{ color: '#7D8471' }}>←</span>
        <span className="nav-label" style={{ color: '#7D8471' }}>
          {activeView === 'main' ? 'First Floor' : 'Exhibition'}
        </span>
      </div>

      <div
        className="nav-m nav-m-right"
        style={{ color: activeView === 'poster1' ? '#525252' : '#525252' }}
      >
        <span className="nav-label" style={{ color: '#7D8471' }}>Resources</span>
        <span className="nav-arrow nav-arrow-right" style={{ color: '#7D8471' }}>→</span>
        <span className="nav-m-text" style={{ color: getTextColor() === '#1a1a1a' ? '#525252' : '#525252' }}>M</span>
      </div>

      {/* Main Exhibition View */}
      {activeView === 'main' && (
        <div className="exhibition-main">
          <div className="exhibition-title">
            <h1>Seeing is Deceiving</h1>
            <p>The Science of How We See</p>
          </div>

          <div className="exhibition-grid">
            {/* Poster 1 */}
            <div className="poster-frame" onClick={() => openPoster('poster1')}>
              <img src="/exhibitions/seeing/poster1.jpg" alt="Seeing is Deceiving poster" />
              <span className="poster-hint">Click to explore</span>
            </div>

            {/* Display Case */}
            <div className="display-case" onClick={() => setActiveView('artifacts')}>
              <div className="case-placeholder">
                <span style={{ color: '#a8d5e5', fontSize: '12px', letterSpacing: '0.1em' }}>3D</span>
              </div>
              <p className="case-label">Artifacts</p>
              <p className="case-title">The Collection</p>
              <p className="case-status">Coming Soon</p>
            </div>

            {/* Poster 2 */}
            <div className="poster-frame" onClick={() => openPoster('poster2')}>
              <img src="/exhibitions/seeing/poster2.jpg" alt="A History of Lies poster" />
              <span className="poster-hint">Click to explore</span>
            </div>
          </div>
        </div>
      )}

      {/* Poster Walkthrough View */}
      {(activeView === 'poster1' || activeView === 'poster2') && (
        <div className={`poster-walkthrough ${fadeIn ? '' : 'fade-out'}`}>
          <div className="walkthrough-content">
            {currentItem.type === 'title-image' && (
              <img
                src={currentItem.src}
                alt={currentItem.alt}
                className="content-title-image"
              />
            )}

            {currentItem.type === 'title' && (
              <h1 className="content-title" style={{ color: getTextColor() }}>
                {currentItem.text}
              </h1>
            )}

            {currentItem.type === 'subtitle' && (
              <p className="content-subtitle" style={{ color: getAccentColor() }}>
                {currentItem.text}
              </p>
            )}

            {currentItem.type === 'section-title' && (
              <h2 className="content-section-title" style={{ color: getAccentColor() }}>
                {currentItem.text}
              </h2>
            )}

            {currentItem.type === 'paragraph' && (
              <p className="content-paragraph" style={{ color: getTextColor() }}>
                {currentItem.text}
              </p>
            )}

            {currentItem.type === 'image' && (
              <img
                src={currentItem.src}
                alt={currentItem.alt}
                className="content-image"
              />
            )}

            {currentItem.type === 'quote' && (
              <blockquote
                className="content-quote"
                style={{ color: getTextColor(), borderColor: getAccentColor() }}
              >
                {currentItem.text}
              </blockquote>
            )}

            {currentItem.type === 'link' && (
              <a
                href={currentItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="content-link"
                style={{ color: getAccentColor(), borderColor: getAccentColor() }}
              >
                {currentItem.text}
              </a>
            )}

            {currentItem.type === 'end' && (
              <button
                className="content-end"
                onClick={returnToMain}
                style={{ color: getTextColor(), borderColor: getTextColor() }}
              >
                {currentItem.text}
              </button>
            )}
          </div>

          {/* Navigation */}
          {currentItem.type !== 'end' && (
            <div className="walkthrough-nav">
              <button
                className="nav-arrow-btn"
                onClick={prevStep}
                disabled={posterStep === 0}
                style={{ color: getTextColor(), borderColor: getTextColor() }}
              >
                ←
              </button>
              <span className="step-indicator" style={{ color: getTextColor() }}>
                {posterStep + 1} / {currentPosterContent.length}
              </span>
              <button
                className="nav-arrow-btn"
                onClick={nextStep}
                disabled={posterStep === currentPosterContent.length - 1}
                style={{ color: getTextColor(), borderColor: getTextColor() }}
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
