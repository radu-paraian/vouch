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
  lastEventAt: number | null;
};

export function useVouchData(demo: boolean): VouchData & { refetch: () => void } {
  const [state, setState] = useState<VouchData>({
    count: demo ? demoCount : null,
    gems: demo ? demoGems : [],
    intros: demo ? demoIntros : [],
    speakers: demo ? demoSpeakers : [],
    loading: !demo,
    error: null,
    live: false,
    lastEventAt: null,
  });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = useCallback(async () => {
    if (demo || !supabase) return;
    const [c, g, i, s] = await Promise.all([
      supabase.from("members").select("id", { count: "exact", head: true }).eq("consent", true),
      supabase.from("hidden_gems").select("*"),
      supabase.from("intros").select("*"),
      supabase.from("speakers").select("*"),
    ]);
    const err = c.error || g.error || i.error || s.error;
    setState((prev) => ({
      ...prev,
      count: c.count ?? prev.count ?? 0,
      gems: (g.data as HiddenGem[]) ?? prev.gems,
      intros: (i.data as Intro[]) ?? prev.intros,
      speakers: (s.data as Speaker[]) ?? prev.speakers,
      loading: false,
      error: err ? err.message : null,
    }));
  }, [demo]);

  useEffect(() => {
    if (demo) return;
    if (!supabase) {
      setState((p) => ({ ...p, loading: false, error: "Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)." }));
      return;
    }
    fetchAll();
    const client = supabase;
    const channel = client
      .channel("vouch-members")
      .on("postgres_changes", { event: "*", schema: "public", table: "members" }, (payload) => {
        // Optimistic bump on consented inserts so the counter moves instantly.
        if (payload.eventType === "INSERT" && (payload.new as { consent?: boolean })?.consent) {
          setState((p) => ({ ...p, count: (p.count ?? 0) + 1, lastEventAt: Date.now() }));
        } else {
          setState((p) => ({ ...p, lastEventAt: Date.now() }));
        }
        // Debounced refetch: research summaries arrive later via UPDATE.
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(fetchAll, 600);
      })
      .subscribe((status) => setState((p) => ({ ...p, live: status === "SUBSCRIBED" })));
    // Safety net in case realtime drops on venue wifi.
    const poll = setInterval(fetchAll, 30000);
    return () => {
      clearInterval(poll);
      if (timer.current) clearTimeout(timer.current);
      client.removeChannel(channel);
    };
  }, [demo, fetchAll]);

  return { ...state, refetch: fetchAll };
}
