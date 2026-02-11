import { toast } from "sonner";
import { postFinalTokensOSMCha } from "../network/auth.ts";
import { useAuthStore } from "../stores/authStore.ts";

/**
 * Completes OAuth login flow by exchanging code for token.
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

    // Save to Zustand store (persists to localStorage under "auth" key)
    useAuthStore.getState().setToken(token);

    toast.success("Login Successful");

    return token;
  } catch (error) {
    console.error("Login error:", error);
    const err = error as Error;
    toast.error("Login failed", { description: err.message });
    throw error;
  }
}
