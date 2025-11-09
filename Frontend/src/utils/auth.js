// src/utils/auth.js
import logger from './logger';

const getApiBase = () => {
  return process.env.REACT_APP_API_BASE || 
         (typeof window !== 'undefined' && window.location.hostname === 'cpa-website-1.onrender.com' 
           ? 'https://cpa-website-lvup.onrender.com/api' 
           : 'http://localhost:8000/api');
};

export const handleGoogleLogin = () => {
  const apiBase = getApiBase();
  // This URL should initiate the Google OAuth flow from the backend.
  // Ensure the redirect URI is URL encoded and includes the correct callback path.
  const redirectUri = encodeURIComponent(`${window.location.origin}/google-callback`);
  const googleAuthInitiateUrl = `${apiBase}/auth/registration/google/?redirect_uri=${redirectUri}`;
  localStorage.setItem('returnUrl', window.location.href);
  window.location.href = googleAuthInitiateUrl;
};

export const exchangeGoogleToken = async (token) => {
  const apiBase = getApiBase();
  const url = `${apiBase}/auth/registration/google/`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: token }),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw data;
    localStorage.setItem('access_token', data.access || data.key || '');
    localStorage.setItem('refresh_token', data.refresh || '');
    const returnUrl = localStorage.getItem('returnUrl') || '/';
    window.location.href = returnUrl;
  } catch (err) {
    logger.error('Google token exchange failed', err);
  }
};
