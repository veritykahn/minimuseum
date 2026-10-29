/**
 * @jest-environment node
 */

/*
 * The stones API, with Upstash mocked: GET returns the count (briefly
 * cached), POST adds one and returns the new count, the rate limits turn a
 * POST away without counting it, and a store that is missing or failing
 * answers 503 rather than throwing. Its keys are its own, apart from the
 * poppies'.
 */

export {}; // a module of its own, apart from the poppies' test

const store = { count: 0, failing: false, keys: [] as string[] };
const limits = { burst: true, daily: true };
const limitKeys: string[] = [];
const prefixes: string[] = [];

jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn(async (key: string) => {
      store.keys.push(key);
      if (store.failing) throw new Error('down');
      return store.count;
    }),
    incr: jest.fn(async (key: string) => {
      store.keys.push(key);
      if (store.failing) throw new Error('down');
      return ++store.count;
    }),
  })),
}));

jest.mock('@upstash/ratelimit', () => {
  const Ratelimit = jest.fn().mockImplementation((opts: { prefix: string }) => {
    prefixes.push(opts.prefix);
    return {
      limit: jest.fn(async (key: string) => {
        limitKeys.push(key);
        const ok = opts.prefix.endsWith('burst') ? limits.burst : limits.daily;
        return { success: ok, reset: Date.now() + 60_000, limit: 1, remaining: ok ? 1 : 0 };
      }),
    };
  });
  Object.assign(Ratelimit, { slidingWindow: jest.fn(() => 'sliding'), fixedWindow: jest.fn(() => 'fixed') });
  return { Ratelimit };
});

type Route = typeof import('@/app/api/stones/route');
let route: Route;

const post = (ip = '203.0.113.7') => new Request('http://localhost/api/stones', { method: 'POST', headers: { 'x-forwarded-for': `${ip}, 10.0.0.1` } });

beforeEach(async () => {
  store.count = 26;
  store.failing = false;
  store.keys.length = 0;
  limits.burst = true;
  limits.daily = true;
  limitKeys.length = 0;
  prefixes.length = 0;
  process.env.KV_REST_API_URL = 'https://example.upstash.io';
  process.env.KV_REST_API_TOKEN = 'test-token';
  await jest.isolateModulesAsync(async () => {
    route = await import('@/app/api/stones/route');
  });
});

describe('/api/stones', () => {
  it('GET returns the count, cached for a few seconds at the edge', async () => {
    const res = await route.GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ count: 26 });
    expect(res.headers.get('Cache-Control')).toMatch(/s-maxage=10/);
  });

  it('POST lays one stone and returns the new count, uncached', async () => {
    const res = await route.POST(post());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ count: 27 });
    expect(res.headers.get('Cache-Control')).toBe('no-store');
    expect(store.count).toBe(27);
  });

  it('keeps its count and its limits under keys of its own', async () => {
    await route.POST(post());
    expect(store.keys).toEqual(['holocaust:stones']);
    expect(prefixes.every((p) => p.startsWith('holocaust:stones:'))).toBe(true);
  });

  it('keys the rate limit by a hash of the address, never the address itself', async () => {
    await route.POST(post('203.0.113.7'));
    expect(limitKeys.length).toBe(2);
    for (const k of limitKeys) {
      expect(k).not.toContain('203.0.113.7');
      expect(k).toMatch(/^[0-9a-f]{32}$/);
    }
  });

  it.each([['burst'], ['daily']] as const)('a POST over the %s limit is turned away and not counted', async (which) => {
    limits[which] = false;
    const res = await route.POST(post());
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: 'rate-limited', count: 26 });
    expect(Number(res.headers.get('Retry-After'))).toBeGreaterThan(0);
    expect(store.count).toBe(26);
  });

  it('answers 503 when the store is down', async () => {
    store.failing = true;
    expect((await route.GET()).status).toBe(503);
    expect((await route.POST(post())).status).toBe(503);
  });

  it('answers 503 when the store is not configured', async () => {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    await jest.isolateModulesAsync(async () => {
      route = await import('@/app/api/stones/route');
    });
    expect((await route.GET()).status).toBe(503);
  });
});
