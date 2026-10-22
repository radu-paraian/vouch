export const COMMUNITIES = [
  "Unicorn Mafia", "basedcollective", "Kickstart Global", "Hackradar", "AI Agents Lab", "Corgi Community",
  "Night Office", "The Hack Collective", "United Italian Societies", "Outpost", "AI Pilled", "Imperial Entrepreneurs",
  "Hacker News", "Qloo Agentic Hackathon", "Build, Ship, Shape: Amazon Developer Hackathon", "Nebius x NVIDIA Global AI Hackathon",
] as const;

export type Evidence = { label: string; url: string };

/** Row shape of builder_gems / builder_speakers (public.builders + why). */
export type Builder = {
  id: string; name: string; handle: string | null; source: string; source_url: string | null; github: string | null;
  skills: string[] | null; languages: string[] | null; shipped_count: number | null; followers: number | null;
  evidence: Evidence[] | null; summary: string | null; communities: string[] | null; why: string | null;
  speaker_evidence?: string | null;
  /** builder_speakers only: source-appropriate headline number (HN points, events hosted, followers). */
  stat_value?: number | null; stat_label?: string | null;
};
export type HiddenGem = Builder;
export type Speaker = Builder;

/** Row shape of builder_intros. */
export type Intro = {
  a_id: string; a_name: string; a_handle: string | null; a_source: string; a_url: string | null;
  b_id: string; b_name: string; b_handle: string | null; b_source: string; b_url: string | null;
  shared: string[] | null; overlap: number | null; why: string | null;
  a_communities: string[] | null; b_communities: string[] | null; b_skills: string[] | null;
};

/** Row shape of builder_invites(target). */
export type Invite = {
  id: string; name: string; handle: string | null; source: string; source_url: string | null; github: string | null;
  skills: string[] | null; communities: string[] | null; shipped_count: number | null; overlap: number | null; why: string | null;
};
