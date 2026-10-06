CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`name` text NOT NULL,
	`program_id` text,
	`value` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `event_session` ON `events` (`session_id`);--> statement-breakpoint
CREATE INDEX `event_time` ON `events` (`created_at`);--> statement-breakpoint
CREATE TABLE `failures` (
	`id` text PRIMARY KEY NOT NULL,
	`route` text NOT NULL,
	`code` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `policy_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`program_id` text NOT NULL,
	`version` text NOT NULL,
	`payload` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`answers` text DEFAULT '{}' NOT NULL,
	`plan` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `session_expiry` ON `sessions` (`updated_at`);--> statement-breakpoint
CREATE TABLE `sources` (
	`url` text PRIMARY KEY NOT NULL,
	`hash` text NOT NULL,
	`status` text NOT NULL,
	`checked_at` text NOT NULL,
	`error` text
);
