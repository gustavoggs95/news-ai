// Import persist middleware
import { UsersType } from "types/supabase";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStore {
  user: UsersType | null;
  isAuthenticated: boolean;
  login: (userData: UsersType | null) => void;
  logout: () => void;
  updateUser: (userData: Partial<UsersType>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // Action to log in the user
      login: (userData: UsersType | null) => set({ user: userData, isAuthenticated: true }),

      // Action to log out the user
      logout: () => set({ user: null, isAuthenticated: false }),

      // Action to update user data
      updateUser: (userData: Partial<UsersType>) =>
        set((state) => ({
          user: { ...state.user, ...userData } as UsersType,
        })),
    }),
    {
      name: "user-store", // Unique name for the storage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    },
  ),
);
