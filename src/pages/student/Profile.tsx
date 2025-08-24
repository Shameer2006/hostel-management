import React, { useState, useEffect } from 'react';
import { User, Phone, Home, Save, Edit } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { supabase, User as UserType } from '../../lib/supabase';

export const Profile: React.FC = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    room_no: '',
    phone: '',
    parent_phone: ''
  });

  useEffect(() => {
    if (authUser) {
      fetchUserProfile();
    }
  }, [authUser]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', authUser?.username)
        .single();

      if (error) throw error;

      setUser(data);
      setFormData({
        name: data.name || '',
        room_no: data.room_no || '',
        phone: data.phone || '',
        parent_phone: data.parent_phone || ''
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update(formData)
        .eq('username', authUser?.username);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, ...formData } : null);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        room_no: user.room_no || '',
        phone: user.phone || '',
        parent_phone: user.parent_phone || ''
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        {!editing ? (
          <Button onClick={() => setEditing(true)} variant="secondary" className="transform hover:scale-105 transition-transform duration-200">
            <Edit size={16} className="mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="space-x-2">
            <Button onClick={handleCancel} variant="secondary" className="transform hover:scale-105 transition-transform duration-200">
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving} className="transform hover:scale-105 transition-transform duration-200">
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Card className="animate-slide-up hover:shadow-lg transition-all duration-300">
        <div className="space-y-6">
          {/* Username (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <User size={16} className="text-gray-400 mr-3" />
              <span className="text-gray-900">{user?.username}</span>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
              />
            ) : (
              <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <User size={16} className="text-gray-400 mr-3" />
                <span className="text-gray-900">{user?.name || 'Not provided'}</span>
              </div>
            )}
          </div>

          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Number
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.room_no}
                onChange={(e) => setFormData({ ...formData, room_no: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your room number"
              />
            ) : (
              <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <Home size={16} className="text-gray-400 mr-3" />
                <span className="text-gray-900">{user?.room_no || 'Not provided'}</span>
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            {editing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your phone number"
              />
            ) : (
              <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <Phone size={16} className="text-gray-400 mr-3" />
                <span className="text-gray-900">{user?.phone || 'Not provided'}</span>
              </div>
            )}
          </div>

          {/* Parent Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent's Phone Number
            </label>
            {editing ? (
              <input
                type="tel"
                value={formData.parent_phone}
                onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter parent's phone number"
              />
            ) : (
              <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <Phone size={16} className="text-gray-400 mr-3" />
                <span className="text-gray-900">{user?.parent_phone || 'Not provided'}</span>
              </div>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};