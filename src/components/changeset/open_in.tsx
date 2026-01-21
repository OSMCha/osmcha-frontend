import { isMobile } from "../../utils";
import { Dropdown } from "../dropdown";

interface Camera {
  center: {
    lng: number;
    lat: number;
  };
  zoom: number;
}

interface DropdownOption {
  label: string;
  value: string;
  href?: string;
}

function openEditor(selected: DropdownOption[], camera: Camera) {
  let baseUrl;
  if (selected && selected[0].value === "iD") {
    baseUrl = "https://www.openstreetmap.org/edit?editor=id&";
  }
  if (selected && selected[0].value === "Rapid") {
    baseUrl = "https://rapideditor.org/edit?";
  }
  if (baseUrl) {
    const { lng, lat } = camera.center;
    // iD, Rapid etc match their zoom parameters to Leaflet (raster) zoom
    // levels, which are off by one from MapLibre (vector) zoom levels
    const zoom = camera.zoom + 1;

    const windowObjectReference = window.open("editor - OSMCha");
    const url = `${baseUrl}#map=${zoom}/${lat}/${lng}`;

    windowObjectReference!.location.href = url;
  }
}

interface OpenInProps {
  display: string;
  changesetId: string | number;
  camera: Camera;
  className?: string;
}

export function OpenIn({
  display,
  changesetId,
  camera,
  className,
}: OpenInProps) {
  const mobile = isMobile();
  const options: DropdownOption[] = [
    {
      label: "Achavi",
      value: "Achavi",
      href: `https://overpass-api.de/achavi/?changeset=${changesetId}&relations=true`,
    },
    {
      label: "iD",
      value: "iD",
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
        onChange={(value) => openEditor(value, camera)}
        options={options}
        display={display}
        position="left"
      />
    </div>
  );
}
