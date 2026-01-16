import pkg from "../../package.json";

export const isLocal = import.meta.env.MODE === "development";
export const appVersion = pkg.version;

export const API_URL = window.env.VITE_API_URL || "https://osmcha.org/api/v1";
