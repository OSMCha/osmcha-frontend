import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import { getSearchObj } from "./utils/query_params";
import { About } from "./views/about";
import { Authorized } from "./views/authorized";
import { Changeset } from "./views/changeset";
import { ChangesetsList } from "./views/changesets_list";
import { EditMappingTeam } from "./views/edit_team";
import { Filters } from "./views/filters";
import { Home } from "./views/home";
import { NavbarSidebar } from "./views/navbar_sidebar";
import { SavedFilters } from "./views/saved_filters";
import { MappingTeams } from "./views/teams";
import { TrustedUsers } from "./views/trusted_users";
import { User } from "./views/user";
import { Watchlist } from "./views/watchlist";

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    if (document && document.body) {
      const searchObj = getSearchObj(window.location.search);
      const filters = searchObj.filters || {};
      if (filters && Object.keys(filters).length > 0) {
      }
    }
  }, []);

  useEffect(() => {
    const route = location.pathname.split("/")[1] || "home";
    document.body.className = `route-${route}`;
    return () => {
      document.body.className = "";
    };
  }, [location]);

  return (
    <>
      <div className="app-layout">
        <div className="app-sidebar">
          <NavbarSidebar />
          <ChangesetsList />
        </div>
        <div className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/filters" element={<Filters />} />
            <Route path="/changesets/:id" element={<Changeset />} />
            <Route path="/about" element={<About />} />
            <Route path="/user" element={<User />} />
            <Route path="/teams" element={<MappingTeams />} />
            <Route path="/teams/:id" element={<EditMappingTeam />} />
            <Route path="/saved-filters" element={<SavedFilters />} />
            <Route path="/trusted-users" element={<TrustedUsers />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/authorized" element={<Authorized />} />
          </Routes>
        </div>
      </div>
    </>
  );
};
