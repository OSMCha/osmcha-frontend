import { API_URL } from "../config";
import { osmchaSocialTokenUrl } from "../config/constants";
import { handleErrors } from "./aoi";

export function postFinalTokensOSMCha(code: string) {
  const formData = new URLSearchParams();
  formData.append("code", code);

  return fetch(osmchaSocialTokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  })
    .then(handleErrors)
    .then((r) => r.json())
    .catch((e) => {
      console.error(e);
      return Promise.reject(e);
    });
}

export function getAuthUrl() {
  return fetch(`${API_URL}/social-auth/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then(handleErrors)
    .then((res) => {
      return res.json();
    });
}

export function fetchUserDetails(token: string) {
  return fetch(`${API_URL}/users/`, {
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

export function updateUserDetails(
  token: string,
  message_good: string,
  message_bad: string,
  comment_feature: boolean,
) {
  return fetch(`${API_URL}/users/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Token ${token}` : "",
    },
    body: JSON.stringify({
      message_good,
      message_bad,
      comment_feature,
    }),
  })
    .then(handleErrors)
    .then((res) => {
      return res.json();
    });
}
