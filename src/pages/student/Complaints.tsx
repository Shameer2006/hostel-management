import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { supabase, Complaint } from '../../lib/supabase';

export const Complaints: React.FC = () => {
  const { user: authUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [complaintText, setComplaintText] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      // First get user ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('username', authUser?.username)
        .single();

      if (userError) throw userError;

      // Then fetch complaints
      const { data, error } = await supabase
        .from('complaints')
        .select('*, users(name, username)')
        .eq('student_id', userData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) return;

    // Check if user is authenticated
    if (!authUser?.username) {
      alert('Please log in to submit a complaint.');
      return;
    }

    setSubmitting(true);

    try {
      // Get user ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('username', authUser.username)
        .single();

      if (userError) {
        console.error('User lookup error:', userError);
        throw new Error('User not found. Please contact support.');
      }

      const { error } = await supabase
        .from('complaints')
        .insert({
          student_id: userData.id,
          complaint_text: complaintText,
          status: 'Open'
        });

      if (error) {
        console.error('Insert error:', error);
        if (error.code === '42501') {
          throw new Error('Permission denied. Please ensure you are logged in properly.');
        }
        throw error;
      }

      setComplaintText('');
      setShowForm(false);
      fetchComplaints();
      alert('Complaint submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting complaint:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });
      
      let errorMessage = 'Failed to submit complaint. Please try again.';
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.code === '42501') {
        errorMessage = 'Permission denied. Please ensure you are logged in properly.';
      }
      
      alert(errorMessage);
    } finally {
      setSubmitting(false);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
          <p className="text-gray-600">Submit and track your hostel-related complaints</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="primary"
        >
          <Plus size={16} className="mr-2" />
          New Complaint
        </Button>
      </div>

      {/* New Complaint Form */}
      {showForm && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit New Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your complaint
              </label>
              <textarea
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Please provide detailed information about your complaint..."
                required
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" loading={submitting}>
                Submit Complaint
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

      {/* Complaints List */}
      <div className="space-y-4">
        {complaints.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Complaints</h3>
              <p className="text-gray-500">You haven't submitted any complaints yet.</p>
            </div>
          </Card>
        ) : (
          complaints.map((complaint) => (
            <Card key={complaint.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(complaint.status)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDateTime(complaint.created_at)}
                </span>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Complaint #{complaint.id.split('-')[0]}</h3>
                <p className="text-gray-700 leading-relaxed">{complaint.complaint_text}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};