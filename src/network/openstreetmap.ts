import { API_URL } from "../config";
import { apiOSM } from "../config/constants";

export async function fetchChangesetMetadata(id: number): Promise<any> {
  const res = await fetch(
    `${apiOSM}/changeset/${id}.json?include_discussion=true`,
  );
  const metadata = await res.json();
  return metadata;
}

export function getUserDetails(uid: number, token: string): Promise<any> {
  const user: any = { uid: uid };
  const fromOSM = fetch(`${apiOSM}/user/${uid}.json`)
    .then((r) => r.json())
    .then((r) => {
      const u = r.user;
      user.count = u.changesets.count;
      user.accountCreated = u.account_created;
      user.description = u.description;
      user.img = u.img && u.img.href;
      user.name = u.display_name;
      return user;
    })
    .catch(() => user);

  const fromOSMCha = fetch(`${API_URL}/user-stats/${uid}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Token ${token}` : "",
    },
  })
    .then((r) => r.json())
    .catch(() => ({}));

  return Promise.all([fromOSMCha, fromOSM]).then(([r1, r2]) => ({
    ...r2,
    ...r1,
  }));
}
