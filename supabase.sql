-- Run this script in the Supabase SQL Editor to create your database tables

CREATE TABLE agreements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name text NOT NULL,
  company_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  provider_name text NOT NULL DEFAULT 'HackArena Representative',
  provider_signature text,
  user_id text,
  org_id text,
  project_name text NOT NULL,
  project_type text NOT NULL,
  description text NOT NULL,
  deliverables text NOT NULL,
  start_date date NOT NULL,
  completion_date date NOT NULL,
  total_cost numeric NOT NULL,
  advance_payment numeric NOT NULL,
  payment_schedule text NOT NULL,
  included_features text NOT NULL,
  ownership text NOT NULL,
  status text DEFAULT 'Draft' NOT NULL, -- Draft, Pending, Signed
  client_signature text, -- base64 image data
  signed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Turn on Row Level Security (RLS) but allow anonymous access for this prototype
-- In a real app with Clerk auth, you would lock this down to authenticated users only.
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access" ON agreements FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON agreements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON agreements FOR UPDATE USING (true);

-- Profiles table for SaaS Multi-tenancy (Agency Branding)
CREATE TABLE profiles (
  owner_id text PRIMARY KEY,
  agency_name text NOT NULL DEFAULT 'Sign'
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON profiles FOR UPDATE USING (true);

-- Phase 9 Additions
ALTER TABLE agreements ADD COLUMN IF NOT EXISTS client_ip text;
