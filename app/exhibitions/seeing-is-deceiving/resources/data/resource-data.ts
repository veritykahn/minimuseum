/**
 * Resource data for the Seeing Is Deceiving exhibition
 * Contains file mappings for teachers, librarians, and parents
 */

// Types
export type UserType = 'parent' | 'teacher' | 'librarian' | null;
export type GradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-4' | 'grades-5-8' | null;
export type LibrarianGradeLevel = 'prek-k' | 'grades-1-2' | 'grades-3-5' | 'grades-6-8' | null;
export type Subject = 'science' | 'ela' | 'social-studies' | 'art' | 'math' | 'pe' | 'religion' | 'spanish' | 'theater' | 'music' | null;

// Teacher file mappings by grade level
export const TEACHER_LESSON_PLANS: Record<string, string> = {
  'prek-k': 'Lesson Plan_ My Eyes Can Trick Me! (PreK-K) - Teacher Guide.pdf',
  'grades-1-2': 'Lesson Plan_ Brain Detective (Grades 1-2) - Teacher Guide.pdf',
  'grades-3-4': 'Lesson Plan_ Fact-Checkers (Grades 3-4) - Teacher Guide.pdf',
};

export const TEACHER_HANDOUTS: Record<string, Record<string, string>> = {
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
export const SUBJECT_LESSON_PLANS: Record<string, string> = {
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

export const SUBJECT_HANDOUTS: Record<string, Record<string, string>> = {
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

// Librarian file mappings
export const LIBRARIAN_LESSON_PLANS: Record<string, string> = {
  'prek-k': 'Lesson Plan_ My Eyes Can Play Tricks! (PreK-K Library) - Teacher Guide.pdf',
  'grades-1-2': 'Library Lesson Plan_ Look Again! Finding Hidden Pictures (Grades 1-2) - Teacher Guide.pdf',
  'grades-3-5': "Library Lesson Plan_ Don't Be Fooled! Information Detective Skills (Grades 3-5) - Teacher Guide.pdf",
  'grades-6-8': 'Library Lesson Plan_ Seeing Through Deception (Grades 6-8) - Teacher Guide.pdf',
};

export const LIBRARIAN_HANDOUTS: Record<string, Record<string, string>> = {
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
export const PARENT_RESOURCE_PATH = '/resources/seeing-is-deceiving/parents/Parent Resource Guide_ Optical Illusions & Visual Deception.pdf';
