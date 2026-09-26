-- Emails approved for lifetime access before they create a password.
-- Signup still creates the Auth user. The app applies this row on signup and login.

CREATE TABLE IF NOT EXISTS lifetime_invites (
  email TEXT PRIMARY KEY,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ
);

ALTER TABLE lifetime_invites ENABLE ROW LEVEL SECURITY;

INSERT INTO lifetime_invites (email, note)
VALUES
  ('takkyz@gmail.com', '預先開通終身會員'),
  ('ytceddie@gmail.com', '預先開通終身會員'),
  ('ithmanhk@yahoo.com', '預先開通終身會員'),
  ('kenchankh@gmail.com', '預先開通終身會員'),
  ('stephenland@gmail.com', '預先開通終身會員'),
  ('hkk909@gmail.com', '預先開通終身會員'),
  ('wongwmhk@gmail.com', '預先開通終身會員'),
  ('cw9102013@gmail.com', '預先開通終身會員'),
  ('frankitong.2020@gmail.com', '預先開通終身會員'),
  ('mtlifelearner@gmail.com', '預先開通終身會員'),
  ('derrickleeinfo@gmail.com', '預先開通終身會員'),
  ('hitaitools@gmail.com', '預先開通終身會員'),
  ('smcczjf@gmail.com', '預先開通終身會員'),
  ('candyshch@hotmail.com', '預先開通終身會員'),
  ('jocelynwongjud@yahoo.com.hk', '預先開通終身會員'),
  ('ivancwlaw@yahoo.com.hk', '預先開通終身會員'),
  ('kelvinhhli@hotmail.com', '預先開通終身會員'),
  ('luenmo@gmail.com', '預先開通終身會員'),
  ('kelvinmak88@gmail.com', '預先開通終身會員'),
  ('jeffreykblau@gmail.com', '預先開通終身會員'),
  ('humaeks@gmail.com', '預先開通終身會員'),
  ('vincentlamhk@gmail.com', '預先開通終身會員'),
  ('extremeripper@yahoo.com', '預先開通終身會員'),
  ('averychong168@gmail.com', '預先開通終身會員'),
  ('tequilakwyu@yahoo.com.hk', '預先開通終身會員')
ON CONFLICT (email) DO NOTHING;

UPDATE members
SET email = lower(email)
WHERE lower(email) IN (SELECT email FROM lifetime_invites)
  AND email <> lower(email)
  AND NOT EXISTS (
    SELECT 1 FROM members other WHERE other.email = lower(members.email) AND other.id <> members.id
  );

INSERT INTO members (email, name, plan, status, notes)
SELECT email, 'Member', 'academy', 'active', '預先開通終身會員'
FROM lifetime_invites
WHERE NOT EXISTS (
  SELECT 1 FROM members WHERE lower(members.email) = lifetime_invites.email
);

UPDATE members
SET
  plan = CASE WHEN plan = 'enterprise' THEN plan ELSE 'academy' END,
  status = 'active',
  notes = CASE
    WHEN notes IS NULL OR notes = '' THEN '預先開通終身會員'
    WHEN notes LIKE '%預先開通終身會員%' THEN notes
    ELSE notes || ' · 預先開通終身會員'
  END
WHERE lower(email) IN (SELECT email FROM lifetime_invites);

UPDATE profiles
SET is_lifetime_member = true
WHERE lower(email) IN (SELECT email FROM lifetime_invites);
