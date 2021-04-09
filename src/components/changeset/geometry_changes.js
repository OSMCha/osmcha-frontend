// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import type { RootStateType } from '../store';
import { getFeatures, FeatureListItem } from './tag_changes';
import { Loading } from '../loading';
import { OpenAll } from '../open_all';
import { ExpandItemIcon } from '../expand_item_icon';

function processFeatures(features) {
  const finalReport = new Map();
  const keys = ['node', 'way', 'relation'];
  keys.map(key =>
    finalReport.set(
      key,
      features
        .filter(item => item[0].properties.action === 'modify')
        .filter(item => item[0].properties.type === key)
        .filter(
          item =>
            JSON.stringify(item[0].geometry) !==
            JSON.stringify(item[1].geometry)
        )
        .map(item => ({ id: item[0].properties.id }))
    )
  );
  return finalReport;
}

const GeometryChangesItem = ({ tag, features, opened }) => {
  const titles = { node: 'Nodes', way: 'Ways', relation: 'Relations' };
  const [isOpen, setIsOpen] = useState(opened);

  useEffect(() => setIsOpen(opened), [opened]);

  return (
    <div>
      <button
        className="pointer"
        tabIndex="0"
        aria-pressed={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <ExpandItemIcon isOpen={isOpen} />
        <span className="txt-bold">{titles[tag]}</span>
        <strong className="bg-blue-faint color-blue-dark mx6 px6 py3 txt-s round">
          {features.length}
        </strong>
      </button>
      <ul className="cmap-vlist" style={{ display: isOpen ? 'block' : 'none' }}>
        {features.map((item, k) => (
          <FeatureListItem id={item.id} key={k} />
        ))}
      </ul>
    </div>
  );
};

type propsType = {|
  changesetId: string,
  changes: Object
|};

const GeometryChangesComponent = ({ changesetId, changes }: propsType) => {
  const [changeReport, setChangeReport] = useState([]);
  const [openAll, setOpenAll] = useState(false);

  useEffect(() => {
    const newChangeReport = [];
    if (changes && changes.get(changesetId)) {
      const changesetData = changes.get(changesetId)['featureMap'];
      const processed = processFeatures(getFeatures(changesetData));
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
          changeReport.map((change, k) => (
            <GeometryChangesItem
              key={k}
              tag={change[0]}
              features={change[1]}
              opened={openAll}
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
