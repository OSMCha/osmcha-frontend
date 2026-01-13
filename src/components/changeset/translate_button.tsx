import React from 'react';

export default function TranslateButton({ text }: { text: string }) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      title="Translate"
      href={`http://translate.google.com/#auto/en/${encodeURIComponent(text)}`}
      className="btn btn--xs border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition pl12 pr6"
    >
      Translate
      <svg className="icon h18 w18 inline-block align-middle pb3 pl3">
        <use xlinkHref="#icon-share" />
      </svg>
    </a>
  );
}
