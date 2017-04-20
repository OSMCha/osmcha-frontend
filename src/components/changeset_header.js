import React from 'react';
import {List} from 'immutable';

export function Header(
  props: {
    changesetId: number,
    date: string,
    create: number,
    modify: number,
    delete: number,
    reasons: List<*>,
    source: string,
    editor: string,
    comment: string,
    imagery: string,
  },
) {
  const {
    changesetId,
    date,
    create,
    modify,
    reasons,
    source,
    editor,
    comment,
    imagery,
  } = props;
  return (
    <div>
      <h2 className="txt-subhead txt-light">Time: {date} </h2>
      <h2 className="txt-l txt-light">Changeset: {changesetId} </h2>
      <h2 className="txt-subhead txt-light">
        create: {create}, modify: {modify}, delete: {props.delete}
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
