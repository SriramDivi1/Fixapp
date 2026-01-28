import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Appointment } from '@/types/database';
import { APPOINTMENTS_QUERY_KEY } from './useAppointments';
import { toast } from 'react-toastify';

/**
 * Real-time subscription hook for appointments
 * 
 * Automatically updates appointment data when changes occur in the database.
 * Useful for both patient and doctor dashboards to show live appointment updates.
 * 
 * @param userId - Optional user ID to filter appointments (patient or doctor)
 * 
 * @example
 * ```tsx
 * function MyAppointments() {
 *   const { user } = useAuth();
 *   const { data: appointments } = useAppointments({ userId: user?.id });
 *   
 *   // Enable real-time updates
 *   useRealtimeAppointments(user?.id);
 *   
 *   return <AppointmentList appointments={appointments} />;
 * }
 * ```
 */
export const useRealtimeAppointments = (userId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    // Subscribe to INSERT events
    const insertChannel = supabase
      .channel('appointments-insert')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments',
          filter: `patient_id=eq.${userId}`,
        },
        (payload) => {
          console.log('New appointment created:', payload);
          
          // Invalidate appointments query to refetch
          queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
          
          toast.info('New appointment created!');
        }
      )
      .subscribe();

    // Subscribe to UPDATE events
    const updateChannel = supabase
      .channel('appointments-update')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `patient_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Appointment updated:', payload);
          
          const newAppointment = payload.new as Appointment;
          
          // Invalidate to refetch with latest data
          queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
          
          // Show status-specific notifications
          if (newAppointment.status === 'confirmed') {
            toast.success('Your appointment has been confirmed!');
          } else if (newAppointment.status === 'cancelled') {
            toast.warning('Your appointment has been cancelled');
          } else if (newAppointment.status === 'completed') {
            toast.success('Your appointment is complete');
          }
        }
      )
      .subscribe();

    // Subscribe to DELETE events
    const deleteChannel = supabase
      .channel('appointments-delete')
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'appointments',
          filter: `patient_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Appointment deleted:', payload);
          
          queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
          
          toast.info('Appointment removed');
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(insertChannel);
      supabase.removeChannel(updateChannel);
      supabase.removeChannel(deleteChannel);
    };
  }, [userId, queryClient]);
};

/**
 * Real-time subscription for doctor's appointments
 * 
 * @param doctorId - Doctor's user ID to filter their appointments
 */
export const useRealtimeDoctorAppointments = (doctorId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!doctorId) return;

    const channel = supabase
      .channel('doctor-appointments')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events
          schema: 'public',
          table: 'appointments',
          filter: `doctor_id=eq.${doctorId}`,
        },
        (payload) => {
          console.log('Doctor appointment change:', payload);
          
          // Invalidate queries to refetch
          queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
          
          if (payload.eventType === 'INSERT') {
            toast.info('New appointment booking received!');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [doctorId, queryClient]);
};
