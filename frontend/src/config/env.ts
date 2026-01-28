import { z } from 'zod';

/**
 * Environment variable schema validation
 * Ensures all required environment variables are present at runtime
 */
const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  VITE_BACKEND_URL: z.string().url('Invalid backend URL'),
  VITE_RAZORPAY_KEY_ID: z.string().min(1, 'Razorpay key ID is required'),
});

/**
 * Validated environment variables
 * Will throw an error during build/runtime if validation fails
 */
export const env = envSchema.parse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  VITE_RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID,
});

/**
 * Helper to check if running in development mode
 */
export const isDevelopment = import.meta.env.DEV;

/**
 * Helper to check if running in production mode
 */
export const isProduction = import.meta.env.PROD;
