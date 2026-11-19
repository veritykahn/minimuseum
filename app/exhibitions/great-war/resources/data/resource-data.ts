/**
 * Resource data for The Great War exhibition
 * Contains file mappings for teachers, librarians, and parents
 */

// Types
export type UserType = 'parent' | 'teacher' | 'librarian' | null;
export type GradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-4' | 'grades-5-8' | null;
export type LibrarianGradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-5' | 'grades-6-8' | null;
export type Subject = 'science' | 'ela' | 'social-studies' | 'art' | 'math' | 'pe' | 'religion' | 'spanish' | 'theater' | 'music' | null;

// Teacher file mappings by grade level
export const TEACHER_LESSON_PLANS: Record<string, string> = {
  'prek-k': 'GW_LP_PreK_K.pdf',
  'grades-1-2': 'GW_LP_Grades1_2.pdf',
  'grades-3-4': 'GW_LP_Grades3_4.pdf',
};

export const TEACHER_HANDOUTS: Record<string, Record<string, string>> = {
  'prek-k': {
    green: 'GW_Handout_Green_PreK_K.pdf',
    yellow: 'GW_Handout_Yellow_PreK_K.pdf',
    red: 'GW_Handout_Red_PreK_K.pdf',
  },
  'grades-1-2': {
    green: 'GW_Handout_Green_Grades1_2.pdf',
    yellow: 'GW_Handout_Yellow_Grades1_2.pdf',
    red: 'GW_Handout_Red_Grades1_2.pdf',
  },
  'grades-3-4': {
    green: 'GW_Handout_Green_Grades3_4.pdf',
    yellow: 'GW_Handout_Yellow_Grades3_4.pdf',
    red: 'GW_Handout_Red_Grades3_4.pdf',
  },
};

// 5-8 subject-specific file mappings: the four subjects written so far
export const SUBJECT_LESSON_PLANS: Record<string, string> = {
  'social-studies': 'GW_LP_SocialStudies.pdf',
  'ela': 'GW_LP_ELA.pdf',
  'art': 'GW_LP_Art.pdf',
  'music': 'GW_LP_Music.pdf',
};

export const SUBJECT_HANDOUTS: Record<string, Record<string, string>> = {
  'social-studies': {
    green: 'GW_Handout_Green_SocialStudies.pdf',
    yellow: 'GW_Handout_Yellow_SocialStudies.pdf',
    red: 'GW_Handout_Red_SocialStudies.pdf',
  },
  'ela': {
    green: 'GW_Handout_Green_ELA.pdf',
    yellow: 'GW_Handout_Yellow_ELA.pdf',
    red: 'GW_Handout_Red_ELA.pdf',
  },
  'art': {
    green: 'GW_Handout_Green_Art.pdf',
    yellow: 'GW_Handout_Yellow_Art.pdf',
    red: 'GW_Handout_Red_Art.pdf',
  },
  'music': {
    green: 'GW_Handout_Green_Music.pdf',
    yellow: 'GW_Handout_Yellow_Music.pdf',
    red: 'GW_Handout_Red_Music.pdf',
  },
};

// Lessons that can also be taught on screen (Lesson mode), by
// '<grade>/<subject>', or '<grade>' alone for the grades without subjects.
// The slug is a lesson in lib/lessons.
export const ON_SCREEN_LESSONS: Record<string, string> = {
  'prek-k': 'quiet-at-eleven',
  'grades-1-2': 'what-came-home',
  'grades-3-4': 'remember-a-soldier',
  'grades-5-8/social-studies': 'the-last-minute',
  'grades-5-8/ela': 'the-language-of-remembrance',
  'grades-5-8/art': 'silhouette-and-poppy',
  'grades-5-8/music': 'music-for-remembering',
};

// Librarian file mappings
// No librarian sets for The Great War yet; the page hides the Librarian choice.
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
export const PARENT_RESOURCE_PATH = '/resources/great-war/parents/GW_Parent_Guide.pdf';
