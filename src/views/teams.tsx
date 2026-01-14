import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { SecondaryPagesHeader } from "../components/secondary_pages_header";
import NewTeam from "../components/teams/new_team";
import { BlockMarkup } from "../components/user/block_markup";
import { useAuth } from "../hooks/useAuth";
import {
  useCreateMappingTeam,
  useDeleteMappingTeam,
  useMappingTeams,
} from "../query/hooks/useMappingTeams";
import { isMobile } from "../utils";

const TeamsBlock = ({ data, removeTeam }) => (
  <BlockMarkup>
    <span>
      <span>{data.name}</span>
    </span>
    <span>
      <Link
        className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
        to={{
          search: `filters={"mapping_teams":[{"label":"${data.name}","value":"${data.name}"}]}`,
          pathname: "/filters",
        }}
      >
        Changesets
      </Link>
      <Link
        className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken5 bg-lighten25-on-hover color-gray transition"
        to={{ pathname: `/teams/${data.id}` }}
      >
        Edit
      </Link>
      <Button
        className="mr3 bg-transparent border--0"
        onClick={() => removeTeam(data.id)}
      >
        <svg className={"icon txt-m mb3 inline-block align-middle"}>
          <use xlinkHref="#icon-trash" />
        </svg>
        Delete
      </Button>
    </span>
  </BlockMarkup>
);

const ListFortified = ({ data, TargetBlock, propsToPass, SaveComp }) => (
  <div>
    {data.map((e, i) => (
      <TargetBlock key={i} data={e} {...propsToPass} />
    ))}
    {SaveComp}
  </div>
);

function MappingTeams() {
  const { token, user } = useAuth();
  const teamsQuery = useMappingTeams(token, user?.username);
  const createMutation = useCreateMappingTeam();
  const deleteMutation = useDeleteMappingTeam();
  const mobile = isMobile();

  const createTeam = (name: string, users: object) => {
    if (!name || !users || !token) return;

    createMutation.mutate({ token, name, users });
  };

  const removeTeam = (teamId: number) => {
    if (!teamId || !token) return;

    deleteMutation.mutate({ token, teamId });
  };

  const teams = teamsQuery.data || [];

  return (
    <div
      className={`flex-parent flex-parent--column changesets-filters bg-white${
        mobile ? "viewport-full" : ""
      }`}
    >
      <SecondaryPagesHeader title="Teams" avatar={user?.avatar} />
      <div className="px30 flex-child  pb60  filters-scroll">
        <div className="flex-parent flex-parent--column align justify--space-between">
          {token && (
            <div>
              <div className="mt24 mb12">
                <ListFortified
                  data={teams}
                  TargetBlock={TeamsBlock}
                  propsToPass={{
                    removeTeam: removeTeam,
                  }}
                  SaveComp={
                    <NewTeam
                      onCreate={createTeam}
                      editing={createMutation.isPending}
                      userIsOwner={true}
                    />
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { MappingTeams };
