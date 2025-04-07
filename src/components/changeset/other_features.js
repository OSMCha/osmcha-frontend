// @flow
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import type { RootStateType } from '../../store';
import { FeatureListItem } from './tag_changes';
import { Loading } from '../loading';
import { OpenAll } from '../open_all';
import { ExpandItemIcon } from '../expand_item_icon';

function otherChangesFromActions(actions) {
  const finalReport = new Map();

  for (const actionType of ['create', 'delete']) {
    finalReport.set(
      actionType,
      actions
        .filter(action => action.type === actionType)
        .map(action => ({ id: action.new.id, type: action.new.type }))
    );
  }

  finalReport.set(
    'modify',
    actions
      .filter(action => action.type === 'modify' && action.type === 'relation')
      .map(action => ({ id: action.new.id, type: action.new.type }))
  );

  return finalReport;
}

const ActionItem = ({
  opened,
  tag,
  features,
  setHighlight,
  zoomToAndSelect
}) => {
  const [isOpen, setIsOpen] = useState(opened);
  const titles = {
    create: 'Created',
    modify: 'Modified Relations',
    delete: 'Deleted'
  };

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
        <span className="txt-bold">{titles[tag]}</span>
        <strong className="bg-blue-faint color-blue-dark mx6 px6 py3 txt-s round">
          {features.length}
        </strong>
      </button>
      <ul className="cmap-vlist" style={{ display: isOpen ? 'block' : 'none' }}>
        {features.map((item, k) => (
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

type propsType = {|
  changesetId: string,
  changes: Object,
  setHighlight: (type: string, id: number, isHighlighted: boolean) => void,
  zoomToAndSelect: (type: string, id: number) => void
|};

const OtherFeaturesComponent = ({
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
      const processed = otherChangesFromActions(adiff.actions);
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
};

export const OtherFeatures = connect((state: RootStateType, props) => ({
  changes: state.changeset.get('changesetMap')
}))(OtherFeaturesComponent);
