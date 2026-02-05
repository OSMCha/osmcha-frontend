import { useEffect, useState } from "react";

import { ExpandItemIcon } from "../expand_item_icon.tsx";
import { Loading } from "../loading.tsx";
import { OpenAll } from "../open_all.tsx";
import { FeatureListItem } from "./tag_changes.tsx";

function otherChangesFromActions(actions: any[]) {
  const finalReport = new Map();

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
        (action) => action.type === "modify" && action.type === "relation",
      )
      .map((action) => ({ id: action.new.id, type: action.new.type })),
  );

  return finalReport;
}

interface ActionItemProps {
  opened: boolean;
  tag: string;
  features: any[];
  setHighlight: (type: string, id: number, isHighlighted: boolean) => void;
  zoomToAndSelect: (type: string, id: number) => void;
}

const ActionItem = ({
  opened,
  tag,
  features,
  setHighlight,
  zoomToAndSelect,
}: ActionItemProps) => {
  const [isOpen, setIsOpen] = useState(opened);
  const titles: Record<string, string> = {
    create: "Created",
    modify: "Modified Relations",
    delete: "Deleted",
  };

  useEffect(() => setIsOpen(opened), [opened]);

  return (
    <div>
      <button
        className="cursor-pointer"
        tabIndex={0}
        aria-pressed={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <ExpandItemIcon isOpen={isOpen} />
        <span className="txt-bold">{titles[tag]}</span>
        <strong className="bg-blue-faint color-blue-dark mx6 px6 py3 txt-s round">
          {features.length}
        </strong>
      </button>
      <ul style={{ display: isOpen ? "block" : "none" }}>
        {features.map((item: any, k: number) => (
          <FeatureListItem
            id={item.id}
            type={item.type}
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
  setHighlight: (type: string, id: number, isHighlighted: boolean) => void;
  zoomToAndSelect: (type: string, id: number) => void;
};

function OtherFeatures({
  changesetId,
  adiff,
  setHighlight,
  zoomToAndSelect,
}: Props) {
  const [changeReport, setChangeReport] = useState<Array<[string, any[]]>>([]);
  const [openAll, setOpenAll] = useState(false);

  useEffect(() => {
    const newChangeReport: Array<[string, any[]]> = [];
    if (adiff) {
      const processed = otherChangesFromActions(adiff.actions);
      for (const [tag, featureIDs] of processed) {
        newChangeReport.push([tag, featureIDs]);
      }
      setChangeReport(
        newChangeReport.filter((changeType) => changeType[1].length),
      );
    }
  }, [adiff]);

  return (
    <div className="px12 py6">
      <div className="pb6">
        <h2 className="inline txt-m txt-uppercase txt-bold mr6 mb3">
          Other features
        </h2>
        {changeReport.length ? (
          <OpenAll isActive={openAll} setOpenAll={setOpenAll} />
        ) : null}
      </div>
      {adiff ? (
        changeReport.length ? (
          changeReport.map((change, k) => (
            <ActionItem
              key={k}
              tag={change[0]}
              features={change[1]}
              opened={openAll}
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
