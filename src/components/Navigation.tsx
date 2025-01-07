'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { GlitchText } from './ui/GlitchText';

const clerkAppearance = {
  baseTheme: "dark",
  elements: {
    rootBox: "mx-auto",
    card: "bg-[#141414] border border-white/10 shadow-2xl",
    headerTitle: "text-white",
    headerSubtitle: "text-neutral-400",
    socialButtonsBlockButton: "bg-[#1a1a1a] border border-white/10 hover:bg-white/10 transition text-white",
    formButtonPrimary: "bg-white text-black hover:bg-white/90 transition",
    footerAction: "text-neutral-400",
    footerActionLink: "text-white hover:text-white/80",
    formFieldInput: "bg-[#1a1a1a] border-white/10 text-white",
    formFieldLabel: "text-neutral-400",
    dividerLine: "bg-white/10",
    dividerText: "text-neutral-400",
    formFieldLabelRow: "text-neutral-400",
    identityPreviewText: "text-white",
    identityPreviewEditButton: "text-neutral-400 hover:text-white",
    otpCodeFieldInput: "bg-[#1a1a1a] border-white/10 text-white",
    formHeaderTitle: "text-white",
    formHeaderSubtitle: "text-neutral-400",
    socialButtonsIconButton: "border-white/10 hover:bg-white/10",
    socialButtonsBlockButtonArrow: "text-white",
    alert: "bg-red-500/10 border border-red-500/20 text-white",
    alertText: "text-white",
    formResendCodeLink: "text-neutral-400 hover:text-white",
    main: "shadow-none",
  },
  layout: {
    socialButtonsPlacement: "bottom",
    socialButtonsVariant: "blockButton",
  },
  variables: {
    colorPrimary: "#ffffff",
    colorText: "#ffffff",
    colorTextSecondary: "#a0a0a0",
    colorBackground: "#141414",
    colorInputBackground: "#1a1a1a",
    colorInputText: "#ffffff",
    colorInputBorder: "rgba(255, 255, 255, 0.1)",
  },
};

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="text-xl">
              <GlitchText text="Malik Arbab" className="text-white font-light tracking-wider" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex items-center space-x-1">
              {[
                { href: '/portfolio', label: 'Portfolio' },
                { href: '/shop', label: 'Shop' },
                { href: '/ai-tools', label: 'AI Tools' },
                { href: '/about', label: 'About' },
              ].map(({ href, label }) => (
                <motion.div
                  key={href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={href}
                    className="relative px-3 py-2 text-sm text-gray-400 transition-colors hover:text-white group"
                  >
                    <span>{label}</span>
                    <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Auth Button */}
            <div className="hidden md:block">
              {user ? (
                <UserButton 
                  appearance={clerkAppearance}
                />
              ) : (
                <SignInButton mode="modal" appearance={clerkAppearance}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded text-sm bg-white text-black hover:bg-white/90 transition"
                  >
                    Sign In
                  </motion.button>
                </SignInButton>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10"
              >
                <span className="sr-only">Open menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/90 backdrop-blur-xl"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {[
                { href: '/portfolio', label: 'Portfolio' },
                { href: '/shop', label: 'Shop' },
                { href: '/ai-tools', label: 'AI Tools' },
                { href: '/about', label: 'About' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block px-3 py-2 text-base text-gray-400 hover:text-white hover:bg-white/10 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {!user && (
                <SignInButton mode="modal" appearance={clerkAppearance}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-4 px-4 py-2 rounded text-sm bg-white text-black hover:bg-white/90 transition"
                  >
                    Sign In
                  </motion.button>
                </SignInButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
