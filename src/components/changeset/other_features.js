// @flow
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import type { RootStateType } from '../store';
import { getFeatures, FeatureListItem } from './tag_changes';
import { Loading } from '../loading';
import { OpenAll } from '../open_all';
import { ExpandItemIcon } from '../expand_item_icon';

function processFeatures(features) {
  const finalReport = new Map();
  features = features.map(item => item[0]);
  const keys = ['create', 'delete'];
  keys.map(key =>
    finalReport.set(
      key,
      features
        .filter(item => item.properties.action === key)
        .map(item => ({ id: item.properties.id, type: item.properties.type }))
    )
  );
  finalReport.set(
    'modify',
    features
      .filter(item => item.properties.action === 'modify')
      .filter(item => item.properties.type === 'relation')
      .map(item => ({ id: item.properties.id, type: item.properties.type }))
  );
  return finalReport;
}

const ActionItem = ({ opened, tag, features }) => {
  const [isOpen, setIsOpen] = useState(opened);
  const titles = {
    create: 'Created',
    modify: 'Modified Relations',
    delete: 'Deleted'
  };

  useEffect(() => setIsOpen(opened), [opened]);

  return (
    <div>
      <span className="pointer" onClick={() => setIsOpen(!isOpen)}>
        <ExpandItemIcon isOpen={isOpen} />
        <span className="txt-bold">{titles[tag]}</span>
        <strong className="bg-blue-faint color-blue-dark mx6 px6 py3 txt-s round">
          {features.length}
        </strong>
      </span>
      <ul className="cmap-vlist" style={{ display: isOpen ? 'block' : 'none' }}>
        {features.map((item, k) => (
          <FeatureListItem id={item.id} type={item.type} key={k} />
        ))}
      </ul>
    </div>
  );
};

type propsType = {|
  changesetId: string,
  changes: Object
|};

const OtherFeaturesComponent = ({ changesetId, changes }: propsType) => {
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
          Other features
        </h2>
        {changeReport.length ? (
          <OpenAll isActive={openAll} setOpenAll={setOpenAll} />
        ) : null}
      </div>
      {changes.get(changesetId) ? (
        changeReport.length ? (
          changeReport.map((change, k) => (
            <ActionItem
              key={k}
              tag={change[0]}
              features={change[1]}
              opened={openAll}
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
};

export const OtherFeatures = connect((state: RootStateType, props) => ({
  changes: state.changeset.get('changesetMap')
}))(OtherFeaturesComponent);
