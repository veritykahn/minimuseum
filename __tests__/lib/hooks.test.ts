import { renderHook, act } from '@testing-library/react';
import { useAnimatedTransition } from '@/lib/hooks/useAnimatedTransition';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';

describe('useAnimatedTransition', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts with isVisible true', () => {
    const { result } = renderHook(() => useAnimatedTransition());
    expect(result.current.isVisible).toBe(true);
  });

  it('animateOut sets isVisible to false, then calls callback and sets back to true', () => {
    const { result } = renderHook(() => useAnimatedTransition(300));
    const callback = jest.fn();

    act(() => {
      result.current.animateOut(callback);
    });

    // Immediately after calling, isVisible should be false
    expect(result.current.isVisible).toBe(false);
    expect(callback).not.toHaveBeenCalled();

    // After timeout, callback should be called and isVisible should be true
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(result.current.isVisible).toBe(true);
  });
});

describe('useEscapeKey', () => {
  it('calls callback when Escape key is pressed', () => {
    const onEscape = jest.fn();
    renderHook(() => useEscapeKey(onEscape));

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(event);

    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('does not call callback when other keys are pressed', () => {
    const onEscape = jest.fn();
    renderHook(() => useEscapeKey(onEscape));

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(event);

    expect(onEscape).not.toHaveBeenCalled();
  });

  it('does not call callback when disabled', () => {
    const onEscape = jest.fn();
    renderHook(() => useEscapeKey(onEscape, false));

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(event);

    expect(onEscape).not.toHaveBeenCalled();
  });

  it('cleans up event listener on unmount', () => {
    const onEscape = jest.fn();
    const { unmount } = renderHook(() => useEscapeKey(onEscape));

    unmount();

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(event);

    expect(onEscape).not.toHaveBeenCalled();
  });
});
