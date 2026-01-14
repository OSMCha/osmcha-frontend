/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STACK: string;
  readonly VITE_PRODUCTION_API_URL?: string;
  readonly VITE_PAGE_SIZE?: string;
  readonly VITE_OVERPASS_BASE?: string;
  readonly VITE_DISABLE_REAL_CHANGESETS?: string;
  readonly VITE_OSM_URL?: string;
  readonly VITE_OSM_API?: string;
  readonly VITE_ADIFF_SERVICE_URL?: string;
  readonly VITE_NOMINATIM_URL?: string;
  readonly VITE_DEFAULT_FROM_DATE?: string;
  readonly VITE_DEFAULT_TO_DATE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
