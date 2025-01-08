'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function UserMenu() {
  const { user, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link 
        href="/sign-in"
        className="px-4 py-2 rounded bg-white text-black hover:bg-white/90 transition"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          {user.image ? (
            <img 
              src={user.image} 
              alt={user.name} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-white">{user.name[0]}</span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black border border-white/10 backdrop-blur-xl">
          <div className="py-1">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
              onClick={() => {
                // We'll implement this later
                console.log('Sign out clicked');
                setIsOpen(false);
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
