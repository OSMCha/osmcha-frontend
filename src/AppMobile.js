import React from 'react';
import { Route } from 'react-router-dom';

import { Changeset } from './views/changeset';
import { About } from './views/about';
import { Stats } from './views/stats';
import { Filters } from './views/filters';
import { ChangesetsList } from './views/changesets_list';
import { NavbarSidebar } from './views/navbar_sidebar';
import { Authorized } from './views/authorized';
import { Modal } from './views/modal';
import { User } from './views/user';
import { SavedFilters } from './views/saved_filters';
import { TrustedUsers } from './views/trusted_users';
import { Watchlist } from './views/watchlist';
import { MappingTeams } from './views/teams';
import { EditMappingTeam } from './views/edit_team';

export const AppMobile = () => {
  return (
    <>
      <div
        className="flex-parent flex-parent--column"
        style={{ height: '100vh' }}
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
