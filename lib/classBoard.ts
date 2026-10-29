/*
 * The Writing Revolution's class board: the rules a message must keep, shared
 * by the typing station (which checks as you post) and the API (which
 * enforces them, app/api/class-board).
 *
 * A message is plain text: HTML is stripped, control characters dropped, and
 * it is always rendered as text, never as markup. No links of any kind, and
 * a short list of words a class board has no use for. The filter is simple
 * on purpose: it catches the obvious, and the teacher key deletes the rest.
 */

/** Characters to a message, as a post on a board. */
export const MESSAGE_MAX = 280;
/** Messages to a board. */
export const BOARD_MAX = 200;
/** A saved board is deleted this long after its last new message. */
export const BOARD_TTL_DAYS = 30;
export const BOARD_TTL_SECONDS = BOARD_TTL_DAYS * 24 * 60 * 60;

/* A class code: eight characters with no 0/O or 1/I/L to misread (31^8, about 8.5 × 10^11 codes). */
export const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
export const CODE_LENGTH = 8;
const CODE_RE = new RegExp(`^[${CODE_ALPHABET}]{${CODE_LENGTH}}$`);

/** The code as typed (any case, spaces or a dash), or null if it can't be one. */
export function normalizeCode(raw: string): string | null {
  const c = raw.toUpperCase().replace(/[\s-]/g, '');
  return CODE_RE.test(c) ? c : null;
}

/** The code as shown: two groups of four (K7M3-QX9P). */
export function formatCode(code: string): string {
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

/** The machine a message was typed on, and the iMac's fonts. */
export const MACHINES = ['typewriter', 'imac'] as const;
export type Machine = (typeof MACHINES)[number];
export const IMAC_FONTS = ['Times', 'Helvetica', 'Courier', 'Palatino', 'Antonio'] as const;

export type BoardMessage = {
  id: string;
  text: string;
  machine: Machine;
  /** The iMac's font, where it was typed on the iMac. */
  font?: string;
  /** When it was posted (ms since 1970). */
  at: number;
};

/** HTML stripped, control characters dropped, runs of blank lines and spaces closed up. */
export function cleanText(raw: string): string {
  return raw
    .replace(/<[^>]*>?/g, '')
    .replace(/[<>]/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F​-‏‪-‮⁦-⁩]/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/* Links in any dress: a scheme, www., an address, or a name.tld. */
const LINK_RES = [
  /\b[a-z][a-z0-9+.-]*:\/\//i,
  /\bwww\s*\./i,
  /\S+@\S+\.\S+/,
  /\b[a-z0-9-]+\s*(\.|\(dot\)|\[dot\])\s*(com|net|org|edu|gov|io|co|uk|us|ca|au|ly|gg|app|dev|xyz|me|tv|info|biz|site|online|link|club|top|live|shop|fun|ru|cn|de|fr|in|tk)\b/i,
];

/*
 * Words a class board does without: common swearing and slurs. Matched as
 * whole words after undoing the usual disguises (s.h.i.t, sh1t, $hit,
 * shiiit), so "Scunthorpe" and "class" pass.
 */
const BLOCKED = [
  'arse', 'arsehole', 'ass', 'asshole', 'bastard', 'bitch', 'bitches', 'bollocks', 'boob', 'boobs', 'bullshit', 'chink', 'cock', 'coon', 'crap',
  'cunt', 'damn', 'dick', 'dickhead', 'dildo', 'dyke', 'fag', 'faggot', 'fuck', 'fucked', 'fucker', 'fucking', 'gook', 'jizz', 'kike', 'motherfucker',
  'nigga', 'nigger', 'paki', 'penis', 'piss', 'porn', 'prick', 'pussy', 'rape', 'retard', 'retarded', 'shit', 'shitty', 'slag', 'slut', 'spastic',
  'spic', 'tits', 'tranny', 'twat', 'vagina', 'wank', 'wanker', 'whore', 'wetback',
];
const BLOCKED_SET = new Set(BLOCKED);
const LEET: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', $: 's', '!': 'i', '|': 'i' };

function words(text: string): string[] {
  const plain = text.toLowerCase().replace(/[0-9@$!|]/g, (ch) => LEET[ch] ?? ch);
  // Letters spaced or dotted out one by one (s h i t, s.h.i.t) are joined back up.
  const joined = plain.replace(/\b(?:[a-z][\s.*_-]){2,}[a-z]\b/g, (m) => m.replace(/[\s.*_-]/g, ''));
  return joined.split(/[^a-z]+/).filter(Boolean);
}

function blocked(word: string): boolean {
  if (BLOCKED_SET.has(word)) return true;
  // Stretched letters (shiiit) and plurals.
  const squeezed = word.replace(/(.)\1+/g, '$1');
  return BLOCKED_SET.has(squeezed) || (word.endsWith('s') && BLOCKED_SET.has(word.slice(0, -1)));
}

export type CheckResult = { ok: true; text: string } | { ok: false; reason: 'empty' | 'too-long' | 'link' | 'language' };

/** A message as it would be posted, or why it can't be. */
export function checkMessage(raw: string): CheckResult {
  const text = cleanText(raw);
  if (!text) return { ok: false, reason: 'empty' };
  if ([...text].length > MESSAGE_MAX) return { ok: false, reason: 'too-long' };
  if (LINK_RES.some((re) => re.test(text))) return { ok: false, reason: 'link' };
  if (words(text).some(blocked)) return { ok: false, reason: 'language' };
  return { ok: true, text };
}

/** What the station says when a message can't go up. */
export const REFUSALS: Record<Exclude<CheckResult, { ok: true }>['reason'], string> = {
  empty: 'There’s nothing to post yet.',
  'too-long': `Keep it to ${MESSAGE_MAX} characters.`,
  link: 'No links on the board, please.',
  language: 'That message has a word the board doesn’t allow. Try other words.',
};
