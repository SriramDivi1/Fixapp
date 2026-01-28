-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE gender AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender gender DEFAULT 'prefer_not_to_say',
  address JSONB DEFAULT '{"line1": "", "line2": "", "city": "", "state": "", "zip": ""}',
  profile_image_url TEXT,
  role user_role NOT NULL DEFAULT 'patient',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors table
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  medical_license TEXT NOT NULL UNIQUE,
  speciality TEXT NOT NULL,
  degree TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  about TEXT,
  consultation_fee DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  office_address JSONB NOT NULL,
  working_hours JSONB DEFAULT '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}, "saturday": {"start": "09:00", "end": "13:00"}, "sunday": {"closed": true}}',
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status appointment_status DEFAULT 'scheduled',
  symptoms TEXT,
  notes TEXT,
  prescription TEXT,
  consultation_fee DECIMAL(10,2) NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  payment_id TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  cancelled_reason TEXT,
  cancelled_by UUID REFERENCES public.user_profiles(id),
  cancelled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure no double booking
  UNIQUE(doctor_id, appointment_date, appointment_time)
);

-- Doctor availability slots
CREATE TABLE public.doctor_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slot TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(doctor_id, date, time_slot)
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  appointment_id UUID REFERENCES public.appointments(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews and ratings
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One review per appointment
  UNIQUE(appointment_id)
);

-- Create indexes for better performance
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_doctor_slots_doctor_date ON public.doctor_slots(doctor_id, date);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX idx_doctors_speciality ON public.doctors(speciality);
CREATE INDEX idx_doctors_available ON public.doctors(is_available);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();