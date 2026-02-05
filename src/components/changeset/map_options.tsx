import { useMapStore } from "../../stores/mapStore.ts";

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
}

const layerOptions = [
  { label: "Bing Maps Aerial", value: "bing" },
  { label: "Esri World Imagery", value: "esri" },
  { label: "Esri World Imagery (Clarity) Beta", value: "esri-clarity" },
  { label: "OpenStreetMap Carto", value: "carto" },
];

export function MapOptions({
  showElements,
  showActions,
  setShowElements,
  setShowActions,
}: MapOptionsProps) {
  const style = useMapStore((state) => state.style);
  const setStyle = useMapStore((state) => state.setStyle);

  return (
    <div className="px12 py6">
      <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">Map Controls</h2>
      <section>
        <h6 className="cursor-pointer txt-bold">Filter by actions</h6>

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
      <section>
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
      <section>
        <h6 className="cursor-pointer txt-bold">Map style</h6>
        <select value={style} onChange={(e) => setStyle(e.target.value)}>
          {layerOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </section>
    </div>
  );
}
