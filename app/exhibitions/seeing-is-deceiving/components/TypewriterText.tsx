'use client';

import { useState, useEffect } from 'react';

type TypewriterTextProps = {
  text: string;
  onComplete?: () => void;
  color: string;
};

export function TypewriterText({ text, onComplete, color }: TypewriterTextProps) {
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
    return undefined;
  }, [currentIndex, text, onComplete]);

  return (
    <span style={{ color }}>
      {displayedText}
      <span className="typewriter-cursor">|</span>
    </span>
  );
}
