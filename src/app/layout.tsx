import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./providers";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Malik Arbab - Digital Artist & Creative Developer",
  description: "Portfolio and digital artwork by Malik Arbab",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <ConvexClientProvider>
          <ScrollToTop />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
