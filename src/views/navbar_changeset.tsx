import { is, type Map } from "immutable";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { OpenIn } from "../components/changeset/open_in";
import { Tags } from "../components/changeset/tags";
import { Verify } from "../components/changeset/verify";
import { keyboardToggleEnhancer } from "../components/keyboard_enhancer";
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
import type { RootStateType } from "../store";

import {
  handleChangesetModifyHarmful,
  handleChangesetModifyTag,
} from "../store/changeset_actions";
import { isMobile } from "../utils";

type propsType = {
  changesetId: number;
  currentChangeset: Map<string, any>;
  username: string | undefined | null;
  lastKeyStroke: Map<string, any>;
  camera?: any;
  handleChangesetModifyTag: (
    d: number,
    c: Map<string, any>,
    b: any,
    a: boolean,
  ) => unknown;
  handleChangesetModifyHarmful: (
    c: number,
    b: Map<string, any>,
    a: boolean | -1,
  ) => unknown;
};

class _NavbarChangeset extends React.PureComponent<propsType, any> {
  componentWillReceiveProps(nextProps: propsType) {
    if (!this.props.currentChangeset) return;
    const lastKeyStroke: Map<string, any> = nextProps.lastKeyStroke;
    if (is(this.props.lastKeyStroke, lastKeyStroke)) return;
    switch (lastKeyStroke.keySeq().first()) {
      case VERIFY_BAD.label: {
        this.props.handleChangesetModifyHarmful(
          this.props.changesetId,
          this.props.currentChangeset,
          true,
        );
        break;
      }
      case VERIFY_CLEAR.label: {
        this.props.handleChangesetModifyHarmful(
          this.props.changesetId,
          this.props.currentChangeset,
          -1,
        );
        break;
      }
      case VERIFY_GOOD.label: {
        this.props.handleChangesetModifyHarmful(
          this.props.changesetId,
          this.props.currentChangeset,
          false,
        );
        break;
      }
      case OPEN_IN_JOSM.label: {
        if (!this.props.changesetId) return;
        const url = `http://127.0.0.1:8111/import?url=https://www.openstreetmap.org/api/0.6/changeset/${this.props.changesetId}/download`;
        window.open(url, "_blank");
        break;
      }
      case OPEN_IN_ID.label: {
        if (!this.props.changesetId || !this.props.currentChangeset) return;
        const coordinates = this.props.currentChangeset.getIn([
          "geometry",
          "coordinates",
          0,
          0,
        ]);
        if (!coordinates) return;

        let url = `https://www.openstreetmap.org/edit?changeset=${this.props.changesetId}`;
        url += `#map=15/${coordinates.get("0")}/${coordinates.get("1")}`;
        window.open(url, "_blank");
        break;
      }
      case OPEN_IN_OSM.label: {
        if (!this.props.changesetId) return;
        const url = `https://www.openstreetmap.org/changeset/${this.props.changesetId}`;
        window.open(url, "_blank");
        break;
      }
      case OPEN_IN_LEVEL0.label: {
        if (!this.props.changesetId) return;
        const url = `http://level0.osmz.ru/?url=changeset/${this.props.changesetId}`;
        window.open(url, "_blank");
        break;
      }
      case OPEN_IN_ACHAVI.label: {
        if (!this.props.changesetId) return;
        const url = `https://overpass-api.de/achavi/?changeset=${this.props.changesetId}`;
        window.open(url, "_blank");
        break;
      }
      case OPEN_IN_HDYC.label: {
        const user: string = this.props.currentChangeset.getIn(
          ["properties", "user"],
          "",
        );
        const url = `https://hdyc.neis-one.org/?${user}`;
        window.open(url, "_blank");
        break;
      }
      default: {
        return;
      }
    }
  }

  handleVerify = (arr: Array<any>) => {
    if (arr.length === 1) {
      this.props.handleChangesetModifyHarmful(
        this.props.changesetId,
        this.props.currentChangeset,
        arr[0].value, // whether harmful is true or false
      );
    } else if (arr.length > 1) {
      throw new Error("verify array is big");
    }
  };

  handleVerifyClear = () => {
    this.props.handleChangesetModifyHarmful(
      this.props.changesetId,
      this.props.currentChangeset,
      -1,
    );
  };

  isChecked = () =>
    this.props.currentChangeset &&
    this.props.currentChangeset.getIn(["properties", "checked"]);

  render() {
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
                <strong>Changeset:</strong> {this.props.changesetId}
                <span className="mr6">
                  <span
                    className="txt--s pl6 pointer"
                    onClick={(e) =>
                      navigator.clipboard.writeText(window.location.href)
                    }
                    title="Copy OSMCha Changeset URL"
                  >
                    <svg className="icon icon--s mt-neg3 ml3 inline-block align-middle bg-gray-faint color-darken25 color-darken50-on-hover transition">
                      <use xlinkHref="#icon-link" />
                    </svg>
                  </span>
                  <a
                    href={`https://www.openstreetmap.org/changeset/${this.props.changesetId}`}
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
              changesetId={this.props.changesetId}
              display={
                mobile
                  ? `${this.isChecked() ? "" : "Changeset"} ${
                      this.props.changesetId
                    }`
                  : "Open with"
              }
              camera={this.props.camera}
              className=""
            />
          </div>
        }
        buttonsClassName="flex-parent"
        buttons={
          this.props.currentChangeset && (
            <>
              {this.props.currentChangeset.getIn([
                "properties",
                "check_user",
              ]) && (
                <Tags
                  changesetId={this.props.changesetId}
                  currentChangeset={this.props.currentChangeset}
                  disabled={false}
                  handleChangesetModifyTag={this.props.handleChangesetModifyTag}
                />
              )}
              <Verify
                changeset={this.props.currentChangeset}
                value={[]}
                onChange={this.handleVerify}
                onClear={this.handleVerifyClear}
                username={this.props.username}
                checkUser={this.props.currentChangeset.getIn([
                  "properties",
                  "check_user",
                ])}
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
                className="select--s"
              />
            </>
          )
        }
      />
    );
  }
}

const _NavbarChangesetWithKeyboard = keyboardToggleEnhancer(
  false,
  [
    VERIFY_BAD,
    VERIFY_GOOD,
    VERIFY_CLEAR,
    OPEN_IN_JOSM,
    OPEN_IN_ID,
    OPEN_IN_OSM,
    OPEN_IN_LEVEL0,
    OPEN_IN_ACHAVI,
    OPEN_IN_HDYC,
  ],
  _NavbarChangeset,
);

const NavbarChangeset = connect(
  (state: RootStateType, props) => ({
    changesetId: parseInt(state.changeset.get("changesetId"), 10),
    currentChangeset: state.changeset.getIn([
      "changesets",
      parseInt(state.changeset.get("changesetId"), 10),
    ]),
    username: state.auth.getIn(["userDetails", "username"]),
  }),
  { handleChangesetModifyTag, handleChangesetModifyHarmful },
)(_NavbarChangesetWithKeyboard);

export { NavbarChangeset };
