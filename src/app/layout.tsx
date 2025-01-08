import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import RootLayoutClient from "@/components/RootLayoutClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Malik Arbab",
  description: "Technical Director & Creative Technologist",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white h-screen overflow-auto`}>
        <ConvexClientProvider>
          <RootLayoutClient>{children}</RootLayoutClient>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
