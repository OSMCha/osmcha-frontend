import React from 'react';
import { Dropdown } from '../dropdown';

export function OpenIn({ changesetId, coordinates, className }) {
  return (
    <div className={`select-container ${className}`}>
      <Dropdown
        onAdd={() => {}}
        onRemove={() => {}}
        value={[]}
        options={[
          {
            label: 'JOSM',
            value: 'JOSM',
            href: `http://127.0.0.1:8111/import?url=https://www.openstreetmap.org/api/0.6/changeset/${changesetId}/download`
          },
          {
            label: 'iD',
            value: 'iD',
            href: `https://www.openstreetmap.org/edit?editor=id&changeset=${changesetId}#map=15/${coordinates &&
              coordinates.get('1')}/${coordinates && coordinates.get('0')}`
          },
          {
            label: 'OSM',
            value: 'OSM',
            href: `https://openstreetmap.org/changeset/${changesetId}`
          },

          {
            label: 'Achavi',
            value: 'Achavi',
            href: `https://overpass-api.de/achavi/?changeset=${changesetId}&relations=true`
          },
          {
            label: 'Level 0',
            value: 'Level 0',
            href: `http://level0.osmz.ru/?url=changeset/${changesetId}`
          }
        ]}
        display="Open with"
      />
    </div>
  );
}
