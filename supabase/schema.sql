-- Vouch: shared builder memory. Run in the Supabase SQL editor.
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  github text,
  x_or_linkedin text,
  communities text[] default '{}',
  skills text[] default '{}',
  looking_for text,
  events_last_3_months int default 0,
  speaker boolean default false,
  talk_topic text,
  consent boolean not null default false,
  research_summary text,
  shipped_count int,
  researched_at timestamptz
);

alter table members enable row level security;
create policy "anyone can sign up" on members for insert with check (consent = true);
create policy "read for demo" on members for select using (true);
alter publication supabase_realtime add table members;

-- Dashboard views: each row carries a one-line `why`.
create or replace view hidden_gems with (security_invoker = true) as
select id, name, github, communities, skills, events_last_3_months, shipped_count, research_summary,
  format('Shipped %s projects, only %s event(s) in the last 3 months', shipped_count, events_last_3_months) as why
from members
where consent and events_last_3_months <= 1 and shipped_count >= 2
order by shipped_count desc, created_at desc;

create or replace view speakers with (security_invoker = true) as
select id, name, github, communities, skills, talk_topic, shipped_count, research_summary,
  case when talk_topic is not null and talk_topic <> ''
    then format('Offered to talk on %s; shipped %s projects', talk_topic, coalesce(shipped_count,0))
    else format('Happy to give a talk; shipped %s projects', coalesce(shipped_count,0)) end as why
from members
where consent and speaker
order by shipped_count desc nulls last, created_at desc;

create or replace view intros with (security_invoker = true) as
select a.id as seeker_id, a.name as seeker_name, a.looking_for,
  b.id as match_id, b.name as match_name, b.skills as match_skills, b.communities as match_communities,
  s.skill as matched_skill,
  format('Intro: %s is looking for %s, and %s does %s%s', a.name, a.looking_for, b.name, s.skill,
    case when cardinality(b.communities) > 0 then ' in ' || array_to_string(b.communities, ', ') else '' end) as why
from members a
join members b on a.id <> b.id and b.consent
cross join lateral (
  select sk as skill from unnest(b.skills) sk
  where a.looking_for ilike '%' || sk || '%'
     or (sk = 'AI/ML' and (a.looking_for ilike '%AI%' or a.looking_for ilike '%ML%'))
  limit 1
) s
where a.consent and coalesce(a.looking_for,'') <> '';

create or replace function community_invites(target text)
returns table (id uuid, name text, github text, skills text[], communities text[], overlap int, research_summary text, why text)
language sql stable security invoker as $$
  with c as (
    select distinct unnest(skills) as skill from members where consent and target = any(communities)
  )
  select m.id, m.name, m.github, m.skills, m.communities,
    (select count(*)::int from unnest(m.skills) sk where sk in (select skill from c)) as overlap,
    m.research_summary,
    format('Invite to %s: shares %s skill(s) with its members (%s)', target,
      (select count(*) from unnest(m.skills) sk where sk in (select skill from c)),
      (select string_agg(sk, ', ') from unnest(m.skills) sk where sk in (select skill from c)))
  from members m
  where m.consent and not (target = any(m.communities))
    and exists (select 1 from unnest(m.skills) sk where sk in (select skill from c))
  order by overlap desc, m.shipped_count desc nulls last;
$$;

grant select on hidden_gems, speakers, intros to anon, authenticated;
grant execute on function community_invites(text) to anon, authenticated;
