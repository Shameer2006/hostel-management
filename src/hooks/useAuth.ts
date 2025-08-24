import { create } from 'zustand';
import { AuthUser, AuthService } from '../lib/auth';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

interface UseAuth {
  user: AuthUser | null;
  isLoading: boolean;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  
  login: async (username: string, password: string) => {
    const user = AuthService.login(username, password);
    if (user) {
      set({ user });
      return true;
    }
    return false;
  },
  
  logout: () => {
    AuthService.logout();
    set({ user: null });
  },
  
  checkAuth: () => {
    const user = AuthService.getCurrentUser();
    set({ user, isLoading: false });
  },
}));

export const useAuthState = (): UseAuth => {
  const { user, isLoading } = useAuth();
  return { user, isLoading };
};