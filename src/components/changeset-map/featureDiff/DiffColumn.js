import React from 'react';
import PropTypes from 'prop-types';

export const DiffColumn = function({ diff, prop, type, propClass }) {
  if (prop === 'changeset' && type === 'modifiedOld') {
    return (
      <td className={propClass}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="cmap-changeset-link"
          href={`/changesets/${diff[prop][type]}`}
        >
          {diff[prop][type]}
        </a>
      </td>
    );
  } else {
    return <td className={propClass}>{diff[prop][type]}</td>;
  }
};

DiffColumn.propTypes = {
  diff: PropTypes.object.isRequired,
  prop: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  propClass: PropTypes.string
};
