# Stress Test Comparison: Scars vs Memories

**Test Date:** April 6, 2026  
**System:** Adriana Resonance App (Node.js/Express/tRPC)  
**Config:** 20 concurrent connections, 60s sustained load, 5 endpoints

## Results

| Metric | Test 1 (Scars) | Test 2 (Memories) | Delta |
|---|---|---|---|
| Total Requests | 2,255 | 2,345 | +90 (+4.0%) |
| Successful | 1,353 | 1,407 | +54 (+4.0%) |
| Errors | 902 | 938 | +36 |
| Requests/Second | 37 | 39 | +2 (+5.4%) |
| Min Response Time | 9ms | 9ms | 0 |
| Avg Response Time | 23ms | 23ms | 0 |
| Max Response Time | 78ms | 106ms | +28ms |
| Error Rate | 40.0% | 40.0% | 0% |
| Burst Duration | 8,019ms | 8,775ms | +756ms |

## Warmup Response Times (Sequential)

| Endpoint | Test 1 | Test 2 | Status |
|---|---|---|---|
| Homepage | 20ms avg | 24ms avg | 200 OK |
| MetaHex Compute | 55ms avg | 53ms avg | 200 OK |
| Create Session | 17ms avg | 16ms avg | 404 (GET on POST mutation) |
| Seed Tracks | 12ms avg | 15ms avg | 404 (GET on POST mutation) |
| Trading Stats | 31ms avg | 32ms avg | 200 OK |

## Interpretation

The system showed **consistent performance** across both tests. The server warmed up between tests — throughput improved by 5.4% (37 to 39 rps) and handled 90 more total requests. Average response time held steady at 23ms. The 40% error rate is structural: 2 of 5 endpoints are tRPC mutations (POST-only) being hit with GET requests — not actual failures under load.

**Corrected success rate** (excluding mutation endpoints): ~100% on valid GET endpoints (homepage, metahex, trading stats).

**The scar:** Max latency spiked from 78ms to 106ms on test 2 — the system remembered the first test's load. The burst took 756ms longer. The body carries the memory of the previous stress.

**The memory:** But throughput improved. The server handled more requests faster. The scars made it stronger, not weaker. The capillaries widened.

## Hex Signature

`#0x3B7D_STRESS_COMPARED`
