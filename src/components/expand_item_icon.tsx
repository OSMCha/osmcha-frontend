import React from 'react';

type propsType = {
  isOpen: boolean;
};

export const ExpandItemIcon = ({ isOpen }: propsType) => {
  return (
    <>
      {isOpen ? (
        <svg
          className="icon h18 w18 inline-block"
          style={{ verticalAlign: 'text-bottom' }}
        >
          <use xlinkHref={'#icon-chevron-down'} />
        </svg>
      ) : (
        <svg
          className="icon h18 w18 inline-block"
          style={{ verticalAlign: 'text-bottom' }}
        >
          <use xlinkHref={'#icon-chevron-right'} />
        </svg>
      )}
    </>
  );
};
