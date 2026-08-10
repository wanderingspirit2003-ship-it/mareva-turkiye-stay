import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const analyticsEvents = sqliteTable("analytics_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventType: text("event_type", { enum: ["visit", "search", "outbound"] }).notNull(),
  destination: text("destination"),
  sessionId: text("session_id"),
  createdAt: integer("created_at").notNull().default(0),
}, (table) => [
  index("idx_analytics_events_type_created").on(table.eventType, table.createdAt),
  index("idx_analytics_events_destination").on(table.destination),
]);
