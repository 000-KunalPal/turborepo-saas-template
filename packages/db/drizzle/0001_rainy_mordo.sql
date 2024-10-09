ALTER TABLE `workspace` ADD `join_code` text;--> statement-breakpoint
CREATE UNIQUE INDEX `workspace_join_code_unique` ON `workspace` (`join_code`);