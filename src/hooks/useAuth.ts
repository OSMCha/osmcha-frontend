import { useEffect } from "react";
import { toast } from "sonner";
import { useStatus } from "../query/hooks/useStatus";
import { useUserDetails } from "../query/hooks/useUserDetails";
import { useAuthStore } from "../stores/authStore";

/**
 * Hook for accessing auth state and user details.
 * Uses Zustand for token storage and TanStack Query for user data.
 */
export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const userQuery = useUserDetails(token);
  const statusQuery = useStatus();

  // Show status notification if needed
  useEffect(() => {
    if (statusQuery.data && statusQuery.data.status !== "success") {
      toast.warning("OSMCha Status", {
        description: statusQuery.data.message,
        duration: 20000,
      });
    }
  }, [statusQuery.data]);

  return {
    token,
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isAuthenticated: !!token && userQuery.isSuccess,
  };
}
