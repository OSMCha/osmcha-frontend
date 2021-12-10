import React from 'react';

import { osmApiUrl, osmBaseUrl } from '../../config/constants';
import { getMapInstance } from '../changeset-map';
import { Dropdown } from '../dropdown';
import { isMobile } from '../../utils';

function openEditor(selected) {
  getMapInstance();
  let map = getMapInstance().map;
  let baseUrl;
  if (selected && selected[0].value === 'iD') {
    baseUrl = `${osmBaseUrl}/edit?editor=id&`;
  }
  if (baseUrl) {
    const center = map.getCenter();
    const zoom = map.getZoom();
    let windowObjectReference = window.open('editor - OSMCha');
    windowObjectReference.location.href = `${baseUrl}#map=${zoom}/${center.lat}/${center.lng}`;
  }
}

export function OpenIn({ display, changesetId, coordinates, className }) {
  const mobile = isMobile();
  const options = [
    {
      label: 'iD',
      value: 'iD'
    },
    {
      label: 'JOSM',
      value: 'JOSM',
       href: `http://127.0.0.1:8111/import?url=${osmApiUrl}/api/0.6/changeset/${changesetId}/download`
    }
  ];
  if (mobile) {
    options.unshift({
      label: 'OSM.org',
      value: 'OSM.org',
      href: `${osmBaseUrl}/changeset/${changesetId}`
    });
  }

  return (
    <div className={`select-container ${className}`}>
      <Dropdown
        onAdd={() => {}}
        onRemove={() => {}}
        value={[]}
        onChange={openEditor}
        options={options}
        display={display}
        position="left"
      />
    </div>
  );
}
