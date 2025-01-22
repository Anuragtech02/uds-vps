import { create } from 'zustand';

export const useSearchStore = create<{
   isGlobalSearchVisible: boolean;
   query: string;
   setQuery: (query: string) => void;
   toggleGlobalSearch: () => void;
   closeSearch: () => void;
}>((set) => ({
   isGlobalSearchVisible: false,
   query: '',
   setQuery: (query: string) => set({ query }),
   toggleGlobalSearch: () =>
      set((state: any) => ({
         isGlobalSearchVisible: !state.isGlobalSearchVisible,
      })),
   closeSearch: () => set({ isGlobalSearchVisible: false }),
}));
