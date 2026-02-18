import { z } from 'zod';

// Common validation patterns
const emailSchema = z.string()
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must not exceed 255 characters')
  .toLowerCase()
  .trim();

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional();

const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must not exceed 100 characters')
  .trim();

const addressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required').max(255),
  line2: z.string().max(255).optional().default(''),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  zip: z.string().regex(/^\d{5,10}$/, 'Invalid ZIP code')
});

// Auth schemas
export const registerSchema = z.object({
  full_name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  role: z.enum(['patient', 'doctor', 'admin']).optional().default('patient')
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  full_name: nameSchema.optional(),
  phone: phoneSchema,
  date_of_birth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  address: addressSchema.optional(),
  profile_image_url: z.string().url('Invalid image URL').optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirm password is required')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Appointment schemas
export const bookAppointmentSchema = z.object({
  doctor_id: z.string().uuid('Invalid doctor ID'),
  appointment_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const appointmentDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return appointmentDate >= today;
    }, 'Appointment date cannot be in the past'),
  appointment_time: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),
  symptoms: z.string().max(500, 'Symptoms must not exceed 500 characters').optional()
});

export const updateAppointmentSchema = z.object({
  status: z.enum(['scheduled', 'completed', 'cancelled', 'no_show']).optional(),
  notes: z.string().max(1000, 'Notes must not exceed 1000 characters').optional(),
  prescription: z.string().max(2000, 'Prescription must not exceed 2000 characters').optional(),
  cancelled_reason: z.string().max(500, 'Cancellation reason must not exceed 500 characters').optional()
});

// Doctor schemas
export const addDoctorSchema = z.object({
  full_name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  medical_license: z.string()
    .min(5, 'Medical license number is required')
    .max(50, 'Medical license number must not exceed 50 characters'),
  speciality: z.string()
    .min(2, 'Speciality is required')
    .max(100, 'Speciality must not exceed 100 characters'),
  degree: z.string()
    .min(2, 'Degree is required')
    .max(100, 'Degree must not exceed 100 characters'),
  experience_years: z.number()
    .int('Experience must be a whole number')
    .min(0, 'Experience cannot be negative')
    .max(70, 'Invalid experience years'),
  about: z.string()
    .max(1000, 'About section must not exceed 1000 characters')
    .optional(),
  consultation_fee: z.number()
    .positive('Consultation fee must be positive')
    .max(100000, 'Consultation fee seems too high'),
  office_address: addressSchema
});

export const updateDoctorSchema = z.object({
  about: z.string().max(1000).optional(),
  consultation_fee: z.number().positive().max(100000).optional(),
  is_available: z.boolean().optional(),
  office_address: addressSchema.optional()
});

// Payment schemas
export const createPaymentOrderSchema = z.object({
  appointment_id: z.string().uuid('Invalid appointment ID'),
  amount: z.number()
    .positive('Amount must be positive')
    .max(100000, 'Amount too high')
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, 'Order ID is required'),
  razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
  razorpay_signature: z.string().min(1, 'Signature is required'),
  appointment_id: z.string().uuid('Invalid appointment ID')
});

// Review schemas
export const addReviewSchema = z.object({
  doctor_id: z.string().uuid('Invalid doctor ID'),
  appointment_id: z.string().uuid('Invalid appointment ID'),
  rating: z.number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must not exceed 5'),
  review_text: z.string()
    .max(1000, 'Review must not exceed 1000 characters')
    .optional()
});

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.string()
    .regex(/^\d+$/, 'Page must be a number')
    .transform(Number)
    .refine(val => val >= 1, 'Page must be at least 1')
    .optional()
    .default('1'),
  limit: z.string()
    .regex(/^\d+$/, 'Limit must be a number')
    .transform(Number)
    .refine(val => val >= 1 && val <= 100, 'Limit must be between 1 and 100')
    .optional()
    .default('10')
});

export const doctorFilterSchema = z.object({
  speciality: z.string().max(100).optional(),
  is_available: z.string()
    .transform(val => val === 'true')
    .optional(),
  min_rating: z.string()
    .regex(/^\d+(\.\d+)?$/)
    .transform(Number)
    .refine(val => val >= 0 && val <= 5)
    .optional()
}).merge(paginationSchema);

export const appointmentFilterSchema = z.object({
  status: z.enum(['scheduled', 'completed', 'cancelled', 'no_show']).optional(),
  from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
}).merge(paginationSchema);

// Export type inference helpers
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;
export type AddDoctorInput = z.infer<typeof addDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
export type CreatePaymentOrderInput = z.infer<typeof createPaymentOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type AddReviewInput = z.infer<typeof addReviewSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type DoctorFilterInput = z.infer<typeof doctorFilterSchema>;
export type AppointmentFilterInput = z.infer<typeof appointmentFilterSchema>;
