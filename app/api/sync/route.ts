import { getSupabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type Builder = {
  id: string;
  name?: string | null;
  handle?: string | null;
  github?: string | null;
  source?: string | null;
  source_url?: string | null;
  communities?: string[] | null;
  skills?: string[] | null;
  languages?: string[] | null;
  shipped_count?: number | null;
  followers?: number | null;
  last_active?: string | null;
  is_speaker?: boolean | null;
  speaker_evidence?: string | null;
  summary?: string | null;
};

// The open dashboard calls this when a builders row changes.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const ids = Array.isArray(body?.ids)
    ? body.ids.filter((id: unknown): id is string => typeof id === "string").slice(0, 20)
    : [];
  if (!ids.length) {
    return NextResponse.json({ error: "ids required" }, { status: 400 });
  }

  const base = process.env.COGNEE_SERVICE_URL?.replace(/\/$/, "");
  const key = process.env.COGNEE_API_KEY;
  if (!base || !key) {
    return NextResponse.json({ error: "Cognee is not configured" }, { status: 500 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.from("builders").select("*").in("id", ids);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const headers: Record<string, string> = { "X-Api-Key": key };
  if (process.env.COGNEE_TENANT_ID) headers["X-Tenant-Id"] = process.env.COGNEE_TENANT_ID;

  for (const row of (data ?? []) as Builder[]) {
    const form = new FormData();
    form.append("datasetName", "vouch");
    form.append("data", new Blob([builderText(row)], { type: "text/plain" }), `${row.id}.txt`);
    const added = await fetch(`${base}/api/v1/add`, { method: "POST", headers, body: form });
    if (!added.ok && added.status !== 409) {
      const detail = await added.text();
      return NextResponse.json({ error: detail.slice(0, 300) }, { status: added.status });
    }
  }

  const cognified = await fetch(`${base}/api/v1/cognify`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ datasets: ["vouch"] }),
  });
  if (!cognified.ok) {
    const detail = await cognified.text();
    return NextResponse.json({ error: detail.slice(0, 300) }, { status: cognified.status });
  }

  return NextResponse.json({ synced: data?.length ?? 0 });
}

function builderText(row: Builder) {
  const list = (value?: string[] | null) => (value?.filter(Boolean).join(", ") || "none");
  return (
    `${row.name || "Unknown"} (id ${row.id}) from ${row.source || "an unknown source"}. ` +
    `Handle: ${row.handle || "none"}. GitHub: ${row.github || "none"}. ` +
    `Profile: ${row.source_url || "none"}. ` +
    `Communities: ${list(row.communities)}. Skills: ${list(row.skills)}. Languages: ${list(row.languages)}. ` +
    `Shipped projects: ${row.shipped_count ?? "unknown"}. Followers: ${row.followers ?? "unknown"}. ` +
    `Last active: ${row.last_active || "unknown"}. Happy to speak: ${Boolean(row.is_speaker)}. ` +
    `Speaker evidence: ${row.speaker_evidence || "none"}. Built: ${row.summary || "unknown"}.`
  );
}
