import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

export function Wrapper({
  display,
  children,
  description,
  handleFocus = () => {},
  name,
  hasValue
}) {
  return (
    <div
      className="ml3 my12 flex-parent flex-parent--column"
      onClick={() => handleFocus(name)}
      onFocus={() => handleFocus(name)}
    >
      <div className="flex-parent flex-parent--row flex-parent--center-cross mt12 mb6 ">
        <span className="relative">
          {hasValue &&
            <svg
              style={{ left: -18, top: -9 }}
              className="absolute icon inline-block align-middle color-blue"
            >
              <use xlinkHref="#icon-circle" />
            </svg>}
        </span>
        <span className="txt-bold txt-truncate pointer">
          {display}&nbsp;
        </span>
      </div>
      <div className="grid">
        <span className="col col--6-mxl col--6-ml col--12-mm col--12">
          {children}
        </span>
        {window.innerWidth > 800 &&
          <span className="col col--3-mxl col--3-ml col--1-mm">
            <span className="desc block relative ml12 wmin120">
              <CSSTransitionGroup
                transitionName="filters-desc"
                transitionAppearTimeout={300}
                transitionEnterTimeout={300}
                transitionLeaveTimeout={200}
              >
                {description &&
                  <span
                    key={0}
                    className="absolute wmin300 bg-white"
                    style={{ marginTop: -5 }}
                  >
                    {description}
                  </span>}
              </CSSTransitionGroup>
            </span>
          </span>}
      </div>
    </div>
  );
}
