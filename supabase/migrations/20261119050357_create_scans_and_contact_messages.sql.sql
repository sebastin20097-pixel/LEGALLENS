/*
# Create scans and contact_messages tables (single-tenant, no auth)

1. New Tables
- `scans`: one row per product label analysis.
  - `id` (uuid, primary key)
  - `image_name` (text, original file name of the uploaded photo)
  - `thumbnail` (text, small base64 data-URL preview of the uploaded label)
  - `product_name` (text, detected product name)
  - `manufacturer` (text, detected manufacturer)
  - `ingredients` (text, detected ingredient list)
  - `weight` (text, detected net weight / volume)
  - `expiry_date` (text, detected expiry / best-before date)
  - `compliance_score` (integer 0-100)
  - `passed_checks` (jsonb, array of checks that passed)
  - `missing_information` (jsonb, array of missing label elements)
  - `recommendations` (jsonb, array of AI-style recommendations)
  - `created_at` (timestamptz, when the scan was run)
- `contact_messages`: messages sent through the Contact page.
  - `id` (uuid, primary key)
  - `name` (text, sender name)
  - `email` (text, sender email)
  - `message` (text, message body)
  - `created_at` (timestamptz, when the message was sent)

2. Security
- Enable RLS on both tables.
- Grant SELECT/INSERT on `scans` and SELECT/INSERT on `contact_messages` to `anon` + `authenticated` (no sign-in exists; data is intentionally shared).
- Policies allow anon + authenticated SELECT and INSERT only (no UPDATE/DELETE needed).
*/

CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_name text NOT NULL DEFAULT '',
  thumbnail text,
  product_name text NOT NULL DEFAULT '',
  manufacturer text NOT NULL DEFAULT '',
  ingredients text NOT NULL DEFAULT '',
  weight text NOT NULL DEFAULT '',
  expiry_date text NOT NULL DEFAULT '',
  compliance_score integer NOT NULL DEFAULT 0 CHECK (compliance_score BETWEEN 0 AND 100),
  passed_checks jsonb NOT NULL DEFAULT '[]'::jsonb,
  missing_information jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON scans TO anon, authenticated;
GRANT SELECT, INSERT ON contact_messages TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_scans" ON scans;
CREATE POLICY "anon_select_scans" ON scans FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scans" ON scans;
CREATE POLICY "anon_insert_scans" ON scans FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_contact_messages" ON contact_messages;
CREATE POLICY "anon_select_contact_messages" ON contact_messages FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
TO anon, authenticated WITH CHECK (true);
