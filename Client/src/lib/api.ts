const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

type RequestInit = {
  method?: string
  headers?: Record<string, string>
  body?: string
  [key: string]: any
}

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  // Prepend base URL if relative
  const finalUrl = url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }

  // Get token from localStorage
  const token = localStorage.getItem("token")
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  // Get active firm from localStorage (optional)
  const storedFirm = localStorage.getItem("activeFirm")
  if (storedFirm) {
    try {
      const firm = JSON.parse(storedFirm)
      if (firm && firm.id) {
        headers["x-firm-id"] = firm.id
      }
    } catch (error) {
      console.error("Failed to parse stored activeFirm in apiFetch:", error)
    }
  }

  return fetch(finalUrl, {
    ...options,
    headers,
  })
}

// Convenience methods
export async function apiGet(url: string, options: RequestInit = {}) {
  return apiFetch(url, { ...options, method: "GET" })
}

export async function apiPost(url: string, data: any, options: RequestInit = {}) {
  return apiFetch(url, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function apiPatch(url: string, data: any, options: RequestInit = {}) {
  return apiFetch(url, {
    ...options,
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function apiPut(url: string, data: any, options: RequestInit = {}) {
  return apiFetch(url, {
    ...options,
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function apiDelete(url: string, options: RequestInit = {}) {
  return apiFetch(url, { ...options, method: "DELETE" })
}

