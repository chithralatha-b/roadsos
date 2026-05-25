
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  blood_group TEXT,
  allergies TEXT,
  emergency_contact TEXT,
  language TEXT DEFAULT 'English',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Volunteers (publicly listable for emergency discovery)
CREATE TABLE public.volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  area TEXT,
  skills TEXT[] DEFAULT '{}',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  available BOOLEAN NOT NULL DEFAULT true,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "volunteers public read" ON public.volunteers FOR SELECT USING (true);
CREATE POLICY "volunteers self insert" ON public.volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "volunteers self update" ON public.volunteers FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Emergency requests
CREATE TABLE public.emergency_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT,
  phone TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  address TEXT,
  severity TEXT DEFAULT 'critical',
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.emergency_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "emergencies public read" ON public.emergency_requests FOR SELECT USING (true);
CREATE POLICY "emergencies anyone create" ON public.emergency_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "emergencies owner update" ON public.emergency_requests FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.volunteers;
