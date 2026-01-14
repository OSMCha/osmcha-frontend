import { toast } from "sonner";

interface ShowToastOptions {
  kind?: "error" | "success" | "warning" | "info";
  error?: Error;
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function showToast({
  kind = "error",
  error,
  title,
  description,
  onRetry,
  retryLabel = "Retry",
}: ShowToastOptions) {
  let finalTitle = title;
  let finalDescription = description;

  if (error) {
    if (error.name) finalTitle = error.name;
    if (error.message) finalDescription = error.message;
  }

  const options = onRetry
    ? {
        action: {
          label: retryLabel,
          onClick: onRetry,
        },
      }
    : undefined;

  switch (kind) {
    case "error":
      toast.error(finalTitle || "Error", {
        description: finalDescription,
        ...options,
      });
      break;
    case "success":
      toast.success(finalTitle || "Success", {
        description: finalDescription,
      });
      break;
    case "warning":
      toast.warning(finalTitle || "Warning", {
        description: finalDescription,
        ...options,
      });
      break;
    default:
      toast.info(finalTitle || "Info", {
        description: finalDescription,
        ...options,
      });
  }
}
