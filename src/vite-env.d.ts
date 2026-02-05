/// <reference types="vite/client" />

interface RuntimeEnv {
  readonly OSMCHA_API_URL?: string;
  readonly OSMCHA_PAGE_SIZE?: string;
  readonly OSMCHA_OVERPASS_BASE?: string;
  readonly OSMCHA_DISABLE_REAL_CHANGESETS?: string;
  readonly OSMCHA_OSM_URL?: string;
  readonly OSMCHA_OSM_API?: string;
  readonly OSMCHA_ADIFF_SERVICE_URL?: string;
  readonly OSMCHA_NOMINATIM_URL?: string;
  readonly OSMCHA_DEFAULT_FROM_DATE?: string;
  readonly OSMCHA_DEFAULT_TO_DATE?: string;
}

interface ImportMetaEnv extends RuntimeEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  env: RuntimeEnv;
}

// Type declarations for importing static assets
declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.gif" {
  const value: string;
  export default value;
}

declare module "*.webp" {
  const value: string;
  export default value;
}

declare module "*.ico" {
  const value: string;
  export default value;
}
