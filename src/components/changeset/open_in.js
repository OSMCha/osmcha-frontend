import React from 'react';

import { importChangesetMap } from '../../utils/cmap';
import { Dropdown } from '../dropdown';

function openEditor(selected) {
  importChangesetMap('getMapInstance')
    .then(r => r && r() && r().map)
    .then(map => {
      let baseUrl;
      if (selected && selected[0].value === 'iD') {
        baseUrl = 'https://www.openstreetmap.org/edit?editor=id&';
      }
      if (selected && selected[0].value === 'RapiD') {
        baseUrl = 'https://mapwith.ai/rapid?';
      }
      if (baseUrl) {
        const center = map.getCenter();
        const zoom = map.getZoom();
        let windowObjectReference = window.open('editor - OSMCha');
        windowObjectReference.location.href = `${baseUrl}#map=${zoom}/${center.lat}/${center.lng}`;
      }
    });
}

export function OpenIn({ changesetId, coordinates, className }) {
  const options = [
    {
      label: 'Achavi',
      value: 'Achavi',
      href: `https://overpass-api.de/achavi/?changeset=${changesetId}&relations=true`
    },
    {
      label: 'iD',
      value: 'iD'
    },
    {
      label: 'JOSM',
      value: 'JOSM',
      href: `http://127.0.0.1:8111/import?url=https://www.openstreetmap.org/api/0.6/changeset/${changesetId}/download`
    },
    {
      label: 'Level0',
      value: 'Level0',
      href: `http://level0.osmz.ru/?url=changeset/${changesetId}`
    },
    {
      label: 'RapiD',
      value: 'RapiD'
    }
  ];

  return (
    <div className={`select-container ${className}`}>
      <Dropdown
        onAdd={() => {}}
        onRemove={() => {}}
        value={[]}
        onChange={openEditor}
        options={options}
        position="left"
      />
    </div>
  );
}
