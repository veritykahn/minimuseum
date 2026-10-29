import { codeFrom, fail, getStore, isTeacher, messagesKey, noStore, overLimit, readMessages, readMeta, unavailable } from '../../../store';

/*
 * Taking one message off a class board: the teacher's to do, with the
 * board's teacher key (x-teacher-key).
 *
 *   DELETE → { deleted: true }
 */

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request, { params }: { params: Promise<{ code: string; id: string }> }) {
  const s = getStore();
  if (!s) return unavailable();
  try {
    const limited = await overLimit(s, req, 'remove');
    if (limited) return limited;
    const code = await codeFrom(params);
    const meta = code && (await readMeta(s, code));
    if (!code || !meta) return fail('not-found', 404);
    if (!isTeacher(req, meta)) return fail('forbidden', 403);
    const { id } = await params;
    const found = (await readMessages(s, code)).find((m) => m.message.id === id);
    if (!found) return fail('not-found', 404);
    await s.redis.lrem(messagesKey(code), 1, found.raw);
    return Response.json({ deleted: true }, { headers: noStore });
  } catch {
    return unavailable();
  }
}
