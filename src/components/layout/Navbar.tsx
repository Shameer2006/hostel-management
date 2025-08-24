import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Home, User, FileText, MessageSquare, Clock, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  const studentLinks = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/outpass', icon: Clock, label: 'Outpass' },
    { path: '/leave-form', icon: FileText, label: 'Leave Form' },
    { path: '/complaints', icon: MessageSquare, label: 'Complaints' },
    { path: '/attendance', icon: Clock, label: 'Attendance' },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/admin/outpass', icon: Clock, label: 'Outpass Requests' },
    { path: '/admin/leave-forms', icon: FileText, label: 'Leave Forms' },
    { path: '/admin/complaints', icon: MessageSquare, label: 'Complaints' },
    { path: '/admin/attendance', icon: Clock, label: 'Attendance' },
    { path: '/admin/settings', icon: Settings, label: 'Hostel Info' },
  ];

  const links = user.role === 'admin' ? adminLinks : studentLinks;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">
              Hostel Management
            </Link>
            <div className="hidden md:flex space-x-6">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      isActive(link.path)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 capitalize">
              {user.username} ({user.role})
            </span>
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-all duration-200 transform hover:scale-105"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};