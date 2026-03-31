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
    story: "Augustus ordered a census of the entire empire for tax purposes. This meant everyone had to return to their ancestral town to register. It is the reason Mary and Joseph travelled from Nazareth to Bethlehem, where Jesus was born. Augustus ruled from Rome and never visited Judaea. This bronze coin was minted during his reign and would have circulated widely across the empire."
  },
  {
    id: 2,
    ruler: "Herod the Great",
    reference: "Matthew 2:13\u201316",
    coin: "AE Prutah · 40–4 BC · Hendin 1177",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/herod-great-front.png",
    painting: "/exhibitions/in-their-hands/timeline/great-tissot.jpg",
    passage: "An angel of the Lord appeared to Joseph in a dream. \u2018Get up,\u2019 he said, \u2018take the child and his mother and escape to Egypt. Stay there until I tell you, for Herod is going to search for the child to kill him.\u2019",
    story: "After the Magi told Herod that a new king had been born in Bethlehem, Herod ordered the killing of all boys under two in the town. Joseph was warned in a dream and the Holy Family fled to Egypt. Herod died in 4 BC, the same year as his command. His coins carry no human image because Jewish law forbade it \u2014 the symbols on this small bronze prutah reflect the compromise between Roman power and Jewish religious practice."
  },
  {
    id: 3,
    ruler: "Aretas IV",
    reference: "Mark 6:17\u201318",
    coin: "AE Prutah · 9 BC–40 AD · Hendin CB168",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/aretas-front.png",
    painting: "/exhibitions/in-their-hands/timeline/baptist-tissot.jpg",
    passage: "For Herod himself had given orders to have John arrested, and he had him bound and put in prison. He did this because of Herodias, his brother Philip\u2019s wife, whom he had married. For John had been saying to Herod, \u2018It is not lawful for you to have your brother\u2019s wife.\u2019",
    story: "Herod Antipas divorced his first wife \u2014 the daughter of King Aretas IV of Nabataea \u2014 to marry Herodias. John the Baptist publicly condemned the marriage and was arrested and beheaded. Aretas later went to war against Antipas in revenge for the divorce and defeated him. Years later, Paul had to escape from Damascus to avoid Aretas\u2019s governor, and was lowered over the city wall in a basket (2 Corinthians 11:32\u201333). This single coin connects to three different New Testament stories."
  },
  {
    id: 4,
    ruler: "The Widow\u2019s Mite",
    reference: "Mark 12:41\u201344",
    coin: "Lepton · 103–76 BC, circulating 1st c. AD · Hendin 1150",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/widow-1-front.png",
    painting: "/exhibitions/in-their-hands/timeline/widow-tissot.jpg",
    passage: "Jesus sat down opposite the place where the offerings were put and watched the crowd putting their money into the temple treasury. Many rich people threw in large amounts. But a poor widow came and put in two very small copper coins, worth only a few pence. Calling his disciples to him, Jesus said, \u2018Truly I tell you, this poor widow has put more into the treasury than all the others. They all gave out of their wealth; but she, out of her poverty, put in everything \u2014 all she had to live on.\u2019",
    story: "The lepton was the smallest denomination in circulation, worth less than half a penny. Jesus said this widow\u2019s two tiny coins were worth more than all the large donations because she gave everything she had. This was his last public teaching before the Passion. Two specimens are displayed in the exhibition because the Gospel specifies two coins."
  },
  {
    id: 5,
    ruler: "The Tribute Penny",
    reference: "Matthew 22:19\u201321",
    coin: "Silver Denarius · 14–37 AD · RIC I 30 · REPLICA",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/tribute-front.png",
    painting: "/exhibitions/in-their-hands/timeline/tribute-tissot.jpg",
    passage: "\u2018Show me the coin used for paying the tax.\u2019 They brought him a denarius, and he asked them, \u2018Whose image is this? And whose inscription?\u2019 \u2018Caesar\u2019s,\u2019 they replied. Then he said to them, \u2018So give back to Caesar what is Caesar\u2019s, and to God what is God\u2019s.\u2019",
    story: "The Pharisees were trying to trap Jesus. If he said people should pay the Roman tax, he would anger the Jewish crowd. If he said they shouldn\u2019t, he could be reported to Rome. Jesus asked to see the coin and pointed out that it carried Caesar\u2019s image. The denarius bore the face of Tiberius on one side and the inscription PONTIF MAXIM \u2014 meaning High Priest \u2014 on the other. The claim that Caesar was a high priest would have been offensive to Jewish belief. This replica is the exact type of coin Jesus would have held."
  },
  {
    id: 6,
    ruler: "The Tyrian Shekel",
    reference: "Matthew 26:14\u201315",
    coin: "Silver Shekel · 1 BC–1 AD · Hendin 1621 · REPLICA",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/shekel.png",
    painting: "/exhibitions/in-their-hands/timeline/judas-tissot.jpg",
    passage: "Then one of the Twelve \u2014 the one called Judas Iscariot \u2014 went to the chief priests and asked, \u2018What are you willing to give me if I deliver him over to you?\u2019 So they counted out for him thirty pieces of silver.",
    story: "The thirty pieces of silver were almost certainly Tyrian shekels. The Temple only accepted Tyrian shekels for the annual tax because they had the highest silver purity in circulation. So the coin that every Jewish man used for worship became the coin used to pay for betrayal. The same coin type appears in another Gospel story: in Matthew 17:27, Jesus tells Peter to go fishing and says he will find a coin in the mouth of the first fish he catches \u2014 a stater, worth exactly one Tyrian shekel, enough to pay the Temple tax for both of them."
  },
  {
    id: 7,
    ruler: "Pontius Pilate",
    reference: "Matthew 27:24",
    coin: "AE Prutah · 29/30 AD (RY16 of Tiberius) · Hendin 6370",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/pilate-front.png",
    painting: "/exhibitions/in-their-hands/timeline/pilate-tissot.jpg",
    passage: "When Pilate saw that he was getting nowhere, but that instead an uproar was starting, he took water and washed his hands in front of the crowd. \u2018I am innocent of this man\u2019s blood,\u2019 he said. \u2018It is your responsibility!\u2019",
    story: "Pontius Pilate was the Roman prefect of Judaea from 26 to 36 AD. Some scholars doubted he existed at all until 1961, when a limestone block inscribed with his name was found at Caesarea Maritima. This coin was minted in 29 or 30 AD \u2014 the precise year of the Crucifixion. It carries pagan religious symbols that were deliberately provocative on Jewish coinage. You are looking at a coin made by the man who sentenced Jesus to death, struck in the year he did it."
  },
  {
    id: 8,
    ruler: "Herod Antipas",
    reference: "Luke 23:8\u20139",
    coin: "AE Prutah · 4 BC–39 AD · Hendin 1204 · REPLICA",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/antipas-front.png",
    painting: "/exhibitions/in-their-hands/timeline/herod-tissot.jpg",
    passage: "When Herod saw Jesus, he was greatly pleased, because for a long time he had been wanting to see him. From what he had heard about him, he hoped to see him perform a sign of some sort. He plied him with many questions, but Jesus gave him no answer.",
    story: "During the trial, Pilate sent Jesus to Herod Antipas for questioning because Jesus was from Galilee, which was Antipas\u2019s territory. Antipas had been curious about Jesus for a long time and hoped to see him perform a miracle. But Jesus refused to speak to him at all. Antipas mocked him, dressed him in a fine robe, and sent him back to Pilate. Jesus spoke to Pilate, to the High Priest, and to his accusers \u2014 but he gave Antipas nothing. Not one word. It is the only silence in the entire Passion narrative."
  },
  {
    id: 9,
    ruler: "Herod Agrippa I",
    reference: "Acts 12:1\u20133",
    coin: "AE Prutah · 41–44 AD · Hendin 1244",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/agrippa-front.png",
    painting: "/exhibitions/in-their-hands/timeline/agrippa-zurbaran.jpg",
    passage: "It was about this time that King Herod arrested some who belonged to the church, intending to persecute them. He had James, the brother of John, put to death with the sword. When he saw that this met with approval among the Jews, he proceeded to seize Peter also.",
    story: "Herod Agrippa I was the grandson of Herod the Great. He had the apostle James executed \u2014 making James the first of the twelve apostles to be martyred. He then arrested Peter as well. Shortly afterwards, Agrippa himself died. His death is described in both Acts 12:23 and by the Jewish historian Josephus in almost identical terms: he was struck down and eaten by worms. This small bronze prutah was minted during the brief years of his reign."
  },
  {
    id: 10,
    ruler: "Emperor Claudius",
    reference: "Acts 18:1\u20133",
    coin: "AE As · 41–54 AD · RIC I 100",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/claudius-front.png",
    painting: "/exhibitions/in-their-hands/timeline/paul-tissot.jpg",
    passage: "After this, Paul left Athens and went to Corinth. There he met a Jew named Aquila, a native of Pontus, who had recently come from Italy with his wife Priscilla, because Claudius had ordered all Jews to leave Rome. Paul went to see them, and because he was a tentmaker as they were, he stayed and worked with them.",
    story: "Around 49 AD, the Emperor Claudius expelled all Jews from Rome. The Roman historian Suetonius confirms this. The expulsion forced a married couple called Aquila and Priscilla to leave Italy and travel to Corinth. When Paul arrived in Corinth, he met them and they worked together as tentmakers. Aquila and Priscilla became two of Paul\u2019s most important partners in spreading the early Church. Without Claudius\u2019s edict, they would never have been in Corinth when Paul arrived. This coin was minted during Claudius\u2019s reign."
  },
  {
    id: 11,
    ruler: "Porcius Festus",
    reference: "Acts 25:10\u201312",
    coin: "AE Prutah · 59–62 AD · Hendin 1348 · NGC Certified",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/festus-front.png",
    painting: "/exhibitions/in-their-hands/timeline/festus-surikov.jpg",
    passage: "Paul answered: \u2018I am now standing before Caesar\u2019s court, where I ought to be tried. I have not done any wrong to the Jews, as you yourself know very well. I appeal to Caesar!\u2019 After Festus had conferred with his advisers, he declared: \u2018You have appealed to Caesar. To Caesar you will go!\u2019",
    story: "Paul had been held prisoner in Caesarea for two years. When Porcius Festus arrived as the new governor, he tried to send Paul back to Jerusalem to face trial, but Paul knew an ambush was planned for the journey. He used his right as a Roman citizen to appeal directly to the Emperor. Festus had no choice but to grant the appeal. This is what sent Paul on his journey to Rome. This coin was minted by Festus during the exact years described in Acts, and has been independently authenticated by NGC, the world\u2019s largest coin grading service. Professional numismatists have confirmed it is genuine."
  }
];

export default function GospelTimeline() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
          padding: 32px 36px;
          height: 55vh;
          max-height: 500px;
          display: flex;
          flex-direction: column;
          box-shadow:
            0 20px 60px rgba(0,0,0,0.4),
            0 2px 10px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.3);
          transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .tl-card-header {
          flex-shrink: 0;
        }

        .tl-card-body {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
          padding-right: 8px;
        }
        .tl-card-body::-webkit-scrollbar {
          width: 4px;
        }
        .tl-card-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .tl-card-body::-webkit-scrollbar-thumb {
          background: rgba(139, 125, 107, 0.3);
          border-radius: 2px;
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
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .tl-painting-inset img:hover {
          transform: scale(1.02);
          box-shadow:
            0 20px 60px rgba(0,0,0,0.6),
            0 6px 16px rgba(0,0,0,0.4);
        }

        /* ========== PAINTING MODAL ========== */
        .tl-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 300;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .tl-modal-backdrop.open {
          opacity: 1;
          visibility: visible;
        }
        .tl-modal-backdrop img {
          max-width: 90vw;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 4px;
          box-shadow: 0 20px 80px rgba(0,0,0,0.6);
        }
        .tl-modal-close {
          position: fixed;
          top: 24px;
          right: 24px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(0,0,0,0.5);
          color: #fafafa;
          font-size: 22px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 310;
        }
        .tl-modal-close:hover {
          background: rgba(255,255,255,0.15);
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
            <div className="tl-card-header">
              <h2 className="tl-card-ruler">{stop.ruler}</h2>
              <p className="tl-card-coin">{stop.coin}</p>
              <p className="tl-card-reference">{stop.reference}</p>
            </div>
            <div className="tl-card-body">
              <p className="tl-card-passage">&ldquo;{stop.passage}&rdquo;</p>
              <p className="tl-card-story">{stop.story}</p>

              {isLast && (
                <button className="tl-end-btn" onClick={() => router.push('/exhibitions/in-their-hands')}>
                  Back to Exhibition {'\u2192'}
                </button>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Painting inset — right side, click for fullscreen */}
      <div className={`tl-painting-inset ${transitioning ? 'fading' : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={stop.painting} alt={`${stop.ruler} — painting`} onClick={() => setShowModal(true)} />
      </div>

      {/* Fullscreen painting modal */}
      <div className={`tl-modal-backdrop ${showModal ? 'open' : ''}`} onClick={() => setShowModal(false)}>
        <button className="tl-modal-close" onClick={() => setShowModal(false)}>{'\u00D7'}</button>
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
