'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type UserType = 'parent' | 'teacher' | 'librarian' | null;
type GradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-4' | 'grades-5-8' | null;
type LibrarianGradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-5' | 'grades-6-8' | null;
type Subject = 'science' | 'ela' | 'social-studies' | 'art' | 'math' | 'pe' | 'religion' | 'spanish' | 'theater' | 'music' | null;

export default function ResourcesPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>(null);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>(null);
  const [librarianGradeLevel, setLibrarianGradeLevel] = useState<LibrarianGradeLevel>(null);
  const [subject, setSubject] = useState<Subject>(null);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  const handleBack = () => {
    router.push('/exhibitions/seeing-is-deceiving');
  };

  const animateTransition = (callback: () => void) => {
    setFadeState('out');
    setTimeout(() => {
      callback();
      setFadeState('in');
    }, 300);
  };

  const selectUserType = (type: UserType) => {
    animateTransition(() => setUserType(type));
  };

  const selectGradeLevel = (grade: GradeLevel) => {
    animateTransition(() => setGradeLevel(grade));
  };

  const selectLibrarianGradeLevel = (grade: LibrarianGradeLevel) => {
    animateTransition(() => setLibrarianGradeLevel(grade));
  };

  const selectSubject = (subj: Subject) => {
    animateTransition(() => setSubject(subj));
  };

  const startOver = () => {
    animateTransition(() => {
      setUserType(null);
      setGradeLevel(null);
      setLibrarianGradeLevel(null);
      setSubject(null);
    });
  };

  // Determine current step
  const showIntro = userType === null;
  const showParentDownload = userType === 'parent';
  const showGradeSelection = userType === 'teacher' && gradeLevel === null;
  const showSubjectSelection = userType === 'teacher' && gradeLevel === 'grades-5-8' && subject === null;
  const showTeacherDownloads = userType === 'teacher' && gradeLevel !== null && (gradeLevel !== 'grades-5-8' || subject !== null);
  const showLibrarianGradeSelection = userType === 'librarian' && librarianGradeLevel === null;
  const showLibrarianDownloads = userType === 'librarian' && librarianGradeLevel !== null;

  // Teacher file mappings by grade level
  const teacherLessonPlans: Record<string, string> = {
    'prek-k': 'Lesson Plan_ My Eyes Can Trick Me! (PreK-K) - Teacher Guide.pdf',
    'grades-1-2': 'Lesson Plan_ Brain Detective (Grades 1-2) - Teacher Guide.pdf',
    'grades-3-4': 'Lesson Plan_ Fact-Checkers (Grades 3-4) - Teacher Guide.pdf',
  };

  const teacherHandouts: Record<string, Record<string, string>> = {
    'prek-k': {
      green: 'My Eyes Can Play Tricks! - Green Level (PreK-K).pdf',
      yellow: 'My Eyes Can Play Tricks! - Yellow Level (PreK-K).pdf',
      red: 'My Eyes Can Play Tricks! - Red Level (PreK-K).pdf',
    },
    'grades-1-2': {
      green: 'Student Handout_ Brain Detective - Green Level (Grades 1-2).pdf',
      yellow: 'Student Handout_ Brain Detective - Yellow Level (Grades 1-2).pdf',
      red: 'Student Handout_ Brain Detective - Red Level (Grades 1-2).pdf',
    },
    'grades-3-4': {
      green: 'Student Handout_ Fact-Checker Training - Green Level (Grades 3-4).pdf',
      yellow: 'Student Handout_ Fact-Checker Training - Yellow Level (Grades 3-4).pdf',
      red: 'Student Handout_ Fact-Checker Training - Red Level (Grades 3-4).pdf',
    },
  };

  // 5-8 subject-specific file mappings
  const subjectLessonPlans: Record<string, string> = {
    'science': 'Lesson Plan_ How Vision Works (Science 5-8) - Teacher Guide.pdf',
    'ela': 'Lesson Plan_ Evaluating Sources (ELA 5-8) - Teacher Guide.pdf',
    'social-studies': 'Lesson Plan_ Visual Propaganda Through History (Social Studies 5-8) - Teacher Guide.pdf',
    'art': 'Lesson Plan_ Creating Optical Illusions (Art, Grades 5-8) - Teacher Guide.pdf',
    'math': 'Lesson Plan_ Geometry of Perspective (Math 5-8) - Teacher Guide.pdf',
    'pe': 'Lesson Plan_ Vision and Athletics (PE 5-8) - Teacher Guide.pdf',
    'religion': 'Lesson Plan_ Bearing True Witness (Religion 5-8) - Teacher Guide.pdf',
    'spanish': 'Spanish Lesson Plan_ ¿Verdad o Mentira_ (Grades 5-8) - Teacher Guide.pdf',
    'theater': 'Theatre Lesson Plan_ The Art of Illusion (Grades 5-8) - Teacher Guide.pdf',
    'music': 'Music Lesson Plan_ Sound Illusions (Grades 5-8) - Teacher Guide.pdf',
  };

  const subjectHandouts: Record<string, Record<string, string>> = {
    'science': {
      green: 'Student Handout_ The Science of Seeing - Green Level (Science 5-8).pdf',
      yellow: 'Student Handout_ The Science of Seeing - Yellow Level (Science 5-8).pdf',
      red: 'Student Handout_ The Science of Seeing - Red Level (Science 5-8).pdf',
    },
    'ela': {
      green: 'Student Handout_ Source Detective - Green Level (ELA 5-8).pdf',
      yellow: 'Student Handout_ Source Detective - Yellow Level (ELA 5-8).pdf',
      red: 'Student Handout_ Source Detective - Red Level (ELA 5-8).pdf',
    },
    'social-studies': {
      green: 'Student Handout_ Spotting Propaganda - Green Level (Social Studies 5-8).pdf',
      yellow: 'Student Handout_ Spotting Propaganda - Yellow Level (Social Studies 5-8).pdf',
      red: 'Student Handout_ Spotting Propaganda - Red Level (Social Studies 5-8).pdf',
    },
    'art': {
      green: 'Student Handout_ Seeing Is Deceiving - Green Level (Art 5-8).pdf',
      yellow: 'Student Handout_ Seeing Is Deceiving - Yellow Level (Art 5-8).pdf',
      red: 'Student Handout_ Seeing Is Deceiving - Red Level (Art 5-8).pdf',
    },
    'math': {
      green: 'Student Handout_ Math vs. Your Eyes - Green Level (Math 5-8).pdf',
      yellow: 'Student Handout_ Math vs. Your Eyes - Yellow Level (Math 5-8).pdf',
      red: 'Student Handout_ Math vs. Your Eyes - Red Level (Math 5-8).pdf',
    },
    'pe': {
      green: 'Student Handout_ Vision Training for Athletes - Green Level (PE 5-8).pdf',
      yellow: 'Student Handout_ Vision Training for Athletes - Yellow Level (PE 5-8).pdf',
      red: 'Student Handout_ Vision Training for Athletes - Red Level (PE 5-8).pdf',
    },
    'religion': {
      green: 'Student Handout_ Bearing True Witness - Green Level (Religion 5-8).pdf',
      yellow: 'Student Handout_ Bearing True Witness - Yellow Level (Religion 5-8).pdf',
      red: 'Student Handout_ Bearing True Witness - Red Level (Religion 5-8).pdf',
    },
    'spanish': {
      green: 'Student Handout_ ¿Verdad o Mentira_ - Green Level (Spanish 5-8).pdf',
      yellow: 'Student Handout_ ¿Verdad o Mentira_ - Yellow Level (Spanish 5-8).pdf',
      red: 'Student Handout_ ¿Verdad o Mentira_ - Red Level (Spanish 5-8).pdf',
    },
    'theater': {
      green: 'Student Handout_ The Art of Illusion - Green Level (Theatre 5-8).pdf',
      yellow: 'Student Handout_ The Art of Illusion - Yellow Level (Theatre 5-8).pdf',
      red: 'Student Handout_ The Art of Illusion - Red Level (Theatre 5-8).pdf',
    },
    'music': {
      green: 'Student Handout_ Sound Illusions - Green Level (Music 5-8).pdf',
      yellow: 'Student Handout_ Sound Illusions - Yellow Level (Music 5-8).pdf',
      red: 'Student Handout_ Sound Illusions - Red Level (Music 5-8).pdf',
    },
  };

  // Build lesson plan path
  const getLessonPlanPath = () => {
    const base = `/resources/seeing-is-deceiving/teachers`;
    if (gradeLevel === 'grades-5-8' && subject) {
      return `${base}/grades-5-8/${subject}/${encodeURIComponent(subjectLessonPlans[subject])}`;
    }
    if (gradeLevel && teacherLessonPlans[gradeLevel]) {
      return `${base}/${gradeLevel}/${encodeURIComponent(teacherLessonPlans[gradeLevel])}`;
    }
    return '';
  };

  // Build handout paths
  const getHandoutPath = (level: 'green' | 'yellow' | 'red') => {
    const base = `/resources/seeing-is-deceiving/teachers`;
    if (gradeLevel === 'grades-5-8' && subject) {
      return `${base}/grades-5-8/${subject}/${encodeURIComponent(subjectHandouts[subject][level])}`;
    }
    if (gradeLevel && teacherHandouts[gradeLevel]) {
      return `${base}/${gradeLevel}/${encodeURIComponent(teacherHandouts[gradeLevel][level])}`;
    }
    return '';
  };

  // Librarian file mappings by grade level
  const librarianLessonPlans: Record<string, string> = {
    'prek-k': 'Lesson Plan_ My Eyes Can Play Tricks! (PreK-K Library) - Teacher Guide.pdf',
    'grades-1-2': 'Library Lesson Plan_ Look Again! Finding Hidden Pictures (Grades 1-2) - Teacher Guide.pdf',
    'grades-3-5': 'Library Lesson Plan_ Don\'t Be Fooled! Information Detective Skills (Grades 3-5) - Teacher Guide.pdf',
    'grades-6-8': 'Library Lesson Plan_ Seeing Through Deception (Grades 6-8) - Teacher Guide.pdf',
  };

  const librarianHandouts: Record<string, Record<string, string>> = {
    'prek-k': {
      green: 'My Eyes Can Play Tricks! - Green Level (PreK-K).pdf',
      yellow: 'My Eyes Can Play Tricks! - Yellow Level (PreK-K).pdf',
      red: 'My Eyes Can Play Tricks! - Red Level (PreK-K).pdf',
    },
    'grades-1-2': {
      green: 'Student Handout_ Look Again! - Green Level (Library 1-2).pdf',
      yellow: 'Student Handout_ Look Again! - Yellow Level (Library 1-2).pdf',
      red: 'Student Handout_ Look Again! - Red Level (Library 1-2).pdf',
    },
    'grades-3-5': {
      green: 'Student Handout_ Information Detective! - Green Level (Library 3-5).pdf',
      yellow: 'Student Handout_ Information Detective! - Yellow Level (Library 3-5).pdf',
      red: 'Student Handout_ Information Detective! - Red Level (Library 3-5).pdf',
    },
    'grades-6-8': {
      green: 'Student Handout_ Seeing Through Deception - Green Level (Library 6-8).pdf',
      yellow: 'Student Handout_ Seeing Through Deception - Yellow Level (Library 6-8).pdf',
      red: 'Student Handout_ Seeing Through Deception - Red Level (Library 6-8).pdf',
    },
  };

  // Build librarian lesson plan path
  const getLibrarianLessonPlanPath = () => {
    if (librarianGradeLevel && librarianLessonPlans[librarianGradeLevel]) {
      return `/resources/seeing-is-deceiving/librarians/${librarianGradeLevel}/${encodeURIComponent(librarianLessonPlans[librarianGradeLevel])}`;
    }
    return '';
  };

  // Build librarian handout paths
  const getLibrarianHandoutPath = (level: 'green' | 'yellow' | 'red') => {
    if (librarianGradeLevel && librarianHandouts[librarianGradeLevel]) {
      return `/resources/seeing-is-deceiving/librarians/${librarianGradeLevel}/${encodeURIComponent(librarianHandouts[librarianGradeLevel][level])}`;
    }
    return '';
  };

  const gradeLabels: Record<string, string> = {
    'prek-k': 'PreK–K',
    'grades-1-2': 'Grades 1–2',
    'grades-3-4': 'Grades 3–4',
    'grades-5-8': 'Grades 5–8'
  };

  const librarianGradeLabels: Record<string, string> = {
    'prek-k': 'PreK–K',
    'grades-1-2': 'Grades 1–2',
    'grades-3-5': 'Grades 3–5',
    'grades-6-8': 'Grades 6–8'
  };

  const subjectLabels: Record<string, string> = {
    'science': 'Science',
    'ela': 'ELA',
    'social-studies': 'Social Studies',
    'art': 'Art',
    'math': 'Math',
    'pe': 'PE',
    'religion': 'Religion',
    'spanish': 'Spanish',
    'theater': 'Theater',
    'music': 'Music'
  };

  return (
    <div className="resources-page">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; background: #000; }

        .resources-page {
          min-height: 100vh;
          background: #000;
          color: #fafafa;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 120px 24px 80px;
        }

        /* Navigation */
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
        .nav-m:hover .nav-label { opacity: 1; max-width: 150px; }
        .nav-m:hover .nav-arrow-left { transform: translateX(-4px); }
        .nav-m-text { font-size: 28px; font-weight: 300; color: #525252; }
        .nav-arrow { font-size: 16px; color: #7D8471; transition: all 0.3s ease; }
        .nav-label {
          font-size: 13px;
          font-style: italic;
          color: #7D8471;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          white-space: nowrap;
          transition: all 0.4s ease;
        }

        /* Content container */
        .content-container {
          max-width: 700px;
          width: 100%;
          text-align: center;
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .content-container.fade-out {
          opacity: 0;
          transform: translateY(10px);
        }

        /* Title */
        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 6vw, 3.5rem);
          font-weight: 300;
          color: #fafafa;
          margin-bottom: 32px;
        }

        /* Intro text */
        .intro-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 2.5vw, 1.3rem);
          font-weight: 400;
          line-height: 1.8;
          color: #a0a0a0;
          margin-bottom: 48px;
        }

        /* Question */
        .question-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.3rem, 3vw, 1.6rem);
          font-style: italic;
          color: #7D8471;
          margin-bottom: 32px;
        }

        /* Button grid */
        .button-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
          margin-bottom: 48px;
        }

        /* Selection button */
        .selection-btn {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 16px 32px;
          background: transparent;
          border: 1px solid rgba(125, 132, 113, 0.4);
          color: #fafafa;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 140px;
        }
        .selection-btn:hover {
          border-color: #7D8471;
          background: rgba(125, 132, 113, 0.1);
          transform: translateY(-2px);
        }

        /* Section header */
        .section-header {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #7D8471;
          margin-bottom: 20px;
          margin-top: 40px;
        }
        .section-header:first-of-type {
          margin-top: 0;
        }

        /* Description text */
        .description-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1rem, 2vw, 1.15rem);
          line-height: 1.7;
          color: #a0a0a0;
          margin-bottom: 32px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Download section */
        .download-section {
          text-align: left;
          max-width: 500px;
          margin: 0 auto;
        }

        /* Download item */
        .download-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .download-item:last-child {
          border-bottom: none;
        }

        .download-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .download-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          color: #fafafa;
        }

        .download-subtitle {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          color: #666;
          letter-spacing: 0.05em;
        }

        /* Download button */
        .download-btn {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 10px 20px;
          background: transparent;
          border: 1px solid rgba(125, 132, 113, 0.4);
          color: #7D8471;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }
        .download-btn:hover {
          border-color: #7D8471;
          background: rgba(125, 132, 113, 0.15);
          color: #fafafa;
        }

        /* Download all button */
        .download-all-btn {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 16px 32px;
          background: rgba(125, 132, 113, 0.15);
          border: 1px solid #7D8471;
          color: #fafafa;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 32px;
          width: 100%;
        }
        .download-all-btn:hover {
          background: #7D8471;
          color: #000;
        }

        /* Start over link */
        .start-over {
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #525252;
          background: none;
          border: none;
          cursor: pointer;
          margin-top: 48px;
          transition: color 0.3s ease;
        }
        .start-over:hover {
          color: #7D8471;
        }

        /* Context breadcrumb */
        .context-breadcrumb {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #525252;
          margin-bottom: 24px;
        }
        .context-breadcrumb span {
          color: #7D8471;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-m-left { left: 20px; top: 20px; }
          .nav-m-text { font-size: 24px; }
          .resources-page { padding: 100px 20px 60px; }
          .button-grid { gap: 12px; }
          .selection-btn {
            padding: 14px 24px;
            min-width: 120px;
            font-size: 12px;
          }
          .download-section { padding: 0 8px; }
          .download-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>

      {/* Navigation */}
      <div className="nav-m nav-m-left" onClick={handleBack}>
        <span className="nav-m-text">M</span>
        <span className="nav-arrow nav-arrow-left">←</span>
        <span className="nav-label">Exhibition</span>
      </div>

      <div className={`content-container ${fadeState === 'out' ? 'fade-out' : ''}`}>
        <h1 className="page-title">Resources</h1>

        {/* Initial State - User Type Selection */}
        {showIntro && (
          <>
            <p className="intro-text">
              The Mini Museum believes learning doesn't end at the glass case. These materials are designed to extend the exhibition into your home or classroom—sparking conversations, deepening understanding, and encouraging the kind of critical thinking that lasts long after the visit.
              <br /><br />
              Whether you're a parent exploring with your child at the kitchen table or a teacher building a full lesson, everything here is free to download, print, and share.
            </p>
            <p className="question-text">Let's begin. I am a...</p>
            <div className="button-grid">
              <button className="selection-btn" onClick={() => selectUserType('parent')}>
                Parent
              </button>
              <button className="selection-btn" onClick={() => selectUserType('teacher')}>
                Teacher
              </button>
              <button className="selection-btn" onClick={() => selectUserType('librarian')}>
                Librarian
              </button>
            </div>
          </>
        )}

        {/* Parent Download */}
        {showParentDownload && (
          <>
            <p className="description-text">
              Our Parent Resource Guide includes conversation starters, at-home activities, and simple explanations to help you explore optical illusions and visual perception with your child.
            </p>
            <div className="download-section">
              <div className="download-item">
                <div className="download-info">
                  <span className="download-name">Parent Resource Guide</span>
                  <span className="download-subtitle">PDF • Activities & conversation starters</span>
                </div>
                <a
                  href="/resources/seeing-is-deceiving/parents/Parent Resource Guide_ Optical Illusions & Visual Deception.pdf"
                  download
                  className="download-btn"
                >
                  Download
                </a>
              </div>
            </div>
            <button className="start-over" onClick={startOver}>
              ← Start Over
            </button>
          </>
        )}

        {/* Teacher - Grade Selection */}
        {showGradeSelection && (
          <>
            <p className="question-text">What grade do you teach?</p>
            <div className="button-grid">
              <button className="selection-btn" onClick={() => selectGradeLevel('prek-k')}>
                PreK–K
              </button>
              <button className="selection-btn" onClick={() => selectGradeLevel('grades-1-2')}>
                Grades 1–2
              </button>
              <button className="selection-btn" onClick={() => selectGradeLevel('grades-3-4')}>
                Grades 3–4
              </button>
              <button className="selection-btn" onClick={() => selectGradeLevel('grades-5-8')}>
                Grades 5–8
              </button>
            </div>
            <button className="start-over" onClick={startOver}>
              ← Start Over
            </button>
          </>
        )}

        {/* Teacher - Subject Selection (Grades 5-8 only) */}
        {showSubjectSelection && (
          <>
            <p className="context-breadcrumb">
              Teacher → <span>{gradeLabels[gradeLevel || '']}</span>
            </p>
            <p className="question-text">What subject do you teach?</p>
            <div className="button-grid">
              <button className="selection-btn" onClick={() => selectSubject('science')}>
                Science
              </button>
              <button className="selection-btn" onClick={() => selectSubject('ela')}>
                ELA
              </button>
              <button className="selection-btn" onClick={() => selectSubject('social-studies')}>
                Social Studies
              </button>
              <button className="selection-btn" onClick={() => selectSubject('art')}>
                Art
              </button>
              <button className="selection-btn" onClick={() => selectSubject('math')}>
                Math
              </button>
              <button className="selection-btn" onClick={() => selectSubject('pe')}>
                PE
              </button>
              <button className="selection-btn" onClick={() => selectSubject('religion')}>
                Religion
              </button>
              <button className="selection-btn" onClick={() => selectSubject('spanish')}>
                Spanish
              </button>
              <button className="selection-btn" onClick={() => selectSubject('theater')}>
                Theater
              </button>
              <button className="selection-btn" onClick={() => selectSubject('music')}>
                Music
              </button>
            </div>
            <button className="start-over" onClick={startOver}>
              ← Start Over
            </button>
          </>
        )}

        {/* Teacher Downloads */}
        {showTeacherDownloads && (
          <>
            <p className="context-breadcrumb">
              Teacher → <span>{gradeLabels[gradeLevel || '']}</span>
              {subject && <> → <span>{subjectLabels[subject]}</span></>}
            </p>

            <div className="download-section">
              <h3 className="section-header">For All Teachers</h3>
              <div className="download-item">
                <div className="download-info">
                  <span className="download-name">Quick Teaching Guide</span>
                  <span className="download-subtitle">PDF • Overview & key concepts</span>
                </div>
                <a
                  href="/resources/seeing-is-deceiving/Teaching Guide_ Optical Illusions & Visual Deception.pdf"
                  download
                  className="download-btn"
                >
                  Download
                </a>
              </div>
              <div className="download-item">
                <div className="download-info">
                  <span className="download-name">Teacher Explanation Sheet</span>
                  <span className="download-subtitle">PDF • Detailed background info</span>
                </div>
                <a
                  href="/resources/seeing-is-deceiving/Using Differentiated Student Handouts.pdf"
                  download
                  className="download-btn"
                >
                  Download
                </a>
              </div>

              <h3 className="section-header">For Your Classroom</h3>
              <div className="download-item">
                <div className="download-info">
                  <span className="download-name">Lesson Plan</span>
                  <span className="download-subtitle">PDF • Full lesson with objectives</span>
                </div>
                <a
                  href={getLessonPlanPath()}
                  download
                  className="download-btn"
                >
                  Download
                </a>
              </div>

              <h3 className="section-header">Student Handouts</h3>
              <div className="download-item">
                <div className="download-info">
                  <span className="download-name">Green Level</span>
                  <span className="download-subtitle">More Support</span>
                </div>
                <a
                  href={getHandoutPath('green')}
                  download
                  className="download-btn"
                >
                  Download
                </a>
              </div>
              <div className="download-item">
                <div className="download-info">
                  <span className="download-name">Yellow Level</span>
                  <span className="download-subtitle">Grade Level</span>
                </div>
                <a
                  href={getHandoutPath('yellow')}
                  download
                  className="download-btn"
                >
                  Download
                </a>
              </div>
              <div className="download-item">
                <div className="download-info">
                  <span className="download-name">Red Level</span>
                  <span className="download-subtitle">Go Deeper</span>
                </div>
                <a
                  href={getHandoutPath('red')}
                  download
                  className="download-btn"
                >
                  Download
                </a>
              </div>
            </div>

            <button className="start-over" onClick={startOver}>
              ← Start Over
            </button>
          </>
        )}

        {/* Librarian - Grade Selection */}
        {showLibrarianGradeSelection && (
          <>
            <p className="question-text">What grade level do you serve?</p>
            <div className="button-grid">
              <button className="selection-btn" onClick={() => selectLibrarianGradeLevel('prek-k')}>
                PreK–K
              </button>
              <button className="selection-btn" onClick={() => selectLibrarianGradeLevel('grades-1-2')}>
                Grades 1–2
              </button>
              <button className="selection-btn" onClick={() => selectLibrarianGradeLevel('grades-3-5')}>
                Grades 3–5
              </button>
              <button className="selection-btn" onClick={() => selectLibrarianGradeLevel('grades-6-8')}>
                Grades 6–8
              </button>
            </div>
            <button className="start-over" onClick={startOver}>
              ← Start Over
            </button>
          </>
        )}

        {/* Librarian Downloads */}
        {showLibrarianDownloads && (
          <>
            <p className="context-breadcrumb">
              Librarian → <span>{librarianGradeLabels[librarianGradeLevel || '']}</span>
            </p>

            <div className="download-section">
              <h3 className="section-header">Lesson Plan</h3>
              <div className="download-item">
                <div className="download-info">
                  <span className="download-name">Library Lesson Plan</span>
                  <span className="download-subtitle">PDF • Full lesson with objectives</span>
                </div>
                <a
                  href={getLibrarianLessonPlanPath()}
                  download
                  className="download-btn"
                >
                  Download
                </a>
              </div>

              <h3 className="section-header">Student Handouts</h3>
              <div className="download-item">
                <div className="download-info">
                  <span className="download-name">Green Level</span>
                  <span className="download-subtitle">More Support</span>
                </div>
                <a
                  href={getLibrarianHandoutPath('green')}
                  download
                  className="download-btn"
                >
                  Download
                </a>
              </div>
              <div className="download-item">
                <div className="download-info">
                  <span className="download-name">Yellow Level</span>
                  <span className="download-subtitle">Grade Level</span>
                </div>
                <a
                  href={getLibrarianHandoutPath('yellow')}
                  download
                  className="download-btn"
                >
                  Download
                </a>
              </div>
              <div className="download-item">
                <div className="download-info">
                  <span className="download-name">Red Level</span>
                  <span className="download-subtitle">Go Deeper</span>
                </div>
                <a
                  href={getLibrarianHandoutPath('red')}
                  download
                  className="download-btn"
                >
                  Download
                </a>
              </div>
            </div>

            <button className="start-over" onClick={startOver}>
              ← Start Over
            </button>
          </>
        )}
      </div>
    </div>
  );
}
