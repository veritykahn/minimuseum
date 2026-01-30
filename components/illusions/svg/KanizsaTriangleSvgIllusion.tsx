'use client';

import { useState } from 'react';
import { IllusionProps } from '../types';
import { IllusionWrapper } from '../IllusionWrapper';
import { IllusionButton } from '../IllusionButton';
import { ScienceButton } from '../ScienceButton';
import { useIllusionStyles } from '../hooks/useIllusionStyles';

export function KanizsaTriangleSvgIllusion({
  question,
  answer,
  scienceExplanation,
  isPoster1,
}: IllusionProps) {
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const styles = useIllusionStyles(isPoster1);
  const textColor = isPoster1 ? '#2a2a2a' : '#a8d5e5';

  return (
    <IllusionWrapper
      name="Kanizsa Triangle"
      question={question || 'Do you see a bright white triangle?'}
      isPoster1={isPoster1}
      scienceExplanation={scienceExplanation}
      showScience={showScience}
      onCloseScience={() => setShowScience(false)}
      answerContent={
        <p style={revealed ? styles.answerVisible : styles.answerHidden}>
          {answer || "NO TRIANGLE EXISTS — Your brain creates illusory contours from the pac-man shapes and line gaps. The \"triangle\" appears brighter than the background, even though it's the same white."}
        </p>
      }
      buttons={
        !revealed ? (
          <IllusionButton onClick={() => setRevealed(true)} isPoster1={isPoster1}>
            Reveal
          </IllusionButton>
        ) : (
          <>
            <IllusionButton onClick={() => setRevealed(false)} isPoster1={isPoster1}>
              See Illusion
            </IllusionButton>
            <ScienceButton onClick={() => setShowScience(true)} textColor={textColor} />
          </>
        )
      }
    >
      <div style={{ background: '#f5f5f5', padding: '40px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 300 280" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
          {/* Three pac-man shapes at corners */}
          {/* Top pac-man */}
          <path
            d={revealed
              ? "M 150 30 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0"
              : "M 150 30 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0 M 150 30 L 135 55 L 165 55 Z"
            }
            fill="#a8d5e5"
            fillRule="evenodd"
            style={{ transition: 'all 0.5s ease' }}
          />

          {/* Bottom left pac-man */}
          <path
            d={revealed
              ? "M 60 230 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0"
              : "M 60 230 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0 M 60 230 L 75 205 L 85 230 Z"
            }
            fill="#a8d5e5"
            fillRule="evenodd"
            style={{ transition: 'all 0.5s ease' }}
          />

          {/* Bottom right pac-man */}
          <path
            d={revealed
              ? "M 240 230 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0"
              : "M 240 230 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0 M 240 230 L 225 205 L 215 230 Z"
            }
            fill="#a8d5e5"
            fillRule="evenodd"
            style={{ transition: 'all 0.5s ease' }}
          />

          {/* Outline triangle with gaps */}
          <line x1="80" y1="200" x2="110" y2="145" stroke="#a8d5e5" strokeWidth="3" opacity={revealed ? 0 : 1} style={{ transition: 'opacity 0.5s ease' }} />
          <line x1="140" y1="85" x2="160" y2="85" stroke="#a8d5e5" strokeWidth="3" opacity={revealed ? 0 : 1} style={{ transition: 'opacity 0.5s ease' }} />
          <line x1="190" y1="145" x2="220" y2="200" stroke="#a8d5e5" strokeWidth="3" opacity={revealed ? 0 : 1} style={{ transition: 'opacity 0.5s ease' }} />
        </svg>
      </div>
    </IllusionWrapper>
  );
}
