'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserMenu from './UserMenu';

export default function ClientNav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Malik Arbab
        </Link>

        <div className="flex items-center space-x-8">
          <Link
            href="/portfolio"
            className={`hover:text-white transition-colors ${
              pathname === '/portfolio' ? 'text-white' : 'text-gray-400'
            }`}
          >
            Portfolio
          </Link>
          <Link
            href="/shop"
            className={`hover:text-white transition-colors ${
              pathname === '/shop' ? 'text-white' : 'text-gray-400'
            }`}
          >
            Shop
          </Link>
          <Link
            href="/ai-tools"
            className={`hover:text-white transition-colors ${
              pathname === '/ai-tools' ? 'text-white' : 'text-gray-400'
            }`}
          >
            AI Tools
          </Link>
          <Link
            href="/about"
            className={`hover:text-white transition-colors ${
              pathname === '/about' ? 'text-white' : 'text-gray-400'
            }`}
          >
            About
          </Link>
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
