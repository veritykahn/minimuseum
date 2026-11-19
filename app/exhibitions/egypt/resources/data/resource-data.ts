/**
 * Resource data for the Ancient Egypt exhibition
 * Contains file mappings for teachers, librarians, and parents
 */

// Types
export type UserType = 'parent' | 'teacher' | 'librarian' | null;
export type GradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-4' | 'grades-5-8' | null;
export type LibrarianGradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-5' | 'grades-6-8' | null;
export type Subject = 'science' | 'ela' | 'social-studies' | 'art' | 'math' | 'pe' | 'religion' | 'spanish' | 'theater' | 'music' | null;

// Teacher file mappings by grade level
export const TEACHER_LESSON_PLANS: Record<string, string> = {
  'prek-k': 'EGY_LP_PreK_K.pdf',
  'grades-1-2': 'EGY_LP_Grades1_2.pdf',
  'grades-3-4': 'EGY_LP_Grades3_4.pdf',
};

export const TEACHER_HANDOUTS: Record<string, Record<string, string>> = {
  'prek-k': {
    green: 'EGY_Handout_Green_PreK_K.pdf',
    yellow: 'EGY_Handout_Yellow_PreK_K.pdf',
    red: 'EGY_Handout_Red_PreK_K.pdf',
  },
  'grades-1-2': {
    green: 'EGY_Handout_Green_Grades1_2.pdf',
    yellow: 'EGY_Handout_Yellow_Grades1_2.pdf',
    red: 'EGY_Handout_Red_Grades1_2.pdf',
  },
  'grades-3-4': {
    green: 'EGY_Handout_Green_Grades3_4.pdf',
    yellow: 'EGY_Handout_Yellow_Grades3_4.pdf',
    red: 'EGY_Handout_Red_Grades3_4.pdf',
  },
};

// 5-8 subject-specific file mappings: the four subjects written so far
export const SUBJECT_LESSON_PLANS: Record<string, string> = {
  'social-studies': 'EGY_LP_SocialStudies.pdf',
  'ela': 'EGY_LP_ELA.pdf',
  'science': 'EGY_LP_Science.pdf',
  'art': 'EGY_LP_Art.pdf',
};

export const SUBJECT_HANDOUTS: Record<string, Record<string, string>> = {
  'social-studies': {
    green: 'EGY_Handout_Green_SocialStudies.pdf',
    yellow: 'EGY_Handout_Yellow_SocialStudies.pdf',
    red: 'EGY_Handout_Red_SocialStudies.pdf',
  },
  'ela': {
    green: 'EGY_Handout_Green_ELA.pdf',
    yellow: 'EGY_Handout_Yellow_ELA.pdf',
    red: 'EGY_Handout_Red_ELA.pdf',
  },
  'science': {
    green: 'EGY_Handout_Green_Science.pdf',
    yellow: 'EGY_Handout_Yellow_Science.pdf',
    red: 'EGY_Handout_Red_Science.pdf',
  },
  'art': {
    green: 'EGY_Handout_Green_Art.pdf',
    yellow: 'EGY_Handout_Yellow_Art.pdf',
    red: 'EGY_Handout_Red_Art.pdf',
  },
};

// Lessons that can also be taught on screen (Lesson mode), by
// '<grade>/<subject>', or '<grade>' alone for the grades without subjects.
// The slug is a lesson in lib/lessons.
export const ON_SCREEN_LESSONS: Record<string, string> = {
  'prek-k': 'hidden-in-the-dark',
  'grades-1-2': 'write-like-a-scribe',
  'grades-3-4': 'crack-the-code',
  'grades-5-8/social-studies': 'who-built-the-pyramids',
  'grades-5-8/ela': 'weighed-against-a-feather',
  'grades-5-8/science': 'seventy-days',
  'grades-5-8/art': 'stories-on-the-wall',
};

// Librarian file mappings
// No librarian sets for Ancient Egypt yet; the page hides the Librarian choice.
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
export const PARENT_RESOURCE_PATH = '/resources/egypt/parents/EGY_Parent_Guide.pdf';
