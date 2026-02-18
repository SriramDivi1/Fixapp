# Fixapp Security Guide

## 🔒 Critical Security Fixes Implemented

This document outlines the security improvements made to the Fixapp codebase and best practices for developers.

---

## 1. Environment Variables & Secrets Management

### ✅ What Was Fixed
- **Removed .env files from git tracking** - All `.env` files containing real credentials have been removed from version control
- **Created comprehensive .gitignore files** - Added rules to prevent future `.env` file commits
- **Created .env.example templates** - Proper template files with placeholder values for all components (backend, frontend, admin)

### 🚨 Critical Actions Required

**IMMEDIATELY AFTER DEPLOYMENT:**

1. **Rotate ALL exposed credentials:**
   - Supabase service role key
   - JWT secret (generate new with `openssl rand -base64 32`)
   - Razorpay API keys
   - Admin password
   - SMTP credentials

2. **Create new .env files from templates:**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your real credentials
   
   # Frontend
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your real credentials
   
   # Admin
   cp admin/.env.example admin/.env
   # Edit admin/.env with your real credentials
   ```

3. **Use environment-specific variables:**
   - Development: Use local Supabase instance with test credentials
   - Production: Use secure credential management (e.g., AWS Secrets Manager, HashiCorp Vault)

### 📋 Password Requirements

All passwords must meet these criteria:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

Example strong passwords:
- `MySecure@Pass123!`
- `Health$Care2026*`

---

## 2. Input Validation & Sanitization

### ✅ What Was Implemented

**Comprehensive Zod Validation Schemas** (`backend/src/validators/schemas.ts`):
- ✅ Email validation with proper format and length checks
- ✅ Strong password validation with complexity requirements
- ✅ Phone number format validation
- ✅ Address validation
- ✅ Appointment date/time validation (prevents past dates)
- ✅ Payment amount validation (reasonable limits)
- ✅ UUID validation for IDs
- ✅ Pagination and filtering validation

**Validation Middleware** (`backend/src/middleware/validation.ts`):
- ✅ `validate()` - Validates request body/query/params against Zod schemas
- ✅ `validateMultiple()` - Validates multiple sources simultaneously
- ✅ `sanitizeBody()` - Sanitizes string inputs to prevent XSS

### 📖 How to Use

Apply validation to your routes:

```typescript
import { validate } from '@/middleware/validation';
import { registerSchema, loginSchema } from '@/validators/schemas';

// Single validation
router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);

// Validate query parameters
router.get('/doctors', validate(doctorFilterSchema, 'query'), getDoctorsController);

// Validate URL parameters
router.get('/appointments/:id', validate(idSchema, 'params'), getAppointmentController);
```

---

## 3. Authentication Security Improvements

### ✅ What Was Fixed

**Token Extraction** (`backend/src/middleware/auth.ts`):
- ❌ Old: `req.headers.authorization?.replace('Bearer ', '')`
- ✅ New: Proper validation of Authorization header format
  - Validates "Bearer " prefix exists
  - Validates token is not empty
  - Uses `substring()` for safer extraction

**Benefits:**
- Prevents malformed header attacks
- Rejects empty tokens
- More robust error handling

### 🔒 Token Storage Best Practices

**Frontend/Admin:**
- ⚠️ **Current**: Using `localStorage` for tokens
- ✅ **Recommended**: Migrate to `HttpOnly` cookies
  - Prevents XSS token theft
  - Automatic CSRF protection with `SameSite=Strict`
  - Better security posture

**Example Migration:**
```typescript
// Backend - Set cookie instead of returning token
res.cookie('auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Frontend - No need to store manually, browser handles it
// Just make requests with { credentials: 'include' }
```

---

## 4. Rate Limiting

### ✅ What Exists

Rate limiters are defined in `backend/src/middleware/rateLimiter.ts`:
- `apiLimiter` - General API (100 req/15min)
- `authLimiter` - Login/Register (5 req/15min)
- `paymentLimiter` - Payments (3 req/min)
- `bookingLimiter` - Appointments (5 req/min)
- `adminLimiter` - Admin operations (50 req/15min)

### 🔧 How to Apply

**Currently**: Only `apiLimiter` is applied globally

**Recommended**: Apply specific limiters to routes:

```typescript
import { authLimiter, paymentLimiter, bookingLimiter } from '@/middleware/rateLimiter';

// Auth routes
router.post('/auth/login', authLimiter, loginController);
router.post('/auth/register', authLimiter, registerController);

// Payment routes
router.post('/payments/create', paymentLimiter, createPaymentController);
router.post('/payments/verify', paymentLimiter, verifyPaymentController);

// Booking routes
router.post('/appointments', bookingLimiter, bookAppointmentController);
```

---

## 5. CORS Configuration

### ⚠️ Current Configuration

Located in `backend/src/server.ts`:

```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL!, process.env.ADMIN_URL!]
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

### 🔒 Security Recommendations

1. **Production Environment Variables:**
   Add to `backend/.env`:
   ```env
   FRONTEND_URL=https://your-domain.com
   ADMIN_URL=https://admin.your-domain.com
   ```

2. **Cookie Configuration:**
   When using cookies for auth, ensure:
   ```typescript
   res.cookie('token', value, {
     httpOnly: true,
     secure: true, // HTTPS only in production
     sameSite: 'strict', // Prevent CSRF
     domain: '.your-domain.com' // Allow subdomains
   });
   ```

---

## 6. Content Security Policy (CSP)

### ✅ Current Implementation

Helmet is configured with basic CSP in `backend/src/server.ts`:

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"]
    }
  }
}));
```

### 🔧 Production Recommendations

Tighten CSP for production:

```typescript
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "https://fonts.googleapis.com"],
    scriptSrc: ["'self'", "https://checkout.razorpay.com"],
    imgSrc: ["'self'", "data:", "https://your-cdn.com"],
    connectSrc: [
      "'self'",
      process.env.SUPABASE_URL,
      "https://api.razorpay.com"
    ],
    fontSrc: ["'self'", "https://fonts.gstatic.com"]
  }
}
```

---

## 7. SQL Injection Prevention

### ✅ Protected

Using Supabase client provides automatic protection:
- Parameterized queries
- No raw SQL strings
- Type-safe query builder

### ⚠️ Warning

If you ever need to use raw SQL:

```typescript
// ❌ NEVER DO THIS
const { data } = await supabase.rpc('raw_query', {
  query: `SELECT * FROM users WHERE email = '${userInput}'`
});

// ✅ ALWAYS USE PARAMETERS
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userInput);
```

---

## 8. XSS Prevention

### ✅ Implemented

1. **Validation middleware** sanitizes inputs
2. **Zod schemas** enforce safe data types
3. **React auto-escaping** prevents XSS in UI
4. **CSP headers** limit inline scripts

### 📖 Best Practices

**Frontend:**
```typescript
// ❌ Dangerous
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Safe
<div>{userInput}</div>

// ✅ Safe with library
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

**Backend:**
```typescript
// Already handled by sanitizeBody middleware
// Applied globally or per-route
app.use(sanitizeBody);
```

---

## 9. Dependency Security

### 📋 Regular Audits Required

Run these commands regularly:

```bash
# Check for vulnerabilities
npm audit

# Fix automatically if possible
npm audit fix

# For critical issues
npm audit fix --force

# Use updated packages
npm update
```

### 🔧 Recommended CI/CD Integration

Add to your `.github/workflows/security.yml`:

```yaml
name: Security Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run npm audit
        run: |
          cd backend && npm audit --audit-level=moderate
          cd ../frontend && npm audit --audit-level=moderate
          cd ../admin && npm audit --audit-level=moderate
```

---

## 10. Error Handling

### ✅ Current Implementation

Error handler in `backend/src/middleware/errorHandler.ts` prevents information leakage:
- Development: Full error stack
- Production: Generic error messages

### 📖 Best Practices

```typescript
// ❌ Don't expose internals
res.status(500).json({ error: err.stack });

// ✅ Use generic messages
res.status(500).json({ 
  success: false, 
  message: 'Internal server error' 
});

// ✅ Log detailed errors server-side
console.error('Payment processing error:', {
  error: err.message,
  stack: err.stack,
  userId: req.user?.id,
  timestamp: new Date()
});
```

---

## 11. Security Checklist

### Before Deployment

- [ ] Rotate all exposed credentials
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Configure production CORS origins
- [ ] Enable HTTPS/TLS for all endpoints
- [ ] Set secure cookie flags (httpOnly, secure, sameSite)
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Enable rate limiting on all routes
- [ ] Configure CSP headers properly
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Enable request logging
- [ ] Configure database connection limits
- [ ] Set up backup and disaster recovery
- [ ] Enable API request logging
- [ ] Configure firewall rules
- [ ] Set up intrusion detection

### Ongoing Maintenance

- [ ] Weekly: Review access logs
- [ ] Monthly: Run security audits
- [ ] Quarterly: Update dependencies
- [ ] Bi-annually: Penetration testing
- [ ] Annually: Security architecture review

---

## 12. Resources

### Security Tools
- [Snyk](https://snyk.io/) - Dependency scanning
- [OWASP ZAP](https://www.zaproxy.org/) - Penetration testing
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Vulnerability scanning

### Learning Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🆘 Incident Response

If a security breach is suspected:

1. **Immediate Actions:**
   - Revoke compromised credentials
   - Enable maintenance mode
   - Preserve logs and evidence
   - Notify affected users (if required by law)

2. **Investigation:**
   - Review access logs
   - Check database for unauthorized access
   - Identify breach vector
   - Document timeline

3. **Remediation:**
   - Patch vulnerability
   - Reset all user passwords
   - Update security measures
   - Deploy fixes

4. **Post-Incident:**
   - Conduct security review
   - Update security policies
   - Train team on new procedures
   - Document lessons learned

---

## 📞 Support

For security concerns or questions:
- Email: security@fixapp.com
- Bug Bounty: [Link to your program]
- Security Policy: See SECURITY.md

**Remember: Security is not a one-time task, it's an ongoing process!** 🔒
