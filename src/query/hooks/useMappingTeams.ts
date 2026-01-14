import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createMappingTeam,
  deleteMappingTeam,
  fetchMappingTeam,
  fetchUserMappingTeams,
  updateMappingTeam,
} from "../../network/mapping_team";

export function useMappingTeams(
  token: string | null,
  username: string | undefined,
) {
  return useQuery({
    queryKey: ["mappingTeams", username],
    queryFn: () => fetchUserMappingTeams(token!, username!),
    enabled: !!token && !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMappingTeam(token: string | null, teamId: number | null) {
  return useQuery({
    queryKey: ["mappingTeam", teamId],
    queryFn: () => fetchMappingTeam(token!, teamId!),
    enabled: !!token && !!teamId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateMappingTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      name,
      users,
    }: {
      token: string;
      name: string;
      users: object;
    }) => createMappingTeam(token, name, users),
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
      token,
      teamId,
      name,
      users,
    }: {
      token: string;
      teamId: number;
      name: string;
      users: object;
    }) => updateMappingTeam(token, teamId, name, users),
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
    mutationFn: ({ token, teamId }: { token: string; teamId: number }) =>
      deleteMappingTeam(token, teamId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mappingTeams"] });
      toast.success("Team Deleted", {
        description: `The team with id ${variables.teamId} was deleted`,
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
