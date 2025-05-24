CREATE TABLE IF NOT EXISTS "app_metadata" (
	"id" serial PRIMARY KEY NOT NULL,
	"component" varchar(50) NOT NULL,
	"version" varchar(20) NOT NULL,
	"deployed_at" timestamp DEFAULT now(),
	"git_commit" varchar(40),
	"environment" varchar(20) DEFAULT 'production',
	"metadata" jsonb,
	CONSTRAINT "app_metadata_component_environment_unique" UNIQUE("component","environment")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"overall_status" varchar(10) NOT NULL,
	"component_statuses" jsonb NOT NULL,
	"response_times" jsonb,
	"errors" jsonb
);
