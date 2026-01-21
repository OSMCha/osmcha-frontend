import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FiltersHeader } from "../components/filters/filters_header";
import { FiltersList } from "../components/filters/filters_list";
import { useAuth } from "../hooks/useAuth";
import { useFilters } from "../hooks/useFilters";
import { useAOI } from "../query/hooks/useAOI";
import {
  useCreateAOI,
  useDeleteAOI,
  useUpdateAOI,
} from "../query/hooks/useAOIMutations";
import { deserializeFiltersFromObject } from "../utils/filters";
import { isMobile } from "../utils/isMobile";

const NEW_AOI = "unnamed *";

const noDateGte = {
  date__gte: [{ label: "", value: "" }],
};

function Filters() {
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { filters: urlFilters, setAoiId, aoiId, clearFilters } = useFilters();

  const { data: aoi, isLoading: aoiLoading } = useAOI(aoiId);
  const createAOIMutation = useCreateAOI();
  const updateAOIMutation = useUpdateAOI();
  const deleteAOIMutation = useDeleteAOI();

  const [localFilters, setLocalFilters] = useState(urlFilters);
  const [active, setActive] = useState("");

  const loading =
    aoiLoading || createAOIMutation.isPending || updateAOIMutation.isPending;

  // Sync local filters with URL filters when they change
  useEffect(() => {
    setLocalFilters(urlFilters);
  }, [urlFilters]);

  // Populate filters from AOI when loading a saved filter (no URL filters)
  useEffect(() => {
    const hasUrlFilters = urlFilters && Object.keys(urlFilters).length > 0;
    if (aoi?.properties?.filters && !hasUrlFilters) {
      const deserializedFilters = deserializeFiltersFromObject(
        aoi.properties.filters,
      );
      setLocalFilters(deserializedFilters);
    }
  }, [aoi, urlFilters]);

  const handleFocus = (name: string) => {
    setActive(name);
  };

  const handleApply = () => {
    const newParams = new URLSearchParams();
    if (localFilters && Object.keys(localFilters).length > 0) {
      newParams.set("filters", JSON.stringify(localFilters));
    }
    if (aoiId) {
      newParams.set("aoi", aoiId);
    }

    navigate({
      pathname: "/",
      search: newParams.toString(),
    });
  };

  const handleChange = (name: string, values?: any) => {
    setLocalFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      // if someone cleared date__gte filter
      // we use the convention defined at `noDateGte`
      // to signify no default gte.
      if (name === "date__gte" && values == null) {
        return { ...newFilters, ...noDateGte };
      } else if (values == null) {
        // clear this filter
        delete newFilters[name];
      } else {
        newFilters[name] = values;
      }
      return newFilters;
    });
  };

  const handleToggleAll = (name: string, values?: any) => {
    setLocalFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      const isAll = name.slice(0, 4) === "all_";

      // delete the opposite value
      if (isAll) {
        delete newFilters[name.slice(4)];
      } else {
        delete newFilters["all_" + name];
      }

      // regularly handle change
      if (!values) {
        delete newFilters[name];
      } else {
        newFilters[name] = values;
      }
      return newFilters;
    });
  };

  const replaceFiltersState = (filters: any) => {
    setLocalFilters(filters);
  };

  const handleClear = () => {
    clearFilters();
    navigate("/");
  };

  const loadAoiId = (aoiId: string) => {
    setAoiId(aoiId);
  };

  const getAOIName = () => {
    if (loading) return "";
    return aoi?.properties?.name || NEW_AOI;
  };

  const getAOIId = () => {
    if (loading) return "";
    return aoi?.id;
  };

  const removeAOI = (aoiIdToRemove: string) => {
    const currentAoiId = getAOIId();
    if (aoiIdToRemove === currentAoiId) {
      handleClear();
    }
    deleteAOIMutation.mutate(aoiIdToRemove);
  };

  const createAOI = (name: string) => {
    createAOIMutation.mutate({ name, filters: localFilters });
  };

  const updateAOI = (aoiIdToUpdate: string, name: string) => {
    updateAOIMutation.mutate({
      aoiId: aoiIdToUpdate,
      name,
      filters: localFilters,
    });
  };

  const mobile = isMobile();

  return (
    <div
      className={`flex-parent flex-parent--column changesets-filters bg-white ${
        mobile ? "viewport-full" : ""
      }`}
    >
      <FiltersHeader
        createAOI={createAOI}
        updateAOI={updateAOI}
        removeAOI={removeAOI}
        loading={loading}
        token={token}
        aoiName={getAOIName()}
        aoiId={getAOIId()}
        loadAoiId={loadAoiId}
        handleApply={handleApply}
        handleClear={handleClear}
        search={location.search}
      />
      <FiltersList
        loading={loading}
        filters={localFilters}
        active={active}
        handleFocus={handleFocus}
        handleChange={handleChange}
        handleToggleAll={handleToggleAll}
        replaceFiltersState={replaceFiltersState}
        token={token}
      />
    </div>
  );
}

export { Filters };
