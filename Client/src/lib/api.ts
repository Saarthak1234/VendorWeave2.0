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
  // Get active firm from localStorage
  const storedFirm = localStorage.getItem("activeFirm")
  const firm = storedFirm ? JSON.parse(storedFirm) : null

  if (!firm) {
    throw new Error("No active firm selected")
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-firm-id": firm.id,
    ...(options.headers || {}),
  }

  return fetch(url, {
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
