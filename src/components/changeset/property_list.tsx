import Property from "./property.tsx";

interface PropertyListProps {
  limit: number;
  properties: Record<string, string>;
}

const PropertyList = ({ limit, properties }: PropertyListProps) => {
  return (
    <>
      {Object.entries(properties)
        .map(([property, value]) => (
          <Property key={property} property={property} value={value} />
        ))
        .slice(limit, limit + 2)}
    </>
  );
};

export default PropertyList;
