-- ==============================================================================
-- SUPABASE DATABASE SETUP FOR A1 DENTAL CARE APPOINTMENT BOOKING
-- Project ID: krrmzaitkplnuuamoapt
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/krrmzaitkplnuuamoapt/sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  reference_code TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email TEXT,
  service_id TEXT,
  service_name TEXT NOT NULL,
  patient_type TEXT DEFAULT 'new',
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'Pending',
  clinic_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 1. Policy: Allow patients to book appointments (Insert)
CREATE POLICY "Allow public insert for bookings" 
ON public.appointments 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 2. Policy: Allow reading appointments
CREATE POLICY "Allow read access for appointments" 
ON public.appointments 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- 3. Policy: Allow staff to update appointments (Status, notes, rescheduling)
CREATE POLICY "Allow update for appointments" 
ON public.appointments 
FOR UPDATE 
TO anon, authenticated 
USING (true);

-- Optional index for faster date queries
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
