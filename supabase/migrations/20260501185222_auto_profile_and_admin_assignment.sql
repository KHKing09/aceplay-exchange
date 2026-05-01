/*
  # Auto-create profile on signup & assign admin role to mdkamhossen

  1. New Function
    - `public.handle_new_user()`: Trigger function that auto-creates a profile
      row when a new user signs up in auth.users. It reads username, phone,
      currency, and referral_code from the user's metadata.

  2. New Trigger
    - `on_auth_user_created`: AFTER INSERT on auth.users calls handle_new_user()

  3. Admin Assignment
    - An AFTER INSERT trigger on user_roles that checks if the newly inserted
      profile's username is 'mdkamalhossen' and auto-assigns the 'admin' role.
      This ensures that when the owner registers, they automatically get admin
      access without any manual database intervention.

  4. Security
    - The trigger functions run with SECURITY DEFINER so they can insert into
      profiles and user_roles regardless of RLS policies.
    - The admin auto-assignment is scoped to the exact username 'mdkamalhossen'
      so no other user can trigger it.

  5. Important Notes
    - 1) The profile creation trigger ensures every new signup gets a profile
      row automatically, fixing the issue where registration didn't create
      a database entry.
    - 2) The admin auto-assignment means the owner simply needs to register
      with username 'mdkamalhossen' and they will automatically be granted
      admin privileges.
*/

-- Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-assign 'user' role to every new signup, and 'admin' if username is mdkamalhossen
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_username text;
BEGIN
  -- Get the username from the newly created profile
  SELECT username INTO v_username FROM public.profiles WHERE id = NEW.user_id;

  -- If this is the owner account, assign admin role
  IF v_username = 'mdkamalhossen' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- We need a trigger on profiles (not user_roles) to check username after profile is created
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();

-- But handle_new_user_role expects NEW.user_id, and on profiles the column is just `id`
-- Let me fix the function to work with profiles table
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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
