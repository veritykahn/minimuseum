/*
 * The Declaration's own words, for the parchment the visitor signs: the
 * National Archives' transcription, word for word, its spelling and
 * punctuation as the Archives sets them ("The spelling and punctuation
 * reflect the original"). The text is in the public domain. The heading and
 * the title are split from the first paragraph where the parchment sets them
 * apart; nothing else is changed. The room's test checks its opening, its
 * closing pledge and its 56 signers.
 */

export const DECLARATION_SOURCE = {
  label: 'National Archives, “Declaration of Independence: A Transcription”',
  href: 'https://www.archives.gov/founding-docs/declaration-transcript',
};

export const DECLARATION_HEAD = "In Congress, July 4, 1776";
export const DECLARATION_TITLE = "The unanimous Declaration of the thirteen united States of America,";
/** The body, paragraph by paragraph: the preamble, the grievances ("He has…", "For…"), and the pledge. */
export const DECLARATION_BODY: readonly string[] = [
  "When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation.",
  "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.--That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed, --That whenever any Form of Government becomes destructive of these ends, it is the Right of the People to alter or to abolish it, and to institute new Government, laying its foundation on such principles and organizing its powers in such form, as to them shall seem most likely to effect their Safety and Happiness. Prudence, indeed, will dictate that Governments long established should not be changed for light and transient causes; and accordingly all experience hath shewn, that mankind are more disposed to suffer, while evils are sufferable, than to right themselves by abolishing the forms to which they are accustomed. But when a long train of abuses and usurpations, pursuing invariably the same Object evinces a design to reduce them under absolute Despotism, it is their right, it is their duty, to throw off such Government, and to provide new Guards for their future security.--Such has been the patient sufferance of these Colonies; and such is now the necessity which constrains them to alter their former Systems of Government. The history of the present King of Great Britain is a history of repeated injuries and usurpations, all having in direct object the establishment of an absolute Tyranny over these States. To prove this, let Facts be submitted to a candid world.",
  "He has refused his Assent to Laws, the most wholesome and necessary for the public good.",
  "He has forbidden his Governors to pass Laws of immediate and pressing importance, unless suspended in their operation till his Assent should be obtained; and when so suspended, he has utterly neglected to attend to them.",
  "He has refused to pass other Laws for the accommodation of large districts of people, unless those people would relinquish the right of Representation in the Legislature, a right inestimable to them and formidable to tyrants only.",
  "He has called together legislative bodies at places unusual, uncomfortable, and distant from the depository of their public Records, for the sole purpose of fatiguing them into compliance with his measures.",
  "He has dissolved Representative Houses repeatedly, for opposing with manly firmness his invasions on the rights of the people.",
  "He has refused for a long time, after such dissolutions, to cause others to be elected; whereby the Legislative powers, incapable of Annihilation, have returned to the People at large for their exercise; the State remaining in the mean time exposed to all the dangers of invasion from without, and convulsions within.",
  "He has endeavoured to prevent the population of these States; for that purpose obstructing the Laws for Naturalization of Foreigners; refusing to pass others to encourage their migrations hither, and raising the conditions of new Appropriations of Lands.",
  "He has obstructed the Administration of Justice, by refusing his Assent to Laws for establishing Judiciary powers.",
  "He has made Judges dependent on his Will alone, for the tenure of their offices, and the amount and payment of their salaries.",
  "He has erected a multitude of New Offices, and sent hither swarms of Officers to harrass our people, and eat out their substance.",
  "He has kept among us, in times of peace, Standing Armies without the Consent of our legislatures.",
  "He has affected to render the Military independent of and superior to the Civil power.",
  "He has combined with others to subject us to a jurisdiction foreign to our constitution, and unacknowledged by our laws; giving his Assent to their Acts of pretended Legislation:",
  "For Quartering large bodies of armed troops among us:",
  "For protecting them, by a mock Trial, from punishment for any Murders which they should commit on the Inhabitants of these States:",
  "For cutting off our Trade with all parts of the world:",
  "For imposing Taxes on us without our Consent:",
  "For depriving us in many cases, of the benefits of Trial by Jury:",
  "For transporting us beyond Seas to be tried for pretended offences:",
  "For abolishing the free System of English Laws in a neighbouring Province, establishing therein an Arbitrary government, and enlarging its Boundaries so as to render it at once an example and fit instrument for introducing the same absolute rule into these Colonies:",
  "For taking away our Charters, abolishing our most valuable Laws, and altering fundamentally the Forms of our Governments:",
  "For suspending our own Legislatures, and declaring themselves invested with power to legislate for us in all cases whatsoever.",
  "He has abdicated Government here, by declaring us out of his Protection and waging War against us.",
  "He has plundered our seas, ravaged our Coasts, burnt our towns, and destroyed the lives of our people.",
  "He is at this time transporting large Armies of foreign Mercenaries to compleat the works of death, desolation and tyranny, already begun with circumstances of Cruelty & perfidy scarcely paralleled in the most barbarous ages, and totally unworthy the Head of a civilized nation.",
  "He has constrained our fellow Citizens taken Captive on the high Seas to bear Arms against their Country, to become the executioners of their friends and Brethren, or to fall themselves by their Hands.",
  "He has excited domestic insurrections amongst us, and has endeavoured to bring on the inhabitants of our frontiers, the merciless Indian Savages, whose known rule of warfare, is an undistinguished destruction of all ages, sexes and conditions.",
  "In every stage of these Oppressions We have Petitioned for Redress in the most humble terms: Our repeated Petitions have been answered only by repeated injury. A Prince, whose character is thus marked by every act which may define a Tyrant, is unfit to be the ruler of a free people.",
  "Nor have We been wanting in attentions to our Brittish brethren. We have warned them from time to time of attempts by their legislature to extend an unwarrantable jurisdiction over us. We have reminded them of the circumstances of our emigration and settlement here. We have appealed to their native justice and magnanimity, and we have conjured them by the ties of our common kindred to disavow these usurpations, which, would inevitably interrupt our connections and correspondence. They too have been deaf to the voice of justice and of consanguinity. We must, therefore, acquiesce in the necessity, which denounces our Separation, and hold them, as we hold the rest of mankind, Enemies in War, in Peace Friends.",
  "We, therefore, the Representatives of the united States of America, in General Congress, Assembled, appealing to the Supreme Judge of the world for the rectitude of our intentions, do, in the Name, and by Authority of the good People of these Colonies, solemnly publish and declare, That these United Colonies are, and of Right ought to be Free and Independent States; that they are Absolved from all Allegiance to the British Crown, and that all political connection between them and the State of Great Britain, is and ought to be totally dissolved; and that as Free and Independent States, they have full Power to levy War, conclude Peace, contract Alliances, establish Commerce, and to do all other Acts and Things which Independent States may of right do. And for the support of this Declaration, with a firm reliance on the protection of divine Providence, we mutually pledge to each other our Lives, our Fortunes and our sacred Honor.",
];
/** The signers, column by column, as the Archives lists them. */
export const DECLARATION_SIGNERS: readonly { state: string; names: readonly string[] }[] = [
  { state: "Georgia", names: ["Button Gwinnett", "Lyman Hall", "George Walton"] },
  { state: "North Carolina", names: ["William Hooper", "Joseph Hewes", "John Penn"] },
  { state: "South Carolina", names: ["Edward Rutledge", "Thomas Heyward, Jr.", "Thomas Lynch, Jr.", "Arthur Middleton"] },
  { state: "Massachusetts", names: ["John Hancock"] },
  { state: "Maryland", names: ["Samuel Chase", "William Paca", "Thomas Stone", "Charles Carroll of Carrollton"] },
  { state: "Virginia", names: ["George Wythe", "Richard Henry Lee", "Thomas Jefferson", "Benjamin Harrison", "Thomas Nelson, Jr.", "Francis Lightfoot Lee", "Carter Braxton"] },
  { state: "Pennsylvania", names: ["Robert Morris", "Benjamin Rush", "Benjamin Franklin", "John Morton", "George Clymer", "James Smith", "George Taylor", "James Wilson", "George Ross"] },
  { state: "Delaware", names: ["Caesar Rodney", "George Read", "Thomas McKean"] },
  { state: "New York", names: ["William Floyd", "Philip Livingston", "Francis Lewis", "Lewis Morris"] },
  { state: "New Jersey", names: ["Richard Stockton", "John Witherspoon", "Francis Hopkinson", "John Hart", "Abraham Clark"] },
  { state: "New Hampshire", names: ["Josiah Bartlett", "William Whipple"] },
  { state: "Massachusetts", names: ["Samuel Adams", "John Adams", "Robert Treat Paine", "Elbridge Gerry"] },
  { state: "Rhode Island", names: ["Stephen Hopkins", "William Ellery"] },
  { state: "Connecticut", names: ["Roger Sherman", "Samuel Huntington", "William Williams", "Oliver Wolcott"] },
  { state: "New Hampshire", names: ["Matthew Thornton"] },
];

/** The sentence the posters give, found in the body so the copies can set it apart. */
export const SELF_EVIDENT = 'We hold these truths to be self-evident';

/*
 * The owner's own declarations, one for a class and one for a student: her
 * wording, word for word (owner's wording, 29 Oct 2026), with her spelling
 * ("honour"). The class's has two versions, for a classroom and for a middle
 * school; the student's is her classroom text in the first person singular,
 * changed only in its person (we to I, our to my, us to me), except where a
 * sentence cannot be made singular as it stands (noted below).
 *
 * Her blanks are filled from what the class or the student types
 * (ownWording): "[Teacher]'s [Grade]" becomes the teacher's name and the
 * grade ("our class" when both are blank), and "[grade]" the grade's word
 * ("classroom" when it is blank). Nothing is filled in for them: no school,
 * no teacher, no grade.
 */
export type VersionId = 'classroom' | 'middle';

export type OwnVersion = {
  id: VersionId;
  /** The switch's name. */
  label: string;
  /** Her paragraphs, in order, with their blanks. */
  wording: readonly string[];
};

export type OwnDeclaration = {
  /** The switch's name. */
  name: string;
  short: string;
  /** The first is the one the parchment opens with. */
  versions: readonly OwnVersion[];
};

const CLASS_OPENING =
  "Two hundred and fifty years ago, in the city of Philadelphia, fifty-six men set their names to a declaration of what they believed and who they pledged themselves to become. In this anniversary year, we — the students of [Teacher]'s [Grade] — set our names to our own.";
const CLASS_PLEDGE = 'And so we mutually pledge to one another our attention, our kindness, and our honour.';
const CLASS_WITNESS = 'In witness whereof, we set our names below.';

export const OWN_DECLARATIONS: Record<'class' | 'mine', OwnDeclaration> = {
  class: {
    name: 'Our Class Declaration',
    short: 'Class',
    versions: [
      {
        id: 'classroom',
        label: 'Classroom',
        // Owner's wording, 29 Oct 2026.
        wording: [
          CLASS_OPENING,
          'We hold these truths to be self-evident: that every person in this classroom was made with dignity and purpose, and is worthy of kindness and respect. That learning is one of the greatest gifts we will ever receive. That a community is only as strong as the care its members show for one another.',
          'We therefore declare that we will come to school ready to learn, and give our best to every task set before us. That we will listen to our teachers, who give their days so that we may grow. That we will be kind — to our classmates, to our school, and to everyone we meet. That we will leave this [grade] better than we found it, and carry what we have learned into everything that comes next.',
          CLASS_PLEDGE,
          CLASS_WITNESS,
        ],
      },
      {
        id: 'middle',
        label: 'Middle school',
        // Owner's wording, 29 Oct 2026: the same opening, pledge and closing, with her middle school's paragraphs.
        wording: [
          CLASS_OPENING,
          'We hold these truths to be self-evident: that every person in this school was made with dignity and purpose, endowed with the capacity to think, to question, to grow, and to do good in the world. That education is not merely the accumulation of knowledge but the formation of character. That a community is only as strong as the care its members show for one another.',
          'We therefore declare that we will pursue our education with curiosity and integrity, doing honest work and taking genuine pride in it. That we will extend to every person — classmate, teacher, stranger — the dignity they are owed. That we will use what we are given here not only for our own advancement but in the service of others. That we will leave this school, when the time comes, having been worth the investment made in us.',
          CLASS_PLEDGE,
          CLASS_WITNESS,
        ],
      },
    ],
  },
  mine: {
    name: 'My Declaration',
    short: 'Mine',
    versions: [
      {
        id: 'classroom',
        label: 'Classroom',
        // Owner's wording, 29 Oct 2026: her classroom text, in the first person singular. Two sentences could not
        // simply change person: the opening's "we — the students of [Teacher]'s [Grade] —" is left out, and the
        // pledge, which "we mutually pledge to one another", is one person's own.
        wording: [
          'Two hundred and fifty years ago, in the city of Philadelphia, fifty-six men set their names to a declaration of what they believed and who they pledged themselves to become. In this anniversary year, I set my name to my own.',
          'I hold these truths to be self-evident: that every person in this classroom was made with dignity and purpose, and is worthy of kindness and respect. That learning is one of the greatest gifts I will ever receive. That a community is only as strong as the care its members show for one another.',
          'I therefore declare that I will come to school ready to learn, and give my best to every task set before me. That I will listen to my teachers, who give their days so that I may grow. That I will be kind — to my classmates, to my school, and to everyone I meet. That I will leave this [grade] better than I found it, and carry what I have learned into everything that comes next.',
          'And so I pledge my attention, my kindness, and my honour.',
          'In witness whereof, I set my name below.',
        ],
      },
    ],
  },
};

/** What the class or the student has typed into the parchment's blanks. */
export type OwnFill = { teacher?: string; grade?: string; school?: string; name?: string };

const ordinal = (n: number) => {
  const tens = n % 100;
  const suffix = tens >= 11 && tens <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th';
  return `${n}${suffix}`;
};

/**
 * The grade, as words to set in a sentence: "4", "4th", "Grade 4" and "4th
 * Grade" all become "4th grade", "K" becomes "kindergarten"; anything else
 * ("Year 5", "8th grade English") stands as typed. Blank, ''.
 */
export function gradeWords(grade = '') {
  const g = grade.trim().replace(/\s+/g, ' ');
  if (!g) return '';
  if (/^(k|kg|kindergarten)$/i.test(g)) return 'kindergarten';
  const m = g.match(/^(?:grade )?(\d{1,2})(?:st|nd|rd|th)?(?: grade)?$/i);
  return m ? `${ordinal(Number(m[1]))} grade` : g;
}

const possessive = (name: string) => (/['’]s$/i.test(name) ? name.replace(/'s$/i, '’s') : `${name}’s`);
const titleCase = (s: string) => s.replace(/(^|\s)([a-z])/g, (_, sp: string, c: string) => sp + c.toUpperCase());
const gradeNoun = (g: string) => /(grade|kindergarten)$/i.test(g);

/**
 * The class, as her "[Teacher]'s [Grade]" reads once filled in: "Mrs Ruiz’s
 * 4th grade", "Mrs Ruiz’s class" (no grade), "the 4th grade" (no teacher),
 * and "our class" when both are blank.
 */
export function classWords({ teacher = '', grade = '' }: OwnFill = {}) {
  const t = teacher.trim().replace(/\s+/g, ' ');
  const g = gradeWords(grade);
  if (t && g) return `${possessive(t)} ${g}`;
  if (t) return `${possessive(t)} class`;
  if (g) return gradeNoun(g) ? `the ${g}` : g;
  return 'our class';
}

/** The heading over the parchment: "Our Class Declaration of Independence" until the class fills its blanks in. */
export function ownTitle(doc: 'class' | 'mine', fill: OwnFill = {}) {
  if (doc === 'mine') {
    const n = (fill.name ?? '').trim().replace(/\s+/g, ' ');
    return `${n ? possessive(n) : 'My'} Declaration of Independence`;
  }
  const t = (fill.teacher ?? '').trim().replace(/\s+/g, ' ');
  const g = titleCase(gradeWords(fill.grade));
  if (t) return `${possessive(t)} ${g || 'Class'} Declaration of Independence`;
  return `Our ${g || 'Class'} Declaration of Independence`;
}

/** Her paragraphs, their blanks filled in from what was typed. */
export function ownWording(doc: 'class' | 'mine', version: VersionId, fill: OwnFill = {}): string[] {
  const own = OWN_DECLARATIONS[doc];
  const v = own.versions.find((x) => x.id === version) ?? own.versions[0];
  const grade = gradeWords(fill.grade) || 'classroom';
  return v.wording.map((p) => p.replace("[Teacher]'s [Grade]", classWords(fill)).replace('[grade]', grade));
}

/** In print, the class's parchment has this many lines to sign on, filled with the names signed. */
export const PRINT_SIGNATURE_LINES = 25;
