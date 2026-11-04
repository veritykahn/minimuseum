import type { FactSource } from '@/components/exhibition/FactNote';
import { STONE_CUSTOM } from '../holocaust';

/*
 * The minute's stillness: what is shown, one at a time, while it lasts. The
 * owner-approved bank (A18/B13/B14 proposal, 2C), word for word: fourteen
 * names and short stories, fifteen passages of people's own words (each
 * verbatim from its page), and seven questions to sit with. No prompt
 * describes how anyone died, and none asks the visitor to imagine being a
 * victim or a perpetrator.
 *
 * Each minute shows four, never more than one on screen: a name, then
 * words, then a name or words, then a question; drawn afresh each time, so
 * it varies. Anne Frank's "people are truly good at heart" is never shown
 * alone: the Anne Frank House warns it "was plucked out of context", so it
 * is always followed by the sentence that comes after it on that page.
 */

const AFH_WHO: FactSource = { label: 'Anne Frank House, “Who was Anne Frank?”', href: 'https://www.annefrank.org/en/anne-frank/who-was-anne-frank/' };
const AFH_CHOIR: FactSource = { label: 'Anne Frank House, “A choir of voices”', href: 'https://www.annefrank.org/en/anne-frank/go-in-depth/holocaust-diaries-anne-frank-and-other-young-writer/' };
const AFH_MARGOT: FactSource = { label: 'Anne Frank House, “Margot Frank”', href: 'https://www.annefrank.org/en/anne-frank/main-characters/margot-frank/' };
const AFH_PETER: FactSource = { label: 'Anne Frank House, “Peter van Pels”', href: 'https://www.annefrank.org/en/anne-frank/main-characters/peter-van-pels/' };
const AFH_MIEP: FactSource = { label: 'Anne Frank House, “Miep Gies”', href: 'https://www.annefrank.org/en/anne-frank/main-characters/miep-gies/' };
const USHMM_DIARIES: FactSource = { label: 'USHMM, “Children’s Diaries during the Holocaust”', href: 'https://encyclopedia.ushmm.org/content/en/article/childrens-diaries-during-the-holocaust' };
const USHMM_GUIDELINES: FactSource = { label: 'USHMM, Guidelines for Teaching About the Holocaust', href: 'https://www.ushmm.org/teach/fundamentals/guidelines-for-teaching-the-holocaust' };
const hmd = (name: string, slug: string): FactSource => ({ label: `Holocaust Memorial Day Trust, “${name}”`, href: `https://hmd.org.uk/resource/${slug}/` });
const HMD_ANNE = hmd('Anne Frank', 'anne-frank');
const HMD_ANNA = hmd('Anna Lehnkering', 'anna-lehnkering');
const HMD_OTTO = hmd('Otto Rosenberg', 'otto-rosenberg');
const HMD_MARTHA = hmd('Martha Blend', 'martha-blend');
const HMD_HEDY = hmd('Hedy and her memory book', 'hedy-and-her-memory-book');
const HMD_WINTON = hmd('Sir Nicholas Winton', 'sir-nicholas-winton');
const HMD_HO = hmd('Feng Shan Ho', 'feng-shan-ho');
const HMD_KIRK = hmd('Ann Kirk', 'ann-kirk');
const HMD_GREEN = hmd('Bea Green', 'bea-green');
const HMD_BARTALI = hmd('Gino Bartali', 'gino-bartali');
const HMD_SHIPPER = hmd('Zigi Shipper', 'zigi-shipper-hmd-2017');
const HMD_NIEMOLLER = hmd('Pastor Martin Niemöller', 'pastor-martin-niemoller-hmd-2021');
const HMD_BOURNE = hmd('Sydney and Golda Bourne', 'sydney-and-golda-bourne');
const HMD_WIESEL = hmd('Elie Wiesel', 'elie-wiesel-hmd-2017');

export type PromptKind = 'name' | 'words' | 'question';

export type StillnessPrompt = {
  id: string;
  kind: PromptKind;
  /** A name prompt's name, set apart (bold); the rest follows in `text`. */
  name?: string;
  text: string;
  /** Whose words, and where: for a words prompt. */
  cite?: string;
  sources: readonly FactSource[];
};

export const PROMPTS: readonly StillnessPrompt[] = [
  // Names and short stories
  { id: 'S1', kind: 'name', name: 'Anne Frank', text: ', born 1929. In hiding in Amsterdam, she kept a diary. She dreamed of being a writer.', sources: [AFH_WHO, HMD_ANNE] },
  { id: 'S2', kind: 'name', name: 'Margot Frank', text: ', born 1926, Anne’s older sister. She studied everything she could, and hoped to become a maternity nurse.', sources: [AFH_MARGOT] },
  { id: 'S3', kind: 'name', name: 'Peter van Pels', text: ', 15 when he went into hiding, the only boy in the Annex. He brought his cat, Mouschi, and liked to do carpentry.', sources: [AFH_PETER] },
  { id: 'S4', kind: 'name', name: 'Petr Ginz', text: ', born in Prague in 1928. In Theresienstadt he kept a diary, and held on to his writing, art and studies.', sources: [USHMM_DIARIES, AFH_CHOIR] },
  { id: 'S5', kind: 'name', name: 'Yitskhok Rudashevski', text: ', born 1927, kept a diary in the Vilna ghetto. He wondered whether to follow his heart and study, or learn a trade.', sources: [USHMM_DIARIES, AFH_CHOIR] },
  { id: 'S6', kind: 'name', name: 'Dawid Sierakowiak', text: ', born 1924, wrote his diary in the Łódź ghetto in five notebooks.', sources: [USHMM_DIARIES, AFH_CHOIR] },
  { id: 'S7', kind: 'name', name: 'Moshe Flinker', text: ', born 1926, an Orthodox boy who hid his identity in Belgium and wrote about his faith.', sources: [USHMM_DIARIES, AFH_CHOIR] },
  { id: 'S8', kind: 'name', name: 'Anna Lehnkering', text: ', born 1915. She loved playing with children. The Nazis took her life because she had a disability. Her niece made sure she is remembered.', sources: [HMD_ANNA] },
  { id: 'S9', kind: 'name', name: 'Otto Rosenberg', text: ', a Sinti boy from Berlin, born 1927. He survived, and spent his life working for Sinti and Roma people.', sources: [HMD_OTTO] },
  { id: 'S10', kind: 'name', name: 'Martha Blend', text: ', nine, left Vienna alone on the Kindertransport with a small case, her doll and her autograph book.', sources: [HMD_MARTHA] },
  { id: 'S11', kind: 'name', name: 'Hedy Klein', text: ' got a memory book for her 11th birthday. Her friends filled it with poems and drawings. After the war she found it again.', sources: [HMD_HEDY] },
  { id: 'S12', kind: 'name', name: 'Miep Gies', text: ', who brought food and library books to the eight people hiding in the Annex, and kept Anne’s diary safe.', sources: [AFH_MIEP] },
  { id: 'S13', kind: 'name', name: 'Nicholas Winton', text: ', who in 1939 helped bring 669 children from Czechoslovakia to safety in Britain.', sources: [HMD_WINTON] },
  { id: 'S14', kind: 'name', name: 'Feng Shan Ho', text: ', a Chinese diplomat in Vienna, who gave visas to Jews who needed a way out.', sources: [HMD_HO] },
  // Words
  { id: 'S15', kind: 'words', text: '“When I write I can shake off all my cares. My sorrow disappears, my spirits are revived!”', cite: 'Anne Frank, from her diary', sources: [HMD_ANNE] },
  { id: 'S16', kind: 'words', text: '“I still believe, in spite of everything, that people are truly good at heart.”', cite: 'Anne Frank, July 15, 1944', sources: [AFH_CHOIR] },
  { id: 'S17', kind: 'words', text: '“And yet, when I look up at the sky, I somehow feel that everything will change for the better, that this cruelty, too, shall end, that peace and tranquility will return once more.”', cite: 'Anne Frank, July 15, 1944', sources: [AFH_CHOIR] },
  { id: 'S18', kind: 'words', text: '“Everything comes to an end. Spring will come.”', cite: 'Elsa Binder, aged 22, writing in the Stanisławów ghetto', sources: [AFH_CHOIR] },
  { id: 'S19', kind: 'words', text: '“We never feel safe, because we border directly on Germany and we are only a small country.”', cite: 'Margot Frank, in a letter to a pen pal in America, 1940', sources: [AFH_MARGOT] },
  { id: 'S20', kind: 'words', text: '“We, however, pretended I was going on a marvellous adventure.”', cite: 'Ann Kirk, who left Berlin on the Kindertransport aged 10', sources: [HMD_KIRK] },
  { id: 'S21', kind: 'words', text: '“I said, you’ll see her again soon. I was really talking to myself.”', cite: 'Bea Green, 14, comforting a younger girl on the Kindertransport train', sources: [HMD_GREEN] },
  { id: 'S22', kind: 'words', text: '“Nothing has ever tasted quite as good as that. It was just amazing.”', cite: 'Bea Green, on the bread and orange juice Dutch women brought to the children’s train', sources: [HMD_GREEN] },
  { id: 'S23', kind: 'words', text: '“On the lots we were all just one big family. Everybody knew everybody.”', cite: 'Otto Rosenberg, remembering his Sinti community in Berlin', sources: [HMD_OTTO] },
  { id: 'S24', kind: 'words', text: '“It was a matter of course for me, I was able to help these people. We did our human duty: helping people in need”', cite: 'Miep Gies', sources: [AFH_MIEP] },
  { id: 'S25', kind: 'words', text: '“My story is a story of very ordinary people during extraordinarily terrible times.”', cite: 'Miep Gies', sources: [AFH_MIEP] },
  { id: 'S26', kind: 'words', text: '“Why are you making such a big deal out of it? I just helped a little; I was in the right place at the right time.”', cite: 'Nicholas Winton', sources: [HMD_WINTON] },
  { id: 'S27', kind: 'words', text: '“I thought it only natural to feel compassion and to want to help. From the standpoint of humanity, that is the way it should be.”', cite: 'Feng Shan Ho', sources: [HMD_HO] },
  { id: 'S28', kind: 'words', text: '“If you’re good at a sport, they attach the medals to your shirt and then they shine in some museum. That which is earned by doing good deeds is attached to the soul and shines elsewhere.”', cite: 'Gino Bartali, cyclist and rescuer, to his son', sources: [HMD_BARTALI] },
  { id: 'S29', kind: 'words', text: '“There is nothing we can do about the past, but we can do a lot about the present and the future”', cite: 'Zigi Shipper, survivor, who spoke to thousands of students', sources: [HMD_SHIPPER] },
  // Questions to sit with
  { id: 'S30', kind: 'question', text: 'Behind every number there was a person, with a name, a family and a favorite thing. Whose name will you carry with you today?', sources: [USHMM_GUIDELINES] },
  { id: 'S31', kind: 'question', text: 'Miep Gies said she did her “human duty.” What does helping someone in need look like in your school?', sources: [AFH_MIEP] },
  { id: 'S32', kind: 'question', text: 'Anne kept writing, even in hiding. What would you want to write down, so that it is remembered?', sources: [HMD_ANNE] },
  { id: 'S33', kind: 'question', text: 'Martin Niemöller’s poem is about people who did not speak out. When is it hard to speak up for someone else?', sources: [HMD_NIEMOLLER] },
  { id: 'S34', kind: 'question', text: 'Children on the Kindertransport were welcomed by strangers. How can we welcome someone who is new?', sources: [HMD_BOURNE] },
  { id: 'S35', kind: 'question', text: 'Survivors chose “to work for humankind.” What is one small thing you could do for someone else this week?', sources: [HMD_WIESEL] },
  { id: 'S36', kind: 'question', text: 'A small stone lasts where flowers fade. How do people in your family remember those they have lost?', sources: STONE_CUSTOM.sources },
];

/** S16 is never shown alone: S17, the sentence after it, always follows. */
export const FOLLOWS: Readonly<Record<string, string>> = { S16: 'S17' };

/** When each prompt comes, and how long it stays, in the minute (ms). */
export const PROMPT_AT = [3000, 17000, 31000, 45000] as const;
export const PROMPT_MS = 12000;

const of = (kind: PromptKind) => PROMPTS.filter((p) => p.kind === kind && !Object.values(FOLLOWS).includes(p.id));

/**
 * The minute's four prompts: a name, words, a name or words, a question.
 * `random` is 0–1 (Math.random); `avoid` are ids shown last time, left out
 * where there are others to choose.
 */
export function planMinute(random: () => number = Math.random, avoid: readonly string[] = []): StillnessPrompt[] {
  const pick = (pool: readonly StillnessPrompt[], taken: readonly string[]) => {
    const fresh = pool.filter((p) => !taken.includes(p.id) && !avoid.includes(p.id));
    const from = fresh.length ? fresh : pool.filter((p) => !taken.includes(p.id));
    return from[Math.floor(random() * from.length) % from.length];
  };
  const out: StillnessPrompt[] = [];
  const ids = () => out.map((p) => p.id);
  out.push(pick(of('name'), ids()));
  const words = pick(of('words'), ids());
  out.push(words);
  if (FOLLOWS[words.id]) out.push(PROMPTS.find((p) => p.id === FOLLOWS[words.id])!);
  else out.push(pick(random() < 0.5 ? of('name') : of('words').filter((p) => !FOLLOWS[p.id]), ids()));
  out.push(pick(of('question'), ids()));
  return out;
}

/** Which prompt is on screen `elapsed` ms into the minute (its index), or null between them. */
export function promptAt(elapsed: number): number | null {
  for (let i = 0; i < PROMPT_AT.length; i++) if (elapsed >= PROMPT_AT[i] && elapsed < PROMPT_AT[i] + PROMPT_MS) return i;
  return null;
}
