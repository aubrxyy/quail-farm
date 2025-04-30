'use client';

import { useEffect } from 'react';

export default function Logout() {
  useEffect(() => {
    const logout = async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    };

    logout();
  }, []);

  return <p>Logging out...</p>;
}