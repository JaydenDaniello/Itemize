'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type OptimizeFor = 'cost' | 'convenience';

type PreferencesStore = {
  optimizeFor: OptimizeFor;
  perTripBudget: string;
  setOptimizeFor: (optimizeFor: OptimizeFor) => void;
  setPerTripBudget: (perTripBudget: string) => void;
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      optimizeFor: 'cost',
      perTripBudget: '',
      setOptimizeFor: (optimizeFor) => set({ optimizeFor }),
      setPerTripBudget: (perTripBudget) => set({ perTripBudget }),
    }),
    {
      name: 'itemize-preferences',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
