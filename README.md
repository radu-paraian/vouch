# 🤝 Vouch

**One shared memory of London builders, so community leads know who their members are, who to intro, and who could speak.**

Built at the Grok Bot Community Engineering London Hackathon (22 Oct 2026) for **Track 2: Know Your Members**.

London communities all vet, track and chase the same few hundred builders separately, in spreadsheets, Luma CSVs and memory. Vouch gives them one opt-in memory they share.

## What it does

- **`/join`**: a 30-second, mobile-first signup. Opt-in only.
- **`/qr`**: a fullscreen QR code to `/join` with a live member count, for the screen at your table.
- **`/` dashboard**, with three tabs:
  - 💎 **Hidden gems**: people who ship but rarely show up to events.
  - 🔁 **Intros**: "these two should meet", plus who to invite to a given community.
  - 🎤 **Speakers**: members happy to give a talk, ranked by what they've shipped.
- **Research**: Grok Bot reads each signup's public GitHub every 10 minutes and writes a one-line "what they've built" summary.
- **Ask Vouch**: plain-English questions over the member memory, powered by [Cognee](https://github.com/topoteretes/cognee).

Every card shows a one-line *why*. The bot recommends, and the organiser decides. Nothing is sent automatically.

## Principles

- Opt-in only, public info only, delete anytime.
- Bot recommends, human decides.
- Open source, so any community can run it next week.

## Run it for your community

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
2. Copy `.env.example` to `.env.local` and fill in your Supabase URL and keys.
3. Run the app:
   ```bash
   npm install && npm run dev
   ```
4. Deploy to Vercel with the same env vars.
5. Optional: run the Cognee sync (`python cognee/sync.py`) every ~20 minutes to power Ask Vouch.
6. Optional: point a Grok Bot at your `members` table with the research prompt below.

### Research prompt (Grok Bot)

> Every 10 minutes, open the Supabase `members` table and find rows where `research_summary` is empty and `github` is filled. For each one, read their **public GitHub profile only** and write `research_summary` (one sentence, max 25 words, about what they've built), `shipped_count` (repos with a README and more than a few commits) and `researched_at`. Never visit personal sites or social accounts. Skip anyone without a GitHub.

## Data model

There's one table, `members`, with three views on top: `hidden_gems`, `intros` and `speakers`. There's also one function, `community_invites(target)`. Each returns a ready-to-show `why` string, so the front end only renders.

## Stack

Next.js 14, Tailwind, Framer Motion, Supabase (Postgres, RLS and realtime), Cognee, Grok Bot and Cursor.

## Team

Kevin, Raddu and Jed, with Grok Bot.

## Licence

MIT. See [LICENSE](LICENSE).
