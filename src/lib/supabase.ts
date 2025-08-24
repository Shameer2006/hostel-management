import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Add this to your supabase client configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});



// Database types
export interface User {
  id: string;
  username: string;
  name: string;
  room_no: string;
  phone: string;
  parent_phone: string;
  role: 'student' | 'admin';
  created_at: string;
}

export interface HostelInfo {
  id: string;
  date: string;
  mess_menu: string;
  notice: string;
  warden_contacts: Array<{
    name: string;
    phone: string;
    position: string;
  }>;
  created_at: string;
}

export interface OutpassRequest {
  id: string;
  student_id: string;
  reason: string;
  leave_time: string;
  return_time: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
  users?: User;
}

export interface LeaveForm {
  id: string;
  student_id: string;
  file_path: string;
  uploaded_at: string;
  users?: User;
}

export interface Complaint {
  id: string;
  student_id: string;
  complaint_text: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  created_at: string;
  users?: User;
}

export interface Attendance {
  id: string;
  date: string;
  student_id: string;
  location: string;
  marked_by: string;
  created_at: string;
  users?: User;
}