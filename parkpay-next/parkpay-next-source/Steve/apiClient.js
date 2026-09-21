"use client";

import { getFirebaseAuth } from "@/lib/firebaseClient";

/**
 * Fetch wrapper that attaches the current Firebase user's ID token as a
 * Bearer token on every request. Throws an Error with the server's `detail`
 * message on non-2xx responses (mirrors the previous axios-based client's
 * error.response.data.detail pattern, adapted for fetch).
 */
async function apiFetch(path, options = {}) {
  const user = getFirebaseAuth().currentUser;
  const token = user ? await user.getIdToken() : null;

  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.detail) detail = body.detail;
    } catch {
      // response wasn't JSON (e.g. CSV) — keep the generic message
    }
    throw new Error(detail);
  }
  return res;
}

const api = {
  get: (path, params) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch(`${path}${qs}`).then((r) => r.json());
  },
  post: (path, body) => apiFetch(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }).then((r) => r.json()),
  put: (path, body) => apiFetch(path, { method: "PUT", body: JSON.stringify(body) }).then((r) => r.json()),
  getBlob: (path, params) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch(`${path}${qs}`).then((r) => r.blob());
  },
};

export default api;
