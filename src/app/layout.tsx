import { Inter } from "next/font/google";
import type { Metadata } from 'next';
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Malik Arbab",
  description: "Portfolio and AI Tools",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    minimumScale: 1,
    viewportFit: "cover",
  },
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Malik Arbab",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-black text-white antialiased",
          "selection:bg-purple-500 selection:text-white",
          "touch-manipulation", // Improves touch interactions
          "overscroll-none" // Prevents bounce effect on iOS
        )}
      >
        <ClerkProvider>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1 pt-16 overflow-x-hidden">
              {children}
            </main>
            <Footer />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
