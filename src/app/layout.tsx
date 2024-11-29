import './globals.css';
import { Inter } from 'next/font/google';
import { ConvexClientProvider } from '@/context/ConvexClientProvider';
import { AuthProvider } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Malik Portfolio',
  description: 'Creative Developer Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black antialiased`}>
        <ConvexClientProvider>
          <AuthProvider>
            <div className="relative min-h-screen flex flex-col">
              {/* Navigation */}
              <Navigation />

              {/* Main Content */}
              <main className="relative flex-grow pt-16">
                <Providers>{children}</Providers>
              </main>

              <Footer />
            </div>
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
