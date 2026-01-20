import { API_URL } from "../config";
import { useAuthStore } from "../stores/authStore";

export function makeApiRequest(
  endpoint: string,
  options: RequestInit = {},
): Request {
  const token = useAuthStore.getState().token;

  return new Request(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Token ${token}` }),
      ...options.headers,
    },
  });
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Try to extract error message from server response
    let errorMessage = response.statusText;

    try {
      const data = await response.json();
      if (data.detail) {
        errorMessage = data.detail;
      } else if (typeof data === "string") {
        errorMessage = data;
      } else if (data.message) {
        errorMessage = data.message;
      }
    } catch {
      // If JSON parsing fails, use statusText
    }

    throw new Error(errorMessage || "Request failed");
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Convenience wrapper for common case
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const req = makeApiRequest(endpoint, options);
  const res = await fetch(req);
  return handleResponse<T>(res);
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
