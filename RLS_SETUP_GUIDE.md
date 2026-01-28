# Row Level Security (RLS) Setup Guide

## Overview

Row Level Security (RLS) is a critical security feature that ensures users can only access data they're authorized to see. This guide walks you through applying RLS policies to your Fixapp Supabase database.

## Prerequisites

- Supabase project set up
- Supabase CLI installed (or access to Supabase Dashboard)
- Database schema applied (from `supabase/schema.sql`)

## Understanding RLS

RLS policies control which rows users can access in database tables. For Fixapp:

- **Patients** can only see their own appointments and profile
- **Doctors** can see their appointments and manage their profile
- **Admins** have full access to manage the system
- **Public** can view available doctors for booking

## Applying RLS Policies

### Option 1: Using Supabase Dashboard (Recommended for First Time)

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Execute RLS Policies**

   ```sql
   -- Copy the entire contents of supabase/migrations/20260128_enable_rls_policies.sql
   -- Paste into the SQL editor
   -- Click "Run" or press Cmd/Ctrl + Enter
   ```

4. **Verify Policies Applied**
   - Go to "Authentication" → "Policies"
   - You should see policies listed for each table

### Option 2: Using Supabase CLI

```bash
# Ensure you're linked to your project
supabase link --project-ref YOUR_PROJECT_REF

# Create a new migration file
supabase migration new enable_rls_policies

# Copy contents to the migration file (already exists as 20260128_enable_rls_policies.sql)
# No need to copy - file already exists

# Apply the migration
supabase db push

# Verify policies were applied
supabase db dump --schema-only | grep -A 5 "CREATE POLICY"
```

## Testing RLS Policies

### 1. Test User Profile Access

```sql
-- Create a test user via Supabase Auth
-- Then test with their UUID

-- This should return only the user's profile
SELECT * FROM user_profiles WHERE id = auth.uid();

-- This should return nothing (can't access other profiles)
SELECT * FROM user_profiles WHERE id != auth.uid();
```

### 2. Test Doctor Visibility

```sql
-- As anonymous user (not logged in)
-- Should only see available doctors
SELECT * FROM doctors WHERE is_available = true;

-- Should NOT see unavailable doctors
SELECT * FROM doctors WHERE is_available = false;
```

### 3. Test Appointment Access

```sql
-- As a patient
-- Should only see their own appointments
SELECT * FROM appointments WHERE patient_id = auth.uid();

-- As a doctor
-- Should only see their appointments
SELECT * FROM appointments
WHERE doctor_id IN (
  SELECT id FROM doctors WHERE user_id = auth.uid()
);
```

## Current RLS Policies Summary

### ✅ Enabled Tables

- `user_profiles`
- `doctors`
- `appointments`
- `doctor_slots`
- `notifications`
- `reviews`

### 📋 Policy Rules

#### User Profiles

- **SELECT**: Users can view their own profile
- **UPDATE**: Users can update their own profile
- **INSERT**: Allow user registration (self-signup)

#### Doctors

- **SELECT**:
  - Anyone can view available doctors
  - Doctors can view their own profile
- **UPDATE**: Doctors can update their own profile
- **ALL**: Admins can manage all doctors

#### Appointments

- **SELECT**:
  - Patients see their appointments
  - Doctors see their appointments
- **INSERT**: Patients can create appointments
- **UPDATE**:
  - Patients can update their appointments (cancel)
  - Doctors can update their appointments (confirm/complete)
- **ALL**: Admins can manage all appointments

#### Notifications

- **SELECT**: Users see only their notifications
- **UPDATE**: Users can mark their notifications as read
- **INSERT**: System can create notifications

#### Reviews

- **SELECT**: Anyone can view reviews
- **INSERT**: Patients can create reviews for completed appointments
- **UPDATE**: Patients can update their own reviews

## Troubleshooting

### Issue: "permission denied for table"

**Solution**: RLS is enabled but policies haven't been applied yet

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Re-apply policies from supabase/migrations/20260128_enable_rls_policies.sql
```

### Issue: No data returned after enabling RLS

**Solution**: You're not authenticated or policies are too restrictive

```sql
-- Temporarily disable RLS for testing (NEVER in production)
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Test your query
-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

### Issue: Users can see other users' data

**Solution**: Policies are not correctly filtering by `auth.uid()`

```sql
-- Verify auth.uid() is working
SELECT auth.uid();

-- Check policy definition
SELECT * FROM pg_policies WHERE tablename = 'appointments';
```

## Security Best Practices

1. **✅ DO: Test policies with multiple user roles**
   - Create test accounts for patient, doctor, admin
   - Verify each can only access their data

2. **✅ DO: Use `auth.uid()` for user-specific policies**
   - Always filter by authenticated user ID
   - Never rely on client-side filtering

3. **❌ DON'T: Disable RLS in production**
   - RLS should always be enabled
   - Only disable temporarily for debugging

4. **✅ DO: Review policies regularly**
   - Audit access patterns
   - Update policies as features change

## Next Steps

After applying RLS policies:

1. **Test the application**
   - Sign up as a patient
   - Book an appointment
   - Verify you can't see other patients' data

2. **Monitor database logs**
   - Check for policy violations
   - Review slow queries (policies can impact performance)

3. **Update frontend hooks**
   - Ensure data fetching respects RLS
   - Handle authorization errors gracefully

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [RLS Performance Tips](https://supabase.com/docs/guides/database/postgres/row-level-security#performance)

---

**Status**: Ready to apply
**Last Updated**: 2026-01-28
**Author**: Fixapp Development Team
