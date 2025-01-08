"use client";

import { ConvexProvider } from "convex/react";
import { PropsWithChildren } from "react";
import { convex } from "@/lib/convex";

export default function ConvexClientProvider({
  children,
}: PropsWithChildren) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
