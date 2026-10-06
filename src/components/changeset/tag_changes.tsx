import { useMemo, useRef } from "react";

import { groupBy } from "../../utils/group_by.ts";
import { ExpandItemIcon } from "../expand_item_icon.tsx";
import { Loading } from "../loading.tsx";
import { OpenAll } from "../open_all.tsx";
import { elementKey, useOpenGroups, useScrollToSelected } from "./selection.ts";

function tagChangesFromActions(actions: any[]) {
  const finalReport = new Map();
  const analyzedFeatures = actions.map(analyzeAction);
  const keys = ["addedTags", "changedValues", "deletedTags"];
  for (const item of analyzedFeatures) {
    for (const key of keys) {
      for (const tag of item.get(key)) {
        if (finalReport.get(tag[0])) {
          finalReport.set(
            tag[0],
            finalReport
              .get(tag[0])
              .concat([
                { id: item.get("id"), type: item.get("type"), value: tag[1] },
              ]),
          );
        } else {
          finalReport.set(tag[0], [
            { id: item.get("id"), type: item.get("type"), value: tag[1] },
          ]);
        }
      }
    }
  }
  return finalReport;
}

function analyzeAction(action: any) {
  const oldVersionKeys = Object.keys(action.old.tags);
  const newVersionKeys = Object.keys(action.new.tags);
  const addedTags = newVersionKeys.filter(
    (tag) => !oldVersionKeys.includes(tag),
  );
  const deletedTags = oldVersionKeys.filter(
    (tag) => !newVersionKeys.includes(tag),
  );
  const changedValues = newVersionKeys
    .filter((tag) => !addedTags.includes(tag) && !deletedTags.includes(tag))
    .filter((tag) => action.new.tags[tag] !== action.old.tags[tag]);
  const result = new Map();
  result
    .set("id", action.new.id)
    .set("type", action.new.type)
    .set(
      "addedTags",
      addedTags.map((tag) => [`Added tag ${tag}`, action.new.tags[tag]]),
    )
    .set(
      "deletedTags",
      deletedTags.map((tag) => [`Deleted tag ${tag}`, action.old.tags[tag]]),
    )
    .set(
      "changedValues",
      changedValues.map((tag) => [
        `Changed value of tag ${tag}`,
        [action.old.tags[tag], action.new.tags[tag]],
      ]),
    );
  return result;
}

interface FeatureListItemProps {
  id: number;
  type: string;
  selected: boolean;
  [key: string]: any;
}

export function FeatureListItem({
  id,
  type,
  selected,
  ...props
}: FeatureListItemProps) {
  return (
    <li>
      <span
        className="feature-list-item cursor-pointer txt-bold-on-hover"
        role="button"
        tabIndex={0}
        aria-current={selected || undefined}
        {...props}
      >
        {type}/{id}
      </span>
    </li>
  );
}

function ChangeTitle({ value, type }: { value: any; type: string }) {
  if (type.startsWith("Added")) {
    return <span className="txt-code cmap-bg-create-light">{value}</span>;
  }
  if (type.startsWith("Deleted")) {
    return <span className="txt-code cmap-bg-delete-light">{value}</span>;
  }
  if (type.startsWith("Changed")) {
    const [oldValue, newValue] = value;
    // dir="auto" solves a display issue when tag values are in RTL scripts (e.g. Arabic, Hebrew).
    // See https://github.com/OSMCha/osmcha-frontend/issues/765
    return (
      <span>
        <span className="txt-code cmap-bg-modify-old-light" dir="auto">
          {oldValue}
        </span>
        <strong> ➜ </strong>
        <span className="txt-code cmap-bg-modify-new-light" dir="auto">
          {newValue}
        </span>
      </span>
    );
  }
  return <div></div>;
}

interface ChangeItemProps {
  isOpen: boolean;
  onToggle: () => void;
  tag: string;
  features: any[];
  selected: string | null;
  setHighlight: (type: string, id: number, isHighlighted: boolean) => void;
  zoomToAndSelect: (type: string, id: number) => void;
}

const ChangeItem = ({
  isOpen,
  onToggle,
  tag,
  features,
  selected,
  setHighlight,
  zoomToAndSelect,
}: ChangeItemProps) => {
  const groups = groupBy(features, (f: any) => JSON.stringify(f.value));
  const last_space = tag.lastIndexOf(" ") + 1;

  return (
    <div>
      <button
        className="cursor-pointer"
        tabIndex={0}
        aria-pressed={isOpen}
        onClick={onToggle}
      >
        <ExpandItemIcon isOpen={isOpen} />
        <span className="txt-bold">{tag.slice(0, last_space)}</span>
        <span className="txt-code">{tag.slice(last_space)}</span>
        <strong className="bg-blue-faint color-blue-dark mx6 px6 py3 txt-s round">
          {features.length}
        </strong>
      </button>
      {[...groups.values()].map((group, n) => (
        <div
          className="ml18 py3"
          style={{ display: isOpen ? "block" : "none" }}
          key={n}
        >
          <ChangeTitle value={group[0].value} type={tag} />
          <ul className="ml6">
            {group.map((feature: any, k: number) => (
              <FeatureListItem
                type={feature.type}
                id={feature.id}
                selected={elementKey(feature.type, feature.id) === selected}
                key={k}
                onMouseEnter={() =>
                  setHighlight(feature.type, feature.id, true)
                }
                onMouseLeave={() =>
                  setHighlight(feature.type, feature.id, false)
                }
                onFocus={() => setHighlight(feature.type, feature.id, true)}
                onBlur={() => setHighlight(feature.type, feature.id, false)}
                onClick={() => zoomToAndSelect(feature.type, feature.id)}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

interface ChangeItemListProps {
  changes: Array<[string, any[]]>;
  isOpen: (tag: string) => boolean;
  toggle: (tag: string) => void;
  selected: string | null;
  setHighlight: (type: string, id: number, isHighlighted: boolean) => void;
  zoomToAndSelect: (type: string, id: number) => void;
}

const ChangeItemList = ({
  changes,
  isOpen,
  toggle,
  selected,
  setHighlight,
  zoomToAndSelect,
}: ChangeItemListProps) => {
  return (
    <>
      {changes.length ? (
        changes.map((change: any, k: number) => (
          <ChangeItem
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
        <span>No tags were changed in this changeset.</span>
      )}
    </>
  );
};

type Props = {
  changesetId: number;
  adiff: any;
  selected: string | null;
  setHighlight: (type: string, id: number, isHighlighted: boolean) => void;
  zoomToAndSelect: (type: string, id: number) => void;
};

function TagChanges({
  changesetId,
  adiff,
  selected,
  setHighlight,
  zoomToAndSelect,
}: Props) {
  const changeReport = useMemo(() => {
    if (!adiff) return [];
    const modifyActions = adiff.actions.filter(
      (action: any) => action.type === "modify",
    );
    const processed: Array<[string, any[]]> = [
      ...tagChangesFromActions(modifyActions),
    ];
    return processed.sort();
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
          Tag changes
        </h2>
        {changeReport.length ? (
          <OpenAll isActive={allOpen} setOpenAll={setAllOpen} />
        ) : null}
      </div>
      {adiff ? (
        <ChangeItemList
          changes={changeReport}
          isOpen={isOpen}
          toggle={toggle}
          selected={selected}
          setHighlight={setHighlight}
          zoomToAndSelect={zoomToAndSelect}
        />
      ) : (
        <Loading className="pt18" />
      )}
    </div>
  );
}

export { TagChanges };
