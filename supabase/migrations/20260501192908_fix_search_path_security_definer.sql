/*
  # Fix search_path vulnerability on SECURITY DEFINER functions

  1. Security Issue
    - `handle_new_user()` and `handle_new_user_role()` are SECURITY DEFINER
      functions but do not set `search_path`. This allows an attacker who can
      create objects in other schemas to hijack unqualified table references
      (e.g., a malicious `profiles` table in a writable schema could be
      resolved before the real `public.profiles`).
    - `has_role()` already had `SET search_path TO 'public'` — no change needed.

  2. Changes
    - Recreate `handle_new_user()` with `SET search_path TO 'public'`
    - Recreate `handle_new_user_role()` with `SET search_path TO 'public'`
    - Both functions retain SECURITY DEFINER (required for trigger execution
      that bypasses RLS) but now have a locked search_path to prevent
      schema-qualification attacks.

  3. Important Notes
    - 1) The `search_path = 'public'` ensures only the `public` schema is
      searched for unqualified identifiers, eliminating the attack vector.
    - 2) All table references inside these functions already use
      `public.`-qualified names, but the explicit search_path is a
      defense-in-depth measure.
    - 3) Triggers on `auth.users` and `public.profiles` are unaffected —
      they reference the functions by OID, not by name.
*/

-- Fix handle_new_user: add SET search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Fix handle_new_user_role: add SET search_path
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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
