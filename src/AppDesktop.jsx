import { Route, Routes } from "react-router-dom";
import { About } from "./views/about";
import { Authorized } from "./views/authorized";
import { Changeset } from "./views/changeset";
import { ChangesetsList } from "./views/changesets_list";
import { EditMappingTeam } from "./views/edit_team";
import { Filters } from "./views/filters";
import { Home } from "./views/home";
import { Modal } from "./views/modal";
import { NavbarSidebar } from "./views/navbar_sidebar";
import { SavedFilters } from "./views/saved_filters";
import { Stats } from "./views/stats";
import { MappingTeams } from "./views/teams";
import { TrustedUsers } from "./views/trusted_users";
import { User } from "./views/user";
import { Watchlist } from "./views/watchlist";

export const AppDesktop = () => {
  return (
    <>
      <div className="grid">
        <div className="col col--3-mxl col--4-ml bg-gray--faint border-r border--gray-light border--1">
          <NavbarSidebar />
          <ChangesetsList />
        </div>
        <div className="col col--9-mxl col--8-ml col--12-mm">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/filters" element={<Filters />} />
            <Route path="/changesets/:id" element={<Changeset />} />
            <Route path="/about" element={<About />} />
            <Route path="/stats" element={<Stats />} />
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
      <Modal />
    </>
  );
};
