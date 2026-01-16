import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserDetails } from "../../network/auth";

export function useUpdateUserDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      messageGood,
      messageBad,
      commentFeature,
    }: {
      token: string;
      messageGood: string;
      messageBad: string;
      commentFeature: boolean;
    }) => updateUserDetails(token, messageGood, messageBad, commentFeature),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      toast.success("Preferences saved successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to save preferences", {
        description: error.message,
      });
    },
  });
}
