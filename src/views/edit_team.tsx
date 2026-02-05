import { useParams } from "react-router";
import { SecondaryPagesHeader } from "../components/secondary_pages_header.tsx";
import { SignIn } from "../components/sign_in.tsx";
import NewTeam from "../components/teams/new_team.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import {
  useMappingTeam,
  useUpdateMappingTeam,
} from "../query/hooks/useMappingTeams.ts";
import { isMobile } from "../utils/isMobile.ts";

interface TeamData {
  id?: number;
  avatar?: string;
  name?: string;
  owner?: string;
  users?: any[];
  [key: string]: any;
}

interface UserData {
  username?: string;
  [key: string]: any;
}

function EditMappingTeam() {
  const { id } = useParams<{ id: string }>();
  const teamId = id ? parseInt(id, 10) : null;
  const { token, user } = useAuth();
  const teamQuery = useMappingTeam(teamId);
  const updateMutation = useUpdateMappingTeam();
  const mobile = isMobile();
  const currentUser = user as UserData | undefined;

  const editTeam = (id: number, name: string, users: object) => {
    if (!name || !users || !token) return;

    updateMutation.mutate({
      teamId: id,
      name,
      users,
    });
  };

  const team = teamQuery.data as TeamData | undefined;

  return (
    <div
      className={`flex-parent flex-parent--column changesets-filters bg-white${
        mobile ? "viewport-full" : ""
      }`}
    >
      <SecondaryPagesHeader title="Edit team" avatar={currentUser?.avatar} />
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
                  activeTeam={team as any}
                  userIsOwner={team?.owner === currentUser?.username}
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
