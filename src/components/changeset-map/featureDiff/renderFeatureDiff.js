import React from 'react';
import ReactDOM from 'react-dom';

import { MetadataTable } from './MetadataTable';
import { TagsTable } from './TagsTable';
import { RelationMembersTable } from './RelationMembersTable';

//Calculates the difference in the selected features

export const renderFeatureDiff = function(
  id,
  featureMap,
  changesetId,
  metadataContainer,
  tagsContainer,
  membersContainer
) {
  var featuresWithId = featureMap[id];

  ReactDOM.render(
    <MetadataTable
      featuresWithId={featuresWithId}
      id={id}
      changesetId={changesetId}
    />,
    metadataContainer
  );

  ReactDOM.render(<TagsTable featuresWithId={featuresWithId} />, tagsContainer);

  if (featuresWithId[0].properties.type === 'relation') {
    document.querySelector('.cmap-diff-members').style.display = 'block';
    ReactDOM.render(
      <RelationMembersTable featuresWithId={featuresWithId} />,
      membersContainer
    );
  }
};
