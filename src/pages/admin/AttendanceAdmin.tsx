import React, { useState, useEffect } from 'react';
import { Calendar, User, MapPin, CheckCircle, Filter } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { supabase, Attendance } from '../../lib/supabase';

export const AttendanceAdmin: React.FC = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    fetchAttendance();
    fetchTotalStudents();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*, users!student_id(name, username, room_no)')
        .eq('date', selectedDate)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttendance(data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalStudents = async () => {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
        .eq('role', 'student');

      if (error) throw error;
      setTotalStudents(count || 0);
    } catch (error) {
      console.error('Error fetching total students:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const attendanceRate = totalStudents > 0 ? Math.round((attendance.length / totalStudents) * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading attendance records..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Attendance Management</h1>
          <p className="text-gray-600">Monitor and track student attendance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Filter size={16} className="text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-200 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Present Today</p>
              <p className="text-2xl font-bold text-blue-900">{attendance.length}</p>
            </div>
            <CheckCircle className="text-blue-500" size={32} />
          </div>
        </Card>

        <Card className="bg-gray-50 border-gray-200 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
            <User className="text-gray-500" size={32} />
          </div>
        </Card>

        <Card className="bg-green-50 border-green-200 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Attendance Rate</p>
              <p className="text-2xl font-bold text-green-900">{attendanceRate}%</p>
            </div>
            <div className="text-green-500 text-2xl font-bold">%</div>
          </div>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Attendance for {formatDate(selectedDate)}
        </h2>
        
        {attendance.length === 0 ? (
          <div className="text-center py-8">
            <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendance Records</h3>
            <p className="text-gray-500">No students have marked attendance for this date.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attendance.map((record, index) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{record.users?.name}</h4>
                      <span className="text-sm text-gray-500">({record.users?.username})</span>
                    </div>
                    <p className="text-sm text-gray-600">Room: {record.users?.room_no}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(record.created_at)}
                  </p>
                  {record.location && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin size={14} className="mr-1" />
                      <span>Location recorded</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};