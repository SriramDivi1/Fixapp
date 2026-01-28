import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types/database';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  clearAuth: () => void;
}

/**
 * Zustand Auth Store
 * 
 * Persists authentication state to localStorage.
 * Works in conjunction with useAuth hook for reactive auth state.
 * 
 * @example
 * ```tsx
 * import { useAuthStore } from '@/stores/authStore';
 * 
 * const MyComponent = () => {
 *   const { user, profile } = useAuthStore();
 *   return <div>Welcome, {profile?.full_name}!</div>;
 * };
 * ```
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      profile: null,

      setUser: (user) => set({ user }),
      
      setSession: (session) => set({ session }),
      
      setProfile: (profile) => set({ profile }),
      
      clearAuth: () => set({ user: null, session: null, profile: null }),
    }),
    {
      name: 'fixapp-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist non-sensitive data
      partialize: (state) => ({
        profile: state.profile,
        // Don't persist session/user - Supabase handles this
      }),
    }
  )
);
