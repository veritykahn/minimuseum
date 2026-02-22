'use client';

import { useState, useCallback } from 'react';
import {
  UserType,
  GradeLevel,
  LibrarianGradeLevel,
  Subject,
  TEACHER_LESSON_PLANS,
  TEACHER_HANDOUTS,
  SUBJECT_LESSON_PLANS,
  SUBJECT_HANDOUTS,
  LIBRARIAN_LESSON_PLANS,
  LIBRARIAN_HANDOUTS,
} from '../data/resource-data';

/**
 * Hook for managing the resource wizard state and logic
 */
export function useResourceWizard() {
  const [userType, setUserType] = useState<UserType>(null);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>(null);
  const [librarianGradeLevel, setLibrarianGradeLevel] = useState<LibrarianGradeLevel>(null);
  const [subject, setSubject] = useState<Subject>(null);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  // Animate transition between wizard steps
  const animateTransition = useCallback((callback: () => void) => {
    setFadeState('out');
    setTimeout(() => {
      callback();
      setFadeState('in');
    }, 300);
  }, []);

  // Selection handlers with animation
  const selectUserType = useCallback((type: UserType) => {
    animateTransition(() => setUserType(type));
  }, [animateTransition]);

  const selectGradeLevel = useCallback((grade: GradeLevel) => {
    animateTransition(() => setGradeLevel(grade));
  }, [animateTransition]);

  const selectLibrarianGradeLevel = useCallback((grade: LibrarianGradeLevel) => {
    animateTransition(() => setLibrarianGradeLevel(grade));
  }, [animateTransition]);

  const selectSubject = useCallback((subj: Subject) => {
    animateTransition(() => setSubject(subj));
  }, [animateTransition]);

  const startOver = useCallback(() => {
    animateTransition(() => {
      setUserType(null);
      setGradeLevel(null);
      setLibrarianGradeLevel(null);
      setSubject(null);
    });
  }, [animateTransition]);

  // Determine current step
  const currentStep = {
    showIntro: userType === null,
    showParentDownload: userType === 'parent',
    showGradeSelection: userType === 'teacher' && gradeLevel === null,
    showSubjectSelection: userType === 'teacher' && gradeLevel === 'grades-5-8' && subject === null,
    showTeacherDownloads: userType === 'teacher' && gradeLevel !== null && (gradeLevel !== 'grades-5-8' || subject !== null),
    showLibrarianGradeSelection: userType === 'librarian' && librarianGradeLevel === null,
    showLibrarianDownloads: userType === 'librarian' && librarianGradeLevel !== null,
  };

  // Build teacher lesson plan path
  const getTeacherLessonPlanPath = useCallback(() => {
    const base = `/resources/harlem-renaissance/teachers`;
    if (gradeLevel === 'grades-5-8' && subject) {
      return `${base}/grades-5-8/${subject}/${encodeURIComponent(SUBJECT_LESSON_PLANS[subject])}`;
    }
    if (gradeLevel && TEACHER_LESSON_PLANS[gradeLevel]) {
      return `${base}/${gradeLevel}/${encodeURIComponent(TEACHER_LESSON_PLANS[gradeLevel])}`;
    }
    return '';
  }, [gradeLevel, subject]);

  // Build teacher handout paths
  const getTeacherHandoutPath = useCallback((level: 'green' | 'yellow' | 'red') => {
    const base = `/resources/harlem-renaissance/teachers`;
    if (gradeLevel === 'grades-5-8' && subject) {
      return `${base}/grades-5-8/${subject}/${encodeURIComponent(SUBJECT_HANDOUTS[subject][level])}`;
    }
    if (gradeLevel && TEACHER_HANDOUTS[gradeLevel]) {
      return `${base}/${gradeLevel}/${encodeURIComponent(TEACHER_HANDOUTS[gradeLevel][level])}`;
    }
    return '';
  }, [gradeLevel, subject]);

  // Build librarian lesson plan path
  const getLibrarianLessonPlanPath = useCallback(() => {
    if (librarianGradeLevel && LIBRARIAN_LESSON_PLANS[librarianGradeLevel]) {
      return `/resources/harlem-renaissance/librarians/${librarianGradeLevel}/${encodeURIComponent(LIBRARIAN_LESSON_PLANS[librarianGradeLevel])}`;
    }
    return '';
  }, [librarianGradeLevel]);

  // Build librarian handout paths
  const getLibrarianHandoutPath = useCallback((level: 'green' | 'yellow' | 'red') => {
    if (librarianGradeLevel && LIBRARIAN_HANDOUTS[librarianGradeLevel]) {
      return `/resources/harlem-renaissance/librarians/${librarianGradeLevel}/${encodeURIComponent(LIBRARIAN_HANDOUTS[librarianGradeLevel][level])}`;
    }
    return '';
  }, [librarianGradeLevel]);

  return {
    // State
    userType,
    gradeLevel,
    librarianGradeLevel,
    subject,
    fadeState,
    currentStep,

    // Actions
    selectUserType,
    selectGradeLevel,
    selectLibrarianGradeLevel,
    selectSubject,
    startOver,

    // Path builders
    getTeacherLessonPlanPath,
    getTeacherHandoutPath,
    getLibrarianLessonPlanPath,
    getLibrarianHandoutPath,
  };
}
