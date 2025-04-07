// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import deepEqual from 'deep-equal';

import type { RootStateType } from '../../store';
import { FeatureListItem } from './tag_changes';
import { Loading } from '../loading';
import { OpenAll } from '../open_all';
import { ExpandItemIcon } from '../expand_item_icon';

function geometryChangesFromActions(actions) {
  const finalReport = new Map();

  let nodes = actions
    .filter(
      action =>
        action.type === 'modify' &&
        action.new.type == 'node' &&
        (action.new.lon !== action.old.lon || action.new.lat !== action.old.lat)
    )
    .map(action => action.new.id);

  let ways = actions
    .filter(
      action =>
        action.type === 'modify' &&
        action.new.type === 'way' &&
        !deepEqual(action.old.nodes, action.new.nodes)
    )
    .map(action => action.new.id);

  finalReport.set('node', nodes);
  finalReport.set('way', ways);

  return finalReport;
}

const GeometryChangesItem = ({
  elementType,
  elementIds,
  opened,
  setHighlight,
  zoomToAndSelect
}) => {
  const titles = { node: 'Nodes', way: 'Ways', relation: 'Relations' };
  const [isOpen, setIsOpen] = useState(opened);

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
        <span className="txt-bold">{titles[elementType]}</span>
        <strong className="bg-blue-faint color-blue-dark mx6 px6 py3 txt-s round">
          {elementIds.length}
        </strong>
      </button>
      <ul className="cmap-vlist" style={{ display: isOpen ? 'block' : 'none' }}>
        {elementIds.map(id => (
          <FeatureListItem
            type={elementType}
            id={id}
            onMouseEnter={() => setHighlight(elementType, id, true)}
            onMouseLeave={() => setHighlight(elementType, id, false)}
            onFocus={() => setHighlight(elementType, id, true)}
            onBlur={() => setHighlight(elementType, id, false)}
            onClick={() => zoomToAndSelect(elementType, id)}
          />
        ))}
      </ul>
    </div>
  );
};

type propsType = {|
  changesetId: string,
  changes: Object,
  setHighlight: (type: string, id: number, isHighlighted: boolean) => void,
  zoomToAndSelect: (type: string, id: number) => void
|};

const GeometryChangesComponent = ({
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

      const processed = geometryChangesFromActions(adiff.actions);
      processed.forEach((featureIDs, tag) =>
        newChangeReport.push([tag, featureIDs])
      );
      setChangeReport(
        newChangeReport.filter(changeType => changeType[1].length)
      );
    }
  }, [changes, changesetId]);

  return (
    <div className="px12 py6">
      <div className="pb6">
        <h2 className="inline txt-m txt-uppercase txt-bold mr6 mb3">
          Geometry Changes
        </h2>
        {changeReport.length ? (
          <OpenAll isActive={openAll} setOpenAll={setOpenAll} />
        ) : null}
      </div>
      {changes.get(changesetId) ? (
        changeReport.length ? (
          changeReport.map(([elementType, elementIds]) => (
            <GeometryChangesItem
              elementType={elementType}
              elementIds={elementIds}
              opened={openAll}
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
};

export const GeometryChanges = connect((state: RootStateType, props) => ({
  changes: state.changeset.get('changesetMap')
}))(GeometryChangesComponent);
