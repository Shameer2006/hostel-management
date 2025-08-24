import React, { useState, useEffect } from 'react';
import { Clock, Plus, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { supabase, OutpassRequest, User } from '../../lib/supabase';

export const OutpassApply: React.FC = () => {
  const { user: authUser } = useAuth();
  const [requests, setRequests] = useState<OutpassRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    leave_time: '',
    return_time: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // First get user ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('username', authUser?.username)
        .single();

      if (userError) throw userError;

      // Then fetch outpass requests
      const { data, error } = await supabase
        .from('outpass_requests')
        .select('*, users(name, username)')
        .eq('student_id', userData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching outpass requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Get user ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('username', authUser?.username)
        .single();

      if (userError) throw userError;

      const { error } = await supabase
        .from('outpass_requests')
        .insert({
          student_id: userData.id,
          reason: formData.reason,
          leave_time: formData.leave_time,
          return_time: formData.return_time,
          status: 'Pending'
        });

      if (error) throw error;

      setFormData({ reason: '', leave_time: '', return_time: '' });
      setShowForm(false);
      fetchRequests();
    } catch (error) {
      console.error('Error submitting outpass request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'Rejected':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <AlertCircle className="text-yellow-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading outpass requests..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Outpass Requests</h1>
          <p className="text-gray-600">Apply for permission to leave the hostel</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="primary"
        >
          <Plus size={16} className="mr-2" />
          New Request
        </Button>
      </div>

      {/* New Request Form */}
      {showForm && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Outpass Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Leave
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Please provide a reason for your outpass request..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.leave_time}
                  onChange={(e) => setFormData({ ...formData, leave_time: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.return_time}
                  onChange={(e) => setFormData({ ...formData, return_time: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" loading={submitting}>
                Submit Request
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <Clock size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Outpass Requests</h3>
              <p className="text-gray-500">You haven't submitted any outpass requests yet.</p>
            </div>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(request.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">Outpass Request</h3>
                  <p className="text-gray-700 mb-3">{request.reason}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      <span>Leave: {formatDateTime(request.leave_time)}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      <span>Return: {formatDateTime(request.return_time)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                Submitted on {formatDateTime(request.created_at)}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};