import { create } from 'zustand';

interface AppStore {
  isDarkMode: boolean;
  isLoading: boolean;
  user: any | null;
  toggleDarkMode: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: any) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isDarkMode: false,
  isLoading: false,
  user: null,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setLoading: (loading) => set({ isLoading: loading }),
  setUser: (user) => set({ user })
}));
