// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { OrderedSet } from 'immutable';

import type { RootStateType } from '../../store';
import { Loading } from '../loading';
import { OpenAll } from '../open_all';
import { ExpandItemIcon } from '../expand_item_icon';

export function tagChangesFromActions(actions) {
  const finalReport = new Map();
  const analyzedFeatures = actions.map(analyzeAction);
  const keys = ['addedTags', 'changedValues', 'deletedTags'];
  analyzedFeatures.map(item =>
    keys.map(key =>
      item.get(key).forEach(tag => {
        if (finalReport.get(tag[0])) {
          finalReport.set(
            tag[0],
            finalReport
              .get(tag[0])
              .concat([
                { id: item.get('id'), type: item.get('type'), value: tag[1] }
              ])
          );
        } else {
          finalReport.set(tag[0], [
            { id: item.get('id'), type: item.get('type'), value: tag[1] }
          ]);
        }
      })
    )
  );
  return finalReport;
}

export function analyzeAction(action) {
  const oldVersionKeys = Object.keys(action.old.tags);
  const newVersionKeys = Object.keys(action.new.tags);
  const addedTags = newVersionKeys.filter(tag => !oldVersionKeys.includes(tag));
  const deletedTags = oldVersionKeys.filter(
    tag => !newVersionKeys.includes(tag)
  );
  const changedValues = newVersionKeys
    .filter(tag => !addedTags.includes(tag) && !deletedTags.includes(tag))
    .filter(tag => action.new.tags[tag] !== action.old.tags[tag]);
  const result = new Map();
  result
    .set('id', action.new.id)
    .set('type', action.new.type)
    .set(
      'addedTags',
      addedTags.map(tag => [`Added tag ${tag}`, action.new.tags[tag]])
    )
    .set(
      'deletedTags',
      deletedTags.map(tag => [`Deleted tag ${tag}`, action.old.tags[tag]])
    )
    .set(
      'changedValues',
      changedValues.map(tag => [
        `Changed value of tag ${tag}`,
        [action.old.tags[tag], action.new.tags[tag]]
      ])
    );
  return result;
}

export function FeatureListItem({ id, type, ...props }) {
  return (
    <li>
      <span
        className="cursor-pointer txt-bold-on-hover"
        role="button"
        tabIndex="0"
        {...props}
      >
        {type}/{id}
      </span>
    </li>
  );
}

function ChangeTitle({ value, type }) {
  if (type.startsWith('Added')) {
    return <span className="txt-code cmap-bg-create-light">{value}</span>;
  }
  if (type.startsWith('Deleted')) {
    return <span className="txt-code cmap-bg-delete-light">{value}</span>;
  }
  if (type.startsWith('Changed')) {
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

export const ChangeItem = ({
  opened,
  tag,
  features,
  setHighlight,
  zoomToAndSelect
}) => {
  const [isOpen, setIsOpen] = useState(opened);
  const values = new OrderedSet(features.map(feature => feature.value));
  const last_space = tag.lastIndexOf(' ') + 1;

  useEffect(() => setIsOpen(opened), [opened]);

  return (
    <div>
      <button
        className="cursor-pointer"
        tabIndex="0"
        aria-pressed={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <ExpandItemIcon isOpen={isOpen} />
        <span className="txt-bold">{tag.slice(0, last_space)}</span>
        <span className="txt-code">{tag.slice(last_space)}</span>
        <strong className="bg-blue-faint color-blue-dark mx6 px6 py3 txt-s round">
          {features.length}
        </strong>
      </button>
      {values.map((value, n) => (
        <div
          className="ml18 py3"
          style={{ display: isOpen ? 'block' : 'none' }}
          key={n}
        >
          <ChangeTitle value={value} type={tag} />
          <ul className="ml6">
            {features
              .filter(feature => feature.value === value)
              .map((feature, k) => (
                <FeatureListItem
                  type={feature.type}
                  id={feature.id}
                  value={feature.value}
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

const ChangeItemList = ({
  changes,
  openAll,
  setHighlight,
  zoomToAndSelect
}) => {
  return (
    <>
      {changes.length ? (
        changes.map((change, k) => (
          <ChangeItem
            key={k}
            tag={change[0]}
            features={change[1]}
            opened={openAll}
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

type propsType = {|
  changesetId: string,
  changes: Object,
  mapRef: React.RefObject<{
    adiffViewer: MapLibreAugmentedDiffViewer
  }>
|};

const TagChangesComponent = ({
  changesetId,
  changes,
  setHighlight,
  zoomToAndSelect
}: propsType) => {
  const [changeReport, setChangeReport] = useState([]);
  const [openAll, setOpenAll] = useState(false);

  useEffect(() => {
    const newChangeReport = [];
    if (changes && changes.get(changesetId)) {
      const adiff = changes.get(changesetId)['adiff'];
      const modifyActions = adiff.actions.filter(
        action => action.type === 'modify'
      );

      const processed = tagChangesFromActions(modifyActions);
      processed.forEach((featureIDs, tag) =>
        newChangeReport.push([tag, featureIDs])
      );
      setChangeReport(newChangeReport.sort());
    }
  }, [changes, changesetId]);

  return (
    <div className="px12 py6">
      <div className="pb6">
        <h2 className="inline txt-m txt-uppercase txt-bold mr6 mb3">
          Tag changes
        </h2>
        {changeReport.length ? (
          <OpenAll isActive={openAll} setOpenAll={setOpenAll} />
        ) : null}
      </div>
      {changes.get(changesetId) ? (
        <ChangeItemList
          changes={changeReport}
          openAll={openAll}
          setHighlight={setHighlight}
          zoomToAndSelect={zoomToAndSelect}
        />
      ) : (
        <Loading className="pt18" />
      )}
    </div>
  );
};

const TagChanges = connect((state: RootStateType, props) => ({
  changes: state.changeset.get('changesetMap')
}))(TagChangesComponent);

export { TagChanges };
