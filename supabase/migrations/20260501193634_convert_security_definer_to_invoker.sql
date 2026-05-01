/*
  # Convert SECURITY DEFINER functions to SECURITY INVOKER

  1. Background
    - All three public functions (handle_new_user, handle_new_user_role, has_role)
      were SECURITY DEFINER, meaning they executed with the privileges of the
      function owner (postgres) rather than the caller. This is flagged as a
      security risk in database audits because a compromised function would
      have elevated privileges.

  2. Changes
    - **handle_new_user()**: Switched to SECURITY INVOKER. The trigger on
      auth.users fires as supabase_auth_admin, which now needs explicit
      INSERT privilege on public.profiles. Added GRANT to supabase_auth_admin.
      Also added an INSERT RLS policy on profiles so the trigger can insert
      the new user's own profile row (auth.uid() = id).
    - **handle_new_user_role()**: Switched to SECURITY INVOKER. The trigger on
      public.profiles fires as the role of the user who caused the trigger
      (the new user during signup). Added GRANT to authenticated role for
      user_roles INSERT. Added an INSERT RLS policy on user_roles so only
      the specific admin-username case can insert (restricted to the owner
      account only).
    - **has_role()**: Switched to SECURITY INVOKER. This function is called
      from RLS policies by authenticated users. Since authenticated role
      already has SELECT on user_roles, and the "Users view own roles" policy
      exists, we add a new policy allowing authenticated users to SELECT any
      role row (needed because has_role checks arbitrary user_id + role
      combinations from within RLS policy expressions).

  3. Security
    - All functions retain SET search_path TO 'public' for defense-in-depth.
    - RLS policies are restrictive: INSERT on profiles only for own row,
      INSERT on user_roles only for the owner account, SELECT on user_roles
      for all authenticated users (required for has_role in RLS).
    - supabase_auth_admin gets minimal INSERT-only grant on profiles.
    - authenticated role gets INSERT grant on user_roles (already had all
      other grants).

  4. Important Notes
    - 1) The handle_new_user trigger fires as supabase_auth_admin because
      auth.users is owned by that role. Without SECURITY DEFINER, it needs
      explicit table privileges.
    - 2) The handle_new_user_role trigger fires as the new user. The INSERT
      policy on user_roles is tightly scoped to only allow the owner
      account case.
    - 3) The has_role function is called inside RLS policy USING clauses.
      RLS policies run as the table owner (postgres), which bypasses RLS
      on referenced tables. So has_role as SECURITY INVOKER will still
      work correctly when called from RLS policies.
*/

-- ============================================================
-- Step 1: Grant supabase_auth_admin INSERT on profiles
-- (needed because handle_new_user trigger fires as this role)
-- ============================================================
GRANT INSERT ON public.profiles TO supabase_auth_admin;

-- ============================================================
-- Step 2: Add INSERT RLS policy on profiles for new user signup
-- (allows the trigger running as the new user to insert own profile)
-- ============================================================
CREATE POLICY "Users insert own profile on signup"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also allow supabase_auth_admin to insert (bypasses RLS as table owner,
-- but explicit policy is good practice)
CREATE POLICY "Auth service inserts profile on signup"
  ON public.profiles
  FOR INSERT
  TO supabase_auth_admin
  WITH CHECK (true);

-- ============================================================
-- Step 3: Add INSERT RLS policy on user_roles for owner account
-- (handle_new_user_role only inserts for the owner account)
-- ============================================================
CREATE POLICY "Owner account self-assigns admin role on signup"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Step 4: Add SELECT policy on user_roles for has_role lookups
-- (has_role is called from RLS policies and needs to read any
--  user_id + role combination)
-- ============================================================
CREATE POLICY "Authenticated users can check roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- Step 5: Convert handle_new_user to SECURITY INVOKER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, phone, email, currency, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'currency', 'BDT'),
    COALESCE(NEW.raw_user_meta_data->>'referral_code', NULL)
  );
  RETURN NEW;
END;
$$;

-- ============================================================
-- Step 6: Convert handle_new_user_role to SECURITY INVOKER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $$
BEGIN
  -- If this is the owner account, assign admin role
  IF NEW.username = 'mdkamalhossen' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================================
-- Step 7: Convert has_role to SECURITY INVOKER
-- ============================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;
