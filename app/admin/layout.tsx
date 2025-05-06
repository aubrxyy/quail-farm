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
      <div className="w-60 fixed top-0 left-0 h-full text-white">
        <AdminNavbar />
      </div>

      <div className="flex-1 ml-60">
        <AdminHeader />
        <main className="bg-bright-egg-white text-black">{children}</main>
      </div>
    </div>
  );
}