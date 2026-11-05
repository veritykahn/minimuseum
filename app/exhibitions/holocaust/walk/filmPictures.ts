import type { FactSource } from '@/components/exhibition/FactNote';

/*
 * The film's pictures that are not the owner's own. The owner's 32 pictures
 * (walk-01 to walk-32) need no credit; the slots added when the film was
 * rebuilt (walk-33 to walk-55) were filled on November 4, 2026, at her
 * request, with photographs from Wikimedia Commons: real places, objects
 * and documents where they fit, nothing graphic and no one's face, each
 * license checked on its own file page. Each is credited in the walk's
 * Sources drawer, under its line, as "Picture". REVIEW (Verity): each
 * choice, and the notes beside it.
 */

export type FilmPictureCredit = FactSource & { alt: string };

const commons = (author: string, title: string, license: string, href: string, alt: string): FilmPictureCredit => ({
  label: `${author}, *${title}*. ${license}, via Wikimedia Commons`,
  href,
  alt,
});
void commons;

/** By slot. */
export const FILM_PICTURE_CREDITS: Readonly<Record<string, FilmPictureCredit>> = {};
