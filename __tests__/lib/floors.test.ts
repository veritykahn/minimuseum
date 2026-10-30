import { existsSync } from 'fs';
import { join } from 'path';
import { ALL_FLOORS, FLOORS, GROUND_FLOOR, FIRST_FLOOR, SECOND_FLOOR, STUDIO, findExhibition, floorReturnFor, studioToolHref } from '@/lib/floors';
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

describe('the floors, by era', () => {
  it('puts the deep past on the Ground Floor, in historical order', () => {
    expect(slugs(GROUND_FLOOR)).toEqual(['moon', 'egypt', 'in-their-hands', 'america-250', 'victorian']);
  });

  it('puts the 20th century on the First Floor', () => {
    expect(slugs(FIRST_FLOOR)).toEqual(['great-war', 'harlem-renaissance', 'womens-history', 'holocaust']);
  });

  it('puts identity, words and the mind on the Second Floor', () => {
    expect(slugs(SECOND_FLOOR)).toEqual(['black-history', 'writing-revolution', 'seeing-is-deceiving', 'fear-lab']);
    expect(SECOND_FLOOR).toMatchObject({ path: '/exhibitions/second-floor', name: 'Second Floor', theme: 'Identity, words & the mind', storageKey: 'secondFloorIndex' });
  });

  it('gives each floor its own name, number and color, the Studio at the top', () => {
    expect(ALL_FLOORS.map((f) => [f.path, f.marker])).toEqual([
      ['/exhibitions/ground-floor', 'G'],
      ['/exhibitions/first-floor', '1'],
      ['/exhibitions/second-floor', '2'],
      ['/exhibitions/third-floor', '3'],
    ]);
    expect(new Set(ALL_FLOORS.map((f) => f.accent)).size).toBe(4);
    expect(new Set(ALL_FLOORS.map((f) => f.storageKey)).size).toBe(4);
    // "Studio", not "The Studio", wherever it is named.
    expect(STUDIO).toMatchObject({ name: 'Third Floor', title: 'Studio', heading: 'Third Floor: Studio' });
  });

  it('opens only the built exhibitions', () => {
    const open = FLOORS.flatMap((f) => f.exhibitions.filter((e) => e.active).map((e) => e.slug));
    expect(open.sort()).toEqual(['america-250', 'egypt', 'fear-lab', 'great-war', 'harlem-renaissance', 'in-their-hands', 'moon', 'seeing-is-deceiving', 'victorian', 'womens-history', 'holocaust', 'black-history', 'writing-revolution'].sort());
  });

  it('sends each exhibition back to its own floor, at its own card', () => {
    expect(floorReturnFor('in-their-hands')).toEqual({
      href: '/exhibitions/ground-floor', label: 'Ground Floor', remember: { key: 'groundFloorIndex', value: '2' },
    });
    expect(floorReturnFor('seeing-is-deceiving')).toEqual({
      href: '/exhibitions/second-floor', label: 'Second Floor', remember: { key: 'secondFloorIndex', value: '2' },
    });
    expect(FEAR_LAB.back).toEqual(floorReturnFor('fear-lab'));
    expect(EGYPT.back).toEqual({ href: '/exhibitions/ground-floor', label: 'Ground Floor', remember: { key: 'groundFloorIndex', value: '1' } });
    expect(MOON.back).toEqual({ href: '/exhibitions/ground-floor', label: 'Ground Floor', remember: { key: 'groundFloorIndex', value: '0' } });
    expect(AMERICA_250.back).toEqual({ href: '/exhibitions/ground-floor', label: 'Ground Floor', remember: { key: 'groundFloorIndex', value: '3' } });
    expect(VICTORIAN.back).toEqual({ href: '/exhibitions/ground-floor', label: 'Ground Floor', remember: { key: 'groundFloorIndex', value: '4' } });
    expect(WOMENS_HISTORY.back).toEqual({ href: '/exhibitions/first-floor', label: 'First Floor', remember: { key: 'firstFloorIndex', value: '2' } });
    expect(HOLOCAUST.back).toEqual({ href: '/exhibitions/first-floor', label: 'First Floor', remember: { key: 'firstFloorIndex', value: '3' } });
    expect(BLACK_HISTORY.back).toEqual({ href: '/exhibitions/second-floor', label: 'Second Floor', remember: { key: 'secondFloorIndex', value: '0' } });
    expect(WRITING_REVOLUTION.back).toEqual({ href: '/exhibitions/second-floor', label: 'Second Floor', remember: { key: 'secondFloorIndex', value: '1' } });
    expect(FEAR_LAB.back).toEqual({ href: '/exhibitions/second-floor', label: 'Second Floor', remember: { key: 'secondFloorIndex', value: '3' } });
    expect(GREAT_WAR.back).toEqual({
      href: '/exhibitions/first-floor', label: 'First Floor', remember: { key: 'firstFloorIndex', value: '0' },
    });
  });
});

describe('the Studio', () => {
  it('gathers every make-your-own tool, each a door to it in its exhibition', () => {
    expect(STUDIO.tools.map((t) => t.href)).toEqual([
      '/exhibitions/america-250/sign#class',
      '/exhibitions/america-250/sign#mine',
      '/exhibitions/victorian/christmas-card',
      '/exhibitions/great-war/memorial#remember',
      '/exhibitions/harlem-renaissance/jazz-lab#studio',
      '/exhibitions/harlem-renaissance/harlem-in-words',
      '/exhibitions/womens-history/violet#make',
      '/exhibitions/black-history/representation#design',
      '/exhibitions/black-history/representation#books',
      '/exhibitions/writing-revolution/typing-station#board',
    ]);
  });

  it('opens rooms that exist, in exhibitions on the floors', () => {
    for (const tool of STUDIO.tools) {
      const [route] = tool.href.split('#');
      expect(route.startsWith(`/exhibitions/${tool.exhibition}/`)).toBe(true);
      expect(findExhibition(tool.exhibition)?.active).toBe(true);
      expect(existsSync(join(process.cwd(), 'app', route, 'page.tsx'))).toBe(true);
      expect(tool.description.length).toBeGreaterThan(0);
    }
  });

  it('is on the map as a floor of its tools, each in its exhibition’s color', () => {
    const level = getLevelConfig('/exhibitions/third-floor');
    expect(level.title).toBe('3rd Floor: Studio');
    // Through the Studio's door, so the tool's "M ←" comes back to the Studio.
    expect(level.rooms.map((r) => r.path)).toEqual(STUDIO.tools.map((t) => studioToolHref(t.href)));
    expect(level.rooms.map((r) => r.accentColor)).toEqual(STUDIO.tools.map((t) => findExhibition(t.exhibition)!.accent));
    const [, , vw, vh] = level.viewBox.split(' ').map(Number);
    for (const r of level.rooms) {
      expect(r.x + r.width).toBeLessThanOrEqual(vw);
      expect(r.y + r.height).toBeLessThanOrEqual(vh);
    }
    expect(MUSEUM_OVERVIEW.rooms.find((r) => r.id === 'third-floor')?.children).toEqual(level.rooms.map((r) => r.id));
  });
});

describe('the floors on the museum map', () => {
  it('climbs from the Great Hall through every floor', () => {
    expect(MUSEUM_OVERVIEW.rooms.filter((r) => r.parent === 'greathall' && r.path.endsWith('-floor')).map((r) => r.path)).toEqual([
      '/exhibitions/third-floor', '/exhibitions/second-floor', '/exhibitions/first-floor', '/exhibitions/ground-floor',
    ]);
    expect(MUSEUM_OVERVIEW.connections).toEqual(expect.arrayContaining([
      ['greathall', 'third-floor'], ['third-floor', 'second-floor'], ['second-floor', 'first-floor'], ['first-floor', 'ground-floor'],
    ]));
    for (const floor of ALL_FLOORS) expect(getRoomByPath(floor.path)?.parent).toBe('greathall');
  });

  it('follows each exhibition to its floor, two levels up', () => {
    for (const floor of FLOORS) {
      for (const e of floor.exhibitions) {
        const level = getLevelConfig(`/exhibitions/${e.slug}`);
        expect(level.backTarget?.path).toBe(floor.path);
        expect(level.ancestors?.map((a) => a.viewPath)).toEqual(['/greathall', floor.path]);
        expect(getRoomByPath(`/exhibitions/${e.slug}`)?.parent).toBe(floor.path.split('/').pop());
      }
    }
  });

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
