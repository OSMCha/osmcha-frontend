import { API_URL } from "../config";

function getString(input) {
  if (typeof input === "object") {
    return JSON.stringify(input);
  } else {
    return input;
  }
}

export function handleErrors(response: any) {
  if (!response.ok) {
    return response.json().then((r) => {
      if (response.status === 401) {
        throw new Error(
          "Authentication error. Sign in again and repeat the operation.",
        );
      }
      if (response.status === 401) {
        throw new Error("Operation not allowed.");
      }
      if (response.status === 404) {
        throw new Error("Resource not found.");
      }
      if (r && r.detail) throw new Error(r.detail);
      if (response.statusText) throw new Error(response.statusText);
      return Promise.reject("network request failed");
    });
  }
  return response;
}

export function createAOI(
  token: string,
  name: string,
  filters: any,
): Promise<any> {
  const serverFilters = {};
  Object.keys(filters).forEach((k) => {
    const v = filters[k];
    if (!Array.isArray(v) || !k) return;
    serverFilters[k] = v
      .filter((x) => !!x && typeof x === "object" && x.value !== "")
      .map((x) => getString(x.value))
      .join(",");
  });
  return fetch(`${API_URL}/aoi/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Token ${token}` : "",
    },
    body: JSON.stringify({
      name,
      filters: serverFilters,
    }),
  })
    .then(handleErrors)
    .then((res) => {
      return res.json();
    });
}

export function fetchAOI(token: string, aoiId: number): Promise<any> {
  return fetch(`${API_URL}/aoi/${aoiId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Token ${token}` : "",
    },
  })
    .then(handleErrors)
    .then((res) => {
      return res.json();
    });
}

export function fetchAllAOIs(token?: string): Promise<any> {
  if (token == null) return Promise.resolve();
  return fetch(`${API_URL}/aoi/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Token ${token}` : "",
    },
  })
    .then(handleErrors)
    .then((res) => res.json())
    .then((res) => res.results);
}

export function updateAOI(
  token: string,
  aoiId: number,
  name: string,
  filters: any,
): Promise<any> {
  const serverFilters = {};
  Object.keys(filters).forEach((k) => {
    const v = filters[k];
    if (!Array.isArray(v) || !k) return;
    serverFilters[k] = v
      .filter((x) => !!x && typeof x === "object" && x.value !== "")
      .map((x) => getString(x.value))
      .join(",");
  });
  return fetch(`${API_URL}/aoi/${aoiId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Token ${token}` : "",
    },
    body: JSON.stringify({
      name,
      filters: serverFilters,
    }),
  })
    .then(handleErrors)
    .then((res) => {
      return res.json();
    });
}

export function deleteAOI(token: string, aoiId: string): Promise<any> {
  return fetch(`${API_URL}/aoi/${aoiId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Token ${token}` : "",
    },
  }).then(handleErrors);
}
