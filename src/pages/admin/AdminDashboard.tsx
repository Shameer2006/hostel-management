import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  MessageSquare, 
  FileText, 
  Calendar,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalStudents: number;
  pendingOutpass: number;
  openComplaints: number;
  todayAttendance: number;
  leaveFormsToday: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    pendingOutpass: 0,
    openComplaints: 0,
    todayAttendance: 0,
    leaveFormsToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Fetch all statistics in parallel
      const [
        studentsResult,
        outpassResult,
        complaintsResult,
        attendanceResult,
        leaveFormsResult
      ] = await Promise.all([
        // Total students
        supabase
          .from('users')
          .select('id', { count: 'exact' })
          .eq('role', 'student'),

        // Pending outpass requests
        supabase
          .from('outpass_requests')
          .select('id', { count: 'exact' })
          .eq('status', 'Pending'),

        // Open complaints
        supabase
          .from('complaints')
          .select('id', { count: 'exact' })
          .eq('status', 'Open'),

        // Today's attendance
        supabase
          .from('attendance')
          .select('id', { count: 'exact' })
          .eq('date', today),

        // Leave forms submitted today
        supabase
          .from('leave_forms')
          .select('id', { count: 'exact' })
          .gte('uploaded_at', today)
          .lt('uploaded_at', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      ]);

      setStats({
        totalStudents: studentsResult.count || 0,
        pendingOutpass: outpassResult.count || 0,
        openComplaints: complaintsResult.count || 0,
        todayAttendance: attendanceResult.count || 0,
        leaveFormsToday: leaveFormsResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending Outpass',
      value: stats.pendingOutpass,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Open Complaints',
      value: stats.openComplaints,
      icon: MessageSquare,
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Today\'s Attendance',
      value: stats.todayAttendance,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Leave Forms Today',
      value: stats.leaveFormsToday,
      icon: FileText,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of hostel management activities</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className={`${stat.bgColor} border-0`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Urgent Actions Required</h2>
          <div className="space-y-3">
            {stats.pendingOutpass > 0 && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="text-yellow-500 mr-3" size={20} />
                <div>
                  <h4 className="font-medium text-gray-900">Pending Outpass Requests</h4>
                  <p className="text-sm text-gray-600">{stats.pendingOutpass} requests awaiting approval</p>
                </div>
              </div>
            )}
            
            {stats.openComplaints > 0 && (
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <MessageSquare className="text-red-500 mr-3" size={20} />
                <div>
                  <h4 className="font-medium text-gray-900">Open Complaints</h4>
                  <p className="text-sm text-gray-600">{stats.openComplaints} complaints need attention</p>
                </div>
              </div>
            )}

            {stats.pendingOutpass === 0 && stats.openComplaints === 0 && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="text-green-500 mr-3" size={20} />
                <div>
                  <h4 className="font-medium text-gray-900">All Caught Up!</h4>
                  <p className="text-sm text-gray-600">No urgent actions required</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Students marked attendance</span>
              <span className="font-semibold text-gray-900">{stats.todayAttendance}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Leave forms submitted</span>
              <span className="font-semibold text-gray-900">{stats.leaveFormsToday}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Attendance rate</span>
              <span className="font-semibold text-gray-900">
                {stats.totalStudents > 0 
                  ? `${Math.round((stats.todayAttendance / stats.totalStudents) * 100)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="text-green-500 mx-auto mb-2" size={32} />
            <h3 className="font-semibold text-gray-900">Database</h3>
            <p className="text-sm text-green-600">Online & Healthy</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="text-green-500 mx-auto mb-2" size={32} />
            <h3 className="font-semibold text-gray-900">File Storage</h3>
            <p className="text-sm text-green-600">Operational</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Calendar className="text-green-500 mx-auto mb-2" size={32} />
            <h3 className="font-semibold text-gray-900">Last Updated</h3>
            <p className="text-sm text-green-600">Just now</p>
          </div>
        </div>
      </Card>
    </div>
  );
};