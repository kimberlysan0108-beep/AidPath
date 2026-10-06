CREATE TABLE `policy_approvals` (
	`id` text PRIMARY KEY NOT NULL,
	`source_hash` text NOT NULL,
	`reviewed_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `sessions` ADD `revision` integer DEFAULT 0 NOT NULL;