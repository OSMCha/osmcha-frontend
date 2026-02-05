import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createMappingTeam,
  deleteMappingTeam,
  fetchMappingTeam,
  fetchUserMappingTeams,
  updateMappingTeam,
} from "../../network/mapping_team.ts";
import { useAuthStore } from "../../stores/authStore.ts";

export function useMappingTeams(username: string | undefined) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["mappingTeams", username],
    queryFn: () => fetchUserMappingTeams(username!),
    enabled: !!token && !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMappingTeam(teamId: number | null) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["mappingTeam", teamId],
    queryFn: () => fetchMappingTeam(teamId!),
    enabled: !!token && !!teamId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateMappingTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, users }: { name: string; users: object }) =>
      createMappingTeam(name, users),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mappingTeams"] });
      toast.success("Team Created", {
        description: `The team ${variables.name} was created successfully!`,
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to create team", {
        description: error.message,
      });
    },
  });
}

export function useUpdateMappingTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      name,
      users,
    }: {
      teamId: number;
      name: string;
      users: object;
    }) => updateMappingTeam(teamId, name, users),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["mappingTeam", variables.teamId],
      });
      queryClient.invalidateQueries({ queryKey: ["mappingTeams"] });
      toast.success("Team Updated", {
        description: `The team ${variables.name} was updated successfully!`,
      });
    },
    onError: (error: Error) => {
      toast.error("Update failed", {
        description: error.message,
      });
    },
  });
}

export function useDeleteMappingTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: number) => deleteMappingTeam(teamId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mappingTeams"] });
      toast.success("Team Deleted", {
        description: `The team with id ${variables} was deleted`,
      });
    },
    onError: (error: Error) => {
      queryClient.invalidateQueries({ queryKey: ["mappingTeams"] });
      toast.error("Deletion failed", {
        description: error.message,
      });
    },
  });
}
