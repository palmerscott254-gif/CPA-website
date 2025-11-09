import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { exchangeGoogleToken } from '../utils/auth';
import logger from '../utils/logger';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code'); // For authorization code flow
      const error = params.get('error');

      if (error) {
        logger.error('Google OAuth error:', error);
        navigate('/login?error=google_oauth_failed');
        return;
      }

      if (code) {
        try {
          // Exchange the authorization code for tokens
          // The backend will handle the actual token exchange with Google
          // and then log in the user, returning JWTs.
          await exchangeGoogleToken(code); // Assuming exchangeGoogleToken handles the backend call and token storage
          navigate(localStorage.getItem('returnUrl') || '/');
          localStorage.removeItem('returnUrl');
        } catch (err) {
          logger.error('Error exchanging Google code:', err);
          navigate('/login?error=google_login_failed');
        }
      } else {
        // If no code and no error, something unexpected happened
        navigate('/login?error=google_callback_issue');
      }
    };

    handleCallback();
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Processing Google Login...
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Please wait while we securely log you in.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;
