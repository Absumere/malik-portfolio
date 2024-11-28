'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ClientNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
          MALIK ARBAB
        </Link>
        
        <div className="flex gap-8">
          {[
            { href: '/portfolio', label: 'Portfolio' },
            { href: '/shop', label: 'Shop' },
            { href: '/ai-tools', label: 'AI Tools' },
            { href: '/about', label: 'About' },
          ].map(({ href, label }) => (
            <Link 
              key={href}
              href={href} 
              className={`hover:text-gray-300 transition-colors ${
                pathname === href ? 'text-white' : 'text-gray-400'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
