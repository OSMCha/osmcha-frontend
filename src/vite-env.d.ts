/// <reference types="vite/client" />

interface RuntimeEnv {
  readonly VITE_API_URL?: string;
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
