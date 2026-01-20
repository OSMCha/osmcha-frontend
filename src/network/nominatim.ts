import { nominatimUrl } from "../config/constants";
import { handleResponse } from "./request";

export async function nominatimSearch(input, type): Promise<any> {
  const res = await fetch(
    `${nominatimUrl}?polygon_geojson=1&format=json&${type}=${input}`,
    { method: "GET" },
  );
  return handleResponse(res);
}
