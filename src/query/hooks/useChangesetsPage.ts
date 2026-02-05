import { useQuery } from "@tanstack/react-query";
import { fetchChangesetsPage } from "../../network/changesets_page.ts";

interface ChangesetsPageParams {
  pageIndex: number;
  filters: any;
  aoiId: string | null;
}

export function useChangesetsPage({
  pageIndex,
  filters,
  aoiId,
}: ChangesetsPageParams) {
  return useQuery({
    queryKey: ["changesets", "page", pageIndex, filters, aoiId],
    queryFn: async () => {
      return fetchChangesetsPage(pageIndex, filters, aoiId, false);
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
}
