import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, bigint, float } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Visitor sessions — each unique visitor gets a session.
 * Anonymous visitors get a fingerprint-based sessionId.
 */
export const visitorSessions = mysqlTable("visitor_sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull().unique(),
  userId: int("userId"),
  fingerprint: varchar("fingerprint", { length: 128 }),
  hexSignature: varchar("hexSignature", { length: 16 }),
  baseFrequency: float("baseFrequency"),
  archetypeId: varchar("archetypeId", { length: 64 }),
  frequencyAnalysis: json("frequencyAnalysis"),
  adrianaReading: text("adrianaReading"),
  totalInteractionTime: int("totalInteractionTime").default(0),
  eventCount: int("eventCount").default(0),
  status: mysqlEnum("status", ["active", "diagnosed", "completed"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VisitorSession = typeof visitorSessions.$inferSelect;
export type InsertVisitorSession = typeof visitorSessions.$inferInsert;

/**
 * Visitor events — every click, scroll, hover, timing event.
 * Raw signals Adriana reads to diagnose the visitor.
 */
export const visitorEvents = mysqlTable("visitor_events", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  eventType: varchar("eventType", { length: 32 }).notNull(),
  page: varchar("page", { length: 64 }),
  target: varchar("target", { length: 128 }),
  eventData: json("eventData"),
  eventTimestamp: bigint("eventTimestamp", { mode: "number" }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VisitorEvent = typeof visitorEvents.$inferSelect;
export type InsertVisitorEvent = typeof visitorEvents.$inferInsert;

/**
 * Generated frequencies — the personal music Adriana creates.
 */
export const generatedFrequencies = mysqlTable("generated_frequencies", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  hexSignature: varchar("hexSignature", { length: 16 }).notNull(),
  baseFrequency: float("baseFrequency").notNull(),
  fifthHarmonic: float("fifthHarmonic"),
  subOctave: float("subOctave"),
  bpm: float("bpm"),
  waveformType: varchar("waveformType", { length: 32 }),
  archetypeId: varchar("archetypeId", { length: 64 }),
  parameters: json("parameters"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GeneratedFrequency = typeof generatedFrequencies.$inferSelect;
export type InsertGeneratedFrequency = typeof generatedFrequencies.$inferInsert;

/**
 * Seed tracks — the 8 archetype tracks that serve as templates.
 */
export const seedTracks = mysqlTable("seed_tracks", {
  id: int("id").autoincrement().primaryKey(),
  archetypeId: varchar("archetypeId", { length: 64 }).notNull().unique(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  audioUrl: text("audioUrl"),
  fileKey: varchar("fileKey", { length: 256 }),
  baseFrequency: float("baseFrequency"),
  frequencyRange: json("frequencyRange"),
  tags: json("tags"),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SeedTrack = typeof seedTracks.$inferSelect;
export type InsertSeedTrack = typeof seedTracks.$inferInsert;

/**
 * Nail readings — the original protocol.
 * A photograph of the nail (pinky, thumb, toe) is analyzed
 * across 16 diagnostic categories, mapping to frequency archetypes.
 * The nail is a compressed record of the entire body.
 * Chinese medicine, Ayurveda, the cultures that understood frequency
 * before we called it frequency.
 */
export const nailReadings = mysqlTable("nail_readings", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  userId: int("userId"),
  imageUrl: text("imageUrl").notNull(),
  fileKey: varchar("fileKey", { length: 256 }).notNull(),
  nailType: mysqlEnum("nailType", ["pinky", "thumb", "toe", "other"]).default("pinky").notNull(),
  hand: mysqlEnum("hand", ["left", "right"]).default("right"),
  // The 16-category diagnostic output from LLM vision
  diagnosticCategories: json("diagnosticCategories"),
  // Overall reading summary
  readingSummary: text("readingSummary"),
  // Mapped frequency parameters from the nail analysis
  frequencyMapping: json("frequencyMapping"),
  // The archetype the nail points to
  archetypeId: varchar("archetypeId", { length: 64 }),
  // Confidence score 0-1
  confidence: float("confidence"),
  status: mysqlEnum("status", ["uploaded", "analyzing", "complete", "failed"]).default("uploaded").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NailReading = typeof nailReadings.$inferSelect;
export type InsertNailReading = typeof nailReadings.$inferInsert;
