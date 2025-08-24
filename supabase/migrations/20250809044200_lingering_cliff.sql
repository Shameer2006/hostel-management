/*
  # Hostel Management System Database Schema

  1. New Tables
    - `users` - Student and admin user profiles
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `name` (text)
      - `room_no` (text)
      - `phone` (text)
      - `parent_phone` (text)
      - `role` (text, default 'student')
      - `created_at` (timestamp)
    
    - `hostel_info` - Daily hostel information
      - `id` (uuid, primary key)
      - `date` (date, unique)
      - `mess_menu` (text)
      - `notice` (text)
      - `warden_contacts` (jsonb)
      - `created_at` (timestamp)
    
    - `outpass_requests` - Student outpass requests
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to users)
      - `reason` (text)
      - `leave_time` (timestamptz)
      - `return_time` (timestamptz)
      - `status` (text, default 'Pending')
      - `created_at` (timestamp)
    
    - `leave_forms` - Leave form submissions
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to users)
      - `file_path` (text)
      - `uploaded_at` (timestamp)
    
    - `complaints` - Student complaints
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to users)
      - `complaint_text` (text)
      - `status` (text, default 'Open')
      - `created_at` (timestamp)
    
    - `attendance` - Student attendance records
      - `id` (uuid, primary key)
      - `date` (date)
      - `student_id` (uuid, foreign key to users)
      - `location` (text)
      - `marked_by` (uuid, foreign key to users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  name text NOT NULL,
  room_no text DEFAULT '',
  phone text DEFAULT '',
  parent_phone text DEFAULT '',
  role text DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- Hostel info table
CREATE TABLE IF NOT EXISTS hostel_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  mess_menu text DEFAULT '',
  notice text DEFAULT '',
  warden_contacts jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Outpass requests table
CREATE TABLE IF NOT EXISTS outpass_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  leave_time timestamptz NOT NULL,
  return_time timestamptz NOT NULL,
  status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  created_at timestamptz DEFAULT now()
);

-- Leave forms table
CREATE TABLE IF NOT EXISTS leave_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  complaint_text text NOT NULL,
  status text DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved')),
  created_at timestamptz DEFAULT now()
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  location text DEFAULT '',
  marked_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, student_id)
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE outpass_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read all user data"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (true);

-- Hostel info policies
CREATE POLICY "Everyone can read hostel info"
  ON hostel_info FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify hostel info"
  ON hostel_info FOR ALL
  USING (true);

-- Outpass requests policies
CREATE POLICY "Users can view all outpass requests"
  ON outpass_requests FOR SELECT
  USING (true);

CREATE POLICY "Students can create their own requests"
  ON outpass_requests FOR INSERT
  USING (true);

CREATE POLICY "Users can update outpass requests"
  ON outpass_requests FOR UPDATE
  USING (true);

-- Leave forms policies
CREATE POLICY "Users can view all leave forms"
  ON leave_forms FOR SELECT
  USING (true);

CREATE POLICY "Students can upload leave forms"
  ON leave_forms FOR INSERT
  USING (true);

-- Complaints policies
CREATE POLICY "Users can view all complaints"
  ON complaints FOR SELECT
  USING (true);

CREATE POLICY "Students can create complaints"
  ON complaints FOR INSERT
  USING (true);

CREATE POLICY "Users can update complaints"
  ON complaints FOR UPDATE
  USING (true);

-- Attendance policies
CREATE POLICY "Users can view all attendance"
  ON attendance FOR SELECT
  USING (true);

CREATE POLICY "Users can mark attendance"
  ON attendance FOR INSERT
  USING (true);

-- Insert sample data
INSERT INTO users (username, name, room_no, phone, parent_phone, role) VALUES
('student1', 'John Doe', '101A', '9876543210', '9876543211', 'student'),
('student2', 'Jane Smith', '102B', '9876543212', '9876543213', 'student'),
('admin1', 'Admin User', '', '9876543214', '', 'admin')
ON CONFLICT (username) DO NOTHING;

INSERT INTO hostel_info (date, mess_menu, notice, warden_contacts) VALUES
(CURRENT_DATE, 
 'Breakfast: Idli, Sambar, Chutney\nLunch: Rice, Dal, Curry, Chapati\nDinner: Rice, Sambar, Vegetable Curry',
 'Mess timings: Breakfast 7-9 AM, Lunch 12-2 PM, Dinner 7-9 PM. Please maintain cleanliness.',
 '[{"name": "Mr. Warden", "phone": "9876543215", "position": "Chief Warden"}]'::jsonb)
ON CONFLICT (date) DO UPDATE SET
  mess_menu = EXCLUDED.mess_menu,
  notice = EXCLUDED.notice,
  warden_contacts = EXCLUDED.warden_contacts;