/**
 * Resource data for the International Holocaust Remembrance Day exhibition
 * Contains file mappings for teachers, librarians, and parents
 *
 * The exhibition is recommended for grades 6 and up (its teachNote), so it
 * has no PreK–4 lessons: four Grades 5–8 subject lessons only.
 */

// Types
export type UserType = 'parent' | 'teacher' | 'librarian' | null;
export type GradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-4' | 'grades-5-8' | null;
export type LibrarianGradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-5' | 'grades-6-8' | null;
export type Subject = 'science' | 'ela' | 'social-studies' | 'art' | 'math' | 'pe' | 'religion' | 'spanish' | 'theater' | 'music' | null;

// Teacher file mappings by grade level
// None: the exhibition is recommended for grades 6 and up, so there are no PreK–4 lessons.
export const TEACHER_LESSON_PLANS: Record<string, string> = {};

export const TEACHER_HANDOUTS: Record<string, Record<string, string>> = {};

// 5-8 subject-specific file mappings
export const SUBJECT_LESSON_PLANS: Record<string, string> = {
  'social-studies': 'HOL_LP_SocialStudies.pdf',
  'ela': 'HOL_LP_ELA.pdf',
  'art': 'HOL_LP_Art.pdf',
  'music': 'HOL_LP_Music.pdf',
};

export const SUBJECT_HANDOUTS: Record<string, Record<string, string>> = {
  'social-studies': {
    green: 'HOL_Handout_Green_SocialStudies.pdf',
    yellow: 'HOL_Handout_Yellow_SocialStudies.pdf',
    red: 'HOL_Handout_Red_SocialStudies.pdf',
  },
  'ela': {
    green: 'HOL_Handout_Green_ELA.pdf',
    yellow: 'HOL_Handout_Yellow_ELA.pdf',
    red: 'HOL_Handout_Red_ELA.pdf',
  },
  'art': {
    green: 'HOL_Handout_Green_Art.pdf',
    yellow: 'HOL_Handout_Yellow_Art.pdf',
    red: 'HOL_Handout_Red_Art.pdf',
  },
  'music': {
    green: 'HOL_Handout_Green_Music.pdf',
    yellow: 'HOL_Handout_Yellow_Music.pdf',
    red: 'HOL_Handout_Red_Music.pdf',
  },
};

// Lessons that can also be taught on screen (Lesson mode), by
// '<grade>/<subject>', or '<grade>' alone for the grades without subjects.
// The slug is a lesson in lib/lessons.
export const ON_SCREEN_LESSONS: Record<string, string> = {
  'grades-5-8/social-studies': 'step-by-step',
  'grades-5-8/ela': 'in-their-own-words',
  'grades-5-8/art': 'how-do-we-remember',
  'grades-5-8/music': 'sound-and-silence',
};

// Librarian file mappings
// No librarian sets for this exhibition yet; the page hides the Librarian choice.
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
export const PARENT_RESOURCE_PATH = '/resources/holocaust/parents/HOL_Parent_Guide.pdf';
