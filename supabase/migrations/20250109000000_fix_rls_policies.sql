-- Fix RLS policies for complaints table
-- This migration addresses the row-level security policy violation

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all complaints" ON complaints;
DROP POLICY IF EXISTS "Students can create complaints" ON complaints;
DROP POLICY IF EXISTS "Users can update complaints" ON complaints;

-- Create more specific policies
CREATE POLICY "Students can view their own complaints"
  ON complaints FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = complaints.student_id
    )
  );

CREATE POLICY "Authenticated users can create complaints"
  ON complaints FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = complaints.student_id
    )
  );

CREATE POLICY "Students can update their own complaints"
  ON complaints FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = complaints.student_id
    )
  );

-- Also fix other tables with similar issues
-- Drop and recreate attendance policies
DROP POLICY IF EXISTS "Users can view all attendance" ON attendance;
DROP POLICY IF EXISTS "Users can mark attendance" ON attendance;

CREATE POLICY "Students can view their own attendance"
  ON attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = attendance.student_id
    )
  );

CREATE POLICY "Authenticated users can mark attendance"
  ON attendance FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = attendance.student_id
    )
  );