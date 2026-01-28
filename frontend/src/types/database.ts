/**
 * Custom TypeScript types for domain models
 * These complement the auto-generated Supabase types
 */

export type UserRole = 'patient' | 'doctor' | 'admin';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface WorkingHours {
  monday?: { start: string; end: string; closed?: boolean };
  tuesday?: { start: string; end: string; closed?: boolean };
  wednesday?: { start: string; end: string; closed?: boolean };
  thursday?: { start: string; end: string; closed?: boolean };
  friday?: { start: string; end: string; closed?: boolean };
  saturday?: { start: string; end: string; closed?: boolean };
  sunday?: { start: string; end: string; closed?: boolean };
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  gender: Gender;
  address: Address;
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
  office_address: Address;
  working_hours: WorkingHours;
  rating: number;
  total_reviews: number;
  verified_at?: string;
  created_at: string;
  updated_at: string;
  user_profiles?: UserProfile;
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
  doctor?: Doctor;
  patient?: UserProfile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
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

/**
 * API Response types
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Payment types
 */
export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
