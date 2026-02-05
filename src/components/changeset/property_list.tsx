import Property from "./property.tsx";

interface PropertyListProps {
  limit: number;
  properties: Record<string, string>;
  imageryMatch?: string[];
  sourceMatch?: string[];
}

const PropertyList = ({
  limit,
  properties,
  imageryMatch,
  sourceMatch,
}: PropertyListProps) => {
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
