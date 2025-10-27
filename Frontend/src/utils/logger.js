/**
 * Production-ready logger utility
 * Logs errors in development and can be extended for production error tracking
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log errors with optional context
   * @param {string} message - Error message
   * @param {Error|Object} error - Error object or additional data
   */
  error: (message, error = null) => {
    if (isDevelopment) {
      console.error(message, error);
    } else {
      // In production, you can send errors to a tracking service like Sentry
      // Example: Sentry.captureException(error);
      console.error(message, error);
    }
  },

  /**
   * Log warnings
   * @param {string} message - Warning message
   * @param {any} data - Additional data
   */
  warn: (message, data = null) => {
    if (isDevelopment) {
      console.warn(message, data);
    }
  },

  /**
   * Log info messages (development only)
   * @param {string} message - Info message
   * @param {any} data - Additional data
   */
  info: (message, data = null) => {
    if (isDevelopment) {
      console.info(message, data);
    }
  },

  /**
   * Log debug messages (development only)
   * @param {string} message - Debug message
   * @param {any} data - Additional data
   */
  debug: (message, data = null) => {
    if (isDevelopment) {
      console.debug(message, data);
    }
  }
};

export default logger;

