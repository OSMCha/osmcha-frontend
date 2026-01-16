import { parse } from "date-fns";
import { useIsUserListed } from "../../hooks/UseIsUserListed";
import { useAuth } from "../../hooks/useAuth";
import { CreateDeleteModify } from "../create_delete_modify";
import { RelativeTime } from "../relative_time";
import { Details } from "./details";

type Props = {
  properties: any;
  changesetId: number;
  userEditCount: number;
  toggleUser: () => unknown;
};

function Header({ properties, changesetId, userEditCount, toggleUser }: Props) {
  const { token } = useAuth();
  const user = properties.user;
  const date = parse(properties.date, "yyyy-MM-dd'T'HH:mm:ssX", new Date());
  const create = properties.create;
  const modify = properties.modify;
  const destroy = properties.delete;
  const [isInTrustedlist, isInWatchlist] = useIsUserListed(
    user,
    properties.uid,
    token,
  );

  return (
    <div className="px12 py6">
      <div className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap">
        <div className="flex-parent flex-parent--row justify--space-between">
          <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">Details</h2>
          <div>
            <CreateDeleteModify
              showZero
              className="mr3 mt3"
              create={create}
              modify={modify}
              delete={destroy}
            />
          </div>
        </div>
        <div className="flex-parent flex-parent--row justify--space-between flex-parent--wrap">
          <span className="txt-s">
            <strong className="txt-underline-on-hover cursor-pointer">
              <span dir="ltr cursor-pointer" onClick={toggleUser}>
                {user}
              </span>
            </strong>
            {isInTrustedlist && (
              <svg className="icon inline-block align-middle pl3 w18 h18 color-yellow">
                <use xlinkHref="#icon-star" />
              </svg>
            )}
            {isInWatchlist && (
              <svg className="icon inline-block align-middle pl3 w18 h18 color-red">
                <use xlinkHref="#icon-alert" />
              </svg>
            )}
            {userEditCount > 0 && (
              <span className="txt-s txt-em">
                &nbsp;({userEditCount} edits)
              </span>
            )}
            &nbsp;created&nbsp;
            <RelativeTime datetime={date} />
          </span>
        </div>
      </div>
      <Details changesetId={changesetId} properties={properties} />
    </div>
  );
}

export { Header };
