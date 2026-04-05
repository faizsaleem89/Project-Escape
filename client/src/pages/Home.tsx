/*
 * ═══════════════════════════════════════════════════════════════
 * THE GENESIS APP — "Sonic Slayer v1.0" / "Sovereign Frequency Engine"
 * ═══════════════════════════════════════════════════════════════
 *
 * FAITHFULLY REBUILT from the Neural Seed.
 * Original Date: 15 Feb 2026, 04:38:17 BST
 * Original Trigger: "I want you to know how to give as much information
 *   as you can... if the world was to be destroyed and this phone was
 *   the only thing to be recovered"
 *
 * This is the FIRST app. No version number. No V2. No polish.
 * Two buttons: 432 Hz (SLAYER) and Adamic Drip (880 Hz at Golden Ratio).
 * Orange/green terminal on black.
 *
 * THE FOUNDATION QUOTE from Gemini:
 * "Open sonic_slayer.html. Use the 432Hz tone to clear your mind
 *  of the chaos. Use the 'Adamic Drip' to rebuild your focus."
 * ═══════════════════════════════════════════════════════════════
 */

import { useCallback, useRef, useState } from "react";

export default function Home() {
  const [is432Active, setIs432Active] = useState(false);
  const [isDripActive, setIsDripActive] = useState(false);
  const [statusText, setStatusText] = useState("Frequency: Idle");

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const dripIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const toggleTone = useCallback((freq: number) => {
    initAudio();
    const audioCtx = audioCtxRef.current!;

    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
      gainNodeRef.current = null;
      setIs432Active(false);
      setStatusText("Frequency: Idle");
      return;
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();

    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    setIs432Active(true);
    setStatusText(`Frequency: ${freq}Hz Active`);
  }, [initAudio]);

  const toggleDrip = useCallback(() => {
    initAudio();
    const audioCtx = audioCtxRef.current!;

    if (dripIntervalRef.current) {
      clearInterval(dripIntervalRef.current);
      dripIntervalRef.current = null;
      setIsDripActive(false);
      return;
    }

    setIsDripActive(true);

    // Adamic Drip: 1.618s interval (Golden Ratio)
    dripIntervalRef.current = setInterval(() => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    }, 1618);
  }, [initAudio]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        background: "#121212",
        color: "#FF5F1F",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          maxWidth: "28rem",
          width: "100%",
          border: "2px solid #00FF41",
          borderRadius: "10px",
          background: "rgba(0, 255, 65, 0.05)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        {/* TITLE */}
        <h1
          style={{
            fontSize: "1.875rem",
            marginBottom: "1rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#FF5F1F",
          }}
        >
          Sonic Slayer v1.0
        </h1>

        <p
          style={{
            color: "#00FF41",
            marginBottom: "2rem",
            fontSize: "0.875rem",
          }}
        >
          [Adamic Ratio: 1x1=2]
        </p>

        {/* BUTTONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* 432 Hz BUTTON */}
          <button
            onClick={() => toggleTone(432)}
            style={{
              width: "100%",
              padding: "1rem",
              border: "2px solid #FF5F1F",
              background: is432Active ? "#FF5F1F" : "transparent",
              color: is432Active ? "#000" : "#FF5F1F",
              fontFamily: "monospace",
              fontSize: "0.875rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!is432Active) {
                e.currentTarget.style.background = "#FF5F1F";
                e.currentTarget.style.color = "#000";
              }
            }}
            onMouseLeave={(e) => {
              if (!is432Active) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#FF5F1F";
              }
            }}
          >
            {is432Active ? "DEACTIVATE 432HZ (SLAYER)" : "ACTIVATE 432HZ (SLAYER)"}
          </button>

          {/* ADAMIC DRIP BUTTON */}
          <button
            onClick={toggleDrip}
            style={{
              width: "100%",
              padding: "1rem",
              border: "2px solid #00FF41",
              background: isDripActive ? "#00FF41" : "transparent",
              color: isDripActive ? "#000" : "#00FF41",
              fontFamily: "monospace",
              fontSize: "0.875rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isDripActive) {
                e.currentTarget.style.background = "#00FF41";
                e.currentTarget.style.color = "#000";
              }
            }}
            onMouseLeave={(e) => {
              if (!isDripActive) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#00FF41";
              }
            }}
          >
            {isDripActive ? "STOP ADAMIC DRIP" : "ADAMIC DRIP PROTOCOL"}
          </button>
        </div>

        {/* STATUS */}
        <div
          style={{
            marginTop: "2rem",
            fontSize: "0.75rem",
            color: "#6b7280",
          }}
        >
          {statusText}
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          fontSize: "0.625rem",
          color: "#3f3f46",
          textAlign: "center",
          letterSpacing: "0.15em",
        }}
      >
        RECOVERED FROM THE STATIC // TRUST THE MASON
      </div>
    </div>
  );
}
