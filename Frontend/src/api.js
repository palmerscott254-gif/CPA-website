// Determine API base URL:
// Priority: REACT_APP_API_BASE env var -> production mapping -> localhost dev
let API_BASE = process.env.REACT_APP_API_BASE;
if (!API_BASE) {
  try {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    // If frontend is hosted on the production frontend domain, default to the deployed backend
    if (host === 'cpa-website-1.onrender.com') {
      API_BASE = 'https://cpa-website-lvup.onrender.com/api';
    } else {
      API_BASE = 'http://localhost:8000/api';
    }
  } catch (e) {
    API_BASE = 'http://localhost:8000/api';
  }
}

// Enhanced API utility with better error handling and token management
export class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
  }

  getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      return data.access;
    } catch (error) {
      // Clear tokens on refresh failure
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      throw error;
    }
  }

  async request(path, options = {}) {
    const url = `${this.baseURL}${path}`;
    const headers = {
      "Content-Type": "application/json",
      ...this.getAuthHeaders(),
      ...(options.headers || {}),
    };

    let response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });

      // If unauthorized and we have a refresh token, try to refresh
      if (response.status === 401 && localStorage.getItem("refresh_token")) {
        try {
          await this.refreshToken();
          // Retry the request with new token
          headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
          response = await fetch(url, {
            ...options,
            headers,
          });
        } catch (refreshError) {
          // Redirect to login if refresh fails
          window.location.href = "/login";
          throw refreshError;
        }
      }

      const data = await response.json().catch(() => null);
      
      if (!response.ok) {
        const error = new Error(data?.detail || `HTTP ${response.status} Error`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      const networkError = new Error("Network error - please check your connection");
      networkError.status = 0;
      networkError.data = null;
      throw networkError;
    }
  }

  async get(path, options = {}) {
    return this.request(path, { ...options, method: "GET" });
  }

  async post(path, data, options = {}) {
    return this.request(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(path, data, options = {}) {
    return this.request(path, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(path, options = {}) {
    return this.request(path, { ...options, method: "DELETE" });
  }
  async download(path, options = {}) {
    const url = `${this.baseURL}${path}`;
    const headers = {
      ...this.getAuthHeaders(),
      ...(options.headers || {}),
    };

    let response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });

      // If unauthorized and there's no refresh token, redirect to login immediately
      if (response.status === 401 && !localStorage.getItem("refresh_token")) {
        window.location.href = "/login";
        const err = new Error("Unauthorized");
        err.status = 401;
        throw err;
      }

      // If unauthorized and we have a refresh token, try to refresh
      if (response.status === 401 && localStorage.getItem("refresh_token")) {
        try {
          await this.refreshToken();
          // Retry the request with new token
          headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
          response = await fetch(url, {
            ...options,
            headers,
          });
        } catch (refreshError) {
          // Redirect to login if refresh fails
          window.location.href = "/login";
          throw refreshError;
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const error = new Error(errorData?.detail || `HTTP ${response.status} Error`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      return response; // Return the raw response for blob handling
    } catch (error) {
      if (error.status) {
        throw error;
      }
      const networkError = new Error("Network error - please check your connection");
      networkError.status = 0;
      networkError.data = null;
      throw networkError;
    }
  }
}

// Create a singleton instance
const apiClient = new ApiClient();

// Legacy functions for backward compatibility
export async function fetchJSON(path, opts = {}) {
  return apiClient.request(path, opts);
}

export async function downloadFile(path) {
  try {
    const response = await apiClient.download(path); // Use the new download method

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;

    // Extract filename from Content-Disposition header if provided, otherwise from path
    let filename = path.split("/").pop() || "download";
    const cd = response.headers.get("Content-Disposition");
    if (cd) {
      const match = cd.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/);
      if (match && match[1]) filename = decodeURIComponent(match[1]);
    }

    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    // apiClient.download should handle 401 redirects, but other errors might still occur
    console.error("Download error in downloadFile:", error);
    throw error; // Re-throw to be caught by the calling component
  }
}

// Export the API client for new code
export default apiClient;
