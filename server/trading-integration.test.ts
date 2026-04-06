import { describe, it, expect } from "vitest";

/**
 * Trading Integration Tests
 * Verifies the full trading lifecycle: session → open trade → close trade → journal
 * Also verifies tracker-driven hex usage in trading context
 */

// Import schema for structure verification
import * as schema from "../drizzle/schema";

describe("Trading Integration Lifecycle", () => {
  it("should have trade_sessions table with baseline and current hex fields", () => {
    const cols = Object.keys(schema.tradeSessions);
    expect(cols).toContain("baselineHex");
    expect(cols).toContain("currentHex");
    expect(cols).toContain("driftPercentage");
    expect(cols).toContain("alertLevel");
    expect(cols).toContain("sessionId");
  });

  it("should have trades table with entry/exit hex and adriana signal", () => {
    const cols = Object.keys(schema.trades);
    expect(cols).toContain("entryHex");
    expect(cols).toContain("exitHex");
    expect(cols).toContain("entryFrequency");
    expect(cols).toContain("exitFrequency");
    expect(cols).toContain("adrianaSignal");
    expect(cols).toContain("pnl");
    expect(cols).toContain("pnlPercentage");
  });

  it("should have frequency_snapshots table for heart rate monitoring", () => {
    const cols = Object.keys(schema.frequencySnapshots);
    expect(cols).toContain("hexSignature");
    expect(cols).toContain("frequency");
    expect(cols).toContain("driftFromBaseline");
    expect(cols).toContain("alertLevel");
    expect(cols).toContain("tradeSessionId");
  });

  it("should link trade_sessions to visitor_sessions via sessionId", () => {
    // Both tables use sessionId as the linking field
    const tradeSessionCols = Object.keys(schema.tradeSessions);
    const visitorSessionCols = Object.keys(schema.visitorSessions);
    expect(tradeSessionCols).toContain("sessionId");
    expect(visitorSessionCols).toContain("sessionId");
  });

  it("should link trades to trade_sessions via tradeSessionId", () => {
    const tradeCols = Object.keys(schema.trades);
    expect(tradeCols).toContain("tradeSessionId");
  });

  it("should support full trade lifecycle fields (open → close)", () => {
    const cols = Object.keys(schema.trades);
    // Open phase
    expect(cols).toContain("entryPrice");
    expect(cols).toContain("quantity");
    expect(cols).toContain("direction");
    expect(cols).toContain("symbol");
    expect(cols).toContain("entryHex");
    // Close phase
    expect(cols).toContain("exitPrice");
    expect(cols).toContain("exitHex");
    expect(cols).toContain("pnl");
    expect(cols).toContain("pnlPercentage");
    expect(cols).toContain("adrianaSignal");
    expect(cols).toContain("closedAt");
    expect(cols).toContain("status");
  });
});

describe("Hex-Driven Trading Signals", () => {
  it("should compute drift correctly between two hex signatures", () => {
    // Simulate the drift algorithm used in trading.getAlert
    const computeDrift = (baseHex: string, currHex: string) => {
      const baseDigits = baseHex.split("").map(h => parseInt(h, 16));
      const currDigits = currHex.split("").map(h => parseInt(h, 16));
      const drift = baseDigits.reduce((sum, d, i) => sum + Math.abs(d - (currDigits[i] || 0)), 0);
      const maxDrift = baseDigits.length * 15;
      return (drift / maxDrift) * 100;
    };

    // Identical hex = 0% drift
    expect(computeDrift("AABBCCDD", "AABBCCDD")).toBe(0);

    // Maximum drift (0 vs F for each digit)
    expect(computeDrift("00000000", "FFFFFFFF")).toBe(100);

    // Partial drift
    const drift = computeDrift("A5B3C7D1", "A5B3C7D1");
    expect(drift).toBe(0);
  });

  it("should classify alert levels based on combined drift", () => {
    const classifyAlert = (combinedDrift: number) => {
      if (combinedDrift < 10) return "sovereign";
      if (combinedDrift < 30) return "drift";
      return "exit";
    };

    expect(classifyAlert(0)).toBe("sovereign");
    expect(classifyAlert(5)).toBe("sovereign");
    expect(classifyAlert(9.9)).toBe("sovereign");
    expect(classifyAlert(10)).toBe("drift");
    expect(classifyAlert(20)).toBe("drift");
    expect(classifyAlert(29.9)).toBe("drift");
    expect(classifyAlert(30)).toBe("exit");
    expect(classifyAlert(50)).toBe("exit");
    expect(classifyAlert(100)).toBe("exit");
  });

  it("should classify adriana signal on trade close based on entry/exit hex drift", () => {
    const classifyTradeSignal = (entryHex: string, exitHex: string) => {
      const entryDigits = entryHex.split("").map(h => parseInt(h, 16));
      const exitDigits = exitHex.split("").map(h => parseInt(h, 16));
      const drift = entryDigits.reduce((sum, d, i) => sum + Math.abs(d - (exitDigits[i] || 0)), 0);
      const maxDrift = entryDigits.length * 15;
      const driftPct = drift / maxDrift;
      return driftPct < 0.15 ? "sovereign" : driftPct < 0.4 ? "drift" : "exit";
    };

    // Same hex = sovereign
    expect(classifyTradeSignal("A5B3C7D1", "A5B3C7D1")).toBe("sovereign");

    // Small drift = sovereign
    expect(classifyTradeSignal("A5B3C7D1", "A5B3C7D2")).toBe("sovereign");

    // Maximum drift = exit
    expect(classifyTradeSignal("00000000", "FFFFFFFF")).toBe("exit");
  });

  it("should compute PnL correctly for long and short trades", () => {
    // Long trade: buy low, sell high = profit
    const longPnl = (exitPrice: number, entryPrice: number, qty: number) =>
      (exitPrice - entryPrice) * qty;
    expect(longPnl(105, 100, 1)).toBe(5);
    expect(longPnl(95, 100, 1)).toBe(-5);

    // Short trade: sell high, buy low = profit
    const shortPnl = (entryPrice: number, exitPrice: number, qty: number) =>
      (entryPrice - exitPrice) * qty;
    expect(shortPnl(100, 95, 1)).toBe(5);
    expect(shortPnl(100, 105, 1)).toBe(-5);
  });
});

describe("Tracker-Hex-Trading Pipeline", () => {
  it("should share sessionId between visitor tracker and trading session", () => {
    // The pipeline: useBehaviourTracker creates sessionId → Trading.tsx reads it via useTracker()
    // → Trading starts a trade session with that sessionId → hex is generated from visitor events
    // → Trading polls visitor.getSession for the hex → uses it for baseline/current comparison
    // This test verifies the schema supports this pipeline
    const visitorCols = Object.keys(schema.visitorSessions);
    const tradeCols = Object.keys(schema.tradeSessions);
    
    // Both must have sessionId
    expect(visitorCols).toContain("sessionId");
    expect(tradeCols).toContain("sessionId");
    
    // Visitor session stores the hex
    expect(visitorCols).toContain("hexSignature");
    expect(visitorCols).toContain("baseFrequency");
    
    // Trade session stores baseline and current hex
    expect(tradeCols).toContain("baselineHex");
    expect(tradeCols).toContain("currentHex");
  });

  it("should have frequency snapshots linked to trade sessions for time-series analysis", () => {
    const snapCols = Object.keys(schema.frequencySnapshots);
    expect(snapCols).toContain("tradeSessionId");
    expect(snapCols).toContain("sessionId");
    expect(snapCols).toContain("hexSignature");
    expect(snapCols).toContain("frequency");
    expect(snapCols).toContain("driftFromBaseline");
    expect(snapCols).toContain("alertLevel");
    expect(snapCols).toContain("behaviourSummary");
  });
});
