// @flow
import React from 'react';
import {Map} from 'immutable';

export function Details(
  {
    properties,
    changesetId,
  }: {properties: Map<string, *>, changesetId: number, expanded?: boolean},
) {
  const source = properties.get('source');
  const editor = properties.get('editor');
  const imagery = properties.get('imagery_used');
  return (
    <div className="p12">
      <h2 className="txt-l mr6 txt-bold">Other</h2>
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
  );
}
