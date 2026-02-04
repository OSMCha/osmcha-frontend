import { isMobile } from "../../utils/isMobile";
import { Dropdown, type DropdownOption } from "../dropdown";

interface Camera {
  center: {
    lng: number;
    lat: number;
  };
  zoom: number;
}

interface OpenInProps {
  display: string;
  changesetId: string | number;
  camera?: Camera;
  className?: string;
}

export function OpenIn({
  display,
  changesetId,
  camera,
  className,
}: OpenInProps) {
  const mobile = isMobile();

  let hash = "";
  if (camera) {
    // build #map=... hash string for iD/Rapid editors
    const { lng, lat } = camera.center;
    // iD, Rapid etc match their zoom parameters to Leaflet (raster) zoom
    // levels, which are off by one from MapLibre (vector) zoom levels
    const zoom = camera.zoom + 1;
    hash = `#map=${zoom}/${lat}/${lng}`;
  }

  const options: DropdownOption[] = [
    {
      label: "Achavi",
      value: "Achavi",
      href: `https://overpass-api.de/achavi/?changeset=${changesetId}&relations=true`,
    },
    {
      label: "iD",
      value: "iD",
      href: `https://www.openstreetmap.org/edit?editor=id${hash}`,
    },
    {
      label: "JOSM",
      value: "JOSM",
      href: `http://127.0.0.1:8111/import?url=https://www.openstreetmap.org/api/0.6/changeset/${changesetId}/download`,
    },
    {
      label: "Level0",
      value: "Level0",
      href: `http://level0.osmz.ru/?url=changeset/${changesetId}`,
    },
    {
      label: "osm-revert",
      value: "osm-revert",
      href: `https://revert.monicz.dev/?changesets=${changesetId}`,
    },
    {
      label: "Rapid",
      value: "Rapid",
      href: `https://rapideditor.org/edit${hash}`,
    },
    {
      label: "ResultMaps",
      value: "ResultMaps",
      href: `https://resultmaps.neis-one.org/osm-change-viz?c=${changesetId}`,
    },
  ];
  if (mobile) {
    options.unshift({
      label: "OSM.org",
      value: "OSM.org",
      href: `https://www.openstreetmap.org/changeset/${changesetId}`,
    });
  }

  return (
    <div className={`select-container ${className}`}>
      <Dropdown
        onAdd={() => {}}
        onRemove={() => {}}
        value={[]}
        options={options}
        display={display}
        position="left"
      />
    </div>
  );
}
