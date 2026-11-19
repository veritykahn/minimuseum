/**
 * The clues on each coin in "Place the Coin" (PlaceTheCoin.tsx), and why its
 * place on the timeline is right. Nothing here is new: every clue is the
 * room's own fact-checked text, shortened into plain words, from the stop's
 * story and passage (timeline-data.ts), the coin's case description
 * (artifacts/coin-data.ts) and Hands of History (hands/data.ts).
 *
 * `who` and `story` are shown before the coin is placed, so they never give
 * a date (a test checks). `why` is shown once it is placed, with its date.
 */
export type CoinClues = {
  /** What the coin itself tells you: whose it is, what is on it. */
  who: string;
  /** What happens in its story. */
  story: string;
  /** Why it belongs where it does (shown after placing). */
  why: string;
};

export const COIN_CLUES: Record<number, CoinClues> = {
  1: {
    who: 'A Roman emperor. His face is on this bronze coin.',
    story: 'He orders a census of the whole empire. It sends Mary and Joseph to Bethlehem, where Jesus is born.',
    why: 'The census story is set when Jesus was born, right at the start of the timeline.',
  },
  2: {
    who: 'A king of Judaea. His coins show no human face, because Jewish law forbade it.',
    story: 'An angel warns Joseph to take the child Jesus to Egypt, to escape this king.',
    why: 'Jesus was still a little child. Herod died in 4 BC, not long afterward.',
  },
  3: {
    who: 'A king of Nabataea, east of Judaea. His daughter was married to Herod Antipas.',
    story: 'John the Baptist is put in prison for speaking out against Antipas’s new marriage.',
    why: 'John the Baptist was arrested before the stories of Jesus’s last days, which come next on the timeline.',
  },
  4: {
    who: 'A lepton: the smallest coin there was, worth less than half a penny.',
    story: 'A poor widow gives two tiny coins at the Temple. Jesus says she gave more than all the rich.',
    why: 'This was Jesus’s last public teaching before the Passion.',
  },
  5: {
    who: 'A silver denarius with the face of the emperor Tiberius. It reads PONTIF MAXIM: High Priest.',
    story: 'Jesus is asked about paying the Roman tax. “Whose image is this?” he asks.',
    why: 'Tiberius was emperor from 14 to 37 AD. Jesus asks his question in the same years as the Passion.',
  },
  6: {
    who: 'A silver shekel from Tyre. The Temple took only this coin for its tax.',
    story: 'Judas is paid thirty pieces of silver to hand Jesus over.',
    why: 'Judas’s betrayal comes just before the Crucifixion.',
  },
  7: {
    who: 'A Roman governor of Judaea. His coin shows a ladle used in Roman worship.',
    story: 'At Jesus’s trial, he washes his hands in front of the crowd.',
    why: 'Pilate governed Judaea from 26 to 36 AD, and he sentenced Jesus.',
  },
  8: {
    who: 'The ruler of Galilee, the land Jesus came from.',
    story: 'During Jesus’s trial, Pilate sends Jesus to him. He hopes to see a miracle, but Jesus says nothing.',
    why: 'This happened during Jesus’s trial.',
  },
  9: {
    who: 'A king, and a grandson of Herod the Great.',
    story: 'He has the apostle James put to death, and then arrests Peter.',
    why: 'Jesus’s followers were now spreading his message: the early Church, in the book of Acts. Agrippa died soon afterward.',
  },
  10: {
    who: 'A Roman emperor.',
    story: 'He orders all Jews to leave Rome. So Aquila and Priscilla move to Corinth, and meet Paul there.',
    why: 'Paul was travelling to spread the early Church. Claudius sent the Jews out of Rome around 49 AD.',
  },
  11: {
    who: 'A new Roman governor of Judaea.',
    story: 'Paul has been a prisoner for two years. He appeals to Caesar: “To Caesar you will go!”',
    why: 'This comes near the end of Acts. It sent Paul on his journey to Rome.',
  },
};
