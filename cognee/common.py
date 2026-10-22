"""Shared helpers for the Cognee sync and Ask Vouch."""

import json
import os
import ssl
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

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
    key = (
        os.environ.get("SUPABASE_SERVICE_KEY")
        or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
        or os.environ.get("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
    )
    if not url or not key:
        raise SystemExit(
            "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local."
        )
    return url, key


def member_text(row):
    communities = _join(row.get("communities")) or "no listed communities"
    skills = _join(row.get("skills")) or "none listed"
    languages = _join(row.get("languages")) or "none listed"
    shipped = row.get("shipped_count")
    shipped_text = "unknown" if shipped is None else str(shipped)
    followers = row.get("followers")
    speaker = row.get("is_speaker")
    if speaker is None:
        speaker = row.get("speaker")
    return (
        f"{row.get('name') or 'Unknown'} (id {row.get('id')}) "
        f"from {row.get('source') or 'an unknown source'}. "
        f"Handle: {row.get('handle') or 'none'}. GitHub: {row.get('github') or 'none'}. "
        f"Profile: {row.get('source_url') or 'none'}. "
        f"Communities: {communities}. Skills: {skills}. Languages: {languages}. "
        f"Shipped projects: {shipped_text}. "
        f"Followers: {'unknown' if followers is None else followers}. "
        f"Last active: {row.get('last_active') or 'unknown'}. "
        f"Happy to speak: {bool(speaker)}. "
        f"Speaker evidence: {row.get('speaker_evidence') or 'none'}. "
        f"Built: {row.get('summary') or 'unknown'}."
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


def cognee_config():
    key = os.environ.get("COGNEE_API_KEY", "").strip()
    base = os.environ.get("COGNEE_SERVICE_URL", "").strip().rstrip("/")
    if not key:
        raise SystemExit("Missing COGNEE_API_KEY in .env.local.")
    if not base:
        raise SystemExit(
            "Missing COGNEE_SERVICE_URL. On the Cognee API Keys page, copy the Connection Details URL "
            "(https://....aws.cognee.ai) into .env.local."
        )
    return base, key


def add_text(text, name):
    import httpx

    base, key = cognee_config()
    response = httpx.post(
        base + "/api/v1/add",
        headers=_cognee_headers(key),
        data={"datasetName": DATASET},
        files={"data": (name, text, "text/plain")},
        timeout=120,
    )
    if response.status_code == 409:
        updated = _replace_existing(base, key, response.text, text)
        return updated or {"status": "exists"}
    if response.status_code >= 400:
        raise SystemExit(f"Cognee /api/v1/add failed ({response.status_code}): {response.text[:300]}")
    return response.json() if response.content else {}


def _replace_existing(base, key, error_text, text):
    import httpx
    import re

    match = re.search(r"data_id[= ]([0-9a-f-]{36})", error_text)
    if not match:
        return None
    response = httpx.patch(
        base + "/api/v1/update",
        headers={**_cognee_headers(key), "Content-Type": "application/json"},
        json={"data_id": match.group(1), "data": text},
        timeout=120,
    )
    if response.status_code >= 400:
        return None
    return response.json() if response.content else {"status": "updated"}


def cognify():
    base, key = cognee_config()
    body = json.dumps({"datasets": [DATASET]}).encode()
    return _cognee(base, "/api/v1/cognify", body, _cognee_headers(key, "application/json"), timeout=600)


def search(question):
    base, key = cognee_config()
    body = json.dumps(
        {"query": question, "search_type": "GRAPH_COMPLETION", "datasets": [DATASET]}
    ).encode()
    return _cognee(base, "/api/v1/search", body, _cognee_headers(key, "application/json"))


def _cognee_headers(key, content_type=None):
    headers = {"X-Api-Key": key}
    if content_type:
        headers["Content-Type"] = content_type
    tenant = os.environ.get("COGNEE_TENANT_ID", "").strip()
    if tenant:
        headers["X-Tenant-Id"] = tenant
    return headers


def _cognee(base, path, body, headers, timeout=120):
    request = Request(base + path, data=body, headers=headers, method="POST")
    context = ssl.create_default_context()
    certs = "/etc/ssl/cert.pem"
    if os.path.exists(certs):
        context.load_verify_locations(certs)
    try:
        with urlopen(request, timeout=timeout, context=context) as response:
            payload = response.read().decode()
            return json.loads(payload) if payload else {}
    except HTTPError as error:
        detail = error.read().decode()[:300]
        raise SystemExit(f"Cognee {path} failed ({error.code}): {detail}")


def _join(value):
    if isinstance(value, list):
        return ", ".join(str(part) for part in value if part)
    if isinstance(value, str):
        return value.strip()
    return ""
