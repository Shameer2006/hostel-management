import React, { useState, useEffect } from 'react';
import { MessageSquare, User, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { supabase, Complaint } from '../../lib/supabase';

export const ComplaintsAdmin: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*, users(name, username, room_no)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (complaintId: string, status: 'Open' | 'In Progress' | 'Resolved') => {
    setUpdating(complaintId);
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status })
        .eq('id', complaintId);

      if (error) throw error;
      
      fetchComplaints();
    } catch (error) {
      console.error('Error updating complaint status:', error);
      alert('Failed to update complaint status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'In Progress':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <AlertCircle className="text-red-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading complaints..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Complaints Management</h1>
        <p className="text-gray-600">Review and manage student complaints</p>
      </div>

      <div className="space-y-4">
        {complaints.length === 0 ? (
          <Card className="animate-slide-up">
            <div className="text-center py-8">
              <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Complaints</h3>
              <p className="text-gray-500">No complaints have been submitted yet.</p>
            </div>
          </Card>
        ) : (
          complaints.map((complaint, index) => (
            <Card 
              key={complaint.id} 
              className="hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(complaint.status)}
                    <span className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDateTime(complaint.created_at)}
                  </span>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-900">{complaint.users?.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({complaint.users?.username})</span>
                    <span className="text-sm text-gray-500 ml-2">Room: {complaint.users?.room_no}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Complaint Details:</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
                    {complaint.complaint_text}
                  </p>
                </div>

                <div className="flex space-x-2 pt-2">
                  {complaint.status !== 'In Progress' && (
                    <Button
                      onClick={() => updateComplaintStatus(complaint.id, 'In Progress')}
                      loading={updating === complaint.id}
                      variant="secondary"
                      size="sm"
                      className="transform hover:scale-105 transition-transform duration-200"
                    >
                      <Clock size={14} className="mr-1" />
                      Mark In Progress
                    </Button>
                  )}
                  {complaint.status !== 'Resolved' && (
                    <Button
                      onClick={() => updateComplaintStatus(complaint.id, 'Resolved')}
                      loading={updating === complaint.id}
                      variant="success"
                      size="sm"
                      className="transform hover:scale-105 transition-transform duration-200"
                    >
                      <CheckCircle size={14} className="mr-1" />
                      Mark Resolved
                    </Button>
                  )}
                  {complaint.status !== 'Open' && (
                    <Button
                      onClick={() => updateComplaintStatus(complaint.id, 'Open')}
                      loading={updating === complaint.id}
                      variant="danger"
                      size="sm"
                      className="transform hover:scale-105 transition-transform duration-200"
                    >
                      <AlertCircle size={14} className="mr-1" />
                      Reopen
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};