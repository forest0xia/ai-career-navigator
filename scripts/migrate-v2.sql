-- Migration: reset community_stats + update trigger for new dimensions
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Reset community_stats to fresh state with new dimension names
UPDATE community_stats SET
  n = 0,
  sum_exposure = 0,
  sum_readiness = 0,
  sum_scores = '{"usage_depth":0,"workflow":0,"system":0,"adaptability":0,"builder":0,"mindset":0}',
  archetype_counts = '{}',
  exposure_buckets = '{"low":0,"moderate":0,"high":0}',
  readiness_buckets = '{"early":0,"building":0,"strong":0}',
  tool_counts = '{}',
  tool_users = 0,
  answer_counts = '{}',
  updated_at = now()
WHERE id = 1;

-- 2. Drop old trigger
DROP TRIGGER IF EXISTS on_session_insert ON sessions;

-- 3. Replace function with new dimensions
CREATE OR REPLACE FUNCTION update_community_stats()
RETURNS trigger AS $$
DECLARE
  dims text[] := array['usage_depth','workflow','system','adaptability','builder','mindset'];
  d text;
  new_scores jsonb;
  cur_scores jsonb;
  cur_ac jsonb;
  cur_eb jsonb;
  cur_rb jsonb;
  cur_tc jsonb;
  cur_ansc jsonb;
  tool text;
  qid text;
  ans_val jsonb;
  idx text;
BEGIN
  SELECT sum_scores, archetype_counts, exposure_buckets, readiness_buckets, tool_counts, answer_counts
    INTO cur_scores, cur_ac, cur_eb, cur_rb, cur_tc, cur_ansc
    FROM community_stats WHERE id = 1 FOR UPDATE;

  new_scores := NEW.scores;

  -- Update sum_scores for new dimensions
  FOREACH d IN ARRAY dims LOOP
    cur_scores := jsonb_set(cur_scores, array[d],
      to_jsonb(coalesce((cur_scores->>d)::numeric, 0) + coalesce((new_scores->>d)::numeric, 0)));
  END LOOP;

  -- Update archetype_counts
  cur_ac := jsonb_set(cur_ac, array[NEW.archetype],
    to_jsonb(coalesce((cur_ac->>NEW.archetype)::int, 0) + 1));

  -- Update exposure_buckets
  IF NEW.exposure >= 75 THEN
    cur_eb := jsonb_set(cur_eb, '{high}', to_jsonb(coalesce((cur_eb->>'high')::int, 0) + 1));
  ELSIF NEW.exposure >= 45 THEN
    cur_eb := jsonb_set(cur_eb, '{moderate}', to_jsonb(coalesce((cur_eb->>'moderate')::int, 0) + 1));
  ELSE
    cur_eb := jsonb_set(cur_eb, '{low}', to_jsonb(coalesce((cur_eb->>'low')::int, 0) + 1));
  END IF;

  -- Update readiness_buckets
  IF NEW.readiness >= 70 THEN
    cur_rb := jsonb_set(cur_rb, '{strong}', to_jsonb(coalesce((cur_rb->>'strong')::int, 0) + 1));
  ELSIF NEW.readiness >= 40 THEN
    cur_rb := jsonb_set(cur_rb, '{building}', to_jsonb(coalesce((cur_rb->>'building')::int, 0) + 1));
  ELSE
    cur_rb := jsonb_set(cur_rb, '{early}', to_jsonb(coalesce((cur_rb->>'early')::int, 0) + 1));
  END IF;

  -- Update tool_counts
  IF array_length(NEW.tool_selections, 1) > 0 THEN
    FOREACH tool IN ARRAY NEW.tool_selections LOOP
      cur_tc := jsonb_set(cur_tc, array[tool],
        to_jsonb(coalesce((cur_tc->>tool)::int, 0) + 1));
    END LOOP;
  END IF;

  -- Update answer_counts
  IF NEW.answers IS NOT NULL THEN
    FOR qid, ans_val IN SELECT * FROM jsonb_each(NEW.answers) LOOP
      IF cur_ansc->qid IS NULL THEN
        cur_ansc := jsonb_set(cur_ansc, array[qid], '{}'::jsonb);
      END IF;
      IF jsonb_typeof(ans_val) = 'array' THEN
        FOR idx IN SELECT jsonb_array_elements_text(ans_val) LOOP
          cur_ansc := jsonb_set(cur_ansc, array[qid, idx],
            to_jsonb(coalesce((cur_ansc->qid->>idx)::int, 0) + 1));
        END LOOP;
      ELSE
        idx := ans_val #>> '{}';
        cur_ansc := jsonb_set(cur_ansc, array[qid, idx],
          to_jsonb(coalesce((cur_ansc->qid->>idx)::int, 0) + 1));
      END IF;
    END LOOP;
  END IF;

  UPDATE community_stats SET
    n = n + 1,
    sum_exposure = sum_exposure + NEW.exposure,
    sum_readiness = sum_readiness + NEW.readiness,
    sum_scores = cur_scores,
    archetype_counts = cur_ac,
    exposure_buckets = cur_eb,
    readiness_buckets = cur_rb,
    tool_counts = cur_tc,
    tool_users = tool_users + CASE WHEN array_length(NEW.tool_selections, 1) > 0 THEN 1 ELSE 0 END,
    answer_counts = cur_ansc,
    updated_at = now()
  WHERE id = 1;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recreate trigger
CREATE TRIGGER on_session_insert
  AFTER INSERT ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_community_stats();

-- 5. Optional: delete old sessions (they have old dimension names)
-- Uncomment if you want a clean start:
-- DELETE FROM sessions;
