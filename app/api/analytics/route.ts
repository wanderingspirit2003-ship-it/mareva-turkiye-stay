import { env } from "cloudflare:workers";

const allowedEvents = new Set(["visit", "search", "outbound"]);
let schemaReady = false;

async function ensureAnalyticsSchema() {
  if (schemaReady) return;
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS analytics_events (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, event_type text NOT NULL, destination text, session_id text, created_at integer DEFAULT 0 NOT NULL)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_analytics_events_type_created ON analytics_events (event_type, created_at)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_analytics_events_destination ON analytics_events (destination)"),
  ]);
  schemaReady = true;
}

export async function POST(request: Request) {
  const body = await request.json() as { eventType?: string; destination?: string; sessionId?: string };
  if (!body.eventType || !allowedEvents.has(body.eventType)) {
    return Response.json({ error: "INVALID_EVENT" }, { status: 400 });
  }
  await ensureAnalyticsSchema();
  await env.DB.prepare(
    "INSERT INTO analytics_events (event_type, destination, session_id, created_at) VALUES (?, ?, ?, unixepoch())"
  ).bind(body.eventType, body.destination || null, body.sessionId || null).run();
  return Response.json({ ok: true });
}

export async function GET() {
  await ensureAnalyticsSchema();
  const totals = await env.DB.prepare(`
    SELECT
      SUM(CASE WHEN event_type = 'visit' THEN 1 ELSE 0 END) AS visits,
      SUM(CASE WHEN event_type = 'search' THEN 1 ELSE 0 END) AS searches,
      SUM(CASE WHEN event_type = 'outbound' THEN 1 ELSE 0 END) AS outbound,
      COUNT(DISTINCT CASE WHEN event_type = 'visit' THEN session_id END) AS unique_sessions
    FROM analytics_events
  `).first();
  const destinations = await env.DB.prepare(`
    SELECT destination, COUNT(*) AS searches
    FROM analytics_events
    WHERE event_type = 'search' AND destination IS NOT NULL
    GROUP BY destination
    ORDER BY searches DESC
    LIMIT 10
  `).all();
  const daily = await env.DB.prepare(`
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
