// Configurable API base URL:
// In development, defaults to '/api' (proxied via vite.config.js to localhost:5000)
// In production on Vercel, set VITE_API_URL to your backend URL (e.g. https://your-backend.vercel.app)
const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const API_BASE = rawApiUrl
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`)
  : '/api';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('bytecraft_token') || localStorage.getItem('techpulse_token');

  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// Clean query string builder that excludes undefined, null, empty strings, and 'all'
export const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== 'undefined' &&
      value !== 'all'
    ) {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

// API Services
export const postsApi = {
  getPublicPosts: (params = {}) => {
    return apiFetch(`/posts${buildQueryString(params)}`);
  },
  getFeaturedPosts: () => apiFetch('/posts/featured'),
  getTrendingPosts: (limit = 4) => apiFetch(`/posts/trending?limit=${limit}`),
  getPostBySlug: (slug) => apiFetch(`/posts/slug/${slug}`),

  // Admin
  getAdminPosts: (params = {}) => {
    return apiFetch(`/posts/admin/all${buildQueryString(params)}`);
  },
  getPostById: (id) => apiFetch(`/posts/${id}`),
  createPost: (postData) =>
    apiFetch('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),
  updatePost: (id, postData) =>
    apiFetch(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    }),
  toggleFeatured: (id) =>
    apiFetch(`/posts/${id}/featured`, {
      method: 'PATCH',
    }),
  deletePost: (id) =>
    apiFetch(`/posts/${id}`, {
      method: 'DELETE',
    }),
};

export const categoriesApi = {
  getAll: () => apiFetch('/categories'),
  getBySlug: (slug) => apiFetch(`/categories/${slug}`),
  create: (catData) =>
    apiFetch('/categories', {
      method: 'POST',
      body: JSON.stringify(catData),
    }),
  update: (id, catData) =>
    apiFetch(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(catData),
    }),
  delete: (id) =>
    apiFetch(`/categories/${id}`, {
      method: 'DELETE',
    }),
};

export const usersApi = {
  getAll: () => apiFetch('/users'),
  create: (userData) =>
    apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  update: (id, userData) =>
    apiFetch(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  delete: (id) =>
    apiFetch(`/users/${id}`, {
      method: 'DELETE',
    }),
};

export const authApi = {
  register: (userData) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  login: (credentials) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => apiFetch('/auth/me'),
  updateProfile: (profileData) =>
    apiFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

export const uploadApi = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiFetch('/upload', {
      method: 'POST',
      body: formData,
    });
  },
};

