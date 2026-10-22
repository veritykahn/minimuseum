/**
 * Resource data for the In Their Hands exhibition
 * Contains file mappings for teachers, librarians, and parents
 */

// Types
export type UserType = 'parent' | 'teacher' | 'librarian' | null;
export type GradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-4' | 'grades-5-8' | null;
export type LibrarianGradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-5' | 'grades-6-8' | null;
export type Subject = 'science' | 'ela' | 'social-studies' | 'art' | 'math' | 'pe' | 'religion' | 'spanish' | 'theater' | 'music' | null;

// Teacher file mappings by grade level
export const TEACHER_LESSON_PLANS: Record<string, string> = {
  'prek-k': 'ITH_LP_PreK_K.pdf',
  'grades-1-2': 'ITH_LP_Grades1_2.pdf',
  'grades-3-4': 'ITH_LP_Grades3_4.pdf',
};

export const TEACHER_HANDOUTS: Record<string, Record<string, string>> = {
  'prek-k': {
    green: 'ITH_Handout_Green_PreK_K.pdf',
    yellow: 'ITH_Handout_Yellow_PreK_K.pdf',
    red: 'ITH_Handout_Red_PreK_K.pdf',
  },
  'grades-1-2': {
    green: 'ITH_Handout_Green_Grades1_2.pdf',
    yellow: 'ITH_Handout_Yellow_Grades1_2.pdf',
    red: 'ITH_Handout_Red_Grades1_2.pdf',
  },
  'grades-3-4': {
    green: 'ITH_Handout_Green_Grades3_4.pdf',
    yellow: 'ITH_Handout_Yellow_Grades3_4.pdf',
    red: 'ITH_Handout_Red_Grades3_4.pdf',
  },
};

// 5-8 subject-specific file mappings: the four subjects written so far
export const SUBJECT_LESSON_PLANS: Record<string, string> = {
  'religion': 'ITH_LP_Religion.pdf',
  'social-studies': 'ITH_LP_SocialStudies.pdf',
  'math': 'ITH_LP_Math.pdf',
  'art': 'ITH_LP_Art.pdf',
};

export const SUBJECT_HANDOUTS: Record<string, Record<string, string>> = {
  'religion': {
    green: 'ITH_Handout_Green_Religion.pdf',
    yellow: 'ITH_Handout_Yellow_Religion.pdf',
    red: 'ITH_Handout_Red_Religion.pdf',
  },
  'social-studies': {
    green: 'ITH_Handout_Green_SocialStudies.pdf',
    yellow: 'ITH_Handout_Yellow_SocialStudies.pdf',
    red: 'ITH_Handout_Red_SocialStudies.pdf',
  },
  'math': {
    green: 'ITH_Handout_Green_Math.pdf',
    yellow: 'ITH_Handout_Yellow_Math.pdf',
    red: 'ITH_Handout_Red_Math.pdf',
  },
  'art': {
    green: 'ITH_Handout_Green_Art.pdf',
    yellow: 'ITH_Handout_Yellow_Art.pdf',
    red: 'ITH_Handout_Red_Art.pdf',
  },
};

// Lessons that can also be taught on screen (Lesson mode), by
// '<grade>/<subject>'. The slug is a lesson in lib/lessons.
export const ON_SCREEN_LESSONS: Record<string, string> = {
  'grades-5-8/religion': 'whose-image-is-this',
  'grades-5-8/social-studies': 'who-ruled-judaea',
  'grades-5-8/math': 'the-numbers-in-the-coins',
  'grades-5-8/art': 'small-works-of-power',
};

// Librarian file mappings
// No librarian sets for In Their Hands yet; the page hides the Librarian choice.
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
export const PARENT_RESOURCE_PATH = '/resources/in-their-hands/parents/ITH_Parent_Guide.pdf';
