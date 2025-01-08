'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from "@/components/Navigation";
import { Toaster } from 'react-hot-toast';
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Scroll to top on page load and tab change
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    // Scroll on mount and pathname change
    scrollToTop();

    // Add scroll event listener
    window.addEventListener('load', scrollToTop);
    return () => window.removeEventListener('load', scrollToTop);
  }, [pathname]);

  return (
    <AuthProvider>
      <div className="bg-black min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </AuthProvider>
  );
}
