# Admin Dashboard Setup

## 1. Create your admin account

Go to `/auth` and sign up with:
- Email: `david85freelance@gmail.com`
- Password: `Rys306623306623#`

Then confirm your email via the link Supabase sends.

## 2. Run this SQL in Supabase SQL Editor

Go to your Supabase project → SQL Editor → New Query, paste and run:

```sql
-- Function to return all auth users (admin only)
CREATE OR REPLACE FUNCTION get_auth_users()
RETURNS TABLE (
  id uuid,
  email text,
  name text,
  last_sign_in timestamptz,
  ip text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    au.id,
    au.email::text,
    COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', 'N/A')::text AS name,
    au.last_sign_in_at AS last_sign_in,
    COALESCE(
      (au.raw_app_meta_data->>'ip_address')::text,
      'N/A'
    ) AS ip
  FROM auth.users au
  ORDER BY au.last_sign_in_at DESC NULLS LAST;
END;
$$;
```

## 3. Access the admin page

Navigate to `/admin` — it will redirect to `/auth` if you're not logged in.
Only `david85freelance@gmail.com` can access it.
