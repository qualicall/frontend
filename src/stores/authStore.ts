import create from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userUid: string | null;
  setAuth: (token: string, userUid: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  userUid: localStorage.getItem('userUid'),
  setAuth: (token: string, userUid: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userUid', userUid);
    set({ isAuthenticated: true, token, userUid });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userUid');
    set({ isAuthenticated: false, token: null, userUid: null });
  },
}));