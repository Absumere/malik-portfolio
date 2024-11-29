'use client';

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'OAuthSignin':
        return 'Error starting the sign in process.';
      case 'OAuthCallback':
        return 'Error completing the sign in process.';
      case 'OAuthCreateAccount':
        return 'Could not create user account.';
      case 'EmailCreateAccount':
        return 'Could not create user account.';
      case 'Callback':
        return 'Error during the sign in callback.';
      case 'OAuthAccountNotLinked':
        return 'Email already exists with different provider.';
      case 'EmailSignin':
        return 'Check your email address.';
      case 'CredentialsSignin':
        return 'Sign in failed. Check your credentials.';
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      default:
        return 'An error occurred during authentication.';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-xl text-center"
      >
        <h1 className="text-3xl font-bold mb-4">Authentication Error</h1>
        <p className="text-gray-300 mb-8">
          {error ? getErrorMessage(error) : 'An unknown error occurred.'}
        </p>
        <Link
          href="/auth/signin"
          className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          Try Again
        </Link>
      </motion.div>
    </motion.div>
  );
}
