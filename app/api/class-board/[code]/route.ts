import { checkPrompt, type BoardPrompt } from '@/lib/classBoard';
import { codeFrom, fail, getStore, isTeacher, jsonBody, messagesKey, metaKey, noStore, overLimit, readMessages, readMeta, refresh, unavailable, writeMeta } from '../store';

/*
 * One class board, by its code.
 *
 *   GET    → { code, messages, expiresIn, prompt }   messages oldest first; expiresIn in seconds; prompt or null
 *   PUT    { prompt: { kind, text } | null } → { prompt }
 *            the teacher's prompt, set or cleared; needs the teacher key (x-teacher-key).
 *            It is checked as a message is (lib/classBoard); a refusal answers 422 with the reason.
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
    return Response.json({ code, messages: messages.map((m) => m.message), expiresIn: Math.max(0, ttl), prompt: meta.prompt ?? null }, { headers: noStore });
  } catch {
    return unavailable();
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  const s = getStore();
  if (!s) return unavailable();
  try {
    const limited = await overLimit(s, req, 'remove');
    if (limited) return limited;
    const code = await codeFrom(params);
    const meta = code && (await readMeta(s, code));
    if (!code || !meta) return fail('not-found', 404);
    if (!isTeacher(req, meta)) return fail('forbidden', 403);
    const body = (await jsonBody(req)) as { prompt?: unknown } | null;
    if (body === null || typeof body !== 'object' || !('prompt' in body)) return fail('bad-request', 400);
    let prompt: BoardPrompt | null = null;
    if (body.prompt !== null) {
      const checked = checkPrompt(body.prompt);
      if (!checked.ok) return fail(checked.reason, 422);
      prompt = checked.prompt;
    }
    // A cleared prompt is left out of the meta (JSON drops the undefined).
    await writeMeta(s, code, { ...meta, prompt: prompt ?? undefined });
    await refresh(s, code);
    return Response.json({ prompt }, { headers: noStore });
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
