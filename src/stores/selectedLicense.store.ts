import { create } from 'zustand';

export const useSelectedLicenseStore = create<{
   selectedLicenses: {};
   selectLicense: (reportId, license) => void;
   resetLicenses: () => void;
}>((set) => ({
   selectedLicenses: {},
   selectLicense: (reportId, license) =>
      set((state) => ({
         selectedLicenses: {
            ...state.selectedLicenses,
            [reportId]: license,
         },
      })),
   resetLicenses: () => set({ selectedLicenses: {} }),
}));
