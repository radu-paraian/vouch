"""Pull scraped builders from Supabase into the Cognee dataset `vouch`.

Run from the repo root every ~20 minutes:

    python cognee/sync.py
"""

import asyncio
import hashlib
import json
from pathlib import Path

from common import add_text, cognify, load_env, member_text, supabase_credentials

STATE_PATH = Path(__file__).resolve().parent / ".sync-state.json"


def fetch_members():
    from supabase import create_client

    url, key = supabase_credentials()
    client = create_client(url, key)
    response = client.table("builders").select("*").execute()
    return response.data or []


def load_state():
    if not STATE_PATH.exists():
        return {}
    return json.loads(STATE_PATH.read_text())


def save_state(state):
    STATE_PATH.write_text(json.dumps(state, indent=2) + "\n")


async def sync():
    rows = fetch_members()
    state = load_state()
    changed = []
    for member in rows:
        text = member_text(member)
        digest = hashlib.sha256(text.encode()).hexdigest()
        member_id = str(member.get("id"))
        if state.get(member_id) == digest:
            continue
        changed.append((member_id, digest, text))

    if not changed:
        print(f"no changes ({len(rows)} builders)")
        return

    for index, (member_id, _digest, text) in enumerate(changed, start=1):
        add_text(text, f"{member_id}.txt")
        if index == 1 or index % 10 == 0 or index == len(changed):
            print(f"uploaded {index} of {len(changed)}", flush=True)
    print("building the memory", flush=True)
    cognify()

    for member_id, digest, _text in changed:
        state[member_id] = digest
    save_state(state)
    print(f"synced {len(changed)} of {len(rows)} builders")


if __name__ == "__main__":
    load_env()
    asyncio.run(sync())
