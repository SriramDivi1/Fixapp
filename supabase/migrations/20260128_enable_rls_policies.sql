-- Row Level Security (RLS) Policies for Fixapp

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow user registration
CREATE POLICY "Allow user registration" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Doctors Policies
-- Anyone can view active doctors (for patient booking)
CREATE POLICY "Anyone can view active doctors" ON public.doctors
  FOR SELECT USING (is_available = true);

-- Doctors can view their own profile
CREATE POLICY "Doctors can view own profile" ON public.doctors
  FOR SELECT USING (user_id = auth.uid());

-- Doctors can update their own profile
CREATE POLICY "Doctors can update own profile" ON public.doctors
  FOR UPDATE USING (user_id = auth.uid());

-- Admins can manage all doctors
CREATE POLICY "Admins can manage doctors" ON public.doctors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Appointments Policies
-- Patients can view their own appointments
CREATE POLICY "Patients can view own appointments" ON public.appointments
  FOR SELECT USING (patient_id = auth.uid());

-- Doctors can view their appointments
CREATE POLICY "Doctors can view own appointments" ON public.appointments
  FOR SELECT USING (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE user_id = auth.uid()
    )
  );

-- Patients can create appointments
CREATE POLICY "Patients can create appointments" ON public.appointments
  FOR INSERT WITH CHECK (patient_id = auth.uid());

-- Patients can update their own appointments (for cancellation)
CREATE POLICY "Patients can update own appointments" ON public.appointments
  FOR UPDATE USING (patient_id = auth.uid());

-- Doctors can update their appointments
CREATE POLICY "Doctors can update appointments" ON public.appointments
  FOR UPDATE USING (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE user_id = auth.uid()
    )
  );

-- Admins can view and manage all appointments
CREATE POLICY "Admins can manage appointments" ON public.appointments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Doctor Slots Policies
-- Anyone can view available slots
CREATE POLICY "Anyone can view available slots" ON public.doctor_slots
  FOR SELECT USING (is_available = true);

-- Doctors can manage their own slots
CREATE POLICY "Doctors can manage own slots" ON public.doctor_slots
  FOR ALL USING (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE user_id = auth.uid()
    )
  );

-- Notifications Policies
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Only service role (backend) or admins can create notifications
-- This prevents users from creating fake notifications for other users
CREATE POLICY "Service role can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role' 
    OR EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Reviews Policies
-- Anyone can view reviews (for doctor ratings)
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

-- Patients can create reviews for their completed appointments
CREATE POLICY "Patients can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (
    patient_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.appointments 
      WHERE id = appointment_id 
      AND patient_id = auth.uid() 
      AND status = 'completed'
    )
  );

-- Patients can update their own reviews
CREATE POLICY "Patients can update own reviews" ON public.reviews
  FOR UPDATE USING (patient_id = auth.uid());