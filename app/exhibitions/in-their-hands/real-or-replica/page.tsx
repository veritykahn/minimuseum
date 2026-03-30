'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const rounds = [
  {
    id: 1,
    coinName: "Dekadrachm of Athens",
    fakeImage: "/exhibitions/in-their-hands/real-or-fake/Dekadrachm-fake.png",
    realImage: "/exhibitions/in-their-hands/real-or-fake/Dekadrachm-real.png",
    method: "Casting",
    explanation: "This is a cast counterfeit. Look at the surface: the genuine coin has natural depth and variation in its patina built up over two thousand years. The fake has an unnaturally uniform surface. Cast reproductions copy the shape of an original coin by pouring molten metal into a mould, but they lack the die-stress lines of a struck coin. Small bubbles, reduced detail, and a different edge profile are all telltale signs. The owl on the genuine coin has crisp, individual feather lines — the fake's owl is softer and slightly blurred."
  },
  {
    id: 2,
    coinName: "Greek Drachm — Die Transfer Counterfeit",
    fakeImage: "/exhibitions/in-their-hands/real-or-fake/die-transfer-fake.png",
    realImage: "/exhibitions/in-their-hands/real-or-fake/die-transfer-real.png",
    method: "Die Transfer",
    explanation: "This is a die transfer counterfeit — one of the hardest fakes to spot. The counterfeiter created a mould from a genuine coin's die and used it to strike a new coin on a different blank. The design looks accurate at first glance, but compare the two carefully: the fake has a flatter, greyer appearance and the details lack the sharpness of the original strike. The metal composition is wrong — ancient coins have a specific alloy that modern fakes rarely match exactly. Experts use visual comparison with known genuine examples and sometimes X-ray analysis to catch these."
  },
  {
    id: 3,
    coinName: "Lysimachus Tetradrachm",
    fakeImage: "/exhibitions/in-their-hands/real-or-fake/Lysimachus-fake.png",
    realImage: "/exhibitions/in-their-hands/real-or-fake/Lysimachus-real.png",
    method: "Sand Casting",
    explanation: "This is a sand cast counterfeit. In sand casting, the counterfeiter presses a genuine coin into fine sand to make a mould, then pours molten metal into it. The result looks roughly right but the surface is grainy and soft. Compare the hair on the portrait: the genuine coin has sharp, individually defined curls with natural die-wear. The fake's hair is mushy and indistinct. The edge is also a giveaway — sand cast coins have a different edge texture to coins struck between two dies. The patina on the fake sits on the surface rather than penetrating the metal."
  },
  {
    id: 4,
    coinName: "Sestertius of Nero",
    fakeImage: "/exhibitions/in-their-hands/real-or-fake/nero-fake.png",
    realImage: "/exhibitions/in-their-hands/real-or-fake/nero-real.png",
    method: "False Dies",
    explanation: "This counterfeit was made using false dies — hand-engraved copies of the original dies used to strike coins that look very close to genuine. But look carefully at the portrait: the genuine coin has natural wear that softens the high points evenly, the way two thousand years of handling would. The fake's wear is artificial — made with a tumbler or sandpaper — and under magnification you would see small fractures instead of genuine smoothing. The genuine coin also has a lustrous quality when rotated that the fake lacks, because the metal composition is different."
  },
  {
    id: 5,
    coinName: "Widow's Mite — Lepton",
    fakeImage: "/exhibitions/in-their-hands/real-or-fake/widow-fake.png",
    realImage: "/exhibitions/in-their-hands/real-or-fake/widow-real.png",
    method: "Modern Reproduction",
    explanation: "This is a modern reproduction of a widow's mite. Ironically, fakes of cheap ancient coins often look too good. A genuine lepton was a low-denomination bronze coin mass-produced for daily use — the striking is crude, off-centre, and irregular. That's not poor quality, it's exactly what you expect. The fake is too clean, too symmetrical, too well-defined. The patina is chemically applied and sits on the surface unnaturally. If a lepton looks perfect, be suspicious. The imperfection is the proof of authenticity."
  }
];

type GameState = 'playing' | 'answered' | 'finished';

export default function RealOrReplica() {
  const router = useRouter();
  const [currentRound, setCurrentRound] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [chosenSide, setChosenSide] = useState<'a' | 'b' | null>(null);
  const [score, setScore] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Randomise fake position per round on mount
  const positions = useMemo(() =>
    rounds.map(() => Math.random() < 0.5 ? 'a' : 'b'),
    []
  );

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const round = rounds[currentRound];
  const fakeOnA = positions[currentRound] === 'a';
  const coinA = fakeOnA ? round.fakeImage : round.realImage;
  const coinB = fakeOnA ? round.realImage : round.fakeImage;
  const isCorrect = chosenSide !== null && ((chosenSide === 'a' && fakeOnA) || (chosenSide === 'b' && !fakeOnA));
  const isLastRound = currentRound === rounds.length - 1;

  const handleChoice = (side: 'a' | 'b') => {
    if (gameState !== 'playing') return;
    setChosenSide(side);
    const correct = (side === 'a' && fakeOnA) || (side === 'b' && !fakeOnA);
    if (correct) setScore(s => s + 1);
    setGameState('answered');
  };

  const nextRound = () => {
    if (isLastRound) {
      setGameState('finished');
    } else {
      setCurrentRound(r => r + 1);
      setChosenSide(null);
      setGameState('playing');
    }
  };

  const getBtnClass = (side: 'a' | 'b') => {
    if (gameState !== 'answered') return '';
    const isFake = (side === 'a' && fakeOnA) || (side === 'b' && !fakeOnA);
    if (isFake) return 'rr-correct';
    if (chosenSide === side) return 'rr-incorrect';
    return '';
  };

  const getImageBorder = (side: 'a' | 'b') => {
    if (gameState !== 'answered') return '';
    const isFake = (side === 'a' && fakeOnA) || (side === 'b' && !fakeOnA);
    if (isFake) return 'rr-img-correct';
    if (chosenSide === side) return 'rr-img-incorrect';
    return '';
  };

  return (
    <div className={`rr-page ${loaded ? 'rr-loaded' : ''}`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .rr-page {
          min-height: 100vh;
          background: #1C1409;
          color: #fafafa;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .rr-page.rr-loaded { opacity: 1; }

        /* ========== HEADER ========== */
        .rr-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 32px;
          background: linear-gradient(to bottom, rgba(28,20,9,0.98) 0%, rgba(28,20,9,0) 100%);
        }
        .rr-back-btn {
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
        .rr-back-btn:hover { color: #fafafa; }
        .rr-back-btn span { font-size: 18px; }

        .rr-score-display {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: #C9A84C;
          opacity: 0.8;
        }

        /* ========== MAIN GAME AREA ========== */
        .rr-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 100px 40px 60px;
          min-height: 100vh;
        }

        .rr-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 5vw, 2.8rem);
          font-weight: 300;
          color: #C9A84C;
          text-align: center;
          margin-bottom: 40px;
        }

        .rr-coins-row {
          display: flex;
          gap: 48px;
          align-items: flex-start;
          justify-content: center;
          margin-bottom: 32px;
          width: 100%;
          max-width: 900px;
        }

        .rr-coin-slot {
          flex: 1;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .rr-coin-img-wrap {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          background: #0d0a04;
          border: 3px solid transparent;
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rr-coin-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 12px;
        }
        .rr-coin-img-wrap.rr-img-correct {
          border-color: #4A7C59;
          box-shadow: 0 0 30px rgba(74, 124, 89, 0.3);
        }
        .rr-coin-img-wrap.rr-img-incorrect {
          border-color: #C9A84C;
          box-shadow: 0 0 30px rgba(201, 168, 76, 0.2);
        }

        .rr-coin-label {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #737373;
        }

        .rr-fake-btn {
          padding: 10px 32px;
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
        .rr-fake-btn:hover {
          background: rgba(201, 168, 76, 0.1);
          border-color: #C9A84C;
        }
        .rr-fake-btn:disabled {
          cursor: default;
          opacity: 0.4;
        }
        .rr-fake-btn.rr-correct {
          background: rgba(74, 124, 89, 0.2);
          border-color: #4A7C59;
          color: #6BBF7A;
        }
        .rr-fake-btn.rr-incorrect {
          background: rgba(201, 168, 76, 0.15);
          border-color: #C9A84C;
          color: #C9A84C;
        }

        /* ========== RESULT CARD ========== */
        .rr-result {
          width: 100%;
          max-width: 900px;
          background: #F5EDD8;
          border-radius: 12px;
          padding: 32px 36px;
          margin-top: 24px;
          animation: rr-slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes rr-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .rr-result-verdict {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .rr-result-verdict.correct { color: #4A7C59; }
        .rr-result-verdict.incorrect { color: #B8860B; }

        .rr-result-coin {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          color: #C9A84C;
          margin-bottom: 4px;
        }

        .rr-result-method {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #8B7D6B;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(139, 125, 107, 0.2);
        }

        .rr-result-explanation {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          line-height: 1.8;
          color: #3D3428;
          margin-bottom: 24px;
        }

        .rr-next-btn {
          float: right;
          padding: 12px 28px;
          border-radius: 100px;
          border: none;
          background: #C9A84C;
          color: #1C1409;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .rr-next-btn:hover {
          background: #D4B35C;
        }

        /* ========== FINAL SCREEN ========== */
        .rr-final {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 80px 40px;
          text-align: center;
        }

        .rr-final-score {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(4rem, 12vw, 7rem);
          font-weight: 300;
          color: #C9A84C;
          line-height: 1;
          margin-bottom: 8px;
        }

        .rr-final-of {
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #737373;
          margin-bottom: 40px;
        }

        .rr-final-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 5vw, 2.6rem);
          font-weight: 300;
          font-style: italic;
          color: #C9A84C;
          margin-bottom: 32px;
        }

        .rr-final-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          line-height: 1.8;
          color: #d0d0d0;
          max-width: 600px;
          margin-bottom: 48px;
        }

        .rr-final-btn {
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
        .rr-final-btn:hover {
          background: rgba(201, 168, 76, 0.1);
          border-color: #C9A84C;
        }

        /* ========== MOBILE ========== */
        @media (max-width: 700px) {
          .rr-main { padding: 90px 20px 40px; }
          .rr-coins-row {
            flex-direction: column;
            gap: 24px;
            align-items: center;
          }
          .rr-coin-slot { max-width: 280px; }
          .rr-result { padding: 24px 20px; }
        }
      `}</style>

      {/* Header */}
      <header className="rr-header">
        <button className="rr-back-btn" onClick={() => router.push('/exhibitions/in-their-hands')}>
          <span>{'\u2190'}</span>
          Exhibition
        </button>
        {gameState !== 'finished' && (
          <span className="rr-score-display">
            Round {currentRound + 1} of {rounds.length} &middot; Score: {score}
          </span>
        )}
      </header>

      {gameState !== 'finished' ? (
        <main className="rr-main">
          <h1 className="rr-title">Which is the fake?</h1>

          <div className="rr-coins-row">
            {/* Coin A */}
            <div className="rr-coin-slot">
              <div className={`rr-coin-img-wrap ${getImageBorder('a')}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coinA} alt="Coin A" />
              </div>
              <span className="rr-coin-label">Coin A</span>
              <button
                className={`rr-fake-btn ${getBtnClass('a')}`}
                onClick={() => handleChoice('a')}
                disabled={gameState === 'answered'}
              >
                Fake
              </button>
            </div>

            {/* Coin B */}
            <div className="rr-coin-slot">
              <div className={`rr-coin-img-wrap ${getImageBorder('b')}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coinB} alt="Coin B" />
              </div>
              <span className="rr-coin-label">Coin B</span>
              <button
                className={`rr-fake-btn ${getBtnClass('b')}`}
                onClick={() => handleChoice('b')}
                disabled={gameState === 'answered'}
              >
                Fake
              </button>
            </div>
          </div>

          {/* Result card */}
          {gameState === 'answered' && (
            <div className="rr-result">
              <p className={`rr-result-verdict ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? 'Correct!' : 'Not quite!'}
              </p>
              <p className="rr-result-coin">{round.coinName}</p>
              <p className="rr-result-method">Method: {round.method}</p>
              <p className="rr-result-explanation">{round.explanation}</p>
              <button className="rr-next-btn" onClick={nextRound}>
                {isLastRound ? 'See Results' : 'Next Round'} {'\u2192'}
              </button>
            </div>
          )}
        </main>
      ) : (
        <div className="rr-final">
          <p className="rr-final-score">{score}</p>
          <p className="rr-final-of">out of {rounds.length}</p>
          <h1 className="rr-final-title">You are now a numismatist.</h1>
          <p className="rr-final-text">
            Every coin in this exhibition was once held by someone. The question of whether a coin is genuine is not an academic exercise — it is the question of whether the object in front of you really was there. A genuine Pontius Pilate prutah was minted in Jerusalem in the year of the Crucifixion. Someone held it. That matters. Authentication is how we protect that connection between the present and the past.
          </p>
          <button className="rr-final-btn" onClick={() => router.push('/exhibitions/in-their-hands')}>
            Back to Exhibition {'\u2192'}
          </button>
        </div>
      )}
    </div>
  );
}
