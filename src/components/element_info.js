import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { diffArrays } from 'diff';

import { osmUrl } from '../config/constants.js';
import { flagFeature, unflagFeature } from '../network/changeset';
import { Dropdown } from './dropdown';
import { Button } from './button';
import thumbsDown from '../assets/thumbs-down.svg';
import type { RootStateType } from '../store';

/*
 * Displays info about an element that was created/modified/deleted.
 * Shown when an element is selected on the changeset map.
 */
function ElementInfo({ changeset, action, token, setHighlight }) {
  let id = action.new.type + '/' + action.new.id;

  if (!changeset) {
    return null;
  }

  let actionPhrase: string;

  if (action.type === 'create') {
    actionPhrase = 'created';
  } else if (action.type === 'modify') {
    // NOTE: adiffs sometimes contain 'modify' actions that are actually no-ops;
    // in this case the old and new versions are the same
    actionPhrase =
      action.old.version === action.new.version ? 'not changed' : 'modified';
  } else if (action.type === 'delete') {
    actionPhrase = 'deleted';
  }

  return (
    <div className="element-info">
      <h2>
        <a href={`https://www.openstreetmap.org/${id}`}>{id}</a>
        {' was '}
        {actionPhrase}
      </h2>
      <menu>
        <HistoryDropdown id={id} />
        <OpenInDropdown id={id} />
        <FlagButton changeset={changeset} featureId={id} token={token} />
      </menu>
      <MetadataTable changesetId={changeset.get('id')} action={action} />
      <hr />
      <TagsTable action={action} />
      {action.new.type === 'relation' && (
        <React.Fragment>
          <hr />
          <RelationMembersTable action={action} setHighlight={setHighlight} />
        </React.Fragment>
      )}
    </div>
  );
}

export default connect((state: RootStateType, props) => ({
  token: state.auth.get('token'),
  changeset: state.changeset.getIn([
    'changesets',
    +state.changeset.get('changesetId')
  ])
}))(ElementInfo);

function HistoryDropdown({ id }) {
  let options = [
    {
      label: 'OSM',
      href: `https://www.openstreetmap.org/${id}/history`
    },
    {
      label: 'Deep History',
      href: `https://osmlab.github.io/osm-deep-history/#/${id}`
    },
    {
      label: 'PeWu',
      href: `https://pewu.github.io/osm-history/#/${id}`
    }
  ];

  return <Dropdown display="History" options={options} />;
}

/*
 * Convert a slashed element ID (like way/123456) to minimal form (w123456)
 */
function idToMinimalForm(id) {
  let [type, num] = id.split('/');
  return `${type[0]}${num}`;
}

function OpenInDropdown({ id }) {
  let options = [
    {
      label: 'OSM',
      href: `https://www.openstreetmap.org/${id}`
    },
    {
      label: 'iD',
      href: `https://www.openstreetmap.org/edit?editor=id&${id.replace(
        '/',
        '='
      )}`
    },
    {
      label: 'JOSM',
      href: `http://127.0.0.1:8111/load_object?new_layer=true&objects=${idToMinimalForm(
        id
      )}`
    },
    {
      label: 'Level0',
      href: `http://level0.osmz.ru/?url=${id}`
    },
    {
      label: 'RapiD',
      href: `https://rapideditor.org/edit#id=${idToMinimalForm(id)}`
    }
  ];

  return <Dropdown display="Open in" options={options} />;
}

function FlagButton({ changeset, featureId, token }) {
  let changesetId = changeset.get('id');
  let [flagged, setFlagged] = useState(false);

  useEffect(() => {
    let isFlagged =
      changeset
        .getIn(['properties', 'reviewed_features'])
        .find(e => e.get('id') === featureId.replace('/', '-')) !== undefined;
    setFlagged(isFlagged);
  }, [changeset, changesetId, featureId]);

  let handleClick = async () => {
    if (flagged) {
      unflagFeature(changesetId, featureId, token);
    } else {
      flagFeature(changesetId, featureId, token);
    }
    setFlagged(!flagged);
  };

  if (flagged) {
    return (
      <Button onClick={handleClick}>
        <img
          src={thumbsDown}
          alt=""
          className="icon inline-block align-middle mr6"
        />
        {'Flagged (click to remove)'}
      </Button>
    );
  } else {
    return <Button onClick={handleClick}>Add to flagged</Button>;
  }
}

function MetadataTable({ changesetId, action }) {
  let showPrevious =
    action.type === 'delete' ||
    (action.type === 'modify' && action.old.version !== action.new.version);

  let elements = showPrevious ? [action.old, action.new] : [action.new];

  return (
    <table className="metadata-table">
      <thead>
        <tr>
          <th />
          {showPrevious && <th>Previous</th>}
          <th>Current</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>version</td>
          {elements.map(element => (
            <td>{element.version}</td>
          ))}
        </tr>
        <tr>
          <td>timestamp</td>
          {elements.map(element => (
            <td>{element.timestamp}</td>
          ))}
        </tr>
        <tr>
          <td>changeset</td>
          {elements.map(element => {
            if (element.changeset !== changesetId) {
              return (
                <td>
                  <a href={`/changesets/${element.changeset}`}>
                    {element.changeset}
                  </a>
                </td>
              );
            } else {
              return <td>{element.changeset}</td>;
            }
          })}
        </tr>
        <tr>
          <td>uid</td>
          {elements.map(element => (
            <td>{element.uid}</td>
          ))}
        </tr>
        <tr>
          <td>username</td>
          {elements.map(element => (
            <td>
              <a href={`${osmUrl}/user/${element.user}`}>{element.user}</a>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

function TagsTable({ action }) {
  let allKeys;

  if (action.type === 'create') {
    allKeys = new Set(Object.keys(action.new.tags));
  } else {
    allKeys = new Set([
      ...Object.keys(action.old.tags),
      ...Object.keys(action.new.tags)
    ]);
  }

  allKeys = [...allKeys].sort();

  if (allKeys.length === 0) {
    return <span>No tags</span>;
  }

  return (
    <table className="tag-table">
      <thead>
        <tr>
          <th>Tag</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {allKeys.map(key => {
          let oldval = action.old ? action.old.tags[key] : undefined;
          let newval = action.new ? action.new.tags[key] : undefined;
          if (oldval === newval) {
            return (
              <tr>
                <td>{key}</td>
                <td>{newval}</td>
              </tr>
            );
          } else if (oldval === undefined) {
            return (
              <tr className="create">
                <td>{key}</td>
                <td>{newval}</td>
              </tr>
            );
          } else if (newval === undefined) {
            return (
              <tr className="delete">
                <td>{key}</td>
                <td>{oldval}</td>
              </tr>
            );
          } else {
            return (
              <tr className="modify">
                <td>{key}</td>
                <td>
                  <del>{oldval}</del>
                  {' → '}
                  <ins>{newval}</ins>
                </td>
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );
}

function RelationMembersTable({ action, setHighlight }) {
  let oldMemberIds = action.old?.members.map(m => `${m.type}/${m.ref}`) ?? [];
  let newMemberIds = action.new?.members.map(m => `${m.type}/${m.ref}`) ?? [];

  let diff = diffArrays(oldMemberIds, newMemberIds, {
    oneChangePerToken: true
  });

  return (
    <table className="member-table">
      <thead>
        <tr>
          <th>Member</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {diff.map(({ value }) => {
          const id = value[0];
          const [type, ref] = id.split('/');
          const oldMember = action.old?.members.find(
            m => m.type === type && m.ref === +ref
          );
          const newMember = action.new?.members.find(
            m => m.type === type && m.ref === +ref
          );
          const oldrole = oldMember?.role;
          const newrole = newMember?.role;

          const onMouseEnter = () => setHighlight(type, +ref, true);
          const onMouseLeave = () => setHighlight(type, +ref, false);
          const interactions = { onMouseEnter, onMouseLeave };

          if (oldrole === newrole) {
            return (
              <tr {...interactions}>
                <td>{id}</td>
                <td>{newrole}</td>
              </tr>
            );
          } else if (oldrole === undefined) {
            return (
              <tr className="create" {...interactions}>
                <td>{id}</td>
                <td>{newrole}</td>
              </tr>
            );
          } else if (newrole === undefined) {
            return (
              <tr className="delete" {...interactions}>
                <td>{id}</td>
                <td>{oldrole}</td>
              </tr>
            );
          } else {
            return (
              <tr className="modify" {...interactions}>
                <td>{id}</td>
                <td>
                  <del>{oldrole}</del>
                  {' → '}
                  <ins>{newrole}</ins>
                </td>
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );
}
