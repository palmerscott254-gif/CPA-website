import { logger } from './utils/logger';

// Determine API base URL:
// Priority: REACT_APP_API_BASE env var -> production mapping -> localhost dev
let API_BASE = process.env.REACT_APP_API_BASE;
if (!API_BASE) {
  try {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    const isRender = /\.onrender\.com$/i.test(host) || host === 'cpa-website-1.onrender.com';

    if (!isLocal) {
      // In any non-local environment (Render, custom domain), default to the deployed backend
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
    const isAbsolute = /^https?:\/\//i.test(path);
    const url = isAbsolute ? path : `${this.baseURL}${path}`;
    
    // Only include auth headers for API requests, not for presigned S3 URLs
    const headers = isAbsolute ? {} : {
      ...this.getAuthHeaders(),
      ...(options.headers || {}),
    };

    // Include credentials for API requests to support CORS with authentication
    const fetchOptions = {
      ...options,
      headers,
      credentials: isAbsolute ? 'omit' : 'include', // Include credentials for API calls
    };

    let response;
    try {
      response = await fetch(url, fetchOptions);

      // Only handle auth for API endpoints, not absolute URLs (presigned URLs)
      if (!isAbsolute) {
        // If unauthorized and there's no refresh token, redirect to login immediately
        if (response.status === 401 && !localStorage.getItem("refresh_token")) {
          window.location.href = "/login";
          const err = new Error("Unauthorized - please log in");
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
              ...fetchOptions,
              headers,
            });
          } catch (refreshError) {
            // Redirect to login if refresh fails
            window.location.href = "/login";
            throw refreshError;
          }
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
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const triggerDownload = (blob, fallbackFilename) => {
    const filename = fallbackFilename || 'download';

    // IE/Edge legacy
    if (typeof window.navigator.msSaveOrOpenBlob !== 'undefined') {
      window.navigator.msSaveOrOpenBlob(blob, filename);
      return;
    }

    const blobUrl = window.URL.createObjectURL(blob);

    // iOS Safari cannot use the download attribute reliably
    if (isIOS || (isSafari && typeof document.createElement('a').download === 'undefined')) {
      const win = window.open();
      if (win) {
        win.location.href = blobUrl;
      } else {
        window.location.href = blobUrl;
      }
      // Revoke later to avoid iOS timing issues
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
      return;
    }

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  const extractFilename = (pathOrHeader, headerValue) => {
    let filename = pathOrHeader.split('/').pop() || 'download';
    const cd = headerValue || '';
    const match = cd.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/);
    if (match && match[1]) filename = decodeURIComponent(match[1]);
    return filename;
  };

  const downloadFromResponse = async (response, originalPath) => {
    const contentType = response.headers.get('content-type');
    
    // Handle JSON response with presigned URL (S3 storage)
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (data && data.download_url) {
        const presignedUrl = data.download_url;
        logger.info('Navigating to presigned URL for instant download:', presignedUrl);
        // Let the browser handle the download stream directly from S3
        const a = document.createElement('a');
        a.href = presignedUrl;
        a.rel = 'noopener';
        a.target = '_self';
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }
      
      // JSON error response
      const detail = data?.detail || 'Download failed';
      const err = new Error(detail);
      err.status = response.status;
      throw err;
    }

    // Binary response (local file download)
    const blob = await response.blob();
    
    if (!blob || blob.size === 0) {
      throw new Error('Downloaded file is empty');
    }
    
    const filename = extractFilename(
      originalPath, 
      response.headers.get('Content-Disposition') || response.headers.get('content-disposition')
    );
    
    logger.info(`Downloaded ${blob.size} bytes (local), filename: ${filename}`);
    triggerDownload(blob, filename);
  };

  try {
    logger.info('Starting download:', path);
    let response = await apiClient.download(path);
    await downloadFromResponse(response, path);
    logger.info('Download completed successfully');
  } catch (error) {
    logger.error('Download error:', error);
    throw error;
  }
}

// Export the API client for new code
export default apiClient;
