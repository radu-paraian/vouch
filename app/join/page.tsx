"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { COMMUNITIES, SKILLS } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";

function cleanGithub(raw: string) {
  return raw
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/^@/, "")
    .replace(/\/.*$/, "");
}

function Chip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors active:scale-[0.97] ${
        selected
          ? "border-gold bg-gold text-ink"
          : "border-line bg-transparent text-paper"
      }`}
    >
      {label}
    </button>
  );
}

export default function JoinPage() {
  const [name, setName] = useState("");
  const [github, setGithub] = useState("");
  const [social, setSocial] = useState("");
  const [communities, setCommunities] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState("");
  const [events, setEvents] = useState(0);
  const [speaker, setSpeaker] = useState(false);
  const [talkTopic, setTalkTopic] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const canSubmit = useMemo(
    () => name.trim().length > 1 && consent && !busy,
    [name, consent, busy]
  );

  function toggle(list: string[], value: string, set: (next: string[]) => void) {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    try {
      const supabase = getSupabase();
      const { error: insertError } = await supabase.from("members").insert({
        name: name.trim(),
        github: cleanGithub(github) || null,
        x_or_linkedin: social.trim() || null,
        communities,
        skills,
        looking_for: lookingFor.trim() || null,
        events_last_3_months: events,
        speaker,
        talk_topic: speaker ? talkTopic.trim() || null : null,
        consent: true,
      });
      if (insertError) throw insertError;
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.28em] text-gold">You're in</p>
          <h1 className="mt-5 font-serif text-5xl text-paper">Watch the demo at 22:20</h1>
          <p className="mt-4 text-mute">Opt-in only. Public info. Delete anytime.</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 pb-16 pt-10">
      <p className="text-xs uppercase tracking-[0.28em] text-gold">Join Vouch</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-paper">
        30 seconds. London builders, one memory.
      </h1>
      <p className="mt-2 text-sm text-mute">
        Opt-in only. Public info. Delete anytime.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-mute">Name</span>
          <input
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full border-b border-line bg-transparent py-2 text-lg outline-none placeholder:text-mute/50"
            placeholder="Your name"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-widest text-mute">GitHub username</span>
          <input
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            className="mt-2 w-full border-b border-line bg-transparent py-2 text-lg outline-none placeholder:text-mute/50"
            placeholder="username"
            autoCapitalize="none"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-widest text-mute">X or LinkedIn</span>
          <input
            value={social}
            onChange={(e) => setSocial(e.target.value)}
            className="mt-2 w-full border-b border-line bg-transparent py-2 text-lg outline-none placeholder:text-mute/50"
            placeholder="optional"
            autoCapitalize="none"
          />
        </label>

        <fieldset>
          <legend className="text-xs uppercase tracking-widest text-mute">Communities</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {COMMUNITIES.map((c) => (
              <Chip
                key={c}
                label={c}
                selected={communities.includes(c)}
                onToggle={() => toggle(communities, c, setCommunities)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-xs uppercase tracking-widest text-mute">Skills</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <Chip
                key={s}
                label={s}
                selected={skills.includes(s)}
                onToggle={() => toggle(skills, s, setSkills)}
              />
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-xs uppercase tracking-widest text-mute">What are you looking for</span>
          <input
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            className="mt-2 w-full border-b border-line bg-transparent py-2 text-lg outline-none placeholder:text-mute/50"
            placeholder="a designer, a cofounder, a speaker slot…"
          />
        </label>

        <div>
          <span className="text-xs uppercase tracking-widest text-mute">
            Events in the last 3 months
          </span>
          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setEvents((n) => Math.max(0, n - 1))}
              className="h-11 w-11 rounded-full border border-line text-xl active:scale-[0.97]"
            >
              −
            </button>
            <span className="w-8 text-center font-serif text-3xl">{events}</span>
            <button
              type="button"
              onClick={() => setEvents((n) => Math.min(10, n + 1))}
              className="h-11 w-11 rounded-full border border-line text-xl active:scale-[0.97]"
            >
              +
            </button>
          </div>
        </div>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={speaker}
            onChange={(e) => setSpeaker(e.target.checked)}
            className="mt-1 h-4 w-4 accent-gold"
          />
          <span>Happy to give a talk</span>
        </label>

        {speaker && (
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-mute">Talk topic</span>
            <input
              value={talkTopic}
              onChange={(e) => setTalkTopic(e.target.value)}
              className="mt-2 w-full border-b border-line bg-transparent py-2 text-lg outline-none placeholder:text-mute/50"
              placeholder="AI agents, shipping in public…"
            />
          </label>
        )}

        <label className="flex items-start gap-3 text-sm leading-relaxed text-mute">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-gold"
          />
          <span>
            Add me to Vouch, a shared builder memory across London communities. Only public
            info. Delete anytime.
          </span>
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-full bg-paper py-4 text-sm font-medium text-ink transition-transform enabled:active:scale-[0.98] disabled:opacity-40"
        >
          {busy ? "Joining…" : "Join Vouch"}
        </button>
      </form>
    </main>
  );
}
