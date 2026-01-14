import { statusUrl } from "../config/constants";
import { handleErrors } from "./aoi";

export function getStatus(): Promise<any> {
  return fetch(`${statusUrl}`, {
    method: "GET",
  })
    .then(handleErrors)
    .then((response) => {
      return response.json();
    });
}
