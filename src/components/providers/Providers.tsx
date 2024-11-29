'use client';

import { ReactNode } from 'react';
import { PageTransition } from '../PageTransition';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <PageTransition>{children}</PageTransition>
  );
}
