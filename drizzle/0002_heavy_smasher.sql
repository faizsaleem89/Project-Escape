CREATE TABLE `nail_readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`userId` int,
	`imageUrl` text NOT NULL,
	`fileKey` varchar(256) NOT NULL,
	`nailType` enum('pinky','thumb','toe','other') NOT NULL DEFAULT 'pinky',
	`hand` enum('left','right') DEFAULT 'right',
	`diagnosticCategories` json,
	`readingSummary` text,
	`frequencyMapping` json,
	`archetypeId` varchar(64),
	`confidence` float,
	`status` enum('uploaded','analyzing','complete','failed') NOT NULL DEFAULT 'uploaded',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nail_readings_id` PRIMARY KEY(`id`)
);
