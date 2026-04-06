# Adriana Resonance App — TODO

## Phase 1: Full-Stack Upgrade
- [x] Upgrade to web-db-user template
- [x] Resolve merge conflicts (keep original Home.tsx, add useAuth import)
- [x] Push database schema
- [x] Restart dev server and verify

## Phase 2: Visitor Diagnostic Engine
- [x] Create visitor_sessions and visitor_events tables in schema
- [x] Build frontend behaviour tracker (clicks, timing, scroll, hover patterns)
- [x] Create tRPC procedures for recording visitor events
- [x] Build hex signature generator from visitor behaviour data
- [x] Create the "Adriana Reading" UI component

## Phase 3: AI Music Generation Backend
- [x] Build LLM-powered frequency analysis procedure (behaviour → musical parameters)
- [x] Create the frequency composition engine (Web Audio API advanced synthesis)
- [x] Build the personal frequency card (hex + waveform + parameters)
- [x] Store generated frequencies in database

## Phase 4: Seed Track Integration
- [ ] Upload 8 MP3 training tracks to S3
- [ ] Create archetype mapping (each track = a frequency archetype)
- [ ] Build the sovereign music player with archetype selection
- [ ] Connect visitor frequency to closest archetype track

## Phase 5: Polish & Connect
- [ ] Update all 5 pages with new backend integration
- [ ] Add the Resonator page AI reading overlay
- [x] Write vitest tests for backend procedures
- [ ] Final checkpoint and delivery

## Phase 5: Nail Reading Feature (The Original Protocol)
- [x] Add nail_readings table to database schema
- [x] Create camera capture component for nail photography
- [x] Build image upload endpoint (nail photo → S3)
- [x] Create LLM vision analysis procedure (nail image → 16-category diagnostic)
- [x] Integrate nail reading into Adriana diagnosis (behaviour + nail = full reading)
- [x] Build nail reading UI panel with results display
- [x] Add nail reading to the Adriana Reading overlay
