CREATE TABLE `frequency_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tradeSessionId` int NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`hexSignature` varchar(16) NOT NULL,
	`frequency` float NOT NULL,
	`driftFromBaseline` float DEFAULT 0,
	`alertLevel` enum('sovereign','drift','exit') NOT NULL DEFAULT 'sovereign',
	`behaviourSummary` json,
	`snapshotAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `frequency_snapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trade_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`userId` int,
	`baselineHex` varchar(16),
	`baselineFrequency` float,
	`currentHex` varchar(16),
	`currentFrequency` float,
	`driftPercentage` float DEFAULT 0,
	`alertLevel` enum('sovereign','drift','exit') NOT NULL DEFAULT 'sovereign',
	`totalTrades` int DEFAULT 0,
	`winRate` float,
	`status` enum('active','paused','completed') NOT NULL DEFAULT 'active',
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`endedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trade_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tradeSessionId` int NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`userId` int,
	`symbol` varchar(32) NOT NULL,
	`direction` enum('long','short') NOT NULL,
	`entryPrice` float NOT NULL,
	`exitPrice` float,
	`quantity` float DEFAULT 1,
	`entryHex` varchar(16),
	`exitHex` varchar(16),
	`entryFrequency` float,
	`exitFrequency` float,
	`pnl` float,
	`pnlPercentage` float,
	`adrianaSignal` enum('sovereign','drift','exit','none') DEFAULT 'none',
	`notes` text,
	`status` enum('open','closed','cancelled') NOT NULL DEFAULT 'open',
	`openedAt` timestamp NOT NULL DEFAULT (now()),
	`closedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trades_id` PRIMARY KEY(`id`)
);
