import { act, fireEvent, render, screen, within } from '@testing-library/react';
import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { isAddedPanel } from '@/components/exhibition/helpers';
import type { ExhibitionConfig } from '@/components/exhibition/types';
import { EGYPT } from '@/app/exhibitions/egypt/egypt';
import { MOON } from '@/app/exhibitions/moon/moon';
import { VICTORIAN } from '@/app/exhibitions/victorian/victorian';

/*
 * The panels added to the Moon, Egypt and Victorian posters (A18), and the
 * "Did you know?" notes set beneath printed copy: each names its sources,
 * linked, behind the walkthrough's small "i" (Sources and credits), never
 * inline beside the printed words.
 */

/** The links the "i" lists for the panel on screen, read and closed again. */
const thisPanelLinks = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Sources and credits' }));
  const list = within(screen.getByRole('dialog', { name: 'Sources and credits' })).queryByRole('list', { name: 'This panel' });
  const links = list ? within(list).queryAllByRole('link').map((a) => a.getAttribute('href')) : [];
  fireEvent.click(screen.getByRole('button', { name: 'Close sources' }));
  return links;
};

const EXHIBITIONS: [string, ExhibitionConfig][] = [
  ['Moon', MOON as ExhibitionConfig],
  ['Egypt', EGYPT as ExhibitionConfig],
  ['Victorian', VICTORIAN as ExhibitionConfig],
];
const tick = (ms = 400) => act(() => { jest.advanceTimersByTime(ms); });

describe('panels added to the posters', () => {
  it.each(EXHIBITIONS)('%s: every added panel and note names its sources, each a web link', (_name, config) => {
    let added = 0;
    for (const p of config.posters) {
      for (const it of p.items) {
        if (isAddedPanel(it)) added++;
        const sources = [
          ...((it.type === 'paragraph' || it.type === 'section-title') && it.sources ? it.sources : []),
          ...(it.type === 'paragraph' && it.note ? it.note.sources : []),
        ];
        for (const s of sources) {
          expect(s.label).toBeTruthy();
          expect(s.href).toMatch(/^https:\/\//);
        }
        if (it.type === 'paragraph' && it.note) expect(it.note.sources.length).toBeGreaterThan(0);
      }
    }
    expect(added).toBeGreaterThan(0);
  });

  describe('in the walkthrough', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      window.history.replaceState(null, '', '/');
    });
    afterEach(() => jest.useRealTimers());

    it.each(EXHIBITIONS)('%s: each added panel is set apart and links its sources; each note is labelled "Did you know?"', (_name, config) => {
      for (const poster of config.posters) {
        const { unmount } = render(<PosterExhibition config={config} />);
        const open = document.querySelector(`[data-poster=${poster.id}]`) as HTMLElement;
        fireEvent.click(open);
        tick();
        poster.items.forEach((it, i) => {
          if (i > 0) {
            fireEvent.keyDown(document, { key: 'ArrowRight' });
            tick();
          }
          const content = document.querySelector('.pe-walkthrough-content') as HTMLElement;
          if (isAddedPanel(it) && (it.type === 'paragraph' || it.type === 'section-title')) {
            expect(content.querySelector('.pe-added')).not.toBeNull();
            expect(content.querySelector('.pe-added-source')).toBeNull();
            expect(thisPanelLinks()).toEqual(expect.arrayContaining(it.sources!.map((s) => s.href)));
          }
          if (it.type === 'paragraph' && it.note) {
            const note = content.querySelector('.pe-note') as HTMLElement;
            expect(note).not.toBeNull();
            expect(note.textContent).toMatch(/^Did you know\?/);
            expect(note.querySelectorAll('a')).toHaveLength(0);
            expect(thisPanelLinks()).toEqual(expect.arrayContaining(it.note.sources.map((s) => s.href)));
          }
        });
        unmount();
      }
    });
  });
});
