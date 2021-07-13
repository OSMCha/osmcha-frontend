import React from 'react';
import Property from './property';

const PropertyList = ({ limit, properties, imageryMatch, sourceMatch }) => {
  const propertiesList = [];
  return Object.entries(properties)
    .map(([property, value]) =>
      propertiesList.push(
        <Property
          key={property}
          property={property}
          value={value}
          imageryMatch={imageryMatch}
          sourceMatch={sourceMatch}
        />
      )
    )
    .slice(limit, limit + 2);
};

export default PropertyList;
