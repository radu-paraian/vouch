import type { HiddenGem, Intro, Invite, Speaker } from "./types";

// Fallback only: used with ?demo=1, or when Supabase is missing, errors, or returns no rows.
export const demoCount = 76;

const b = (o: Partial<HiddenGem> & Pick<HiddenGem, "id" | "name" | "source">): HiddenGem => ({
  handle: null, source_url: null, github: null, skills: [], languages: [], shipped_count: 0, followers: 0,
  evidence: [], summary: null, communities: [], why: null, ...o,
});

export const demoGems: HiddenGem[] = [
  b({ id: "g1", name: "Amara Okafor", source: "github", github: "amaraokafor", source_url: "https://github.com/amaraokafor",
    skills: ["Rust", "WebGPU"], shipped_count: 14, followers: 41, communities: ["AI Agents Lab", "Night Office"], why: "Shipped 14 projects, mostly Rust" }),
  b({ id: "g2", name: "Tomasz Wisniewski", source: "devpost", source_url: "https://devpost.com/tomwis",
    skills: ["TypeScript", "Postgres"], shipped_count: 9, followers: 12, communities: ["Qloo Agentic Hackathon"], why: "Shipped 9 projects, mostly TypeScript" }),
  b({ id: "g3", name: "Priya Raman", source: "hn", source_url: "https://news.ycombinator.com/user?id=priyaraman",
    skills: ["Python", "Evals"], shipped_count: 7, followers: 3, communities: ["Hacker News"], why: "Shipped 7 projects, mostly Python" }),
];

export const demoIntros: Intro[] = [
  { a_id: "s1", a_name: "Leo Hart", a_handle: "leohart", a_source: "github", a_url: "https://github.com/leohart",
    b_id: "g1", b_name: "Amara Okafor", b_handle: "amaraokafor", b_source: "devpost", b_url: "https://devpost.com/amaraokafor",
    shared: ["rust"], overlap: 1, why: "Both build Rust, GitHub meets Devpost",
    a_communities: ["AI Pilled"], b_communities: ["Corgi Community"], b_skills: ["Rust", "WebGPU"] },
  { a_id: "s2", a_name: "Sofia Bianchi", a_handle: "sofiab", a_source: "hn", a_url: "https://news.ycombinator.com/user?id=sofiab",
    b_id: "g2", b_name: "Tomasz Wisniewski", b_handle: "tomwis", b_source: "github", b_url: "https://github.com/tomwis",
    shared: ["postgres", "typescript"], overlap: 2, why: "Both build Postgres, HN meets GitHub",
    a_communities: ["Hacker News"], b_communities: [], b_skills: ["TypeScript", "Postgres"] },
];

export const demoSpeakers: Speaker[] = [
  b({ id: "p1", name: "Hannah Cole", source: "luma", source_url: "https://lu.ma/user/hannahcole", skills: ["Agents", "Voice"],
    shipped_count: 11, communities: ["Agentic AI in Financial Services"], why: "Hosted Voice agents in production", stat_value: 1, stat_label: "event hosted" }),
  b({ id: "p2", name: "Ravi Patel", source: "devpost", source_url: "https://devpost.com/ravipatel", skills: ["Infra", "Go"],
    shipped_count: 8, communities: ["Nebius x NVIDIA Global AI Hackathon"], why: "Shipped 8 projects", stat_value: 8, stat_label: "shipped" }),
];

export const demoInvites = (community: string): Invite[] => [
  { id: "i1", name: "Amara Okafor", handle: "amaraokafor", source: "github", source_url: "https://github.com/amaraokafor", github: "amaraokafor",
    skills: ["Rust", "WebGPU"], communities: ["AI Agents Lab"], shipped_count: 14, overlap: 2, why: `Shares 2 skills with ${community}` },
  { id: "i2", name: "Priya Raman", handle: "priyaraman", source: "hn", source_url: "https://news.ycombinator.com/user?id=priyaraman", github: null,
    skills: ["Python", "Evals"], communities: ["Hacker News"], shipped_count: 7, overlap: 1, why: `Shares 1 skill with ${community}` },
];
