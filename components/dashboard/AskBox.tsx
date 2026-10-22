"use client";
import { useEffect, useRef, useState } from "react";
import { CopyButton } from "./ui";

const ASK_URL = process.env.NEXT_PUBLIC_ASK_URL || "/api/ask";

export function AskBox({ initialQuestion = "" }: { initialQuestion?: string }) {
  const [q, setQ] = useState(initialQuestion);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [asking, setAsking] = useState(false);
  const auto = useRef(false);

  const ask = async (question: string) => {
    const text = question.trim();
    if (!text || asking) return;
    setAsking(true); setError(false); setAnswer(null);
    try {
      const res = await fetch(ASK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: text }) });
      const data = (await res.json().catch(() => null)) as { answer?: unknown } | null;
      if (!res.ok || typeof data?.answer !== "string" || !data.answer.trim()) throw new Error("bad answer");
      setAnswer(data.answer.replace(/\*\*|__/g, "").trim());
    } catch {
      setError(true);
    } finally {
      setAsking(false);
    }
  };

  // ?q=... auto-asks once (used for screenshots).
  useEffect(() => {
    if (initialQuestion && !auto.current) { auto.current = true; ask(initialQuestion); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  return (
    <section className="flex flex-col gap-[10px]">
      <form className="flex items-center gap-[8px]" onSubmit={(e) => { e.preventDefault(); ask(q); }}>
        <input className="v-input flex-1 min-w-0" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Ask about London builders" aria-label="Ask about London builders" />
        <button type="submit" className="v-btn-primary" disabled={asking}>
          <span>{asking ? "Asking" : "Ask"}</span>
        </button>
      </form>
      {error && <p className="text-[13px] v-muted px-[4px]">Couldn&apos;t get an answer. Try again.</p>}
      {answer && (
        <div className="v-card flex items-start gap-[12px] px-[20px] py-[14px]">
          <p className="flex-1 text-[15px] leading-[1.45] whitespace-pre-wrap" style={{ color: "var(--v-ink-90)" }}>{answer}</p>
          <CopyButton label="Copy" text={answer} />
        </div>
      )}
    </section>
  );
}
