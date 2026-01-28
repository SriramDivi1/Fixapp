import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// General API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limiting for authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful requests
});

// Payment route limiting
export const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // limit each IP to 3 payment requests per minute
  message: {
    success: false,
    message: 'Too many payment attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Booking rate limiting
export const bookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each user to 5 booking attempts per minute
  message: {
    success: false,
    message: 'Too many booking attempts, please try again later.'
  },
  keyGenerator: (req: Request) => {
    // Use user ID if authenticated, otherwise IP
    return req.body.userId || req.ip;
  }
});

// Admin routes limiting
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit admin operations
  message: {
    success: false,
    message: 'Too many admin requests, please try again later.'
  }
});