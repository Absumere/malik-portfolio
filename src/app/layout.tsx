import { Inter } from "next/font/google";
import type { Metadata, Viewport } from 'next';
import "./globals.css";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import { MobileDebug } from "@/components/debug/MobileDebug";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Malik Arbab | Visual Artist & AI Developer",
    template: "%s | Malik Arbab"
  },
  description: "Malik Arbab is a Visual Artist and AI Developer specializing in machine learning, digital art, and creative technology. Explore innovative AI tools and digital art projects.",
  keywords: [
    "Malik Arbab",
    "Visual Artist",
    "AI Artist",
    "Digital Artist",
    "ML Developer",
    "Machine Learning",
    "Creative Technology",
    "AI Tools",
    "Digital Art",
    "Neural Networks",
    "Real-time Graphics",
    "WebGL",
    "Creative Coding",
    "Interactive Art",
    "Berlin Artist",
    "German Developer"
  ],
  creator: "Malik Arbab",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://malikarbab.de",
    title: "Malik Arbab | Visual Artist & AI Developer",
    description: "Explore the intersection of art and artificial intelligence through innovative projects and tools by Malik Arbab.",
    siteName: "Malik Arbab Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Malik Arbab - Visual Artist & AI Developer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Malik Arbab | Visual Artist & AI Developer",
    description: "Explore the intersection of art and artificial intelligence through innovative projects and tools.",
    creator: "@malikarbab",
    images: ["/og-image.jpg"]
  },
  alternates: {
    canonical: "https://malikarbab.de"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
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
          "overscroll-none", // Prevents bounce effect on iOS
          "text-base md:text-lg", // Responsive font size
          "safe-top safe-bottom" // Safe area insets
        )}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <div className="hidden md:block">
              <Navigation />
            </div>
            <div className="md:hidden">
              <MobileNavigation />
            </div>
            <main className="flex-1 pt-16 overflow-x-hidden px-4 md:px-6 lg:px-8">
              {children}
            </main>
            <Footer />
          </div>
          <MobileDebug />
        </Providers>
      </body>
    </html>
  );
}
