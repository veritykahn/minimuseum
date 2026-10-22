import { act, renderHook } from '@testing-library/react';
import { useCarousel } from '@/app/exhibitions/seeing-is-deceiving/illusions/hooks';

jest.useFakeTimers();

const press = (key: string) => act(() => {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  jest.advanceTimersByTime(500);
});

describe('Perception Lab carousel keys', () => {
  it('does not fall back to the intro from the first illusion', () => {
    const { result } = renderHook(() => useCarousel({ totalItems: 5, minIndex: 1 }));
    press('ArrowRight');
    expect(result.current.currentIndex).toBe(1);
    press('ArrowLeft');
    expect(result.current.currentIndex).toBe(1);
  });

  it('leaves the arrow keys alone while a modal dialog is open', () => {
    const { result } = renderHook(() => useCarousel({ totalItems: 5, minIndex: 1 }));
    press('ArrowRight');
    const dialog = document.createElement('div');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    document.body.appendChild(dialog);
    press('ArrowRight');
    expect(result.current.currentIndex).toBe(1);
    dialog.setAttribute('inert', '');
    press('ArrowRight');
    expect(result.current.currentIndex).toBe(2);
    dialog.remove();
  });
});
