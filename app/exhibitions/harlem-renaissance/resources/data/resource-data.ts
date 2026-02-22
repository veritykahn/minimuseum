/**
 * Resource data for the Harlem Renaissance exhibition
 * Contains file mappings for teachers, librarians, and parents
 */

// Types
export type UserType = 'parent' | 'teacher' | 'librarian' | null;
export type GradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-4' | 'grades-5-8' | null;
export type LibrarianGradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-5' | 'grades-6-8' | null;
export type Subject = 'science' | 'ela' | 'social-studies' | 'art' | 'math' | 'pe' | 'religion' | 'spanish' | 'theater' | 'music' | null;

// Teacher file mappings by grade level
export const TEACHER_LESSON_PLANS: Record<string, string> = {
  'prek-k': 'HR_LP_PreK_K.pdf',
  'grades-1-2': 'HR_LP_Grades1_2.pdf',
  'grades-3-4': 'HR_LP_Grades3_4.pdf',
};

export const TEACHER_HANDOUTS: Record<string, Record<string, string>> = {
  'prek-k': {
    green: 'HR_Handout_Green_PreK_K.pdf',
    yellow: 'HR_Handout_Yellow_PreK_K.pdf',
    red: 'HR_Handout_Red_PreK_K.pdf',
  },
  'grades-1-2': {
    green: 'HR_Handout_Green_Grades1_2.pdf',
    yellow: 'HR_Handout_Yellow_Grades1_2.pdf',
    red: 'HR_Handout_Red_Grades1_2.pdf',
  },
  'grades-3-4': {
    green: 'HR_Handout_Green_Grades3_4.pdf',
    yellow: 'HR_Handout_Yellow_Grades3_4.pdf',
    red: 'HR_Handout_Red_Grades3_4.pdf',
  },
};

// 5-8 subject-specific file mappings
export const SUBJECT_LESSON_PLANS: Record<string, string> = {
  'science': 'HR_LP_SCIENCE_5_8.pdf',
  'ela': 'HR_LP_ELA_5_8.pdf',
  'social-studies': 'HR_LP_SS_5_8.pdf',
  'art': 'HR_LP_Art.pdf',
  'math': 'HR_LP_Math.pdf',
  'pe': 'HR_LP_PE.pdf',
  'religion': 'HR_LP_Religion.pdf',
  'spanish': 'HR_LP_Spanish.pdf',
  'theater': 'HR_LP_Theater.pdf',
  'music': 'HR_LP_Music.pdf',
};

export const SUBJECT_HANDOUTS: Record<string, Record<string, string>> = {
  'science': {
    green: 'HR_Handout_Green_SCIENCE_5_8.pdf',
    yellow: 'HR_Handout_Yellow_SCIENCE_5_8.pdf',
    red: 'HR_Handout_Red_SCIENCE_5_8.pdf',
  },
  'ela': {
    green: 'HR_Handout_Green_ELA_5_8.pdf',
    yellow: 'HR_Handout_Yellow_ELA_5_8.pdf',
    red: 'HR_Handout_Red_ELA_5_8.pdf',
  },
  'social-studies': {
    green: 'HR_Handout_Green_SS_5_8.pdf',
    yellow: 'HR_Handout_Yellow_SS_5_8.pdf',
    red: 'HR_Handout_Red_SS_5_8.pdf',
  },
  'art': {
    green: 'HR_Handout_Green_Art.pdf',
    yellow: 'HR_Handout_Yellow_Art.pdf',
    red: 'HR_Handout_Red_Art.pdf',
  },
  'math': {
    green: 'HR_Handout_Green_Math.pdf',
    yellow: 'HR_Handout_Yellow_Math.pdf',
    red: 'HR_Handout_Red_Math.pdf',
  },
  'pe': {
    green: 'HR_Handout_Green_PE.pdf',
    yellow: 'HR_Handout_Yellow_PE.pdf',
    red: 'HR_Handout_Red_PE.pdf',
  },
  'religion': {
    green: 'HR_Handout_Green_Religion.pdf',
    yellow: 'HR_Handout_Yellow_Religion.pdf',
    red: 'HR_Handout_Red_Religion.pdf',
  },
  'spanish': {
    green: 'HR_Handout_Green_Spanish.pdf',
    yellow: 'HR_Handout_Yellow_Spanish.pdf',
    red: 'HR_Handout_Red_Spanish.pdf',
  },
  'theater': {
    green: 'HR_Handout_Green_Theater.pdf',
    yellow: 'HR_Handout_Yellow_Theater.pdf',
    red: 'HR_Handout_Red_Theater.pdf',
  },
  'music': {
    green: 'HR_Handout_Green_Music.pdf',
    yellow: 'HR_Handout_Yellow_Music.pdf',
    red: 'HR_Handout_Red_Music.pdf',
  },
};

// Librarian file mappings
export const LIBRARIAN_LESSON_PLANS: Record<string, string> = {
  'prek-k': 'HR_Lib_LP_PreK_K.pdf',
  'grades-1-2': 'HR_Lib_LP_Grades1_2.pdf',
  'grades-3-5': 'HR_Lib_LP_Grades3_5.pdf',
  'grades-6-8': 'HR_Lib_LP_Grades6_8.pdf',
};

export const LIBRARIAN_HANDOUTS: Record<string, Record<string, string>> = {
  'prek-k': {
    green: 'HR_Lib_Green_PreK_K.pdf',
    yellow: 'HR_Lib_Yellow_PreK_K.pdf',
    red: 'HR_Lib_Red_PreK_K.pdf',
  },
  'grades-1-2': {
    green: 'HR_Lib_Green_Grades1_2.pdf',
    yellow: 'HR_Lib_Yellow_Grades1_2.pdf',
    red: 'HR_Lib_Red_Grades1_2.pdf',
  },
  'grades-3-5': {
    green: 'HR_Lib_Green_Grades3_5.pdf',
    yellow: 'HR_Lib_Yellow_Grades3_5.pdf',
    red: 'HR_Lib_Red_Grades3_5.pdf',
  },
  'grades-6-8': {
    green: 'HR_Lib_Green_Grades6_8.pdf',
    yellow: 'HR_Lib_Yellow_Grades6_8.pdf',
    red: 'HR_Lib_Red_Grades6_8.pdf',
  },
};

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
export const PARENT_RESOURCE_PATH = '/resources/harlem-renaissance/parents/HR_Parent_Guide.pdf';
