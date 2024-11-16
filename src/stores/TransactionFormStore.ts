import { create } from 'zustand';
import { Transaction } from '@/types/transaction';

interface TransactionFormState {
  dials: any[];
  isLoading: boolean;
  error: string | null;
  setDials: (dials: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchDials: () => Promise<void>;
}

export const useTransactionFormStore = create<TransactionFormState>((set) => ({
  dials: [],
  isLoading: false,
  error: null,
  setDials: (dials) => set({ dials }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  fetchDials: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/dictionaries/bonuses/options');
      const data = await response.json();
      set({ dials: data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));