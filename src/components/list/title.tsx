import { parse } from "date-fns";
import { connect } from "react-redux";
import { useIsUserListed } from "../../hooks/UseIsUserListed";
import type { RootStateType } from "../../store";
import { RelativeTime } from "../relative_time";

function TitleComponent({
  properties,
  wasOpen,
  date,
  trustedlist,
  watchlisted,
}: any) {
  const [isInTrustedlist, isInWatchlist] = useIsUserListed(
    properties.get("user"),
    properties.get("uid"),
    trustedlist,
    watchlisted,
  );

  return (
    <div>
      <span className="flex-parent flex-parent--row justify--space-between align-items--center">
        <strong className="txt-m mt3 mr6">
          {properties.get("user") || <i>OSM User</i>}
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

const Title = connect((state: RootStateType, props) => ({
  trustedlist: state.trustedlist.get("trustedlist"),
  watchlisted: state.watchlist.get("watchlist"),
}))(TitleComponent);

export { Title };
