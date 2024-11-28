import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="text-xl font-bold tracking-tight hover:text-gray-300 transition-colors"
          >
            MALIK ARBAB
          </Link>
          
          <div className="flex space-x-8">
            <Link 
              href="/portfolio" 
              className={`${
                isActive('/portfolio') 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-300 hover:text-white'
              } transition-colors`}
            >
              Portfolio
            </Link>
            <Link 
              href="/shop" 
              className={`${
                isActive('/shop') 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-300 hover:text-white'
              } transition-colors`}
            >
              Shop
            </Link>
            <Link 
              href="/ai-tools" 
              className={`${
                isActive('/ai-tools') 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-300 hover:text-white'
              } transition-colors`}
            >
              AI Tools
            </Link>
            <Link 
              href="/about" 
              className={`${
                isActive('/about') 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-300 hover:text-white'
              } transition-colors`}
            >
              About
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
