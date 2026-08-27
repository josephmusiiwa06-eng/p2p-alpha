-- 003_auth_trigger.sql

-- Ensure we are working with the public schema
SET search_path TO public;

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
DECLARE
  default_school_id UUID;
  default_campus_id UUID;
BEGIN
  -- Grab the seeded school and campus IDs to assign the new user to
  SELECT id INTO default_school_id FROM public.schools LIMIT 1;
  SELECT id INTO default_campus_id FROM public.campuses WHERE school_id = default_school_id LIMIT 1;

  INSERT INTO public.profiles (id, full_name, role, school_id, campus_id)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'), 
    COALESCE(new.raw_user_meta_data->>'role', 'teacher'),
    default_school_id,
    default_campus_id
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
