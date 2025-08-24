import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Eye, User, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { supabase, OutpassRequest } from '../../lib/supabase';

export const OutpassRequests: React.FC = () => {
  const [requests, setRequests] = useState<OutpassRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('outpass_requests')
        .select('*, users(name, username, room_no)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching outpass requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: 'Approved' | 'Rejected') => {
    setUpdating(requestId);
    try {
      const { error } = await supabase
        .from('outpass_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;
      
      fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'Rejected':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-yellow-500" size={20} />;
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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Outpass Requests</h1>
        <p className="text-gray-600">Review and manage student outpass requests</p>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card className="animate-slide-up">
            <div className="text-center py-8">
              <Clock size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Outpass Requests</h3>
              <p className="text-gray-500">No outpass requests have been submitted yet.</p>
            </div>
          </Card>
        ) : (
          requests.map((request, index) => (
            <Card 
              key={request.id} 
              className="hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getStatusIcon(request.status)}
                    <span className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{request.users?.name}</p>
                        <p className="text-sm text-gray-500">Room: {request.users?.room_no}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Submitted</p>
                        <p className="text-sm text-gray-500">{formatDateTime(request.created_at)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Reason:</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{request.reason}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                      <Calendar size={16} className="text-blue-500" />
                      <div>
                        <p className="font-medium text-blue-900">Leave Time</p>
                        <p className="text-blue-700">{formatDateTime(request.leave_time)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                      <Calendar size={16} className="text-green-500" />
                      <div>
                        <p className="font-medium text-green-900">Return Time</p>
                        <p className="text-green-700">{formatDateTime(request.return_time)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {request.status === 'Pending' && (
                <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-3">
                  <Button
                    onClick={() => updateRequestStatus(request.id, 'Approved')}
                    loading={updating === request.id}
                    variant="success"
                    className="transform hover:scale-105 transition-transform duration-200"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => updateRequestStatus(request.id, 'Rejected')}
                    loading={updating === request.id}
                    variant="danger"
                    className="transform hover:scale-105 transition-transform duration-200"
                  >
                    <XCircle size={16} className="mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};