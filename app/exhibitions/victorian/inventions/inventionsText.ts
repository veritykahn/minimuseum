import type { ApprovedFact } from '@/components/exhibition/FactNote';

/*
 * The inventions workshop's words. The inventions are the three poster 1
 * names, "railways, the telegraph, and photography"; its lines are quoted
 * word for word (victorian.ts), and the room's test checks them. The rest
 * is instruction.
 *
 * What the benches show of each invention comes from outside the posters:
 * notes fact-checked against the Science Museum Group and the V&A, each set
 * with its source (NOTES). The railway's town times are the minutes given
 * in the Great Western Railway's 1841 timetable, as the Science Museum
 * quotes it.
 */

export const POSTER = {
  innovations: 'Iconic innovations like railways, the telegraph, and photography emerged, alongside cultural achievements in literature and art.',
  growth: 'This period saw rapid industrial growth, transforming the nation into a global superpower with an expanding empire.',
};

export const WORKSHOP_TEXT = {
  title: 'Inventions Workshop',
  railwayHeading: 'The railway',
  telegraphHeading: 'The telegraph',
  photoHeading: 'Photography',
  railwayIntro: 'Steam down the line from London, town by town. At each station, compare the railway’s clock with the town’s own.',
  telegraphIntro: 'Press a letter on the dial and two needles swing to point to it. Type a word and send it, and the needles spell it out.',
  photoIntro: 'Make a negative of a latticed window, then print from it: as many prints as you like.',
};

const SCIENCE_MUSEUM_TIME = { label: 'Science Museum, “Standardising time: Railways and the electric telegraph”', href: 'https://www.sciencemuseum.org.uk/objects-and-stories/standardising-time-railways-and-electric-telegraph' };

export const NOTES = {
  railwayTime: {
    text: 'Towns kept their own time by the Sun, so the further west, the later their clocks. In 1841 the Great Western Railway’s timetable read “LONDON TIME is kept at all the Stations on the Railway”, and gave how many minutes each town’s time was behind it.',
    sources: [SCIENCE_MUSEUM_TIME],
  },
  timeSignals: {
    text: 'From 1852, accurate time signals from Greenwich went out across the country over the electric telegraph, and by 1855 nearly all public authorities, such as churches and town halls, set their clocks to “railway time”.',
    sources: [SCIENCE_MUSEUM_TIME],
  },
  telegraph: {
    text: 'William Fothergill Cooke and Charles Wheatstone made their five-needle telegraph in 1837. Any two of its five needles would swing to point to a letter of the alphabet, and any of the 20 letters on the dial could be shown by the right pair.',
    sources: [
      { label: 'Science Museum Group, Cooke and Wheatstone 5-needle telegraph, 1837', href: 'https://collection.sciencemuseumgroup.org.uk/objects/co33374/cooke-and-wheatstone-5-needle-telegraph-1837' },
      { label: 'Science Museum blog, “Revealing the real Cooke and Wheatstone telegraph dial”', href: 'https://blog.sciencemuseum.org.uk/revealing-the-real-cooke-and-wheatstone-telegraph-dial/' },
    ],
  },
  negative: {
    text: 'William Henry Fox Talbot made the oldest known surviving paper negative, of a window at Lacock Abbey, in August 1835.',
    sources: [{ label: 'Science Museum Group, Windows from inside south gallery, Lacock Abbey', href: 'https://collection.sciencemuseumgroup.org.uk/objects/co17291/windows-from-inside-south-gallery-lacock-abbey' }],
  },
  positives: {
    text: 'Talbot’s positive-negative process allows many positive prints to be made of the same image.',
    sources: [{ label: 'V&A, “William Henry Fox Talbot: an introduction”', href: 'https://www.vam.ac.uk/articles/william-henry-fox-talbot-an-introduction' }],
  },
} satisfies Record<string, ApprovedFact>;

/** The towns on the line, east to west, and how many minutes each one's own time was behind London's (the 1841 timetable). */
export const STATIONS: { name: string; behind: number }[] = [
  { name: 'London', behind: 0 },
  { name: 'Reading', behind: 4 },
  { name: 'Steventon', behind: 5.5 },
  { name: 'Chippenham', behind: 8 },
  { name: 'Bath', behind: 11 },
  { name: 'Bristol', behind: 11 },
  { name: 'Bridgewater', behind: 14 },
];

/** Words to tap and send, every letter of them on the dial (no C, J, Q, U, X or Z), so none is left out. */
export const SEND_WORDS = ['HELLO', 'SNOW', 'STEAM', 'TEA', 'BRISTOL'];

/** Words for the needles to spell, every letter of them on the dial. */
export const READ_WORDS = ['STEAM', 'TRAIN', 'LONDON', 'BRISTOL', 'TELEGRAPH', 'PHOTOGRAPH'];
