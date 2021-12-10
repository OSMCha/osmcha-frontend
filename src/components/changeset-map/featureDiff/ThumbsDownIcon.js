import React from 'react';
import PropTypes from 'prop-types';

export const ThumbsDownIcon = ({ style }) => (
  <svg width="14px" height="14px" viewBox="0 0 100 99" style={style}>
    <g
      id="Symbols"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="icons/Thumbs-down-trans" fill="#CC2C47">
        <g
          id="Thumbs-up"
          transform="translate(50.000000, 49.500000) rotate(-180.000000) translate(-50.000000, -49.500000) "
        >
          <path
            d="M41.8167977,42 L8.65058811,42 L8.65058811,42 C8.15292909,42 7.65635568,42.0464369 7.16732524,42.1387068 C2.82565287,42.9578902 -0.0298885833,47.1415905 0.789294882,51.4832629 L7.77042696,88.4832629 C8.483559,92.2628627 11.7854321,95 15.6317202,95 L15.6317202,95 L92,95 C96.418278,95 100,91.418278 100,87 L100,87 L100,50 C100,45.581722 96.418278,42 92,42 L64.8136835,42 C64.848108,41.339148 64.8257549,40.6662103 64.7423209,39.9866948 L61.0862406,10.2103103 C60.3122149,3.90637709 54.5743956,-0.576498687 48.2704624,0.197526982 L48.2704624,0.197526982 L48.2704624,0.197526982 C41.9665292,0.97155265 37.4836534,6.70937199 38.2576791,13.0133052 L38.2576791,13.0133052 L41.8167977,42 Z"
            id="Combined-Shape"
            fillOpacity="0.3"
          ></path>
          <rect
            id="Rectangle-7"
            fillOpacity="0.9"
            x="76"
            y="37"
            width="24"
            height="62"
            rx="8"
          ></rect>
        </g>
      </g>
    </g>
  </svg>
);

ThumbsDownIcon.propTypes = {
  style: PropTypes.object
};
