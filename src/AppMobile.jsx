import { Route, Routes } from "react-router-dom";
import { About } from "./views/about";
import { Authorized } from "./views/authorized";
import { Changeset } from "./views/changeset";
import { ChangesetsList } from "./views/changesets_list";
import { EditMappingTeam } from "./views/edit_team";
import { Filters } from "./views/filters";
import { NavbarSidebar } from "./views/navbar_sidebar";
import { SavedFilters } from "./views/saved_filters";
import { Stats } from "./views/stats";
import { MappingTeams } from "./views/teams";
import { TrustedUsers } from "./views/trusted_users";
import { User } from "./views/user";
import { Watchlist } from "./views/watchlist";

export const AppMobile = () => {
  return (
    <>
      <div
        className="flex-parent flex-parent--column"
        style={{ height: "100vh" }}
      >
        <NavbarSidebar />
        <Routes>
          <Route path="/" element={<ChangesetsList />} />
          <Route path="/changesets/:id" element={<Changeset />} />
          <Route path="/about" element={<About />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/filters" element={<Filters />} />
          <Route path="/user" element={<User />} />
          <Route path="/saved-filters" element={<SavedFilters />} />
          <Route path="/trusted-users" element={<TrustedUsers />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/authorized" element={<Authorized />} />
          <Route path="/teams" element={<MappingTeams />} />
          <Route path="/teams/:id" element={<EditMappingTeam />} />
        </Routes>
      </div>
    </>
  );
};
