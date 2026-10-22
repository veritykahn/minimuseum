import { renderHook, act } from '@testing-library/react';
import { usePosterWalkthrough } from '@/lib/usePosterNavigation';

function key(k: string, target: EventTarget = document.body) {
  const e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true });
  target.dispatchEvent(e);
  return e;
}

describe('usePosterWalkthrough', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.sessionStorage.clear();
  });
  afterEach(() => jest.useRealTimers());

  function openPoster() {
    const hook = renderHook(() => usePosterWalkthrough({ poster1: 5, poster2: 3 }));
    act(() => hook.result.current.openPoster('poster1'));
    act(() => { jest.advanceTimersByTime(300); });
    return hook;
  }

  it('opens a poster and announces the hint once', () => {
    const { result } = openPoster();
    expect(result.current.activeView).toBe('poster1');
    expect(result.current.hintVisible).toBe(true);
    expect(result.current.announcement).toMatch(/^Panel 1 of 5\. Use the left and right arrow keys/);
  });

  it('moves with arrow, page and home/end keys', () => {
    const { result } = openPoster();
    act(() => { key('ArrowRight'); jest.advanceTimersByTime(400); });
    expect(result.current.posterStep).toBe(1);
    expect(result.current.announcement).toBe('Panel 2 of 5.');
    expect(result.current.hintVisible).toBe(false);
    act(() => { key('PageDown'); jest.advanceTimersByTime(400); });
    expect(result.current.posterStep).toBe(2);
    act(() => { key('ArrowLeft'); jest.advanceTimersByTime(400); });
    expect(result.current.posterStep).toBe(1);
    act(() => { key('End'); jest.advanceTimersByTime(400); });
    expect(result.current.posterStep).toBe(4);
    act(() => { key('ArrowRight'); jest.advanceTimersByTime(400); });
    expect(result.current.posterStep).toBe(4);
    act(() => { key('Home'); jest.advanceTimersByTime(400); });
    expect(result.current.posterStep).toBe(0);
  });

  it('ignores keys typed into form fields', () => {
    const { result } = openPoster();
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    act(() => { key('ArrowRight', input); jest.advanceTimersByTime(400); });
    expect(result.current.posterStep).toBe(0);
    input.remove();
  });

  it('closes on Escape', () => {
    const { result } = openPoster();
    act(() => { key('Escape'); jest.advanceTimersByTime(300); });
    expect(result.current.activeView).toBe('main');
    expect(result.current.announcement).toBe('');
  });

  it('shows the hint only on the first open of a session', () => {
    const { result } = openPoster();
    act(() => { key('Escape'); jest.advanceTimersByTime(300); });
    act(() => result.current.openPoster('poster2'));
    act(() => { jest.advanceTimersByTime(300); });
    expect(result.current.hintVisible).toBe(false);
    expect(result.current.announcement).toBe('Panel 1 of 3.');
  });

  it('does not listen for keys while no poster is open', () => {
    const { result } = renderHook(() => usePosterWalkthrough({ poster1: 5, poster2: 3 }));
    const e = key('ArrowRight');
    expect(e.defaultPrevented).toBe(false);
    expect(result.current.posterStep).toBe(0);
  });
});
