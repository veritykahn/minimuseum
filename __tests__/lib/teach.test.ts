import { existsSync } from 'fs';
import { join } from 'path';
import { LESSONS } from '@/lib/lessons';
import { LESSON_CATALOG, catalogFor } from '@/lib/lessons/catalog';
import {
  GRADE_BANDS,
  SECTION_ORDER,
  TEACH_ROLE_KEY,
  gradeParts,
  lessonsByGrade,
  printablesFor,
  readTeachRole,
  suitsRole,
  writeTeachRole,
} from '@/lib/lessons/teach';

/* "Teach with this": which lessons and printables each role sees. */

describe('Teach with this', () => {
  beforeEach(() => window.sessionStorage.clear());

  it('reads every lesson’s grade as one of the bands, with a subject only for grades 5–8', () => {
    for (const cards of Object.values(LESSON_CATALOG)) {
      for (const c of cards) {
        const { band, subject } = gradeParts(c);
        expect(GRADE_BANDS).toContain(band);
        expect(subject === null).toBe(band !== 'Grades 5–8');
      }
    }
  });

  it('gives a teacher and a parent every lesson, youngest first', () => {
    for (const role of ['teacher', 'parent'] as const) {
      const groups = lessonsByGrade('harlem-renaissance', role);
      expect(groups.map((g) => g.band)).toEqual([...GRADE_BANDS]);
      expect(groups.flatMap((g) => g.lessons).length).toBe(catalogFor('harlem-renaissance').length);
    }
  });

  it('gives a librarian the general lessons and the reading and research ones', () => {
    const slugs = lessonsByGrade('seeing-is-deceiving', 'librarian').flatMap((g) => g.lessons.map((l) => l.slug));
    expect(slugs).toEqual(['my-eyes-can-trick-me', 'brain-detective', 'fact-checkers', 'evaluating-sources', 'visual-propaganda-through-history']);
    expect(suitsRole(catalogFor('seeing-is-deceiving').find((l) => l.slug === 'geometry-of-perspective')!, 'librarian')).toBe(false);
  });

  it('labels a lesson faith-based exactly when it is a Religion lesson or prays with the class', () => {
    for (const [exhibition, lessons] of Object.entries(LESSONS)) {
      for (const l of lessons) {
        const card = catalogFor(exhibition).find((c) => c.slug === l.slug)!;
        const prays = l.steps.some((s) => s.screen.kind === 'prayer');
        expect([l.slug, Boolean(card.faith)]).toEqual([l.slug, prays || gradeParts(card).subject === 'Religion']);
      }
    }
  });

  it('offers printables only where the files are, and the right ones for each role', () => {
    for (const exhibition of Object.keys(LESSON_CATALOG)) {
      for (const role of ['teacher', 'librarian', 'parent'] as const) {
        for (const p of printablesFor(exhibition, role).filter((x) => x.file)) {
          expect(existsSync(join(process.cwd(), 'public', decodeURI(p.href)))).toBe(true);
        }
      }
      expect(printablesFor(exhibition, 'parent').map((p) => p.label)).toContain('Parent Resource Guide');
      expect(printablesFor(exhibition, 'teacher').map((p) => p.label)).not.toContain('Parent Resource Guide');
    }
    expect(printablesFor('in-their-hands', 'librarian').map((p) => p.label)).not.toContain('Library lesson plans and handouts');
    expect(printablesFor('harlem-renaissance', 'librarian').map((p) => p.label)).toContain('Library lesson plans and handouts');
    expect(printablesFor('moon', 'teacher')).toEqual([]);
  });

  it('shows every group for every role', () => {
    for (const order of Object.values(SECTION_ORDER)) expect([...order].sort()).toEqual(['discussion', 'interactives', 'lessons', 'present', 'printables']);
  });

  it('remembers the role for the visit, and survives storage that throws', () => {
    expect(readTeachRole()).toBeNull();
    writeTeachRole('librarian');
    expect(window.sessionStorage.getItem(TEACH_ROLE_KEY)).toBe('librarian');
    expect(readTeachRole()).toBe('librarian');
    window.sessionStorage.setItem(TEACH_ROLE_KEY, 'principal');
    expect(readTeachRole()).toBeNull();

    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const set = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(readTeachRole()).toBeNull();
    expect(() => writeTeachRole('teacher')).not.toThrow();
    spy.mockRestore();
    set.mockRestore();
  });
});
