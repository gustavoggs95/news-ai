import { GetNewsData } from "types/api";
import { create } from "zustand";

interface NewsModalStore {
  news: GetNewsData | null;
  isNewsModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  openNewsModal: (news: GetNewsData | null) => void;
  closeNewsModal: () => void;
  setNews: (news: GetNewsData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateCurrentNews: (updates: Partial<GetNewsData>) => void;
}

export const useNewsStore = create<NewsModalStore>((set) => ({
  isNewsModalOpen: false,
  news: null,
  openNewsModal: (news: GetNewsData | null) => set({ news: news, isNewsModalOpen: true }),
  closeNewsModal: () => set({ news: null, isNewsModalOpen: false }),
  isLoading: false,
  error: null,
  setNews: (news: GetNewsData | null) => set({ news }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  updateCurrentNews: (updates: Partial<GetNewsData>) =>
    set((state) => ({
      news: state.news ? { ...state.news, ...updates } : null,
    })),
}));
