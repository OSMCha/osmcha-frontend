import { whosThat } from "../config/constants";
import { handleErrors } from "./aoi";

export function getUsers(input): Promise<any> {
  return fetch(`${whosThat}${input}`, {
    method: "GET",
  })
    .then(handleErrors)
    .then((response) => {
      return response.json();
    });
}
