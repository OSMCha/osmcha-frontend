import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { push } from "redux-first-history";
import { API_URL } from "../../config";
import { withRouter } from "../../utils/withRouter";
import { fetchAllAOIs } from "../../network/aoi";
import type { RootStateType } from "../../store";
import { cancelablePromise } from "../../utils/promise";
import { Button } from "../button";
import { Dropdown } from "../dropdown";

interface SaveAOIProps {
  name?: string;
  aoiList: Array<any>;
  aoiId?: string;
  updateAOI: (id: string, name: string) => void;
  createAOI: (name: string) => void;
}

interface SaveAOIState {
  editing: boolean;
  value: string;
}

class SaveAOI extends React.PureComponent<SaveAOIProps, SaveAOIState> {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      value: props.name || "",
    };
  }
  ref;
  clicked = false;
  onClick = (event) => {
    this.clicked = true;
    this.setState({ editing: true, value: this.props.name || "" });
  };
  onChange = (event: any) => {
    this.setState({ value: event.target.value });
  };
  onKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.handleSubmit(event);
    } else if (event.keyCode === 27) {
      this.setState({
        editing: false,
        value: this.props.name || "",
      });
      this.clicked = false;
    }
  };
  handleSubmit = (event) => {
    this.setState({
      editing: false,
    });
    const aoiList = this.props.aoiList.filter(
      (aoi) => aoi.value === this.props.aoiId,
    );
    if (this.props.aoiId && aoiList.length) {
      this.props.updateAOI(this.props.aoiId, this.state.value);
    } else {
      this.props.createAOI(this.state.value);
    }
  };
  // handleFocus = event => {
  //   event.target.select();
  // };
  render() {
    return (
      <span>
        {this.state.editing ? (
          <span>
            <input
              ref={(r) => {
                if (this.clicked && r) {
                  r.select();
                  this.clicked = false;
                }
              }}
              value={this.state.value}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
            />
            <Button onClick={this.handleSubmit} className="mx3">
              Confirm Save
            </Button>
          </span>
        ) : (
          <Button onClick={this.onClick} className="border--0 bg-transparent">
            Save
          </Button>
        )}
      </span>
    );
  }
}

type filterProps = {
  createAOI: (a: string) => void;
  updateAOI: (a: string) => void;
  removeAOI: (a: string) => void;
  loading: boolean;
  search: string;
  token?: string;
  aoiName?: string;
  aoiId?: string;
  handleApply: () => void;
  handleClear: () => void;
  loadAoiId: (a: string) => void;
  location: any;
  push: (a: any) => any;
};

interface FiltersHeaderState {
  aoiList: Array<any>;
}

class _FiltersHeader extends React.Component<filterProps, FiltersHeaderState> {
  getAoisPromise;
  state: FiltersHeaderState = {
    aoiList: [],
  };

  componentDidMount() {
    this.getAois();
  }

  componentWillUnmount() {
    this.getAoisPromise && this.getAoisPromise.cancel();
  }

  getAois() {
    if (this.props.token) {
      this.getAoisPromise = cancelablePromise(fetchAllAOIs(this.props.token));
      this.getAoisPromise.promise
        .then((r) => {
          const aoiList = r.features.map((aoi) => {
            return { label: aoi.properties.name, value: aoi.id };
          });
          this.setState({ aoiList: aoiList });
        })
        .catch((e) => console.log(e));
    }
  }

  renderRssLink() {
    if (this.props.aoiId) {
      return (
        <a
          className="txt--s pl6"
          href={`${API_URL}/aoi/${this.props.aoiId}/changesets/feed/`}
          title="RSS Feed"
        >
          <svg className="icon icon--s mt-neg3 inline-block align-middle bg-gray-faint color-darken25 color-darken50-on-hover transition">
            <use xlinkHref="#icon-rss" />
          </svg>
        </a>
      );
    }
  }

  renderAoiLink() {
    if (this.props.aoiId) {
      return (
        <div
          className="txt--s pl6 pointer inline"
          onClick={(e) =>
            navigator.clipboard.writeText(
              `${API_URL.replace("/api/v1", "")}/?aoi=${this.props.aoiId}`,
            )
          }
          title="Copy filter URL"
        >
          <svg className="icon icon--s mt-neg3 inline-block align-middle bg-gray-faint color-darken25 color-darken50-on-hover transition">
            <use xlinkHref="#icon-link" />
          </svg>
        </div>
      );
    }
  }

  onAoiSelect = (arr: Array<any>) => {
    if (arr.length === 1) {
      this.props.push({
        ...this.props.location,
        search: `aoi=${arr[0].value}`,
        path: "/filters",
      });
    } else if (arr.length > 1) {
      throw new Error("filter select array is big");
    }
  };

  renderFilterInfo() {
    const dropdown = (
      <Dropdown
        display={"My Filters"}
        options={this.state.aoiList}
        onChange={this.onAoiSelect}
        value={[]}
        onAdd={() => {}}
        onRemove={() => {}}
        position="left"
      />
    );
    if (this.props.token && this.state.aoiList.length) {
      return <span>{dropdown}</span>;
    }
  }

  render() {
    var save_aoi: React.ReactNode = "";
    if (this.props.token) {
      save_aoi = (
        <SaveAOI
          name={this.props.aoiName}
          aoiId={this.props.aoiId}
          aoiList={this.state.aoiList}
          createAOI={this.props.createAOI}
          updateAOI={this.props.updateAOI}
        />
      );
    }

    return (
      <header className="h55 hmin55 flex-parent px30 bg-gray-faint flex-parent--center-cross justify--space-between color-gray border-b border--gray-light border--1">
        <span className="txt-s color-gray--dark">
          {this.renderFilterInfo()}
        </span>
        <span className="txt-l txt-bold color-gray--dark">
          <span>
            Filters
            {this.props.aoiId && <span> / {this.props.aoiName}</span>}
            {this.renderAoiLink()}
            {this.renderRssLink()}
          </span>
        </span>
        <span className="txt-l color-gray--dark">
          {save_aoi}
          <Button
            className="border--0 bg-transparent"
            onClick={this.props.handleClear}
          >
            Reset
          </Button>
          <Button onClick={this.props.handleApply} className="mx3">
            Apply
          </Button>
          <Link
            to={{ search: this.props.search, pathname: "/" }}
            className="mx3 pointer"
          >
            <svg className="icon icon--m inline-block align-middle bg-gray-faint color-darken25 color-darken50-on-hover transition">
              <use xlinkHref="#icon-close" />
            </svg>
          </Link>
        </span>
      </header>
    );
  }
}

const FiltersHeader = withRouter(
  connect(
    (state: RootStateType, props: any) => ({
      location: props.location,
    }),
    {
      push,
    },
  )(_FiltersHeader),
);

export { FiltersHeader };
