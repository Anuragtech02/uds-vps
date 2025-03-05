import { create } from 'zustand';

export const useMenuStore = create<{
   isMobileMenuOpen: boolean;
   setIsMobileMenuOpen: (open: boolean) => void;
}>((set) => ({
   isMobileMenuOpen: false,
   setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
}));
