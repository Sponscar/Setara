/**
 * ==============================================================================
 * File: api.js
 * Direktori: src/services/
 * Deskripsi: Centralized HTTP API Client platform SETARA.
 * Fitur:
 *   - Auto-attach JWT Bearer Token di header Authorization
 *   - Auto-refresh token saat menerima respons 401 Unauthorized
 *   - Error handling terstandarisasi dengan ekstraksi detail dari backend
 *   - Dukungan file upload (multipart/form-data)
 * ==============================================================================
 */

const BASE_URL = '/api';

const TOKEN_KEY = 'setara_access_token';
const REFRESH_TOKEN_KEY = 'setara_refresh_token';
const USER_KEY = 'setara_user';

export const tokenStorage = {
  getAccessToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  getRefreshToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  getUser: () => {
    if (typeof window === 'undefined') return null;
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  setSession: (access, refresh, user) => {
    if (typeof window === 'undefined') return;
    if (access) localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearSession: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

/**
 * Core fetch wrapper with auto-header and error parsing.
 */
async function request(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${cleanEndpoint}`;
  const headers = { ...options.headers };

  // Attach token if available
  const token = tokenStorage.getAccessToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Set Content-Type: application/json unless body is FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers
  };

  try {
    let response = await fetch(url, config);

    // Auto-refresh handling for 401 Unauthorized
    if (response.status === 401 && !options._retry && tokenStorage.getRefreshToken()) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            headers['Authorization'] = `Bearer ${newToken}`;
            resolve(request(endpoint, { ...options, headers, _retry: true }));
          });
        });
      }

      options._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: tokenStorage.getRefreshToken() })
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newAccessToken = refreshData.access_token;
          tokenStorage.setSession(newAccessToken, refreshData.refresh_token || tokenStorage.getRefreshToken());
          isRefreshing = false;
          onRefreshed(newAccessToken);

          headers['Authorization'] = `Bearer ${newAccessToken}`;
          return request(endpoint, { ...options, headers, _retry: true });
        } else {
          // Refresh failed -> clear session
          tokenStorage.clearSession();
          isRefreshing = false;
          refreshSubscribers = [];
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth:unauthorized'));
          }
        }
      } catch (refreshErr) {
        tokenStorage.clearSession();
        isRefreshing = false;
        refreshSubscribers = [];
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:unauthorized'));
        }
      }
    }

    if (!response.ok) {
      let errorMsg = `HTTP ${response.status} ${response.statusText}`;
      let errorDetail = null;
      try {
        const errorData = await response.json();
        errorDetail = errorData;
        errorMsg = errorData.detail || errorData.message || JSON.stringify(errorData);
      } catch {
        // Response is not JSON
      }
      const err = new Error(errorMsg);
      err.status = response.status;
      err.detail = errorDetail;
      throw err;
    }

    // Return JSON if available, otherwise text
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    throw error;
  }
}

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : (data !== undefined ? JSON.stringify(data) : undefined)
    }),
  put: (endpoint, data, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'PUT',
      body: data instanceof FormData ? data : (data !== undefined ? JSON.stringify(data) : undefined)
    }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
  upload: (endpoint, formData, options = {}) =>
    request(endpoint, {
      ...options,
      method: 'POST',
      body: formData
    })
};

export default api;