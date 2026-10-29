import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { BOARD_TTL_SECONDS, CODE_ALPHABET, CODE_LENGTH, IMAC_FONTS, MACHINES, checkMessage, normalizeCode, type BoardMessage, type Machine } from '@/lib/classBoard';

/*
 * The Writing Revolution's class boards, saved under a class code: what the
 * routes under app/api/class-board share. The same Upstash store as the
 * Great War's poppies (app/api/poppies), under keys of its own.
 *
 *   class-board:<code>:meta      the board: a hash of its teacher key, and when it was made
 *   class-board:<code>:messages  its messages, oldest first, each a JSON string
 *
 * Both expire BOARD_TTL_DAYS after the last write to the board, and nothing
 * lists the boards: a board is reached only by its code. The teacher key is
 * shown once to whoever made the board and only its SHA-256 is kept. Rate
 * limits are keyed, as the poppies' are, by a salted hash of the address,
 * never the address itself.
 */

export const noStore = { 'Cache-Control': 'no-store' };

const LIMITS = {
  /** Making a board: a few a minute, and enough a day for a school's teachers on one address. */
  create: [{ n: 3, w: '1 m' }, { n: 20, w: '1 d' }],
  /** Posting: a class of thirty on one school network, all at once. */
  post: [{ n: 40, w: '1 m' }, { n: 600, w: '1 d' }],
  /** Reading: the class's screens refreshing the board, and no faster (a code is not to be guessed). */
  read: [{ n: 150, w: '1 m' }],
  /** A teacher's deletions. */
  remove: [{ n: 60, w: '1 m' }],
} as const;
export type LimitName = keyof typeof LIMITS;

type Store = { redis: Redis; limits: Record<LimitName, Ratelimit[]> };
let store: Store | null = null;

export function getStore(): Store | null {
  if (!store) {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;
    // Messages are kept as the JSON strings they were written as, so a deletion can match one exactly.
    const redis = new Redis({ url, token, automaticDeserialization: false });
    const limits = Object.fromEntries(
      Object.entries(LIMITS).map(([name, ws]) => [
        name,
        ws.map(
          (w, i) =>
            new Ratelimit({
              redis,
              limiter: w.w === '1 d' ? Ratelimit.fixedWindow(w.n, w.w) : Ratelimit.slidingWindow(w.n, w.w),
              prefix: `class-board:rl:${name}:${i}`,
            }),
        ),
      ]),
    ) as Record<LimitName, Ratelimit[]>;
    store = { redis, limits };
  }
  return store;
}

export const metaKey = (code: string) => `class-board:${code}:meta`;
export const messagesKey = (code: string) => `class-board:${code}:messages`;

function visitorKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = forwarded || req.headers.get('x-real-ip') || 'unknown';
  const salt = process.env.CLASS_BOARD_SALT || 'mini-museum-class-board';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}

/** A 429 if this address is over the limit, or null to go on. */
export async function overLimit(s: Store, req: Request, name: LimitName): Promise<Response | null> {
  const key = visitorKey(req);
  const results = await Promise.all(s.limits[name].map((l) => l.limit(key)));
  const failed = results.filter((r) => !r.success);
  if (!failed.length) return null;
  const reset = Math.max(...failed.map((r) => r.reset));
  return Response.json(
    { error: 'rate-limited' },
    { status: 429, headers: { ...noStore, 'Retry-After': String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))) } },
  );
}

export const fail = (error: string, status: number) => Response.json({ error }, { status, headers: noStore });
export const unavailable = () => fail('unavailable', 503);

export function newCode(): string {
  return Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join('');
}

export function newTeacherKey(): string {
  return randomBytes(18).toString('base64url');
}

export function hashKey(key: string): string {
  return createHash('sha256').update(`class-board-teacher:${key}`).digest('hex');
}

type Meta = { teacher: string; created: number };

export async function readMeta(s: Store, code: string): Promise<Meta | null> {
  const raw = await s.redis.get<string>(metaKey(code));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Meta;
  } catch {
    return null;
  }
}

/** True if the request carries this board's teacher key. */
export function isTeacher(req: Request, meta: Meta): boolean {
  const key = req.headers.get('x-teacher-key');
  if (!key) return false;
  const a = Buffer.from(hashKey(key), 'hex');
  const b = Buffer.from(meta.teacher, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

/** The code from the route, or null. */
export async function codeFrom(params: Promise<{ code: string }>): Promise<string | null> {
  return normalizeCode((await params).code ?? '');
}

/** The board's messages, oldest first; anything unreadable is passed over. */
export async function readMessages(s: Store, code: string): Promise<{ raw: string; message: BoardMessage }[]> {
  const raws = await s.redis.lrange<string>(messagesKey(code), 0, -1);
  return raws.flatMap((raw) => {
    try {
      return [{ raw, message: JSON.parse(raw) as BoardMessage }];
    } catch {
      return [];
    }
  });
}

/** Both keys live another BOARD_TTL_DAYS from now. */
export async function refresh(s: Store, code: string) {
  await Promise.all([s.redis.expire(metaKey(code), BOARD_TTL_SECONDS), s.redis.expire(messagesKey(code), BOARD_TTL_SECONDS)]);
}

/** A posted message, checked and cleaned, or why not. */
export function toMessage(body: unknown): { message: BoardMessage } | { error: string } {
  const b = (body ?? {}) as { text?: unknown; machine?: unknown; font?: unknown };
  if (typeof b.text !== 'string') return { error: 'empty' };
  const checked = checkMessage(b.text);
  if (!checked.ok) return { error: checked.reason };
  const machine: Machine = MACHINES.includes(b.machine as Machine) ? (b.machine as Machine) : 'typewriter';
  const font = machine === 'imac' && IMAC_FONTS.includes(b.font as (typeof IMAC_FONTS)[number]) ? (b.font as string) : undefined;
  return { message: { id: randomBytes(6).toString('base64url'), text: checked.text, machine, ...(font ? { font } : {}), at: Date.now() } };
}

/** The request's JSON body, or null. */
export async function jsonBody(req: Request): Promise<unknown> {
  try {
    const text = await req.text();
    if (text.length > 64_000) return null;
    return text ? JSON.parse(text) : {};
  } catch {
    return null;
  }
}
