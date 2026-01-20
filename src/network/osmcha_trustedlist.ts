import { api } from "./request";

export function deleteFromTrustedList(username: string): Promise<any> {
  return api.delete(`/whitelist-user/${username}/`);
}

export function postUserToTrustedList(whitelist_user: string): Promise<any> {
  return api.post("/whitelist-user/", { whitelist_user });
}
