import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ title, showBack = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleBack = () => {
    if (location.pathname === '/dashboard' || location.pathname === '/admin/dashboard') {
      return;
    }
    navigate(-1);
  };

  const isHomePage = location.pathname === '/dashboard' || location.pathname === '/admin/dashboard';

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          {showBack && !isHomePage && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 hidden sm:block">
            {user?.username}
          </span>
          <button
            onClick={logout}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};