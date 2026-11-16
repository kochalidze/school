// ყველა მოთხოვნა გადის აქედან. JWT ინახება httpOnly cookie-ში (credentials: 'include').
const BASE = import.meta.env.VITE_API_BASE_URL || '/api';
export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + path, {
    method, credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'სერვერთან კავშირი ვერ დამყარდა');
  }
  return res.status === 204 ? null : res.json();
}
