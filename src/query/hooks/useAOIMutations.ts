import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createAOI, deleteAOI, updateAOI } from "../../network/aoi";

export function useCreateAOI() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ name, filters }: { name: string; filters: any }) =>
      createAOI(name, filters),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["aois"] });
      toast.success("AOI created successfully");
      navigate(`/?aoi=${data.id}`, { replace: true });
    },
    onError: (error: Error) => {
      console.error("Failed to create AOI:", error);
      toast.error("Failed to create AOI", { description: error.message });
    },
  });
}

export function useUpdateAOI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      aoiId,
      name,
      filters,
    }: {
      aoiId: string;
      name: string;
      filters: any;
    }) => updateAOI(aoiId, name, filters),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["aoi", variables.aoiId] });
      queryClient.invalidateQueries({ queryKey: ["aois"] });
      toast.success("AOI updated successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to update AOI:", error);
      toast.error("Failed to update AOI", { description: error.message });
    },
  });
}

export function useDeleteAOI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (aoiId: string) => deleteAOI(aoiId),
    onSuccess: (_data, aoiId) => {
      queryClient.invalidateQueries({ queryKey: ["aoi", aoiId] });
      queryClient.invalidateQueries({ queryKey: ["aois"] });
      toast.success("AOI deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Failed to delete AOI:", error);
      toast.error("Failed to delete AOI", { description: error.message });
    },
  });
}
