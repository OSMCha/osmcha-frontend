import React from "react";
import { connect } from "react-redux";

import type { RootStateType } from "../../store";
import { updateStyle } from "../../store/map_controls_actions";

// helper functions for adding/removing elements from an array when a
// checkbox is toggled
const add = (arr: string[], elem: string): string[] => {
  const set = new Set(arr);
  set.add(elem);
  return Array.from(set);
};

const remove = (arr: string[], elem: string): string[] => {
  const set = new Set(arr);
  set.delete(elem);
  return Array.from(set);
};

const toggle = (arr: string[], elem: string): string[] => {
  return arr.indexOf(elem) === -1 ? add(arr, elem) : remove(arr, elem);
};

interface MapOptionsProps {
  showElements: Array<string>;
  showActions: Array<string>;
  setShowElements: (elements: Array<string>) => void;
  setShowActions: (actions: Array<string>) => void;
  style?: string;
  updateStyle?: (style: string) => void;
}

class _MapOptions extends React.PureComponent<MapOptionsProps> {
  layerOptions = [
    { label: "Bing Maps Aerial", value: "bing" },
    { label: "Esri World Imagery", value: "esri" },
    { label: "Esri World Imagery (Clarity) Beta", value: "esri-clarity" },
    { label: "OpenStreetMap Carto", value: "carto" },
  ];

  render() {
    const { showElements, showActions, setShowElements, setShowActions } =
      this.props;

    return (
      <div className="px12 py6">
        <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">Map Controls</h2>
        <section className="cmap-filter-action-section cmap-pt3">
          <h6 className="cmap-heading cursor-pointer txt-bold">
            Filter by actions
          </h6>

          <ul className="flex-parent">
            <li className="px6">
              <label>
                <input
                  type="checkbox"
                  style={{ accentColor: "#39DBC0" }}
                  checked={showActions.includes("create")}
                  onChange={() => setShowActions(toggle(showActions, "create"))}
                />
                Added
              </label>
            </li>
            <li className="px6">
              <label>
                <input
                  type="checkbox"
                  style={{ accentColor: "#E7BA60" }}
                  checked={showActions.includes("modify")}
                  onChange={() => setShowActions(toggle(showActions, "modify"))}
                />
                Modified
              </label>
            </li>
            <li className="px6">
              <label>
                <input
                  type="checkbox"
                  style={{ accentColor: "#CC2C47" }}
                  checked={showActions.includes("delete")}
                  onChange={() => setShowActions(toggle(showActions, "delete"))}
                />
                Deleted
              </label>
            </li>
            <li className="px6">
              <label>
                <input
                  type="checkbox"
                  style={{ accentColor: "#8B79C4" }}
                  checked={showActions.includes("noop")}
                  onChange={() => setShowActions(toggle(showActions, "noop"))}
                />
                Unchanged
              </label>
            </li>
          </ul>
        </section>
        <section className="cmap-filter-type-section">
          <h6 className="txt-bold">Filter by type</h6>
          <ul className="flex-parent">
            <li className="px6">
              <label>
                <input
                  type="checkbox"
                  checked={showElements.includes("node")}
                  onChange={() => setShowElements(toggle(showElements, "node"))}
                />
                Nodes{" "}
                <svg className="icon h18 w18 inline-block align-middle color-black">
                  <use xlinkHref="#icon-marker" />
                </svg>
              </label>
            </li>
            <li className="px6">
              <label>
                <input
                  type="checkbox"
                  checked={showElements.includes("way")}
                  onChange={() => setShowElements(toggle(showElements, "way"))}
                />
                Ways{" "}
                <svg className="icon h18 w18 inline-block align-middle color-black">
                  <use xlinkHref="#icon-polyline" />
                </svg>
              </label>
            </li>
            <li className="px6">
              <label>
                <input
                  type="checkbox"
                  checked={showElements.includes("relation")}
                  onChange={() =>
                    setShowElements(toggle(showElements, "relation"))
                  }
                />
                Relations{" "}
                <svg className="icon h18 w18 inline-block align-middle color-black">
                  <use xlinkHref="#icon-viewport" />
                </svg>
              </label>
            </li>
          </ul>
        </section>
        <section className="cmap-map-style-section cmap-pb3">
          <h6 className="cmap-heading cursor-pointer txt-bold">Map style</h6>
          <select
            value={this.props.style}
            onChange={(e) => this.props.updateStyle?.(e.target.value)}
          >
            {this.layerOptions.map((opt) => (
              <option value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </section>
      </div>
    );
  }
}

const MapOptions = connect(
  (state: RootStateType, props) => ({ style: state.mapControls.get("style") }),
  { updateStyle },
)(_MapOptions);

export { MapOptions };
