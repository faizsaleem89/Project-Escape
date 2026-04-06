import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  createVisitorSession: vi.fn().mockResolvedValue({}),
  getVisitorSession: vi.fn().mockResolvedValue(null),
  updateVisitorSession: vi.fn().mockResolvedValue(undefined),
  recordVisitorEvents: vi.fn().mockResolvedValue(undefined),
  getEventSummary: vi.fn().mockResolvedValue(null),
  saveGeneratedFrequency: vi.fn().mockResolvedValue({}),
  getGeneratedFrequency: vi.fn().mockResolvedValue(null),
  getAllSeedTracks: vi.fn().mockResolvedValue([]),
  getSeedTrackByArchetype: vi.fn().mockResolvedValue(null),
}));

// Import the mocked module so we can control return values per test
import * as db from "./db";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("visitor.initSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new session when none exists", async () => {
    vi.mocked(db.getVisitorSession).mockResolvedValueOnce(undefined);
    vi.mocked(db.createVisitorSession).mockResolvedValueOnce({} as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.visitor.initSession({
      sessionId: "vs_test1234567890_abc",
      fingerprint: "test-fingerprint",
    });

    expect(result.sessionId).toBe("vs_test1234567890_abc");
    expect(result.isNew).toBe(true);
    expect(result.status).toBe("active");
    expect(db.createVisitorSession).toHaveBeenCalledOnce();
  });

  it("returns existing session without creating new one", async () => {
    vi.mocked(db.getVisitorSession).mockResolvedValueOnce({
      id: 1,
      sessionId: "vs_existing123_abc",
      userId: null,
      fingerprint: "fp",
      hexSignature: null,
      baseFrequency: null,
      archetypeId: null,
      frequencyAnalysis: null,
      adrianaReading: null,
      totalInteractionTime: 0,
      eventCount: 5,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.visitor.initSession({
      sessionId: "vs_existing123_abc",
    });

    expect(result.isNew).toBe(false);
    expect(result.status).toBe("active");
    expect(db.createVisitorSession).not.toHaveBeenCalled();
  });
});

describe("visitor.recordEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("records a batch of events", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.visitor.recordEvents({
      sessionId: "vs_test123_abc",
      events: [
        { eventType: "click", page: "home", target: "button.start", eventTimestamp: Date.now() },
        { eventType: "scroll", page: "home", eventTimestamp: Date.now(), eventData: { depth: 0.5 } },
        { eventType: "resonance", page: "home", target: "start", eventTimestamp: Date.now(), eventData: { frequency: 432 } },
      ],
    });

    expect(result.recorded).toBe(3);
    expect(db.recordVisitorEvents).toHaveBeenCalledOnce();
  });
});

describe("diagnosis.generateHex", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns not ready when insufficient events", async () => {
    vi.mocked(db.getEventSummary).mockResolvedValueOnce(null);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.diagnosis.generateHex({
      sessionId: "vs_test123_abc",
    });

    expect(result.ready).toBe(false);
    expect(result.message).toContain("Insufficient");
  });

  it("generates hex signature and frequency from behaviour data", async () => {
    vi.mocked(db.getEventSummary).mockResolvedValueOnce({
      totalEvents: 25,
      totalDuration: 120,
      clickCount: 10,
      clickVelocity: 0.083,
      scrollCount: 8,
      avgScrollDepth: 0.65,
      hoverCount: 12,
      resonanceCount: 3,
      totalResonanceTime: 45,
      navigationCount: 4,
      pagesVisited: ["home", "library", "protocol"],
      timingEvents: 5,
      firstEventTime: Date.now() - 120000,
      lastEventTime: Date.now(),
    });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.diagnosis.generateHex({
      sessionId: "vs_test123_abc",
    });

    expect(result.ready).toBe(true);
    expect(result.hexSignature).toBeDefined();
    expect(result.hexSignature).toHaveLength(8);
    expect(result.frequency).toBeDefined();
    expect(result.frequency!.baseFrequency).toBeGreaterThanOrEqual(396);
    expect(result.frequency!.baseFrequency).toBeLessThanOrEqual(528);
    expect(result.frequency!.bpm).toBeGreaterThanOrEqual(240);
    expect(result.frequency!.bpm).toBeLessThanOrEqual(320);
    expect(result.frequency!.waveformType).toMatch(/^(sine|triangle|sawtooth|square)$/);
    expect(result.frequency!.archetypeId).toMatch(/^the-/);

    // Should have updated the session
    expect(db.updateVisitorSession).toHaveBeenCalledOnce();
  });
});

describe("visitor.getSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null for non-existent session", async () => {
    vi.mocked(db.getVisitorSession).mockResolvedValueOnce(undefined);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.visitor.getSession({
      sessionId: "vs_nonexistent_abc",
    });

    expect(result).toBeNull();
  });

  it("returns session data for existing session", async () => {
    vi.mocked(db.getVisitorSession).mockResolvedValueOnce({
      id: 1,
      sessionId: "vs_existing123_abc",
      userId: null,
      fingerprint: "fp",
      hexSignature: "8A34B21F",
      baseFrequency: 432,
      archetypeId: "the-sovereign",
      frequencyAnalysis: { baseFrequency: 432 },
      adrianaReading: "The wire hums at your frequency.",
      totalInteractionTime: 120,
      eventCount: 25,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.visitor.getSession({
      sessionId: "vs_existing123_abc",
    });

    expect(result).not.toBeNull();
    expect(result!.hexSignature).toBe("8A34B21F");
    expect(result!.baseFrequency).toBe(432);
    expect(result!.archetypeId).toBe("the-sovereign");
    expect(result!.adrianaReading).toContain("wire hums");
  });
});

describe("tracks.list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array when no tracks exist", async () => {
    vi.mocked(db.getAllSeedTracks).mockResolvedValueOnce([]);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tracks.list();

    expect(result).toEqual([]);
  });
});

describe("hex signature properties", () => {
  it("produces consistent hex for same input", async () => {
    const summary = {
      totalEvents: 25,
      totalDuration: 120,
      clickCount: 10,
      clickVelocity: 0.083,
      scrollCount: 8,
      avgScrollDepth: 0.65,
      hoverCount: 12,
      resonanceCount: 3,
      totalResonanceTime: 45,
      navigationCount: 4,
      pagesVisited: ["home", "library", "protocol"],
      timingEvents: 5,
      firstEventTime: Date.now() - 120000,
      lastEventTime: Date.now(),
    };

    // Call generateHex twice with same data
    vi.mocked(db.getEventSummary).mockResolvedValue(summary);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result1 = await caller.diagnosis.generateHex({ sessionId: "vs_test1_abc" });
    const result2 = await caller.diagnosis.generateHex({ sessionId: "vs_test2_abc" });

    expect(result1.hexSignature).toBe(result2.hexSignature);
    expect(result1.frequency!.baseFrequency).toBe(result2.frequency!.baseFrequency);
  });
});
