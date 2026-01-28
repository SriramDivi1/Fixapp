import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Notification } from '@/types/database';
import { toast } from 'react-toastify';

export const NOTIFICATIONS_QUERY_KEY = 'notifications';

/**
 * Real-time subscription hook for user notifications
 * 
 * Automatically shows toast notifications when new notifications arrive
 * and keeps the notifications list updated in real-time.
 * 
 * @param userId - User ID to subscribe to their notifications
 * 
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { user } = useAuth();
 *   
 *   // Enable real-time notifications
 *   useRealtimeNotifications(user?.id);
 *   
 *   return <div>Dashboard content</div>;
 * }
 * ```
 */
export const useRealtimeNotifications = (userId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    console.log('Setting up realtime notifications for user:', userId);

    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('New notification received:', payload);
          
          const notification = payload.new as Notification;
          
          // Invalidate queries to refetch notifications
          queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
          
          // Show toast notification based on type
          const toastOptions = {
            autoClose: 5000,
            position: 'top-right' as const,
          };
          
          switch (notification.type) {
            case 'success':
              toast.success(notification.message, toastOptions);
              break;
            case 'error':
              toast.error(notification.message, toastOptions);
              break;
            case 'warning':
              toast.warning(notification.message, toastOptions);
              break;
            case 'info':
            default:
              toast.info(notification.message, toastOptions);
              break;
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Notification updated:', payload);
          
          // Refetch notifications (e.g., when marked as read)
          queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime notifications');
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
};

/**
 * Hook to fetch user notifications with React Query
 * 
 * @param userId - User ID to fetch notifications for
 */
export const useNotifications = (userId?: string) => {
  const queryClient = useQueryClient();

  return {
    // This would be implemented similar to useAppointments
    // For now, returning a placeholder
    notifications: [],
    isLoading: false,
    error: null,
  };
};
