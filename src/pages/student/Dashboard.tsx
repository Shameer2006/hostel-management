import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  FileText, 
  MessageSquare, 
  User, 
  CalendarDays,
  Phone,
  ChefHat,
  Bell
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { supabase, HostelInfo } from '../../lib/supabase';

export const Dashboard: React.FC = () => {
  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);
  const [loading, setLoading] = useState(true);

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

      setHostelInfo(data);
    } catch (error) {
      console.error('Error fetching hostel info:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Apply for Outpass',
      description: 'Request permission to leave hostel',
      icon: Clock,
      link: '/outpass',
      color: 'bg-blue-500'
    },
    {
      title: 'Leave Form',
      description: 'Download template or submit form',
      icon: FileText,
      link: '/leave-form',
      color: 'bg-green-500'
    },
    {
      title: 'Submit Complaint',
      description: 'Report hostel-related issues',
      icon: MessageSquare,
      link: '/complaints',
      color: 'bg-orange-500'
    },
    {
      title: 'Mark Attendance',
      description: 'Check-in your daily attendance',
      icon: CalendarDays,
      link: '/attendance',
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8 animate-fade-in">
      <div className="md:hidden">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome back!</p>
      </div>
      <div className="hidden md:block">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 animate-slide-up">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              to={action.link}
              className="group hover:scale-105 transition-all duration-300 hover-lift"
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300 p-3 md:p-6">
                <div className={`inline-flex p-2 md:p-3 rounded-full ${action.color} mb-2 md:mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className="text-white md:w-6 md:h-6" />
                </div>
                <h3 className="font-medium md:font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">{action.title}</h3>
                <p className="text-xs md:text-sm text-gray-600 hidden md:block">{action.description}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Today's Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
        {/* Mess Menu */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <div className="flex items-center mb-4">
            <ChefHat className="text-orange-500 mr-2" size={20} />
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Today's Menu</h2>
          </div>
          {hostelInfo?.mess_menu ? (
            <div className="whitespace-pre-line text-gray-700">
              {hostelInfo.mess_menu}
            </div>
          ) : (
            <p className="text-gray-500">No menu available for today</p>
          )}
        </Card>

        {/* Notice Board */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <div className="flex items-center mb-4">
            <Bell className="text-blue-500 mr-2" size={20} />
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Notice</h2>
          </div>
          {hostelInfo?.notice ? (
            <div className="whitespace-pre-line text-gray-700">
              {hostelInfo.notice}
            </div>
          ) : (
            <p className="text-gray-500">No notices for today</p>
          )}
        </Card>
      </div>

      {/* Warden Contacts */}
      {hostelInfo?.warden_contacts && hostelInfo.warden_contacts.length > 0 && (
        <Card className="animate-slide-up hover:shadow-lg transition-all duration-300" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center mb-4">
            <Phone className="text-green-500 mr-2" size={20} />
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Warden Contacts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {hostelInfo.warden_contacts.map((contact, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
                <h3 className="font-medium text-gray-900">{contact.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{contact.position}</p>
                <a 
                  href={`tel:${contact.phone}`}
                  className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                >
                  {contact.phone}
                </a>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Profile Link */}
      <Card className="animate-slide-up hover:shadow-lg transition-all duration-300" style={{ animationDelay: '600ms' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="text-blue-500 mr-3" size={20} />
            <div>
              <h3 className="font-semibold text-gray-900">Profile Information</h3>
              <p className="text-sm text-gray-600">Update your contact details</p>
            </div>
          </div>
          <Link
            to="/profile"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            View Profile →
          </Link>
        </div>
      </Card>
    </div>
  );
};