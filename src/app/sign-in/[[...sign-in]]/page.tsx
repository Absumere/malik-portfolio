'use client';

import { SpectralWave } from '@/components/ui';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="relative w-full max-w-md p-8">
        <SpectralWave className="absolute inset-0 z-0" />
        <div className="relative z-10 bg-black/50 backdrop-blur-xl p-8 rounded-lg border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-6">Sign In</h1>
          <button 
            className="w-full bg-white text-black py-2 px-4 rounded hover:bg-white/90 transition"
            onClick={() => {
              // We'll implement this later
              console.log('Sign in clicked');
            }}
          >
            Continue with Email
          </button>
        </div>
      </div>
    </div>
  );
}
