import { PostgrestError, AuthError } from '@supabase/supabase-js';
import { toast } from 'react-toastify';

/**
 * PostgreSQL error code to user-friendly message mapping
 */
const postgresErrorMessages: Record<string, string> = {
  '23505': 'This record already exists. Please try with different information.',
  '23503': 'Related record not found. Please ensure all required data exists.',
  '23502': 'Required field is missing. Please fill in all required fields.',
  '42501': 'You do not have permission to perform this action.',
  '42P01': 'Database table not found. Please contact support.',
  'PGRST116': 'No rows found matching your criteria.',
};

/**
 * Auth error code to user-friendly message mapping
 */
const authErrorMessages: Record<string, string> = {
  'invalid_credentials': 'Invalid email or password. Please try again.',
  'email_not_confirmed': 'Please verify your email before logging in.',
  'user_not_found': 'No account found with this email.',
  'email_exists': 'An account with this email already exists.',
  'weak_password': 'Password is too weak. Please use a stronger password.',
  'invalid_grant': 'Your session has expired. Please log in again.',
};

/**
 * Handle Supabase PostgreSQL errors
 */
export const handleSupabaseError = (error: PostgrestError | null): void => {
  if (!error) return;

  const message = postgresErrorMessages[error.code] || error.message;
  toast.error(message);
  
  // Log detailed error in development
  if (import.meta.env.DEV) {
    console.error('Supabase PostgreSQL Error:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
  }
};

/**
 * Handle Supabase Auth errors
 */
export const handleAuthError = (error: AuthError | null): void => {
  if (!error) return;

  const message = authErrorMessages[error.message] || 
    authErrorMessages[error.status?.toString() || ''] ||
    error.message ||
    'Authentication failed. Please try again.';
  
  toast.error(message);
  
  // Log detailed error in development
  if (import.meta.env.DEV) {
    console.error('Supabase Auth Error:', {
      name: error.name,
      message: error.message,
      status: error.status,
    });
  }
};

/**
 * Generic error handler for any error type
 */
export const handleError = (error: unknown): void => {
  if (error instanceof Error) {
    toast.error(error.message);
    console.error('Error:', error);
  } else {
    toast.error('An unexpected error occurred');
    console.error('Unknown error:', error);
  }
};

/**
 * Check if error is a Supabase PostgreSQL error
 */
export const isPostgresError = (error: unknown): error is PostgrestError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'details' in error
  );
};

/**
 * Check if error is a Supabase Auth error
 */
export const isAuthError = (error: unknown): error is AuthError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as AuthError).name === 'AuthError'
  );
};
