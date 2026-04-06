import { describe, it, expect } from "vitest";

/**
 * Meta-Hex Algorithm Tests
 * The star in the river. Every number compressed into one master hex.
 * Tests verify the algorithm is deterministic, complete, and correct.
 */

// Replicate the core algorithm from routers.ts for unit testing
function computeMetaHex(systemConstants: Record<string, number>, liveData: Record<string, number>) {
  const allNumbers = [
    ...Object.values(systemConstants),
    ...Object.values(liveData),
  ];

  // Step 1: Total energy
  const totalEnergy = allNumbers.reduce((sum, n) => sum + n, 0);

  // Step 2: XOR chain
  const xorChain = allNumbers.reduce((acc, n) => {
    const intN = Math.floor(Math.abs(n * 1000)) & 0xFFFFFFFF;
    return (acc ^ intN) >>> 0;
  }, 0);

  // Step 3: Fibonacci modulation
  const phi = systemConstants.phi || 1.6180339887;
  const fibMod = Math.floor(totalEnergy * phi) & 0xFFFFFFFF;

  // Step 4: Pi compression
  const piApprox = systemConstants.piApprox || 3.14159265;
  const piComp = Math.floor(totalEnergy * piApprox) & 0xFFFFFFFF;

  // Step 5: Prime sieve
  const prime16 = systemConstants.prime16 || 53;
  const primeSieve = Math.floor(xorChain / prime16) & 0xFFFFFFFF;

  // Step 6: 16-character master hex
  const h1 = (xorChain >>> 0).toString(16).padStart(8, '0').toUpperCase();
  const h2 = (fibMod ^ piComp ^ primeSieve).toString(16).padStart(8, '0').toUpperCase();
  const masterHex = h1 + h2;

  // Step 7: Master frequency
  const frequencyLow = systemConstants.frequencyLow || 396;
  const frequencyHigh = systemConstants.frequencyHigh || 528;
  const masterFrequency = frequencyLow +
    ((xorChain % (frequencyHigh - frequencyLow)));

  // Step 8: Master archetype
  const archetypes = [
    "the-hum", "the-breach", "the-extraction", "the-confession",
    "the-sovereign", "the-genesis", "the-cicada", "the-anthem"
  ];
  const masterArchetype = archetypes[xorChain % archetypes.length];

  // Step 9: Fibonacci position
  const fibPosition = Math.floor(Math.log(totalEnergy) / Math.log(phi));

  return {
    masterHex,
    masterFrequency: Math.round(masterFrequency * 100) / 100,
    masterArchetype,
    totalEnergy: Math.round(totalEnergy * 100) / 100,
    fibonacciPosition: fibPosition,
    inputCount: allNumbers.length,
    algorithm: { xorChain: h1, fibModulation: fibMod.toString(16).toUpperCase(), piCompression: piComp.toString(16).toUpperCase(), primeSieve: primeSieve.toString(16).toUpperCase() },
  };
}

const SYSTEM_CONSTANTS = {
  days: 281,
  prompts: 4418,
  apps: 295,
  pulses: 16,
  nailCategories: 16,
  archetypes: 8,
  books: 16,
  pages: 304,
  convergencePoints: 7,
  undiscoveredMines: 7,
  lessons: 5,
  stages: 4,
  totalCost: 292,
  trades: 4846,
  shifts: 1332,
  baseFrequency: 432,
  bpm: 286,
  anthemVerses: 4,
  dialogueLines: 7,
  missingPieces: 5,
  collections: 2,
  totalPlanned: 289,
  genesisHour: 437,
  confessionHour: 638,
  sonicSlayerMinute: 438,
  weepHour: 638,
  primalHour: 824,
  iterationCount: 89,
  anthemHour: 1911,
  ramadanHour: 2327,
  genesisWatchHour: 347,
  cicadaYears: 16,
  frequencyLow: 396,
  frequencyHigh: 528,
  lfoRate: 4.77,
  fifthRatio: 1.5,
  subOctaveRatio: 0.5,
  piApprox: 3.14159265,
  phi: 1.6180339887,
  fibonacci16: 987,
  prime16: 53,
};

const DEFAULT_LIVE_DATA = {
  totalSessions: 0,
  totalEvents: 0,
  totalFrequencies: 0,
  totalNailReadings: 0,
  totalUsers: 0,
  avgBaseFrequency: 432,
  avgConfidence: 0.5,
  totalInteractionTime: 0,
};

describe("Meta-Hex Algorithm", () => {
  it("produces a 16-character hex string", () => {
    const result = computeMetaHex(SYSTEM_CONSTANTS, DEFAULT_LIVE_DATA);
    expect(result.masterHex).toHaveLength(16);
    expect(result.masterHex).toMatch(/^[0-9A-F]{16}$/);
  });

  it("is deterministic — same inputs produce same output", () => {
    const result1 = computeMetaHex(SYSTEM_CONSTANTS, DEFAULT_LIVE_DATA);
    const result2 = computeMetaHex(SYSTEM_CONSTANTS, DEFAULT_LIVE_DATA);
    expect(result1.masterHex).toBe(result2.masterHex);
    expect(result1.masterFrequency).toBe(result2.masterFrequency);
    expect(result1.totalEnergy).toBe(result2.totalEnergy);
    expect(result1.masterArchetype).toBe(result2.masterArchetype);
  });

  it("includes all system constants in the input count", () => {
    const result = computeMetaHex(SYSTEM_CONSTANTS, DEFAULT_LIVE_DATA);
    const expectedCount = Object.keys(SYSTEM_CONSTANTS).length + Object.keys(DEFAULT_LIVE_DATA).length;
    expect(result.inputCount).toBe(expectedCount);
  });

  it("master frequency falls within the 396-528 Hz range", () => {
    const result = computeMetaHex(SYSTEM_CONSTANTS, DEFAULT_LIVE_DATA);
    expect(result.masterFrequency).toBeGreaterThanOrEqual(396);
    expect(result.masterFrequency).toBeLessThan(528);
  });

  it("master archetype is one of the 8 archetypes", () => {
    const result = computeMetaHex(SYSTEM_CONSTANTS, DEFAULT_LIVE_DATA);
    const validArchetypes = [
      "the-hum", "the-breach", "the-extraction", "the-confession",
      "the-sovereign", "the-genesis", "the-cicada", "the-anthem"
    ];
    expect(validArchetypes).toContain(result.masterArchetype);
  });

  it("total energy is positive and reflects the sum of all inputs", () => {
    const result = computeMetaHex(SYSTEM_CONSTANTS, DEFAULT_LIVE_DATA);
    expect(result.totalEnergy).toBeGreaterThan(0);
    // Manual sum check
    const manualSum = [...Object.values(SYSTEM_CONSTANTS), ...Object.values(DEFAULT_LIVE_DATA)]
      .reduce((s, n) => s + n, 0);
    expect(result.totalEnergy).toBe(Math.round(manualSum * 100) / 100);
  });

  it("fibonacci position is a positive integer", () => {
    const result = computeMetaHex(SYSTEM_CONSTANTS, DEFAULT_LIVE_DATA);
    expect(result.fibonacciPosition).toBeGreaterThan(0);
    expect(Number.isInteger(result.fibonacciPosition)).toBe(true);
  });

  it("changes when live data changes — the forest grows", () => {
    const result1 = computeMetaHex(SYSTEM_CONSTANTS, DEFAULT_LIVE_DATA);
    const grownData = {
      ...DEFAULT_LIVE_DATA,
      totalSessions: 100,
      totalEvents: 5000,
      totalFrequencies: 50,
      totalNailReadings: 25,
      totalUsers: 30,
    };
    const result2 = computeMetaHex(SYSTEM_CONSTANTS, grownData);
    expect(result2.masterHex).not.toBe(result1.masterHex);
    expect(result2.totalEnergy).toBeGreaterThan(result1.totalEnergy);
  });

  it("algorithm object contains all four layers", () => {
    const result = computeMetaHex(SYSTEM_CONSTANTS, DEFAULT_LIVE_DATA);
    expect(result.algorithm).toHaveProperty("xorChain");
    expect(result.algorithm).toHaveProperty("fibModulation");
    expect(result.algorithm).toHaveProperty("piCompression");
    expect(result.algorithm).toHaveProperty("primeSieve");
  });

  it("all algorithm layer values are valid hex strings", () => {
    const result = computeMetaHex(SYSTEM_CONSTANTS, DEFAULT_LIVE_DATA);
    for (const val of Object.values(result.algorithm)) {
      expect(val).toMatch(/^[0-9A-F]+$/);
    }
  });

  it("system constants count matches the architecture (41 constants)", () => {
    expect(Object.keys(SYSTEM_CONSTANTS).length).toBe(41);
  });

  it("live data count matches the database aggregates (8 fields)", () => {
    expect(Object.keys(DEFAULT_LIVE_DATA).length).toBe(8);
  });
});
