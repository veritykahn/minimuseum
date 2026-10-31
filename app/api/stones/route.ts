import { createHash } from 'node:crypto';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

/*
 * Holocaust Memorial Day's memorial stone: the stones visitors have laid on
 * it, as one shared number. The same store and limits as the Great War's
 * poppies (app/api/poppies), under keys of its own.
 *
 *   GET  → { count }               cached at the edge for a few seconds
 *   POST → { count } (the new total), one stone per request
 *
 * Anonymous: no text, nothing stored about the visitor but a rate-limit
 * counter keyed by a salted hash of the address (never the address itself),
 * which expires on its own. Two limits apply to POST: a short one against
 * rapid repeats, and a daily one generous enough for a classroom sharing one
 * school address. The page itself allows one stone per visitor per day.
 *
 * Storage is Upstash for Redis (the Vercel Marketplace integration), read
 * from KV_REST_API_URL / KV_REST_API_TOKEN.
 */

export const dynamic = 'force-dynamic';

const STONE_KEY = 'holocaust:stones';
/** Per address: at most this many stones a minute… */
const BURST_LIMIT = 3;
/** …and this many a day (a class of thirty on one school network). */
const DAILY_LIMIT = 60;

let redis: Redis | null = null;
let burst: Ratelimit | null = null;
let daily: Ratelimit | null = null;

function store() {
  if (!redis) {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;
    redis = new Redis({ url, token });
    burst = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(BURST_LIMIT, '1 m'), prefix: 'holocaust:stones:rl:burst' });
    daily = new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(DAILY_LIMIT, '1 d'), prefix: 'holocaust:stones:rl:day' });
  }
  return { redis, burst: burst!, daily: daily! };
}

function visitorKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = forwarded || req.headers.get('x-real-ip') || 'unknown';
  const salt = process.env.STONE_SALT || 'mini-museum-holocaust';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}

const noStore = { 'Cache-Control': 'no-store' };

export async function GET() {
  const s = store();
  if (!s) return Response.json({ error: 'unavailable' }, { status: 503, headers: noStore });
  try {
    const count = Number((await s.redis.get<number>(STONE_KEY)) ?? 0);
    return Response.json(
      { count },
      { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=10, stale-while-revalidate=50' } },
    );
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503, headers: noStore });
  }
}

export async function POST(req: Request) {
  const s = store();
  if (!s) return Response.json({ error: 'unavailable' }, { status: 503, headers: noStore });
  try {
    const key = visitorKey(req);
    const [b, d] = await Promise.all([s.burst.limit(key), s.daily.limit(key)]);
    if (!b.success || !d.success) {
      const count = Number((await s.redis.get<number>(STONE_KEY)) ?? 0);
      const reset = Math.max(b.success ? 0 : b.reset, d.success ? 0 : d.reset);
      return Response.json(
        { error: 'rate-limited', count },
        { status: 429, headers: { ...noStore, 'Retry-After': String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))) } },
      );
    }
    const count = await s.redis.incr(STONE_KEY);
    return Response.json({ count }, { headers: noStore });
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503, headers: noStore });
  }
}
