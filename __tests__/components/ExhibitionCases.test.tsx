import { render, screen } from '@testing-library/react';
import ArtifactPage from '@/components/exhibition/ArtifactPage';
import CasePage from '@/components/exhibition/CasePage';
import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { roomReturn } from '@/components/exhibition/helpers';
import AmericaRoomShell from '@/app/exhibitions/america-250/RoomShell';
import FearLabRoomShell from '@/app/exhibitions/fear-lab/RoomShell';
import { artifactParams, artifactPath, casePath, findArtifact, plainText, posterTitle } from '@/components/exhibition/artifacts';
import { EXHIBITION_CASES } from '@/lib/exhibitionCases';
import { getRoomByPath } from '@/components/museum-map/data/rooms';
import sitemap from '@/app/sitemap';

/*
 * The engine-built display cases (Great War, Ancient Egypt, Our Incredible
 * Moon, Victorian Britain, Women's History Month, Holocaust Memorial Day,
 * Black History Month, The Writing Revolution, America 250, The Fear Lab): a
 * card for each artifact on the case page, a page for each artifact, every
 * word the owner's own, and every page reachable from the map and the
 * sitemap; and the rooms, which open from the case and go back to it.
 */

const cases = EXHIBITION_CASES.map((c) => [c.config.slug, c] as const);
const posterText = (config: (typeof EXHIBITION_CASES)[number]['config'], id: string) =>
  (config.posters.find((p) => p.id === id)?.items ?? []).map((it) => ('text' in it ? it.text : '')).join('\n');

it('includes every engine-built case, America 250 and The Fear Lab among them', () => {
  expect(cases.map(([slug]) => slug)).toEqual(['great-war', 'egypt', 'moon', 'victorian', 'womens-history', 'holocaust', 'black-history', 'writing-revolution', 'america-250', 'fear-lab']);
});

describe.each(cases)('%s display case', (slug, { config, data }) => {
  it('has artifacts with unique ids, and no line of the record has been dropped or doubled', () => {
    expect(data.artifacts.length).toBeGreaterThan(0);
    const ids = data.artifacts.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
    for (const line of data.display ?? []) expect(data.artifacts.map((a) => a.record)).not.toContain(line);
  });

  it("uses only the owner's words: each name is cut from its record line, each sentence is on the poster it names", () => {
    for (const a of data.artifacts) {
      expect(plainText(a.record).toLowerCase()).toContain(plainText(a.name).toLowerCase().replace(/^replica |^global /, ''));
      for (const w of a.writing ?? []) {
        expect(posterTitle(config, w.poster)).toBeTruthy();
        expect(posterText(config, w.poster)).toContain(w.text);
      }
    }
  });

  it('shows a card for each artifact on the case page, linking to its page', () => {
    render(<CasePage config={config} data={data} />);
    const cards = screen.getAllByRole('link', { name: /View artifact/ });
    expect(cards.map((c) => c.getAttribute('href'))).toEqual(data.artifacts.map((a) => `${casePath(config)}/${a.id}`));
    for (const [i, a] of data.artifacts.entries()) expect(cards[i]).toHaveTextContent(plainText(a.name));
    expect(screen.getByText('Display case — photographs to come')).toBeInTheDocument();
  });

  it('lists its interactive rooms under "Interactives" on the case page, and not on the landing page', () => {
    const rooms = config.interactives ?? [];
    const { unmount } = render(<CasePage config={config} data={data} />);
    if (rooms.length) {
      expect(screen.getByRole('heading', { level: 2, name: 'Interactives' })).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: /Enter the room/ }).map((l) => l.getAttribute('href'))).toEqual(rooms.map((r) => r.href));
    } else {
      expect(screen.queryByRole('heading', { name: 'Interactives' })).toBeNull();
    }
    unmount();
    window.history.replaceState(null, '', '/');
    render(<PosterExhibition config={config} />);
    for (const r of rooms) expect(document.querySelector(`a[href="${r.href}"]`)).toBeNull();
    // The rooms go back to the case they open from.
    expect(roomReturn(config)).toEqual({ href: casePath(config), label: 'Display Case' });
  });

  it.each(data.artifacts.map((a) => [a.id, a] as const))('%s: its own page, with its writing and the spaces to come', (_id, a) => {
    render(<ArtifactPage config={config} data={data} artifact={a} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(plainText(a.name));
    expect(screen.getByText('3D model to come')).toBeInTheDocument();
    expect(screen.getByText('Interactive to come')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'From the record' })).toBeInTheDocument();
    expect(document.querySelector('.pe-artifact-record')).toHaveTextContent(plainText(a.record));
    for (const w of a.writing ?? []) expect(screen.getByText(w.text)).toBeInTheDocument();
    if (!a.writing?.length) expect(screen.queryByRole('heading', { name: /From the poster/ })).toBeNull();
    // back to the case and to the exhibition
    expect(screen.getByRole('link', { name: 'Back to the Display Case' })).toHaveAttribute('href', casePath(config));
    expect(screen.getByRole('link', { name: 'Return to Exhibition' })).toHaveAttribute('href', `/exhibitions/${slug}`);
    for (const link of screen.getAllByRole('link', { name: 'Display Case' })) expect(link).toHaveAttribute('href', casePath(config));
    expect(screen.getByRole('link', { name: config.name })).toHaveAttribute('href', `/exhibitions/${slug}`);
    expect(screen.queryAllByRole('img').filter((el) => el.tagName === 'IMG')).toHaveLength(0);
  });

  it('builds a page for each artifact, and finds no other', () => {
    expect(artifactParams(data)).toEqual(data.artifacts.map((a) => ({ artifact: a.id })));
    expect(findArtifact(data, 'not-an-artifact')).toBeUndefined();
  });

  it('puts every artifact page inside its case room on the map, and in the sitemap', () => {
    const caseRoom = getRoomByPath(casePath(config));
    expect(caseRoom).toBeTruthy();
    const urls = sitemap().map((e) => e.url);
    for (const a of data.artifacts) {
      expect(getRoomByPath(artifactPath(config, a))?.id).toBe(caseRoom?.id);
      expect(urls).toContain(`https://www.minimuseumproject.org${artifactPath(config, a)}`);
    }
  });
});

describe("a room's way back", () => {
  it.each([
    ['america-250', AmericaRoomShell],
    ['fear-lab', FearLabRoomShell],
  ] as const)('%s: the room frame goes back to the display case', (slug, RoomShell) => {
    render(<RoomShell className="test-room">room</RoomShell>);
    expect(screen.getByRole('link', { name: /Display Case/ })).toHaveAttribute('href', `/exhibitions/${slug}/artifacts/case`);
  });

  it('goes back to the exhibition when there is no case', () => {
    expect(roomReturn({ slug: 'somewhere' })).toEqual({ href: '/exhibitions/somewhere', label: 'Exhibition' });
  });
});
