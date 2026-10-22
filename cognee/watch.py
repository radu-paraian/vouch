"""Push new and edited builders into Cognee as Supabase saves them.

Run from the repo root and leave it running during the demo:

    python cognee/watch.py

# ponytail: one process on this machine. If the laptop sleeps, Ask Vouch stops
# updating until this is started again. A Supabase webhook to a Vercel route
# would keep it running without this process.
"""

import asyncio
import os

try:
    import certifi

    os.environ.setdefault("SSL_CERT_FILE", certifi.where())
except ImportError:
    if os.path.exists("/etc/ssl/cert.pem"):
        os.environ.setdefault("SSL_CERT_FILE", "/etc/ssl/cert.pem")

from common import add_text, cognify, load_env, member_text, supabase_credentials


async def main():
    from supabase import acreate_client

    url, key = supabase_credentials()
    client = await acreate_client(url, key)
    queue = asyncio.Queue()

    def handle(payload):
        record = (payload.get("data") or {}).get("record")
        if record and record.get("id"):
            queue.put_nowait(record)

    channel = client.channel("vouch-builders-sync")
    channel.on_postgres_changes(event="*", schema="public", table="builders", callback=handle)

    def on_status(status, error):
        print(f"realtime {status}" + (f" {error}" if error else ""), flush=True)

    await channel.subscribe(on_status)
    print("watching builders", flush=True)

    while True:
        row = await queue.get()
        batch = [row]
        await asyncio.sleep(3)
        while not queue.empty():
            batch.append(queue.get_nowait())
        await asyncio.to_thread(push, batch)


def push(rows):
    for row in rows:
        add_text(member_text(row), f"{row['id']}.txt")
    cognify()
    print(f"synced {len(rows)}", flush=True)


if __name__ == "__main__":
    load_env()
    asyncio.run(main())
