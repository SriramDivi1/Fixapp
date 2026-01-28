import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Doctor } from '@/types/database';
import { handleSupabaseError } from '@/utils/handleSupabaseError';

export const DOCTORS_QUERY_KEY = 'doctors';

interface UseDoctorsOptions {
  speciality?: string;
  availableOnly?: boolean;
}

/**
 * Custom hook to fetch doctors with React Query
 * 
 * Features:
 * - Automatic caching and refetching
 * - Filter by speciality
 * - Filter by availability
 * - Error handling with user-friendly messages
 * 
 * @example
 * ```tsx
 * const { data: doctors, isLoading, error } = useDoctors({ availableOnly: true });
 * 
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error loading doctors</div>;
 * 
 * return doctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} />);
 * ```
 */
export const useDoctors = (options: UseDoctorsOptions = {}): UseQueryResult<Doctor[], Error> => {
  const { speciality, availableOnly = false } = options;

  return useQuery({
    queryKey: [DOCTORS_QUERY_KEY, { speciality, availableOnly }],
    queryFn: async () => {
      let query = supabase
        .from('doctors')
        .select('*')
        .order('full_name', { ascending: true });

      // Apply filters
      if (speciality) {
        query = query.eq('specialization', speciality);
      }

      if (availableOnly) {
        query = query.eq('is_available', true);
      }

      const { data, error } = await query;

      if (error) {
        handleSupabaseError(error);
        throw error;
      }

      return data as Doctor[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (garbage collection time)
  });
};

/**
 * Hook to fetch a single doctor by ID
 * 
 * @param doctorId - The ID of the doctor to fetch
 */
export const useDoctor = (doctorId?: string): UseQueryResult<Doctor | null, Error> => {
  return useQuery({
    queryKey: [DOCTORS_QUERY_KEY, doctorId],
   queryFn: async () => {
      if (!doctorId) return null;

      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', doctorId)
        .single();

      if (error) {
        handleSupabaseError(error);
        throw error;
      }

      return data as Doctor;
    },
    enabled: !!doctorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to get list of all unique specialities
 */
export const useDoctorSpecialities = (): UseQueryResult<string[], Error> => {
  return useQuery({
    queryKey: [DOCTORS_QUERY_KEY, 'specialities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('specialization');

      if (error) {
        handleSupabaseError(error);
        throw error;
      }

      // Extract unique specialities
      const specialities = [...new Set(data.map(d => d.specialization))];
      return specialities.filter(Boolean) as string[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};
