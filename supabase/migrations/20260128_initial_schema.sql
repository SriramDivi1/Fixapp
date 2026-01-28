-- Migration: Create initial schema for Fixapp
-- Created: 2026-01-28

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE gender AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');