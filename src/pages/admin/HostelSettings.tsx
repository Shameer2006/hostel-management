import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Settings, ChefHat, Bell, Phone } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { supabase, HostelInfo } from '../../lib/supabase';

interface WardenContact {
  name: string;
  phone: string;
  position: string;
}

export const HostelSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);
  const [formData, setFormData] = useState({
    mess_menu: '',
    notice: '',
    warden_contacts: [] as WardenContact[]
  });

  useEffect(() => {
    fetchHostelInfo();
  }, []);

  const fetchHostelInfo = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('hostel_info')
        .select('*')
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setHostelInfo(data);
        setFormData({
          mess_menu: data.mess_menu || '',
          notice: data.notice || '',
          warden_contacts: data.warden_contacts || []
        });
      }
    } catch (error) {
      console.error('Error fetching hostel info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      if (hostelInfo) {
        // Update existing record
        const { error } = await supabase
          .from('hostel_info')
          .update({
            mess_menu: formData.mess_menu,
            notice: formData.notice,
            warden_contacts: formData.warden_contacts
          })
          .eq('date', today);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('hostel_info')
          .insert({
            date: today,
            mess_menu: formData.mess_menu,
            notice: formData.notice,
            warden_contacts: formData.warden_contacts
          });

        if (error) throw error;
      }

      alert('Hostel information updated successfully!');
      fetchHostelInfo();
    } catch (error) {
      console.error('Error updating hostel info:', error);
      alert('Failed to update hostel information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addWardenContact = () => {
    setFormData({
      ...formData,
      warden_contacts: [
        ...formData.warden_contacts,
        { name: '', phone: '', position: '' }
      ]
    });
  };

  const updateWardenContact = (index: number, field: keyof WardenContact, value: string) => {
    const updatedContacts = [...formData.warden_contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setFormData({ ...formData, warden_contacts: updatedContacts });
  };

  const removeWardenContact = (index: number) => {
    const updatedContacts = formData.warden_contacts.filter((_, i) => i !== index);
    setFormData({ ...formData, warden_contacts: updatedContacts });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading hostel settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Hostel Settings</h1>
          <p className="text-gray-600">Manage daily hostel information and settings</p>
        </div>
        <Button
          onClick={handleSave}
          loading={saving}
          className="transform hover:scale-105 transition-transform duration-200"
        >
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Mess Menu */}
      <Card className="animate-slide-up">
        <div className="flex items-center mb-4">
          <ChefHat className="text-orange-500 mr-2" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">Mess Menu</h2>
        </div>
        <textarea
          value={formData.mess_menu}
          onChange={(e) => setFormData({ ...formData, mess_menu: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          rows={6}
          placeholder="Enter today's mess menu..."
        />
      </Card>

      {/* Notice */}
      <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center mb-4">
          <Bell className="text-blue-500 mr-2" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">Notice</h2>
        </div>
        <textarea
          value={formData.notice}
          onChange={(e) => setFormData({ ...formData, notice: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          rows={4}
          placeholder="Enter important notices for students..."
        />
      </Card>

      {/* Warden Contacts */}
      <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Phone className="text-green-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Warden Contacts</h2>
          </div>
          <Button
            onClick={addWardenContact}
            variant="secondary"
            size="sm"
            className="transform hover:scale-105 transition-transform duration-200"
          >
            <Plus size={16} className="mr-1" />
            Add Contact
          </Button>
        </div>

        <div className="space-y-4">
          {formData.warden_contacts.map((contact, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3 animate-slide-up"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Contact {index + 1}</h4>
                <Button
                  onClick={() => removeWardenContact(index)}
                  variant="danger"
                  size="sm"
                  className="transform hover:scale-105 transition-transform duration-200"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => updateWardenContact(index, 'name', e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={contact.position}
                  onChange={(e) => updateWardenContact(index, 'position', e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Position"
                />
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => updateWardenContact(index, 'phone', e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Phone Number"
                />
              </div>
            </div>
          ))}

          {formData.warden_contacts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Phone size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No warden contacts added yet.</p>
              <p className="text-sm">Click "Add Contact" to add warden information.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};