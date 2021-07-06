import React, { useState } from 'react';
import Property from './property';

const PropertyList = ({ limit, properties, imageryMatch, sourceMatch }) => {
  const propertiesList = [];
  Object.entries(properties).forEach(([property, value]) =>
    propertiesList.push(
      <Property
        key={property}
        property={property}
        value={value}
        imageryMatch={imageryMatch}
        sourceMatch={sourceMatch}
      />
    )
  );

  return propertiesList.slice(limit, limit + 2);
};

export default PropertyList;
