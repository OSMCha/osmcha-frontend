import { api } from "./request.ts";

export function createMappingTeam(name: string, users: object) {
  return api.post("/mapping-team/", { name, users });
}

export function fetchMappingTeam(id: number) {
  return api.get(`/mapping-team/${id}/`);
}

export function deleteMappingTeam(id: number) {
  return api.delete(`/mapping-team/${id}/`);
}

export function fetchUserMappingTeams(owner: string) {
  return api
    .get<{ results: any[] }>(`/mapping-team/?owner=${owner}`)
    .then((res) => res.results);
}

export function updateMappingTeam(id: number, name: string, users: object) {
  return api.put(`/mapping-team/${id}`, { name, users });
}
