'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const links = [
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/shop', label: 'Shop' },
    { href: '/ai-tools', label: 'AI Tools' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-white hover:text-white/80">
          Malik Arbab
        </Link>

        <nav className="flex gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm ${
                pathname === href
                  ? 'text-white'
                  : 'text-neutral-400 hover:text-white/80'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
