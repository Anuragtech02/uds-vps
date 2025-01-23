import { create } from 'zustand';

export const useCartStore = create<{
   reports: any[];
   addToCart: (report: any) => void;
   updateCart: (reports: any[]) => void;
   resetCart: () => void;
}>((set) => ({
   reports: [],
   addToCart: (report) =>
      report ??
      set((state) => ({
         reports: [...state.reports, { report: report, quantity: 1 }],
      })),
   updateCart: (reports) => set({ reports }),
   resetCart: () => set({ reports: [] }),
}));
