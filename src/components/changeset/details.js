// @flow
import React, { useState } from 'react';
import { Map } from 'immutable';
import AnchorifyText from 'react-anchorify-text';
import AssemblyAnchor from '../assembly_anchor';
import TranslateButton from './translate_button';
import { Reasons } from '../reasons';
import PropertyList from './property_list';

export function Details({
  properties,
  changesetId
}: {
  properties: Map<string, *>,
  changesetId: number,
  expanded?: boolean
}) {
  let source = properties.get('source');
  let imagery = properties.get('imagery_used');
  const editor = properties.get('editor');
  const metadata = properties.get('metadata');
  const reasons = properties.get('reasons');
  const comment = properties.get('comment');

  const urlRegex = new RegExp(
    /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[A-Z0-9+&@#/%=~_|$])/gim
  );

  let sourceMatch = [];
  if (source && source.indexOf('{switch:a,b,c}.') > -1) {
    source = source.replace('{switch:a,b,c}.', '');
  }
  if (source && source.match(urlRegex)) {
    sourceMatch = source.match(urlRegex);
    source = source.replace(urlRegex, '');
  }

  let imageryMatch = [];
  if (imagery && imagery.match(urlRegex)) {
    imageryMatch = imagery.match(urlRegex);
    imagery = imagery.replace(urlRegex, '');
  }

  let propertiesObj = {};
  // As JOSM doesn't use the imagery field, change the order
  // to make the source field visible in the first page
  if (imagery === 'Not reported') {
    propertiesObj = {
      editor: editor,
      source: source,
      imagery: imagery
    };
  } else {
    propertiesObj = {
      editor: editor,
      imagery: imagery,
      source: source
    };
  }

  Array.from(metadata, ([p, v]) => {
    if (
      !p.startsWith('ideditor') &&
      !p.startsWith('resolved') &&
      !p.startsWith('warnings')
    ) {
      propertiesObj[p] = v;
    }
  });

  const size = Object.keys(propertiesObj).length;
  const [leftLimit, setLeftLimit] = useState(0);

  return (
    <div>
      <div className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap py12">
        <div className="flex-parent flex-parent--row flex-parent--wrap mb3">
          <p
            className={`flex-child txt-subhead txt-l txt-break-url ${
              !comment ? 'color-gray txt-em' : ''
            }`}
          >
            <AnchorifyText
              text={
                comment ? comment : `${changesetId} does not have a comment.`
              }
            >
              <AssemblyAnchor />
            </AnchorifyText>
          </p>
        </div>
        <div className="flex-parent">
          <TranslateButton text={comment} />
        </div>
      </div>
      <div className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap ">
        <Reasons reasons={reasons} color="blue" />
      </div>
      <div className="grid pt12 pb6">
        {leftLimit > 0 && (
          <button
            className="wmax12 mr6"
            onClick={() => setLeftLimit(leftLimit - 2)}
            title="Previous changeset properties"
          >
            <svg className="icon">
              <use xlinkHref="#icon-chevron-left" />
            </svg>
          </button>
        )}
        <PropertyList
          properties={propertiesObj}
          limit={leftLimit}
          imageryMatch={imageryMatch}
          sourceMatch={sourceMatch}
        />
        {leftLimit + 2 < size && (
          <button
            className="wmax12 ml6"
            onClick={() => setLeftLimit(leftLimit + 2)}
            title="Next changeset properties"
          >
            <svg className="icon">
              <use xlinkHref="#icon-chevron-right" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
