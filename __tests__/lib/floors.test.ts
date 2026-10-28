import { FLOORS, GROUND_FLOOR, FIRST_FLOOR, floorReturnFor } from '@/lib/floors';
import { getLevelConfig, MUSEUM_OVERVIEW } from '@/components/museum-map/data/levels';
import { getRoomByPath, isRoomCurrent } from '@/components/museum-map/data/rooms';
import { FEAR_LAB } from '@/app/exhibitions/fear-lab/fearLab';
import { GREAT_WAR } from '@/app/exhibitions/great-war/greatWar';
import { EGYPT } from '@/app/exhibitions/egypt/egypt';
import { MOON } from '@/app/exhibitions/moon/moon';
import { AMERICA_250 } from '@/app/exhibitions/america-250/america250';
import { VICTORIAN } from '@/app/exhibitions/victorian/victorian';
import { WOMENS_HISTORY } from '@/app/exhibitions/womens-history/womensHistory';
import { HOLOCAUST } from '@/app/exhibitions/holocaust/holocaust';
import { BLACK_HISTORY } from '@/app/exhibitions/black-history/blackHistory';
import { WRITING_REVOLUTION } from '@/app/exhibitions/writing-revolution/writingRevolution';

const slugs = (floor: typeof GROUND_FLOOR) => floor.exhibitions.map((e) => e.slug);

describe('the floors, by theme', () => {
  it('puts the deep past on the Ground Floor, in historical order', () => {
    expect(slugs(GROUND_FLOOR)).toEqual(['moon', 'egypt', 'in-their-hands', 'america-250', 'victorian']);
  });

  it('puts the 20th century and the mind on the First Floor', () => {
    expect(slugs(FIRST_FLOOR)).toEqual([
      'great-war', 'harlem-renaissance', 'womens-history', 'holocaust',
      'black-history', 'writing-revolution', 'seeing-is-deceiving', 'fear-lab',
    ]);
  });

  it('opens only the built exhibitions', () => {
    const open = FLOORS.flatMap((f) => f.exhibitions.filter((e) => e.active).map((e) => e.slug));
    expect(open.sort()).toEqual(['america-250', 'egypt', 'fear-lab', 'great-war', 'harlem-renaissance', 'in-their-hands', 'moon', 'seeing-is-deceiving', 'victorian', 'womens-history', 'holocaust', 'black-history', 'writing-revolution'].sort());
  });

  it('sends each exhibition back to its own floor, at its own card', () => {
    expect(floorReturnFor('in-their-hands')).toEqual({
      href: '/exhibitions/ground-floor', label: 'Ground Floor', remember: { key: 'groundFloorIndex', value: '2' },
    });
    expect(floorReturnFor('seeing-is-deceiving').remember).toEqual({ key: 'firstFloorIndex', value: '6' });
    expect(FEAR_LAB.back).toEqual(floorReturnFor('fear-lab'));
    expect(EGYPT.back).toEqual({ href: '/exhibitions/ground-floor', label: 'Ground Floor', remember: { key: 'groundFloorIndex', value: '1' } });
    expect(MOON.back).toEqual({ href: '/exhibitions/ground-floor', label: 'Ground Floor', remember: { key: 'groundFloorIndex', value: '0' } });
    expect(AMERICA_250.back).toEqual({ href: '/exhibitions/ground-floor', label: 'Ground Floor', remember: { key: 'groundFloorIndex', value: '3' } });
    expect(VICTORIAN.back).toEqual({ href: '/exhibitions/ground-floor', label: 'Ground Floor', remember: { key: 'groundFloorIndex', value: '4' } });
    expect(WOMENS_HISTORY.back).toEqual({ href: '/exhibitions/first-floor', label: 'First Floor', remember: { key: 'firstFloorIndex', value: '2' } });
    expect(HOLOCAUST.back).toEqual({ href: '/exhibitions/first-floor', label: 'First Floor', remember: { key: 'firstFloorIndex', value: '3' } });
    expect(BLACK_HISTORY.back).toEqual({ href: '/exhibitions/first-floor', label: 'First Floor', remember: { key: 'firstFloorIndex', value: '4' } });
    expect(WRITING_REVOLUTION.back).toEqual({ href: '/exhibitions/first-floor', label: 'First Floor', remember: { key: 'firstFloorIndex', value: '5' } });
    expect(GREAT_WAR.back).toEqual({
      href: '/exhibitions/first-floor', label: 'First Floor', remember: { key: 'firstFloorIndex', value: '0' },
    });
  });
});

describe('the floors on the museum map', () => {
  it('draws each floor with its exhibitions, in the floor page order', () => {
    for (const floor of FLOORS) {
      const config = getLevelConfig(floor.path);
      expect(config.rooms.map((r) => r.id)).toEqual(slugs(floor));
      for (const room of config.rooms) {
        const exhibition = floor.exhibitions.find((e) => e.slug === room.id)!;
        expect(room.path).toBe(`/exhibitions/${room.id}`);
        expect(!!room.comingSoon).toBe(!exhibition.active);
      }
      const overview = MUSEUM_OVERVIEW.rooms.find((r) => r.path === floor.path)!;
      expect(overview.children).toEqual(slugs(floor));
      expect(overview.comingSoon).toBeFalsy();
    }
  });

  it('keeps every room on a floor inside the view, clear of the others', () => {
    for (const floor of FLOORS) {
      const config = getLevelConfig(floor.path);
      const [, , vw, vh] = config.viewBox.split(' ').map(Number);
      for (const a of config.rooms) {
        expect(a.x).toBeGreaterThanOrEqual(0);
        expect(a.x + a.width).toBeLessThanOrEqual(vw);
        expect(a.y + a.height + (a.comingSoon ? 16 : 0)).toBeLessThanOrEqual(vh);
        for (const b of config.rooms) {
          if (a === b) continue;
          const overlap = a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
          expect(overlap).toBe(false);
        }
      }
    }
  });

  it('shows In Their Hands under the Ground Floor', () => {
    const ith = getLevelConfig('/exhibitions/in-their-hands/timeline');
    expect(ith.title).toBe('In Their Hands');
    expect(ith.ancestors?.map((a) => a.viewPath)).toEqual(['/greathall', '/exhibitions/ground-floor']);
    expect(ith.backTarget?.path).toBe('/exhibitions/ground-floor');
    expect(getRoomByPath('/exhibitions/in-their-hands')?.parent).toBe('ground-floor');
    const room = getLevelConfig('/exhibitions/ground-floor').rooms.find((r) => r.id === 'in-their-hands')!;
    expect(isRoomCurrent(room, '/exhibitions/in-their-hands/hands')).toBe(true);
  });
});
