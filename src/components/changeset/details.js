// @flow
import React from 'react';
import {Map} from 'immutable';
import moment from 'moment';

import {CreateDeleteModify} from '../create_delete_modify';

export function Details(
  {
    properties,
    changesetId,
  }: {properties: Map<string, *>, changesetId: number, expanded?: boolean},
) {
  const source = properties.get('source');
  const editor = properties.get('editor');
  const imagery = properties.get('imagery_used');
  const date = properties.get('date');
  const create = properties.get('create');
  const modify = properties.get('modify');
  const destroy = properties.get('delete');
  const reasons = properties.get('reasons');
  const comment = properties.get('comment');

  return (
    <div className="p12">
      <div
        className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap "
      >
        <div
          className="flex-parent flex-parent--row justify--space-between flex-parent--center-cross"
        >
          <span className="txt-subhead  mr6">
            created &nbsp;{moment(date).fromNow()}
          </span>
          <CreateDeleteModify
            showZero
            className="mr3 pb3"
            create={create}
            modify={modify}
            delete={destroy}
          />
        </div>
        <div>
          <span>
            {reasons.map((r, k) => (
              <div
                key={k}
                className="bg-gray-faint mr3 color-gray-dark inline-block px6 py3 txt-xs txt-bold round-full"
              >
                {r}
              </div>
            ))}
          </span>
        </div>
        <div
          className="flex-parent flex-parent--row justify--space-between flex-parent--wrap"
        >
          <div>
            <p className="flex-child txt-subhead txt-em my3 txt-em txt-l ml3">
              "{comment}"
            </p>
          </div>
        </div>
      </div>
      <div
        className="flex-parent px18 flex-parent--row justify--space-between flex-parent--wrap"
      >
        <div className="flex-parent flex-parent--column ">
          <span className="txt-underline txt-bold ">Source</span>
          <span className="wmax180 txt-break-word">{source}</span>
        </div>
        <div className="flex-parent flex-parent--column ">
          <span className="txt-underline txt-bold">Editor</span>
          <span className="wmax180 txt-break-word">{editor}</span>
        </div>
        <div className="flex-parent flex-parent--column">
          <span className="txt-underline txt-bold">Imagery</span>
          <span className="wmax180 txt-break-word">{imagery}</span>
        </div>

      </div>

      <div className="border-b border--gray-light border--0" />
    </div>
  );
}
