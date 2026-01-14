import Mousetrap from "mousetrap";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { useAuth } from "../hooks/useAuth";
import { useFilters } from "../hooks/useFilters";
import { useChangesetsPage } from "../query/hooks/useChangesetsPage";

function ChangesetsList() {
  const { token } = useAuth();
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
    token,
  });

  const goUpDownToChangeset = (direction: number) => {
    if (!currentPage?.features) return;
    const features = currentPage.features;
    let index = features.findIndex((f: any) => f.id === activeChangesetId);
    index += direction;
    const nextFeature = features[index];
    if (nextFeature) {
      navigate({
        pathname: `/changesets/${nextFeature.id}`,
        search: location.search,
      });
    }
  };

  const toggleFilters = () => {
    if (location.pathname === "/filters") {
      navigate({ pathname: "/", search: location.search });
    } else {
      navigate({ pathname: "/filters", search: location.search });
    }
  };

  const toggleHelp = () => {
    if (location.pathname.startsWith("/about")) {
      navigate({ pathname: "/", search: location.search });
    } else {
      navigate({ pathname: "/about", search: location.search });
    }
  };

  const handleFilterOrderBy = (selected: Array<any>) => {
    const newFilters = { ...filters, order_by: selected };
    setFilters(newFilters);
  };

  const reloadCurrentPage = () => {
    refetch();
  };

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
        handler: reloadCurrentPage,
      },
    ];

    shortcuts.forEach((shortcut) => {
      Mousetrap.bind(shortcut.bindings, (e) => {
        e.preventDefault();
        shortcut.handler();
      });
    });

    return () => {
      shortcuts.forEach((shortcut) => {
        Mousetrap.unbind(shortcut.bindings);
      });
    };
  }, [currentPage, activeChangesetId, filters, location]);

  return (
    <div className="flex-parent flex-parent--column changesets-list">
      <Header
        filters={filters}
        handleFilterOrderBy={handleFilterOrderBy}
        location={location}
        currentPage={currentPage}
        diff={0}
        diffLoading={false}
        reloadCurrentPage={reloadCurrentPage}
      />
      <List
        activeChangesetId={activeChangesetId}
        loading={isLoading}
        currentPage={currentPage}
        pageIndex={pageIndex}
        location={location.pathname}
      />
      <Footer
        pageIndex={pageIndex}
        getChangesetsPage={handleChangePage}
        count={currentPage?.count}
      />
    </div>
  );
}

export { ChangesetsList };
