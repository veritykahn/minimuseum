import type { GameItemMeta } from '@/components/games/types';
import { mulberry32, shuffle, type Tier } from '@/components/games/scoring';

export type HandsCharacter = GameItemMeta & {
  character: string;
  coinName: string;
  coinDate: string;
  prompt: string;
  caption: string;
  fullImage: string;
  handsImage: string;
  story: string;
  /** Why it is this person: the coin, read from the story above. */
  clue: string;
};

export const HANDS_CHARACTERS: HandsCharacter[] = [
  {
    id: 'hands-1',
    teacherTip:
      'Ask what a soldier in Judaea was paid with, and where he would have spent it.',
    character: "The Roman Soldier",
    coinName: "Pontius Pilate Prutah",
    coinDate: "26–36 AD",
    prompt: "Whose hands held this Pilate Prutah?",
    caption: "Pontius Pilate Prutah \u00B7 26\u201336 AD",
    fullImage: "/exhibitions/in-their-hands/Hands/roman-soldier-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/roman-soldier-hands-v1.jpg",
    story: "A Roman soldier garrisoned in Jerusalem. Soldiers were paid in local currency, and in Judaea that meant small bronze prutot minted by the Roman prefect Pontius Pilate. These coins carried pagan symbols \u2014 a simpulum and three bound ears of grain \u2014 that were deliberately provocative in a Jewish province. A soldier would have used coins like this one to buy food and supplies in the Jerusalem market. This particular coin was minted in 29 or 30 AD, within a few years of the Crucifixion, which most scholars date to AD 30 or 33. The man who made it sentenced Jesus to death.",
    clue: "Soldiers in Judaea were paid in local currency — small bronze prutot minted by Pontius Pilate — and spent them in the Jerusalem market."
  },
  {
    id: 'hands-2',
    teacherTip:
      'Ask why the Temple accepted only the Tyrian shekel, then point to the thirty silver coins paid to Judas.',
    character: "The Temple Priest",
    coinName: "Tyrian Shekel",
    coinDate: "1st century BC\u20131st century AD",
    prompt: "Whose hands held this Tyrian Shekel?",
    caption: "Tyrian Shekel \u00B7 1st century BC\u20131st century AD",
    fullImage: "/exhibitions/in-their-hands/Hands/temple-priest-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/temple-priest-hands-v2.jpg",
    story: "A priest working at the Temple treasury in Jerusalem. Every Jewish man over twenty owed a half-shekel Temple tax each year, and the Temple only accepted one coin: the Tyrian shekel, because it had the highest silver purity in circulation. Priests handled hundreds of these every day. In Matthew 26:15, the chief priests count out thirty silver coins to pay Judas for betraying Jesus. Those thirty coins were almost certainly Tyrian shekels \u2014 the same type this priest is holding. The coin required for worship became the price of betrayal.",
    clue: "The Temple accepted only the Tyrian shekel for the half-shekel tax, and the priests at its treasury handled hundreds of them every day."
  },
  {
    id: 'hands-3',
    teacherTip:
      'Ask how many leptons the widow gave, and why Jesus said she gave more than all the others.',
    character: "The Widow",
    coinName: "Widow\u2019s Mite \u2014 Lepton",
    coinDate: "1st century AD",
    prompt: "Whose hands held this Lepton?",
    caption: "Widow\u2019s Mite \u2014 Lepton \u00B7 1st century AD",
    fullImage: "/exhibitions/in-their-hands/Hands/widow-full-v4.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/widow-hands-v2.jpg",
    story: "A widow at the Temple treasury in Jerusalem. Being a widow, she would have had very little. The lepton was the smallest denomination in circulation \u2014 worth less than half a penny. In Mark 12:41\u201344, Jesus watches people putting money into the treasury. Many rich people throw in large amounts. Then a poor widow puts in two leptons \u2014 everything she has. Jesus tells his disciples that she has given more than all the others, because they gave from their surplus but she gave from her poverty. Two specimens are displayed in this exhibition because the Gospel specifies two coins.",
    clue: "The lepton was the smallest coin in circulation, and in Mark 12 a poor widow gives two of them — everything she has."
  },
  {
    id: 'hands-4',
    teacherTip:
      'Ask whose face is on the coin, and which of his orders sent Mary and Joseph to Bethlehem.',
    character: "The Merchant",
    coinName: "Augustus AE As",
    coinDate: "5\u20134 BC",
    prompt: "Whose hands held this Augustus As?",
    caption: "Augustus AE As \u00B7 5\u20134 BC",
    fullImage: "/exhibitions/in-their-hands/Hands/merchant-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/merchant-hands-v2.jpg",
    story: "A merchant in the marketplace, handling the day\u2019s takings. Roman coins circulated throughout the empire, and a trader would have handled bronze coins bearing the face of Augustus Caesar regularly. Augustus is the emperor who ordered the census described in Luke 2:1 \u2014 the census that sent Mary and Joseph from Nazareth to Bethlehem, where Jesus was born. Augustus ruled the entire Roman world from Rome. He never visited Judaea and almost certainly never thought about it. But his administrative order set the Nativity in motion.",
    clue: "Bronze coins bearing the face of Augustus circulated throughout the empire, and a trader would have handled them regularly."
  },
  {
    id: 'hands-5',
    teacherTip:
      'Ask what a mother in Bethlehem would have bought with these coins, and why they carry no human image.',
    teacherNote: "This round is about the Massacre of the Innocents (Matthew 2:13–16): Herod orders the killing of all boys in Bethlehem under the age of two. You may want to read it yourself before playing with younger grades.",
    character: "The Mother",
    coinName: "Herod the Great Prutah",
    coinDate: "40\u20134 BC",
    prompt: "Whose hands held this Herod Prutah?",
    caption: "Herod the Great Prutah \u00B7 40\u20134 BC",
    fullImage: "/exhibitions/in-their-hands/Hands/mother-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/mother-hands-v1.jpg",
    story: "A mother in Bethlehem, 4 BC. Small bronze prutot minted by Herod were the everyday currency in Judaea \u2014 used to buy bread, oil, and household goods. The coins carry no human image because Jewish law forbade it. In Matthew 2:13\u201316, Herod orders the killing of all boys in Bethlehem under the age of two after learning from the Magi that a new king has been born. An angel warns Joseph in a dream, and the Holy Family flees to Egypt. Other families in Bethlehem received no warning. A mother holding one of Herod\u2019s coins may not yet have known what his soldiers had been ordered to do.",
    clue: "Herod’s small bronze prutot were the everyday currency of Judaea, used to buy bread, oil, and household goods — the coins a mother in Bethlehem would have carried."
  },
  {
    id: 'hands-6',
    teacherTip:
      'Ask what right Paul invoked when Festus tried to send him back to Jerusalem.',
    character: "Paul of Tarsus",
    coinName: "Porcius Festus Prutah",
    coinDate: "59\u201362 AD",
    prompt: "Whose hands held this Festus Prutah?",
    caption: "Porcius Festus Prutah \u00B7 59\u201362 AD",
    fullImage: "/exhibitions/in-their-hands/Hands/paul-full-v1.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/paul-hands-v1.jpg",
    story: "Paul of Tarsus, a prisoner in Caesarea. He had been held for two years when Porcius Festus arrived as the new Roman governor. Festus minted his own coins in Judaea \u2014 small bronze prutot like this one. In Acts 25:10\u201312, Festus tries to send Paul back to Jerusalem to face trial, but Paul knows an ambush is waiting. He invokes his right as a Roman citizen and appeals directly to the Emperor. Festus confers with his council and replies: \u201CYou have appealed to Caesar. To Caesar you will go.\u201D This coin was minted by the man who sent Paul to Rome.",
    clue: "Porcius Festus minted these prutot as the Roman governor who found Paul a prisoner in Caesarea — and sent him to Rome."
  },
  {
    id: 'hands-7',
    teacherTip:
      'Ask whose coin this is, and how her divorce led to John the Baptist’s arrest.',
    character: "The Daughter of Aretas",
    coinName: "Aretas IV Prutah",
    coinDate: "9 BC\u201340 AD",
    prompt: "Whose hands held this Aretas Prutah?",
    caption: "Aretas IV Prutah \u00B7 9 BC\u201340 AD",
    fullImage: "/exhibitions/in-their-hands/Hands/aretas-daughter-full-v2.jpg",
    handsImage: "/exhibitions/in-their-hands/Hands/aretas-daughter-hands-v1.jpg",
    story: "The daughter of King Aretas IV of Nabataea. She was married to Herod Antipas, but Antipas divorced her to marry Herodias, his own brother\u2019s wife. The princess returned to her father\u2019s court in Petra. In Mark 6:17\u201318, John the Baptist publicly condemns the marriage between Antipas and Herodias. He is arrested and eventually beheaded. Aretas later went to war against Antipas in retaliation for the divorce and defeated him. She is never named in the Gospels, but her divorce is the event that triggered John\u2019s condemnation, his imprisonment, and his death. This is her father\u2019s coin \u2014 the coin of the Nabataean kingdom she returned to.",
    clue: "It was minted by her father, King Aretas IV of Nabataea — the kingdom she returned to after Herod Antipas divorced her."
  }
];

export const TIERS: Tier[] = [
  {
    min: 1,
    title: 'You know these hands.',
    message: 'Seven for seven. You matched every coin to the person who held it.',
  },
  {
    min: 0.7,
    title: 'You know most of these hands.',
    message: 'Only a few kept their secret.',
  },
  {
    min: 0.4,
    title: 'Some hands are harder to read.',
    message: 'Start from the coin: each one tells you where it was spent, and by whom.',
  },
  {
    min: 0,
    title: 'These hands kept their secrets.',
    message: 'Play again and start from the coin: each one tells you where it was spent, and by whom.',
  },
];

/** The original ending, kept for every score. */
export const CLOSING =
  'Every coin in this exhibition was held by someone. A soldier, a priest, a widow, a mother, a prisoner, a princess. The coins survived. The hands did not. But the stories connect us to the people who held them — across two thousand years of history, through hands just like yours.';

export type HandsRound = { character: HandsCharacter; options: HandsCharacter[] };

/**
 * The play order and the four names offered in each round, all drawn from one
 * seed. Called only in the browser after mount, so the server render never
 * has to agree with a random order.
 */
export function buildRounds(seed: number, characters: readonly HandsCharacter[] = HANDS_CHARACTERS): HandsRound[] {
  const rng = mulberry32(seed);
  return shuffle(characters, rng).map((character) => {
    const others = shuffle(characters.filter((c) => c.id !== character.id), rng).slice(0, 3);
    return { character, options: shuffle([character, ...others], rng) };
  });
}
