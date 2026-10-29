/**
 * @jest-environment node
 */

/*
 * The class board API, with Upstash mocked as a little in-memory store:
 * making a board (its code, its teacher key shown once and kept only as a
 * hash, the messages already on screen), reading it, posting to it (the
 * length, link, HTML and word rules, the 200-message cap, the 30-day expiry
 * renewed on each write), the teacher's deletions, the rate limits, and a
 * store that is missing or failing.
 */

import { BOARD_MAX, BOARD_TTL_SECONDS, CODE_ALPHABET, MESSAGE_MAX, checkMessage, cleanText, normalizeCode } from '@/lib/classBoard';

const kv = new Map<string, string>();
const lists = new Map<string, string[]>();
const ttls = new Map<string, number>();
const db = { failing: false };
const limits: Record<string, boolean> = {};
const limitKeys: string[] = [];
/* Characters to draw for the next codes, by index into the alphabet; random once they run out. */
const picks: number[] = [];

jest.mock('node:crypto', () => {
  const real = jest.requireActual('node:crypto');
  return { ...real, randomInt: (n: number) => (picks.length ? picks.shift()! : real.randomInt(n)) };
});

const guard = () => {
  if (db.failing) throw new Error('down');
};

jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn(async (k: string) => (guard(), kv.get(k) ?? null)),
    set: jest.fn(async (k: string, v: string, o?: { nx?: boolean; ex?: number }) => {
      guard();
      if (o?.nx && kv.has(k)) return null;
      kv.set(k, v);
      if (o?.ex) ttls.set(k, o.ex);
      return 'OK';
    }),
    rpush: jest.fn(async (k: string, ...vs: string[]) => {
      guard();
      const l = lists.get(k) ?? [];
      l.push(...vs);
      lists.set(k, l);
      return l.length;
    }),
    lrange: jest.fn(async (k: string) => (guard(), [...(lists.get(k) ?? [])])),
    lrem: jest.fn(async (k: string, n: number, v: string) => {
      guard();
      const l = lists.get(k) ?? [];
      const i = l.indexOf(v);
      if (i < 0) return 0;
      l.splice(i, 1);
      return 1;
    }),
    expire: jest.fn(async (k: string, s: number) => (guard(), ttls.set(k, s), 1)),
    ttl: jest.fn(async (k: string) => (guard(), ttls.get(k) ?? -2)),
    del: jest.fn(async (...ks: string[]) => {
      guard();
      ks.forEach((k) => (kv.delete(k), lists.delete(k)));
      return ks.length;
    }),
  })),
}));

jest.mock('@upstash/ratelimit', () => {
  const Ratelimit = jest.fn().mockImplementation((opts: { prefix: string }) => ({
    limit: jest.fn(async (key: string) => {
      limitKeys.push(key);
      const name = opts.prefix.split(':')[2];
      const ok = limits[name] ?? true;
      return { success: ok, reset: Date.now() + 60_000, limit: 1, remaining: ok ? 1 : 0 };
    }),
  }));
  Object.assign(Ratelimit, { slidingWindow: jest.fn(() => 'sliding'), fixedWindow: jest.fn(() => 'fixed') });
  return { Ratelimit };
});

type Routes = {
  board: typeof import('@/app/api/class-board/route');
  one: typeof import('@/app/api/class-board/[code]/route');
  messages: typeof import('@/app/api/class-board/[code]/messages/route');
  message: typeof import('@/app/api/class-board/[code]/messages/[id]/route');
};
let r: Routes;

const load = async () => {
  await jest.isolateModulesAsync(async () => {
    r = {
      board: await import('@/app/api/class-board/route'),
      one: await import('@/app/api/class-board/[code]/route'),
      messages: await import('@/app/api/class-board/[code]/messages/route'),
      message: await import('@/app/api/class-board/[code]/messages/[id]/route'),
    };
  });
};

const req = (method: string, body?: unknown, headers: Record<string, string> = {}) =>
  new Request('http://localhost/api/class-board', {
    method,
    headers: { 'x-forwarded-for': '203.0.113.7, 10.0.0.1', 'content-type': 'application/json', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
const ctx = (code: string, id?: string) => ({ params: Promise.resolve(id ? { code, id } : { code }) }) as { params: Promise<{ code: string; id: string }> };

async function create(messages?: unknown[]) {
  const res = await r.board.POST(req('POST', messages ? { messages } : {}));
  return { res, body: await res.json() };
}
const post = (code: string, text: string, extra: Record<string, unknown> = {}) => r.messages.POST(req('POST', { text, machine: 'typewriter', ...extra }), ctx(code));

beforeEach(async () => {
  kv.clear();
  lists.clear();
  ttls.clear();
  db.failing = false;
  for (const k of Object.keys(limits)) delete limits[k];
  limitKeys.length = 0;
  picks.length = 0;
  process.env.KV_REST_API_URL = 'https://example.upstash.io';
  process.env.KV_REST_API_TOKEN = 'test-token';
  await load();
});

describe('making a board', () => {
  it('says saving is available, and makes a board with an unguessable code and a teacher key kept only as a hash', async () => {
    expect(await (await r.board.GET()).json()).toEqual({ available: true });
    const { res, body } = await create();
    expect(res.status).toBe(201);
    expect(res.headers.get('Cache-Control')).toBe('no-store');
    expect(body.code).toMatch(new RegExp(`^[${CODE_ALPHABET}]{8}$`));
    expect(body.teacherKey.length).toBeGreaterThanOrEqual(20);
    const meta = kv.get(`class-board:${body.code}:meta`)!;
    expect(meta).not.toContain(body.teacherKey);
    expect(JSON.parse(meta).teacher).toMatch(/^[0-9a-f]{64}$/);
    expect(ttls.get(`class-board:${body.code}:meta`)).toBe(BOARD_TTL_SECONDS);
    expect(BOARD_TTL_SECONDS).toBe(30 * 24 * 60 * 60);
  });

  it('takes the messages already on screen, leaving off any that break the rules', async () => {
    const { body } = await create([{ text: 'Hello <b>class</b>', machine: 'typewriter' }, { text: 'see www.example.com', machine: 'imac' }, { text: 'In Palatino', machine: 'imac', font: 'Palatino' }]);
    expect(body.messages.map((m: { text: string }) => m.text)).toEqual(['Hello class', 'In Palatino']);
    expect(body.messages[1]).toMatchObject({ machine: 'imac', font: 'Palatino' });
    expect(body.skipped).toBe(1);
    expect(lists.get(`class-board:${body.code}:messages`)).toHaveLength(2);
  });

  it('never takes a code another board has', async () => {
    // The first code drawn is taken, so the board is made under the next.
    picks.push(...Array(8).fill(0), ...Array(8).fill(0), ...Array(8).fill(1));
    const first = await create();
    expect(first.body.code).toBe('22222222');
    const before = kv.get('class-board:22222222:meta');
    const second = await create();
    expect(second.body.code).toBe('33333333');
    expect(kv.get('class-board:22222222:meta')).toBe(before);
  });
});

describe('reading and posting', () => {
  it('posts a message and reads it back, renewing the 30 days', async () => {
    const { body } = await create();
    ttls.set(`class-board:${body.code}:meta`, 100);
    const res = await post(body.code, 'Our class typed this.');
    expect(res.status).toBe(201);
    const { message } = await res.json();
    expect(message).toMatchObject({ text: 'Our class typed this.', machine: 'typewriter' });
    expect(ttls.get(`class-board:${body.code}:meta`)).toBe(BOARD_TTL_SECONDS);
    expect(ttls.get(`class-board:${body.code}:messages`)).toBe(BOARD_TTL_SECONDS);

    const read = await r.one.GET(req('GET'), ctx(body.code.toLowerCase()));
    expect(read.status).toBe(200);
    const got = await read.json();
    expect(got.messages).toEqual([message]);
    expect(got.expiresIn).toBe(BOARD_TTL_SECONDS);
  });

  it('answers 404 for an unknown or malformed code', async () => {
    expect((await r.one.GET(req('GET'), ctx('ABCDEFGH'))).status).toBe(404);
    expect((await r.one.GET(req('GET'), ctx('<script>'))).status).toBe(404);
    expect((await post('ABCDEFGH', 'hi')).status).toBe(404);
  });

  it.each([
    ['empty', '   '],
    ['too-long', 'x'.repeat(MESSAGE_MAX + 1)],
    ['link', 'go to https://example.com'],
    ['link', 'try example.com today'],
    ['language', 'this is sh1t'],
  ])('refuses a message that is %s', async (reason, text) => {
    const { body } = await create();
    const res = await post(body.code, text);
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ error: reason });
    expect(lists.get(`class-board:${body.code}:messages`) ?? []).toHaveLength(0);
  });

  it('strips HTML and keeps the machine and font only from the allowed lists', async () => {
    const { body } = await create();
    const res = await post(body.code, '<img src=x onerror=alert(1)>Hi <i>there</i>', { machine: 'imac', font: 'Comic Sans' });
    const { message } = await res.json();
    expect(message.text).toBe('Hi there');
    expect(message.font).toBeUndefined();
    const odd = await (await post(body.code, 'odd', { machine: 'quill' })).json();
    expect(odd.message.machine).toBe('typewriter');
  });

  it('holds at most 200 messages', async () => {
    const { body } = await create();
    lists.set(`class-board:${body.code}:messages`, Array.from({ length: BOARD_MAX }, (_, i) => JSON.stringify({ id: `m${i}`, text: 'x', machine: 'typewriter', at: 0 })));
    const res = await post(body.code, 'one too many');
    expect(res.status).toBe(409);
    expect(lists.get(`class-board:${body.code}:messages`)).toHaveLength(BOARD_MAX);
  });
});

describe('the teacher key', () => {
  it('deletes one message, and only with the key', async () => {
    const { body } = await create([{ text: 'keep' }, { text: 'remove' }]);
    const id = body.messages[1].id;
    expect((await r.message.DELETE(req('DELETE'), ctx(body.code, id))).status).toBe(403);
    expect((await r.message.DELETE(req('DELETE', undefined, { 'x-teacher-key': 'wrong' }), ctx(body.code, id))).status).toBe(403);
    const ok = await r.message.DELETE(req('DELETE', undefined, { 'x-teacher-key': body.teacherKey }), ctx(body.code, id));
    expect(ok.status).toBe(200);
    const left = await (await r.one.GET(req('GET'), ctx(body.code))).json();
    expect(left.messages.map((m: { text: string }) => m.text)).toEqual(['keep']);
    expect((await r.message.DELETE(req('DELETE', undefined, { 'x-teacher-key': body.teacherKey }), ctx(body.code, id))).status).toBe(404);
  });

  it('deletes the whole board, and only with the key', async () => {
    const { body } = await create([{ text: 'hello' }]);
    expect((await r.one.DELETE(req('DELETE', undefined, { 'x-teacher-key': 'nope' }), ctx(body.code))).status).toBe(403);
    expect((await r.one.DELETE(req('DELETE', undefined, { 'x-teacher-key': body.teacherKey }), ctx(body.code))).status).toBe(200);
    expect((await r.one.GET(req('GET'), ctx(body.code))).status).toBe(404);
    expect(kv.size + lists.size).toBe(0);
  });
});

describe('limits and failures', () => {
  it('keys the rate limits by a hash of the address, never the address itself', async () => {
    await create();
    expect(limitKeys.length).toBeGreaterThan(0);
    for (const k of limitKeys) {
      expect(k).not.toContain('203.0.113.7');
      expect(k).toMatch(/^[0-9a-f]{32}$/);
    }
  });

  it.each([['create'], ['post'], ['read'], ['remove']])('turns a request over the %s limit away', async (which) => {
    const { body } = await create([{ text: 'hello' }]);
    limits[which] = false;
    const res =
      which === 'create' ? await r.board.POST(req('POST', {}))
      : which === 'post' ? await post(body.code, 'hi')
      : which === 'read' ? await r.one.GET(req('GET'), ctx(body.code))
      : await r.one.DELETE(req('DELETE', undefined, { 'x-teacher-key': body.teacherKey }), ctx(body.code));
    expect(res.status).toBe(429);
    expect(Number(res.headers.get('Retry-After'))).toBeGreaterThan(0);
    expect(lists.get(`class-board:${body.code}:messages`)).toHaveLength(1);
  });

  it('answers 503 when the store is down', async () => {
    const { body } = await create();
    db.failing = true;
    expect((await r.board.POST(req('POST', {}))).status).toBe(503);
    expect((await r.one.GET(req('GET'), ctx(body.code))).status).toBe(503);
    expect((await post(body.code, 'hi')).status).toBe(503);
  });

  it('says saving is unavailable when the store is not configured', async () => {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    await load();
    expect(await (await r.board.GET()).json()).toEqual({ available: false });
    expect((await r.board.POST(req('POST', {}))).status).toBe(503);
    expect((await r.one.GET(req('GET'), ctx('ABCDEFGH'))).status).toBe(503);
  });
});

describe('the board’s rules', () => {
  it('reads a code however it is typed', () => {
    expect(normalizeCode('k7m3-qx9p')).toBe('K7M3QX9P');
    expect(normalizeCode('K7M3 QX9P')).toBe('K7M3QX9P');
    expect(normalizeCode('K7M3QX9O')).toBeNull();
    expect(normalizeCode('SHORT')).toBeNull();
  });

  it('cleans text to plain words', () => {
    expect(cleanText('  <script>alert(1)</script>Hi\u0000 there\n\n\n\nfriend  ')).toBe('alert(1)Hi there\n\nfriend');
  });

  it('lets ordinary words through and catches disguised ones', () => {
    for (const ok of ['Class of 2026 says hello!', 'Scunthorpe', 'I passed my assessment', 'Grapes and cocktails?']) expect(checkMessage(ok).ok).toBe(true);
    for (const bad of ['s h i t', 'S.H.I.T', '$hit', 'shiiit', 'what the fuuuck']) expect(checkMessage(bad)).toEqual({ ok: false, reason: 'language' });
    for (const link of ['http://x.y', 'WWW . site', 'me@school.org', 'example(dot)com']) expect(checkMessage(link)).toEqual({ ok: false, reason: 'link' });
  });
});
