import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getItem } from "../utils/safe_storage.ts";

interface AuthState {
  token: string | null;
  oAuthToken: string | null;
  oAuthTokenSecret: string | null;
  setToken: (token: string | null) => void;
  setOAuthTokens: (token: string | null, secret: string | null) => void;
  clearAuth: () => void;
}

// Check for token in old Redux localStorage location for migration
const legacyToken = getItem("token") ?? null;
const legacyOAuthToken = getItem("oauth_token") ?? null;
const legacyOAuthTokenSecret = getItem("oauth_token_secret") ?? null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: legacyToken,
      oAuthToken: legacyOAuthToken,
      oAuthTokenSecret: legacyOAuthTokenSecret,
      setToken: (token) => set({ token }),
      setOAuthTokens: (oAuthToken, oAuthTokenSecret) =>
        set({ oAuthToken, oAuthTokenSecret }),
      clearAuth: () =>
        set({ token: null, oAuthToken: null, oAuthTokenSecret: null }),
    }),
    {
      name: "auth",
      partialize: (state) => ({
        token: state.token,
        oAuthToken: state.oAuthToken,
        oAuthTokenSecret: state.oAuthTokenSecret,
      }),
    },
  ),
);
