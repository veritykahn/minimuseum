import fs from 'fs';
import path from 'path';
import { fireEvent, render, screen } from '@testing-library/react';
import PosterExhibition from '@/components/exhibition/PosterExhibition';
import CasePage from '@/components/exhibition/CasePage';
import ArtifactPage from '@/components/exhibition/ArtifactPage';
import ExploreRow, { ExploreCue } from '@/components/exhibition/ExploreRow';
import { CASE_PLACEHOLDER_LABEL } from '@/components/exhibition/CasePlaceholder';
import { roomsInOrder } from '@/components/exhibition/roomsInOrder';
import { casePath } from '@/components/exhibition/artifacts';
import { expectedCasePhotos, leadCasePhoto, NO_CASE_PHOTOS } from '@/components/exhibition/casePhotoPaths';
import { casePhotosOnDisk, casesWithPhotos } from '@/components/exhibition/casePhotos';
import { EXHIBITION_CASES } from '@/lib/exhibitionCases';
import { EGYPT, EGYPT_CASE } from '@/app/exhibitions/egypt/egypt';
import HarlemRenaissance from '@/app/exhibitions/harlem-renaissance/page';
import HarlemCase from '@/app/exhibitions/harlem-renaissance/artifacts/page';
import { HARLEM_ROOMS } from '@/app/exhibitions/harlem-renaissance/rooms';
import SeeingIsDeceiving from '@/app/exhibitions/seeing-is-deceiving/page';
import SeeingCase from '@/app/exhibitions/seeing-is-deceiving/artifacts/page';
import { SEEING_ROOMS } from '@/app/exhibitions/seeing-is-deceiving/rooms';
import InTheirHands from '@/app/exhibitions/in-their-hands/page';
import IthCase6 from '@/app/exhibitions/in-their-hands/artifacts/case-6/page';
import IthCase7 from '@/app/exhibitions/in-their-hands/artifacts/case-7/page';
import IthCase8 from '@/app/exhibitions/in-their-hands/artifacts/case-8/page';
import { ITH_ROOMS } from '@/app/exhibitions/in-their-hands/rooms';

/*
 * The owner's review (Nov 2026), A1 and A2: every exhibition's landing page
 * has an Explore row of its interactive rooms below the posters and case,
 * listing exactly the rooms its case's Interactives tab lists; and every
 * display case and artifact takes the owner's photograph from a documented
 * drop-in path, the placeholder standing in until the file is there.
 */

const ROOT = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exploreHrefs = () => Array.from(document.querySelectorAll('.pe-explore a')).map((a) => a.getAttribute('href'));
const caseRoomHrefs = () => {
  fireEvent.click(screen.getByRole('tab', { name: /Interactives/ }));
  const panel = screen.getByRole('tabpanel');
  return Array.from(panel.querySelectorAll('a')).map((a) => a.getAttribute('href'));
};

// The hand-built landing pages hold their panels' music; jsdom has no media.
beforeAll(() => {
  jest.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  jest.spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
});
afterAll(() => jest.restoreAllMocks());
afterEach(() => window.history.replaceState(null, '', '/'));

describe('the Explore row', () => {
  it.each(EXHIBITION_CASES.map((c) => [c.config.slug, c] as const))('%s: lists the same rooms, in the same order, as its case\'s Interactives tab', (_slug, { config, data }) => {
    const { unmount } = render(<PosterExhibition config={config} />);
    const explore = exploreHrefs();
    expect(explore.length).toBe(config.interactives?.length ?? 0);
    expect(explore.length).toBeGreaterThan(0);
    // Each card: the room's picture, its title and its one-line hook, from the case card's own words.
    for (const r of config.interactives ?? []) {
      const card = document.querySelector(`.pe-explore a[href="${r.href}"]`) as HTMLElement;
      expect(card).toHaveTextContent(r.title);
      if (r.subtitle) expect(card).toHaveTextContent(r.subtitle);
      if (r.image) expect(card.querySelector('img')).toHaveAttribute('src', r.image.src);
    }
    // The cue at the foot of the first screen points down to it.
    expect(document.querySelector('.pe-landing .pe-explore-cue')).toHaveAttribute('href', '#explore');
    expect(document.querySelector('.pe-landing + .pe-explore')).not.toBeNull();
    unmount();
    window.history.replaceState(null, '', casePath(config));
    render(<CasePage config={config} data={data} />);
    expect(caseRoomHrefs()).toEqual(explore);
  });

  it('puts the Tomb Explorer first for Egypt, labelled as the way in, in both lists', () => {
    const rooms = roomsInOrder(EGYPT.interactives);
    expect(rooms[0].href).toBe('/exhibitions/egypt/tomb');
    expect(rooms[0].start).toBe('Start here');
    render(<PosterExhibition config={EGYPT} />);
    const first = document.querySelector('.pe-explore li:first-child a') as HTMLElement;
    expect(first).toHaveAttribute('href', '/exhibitions/egypt/tomb');
    expect(first).toHaveClass('is-start');
    expect(first).toHaveTextContent('Start here');
    expect(document.querySelectorAll('.pe-explore-start')).toHaveLength(1);
  });

  it.each([
    ['harlem-renaissance', HarlemRenaissance, [HarlemCase], HARLEM_ROOMS],
    ['seeing-is-deceiving', SeeingIsDeceiving, [SeeingCase], SEEING_ROOMS],
    ['in-their-hands', InTheirHands, [IthCase6, IthCase7, IthCase8], ITH_ROOMS],
  ] as const)('%s (hand-built): its Explore row and its cases\' Interactives come from one list', (_slug, Landing, Cases, rooms) => {
    const { unmount } = render(<Landing />);
    const explore = exploreHrefs();
    expect(explore).toEqual(rooms.map((r) => r.href));
    expect(document.querySelector('.pe-landing .pe-explore-cue')).not.toBeNull();
    unmount();
    const fromCases: (string | null)[] = [];
    for (const Case of Cases) {
      const { unmount: done } = render(<Case />);
      fromCases.push(...caseRoomHrefs());
      done();
    }
    expect(fromCases).toEqual(explore);
  });

  it('draws nothing for an exhibition with no rooms', () => {
    const { container } = render(
      <>
        <ExploreRow rooms={[]} />
        <ExploreCue rooms={undefined} />
      </>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('keeps clear of the Map button and of the sides of the screen', () => {
    const css = read('components/exhibition/explore-row.css');
    // The foot clears the 56px button 24px from the bottom.
    expect(css).toMatch(/\.pe-explore \{[^}]*padding: [^;]* 120px;/);
    // Wider than a phone, 88px clear of each side, as the landing row is.
    expect(css).toMatch(/@media \(min-width: 641px\) \{\s*\.pe-explore \{ width: min\(100%, calc\(100vw - 176px\)\);/);
    // On a phone, one column: no sideways scroll.
    expect(css).toMatch(/@media \(max-width: 640px\) \{\s*\.pe-explore-grid \{ grid-template-columns: minmax\(0, 1fr\);/);
  });
});

describe('the display case photographs', () => {
  const egyptDisk = { case: '/exhibitions/egypt/case/case.jpg', artifacts: { bastet: '/exhibitions/egypt/case/bastet.jpg' } };

  it('lists a drop-in path for the case and for every artifact', () => {
    for (const { config, data } of EXHIBITION_CASES) {
      const files = expectedCasePhotos(config, data).map((f) => f.file);
      expect(files).toContain(`public/exhibitions/${config.slug}/case/case.jpg`);
      for (const a of data.artifacts) expect(files).toContain(`public/exhibitions/${config.slug}/case/${a.id}.jpg`);
    }
  });

  it('finds none yet, so every case keeps its placeholder', () => {
    for (const { config, data } of EXHIBITION_CASES) {
      expect(casePhotosOnDisk(config, data)).toEqual({ case: undefined, cutout: undefined, artifacts: {} });
      expect(casesWithPhotos(config)).toEqual(config.cases);
    }
  });

  it('uses a photograph once its file is there', () => {
    const spy = jest.spyOn(fs, 'existsSync').mockImplementation((p) => /egypt[/\\]case[/\\](case|scarab)\.jpg$/.test(String(p)));
    try {
      expect(casePhotosOnDisk(EGYPT, EGYPT_CASE)).toEqual({ case: '/exhibitions/egypt/case/case.jpg', cutout: undefined, artifacts: { scarab: '/exhibitions/egypt/case/scarab.jpg' } });
      expect(casesWithPhotos(EGYPT)?.[0].image).toEqual({ src: '/exhibitions/egypt/case/case.jpg', alt: 'The Ancient Egypt display case' });
    } finally {
      spy.mockRestore();
    }
  });

  it('sets the case photograph at the head of the case page, and each artifact\'s on its card', () => {
    render(<CasePage config={EGYPT} data={EGYPT_CASE} photos={egyptDisk} />);
    expect(screen.queryByText(CASE_PLACEHOLDER_LABEL)).toBeNull();
    expect(document.querySelector('.pe-case-page-lead img')).toHaveAttribute('src', '/exhibitions/egypt/case/case.jpg');
    const bastet = screen.getByRole('link', { name: /Bastet/ });
    expect(bastet.querySelector('img')).toHaveAttribute('src', '/exhibitions/egypt/case/bastet.jpg');
    const anubis = screen.getByRole('link', { name: /Anubis statue/ });
    expect(anubis.querySelector('img')).toBeNull();
    expect(anubis.querySelector('.pe-artifact-glyph')).not.toBeNull();
  });

  it('keeps the placeholder, with its warmer label, until then', () => {
    expect(CASE_PLACEHOLDER_LABEL).toBe('Photographs on their way');
    expect(leadCasePhoto(EGYPT_CASE, NO_CASE_PHOTOS, EGYPT.name)).toBeUndefined();
    render(<CasePage config={EGYPT} data={EGYPT_CASE} />);
    expect(screen.getByText(CASE_PLACEHOLDER_LABEL)).toBeInTheDocument();
  });

  it('sets an artifact\'s photograph on its own page', () => {
    const scarab = EGYPT_CASE.artifacts.find((a) => a.id === 'scarab')!;
    render(<ArtifactPage config={EGYPT} data={EGYPT_CASE} artifact={scarab} photo="/exhibitions/egypt/case/scarab.jpg" />);
    expect(screen.getByRole('img', { name: 'Scarab beetle amulet' })).toHaveAttribute('src', '/exhibitions/egypt/case/scarab.jpg');
    expect(screen.getByText('3D model to come')).toBeInTheDocument();
  });

  it('keeps public/ out of the functions of every page that looks for the photographs', () => {
    const config = read('next.config.ts');
    for (const { config: c } of EXHIBITION_CASES) expect(config).toMatch(new RegExp(`CASE_PHOTO_EXHIBITIONS = \\[[^\\]]*'${c.slug}'`));
    expect(config).toMatch(/CASE_PHOTO_EXHIBITIONS\.map\(\(slug\) => \[`\/exhibitions\/\$\{slug\}`, \['public\/\*\*'\]\]\)/);
  });
});

describe('the Egypt scarab', () => {
  it('has a description of its own on its card, sourced, not the Anubis statue\'s line', () => {
    const scarab = EGYPT_CASE.artifacts.find((a) => a.id === 'scarab')!;
    const anubis = EGYPT_CASE.artifacts.find((a) => a.id === 'anubis')!;
    expect(scarab.about?.text).toMatch(/Khepri/);
    expect(scarab.about?.sources[0].href).toMatch(/^https:\/\/www\.britishmuseum\.org\//);
    render(<CasePage config={EGYPT} data={EGYPT_CASE} />);
    const card = screen.getByRole('link', { name: /Scarab beetle amulet/ });
    expect(card).toHaveTextContent(scarab.about!.text);
    expect(card).not.toHaveTextContent(anubis.record);
  });

  it('shows it, with its source, on the scarab\'s own page', () => {
    const scarab = EGYPT_CASE.artifacts.find((a) => a.id === 'scarab')!;
    render(<ArtifactPage config={EGYPT} data={EGYPT_CASE} artifact={scarab} />);
    expect(screen.getByRole('heading', { name: 'About it' })).toBeInTheDocument();
    expect(screen.getByText(scarab.about!.text)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /British Museum/ })).toHaveAttribute('href', scarab.about!.sources[0].href);
  });
});
