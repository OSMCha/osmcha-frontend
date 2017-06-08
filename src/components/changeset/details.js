// @flow
import React from 'react';
import { Map } from 'immutable';
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

  // var regexes = [
  //   /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:{%}_\+.~#?&//=]*)/gi
  //   /(http|ftp|https):\/\/([\w+?\.\w+])+([a-zA-Z0-9\~\!\@\#\$\%\^\&\*\(\)_\-\=\+\\\/\?\.\:\;\'\,{}]*)?/g,
  // ].forEach(regex => {
  //   if (source.match(regex)) {
  //     // source =
  //   }
  // });

  return (
    <div>
      <div className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap ">
        <div className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap ">
          <Reasons reasons={reasons} />
        </div>
        <div className="flex-parent flex-parent--row flex-parent--wrap py12">
          <p className="flex-child txt-subhead my12 txt-l ml3">
            {comment ? comment : `No comments for ${changesetId}.`}
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
          <span className="wmax180 txt-break-word txt-s">{source}</span>
        </div>
        <div className="flex-parent flex-parent--column ">
          <span className="txt-s txt-uppercase txt-bold">Editor</span>
          <span className="wmax180 txt-break-word txt-s">{editor}</span>
        </div>
        <div className="flex-parent flex-parent--column">
          <span className="txt-s txt-uppercase txt-bold">Imagery</span>
          <span className="wmax180 txt-break-word txt-s">{imagery}</span>
        </div>
      </div>
    </div>
  );
}
