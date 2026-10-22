/**
 * The eleven stops of the Gospel Timeline, in story order.
 *
 * `when` is the approximate date of the episode the stop tells (not the
 * coin's minting date, which is in `coin`); the ribbon places each stop by
 * it. Dates are the conventional scholarly estimates and are always shown
 * with "c.".
 */
import { AD, BC, type Year } from './chronology';
import type { CoinId } from '../story-links';

export type TimelineStop = {
  id: number;
  coinId: CoinId;
  when: { from: Year; to?: Year; label: string };
  ruler: string;
  reference: string;
  coin: string;
  coinImage: string;
  painting: string;
  passage: string;
  story: string;
};

export const timelineStops: TimelineStop[] = [
  {
    id: 1,
    coinId: 'augustus',
    when: { from: BC(5), label: 'c. 5 BC' },
    ruler: "Augustus Caesar",
    reference: "Luke 2:1",
    coin: "AE As · 5–4 BC · RPC I 4248",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/augustus-front.png",
    painting: "/exhibitions/in-their-hands/timeline/augustus-tissot.jpg",
    passage: "In those days Caesar Augustus issued a decree that a census should be taken of the entire Roman world.",
    story: "Augustus ordered a census of the entire empire for tax purposes. This meant everyone had to return to their ancestral town to register. It is the reason Mary and Joseph traveled from Nazareth to Bethlehem, where Jesus was born. Augustus ruled from Rome and never visited Judaea. This bronze coin was minted during his reign and would have circulated widely across the empire."
  },
  {
    id: 2,
    coinId: 'herod-great',
    when: { from: BC(4), label: 'c. 4 BC' },
    ruler: "Herod the Great",
    reference: "Matthew 2:13\u201316",
    coin: "AE Prutah · 40–4 BC · Hendin 1177",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/herod-great-front.png",
    painting: "/exhibitions/in-their-hands/timeline/great-tissot.jpg",
    passage: "An angel of the Lord appeared to Joseph in a dream. \u2018Get up,\u2019 he said, \u2018take the child and his mother and escape to Egypt. Stay there until I tell you, for Herod is going to search for the child to kill him.\u2019",
    story: "After the Magi told Herod that a new king had been born in Bethlehem, Herod ordered the killing of all boys under two in the town. Joseph was warned in a dream and the Holy Family fled to Egypt. Herod died in 4 BC, not long afterward. His coins carry no human image because Jewish law forbade it \u2014 the symbols on this small bronze prutah reflect the compromise between Roman power and Jewish religious practice."
  },
  {
    id: 3,
    coinId: 'aretas',
    when: { from: AD(28), to: AD(29), label: 'c. 28\u201329 AD' },
    ruler: "Aretas IV",
    reference: "Mark 6:17\u201318",
    coin: "AE Prutah · 9 BC–40 AD · Hendin CB168",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/aretas-front.png",
    painting: "/exhibitions/in-their-hands/timeline/baptist-tissot.jpg",
    passage: "For Herod himself had given orders to have John arrested, and he had him bound and put in prison. He did this because of Herodias, his brother Philip\u2019s wife, whom he had married. For John had been saying to Herod, \u2018It is not lawful for you to have your brother\u2019s wife.\u2019",
    story: "Herod Antipas divorced his first wife \u2014 the daughter of King Aretas IV of Nabataea \u2014 to marry Herodias. John the Baptist publicly condemned the marriage and was arrested and beheaded. Aretas later went to war against Antipas, in part over the divorce, and defeated him. Years later, Paul had to escape from Damascus to avoid Aretas\u2019s governor, and was lowered over the city wall in a basket (2 Corinthians 11:32\u201333). This single coin connects to three different New Testament stories."
  },
  {
    id: 4,
    coinId: 'widow-mite',
    when: { from: AD(30), to: AD(33), label: 'c. 30\u201333 AD' },
    ruler: "The Widow\u2019s Mite",
    reference: "Mark 12:41\u201344",
    coin: "Lepton · 103–76 BC, circulating 1st c. AD · Hendin 1150",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/widow-1-front.png",
    painting: "/exhibitions/in-their-hands/timeline/widow-tissot.jpg",
    passage: "Jesus sat down opposite the place where the offerings were put and watched the crowd putting their money into the temple treasury. Many rich people threw in large amounts. But a poor widow came and put in two very small copper coins, worth only a few cents. Calling his disciples to him, Jesus said, \u2018Truly I tell you, this poor widow has put more into the treasury than all the others. They all gave out of their wealth; but she, out of her poverty, put in everything \u2014 all she had to live on.\u2019",
    story: "The lepton was the smallest denomination in circulation, worth less than half a penny. Jesus said this widow\u2019s two tiny coins were worth more than all the large donations because she gave everything she had. This was his last public teaching before the Passion. Two specimens are displayed in the exhibition because the Gospel specifies two coins."
  },
  {
    id: 5,
    coinId: 'tribute-penny',
    when: { from: AD(30), to: AD(33), label: 'c. 30\u201333 AD' },
    ruler: "The Tribute Penny",
    reference: "Matthew 22:19\u201321",
    coin: "Silver Denarius · 14–37 AD · RIC I 30 · REPLICA",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/tribute-front.png",
    painting: "/exhibitions/in-their-hands/timeline/tribute-tissot.jpg",
    passage: "\u2018Show me the coin used for paying the tax.\u2019 They brought him a denarius, and he asked them, \u2018Whose image is this? And whose inscription?\u2019 \u2018Caesar\u2019s,\u2019 they replied. Then he said to them, \u2018So give back to Caesar what is Caesar\u2019s, and to God what is God\u2019s.\u2019",
    story: "The Pharisees were trying to trap Jesus. If he said people should pay the Roman tax, he would anger the Jewish crowd. If he said they shouldn\u2019t, he could be reported to Rome. Jesus asked to see the coin and pointed out that it carried Caesar\u2019s image. The denarius bore the face of Tiberius on one side and the inscription PONTIF MAXIM \u2014 meaning High Priest \u2014 on the other. The claim that Caesar was a high priest would have been offensive to Jewish belief. This replica copies the coin type traditionally identified as the one Jesus was shown."
  },
  {
    id: 6,
    coinId: 'shekel',
    when: { from: AD(30), to: AD(33), label: 'c. 30\u201333 AD' },
    ruler: "The Tyrian Shekel",
    reference: "Matthew 26:14\u201315",
    coin: "Silver Shekel · 1 BC–1 AD · Hendin 1621 · REPLICA",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/shekel.png",
    painting: "/exhibitions/in-their-hands/timeline/judas-tissot.jpg",
    passage: "Then one of the Twelve \u2014 the one called Judas Iscariot \u2014 went to the chief priests and asked, \u2018What are you willing to give me if I deliver him over to you?\u2019 So they counted out for him thirty pieces of silver.",
    story: "The thirty pieces of silver were most likely Tyrian shekels. The Temple only accepted Tyrian shekels for the annual tax because they had the highest silver purity in circulation. So the coin that every Jewish man used for worship became the coin used to pay for betrayal. The same coin type appears in another Gospel story: in Matthew 17:27, Jesus tells Peter to go fishing and says he will find a coin in the mouth of the first fish he catches \u2014 a stater, worth exactly one Tyrian shekel, enough to pay the Temple tax for both of them."
  },
  {
    id: 7,
    coinId: 'pilate',
    when: { from: AD(30), to: AD(33), label: 'c. 30\u201333 AD' },
    ruler: "Pontius Pilate",
    reference: "Matthew 27:24",
    coin: "AE Prutah · 29/30 AD (RY16 of Tiberius) · Hendin 6370",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/pilate-front.png",
    painting: "/exhibitions/in-their-hands/timeline/pilate-tissot.jpg",
    passage: "When Pilate saw that he was getting nowhere, but that instead an uproar was starting, he took water and washed his hands in front of the crowd. \u2018I am innocent of this man\u2019s blood,\u2019 he said. \u2018It is your responsibility!\u2019",
    story: "Pontius Pilate was the Roman prefect of Judaea from 26 to 36 AD. Until 1961 he was known only from written sources; that year a limestone block inscribed with his name was found at Caesarea Maritima. This coin was struck in 29 or 30 AD, during Pilate\u2019s governorship and close to the years in which scholars date the Crucifixion. It carries pagan religious symbols that many scholars read as a deliberate provocation on Jewish coinage. You are looking at a coin issued by the man who sentenced Jesus to death, made while he governed Judaea."
  },
  {
    id: 8,
    coinId: 'antipas',
    when: { from: AD(30), to: AD(33), label: 'c. 30\u201333 AD' },
    ruler: "Herod Antipas",
    reference: "Luke 23:8\u20139",
    coin: "AE Prutah · 4 BC–39 AD · Hendin 1204 · REPLICA",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/antipas-front.png",
    painting: "/exhibitions/in-their-hands/timeline/herod-tissot.jpg",
    passage: "When Herod saw Jesus, he was greatly pleased, because for a long time he had been wanting to see him. From what he had heard about him, he hoped to see him perform a sign of some sort. He plied him with many questions, but Jesus gave him no answer.",
    story: "During the trial, Pilate sent Jesus to Herod Antipas for questioning because Jesus was from Galilee, which was Antipas\u2019s territory. Antipas had been curious about Jesus for a long time and hoped to see him perform a miracle. But Jesus refused to speak to him at all. Antipas mocked him, dressed him in a fine robe, and sent him back to Pilate. Jesus answered Pilate and the High Priest, if only briefly \u2014 but in Luke\u2019s account he gave Antipas no answer at all. Not one word."
  },
  {
    id: 9,
    coinId: 'agrippa',
    when: { from: AD(44), label: 'c. 44 AD' },
    ruler: "Herod Agrippa I",
    reference: "Acts 12:1\u20133",
    coin: "AE Prutah · 41–44 AD · Hendin 1244",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/agrippa-front.png",
    painting: "/exhibitions/in-their-hands/timeline/agrippa-zurbaran.jpg",
    passage: "It was about this time that King Herod arrested some who belonged to the church, intending to persecute them. He had James, the brother of John, put to death with the sword. When he saw that this met with approval among the Jews, he proceeded to seize Peter also.",
    story: "Herod Agrippa I was the grandson of Herod the Great. He had the apostle James executed \u2014 the first of the twelve apostles whose martyrdom the New Testament records. He then arrested Peter as well. Shortly afterward, Agrippa himself died. His death is described both in Acts 12:23 and by the Jewish historian Josephus: in each account he is hailed as a god at Caesarea and struck down soon after. Acts adds that he was eaten by worms. This small bronze prutah was minted during the brief years of his reign."
  },
  {
    id: 10,
    coinId: 'claudius',
    when: { from: AD(49), label: 'c. 49 AD' },
    ruler: "Emperor Claudius",
    reference: "Acts 18:1\u20133",
    coin: "AE As · 41–54 AD · RIC I 100",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/claudius-front.png",
    painting: "/exhibitions/in-their-hands/timeline/paul-tissot.jpg",
    passage: "After this, Paul left Athens and went to Corinth. There he met a Jew named Aquila, a native of Pontus, who had recently come from Italy with his wife Priscilla, because Claudius had ordered all Jews to leave Rome. Paul went to see them, and because he was a tentmaker as they were, he stayed and worked with them.",
    story: "Around 49 AD, the Emperor Claudius expelled Jews from Rome. The Roman historian Suetonius also mentions it. The expulsion forced a married couple called Aquila and Priscilla to leave Italy and travel to Corinth. When Paul arrived in Corinth, he met them and they worked together as tentmakers. Aquila and Priscilla became two of Paul\u2019s most important partners in spreading the early Church. Without Claudius\u2019s edict, they might never have been in Corinth when Paul arrived. This coin was minted during Claudius\u2019s reign."
  },
  {
    id: 11,
    coinId: 'festus',
    when: { from: AD(59), to: AD(60), label: 'c. 59\u201360 AD' },
    ruler: "Porcius Festus",
    reference: "Acts 25:10\u201312",
    coin: "AE Prutah · 59–62 AD · Hendin 1348 · NGC Certified",
    coinImage: "/exhibitions/in-their-hands/artifacts/coins/festus-front.png",
    painting: "/exhibitions/in-their-hands/timeline/festus-surikov.jpg",
    passage: "Paul answered: \u2018I am now standing before Caesar\u2019s court, where I ought to be tried. I have not done any wrong to the Jews, as you yourself know very well. I appeal to Caesar!\u2019 After Festus had conferred with his advisers, he declared: \u2018You have appealed to Caesar. To Caesar you will go!\u2019",
    story: "Paul had been held prisoner in Caesarea for two years. When Porcius Festus arrived as the new governor, he tried to send Paul back to Jerusalem to face trial, but Paul knew an ambush was planned for the journey. He used his right as a Roman citizen to appeal directly to the Emperor. Festus had no choice but to grant the appeal. This is what sent Paul on his journey to Rome. This coin was struck under Festus during his governorship, the years described in Acts, and has been independently authenticated by NGC, the world\u2019s largest coin grading service. Professional numismatists have confirmed it is genuine."
  }
];
