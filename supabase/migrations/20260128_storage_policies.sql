-- Storage Policies for Fixapp
-- Apply these policies to secure Supabase Storage buckets

-- ============================================
-- AVATARS BUCKET POLICIES (Public)
-- ============================================

-- Anyone can view avatars (public bucket)
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Users can upload their own avatar
-- File path must start with their user ID
CREATE POLICY "Users upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own avatar
CREATE POLICY "Users update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own avatar
CREATE POLICY "Users delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- MEDICAL DOCUMENTS BUCKET POLICIES (Private)
-- ============================================

-- Users can view their own documents
CREATE POLICY "Users view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'medical-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can upload documents to their folder
CREATE POLICY "Users upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'medical-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own documents
CREATE POLICY "Users update own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'medical-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own documents
CREATE POLICY "Users delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'medical-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Doctors can view documents for their patients (appointments)
CREATE POLICY "Doctors view patient documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'medical-documents'
  AND EXISTS (
    SELECT 1 FROM public.appointments a
    JOIN public.doctors d ON d.id = a.doctor_id
    WHERE d.user_id = auth.uid()
    AND a.patient_id::text = (storage.foldername(name))[1]
  )
);

-- ============================================
-- PRESCRIPTIONS BUCKET POLICIES (Private)
-- ============================================

-- Doctors can upload prescriptions
-- File path must be patient_id/prescription_file
-- Requires active appointment relationship with patient
CREATE POLICY "Doctors upload prescriptions"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'prescriptions'
  AND EXISTS (
    SELECT 1 FROM public.doctors d
    JOIN public.appointments a ON a.doctor_id = d.id
    WHERE d.user_id = auth.uid()
    AND a.patient_id::text = (storage.foldername(name))[1]
  )
);

-- Doctors can view prescriptions for their patients
-- Restricted to prescriptions for patients they have appointments with
CREATE POLICY "Doctors view own prescriptions"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'prescriptions'
  AND EXISTS (
    SELECT 1 FROM public.doctors d
    JOIN public.appointments a ON a.doctor_id = d.id
    WHERE d.user_id = auth.uid()
    AND a.patient_id::text = (storage.foldername(name))[1]
  )
);

-- Patients can view their own prescriptions
-- File path first folder = patient_id
CREATE POLICY "Patients view own prescriptions"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'prescriptions'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Doctors can update prescriptions for their patients only
CREATE POLICY "Doctors update prescriptions"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'prescriptions'
  AND EXISTS (
    SELECT 1 FROM public.doctors d
    JOIN public.appointments a ON a.doctor_id = d.id
    WHERE d.user_id = auth.uid()
    AND a.patient_id::text = (storage.foldername(name))[1]
  )
);

-- Doctors can delete prescriptions for their patients only
CREATE POLICY "Doctors delete prescriptions"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'prescriptions'
  AND EXISTS (
    SELECT 1 FROM public.doctors d
    JOIN public.appointments a ON a.doctor_id = d.id
    WHERE d.user_id = auth.uid()
    AND a.patient_id::text = (storage.foldername(name))[1]
  )
);

-- ============================================
-- NOTES
-- ============================================

-- File path structure:
-- avatars: {user_id}/{timestamp}_{filename}
-- medical-documents: {user_id}/{timestamp}_{filename}
-- prescriptions: {patient_id}/{doctor_id}_{timestamp}_{filename}

-- To apply these policies:
-- 1. Ensure buckets are created first in Supabase Dashboard
-- 2. Run this migration via Supabase SQL Editor or CLI
-- 3. Test policies with different user roles

-- To create buckets (if not already created):
-- Run in Supabase SQL Editor:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES
--   ('avatars', 'avatars', true),
--   ('medical-documents', 'medical-documents', false),
--   ('prescriptions', 'prescriptions', false);
