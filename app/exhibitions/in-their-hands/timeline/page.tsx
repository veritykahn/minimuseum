'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

const timelineStops = [
  {
    id: 1,
    ruler: "Augustus Caesar",
    reference: "Luke 2:1",
    coin: "AE As · 5–4 BC · RPC I 4248",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/augustus-front.png",
    painting: "/exhibitions/in-their-hands/timeline/augustus-tissot.jpg",
    passage: "In those days Caesar Augustus issued a decree that a census should be taken of the entire Roman world.",
    story: "This is the coin of the man who accidentally set the Nativity in motion. Augustus never visited Judaea and almost certainly never thought about it. But his bureaucratic command — a census, for tax purposes — sent a carpenter and his pregnant wife from Nazareth to Bethlehem. The decree was nothing to Augustus. It was everything to the world."
  },
  {
    id: 2,
    ruler: "Herod the Great",
    reference: "Matthew 2:13",
    coin: "AE Prutah · 40–4 BC · Hendin 1177",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/herod-great-front.png",
    painting: "/exhibitions/in-their-hands/timeline/great-tissot.jpg",
    passage: "An angel of the Lord appeared to Joseph in a dream. 'Get up,' he said, 'take the child and his mother and escape to Egypt. Stay there until I tell you, for Herod is going to search for the child to kill him.'",
    story: "Herod ordered the Massacre of the Innocents in Bethlehem. The Holy Family fled to Egypt. He died in 4 BC, the same year as his own command. His coins carry no human image — Jewish law forbade it — so the symbols on this prutah reflect the compromise between Roman power and Jewish practice."
  },
  {
    id: 3,
    ruler: "Aretas IV",
    reference: "Mark 6:17–18",
    coin: "AE Prutah · 9 BC–40 AD · Hendin CB168",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/aretas-front.png",
    painting: "/exhibitions/in-their-hands/timeline/baptist-tissot.jpg",
    passage: "For Herod himself had given orders to have John arrested, and he had him bound and put in prison. He did this because of Herodias, his brother Philip's wife, whom he had married. For John had been saying to Herod, 'It is not lawful for you to have your brother's wife.'",
    story: "When Herod Antipas divorced the daughter of Aretas IV to marry Herodias, John the Baptist condemned the union publicly. He was arrested and beheaded. Aretas went to war against Antipas in revenge. Years later, Paul escaped from Damascus to evade Aretas's governor by being lowered in a basket from the city wall (2 Cor 11:32–33). This single coin connects three New Testament stories."
  },
  {
    id: 4,
    ruler: "The Widow's Mite",
    reference: "Mark 12:41–44",
    coin: "Lepton · 103–76 BC, circulating 1st c. AD · Hendin 1150",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/widow-1-front.png",
    painting: "/exhibitions/in-their-hands/timeline/widow-tissot.jpg",
    passage: "Jesus sat down opposite the place where the offerings were put and watched the crowd putting their money into the temple treasury. Many rich people threw in large amounts. But a poor widow came and put in two very small copper coins, worth only a few pence. Calling his disciples to him, Jesus said, 'Truly I tell you, this poor widow has put more into the treasury than all the others.'",
    story: "Two leptons — the smallest denomination in circulation, worth almost nothing. She dropped them into the treasury and walked away. Jesus declared her gift greater than all others because she gave from poverty, not surplus. Two specimens are displayed in this exhibition because the Gospel specifies two coins. This was Jesus's last public teaching before the Passion."
  },
  {
    id: 5,
    ruler: "The Tribute Penny",
    reference: "Matthew 22:19–21",
    coin: "Silver Denarius · 14–37 AD · RIC I 30 · REPLICA",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/tribute-front.png",
    painting: "/exhibitions/in-their-hands/timeline/tribute-tissot.jpg",
    passage: "'Show me the coin used for paying the tax.' They brought him a denarius, and he asked them, 'Whose image is this? And whose inscription?' 'Caesar's,' they replied. Then he said to them, 'So give back to Caesar what is Caesar's, and to God what is God's.'",
    story: "The Pharisees tried to trap Jesus with a question about paying Roman taxes. The coin they produced bore the face of Tiberius. The reverse reads PONTIF MAXIM — High Priest — an assertion of Caesar's religious authority offensive to Jewish sensibility. Jesus's answer is one of the most quoted sentences in history. This replica is the exact coin type he held."
  },
  {
    id: 6,
    ruler: "The Tyrian Shekel",
    reference: "Matthew 26:14–15",
    coin: "Silver Shekel · 1 BC–1 AD · Hendin 1621 · REPLICA",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/shekel.png",
    painting: "/exhibitions/in-their-hands/timeline/judas-tissot.jpg",
    passage: "Then one of the Twelve — the one called Judas Iscariot — went to the chief priests and asked, 'What are you willing to give me if I deliver him over to you?' So they counted out for him thirty pieces of silver.",
    story: "The thirty pieces of silver paid to Judas were almost certainly Tyrian shekels — the only coin accepted for the Temple tax because of its high silver purity. The coin mandatory for worship became the price of betrayal. The same coin type also appears in Matthew 17:27, when Jesus tells Peter to catch a fish and find a stater in its mouth — exactly enough for the Temple tax for two. One coin, two of the most famous stories ever told."
  },
  {
    id: 7,
    ruler: "Pontius Pilate",
    reference: "Matthew 27:24",
    coin: "AE Prutah · 29/30 AD (RY16 of Tiberius) · Hendin 6370",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/pilate-front.png",
    painting: "/exhibitions/in-their-hands/timeline/pilate-tissot.jpg",
    passage: "When Pilate saw that he was getting nowhere, but that instead an uproar was starting, he took water and washed his hands in front of the crowd. 'I am innocent of this man's blood,' he said. 'It is your responsibility!'",
    story: "This coin was minted in the precise year of the Passion. Pilate's existence was doubted by some scholars until 1961, when an inscribed limestone block bearing his name was found at Caesarea Maritima. Obverse: a simpulum, a Roman libation ladle. Reverse: three bound ears of grain. Both symbols deliberately provocative on Jewish coinage. You are looking at a coin made by the man who sentenced Jesus to death, in the year he did it."
  },
  {
    id: 8,
    ruler: "Herod Antipas",
    reference: "Luke 23:8–9",
    coin: "AE Prutah · 4 BC–39 AD · Hendin 1204 · REPLICA",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/antipas-front.png",
    painting: "/exhibitions/in-their-hands/timeline/herod-tissot.jpg",
    passage: "When Herod saw Jesus, he was greatly pleased, because for a long time he had been wanting to see him. From what he had heard about him, he hoped to see him perform a sign of some sort. He plied him with many questions, but Jesus gave him no answer.",
    story: "Pilate sent Jesus to Antipas for questioning during the Passion. Antipas mocked Jesus and dressed him in an elegant robe before sending him back. Jesus — who spoke to Pilate, the High Priest, and his accusers — gave Antipas nothing. Not one word. It is the only silence in the entire Passion narrative."
  },
  {
    id: 9,
    ruler: "Herod Agrippa I",
    reference: "Acts 12:1–3",
    coin: "AE Prutah · 41–44 AD · Hendin 1244",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/agrippa-front.png",
    painting: "/exhibitions/in-their-hands/timeline/agrippa-zurbaran.jpg",
    passage: "It was about this time that King Herod arrested some who belonged to the church, intending to persecute them. He had James, the brother of John, put to death with the sword. When he saw that this met with approval among the Jews, he proceeded to seize Peter also.",
    story: "Grandson of Herod the Great. He had James — the first apostle to be martyred — executed with the sword, and imprisoned Peter. His death shortly after is described in both Acts and by the historian Josephus in almost identical terms: struck down by an angel of the Lord, eaten by worms."
  },
  {
    id: 10,
    ruler: "Emperor Claudius",
    reference: "Acts 18:1–3",
    coin: "AE As · 41–54 AD · RIC I 100",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/claudius-front.png",
    painting: "/exhibitions/in-their-hands/timeline/paul-tissot.jpg",
    passage: "After this, Paul left Athens and went to Corinth. There he met a Jew named Aquila, a native of Pontus, who had recently come from Italy with his wife Priscilla, because Claudius had ordered all Jews to leave Rome. Paul went to see them, and because he was a tentmaker as they were, he stayed and worked with them.",
    story: "Claudius expelled all Jews from Rome — confirmed by the historian Suetonius and dated to approximately 49 AD. This order directly caused Aquila and Priscilla to travel to Corinth, where Paul met them and worked with them as tentmakers. Without Claudius's edict, two of Paul's most important co-workers would not have been there."
  },
  {
    id: 11,
    ruler: "Porcius Festus",
    reference: "Acts 25:10–12",
    coin: "AE Prutah · 59–62 AD · Hendin 1348 · NGC Certified",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/festus-front.png",
    painting: "/exhibitions/in-their-hands/timeline/festus-surikov.jpg",
    passage: "Paul answered: 'I am now standing before Caesar's court, where I ought to be tried. I have not done any wrong to the Jews, as you yourself know very well. I appeal to Caesar!' After Festus had conferred with his advisers, he declared: 'You have appealed to Caesar. To Caesar you will go!'",
    story: "Paul had been held in Caesarea for two years. When Festus took office and reopened the case, Paul invoked his right as a Roman citizen. Festus minted this exact coin during the years described in Acts. The NGC certification on this specimen means it has been independently authenticated by the world's largest coin grading service — professional numismatists have examined it in person and confirmed it genuine. You are looking at a coin made by the man who sent Paul to Rome."
  }
];

export default function GospelTimeline() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [loaded, setLoaded] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const stop = timelineStops[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === timelineStops.length - 1;

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= timelineStops.length || transitioning) return;
    setDirection(index > currentIndex ? 'right' : 'left');
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => setTransitioning(false), 50);
    }, 400);
  }, [currentIndex, transitioning]);

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  // Initial load animation
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Preload adjacent images
  useEffect(() => {
    const preload = (src: string) => {
      const img = new Image();
      img.src = src;
    };
    if (currentIndex > 0) {
      preload(timelineStops[currentIndex - 1].painting);
      preload(timelineStops[currentIndex - 1].coinImage);
    }
    if (currentIndex < timelineStops.length - 1) {
      preload(timelineStops[currentIndex + 1].painting);
      preload(timelineStops[currentIndex + 1].coinImage);
    }
  }, [currentIndex]);

  return (
    <div
      className={`tl-page ${loaded ? 'tl-loaded' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .tl-page {
          position: fixed;
          inset: 0;
          background: #1C1409;
          color: #fafafa;
          overflow: hidden;
          font-family: 'Cormorant Garamond', serif;
        }

        /* ========== BACKGROUND PAINTING ========== */
        .tl-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          transition: opacity 0.6s ease;
        }
        .tl-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.18;
        }
        .tl-bg.fading { opacity: 0; }
        .tl-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(28, 20, 9, 0.3) 0%,
            rgba(28, 20, 9, 0.1) 30%,
            rgba(28, 20, 9, 0.4) 70%,
            rgba(28, 20, 9, 0.95) 100%
          );
        }

        /* ========== HEADER ========== */
        .tl-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 32px;
        }

        .tl-back-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          color: #C9A84C;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        .tl-back-btn:hover { color: #fafafa; }
        .tl-back-btn span { font-size: 18px; }

        .tl-counter {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: #C9A84C;
          opacity: 0.7;
        }

        /* ========== MAIN LAYOUT ========== */
        .tl-main {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 100vh;
          padding: 80px 35vw 100px 60px;
          gap: 48px;
        }

        /* ========== COIN ========== */
        .tl-coin-area {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tl-coin-wrapper {
          position: relative;
          transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tl-coin-wrapper.entering-right {
          opacity: 0;
          transform: translateX(40px) scale(0.95);
        }
        .tl-coin-wrapper.entering-left {
          opacity: 0;
          transform: translateX(-40px) scale(0.95);
        }
        .tl-coin-wrapper.visible {
          opacity: 1;
          transform: translateX(0) scale(1);
        }

        .tl-coin-img {
          width: min(35vh, 35vw);
          max-width: 360px;
          height: auto;
          filter: drop-shadow(0 20px 60px rgba(0,0,0,0.5)) drop-shadow(0 8px 20px rgba(201, 168, 76, 0.1));
          animation: tl-coin-float 5s ease-in-out infinite;
        }

        @keyframes tl-coin-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* ========== PARCHMENT CARD ========== */
        .tl-card-area {
          flex: 1;
          max-width: 520px;
          min-width: 0;
        }

        .tl-card {
          background: #F5EDD8;
          border-radius: 4px;
          padding: 40px 36px;
          box-shadow:
            0 20px 60px rgba(0,0,0,0.4),
            0 2px 10px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.3);
          transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .tl-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 4px;
          background:
            radial-gradient(ellipse at 20% 80%, rgba(180,160,120,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(180,160,120,0.06) 0%, transparent 50%);
          pointer-events: none;
        }
        .tl-card.entering-right {
          opacity: 0;
          transform: translateX(60px);
        }
        .tl-card.entering-left {
          opacity: 0;
          transform: translateX(-60px);
        }
        .tl-card.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .tl-card-ruler {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 400;
          color: #C9A84C;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .tl-card-coin {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8B7D6B;
          margin-bottom: 16px;
        }

        .tl-card-reference {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          font-style: italic;
          color: #6B5D4D;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(139, 125, 107, 0.2);
        }

        .tl-card-passage {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.95rem, 1.4vw, 1.05rem);
          font-style: italic;
          line-height: 1.7;
          color: #5A4E3E;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(139, 125, 107, 0.15);
        }

        .tl-card-story {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.95rem, 1.5vw, 1.1rem);
          line-height: 1.8;
          color: #3D3428;
        }

        /* ========== PAINTING INSET ========== */
        .tl-painting-inset {
          position: fixed;
          top: 50%;
          right: 32px;
          transform: translateY(-50%);
          z-index: 5;
          transition: opacity 0.5s ease;
        }
        .tl-painting-inset.fading { opacity: 0; }

        .tl-painting-inset img {
          height: 55vh;
          max-height: 500px;
          width: auto;
          object-fit: contain;
          border-radius: 4px;
          box-shadow:
            0 16px 50px rgba(0,0,0,0.5),
            0 4px 12px rgba(0,0,0,0.3);
          border: 1px solid rgba(201, 168, 76, 0.12);
        }

        /* ========== NAVIGATION ========== */
        .tl-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          padding: 24px 32px;
          background: linear-gradient(to top, rgba(28, 20, 9, 0.95) 0%, rgba(28, 20, 9, 0) 100%);
        }

        .tl-nav-arrow {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(201, 168, 76, 0.4);
          background: rgba(28, 20, 9, 0.6);
          backdrop-filter: blur(8px);
          color: #C9A84C;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tl-nav-arrow:hover {
          background: rgba(201, 168, 76, 0.15);
          border-color: #C9A84C;
        }
        .tl-nav-arrow:disabled {
          opacity: 0;
          pointer-events: none;
        }

        .tl-dots {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .tl-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(245, 237, 216, 0.3);
        }
        .tl-dot:hover {
          background: rgba(245, 237, 216, 0.6);
          transform: scale(1.3);
        }
        .tl-dot.active {
          background: #C9A84C;
          box-shadow: 0 0 10px rgba(201, 168, 76, 0.5);
          transform: scale(1.2);
        }

        /* ========== FINAL STOP BUTTON ========== */
        .tl-end-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 24px;
          padding: 12px 28px;
          border-radius: 100px;
          border: 1px solid rgba(201, 168, 76, 0.4);
          background: transparent;
          color: #C9A84C;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .tl-end-btn:hover {
          background: rgba(201, 168, 76, 0.1);
          border-color: #C9A84C;
        }

        /* ========== LOAD ANIMATION ========== */
        .tl-page { opacity: 0; transition: opacity 0.6s ease; }
        .tl-page.tl-loaded { opacity: 1; }

        /* ========== MOBILE ========== */
        @media (max-width: 900px) {
          .tl-main {
            flex-direction: column;
            padding: 80px 24px 120px;
            gap: 24px;
            justify-content: flex-start;
            overflow-y: auto;
          }
          .tl-coin-img {
            width: min(40vw, 30vh);
            max-width: 220px;
          }
          .tl-card {
            padding: 28px 24px;
          }
          .tl-card-area {
            max-width: 100%;
          }
          .tl-painting-inset {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .tl-main {
            padding: 70px 16px 110px;
            gap: 16px;
          }
          .tl-coin-img {
            width: min(50vw, 25vh);
            max-width: 180px;
          }
          .tl-card {
            padding: 24px 20px;
          }
          .tl-nav {
            padding: 16px 20px;
          }
          .tl-dots { gap: 7px; }
          .tl-dot { width: 7px; height: 7px; }
        }
      `}</style>

      {/* Background painting */}
      <div className={`tl-bg ${transitioning ? 'fading' : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={stop.painting} alt="" aria-hidden="true" />
        <div className="tl-bg-overlay" />
      </div>

      {/* Header */}
      <header className="tl-header">
        <button className="tl-back-btn" onClick={() => router.push('/exhibitions/in-their-hands')}>
          <span>{'\u2190'}</span>
          Exhibition
        </button>
        <span className="tl-counter">{stop.id} / {timelineStops.length}</span>
      </header>

      {/* Main content */}
      <main className="tl-main">
        {/* Coin */}
        <div className="tl-coin-area">
          <div className={`tl-coin-wrapper ${transitioning ? (direction === 'right' ? 'entering-right' : 'entering-left') : 'visible'}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="tl-coin-img"
              src={stop.coinImage}
              alt={stop.ruler}
            />
          </div>
        </div>

        {/* Parchment card */}
        <div className="tl-card-area">
          <div className={`tl-card ${transitioning ? (direction === 'right' ? 'entering-right' : 'entering-left') : 'visible'}`}>
            <h2 className="tl-card-ruler">{stop.ruler}</h2>
            <p className="tl-card-coin">{stop.coin}</p>
            <p className="tl-card-reference">{stop.reference}</p>
            <p className="tl-card-passage">&ldquo;{stop.passage}&rdquo;</p>
            <p className="tl-card-story">{stop.story}</p>

            {isLast && (
              <button className="tl-end-btn" onClick={() => router.push('/exhibitions/in-their-hands')}>
                Back to Exhibition {'\u2192'}
              </button>
            )}
          </div>
        </div>

      </main>

      {/* Painting inset — bottom right corner */}
      <div className={`tl-painting-inset ${transitioning ? 'fading' : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={stop.painting} alt={`${stop.ruler} — painting`} />
      </div>

      {/* Navigation */}
      <nav className="tl-nav">
        <button
          className="tl-nav-arrow"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="Previous"
        >
          {'\u2190'}
        </button>

        <div className="tl-dots">
          {timelineStops.map((_, i) => (
            <button
              key={i}
              className={`tl-dot ${i === currentIndex ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to stop ${i + 1}`}
            />
          ))}
        </div>

        <button
          className="tl-nav-arrow"
          onClick={goNext}
          disabled={isLast}
          aria-label="Next"
        >
          {'\u2192'}
        </button>
      </nav>
    </div>
  );
}
