# Backend Security Implementation Guide

This guide explains how to use the security features implemented in the Fixapp backend.

## Table of Contents

1. [Input Validation](#input-validation)
2. [Rate Limiting](#rate-limiting)
3. [Authentication](#authentication)
4. [Example Route Implementations](#example-route-implementations)
5. [Environment Setup](#environment-setup)

---

## Input Validation

### Using Validation Middleware

The validation middleware uses Zod schemas to validate and sanitize request data.

#### Basic Usage

```typescript
import { validate } from '@/middleware/validation';
import { registerSchema } from '@/validators/schemas';

router.post('/register', validate(registerSchema), registerController);
```

#### Validate Different Sources

```typescript
// Validate request body (default)
router.post('/users', validate(userSchema), controller);

// Validate query parameters
router.get('/users', validate(filterSchema, 'query'), controller);

// Validate URL parameters
router.get('/users/:id', validate(idSchema, 'params'), controller);
```

#### Validate Multiple Sources

```typescript
import { validateMultiple } from '@/middleware/validation';

router.patch(
  '/users/:id',
  validateMultiple({
    params: idSchema,
    body: updateUserSchema,
    query: optionsSchema
  }),
  controller
);
```

### Available Validation Schemas

All schemas are defined in `src/validators/schemas.ts`:

#### Authentication
- `registerSchema` - User registration with strong password requirements
- `loginSchema` - Email and password login
- `changePasswordSchema` - Password change with confirmation

#### Appointments
- `bookAppointmentSchema` - Book appointment (prevents past dates)
- `updateAppointmentSchema` - Update appointment status/notes
- `appointmentFilterSchema` - Filter and paginate appointments

#### Doctors
- `addDoctorSchema` - Add new doctor profile
- `updateDoctorSchema` - Update doctor information
- `doctorFilterSchema` - Filter and paginate doctors

#### Payments
- `createPaymentOrderSchema` - Create Razorpay order
- `verifyPaymentSchema` - Verify payment signature

#### Common
- `paginationSchema` - Page and limit parameters

### Custom Validation

Create custom schemas in `src/validators/schemas.ts`:

```typescript
export const customSchema = z.object({
  field: z.string().min(1).max(100),
  number: z.number().positive(),
  email: z.string().email()
});
```

---

## Rate Limiting

### Available Rate Limiters

Defined in `src/middleware/rateLimiter.ts`:

| Limiter | Limit | Window | Use Case |
|---------|-------|--------|----------|
| `apiLimiter` | 100 req | 15 min | General API endpoints |
| `authLimiter` | 5 req | 15 min | Login, register, password reset |
| `paymentLimiter` | 3 req | 1 min | Payment creation and verification |
| `bookingLimiter` | 5 req | 1 min | Appointment booking |
| `adminLimiter` | 50 req | 15 min | Admin operations |

### Applying Rate Limiters

```typescript
import { authLimiter, paymentLimiter } from '@/middleware/rateLimiter';

// Single route
router.post('/auth/login', authLimiter, loginController);

// Multiple routes
router.use('/auth', authLimiter);
router.post('/auth/login', loginController);
router.post('/auth/register', registerController);

// Combine with validation
router.post(
  '/payments/create',
  paymentLimiter,
  validate(createPaymentSchema),
  createPaymentController
);
```

### Custom Rate Limiter

```typescript
import rateLimit from 'express-rate-limit';

const customLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests
  message: {
    success: false,
    message: 'Too many requests'
  }
});
```

---

## Authentication

### Using Authentication Middleware

```typescript
import { authenticateUser, requireAdmin, requireDoctor } from '@/middleware/auth';

// Require any authenticated user
router.get('/profile', authenticateUser, profileController);

// Require specific role
router.get('/admin/dashboard', authenticateUser, requireAdmin, dashboardController);

// Require one of multiple roles
router.get('/appointments', authenticateUser, requireDoctorOrAdmin, appointmentsController);
```

### Available Auth Middleware

- `authenticateUser` - Validates JWT token and loads user profile
- `requireRole(['role1', 'role2'])` - Custom role checker
- `requireAdmin` - Requires admin role
- `requireDoctor` - Requires doctor role
- `requirePatient` - Requires patient role
- `requireDoctorOrAdmin` - Requires doctor or admin role

### Accessing User in Controllers

After authentication, user data is available in `req.user`:

```typescript
import type { AuthenticatedRequest } from '@/middleware/auth';

const controller = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  const userEmail = req.user?.email;
  
  // Your logic here
};
```

---

## Example Route Implementations

See the example files for complete implementations:

- `src/routes/auth.example.ts` - Authentication routes
- `src/routes/appointments.example.ts` - Appointment booking
- `src/routes/payments.example.ts` - Payment processing

### Complete Example: Auth Route

```typescript
import { Router } from 'express';
import { validate } from '@/middleware/validation';
import { authLimiter } from '@/middleware/rateLimiter';
import { loginSchema } from '@/validators/schemas';

const router = Router();

router.post(
  '/login',
  authLimiter,              // 1. Rate limiting
  validate(loginSchema),    // 2. Input validation
  async (req, res) => {     // 3. Controller
    try {
      const { email, password } = req.body; // Already validated!
      
      // Your authentication logic
      
      res.json({ success: true, token: 'jwt_token' });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  }
);

export default router;
```

### Complete Example: Protected Route

```typescript
import { Router } from 'express';
import { authenticateUser } from '@/middleware/auth';
import { validate } from '@/middleware/validation';
import { bookingLimiter } from '@/middleware/rateLimiter';
import { bookAppointmentSchema } from '@/validators/schemas';

const router = Router();

router.post(
  '/appointments',
  authenticateUser,                    // 1. Authentication
  bookingLimiter,                      // 2. Rate limiting
  validate(bookAppointmentSchema),     // 3. Input validation
  async (req, res) => {                // 4. Controller
    const userId = req.user?.id;
    const { doctor_id, appointment_date } = req.body;
    
    // Your booking logic
    
    res.status(201).json({ success: true });
  }
);

export default router;
```

---

## Environment Setup

### Required Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

### Critical Variables

```env
# Strong JWT secret (min 32 characters)
JWT_SECRET=your_secure_random_string_min_32_chars

# Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay credentials
RAZORPAY_KEY_ID=rzp_live_your_key
RAZORPAY_KEY_SECRET=your_secret_key

# Admin credentials (change immediately!)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!
```

### Generating Secure Secrets

```bash
# Generate JWT secret (32 bytes)
openssl rand -base64 32

# Generate random password
openssl rand -base64 24
```

---

## Security Best Practices

### 1. Always Validate Input

```typescript
// ❌ Bad - No validation
router.post('/users', (req, res) => {
  const { email } = req.body; // Could be anything!
});

// ✅ Good - Validated
router.post('/users', validate(userSchema), (req, res) => {
  const { email } = req.body; // Guaranteed valid email
});
```

### 2. Apply Rate Limiting

```typescript
// ❌ Bad - No rate limiting
router.post('/auth/login', loginController);

// ✅ Good - Rate limited
router.post('/auth/login', authLimiter, loginController);
```

### 3. Protect Sensitive Routes

```typescript
// ❌ Bad - No authentication
router.get('/admin/users', adminController);

// ✅ Good - Authenticated and authorized
router.get('/admin/users', authenticateUser, requireAdmin, adminController);
```

### 4. Handle Errors Properly

```typescript
// ❌ Bad - Exposes error details
catch (error) {
  res.status(500).json({ error: error.stack });
}

// ✅ Good - Generic message, log details
catch (error) {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}
```

### 5. Use Type Safety

```typescript
// ❌ Bad - Any type
const handleRequest = (data: any) => { ... };

// ✅ Good - Proper types
import type { RegisterInput } from '@/validators/schemas';
const handleRequest = (data: RegisterInput) => { ... };
```

---

## Testing

### Test Validation

```typescript
import { registerSchema } from '@/validators/schemas';

// Valid data
const validData = {
  full_name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  phone: '+1234567890'
};

const result = registerSchema.safeParse(validData);
console.log(result.success); // true

// Invalid data
const invalidData = {
  email: 'invalid-email',
  password: 'weak'
};

const result2 = registerSchema.safeParse(invalidData);
console.log(result2.success); // false
console.log(result2.error.errors); // Validation errors
```

---

## Troubleshooting

### Validation Errors Not Showing

Make sure validation middleware is before your controller:

```typescript
// ❌ Wrong order
router.post('/users', controller, validate(schema));

// ✅ Correct order
router.post('/users', validate(schema), controller);
```

### Rate Limiting Not Working

Check that rate limiter is applied:

```typescript
// Global (applies to all /api routes)
app.use('/api', apiLimiter);

// Per-route
router.post('/login', authLimiter, controller);
```

### Authentication Failing

Verify the Authorization header format:

```
Authorization: Bearer <your_jwt_token>
```

---

## Support

For questions or issues:
- Review the example files in `src/routes/*.example.ts`
- Check the SECURITY.md file for security guidelines
- Refer to the main README.md for project setup

---

**Remember**: Security is not a one-time implementation but an ongoing process. Keep dependencies updated, monitor logs, and follow security best practices!
