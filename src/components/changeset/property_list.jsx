import Property from "./property";

const PropertyList = ({ limit, properties, imageryMatch, sourceMatch }) => {
  return (
    <>
      {Object.entries(properties)
        .map(([property, value]) => (
          <Property
            key={property}
            property={property}
            value={value}
            imageryMatch={imageryMatch}
            sourceMatch={sourceMatch}
          />
        ))
        .slice(limit, limit + 2)}
    </>
  );
};

export default PropertyList;
