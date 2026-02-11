import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearAuth: () => set({ token: null }),
    }),
    {
      name: "auth",
      partialize: (state) => ({
        token: state.token,
      }),
      // One-time migration from Redux localStorage
      onRehydrateStorage: () => (state) => {
        if (state && !state.token) {
          const legacyToken = localStorage.getItem("token");
          if (legacyToken) {
            state.setToken(legacyToken);
            // Clean up old Redux keys
            localStorage.removeItem("token");
            localStorage.removeItem("oauth_token");
            localStorage.removeItem("oauth_token_secret");
          }
        }
      },
    },
  ),
);
