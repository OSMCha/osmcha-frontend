import { api } from "./request.ts";

export function fetchWatchList(): Promise<any> {
  return api
    .get<{ results: any[] }>("/blacklisted-users/")
    .then((res) => res.results);
}

export function deleteFromWatchList(uid: string): Promise<any> {
  return api.delete(`/blacklisted-users/${uid}/`);
}

export function postUserToWatchList(data: any): Promise<any> {
  return api.post("/blacklisted-users/", {
    username: data.watchlist_user.username,
    uid: data.watchlist_user.uid,
  });
}
