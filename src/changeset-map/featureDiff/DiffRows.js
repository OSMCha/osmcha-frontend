import React from 'react';
import PropTypes from 'prop-types';
import { DiffColumn } from './DiffColumn';

export const DiffRows = function({
  diff,
  sortedProps,
  types,
  isAddedFeature,
  ignoreList
}) {
  const rows = [];
  sortedProps.forEach(function(prop) {
    if (ignoreList.indexOf(prop) !== -1) {
      return;
    }

    const columns = [];
    types.forEach(function(type) {
      if (diff[prop].hasOwnProperty(type)) {
        const propClass = `diff-property cmap-scroll-styled props-diff-${type}`;
        if (type === 'added' && !isAddedFeature) {
          columns.push(<td key={`${prop}-${type}-1`} className={propClass} />);
        }

        columns.push(
          <DiffColumn
            key={`${prop}-${type}-2`}
            diff={diff}
            prop={prop}
            type={type}
            propClass={propClass}
          />
        );

        if (type === 'deleted') {
          columns.push(<td key={`${prop}-${type}-3`} className={propClass} />);
        } else if (type === 'unchanged') {
          columns.push(
            <DiffColumn
              key={`${prop}-${type}-3`}
              diff={diff}
              prop={prop}
              type={type}
              propClass={propClass}
            />
          );
        }
      }
    });

    rows.push(
      <tr key={`${prop}-row`}>
        <th key={`${prop}-header`} title={prop} className="cmap-strong">
          {prop}
        </th>
        {columns}
      </tr>
    );
  });

  return <tbody>{rows}</tbody>;
};

DiffRows.propTypes = {
  diff: PropTypes.object.isRequired,
  sortedProps: PropTypes.array.isRequired,
  types: PropTypes.array.isRequired,
  isAddedFeature: PropTypes.bool,
  ignoreList: PropTypes.array
};

DiffRows.defaultProps = {
  isAddedFeature: false,
  ignoreList: []
};
