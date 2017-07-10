import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../button';

export function FiltersHeader({ handleClear, handleApply, search }) {
  return (
    <header className="h55 hmin55 flex-parent px30 bg-gray-faint flex-parent--center-cross justify--space-between color-gray border-b border--gray-light border--1">
      <span className="txt-l txt-bold color-gray--dark">Filters</span>
      <span className="txt-l color-gray--dark">
        <Button className="border--0 bg-transparent" onClick={handleClear}>
          Reset
        </Button>
        <Button onClick={handleApply} className="mx3">
          Apply
        </Button>
        <Link to={{ search: search, pathname: '/' }} className="mx3 pointer">
          <svg className="icon icon--m inline-block align-middle bg-gray-faint color-darken25 color-darken50-on-hover transition">
            <use xlinkHref="#icon-close" />
          </svg>
        </Link>
      </span>
    </header>
  );
}
