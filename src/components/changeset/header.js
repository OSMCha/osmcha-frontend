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
  const source = properties.get('source');
  const editor = properties.get('editor');
  const comment = properties.get('comment');
  const imagery = properties.get('imagery_used');
  const user = properties.get('user');
  return (
    <div
      className="my12 border border--gray-light z4 transition px18 py12 bg-white"
    >
      <div
        className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap border-b border--gray-light"
      >
        <h2 className="txt-xl mr6">{user}</h2>
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
          <div>
            <Reasons reasons={reasons} />
            <CreateDeleteModify
              className="mr3"
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

      <div className="border-b border--gray-light border--0">
        <h2 className="txt-l mr6">Other</h2>
        <div className="ml6">
          <p className="flex-child txt-subhead  my3">
            Source: <span className="txt-em txt-break-word">{source}</span>
          </p>
          <p className="flex-child txt-subhead  my3">
            Editor: <span className="txt-em txt-break-word">{editor}</span>
          </p>
          <p className="flex-child txt-subhead  my3">
            Imagery: <span className="txt-em txt-break-word">{imagery}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

//  <div className="flex-parent flex-parent--row-reverse">
//         <button className={`btn btn--pill btn--s color-white btn--red`}>
//           Not verified
//         </button>
//       </div>
