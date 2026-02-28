-- AI Career Navigator — Supabase Setup (v3)
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Sessions table
create table sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  scores jsonb not null,
  archetype text not null,
  exposure int not null,
  readiness int not null,
  tool_selections text[] default '{}',
  answers jsonb default '{}',
  tags text[] default '{}',
  feedback jsonb
);

-- Community stats (single row, updated by trigger)
create table community_stats (
  id int primary key default 1 check (id = 1),
  n int default 0,
  sum_exposure bigint default 0,
  sum_readiness bigint default 0,
  sum_scores jsonb default '{"adoption":0,"mindset":0,"craft":0,"tech_depth":0,"reliability":0,"agents":0}',
  archetype_counts jsonb default '{}',
  exposure_buckets jsonb default '{"low":0,"moderate":0,"high":0}',
  readiness_buckets jsonb default '{"early":0,"building":0,"strong":0}',
  tool_counts jsonb default '{}',
  tool_users int default 0,
  answer_counts jsonb default '{}',
  updated_at timestamptz default now()
);

insert into community_stats (id) values (1);

-- RLS
alter table sessions enable row level security;
alter table community_stats enable row level security;

create policy "Anyone can insert sessions" on sessions for insert to anon with check (true);
create policy "Anyone can read community stats" on community_stats for select to anon using (true);
create policy "Anyone can read sessions" on sessions for select to anon using (true);
create policy "Anyone can update session feedback" on sessions for update to anon using (true) with check (true);

-- Trigger function
create or replace function update_community_stats()
returns trigger as $$
declare
  dims text[] := array['adoption','mindset','craft','tech_depth','reliability','agents'];
  d text; new_scores jsonb; cur_scores jsonb; cur_ac jsonb;
  cur_eb jsonb; cur_rb jsonb; cur_tc jsonb; cur_ansc jsonb;
  tool text; qid text; ans_val jsonb; idx text;
begin
  select sum_scores, archetype_counts, exposure_buckets, readiness_buckets, tool_counts, answer_counts
    into cur_scores, cur_ac, cur_eb, cur_rb, cur_tc, cur_ansc
    from community_stats where id = 1 for update;

  new_scores := NEW.scores;

  foreach d in array dims loop
    cur_scores := jsonb_set(cur_scores, array[d],
      to_jsonb(coalesce((cur_scores->>d)::numeric, 0) + coalesce((new_scores->>d)::numeric, 0)));
  end loop;

  cur_ac := jsonb_set(cur_ac, array[NEW.archetype],
    to_jsonb(coalesce((cur_ac->>NEW.archetype)::int, 0) + 1));

  if NEW.exposure >= 75 then
    cur_eb := jsonb_set(cur_eb, '{high}', to_jsonb(coalesce((cur_eb->>'high')::int, 0) + 1));
  elsif NEW.exposure >= 45 then
    cur_eb := jsonb_set(cur_eb, '{moderate}', to_jsonb(coalesce((cur_eb->>'moderate')::int, 0) + 1));
  else
    cur_eb := jsonb_set(cur_eb, '{low}', to_jsonb(coalesce((cur_eb->>'low')::int, 0) + 1));
  end if;

  if NEW.readiness >= 70 then
    cur_rb := jsonb_set(cur_rb, '{strong}', to_jsonb(coalesce((cur_rb->>'strong')::int, 0) + 1));
  elsif NEW.readiness >= 40 then
    cur_rb := jsonb_set(cur_rb, '{building}', to_jsonb(coalesce((cur_rb->>'building')::int, 0) + 1));
  else
    cur_rb := jsonb_set(cur_rb, '{early}', to_jsonb(coalesce((cur_rb->>'early')::int, 0) + 1));
  end if;

  if array_length(NEW.tool_selections, 1) > 0 then
    foreach tool in array NEW.tool_selections loop
      cur_tc := jsonb_set(cur_tc, array[tool],
        to_jsonb(coalesce((cur_tc->>tool)::int, 0) + 1));
    end loop;
  end if;

  if NEW.answers is not null then
    for qid, ans_val in select * from jsonb_each(NEW.answers) loop
      if cur_ansc->qid is null then
        cur_ansc := jsonb_set(cur_ansc, array[qid], '{}'::jsonb);
      end if;
      if jsonb_typeof(ans_val) = 'array' then
        for idx in select jsonb_array_elements_text(ans_val) loop
          cur_ansc := jsonb_set(cur_ansc, array[qid, idx],
            to_jsonb(coalesce((cur_ansc->qid->>idx)::int, 0) + 1));
        end loop;
      else
        idx := ans_val #>> '{}';
        cur_ansc := jsonb_set(cur_ansc, array[qid, idx],
          to_jsonb(coalesce((cur_ansc->qid->>idx)::int, 0) + 1));
      end if;
    end loop;
  end if;

  update community_stats set
    n = n + 1, sum_exposure = sum_exposure + NEW.exposure,
    sum_readiness = sum_readiness + NEW.readiness,
    sum_scores = cur_scores, archetype_counts = cur_ac,
    exposure_buckets = cur_eb, readiness_buckets = cur_rb,
    tool_counts = cur_tc,
    tool_users = tool_users + case when array_length(NEW.tool_selections, 1) > 0 then 1 else 0 end,
    answer_counts = cur_ansc, updated_at = now()
  where id = 1;

  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_session_insert
  after insert on sessions
  for each row execute function update_community_stats();
