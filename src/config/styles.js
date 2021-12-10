import { osmBaseUrl } from './constants';

export const evwhsConnectId = process.env.REACT_APP_EVWHS_CONNECTID || 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
export const dgTileAttribution = process.env.REACT_APP_DG_TILE_ATTRIBUTION || '© <a href="https://evwhs.digitalglobe.com">Maxar</a>';
export const dgTileUrl = process.env.REACT_APP_DG_TILE_URL || `https://evwhs.digitalglobe.com/earthservice/wmtsaccess?CONNECTID=${evwhsConnectId}&request=GetTile&version=1.0.0&layer=DigitalGlobe:ImageryTileService&featureProfile=Cloud_Cover_Profile&style=default&format=image/png&TileMatrixSet=EPSG:3857&TileMatrix=EPSG:3857:{z}&TileRow={y}&TileCol={x}`;
export const dgMapStyle = {
  version: 8,
  sources: {
    'dg-tiles': {
       type: 'raster',
       tiles: [
         dgTileUrl
       ],
       tileSize: 256,
       attribution: dgTileAttribution
    }
  },
  layers: [
    {
      id: 'dg',
      type: 'raster',
      source: 'dg-tiles',
      minzoom: 0,
      maxzoom: 24
    }
  ]
};
export const osmTileLinkName = process.env.REACT_APP_OSM_TILE_LINK_NAME || 'OpenStreetMap';
export const osmTileAttribution = process.env.REACT_APP_OSM_TILE_ATTRIBUTION || `© <a href="${osmBaseUrl}">${osmTileLinkName}</a> contributors`;
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
      maxzoom: 22
    }
  ]
};
