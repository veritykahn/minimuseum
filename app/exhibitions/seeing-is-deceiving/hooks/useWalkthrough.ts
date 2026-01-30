'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { poster1Content, poster2Content, ContentItem } from '../data/poster-content';

export type ViewType = 'main' | 'poster1' | 'poster2' | 'artifacts';

export function useWalkthrough() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<ViewType>('main');
  const [posterStep, setPosterStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  const currentPosterContent: ContentItem[] = activeView === 'poster1' ? poster1Content : poster2Content;
  const currentItem = currentPosterContent[posterStep];
  const isPoster1 = activeView === 'poster1';

  // Colors
  const wavesBlue = '#a8d5e5';
  const darkCharcoal = '#2a2a2a';
  const bgColor = isPoster1 ? '#e0dede' : '#0a0a0a';
  const textColor = isPoster1 ? darkCharcoal : wavesBlue;

  const handleBack = useCallback(() => {
    router.push('/exhibitions/first-floor');
  }, [router]);

  const openPoster = useCallback((poster: 'poster1' | 'poster2') => {
    setFadeIn(false);
    setTimeout(() => {
      setActiveView(poster);
      setPosterStep(0);
      setAnimationKey(prev => prev + 1);
      setFadeIn(true);
    }, 300);
  }, []);

  const nextStep = useCallback(() => {
    if (posterStep < currentPosterContent.length - 1) {
      setFadeIn(false);
      setTimeout(() => {
        setPosterStep(prev => prev + 1);
        setAnimationKey(prev => prev + 1);
        setFadeIn(true);
      }, 400);
    }
  }, [posterStep, currentPosterContent.length]);

  const prevStep = useCallback(() => {
    if (posterStep > 0) {
      setFadeIn(false);
      setTimeout(() => {
        setPosterStep(prev => prev - 1);
        setAnimationKey(prev => prev + 1);
        setFadeIn(true);
      }, 400);
    }
  }, [posterStep]);

  const returnToMain = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => {
      setActiveView('main');
      setPosterStep(0);
      setFadeIn(true);
    }, 300);
  }, []);

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

  return {
    // State
    activeView,
    posterStep,
    fadeIn,
    animationKey,
    currentItem,
    currentPosterContent,
    isPoster1,

    // Colors
    bgColor,
    textColor,
    wavesBlue,
    darkCharcoal,

    // Actions
    handleBack,
    openPoster,
    nextStep,
    prevStep,
    returnToMain,

    // Helpers
    getPositionClass,
    getEffectClass,

    // Router
    router,
  };
}
