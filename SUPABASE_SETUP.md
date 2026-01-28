# Supabase Local Development Setup Instructions

Follow these steps to set up Supabase for local development:

## Prerequisites

- Docker Desktop installed and running
- Node.js 18+ installed
- npm or pnpm package manager

## Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

## Step 2: Login to Supabase

```bash
supabase login
```

This will open a browser window for authentication.

## Step 3: Link Your Project

```bash
cd /Volumes/Sriram\ Naidu/Code/Fixapp
supabase https://euumriuejbczhkfsffye.supabase.co
```

**To find your project ref:**

1. Go to https://supabase.com/dashboard
2. Select your Fixapp project
3. The project ref is in the URL: `https://supabase.com/dashboard/project/euumriuejbczhkfsffye`

## Step 4: Pull Remote Schema (Optional)

If you want to pull your existing schema from Supabase:

```bash
supabase db pull
```

## Step 5: Generate TypeScript Types

Add this script to `frontend/package.json`:

```json
{
  "scripts": {
    "types": "supabase gen types typescript --linked > src/types/supabase.ts"
  }
}
```

Then run:

```bash
cd frontend
npm run types
```

This will auto-generate TypeScript types from your database schema.

## Step 6: Start Local Supabase (Optional)

If you want to run Supabase locally:

```bash
supabase init  # Run once to initialize
supabase start # Start local Supabase stack
```

This starts:

- PostgreSQL database
- Auth server
- Storage server
- Realtime server

Local URLs will be displayed. Update your `.env.local` to use them.

## Step 7: Apply Migrations

```bash
supabase db push
```

## Environment Variables

### Production (.env)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dW1yaXVlamJjemhrZnNmZnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MjgxOTUsImV4cCI6MjA4MTAwNDE5NX0.2wmA96LDRMOjR_O6ucsKdUPK1P3rGCrxqjE7Eq1QYak
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your-razorpay-key
```

### Local (.env.local)

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dW1yaXVlamJjemhrZnNmZnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MjgxOTUsImV4cCI6MjA4MTAwNDE5NX0.2wmA96LDRMOjR_O6ucsKdUPK1P3rGCrxqjE7Eq1QYak
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=test-key
```

## Common Commands

```bash
# Generate types
npm run types

# View local database
supabase db studio

# Reset local database
supabase db reset

# Stop local Supabase
supabase stop

# View logs
supabase status
```

## Next Steps

1. ✅ Generate TypeScript types: `npm run types`
2. Run the frontend: `npm run dev`
3. Test authentication with the new `useAuth` hook
4. Verify protected routes are working

## Troubleshooting

**Types not generating?**

- Ensure you're linked to the correct project
- Check that your database has tables created
- Verify Supabase CLI is updated: `npm update -g supabase`

**Local Supabase won't start?**

- Ensure Docker Desktop is running
- Check ports 54321-54329 are not in use
- Try `supabase stop` then `supabase start`

## Documentation

- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Local Development](https://supabase.com/docs/guides/cli/local-development)
- [Type Generation](https://supabase.com/docs/guides/api/generating-types)
