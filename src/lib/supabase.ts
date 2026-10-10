import { createClient } from '@supabase/supabase-js';
import { Appointment } from '../types';

export const SUPABASE_PROJECT_ID = 'krrmzaitkplnuuamoapt';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://krrmzaitkplnuuamoapt.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Jfau-zvQXSfK8KiuB0chBQ_kOPmUnKA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_SQL_SCHEMA = `-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql)
-- It creates the appointments table with Row Level Security enabled for public booking.

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

-- Enable Row Level Security
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow public bookings (insert without login)
CREATE POLICY "Allow public insert for bookings" 
ON public.appointments 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow reading appointments
CREATE POLICY "Allow read access for appointments" 
ON public.appointments 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow updating appointments (status, notes, rescheduling)
CREATE POLICY "Allow update for appointments" 
ON public.appointments 
FOR UPDATE 
TO anon, authenticated 
USING (true);
`;

export interface SupabaseHealth {
  connected: boolean;
  tableExists: boolean;
  error?: string;
  projectId: string;
}

/**
 * Checks connection to Supabase and tests whether the 'appointments' table is ready
 */
export async function checkSupabaseHealth(): Promise<SupabaseHealth> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('schema cache') || error.message.includes('does not exist')) {
        return {
          connected: true,
          tableExists: false,
          error: "Table 'appointments' not found in database. Please run the SQL schema in your Supabase SQL Editor.",
          projectId: SUPABASE_PROJECT_ID,
        };
      }
      return {
        connected: false,
        tableExists: false,
        error: error.message,
        projectId: SUPABASE_PROJECT_ID,
      };
    }

    return {
      connected: true,
      tableExists: true,
      projectId: SUPABASE_PROJECT_ID,
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      error: err?.message || 'Network error reaching Supabase',
      projectId: SUPABASE_PROJECT_ID,
    };
  }
}

/**
 * Insert an appointment into Supabase
 */
export async function insertAppointmentToSupabase(apt: Appointment): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      id: apt.id,
      reference_code: apt.referenceCode,
      patient_name: apt.patientName,
      mobile_number: apt.mobileNumber,
      email: apt.email || null,
      service_id: apt.serviceId,
      service_name: apt.serviceName,
      patient_type: apt.patientType,
      appointment_date: apt.date,
      time_slot: apt.timeSlot,
      notes: apt.notes || null,
      status: apt.status,
      clinic_notes: apt.clinicNotes || null,
      created_at: apt.createdAt || new Date().toISOString(),
    };

    const { error } = await supabase.from('appointments').insert([payload]);

    if (error) {
      console.warn('Supabase insert warning:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase insert exception:', err);
    return { success: false, error: err?.message || 'Failed to insert to Supabase' };
  }
}

/**
 * Update appointment in Supabase (supports full editing of patient, service, date, notes, status)
 */
export async function updateAppointmentInSupabase(
  id: string,
  updates: Partial<Appointment>
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: Record<string, any> = {};
    if (updates.patientName !== undefined) payload.patient_name = updates.patientName;
    if (updates.mobileNumber !== undefined) payload.mobile_number = updates.mobileNumber;
    if (updates.email !== undefined) payload.email = updates.email || null;
    if (updates.serviceName !== undefined) payload.service_name = updates.serviceName;
    if (updates.serviceId !== undefined) payload.service_id = updates.serviceId;
    if (updates.patientType !== undefined) payload.patient_type = updates.patientType;
    if (updates.date !== undefined) payload.appointment_date = updates.date;
    if (updates.timeSlot !== undefined) payload.time_slot = updates.timeSlot;
    if (updates.notes !== undefined) payload.notes = updates.notes || null;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.clinicNotes !== undefined) payload.clinic_notes = updates.clinicNotes || null;

    const { error } = await supabase
      .from('appointments')
      .update(payload)
      .eq('id', id);

    if (error) {
      console.warn('Supabase update warning:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update in Supabase' };
  }
}

/**
 * Delete appointment from Supabase database
 */
export async function deleteAppointmentFromSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Supabase delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete from Supabase' };
  }
}

/**
 * Fetch all appointments from Supabase
 */
export async function fetchAppointmentsFromSupabase(): Promise<{ appointments: Appointment[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { appointments: [], error: error.message };
    }

    if (!data) return { appointments: [] };

    const mapped: Appointment[] = data.map((row: any) => ({
      id: row.id || `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      referenceCode: row.reference_code || row.referenceCode || 'A1-0000',
      patientName: row.patient_name || row.patientName || 'Anonymous Patient',
      mobileNumber: row.mobile_number || row.mobileNumber || '',
      email: row.email || undefined,
      serviceId: row.service_id || row.serviceId || 'srv-1',
      serviceName: row.service_name || row.serviceName || 'General Dental Care',
      patientType: (row.patient_type || row.patientType || 'new') as 'new' | 'existing',
      date: row.appointment_date || row.date || '',
      timeSlot: row.time_slot || row.timeSlot || '',
      notes: row.notes || undefined,
      status: (row.status || 'Pending') as Appointment['status'],
      createdAt: row.created_at || new Date().toISOString(),
      clinicNotes: row.clinic_notes || row.clinicNotes || undefined,
    }));

    return { appointments: mapped };
  } catch (err: any) {
    return { appointments: [], error: err?.message || 'Failed to fetch from Supabase' };
  }
}
