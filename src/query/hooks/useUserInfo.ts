import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "../../network/openstreetmap.ts";
import { getUsers } from "../../network/whosthat.ts";
import { useAuthStore } from "../../stores/authStore.ts";

/// Profile and OSMCha stats for an OSM user, by uid.
export function useUserInfo(uid: number | undefined) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["userInfo", uid],
    queryFn: () => getUserDetails(uid!),
    enabled: !!uid && !!token,
    staleTime: 10 * 60 * 1000,
  });
}

/// Past usernames of an OSM user, by uid, from the whosthat service.
export function useWhosThat(uid: number | undefined) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["whosThat", uid],
    queryFn: async (): Promise<string[]> => {
      const users = await getUsers(uid);
      return users[0]?.names ?? [];
    },
    enabled: !!uid && !!token,
    staleTime: 10 * 60 * 1000,
  });
}
