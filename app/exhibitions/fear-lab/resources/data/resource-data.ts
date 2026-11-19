/**
 * Resource data for the Fear Lab exhibition
 * Contains file mappings for teachers, librarians, and parents
 */

// Types
export type UserType = 'parent' | 'teacher' | 'librarian' | null;
export type GradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-4' | 'grades-5-8' | null;
export type LibrarianGradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-5' | 'grades-6-8' | null;
export type Subject = 'science' | 'ela' | 'social-studies' | 'art' | 'math' | 'pe' | 'religion' | 'spanish' | 'theater' | 'music' | null;

// Teacher file mappings by grade level
export const TEACHER_LESSON_PLANS: Record<string, string> = {
  'prek-k': 'FL_LP_PreK_K.pdf',
  'grades-1-2': 'FL_LP_Grades1_2.pdf',
  'grades-3-4': 'FL_LP_Grades3_4.pdf',
};

export const TEACHER_HANDOUTS: Record<string, Record<string, string>> = {
  'prek-k': {
    green: 'FL_Handout_Green_PreK_K.pdf',
    yellow: 'FL_Handout_Yellow_PreK_K.pdf',
    red: 'FL_Handout_Red_PreK_K.pdf',
  },
  'grades-1-2': {
    green: 'FL_Handout_Green_Grades1_2.pdf',
    yellow: 'FL_Handout_Yellow_Grades1_2.pdf',
    red: 'FL_Handout_Red_Grades1_2.pdf',
  },
  'grades-3-4': {
    green: 'FL_Handout_Green_Grades3_4.pdf',
    yellow: 'FL_Handout_Yellow_Grades3_4.pdf',
    red: 'FL_Handout_Red_Grades3_4.pdf',
  },
};

// 5-8 subject-specific file mappings: the four subjects written so far
export const SUBJECT_LESSON_PLANS: Record<string, string> = {
  'science': 'FL_LP_Science.pdf',
  'ela': 'FL_LP_ELA.pdf',
  'pe': 'FL_LP_PE.pdf',
  'art': 'FL_LP_Art.pdf',
};

export const SUBJECT_HANDOUTS: Record<string, Record<string, string>> = {
  'science': {
    green: 'FL_Handout_Green_Science.pdf',
    yellow: 'FL_Handout_Yellow_Science.pdf',
    red: 'FL_Handout_Red_Science.pdf',
  },
  'ela': {
    green: 'FL_Handout_Green_ELA.pdf',
    yellow: 'FL_Handout_Yellow_ELA.pdf',
    red: 'FL_Handout_Red_ELA.pdf',
  },
  'pe': {
    green: 'FL_Handout_Green_PE.pdf',
    yellow: 'FL_Handout_Yellow_PE.pdf',
    red: 'FL_Handout_Red_PE.pdf',
  },
  'art': {
    green: 'FL_Handout_Green_Art.pdf',
    yellow: 'FL_Handout_Yellow_Art.pdf',
    red: 'FL_Handout_Red_Art.pdf',
  },
};

// Lessons that can also be taught on screen (Lesson mode), by
// '<grade>/<subject>', or '<grade>' alone for the grades without subjects.
// The slug is a lesson in lib/lessons.
export const ON_SCREEN_LESSONS: Record<string, string> = {
  'prek-k': 'whats-in-the-box',
  'grades-1-2': 'tiger-or-wind',
  'grades-3-4': 'is-it-really-a-monster',
  'grades-5-8/science': 'the-science-of-not-knowing',
  'grades-5-8/ela': 'page-turners',
  'grades-5-8/pe': 'racing-hearts',
  'grades-5-8/art': 'the-shape-of-fear',
};

// Librarian file mappings
// No librarian sets for the Fear Lab yet; the page hides the Librarian choice.
export const LIBRARIAN_LESSON_PLANS: Record<string, string> = {};

export const LIBRARIAN_HANDOUTS: Record<string, Record<string, string>> = {};

// UI Labels
export const GRADE_LABELS: Record<string, string> = {
  'prek-k': 'PreK–K',
  'grades-1-2': 'Grades 1–2',
  'grades-3-4': 'Grades 3–4',
  'grades-5-8': 'Grades 5–8',
};

export const LIBRARIAN_GRADE_LABELS: Record<string, string> = {
  'prek-k': 'PreK–K',
  'grades-1-2': 'Grades 1–2',
  'grades-3-5': 'Grades 3–5',
  'grades-6-8': 'Grades 6–8',
};

export const SUBJECT_LABELS: Record<string, string> = {
  'science': 'Science',
  'ela': 'ELA',
  'social-studies': 'Social Studies',
  'art': 'Art',
  'math': 'Math',
  'pe': 'PE',
  'religion': 'Religion',
  'spanish': 'Spanish',
  'theater': 'Theater',
  'music': 'Music',
};

// Parent resource
export const PARENT_RESOURCE_PATH = '/resources/fear-lab/parents/FL_Parent_Guide.pdf';
