const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";

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
}

// Create a singleton instance
const apiClient = new ApiClient();

// Legacy functions for backward compatibility
export async function fetchJSON(path, opts = {}) {
  return apiClient.request(path, opts);
}

export function downloadFile(path, token) {
  const url = `${API_BASE}${path}`;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  return fetch(url, { headers })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      
      // Extract filename from path or use default
      const filename = path.split("/").pop() || "download.pdf";
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(error => {
      // Error is thrown to be handled by caller
      throw error;
    });
}

// Export the API client for new code
export default apiClient;
