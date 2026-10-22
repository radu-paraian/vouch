import { spawn } from "node:child_process";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Kevin's Ask Vouch box calls POST /api/ask with { "question": "..." }.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  if (!question) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }

  const script = path.join(process.cwd(), "cognee", "ask.py");

  try {
    const answer = await runAsk(script, question);
    return NextResponse.json({ answer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ask Vouch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function runAsk(script: string, question: string) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn("python3", [script, question], {
      cwd: process.cwd(),
      env: process.env,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(stderr.trim() || `ask.py exited ${code}`));
    });
  });
}
