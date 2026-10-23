import { LESSONS } from '@/lib/lessons';
import { LESSON_CATALOG, catalogFor, lessonsForPoster, posterProjectorPath } from '@/lib/lessons/catalog';
import { IN_THEIR_HANDS, HARLEM_RENAISSANCE, SEEING_IS_DECEIVING } from '@/components/museum-map/data/levels';
import { getRoomByPath, isRoomCurrent } from '@/components/museum-map/data/rooms';

describe('lesson catalog', () => {
  it('lists every registered lesson, with its own title, subtitle and minutes', () => {
    for (const [exhibition, lessons] of Object.entries(LESSONS)) {
      const cards = catalogFor(exhibition);
      expect(cards.map((c) => c.slug)).toEqual(lessons.map((l) => l.slug));
      for (const l of lessons) {
        const c = cards.find((x) => x.slug === l.slug)!;
        expect({ title: c.title, sub: c.sub, minutes: c.minutes }).toEqual({ title: l.title, sub: l.sub, minutes: l.totalMinutes });
      }
    }
  });

  it('lists no lesson that is not registered', () => {
    for (const exhibition of Object.keys(LESSON_CATALOG)) {
      expect(Object.keys(LESSONS)).toContain(exhibition);
    }
  });

  it('names only posters the exhibition pages have', () => {
    for (const cards of Object.values(LESSON_CATALOG)) {
      for (const c of cards) for (const p of c.posters) expect(['poster1', 'poster2']).toContain(p);
    }
  });

  it('finds the lessons that go with a poster', () => {
    expect(lessonsForPoster('in-their-hands', 'poster1').map((l) => l.slug)).toContain('coin-detectives');
    expect(lessonsForPoster('nowhere', 'poster1')).toEqual([]);
  });

  it('links a poster in projector mode the way usePosterDeepLink reads it', () => {
    expect(posterProjectorPath('in-their-hands', 'poster2')).toBe('/exhibitions/in-their-hands?projector=1&poster=2');
  });
});

describe('Lessons room on the museum map', () => {
  it('appears on the plan of an exhibition with lessons, along its foot', () => {
    const fp = IN_THEIR_HANDS.floorPlan!;
    const room = fp.rooms.find((r) => r.id === 'ith-lessons')!;
    expect(room.path).toBe('/exhibitions/in-their-hands/lessons');
    expect(room.y + room.height).toBe(fp.outline.y + fp.outline.height);
    const [, , , vh] = IN_THEIR_HANDS.viewBox.split(' ').map(Number);
    expect(vh).toBeGreaterThanOrEqual(fp.outline.y + fp.outline.height);
  });

  it('is not drawn for an exhibition without lessons yet', () => {
    for (const [config, exhibition] of [[HARLEM_RENAISSANCE, 'harlem-renaissance'], [SEEING_IS_DECEIVING, 'seeing-is-deceiving']] as const) {
      const has = catalogFor(exhibition).length > 0;
      expect(config.floorPlan!.rooms.some((r) => r.label === 'Lessons')).toBe(has);
    }
  });

  it('is where the visitor is on the lessons page, and the entrance hall is not', () => {
    expect(getRoomByPath('/exhibitions/in-their-hands/lessons')?.id).toBe('ith-lessons');
    const hall = IN_THEIR_HANDS.floorPlan!.rooms.find((r) => r.id === 'ith-entrance')!;
    expect(isRoomCurrent(hall, '/exhibitions/in-their-hands/lessons')).toBe(false);
  });
});
