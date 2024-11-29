'use client';

import { Twitter, Instagram, Linkedin, Github, Mail } from 'lucide-react';
import Link from 'next/link';
import { ShimmerText } from './ui/ShimmerText';
import { SocialIcon } from './ui/SocialIcon';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="block">
              <ShimmerText text="MALIK ARBAB" className="text-2xl font-bold" />
            </Link>
            <p className="text-sm text-gray-400">
              Visual Artist & Creative Developer
            </p>
            <p className="text-sm text-gray-500">
              Creating digital experiences that inspire
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/portfolio" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/ai-tools" className="text-sm text-gray-400 hover:text-white transition-colors">
                  AI Tools
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Connect</h3>
            <div className="flex space-x-4">
              <SocialIcon href="https://x.com/absumere">
                <Twitter className="w-5 h-5" />
              </SocialIcon>
              <SocialIcon href="https://www.instagram.com/malik.arb">
                <Instagram className="w-5 h-5" />
              </SocialIcon>
              <SocialIcon href="https://github.com/Absumere">
                <Github className="w-5 h-5" />
              </SocialIcon>
              <SocialIcon href="mailto:ai@malikarbab.de">
                <Mail className="w-5 h-5" />
              </SocialIcon>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-center text-sm text-gray-400">
            {new Date().getFullYear()} Malik Arbab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
