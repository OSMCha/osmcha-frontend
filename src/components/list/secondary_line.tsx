import { Link } from "react-router-dom";
import thumbsDown from "../../assets/thumbs-down.svg";
import thumbsUp from "../../assets/thumbs-up.svg";
import { getObjAsQueryParam } from "../../utils/query_params";
import { CreateDeleteModify } from "../create_delete_modify";
import { NumberOfComments } from "./comments";

export function SecondaryLine({ changesetId, date, properties }: any) {
  return (
    <span className="flex-parent flex-parent--row justify--space-between txt-light txt-s color-gray">
      <span>
        <Link
          to={{
            search: window.location.search,
            pathname: `/changesets/${changesetId}`,
          }}
          className="txt-underline-on-hover"
        >
          <span className="mr6">{changesetId}</span>
        </Link>
        {properties.checked ? (
          <Link
            to={{
              search: getObjAsQueryParam("filters", {
                users: [
                  {
                    label: properties.check_user,
                    value: properties.check_user,
                  },
                ],
                date__gte: [{ label: "", value: "" }],
              }),
              pathname: "/",
            }}
            title={`See ${properties.check_user}'s changesets`}
            className="txt-underline-on-hover"
          >
            {properties.harmful ? (
              <img
                src={thumbsDown}
                alt="Marked as bad"
                className="icon inline-block"
              />
            ) : (
              <img
                src={thumbsUp}
                alt="Marked as good"
                className="icon inline-block"
              />
            )}
            {properties.check_user && (
              <span className="pl6">{`by ${properties.check_user}`}</span>
            )}
          </Link>
        ) : null}
      </span>
      <span className="flex-parent flex-parent--row">
        {properties.comments_count > 0 && (
          <NumberOfComments count={properties.comments_count} />
        )}
        <CreateDeleteModify
          showZero
          className="mr3"
          create={properties.create}
          modify={properties.modify}
          delete={properties.delete}
        />
      </span>
    </span>
  );
}
//  <svg className="icon inline-block align-middle "> //       <use xlinkHref="#icon-options" /> //     </svg>
