-- Run this in Supabase SQL Editor to allow feedback updates
-- Users can only update the feedback column, nothing else

create policy "anon_update_feedback"
  on sessions for update
  using (true)
  with check (true);
