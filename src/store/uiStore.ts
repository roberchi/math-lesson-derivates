import { create } from 'zustand';

type Severity = 'success' | 'info' | 'warning' | 'error';

interface UIStore {
  sidebarOpen: boolean;
  snackbar: { open: boolean; message: string; severity: Severity };
  setSidebarOpen: (open: boolean) => void;
  showSnackbar: (message: string, severity?: Severity) => void;
  hideSnackbar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  snackbar: { open: false, message: '', severity: 'success' },
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  showSnackbar: (message, severity = 'success') =>
    set({ snackbar: { open: true, message, severity } }),
  hideSnackbar: () =>
    set((state) => ({ snackbar: { ...state.snackbar, open: false } })),
}));
