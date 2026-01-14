import React from 'react';

const Property = ({ property, value, imageryMatch, sourceMatch }) => {
  return (
    <div key={property} className="col">
      <strong
        title={property}
        className="wmax180 txt-s txt-uppercase txt-truncate"
      >
        {property}
      </strong>
      <span className="wmax180 txt-break-word txt-s">{value}</span>
      {property === 'imagery' && (
        <span>
          <br />
          {imageryMatch.map((e, k) => (
            <a href={e} key={k} className="color-blue">
              {Array.isArray(
                e.match(
                  /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gim
                )
              ) ? (
                e.match(
                  /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gim
                )[0]
              ) : (
                <svg className="icon h18 w18 inline-block align-middle ">
                  <use xlinkHref="#icon-share" />
                </svg>
              )}
            </a>
          ))}
        </span>
      )}
      {property === 'source' && (
        <span>
          <br />
          {sourceMatch.map((e, k) => (
            <a
              href={sourceMatch}
              title={sourceMatch}
              key={k}
              className="color-blue"
              target="_blank"
              rel="noopener noreferrer"
            >
              {Array.isArray(
                e.match(
                  /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gim
                )
              ) ? (
                e.match(
                  /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/gim
                )[0]
              ) : (
                <svg className="icon h18 w18 inline-block align-middle ">
                  <use xlinkHref="#icon-share" />
                </svg>
              )}
            </a>
          ))}
        </span>
      )}
    </div>
  );
};

export default Property;
