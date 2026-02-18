/**
 * Example Auth Routes - Demonstrates best practices for:
 * - Input validation using Zod schemas
 * - Rate limiting for auth endpoints
 * - Proper error handling
 * - Type safety
 * 
 * This is a reference implementation. Actual routes should be implemented
 * based on your specific requirements.
 */

import { Router } from 'express';
import { validate } from '@/middleware/validation';
import { authLimiter } from '@/middleware/rateLimiter';
import { registerSchema, loginSchema, changePasswordSchema } from '@/validators/schemas';
import type { Request, Response } from 'express';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user account
 * 
 * Rate limit: 5 requests per 15 minutes per IP
 * Validation: Enforces strong password requirements
 */
router.post(
  '/register',
  authLimiter, // Apply rate limiting
  validate(registerSchema), // Validate request body
  async (req: Request, res: Response) => {
    try {
      // TODO: Implement registration logic
      // The request body is already validated and typed
      const { full_name, email, password, phone, role } = req.body;
      
      res.status(201).json({
        success: true,
        message: 'Registration successful'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * POST /api/auth/login
 * Authenticate user and return session token
 * 
 * Rate limit: 5 requests per 15 minutes per IP
 * Validation: Validates email format and password presence
 */
router.post(
  '/login',
  authLimiter, // Apply rate limiting
  validate(loginSchema), // Validate request body
  async (req: Request, res: Response) => {
    try {
      // TODO: Implement login logic
      const { email, password } = req.body;
      
      res.json({
        success: true,
        message: 'Login successful'
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * POST /api/auth/logout
 * End user session
 * 
 * No rate limiting needed for logout
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    // TODO: Implement logout logic
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

/**
 * POST /api/auth/change-password
 * Change user password
 * 
 * Rate limit: 5 requests per 15 minutes per IP
 * Validation: Enforces strong password requirements and matches confirmation
 */
router.post(
  '/change-password',
  authLimiter, // Apply rate limiting
  validate(changePasswordSchema), // Validate request body
  async (req: Request, res: Response) => {
    try {
      // TODO: Implement password change logic
      const { currentPassword, newPassword } = req.body;
      
      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Password change failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

export default router;
