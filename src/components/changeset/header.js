// @flow
import React from 'react';
import {Map} from 'immutable';
import moment from 'moment';

import {CreateDeleteModify} from '../create_delete_modify';
import {Reasons} from '../reasons';
export function Header(
  {
    properties,
    changesetId,
  }: {properties: Map<string, *>, changesetId: number},
) {
  const date = properties.get('date');
  const create = properties.get('create');
  const modify = properties.get('modify');
  const destroy = properties.get('delete');
  const reasons = properties.get('reasons');

  const user = properties.get('user');
  return (
    <div
      className="my12 border border--gray-light z4 transition px18 py12 bg-white"
    >
      <div
        className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap border-b border--gray-light"
      >
        <div
          className="flex-parent flex-parent--row justify--space-between flex-parent--center-cross"
        >
          <h2 className="txt-xl mr6">{user}</h2>
          <div
            className="flex-parent flex-parent--column flex-parent--end-cross"
            style={{position: 'relative', right: -24, top: -5}}
          >
            {reasons.map((r, k) => (
              <span key={k} className="my3">
                <span
                  className="bg-blue color-white px6 py3 txt-s txt-bold border"
                >
                  {r}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div
          className="flex-parent flex-parent--row justify--space-between flex-parent--wrap"
        >
          <span className="">
            <span className="txt-underline-on-hover txt-em">
              {changesetId} &nbsp;
            </span>
            <span>
              created &nbsp;{moment(date).fromNow()}
            </span>
          </span>
          <div className="flex-parent flex-parent--column">
            <CreateDeleteModify
              showZero
              className="mr3 pb3"
              create={create}
              modify={modify}
              delete={destroy}
            />
          </div>
        </div>
      </div>
      <div
        className="flex-parent flex-parent--row justify--space-between flex-parent--wrap"
      >
        <span>
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
        </span>
        <div>
          <button className={`btn btn--pill btn--s color-gray btn--gray-faint`}>
            Verify Good
          </button>
          <button className={`btn btn--pill btn--s color-gray btn--gray-faint`}>
            Verify Bad
          </button>
        </div>
      </div>

      <div className="border-b border--gray-light border--0" />
    </div>
  );
}

//  <div className="flex-parent flex-parent--row-reverse">
//         <button className={`btn btn--pill btn--s color-white btn--red`}>
//           Not verified
//         </button>
//       </div>
