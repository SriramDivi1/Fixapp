// Simple logger utility for production
const logger = {
  error: (message, error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(message, error);
    } else {
      // In production, log only the message without stack trace
      console.error(message);
    }
  },
  info: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message);
    }
  }
};

export default logger;
