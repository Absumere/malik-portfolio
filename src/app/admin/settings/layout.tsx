'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  ShoppingBagIcon, 
  BeakerIcon, 
  UserIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const tabs = [
  {
    name: 'Landing Page',
    href: '/admin/settings/landing',
    icon: HomeIcon,
  },
  {
    name: 'Portfolio',
    href: '/admin/settings/portfolio',
    icon: BriefcaseIcon,
  },
  {
    name: 'Shop',
    href: '/admin/settings/shop',
    icon: ShoppingBagIcon,
  },
  {
    name: 'AI Tools',
    href: '/admin/settings/ai-tools',
    icon: BeakerIcon,
  },
  {
    name: 'About',
    href: '/admin/settings/about',
    icon: UserIcon,
  },
  {
    name: 'General',
    href: '/admin/settings',
    icon: Cog6ToothIcon,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [saving, setSaving] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <button
            onClick={() => {
              setSaving(true);
              setTimeout(() => setSaving(false), 1000);
            }}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg flex items-center gap-2 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
            <ArrowPathIcon 
              className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} 
            />
            <span>Save All Changes</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-4 max-w-7xl mx-auto">
          <div className="flex gap-1 overflow-x-auto pb-4 scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors relative ${
                    isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white/10 rounded-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <tab.icon className="w-5 h-5" />
                  <span className="relative z-10">{tab.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
