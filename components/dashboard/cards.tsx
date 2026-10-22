"use client";
import { motion } from "framer-motion";
import { Avatar, GithubLink, Reason, cleanHandle, itemVariants } from "./ui";
import type { HiddenGem, Intro, Invite, Speaker } from "./types";

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.article layout variants={itemVariants} whileHover={{ y: -3 }} className="v-card p-[10px]">
      <div className="flex flex-col gap-[18px] px-[15px] pt-[12px] pb-[8px] h-full">{children}</div>
    </motion.article>
  );
}

function Person({ name, github }: { name: string; github?: string | null }) {
  return (
    <div className="flex items-center gap-[10px] min-w-0">
      <Avatar name={name} />
      <div className="flex flex-col gap-[3px] min-w-0">
        <p className="text-[20px] font-medium leading-[1.1] truncate">{name}</p>
        {github && (
          <a className="v-link text-[12px] truncate" href={`https://github.com/${cleanHandle(github)}`} target="_blank" rel="noreferrer">
            @{cleanHandle(github)}
          </a>
        )}
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

function PersonCard({ name, github, n, unit, line }: { name: string; github?: string | null; n?: number | null; unit: string; line?: string | null }) {
  return (
    <CardShell>
      <div className="flex items-start justify-between gap-[10px]">
        <Person name={name} github={github} />
        <BigNumber n={n} unit={unit} />
      </div>
      <div className="flex-1"><Reason text={line} /></div>
      <div className="flex justify-end"><GithubLink handle={github} /></div>
    </CardShell>
  );
}

export const GemCard = ({ g }: { g: HiddenGem }) => (
  <PersonCard name={g.name} github={g.github} n={g.shipped_count} unit="shipped" line={g.why || g.research_summary} />
);

export const SpeakerCard = ({ s }: { s: Speaker }) => (
  <PersonCard name={s.name} github={s.github} n={s.shipped_count} unit="shipped" line={s.why || s.talk_topic || s.research_summary} />
);

export const InviteCard = ({ v }: { v: Invite }) => (
  <PersonCard name={v.name} github={v.github} n={v.overlap} unit="overlap" line={v.why || v.research_summary} />
);

export function IntroCard({ i }: { i: Intro }) {
  return (
    <CardShell>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-[10px]">
        <div className="flex flex-col items-center text-center gap-[8px] min-w-0">
          <Avatar name={i.seeker_name} size={44} />
          <p className="text-[18px] font-medium leading-[1.1] truncate max-w-full">{i.seeker_name}</p>
        </div>
        <span className="v-display text-[32px] v-muted">↔</span>
        <div className="flex flex-col items-center text-center gap-[8px] min-w-0">
          <Avatar name={i.match_name} size={44} />
          <p className="text-[18px] font-medium leading-[1.1] truncate max-w-full">{i.match_name}</p>
        </div>
      </div>
      <Reason text={i.why || (i.matched_skill ? `Needs ${i.matched_skill}, ${i.match_name.split(" ")[0]} has it` : null)} />
    </CardShell>
  );
}
