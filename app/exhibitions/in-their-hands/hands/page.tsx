'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const handsCharacters = [
  {
    id: 1,
    character: "The Roman Soldier",
    coinName: "Pontius Pilate Prutah",
    coinDate: "26–36 AD",
    prompt: "Whose hands held this Pilate Prutah?",
    caption: "Pontius Pilate Prutah \u00B7 26\u201336 AD",
    fullImage: "/exhibitions/in-their-hands/Hands/roman-soldier-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/roman-soldier-hands-v1.jpg",
    story: "A Roman soldier garrisoned in Jerusalem. Soldiers were paid in local currency, and in Judaea that meant small bronze prutot minted by the Roman prefect Pontius Pilate. These coins carried pagan symbols \u2014 a simpulum and a lituus \u2014 that were deliberately provocative in a Jewish province. A soldier would have used coins like this one to buy food and supplies in the Jerusalem market. This particular coin was minted in 29 or 30 AD, the precise year of the Crucifixion. The man who made it sentenced Jesus to death."
  },
  {
    id: 2,
    character: "The Temple Priest",
    coinName: "Tyrian Shekel",
    coinDate: "1st century BC\u20131st century AD",
    prompt: "Whose hands held this Tyrian Shekel?",
    caption: "Tyrian Shekel \u00B7 1st century BC\u20131st century AD",
    fullImage: "/exhibitions/in-their-hands/Hands/temple-priest-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/temple-priest-hands-v2.jpg",
    story: "A priest working at the Temple treasury in Jerusalem. Every Jewish man over twenty owed a half-shekel Temple tax each year, and the Temple only accepted one coin: the Tyrian shekel, because it had the highest silver purity in circulation. Priests handled hundreds of these every day. In Matthew 26:15, the chief priests count out thirty silver coins to pay Judas for betraying Jesus. Those thirty coins were almost certainly Tyrian shekels \u2014 the same type this priest is holding. The coin required for worship became the price of betrayal."
  },
  {
    id: 3,
    character: "The Widow",
    coinName: "Widow\u2019s Mite \u2014 Lepton",
    coinDate: "1st century AD",
    prompt: "Whose hands held this Lepton?",
    caption: "Widow\u2019s Mite \u2014 Lepton \u00B7 1st century AD",
    fullImage: "/exhibitions/in-their-hands/Hands/widow-full-v4.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/widow-hands-v2.jpg",
    story: "A widow at the Temple treasury in Jerusalem. Being a widow, she would have had very little. The lepton was the smallest denomination in circulation \u2014 worth less than half a penny. In Mark 12:41\u201344, Jesus watches people putting money into the treasury. Many rich people throw in large amounts. Then a poor widow puts in two leptons \u2014 everything she has. Jesus tells his disciples that she has given more than all the others, because they gave from their surplus but she gave from her poverty. Two specimens are displayed in this exhibition because the Gospel specifies two coins."
  },
  {
    id: 4,
    character: "The Merchant",
    coinName: "Augustus AE As",
    coinDate: "5\u20134 BC",
    prompt: "Whose hands held this Augustus As?",
    caption: "Augustus AE As \u00B7 5\u20134 BC",
    fullImage: "/exhibitions/in-their-hands/Hands/merchant-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/merchant-hands-v2.jpg",
    story: "A merchant in the marketplace, handling the day\u2019s takings. Roman coins circulated throughout the empire, and a trader would have handled bronze coins bearing the face of Augustus Caesar regularly. Augustus is the emperor who ordered the census described in Luke 2:1 \u2014 the census that sent Mary and Joseph from Nazareth to Bethlehem, where Jesus was born. Augustus ruled the entire Roman world from Rome. He never visited Judaea and almost certainly never thought about it. But his administrative order set the Nativity in motion."
  },
  {
    id: 5,
    character: "The Mother",
    coinName: "Herod the Great Prutah",
    coinDate: "40\u20134 BC",
    prompt: "Whose hands held this Herod Prutah?",
    caption: "Herod the Great Prutah \u00B7 40\u20134 BC",
    fullImage: "/exhibitions/in-their-hands/Hands/mother-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/mother-hands-v1.jpg",
    story: "A mother in Bethlehem, 4 BC. Small bronze prutot minted by Herod were the everyday currency in Judaea \u2014 used to buy bread, oil, and household goods. The coins carry no human image because Jewish law forbade it. In Matthew 2:13\u201316, Herod orders the killing of all boys in Bethlehem under the age of two after learning from the Magi that a new king has been born. An angel warns Joseph in a dream, and the Holy Family flees to Egypt. Other families in Bethlehem received no warning. A mother holding one of Herod\u2019s coins may not yet have known what his soldiers had been ordered to do."
  },
  {
    id: 6,
    character: "Paul of Tarsus",
    coinName: "Porcius Festus Prutah",
    coinDate: "59\u201362 AD",
    prompt: "Whose hands held this Festus Prutah?",
    caption: "Porcius Festus Prutah \u00B7 59\u201362 AD",
    fullImage: "/exhibitions/in-their-hands/Hands/paul-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/paul-hands-v1.jpg",
    story: "Paul of Tarsus, a prisoner in Caesarea. He had been held for two years when Porcius Festus arrived as the new Roman governor. Festus minted his own coins in Judaea \u2014 small bronze prutot like this one. In Acts 25:10\u201312, Festus tries to send Paul back to Jerusalem to face trial, but Paul knows an ambush is waiting. He invokes his right as a Roman citizen and appeals directly to the Emperor. Festus confers with his council and replies: \u201CYou have appealed to Caesar. To Caesar you will go.\u201D This coin was minted by the man who sent Paul to Rome."
  },
  {
    id: 7,
    character: "The Daughter of Aretas",
    coinName: "Aretas IV Prutah",
    coinDate: "9 BC\u201340 AD",
    prompt: "Whose hands held this Aretas Prutah?",
    caption: "Aretas IV Prutah \u00B7 9 BC\u201340 AD",
    fullImage: "/exhibitions/in-their-hands/Hands/aretas-daughter-full-v2.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/aretas-daughter-hands-v1.jpg",
    story: "The daughter of King Aretas IV of Nabataea. She was married to Herod Antipas, but Antipas divorced her to marry Herodias, his own brother\u2019s wife. The princess returned to her father\u2019s court in Petra. In Mark 6:17\u201318, John the Baptist publicly condemns the marriage between Antipas and Herodias. He is arrested and eventually beheaded. Aretas later went to war against Antipas in retaliation for the divorce and defeated him. She is never named in the Gospels, but her divorce is the event that triggered John\u2019s condemnation, his imprisonment, and his death. This is her father\u2019s coin \u2014 the coin of the Nabataean kingdom she returned to."
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
        .hh-image-caption {
          position: absolute;
          bottom: 24px;
          left: 24px;
          z-index: 5;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          color: #C9A84C;
          opacity: 0.8;
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
            <p className="hh-image-caption">{character.caption}</p>
          </div>

          {/* Right: question panel */}
          <div className="hh-panel">
            {roundState === 'guessing' ? (
              <>
                <h2 className="hh-question">{character.prompt}</h2>
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
