import type { ApprovedFact } from '@/components/exhibition/FactNote';

/*
 * "Write your own Christmas ghost story", in Dickens' Christmas parlour.
 * Telling ghost stories at Christmas was a Victorian tradition: the three
 * notes are fact-checked against the V&A (A Christmas Carol's own title),
 * Dickens' own words in Household Words (read at Dickens Journals Online)
 * and the Charles Dickens Museum, each set with its source. The story
 * starters, ghosts, places, wishes and spooky words are prompts for the
 * visitor's own writing and make no claims.
 */

export const GHOST_TEXT = {
  tab: 'Write a ghost story',
  heading: 'Write your own Christmas ghost story',
  intro: 'Telling ghost stories round the fire was part of a Victorian Christmas, and Charles Dickens wrote some of the most famous. Now it is your turn to tell one.',
  plan: 'Plan your story',
  write: 'Write your story',
  sheetKicker: 'A Ghost Story of Christmas',
  sheetFoot: 'Written in Dickens’ Christmas Parlour, Victorian Britain, the Mini Museum',
  privacy: 'Nothing you write is saved or sent.',
};

export const GHOST_NOTES = {
  carol: {
    text: 'Dickens’ A Christmas Carol was first published in 1843 as “A Christmas Carol in Prose. A Ghost Story of Christmas”.',
    sources: [{ label: 'V&A, A Christmas Carol, 1843', href: 'https://collections.vam.ac.uk/item/O1681222/a-christmas-carol-book-charles-dickens/' }],
  },
  fireside: {
    text: 'In “A Christmas Tree”, written for Household Words in December 1850, Dickens described “telling Winter Stories—Ghost Stories, or more shame for us—round the Christmas fire”.',
    sources: [{ label: 'Dickens Journals Online, Household Words, vol. II, p. 293', href: 'https://www.djo.org.uk/household-words/volume-ii/page-293.html' }],
  },
  dickens: {
    text: 'Dickens did not particularly believe in ghosts, and yet he loved to hear, retell and write ghost stories.',
    sources: [{ label: 'Charles Dickens Museum, “Ghost Stories by Charles Dickens”', href: 'https://dickensmuseum.com/blogs/explore/ghost-stories-by-charles-dickens' }],
  },
} satisfies Record<string, ApprovedFact>;

/** Openings to start from: press one and it begins the story. */
export const STARTERS = [
  'It was Christmas Eve, and the snow had been falling since noon, when the knocking began at the parlour door.',
  'One by one, the candles on the Christmas tree went out, although there was not a breath of wind in the room.',
  'Nobody had wound the old clock on the mantelpiece for forty years. At midnight, it began to tick.',
  'The last train of Christmas Eve pulled into the empty station, and one passenger stepped down who cast no shadow in the lamplight.',
  'Among the Christmas cards on the mantelpiece was one that nobody remembered opening. It was signed with a name from long ago.',
];

export const GHOSTS = ['a lady in a grey silk dress', 'a boy chimney sweep', 'a kindly old shopkeeper', 'a ghostly dog', 'a lost carol singer'];
export const PLACES = ['the parlour', 'a snowy churchyard', 'a railway station at midnight', 'an old inn on the moor', 'a frozen pond'];
export const WANTS = ['to return a lost present', 'to warn someone of danger', 'to finish singing a carol', 'to find the way home', 'to say sorry'];

export const SPOOKY_WORDS = ['shivered', 'flickered', 'creaked', 'whispered', 'frost', 'lantern', 'shadow', 'chill', 'rattled', 'midnight', 'cobweb', 'echo'];

/** The plan, in a sentence: who the ghost is, where, and what it wants. */
export function planLine(ghost: string | null, place: string | null, want: string | null) {
  if (!ghost && !place && !want) return '';
  return `My ghost is ${ghost ?? '…'}, in ${place ?? '…'}, who wants ${want ?? '…'}.`;
}

/** Adds a word or a sentence to the story, with a space between if it needs one. */
export function addToStory(story: string, words: string, max = STORY_MAX) {
  const sep = !story || /\s$/.test(story) ? '' : ' ';
  return (story + sep + words).slice(0, max);
}

/**
 * Puts a word into the story where the writer's cursor is (`at`), with a
 * space either side where the words would otherwise run together. Returns
 * the story and where the cursor goes after the word.
 */
export function insertAt(story: string, at: number, word: string, max = STORY_MAX) {
  const pos = Math.max(0, Math.min(at, story.length));
  const before = story.slice(0, pos);
  const after = story.slice(pos);
  const lead = before && !/\s$/.test(before) ? ' ' : '';
  const trail = after && !/^[\s.,;:!?]/.test(after) ? ' ' : '';
  const text = (before + lead + word + trail + after).slice(0, max);
  return { story: text, caret: Math.min(text.length, pos + lead.length + word.length) };
}

export const STORY_MAX = 3000;
