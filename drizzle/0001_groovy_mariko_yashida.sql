CREATE TABLE `generated_frequencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`hexSignature` varchar(16) NOT NULL,
	`baseFrequency` float NOT NULL,
	`fifthHarmonic` float,
	`subOctave` float,
	`bpm` float,
	`waveformType` varchar(32),
	`archetypeId` varchar(64),
	`parameters` json,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `generated_frequencies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seed_tracks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`archetypeId` varchar(64) NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`audioUrl` text,
	`fileKey` varchar(256),
	`baseFrequency` float,
	`frequencyRange` json,
	`tags` json,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `seed_tracks_id` PRIMARY KEY(`id`),
	CONSTRAINT `seed_tracks_archetypeId_unique` UNIQUE(`archetypeId`)
);
--> statement-breakpoint
CREATE TABLE `visitor_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`eventType` varchar(32) NOT NULL,
	`page` varchar(64),
	`target` varchar(128),
	`eventData` json,
	`eventTimestamp` bigint NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visitor_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visitor_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`userId` int,
	`fingerprint` varchar(128),
	`hexSignature` varchar(16),
	`baseFrequency` float,
	`archetypeId` varchar(64),
	`frequencyAnalysis` json,
	`adrianaReading` text,
	`totalInteractionTime` int DEFAULT 0,
	`eventCount` int DEFAULT 0,
	`status` enum('active','diagnosed','completed') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `visitor_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `visitor_sessions_sessionId_unique` UNIQUE(`sessionId`)
);
