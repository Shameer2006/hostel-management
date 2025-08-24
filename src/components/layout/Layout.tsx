import React from 'react';
import { Navbar } from './Navbar';
import { MobileHeader } from './MobileHeader';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, title = 'Hostel Management', showBack = true }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navbar />
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader title={title} showBack={showBack} />
      </div>
      
      <main className="px-4 py-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
};