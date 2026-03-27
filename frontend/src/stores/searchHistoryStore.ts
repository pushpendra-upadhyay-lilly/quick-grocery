import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchHistoryStore {
  searches: string[];
  addSearch: (query: string) => void;
  removeSearch: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryStore>()(
  persist(
    (set) => ({
      searches: [],
      addSearch: (query: string) =>
        set((state) => {
          // Trim and check if empty
          const trimmedQuery = query.trim();
          if (!trimmedQuery) return state;

          // Remove duplicate if it exists
          const filtered = state.searches.filter((s) => s !== trimmedQuery);

          // Add to front and limit to 10
          const updated = [trimmedQuery, ...filtered].slice(0, 10);

          return { searches: updated };
        }),
      removeSearch: (query: string) =>
        set((state) => ({
          searches: state.searches.filter((s) => s !== query),
        })),
      clearHistory: () => set({ searches: [] }),
    }),
    {
      name: 'search-history',
    }
  )
);
