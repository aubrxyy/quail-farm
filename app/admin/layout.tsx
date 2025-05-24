'use client';
import React from 'react';
import AdminHeader from './Header';
import AdminNavbar from './Navbar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-bright-egg-white">
      {/* Fixed Sidebar */}
      <div className="w-60 fixed top-0 left-0 h-full text-white">
        <AdminNavbar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-60">
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 left-60 z-10 bg-white shadow-sm">
          <AdminHeader />
        </div>
        
        {/* Main Content with proper spacing */}
        <main className="bg-bright-egg-white text-black pt-20 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}