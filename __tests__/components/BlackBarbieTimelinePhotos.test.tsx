import { fireEvent, render, screen } from '@testing-library/react';
import BlackBarbieTimeline from '@/app/exhibitions/black-history/timeline/page';
import { photoFor, type OwnerPhoto } from '@/app/exhibitions/black-history/timeline/timelineStops';

/*
 * The timeline's photograph spot, with a fixture in place of the owner's
 * list (empty until her photographs come; BlackBarbieTimeline.test.tsx
 * checks the room is unchanged without them). The fixture is shaped like
 * the V&A's photograph of the first Black Barbie, under 768 px wide.
 */

jest.mock('@/app/exhibitions/black-history/timeline/timelineStops', () => ({
  ...jest.requireActual('@/app/exhibitions/black-history/timeline/timelineStops'),
  OWNER_BARBIE_PHOTOS: [
    {
      stop: '1980',
      src: '/exhibitions/black-history/photos/fixture.jpg',
      alt: 'A doll in a red dress, standing',
      credit: { text: '© Victoria and Albert Museum, London', href: 'https://collections.vam.ac.uk/' },
      width: 600,
      height: 800,
    },
  ],
}));

const FIXTURE: OwnerPhoto = {
  stop: '1980',
  src: '/exhibitions/black-history/photos/fixture.jpg',
  alt: 'A doll in a red dress, standing',
  credit: { text: '© Victoria and Albert Museum, London', href: 'https://collections.vam.ac.uk/' },
  width: 600,
  height: 800,
};

beforeEach(() => window.history.replaceState(null, '', '/'));

it('finds a stop’s photograph by its id', () => {
  expect(photoFor('1980', [FIXTURE])).toBe(FIXTURE);
  expect(photoFor('1967', [FIXTURE])).toBeUndefined();
  expect(photoFor('1980', [])).toBeUndefined();
});

it('sets the photograph at its own stop only, with its credit beneath', () => {
  render(<BlackBarbieTimeline />);
  expect(screen.queryByRole('img', { name: FIXTURE.alt })).toBeNull();

  fireEvent.click(screen.getByRole('button', { name: 'Stop 3, The first Black Barbie, year hidden' }));
  // The photograph waits, with the words, for the year to be guessed or shown.
  expect(screen.queryByRole('img', { name: FIXTURE.alt })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Just show me' }));
  const img = screen.getByRole('img', { name: FIXTURE.alt });
  expect(img).toHaveAttribute('src', FIXTURE.src);
  expect(img).toHaveAttribute('width', '600');
  expect(img).toHaveAttribute('height', '800');
  const figure = img.closest('figure')!;
  expect(figure).toHaveClass('bht-photo');
  // Sized to the disc, and never wider than the file's own 600 px.
  expect(figure.style.getPropertyValue('--photo-w')).toBe('min(calc(var(--disc-d) * 0.45), calc(var(--disc-d) * 0.5), 600px)');
  const credit = screen.getByRole('link', { name: FIXTURE.credit.text });
  expect(credit).toHaveAttribute('href', FIXTURE.credit.href);
  expect(credit.closest('figcaption')).toHaveClass('bht-photo-credit');

  fireEvent.click(screen.getByRole('button', { name: 'Stop 4, Dolls of the World, year hidden' }));
  fireEvent.click(screen.getByRole('button', { name: 'Just show me' }));
  expect(screen.queryByRole('img', { name: FIXTURE.alt })).toBeNull();
});

it('leaves the arrow keys to the credit’s link, and to the stops as before', () => {
  render(<BlackBarbieTimeline />);
  fireEvent.click(screen.getByRole('button', { name: 'Stop 3, The first Black Barbie, year hidden' }));
  fireEvent.click(screen.getByRole('button', { name: 'Just show me' }));
  const stop = screen.getByRole('button', { name: '1980, The first Black Barbie' });
  fireEvent.keyDown(screen.getByRole('link', { name: FIXTURE.credit.text }), { key: 'ArrowRight' });
  expect(stop).toHaveAttribute('aria-current', 'step');
  fireEvent.keyDown(stop, { key: 'ArrowRight' });
  expect(screen.getByRole('button', { name: 'Stop 4, Dolls of the World, year hidden' })).toHaveAttribute('aria-current', 'step');
});
