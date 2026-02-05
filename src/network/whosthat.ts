import { whosThat } from "../config/constants.ts";
import { handleResponse } from "./request.ts";

export async function getUsers(input): Promise<any> {
  const res = await fetch(`${whosThat}${input}`, { method: "GET" });
  return handleResponse(res);
}
