'use client';

import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PrivacyPolicy() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-black/50 relative">
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12">
          <h1 className="text-3xl font-light mb-2 text-white/90">Privacy Policy</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-white/60">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p className="hidden sm:block">•</p>
            <p>Version 1.0</p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">1. Introduction</h2>
            <p className="text-sm leading-relaxed text-white/70">
              Welcome to Malik Arbab's portfolio and digital services. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you visit our website malikarbab.de and use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">2. Information We Collect</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium mb-3 text-white/80">2.1 Personal Information</h3>
                <p className="text-sm leading-relaxed text-white/70 mb-2">We may collect personal information that you voluntarily provide, including:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-white/70">
                  <li>Name and email address when you contact us</li>
                  <li>Account information when you create an account</li>
                  <li>Payment information when making purchases</li>
                  <li>Usage data and preferences</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-base font-medium mb-3 text-white/80">2.2 Automatically Collected Information</h3>
                <p className="text-sm leading-relaxed text-white/70 mb-2">When you visit our website, we automatically collect:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-white/70">
                  <li>Device information (browser type, IP address)</li>
                  <li>Usage patterns and preferences</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">3. How We Use Your Information</h2>
            <p className="text-sm leading-relaxed text-white/70">
              We use the collected information for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-white/70">
              <li>Providing and maintaining our services</li>
              <li>Processing your transactions</li>
              <li>Responding to your inquiries</li>
              <li>Improving our services</li>
              <li>Sending you relevant communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">4. Data Protection Rights (GDPR)</h2>
            <p className="text-sm leading-relaxed text-white/70">
              Under GDPR, EU users have the following rights:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-white/70">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">5. Data Security</h2>
            <p className="text-sm leading-relaxed text-white/70">
              We implement appropriate security measures to protect your personal information. However, 
              no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">6. Third-Party Services</h2>
            <p className="text-sm leading-relaxed text-white/70">
              We may use third-party services that collect, monitor, and analyze data. These services 
              have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">7. Children's Privacy</h2>
            <p className="text-sm leading-relaxed text-white/70">
              Our services are not intended for users under 16. We do not knowingly collect information 
              from children under 16.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">8. Changes to Privacy Policy</h2>
            <p className="text-sm leading-relaxed text-white/70">
              We may update this privacy policy from time to time. We will notify you of any changes by 
              posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">9. Contact Information</h2>
            <p className="text-sm leading-relaxed text-white/70">
              For any questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:ai@malikarbab.de" className="text-white/90 hover:text-white transition-colors underline decoration-white/20 hover:decoration-white/40">
                ai@malikarbab.de
              </a>
            </p>
          </section>
        </div>

        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-8 right-8 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
            onClick={scrollToTop}
          >
            <ArrowUp className="w-5 h-5 text-white/80" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
