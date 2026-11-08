import { clearToken, getToken } from "./auth";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const API_INTERNAL_BASE_URL = process.env.API_INTERNAL_BASE_URL ?? API_BASE_URL;

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`API error: ${status}`);
    this.status = status;
    this.body = body;
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & { body?: unknown };

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => undefined);

  if (!res.ok) {
    throw new ApiError(res.status, data);
  }

  return data as T;
}

/** Thin fetch wrapper (browser → Laravel). No auth; used directly for public endpoints like /api/login. */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(res);
}

/** Thin fetch wrapper (Server Component → Laravel, over the Docker-internal network). No auth; public endpoints only. */
export async function publicApiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const res = await fetch(`${API_INTERNAL_BASE_URL}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(res);
}

/** Same as apiFetch, but attaches the admin's Bearer token and clears it + redirects to /login on 401. */
export async function adminApiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const token = getToken();

  try {
    return await apiFetch<T>(path, {
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    throw err;
  }
}

/** Pulls Laravel's validation/error "message" out of a caught error, for display in a form. */
export function extractErrorMessage(err: unknown): string {
  if (err instanceof ApiError && err.body && typeof err.body === "object" && "message" in err.body) {
    return String((err.body as { message: unknown }).message);
  }
  return "エラーが発生しました";
}
