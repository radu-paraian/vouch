"use client";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowCircleIcon, CheckIcon, CopyIcon } from "./icons";

export function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString("en-GB"));
  useEffect(() => {
    const c = animate(mv, value, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
    return c.stop;
  }, [mv, value]);
  return <motion.span>{rounded}</motion.span>;
}

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <span className="v-avatar" style={{ width: size, height: size, fontSize: size * 0.36 }}>{initials(name)}</span>
  );
}

export const cleanHandle = (h: string) => h.replace(/^@/, "").replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");

/** The single plain-English reason, clamped to 2 lines. */
export function Reason({ text }: { text?: string | null }) {
  return (
    <p className="text-[16px] leading-[1.35] v-clamp-2" style={{ color: "var(--v-ink-90)" }} title={text ?? undefined}>
      {text || "Still being researched."}
    </p>
  );
}

const SOURCE_LABEL: Record<string, string> = { github: "GitHub", devpost: "Devpost", hn: "HN", luma: "Luma" };
export const sourceLabel = (source?: string | null) => SOURCE_LABEL[(source ?? "").toLowerCase()] ?? "Profile";

/** Link to where we found the person, labelled by source. */
export function SourceLink({ source, url, github }: { source?: string | null; url?: string | null; github?: string | null }) {
  const href = url || (github ? `https://github.com/${cleanHandle(github)}` : null);
  if (!href) return null;
  return (
    <a className="v-btn-secondary" href={href} target="_blank" rel="noreferrer">
      {sourceLabel(source)} <ArrowCircleIcon size={12} />
    </a>
  );
}

/** Primary button that copies a ready message and briefly shows "Copied". */
export function CopyButton({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } finally { ta.remove(); }
    }
    setCopied(true);
  };
  return (
    <button type="button" className="v-btn-primary" onClick={onClick} title={text} aria-live="polite">
      <span>{copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}{copied ? "Copied" : label}</span>
    </button>
  );
}

/** Up to `max` small muted community tags. */
export function Tags({ items, max = 2 }: { items?: (string | null | undefined)[] | null; max?: number }) {
  const list = Array.from(new Set((items ?? []).filter((x): x is string => !!x && x.trim() !== ""))).slice(0, max);
  if (list.length === 0) return null;
  return (
    <p className="v-tags" title={list.join(" · ")}>
      {list.map((t, i) => (
        <span key={t} className="v-tag">{i > 0 && <span className="v-tag-sep">·</span>}{t}</span>
      ))}
    </p>
  );
}

export function SkeletonGrid({ n = 3 }: { n?: number }) {
  return (
    <div className="grid gap-[15px] grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="v-card p-[25px] flex flex-col gap-[14px]">
          <div className="flex items-center gap-[10px]">
            <div className="v-skel" style={{ width: 40, height: 40, borderRadius: 100 }} />
            <div className="flex flex-col gap-[6px] flex-1">
              <div className="v-skel h-[16px] w-[55%]" />
              <div className="v-skel h-[10px] w-[30%]" />
            </div>
          </div>
          <div className="v-skel h-[14px] w-[85%]" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="v-card flex items-center justify-center text-center px-[52px] py-[56px]">
      <p className="v-display text-[32px] leading-[1.1] v-muted">{text}</p>
    </motion.div>
  );
}

export const listVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
export const itemVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 26 } },
};
