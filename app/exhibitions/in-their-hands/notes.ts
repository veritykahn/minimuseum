import type { ApprovedFact } from '@/components/exhibition/FactNote';

/*
 * In Their Hands' museum notes: owner-approved panels from outside the posters
 * and the coin labels (proposal B8.3), each set with its sources beneath it
 * (FactNote). They set the coins in the history of Roman Judaea, beside the
 * Gospels: Josephus, Roman writers, the Mishnah and archaeology. None of them
 * is poster wording, and none changes a poster.
 *
 * Where they hang (case-listing.tsx sets them under each case's coins):
 *   Case 6   Four kinds of witness (how historians know)
 *   Case 7   Coins of a Jewish kingdom (beside the widow's mites),
 *            The half-shekel and the money of Tyre (beside the Shekel of Tyre)
 *   Case 8   What came next: the revolt shekels, Judaea Capta, the Jewish
 *            tax, Bar Kokhba. The museum holds no coins of these, so they are
 *            text panels.
 */

export type IthNote = ApprovedFact & { id: string; title: string };
export type IthNoteGroup = { heading: string; notes: IthNote[] };

const ANS_HENDIN_JUDAISM = {
  label: 'American Numismatic Society, David Hendin, “Coins Provide Key Evidence in Historic Origins of Judaism”',
  href: 'https://numismatics.org/pocketchange/judaism/',
};
const ANS_FISHSMOUTH = {
  label: 'American Numismatic Society, David Hendin, “The Coin in the Fish’s Mouth”',
  href: 'https://numismatics.org/pocketchange/fishsmouth/',
};

export const FOUR_WITNESSES: IthNote = {
  id: 'four-kinds-of-witness',
  title: 'Four kinds of witness',
  text: 'How do historians know about Roman Judaea? From four kinds of witness, each checked against the others. The Gospels and Acts, written by early Christians in the first century. Josephus, a Jewish priest and historian of the same century, who describes Pilate, John the Baptist and the war with Rome. Roman writers such as Tacitus and Suetonius. And archaeology: coins, inscriptions such as the Pilate Stone, and ossuaries such as Caiaphas’s. Where they agree, as they do on Pilate, the evidence is strong. Where only one source tells a story, historians say so.',
  sources: [
    {
      label: 'Josephus, Jewish War 2.9.2 (Pilate and the images of Caesar), Perseus Digital Library, Tufts University',
      href: 'http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0148:book=2:whiston%20chapter=9:whiston%20section=2',
    },
    {
      label: 'Josephus, Antiquities 18.5.2 (John the Baptist), Perseus',
      href: 'http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0146:book=18:whiston%20chapter=5:whiston%20section=2',
    },
    {
      label: 'Tacitus, Annals 15.44, Perseus',
      href: 'http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0078:book=15:chapter=44',
    },
  ],
};

export const JEWISH_KINGDOM: IthNote = {
  id: 'coins-of-a-jewish-kingdom',
  title: 'Coins of a Jewish kingdom',
  text: 'Before Rome, Judaea was ruled by the Hasmoneans, Jewish kings and high priests. Their small bronze coins carry inscriptions in the old Hebrew script, naming the ruler as high priest or king, and they leave out human and animal images. The widow’s mites in Case 7 were struck by one of them, Alexander Jannaeus, and were still being spent a century later.',
  sources: [
    ANS_HENDIN_JUDAISM,
    { label: 'Harvard Art Museums, Prutah of Alexander Jannaeus', href: 'https://harvardartmuseums.org/collections/object/322300' },
  ],
};

export const HALF_SHEKEL: IthNote = {
  id: 'the-half-shekel',
  title: 'The half-shekel and the money of Tyre',
  text: 'Every year, Jewish men aged twenty and over gave a half-shekel to the Temple in Jerusalem, as the Book of Exodus commands. The Mishnah, the great collection of Jewish law compiled around AD 200, says the Temple’s shekel was reckoned in the money of Tyre, and that the half-shekel had to be paid in coin. Each spring, money changers set up their tables, first in the towns and then in the Temple itself. Tyre’s shekels were famous for the weight and purity of their silver, and they were struck from 126/5 BC onwards. The Gospels remember this world too: the Temple tax that Peter paid with a coin found in a fish (Matthew 17:24–27), and the money changers’ tables that Jesus overturned (Mark 11:15).',
  sources: [
    { label: 'Exodus 30:13–14 (JPS), Sefaria', href: 'https://www.sefaria.org/Exodus.30.13-14' },
    { label: 'Sefaria, the Mishnah (“compiled by Rabbi Yehuda HaNasi around 200 CE”)', href: 'https://www.sefaria.org/texts/Mishnah' },
    { label: 'Mishnah Bekhorot 8:7, Sefaria', href: 'https://www.sefaria.org/Mishnah_Bekhorot.8.7' },
    { label: 'Mishnah Shekalim 1:3, Sefaria', href: 'https://www.sefaria.org/Mishnah_Shekalim.1.3' },
    ANS_FISHSMOUTH,
  ],
};

export const REVOLT_SHEKELS: IthNote = {
  id: 'shekels-of-a-free-jerusalem',
  title: 'Shekels of a free Jerusalem, AD 66–70',
  text: 'In AD 66 Judaea rose against Rome. For the first time, the rebels struck silver shekels of their own. On one side is a cup and the words “Shekel of Israel”, with the year of the revolt. On the other are three pomegranates and the words “Jerusalem the Holy”. They were struck until Roman forces took Jerusalem in AD 70 and destroyed the Temple.',
  sources: [
    {
      label: 'British Museum, Money Gallery (Room 68) large-print guide',
      href: 'https://www.britishmuseum.org/sites/default/files/2021-05/Money_Gallery_LPG_2020_Room_68.pdf',
    },
    { label: 'Israel Museum, shekel with three pomegranates, 67–68 CE', href: 'https://www.imj.org.il/en/collections/539606' },
    { label: 'Walters Art Museum 59.518, shekel of the First Jewish Revolt, year four', href: 'https://art.thewalters.org/object/59.518/' },
  ],
};

export const JUDAEA_CAPTA: IthNote = {
  id: 'judaea-capta',
  title: 'Judaea Capta: Rome’s answer, AD 71',
  text: 'Rome answered with coins of its own. A bronze sestertius of the emperor Vespasian, struck at Rome in AD 71, shows a woman, Judaea, seated in mourning beneath a palm tree, with the words IVDAEA CAPTA: “Judaea captured.”',
  sources: [
    { label: 'American Numismatic Society, “An Introduction to Roman Coinage”', href: 'https://www.numismatics.org/dpubs/romangeneral/' },
    { label: 'American Numismatic Society collection 1967.153.218, sestertius of Vespasian', href: 'http://numismatics.org/collection/1967.153.218' },
  ],
};

export const JEWISH_TAX: IthNote = {
  id: 'the-jewish-tax',
  title: 'After the Temple: the half-shekel goes to Rome',
  text: 'After the Temple was destroyed, Vespasian made Jews across the empire pay the same sum as the old half-shekel to the temple of Jupiter in Rome. In AD 96 the emperor Nerva struck a coin reading FISCI IVDAICI CALVMNIA SVBLATA, usually translated “the wrongful accusation of the Jewish tax removed.”',
  sources: [
    { label: 'Online Coins of the Roman Empire (American Numismatic Society), RIC II Nerva 58', href: 'http://numismatics.org/ocre/id/ric.2.ner.58' },
    {
      label: 'Biblical Archaeology Society, “Roman Emperor Nerva’s Reform of the Jewish Tax”',
      href: 'https://www.biblicalarchaeology.org/daily/ancient-cultures/daily-life-and-practice/roman-emperor-nervas-reform-of-the-jewish-tax/',
    },
  ],
};

export const BAR_KOKHBA: IthNote = {
  id: 'bar-kokhba',
  title: 'Bar Kokhba: the last revolt, AD 132–135',
  text: 'Sixty years later, Judaea rose again, led by Shimon, known as Bar Kokhba. His silver coins show the front of the Temple, which had been gone for sixty years, with the name “Shimon” and the word “Jerusalem”. The other side shows the lulav and etrog of the festival of Sukkot. In 2020 the Israel Antiquities Authority announced a bronze coin of the revolt found beside the Temple Mount, inscribed “Year Two of the Freedom of Israel”. Of more than 22,000 coins found in Jerusalem’s Old City, it reported, only four date from the revolt.',
  sources: [
    { label: 'Harvard Art Museums 2008.2.91, Tetradrachm of Bar Kokhba, year 2', href: 'https://harvardartmuseums.org/collections/object/322110' },
    {
      label: 'Israel Antiquities Authority, 11 May 2020, via the Israel Ministry of Foreign Affairs',
      href: 'https://mfa.gov.il/mfa/israelexperience/history/pages/iaa-reveals-rare-coin-dating-to-the-bar-kochba-revolt-11-may-2020.aspx',
    },
  ],
};

/** Each case's notes, set under its coins. */
export const CASE_NOTES: Record<6 | 7 | 8, IthNoteGroup> = {
  6: { heading: 'How we know', notes: [FOUR_WITNESSES] },
  7: { heading: 'Beside the coins', notes: [JEWISH_KINGDOM, HALF_SHEKEL] },
  8: { heading: 'What came next', notes: [REVOLT_SHEKELS, JUDAEA_CAPTA, JEWISH_TAX, BAR_KOKHBA] },
};
