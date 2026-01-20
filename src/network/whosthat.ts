import { whosThat } from "../config/constants";
import { handleResponse } from "./request";

export async function getUsers(input): Promise<any> {
  const res = await fetch(`${whosThat}${input}`, { method: "GET" });
  return handleResponse(res);
}
