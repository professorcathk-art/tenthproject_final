-- Lifetime Stripe checkout fields on profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_lifetime_member BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

CREATE INDEX IF NOT EXISTS profiles_stripe_session_id_idx ON profiles (stripe_session_id);
CREATE INDEX IF NOT EXISTS profiles_is_lifetime_member_idx ON profiles (is_lifetime_member);

-- Members cannot self-upgrade via the Data API
CREATE OR REPLACE FUNCTION public.protect_lifetime_profile_columns()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF COALESCE(auth.role(), '') = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.is_lifetime_member := false;
    NEW.stripe_customer_id := NULL;
    NEW.stripe_session_id := NULL;
  ELSE
    NEW.is_lifetime_member := OLD.is_lifetime_member;
    NEW.stripe_customer_id := OLD.stripe_customer_id;
    NEW.stripe_session_id := OLD.stripe_session_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_lifetime_profile_columns ON profiles;
CREATE TRIGGER protect_lifetime_profile_columns
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_lifetime_profile_columns();
