/**
 * The mentor poem students read before composing.
 *
 * Langston Hughes, "The Negro Speaks of Rivers", as first published in
 * The Crisis (NAACP), June 1921. Public domain in the United States.
 * Text checked word for word against two independent transcriptions of
 * the 1921 printing: Wikisource ("The Negro Speaks of Rivers (Crisis)")
 * and Lehigh University's "African American Poetry: A Digital Anthology".
 * The later dedication "To W. E. B. Du Bois" belongs to the 1926 book
 * printing, not the 1921 one, so it is not shown.
 *
 * Stanzas are arrays of lines; a line Hughes's printers ran over is one
 * line here, and wraps naturally on screen.
 */
export const MENTOR_POEM = {
  title: 'The Negro Speaks of Rivers',
  author: 'Langston Hughes',
  stanzas: [
    [
      'I’ve known rivers:',
      'I’ve known rivers ancient as the world and older than the flow of human blood in human veins.',
    ],
    ['My soul has grown deep like the rivers.'],
    [
      'I bathed in the Euphrates when dawns were young.',
      'I built my hut near the Congo and it lulled me to sleep.',
      'I looked upon the Nile and raised the pyramids above it.',
      'I heard the singing of the Mississippi when Abe Lincoln went down to New Orleans, and I’ve seen its muddy bosom turn all golden in the sunset.',
    ],
    [
      'I’ve known rivers:',
      'Ancient, dusky rivers.',
    ],
    ['My soul has grown deep like the rivers.'],
  ],
  credit: 'First published in The Crisis, June 1921. Public domain in the United States.',
} as const;

/**
 * The room's Sources drawer: the poem's publication and licence credit, and
 * the two transcriptions its text was checked against (named as above).
 */
export const MENTOR_SOURCES = [
  {
    title: 'Read a mentor poem',
    items: [
      {
        label: `${MENTOR_POEM.author}, “${MENTOR_POEM.title}.” First published in The Crisis (NAACP), June 1921`,
        licence: 'Public domain in the United States',
      },
      { note: 'Text checked against', label: 'Wikisource, “The Negro Speaks of Rivers (Crisis)”' },
      { note: 'Text checked against', label: 'Lehigh University, “African American Poetry: A Digital Anthology”' },
    ],
  },
] as const;

/** What to notice: craft moves a student can borrow, all visible in the text. */
export const MENTOR_NOTICES = [
  {
    title: 'One voice, many centuries',
    text: 'A single “I” bathes in the Euphrates, builds by the Congo, raises the pyramids by the Nile and hears the Mississippi.',
  },
  {
    title: 'A refrain',
    // REVIEW: new text. It said the poem "ends where it began, with 'I've known
    // rivers'", but the poem's last line is "My soul has grown deep like the rivers."
    text: '“I’ve known rivers” and “My soul has grown deep like the rivers” each come twice. The poem ends on “My soul has grown deep like the rivers,” a line it first said near the start.',
  },
  {
    title: 'Strong verbs',
    text: 'Each line in the long stanza starts with I and an action: bathed, built, looked, heard.',
  },
] as const;

/** Prompt cards. Every word they suggest is in the word bank. */
export const PROMPT_CARDS = [
  'Speak as “I.” Start with I and a word from Action: I rise, I carry, I remember.',
  'Name a place. Choose Harlem, Lenox or Beale Street and tell what happens there.',
  'Write like a river. Pick a word from Nature and let it carry a word from Emotion.',
  'Four strong verbs. Choose four Action words and give each one its own line.',
  // REVIEW: new text. It was "Come full circle. End your poem the way Hughes
  // ends his: back where it began", which the poem does not quite do, and
  // which the word bank made impossible (each word can be used once). Repeat
  // a line on the poem board now copies a line.
  'Use a refrain. Write a line you love, then bring it back with Repeat a line, the way Hughes does.',
] as const;

/**
 * The lines the mentor poem says more than once (its refrains), for the
 * "find the lines that come back" task before the notes on what to notice.
 */
export function repeatedLines(stanzas: readonly (readonly string[])[] = MENTOR_POEM.stanzas): string[] {
  const all = stanzas.flat();
  return all.filter((l, i) => all.indexOf(l) !== i).filter((l, i, arr) => arr.indexOf(l) === i);
}
