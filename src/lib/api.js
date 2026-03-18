const RAW = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const API_BASE = RAW.replace(/\/$/, "");
export const API = `${API_BASE}/api`;

export function imageUrl(path) {
  if (!path) return "/placeholder-perfume.svg";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function fetchJson(path, init) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    next: init?.cache === "no-store" ? undefined : { revalidate: 60 },
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || res.statusText);
  return res.json();
}

export function authHeaders(token) {
  const h = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}
