-- Drop existing function first
DROP FUNCTION IF EXISTS get_auth_users();

-- Table to store user login metadata (IP, location, etc.)
CREATE TABLE IF NOT EXISTS public.user_logins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  ip_address text,
  city text,
  country text,
  region text,
  logged_at timestamptz DEFAULT now()
);

-- Allow the edge function (service role) to insert
ALTER TABLE public.user_logins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert" ON public.user_logins
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can select" ON public.user_logins
  FOR SELECT USING (true);

-- Updated get_auth_users function that joins login metadata
CREATE OR REPLACE FUNCTION get_auth_users()
RETURNS TABLE (
  id uuid,
  email text,
  name text,
  last_sign_in timestamptz,
  ip text,
  city text,
  country text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (au.id)
    au.id,
    au.email::text,
    COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', 'N/A')::text AS name,
    au.last_sign_in_at AS last_sign_in,
    COALESCE(ul.ip_address, 'N/A')::text AS ip,
    COALESCE(ul.city, 'Unknown')::text AS city,
    COALESCE(ul.country, 'Unknown')::text AS country
  FROM auth.users au
  LEFT JOIN public.user_logins ul ON ul.user_id = au.id
  ORDER BY au.id, ul.logged_at DESC NULLS LAST;
END;
$$;


-- Job applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  job_title text,
  cover_letter text,
  preferred_location text,
  referral text,
  keep_for_future boolean DEFAULT false,
  resume_url text,
  submitted_at timestamptz DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON public.job_applications USING (true) WITH CHECK (true);

-- Contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  company text,
  subject text,
  message text NOT NULL,
  sent_at timestamptz DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role contact access" ON public.contact_messages USING (true) WITH CHECK (true);

-- Resumes storage bucket (careers page uploads)
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow anonymous uploads from the careers page (anon key)
CREATE POLICY "Allow anon upload resumes"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'resumes');

-- Allow public read (resume links in notification emails)
CREATE POLICY "Allow public read resumes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resumes');
