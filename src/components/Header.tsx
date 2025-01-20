'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-white hover:text-white/80 transition-colors">
            <span className="text-lg font-light tracking-tight">Malik Arbab</span>
          </Link>

          <nav className="flex gap-8">
            <Link
              href="/portfolio"
              className={`text-sm ${
                pathname === '/portfolio'
                  ? 'text-white'
                  : 'text-neutral-400 hover:text-white/80'
              }`}
            >
              Portfolio
            </Link>
            <div className="relative group">
              <Link
                href="#"
                className={`text-sm ${
                  pathname === '/ai'
                    ? 'text-white'
                    : 'text-neutral-400 hover:text-white/80'
                }`}
                onClick={(e) => e.preventDefault()}
              >
                AI Tools
              </Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
                <div className="bg-neutral-900 border border-white/10 rounded-lg shadow-xl p-2 min-w-[200px]">
                  <p className="text-xs text-neutral-400 px-3 py-2">
                    Coming soon...
                  </p>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
