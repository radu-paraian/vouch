"""Shared helpers for the Cognee sync and Ask Vouch."""

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATASET = "vouch"


def load_env():
    """Load .env.local then .env. Existing process env wins. Call before importing cognee."""
    for name in (".env.local", ".env"):
        path = ROOT / name
        if not path.exists():
            continue
        for raw in path.read_text().splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def supabase_credentials():
    url = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    if not url or not key:
        raise SystemExit(
            "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local."
        )
    return url, key


def member_text(member):
    communities = _join(member.get("communities")) or "no listed communities"
    skills = _join(member.get("skills")) or "none listed"
    shipped = member.get("shipped_count")
    shipped_text = "unknown" if shipped is None else str(shipped)
    return (
        f"{member.get('name') or 'Unknown'} (id {member.get('id')}) is in {communities}. "
        f"Skills: {skills}. Looking for: {member.get('looking_for') or 'nothing specified'}. "
        f"Events in the last 3 months: {member.get('events_last_3_months') or 0}. "
        f"Happy to speak: {bool(member.get('speaker'))} on {member.get('talk_topic') or 'no topic'}. "
        f"Built: {member.get('research_summary') or 'unknown'}. "
        f"Shipped projects: {shipped_text}."
    )


def flatten_search(results):
    if results is None:
        return ""
    if isinstance(results, str):
        return results.strip()
    if isinstance(results, dict):
        return _result_text(results)
    if isinstance(results, list):
        parts = [_result_text(item) if isinstance(item, dict) else str(item).strip() for item in results]
        return "\n".join(part for part in parts if part).strip()
    return str(results).strip()


def _result_text(item):
    for key in ("search_result", "answer", "text"):
        value = item.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
        if isinstance(value, list):
            return flatten_search(value)
    if item.get("error"):
        return ""
    return ""


def _join(value):
    if isinstance(value, list):
        return ", ".join(str(part) for part in value if part)
    if isinstance(value, str):
        return value.strip()
    return ""
