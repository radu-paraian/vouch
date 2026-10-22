import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Kevin's Ask Vouch box calls POST /api/ask with { "question": "..." }.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  if (!question) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }

  const base = process.env.COGNEE_SERVICE_URL?.replace(/\/$/, "");
  const key = process.env.COGNEE_API_KEY;
  if (!base || !key) {
    return NextResponse.json({ error: "Cognee is not configured" }, { status: 500 });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Api-Key": key,
  };
  if (process.env.COGNEE_TENANT_ID) headers["X-Tenant-Id"] = process.env.COGNEE_TENANT_ID;

  const response = await fetch(`${base}/api/v1/search`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: question,
      search_type: "GRAPH_COMPLETION",
      datasets: ["vouch"],
    }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof payload?.detail === "string" ? payload.detail : "Cognee search failed";
    return NextResponse.json({ error: message }, { status: response.status });
  }

  return NextResponse.json({ answer: answerText(payload) });
}

function answerText(payload: unknown): string {
  if (typeof payload === "string") return payload;
  if (Array.isArray(payload)) return payload.map(answerText).filter(Boolean).join("\n");
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of ["search_result", "answer", "text"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) return value.trim();
      if (Array.isArray(value)) return answerText(value);
    }
  }
  return "";
}
