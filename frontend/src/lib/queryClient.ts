import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

/**
 * React Query client configuration
 * - Optimized caching strategy
 * - Global error handling
 * - Retry logic for failed queries
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      
      // Retry failed queries once
      retry: 1,
      
      // Refetch on window focus in production
      refetchOnWindowFocus: import.meta.env.PROD,
      
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      
      // Global error handler for mutations
      onError: (error) => {
        const message = error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred';
        toast.error(message);
        console.error('Mutation error:', error);
      },
    },
  },
});

/**
 * Common query keys for consistency
 */
export const queryKeys = {
  // Auth
  currentUser: ['auth', 'currentUser'] as const,
  session: ['auth', 'session'] as const,
  
  // Doctors
  doctors: {
    all: ['doctors'] as const,
    list: (filters?: { speciality?: string }) => 
      ['doctors', 'list', filters] as const,
    detail: (id: string) => ['doctors', 'detail', id] as const,
    availability: (id: string, date: string) => 
      ['doctors', 'availability', id, date] as const,
  },
  
  // Appointments
  appointments: {
    all: ['appointments'] as const,
    list: (userId: string) => ['appointments', 'list', userId] as const,
    detail: (id: string) => ['appointments', 'detail', id] as const,
    upcoming: (userId: string) => 
      ['appointments', 'upcoming', userId] as const,
    past: (userId: string) => ['appointments', 'past', userId] as const,
  },
  
  // User Profile
  profile: {
    detail: (userId: string) => ['profile', userId] as const,
  },
  
  // Notifications
  notifications: {
    all: ['notifications'] as const,
    unread: (userId: string) => ['notifications', 'unread', userId] as const,
  },
  
  // Reviews
  reviews: {
    doctor: (doctorId: string) => ['reviews', 'doctor', doctorId] as const,
  },
};
