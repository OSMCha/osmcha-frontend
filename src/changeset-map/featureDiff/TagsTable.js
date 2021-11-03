import React from 'react';
import PropTypes from 'prop-types';
import { propsDiff } from '../propsDiff';
import { DiffTable } from './DiffTable';

export const TagsTable = function({ featuresWithId }) {
  const tagProps = featuresWithId.map(function(f) {
    const filteredProps = Object.assign({}, f.properties.tags);
    filteredProps.changeType = f.properties.changeType;
    return filteredProps;
  });

  const tagHeader = (
    <span className="cmap-inline-block">{'Tag details'.toUpperCase()}</span>
  );

  return (
    <DiffTable
      diff={propsDiff(tagProps)}
      ignoreList={['id', 'changeType']}
      header={tagHeader}
    />
  );
};

TagsTable.propTypes = {
  featuresWithId: PropTypes.array.isRequired
};
