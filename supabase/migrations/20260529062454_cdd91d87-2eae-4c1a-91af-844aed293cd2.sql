
-- emergency_requests: restrict SELECT to authenticated users only
DROP POLICY IF EXISTS "emergencies public read" ON public.emergency_requests;
CREATE POLICY "emergencies authenticated read"
ON public.emergency_requests FOR SELECT
TO authenticated
USING (true);

-- Revoke anon SELECT
REVOKE SELECT ON public.emergency_requests FROM anon;
GRANT SELECT ON public.emergency_requests TO authenticated;

-- Tighten INSERT: require either authenticated user_id match, or anonymous emergency submission with NULL user_id only
DROP POLICY IF EXISTS "emergencies anyone create" ON public.emergency_requests;
CREATE POLICY "emergencies create"
ON public.emergency_requests FOR INSERT
TO anon, authenticated
WITH CHECK (
  (auth.uid() IS NULL AND user_id IS NULL)
  OR (auth.uid() IS NOT NULL AND (user_id IS NULL OR user_id = auth.uid()))
);

-- volunteers: restrict SELECT to authenticated
DROP POLICY IF EXISTS "volunteers public read" ON public.volunteers;
CREATE POLICY "volunteers authenticated read"
ON public.volunteers FOR SELECT
TO authenticated
USING (true);
REVOKE SELECT ON public.volunteers FROM anon;
GRANT SELECT ON public.volunteers TO authenticated;

-- volunteers INSERT must be tied to auth.uid()
DROP POLICY IF EXISTS "volunteers self insert" ON public.volunteers;
CREATE POLICY "volunteers self insert"
ON public.volunteers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Remove sensitive tables from realtime publication to prevent
-- unauthorized live subscriptions (no channel-level auth in place).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'emergency_requests'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.emergency_requests';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'volunteers'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.volunteers';
  END IF;
END $$;
