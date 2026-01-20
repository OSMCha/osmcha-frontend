import adiffParser from "@osmcha/osm-adiff-parser";
import { parse, subSeconds } from "date-fns";

import { adiffServiceUrl, apiOSM, overpassBase } from "../config/constants";
import { api } from "./request";

export function fetchChangeset(id: number) {
  return api.get(`/changesets/${id}/`);
}

export async function fetchAndParseAugmentedDiff(id: number) {
  const xml = await fetchAugmentedDiff(id);
  const adiff = await adiffParser(xml);
  return adiff;
}

/// Fetch an augmented diff for the given changeset ID. Tries to fetch from the
/// configured adiff service (if it exists) and falls back to using the configured
/// Overpass server if that fails.
async function fetchAugmentedDiff(id: number) {
  try {
    return await fetchAugmentedDiffFromAdiffService(id);
  } catch (err) {
    console.error(err);
    return await fetchAugmentedDiffFromOverpass(id);
  }
}

async function fetchAugmentedDiffFromAdiffService(id: number) {
  const res = await fetch(`${adiffServiceUrl}/changesets/${id}.adiff`);
  if (res.status !== 200) {
    throw new Error(
      `GET /changesets/${id}.adiff returned ${res.status} ${res.statusText}`,
    );
  }
  return await res.text();
}

async function fetchAugmentedDiffFromOverpass(id: number) {
  let res = await fetch(`${apiOSM}/changeset/${id}.json`);
  const { changeset } = await res.json();
  const createdAt = parse(
    changeset.created_at,
    "yyyy-MM-dd'T'HH:mm:ssX",
    new Date(),
  );
  const closedAt =
    changeset.closed_at &&
    parse(changeset.closed_at, "yyyy-MM-dd'T'HH:mm:ssX", new Date());

  const adiffArgs = [subSeconds(createdAt, 1), closedAt]
    .filter(Boolean)
    .map((d) => `"${d.toISOString()}"`)
    .join(",");

  let data = `[out:xml][adiff:${adiffArgs}];`;
  data +=
    "(node(bbox)(changed);way(bbox)(changed);relation(bbox)(changed););out meta geom(bbox);";

  const epsilon = 0.00001;
  const bbox = [
    changeset.min_lon - epsilon || -180,
    changeset.min_lat - epsilon || -90,
    changeset.max_lon + epsilon || 180,
    changeset.max_lat + epsilon || 90,
  ];

  res = await fetch(
    `${overpassBase}?data=${encodeURIComponent(data)}&bbox=${bbox.join(",")}`,
  );
  return await res.text();
}

export function setHarmful(id: number, harmful: boolean | -1) {
  // -1 is for unsetting
  const action =
    harmful === -1 ? "uncheck" : harmful ? "set-harmful" : "set-good";
  return api.put(`/changesets/${id}/${action}/`);
}

export function setTag(id: number, tag: any, remove: boolean = false) {
  if (Number.isNaN(parseInt(tag.value, 10))) {
    throw new Error("tag is not a valid number");
  }

  const endpoint = `/changesets/${id}/tags/${tag.value}/`;
  return remove
    ? api.delete(endpoint)
    : api.post(endpoint, { tag_pk: tag, id });
}

export function postComment(id: number, comment: string) {
  return api.post(`/changesets/${id}/comment/`, { comment });
}

export function flagFeature(changeset: number, feature: string) {
  const featureParam = feature.replace("/", "-");
  return api.put(`/changesets/${changeset}/review-feature/${featureParam}`);
}

export function unflagFeature(changeset: number, feature: string) {
  const featureParam = feature.replace("/", "-");
  return api.delete(`/changesets/${changeset}/review-feature/${featureParam}`);
}
