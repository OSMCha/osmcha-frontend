import { statusUrl } from "../config/constants.ts";
import { handleResponse } from "./request.ts";

export async function getStatus(): Promise<any> {
  const res = await fetch(statusUrl, { method: "GET" });
  return handleResponse(res);
}
