// @flow
import React from 'react';
import { Map } from 'immutable';
import AnchorifyText from 'react-anchorify-text';
import AssemblyAnchor from '../assembly_anchor';
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
  const user = properties.get('user');
  const date = properties.get('date');
  const create = properties.get('create');
  const modify = properties.get('modify');
  const destroy = properties.get('delete');
  const reasons = properties.get('reasons');
  const comment = properties.get('comment');

  const urlRegex = new RegExp(
    /(([\w\.\-\+]+:)\/{2}(([\w\d\.]+):([\w\d\.]+))?@?(([a-zA-Z0-9\.\-_]+)(?::(\d{1,5}))?))?(\/(?:[a-zA-Z0-9{}:\,\.\-\/\+\%]+)?)(?:\?([a-zA-Z0-9=%\-_\.\*&;]+))?(?:#([a-zA-Z0-9\-=,&%;\/\\"'\?]+)?)?/g
  );

  let sourceMatch = [];
  let sourceOrignal = source;

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
      <div className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap ">
        <div className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap ">
          <Reasons reasons={reasons} color="green" />
        </div>
        <div className="flex-parent flex-parent--row flex-parent--wrap py12">
          <p className="flex-child txt-subhead my12 txt-l txt-break-word ml3">
            <AnchorifyText
              text={comment ? comment : `No comments for ${changesetId}.`}
            >
              <AssemblyAnchor />
            </AnchorifyText>
            <a
              target="_blank"
              title="Translate"
              href={`http://translate.google.com/#auto/en/${encodeURIComponent(
                comment
              )}`}
              className="pointer"
            >
              <svg className="icon inline-block align-middle ">
                <use xlinkHref="#icon-share" />
              </svg>
            </a>
          </p>

        </div>
      </div>
      <div className="flex-parent flex-parent--row justify--space-between flex-parent--wrap pt12 pb6">
        <div className="flex-parent flex-parent--column ">
          <span className="txt-s txt-uppercase txt-bold">Source</span>
          <span className="wmax180 txt-break-word txt-s">
            {source}
            <span>
              <br />
              {sourceMatch.map((e, k) =>
                <a
                  href={sourceOrignal}
                  title={sourceOrignal}
                  key={k}
                  className="color-blue"
                >
                  {Array.isArray(
                    e.match(
                      /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gim
                    )
                  )
                    ? e.match(
                        /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gim
                      )[0]
                    : <svg className="icon inline-block align-middle ">
                        <use xlinkHref="#icon-share" />
                      </svg>}
                </a>
              )}
            </span>
          </span>
        </div>
        <div className="flex-parent flex-parent--column ">
          <span className="txt-s txt-uppercase txt-bold">Editor</span>
          <span className="wmax180 txt-break-word txt-s">{editor}</span>
        </div>
        <div className="flex-parent flex-parent--column">
          <span className="txt-s txt-uppercase txt-bold">Imagery</span>
          <span className="wmax180 txt-break-word txt-s">
            {imagery}
            <span>
              <br />
              {imageryMatch.map((e, k) =>
                <a href={e} key={k} className="color-blue">
                  {Array.isArray(
                    e.match(
                      /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gim
                    )
                  )
                    ? e.match(
                        /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gim
                      )[0]
                    : <svg className="icon inline-block align-middle ">
                        <use xlinkHref="#icon-share" />
                      </svg>}
                </a>
              )}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
