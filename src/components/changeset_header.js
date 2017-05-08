// @flow
import React from 'react';
import {List} from 'immutable';
import {Map} from 'immutable';

export function Header(
  {properties, changesetId}: {properties: Map<string, *>, changesetId: number},
) {
  const date = properties.get('date');
  const create = properties.get('create');
  const modify = properties.get('modify');
  const destroy = properties.get('delete');
  const reasons = properties.get('reasons');
  const source = properties.get('source');
  const editor = properties.get('editor');
  const comment = properties.get('comment');
  const imagery = properties.get('imagery_used');
  return (
    <div className="px12 color-gray">
      <h2 className="txt-subhead txt-light">Time: {date} </h2>
      <h2 className="txt-l txt-light">Changeset: {changesetId} </h2>
      <h2 className="txt-subhead txt-light">
        create: {create}, modify: {modify}, delete: {destroy}
      </h2>
      <h2 className="txt-subhead txt-light">
        Reasons: {reasons.map((e, k) => <span key={k}>{e}</span>)}
      </h2>
      <h2 className="txt-subhead txt-light">
        source: {source}
      </h2>
      <h2 className="txt-subhead txt-light">
        editor: {editor}
      </h2>
      <h2 className="txt-subhead txt-light">
        comment: {comment}
      </h2>
      <h2 className="txt-subhead txt-light">
        imagery: {imagery}
      </h2>
      <button className={`btn btn--pill btn--s color-gray btn--gray-faint`}>
        <a
          target="_blank"
          href={
            `http://127.0.0.1:8111/import?url=http://www.openstreetmap.org/api/0.6/changeset/${changesetId}/download`
          }
        >
          HDYC
        </a>
      </button>
      <button className={`btn btn--pill btn--s color-gray btn--gray-faint`}>
        <a target="_blank" href={`http://hdyc.neis-one.org/?`}>
          JOSM
        </a>
      </button>
      <button className={`btn btn--pill btn--s color-gray btn--gray-faint`}>
        Verify Good
      </button>
      <button className={`btn btn--pill btn--s color-gray btn--gray-faint`}>
        Verify Bad
      </button>
    </div>
  );
}
