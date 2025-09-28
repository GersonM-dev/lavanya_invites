import type { ApiInvitation } from "../types/invitation";

const DEFAULT_BASE_URL = "/api";

const apiBaseUrl = (() => {
  const env = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!env) {
    return DEFAULT_BASE_URL;
  }
  return env.replace(/\/$/, "");
})();

function buildUrl(path: string): string {
  return `${apiBaseUrl}${path}`;
}

export class ApiError extends Error {
  public readonly status?: number;
  public readonly payload?: unknown;

  constructor(message: string, status?: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(
      `Request to ${path} failed with status ${response.status}`,
      response.status,
      payload,
    );
  }

  return payload as T;
}

export function fetchInvitation(slug: string): Promise<ApiInvitation> {
  return request<ApiInvitation>(`/invitations/${encodeURIComponent(slug)}`);
}

export function fetchInvitations(perPage = 12) {
  return request(`/invitations?per_page=${perPage}`);
}