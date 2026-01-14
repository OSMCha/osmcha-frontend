import { Route } from "react-router-dom";
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
          <Route path="/" exact component={Home} />
          <Route path="/filters" component={Filters} />
          <Route path="/changesets/:id" component={Changeset} />
          <Route path="/about" component={About} />
          <Route path="/stats" component={Stats} />
          <Route path="/user" component={User} />
          <Route path="/teams" exact component={MappingTeams} />
          <Route path="/teams/:id" component={EditMappingTeam} />
          <Route path="/saved-filters" component={SavedFilters} />
          <Route path="/trusted-users" component={TrustedUsers} />
          <Route path="/watchlist" component={Watchlist} />
          <Route path="/authorized" component={Authorized} />
        </div>
      </div>
      <Modal />
    </>
  );
};
