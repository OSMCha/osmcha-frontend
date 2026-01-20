import { statusUrl } from "../config/constants";
import { handleResponse } from "./request";

export async function getStatus(): Promise<any> {
  const res = await fetch(statusUrl, { method: "GET" });
  return handleResponse(res);
}
