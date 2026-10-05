import Linkify from "linkify-react";

interface PropertyProps {
  property: string;
  value: string;
}

const Property = ({ property, value }: PropertyProps) => {
  return (
    <div key={property} className="col">
      <strong
        title={property}
        className="wmax180 txt-s txt-uppercase txt-truncate"
      >
        {property}
      </strong>
      <span className="wmax180 txt-break-url txt-s">
        <Linkify
          options={{
            target: "_blank",
            rel: "noopener noreferrer",
            className: "color-blue",
          }}
        >
          {value}
        </Linkify>
      </span>
    </div>
  );
};

export default Property;
