import Mousetrap from "mousetrap";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { List } from "../components/list";
import { Footer } from "../components/list/footer";
import { Header } from "../components/list/header";
import {
  FILTER_BINDING,
  HELP_BINDING,
  NEXT_CHANGESET,
  PREV_CHANGESET,
  REFRESH_CHANGESETS,
} from "../config/bindings";
import { useFilters } from "../hooks/useFilters";
import { useChangesetsPage } from "../query/hooks/useChangesetsPage";

interface ChangesetsPageData {
  features: Array<{ id: number; properties: any }>;
  count: number;
  [key: string]: any;
}

function ChangesetsList() {
  const { id } = useParams<{ id?: string }>();
  const activeChangesetId = id ? parseInt(id, 10) : null;
  const [pageIndex, setPageIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { filters, aoiId, setFilters } = useFilters();

  const {
    data: currentPage,
    isLoading,
    refetch,
  } = useChangesetsPage({
    pageIndex,
    filters,
    aoiId,
  });

  const page = currentPage as ChangesetsPageData | undefined;

  const goUpDownToChangeset = useCallback(
    (direction: number) => {
      if (!page?.features) return;
      const features = page.features;
      let index = features.findIndex((f: any) => f.id === activeChangesetId);
      index += direction;
      const nextFeature = features[index];
      if (nextFeature) {
        navigate({
          pathname: `/changesets/${nextFeature.id}`,
          search: location.search,
        });
      }
    },
    [page, activeChangesetId, navigate, location.search],
  );

  const toggleFilters = useCallback(() => {
    if (location.pathname === "/filters") {
      navigate({ pathname: "/", search: location.search });
    } else {
      navigate({ pathname: "/filters", search: location.search });
    }
  }, [location.pathname, location.search, navigate]);

  const toggleHelp = useCallback(() => {
    if (location.pathname.startsWith("/about")) {
      navigate({ pathname: "/", search: location.search });
    } else {
      navigate({ pathname: "/about", search: location.search });
    }
  }, [location.pathname, location.search, navigate]);

  const handleFilterOrderBy = (selected: Array<any>) => {
    const newFilters = { ...filters, order_by: selected };
    setFilters(newFilters);
  };

  const reloadChangesetsPageData = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleChangePage = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  useEffect(() => {
    const shortcuts = [
      {
        bindings: NEXT_CHANGESET.bindings,
        handler: () => goUpDownToChangeset(1),
      },
      {
        bindings: PREV_CHANGESET.bindings,
        handler: () => goUpDownToChangeset(-1),
      },
      {
        bindings: FILTER_BINDING.bindings,
        handler: toggleFilters,
      },
      {
        bindings: HELP_BINDING.bindings,
        handler: toggleHelp,
      },
      {
        bindings: REFRESH_CHANGESETS.bindings,
        handler: reloadChangesetsPageData,
      },
    ];

    for (const shortcut of shortcuts) {
      Mousetrap.bind(shortcut.bindings, (e) => {
        e.preventDefault();
        shortcut.handler();
      });
    }

    return () => {
      for (const shortcut of shortcuts) {
        Mousetrap.unbind(shortcut.bindings);
      }
    };
  }, [
    goUpDownToChangeset,
    reloadChangesetsPageData,
    toggleFilters,
    toggleHelp,
  ]);

  return (
    <div className="flex-parent flex-parent--column changesets-list">
      <Header
        filters={filters}
        handleFilterOrderBy={handleFilterOrderBy}
        location={location}
        currentPage={page}
        diff={0}
        diffLoading={false}
        reloadChangesetsPageData={reloadChangesetsPageData}
      />
      <List
        activeChangesetId={activeChangesetId}
        loading={isLoading}
        currentPage={page}
        pageIndex={pageIndex}
        location={location.pathname}
      />
      <Footer
        pageIndex={pageIndex}
        getChangesetsPage={handleChangePage}
        count={page?.count}
      />
    </div>
  );
}

export { ChangesetsList };
