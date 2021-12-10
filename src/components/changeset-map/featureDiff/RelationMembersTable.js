import React from 'react';
import PropTypes from 'prop-types';
import { cmap } from '../render';

export const RelationMembersTable = function({ featuresWithId }) {
  return (
    <table
      className="cmap-diff-table"
      style={
        featuresWithId[0].properties.changeType === 'added' ?
          { width: '350px' } :
          undefined
      }
    >
      <thead>
        <tr>
          <td className="cmap-table-head" colSpan="2">
            <span className="cmap-strong">MEMBERS</span> (click to highlight)
          </td>
        </tr>
      </thead>
      <tbody>
        {featuresWithId[0].properties.relations.map((i, n) => (
          <tr
            key={n}
            onClick={() => cmap.emit('selectMember', i.properties.ref)}
          >
            <th className="cmap-strong cmap-pointer">
              {`${i.properties.ref} (${i.properties.type.toUpperCase()})`}
            </th>
            <td className="diff-property cmap-scroll-styled cmap-pointer">
              {i.properties.role}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

RelationMembersTable.propTypes = {
  featuresWithId: PropTypes.array.isRequired
};
