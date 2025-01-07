'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { PortfolioGrid } from '@/components/Portfolio/PortfolioGrid';

export default function PortfolioPage() {
  const projects = useQuery(api.portfolio.getAll) || [];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-[1600px] mx-auto">
        <PortfolioGrid projects={projects} />
      </div>
    </main>
  );
}
