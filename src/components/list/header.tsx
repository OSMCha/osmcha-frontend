import { NavLink } from "react-router-dom";
import filtersConfig from "../../config/filters.json";
import numberWithCommas from "../../utils/number_with_commas";
import { Button } from "../button";
import { Dropdown } from "../dropdown";

export function Header({
  filters,
  handleFilterOrderBy,
  location,
  diffLoading,
  diff,
  currentPage,
  reloadCurrentPage,
}: any) {
  const valueData: any[] = [];
  const orderByFilter = filtersConfig.find((f) => f.name === "order_by");
  const options = orderByFilter?.options ?? [];
  if (filters.get("order_by")) {
    options.forEach((o) => {
      if (filters.getIn(["order_by", 0, "value"]) === o.value) {
        valueData.push(o);
      }
    });
  }
  return (
    <div>
      <header className="px12 hmin36 border-b border--gray-light bg-gray-faint txt-s flex-parent justify--space-between align-items--center">
        <Dropdown
          onAdd={() => {}}
          onRemove={() => {}}
          onChange={handleFilterOrderBy}
          value={valueData}
          options={options}
          display={(valueData[0] && valueData[0].label) || "Order by"}
          position="left"
        />
        <NavLink
          activeStyle={{
            fontWeight: "bold",
          }}
          to={{
            search: location.search,
            pathname:
              location.pathname.indexOf("/filters") > -1 ? "/" : "/filters",
          }}
        >
          <Button className="mx3">
            Filters {filters.size > 0 && `(${filters.size})`}
          </Button>
        </NavLink>
      </header>
      <header
        className={`px12 border-l border-b border-b--1 border--gray-light px12 py6 ${
          diff > 0 ? "bg-darken10" : "bg-gray-faint"
        } flex-child align-items--center`}
      >
        <span className="flex-parent flex-parent--row justify--space-between color-gray txt-s txt-bold">
          <span>
            {(currentPage &&
              numberWithCommas(currentPage.getIn(["count"], 0))) ||
              0}{" "}
            changesets.
          </span>
          <span className="flex-parent flex-parent--row">
            {diffLoading ? (
              <span className="loading loading--s inline" />
            ) : (
              <Button
                className="mx3 btn--xs"
                iconName="rotate"
                onClick={reloadCurrentPage}
              >
                {diff > 0 ? `${diff} new` : ""}
              </Button>
            )}
          </span>
        </span>
      </header>
    </div>
  );
}
