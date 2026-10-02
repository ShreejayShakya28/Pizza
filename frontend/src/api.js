export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status; // 0 = server unreachable
  }
}

// Thin fetch wrapper: one place for base URL, JSON handling and error shaping.
async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Is the backend running?', 0);
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(body.error || `Request failed (${res.status})`, res.status);
  return body;
}

const send = (method, path, payload) =>
  request(path, { method, body: JSON.stringify(payload) });

export const api = {
  getMenu: () => request('/menu'),

  signup: (payload) => send('POST', '/users/signup', payload),
  login: (payload) => send('POST', '/users/login', payload),
  getProfile: (id) => request(`/users/${id}`),
  updateProfile: (id, payload) => send('PATCH', `/users/${id}`, payload),

  getOrders: (userId) => request(`/orders?userId=${encodeURIComponent(userId)}`),
  placeOrder: (payload) => send('POST', '/orders', payload),
};
// Examples:
//   api.login({ email: "maya@example.com", password: "pizza123" })
//   api.updateProfile(1, { name: "Maya", age: 28, gender: "female" })
//   api.placeOrder({ userId: 1, items: [{ itemId: 1, quantity: 2 }, { itemId: 2, quantity: 1 }], tipPercent: 15 })
