import React from 'react';
import PropTypes from 'prop-types';
import { DiffRows } from './DiffRows';

//Renders the markup for a table

export const DiffTable = function({ diff, ignoreList, header }) {
  var isAddedFeature = diff['changeType'].added === 'added';
  var types = ['added', 'deleted', 'modifiedOld', 'modifiedNew', 'unchanged'];
  var sortedProps = Object.keys(diff).sort(function(keyA, keyB) {
    var indexA = types.indexOf(Object.keys(diff[keyA])[0]);
    var indexB = types.indexOf(Object.keys(diff[keyB])[0]);
    return indexA - indexB;
  });

  return (
    <table
      className="cmap-diff-table"
      style={isAddedFeature ? { width: '350px' } : undefined}
    >
      {header && (
        <thead>
          <tr>
            <td
              className="cmap-table-head"
              colSpan={isAddedFeature ? '2' : '3'}
            >
              {header}
            </td>
          </tr>
        </thead>
      )}
      <DiffRows
        diff={diff}
        sortedProps={sortedProps}
        types={types}
        isAddedFeature={isAddedFeature}
        ignoreList={ignoreList}
      />
    </table>
  );
};

DiffTable.propTypes = {
  diff: PropTypes.object.isRequired,
  ignoreList: PropTypes.array,
  header: PropTypes.node
};

DiffTable.defaultProps = {
  ignoreList: []
};
