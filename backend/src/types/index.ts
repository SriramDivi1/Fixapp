export type UserRole = 'patient' | 'doctor' | 'admin';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  gender: Gender;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
  profile_image_url?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  medical_license: string;
  speciality: string;
  degree: string;
  experience_years: number;
  about?: string;
  consultation_fee: number;
  is_available: boolean;
  office_address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
  working_hours: Record<string, { start: string; end: string } | { closed: true }>;
  rating: number;
  total_reviews: number;
  verified_at?: string;
  created_at: string;
  updated_at: string;
  user_profile?: UserProfile;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: AppointmentStatus;
  symptoms?: string;
  notes?: string;
  prescription?: string;
  consultation_fee: number;
  payment_status: PaymentStatus;
  payment_id?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  cancelled_reason?: string;
  cancelled_by?: string;
  cancelled_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  patient?: UserProfile;
  doctor?: Doctor;
}

export interface DoctorSlot {
  id: string;
  doctor_id: string;
  date: string;
  time_slot: string;
  is_available: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  appointment_id?: string;
  created_at: string;
}

export interface Review {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Request types
export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface BookAppointmentRequest {
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  symptoms?: string;
}

export interface AddDoctorRequest {
  full_name: string;
  email: string;
  phone?: string;
  medical_license: string;
  speciality: string;
  degree: string;
  experience_years: number;
  about?: string;
  consultation_fee: number;
  office_address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
}