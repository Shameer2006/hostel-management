import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { supabase, Attendance as AttendanceType } from '../../lib/supabase';

export const Attendance: React.FC = () => {
  const { user: authUser } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [todayMarked, setTodayMarked] = useState(false);

  useEffect(() => {
    if (authUser?.username) {
      fetchAttendanceRecords();
      checkTodayAttendance();
    }
  }, [authUser]);

  const fetchAttendanceRecords = async () => {
    if (!authUser?.username) return;
    
    try {
      // First get user ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('username', authUser.username)
        .single();

      if (userError) {
        console.error('User lookup error:', userError);
        return;
      }

      // Then fetch attendance records for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data, error } = await supabase
        .from('attendance')
        .select('id, date, student_id, location, created_at')
        .eq('student_id', userData.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) {
        console.error('Attendance fetch error:', error);
        return;
      }
      
      setAttendanceRecords(data || []);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkTodayAttendance = async () => {
    if (!authUser?.username) return;
    
    try {
      // First get user ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('username', authUser.username)
        .single();

      if (userError) {
        console.error('User lookup error:', userError);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('attendance')
        .select('id')
        .eq('student_id', userData.id)
        .eq('date', today)
        .maybeSingle();

      if (error) {
        console.error('Today attendance check error:', error);
        return;
      }

      setTodayMarked(!!data);
    } catch (error) {
      console.error('Error checking today attendance:', error);
    }
  };

  const getCurrentLocation = (): Promise<{lat: number, lng: number}> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const markAttendance = async () => {
    setMarking(true);

    try {
      // Get current location
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

      // Get user ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('username', authUser?.username)
        .single();

      if (userError) {
        console.error('User lookup error:', userError);
        throw new Error('Failed to find user');
      }

      const today = new Date().toISOString().split('T')[0];
      const locationString = `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`;

      const { data, error } = await supabase
        .from('attendance')
        .insert({
          date: today,
          student_id: userData.id,
          location: locationString,
          marked_by: userData.id
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          alert('You have already marked attendance for today!');
        } else {
          throw error;
        }
      } else {
        setTodayMarked(true);
        fetchAttendanceRecords();
        alert('Attendance marked successfully!');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      if (error instanceof GeolocationPositionError) {
        alert('Unable to get your location. Please enable location services and try again.');
      } else {
        alert('Failed to mark attendance. Please try again.');
      }
    } finally {
      setMarking(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading attendance records..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Attendance</h1>
        <p className="text-gray-600">Mark your daily attendance and view your attendance history</p>
      </div>

      {/* Mark Attendance */}
      <Card>
        <div className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            todayMarked ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {todayMarked ? (
              <CheckCircle size={32} className="text-green-600" />
            ) : (
              <Clock size={32} className="text-blue-600" />
            )}
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {todayMarked ? 'Attendance Marked' : 'Mark Today\'s Attendance'}
          </h2>
          
          {todayMarked ? (
            <p className="text-green-600 mb-4">You have already marked attendance for today!</p>
          ) : (
            <p className="text-gray-600 mb-4">
              Click the button below to mark your attendance using your current location
            </p>
          )}
          
          {!todayMarked && (
            <Button
              onClick={markAttendance}
              loading={marking}
              variant="primary"
              size="lg"
            >
              <MapPin size={20} className="mr-2" />
              {marking ? 'Marking Attendance...' : 'Mark Attendance'}
            </Button>
          )}
        </div>
      </Card>

      {/* Attendance History */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance History (Last 30 Days)</h2>
        
        {attendanceRecords.length === 0 ? (
          <div className="text-center py-8">
            <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendance Records</h3>
            <p className="text-gray-500">You haven't marked any attendance in the last 30 days.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attendanceRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {formatDate(record.date)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Marked at {formatDateTime(record.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={14} className="mr-1" />
                    <span>Location recorded</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Location Info */}
      {location && (
        <Card padding="sm">
          <div className="flex items-center text-sm text-gray-600">
            <AlertCircle size={16} className="mr-2 text-blue-500" />
            <span>
              Your location is being used for attendance verification. 
              Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};