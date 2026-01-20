import { api } from "./request";

export function fetchReasons() {
  return api
    .get<{ results: any[] }>("/suspicion-reasons/?page_size=200")
    .then((res) => res.results);
}
