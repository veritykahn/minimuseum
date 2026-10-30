import { BOARD_MAX, BOARD_TTL_SECONDS, checkPrompt, type BoardMessage } from '@/lib/classBoard';
import { fail, getStore, hashKey, jsonBody, messagesKey, metaKey, newCode, newTeacherKey, noStore, overLimit, toMessage, unavailable } from './store';

/*
 * The Writing Revolution's class boards (store.ts has the keys and limits).
 *
 *   GET  → { available }   whether boards can be saved here at all
 *   POST → { code, teacherKey, messages, skipped, prompt }, a new board, 201;
 *          the body may carry the messages already on the screen
 *          ({ messages: [{ text, machine, font }] }) and the prompt set for
 *          the sitting ({ prompt: { kind, text } })
 *
 * The teacher key is in this response and nowhere else, ever: only its hash
 * is kept. Messages that break the rules are left off (skipped), not
 * refused whole, and so is a prompt that breaks them (prompt: null).
 */

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ available: !!getStore() }, { headers: noStore });
}

export async function POST(req: Request) {
  const s = getStore();
  if (!s) return unavailable();
  try {
    const limited = await overLimit(s, req, 'create');
    if (limited) return limited;
    const body = (await jsonBody(req)) as { messages?: unknown; prompt?: unknown } | null;
    if (body === null) return fail('bad-request', 400);
    const given = Array.isArray(body.messages) ? body.messages.slice(0, BOARD_MAX) : [];
    const messages = given.flatMap((m): BoardMessage[] => {
      const r = toMessage(m);
      return 'message' in r ? [r.message] : [];
    });
    const checked = body.prompt ? checkPrompt(body.prompt) : null;
    const prompt = checked?.ok ? checked.prompt : null;

    const teacherKey = newTeacherKey();
    const meta = JSON.stringify({ teacher: hashKey(teacherKey), created: Date.now(), ...(prompt ? { prompt } : {}) });
    // A fresh code, taken only if no board has it.
    let code = '';
    for (let tries = 0; tries < 5 && !code; tries++) {
      const c = newCode();
      if (await s.redis.set(metaKey(c), meta, { nx: true, ex: BOARD_TTL_SECONDS })) code = c;
    }
    if (!code) return unavailable();
    if (messages.length) {
      await s.redis.rpush(messagesKey(code), ...messages.map((m) => JSON.stringify(m)));
      await s.redis.expire(messagesKey(code), BOARD_TTL_SECONDS);
    }
    return Response.json({ code, teacherKey, messages, skipped: given.length - messages.length, prompt }, { status: 201, headers: noStore });
  } catch {
    return unavailable();
  }
}
