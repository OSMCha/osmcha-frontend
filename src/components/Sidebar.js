import React from 'react';

export function Sidebar({className, tabs}) {
  return (
    <div
      className="flex-parent flex-parent--column viewport-third h-full hmax-full bg-white"
    >
      <div className="flex-child flex-child--grow p12 scroll-auto">
        <h3 className="flex-parent flex-parent-row inline-block pl12 ml12">
          <span className="txt-fancy color-gray txt-xl ">
            <span className="color-green txt-bold">OSM</span> CHA
          </span>
          <svg className="icon mr3"><use xlinkHref="#icon-question" /></svg>
        </h3>
        <div>
          {tabs}
        </div>
      </div>
      <footer className="p12 bg-gray-faint txt-s">
        Footer content here
      </footer>
    </div>
  );
}
