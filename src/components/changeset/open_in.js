import React from 'react';
import { Dropdown } from '../dropdown';

export function OpenIn({ changesetId, coordinates }) {
  console.log(coordinates);
  return (
    <div className="select-container">
      <Dropdown
        onAdd={() => {}}
        onRemove={() => {}}
        value={[]}
        options={[
          {
            label: 'JOSM',
            value: 'JOSM',
            href: `https://127.0.0.1:8112/import?url=http://www.openstreetmap.org/api/0.6/changeset/${changesetId}/download`
          },
          {
            label: 'iD',
            value: 'iD',
            href: `http://www.openstreetmap.org/edit?changeset=${changesetId}#map=15/${coordinates &&
              coordinates.get('1')}/${coordinates && coordinates.get('0')}`
          },
          {
            label: 'OSM',
            value: 'OSM',
            href: `https://openstreetmap.org/changeset/${changesetId}`
          },

          {
            label: 'achavi',
            value: 'achavi',
            href: `"https://overpass-api.de/achavi/?changeset=${changesetId}`
          },
          {
            label: 'OSM-HV',
            value: 'OSM-HV',
            href: `http://osmhv.openstreetmap.de/changeset.jsp?id=${changesetId}`
          }
        ]}
        displayComponent={
          <svg className="icon inline-block align-middle color-black pointer">
            <use xlinkHref="#icon-chevron-down" />
          </svg>
        }
      />
    </div>
  );
}
