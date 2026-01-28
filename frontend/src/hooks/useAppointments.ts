import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Appointment, AppointmentStatus } from '@/types/database';
import { handleSupabaseError } from '@/utils/handleSupabaseError';
import { toast } from 'react-toastify';

export const APPOINTMENTS_QUERY_KEY = 'appointments';

interface UseAppointmentsOptions {
  userId?: string;
  doctorId?: string;
  status?: AppointmentStatus;
}

interface BookAppointmentParams {
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

interface UpdateAppointmentParams {
  appointmentId: string;
  status: AppointmentStatus;
}

/**
 * Hook to fetch user's appointments
 * 
 * @example
 * ```tsx
 * const { data: appointments, isLoading } = useAppointments({ userId: user.id });
 * ```
 */
export const useAppointments = (
  options: UseAppointmentsOptions = {}
): UseQueryResult<Appointment[], Error> => {
  const { userId, doctorId, status } = options;

  return useQuery({
    queryKey: [APPOINTMENTS_QUERY_KEY, { userId, doctorId, status }],
    queryFn: async () => {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          doctor:doctor_id(*),
          patient:patient_id(*)
        `)
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: false });

      // Apply filters
      if (userId) {
        query = query.eq('patient_id', userId);
      }

      if (doctorId) {
        query = query.eq('doctor_id', doctorId);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        handleSupabaseError(error);
        throw error;
      }

      return data as Appointment[];
    },
    enabled: !!(userId || doctorId),
    staleTime: 1000 * 30, // 30 seconds (appointments update frequently)
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single appointment by ID
 */
export const useAppointment = (appointmentId?: string): UseQueryResult<Appointment | null, Error> => {
  return useQuery({
    queryKey: [APPOINTMENTS_QUERY_KEY, appointmentId],
    queryFn: async () => {
      if (!appointmentId) return null;

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctor:doctor_id(*),
          patient:patient_id(*)
        `)
        .eq('id', appointmentId)
        .single();

      if (error) {
        handleSupabaseError(error);
        throw error;
      }

      return data as Appointment;
    },
    enabled: !!appointmentId,
  });
};

/**
 * Hook to book a new appointment
 * 
 * @example
 * ```tsx
 * const { mutate: bookAppointment, isLoading } = useBookAppointment();
 * 
 * bookAppointment({
 *   doctorId: '123',
 *   appointmentDate: '2026-02-01',
 *   appointmentTime: '10:00'
 * });
 * ```
 */
export const useBookAppointment = (): UseMutationResult<
  Appointment,
  Error,
  BookAppointmentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: BookAppointmentParams) => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to book an appointment');
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            patient_id: user.id,
            doctor_id: params.doctorId,
            appointment_date: params.appointmentDate,
            appointment_time: params.appointmentTime,
            notes: params.notes,
            status: 'pending' as AppointmentStatus,
          },
        ])
        .select()
        .single();

      if (error) {
        handleSupabaseError(error);
        throw error;
      }

      return data as Appointment;
    },
    onSuccess: () => {
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
      toast.success('Appointment booked successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to book appointment: ${error.message}`);
    },
  });
};

/**
 * Hook to update appointment status (cancel, confirm, complete)
 * 
 * @example
 * ```tsx
 * const { mutate: updateStatus } = useUpdateAppointmentStatus();
 * 
 * updateStatus({ appointmentId: '123', status: 'cancelled' });
 * ```
 */
export const useUpdateAppointmentStatus = (): UseMutationResult<
  Appointment,
  Error,
  UpdateAppointmentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateAppointmentParams) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: params.status })
        .eq('id', params.appointmentId)
        .select()
        .single();

      if (error) {
        handleSupabaseError(error);
        throw error;
      }

      return data as Appointment;
    },
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
      
      const statusMessages: Record<AppointmentStatus, string> = {
        pending: 'Appointment status updated to pending',
        confirmed: 'Appointment confirmed!',
        cancelled: 'Appointment cancelled',
        completed: 'Appointment marked as completed',
        scheduled: 'Appointment scheduled',
        no_show: 'Appointment marked as no show',
      };
      
      toast.success(statusMessages[data.status] || 'Appointment updated');
    },
    onError: (error) => {
      toast.error(`Failed to update appointment: ${error.message}`);
    },
  });
};
