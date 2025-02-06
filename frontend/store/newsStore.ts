import { NewsType } from "types/supabase";
import { create } from "zustand";

interface NewsModalStore {
  news: NewsType | null;
  isNewsModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  openNewsModal: (news: NewsType) => void;
  closeNewsModal: () => void;
  setNews: (news: NewsType | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNewsStore = create<NewsModalStore>((set) => ({
  isNewsModalOpen: false,
  news: null,
  openNewsModal: (news: NewsType) => set({ news: news, isNewsModalOpen: true }),
  closeNewsModal: () => set({ news: null, isNewsModalOpen: false }),
  isLoading: false,
  error: null,
  setNews: (news: NewsType | null) => set({ news }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
}));
