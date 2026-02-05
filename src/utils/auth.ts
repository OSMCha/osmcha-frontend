import { toast } from "sonner";
import { postFinalTokensOSMCha } from "../network/auth.ts";
import { useAuthStore } from "../stores/authStore.ts";
import { setItem } from "./safe_storage.ts";

/**
 * Completes OAuth login flow by exchanging code for token.
 * Saves token to both Zustand store and localStorage for Redux compatibility.
 */
export async function completeOAuthLogin(code: string) {
  try {
    toast.warning("Login in progress", {
      description: "Please wait. We are logging you in.",
      duration: 1000,
    });

    const { token } = (await postFinalTokensOSMCha(code)) as { token: string };

    if (!token || token === "") {
      throw new Error("Invalid token");
    }

    // Save to Zustand store (also persists to localStorage under "auth" key)
    useAuthStore.getState().setToken(token);

    // Also save to old localStorage key for Redux compatibility during migration
    setItem("token", token);

    toast.success("Login Successful");

    return token;
  } catch (error) {
    console.error("Login error:", error);
    const err = error as Error;
    toast.error("Login failed", { description: err.message });
    throw error;
  }
}
