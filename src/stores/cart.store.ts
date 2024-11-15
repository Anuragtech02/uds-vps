import { create } from 'zustand';

export const useCartStore = create<{
   reports: any[];
   addToCart: (report: any) => void;
}>((set) => ({
   reports: [],
   addToCart: (report) =>
      report ??
      set((state) => ({
         reports: [...state.reports, { report: report, quantity: 1 }],
      })),
}));
