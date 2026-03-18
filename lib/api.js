import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

async function fetchJson(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || res.statusText);
  return data;
}

export function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getCategories() {
  return fetchJson('/api/categories');
}

export function getCollections() {
  return fetchJson('/api/collections');
}

export function getProducts(params = {}) {
  const q = new URLSearchParams(params).toString();
  return fetchJson(`/api/products?${q}`);
}

/** Product with highest sale discount for homepage hero, or { product: null } */
export function getHeroSale() {
  return fetchJson('/api/hero-sale');
}

export function getProductBySlug(slug) {
  return fetchJson(`/api/products/slug/${slug}`);
}

export function getReviews(productId) {
  return fetchJson(`/api/reviews/product/${productId}`);
}

export function submitReview(body) {
  return fetchJson('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

function axiosErr(e) {
  const msg = e.response?.data?.message || e.response?.data?.errors?.[0]?.msg || e.message;
  throw new Error(msg || 'Request failed');
}

export async function registerUser({ name, email, password }) {
  try {
    const { data } = await api.post('/api/auth/register', { name, email, password });
    if (!data.success) throw new Error(data.message || 'Register failed');
    return data;
  } catch (e) {
    axiosErr(e);
  }
}

export async function loginUser({ email, password }) {
  try {
    const { data } = await api.post('/api/auth/login', { email, password });
    if (!data.success) throw new Error(data.message || 'Login failed');
    return data;
  } catch (e) {
    axiosErr(e);
  }
}

export async function getMe(token) {
  try {
    const { data } = await api.get('/api/auth/me', { headers: authHeaders(token) });
    if (!data.success) throw new Error('Not authenticated');
    return data.user;
  } catch (e) {
    axiosErr(e);
  }
}

/** POST /api/orders — attach user when token present */
export async function createOrder(body, token) {
  try {
    const { data } = await api.post('/api/orders', body, {
      headers: { ...authHeaders(token) },
    });
    return data;
  } catch (e) {
    axiosErr(e);
  }
}

export async function getMyOrders(token) {
  try {
    const { data } = await api.get('/api/orders', { headers: authHeaders(token) });
    return data.orders || [];
  } catch (e) {
    axiosErr(e);
  }
}

export async function getOrderById(id, token) {
  try {
    const { data } = await api.get(`/api/orders/${id}`, { headers: authHeaders(token) });
    return data.order;
  } catch (e) {
    axiosErr(e);
  }
}

export async function getWishlist(userId, token) {
  try {
    const { data } = await api.get(`/api/wishlist/${userId}`, { headers: authHeaders(token) });
    return data;
  } catch (e) {
    axiosErr(e);
  }
}

export async function wishlistAdd(productId, token) {
  try {
    const { data } = await api.post('/api/wishlist/add', { productId }, { headers: authHeaders(token) });
    return data;
  } catch (e) {
    axiosErr(e);
  }
}

export async function wishlistRemove(productId, token) {
  try {
    const { data } = await api.post('/api/wishlist/remove', { productId }, { headers: authHeaders(token) });
    return data;
  } catch (e) {
    axiosErr(e);
  }
}

export async function wishlistClear(userId, token) {
  try {
    const { data } = await api.delete(`/api/wishlist/${userId}`, { headers: authHeaders(token) });
    return data;
  } catch (e) {
    axiosErr(e);
  }
}

export function getMostWishlisted(params = {}) {
  const q = new URLSearchParams(params).toString();
  return fetchJson(`/api/most-wishlisted?${q}`);
}

export { BASE };
