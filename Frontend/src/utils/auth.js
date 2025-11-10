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
