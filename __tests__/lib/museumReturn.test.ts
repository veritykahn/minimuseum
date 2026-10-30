import { act, renderHook } from '@testing-library/react';
import { STUDIO, STUDIO_TOOLS, studioToolHref } from '@/lib/floors';
import { rememberReturn, returnFor, studioReturnFor, useMuseumReturn, type MuseumReturn } from '@/lib/museumReturn';

/*
 * The way back from a page: its own (a room's display case), unless the
 * Studio opened it (`?from=studio`), when it goes back to the Studio at the
 * tool's own card.
 */

const CASE: MuseumReturn = { href: '/exhibitions/america-250/artifacts/case', label: 'Display Case' };

describe("a Studio tool's address", () => {
  it('says the Studio sent the visitor, before any #tab', () => {
    expect(studioToolHref('/exhibitions/america-250/sign#class')).toBe('/exhibitions/america-250/sign?from=studio#class');
    expect(studioToolHref('/exhibitions/victorian/christmas-card')).toBe('/exhibitions/victorian/christmas-card?from=studio');
    expect(studioToolHref('/exhibitions/x?y=1#z')).toBe('/exhibitions/x?y=1&from=studio#z');
  });
});

describe('the way back', () => {
  it("is the page's own, with no `from`", () => {
    expect(returnFor({ pathname: '/exhibitions/america-250/sign', search: '', hash: '#class' }, CASE)).toBe(CASE);
    expect(returnFor({ pathname: '/exhibitions/america-250/sign', search: '?from=elsewhere', hash: '' }, CASE)).toBe(CASE);
  });

  it('is the Studio, at the card of the tool the visitor opened', () => {
    STUDIO_TOOLS.forEach((tool, i) => {
      const url = new URL(studioToolHref(tool.href), 'https://example.org');
      expect(returnFor(url, CASE)).toEqual({ href: STUDIO.path, label: 'Studio', remember: { key: STUDIO.storageKey, value: String(i) } });
    });
  });

  it('tells apart two tools in one room by their tab, and falls back to the first', () => {
    expect(studioReturnFor('/exhibitions/black-history/representation', '#books').remember?.value).toBe('8');
    expect(studioReturnFor('/exhibitions/black-history/representation', '#design').remember?.value).toBe('7');
    expect(studioReturnFor('/exhibitions/black-history/representation/', '').remember?.value).toBe('7');
  });

  it('saves the card to come back to, and survives storage being unavailable', () => {
    sessionStorage.clear();
    rememberReturn(studioReturnFor('/exhibitions/writing-revolution/typing-station', '#board'));
    expect(sessionStorage.getItem('studioIndex')).toBe('9');
    rememberReturn(CASE);
    expect(sessionStorage.getItem('studioIndex')).toBe('9');
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => rememberReturn(studioReturnFor('/exhibitions/victorian/christmas-card'))).not.toThrow();
    spy.mockRestore();
  });
});

describe('useMuseumReturn', () => {
  afterEach(() => window.history.replaceState(null, '', '/'));

  it('reads the address once, on arrival', () => {
    window.history.replaceState(null, '', '/exhibitions/america-250/sign?from=studio#mine');
    const { result } = renderHook(() => useMuseumReturn(CASE));
    expect(result.current).toEqual({ href: '/exhibitions/third-floor', label: 'Studio', remember: { key: 'studioIndex', value: '1' } });
    // Changing tab inside the room does not move the way back.
    act(() => window.history.replaceState(null, '', '/exhibitions/america-250/sign?from=studio#class'));
    expect(result.current.remember?.value).toBe('1');
  });

  it("keeps the page's own way back on a direct visit", () => {
    window.history.replaceState(null, '', '/exhibitions/america-250/sign#mine');
    const { result } = renderHook(() => useMuseumReturn(CASE));
    expect(result.current).toBe(CASE);
  });
});
