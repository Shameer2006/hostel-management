import React, { useState, useEffect } from 'react';
import { FileText, Download, Upload, Eye } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { supabase, LeaveForm as LeaveFormType } from '../../lib/supabase';

export const LeaveForm: React.FC = () => {
  const { user: authUser } = useAuth();
  const [submissions, setSubmissions] = useState<LeaveFormType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      // First get user ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('username', authUser?.username)
        .single();

      if (userError) throw userError;

      // Then fetch leave forms
      const { data, error } = await supabase
        .from('leave_forms')
        .select('*, users(name, username)')
        .eq('student_id', userData.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching leave forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      // In a real application, you would have a template file in Supabase Storage
      // For now, we'll create a sample PDF content
      const sampleContent = `
HOSTEL LEAVE APPLICATION FORM

Student Name: ___________________
Room Number: ___________________
Phone: ________________________
Parent Phone: __________________

Reason for Leave:
_________________________________
_________________________________
_________________________________

Leave Duration:
From: __________________________
To: ____________________________

Emergency Contact:
_________________________________

Student Signature: _______________
Date: __________________________

Warden Approval: ________________
Date: __________________________
      `.trim();

      // Create and download a text file (in real scenario, this would be a PDF)
      const blob = new Blob([sampleContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'leave_application_template.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template. Please try again.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Check file type (PDF, PNG, JPEG)
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, PNG, or JPEG file only');
      return;
    }

    if (!authUser?.username) {
      alert('Please log in to upload files.');
      return;
    }

    setUploading(true);

    try {
      // Get user ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('username', authUser.username)
        .single();

      if (userError) throw new Error('User not found.');

      const fileName = `${userData.id}_${Date.now()}_${file.name}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('leave-forms')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('leave-forms')
        .getPublicUrl(fileName);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('leave_forms')
        .insert({
          student_id: userData.id,
          file_path: publicUrlData.publicUrl
        });

      if (dbError) throw dbError;

      alert('Leave form submitted successfully!');
      fetchSubmissions();
      event.target.value = '';
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(error?.message || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleViewSubmission = (filePath: string) => {
    window.open(filePath, '_blank');
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Leave Form</h1>
        <p className="text-gray-600">Download template and submit your completed leave application</p>
      </div>

      {/* Template Download & Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Download size={24} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Download Template</h3>
            <p className="text-gray-600 mb-4">Download the official leave application form template</p>
            <Button onClick={handleDownloadTemplate} variant="primary">
              <Download size={16} className="mr-2" />
              Download Template
            </Button>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Upload size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Completed Form</h3>
            <p className="text-gray-600 mb-4">Submit your completed and signed leave application (PDF, PNG, or JPEG, max 5MB)</p>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              <label htmlFor="file-upload">
                <Button
                  as="span"
                  variant="success"
                  loading={uploading}
                  className="cursor-pointer"
                >
                  <Upload size={16} className="mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Form'}
                </Button>
              </label>
            </div>
          </div>
        </Card>
      </div>

      {/* Submissions History */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Submissions</h2>
        
        {submissions.length === 0 ? (
          <div className="text-center py-8">
            <FileText size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Submissions Yet</h3>
            <p className="text-gray-500">You haven't uploaded any leave forms yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText size={20} className="text-blue-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">Leave Application</h4>
                    <p className="text-sm text-gray-500">
                      Uploaded on {formatDateTime(submission.uploaded_at)}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleViewSubmission(submission.file_path)}
                  variant="secondary"
                  size="sm"
                >
                  <Eye size={16} className="mr-1" />
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};