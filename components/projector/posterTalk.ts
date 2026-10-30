/*
 * "Talk about it": one discussion question per chapter of each poster, for
 * the teacher strip in projector mode. Every question is drawn only from the
 * words of its own chapter's panels — it adds no new facts. A chapter is a
 * section title and the panels after it; '' is the opening, the panels that
 * come before a poster's first section title.
 *
 * Keys are the section titles exactly as the posters set them, so a renamed
 * title shows up as a failing test rather than a silent gap.
 */

export type PosterTalk = Record<string, string>;

export const OPENING = '';

export const SEEING_TALK: { poster1: PosterTalk; poster2: PosterTalk } = {
  poster1: {
    'The Science of How We See':
      'Your brain predicts reality instead of recording it like a camera. How does that shortcut help you, and how can it fool you?',
    'The First Motion Pictures (1820s–1830s)':
      'Nothing on a screen actually moves. So where does the motion you see come from?',
    'The Stereoscope: Inventing Depth':
      'A stereoscope shows each eye a different flat picture. How does your brain turn two flat pictures into depth?',
    'Color Illusions: Context Changes Everything':
      'Two identical squares can look like completely different shades. Why does what surrounds a color change the color you see?',
    'One Picture, Two Realities':
      'You can see the rabbit or the duck, but never both at once. What decides which one your brain shows you?',
    'Motion That Isn\'t There':
      'Why would a brain that is so committed to detecting motion see movement in a picture that is standing still?',
    'Impossible Objects':
      'The Penrose triangle cannot exist in three dimensions. What is your brain trying to do when it looks at one, and why does it fail?',
    'Why Your Eyes Aren\'t Trustworthy':
      'If you see your brain’s interpretation rather than reality, when can you trust your eyes, and when should you check?',
  },
  poster2: {
    'The First Visual Deceptions (1600s–1800s)':
      'New technology creates windows for deception. Why were people who had never seen projected light so easy to fool?',
    'Spirit Photography: When Cameras Lied (1860s–1920s)':
      'Spirit photography worked partly because people wanted to believe. Why does wanting something to be true make it easier to fool us?',
    'Hollywood Magic: Manufacturing Reality (1920s–1980s)':
      'You knew the monster wasn’t real, but your heart still raced. Why does your brain react to something you know is fiction?',
    'Photoshop: Everyone Can Fake (1990s–2000s)':
      'Edited photos could often be caught if you looked closely, but most people weren’t looking closely. What stops people from looking closely?',
    'Deepfakes: AI Creates Reality (2017–Present)':
      'If seeing something happen is no longer reliable evidence that it happened, what else could you check before you believe it?',
    'The Pattern Across 400 Years':
      'The tools change; human psychology doesn’t. What do magic lanterns, spirit photographs and deepfakes have in common?',
    'How Deception Has Been Used':
      'Choose one use of visual manipulation from this panel. Who gains from it, and who is harmed?',
    'How to Verify What You See':
      'Why is content that confirms what you already believe the most dangerous kind?',
  },
};

export const HARLEM_TALK: { poster1: PosterTalk; poster2: PosterTalk } = {
  poster1: {
    'The Trains North':
      'What were people escaping when they left the South, and what were they hoping to find in the North?',
    'The Literary Renaissance':
      'The writers got the credit, but editors and organizers stood behind them. Why might people like Jessie Fauset and Charles S. Johnson matter as much as the writers?',
    'Art, Theater, and Beyond':
      'James Van Der Zee photographed weddings, funerals and everyday moments with dignity. Why does it matter who records a community’s everyday life?',
    'The Sound of Harlem':
      'Rent parties raised money for rent and filled rooms with stride piano until dawn. What does that tell you about the place music had in everyday Harlem life?',
    'The End and the Beginning':
      'The movement was over by the mid-1930s, yet its impact endured. How could it lay a foundation for the Civil Rights Movement?',
  },
  poster2: {
    [OPENING]:
      'Strangers assumed he was white, yet he was one of the most important Black leaders of his century. What questions does that raise for you?',
    'The Man No One Suspected':
      '“Passing” as white meant safety, but it also meant abandoning family, community and identity. What would Walter White have given up if he had passed?',
    'The Night Everything Changed':
      'After the mob passed his house, White wrote, “I knew then who I was.” How might that night have shaped the choices he made later?',
    'The NAACP\'s Secret Weapon':
      'His appearance made him “the perfect spy.” Why did people speak so freely in front of him, and what did that cost him in danger?',
    'Witness Turned Author':
      'Some Southern newspapers denounced The Fire in the Flint as slander, and White considered that a success. Why would he?',
    'Twenty-Four Years at the Helm':
      'White lobbied presidents, pushed for anti-lynching laws and wrote a newspaper column. Which of these do you think did the most for civil rights, and why?',
    'Forgotten Hero':
      'History is not so good at remembering the people who laid the ground. Why was Walter White forgotten, and how should he be remembered?',
  },
};

export const ITH_TALK: { poster1: PosterTalk; poster2: PosterTalk } = {
  poster1: {
    [OPENING]:
      'A priest proposed the Big Bang and a friar founded genetics. What does the poster mean when it calls faith and reason “partners in the same search for truth”?',
    'The Dead Sea Scrolls':
      'A thousand years of copying, and the words had not wandered. Why would that matter to people who read these texts as Scripture, and why would it matter to historians?',
    'The Question That Matters':
      'Not “does it feel true?” but “what does the physical evidence actually show?” Where in your own life would that question help?',
  },
  poster2: {
    [OPENING]:
      'A coin cannot be forged the way a text can. What can a coin’s metal, its die-marks and the earth it came from tell us?',
    'The Thirty Pieces':
      'The only coin allowed in the Temple bore a pagan idol, and the price of betrayal was sacred Temple currency. Which irony strikes you most, and why?',
    'What Archaeology Found by Accident':
      'These coins do not prove the Resurrection, but they prove the world the Gospels describe was a real world. What is the difference between those two claims?',
  },
};

type Item = { type: string; text?: string };

export type Chapter = {
  /** Index of the chapter's first panel. */
  start: number;
  /** The section title, or the poster's own title for the opening. */
  name: string;
  /** The talk key: the section title, or OPENING. */
  key: string;
};

/** The chapters of a poster, in order. The opening is included only if it holds more than title panels. */
export function posterChapters(items: Item[], posterTitle: string): Chapter[] {
  const out: Chapter[] = [];
  const first = items.findIndex((it, i) => i > 0 && it.type === 'section-title');
  const openingEnd = first === -1 ? items.length : first;
  const openingHasText = items.slice(1, openingEnd).some((it) => it.type !== 'end' && it.type !== 'title-image');
  if (openingHasText) out.push({ start: 0, name: posterTitle, key: OPENING });
  items.forEach((it, i) => {
    if (i > 0 && it.type === 'section-title') out.push({ start: i, name: it.text ?? '', key: it.text ?? '' });
  });
  return out;
}

/** The chapter a panel belongs to, or null for a title panel before any chapter. */
export function chapterAt(chapters: Chapter[], step: number): Chapter | null {
  let found: Chapter | null = null;
  for (const c of chapters) if (c.start <= step) found = c;
  return found;
}
