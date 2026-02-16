'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { appAreas, NavLink } from '../lib/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || '';
    setUsername(storedUsername);
  }, []);

  const activeArea = appAreas.find((area) =>
    pathname.startsWith(area.link)
  );

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-50-900">
      {/* Header */}
      <header className="bg-surface-900 text-white flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="font-bold text-lg">ICP Regression Manager</span>
        </div>

        <nav className="flex gap-1">
          {appAreas.map((area) => (
            <Link
              key={area.link}
              href={area.subRoutes ? area.subRoutes[0].link : area.link}
              className={`px-4 py-2 rounded transition-colors ${
                pathname.startsWith(area.link)
                  ? 'bg-primary-500 text-white'
                  : 'hover:bg-surface-700 text-surface-200'
              }`}
            >
              {area.title}
            </Link>
          ))}
        </nav>

        <div className="relative group">
          <button className="flex items-center gap-1 px-3 py-2 rounded hover:bg-surface-700 text-surface-200">
            {username || 'User'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="absolute right-0 mt-1 w-32 bg-surface-800 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-surface-200 hover:bg-surface-700 rounded"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Sub-navigation */}
      {activeArea?.subRoutes && (
        <nav className="bg-surface-800 px-6 py-2 flex gap-1">
          {activeArea.subRoutes.map((sub) => (
            <Link
              key={sub.link}
              href={sub.link}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                pathname === sub.link
                  ? 'bg-primary-500 text-white'
                  : 'text-surface-300 hover:bg-surface-700'
              }`}
            >
              {sub.title}
            </Link>
          ))}
        </nav>
      )}

      {/* Main content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
