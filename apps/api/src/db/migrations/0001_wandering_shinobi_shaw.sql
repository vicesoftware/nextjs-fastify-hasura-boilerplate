CREATE TABLE IF NOT EXISTS "activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"action" varchar(100) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_metadata" DROP CONSTRAINT "app_metadata_component_environment_unique";
--> statement-breakpoint
-- Create indexes for common queries on activity_log
CREATE INDEX IF NOT EXISTS "idx_activity_log_timestamp" ON "activity_log" ("timestamp" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_activity_log_action" ON "activity_log" ("action");
--> statement-breakpoint
-- Insert sample data to demonstrate the feature
INSERT INTO "activity_log" ("action") VALUES
('system.startup'),
('health.check'),
('database.migration');