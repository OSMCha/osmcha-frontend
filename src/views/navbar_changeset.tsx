import Mousetrap from "mousetrap";
import { useCallback, useEffect } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { OpenIn } from "../components/changeset/open_in";
import { Tags } from "../components/changeset/tags";
import { Verify } from "../components/changeset/verify";
import { Navbar } from "../components/navbar";
import {
  OPEN_IN_ACHAVI,
  OPEN_IN_HDYC,
  OPEN_IN_ID,
  OPEN_IN_JOSM,
  OPEN_IN_LEVEL0,
  OPEN_IN_OSM,
  VERIFY_BAD,
  VERIFY_CLEAR,
  VERIFY_GOOD,
} from "../config/bindings";
import { useMarkHarmful } from "../query/hooks/useMarkHarmful";
import { useAuthStore } from "../stores/authStore";
import { isMobile } from "../utils/isMobile";

interface NavbarChangesetProps {
  changesetId: number;
  currentChangeset: any;
  username?: string;
  camera?: any;
}

export function NavbarChangeset({
  changesetId,
  currentChangeset,
  username,
  camera,
}: NavbarChangesetProps) {
  const token = useAuthStore((state) => state.token);
  const markHarmfulMutation = useMarkHarmful();

  const handleMarkHarmful = useCallback(
    (harmful: boolean | -1) => {
      if (!token) {
        toast.error("You must be logged in to mark changesets");
        return;
      }
      if (!username) {
        toast.error("Username not available");
        return;
      }

      markHarmfulMutation.mutate({
        changesetId,
        harmful,
        username,
      });
    },
    [username, changesetId, markHarmfulMutation, token],
  );

  useEffect(() => {
    if (!currentChangeset) return;

    const shortcuts = [
      {
        bindings: VERIFY_BAD.bindings,
        handler: () => handleMarkHarmful(true),
      },
      {
        bindings: VERIFY_CLEAR.bindings,
        handler: () => handleMarkHarmful(-1),
      },
      {
        bindings: VERIFY_GOOD.bindings,
        handler: () => handleMarkHarmful(false),
      },
      {
        bindings: OPEN_IN_JOSM.bindings,
        handler: () => {
          const url = `http://127.0.0.1:8111/import?url=https://www.openstreetmap.org/api/0.6/changeset/${changesetId}/download`;
          window.open(url, "_blank");
        },
      },
      {
        bindings: OPEN_IN_ID.bindings,
        handler: () => {
          const coordinates = currentChangeset.geometry?.coordinates?.[0]?.[0];
          if (!coordinates) return;
          const url = `https://www.openstreetmap.org/edit?changeset=${changesetId}#map=15/${coordinates[0]}/${coordinates[1]}`;
          window.open(url, "_blank");
        },
      },
      {
        bindings: OPEN_IN_OSM.bindings,
        handler: () => {
          window.open(
            `https://www.openstreetmap.org/changeset/${changesetId}`,
            "_blank",
          );
        },
      },
      {
        bindings: OPEN_IN_LEVEL0.bindings,
        handler: () => {
          window.open(
            `http://level0.osmz.ru/?url=changeset/${changesetId}`,
            "_blank",
          );
        },
      },
      {
        bindings: OPEN_IN_ACHAVI.bindings,
        handler: () => {
          window.open(
            `https://overpass-api.de/achavi/?changeset=${changesetId}`,
            "_blank",
          );
        },
      },
      {
        bindings: OPEN_IN_HDYC.bindings,
        handler: () => {
          const user = currentChangeset.properties?.user || "";
          window.open(`https://hdyc.neis-one.org/?${user}`, "_blank");
        },
      },
    ];

    for (const shortcut of shortcuts) {
      Mousetrap.bind(shortcut.bindings, (e) => {
        e.preventDefault();
        shortcut.handler();
      });
    }

    return () => {
      for (const shortcut of shortcuts) {
        Mousetrap.unbind(shortcut.bindings);
      }
    };
  }, [currentChangeset, changesetId, handleMarkHarmful]);

  const handleVerify = (arr: Array<any>) => {
    if (arr.length === 1) {
      handleMarkHarmful(arr[0].value);
    }
  };

  const handleVerifyClear = () => {
    handleMarkHarmful(-1);
  };

  const isChecked = () => currentChangeset?.properties?.checked;

  const mobile = isMobile();

  return (
    <Navbar
      className={`bg-gray-faint color-gray border-b border--gray-light border--1 ${
        mobile ? "" : "px30"
      }`}
      title={
        <div
          className={`flex-parent flex-parent--row flex-parent--wrap ${
            mobile ? "align-items--center" : ""
          }`}
        >
          {mobile && (
            <Link
              to={{
                search: window.location.search,
                pathname: "/",
              }}
              style={mobile ? { fontSize: "1.4em" } : { fontSize: "1.7em" }}
              className="color-gray mr3"
            >
              <button
                style={{ fontSize: mobile && "1.1em" }}
                className="btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition pt0 pb6 pl6 pr6 mr2"
              >
                ☰
              </button>{" "}
            </Link>
          )}
          {!mobile && (
            <div className="txt-l color-gray--dark">
              <strong>Changeset:</strong> {changesetId}
              <span className="mr6">
                <span
                  className="txt--s pl6 pointer"
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                  title="Copy OSMCha Changeset URL"
                >
                  <svg className="icon icon--s mt-neg3 ml3 inline-block align-middle bg-gray-faint color-darken25 color-darken50-on-hover transition">
                    <use xlinkHref="#icon-link" />
                  </svg>
                </span>
                <a
                  href={`https://www.openstreetmap.org/changeset/${changesetId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="See on OSM"
                >
                  <svg className="icon icon--s mt-neg3 ml3 inline-block align-middle bg-gray-faint color-darken25 color-darken50-on-hover transition">
                    <use xlinkHref="#icon-share" />
                  </svg>
                </a>
              </span>
            </div>
          )}
          <OpenIn
            changesetId={changesetId}
            display={
              mobile
                ? `${isChecked() ? "" : "Changeset"} ${changesetId}`
                : "Open with"
            }
            camera={camera}
            className=""
          />
        </div>
      }
      buttonsClassName="flex-parent"
      buttons={
        currentChangeset && (
          <>
            {currentChangeset.properties?.check_user && (
              <Tags
                changesetId={changesetId}
                currentChangeset={currentChangeset}
                disabled={false}
              />
            )}
            <Verify
              changeset={currentChangeset}
              onChange={handleVerify}
              onClear={handleVerifyClear}
              checkUser={currentChangeset.properties?.check_user}
              options={[
                {
                  value: false,
                  label: "Good",
                },
                {
                  value: true,
                  label: "Bad",
                },
              ]}
            />
          </>
        )
      }
    />
  );
}
