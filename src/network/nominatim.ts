import { nominatimUrl } from "../config/constants.ts";
import { handleResponse } from "./request.ts";

type AreaGeometry = GeoJSON.Polygon | GeoJSON.MultiPolygon;

export type Area = {
  name: string;
  // OSM object in Nominatim's lookup format, e.g. "R237364"
  osmId: string;
  // Width or height of the bounding box, whichever is larger, in degrees
  extent: number;
};

// Nominatim's address ranks 4-16 are the country, state, county, and city
// levels; anything above 16 is a suburb, street, POI, etc.
// https://nominatim.org/release-docs/latest/customize/Ranking/
const MAX_PLACE_RANK = 16;

const cache = new Map<string, Promise<any>>();

function get(url: string): Promise<any> {
  let result = cache.get(url);
  if (!result) {
    result = fetch(url).then((res) => handleResponse(res));
    result.catch(() => cache.delete(url));
    cache.set(url, result);
  }
  return result;
}

/**
 * Query Nominatim to find boundary polygons matching the provided query.
 * Should only be called on submit, not on each keypress; see:
 * https://operations.osmfoundation.org/policies/nominatim/
 */
export async function searchAreas(query: string): Promise<Area[]> {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    layer: "address",
    limit: "20",
  });
  const json: any[] = await get(`${nominatimUrl}/search?${params}`);
  return json
    .filter((d) => d.place_rank <= MAX_PLACE_RANK && d.osm_type !== "node")
    .map((d) => {
      const [s, n, w, e] = d.boundingbox.map(Number);
      // Places that cross the antimeridian have a bbox spanning all
      // longitudes, so only the latitude span is useful.
      const width = e - w >= 360 ? 0 : e - w;
      return {
        name: d.display_name,
        osmId: `${d.osm_type[0].toUpperCase()}${d.osm_id}`,
        extent: Math.max(width, n - s),
      };
    });
}

export async function lookupArea(
  area: Area,
  tolerance: number,
): Promise<AreaGeometry> {
  const params = new URLSearchParams({
    osm_ids: area.osmId,
    format: "jsonv2",
    polygon_geojson: "1",
    polygon_threshold: tolerance.toPrecision(2),
  });
  const json: any[] = await get(`${nominatimUrl}/lookup?${params}`);
  const geometry = json[0]?.geojson;
  if (geometry?.type !== "Polygon" && geometry?.type !== "MultiPolygon") {
    throw new Error("No outline available for this place");
  }
  return geometry;
}
