"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "./client";
import { InviteCard } from "./cards";
import { demoInvites } from "./demoData";
import { ChevronIcon } from "./icons";
import { COMMUNITIES, type Invite } from "./types";
import { EmptyState, SkeletonGrid, listVariants } from "./ui";

export function InvitesPanel({ demo, refreshKey }: { demo: boolean; refreshKey: number }) {
  const [community, setCommunity] = useState<string>("");
  const [rows, setRows] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!community) { setRows([]); return; }
    if (demo) { setRows(demoInvites(community)); return; }
    if (!supabase) { setRows(demoInvites(community)); return; }
    let cancelled = false;
    setLoading(true);
    supabase.rpc("builder_invites", { target: community }).then(({ data, error }) => {
      if (cancelled) return;
      const live = (data as Invite[] | null) ?? [];
      // Fallback to sample rows if the live query errors or returns nothing.
      setRows(error || live.length === 0 ? demoInvites(community) : live);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [community, demo, refreshKey]);

  return (
    <section className="flex flex-col gap-[15px]">
      <div className="flex items-center gap-[14px]">
        <p className="v-display text-[32px] leading-[1]">Invite to</p>
        <div className="relative">
          <select className="v-select min-w-[260px]" value={community} onChange={(e) => setCommunity(e.target.value)} aria-label="Community">
            <option value="">Choose a community</option>
            {COMMUNITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="pointer-events-none absolute right-[16px] top-1/2 -translate-y-1/2"><ChevronIcon /></span>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {!community ? null : loading ? (
          <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SkeletonGrid n={3} /></motion.div>
        ) : rows.length === 0 ? (
          <motion.div key={`e-${community}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState text={`No one to invite to ${community} yet.`} />
          </motion.div>
        ) : (
          <motion.div key={`g-${community}`} variants={listVariants} initial="hidden" animate="show" exit={{ opacity: 0 }}
            className="grid gap-[15px] grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((v) => <InviteCard key={v.id} v={v} community={community} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
