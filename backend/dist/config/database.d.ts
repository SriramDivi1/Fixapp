import Redis from 'ioredis';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
export declare const redis: Redis;
export declare const testConnections: () => Promise<boolean>;
declare const _default: {
    supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
    redis: Redis;
    testConnections: () => Promise<boolean>;
};
export default _default;
//# sourceMappingURL=database.d.ts.map