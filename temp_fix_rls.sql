-- TEMPORARY FIX: Disable RLS on tables causing issues
-- Run this in your Supabase SQL Editor to immediately fix the authentication issues

-- Disable RLS on complaints table
ALTER TABLE complaints DISABLE ROW LEVEL SECURITY;

-- Disable RLS on attendance table (for the attendance feature)
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;

-- Disable RLS on outpass_requests table
ALTER TABLE outpass_requests DISABLE ROW LEVEL SECURITY;

-- Disable RLS on leave_forms table
ALTER TABLE leave_forms DISABLE ROW LEVEL SECURITY;

-- Note: This is a temporary fix. For production, you should implement proper RLS policies
-- that work with your custom authentication system.