'use client';

import { useRouter } from 'next/navigation';
import { useResourceWizard } from './hooks';
import {
  SelectionButton,
  DownloadItem,
  SectionHeader,
  StartOverButton,
  ContextBreadcrumb,
} from './components';
import {
  GRADE_LABELS,
  LIBRARIAN_GRADE_LABELS,
  SUBJECT_LABELS,
  PARENT_RESOURCE_PATH,
  GradeLevel,
  LibrarianGradeLevel,
  Subject,
} from './data/resource-data';

export default function ResourcesPage() {
  const router = useRouter();
  const {
    gradeLevel,
    librarianGradeLevel,
    subject,
    fadeState,
    currentStep,
    selectUserType,
    selectGradeLevel,
    selectLibrarianGradeLevel,
    selectSubject,
    startOver,
    getTeacherLessonPlanPath,
    getTeacherHandoutPath,
    getLibrarianLessonPlanPath,
    getLibrarianHandoutPath,
  } = useResourceWizard();

  const handleBack = () => {
    router.push('/exhibitions/seeing-is-deceiving');
  };

  // Grade options for teachers
  const teacherGrades: { key: GradeLevel; label: string }[] = [
    { key: 'prek-k', label: 'PreK–K' },
    { key: 'grades-1-2', label: 'Grades 1–2' },
    { key: 'grades-3-4', label: 'Grades 3–4' },
    { key: 'grades-5-8', label: 'Grades 5–8' },
  ];

  // Grade options for librarians
  const librarianGrades: { key: LibrarianGradeLevel; label: string }[] = [
    { key: 'prek-k', label: 'PreK–K' },
    { key: 'grades-1-2', label: 'Grades 1–2' },
    { key: 'grades-3-5', label: 'Grades 3–5' },
    { key: 'grades-6-8', label: 'Grades 6–8' },
  ];

  // Subject options for grades 5-8
  const subjects: { key: Subject; label: string }[] = [
    { key: 'science', label: 'Science' },
    { key: 'ela', label: 'ELA' },
    { key: 'social-studies', label: 'Social Studies' },
    { key: 'art', label: 'Art' },
    { key: 'math', label: 'Math' },
    { key: 'pe', label: 'PE' },
    { key: 'religion', label: 'Religion' },
    { key: 'spanish', label: 'Spanish' },
    { key: 'theater', label: 'Theater' },
    { key: 'music', label: 'Music' },
  ];

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

        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 6vw, 3.5rem);
          font-weight: 300;
          color: #fafafa;
          margin-bottom: 32px;
        }

        .intro-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 2.5vw, 1.3rem);
          font-weight: 400;
          line-height: 1.8;
          color: #a0a0a0;
          margin-bottom: 48px;
        }

        .question-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.3rem, 3vw, 1.6rem);
          font-style: italic;
          color: #7D8471;
          margin-bottom: 32px;
        }

        .button-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
          margin-bottom: 48px;
        }

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

        .download-section {
          text-align: left;
          max-width: 500px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .nav-m-left { left: 20px; top: 20px; }
          .nav-m-text { font-size: 24px; }
          .resources-page { padding: 100px 20px 60px; }
          .button-grid { gap: 12px; }
          .download-section { padding: 0 8px; }
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
        {currentStep.showIntro && (
          <>
            <p className="intro-text">
              The Mini Museum believes learning doesn&apos;t end at the glass case. These materials are designed to extend the exhibition into your home or classroom—sparking conversations, deepening understanding, and encouraging the kind of critical thinking that lasts long after the visit.
              <br /><br />
              Whether you&apos;re a parent exploring with your child at the kitchen table or a teacher building a full lesson, everything here is free to download, print, and share.
            </p>
            <p className="question-text">Let&apos;s begin. I am a...</p>
            <div className="button-grid">
              <SelectionButton onClick={() => selectUserType('parent')}>Parent</SelectionButton>
              <SelectionButton onClick={() => selectUserType('teacher')}>Teacher</SelectionButton>
              <SelectionButton onClick={() => selectUserType('librarian')}>Librarian</SelectionButton>
            </div>
          </>
        )}

        {/* Parent Download */}
        {currentStep.showParentDownload && (
          <>
            <p className="description-text">
              Our Parent Resource Guide includes conversation starters, at-home activities, and simple explanations to help you explore optical illusions and visual perception with your child.
            </p>
            <div className="download-section">
              <DownloadItem
                name="Parent Resource Guide"
                subtitle="PDF • Activities & conversation starters"
                href={PARENT_RESOURCE_PATH}
              />
            </div>
            <StartOverButton onClick={startOver} />
          </>
        )}

        {/* Teacher - Grade Selection */}
        {currentStep.showGradeSelection && (
          <>
            <p className="question-text">What grade do you teach?</p>
            <div className="button-grid">
              {teacherGrades.map(({ key, label }) => (
                <SelectionButton key={key} onClick={() => selectGradeLevel(key)}>
                  {label}
                </SelectionButton>
              ))}
            </div>
            <StartOverButton onClick={startOver} />
          </>
        )}

        {/* Teacher - Subject Selection (Grades 5-8 only) */}
        {currentStep.showSubjectSelection && (
          <>
            <ContextBreadcrumb items={['Teacher', GRADE_LABELS[gradeLevel || '']]} />
            <p className="question-text">What subject do you teach?</p>
            <div className="button-grid">
              {subjects.map(({ key, label }) => (
                <SelectionButton key={key} onClick={() => selectSubject(key)}>
                  {label}
                </SelectionButton>
              ))}
            </div>
            <StartOverButton onClick={startOver} />
          </>
        )}

        {/* Teacher Downloads */}
        {currentStep.showTeacherDownloads && (
          <>
            <ContextBreadcrumb
              items={[
                'Teacher',
                GRADE_LABELS[gradeLevel || ''],
                ...(subject ? [SUBJECT_LABELS[subject]] : []),
              ]}
            />

            <div className="download-section">
              <SectionHeader isFirst>For All Teachers</SectionHeader>
              <DownloadItem
                name="Quick Teaching Guide"
                subtitle="PDF • Overview & key concepts"
                href="/resources/seeing-is-deceiving/Teaching Guide_ Optical Illusions & Visual Deception.pdf"
              />
              <DownloadItem
                name="Teacher Explanation Sheet"
                subtitle="PDF • Detailed background info"
                href="/resources/seeing-is-deceiving/Using Differentiated Student Handouts.pdf"
              />

              <SectionHeader>For Your Classroom</SectionHeader>
              <DownloadItem
                name="Lesson Plan"
                subtitle="PDF • Full lesson with objectives"
                href={getTeacherLessonPlanPath()}
              />

              <SectionHeader>Student Handouts</SectionHeader>
              <DownloadItem name="Green Level" subtitle="More Support" href={getTeacherHandoutPath('green')} />
              <DownloadItem name="Yellow Level" subtitle="Grade Level" href={getTeacherHandoutPath('yellow')} />
              <DownloadItem name="Red Level" subtitle="Go Deeper" href={getTeacherHandoutPath('red')} />
            </div>

            <StartOverButton onClick={startOver} />
          </>
        )}

        {/* Librarian - Grade Selection */}
        {currentStep.showLibrarianGradeSelection && (
          <>
            <p className="question-text">What grade level do you serve?</p>
            <div className="button-grid">
              {librarianGrades.map(({ key, label }) => (
                <SelectionButton key={key} onClick={() => selectLibrarianGradeLevel(key)}>
                  {label}
                </SelectionButton>
              ))}
            </div>
            <StartOverButton onClick={startOver} />
          </>
        )}

        {/* Librarian Downloads */}
        {currentStep.showLibrarianDownloads && (
          <>
            <ContextBreadcrumb items={['Librarian', LIBRARIAN_GRADE_LABELS[librarianGradeLevel || '']]} />

            <div className="download-section">
              <SectionHeader isFirst>Lesson Plan</SectionHeader>
              <DownloadItem
                name="Library Lesson Plan"
                subtitle="PDF • Full lesson with objectives"
                href={getLibrarianLessonPlanPath()}
              />

              <SectionHeader>Student Handouts</SectionHeader>
              <DownloadItem name="Green Level" subtitle="More Support" href={getLibrarianHandoutPath('green')} />
              <DownloadItem name="Yellow Level" subtitle="Grade Level" href={getLibrarianHandoutPath('yellow')} />
              <DownloadItem name="Red Level" subtitle="Go Deeper" href={getLibrarianHandoutPath('red')} />
            </div>

            <StartOverButton onClick={startOver} />
          </>
        )}
      </div>
    </div>
  );
}
