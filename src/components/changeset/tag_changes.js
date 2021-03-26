// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { OrderedSet } from 'immutable';

import type { RootStateType } from '../store';
import { selectFeature } from '../../views/map';
import { Loading } from '../loading';

export function getFeatures(features) {
  var keys = Object.keys(features);
  return keys.map(item => features[item]);
}

export function processFeatures(features) {
  const finalReport = new Map();
  const analyzedFeatures = features.map(feature =>
    analyzeFeature(feature[0], feature[1])
  );
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

export function analyzeFeature(newVersion, oldVersion) {
  const oldVersionKeys = Object.keys(oldVersion.properties.tags);
  const newVersionKeys = Object.keys(newVersion.properties.tags);
  const addedTags = newVersionKeys.filter(tag => !oldVersionKeys.includes(tag));
  const deletedTags = oldVersionKeys.filter(
    tag => !newVersionKeys.includes(tag)
  );
  const changedValues = newVersionKeys
    .filter(tag => !addedTags.includes(tag) && !deletedTags.includes(tag))
    .filter(
      tag => newVersion.properties.tags[tag] !== oldVersion.properties.tags[tag]
    );
  const result = new Map();
  result
    .set('id', newVersion.properties.id)
    .set('type', newVersion.properties.type)
    .set(
      'addedTags',
      addedTags.map(tag => [
        `Added tag ${tag}`,
        newVersion.properties.tags[tag]
      ])
    )
    .set(
      'deletedTags',
      deletedTags.map(tag => [
        `Deleted tag ${tag}`,
        oldVersion.properties.tags[tag]
      ])
    )
    .set(
      'changedValues',
      changedValues.map(tag => [
        `Changed value of tag ${tag}`,
        [oldVersion.properties.tags[tag], newVersion.properties.tags[tag]]
      ])
    );
  return result;
}

export function FeatureListItem({ id, type }) {
  return (
    <li>
      <span
        className="pointer txt-bold-on-hover"
        onClick={() => selectFeature(id)}
      >
        {type} {id}
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
    return (
      <span>
        <span className="txt-code cmap-bg-modify-old-light">{oldValue}</span>
        <strong> ➜ </strong>
        <span className="txt-code cmap-bg-modify-new-light">{newValue}</span>
      </span>
    );
  }
  return <div></div>;
}

export const ChangeItem = ({ opened, tag, features }) => {
  const [isOpen, setIsOpen] = useState(opened);
  const values = new OrderedSet(features.map(feature => feature.value));
  const last_space = tag.lastIndexOf(' ') + 1;

  useEffect(() => setIsOpen(opened), [opened]);

  return (
    <div>
      <span className="pointer" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <svg
            className="icon h18 w18 inline-block"
            style={{ verticalAlign: 'text-bottom' }}
          >
            <use xlinkHref={'#icon-chevron-down'} />
          </svg>
        ) : (
          <svg
            className="icon h18 w18 inline-block"
            style={{ verticalAlign: 'text-bottom' }}
          >
            <use xlinkHref={'#icon-chevron-right'} />
          </svg>
        )}
        <span className="txt-bold">{tag.slice(0, last_space)}</span>
        <span className="txt-code">{tag.slice(last_space)}</span>
        <strong className="bg-blue-faint color-blue-dark mx6 px6 py3 txt-s round">
          {features.length}
        </strong>
      </span>
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
                  id={feature.id}
                  type={feature.type}
                  value={feature.value}
                  key={k}
                />
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const ChangeItemList = ({ changes, openAll }) => {
  return (
    <>
      {changes.length ? (
        changes.map((change, k) => (
          <ChangeItem
            key={k}
            tag={change[0]}
            features={change[1]}
            opened={openAll}
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
  changes: Object
|};

const TagChangesComponent = ({ changesetId, changes }: propsType) => {
  const [changeReport, setChangeReport] = useState([]);
  const [openAll, setOpenAll] = useState(false);

  useEffect(() => {
    const newChangeReport = [];
    if (changes && changes.get(changesetId)) {
      const changesetData = changes.get(changesetId)['featureMap'];
      const processed = processFeatures(
        getFeatures(changesetData).filter(
          item => item.length === 2 && item[0].properties.action === 'modify'
        )
      );
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
          <div className="inline-block fr">
            <label className="inline-block txt-s">
              <input
                type="checkbox"
                className="pointer align-b"
                onChange={() => setOpenAll(!openAll)}
              />
              <span className="txt-s">
                {openAll ? 'Close all' : 'Open all'}
              </span>
            </label>
          </div>
        ) : null}
      </div>
      {changes.get(changesetId) ? (
        <ChangeItemList changes={changeReport} openAll={openAll} />
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
