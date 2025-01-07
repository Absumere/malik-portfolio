'use client';

import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import ScrollReset from "@/components/ScrollReset";
import { Toaster } from 'react-hot-toast';
import Footer from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { AuthProvider } from "@/context/AuthContext";
import { Providers } from "@/components/providers/Providers";

export default function RootLayoutClient({
  children,
  inter,
}: {
  children: React.ReactNode;
  inter: any;
}) {
  // Force scroll reset on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <body className={`${inter.className} bg-black text-white min-h-screen`}>
      <AuthProvider>
        <Providers>
          <ScrollReset />
          <div className="relative min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-grow">
              <div className="pt-16">{children}</div>
            </main>
            <Footer />
          </div>
          <Analytics />
          <Toaster position="bottom-right" />
        </Providers>
      </AuthProvider>
    </body>
  );
}
