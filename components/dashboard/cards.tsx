"use client";
import { motion } from "framer-motion";
import { Avatar, CopyButton, Reason, SourceLink, Tags, cleanHandle, itemVariants } from "./ui";
import type { Builder, Intro, Invite } from "./types";

const UPPER = new Set(["ai", "ml", "llm", "ios", "sql", "cli", "api", "3d", "c#", "c++", "php", "css", "html"]);
const NICE: Record<string, string> = { javascript: "JavaScript", typescript: "TypeScript", postgres: "Postgres", webgpu: "WebGPU" };
export const prettySkill = (s: string) => {
  const k = s.toLowerCase();
  return UPPER.has(k) ? k.toUpperCase() : NICE[k] ?? (s === k ? k.charAt(0).toUpperCase() + k.slice(1) : s);
};
const first = (name: string) => name.trim().split(/\s+/)[0] || name;
const joinAnd = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

export function introMessage(i: Intro) {
  const skills = (i.shared ?? []).slice(0, 2).map(prettySkill);
  const what = skills.length ? `You both build with ${joinAnd(skills)}` : `You are building in the same space`;
  return `${first(i.a_name)}, meet ${first(i.b_name)}. ${what}. You two should talk.`;
}

function talkTopic(s: Builder) {
  const ev = s.speaker_evidence || s.why || "";
  if (/^hosted\s+/i.test(ev)) return ev.replace(/^hosted\s+/i, "");
  const top = (s.skills ?? [])[0] || (s.languages ?? [])[0];
  return top ? prettySkill(top) : "what you have been building";
}
export const speakerMessage = (s: Builder) =>
  `Hi ${first(s.name)}, we're running a London builders night and would love you to give a 10-minute talk on ${talkTopic(s)}. Up for it?`;
export const inviteMessage = (v: Invite, community: string) =>
  `Hi ${first(v.name)}, we're inviting London builders to ${community} and you came up. Want to join us?`;

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.article layout variants={itemVariants} whileHover={{ y: -3 }} className="v-card p-[10px]">
      <div className="flex flex-col gap-[16px] px-[15px] pt-[12px] pb-[8px] h-full">{children}</div>
    </motion.article>
  );
}

function Person({ name, handle }: { name: string; handle?: string | null }) {
  return (
    <div className="flex items-center gap-[10px] min-w-0">
      <Avatar name={name} />
      <div className="flex flex-col gap-[3px] min-w-0">
        <p className="text-[20px] font-medium leading-[1.1] truncate">{name}</p>
        {handle && handle !== name && !handle.startsWith("usr-") && <span className="v-muted text-[12px] truncate">@{cleanHandle(handle)}</span>}
      </div>
    </div>
  );
}

function BigNumber({ n, unit }: { n?: number | null; unit: string }) {
  return (
    <div className="flex flex-col items-end shrink-0">
      <span className="text-[36px] leading-[1]">{n ?? 0}</span>
      <span className="text-[10px] v-muted">{unit}</span>
    </div>
  );
}

function PersonCard({ b, n, unit, line, action }: { b: Builder | Invite; n?: number | null; unit: string; line?: string | null; action?: React.ReactNode }) {
  return (
    <CardShell>
      <div className="flex items-start justify-between gap-[10px]">
        <Person name={b.name} handle={b.handle} />
        <BigNumber n={n} unit={unit} />
      </div>
      <div className="flex-1 flex flex-col gap-[8px]">
        <Reason text={line} />
        <Tags items={b.communities} />
      </div>
      <div className="flex justify-end items-center gap-[8px]">
        <SourceLink source={b.source} url={b.source_url} github={b.github} />
        {action}
      </div>
    </CardShell>
  );
}

const summaryLine = (b: Builder) => b.why || b.summary;

export const GemCard = ({ g }: { g: Builder }) => (
  <PersonCard b={g} n={g.shipped_count} unit="shipped" line={summaryLine(g)} />
);

export const SpeakerCard = ({ s }: { s: Builder }) => (
  <PersonCard b={s} n={s.shipped_count} unit="shipped" line={summaryLine(s)}
    action={<CopyButton label="Invite to speak" text={speakerMessage(s)} />} />
);

export const InviteCard = ({ v, community }: { v: Invite; community: string }) => (
  <PersonCard b={v} n={v.overlap} unit="overlap"
    line={v.overlap ? `Shares ${v.overlap} skill${v.overlap === 1 ? "" : "s"} with ${community}` : `Shipped ${v.shipped_count ?? 0} projects`}
    action={<CopyButton label="Copy invite" text={inviteMessage(v, community)} />} />
);

export function IntroCard({ i }: { i: Intro }) {
  return (
    <CardShell>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-[10px]">
        <div className="flex flex-col items-center text-center gap-[8px] min-w-0">
          <Avatar name={i.a_name} size={44} />
          <p className="text-[18px] font-medium leading-[1.1] truncate max-w-full">{i.a_name}</p>
        </div>
        <span className="v-display text-[32px] v-muted">&harr;</span>
        <div className="flex flex-col items-center text-center gap-[8px] min-w-0">
          <Avatar name={i.b_name} size={44} />
          <p className="text-[18px] font-medium leading-[1.1] truncate max-w-full">{i.b_name}</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-[8px]">
        <Reason text={i.why} />
        <Tags items={[...(i.a_communities ?? []).slice(0, 1), ...(i.b_communities ?? []).slice(0, 1)]} />
      </div>
      <div className="flex justify-end items-center gap-[8px]">
        <SourceLink source={i.b_source} url={i.b_url} />
        <CopyButton label="Draft intro" text={introMessage(i)} />
      </div>
    </CardShell>
  );
}
