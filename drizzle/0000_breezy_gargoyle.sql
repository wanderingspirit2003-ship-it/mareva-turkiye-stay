CREATE TABLE `analytics_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_type` text NOT NULL,
	`destination` text,
	`session_id` text,
	`created_at` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_analytics_events_type_created` ON `analytics_events` (`event_type`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_analytics_events_destination` ON `analytics_events` (`destination`);--> statement-breakpoint
PRAGMA optimize;
