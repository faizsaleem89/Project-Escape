/**
 * AppShell — The global wrapper that provides:
 * 1. Behaviour tracking across ALL pages (Adriana's eyes)
 * 2. The ◈ Adriana Reading trigger button
 * 3. The ◉ Nail Reading trigger button (The Original Protocol)
 * 4. Auto-tracking for clicks and scrolls
 * 
 * The nail records everything. This is the nail.
 */
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useBehaviourTracker, useAutoTracker } from "@/hooks/useBehaviourTracker";
import AdrianaReading from "@/components/AdrianaReading";
import NailCapture from "@/components/NailCapture";

type TrackerContextType = ReturnType<typeof useBehaviourTracker>;

const TrackerContext = createContext<TrackerContextType | null>(null);

export function useTracker(): TrackerContextType {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error("useTracker must be used within AppShell");
  return ctx;
}

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const tracker = useBehaviourTracker();
  useAutoTracker(tracker);
  const [showReading, setShowReading] = useState(false);
  const [showNailCapture, setShowNailCapture] = useState(false);
  const [location] = useLocation();

  // Track page changes
  useEffect(() => {
    const pageName = location === "/" ? "home"
      : location.replace(/^\//, "").replace(/\/$/, "") || "home";
    tracker.setPage(pageName);
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TrackerContext.Provider value={tracker}>
      {children}

      {/* FLOATING ACTION BUTTONS */}
      {!showReading && !showNailCapture && (
        <div
          style={{
            position: "fixed",
            bottom: "4.5rem",
            right: "1rem",
            zIndex: 40,
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          {/* NAIL READING TRIGGER — ◉ */}
          <button
            onClick={() => setShowNailCapture(true)}
            data-track="nail-reading-trigger"
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.03)",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 12px rgba(255,255,255,0.08)",
            }}
            title="Nail Reading — The Original Protocol"
          >
            ◉
          </button>

          {/* ADRIANA READING TRIGGER — ◈ */}
          <button
            onClick={async () => {
              await tracker.flush();
              setShowReading(true);
            }}
            data-track="adriana-reading-trigger"
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              border: "1px solid rgba(0,255,65,0.3)",
              background: "rgba(0,255,65,0.05)",
              color: "#00ff41",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 12px rgba(0,255,65,0.15)",
            }}
            title="Adriana Reading — Behaviour Diagnosis"
          >
            ◈
          </button>
        </div>
      )}

      {/* ADRIANA READING OVERLAY */}
      {showReading && (
        <AdrianaReading
          sessionId={tracker.sessionId}
          onClose={() => setShowReading(false)}
        />
      )}

      {/* NAIL CAPTURE OVERLAY */}
      {showNailCapture && (
        <NailCapture
          sessionId={tracker.sessionId}
          onClose={() => setShowNailCapture(false)}
          onComplete={(result) => {
            console.log("[NailCapture] Reading complete:", result.archetype);
          }}
        />
      )}
    </TrackerContext.Provider>
  );
}
