import { codeFrom, fail, getStore, isTeacher, messagesKey, metaKey, noStore, overLimit, readMessages, readMeta, unavailable } from '../store';

/*
 * One class board, by its code.
 *
 *   GET    → { code, messages, expiresIn }   messages oldest first; expiresIn in seconds
 *   DELETE → { deleted: true }               the whole board; needs its teacher key (x-teacher-key)
 *
 * An unknown code and a malformed one both answer 404, so a guess learns nothing.
 */

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ code: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const s = getStore();
  if (!s) return unavailable();
  try {
    const limited = await overLimit(s, req, 'read');
    if (limited) return limited;
    const code = await codeFrom(params);
    const meta = code && (await readMeta(s, code));
    if (!code || !meta) return fail('not-found', 404);
    const [messages, ttl] = await Promise.all([readMessages(s, code), s.redis.ttl(metaKey(code))]);
    return Response.json({ code, messages: messages.map((m) => m.message), expiresIn: Math.max(0, ttl) }, { headers: noStore });
  } catch {
    return unavailable();
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  const s = getStore();
  if (!s) return unavailable();
  try {
    const limited = await overLimit(s, req, 'remove');
    if (limited) return limited;
    const code = await codeFrom(params);
    const meta = code && (await readMeta(s, code));
    if (!code || !meta) return fail('not-found', 404);
    if (!isTeacher(req, meta)) return fail('forbidden', 403);
    await s.redis.del(metaKey(code), messagesKey(code));
    return Response.json({ deleted: true }, { headers: noStore });
  } catch {
    return unavailable();
  }
}
