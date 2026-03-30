'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const handsCharacters = [
  {
    id: 1,
    character: "The Roman Soldier",
    coinName: "Pontius Pilate Prutah",
    coinDate: "26–36 AD",
    fullImage: "/exhibitions/in-their-hands/Hands/roman-soldier-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/roman-soldier-hands-v1.jpg",
    story: "A Roman prefect's treasury in Jerusalem, 30 AD. This coin was minted here, in this city, in the year of the trial. A soldier received it as pay. A merchant passed it in change. A priest handled it in the Temple precincts that the man who minted it deliberately provoked. How many hands between then and now?"
  },
  {
    id: 2,
    character: "The Temple Priest",
    coinName: "Tyrian Shekel",
    coinDate: "1st century BC–1st century AD",
    fullImage: "/exhibitions/in-their-hands/Hands/temple-priest-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/temple-priest-hands-v2.jpg",
    story: "The Temple treasury, Jerusalem. The High Priest's hands counted these out: thirty of them, one by one. The coin required for worship — the purest silver in circulation — became the price of betrayal. It may also have been the coin a fisherman found in a fish's mouth by the Sea of Galilee."
  },
  {
    id: 3,
    character: "The Widow",
    coinName: "Widow's Mite — Lepton",
    coinDate: "1st century BC, circulating 1st century AD",
    fullImage: "/exhibitions/in-their-hands/Hands/widow-full-v4.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/widow-hands-v2.jpg",
    story: "A widow at the Temple treasury, Jerusalem. She held both of them — two leptons, the smallest coins in circulation, worth almost nothing. She dropped them into the treasury and walked away. Jesus watched. He said she had given more than anyone. These are her coins."
  },
  {
    id: 4,
    character: "The Merchant",
    coinName: "Augustus AE As",
    coinDate: "5–4 BC",
    fullImage: "/exhibitions/in-their-hands/Hands/merchant-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/merchant-hands-v2.jpg",
    story: "An imperial administrator in Rome, 5 BC. He was processing census returns from across the empire — from Egypt, from Gaul, from Judaea. Somewhere in the returns: a carpenter and his pregnant wife, registered in Bethlehem. The administrator never looked up from his ledger."
  },
  {
    id: 5,
    character: "The Mother",
    coinName: "Herod the Great Prutah",
    coinDate: "40–4 BC",
    fullImage: "/exhibitions/in-their-hands/Hands/mother-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/mother-hands-v1.jpg",
    story: "A soldier in Herod's service, Bethlehem, 4 BC. He was given orders he did not question. He was paid in these. The coin carries no human face — Jewish law forbade it — but it carries the weight of everything Herod built and everything Herod destroyed."
  },
  {
    id: 6,
    character: "Paul of Tarsus",
    coinName: "Porcius Festus Prutah",
    coinDate: "59–62 AD",
    fullImage: "/exhibitions/in-their-hands/Hands/paul-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/paul-hands-v1.jpg",
    story: "A Roman court in Caesarea, 59 AD. A prisoner stands before the procurator. He is a Roman citizen. He invokes the law. 'I appeal to Caesar.' The procurator's hands hold this coin — his own coin, his authority made metal — as he renders his decision. 'To Caesar you will go.'"
  },
  {
    id: 7,
    character: "The Daughter of Aretas",
    coinName: "Aretas IV Prutah",
    coinDate: "9 BC–40 AD",
    fullImage: "/exhibitions/in-their-hands/Hands/aretas-daughter-full-v2.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/aretas-daughter-hands-v1.jpg",
    story: "A Nabataean princess at Petra, returned from Judaea. Her husband Herod Antipas divorced her to marry another woman. John the Baptist condemned the marriage and was beheaded. Her father went to war. She is never named in the Gospels. She is the invisible figure whose humiliation set everything in motion. This is her father's coin — the coin of the kingdom she came home to."
  }
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type RoundState = 'guessing' | 'revealed' | 'finished';

export default function HandsOfHistory() {
  const router = useRouter();
  const [currentRound, setCurrentRound] = useState(0);
  const [roundState, setRoundState] = useState<RoundState>('guessing');
  const [chosenName, setChosenName] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Randomise the order of rounds on mount
  const roundOrder = useMemo(() => shuffle(handsCharacters), []);

  // For each round, generate 4 shuffled options (correct + 3 random others)
  const roundOptions = useMemo(() => {
    return roundOrder.map((char) => {
      const others = handsCharacters.filter(c => c.id !== char.id);
      const picked = shuffle(others).slice(0, 3);
      return shuffle([char, ...picked]);
    });
  }, [roundOrder]);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const character = roundOrder[currentRound];
  const options = roundOptions[currentRound];
  const isCorrect = chosenName === character.character;
  const isLastRound = currentRound === roundOrder.length - 1;

  const handleChoice = (name: string) => {
    if (roundState !== 'guessing') return;
    setChosenName(name);
    if (name === character.character) setScore(s => s + 1);
    setRoundState('revealed');
  };

  const nextRound = () => {
    if (isLastRound) {
      setRoundState('finished');
    } else {
      setCurrentRound(r => r + 1);
      setChosenName(null);
      setRoundState('guessing');
    }
  };

  const getOptionClass = (name: string) => {
    if (roundState !== 'revealed') return '';
    if (name === character.character) return 'hh-opt-correct';
    if (name === chosenName) return 'hh-opt-incorrect';
    return 'hh-opt-dim';
  };

  return (
    <div className={`hh-page ${loaded ? 'hh-loaded' : ''}`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .hh-page {
          position: fixed;
          inset: 0;
          background: #000;
          color: #fafafa;
          overflow: hidden;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .hh-page.hh-loaded { opacity: 1; }

        /* ========== HEADER ========== */
        .hh-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 32px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
        }
        .hh-back-btn {
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
        .hh-back-btn:hover { color: #fafafa; }
        .hh-back-btn span { font-size: 18px; }

        .hh-round-info {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: #C9A84C;
          opacity: 0.8;
        }

        /* ========== MAIN LAYOUT ========== */
        .hh-main {
          display: flex;
          height: 100vh;
          padding-top: 70px;
        }

        /* ========== HANDS IMAGE (left side) ========== */
        .hh-image-area {
          flex: 1;
          position: relative;
          overflow: hidden;
        }
        .hh-image-area img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.5s ease;
        }
        .hh-image-area .hh-img-hidden { opacity: 0; position: absolute; inset: 0; }
        .hh-image-area .hh-img-visible { opacity: 1; }
        .hh-image-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, transparent 60%, rgba(0,0,0,0.7) 100%);
          pointer-events: none;
        }

        /* ========== RIGHT PANEL ========== */
        .hh-panel {
          width: 420px;
          display: flex;
          flex-direction: column;
          padding: 32px;
          overflow-y: auto;
        }

        .hh-question {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 300;
          color: #C9A84C;
          margin-bottom: 32px;
          line-height: 1.3;
        }

        /* ========== OPTIONS (guessing state) ========== */
        .hh-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .hh-option-btn {
          padding: 16px 24px;
          border-radius: 12px;
          border: 1px solid rgba(201, 168, 76, 0.3);
          background: rgba(255,255,255,0.03);
          color: #fafafa;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hh-option-btn:hover {
          background: rgba(201, 168, 76, 0.1);
          border-color: #C9A84C;
        }
        .hh-option-btn:disabled {
          cursor: default;
        }
        .hh-option-btn.hh-opt-correct {
          background: rgba(74, 124, 89, 0.2);
          border-color: #4A7C59;
          color: #6BBF7A;
        }
        .hh-option-btn.hh-opt-incorrect {
          background: rgba(201, 168, 76, 0.12);
          border-color: #C9A84C;
          color: #C9A84C;
        }
        .hh-option-btn.hh-opt-dim {
          opacity: 0.3;
        }

        /* ========== REVEAL CARD ========== */
        .hh-reveal {
          animation: hh-fade-in 0.4s ease;
        }
        @keyframes hh-fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hh-reveal-verdict {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 500;
          margin-bottom: 16px;
        }
        .hh-reveal-verdict.correct { color: #4A7C59; }
        .hh-reveal-verdict.incorrect { color: #C9A84C; }

        .hh-reveal-character {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #737373;
          margin-bottom: 6px;
        }

        .hh-reveal-coin {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: #C9A84C;
          margin-bottom: 4px;
        }

        .hh-reveal-date {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #737373;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .hh-reveal-story {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          line-height: 1.8;
          color: #d0d0d0;
          margin-bottom: 28px;
        }

        .hh-next-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
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
          align-self: flex-end;
        }
        .hh-next-btn:hover {
          background: rgba(201, 168, 76, 0.1);
          border-color: #C9A84C;
        }

        /* ========== DOTS ========== */
        .hh-dots {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: auto;
          padding-top: 24px;
        }
        .hh-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(245, 237, 216, 0.2);
        }
        .hh-dot.active {
          background: #C9A84C;
          box-shadow: 0 0 10px rgba(201, 168, 76, 0.5);
          transform: scale(1.3);
        }
        .hh-dot.done {
          background: rgba(201, 168, 76, 0.4);
        }

        /* ========== FINAL SCREEN ========== */
        .hh-final {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          padding: 80px 40px;
          text-align: center;
        }

        .hh-final-score {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(4rem, 12vw, 7rem);
          font-weight: 300;
          color: #C9A84C;
          line-height: 1;
          margin-bottom: 8px;
        }

        .hh-final-of {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #737373;
          margin-bottom: 40px;
        }

        .hh-final-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 5vw, 2.6rem);
          font-weight: 300;
          font-style: italic;
          color: #C9A84C;
          margin-bottom: 32px;
        }

        .hh-final-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          line-height: 1.8;
          color: #d0d0d0;
          max-width: 600px;
          margin-bottom: 48px;
        }

        .hh-final-btn {
          padding: 16px 36px;
          border-radius: 100px;
          border: 1px solid rgba(201, 168, 76, 0.4);
          background: transparent;
          color: #C9A84C;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hh-final-btn:hover {
          background: rgba(201, 168, 76, 0.1);
          border-color: #C9A84C;
        }

        /* ========== MOBILE ========== */
        @media (max-width: 900px) {
          .hh-main {
            flex-direction: column;
          }
          .hh-image-area {
            flex: none;
            height: 40vh;
          }
          .hh-image-gradient {
            background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8) 100%);
          }
          .hh-panel {
            width: 100%;
            padding: 24px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="hh-header">
        <button className="hh-back-btn" onClick={() => router.push('/exhibitions/in-their-hands')}>
          <span>{'\u2190'}</span>
          Exhibition
        </button>
        {roundState !== 'finished' && (
          <span className="hh-round-info">
            Round {currentRound + 1} of {roundOrder.length} &middot; Score: {score}
          </span>
        )}
      </header>

      {roundState !== 'finished' ? (
        <main className="hh-main">
          {/* Left: hands image, crossfade to full on reveal */}
          <div className="hh-image-area">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={roundState === 'revealed' ? 'hh-img-hidden' : 'hh-img-visible'}
              src={character.handsImage}
              alt="Whose hands?"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={roundState === 'revealed' ? 'hh-img-visible' : 'hh-img-hidden'}
              src={character.fullImage}
              alt={character.character}
            />
            <div className="hh-image-gradient" />
          </div>

          {/* Right: question panel */}
          <div className="hh-panel">
            {roundState === 'guessing' ? (
              <>
                <h2 className="hh-question">Whose hands are these?</h2>
                <div className="hh-options">
                  {options.map((opt) => (
                    <button
                      key={opt.id}
                      className="hh-option-btn"
                      onClick={() => handleChoice(opt.character)}
                    >
                      {opt.character}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="hh-reveal">
                <p className={`hh-reveal-verdict ${isCorrect ? 'correct' : 'incorrect'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite!'}
                </p>
                <p className="hh-reveal-character">{character.character}</p>
                <h3 className="hh-reveal-coin">{character.coinName}</h3>
                <p className="hh-reveal-date">{character.coinDate}</p>
                <p className="hh-reveal-story">{character.story}</p>
                <button className="hh-next-btn" onClick={nextRound}>
                  {isLastRound ? 'See Results' : 'Next'} {'\u2192'}
                </button>
              </div>
            )}

            {/* Progress dots */}
            <div className="hh-dots">
              {roundOrder.map((_, i) => (
                <span
                  key={i}
                  className={`hh-dot ${i === currentRound ? 'active' : i < currentRound ? 'done' : ''}`}
                />
              ))}
            </div>
          </div>
        </main>
      ) : (
        <div className="hh-final">
          <p className="hh-final-score">{score}</p>
          <p className="hh-final-of">out of {roundOrder.length}</p>
          <h1 className="hh-final-title">You know these hands.</h1>
          <p className="hh-final-text">
            Every coin in this exhibition was held by someone. A soldier, a priest, a widow, a mother, a prisoner, a princess. The coins survived. The hands did not. But the stories connect us to the people who held them — across two thousand years of history, through hands just like yours.
          </p>
          <button className="hh-final-btn" onClick={() => router.push('/exhibitions/in-their-hands')}>
            Back to Exhibition {'\u2192'}
          </button>
        </div>
      )}
    </div>
  );
}
