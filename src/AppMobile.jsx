import { Route } from "react-router-dom";
import { About } from "./views/about";
import { Authorized } from "./views/authorized";
import { Changeset } from "./views/changeset";
import { ChangesetsList } from "./views/changesets_list";
import { EditMappingTeam } from "./views/edit_team";
import { Filters } from "./views/filters";
import { Modal } from "./views/modal";
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
        <Route path="/" exact component={ChangesetsList} />
        <Route path="/changesets/:id" component={Changeset} />
        <Route path="/about" component={About} />
        <Route path="/stats" component={Stats} />
        <Route path="/filters" component={Filters} />
        <Route path="/user" component={User} />
        <Route path="/saved-filters" component={SavedFilters} />
        <Route path="/trusted-users" component={TrustedUsers} />
        <Route path="/watchlist" component={Watchlist} />
        <Route path="/authorized" component={Authorized} />
        <Route path="/teams" exact component={MappingTeams} />
        <Route path="/teams/:id" component={EditMappingTeam} />
      </div>
      <Modal />
    </>
  );
};
