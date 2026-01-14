import { useParams } from "react-router-dom";
import { SecondaryPagesHeader } from "../components/secondary_pages_header";
import { SignIn } from "../components/sign_in";
import NewTeam from "../components/teams/new_team";
import { useAuth } from "../hooks/useAuth";
import {
  useMappingTeam,
  useUpdateMappingTeam,
} from "../query/hooks/useMappingTeams";
import { isMobile } from "../utils";

function EditMappingTeam() {
  const { id } = useParams<{ id: string }>();
  const teamId = id ? parseInt(id, 10) : null;
  const { token, user } = useAuth();
  const teamQuery = useMappingTeam(token, teamId);
  const updateMutation = useUpdateMappingTeam();
  const mobile = isMobile();

  const editTeam = (id: string, name: string, users: object) => {
    if (!name || !users || !token) return;

    updateMutation.mutate({
      token,
      teamId: parseInt(id, 10),
      name,
      users,
    });
  };

  const team = teamQuery.data;

  return (
    <div
      className={`flex-parent flex-parent--column changesets-filters bg-white${
        mobile ? "viewport-full" : ""
      }`}
    >
      <SecondaryPagesHeader title="Edit team" avatar={user?.avatar} />
      {token ? (
        <div className="px30 flex-child  pb60  filters-scroll">
          <div className="flex-parent flex-parent--column align justify--space-between">
            <div>
              <div className="mt24 mb12">
                <h2 className="pl12 txt-xl mr6 border-b border--gray-light border--1">
                  <strong>Editing mapping team: </strong>
                  {team?.name}
                </h2>
                <NewTeam
                  onChange={editTeam}
                  editing={updateMutation.isPending}
                  activeTeam={team}
                  userIsOwner={team?.owner === user?.username}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
}

export { EditMappingTeam };
