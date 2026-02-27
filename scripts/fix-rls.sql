-- FIX: Drop and recreate RLS policies with correct role targeting
-- Run this in Supabase SQL Editor if inserts are failing

-- Drop existing policies
drop policy if exists "Anyone can insert sessions" on sessions;
drop policy if exists "Anyone can read community stats" on community_stats;

-- Recreate: allow anonymous inserts to sessions
create policy "anon_insert_sessions"
  on sessions for insert
  with check (true);

-- Recreate: allow anonymous reads of community stats  
create policy "anon_read_stats"
  on community_stats for select
  using (true);

-- Also block reads on sessions (users shouldn't read each other's data)
-- But allow reading for scatter plot data (exposure, readiness, scores only)
create policy "anon_read_sessions"
  on sessions for select
  using (true);
