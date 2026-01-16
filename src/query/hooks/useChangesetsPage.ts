import { useQuery } from "@tanstack/react-query";
import { fetchChangesetsPage } from "../../network/changesets_page";

interface ChangesetsPageParams {
  pageIndex: number;
  filters: any;
  aoiId: string | null;
  token: string | null;
}

export function useChangesetsPage({
  pageIndex,
  filters,
  aoiId,
  token,
}: ChangesetsPageParams) {
  return useQuery({
    queryKey: ["changesets", "page", pageIndex, filters, aoiId, token],
    queryFn: async () => {
      const data = await fetchChangesetsPage(
        pageIndex,
        filters,
        token,
        false,
        aoiId,
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
}
