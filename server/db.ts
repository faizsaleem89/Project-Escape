import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  visitorSessions, InsertVisitorSession,
  visitorEvents, InsertVisitorEvent,
  generatedFrequencies, InsertGeneratedFrequency,
  seedTracks, InsertSeedTrack,
  nailReadings, InsertNailReading,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── USER QUERIES ───────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── VISITOR SESSION QUERIES ────────────────────────────────

export async function createVisitorSession(session: InsertVisitorSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(visitorSessions).values(session);
  return session;
}

export async function getVisitorSession(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(visitorSessions)
    .where(eq(visitorSessions.sessionId, sessionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateVisitorSession(sessionId: string, data: Partial<InsertVisitorSession>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(visitorSessions).set(data).where(eq(visitorSessions.sessionId, sessionId));
}

// ─── VISITOR EVENT QUERIES ──────────────────────────────────

export async function recordVisitorEvents(events: InsertVisitorEvent[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (events.length === 0) return;
  await db.insert(visitorEvents).values(events);
  const sid = events[0].sessionId;
  await db.update(visitorSessions)
    .set({ eventCount: sql`${visitorSessions.eventCount} + ${events.length}` })
    .where(eq(visitorSessions.sessionId, sid));
}

export async function getVisitorEvents(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(visitorEvents)
    .where(eq(visitorEvents.sessionId, sessionId))
    .orderBy(visitorEvents.eventTimestamp);
}

export async function getEventSummary(sessionId: string) {
  const db = await getDb();
  if (!db) return null;
  const events = await getVisitorEvents(sessionId);
  if (events.length === 0) return null;

  const clickEvents = events.filter(e => e.eventType === 'click');
  const scrollEvents = events.filter(e => e.eventType === 'scroll');
  const hoverEvents = events.filter(e => e.eventType === 'hover');
  const resonanceEvents = events.filter(e => e.eventType === 'resonance');
  const navEvents = events.filter(e => e.eventType === 'navigation');
  const timingEvents = events.filter(e => e.eventType === 'timing');

  const firstEvent = events[0];
  const lastEvent = events[events.length - 1];
  const totalDuration = (lastEvent.eventTimestamp - firstEvent.eventTimestamp) / 1000;
  const pagesVisited = Array.from(new Set(events.map(e => e.page).filter(Boolean)));
  const clickVelocity = clickEvents.length > 0 && totalDuration > 0
    ? clickEvents.length / totalDuration : 0;
  const scrollDepths = scrollEvents
    .map(e => (e.eventData as any)?.depth)
    .filter((d: any): d is number => typeof d === 'number');
  const avgScrollDepth = scrollDepths.length > 0
    ? scrollDepths.reduce((a: number, b: number) => a + b, 0) / scrollDepths.length : 0;
  const resonanceDurations = resonanceEvents
    .map(e => (e.eventData as any)?.duration)
    .filter((d: any): d is number => typeof d === 'number');
  const totalResonanceTime = resonanceDurations.reduce((a: number, b: number) => a + b, 0);

  return {
    totalEvents: events.length,
    totalDuration,
    clickCount: clickEvents.length,
    clickVelocity,
    scrollCount: scrollEvents.length,
    avgScrollDepth,
    hoverCount: hoverEvents.length,
    resonanceCount: resonanceEvents.length,
    totalResonanceTime,
    navigationCount: navEvents.length,
    pagesVisited,
    timingEvents: timingEvents.length,
    firstEventTime: firstEvent.eventTimestamp,
    lastEventTime: lastEvent.eventTimestamp,
  };
}

// ─── GENERATED FREQUENCY QUERIES ────────────────────────────

export async function saveGeneratedFrequency(freq: InsertGeneratedFrequency) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(generatedFrequencies).values(freq);
  return freq;
}

export async function getGeneratedFrequency(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(generatedFrequencies)
    .where(eq(generatedFrequencies.sessionId, sessionId))
    .orderBy(desc(generatedFrequencies.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── SEED TRACK QUERIES ────────────────────────────────────

export async function getAllSeedTracks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(seedTracks).orderBy(seedTracks.displayOrder);
}

export async function getSeedTrackByArchetype(archetypeId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(seedTracks)
    .where(eq(seedTracks.archetypeId, archetypeId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertSeedTrack(track: InsertSeedTrack) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(seedTracks).values(track).onDuplicateKeyUpdate({
    set: {
      title: track.title,
      description: track.description,
      audioUrl: track.audioUrl,
      fileKey: track.fileKey,
      baseFrequency: track.baseFrequency,
      frequencyRange: track.frequencyRange,
      tags: track.tags,
      displayOrder: track.displayOrder,
    },
  });
}

// ─── NAIL READING QUERIES ────────────────────────────────────────────

export async function createNailReading(reading: InsertNailReading) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(nailReadings).values(reading);
  return { ...reading, id: Number(result[0].insertId) };
}

export async function getNailReading(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(nailReadings)
    .where(eq(nailReadings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getNailReadingBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(nailReadings)
    .where(eq(nailReadings.sessionId, sessionId))
    .orderBy(desc(nailReadings.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateNailReading(id: number, data: Partial<InsertNailReading>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(nailReadings).set(data).where(eq(nailReadings.id, id));
}

export async function getNailReadingsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(nailReadings)
    .where(eq(nailReadings.userId, userId))
    .orderBy(desc(nailReadings.createdAt));
}
