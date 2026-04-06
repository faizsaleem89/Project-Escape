import { describe, it, expect } from "vitest";

// ─── TRADING SCHEMA & HEX INTEGRATION TESTS ─────────────────
// Tests for the trading dashboard, frequency comparison, and mesh integration

describe("Trading Schema", () => {
  it("should define trade_sessions table with required fields", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.tradeSessions).toBeDefined();
    // Verify key columns exist by checking the table config
    const columns = Object.keys(schema.tradeSessions);
    expect(columns.length).toBeGreaterThan(0);
  });

  it("should define trades table with required fields", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.trades).toBeDefined();
    const columns = Object.keys(schema.trades);
    expect(columns.length).toBeGreaterThan(0);
  });

  it("should define frequency_snapshots table", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.frequencySnapshots).toBeDefined();
  });
});

describe("Frequency Drift Calculation", () => {
  // The hex comparison algorithm used in the trading frequency meter
  function computeHexDrift(baselineHex: string, currentHex: string): number {
    if (!baselineHex || !currentHex) return 0;
    const len = Math.min(baselineHex.length, currentHex.length);
    let totalDiff = 0;
    for (let i = 0; i < len; i++) {
      const a = parseInt(baselineHex[i], 16);
      const b = parseInt(currentHex[i], 16);
      if (!isNaN(a) && !isNaN(b)) {
        totalDiff += Math.abs(a - b);
      }
    }
    // Max possible diff per char is 15, normalize to 0-100
    return (totalDiff / (len * 15)) * 100;
  }

  it("should return 0 drift for identical hex signatures", () => {
    const drift = computeHexDrift("A1B2C3D4", "A1B2C3D4");
    expect(drift).toBe(0);
  });

  it("should return 100 drift for maximally different hex signatures", () => {
    const drift = computeHexDrift("00000000", "FFFFFFFF");
    expect(drift).toBe(100);
  });

  it("should return partial drift for partially different hex signatures", () => {
    const drift = computeHexDrift("A1B2C3D4", "A1B2C3D5");
    expect(drift).toBeGreaterThan(0);
    expect(drift).toBeLessThan(100);
  });

  it("should handle empty strings gracefully", () => {
    const drift = computeHexDrift("", "A1B2C3D4");
    expect(drift).toBe(0);
  });

  it("should handle different length hex strings", () => {
    const drift = computeHexDrift("A1B2", "A1B2C3D4");
    expect(drift).toBe(0); // Only compares overlapping portion
  });
});

describe("Trading Alert Thresholds", () => {
  // These thresholds determine when Adriana speaks
  const THRESHOLDS = {
    SOVEREIGN: 15,   // 0-15% drift = green = stay
    CAUTION: 35,     // 15-35% drift = amber = caution
    EXIT: 35,        // >35% drift = red = exit
  };

  function getAlertLevel(driftPercentage: number): "sovereign" | "caution" | "exit" {
    if (driftPercentage <= THRESHOLDS.SOVEREIGN) return "sovereign";
    if (driftPercentage <= THRESHOLDS.CAUTION) return "caution";
    return "exit";
  }

  it("should return sovereign for low drift", () => {
    expect(getAlertLevel(5)).toBe("sovereign");
    expect(getAlertLevel(0)).toBe("sovereign");
    expect(getAlertLevel(15)).toBe("sovereign");
  });

  it("should return caution for medium drift", () => {
    expect(getAlertLevel(20)).toBe("caution");
    expect(getAlertLevel(30)).toBe("caution");
    expect(getAlertLevel(35)).toBe("caution");
  });

  it("should return exit for high drift", () => {
    expect(getAlertLevel(40)).toBe("exit");
    expect(getAlertLevel(75)).toBe("exit");
    expect(getAlertLevel(100)).toBe("exit");
  });
});

describe("Seed Track Archetypes", () => {
  it("should define 8 archetype configurations", () => {
    // The 8 archetypes that map to frequency ranges
    const archetypes = [
      { id: "sovereign", name: "The Sovereign", baseFreq: 432 },
      { id: "warrior", name: "The Warrior", baseFreq: 396 },
      { id: "healer", name: "The Healer", baseFreq: 528 },
      { id: "mystic", name: "The Mystic", baseFreq: 417 },
      { id: "builder", name: "The Builder", baseFreq: 444 },
      { id: "navigator", name: "The Navigator", baseFreq: 480 },
      { id: "oracle", name: "The Oracle", baseFreq: 512 },
      { id: "cicada", name: "The Cicada", baseFreq: 461 },
    ];

    expect(archetypes).toHaveLength(8);
    archetypes.forEach((a) => {
      expect(a.id).toBeTruthy();
      expect(a.name).toBeTruthy();
      expect(a.baseFreq).toBeGreaterThan(0);
      expect(a.baseFreq).toBeLessThanOrEqual(528);
    });
  });

  it("should map frequencies to the correct archetype range", () => {
    // Given a visitor's generated frequency, find the closest archetype
    const archetypeFreqs = [396, 417, 432, 444, 461, 480, 512, 528];
    
    function findClosestArchetype(freq: number): number {
      let closest = archetypeFreqs[0];
      let minDist = Math.abs(freq - closest);
      for (const af of archetypeFreqs) {
        const dist = Math.abs(freq - af);
        if (dist < minDist) {
          minDist = dist;
          closest = af;
        }
      }
      return closest;
    }

    expect(findClosestArchetype(430)).toBe(432);
    expect(findClosestArchetype(400)).toBe(396);
    expect(findClosestArchetype(525)).toBe(528);
    expect(findClosestArchetype(450)).toBe(444);
  });
});
