import { osmchaSocialTokenUrl } from "../config/constants.ts";
import { api, handleResponse } from "./request.ts";

export async function postFinalTokensOSMCha(code: string) {
  const formData = new URLSearchParams();
  formData.append("code", code);

  try {
    const res = await fetch(osmchaSocialTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });
    return handleResponse(res);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export function getAuthUrl(): Promise<{ auth_url: string }> {
  return api.post("/social-auth/");
}

export function fetchUserDetails() {
  return api.get("/users/");
}

export function updateUserDetails(
  message_good: string,
  message_bad: string,
  comment_feature: boolean,
) {
  return api.patch("/users/", {
    message_good,
    message_bad,
    comment_feature,
  });
}
