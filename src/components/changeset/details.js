// @flow
import React from 'react';
import { Map } from 'immutable';

export function Details({
  properties,
  changesetId
}: {
  properties: Map<string, *>,
  changesetId: number,
  expanded?: boolean
}) {
  const source = properties.get('source');
  const user = properties.get('user');
  const editor = properties.get('editor');
  const imagery = properties.get('imagery_used');
  const date = properties.get('date');
  const create = properties.get('create');
  const modify = properties.get('modify');
  const destroy = properties.get('delete');
  const reasons = properties.get('reasons');
  const comment = properties.get('comment');

  return (
    <div>
      <div className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap ">

        <div className="flex-parent flex-parent--row justify--center flex-parent--wrap">
          <p className="flex-child txt-subhead txt-em my3 txt-em txt-l ml3">
            "{comment}"
          </p>
        </div>
      </div>
      <div className="flex-parent px18 flex-parent--row justify--space-between flex-parent--wrap">
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
