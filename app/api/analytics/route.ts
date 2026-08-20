const allowedEvents = new Set(["visit", "search", "outbound"]);
let schemaReady = false;

type AnalyticsDatabase = {
  batch: (statements: unknown[]) => Promise<unknown>;
  prepare: (query: string) => {
    bind: (...values: unknown[]) => { run: () => Promise<unknown> };
    first: () => Promise<unknown>;
    all: () => Promise<{ results?: unknown[] }>;
  };
};

const analyticsDb = (globalThis as unknown as { env?: { DB?: AnalyticsDatabase } }).env?.DB;

async function ensureAnalyticsSchema() {
  if (!analyticsDb) return;
  if (schemaReady) return;
  await analyticsDb.batch([
    analyticsDb.prepare("CREATE TABLE IF NOT EXISTS analytics_events (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, event_type text NOT NULL, destination text, session_id text, created_at integer DEFAULT 0 NOT NULL)"),
    analyticsDb.prepare("CREATE INDEX IF NOT EXISTS idx_analytics_events_type_created ON analytics_events (event_type, created_at)"),
    analyticsDb.prepare("CREATE INDEX IF NOT EXISTS idx_analytics_events_destination ON analytics_events (destination)"),
  ]);
  schemaReady = true;
}

export async function POST(request: Request) {
  const body = await request.json() as { eventType?: string; destination?: string; sessionId?: string };
  if (!body.eventType || !allowedEvents.has(body.eventType)) {
    return Response.json({ error: "INVALID_EVENT" }, { status: 400 });
  }
  await ensureAnalyticsSchema();
  if (analyticsDb) {
    await analyticsDb.prepare(
      "INSERT INTO analytics_events (event_type, destination, session_id, created_at) VALUES (?, ?, ?, unixepoch())"
    ).bind(body.eventType, body.destination || null, body.sessionId || null).run();
  }
  return Response.json({ ok: true });
}

export async function GET() {
  await ensureAnalyticsSchema();
  if (!analyticsDb) {
    return Response.json({ totals: null, destinations: [], daily: [], storage: "disabled" });
  }
  const totals = await analyticsDb.prepare(`
    SELECT
      SUM(CASE WHEN event_type = 'visit' THEN 1 ELSE 0 END) AS visits,
      SUM(CASE WHEN event_type = 'search' THEN 1 ELSE 0 END) AS searches,
      SUM(CASE WHEN event_type = 'outbound' THEN 1 ELSE 0 END) AS outbound,
      COUNT(DISTINCT CASE WHEN event_type = 'visit' THEN session_id END) AS unique_sessions
    FROM analytics_events
  `).first();
  const destinations = await analyticsDb.prepare(`
    SELECT destination, COUNT(*) AS searches
    FROM analytics_events
    WHERE event_type = 'search' AND destination IS NOT NULL
    GROUP BY destination
    ORDER BY searches DESC
    LIMIT 10
  `).all();
  const daily = await analyticsDb.prepare(`
    SELECT date(created_at, 'unixepoch') AS day,
      SUM(CASE WHEN event_type = 'visit' THEN 1 ELSE 0 END) AS visits,
      SUM(CASE WHEN event_type = 'search' THEN 1 ELSE 0 END) AS searches,
      SUM(CASE WHEN event_type = 'outbound' THEN 1 ELSE 0 END) AS outbound
    FROM analytics_events
    WHERE created_at >= unixepoch() - 604800
    GROUP BY day
    ORDER BY day ASC
  `).all();
  return Response.json({ totals, destinations: destinations.results, daily: daily.results });
}
