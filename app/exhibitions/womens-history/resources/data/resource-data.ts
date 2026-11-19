/**
 * Resource data for the Women's History Month exhibition (Letters From the Blitz)
 * Contains file mappings for teachers, librarians, and parents
 */

// Types
export type UserType = 'parent' | 'teacher' | 'librarian' | null;
export type GradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-4' | 'grades-5-8' | null;
export type LibrarianGradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-5' | 'grades-6-8' | null;
export type Subject = 'science' | 'ela' | 'social-studies' | 'art' | 'math' | 'pe' | 'religion' | 'spanish' | 'theater' | 'music' | null;

// Teacher file mappings by grade level
export const TEACHER_LESSON_PLANS: Record<string, string> = {
  'prek-k': 'WH_LP_PreK_K.pdf',
  'grades-1-2': 'WH_LP_Grades1_2.pdf',
  'grades-3-4': 'WH_LP_Grades3_4.pdf',
};

export const TEACHER_HANDOUTS: Record<string, Record<string, string>> = {
  'prek-k': {
    green: 'WH_Handout_Green_PreK_K.pdf',
    yellow: 'WH_Handout_Yellow_PreK_K.pdf',
    red: 'WH_Handout_Red_PreK_K.pdf',
  },
  'grades-1-2': {
    green: 'WH_Handout_Green_Grades1_2.pdf',
    yellow: 'WH_Handout_Yellow_Grades1_2.pdf',
    red: 'WH_Handout_Red_Grades1_2.pdf',
  },
  'grades-3-4': {
    green: 'WH_Handout_Green_Grades3_4.pdf',
    yellow: 'WH_Handout_Yellow_Grades3_4.pdf',
    red: 'WH_Handout_Red_Grades3_4.pdf',
  },
};

// 5-8 subject-specific file mappings: the four subjects written so far
export const SUBJECT_LESSON_PLANS: Record<string, string> = {
  'social-studies': 'WH_LP_SocialStudies.pdf',
  'ela': 'WH_LP_ELA.pdf',
  'math': 'WH_LP_Math.pdf',
  'art': 'WH_LP_Art.pdf',
};

export const SUBJECT_HANDOUTS: Record<string, Record<string, string>> = {
  'social-studies': {
    green: 'WH_Handout_Green_SocialStudies.pdf',
    yellow: 'WH_Handout_Yellow_SocialStudies.pdf',
    red: 'WH_Handout_Red_SocialStudies.pdf',
  },
  'ela': {
    green: 'WH_Handout_Green_ELA.pdf',
    yellow: 'WH_Handout_Yellow_ELA.pdf',
    red: 'WH_Handout_Red_ELA.pdf',
  },
  'math': {
    green: 'WH_Handout_Green_Math.pdf',
    yellow: 'WH_Handout_Yellow_Math.pdf',
    red: 'WH_Handout_Red_Math.pdf',
  },
  'art': {
    green: 'WH_Handout_Green_Art.pdf',
    yellow: 'WH_Handout_Yellow_Art.pdf',
    red: 'WH_Handout_Red_Art.pdf',
  },
};

// Lessons that can also be taught on screen (Lesson mode), by
// '<grade>/<subject>', or '<grade>' alone for the grades without subjects.
// The slug is a lesson in lib/lessons.
export const ON_SCREEN_LESSONS: Record<string, string> = {
  'prek-k': 'violets-big-family',
  'grades-1-2': 'violets-keepsakes',
  'grades-3-4': 'history-at-home',
  'grades-5-8/social-studies': 'the-war-at-home',
  'grades-5-8/ela': 'everybody-has-a-story',
  'grades-5-8/math': 'who-counts',
  'grades-5-8/art': 'a-life-in-shapes',
};

// Librarian file mappings
// No librarian sets for Women's History Month yet; the page hides the Librarian choice.
export const LIBRARIAN_LESSON_PLANS: Record<string, string> = {};

export const LIBRARIAN_HANDOUTS: Record<string, Record<string, string>> = {};

// UI Labels
export const GRADE_LABELS: Record<string, string> = {
  'prek-k': 'PreK\u2013K',
  'grades-1-2': 'Grades 1\u20132',
  'grades-3-4': 'Grades 3\u20134',
  'grades-5-8': 'Grades 5\u20138',
};

export const LIBRARIAN_GRADE_LABELS: Record<string, string> = {
  'prek-k': 'PreK\u2013K',
  'grades-1-2': 'Grades 1\u20132',
  'grades-3-5': 'Grades 3\u20135',
  'grades-6-8': 'Grades 6\u20138',
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
export const PARENT_RESOURCE_PATH = '/resources/womens-history/parents/WH_Parent_Guide.pdf';
