//@flow
import React from 'react';

export default function TranslateButton({ text }: { text: string }) {
  return (
    <a
      target="_blank"
      title="Translate"
      href={`http://translate.google.com/#auto/en/${encodeURIComponent(text)}`}
      className="btn btn--xs color-gray border border--gray round bg-gray-faint bg-white-on-hover"
    >
      Translate
      <svg className="icon inline-block align-middle pb3 pl3">
        <use xlinkHref="#icon-share" />
      </svg>
    </a>
  );
}
