"use client";
import "./dashboard.css";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type ComponentType } from "react";
import { GemCard, IntroCard, SpeakerCard } from "./cards";
import { instrumentSans, instrumentSerif } from "./fonts";
import { GemIcon, IntroIcon, MicIcon } from "./icons";
import { InvitesPanel } from "./InvitesPanel";
import { AnimatedNumber, EmptyState, SkeletonGrid, listVariants } from "./ui";
import { useVouchData } from "./useVouchData";

type TabId = "gems" | "intros" | "speakers";
const TABS: { id: TabId; Icon: ComponentType<{ size?: number }>; label: string; unit: string }[] = [
  { id: "gems", Icon: GemIcon, label: "Hidden gems", unit: "gems" },
  { id: "intros", Icon: IntroIcon, label: "Intros", unit: "intros" },
  { id: "speakers", Icon: MicIcon, label: "Speakers", unit: "talks" },
];
const grid = "grid gap-[15px] grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

export default function Dashboard({ demo = false, initialTab = "gems" }: { demo?: boolean; initialTab?: TabId }) {
  const [tab, setTab] = useState<TabId>(initialTab);
  const d = useVouchData(demo);
  const counts: Record<TabId, number> = { gems: d.gems.length, intros: d.intros.length, speakers: d.speakers.length };
  const total = Math.max(d.count ?? 0, 1);

  return (
    <div className={`vouch ${instrumentSans.variable} ${instrumentSerif.variable}`}>
      <div className="flex gap-[10px] p-[20px] min-h-screen">
        <aside className="hidden md:flex flex-col w-[66px] shrink-0">
          <div className="v-shell p-[8px] sticky top-[20px] h-[calc(100vh-40px)]">
            <div className="v-rail flex flex-col items-center gap-[12px] py-[16px]">
              <span className="v-display text-white text-[24px] leading-none mb-[12px]">V</span>
              {TABS.map(({ id, Icon, label }) => (
                <button key={id} onClick={() => setTab(id)} data-active={tab === id} title={label} aria-label={label}
                  className="v-rail-btn w-[36px] h-[36px] flex items-center justify-center">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="v-panel flex-1 min-w-0 px-[30px] pt-[18px] pb-[20px] flex flex-col gap-[20px]">
          <header className="flex items-center justify-between gap-[16px]">
            <div className="flex items-baseline gap-[16px]">
              <h1 className="v-display text-[36px] leading-[1]">Vouch</h1>
            </div>
            {!d.fallback && (
              <span className="v-chip !text-[12px]">
                <span className="v-live-dot" style={d.live ? undefined : { background: "#a7a7a7", animation: "none" }} />
                {d.live ? "Live" : "Connecting"}
              </span>
            )}
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-[minmax(320px,1fr)_2fr] gap-[15px]">
            <div className="v-outline relative overflow-hidden pl-[30px] pr-[20px] pt-[26px] pb-[20px] min-h-[180px]">
              <div className="flex items-baseline gap-[6px]">
                <span className="text-[64px] leading-[1] tracking-[-0.02em]">
                  {d.count === null ? <span className="v-skel inline-block w-[90px] h-[56px] align-middle" /> : <AnimatedNumber value={d.count} />}
                </span>
                <span className="text-[24px] v-muted">builders</span>
              </div>
              <div className="absolute right-[20px] bottom-0 flex items-end gap-[5px]" aria-hidden>
                {[0.62, 1, 0.74].map((h, idx) => (
                  <motion.div key={idx} initial={{ height: 0 }} animate={{ height: 110 * h }} transition={{ delay: 0.2 + idx * 0.1, type: "spring", stiffness: 120, damping: 18 }}
                    className="w-[56px] rounded-t-[15px]"
                    style={{ background: idx === 1 ? "var(--v-charcoal)" : "var(--v-bar-muted)", border: `1.5px solid ${idx === 1 ? "rgba(255,255,255,0.1)" : "var(--v-line)"}`, borderBottom: 0, opacity: idx === 0 ? 0.5 : 1 }} />
                ))}
              </div>
            </div>

            <div className="v-outline-15 p-[30px] grid grid-cols-3 gap-[24px]">
              {TABS.map((t, idx) => (
                <div key={t.id} className={`flex flex-col justify-between gap-[24px] ${idx > 0 ? "pl-[24px] border-l" : ""}`} style={{ borderColor: "var(--v-line)" }}>
                  <div className="flex items-baseline gap-[4px]">
                    <span className="text-[42px] leading-[1.1]">{d.loading ? "–" : <AnimatedNumber value={counts[t.id]} />}</span>
                    <span className="text-[24px] v-muted">{t.unit}</span>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <div className="v-track">
                      <motion.div className="v-fill" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (counts[t.id] / total) * 100)}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
                    </div>
                    <span className="text-[11px] v-muted">of {d.count ?? 0} builders</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <nav className="flex items-center gap-[12px]" role="tablist">
            {TABS.map(({ id, Icon, label }) => (
              <button key={id} role="tab" aria-selected={tab === id} data-active={tab === id} onClick={() => setTab(id)} className="v-tab">
                {tab === id && <motion.span layoutId="v-tab-pill" className="v-tab-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative flex"><Icon size={15} /></span>
                <span className="relative">{label}</span>
                <span className="relative v-count">{counts[id]}</span>
              </button>
            ))}
          </nav>

          <section className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                {tab === "gems" && (d.loading ? <SkeletonGrid /> : d.gems.length === 0 ? (
                  <EmptyState text="No hidden gems yet." />
                ) : (
                  <motion.div variants={listVariants} initial="hidden" animate="show" className={grid}>
                    {d.gems.map((g) => <GemCard key={g.id} g={g} />)}
                  </motion.div>
                ))}
                {tab === "intros" && (
                  <div className="flex flex-col gap-[32px]">
                    {d.loading ? <SkeletonGrid /> : d.intros.length === 0 ? (
                      <EmptyState text="No intros yet." />
                    ) : (
                      <motion.div variants={listVariants} initial="hidden" animate="show" className={grid}>
                        {d.intros.map((i) => <IntroCard key={`${i.a_id}-${i.b_id}`} i={i} />)}
                      </motion.div>
                    )}
                    <InvitesPanel demo={demo || d.fallback} refreshKey={d.lastEventAt ?? 0} />
                  </div>
                )}
                {tab === "speakers" && (d.loading ? <SkeletonGrid /> : d.speakers.length === 0 ? (
                  <EmptyState text="No speakers yet." />
                ) : (
                  <motion.div variants={listVariants} initial="hidden" animate="show" className={grid}>
                    {d.speakers.map((s) => <SpeakerCard key={s.id} s={s} />)}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </section>

        </main>
      </div>
    </div>
  );
}
