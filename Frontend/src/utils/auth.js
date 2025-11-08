// src/utils/auth.js

const getApiBase = () => {
  return process.env.REACT_APP_API_BASE || 
         (typeof window !== 'undefined' && window.location.hostname === 'cpa-website-1.onrender.com' 
           ? 'https://cpa-website-lvup.onrender.com/api' 
           : 'http://localhost:8000/api');
};

export const handleGoogleLogin = () => {
  const apiBase = getApiBase();
  const googleLoginUrl = `${apiBase}/auth/registration/google/`;
  localStorage.setItem('returnUrl', window.location.href);
  window.location.href = googleLoginUrl;
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
    console.error('Google token exchange failed', err);
  }
};
