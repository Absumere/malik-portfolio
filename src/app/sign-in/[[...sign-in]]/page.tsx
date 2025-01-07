'use client';

import { SignIn } from "@clerk/nextjs";
import { SpectralWave } from "@/components/UI/SpectralWave";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex justify-center items-center">
      <SpectralWave className="opacity-50" />
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <SignIn 
          appearance={{
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
          }}
        />
      </div>
    </main>
  );
}
