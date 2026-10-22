import Dashboard from "@/components/dashboard/Dashboard";

// Route "/". ?demo=1 renders labelled sample data without touching Supabase.
// ?tab=intros|speakers optionally opens a tab; ?q=... auto-asks Ask Vouch (handy for screenshots).
export default function Page({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  const demo = searchParams.demo === "1";
  const t = searchParams.tab;
  const initialTab = t === "intros" || t === "speakers" ? t : "gems";
  const q = typeof searchParams.q === "string" ? searchParams.q.slice(0, 300) : "";
  return <Dashboard key={demo ? "demo" : "live"} demo={demo} initialTab={initialTab} initialQuestion={q} />;
}
