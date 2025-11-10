// src/utils/auth.js
import logger from './logger';

const getApiBase = () => {
  return process.env.REACT_APP_API_BASE ||
    (typeof window !== 'undefined' && window.location.hostname === 'cpa-website-1.onrender.com'
      ? 'https://cpa-website-lvup.onrender.com/api'
      : 'http://localhost:8000/api');
};

// POST the Google id_token to backend and return JWT tokens
export const googleLoginWithIdToken = async (id_token) => {
  const apiBase = getApiBase();
  const url = `${apiBase}/auth/google/`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  } catch (err) {
    logger.error('Google login with id_token failed', err);
    throw err;
  }
};

// Exchange an OAuth authorization code (from Google) with the backend.
// The backend will perform the server-side token exchange with Google and
// return application JWTs (same shape as googleLoginWithIdToken).
export const exchangeGoogleToken = async (code) => {
  const apiBase = getApiBase();
  // This mirrors the backend route mapped to the SocialLoginView
  const url = `${apiBase}/auth/registration/google/`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  } catch (err) {
    logger.error('Exchange Google code failed', err);
    throw err;
  }
};

// Start an OAuth authorization code flow with Google by redirecting the browser
// to Google's authorization endpoint. The backend is expected to handle the
// server-side token exchange when the callback returns to the app.
export const handleGoogleLogin = (returnUrl) => {
  try {
    if (returnUrl) localStorage.setItem('returnUrl', returnUrl);
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const callbackUrl = process.env.REACT_APP_GOOGLE_CALLBACK_URL || (typeof window !== 'undefined' ? `${window.location.origin}/google-callback` : '');
    const scope = 'openid email profile';
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope,
      access_type: 'offline',
      prompt: 'consent'
    });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    // Redirect to Google's OAuth consent screen
    if (typeof window !== 'undefined') window.location.href = authUrl;
  } catch (err) {
    logger.error('Failed to start Google OAuth flow', err);
    throw err;
  }
};
