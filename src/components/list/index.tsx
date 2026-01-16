import { useCallback, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { elementInViewport } from "../../utils/element_in_view";
import { SignInButton } from "../changeset/sign_in_button";
import { Loading } from "../loading";
import { Row } from "./row";

type CurrentPage = {
  features: Array<{
    id: number;
    properties: any;
  }>;
  count: number;
};

type propTypes = {
  currentPage: CurrentPage | undefined | null;
  activeChangesetId: number | undefined | null;
  pageIndex: number;
  loading?: boolean;
  location?: string;
};

function List({
  currentPage,
  activeChangesetId,
  loading,
  location,
}: propTypes) {
  const { token } = useAuth();
  const activeRef = useRef<HTMLElement | null>(null);

  const handleScroll = useCallback((r: HTMLElement | null) => {
    if (!r) return;
    activeRef.current = r;
    if (!elementInViewport(r)) {
      r.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (
    !token &&
    location &&
    ["/about", "/filters", "/user", "/"].includes(location)
  ) {
    return (
      <div className="flex-parent flex-parent--column scroll-styled flex-child--grow py36">
        <div className="flex-parent flex-parent--column flex-parent--center-cross">
          <svg className="icon h60 w60 inline-block align-middle pb3">
            <use xlinkHref="#icon-osm" />
          </svg>
        </div>
        <div className="flex-parent flex-parent--center-main align-center txt-l pt36">
          <SignInButton text="Sign in with your OpenStreetMap account" />
        </div>
      </div>
    );
  }

  const features = currentPage?.features;

  return (
    <ul className="flex-parent flex-parent--column scroll-styled flex-child--grow">
      <div>
        {features?.map((f, k) => (
          <Row
            active={f.id === activeChangesetId}
            properties={f.properties}
            changesetId={f.id}
            inputRef={f.id === activeChangesetId ? handleScroll : null}
            key={k}
          />
        ))}
      </div>
    </ul>
  );
}

export { List };
