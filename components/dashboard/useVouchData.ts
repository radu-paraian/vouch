"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./client";
import { demoCount, demoGems, demoIntros, demoSpeakers } from "./demoData";
import type { HiddenGem, Intro, Speaker } from "./types";

export type VouchData = {
  count: number | null;
  gems: HiddenGem[];
  intros: Intro[];
  speakers: Speaker[];
  loading: boolean;
  error: string | null;
  live: boolean;
  /** True when sample data is shown (?demo=1, no Supabase, query error, or zero rows). */
  fallback: boolean;
  lastEventAt: number | null;
};

const SAMPLE = { count: demoCount, gems: demoGems, intros: demoIntros, speakers: demoSpeakers };

export function useVouchData(demo: boolean): VouchData & { refetch: () => void } {
  const useSample = demo || !supabase;
  const [state, setState] = useState<VouchData>({
    ...(useSample ? SAMPLE : { count: null, gems: [], intros: [], speakers: [] }),
    loading: !useSample,
    error: null,
    live: false,
    fallback: useSample,
    lastEventAt: null,
  });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingIds = useRef<Set<string>>(new Set());

  const fetchAll = useCallback(async () => {
    if (demo || !supabase) return;
    try {
      const [c, g, i, s] = await Promise.all([
        supabase.from("builders").select("id", { count: "exact", head: true }),
        supabase.from("builder_gems").select("*"),
        supabase.from("builder_intros").select("*"),
        supabase.from("builder_speakers").select("*"),
      ]);
      const err = c.error || g.error || i.error || s.error;
      const gems = (g.data as HiddenGem[] | null) ?? [];
      const intros = (i.data as Intro[] | null) ?? [];
      const speakers = (s.data as Speaker[] | null) ?? [];
      const empty = !c.count || (gems.length + intros.length + speakers.length === 0);
      if (err || empty) {
        setState((p) => ({ ...p, ...SAMPLE, loading: false, fallback: true, error: err ? err.message : null }));
        return;
      }
      setState((p) => ({ ...p, count: c.count ?? 0, gems, intros, speakers, loading: false, fallback: false, error: null }));
    } catch (e) {
      setState((p) => ({ ...p, ...SAMPLE, loading: false, fallback: true, error: e instanceof Error ? e.message : "fetch failed" }));
    }
  }, [demo]);

  useEffect(() => {
    if (demo || !supabase) return;
    fetchAll();
    const client = supabase;
    const queueSync = (id: string) => {
      pendingIds.current.add(id);
      if (syncTimer.current) clearTimeout(syncTimer.current);
      syncTimer.current = setTimeout(() => {
        const ids = Array.from(pendingIds.current);
        pendingIds.current.clear();
        fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        }).catch(() => {});
      }, 3000);
    };
    const channel = client
      .channel("vouch-builders")
      .on("postgres_changes", { event: "*", schema: "public", table: "builders" }, (payload) => {
        const id = (payload.new as { id?: string } | undefined)?.id;
        if (id) queueSync(id);
        setState((p) => ({ ...p, lastEventAt: Date.now() }));
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(fetchAll, 600);
      })
      .subscribe((status) => setState((p) => ({ ...p, live: status === "SUBSCRIBED" })));
    // Safety net in case realtime drops on venue wifi.
    const poll = setInterval(fetchAll, 30000);
    return () => {
      clearInterval(poll);
      if (timer.current) clearTimeout(timer.current);
      if (syncTimer.current) clearTimeout(syncTimer.current);
      client.removeChannel(channel);
    };
  }, [demo, fetchAll]);

  return { ...state, refetch: fetchAll };
}
