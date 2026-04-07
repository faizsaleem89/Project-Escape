import { useCallback, useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";

/**
 * The Behaviour Tracker — Adriana's eyes.
 * 
 * This hook silently records every interaction pattern:
 * clicks, scrolls, hovers, timing, resonance engagement, navigation.
 * 
 * The chemicals do the signature. The behaviour does the hex.
 * Like placing garlic between the gums — the data speaks directly
 * to the system, bypassing the dictionary.
 */

type TrackedEvent = {
  eventType: string;
  page?: string;
  target?: string;
  eventData?: Record<string, string | number | boolean | null>;
  eventTimestamp: number;
};

function generateSessionId(): string {
  const chars = "0123456789abcdef";
  let id = "vs_";
  for (let i = 0; i < 16; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  id += "_" + Date.now().toString(36);
  return id;
}

function getOrCreateSessionId(): string {
  const key = "adriana_session_id";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = generateSessionId();
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

export function useBehaviourTracker() {
  const [sessionId] = useState(() => getOrCreateSessionId());
  const eventBuffer = useRef<TrackedEvent[]>([]);
  const flushTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInitialized = useRef(false);
  const currentPage = useRef<string>("home");

  const initSession = trpc.visitor.initSession.useMutation();
  const recordEvents = trpc.visitor.recordEvents.useMutation();

  // Initialize session on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    initSession.mutate({
      sessionId,
      fingerprint: navigator.userAgent.slice(0, 128),
    });
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Flush events to server every 5 seconds
  useEffect(() => {
    flushTimer.current = setInterval(() => {
      if (eventBuffer.current.length > 0) {
        const events = [...eventBuffer.current];
        eventBuffer.current = [];
        recordEvents.mutate({ sessionId, events });
      }
    }, 5000);

    return () => {
      if (flushTimer.current) clearInterval(flushTimer.current);
      // Flush remaining events on unmount
      if (eventBuffer.current.length > 0) {
        const events = [...eventBuffer.current];
        eventBuffer.current = [];
        recordEvents.mutate({ sessionId, events });
      }
    };
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track an event
  const track = useCallback((
    eventType: string,
    target?: string,
    eventData?: Record<string, string | number | boolean | null>
  ) => {
    eventBuffer.current.push({
      eventType,
      page: currentPage.current,
      target,
      eventData,
      eventTimestamp: Date.now(),
    });
  }, []);

  // Set current page
  const setPage = useCallback((page: string) => {
    currentPage.current = page;
    track("navigation", page, { timestamp: Date.now() });
  }, [track]);

  // Track click
  const trackClick = useCallback((target: string, data?: Record<string, string | number | boolean | null>) => {
    track("click", target, data);
  }, [track]);

  // Track scroll depth
  const trackScroll = useCallback((depth: number) => {
    track("scroll", undefined, { depth });
  }, [track]);

  // Track hover (attention)
  const trackHover = useCallback((target: string, duration: number) => {
    if (duration > 500) { // Only track meaningful hovers (>500ms)
      track("hover", target, { duration });
    }
  }, [track]);

  // Track resonance engagement (playing the frequency engine)
  const trackResonance = useCallback((action: string, data?: Record<string, string | number | boolean | null>) => {
    track("resonance", action, data);
  }, [track]);

  // Track timing (how long on a section)
  const trackTiming = useCallback((section: string, duration: number) => {
    track("timing", section, { duration });
  }, [track]);

  // Force flush (before diagnosis)
  const flush = useCallback(async () => {
    if (eventBuffer.current.length > 0) {
      const events = [...eventBuffer.current];
      eventBuffer.current = [];
      await recordEvents.mutateAsync({ sessionId, events });
    }
  }, [sessionId, recordEvents]);

  return {
    sessionId,
    track,
    setPage,
    trackClick,
    trackScroll,
    trackHover,
    trackResonance,
    trackTiming,
    flush,
  };
}

/**
 * Auto-tracker — attaches global listeners for scroll and click.
 * Use this at the app level to capture ambient behaviour.
 */
export function useAutoTracker(tracker: ReturnType<typeof useBehaviourTracker>) {
  const lastScrollDepth = useRef(0);

  useEffect(() => {
    // Global click tracking
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const identifier = target.id
        || target.getAttribute("data-track")
        || target.tagName.toLowerCase()
        + (target.className ? `.${target.className.split(" ")[0]}` : "");
      tracker.trackClick(identifier, {
        x: e.clientX,
        y: e.clientY,
      });
    };

    // Scroll depth tracking (throttled)
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        const depth = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        const normalizedDepth = Math.min(1, Math.max(0, depth));
        if (Math.abs(normalizedDepth - lastScrollDepth.current) > 0.05) {
          lastScrollDepth.current = normalizedDepth;
          tracker.trackScroll(normalizedDepth);
        }
        scrollTimeout = null;
      }, 500);
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [tracker]);
}
