import { serializeFiltersToObject } from "../utils/filters.ts";
import { api } from "./request.ts";

export function createAOI(name: string, filters: any): Promise<any> {
  return api.post("/aoi/", {
    name,
    filters: serializeFiltersToObject(filters),
  });
}

export function fetchAOI(aoiId: string): Promise<any> {
  return api.get(`/aoi/${aoiId}/`);
}

export function fetchAllAOIs(): Promise<any> {
  return api.get<{ results: any[] }>("/aoi/").then((res) => res.results);
}

export function updateAOI(
  aoiId: string,
  name: string,
  filters: any,
): Promise<any> {
  return api.put(`/aoi/${aoiId}/`, {
    name,
    filters: serializeFiltersToObject(filters),
  });
}

export function deleteAOI(aoiId: string): Promise<any> {
  return api.delete(`/aoi/${aoiId}/`);
}
