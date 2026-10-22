export const COMMUNITIES = [
  "Unicorn Mafia", "basedcollective", "Kickstart Global", "Hackradar", "AI Agents Lab", "Corgi Community",
  "Night Office", "The Hack Collective", "United Italian Societies", "Outpost", "AI Pilled", "Imperial Entrepreneurs", "Other",
] as const;

export type HiddenGem = {
  id: string; name: string; github: string | null; communities: string[] | null; skills: string[] | null;
  events_last_3_months: number | null; shipped_count: number | null; research_summary: string | null; why: string | null;
};
export type Intro = {
  seeker_id: string; seeker_name: string; looking_for: string | null; match_id: string; match_name: string;
  match_skills: string[] | null; match_communities: string[] | null; matched_skill: string | null; why: string | null;
};
export type Speaker = {
  id: string; name: string; github: string | null; communities: string[] | null; skills: string[] | null;
  talk_topic: string | null; shipped_count: number | null; research_summary: string | null; why: string | null;
};
export type Invite = {
  id: string; name: string; github: string | null; skills: string[] | null; communities: string[] | null;
  overlap: number | null; research_summary: string | null; why: string | null;
};
