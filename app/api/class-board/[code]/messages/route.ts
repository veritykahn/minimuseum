import { BOARD_MAX } from '@/lib/classBoard';
import { codeFrom, fail, getStore, jsonBody, messagesKey, noStore, overLimit, readMeta, refresh, toMessage, unavailable } from '../../store';

/*
 * Posting to a class board: anyone with its code.
 *
 *   POST { text, machine, font } → { message }, 201
 *
 * The message is checked as the station checks it (lib/classBoard): HTML
 * stripped, no links, no blocked words, at most MESSAGE_MAX characters; a
 * refusal answers 422 with the reason. A full board (BOARD_MAX) answers 409.
 * Each post keeps the board another BOARD_TTL_DAYS.
 */

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const s = getStore();
  if (!s) return unavailable();
  try {
    const limited = await overLimit(s, req, 'post');
    if (limited) return limited;
    const code = await codeFrom(params);
    const meta = code && (await readMeta(s, code));
    if (!code || !meta) return fail('not-found', 404);
    const body = await jsonBody(req);
    if (body === null) return fail('bad-request', 400);
    const r = toMessage(body);
    if ('error' in r) return fail(r.error, 422);

    const raw = JSON.stringify(r.message);
    const length = await s.redis.rpush(messagesKey(code), raw);
    if (length > BOARD_MAX) {
      // Over the top: take this one back off (exactly this one, if two arrived together).
      await s.redis.lrem(messagesKey(code), 1, raw);
      return fail('full', 409);
    }
    await refresh(s, code);
    return Response.json({ message: r.message }, { status: 201, headers: noStore });
  } catch {
    return unavailable();
  }
}
