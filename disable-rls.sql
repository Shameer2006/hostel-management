-- Run this SQL in your Supabase dashboard SQL editor to disable RLS for development
-- Go to: https://supabase.com/dashboard/project/hckqoegnxmxsybmltzkw/sql

-- Disable RLS on all tables for development
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE outpass_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE leave_forms DISABLE ROW LEVEL SECURITY;
ALTER TABLE complaints DISABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_info DISABLE ROW LEVEL SECURITY;

-- Note: In production, you should implement proper authentication
-- and re-enable RLS with appropriate policies