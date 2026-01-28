import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, Doctor, Appointment, Notification } from '@/types';
import { supabase, getCurrentUser, signOut } from '@/services/supabase';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface DoctorsState {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  isLoading: boolean;
  error: string | null;
}

interface AppointmentsState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

interface AppState extends AuthState, DoctorsState, AppointmentsState, NotificationsState {
  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  
  // Doctor actions
  fetchDoctors: (filters?: any) => Promise<void>;
  selectDoctor: (doctor: Doctor | null) => void;
  
  // Appointment actions
  fetchAppointments: () => Promise<void>;
  bookAppointment: (appointmentData: any) => Promise<boolean>;
  cancelAppointment: (appointmentId: string) => Promise<boolean>;
  
  // Notification actions
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  
  // Utility actions
  clearError: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      doctors: [],
      selectedDoctor: null,
      appointments: [],
      notifications: [],
      unreadCount: 0,

      // Auth actions
      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) throw error;

          if (data.user) {
            // Fetch user profile
            const { data: profile, error: profileError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profileError) throw profileError;

            set({
              user: profile,
              isAuthenticated: true,
              isLoading: false
            });
            
            return true;
          }
          return false;
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
            isAuthenticated: false
          });
          return false;
        }
      },

      logout: async (): Promise<void> => {
        try {
          await signOut();
          set({
            user: null,
            isAuthenticated: false,
            appointments: [],
            notifications: [],
            unreadCount: 0,
            error: null
          });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      initialize: async (): Promise<void> => {
        set({ isLoading: true });
        
        try {
          const { user } = await getCurrentUser();
          
          if (user) {
            const { data: profile, error } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            if (!error && profile) {
              set({
                user: profile,
                isAuthenticated: true
              });
              
              // Fetch user data
              get().fetchAppointments();
              get().fetchNotifications();
            }
          }
        } catch (error: any) {
          console.error('Initialization error:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (data: Partial<UserProfile>): Promise<boolean> => {
        const { user } = get();
        if (!user) return false;

        try {
          const { error } = await supabase
            .from('user_profiles')
            .update(data)
            .eq('id', user.id);

          if (error) throw error;

          set({
            user: { ...user, ...data }
          });
          
          return true;
        } catch (error: any) {
          set({ error: error.message });
          return false;
        }
      },

      // Doctor actions
      fetchDoctors: async (filters?: any): Promise<void> => {
        set({ isLoading: true, error: null });
        
        try {
          let query = supabase
            .from('doctors')
            .select(`
              *,
              user_profile:user_profiles(*)
            `);

          if (filters?.speciality) {
            query = query.eq('speciality', filters.speciality);
          }
          
          if (filters?.available !== undefined) {
            query = query.eq('is_available', filters.available);
          }

          const { data, error } = await query;

          if (error) throw error;

          set({
            doctors: data || [],
            isLoading: false
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
            doctors: []
          });
        }
      },

      selectDoctor: (doctor: Doctor | null) => {
        set({ selectedDoctor: doctor });
      },

      // Appointment actions
      fetchAppointments: async (): Promise<void> => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        
        try {
          const { data, error } = await supabase
            .from('appointments')
            .select(`
              *,
              doctor:doctors(*,user_profile:user_profiles(*))
            `)
            .eq('patient_id', user.id)
            .order('appointment_date', { ascending: false });

          if (error) throw error;

          set({
            appointments: data || [],
            isLoading: false
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false
          });
        }
      },

      bookAppointment: async (appointmentData: any): Promise<boolean> => {
        const { user } = get();
        if (!user) return false;

        try {
          const { error } = await supabase
            .from('appointments')
            .insert({
              ...appointmentData,
              patient_id: user.id
            });

          if (error) throw error;

          // Refresh appointments
          get().fetchAppointments();
          return true;
        } catch (error: any) {
          set({ error: error.message });
          return false;
        }
      },

      cancelAppointment: async (appointmentId: string): Promise<boolean> => {
        try {
          const { error } = await supabase
            .from('appointments')
            .update({ 
              status: 'cancelled',
              cancelled_at: new Date().toISOString()
            })
            .eq('id', appointmentId);

          if (error) throw error;

          // Refresh appointments
          get().fetchAppointments();
          return true;
        } catch (error: any) {
          set({ error: error.message });
          return false;
        }
      },

      // Notification actions
      fetchNotifications: async (): Promise<void> => {
        const { user } = get();
        if (!user) return;

        try {
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);

          if (error) throw error;

          const unreadCount = data?.filter(n => !n.is_read).length || 0;

          set({
            notifications: data || [],
            unreadCount
          });
        } catch (error: any) {
          console.error('Error fetching notifications:', error);
        }
      },

      markNotificationAsRead: async (notificationId: string): Promise<void> => {
        try {
          const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);

          if (error) throw error;

          set(state => ({
            notifications: state.notifications.map(n =>
              n.id === notificationId ? { ...n, is_read: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1)
          }));
        } catch (error: any) {
          console.error('Error marking notification as read:', error);
        }
      },

      markAllNotificationsAsRead: async (): Promise<void> => {
        const { user } = get();
        if (!user) return;

        try {
          const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

          if (error) throw error;

          set(state => ({
            notifications: state.notifications.map(n => ({ ...n, is_read: true })),
            unreadCount: 0
          }));
        } catch (error: any) {
          console.error('Error marking all notifications as read:', error);
        }
      },

      // Utility actions
      clearError: () => set({ error: null })
    }),
    {
      name: 'fixapp-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);