import { parse } from "date-fns";
import { useAuth } from "../../hooks/useAuth";
import { useIsUserListed } from "../../hooks/UseIsUserListed";
import { RelativeTime } from "../relative_time";

function Title({ properties, date }: any) {
  const { token } = useAuth();
  const [isInTrustedlist, isInWatchlist] = useIsUserListed(
    properties.user,
    properties.uid,
    token,
  );

  return (
    <div>
      <span className="flex-parent flex-parent--row justify--space-between align-items--center">
        <strong className="txt-m mt3 mr6">
          {properties.user || <i>OSM User</i>}
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
        </strong>
        <span className="txt-s mr3">
          &nbsp;
          <RelativeTime
            datetime={parse(date, "yyyy-MM-dd'T'HH:mm:ssX", new Date())}
          />
        </span>
      </span>
    </div>
  );
}

export { Title };
