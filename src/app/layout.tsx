import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <ClerkProvider
        appearance={{
          baseTheme: "dark",
        }}
      >
        <ConvexClientProvider>
          <RootLayoutClient inter={inter}>{children}</RootLayoutClient>
        </ConvexClientProvider>
      </ClerkProvider>
    </html>
  );
}
