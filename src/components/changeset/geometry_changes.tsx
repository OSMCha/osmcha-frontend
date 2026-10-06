import deepEqual from "deep-equal";
import { useMemo, useRef } from "react";

import { ExpandItemIcon } from "../expand_item_icon.tsx";
import { Loading } from "../loading.tsx";
import { OpenAll } from "../open_all.tsx";
import {
  type Element,
  elementKey,
  useOpenGroups,
  useScrollToSelected,
} from "./selection.ts";
import { FeatureListItem } from "./tag_changes.tsx";

function geometryChangesFromActions(actions: any[]) {
  const finalReport = new Map<string, Element[]>();

  const nodes = actions
    .filter(
      (action) =>
        action.type === "modify" &&
        action.new.type === "node" &&
        (action.new.lon !== action.old.lon ||
          action.new.lat !== action.old.lat),
    )
    .map((action) => ({ type: "node", id: action.new.id }));

  const ways = actions
    .filter(
      (action) =>
        action.type === "modify" &&
        action.new.type === "way" &&
        !deepEqual(action.old.nodes, action.new.nodes),
    )
    .map((action) => ({ type: "way", id: action.new.id }));

  finalReport.set("node", nodes);
  finalReport.set("way", ways);

  return finalReport;
}

interface GeometryChangesItemProps {
  elementType: string;
  elements: Element[];
  isOpen: boolean;
  onToggle: () => void;
  selected: string | null;
  setHighlight: (type: string, id: number, isHighlighted: boolean) => void;
  zoomToAndSelect: (type: string, id: number) => void;
}

const GeometryChangesItem = ({
  elementType,
  elements,
  isOpen,
  onToggle,
  selected,
  setHighlight,
  zoomToAndSelect,
}: GeometryChangesItemProps) => {
  const titles: Record<string, string> = {
    node: "Nodes",
    way: "Ways",
    relation: "Relations",
  };
  return (
    <div>
      <button
        className="cursor-pointer"
        tabIndex={0}
        aria-pressed={isOpen}
        onClick={onToggle}
      >
        <ExpandItemIcon isOpen={isOpen} />
        <span className="txt-bold">{titles[elementType]}</span>
        <strong className="bg-blue-faint color-blue-dark mx6 px6 py3 txt-s round">
          {elements.length}
        </strong>
      </button>
      <ul style={{ display: isOpen ? "block" : "none" }}>
        {elements.map(({ type, id }) => (
          <FeatureListItem
            key={id}
            type={type}
            id={id}
            selected={elementKey(type, id) === selected}
            onMouseEnter={() => setHighlight(type, id, true)}
            onMouseLeave={() => setHighlight(type, id, false)}
            onFocus={() => setHighlight(type, id, true)}
            onBlur={() => setHighlight(type, id, false)}
            onClick={() => zoomToAndSelect(type, id)}
          />
        ))}
      </ul>
    </div>
  );
};

type Props = {
  changesetId: number;
  adiff: any;
  selected: string | null;
  setHighlight: (type: string, id: number, isHighlighted: boolean) => void;
  zoomToAndSelect: (type: string, id: number) => void;
};

function GeometryChanges({
  changesetId,
  adiff,
  selected,
  setHighlight,
  zoomToAndSelect,
}: Props) {
  const changeReport = useMemo(() => {
    if (!adiff) return [];
    return [...geometryChangesFromActions(adiff.actions)].filter(
      ([_, elements]) => elements.length,
    );
  }, [adiff]);
  const { isOpen, toggle, allOpen, setAllOpen } = useOpenGroups(
    changeReport,
    selected,
  );
  const ref = useRef<HTMLDivElement>(null);
  useScrollToSelected(ref, selected);

  return (
    <div className="px12 py6" ref={ref}>
      <div className="pb6">
        <h2 className="inline txt-m txt-uppercase txt-bold mr6 mb3">
          Geometry Changes
        </h2>
        {changeReport.length ? (
          <OpenAll isActive={allOpen} setOpenAll={setAllOpen} />
        ) : null}
      </div>
      {adiff ? (
        changeReport.length ? (
          changeReport.map(([elementType, elements]) => (
            <GeometryChangesItem
              key={elementType}
              elementType={elementType}
              elements={elements}
              isOpen={isOpen(elementType)}
              onToggle={() => toggle(elementType)}
              selected={selected}
              setHighlight={setHighlight}
              zoomToAndSelect={zoomToAndSelect}
            />
          ))
        ) : (
          <span>No geometry changes in this changeset.</span>
        )
      ) : (
        <Loading className="pt18" />
      )}
    </div>
  );
}

export { GeometryChanges };
