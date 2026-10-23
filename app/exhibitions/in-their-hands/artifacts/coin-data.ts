export type CoinData = {
  id: string;
  title: string;
  date: string;
  subtitle: string;
  material: string;
  reference: string;
  authenticity: 'AUTHENTIC' | 'REPLICA';
  verse: string;
  verseText: string;
  description: string[];
  frontImage: string;
  backImage: string;
  displayCard: string;
};

const basePath = '/exhibitions/in-their-hands/artifacts';

// ============================================
// CASE 6: THE WORLD OF JESUS
// ============================================
export const case6Coins: CoinData[] = [
  {
    id: 'augustus',
    title: 'Augustus Caesar — AE As',
    date: '5–4 BC',
    subtitle: 'The political rulers of the Nativity',
    material: 'Bronze',
    reference: 'RPC I 4248',
    authenticity: 'AUTHENTIC',
    verse: 'LUKE 2:1',
    verseText: 'In those days Caesar Augustus issued a decree that a census should be taken of the entire Roman world.',
    description: [
      'Augustus ruled the Roman Empire from 27 BC until his death in 14 AD. His reign consolidated Roman power across the Mediterranean and the Near East, including the client kingdom of Judaea under Herod the Great. This coin was minted in the years in which Luke\'s Gospel sets the census that sent Mary and Joseph from Nazareth to Bethlehem, though historians still debate when that census took place. In Luke\'s telling, Augustus never knew what his bureaucratic order had set in motion.',
    ],
    frontImage: `${basePath}/coins/augustus-front.png`,
    backImage: `${basePath}/coins/augustus-back.png`,
    displayCard: `${basePath}/display-cards/Augustus-Caesar.jpg`,
  },
  {
    id: 'herod-great',
    title: 'Herod the Great — AE Prutah',
    date: '40–4 BC',
    subtitle: 'The political rulers of the Nativity',
    material: 'Bronze',
    reference: 'Hendin 1177',
    authenticity: 'AUTHENTIC',
    verse: 'MATTHEW 2:13',
    verseText: 'Get up, take the child and his mother and escape to Egypt — for Herod is going to search for the child to kill him.',
    description: [
      'Herod I ruled Judaea as a client king of Rome from 37 BC until his death in 4 BC. He rebuilt the Temple in Jerusalem into one of the wonders of the ancient world. His reign was marked by political paranoia and dynastic violence; he executed three of his own sons. Matthew\'s Gospel records that he ordered the Massacre of the Innocents in Bethlehem, an event no other ancient source mentions. His coins carry no human image — Jewish law forbade it — so the symbols on this prutah reflect the constant compromise between Roman authority and Jewish practice.',
    ],
    frontImage: `${basePath}/coins/herod-great-front.png`,
    backImage: `${basePath}/coins/herod-great-back.png`,
    displayCard: `${basePath}/display-cards/herod-the-great.jpg`,
  },
  {
    id: 'aretas',
    title: 'Aretas IV — AE Prutah',
    date: '9 BC–40 AD',
    subtitle: 'Nabataean Kingdom',
    material: 'Bronze',
    reference: 'Hendin CB168',
    authenticity: 'AUTHENTIC',
    verse: 'MARK 6:17–18',
    verseText: 'Herod had John arrested because of Herodias, his brother\'s wife. For John had been saying: \'It is not lawful for you to have your brother\'s wife.\'',
    description: [
      'Aretas IV ruled the Nabataean Kingdom east of Judaea, controlling major caravan routes between Arabia and the Mediterranean. His daughter was the first wife of Herod Antipas. When Antipas divorced her to marry Herodias, John the Baptist condemned the union publicly and paid with his head. When Aretas later went to war against Antipas, the historian Josephus names the insult to his daughter as one cause, alongside a border dispute.',
      'This same king\'s governor later pursued Paul in Damascus; Paul escaped by being lowered in a basket from the city wall (2 Cor 11:32–33). One coin. Three New Testament stories.',
    ],
    frontImage: `${basePath}/coins/aretas-front.png`,
    backImage: `${basePath}/coins/aretas-back.png`,
    displayCard: `${basePath}/display-cards/Aretas.jpg`,
  },
];

// ============================================
// CASE 7: MINISTRY AND PASSION
// ============================================
export const case7Coins: CoinData[] = [
  {
    id: 'widow-mite',
    title: "Widow's Mite — Lepton",
    date: '103–76 BC, circulating 1st c. AD',
    subtitle: 'Teaching and Betrayal',
    material: 'Bronze',
    reference: 'Hendin 1150',
    authenticity: 'AUTHENTIC',
    verse: 'MARK 12:41–44',
    verseText: 'A poor widow came and put in two very small copper coins, worth only a few cents. Jesus said: she gave more than all the others.',
    description: [
      'The lepton was the smallest monetary denomination in use in Roman-period Judaea, minted originally under the Hasmonaean king Alexander Jannaeus and circulating for over a century after. Two specimens are displayed because the Gospel specifically states two coins. The object is not the coin but the proportion: the widow\'s gift represented everything she possessed. In Mark\'s Gospel, it is the last scene in the Temple before the events of the Passion begin.',
    ],
    frontImage: `${basePath}/coins/widow-1-front.png`,
    backImage: `${basePath}/coins/widow-1-back.png`,
    displayCard: `${basePath}/display-cards/widows-mite.webp`,
  },
  {
    id: 'tribute-penny',
    title: 'Tribute Penny — Tiberius Denarius',
    date: '14–37 AD',
    subtitle: 'Teaching and Betrayal',
    material: 'Silver — REPLICA',
    reference: 'RIC I 30',
    authenticity: 'REPLICA',
    verse: 'MATTHEW 22:21',
    verseText: 'Render unto Caesar what is Caesar\'s, and to God what is God\'s.',
    description: [
      'The Pharisees tried to trap Jesus with a question about Roman taxes. He asked whose image and inscription the coin bore. Tradition, and many scholars, identify that coin as a denarius of Tiberius like this one. The reverse reads PONTIF MAXIM — High Priest — asserting Caesar\'s religious authority, which many Jews would have found offensive. To them, the coin itself may well have seemed a provocation. Jesus\'s answer has shaped thinking about sacred and secular authority for two thousand years. Original examples are of exceptional rarity; this is a museum-quality replica.',
    ],
    frontImage: `${basePath}/coins/tribute-front.png`,
    backImage: `${basePath}/coins/tribute-back.png`,
    displayCard: `${basePath}/display-cards/Tribute.jpg`,
  },
  {
    id: 'shekel',
    title: 'Shekel of Tyre — Thirty Pieces of Silver',
    date: '1 BC–1 AD',
    subtitle: 'Teaching and Betrayal',
    material: 'Silver — REPLICA',
    reference: 'Hendin 1621',
    authenticity: 'REPLICA',
    verse: 'MATTHEW 26:15',
    verseText: 'They counted out for him thirty pieces of silver.',
    description: [
      'The Tyrian shekel was minted from exceptionally pure silver at Tyre and was the coin the Temple authorities required, by most accounts, for the Temple tax in Jerusalem. Despite bearing the image of the pagan god Melqart on its face, it was the currency of God\'s house. Many scholars think the thirty pieces of silver were Tyrian shekels. If so, the irony is sharp: the coin required for Temple worship became the price of betrayal. Original examples are of exceptional rarity; this is a museum-quality replica.',
    ],
    frontImage: `${basePath}/coins/shekel.png`,
    backImage: `${basePath}/coins/shekel-back.png`,
    displayCard: `${basePath}/display-cards/Shekel.jpg`,
  },
  {
    id: 'pilate',
    title: 'Pontius Pilate — AE Prutah',
    date: '29/30 AD (RY16 of Tiberius)',
    subtitle: 'Trial and Crucifixion',
    material: 'Bronze, 1.79g, 16mm',
    reference: 'Hendin 6370',
    authenticity: 'AUTHENTIC',
    verse: 'MATTHEW 27:24',
    verseText: 'I am innocent of this man\'s blood. It is your responsibility!',
    description: [
      'Pilate served as Prefect of Judaea from 26 to 36 AD. This coin was minted in 29/30 AD, within a few years of the Crucifixion, which most scholars date to AD 30 or 33. The obverse bears a simpulum (Roman libation ladle) and the reverse three bound ears of grain. The ladle was a tool of Roman religion, and many scholars read its use on coins for a Jewish province as a deliberate provocation. Before 1961, Pilate was known from written sources: the Gospels, Josephus, Philo and Tacitus. That year, an inscribed limestone block bearing his name and title was discovered at Caesarea Maritima. It is now in the Israel Museum. Coins like this one, struck under his rule though not bearing his name, were physical evidence of his government long before that discovery.',
    ],
    frontImage: `${basePath}/coins/pilate-front.png`,
    backImage: `${basePath}/coins/pilate-back.png`,
    displayCard: `${basePath}/display-cards/Pilate.jpg`,
  },
  {
    id: 'antipas',
    title: 'Herod Antipas — AE Prutah',
    date: '4 BC–39 AD',
    subtitle: 'Trial and Crucifixion',
    material: 'Bronze — REPLICA',
    reference: 'Hendin 1204',
    authenticity: 'REPLICA',
    verse: 'LUKE 23:9',
    verseText: 'He plied him with many questions, but Jesus gave him no answer.',
    description: [
      'Herod Antipas was the son of Herod the Great and tetrarch of Galilee. He executed John the Baptist, and during the Passion Pilate sent Jesus to him for questioning. Antipas mocked Jesus and dressed him in an elegant robe before sending him back.',
      'Only Luke records this meeting. In his account Jesus, who answered both Pilate and the High Priest, gave Antipas nothing — not one word. Jesus had called him \'that fox\' (Luke 13:32). Original examples are of exceptional rarity; this is a museum-quality replica.',
    ],
    frontImage: `${basePath}/coins/antipas-front.png`,
    backImage: `${basePath}/coins/antipas-back.png`,
    displayCard: `${basePath}/display-cards/herod-antipas.jpg`,
  },
];

// ============================================
// CASE 8: THE EARLY CHURCH
// ============================================
export const case8Coins: CoinData[] = [
  {
    id: 'agrippa',
    title: 'Herod Agrippa I — AE Prutah',
    date: '41–44 AD',
    subtitle: 'The world of the Apostles',
    material: 'Bronze, 1.80g',
    reference: 'Hendin 1244',
    authenticity: 'AUTHENTIC',
    verse: 'ACTS 12:2–3',
    verseText: 'He had James, the brother of John, put to death with the sword. When he saw that this pleased the Jews, he proceeded to seize Peter also.',
    description: [
      'Herod Agrippa I, grandson of Herod the Great, was appointed King of Judaea by Caligula in 41 AD. He executed James — the first apostle whose martyrdom the New Testament records — and imprisoned Peter. Acts records that he accepted divine honors from a crowd and was struck down, eaten by worms. The Jewish historian Josephus (Antiquities 19.8.2) tells a closely parallel story: Agrippa, hailed as a god at Caesarea, was seized by sudden pains and died days later. It is an independent account often cited as a notable outside parallel to a specific New Testament event.',
    ],
    frontImage: `${basePath}/coins/agrippa-front.png`,
    backImage: `${basePath}/coins/agrippa-back.png`,
    displayCard: `${basePath}/display-cards/herod-agrippa.jpg`,
  },
  {
    id: 'claudius',
    title: 'Emperor Claudius — AE As',
    date: '41–54 AD',
    subtitle: 'The world of the Apostles',
    material: 'Bronze, large module AE27',
    reference: 'RIC I 100',
    authenticity: 'AUTHENTIC',
    verse: 'ACTS 18:2',
    verseText: 'Paul met Aquila and Priscilla, who had recently come from Italy because Claudius had ordered all Jews to leave Rome.',
    description: [
      'Claudius reigned from 41 to 54 AD. An expulsion of Jews from Rome under Claudius is also mentioned by the historian Suetonius (Claudius 25.4). It is usually dated to about 49 AD, though the date is debated. According to Acts, this order is why Aquila and Priscilla were in Corinth, where Paul met them. Without it, two of Paul\'s most important co-workers might never have crossed his path. They are mentioned in Romans, 1 Corinthians, and 2 Timothy.',
    ],
    frontImage: `${basePath}/coins/claudius-front.png`,
    backImage: `${basePath}/coins/claudius-back.png`,
    displayCard: `${basePath}/display-cards/claudius.jpg`,
  },
  {
    id: 'festus',
    title: 'Porcius Festus — AE Prutah',
    date: '59–62 AD',
    subtitle: 'The world of the Apostles',
    material: 'Bronze — NGC Certified',
    reference: 'Hendin 1348',
    authenticity: 'AUTHENTIC',
    verse: 'ACTS 25:12',
    verseText: 'You have appealed to Caesar. To Caesar you will go!',
    description: [
      'Festus succeeded Felix as Roman Procurator of Judaea in approximately 59 AD and died in office around 62 AD. Paul had been held in Caesarea for two years. When Festus reopened his case, Paul invoked his right as a Roman citizen to appeal directly to the Emperor — one of the most dramatic legal moments in Acts. Scholars who argue for the historical reliability of Acts often point to procedural details like this one, which fit what is known of Roman legal practice. Coins like this one were struck under Festus in the years Acts describes.',
    ],
    frontImage: `${basePath}/coins/festus-front.png`,
    backImage: `${basePath}/coins/festus-back.png`,
    displayCard: `${basePath}/display-cards/festus.jpg`,
  },
];
