import Dashboard from "@/components/dashboard/Dashboard";

// Route "/". ?demo=1 renders labelled sample data without touching Supabase.
// ?tab=intros|speakers optionally opens a tab (handy for screenshots).
export default function Page({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  const demo = searchParams.demo === "1";
  const t = searchParams.tab;
  const initialTab = t === "intros" || t === "speakers" ? t : "gems";
  return <Dashboard key={`${demo}-${initialTab}`} demo={demo} initialTab={initialTab} />;
}
