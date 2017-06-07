import React from 'react';
import { Dropdown } from '../dropdown';

export function OpenIn({ changesetId }) {
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
            href: `http://127.0.0.1:8111/import?url=http://www.openstreetmap.org/api/0.6/changeset/${changesetId}/download`
          },
          {
            label: 'iD',
            value: 'iD',
            href: `http://127.0.0.1:8111/import?url=http://www.openstreetmap.org/api/0.6/changeset/${changesetId}/download`
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
          },
          {
            label: 'OSM',
            value: 'OSM',
            href: `https://openstreetmap.org/changeset/${changesetId}`
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
