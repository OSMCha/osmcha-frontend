import { osmBaseUrl } from './constants';

export const bingTileLabel = process.env.REACT_APP_BING_TILE_LABEL || 'Bing';
export const bingTileAttribution = process.env.REACT_APP_BING_TILE_ATTRIBUTION || '© <a href="https://blog.openstreetmap.org/2010/11/30/microsoft-imagery-details">Microsoft Corporation</a>';
export const bingTileUrl = process.env.REACT_APP_BING_TILE_URL || 'https://ecn.t3.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z';
export const bingStyle = {
  version: 8,
  sources: {
    'bing-tiles': {
      type: 'raster',
      tiles: [
        bingTileUrl,
      ],
      attribution: bingTileAttribution
    }
  },
  layers: [
    {
      id: 'bing',
      type: 'raster',
      source: 'bing-tiles',
      minzoom: 0,
      maxzoom: 22
    }
  ]
};

export const esriTileLabel = process.env.REACT_APP_ESRI_TILE_LABEL || 'ESRI Wayback (2023-01-01)';
export const esriTileAttribution = process.env.REACT_APP_ESRI_TILE_ATTRIBUTION || `© <a href="https://www.esri.com/en-us/legal/terms/full-master-agreement">${esriTileLabel}</a>`;
export const esriTileUrl = process.env.REACT_APP_ESRI_TILE_URL || 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/world_imagery/wmts/1.0.0/default028mm/mapserver/tile/11475/{z}/{y}/{x}';
export const esriMapStyle = {
  version: 8,
  sources: {
    'esri-tiles': {
       type: 'raster',
       tiles: [
         esriTileUrl
       ],
       tileSize: 256,
       attribution: esriTileAttribution
    }
  },
  layers: [
    {
      id: 'esri',
      type: 'raster',
      source: 'esri-tiles',
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

export const evwhsConnectId = process.env.REACT_APP_EVWHS_CONNECTID || 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
export const maxarTileLabel = process.env.REACT_APP_MAXAR_TILE_LABEL || 'Maxar';
export const maxarTileAttribution = process.env.REACT_APP_MAXAR_TILE_ATTRIBUTION || '© <a href="https://evwhs.digitalglobe.com">Maxar</a>';
export const maxarTileUrl = process.env.REACT_APP_MAXAR_TILE_URL || `https://evwhs.digitalglobe.com/earthservice/wmtsaccess?CONNECTID=${evwhsConnectId}&request=GetTile&version=1.0.0&layer=DigitalGlobe:ImageryTileService&featureProfile=Cloud_Cover_Profile&style=default&format=image/png&TileMatrixSet=EPSG:3857&TileMatrix=EPSG:3857:{z}&TileRow={y}&TileCol={x}`;
export const maxarMapStyle = {
  version: 8,
  sources: {
    'maxar-tiles': {
       type: 'raster',
       tiles: [
         maxarTileUrl
       ],
       tileSize: 256,
       attribution: maxarTileAttribution
    }
  },
  layers: [
    {
      id: 'maxar',
      type: 'raster',
      source: 'maxar-tiles',
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

export const osmTileLabel = process.env.REACT_APP_OSM_TILE_LABEL || 'OpenStreetMap';
export const osmTileAttribution = process.env.REACT_APP_OSM_TILE_ATTRIBUTION || `© <a href="${osmBaseUrl}">${osmTileLabel}</a> contributors`;
export const osmTileUrl = process.env.REACT_APP_OSM_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const osmMapStyle = {
  version: 8,
  sources: {
    'osm-tiles': {
       type: 'raster',
       tiles: [osmTileUrl],
       tileSize: 256,
       attribution: osmTileAttribution
    }
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 20
    }
  ]
};
