import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Redis configuration
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null
});

// Database connection test
export const testConnections = async () => {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connection successful');

    // Test Redis connection
    await redis.ping();
    console.log('✅ Redis connection successful');

    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Gracefully shutting down database connections...');
  redis.disconnect();
  process.exit(0);
});

export default {
  supabase,
  redis,
  testConnections
};