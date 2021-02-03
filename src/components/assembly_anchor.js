//@flow
import React from 'react';

export default function AssemblyAnchor({ url }: { url?: string }) {
  return (
    <a className="link" href={url} target="_blank" rel="noopener noreferrer">
      {url}
    </a>
  );
}
