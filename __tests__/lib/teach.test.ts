import { existsSync } from 'fs';
import { join } from 'path';
import { LESSONS } from '@/lib/lessons';
import { LESSON_CATALOG, catalogFor } from '@/lib/lessons/catalog';
import {
  FAITH_LESSONS,
  GRADES,
  GRADE_BANDS,
  TEACH_FAITH_KEY,
  TEACH_FINDER_KEY,
  TEACH_ROLES,
  TEACH_ROLE_KEY,
  bandForGrade,
  contrast,
  exhibitionTeachTheme,
  faithSwitchShown,
  findLessons,
  finderHeading,
  gradeParts,
  guidesFor,
  isResourcesLink,
  lessonPrintables,
  libraryBandForGrade,
  libraryPrintables,
  needsSubject,
  readFaith,
  readFinder,
  readTeachRole,
  subjectsFor,
  suitsRole,
  teachTheme,
  writeFaith,
  writeFinder,
  writeTeachRole,
} from '@/lib/lessons/teach';
import { EGYPT } from '@/app/exhibitions/egypt/egypt';
import { BLACK_HISTORY } from '@/app/exhibitions/black-history/blackHistory';
import { VICTORIAN } from '@/app/exhibitions/victorian/victorian';
import { MOON } from '@/app/exhibitions/moon/moon';
import { HOLOCAUST } from '@/app/exhibitions/holocaust/holocaust';
import { AMERICA_250 } from '@/app/exhibitions/america-250/america250';
import { FEAR_LAB } from '@/app/exhibitions/fear-lab/fearLab';
import { GREAT_WAR } from '@/app/exhibitions/great-war/greatWar';
import { WOMENS_HISTORY } from '@/app/exhibitions/womens-history/womensHistory';
import { WRITING_REVOLUTION } from '@/app/exhibitions/writing-revolution/writingRevolution';

/* "Teach with this" and the Resources hub: roles, the lesson finder, the faith switch, printables and colours. */

const onDisk = (href: string) => existsSync(join(process.cwd(), 'public', ...href.split('/').map(decodeURIComponent)));

describe('Teach with this: roles', () => {
  beforeEach(() => window.sessionStorage.clear());

  it('offers four roles: teacher, librarian, parent and homeschool', () => {
    expect(TEACH_ROLES.map((r) => r.label)).toEqual(['Teacher', 'Librarian', 'Parent', 'Homeschool']);
  });

  it('remembers the role for the visit, and survives storage that throws', () => {
    expect(readTeachRole()).toBeNull();
    writeTeachRole('homeschool');
    expect(window.sessionStorage.getItem(TEACH_ROLE_KEY)).toBe('homeschool');
    expect(readTeachRole()).toBe('homeschool');
    window.sessionStorage.setItem(TEACH_ROLE_KEY, 'principal');
    expect(readTeachRole()).toBeNull();

    const get = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const set = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(readTeachRole()).toBeNull();
    expect(readFinder()).toEqual({ grade: null, subject: null });
    expect(() => writeTeachRole('teacher')).not.toThrow();
    expect(() => writeFaith(true)).not.toThrow();
    get.mockRestore();
    set.mockRestore();
  });

  it('remembers the finder’s grade and subject for the visit', () => {
    writeFinder('8', 'Social Studies');
    expect(JSON.parse(window.sessionStorage.getItem(TEACH_FINDER_KEY)!)).toEqual({ grade: '8', subject: 'Social Studies' });
    expect(readFinder()).toEqual({ grade: '8', subject: 'Social Studies' });
    window.sessionStorage.setItem(TEACH_FINDER_KEY, '{"grade":"12"}');
    expect(readFinder().grade).toBeNull();
  });
});

describe('Teach with this: the lesson finder', () => {
  it('reads every lesson’s grade as one of the bands, with a subject only for grades 5–8', () => {
    for (const cards of Object.values(LESSON_CATALOG)) {
      for (const c of cards) {
        const { band, subject } = gradeParts(c);
        expect(GRADE_BANDS).toContain(band);
        expect(subject === null).toBe(band !== 'Grades 5–8');
      }
    }
  });

  it('puts each grade in its catalog band and its library band', () => {
    expect(GRADES.map(bandForGrade)).toEqual(['PreK–K', 'PreK–K', 'Grades 1–2', 'Grades 1–2', 'Grades 3–4', 'Grades 3–4', 'Grades 5–8', 'Grades 5–8', 'Grades 5–8', 'Grades 5–8']);
    expect(GRADES.map(libraryBandForGrade)).toEqual(['prek-k', 'prek-k', 'grades-1-2', 'grades-1-2', 'grades-3-5', 'grades-3-5', 'grades-3-5', 'grades-6-8', 'grades-6-8', 'grades-6-8']);
  });

  it('shows a Grade 8 Social Studies teacher just their lesson', () => {
    const r = findLessons(['in-their-hands'], { role: 'teacher', grade: '8', subject: 'Social Studies', faith: false });
    expect(r.lessons.map((l) => l.card.slug)).toEqual(['who-ruled-judaea']);
    expect(r.lessons[0].online).toBe('/exhibitions/in-their-hands/lessons/who-ruled-judaea');
    expect(finderHeading('teacher', '8', 'Social Studies')).toBe('For a Grade 8 Social Studies teacher');
  });

  it('asks for a subject only at grades 5–8, and not of a librarian', () => {
    expect(needsSubject(['harlem-renaissance'], '3', 'teacher')).toBe(false);
    expect(needsSubject(['harlem-renaissance'], '6', 'teacher')).toBe(true);
    expect(needsSubject(['harlem-renaissance'], '6', 'librarian')).toBe(false);
    expect(findLessons(['harlem-renaissance'], { role: 'parent', grade: '6', subject: null, faith: false })).toEqual({ needsSubject: true, lessons: [], hiddenFaith: 0 });
    expect(findLessons(['harlem-renaissance'], { role: 'homeschool', grade: 'K', subject: null, faith: false }).lessons.map((l) => l.card.slug)).toEqual([
      'music-stories-and-movement',
    ]);
  });

  it('gives a librarian the general lessons and the reading and research ones', () => {
    const slugs = (g: (typeof GRADES)[number]) => findLessons(['seeing-is-deceiving'], { role: 'librarian', grade: g, subject: null, faith: true }).lessons.map((l) => l.card.slug);
    expect(slugs('1')).toEqual(['brain-detective']);
    expect(slugs('7')).toEqual(['evaluating-sources', 'visual-propaganda-through-history']);
    expect(suitsRole(catalogFor('seeing-is-deceiving').find((l) => l.slug === 'geometry-of-perspective')!, 'librarian')).toBe(false);
  });

  it('finds lessons across every exhibition for the Resources hub', () => {
    const all = Object.keys(LESSON_CATALOG);
    const r = findLessons(all, { role: 'teacher', grade: '7', subject: 'Math', faith: false });
    expect(r.lessons.map((l) => [l.exhibition, l.card.slug])).toEqual([
      ['in-their-hands', 'the-numbers-in-the-coins'],
      ['harlem-renaissance', 'migration-by-numbers'],
      ['seeing-is-deceiving', 'geometry-of-perspective'],
      ['moon', 'how-far-is-far'],
      ['america-250', 'counting-a-nation'],
      ['victorian', 'railway-time'],
      ['womens-history', 'who-counts'],
      ['black-history', 'whos-on-our-shelf'],
    ]);
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
});

describe('Teach with this: faith-based lessons', () => {
  beforeEach(() => window.sessionStorage.clear());

  it('is a switch, off by default, kept for the visit, decided by one constant', () => {
    expect(FAITH_LESSONS).toBe('switch-off');
    expect(faithSwitchShown()).toBe(true);
    expect(readFaith()).toBe(false);
    writeFaith(true);
    expect(window.sessionStorage.getItem(TEACH_FAITH_KEY)).toBe('on');
    expect(readFaith()).toBe(true);
    // the other settings the constant can take
    window.sessionStorage.clear();
    expect(readFaith('switch-on')).toBe(true);
    expect([faithSwitchShown('always'), readFaith('always')]).toEqual([false, true]);
    expect([faithSwitchShown('never'), readFaith('never')]).toEqual([false, false]);
  });

  it('hides faith-based lessons when off, and says how many it hid', () => {
    const off = findLessons(['in-their-hands'], { role: 'teacher', grade: '1', subject: null, faith: false });
    expect(off.lessons).toEqual([]);
    expect(off.hiddenFaith).toBe(1);
    const on = findLessons(['in-their-hands'], { role: 'teacher', grade: '1', subject: null, faith: true });
    expect(on.lessons.map((l) => [l.card.slug, l.card.faith])).toEqual([['whose-hands-held-this', true]]);
  });

  it('drops Religion from the subjects when off', () => {
    expect(subjectsFor(['harlem-renaissance'], '8', 'teacher', false)).not.toContain('Religion');
    expect(subjectsFor(['harlem-renaissance'], '8', 'teacher', true)).toContain('Religion');
    expect(subjectsFor(['harlem-renaissance'], '8', 'teacher', false)[0]).toBe('Social Studies');
  });
});

describe('Teach with this: printables', () => {
  it('prints every lesson with its own lesson plan and three handouts, all on disk', () => {
    for (const [exhibition, cards] of Object.entries(LESSON_CATALOG)) {
      for (const c of cards) {
        const p = lessonPrintables(exhibition, c.slug);
        expect([c.slug, p.map((x) => x.kind)]).toEqual([c.slug, ['plan', 'handout', 'handout', 'handout']]);
        for (const x of p) expect([x.href, onDisk(x.href)]).toEqual([x.href, true]);
      }
    }
    expect(lessonPrintables('in-their-hands', 'who-ruled-judaea')[0].href).toBe('/resources/in-their-hands/teachers/grades-5-8/social-studies/ITH_LP_SocialStudies.pdf');
  });

  it('adds the library set for a librarian where the exhibition has one', () => {
    expect(libraryPrintables('in-their-hands', '4')).toEqual([]);
    const set = libraryPrintables('harlem-renaissance', '7');
    expect(set[0].label).toBe('Library lesson plan, Grades 6–8');
    for (const x of [...set, ...libraryPrintables('seeing-is-deceiving', 'K')]) expect([x.href, onDisk(x.href)]).toEqual([x.href, true]);
  });

  it('gives each role its guides, all on disk', () => {
    for (const exhibition of Object.keys(LESSON_CATALOG)) {
      for (const role of TEACH_ROLES) for (const g of guidesFor(exhibition, role.id)) expect([g.href, onDisk(g.href)]).toEqual([g.href, true]);
      expect(guidesFor(exhibition, 'parent').map((p) => p.label)).toContain('Parent Resource Guide');
      expect(guidesFor(exhibition, 'homeschool').map((p) => p.label)).toEqual(['Parent Resource Guide', 'Quick Teaching Guide', 'Teacher Explanation Sheet']);
      expect(guidesFor(exhibition, 'teacher').map((p) => p.label)).not.toContain('Parent Resource Guide');
    }
    expect(guidesFor('no-such-exhibition', 'teacher')).toEqual([]);
  });

  it('knows the old resources pages, which rooms no longer link to', () => {
    expect(isResourcesLink('/exhibitions/in-their-hands/resources')).toBe(true);
    expect(isResourcesLink('/exhibitions/in-their-hands/real-or-replica')).toBe(false);
    expect(isResourcesLink('/resources')).toBe(false);
  });
});

describe('Teach with this: each room’s colours', () => {
  const configs = [EGYPT, BLACK_HISTORY, VICTORIAN, MOON, HOLOCAUST, AMERICA_250, FEAR_LAB, GREAT_WAR, WOMENS_HISTORY, WRITING_REVOLUTION];

  it('wears the room’s own ground, and every pairing reads', () => {
    for (const c of configs) {
      const v = teachTheme(exhibitionTeachTheme(c.palette, c.projector.theme, c.fonts));
      expect(v['--tw-bg']).toBe(c.palette.page);
      const grounds = ['--tw-bg', '--tw-surface', '--tw-soft'] as const;
      for (const k of ['--tw-ink', '--tw-muted', '--tw-accent-text'] as const) {
        for (const g of grounds) expect([c.slug, k, g, contrast(v[k], v[g]) >= 4.5]).toEqual([c.slug, k, g, true]);
      }
      for (const g of grounds) expect([c.slug, g, contrast(v['--tw-accent'], v[g]) >= 3]).toEqual([c.slug, g, true]);
      expect(contrast(v['--tw-heading'], v['--tw-bg'])).toBeGreaterThanOrEqual(3);
      expect(contrast(v['--tw-on-accent'], v['--tw-accent'])).toBeGreaterThanOrEqual(4.5);
      expect(v['--tw-display']).toBe(c.fonts.display);
    }
  });

  it('gives a colour that would not read way to the next choice', () => {
    // Black History's projector ink is near-white, which does not read on its lime: its black heading does.
    const v = teachTheme(exhibitionTeachTheme(BLACK_HISTORY.palette, BLACK_HISTORY.projector.theme, BLACK_HISTORY.fonts));
    expect(v['--tw-ink']).toBe(BLACK_HISTORY.palette.heading);
    // Egypt's orange heads the sheet and fills its buttons; its body copy is the projector's light ink.
    const e = teachTheme(exhibitionTeachTheme(EGYPT.palette, EGYPT.projector.theme, EGYPT.fonts));
    expect([e['--tw-heading'], e['--tw-accent']]).toEqual([EGYPT.palette.heading, EGYPT.palette.teach.color]);
    expect(e['--tw-ink']).not.toBe(EGYPT.palette.heading);
  });
});
