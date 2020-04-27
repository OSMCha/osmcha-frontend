// @flow
import React from 'react';
import { Map } from 'immutable';
import AnchorifyText from 'react-anchorify-text';
import AssemblyAnchor from '../assembly_anchor';
import TranslateButton from './translate_button';
import { Reasons } from '../reasons';

export function Details({
  properties,
  changesetId
}: {
  properties: Map<string, *>,
  changesetId: number,
  expanded?: boolean
}) {
  let source = properties.get('source');
  let editor = properties.get('editor');
  let imagery = properties.get('imagery_used');
  const reasons = properties.get('reasons');
  const comment = properties.get('comment');

  const urlRegex = new RegExp(
    /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim
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
      <div className="flex-parent flex-parent--row justify--space-between flex-parent--wrap pt12 pb6">
        <div className="flex-parent flex-parent--column ">
          <strong className="wmax180 txt-s txt-uppercase">Source</strong>
          <span className="wmax180 txt-break-word txt-s">
            {source}
            <span>
              <br />
              {sourceMatch.map((e, k) => (
                <a
                  href={sourceMatch}
                  title={sourceMatch}
                  key={k}
                  className="color-blue"
                  target="_blank"
                >
                  {Array.isArray(
                    e.match(
                      /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gim
                    )
                  ) ? (
                    e.match(
                      /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gim
                    )[0]
                  ) : (
                    <svg className="icon h18 w18 inline-block align-middle ">
                      <use xlinkHref="#icon-share" />
                    </svg>
                  )}
                </a>
              ))}
            </span>
          </span>
        </div>
        <div className="flex-parent flex-parent--column ">
          <strong className="wmax180 txt-s txt-uppercase">Editor</strong>
          <span className="wmax180 txt-break-word txt-s">{editor}</span>
        </div>
        <div className="flex-parent flex-parent--column">
          <strong className="wmax180 txt-s txt-uppercase">Imagery</strong>
          <span className="wmax180 txt-break-word txt-s">
            {imagery}
            <span>
              <br />
              {imageryMatch.map((e, k) => (
                <a href={e} key={k} className="color-blue">
                  {Array.isArray(
                    e.match(
                      /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gim
                    )
                  ) ? (
                    e.match(
                      /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gim
                    )[0]
                  ) : (
                    <svg className="icon h18 w18 inline-block align-middle ">
                      <use xlinkHref="#icon-share" />
                    </svg>
                  )}
                </a>
              ))}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
