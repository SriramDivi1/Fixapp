/**
 * AUTO-GENERATED SUPABASE TYPES
 * 
 * This file will be auto-generated from your Supabase schema.
 * 
 * To generate types, run:
 * ```bash
 * supabase login
 * supabase link --project-ref <your-project-ref>
 * npm run types
 * ```
 * 
 * Or manually:
 * ```bash
 * supabase gen types typescript --linked > src/types/supabase.ts
 * ```
 * 
 * NOTE: This placeholder will be replaced when you run the command above.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Tables will be auto-generated
      [key: string]: any
    }
    Views: {
      [key: string]: any
    }
    Functions: {
      [key: string]: any
    }
    Enums: {
      [key: string]: any
    }
  }
}
