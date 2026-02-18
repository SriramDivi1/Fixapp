import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware to validate request data against a Zod schema
 * @param schema - The Zod schema to validate against
 * @param source - Where to get the data from: 'body', 'query', or 'params'
 */
export const validate = (
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[source];
      
      // Validate and parse the data
      const validatedData = await schema.parseAsync(data);
      
      // Replace the original data with validated and sanitized data
      req[source] = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format validation errors
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors
        });
      }
      
      // Handle other errors
      return res.status(500).json({
        success: false,
        message: 'Validation error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};

/**
 * Middleware to validate multiple sources at once
 */
export const validateMultiple = (validations: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: Array<{ source: string; field: string; message: string }> = [];
      
      // Validate each source
      for (const [source, schema] of Object.entries(validations)) {
        if (schema) {
          try {
            const data = req[source as keyof typeof validations];
            const validatedData = await schema.parseAsync(data);
            req[source as keyof typeof validations] = validatedData;
          } catch (error) {
            if (error instanceof ZodError) {
              error.errors.forEach((err) => {
                errors.push({
                  source,
                  field: err.path.join('.'),
                  message: err.message
                });
              });
            }
          }
        }
      }
      
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Validation error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};

/**
 * Sanitize input to prevent XSS and injection attacks
 * This is a basic sanitization - for production, consider using libraries like DOMPurify or xss
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .trim();
};

/**
 * Middleware to sanitize all string values in request body
 */
export const sanitizeBody = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    const sanitized = sanitizeObject(req.body);
    req.body = sanitized;
  }
  next();
};

function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}
