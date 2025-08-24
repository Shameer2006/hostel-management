import React, { useState, useEffect } from 'react';
import { FileText, Eye, Download, User, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { supabase, LeaveForm } from '../../lib/supabase';

export const LeaveFormsAdmin: React.FC = () => {
  const [leaveForms, setLeaveForms] = useState<LeaveForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveForms();
  }, []);

  const fetchLeaveForms = async () => {
    try {
      const { data, error } = await supabase
        .from('leave_forms')
        .select('*, users(name, username, room_no)')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setLeaveForms(data || []);
    } catch (error) {
      console.error('Error fetching leave forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewForm = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('leave-submissions')
        .createSignedUrl(filePath, 3600);

      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Error viewing form:', error);
      alert('Failed to open file. Please try again.');
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading leave forms..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Leave Forms</h1>
        <p className="text-gray-600">Review submitted leave application forms</p>
      </div>

      <div className="space-y-4">
        {leaveForms.length === 0 ? (
          <Card className="animate-slide-up">
            <div className="text-center py-8">
              <FileText size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Leave Forms</h3>
              <p className="text-gray-500">No leave forms have been submitted yet.</p>
            </div>
          </Card>
        ) : (
          leaveForms.map((form, index) => (
            <Card 
              key={form.id} 
              className="hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FileText size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <User size={16} className="text-gray-400" />
                      <h3 className="font-semibold text-gray-900">{form.users?.name}</h3>
                      <span className="text-sm text-gray-500">({form.users?.username})</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Room: {form.users?.room_no}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      <span>Uploaded on {formatDateTime(form.uploaded_at)}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleViewForm(form.file_path)}
                  variant="secondary"
                  className="transform hover:scale-105 transition-transform duration-200"
                >
                  <Eye size={16} className="mr-2" />
                  View Form
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};