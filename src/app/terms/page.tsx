'use client';

import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TermsOfService() {
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
          <h1 className="text-3xl font-light mb-2 text-white/90">Terms of Service</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-white/60">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p className="hidden sm:block">•</p>
            <p>Version 1.0</p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">1. Agreement to Terms</h2>
            <p className="text-sm leading-relaxed text-white/70">
              By accessing or using malikarbab.de ("the Website"), you agree to be bound by these Terms of Service. 
              If you disagree with any part of these terms, you may not access the Website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">2. Intellectual Property</h2>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-white/70">
                The Website and its original content, features, and functionality are owned by Malik Arbab and are protected by:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-white/70">
                <li>International copyright laws</li>
                <li>Trademark laws</li>
                <li>Other intellectual property rights</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">3. User Accounts</h2>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-white/70">When creating an account, you agree to:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-white/70">
                <li>Provide accurate and complete information</li>
                <li>Maintain and update your information</li>
                <li>Keep your password secure</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">4. AI Tools Usage</h2>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-white/70">
                When using our AI tools and services, you acknowledge:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-white/70">
                <li>Results are provided "as is" without guarantees</li>
                <li>You retain rights to your input data</li>
                <li>We may use anonymized data for improvement</li>
                <li>Usage limits and fair use policies apply</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">5. E-commerce Terms</h2>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-white/70">For purchases made through our Website:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-white/70">
                <li>All prices are in stated currency and may change without notice</li>
                <li>Digital products are non-refundable unless required by law</li>
                <li>Delivery of digital products is immediate upon payment</li>
                <li>EU customers have statutory withdrawal rights</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">6. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed text-white/70">
              To the fullest extent permitted by law, Malik Arbab shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use of the Website 
              or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">7. Changes to Terms</h2>
            <p className="text-sm leading-relaxed text-white/70">
              We reserve the right to modify these terms at any time. Changes will be effective immediately 
              upon posting to the Website. Your continued use of the Website constitutes acceptance of the 
              modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">8. Governing Law</h2>
            <p className="text-sm leading-relaxed text-white/70">
              These terms shall be governed by and construed in accordance with the laws of Germany, 
              without regard to its conflict of law provisions. EU consumer protection laws apply where mandatory.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-light mb-4 text-white/90 border-b border-white/10 pb-2">9. Contact Information</h2>
            <p className="text-sm leading-relaxed text-white/70">
              For any questions about these Terms of Service, please contact us at:{' '}
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
