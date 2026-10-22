import type { HiddenGem, Intro, Invite, Speaker } from "./types";

// SAMPLE DATA ONLY — rendered with ?demo=1, never written to Supabase.
export const demoCount = 47;

export const demoGems: HiddenGem[] = [
  { id: "g1", name: "Amara Okafor", github: "amaraokafor", communities: ["AI Agents Lab", "Night Office"], skills: ["Rust", "WebGPU"],
    events_last_3_months: 0, shipped_count: 14, research_summary: "Ships a local-first vector DB in Rust with 1.2k stars; quietly maintains a WebGPU inference runtime used by two YC startups.",
    why: "Shipped 14 projects, never been to an event" },
  { id: "g2", name: "Tomasz Wiśniewski", github: "tomwis", communities: ["Hackradar"], skills: ["TypeScript", "Postgres"],
    events_last_3_months: 1, shipped_count: 9, research_summary: "Built an open-source Postgres change-data-capture tool and three weekend SaaS tools with paying users.",
    why: "Has paying users, rarely comes to meetups" },
  { id: "g3", name: "Priya Raman", github: "priyaraman", communities: ["Imperial Entrepreneurs", "AI Pilled"], skills: ["Python", "Evals"],
    events_last_3_months: 0, shipped_count: 7, research_summary: "PhD student publishing LLM eval harnesses; her red-teaming dataset is cited by two labs.",
    why: "Builds AI evals, no one here has met her yet" },
];

export const demoIntros: Intro[] = [
  { seeker_id: "s1", seeker_name: "Leo Hart", looking_for: "A Rust engineer for a realtime audio agent", match_id: "g1", match_name: "Amara Okafor",
    match_skills: ["Rust", "WebGPU"], match_communities: ["AI Agents Lab"], matched_skill: "Rust", why: "Needs a Rust engineer, Amara writes Rust" },
  { seeker_id: "s2", seeker_name: "Sofia Bianchi", looking_for: "Someone who has scaled Postgres", match_id: "g2", match_name: "Tomasz Wiśniewski",
    match_skills: ["TypeScript", "Postgres"], match_communities: ["Hackradar"], matched_skill: "Postgres", why: "Needs Postgres help, Tomasz built a Postgres tool" },
  { seeker_id: "s3", seeker_name: "Kwame Mensah", looking_for: "An evals co-founder", match_id: "g3", match_name: "Priya Raman",
    match_skills: ["Python", "Evals"], match_communities: ["AI Pilled"], matched_skill: "Evals", why: "Needs an evals co-founder, Priya builds evals" },
];

export const demoSpeakers: Speaker[] = [
  { id: "p1", name: "Hannah Cole", github: "hannahcole", communities: ["Unicorn Mafia", "Outpost"], skills: ["Agents", "Voice"],
    talk_topic: "Voice agents that don't interrupt you", shipped_count: 11, research_summary: "Shipped a voice-first scheduling agent used by 3k people; writes candidly about latency budgets.",
    why: "Wants to talk about voice agents" },
  { id: "p2", name: "Ravi Patel", github: "ravipatel", communities: ["The Hack Collective"], skills: ["Infra", "Go"],
    talk_topic: "Running inference on a £20/month box", shipped_count: 8, research_summary: "Maintains a popular Go inference proxy; ran a hackathon-winning project on a single VPS.",
    why: "Wants to talk about running AI on a cheap server" },
];

export const demoInvites = (community: string): Invite[] => [
  { id: "i1", name: "Amara Okafor", github: "amaraokafor", skills: ["Rust", "WebGPU"], communities: ["AI Agents Lab"], overlap: 3,
    research_summary: "Local-first vector DB in Rust, WebGPU inference runtime.", why: "Same skills as the members, not in yet" },
  { id: "i2", name: "Priya Raman", github: "priyaraman", skills: ["Python", "Evals"], communities: ["AI Pilled"], overlap: 2,
    research_summary: "LLM eval harnesses and a widely cited red-teaming dataset.", why: "Builds what this community builds" },
];
