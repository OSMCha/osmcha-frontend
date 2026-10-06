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

function otherChangesFromActions(actions: any[]) {
  const finalReport = new Map<string, Element[]>();

  for (const actionType of ["create", "delete"]) {
    finalReport.set(
      actionType,
      actions
        .filter((action) => action.type === actionType)
        .map((action) => ({ id: action.new.id, type: action.new.type })),
    );
  }

  finalReport.set(
    "modify",
    actions
      .filter(
        (action) => action.type === "modify" && action.new.type === "relation",
      )
      .map((action) => ({ id: action.new.id, type: action.new.type })),
  );

  return finalReport;
}

interface ActionItemProps {
  isOpen: boolean;
  onToggle: () => void;
  tag: string;
  features: Element[];
  selected: string | null;
  setHighlight: (type: string, id: number, isHighlighted: boolean) => void;
  zoomToAndSelect: (type: string, id: number) => void;
}

const ActionItem = ({
  isOpen,
  onToggle,
  tag,
  features,
  selected,
  setHighlight,
  zoomToAndSelect,
}: ActionItemProps) => {
  const titles: Record<string, string> = {
    create: "Created",
    modify: "Modified Relations",
    delete: "Deleted",
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
        <span className="txt-bold">{titles[tag]}</span>
        <strong className="bg-blue-faint color-blue-dark mx6 px6 py3 txt-s round">
          {features.length}
        </strong>
      </button>
      <ul style={{ display: isOpen ? "block" : "none" }}>
        {features.map((item, k) => (
          <FeatureListItem
            id={item.id}
            type={item.type}
            selected={elementKey(item.type, item.id) === selected}
            key={k}
            onMouseEnter={() => setHighlight(item.type, item.id, true)}
            onMouseLeave={() => setHighlight(item.type, item.id, false)}
            onFocus={() => setHighlight(item.type, item.id, true)}
            onBlur={() => setHighlight(item.type, item.id, false)}
            onClick={() => zoomToAndSelect(item.type, item.id)}
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

function OtherFeatures({
  changesetId,
  adiff,
  selected,
  setHighlight,
  zoomToAndSelect,
}: Props) {
  const changeReport = useMemo(() => {
    if (!adiff) return [];
    return [...otherChangesFromActions(adiff.actions)].filter(
      ([_, features]) => features.length,
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
          Other features
        </h2>
        {changeReport.length ? (
          <OpenAll isActive={allOpen} setOpenAll={setAllOpen} />
        ) : null}
      </div>
      {adiff ? (
        changeReport.length ? (
          changeReport.map((change, k) => (
            <ActionItem
              key={k}
              tag={change[0]}
              features={change[1]}
              isOpen={isOpen(change[0])}
              onToggle={() => toggle(change[0])}
              selected={selected}
              setHighlight={setHighlight}
              zoomToAndSelect={zoomToAndSelect}
            />
          ))
        ) : (
          <span>No created and deleted features in this changeset.</span>
        )
      ) : (
        <Loading className="pt18" />
      )}
    </div>
  );
}

export { OtherFeatures };
