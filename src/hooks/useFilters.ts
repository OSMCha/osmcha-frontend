import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { validateFilters } from "../utils/filters.ts";

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    try {
      const filtersParam = searchParams.get("filters");
      if (!filtersParam) return {};
      return JSON.parse(filtersParam);
    } catch (error) {
      console.error("Failed to parse filters from URL:", error);
      return {};
    }
  }, [searchParams]);

  const aoiId = useMemo(() => {
    return searchParams.get("aoi");
  }, [searchParams]);

  const setFilters = useCallback(
    (newFilters: any) => {
      try {
        // Validate filters before setting
        validateFilters(newFilters);

        const newParams = new URLSearchParams();

        // Only add filters param if there are filters
        if (newFilters && Object.keys(newFilters).length > 0) {
          const filtersString = JSON.stringify(newFilters);

          // Check if filters are too large
          if (filtersString.length > 7000) {
            toast.error("Filter too large", {
              description:
                "Your filter is too big. Please save it as an AOI instead.",
            });
            return;
          }

          newParams.set("filters", filtersString);
        }

        // Preserve AOI if it exists and we're not clearing filters
        const currentAoi = searchParams.get("aoi");
        if (currentAoi && Object.keys(newFilters).length > 0) {
          newParams.set("aoi", currentAoi);
        }

        setSearchParams(newParams, { replace: false });
      } catch (error) {
        console.error("Failed to set filters:", error);
        toast.error("Invalid filters", {
          description:
            error instanceof Error ? error.message : "Failed to apply filters",
        });

        // Clear filters on error
        setSearchParams(new URLSearchParams(), { replace: false });
      }
    },
    [searchParams, setSearchParams],
  );

  const setAoiId = useCallback(
    (aoiId: string | null) => {
      const newParams = new URLSearchParams();
      if (aoiId) {
        newParams.set("aoi", aoiId);
      }
      setSearchParams(newParams, { replace: false });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: false });
  }, [setSearchParams]);

  return {
    filters,
    aoiId,
    setFilters,
    setAoiId,
    clearFilters,
  };
}
